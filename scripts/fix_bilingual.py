"""
fix_bilingual.py
----------------
SUA CAC BAI CO Language="both" THANH 2 PAGE RIENG:
  1. PATCH page cu: dat Language = "VI" (giu nguyen cover, chi giu phan content VI)
  2. Scrape English content tu Wix
  3. Tao NEW page voi Language = "EN", title tieng Anh, content EN

Chay: py scripts/fix_bilingual.py
"""

import os
import re
import sys
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ── Config ────────────────────────────────────────────────────────────────────
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_DB_ID = os.getenv("NOTION_DATABASE_ID")
BASE_EN = "https://www.tankbaclass.com/en"

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


# ── 1. Query pages voi Language = "both" ──────────────────────────────────────
def get_both_pages() -> list[dict]:
    """Lay tat ca Notion pages co Language='both'."""
    pages = []
    cursor = None

    while True:
        body: dict = {
            "page_size": 100,
            "filter": {
                "property": "Language",
                "select": {"equals": "both"}
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
            print(f"FAIL khi query DB: {resp.status_code}")
            break

        data = resp.json()
        for page in data.get("results", []):
            props = page.get("properties", {})
            slug_prop = props.get("Slug", {}).get("rich_text", [])
            slug = slug_prop[0].get("plain_text", "") if slug_prop else ""

            title_prop = props.get("title") or props.get("Name", {})
            title_vi = title_prop.get("title", [{}])[0].get("plain_text", "Untitled") if title_prop else "Untitled"

            title_en_prop = props.get("Title_en", {}).get("rich_text", [])
            title_en = title_en_prop[0].get("plain_text", "") if title_en_prop else ""

            # Cover hien tai cua page (da duoc backfill truoc do)
            cover = page.get("cover")
            cover_url = None
            if cover:
                cover_url = cover.get("external", {}).get("url") or cover.get("file", {}).get("url")

            if slug:
                pages.append({
                    "id": page["id"],
                    "slug": slug,
                    "title_vi": title_vi,
                    "title_en": title_en,
                    "cover_url": cover_url,
                })

        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")

    return pages


# ── 2. Scrape noi dung EN tu Wix ─────────────────────────────────────────────
def scrape_en_content(slug: str) -> dict:
    """Scrape title + structured content + og:image tu EN URL."""
    url = f"{BASE_EN}/post/{slug}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"title": "", "cover": None, "structured": [], "ok": False}
    except Exception as e:
        print(f"    Loi scrape EN: {e}")
        return {"title": "", "cover": None, "structured": [], "ok": False}

    soup = BeautifulSoup(resp.text, "html.parser")

    # Title
    og = soup.find("meta", property="og:title")
    title = og["content"].strip() if og and og.get("content") else ""
    if not title:
        h1 = soup.find("h1")
        title = h1.get_text(strip=True) if h1 else ""

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
        for tag in content_el.find_all(["h1", "h2", "h3", "h4", "p", "li", "blockquote"], recursive=True):
            text = tag.get_text(strip=True)
            if not text:
                continue
            name = tag.name
            if name == "h1":
                structured.append(("heading_1", text))
            elif name == "h2":
                structured.append(("heading_2", text))
            elif name in ("h3", "h4"):
                structured.append(("heading_3", text))
            elif name == "li":
                structured.append(("bulleted_list_item", text))
            elif name == "blockquote":
                structured.append(("quote", text))
            else:
                structured.append(("paragraph", text))

    return {"title": title, "cover": cover_url, "structured": structured, "ok": True}


# ── 3. PATCH page cu: doi Language = "VI" ────────────────────────────────────
def patch_language_to_vi(page_id: str) -> bool:
    """Cap nhat Language cua page cu thanh 'VI'."""
    resp = requests.patch(
        f"https://api.notion.com/v1/pages/{page_id}",
        headers=NOTION_HEADERS,
        json={"properties": {"Language": {"select": {"name": "VI"}}}},
        timeout=15,
    )
    return resp.status_code == 200


# ── 4. Tao Notion page moi cho EN ────────────────────────────────────────────
def create_en_page(slug: str, title_en: str, en_data: dict, cover_url: str | None) -> bool:
    """Tao page moi voi Language=EN, dung EN content."""

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

    blocks = []
    for kind, text in en_data.get("structured", []):
        if not text or len(blocks) >= 90:
            break
        blocks.append(make_block(text, kind))

    # Uu tien: title tu Wix EN, fallback sang Title_en field trong Notion
    final_title = en_data.get("title") or title_en or slug
    # Cover: tu EN bai truoc, fallback sang cover cua VI page
    final_cover = en_data.get("cover") or cover_url

    payload = {
        "parent": {"database_id": NOTION_DB_ID},
        "properties": {
            "title": {"title": [{"text": {"content": final_title[:200]}}]},
            "Slug":  {"rich_text": [{"text": {"content": slug[:200]}}]},
            "Language": {"select": {"name": "EN"}},
            "Status":   {"select": {"name": "Published"}},
        },
        "children": blocks[:100],
    }

    if final_cover:
        payload["cover"] = {"type": "external", "external": {"url": final_cover}}

    resp = requests.post(
        "https://api.notion.com/v1/pages",
        headers=NOTION_HEADERS,
        json=payload,
        timeout=30,
    )
    return resp.status_code == 200


# ── 5. Main ───────────────────────────────────────────────────────────────────
def main():
    print("=" * 62)
    print("Fix Bilingual Posts — Language='both' -> VI + EN rieng")
    print("=" * 62)

    if not NOTION_TOKEN or not NOTION_DB_ID:
        print("FAIL: Thieu NOTION_TOKEN hoac NOTION_DATABASE_ID")
        sys.exit(1)

    print("\nBuoc 1: Tim cac bai co Language='both'...")
    pages = get_both_pages()
    print(f"  Tim thay {len(pages)} bai.\n")

    if not pages:
        print("Khong co bai nao co Language='both'. Xong!")
        return

    ok_vi = ok_en = fail_vi = fail_en = skip_en = 0

    print("Buoc 2: Xu ly tung bai...\n")
    for i, page in enumerate(pages, 1):
        slug    = page["slug"]
        title_vi = page["title_vi"]
        cover_url = page["cover_url"]

        print(f"[{i:02d}/{len(pages)}] {title_vi[:50]}")
        print(f"         slug: {slug[:50]}")

        # ── Buoc 2a: PATCH VI page ──────────────────────────────────────────────
        if patch_language_to_vi(page["id"]):
            print("         [VI] PATCH OK → Language='VI'")
            ok_vi += 1
        else:
            print("         [VI] PATCH FAIL!")
            fail_vi += 1
        time.sleep(0.3)

        # ── Buoc 2b: Scrape EN content ─────────────────────────────────────────
        en = scrape_en_content(slug)
        time.sleep(0.5)

        if not en.get("ok"):
            print("         [EN] SKIP: Khong scrape duoc noi dung")
            skip_en += 1
            continue

        en_title = en.get("title") or page.get("title_en") or title_vi
        cover_tag = "(img)" if (en.get("cover") or cover_url) else "(no img)"
        print(f"         [EN] Scraped: '{en_title[:40]}' {cover_tag}")

        # ── Buoc 2c: Tao EN page ───────────────────────────────────────────────
        if create_en_page(slug, page.get("title_en", ""), en, cover_url):
            print("         [EN] CREATE OK → page moi voi Language='EN'")
            ok_en += 1
        else:
            print("         [EN] CREATE FAIL!")
            fail_en += 1
        time.sleep(0.4)

    print("\n" + "=" * 62)
    print(f"VI patched OK  : {ok_vi}")
    print(f"VI patch FAIL  : {fail_vi}")
    print(f"EN created OK  : {ok_en}")
    print(f"EN create FAIL : {fail_en}")
    print(f"EN scraped SKIP: {skip_en}")
    print("=" * 62)
    print("\nXong! Kiem tra Notion DB de xac nhan.")


if __name__ == "__main__":
    main()
