"""
build_resource_map.py
─────────────────────────────────────────────────────────────────────────────
Fetches all LaLiga player cards from the futmind API, then fuzzy-matches
them against player names in the PostgreSQL database.

Output: ../frontend/src/data/playerResourceIds.json
  { "DB Player Name": resourceId, ... }

The frontend uses this to build CDN image URLs on-the-fly:
  https://card-image.futmind.com/en/26/{resourceId}.png

Run:
    python build_resource_map.py
─────────────────────────────────────────────────────────────────────────────
"""

import re
import json
import unicodedata
import urllib.request
import psycopg2
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ── Config ─────────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host":     "localhost",
    "port":     5432,
    "dbname":   "laliga_fantasy",
    "user":     "postgres",
    "password": "kietho0811",
}

LALIGA_ID   = 53
API_URL     = "https://futmind.com/api/players?leagues=53&page={}"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__),
                           "..", "frontend", "src", "data", "playerResourceIds.json")

# ── Manual overrides ───────────────────────────────────────────────────────
# DB player name → futmind nameClean  (for cases fuzzy match fails)
MANUAL_OVERRIDES = {
    "Vinicius Júnior":          "vini jr.",
    "Luka Modrić":              "luka modric",     # may not be in league filter
    "Saúl Ñíguez":              "saul niguez",
    "Fermin López":             "fermin",
    "Brahim Díaz":              "brahim",
    "Alejandro Balde":          "balde",
    "Alejandro Francés":        "frances",
    "Óscar Mingueza":           "mingueza",
    "Iñigo Lekue":              "lekue",
    "Oihan Sancet":             "sancet",
    "Gorka Guruzeta":           "guruzeta",
    "Mikel Oyarzabal":          "oyarzabal",
    "Mikel Vesga":              "vesga",
    "Mikel Jauregizar":         "jauregizar",
    "Ayoze Pérez":              "ayoze",
    "Rodrigo Riquelme":         "riquelme",
    "Óscar de Marcos":          "de marcos",
    "Daniel Parejo":            "parejo",
    "José Luis Gayà":           "gaya",
    "Dani Carvajal":            "carvajal",
    "Daniel Vivian":            "vivian",
    "Jorge de Frutos":          "de_frutos",
    "Antonio Raillo":           "raillo",
    "Iñigo Ruiz de Galarreta":  "ruiz de galarreta",
    "Antonio Sivera":           "sivera",
    "Martín Zubimendi":         "zubeldia",        # fallback if not found
}


# ── Helpers ────────────────────────────────────────────────────────────────

def normalize(text: str) -> str:
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]", "", text)
    return text

def token_set(name: str) -> set:
    parts = re.sub(r"[^a-z0-9 ]", " ", normalize(name)).split()
    return set(p for p in parts if len(p) > 1)   # skip 1-char noise

def match_score(db_name: str, card_name: str) -> float:
    db_n   = normalize(db_name)
    card_n = normalize(card_name)
    if db_n == card_n:
        return 1.0

    db_tok   = token_set(db_name)
    card_tok = token_set(card_name)
    if not db_tok or not card_tok:
        return 0.0

    inter = db_tok & card_tok
    if not inter:
        # substring check: "oyarzabal" inside "mikel oyarzabal"
        if card_n in db_n or db_n in card_n:
            return 0.55
        return 0.0

    score = len(inter) / max(len(db_tok), len(card_tok))
    for tok in inter:
        if len(tok) > 4:
            score += 0.4
            break
    if card_n in db_n or db_n in card_n:
        score += 0.3
    return min(score, 1.0)


# ── Fetch all LaLiga cards from futmind ────────────────────────────────────

def fetch_laliga_cards():
    """Return list of {name, resourceId, rating} for every LaLiga card."""
    print("Pass 1: Fetching LaLiga cards from futmind API (leagues=53)...")
    cards = []
    page, last_page = 1, 1

    while page <= last_page:
        url = API_URL.format(page)
        try:
            req  = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=15)
            data = json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            print(f"  Warning: page {page} failed — {e}")
            page += 1
            continue

        if page == 1:
            last_page = data.get("last_page", 1)
            print(f"  {data.get('total', '?')} total cards across {last_page} pages")

        for p in data.get("data", []):
            name = p.get("nameClean") or p.get("fullnameClean") or ""
            rid  = p.get("resourceId")
            if name and rid:
                cards.append({
                    "name":       name,
                    "resourceId": rid,
                    "rating":     p.get("rating", 0),
                    "assetId":    p.get("assetId"),
                })
        print(f"  Page {page}/{last_page} — {len(cards)} cards so far", end="\r")
        page += 1

    print(f"\nFetched {len(cards)} total card entries")
    return cards


