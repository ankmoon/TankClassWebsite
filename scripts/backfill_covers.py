"""
backfill_covers.py
------------------
Cap nhat cover image cho cac bai Notion da migrate ma chua co cover.
Script se:
  1. Lay danh sach tat ca page trong Notion Blog DB
  2. Voi moi page CHUA CO cover → scrape og:image tu Wix
  3. PATCH Notion page de set cover

Chay: python scripts/backfill_covers.py
"""

import os
import sys
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ── Config ────────────────────────────────────────────────────────────────────
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_DB_ID = os.getenv("NOTION_DATABASE_ID")
BASE_VI = "https://www.tankbaclass.com"

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


def get_all_pages_without_cover() -> list[dict]:
    """Lay tat ca pages trong Notion DB, loc ra nhung trang chua co cover."""
    pages = []
    cursor = None

    while True:
        body: dict = {
            "page_size": 100,
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
            print(f"FAIL khi query DB: {resp.status_code} - {resp.text[:200]}")
            break

        data = resp.json()

        for page in data.get("results", []):
            # Chi lay page chua co cover
            if page.get("cover") is None:
                slug = page.get("properties", {}).get("Slug", {}) \
                           .get("rich_text", [{}])[0].get("plain_text", "")
                title_prop = page.get("properties", {}).get("title") or page.get("properties", {}).get("Name", {})
                title = title_prop.get("title", [{}])[0].get("plain_text", "Untitled") if title_prop else "Untitled"
                if slug:
                    pages.append({
                        "id": page["id"],
                        "slug": slug,
                        "title": title,
                    })

        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")

    return pages


def scrape_og_image(slug: str) -> str | None:
    """Lay og:image tu Wix bai viet."""
    url = f"{BASE_VI}/post/{slug}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return None
        soup = BeautifulSoup(resp.text, "html.parser")
        og_img = soup.find("meta", property="og:image")
        if og_img and og_img.get("content"):
            return og_img["content"].strip()
    except Exception as e:
        print(f"    Loi scrape {slug}: {e}")
    return None


def set_notion_cover(page_id: str, image_url: str) -> bool:
    """PATCH Notion page de set cover (external URL)."""
    resp = requests.patch(
        f"https://api.notion.com/v1/pages/{page_id}",
        headers=NOTION_HEADERS,
        json={
            "cover": {
                "type": "external",
                "external": {"url": image_url}
            }
        },
        timeout=15,
    )
    return resp.status_code == 200


def main():
    print("=" * 62)
    print("Backfill Cover Images — TankBAClass Blog")
    print("=" * 62)

    if not NOTION_TOKEN or not NOTION_DB_ID:
        print("FAIL: Thieu NOTION_TOKEN hoac NOTION_DATABASE_ID")
        sys.exit(1)

    print("\nBuoc 1: Tim cac bai chua co cover trong Notion...")
    pages = get_all_pages_without_cover()
    print(f"  Tim thay {len(pages)} bai chua co cover.\n")

    if not pages:
        print("Tat ca bai da co cover roi! Khong can lam gi ca.")
        return

    success, skip, fail = 0, 0, 0

    print("Buoc 2: Scrape og:image va cap nhat Notion...\n")
    for i, page in enumerate(pages, 1):
        print(f"[{i:02d}/{len(pages)}] {page['title'][:55]}")
        print(f"         slug: {page['slug'][:50]}")

        image_url = scrape_og_image(page["slug"])
        time.sleep(0.5)  # Tranh bi rate-limit

        if not image_url:
            print("         SKIP: Khong tim thay og:image")
            skip += 1
            continue

        print(f"         img: {image_url[:70]}")

        ok = set_notion_cover(page["id"], image_url)
        if ok:
            print("         → OK: Da set cover!")
            success += 1
        else:
            print("         → FAIL: Khong the set cover")
            fail += 1

        time.sleep(0.3)

    print("\n" + "=" * 62)
    print(f"Da cap nhat : {success} bai")
    print(f"Bo qua      : {skip} bai (khong co og:image)")
    print(f"That bai    : {fail} bai")
    print("=" * 62)


if __name__ == "__main__":
    main()
