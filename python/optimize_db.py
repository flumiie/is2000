import sqlite3
import os
import sys

DB_PATH = "python/is2000.db"
if not os.path.exists(DB_PATH):
    DB_PATH = "is2000.db"

def get_size_mb(path):
    if os.path.exists(path):
        return os.path.getsize(path) / (1024 * 1024)
    return 0.0

def inspect_db():
    print(f"=== IS2000 Database Inspection ===")
    print(f"Database Path: {DB_PATH}")
    print(f"Database Size: {get_size_mb(DB_PATH):.2f} MB")
    print(f"WAL Size: {get_size_mb(DB_PATH + '-wal'):.2f} MB")
    print(f"SHM Size: {get_size_mb(DB_PATH + '-shm'):.2f} MB")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    tables = cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    print(f"\nTotal Tables: {len(tables)}")

    table_stats = []
    for (t,) in tables:
        try:
            count = cursor.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
            table_stats.append((t, count))
        except Exception:
            table_stats.append((t, -1))

    # Sort by row count descending
    table_stats.sort(key=lambda x: x[1], reverse=True)
    print("\nTop 10 Largest Tables by Row Count:")
    for t, count in table_stats[:10]:
        print(f" - {t}: {count:,} rows")

    conn.close()

def optimize_db():
    print(f"\n=== Optimizing & Organizing Database ===")
    size_before = get_size_mb(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("Running ANALYZE to update query optimizer statistics...")
    cursor.execute("ANALYZE;")

    print("Running VACUUM to defragment and reclaim free space...")
    cursor.execute("VACUUM;")

    print("Checkpointing WAL file...")
    cursor.execute("PRAGMA wal_checkpoint(TRUNCATE);")

    conn.close()

    size_after = get_size_mb(DB_PATH)
    saved = size_before - size_after
    print(f"\nOptimization Complete!")
    print(f"Size before: {size_before:.2f} MB")
    print(f"Size after:  {size_after:.2f} MB")
    print(f"Space saved: {saved:.2f} MB")

if __name__ == "__main__":
    inspect_db()
    if "--optimize" in sys.argv or len(sys.argv) == 1:
        optimize_db()