def fetch_extra_cards(missing_names: list) -> list:
    """
    Pass 2: Search the full API (no league filter) for players
    whose normalized name matches any of the missing_names.
    Used for Icons / players outside the league-53 bucket.
    """
    if not missing_names:
        return []

    targets = {normalize(n) for n in missing_names}
    print(f"\nPass 2: Searching full API for {len(targets)} missing players...")
    found = []
    page, last_page = 1, 1

    while page <= last_page:
        url = f"https://futmind.com/api/players?page={page}"
        try:
            req  = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=15)
            data = json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            print(f"  Warning: page {page} failed — {e}")
            page += 1
            continue

        if page == 1:
            last_page = data.get("last_page", 1)

        for p in data.get("data", []):
            name = p.get("nameClean") or p.get("fullnameClean") or ""
            if normalize(name) in targets:
                rid = p.get("resourceId")
                if name and rid:
                    found.append({
                        "name":       name,
                        "resourceId": rid,
                        "rating":     p.get("rating", 0),
                        "assetId":    p.get("assetId"),
                    })
        print(f"  Page {page}/{last_page} — {len(found)} extra cards found", end="\r")
        page += 1

    print(f"\nPass 2 found {len(found)} extra cards")
    return found



def best_card_per_player(cards):
    """
    Deduplicate by assetId — keep only the highest-rated card per real-world player.
    Falls back to resourceId as key if assetId is None.
    Returns list of unique card entries.
    """
    best: dict = {}
    for c in cards:
        aid = c["assetId"]
        # Use resourceId as fallback key if assetId is genuinely missing (None)
        # NOTE: do NOT skip assetId=0 — that is a valid value in EA's data
        key = aid if aid is not None else f"rid_{c['resourceId']}"
        if key not in best or c["rating"] > best[key]["rating"]:
            best[key] = c
    print(f"Unique players (by assetId): {len(best)}")
    return list(best.values())


# ── Fuzzy match to DB names ────────────────────────────────────────────────

def fetch_db_names():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur  = conn.cursor()
        cur.execute("SELECT DISTINCT player_name FROM players WHERE player_name IS NOT NULL;")
        names = [row[0] for row in cur.fetchall()]
        cur.close()
        conn.close()
        print(f"DB players: {len(names)}")
        return names
    except Exception as e:
        print(f"DB error: {e}")
        return []


def build_map(db_names, card_entries):
    THRESHOLD = 0.2
    # Build lookup: normalized futmind name → resourceId
    name_to_rid = {normalize(e["name"]): e["resourceId"] for e in card_entries}

    result   = {}
    unmatched = []

    for db_name in db_names:
        # 1. Check manual override first
        if db_name in MANUAL_OVERRIDES:
            override_norm = normalize(MANUAL_OVERRIDES[db_name])
            if override_norm in name_to_rid:
                result[db_name] = name_to_rid[override_norm]
                continue

        # 2. Fuzzy match
        best_rid   = None
        best_score = 0.0
        for entry in card_entries:
            score = match_score(db_name, entry["name"])
            if score > best_score:
                best_score = score
                best_rid   = entry["resourceId"]

        if best_rid and best_score >= THRESHOLD:
            result[db_name] = best_rid
        else:
            unmatched.append(db_name)

    return result, unmatched



# ── Main ───────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  Build playerResourceIds.json  (CDN approach)")
    print("=" * 60)

    # 1. Fetch all LaLiga cards
    all_cards   = fetch_laliga_cards()
    card_entries = best_card_per_player(all_cards)

    # 2. Fetch DB player names
    db_names = fetch_db_names()
    if not db_names:
        print("No DB names found — writing card entries directly by name.")
        result = {c["name"]: c["resourceId"] for c in card_entries}
    else:
        result, unmatched = build_map(db_names, card_entries)
        print(f"\nPass 1 matched: {len(result)} / {len(db_names)}")

        # Pass 2: try to find players not in league-53 bucket (e.g. Icons)
        override_unmatched = [n for n in unmatched if n in MANUAL_OVERRIDES]
        if override_unmatched:
            override_names = [MANUAL_OVERRIDES[n] for n in override_unmatched]
            extra_cards = fetch_extra_cards(override_names)
            if extra_cards:
                all_cards_combined = all_cards + extra_cards
                card_entries2 = best_card_per_player(all_cards_combined)
                result, unmatched = build_map(db_names, card_entries2)
                print(f"Pass 2 matched: {len(result)} / {len(db_names)}")

        if unmatched:
            print(f"Still unmatched: {len(unmatched)}")
            for n in sorted(unmatched):
                print(f"  - {n}")


    # 3. Write output
    out_path = os.path.abspath(OUTPUT_FILE)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False, sort_keys=True)

    print(f"\nWritten -> {out_path}")
    print(f"  {len(result)} entries")
    print(f"\nTest a URL: https://card-image.futmind.com/en/26/{next(iter(result.values()))}.png")


if __name__ == "__main__":
    main()
