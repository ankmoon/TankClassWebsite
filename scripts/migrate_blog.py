"""
migrate_blog.py - v3
---------------------
Crawl bai viet tu tankbaclass.com va day len Notion Database.
- Dung Wix Blog API de lay danh sach slug chinh xac (co ky tu Unicode)
- Day vao Notion voi fields: Title_en, Slug, Language

Chay: python scripts/migrate_blog.py
"""

import os
import re
import sys
import time
import json
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ── Config ────────────────────────────────────────────────────────────────────
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_DB_ID = os.getenv("NOTION_DATABASE_ID")
BASE_VI      = "https://www.tankbaclass.com"
BASE_EN      = "https://www.tankbaclass.com/en"

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


# ── 1. Lay danh sach slug qua Wix Blog Feed ───────────────────────────────────
def get_slugs_via_feed():
    """
    Thu Wix Blog RSS/Feed de lay slug thuc su (co Unicode).
    Neu khong duoc thi load tu file slugs.json.
    """
    slugs = []

    # Uu tien: load tu file slugs.json (slug Unicode chinh xac)
    slugs_file = os.path.join(os.path.dirname(__file__), "slugs.json")
    if os.path.exists(slugs_file):
        with open(slugs_file, "r", encoding="utf-8") as f:
            slugs = json.load(f)
        print(f"  JSON file: Loaded {len(slugs)} slugs")
        return slugs

    # Fallback: Thu RSS feed
    feed_url = f"{BASE_VI}/blog-feed.xml"
    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "xml")
            items = soup.find_all("item")
            for item in items:
                link = item.find("link")
                if link and "/post/" in link.text:
                    slug = link.text.split("/post/")[-1].rstrip("/")
                    if slug and slug not in slugs:
                        slugs.append(slug)
            if slugs:
                print(f"  RSS: Tim duoc {len(slugs)} bai tu feed")
                return slugs
    except Exception as e:
        print(f"  RSS that bai: {e}")

    # Thu sitemap.xml
    sitemap_url = f"{BASE_VI}/sitemap.xml"
    try:
        resp = requests.get(sitemap_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "xml")
            locs = soup.find_all("loc")
            for loc in locs:
                url = loc.text.strip()
                # Chi lay URL tieng Viet (khong co /en/)
                if "/post/" in url and "/en/" not in url:
                    slug = url.split("/post/")[-1].rstrip("/")
                    if slug and slug not in slugs:
                        slugs.append(slug)
            if slugs:
                print(f"  Sitemap: Tim duoc {len(slugs)} bai")
                return slugs
    except Exception as e:
        print(f"  Sitemap that bai: {e}")

    return []


