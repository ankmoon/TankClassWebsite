"""
clean_en_blocks.py
------------------
Xoa tat ca blocks VI cu trong EN pages, chi giu content EN.
Script nay lay tat ca EN pages va xoa blocks theo batch nho de tranh timeout.

Ghi chu: Script nay xoa TOAN BO blocks truoc, sau do re-scrape va push blocks EN.
Chay: py scripts/clean_en_blocks.py
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


def get_notion_en_pages() -> list[dict]:
    pages, cursor = [], None
    while True:
        body: dict = {
            "page_size": 100,
            "filter": {"property": "Language", "select": {"equals": "EN"}}
        }
        if cursor:
            body["start_cursor"] = cursor
        resp = requests.post(
            f"https://api.notion.com/v1/databases/{NOTION_DB_ID}/query",
            headers=NOTION_HEADERS, json=body, timeout=30,
        )
        if resp.status_code != 200:
            break
        data = resp.json()
        for page in data.get("results", []):
            props = page.get("properties", {})
            slug_prop = props.get("Slug", {}).get("rich_text", [])
            slug = slug_prop[0].get("plain_text", "") if slug_prop else ""
            title_prop = props.get("title") or props.get("Name", {})
            title = title_prop.get("title", [{}])[0].get("plain_text", "") if title_prop else ""
            pages.append({"id": page["id"], "slug": slug, "title": title})
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
    return pages


def delete_block_with_retry(block_id: str, max_retries: int = 3) -> bool:
    """Xoa 1 block voi retry khi gap loi mang."""
    for attempt in range(max_retries):
        try:
            resp = requests.delete(
                f"https://api.notion.com/v1/blocks/{block_id}",
                headers=NOTION_HEADERS, timeout=20,
            )
            return resp.status_code == 200
        except Exception:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # exponential backoff: 1s, 2s, 4s
            else:
                return False
    return False


def delete_all_blocks(page_id: str) -> int:
    """Xoa tat ca child blocks, tra ve so block da xoa."""
    deleted = 0
    cursor = None
    while True:
        url = f"https://api.notion.com/v1/blocks/{page_id}/children?page_size=100"
        if cursor:
            url += f"&start_cursor={cursor}"
        try:
            resp = requests.get(url, headers=NOTION_HEADERS, timeout=30)
        except Exception:
            time.sleep(3)
            continue
        if resp.status_code != 200:
            break
        data = resp.json()
        blocks = data.get("results", [])
        for block in blocks:
            if delete_block_with_retry(block["id"]):
                deleted += 1
            time.sleep(0.12)  # Giam rate limit
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
    return deleted


def scrape_en_post(en_slug: str) -> dict:
    url = f"{BASE_EN}/en/post/{en_slug}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        if resp.status_code != 200:
            return {"ok": False}
    except Exception:
        return {"ok": False}

    soup = BeautifulSoup(resp.text, "html.parser")
    h1 = soup.find("h1")
    title = h1.get_text(strip=True) if h1 else ""

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
        for tag in content_el.find_all(["h1","h2","h3","h4","p","li","blockquote"], recursive=True):
            text = tag.get_text(strip=True)
            if not text:
                continue
            name = tag.name
            if name == "h1": kind = "heading_1"
            elif name == "h2": kind = "heading_2"
            elif name in ("h3","h4"): kind = "heading_3"
            elif name == "li": kind = "bulleted_list_item"
            elif name == "blockquote": kind = "quote"
            else: kind = "paragraph"
            structured.append((kind, text))
    return {"ok": True, "title": title, "structured": structured}


def push_blocks(page_id: str, structured: list) -> bool:
    def make_block(text: str, kind: str = "paragraph") -> dict:
        supported = {
            "paragraph", "heading_1", "heading_2", "heading_3",
            "bulleted_list_item", "numbered_list_item", "quote", "callout"
        }
        if kind not in supported:
            kind = "paragraph"
        return {
            "object": "block", "type": kind,
            kind: {"rich_text": [{"type": "text", "text": {"content": text[:2000]}}]}
        }
    blocks = [make_block(t, k) for k, t in structured if t][:90]
    if not blocks:
        return True
    resp = requests.patch(
        f"https://api.notion.com/v1/blocks/{page_id}/children",
        headers=NOTION_HEADERS,
        json={"children": blocks[:100]},
        timeout=30,
    )
    return resp.status_code == 200


def main():
    print("=" * 62)
    print("Clean EN Pages — Xoa VI blocks, push lai chi EN content")
    print("=" * 62)

    with open(EN_SLUGS_FILE, "r", encoding="utf-8") as f:
        en_slugs: list[str] = json.load(f)

    print(f"\nLay EN pages tu Notion...")
    notion_en_pages = get_notion_en_pages()
    print(f"Tim thay {len(notion_en_pages)} EN pages.\n")

    ok = fail = skip = 0

    for i, en_slug in enumerate(en_slugs, 1):
        decoded = unquote(en_slug)
        print(f"[{i:02d}/{len(en_slugs)}] {decoded[:55]}")

        if i - 1 >= len(notion_en_pages):
            print("    SKIP: Khong co Notion page tuong ung")
            skip += 1
            continue

        page = notion_en_pages[i - 1]
        page_id = page["id"]

        # Scrape EN truoc
        scraped = scrape_en_post(en_slug)
        time.sleep(0.5)

        if not scraped.get("ok") or not scraped.get("structured"):
            print(f"    SKIP: Khong scrape duoc")
            skip += 1
            continue

        # Xoa blocks cu
        print(f"    Dang xoa blocks cu...", end=" ", flush=True)
        deleted = delete_all_blocks(page_id)
        print(f"{deleted} blocks da xoa.")
        time.sleep(0.3)

        # Push blocks EN moi
        if push_blocks(page_id, scraped["structured"]):
            print(f"    OK: '{scraped['title'][:50]}'")
            ok += 1
        else:
            print(f"    FAIL: Push blocks that bai")
            fail += 1
        time.sleep(0.4)

    print("\n" + "=" * 62)
    print(f"OK     : {ok}")
    print(f"Skip   : {skip}")
    print(f"Fail   : {fail}")
    print("=" * 62)


if __name__ == "__main__":
    main()
