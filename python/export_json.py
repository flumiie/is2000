import os
import sqlite3
import json

DB_PATH = "python/is2000.db"
if not os.path.exists(DB_PATH):
    DB_PATH = "is2000.db"
OUTPUT_DIR = "public/data"

CORE_TABLES = ["stock", "cust", "supp", "beli", "jual"]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    metadata = {}
    for table in CORE_TABLES:
        try:
            rows = [dict(row) for row in cursor.execute(f'SELECT * FROM "{table}"').fetchall()]
            metadata[table] = len(rows)
            with open(os.path.join(OUTPUT_DIR, f"{table}.json"), "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False)
            print(f"Exported core table {table} ({len(rows)} rows) -> {table}.json")
        except Exception as e:
            print(f"Skipped table {table}: {e}")

    with open(os.path.join(OUTPUT_DIR, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False)

    conn.close()
    print("Core JSON export complete.")

if __name__ == '__main__':
    main()
