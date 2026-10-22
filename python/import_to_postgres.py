import os
import json
import glob
from pathlib import Path
try:
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    psycopg2 = None

DATA_DIR = Path("public/data")

def get_connection():
    # Supports DATABASE_URL or individual PG environment variables
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        return psycopg2.connect(database_url)

    host = os.environ.get("PGHOST", "localhost")
    port = os.environ.get("PGPORT", "5432")
    dbname = os.environ.get("PGDATABASE", "is2000")
    user = os.environ.get("PGUSER", "postgres")
    password = os.environ.get("PGPASSWORD", "")

    return psycopg2.connect(
        host=host,
        port=port,
        dbname=dbname,
        user=user,
        password=password
    )

def main():
    if not psycopg2:
        print("Error: psycopg2 is not installed. Please run: pip install psycopg2-binary")
        return

    json_files = glob.glob(str(DATA_DIR / "*.json"))
    print(f"Found {len(json_files)} JSON files in {DATA_DIR}.")

    try:
        conn = get_connection()
        conn.autocommit = False
        cursor = conn.cursor()
    except Exception as e:
        print(f"Failed to connect to PostgreSQL: {e}")
        print("Please ensure PostgreSQL is running and connection env vars (DATABASE_URL or PGHOST, PGDATABASE, PGUSER, PGPASSWORD) are set.")
        return

    for filepath in sorted(json_files):
        table_name = Path(filepath).stem
        if table_name == "metadata":
            continue

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)

            if not isinstance(data, list) or not data:
                print(f"Skipping {table_name}: empty or invalid format.")
                continue

            # Gather all unique column keys across records
            columns = sorted(list(set(k for row in data for k in row.keys())))
            if not columns:
                continue

            # Create table with TEXT columns
            col_defs = ", ".join([f'"{col}" TEXT' for col in columns])
            cursor.execute(f'DROP TABLE IF EXISTS "{table_name}" CASCADE;')
            cursor.execute(f'CREATE TABLE "{table_name}" ({col_defs});')

            # Prepare rows for batch insert
            rows = []
            for item in data:
                row = [item.get(col) for col in columns]
                rows.append(row)

            # Insert in batches using execute_values
            col_names = ", ".join([f'"{col}"' for col in columns])
            insert_query = f'INSERT INTO "{table_name}" ({col_names}) VALUES %s'

            batch_size = 5000
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i + batch_size]
                execute_values(cursor, insert_query, batch)

            conn.commit()
            print(f"Imported {table_name}: {len(rows)} rows, {len(columns)} columns.")

        except Exception as e:
            conn.rollback()
            print(f"Error importing table {table_name}: {e}")

    cursor.close()
    conn.close()
    print("PostgreSQL migration complete.")

if __name__ == "__main__":
    main()
