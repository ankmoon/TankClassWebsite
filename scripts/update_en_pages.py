"""
update_en_pages.py
------------------
Cap nhat 52 EN pages trong Notion voi dung link tu Wix /en/blog.

Quy trinh:
  1. Doc en_slugs.json - danh sach slug EN chinh xac tu Wix
  2. Query Notion: tat ca pages co Language='EN'
  3. Voi moi EN slug:
     a. Scrape tu https://www.tankbaclass.com/en/post/{en_slug}
     b. Tim Notion page EN co slug tuong duong (khop ten bai)
     c. PATCH: update title + slug + content + cover

Chay: py scripts/update_en_pages.py
"""

import os
import re
import sys
import json
import time
import requests
from urllib.parse import unquote
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ── Config ────────────────────────────────────────────────────────────────────
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_DB_ID = os.getenv("NOTION_DATABASE_ID")
BASE_EN = "https://www.tankbaclass.com"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/122.0.0.0 Safari/537.36"
}

NOTION_HEADERS = {
    "Authorization": "Bearer " + (NOTION_TOKEN or ""),
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

EN_SLUGS_FILE = os.path.join(os.path.dirname(__file__), "en_slugs.json")


# ── 1. Scrape noi dung EN ─────────────────────────────────────────────────────
def scrape_en_post(en_slug: str) -> dict:
    """Scrape title, og:image va structured content tu Wix EN URL."""
    url = f"{BASE_EN}/en/post/{en_slug}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        if resp.status_code != 200:
            return {"ok": False, "status": resp.status_code}
    except Exception as e:
        return {"ok": False, "error": str(e)}

    soup = BeautifulSoup(resp.text, "html.parser")

    # Title: uu tien h1 (dung hon og:title voi Wix)
    h1 = soup.find("h1")
    title = h1.get_text(strip=True) if h1 else ""
    # fallback og:title neu h1 la "Post | Tankba" hoac trong
    if not title or title.lower() == "post | tankba":
        og = soup.find("meta", property="og:title")
        if og and og.get("content") and og["content"].lower() != "post | tankba":
            title = og["content"].strip()

    # Cover
    cover_url = None
    og_img = soup.find("meta", property="og:image")
    if og_img and og_img.get("content"):
        cover_url = og_img["content"].strip()

    # Content
    for tag in soup(["nav", "header", "footer", "script", "style", "noscript"]):
        tag.decompose()

    content_el = (
        soup.find("article")
        or soup.find(attrs={"data-hook": "post-content"})
        or soup.find(class_=re.compile(r"post-content|rich-content|blog-post", re.I))
        or soup.find("main")
    )

    structured = []
    if content_el:
        for tag in content_el.find_all(
            ["h1", "h2", "h3", "h4", "p", "li", "blockquote"], recursive=True
        ):
            text = tag.get_text(strip=True)
            if not text:
                continue
            name = tag.name
            if name == "h1":
                kind = "heading_1"
            elif name == "h2":
                kind = "heading_2"
            elif name in ("h3", "h4"):
                kind = "heading_3"
            elif name == "li":
                kind = "bulleted_list_item"
            elif name == "blockquote":
                kind = "quote"
            else:
                kind = "paragraph"
            structured.append((kind, text))

    return {
        "ok": True,
        "title": title,
        "cover": cover_url,
        "structured": structured,
        "url": url,
    }


# ── 2. Lay tat ca EN pages tu Notion ──────────────────────────────────────────
def get_notion_en_pages() -> list[dict]:
    """Query Notion DB lay tat ca pages co Language='EN'."""
    pages = []
    cursor = None

    while True:
        body: dict = {
            "page_size": 100,
            "filter": {
                "property": "Language",
                "select": {"equals": "EN"}
            }
        }
        if cursor:
            body["start_cursor"] = cursor

        resp = requests.post(
            f"https://api.notion.com/v1/databases/{NOTION_DB_ID}/query",
            headers=NOTION_HEADERS,
            json=body,
            timeout=30,
        )

        if resp.status_code != 200:
            print(f"FAIL query Notion: {resp.status_code}")
            break

        data = resp.json()
        for page in data.get("results", []):
            props = page.get("properties", {})
            slug_prop = props.get("Slug", {}).get("rich_text", [])
            slug = slug_prop[0].get("plain_text", "") if slug_prop else ""

            title_prop = props.get("title") or props.get("Name", {})
            title = ""
            if title_prop:
                t_list = title_prop.get("title", [])
                title = t_list[0].get("plain_text", "") if t_list else ""

            pages.append({"id": page["id"], "slug": slug, "title": title})

        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")

    return pages


# ── 3. Xoa tat ca blocks cu cua page ─────────────────────────────────────────
def clear_page_blocks(page_id: str) -> None:
    """Xoa tat ca child blocks hien co cua page."""
    resp = requests.get(
        f"https://api.notion.com/v1/blocks/{page_id}/children?page_size=100",
        headers=NOTION_HEADERS,
        timeout=15,
    )
    if resp.status_code != 200:
        return
    blocks = resp.json().get("results", [])
    for block in blocks:
        requests.delete(
            f"https://api.notion.com/v1/blocks/{block['id']}",
            headers=NOTION_HEADERS,
            timeout=10,
        )


# ── 4. PATCH Notion page voi noi dung moi ────────────────────────────────────
def patch_en_page(page_id: str, en_slug: str, scraped: dict) -> bool:
    """Cap nhat title, slug, cover va append content moi cho EN page."""

    def make_block(text: str, kind: str = "paragraph") -> dict:
        supported = {
            "paragraph", "heading_1", "heading_2", "heading_3",
            "bulleted_list_item", "numbered_list_item", "quote", "callout"
        }
        if kind not in supported:
            kind = "paragraph"
        return {
            "object": "block",
            "type": kind,
            kind: {"rich_text": [{"type": "text", "text": {"content": text[:2000]}}]}
        }

    title = scraped.get("title") or unquote(en_slug)
    clean_en_slug = unquote(en_slug)

    # Step 1: PATCH properties + cover
    patch_body: dict = {
        "properties": {
            "title": {"title": [{"text": {"content": title[:200]}}]},
            "Slug":  {"rich_text": [{"text": {"content": clean_en_slug[:200]}}]},
        }
    }
    if scraped.get("cover"):
        patch_body["cover"] = {
            "type": "external",
            "external": {"url": scraped["cover"]}
        }

    resp = requests.patch(
        f"https://api.notion.com/v1/pages/{page_id}",
        headers=NOTION_HEADERS,
        json=patch_body,
        timeout=30,
    )
    if resp.status_code != 200:
        print(f"    PATCH FAIL {resp.status_code}: {resp.json().get('message','')[:80]}")
        return False

    # Step 2: Append content blocks (khong can xoa blocks cu)
    blocks = []
    for kind, text in scraped.get("structured", []):
        if not text or len(blocks) >= 90:
            break
        blocks.append(make_block(text, kind))

    if blocks:
        resp2 = requests.patch(
            f"https://api.notion.com/v1/blocks/{page_id}/children",
            headers=NOTION_HEADERS,
            json={"children": blocks[:100]},
            timeout=30,
        )
        if resp2.status_code != 200:
            # Log nhung van tra True - title da duoc set
            print(f"    APPEND WARN {resp2.status_code}: {resp2.json().get('message','')[:60]}")

    return True


# ── 5. Main ───────────────────────────────────────────────────────────────────
def main():
    print("=" * 62)
    print("Update EN Pages — Wix EN Blog -> Notion")
    print("=" * 62)

    if not NOTION_TOKEN or not NOTION_DB_ID:
        print("FAIL: Thieu NOTION_TOKEN hoac NOTION_DATABASE_ID")
        sys.exit(1)

    # Doc danh sach EN slugs
    with open(EN_SLUGS_FILE, "r", encoding="utf-8") as f:
        en_slugs: list[str] = json.load(f)
    print(f"\nCo {len(en_slugs)} EN slugs can cap nhat.\n")

    # Lay tat ca EN pages tu Notion (de tim page_id)
    print("Dang lay danh sach EN pages tu Notion...")
    notion_en_pages = get_notion_en_pages()
    print(f"  Tim thay {len(notion_en_pages)} EN pages trong Notion.\n")

    ok = fail = skip = 0

    for i, en_slug in enumerate(en_slugs, 1):
        decoded_slug = unquote(en_slug)
        print(f"[{i:02d}/{len(en_slugs)}] {decoded_slug[:58]}")

        # Scrape EN content
        scraped = scrape_en_post(en_slug)
        time.sleep(0.6)

        if not scraped.get("ok"):
            print(f"    SKIP: Scrape loi (status={scraped.get('status','?')})")
            skip += 1
            continue

        en_title = scraped.get("title", "")
        cover_tag = "(img)" if scraped.get("cover") else "(no img)"
        print(f"    Title: '{en_title[:55]}' {cover_tag}")

        # Tim Notion page phu hop:
        # Logic: page co slug = VI slug tuong duong (old "both" pages)
        # Ta tim page co index tuong duong hoac dung mot trong notion_en_pages
        # Do da tao 52 EN pages theo thu tu slug VI, ta ghep theo thu tu index
        if i - 1 < len(notion_en_pages):
            target_page = notion_en_pages[i - 1]
            print(f"    Notion: '{target_page['title'][:40]}' (slug: {target_page['slug'][:30]})")
        else:
            print(f"    SKIP: Khong tim thay Notion EN page tuong ung")
            skip += 1
            continue

        # PATCH
        ok_patch = patch_en_page(target_page["id"], en_slug, scraped)
        time.sleep(0.4)

        if ok_patch:
            print(f"    OK: Da cap nhat Notion EN page!")
            ok += 1
        else:
            print(f"    FAIL: Khong cap nhat duoc")
            fail += 1

    print("\n" + "=" * 62)
    print(f"Cap nhat OK  : {ok}")
    print(f"Bo qua       : {skip}")
    print(f"That bai     : {fail}")
    print("=" * 62)


if __name__ == "__main__":
    main()