# ── 2. Scrape noi dung mot bai ────────────────────────────────────────────────
def scrape_post(url):
    """Lay title, cover image va content co dinh dang tu URL bai viet Wix."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 404:
            return {"title": "", "content": "", "cover": None, "not_found": True}
        if resp.status_code != 200:
            return {"title": "", "content": "", "cover": None, "error": str(resp.status_code)}
    except Exception as e:
        return {"title": "", "content": "", "cover": None, "error": str(e)}

    soup = BeautifulSoup(resp.text, "html.parser")

    # Title: uu tien Open Graph
    og = soup.find("meta", property="og:title")
    title = og["content"].strip() if og and og.get("content") else ""
    if not title:
        h1 = soup.find("h1")
        title = h1.get_text(strip=True) if h1 else "Untitled"

    # Cover image: lay tu og:image
    cover_url = None
    og_img = soup.find("meta", property="og:image")
    if og_img and og_img.get("content"):
        cover_url = og_img["content"].strip()

    # Tim link alternate de biet slug EN chinh xac
    en_slug_hint = None
    en_link = soup.find("link", attrs={"hreflang": "en"})
    if en_link and en_link.get("href"):
        href = en_link["href"]
        if "/post/" in href:
            en_slug_hint = href.split("/post/")[-1].rstrip("/")

    # Remove nav/header/footer
    for tag in soup(["nav", "header", "footer", "script", "style", "noscript"]):
        tag.decompose()

    content_el = (
        soup.find("article")
        or soup.find(attrs={"data-hook": "post-content"})
        or soup.find(class_=re.compile(r"post-content|rich-content|blog-post", re.I))
        or soup.find("main")
    )

    # Extract structured content: danh dau heading theo HTML tag thuc su
    structured_lines = []
    if content_el:
        for tag in content_el.find_all(["h1", "h2", "h3", "h4", "p", "li", "blockquote"], recursive=True):
            text = tag.get_text(strip=True)
            if not text:
                continue
            tag_name = tag.name
            if tag_name == "h1":
                structured_lines.append(("heading_1", text))
            elif tag_name == "h2":
                structured_lines.append(("heading_2", text))
            elif tag_name in ("h3", "h4"):
                structured_lines.append(("heading_3", text))
            elif tag_name == "li":
                structured_lines.append(("bulleted_list_item", text))
            elif tag_name == "blockquote":
                structured_lines.append(("quote", text))
            else:
                structured_lines.append(("paragraph", text))

    return {
        "title": title,
        "cover": cover_url,
        "structured": structured_lines,
        "en_slug_hint": en_slug_hint
    }


# ── 3. Push 1 page don ngu len Notion ────────────────────────────────────────
def push_single_page(slug: str, data: dict, language: str) -> bool:
    """
    Tao MOT Notion page cho MOT ngon ngu.
    language: "VI" hoac "EN"
    data: ket qua tu scrape_post() (title, cover, structured, en_slug_hint)
    slug: slug dung de query bai viet tu website
    """
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

    def structured_to_blocks(lines: list, max_b: int = 90) -> list:
        blocks = []
        for kind, text in lines:
            if not text or len(blocks) >= max_b:
                break
            blocks.append(make_block(text, kind))
        return blocks

    title = (data.get("title") or slug)[:200]
    cover_url = data.get("cover")
    blocks = structured_to_blocks(data.get("structured", []))

    payload = {
        "parent": {"database_id": NOTION_DB_ID},
        "properties": {
            "title": {"title": [{"text": {"content": title}}]},
            "Slug":  {"rich_text": [{"text": {"content": slug[:200]}}]},
            "Language": {"select": {"name": language}},
            "Status":   {"select": {"name": "Published"}},
        },
        "children": blocks[:100],
    }

    if cover_url:
        payload["cover"] = {"type": "external", "external": {"url": cover_url}}

    resp = requests.post(
        "https://api.notion.com/v1/pages",
        headers=NOTION_HEADERS,
        json=payload,
        timeout=30,
    )

    lang_tag = f"[{language}]"
    if resp.status_code == 200:
        cover_tag = "(img)" if cover_url else "(no img)"
        print(f"    {lang_tag} OK {cover_tag}: {title[:50]}")
        return True
    else:
        err = resp.json()
        print(f"    {lang_tag} FAIL [{resp.status_code}]: {title[:45]}")
        print("         " + err.get("message", "")[:120])
        return False


# ── 4. Main ───────────────────────────────────────────────────────────────────
def main():
    print("=" * 62)
    print("TankBAClass -> Notion CMS Migration v4 (Bilingual)")
    print("Database: " + str(NOTION_DB_ID))
    print("=" * 62)

    if not NOTION_TOKEN or not NOTION_DB_ID:
        print("FAIL: Thieu NOTION_TOKEN hoac NOTION_DATABASE_ID")
        sys.exit(1)

    print("\nBuoc 1: Lay danh sach slug...")
    slugs = get_slugs_via_feed()

    if not slugs:
        print("FAIL: Khong lay duoc slug nao!")
        sys.exit(1)

    print(f"\nBuoc 2: Crawl + push {len(slugs)} bai (x2 ngon ngu)...\n")
    success_vi = success_en = skip = fail = 0

    for i, slug in enumerate(slugs, 1):
        print(f"[{i:02d}/{len(slugs)}] {slug[:55]}")

        # ── Scrape VI ──────────────────────────────────────────────────────────
        vi_data = scrape_post(BASE_VI + "/post/" + slug)
        time.sleep(0.5)

        if vi_data.get("not_found"):
            print("    SKIP: 404 VI")
            skip += 1
            continue

        # ── Scrape EN ──────────────────────────────────────────────────────────
        en_slug = vi_data.get("en_slug_hint") or slug
        en_data = scrape_post(BASE_EN + "/post/" + en_slug)
        time.sleep(0.5)

        # Fallback cover: lay tu bai kia neu bai nay khong co
        shared_cover = vi_data.get("cover") or en_data.get("cover")
        if not vi_data.get("cover"):
            vi_data["cover"] = shared_cover
        if not en_data.get("cover"):
            en_data["cover"] = shared_cover

        # ── Push VI page ───────────────────────────────────────────────────────
        if push_single_page(slug, vi_data, "VI"):
            success_vi += 1
        else:
            fail += 1
        time.sleep(0.4)

        # ── Push EN page (dung slug EN neu co) ────────────────────────────────
        en_page_slug = en_slug  # slug de query tren website /en/blog/{slug}
        if push_single_page(en_page_slug, en_data, "EN"):
            success_en += 1
        else:
            fail += 1
        time.sleep(0.5)

    print("\n" + "=" * 62)
    print(f"VI thanh cong : {success_vi}")
    print(f"EN thanh cong : {success_en}")
    print(f"Bo qua        : {skip}")
    print(f"That bai      : {fail}")
    print("=" * 62)


if __name__ == "__main__":
    main()
