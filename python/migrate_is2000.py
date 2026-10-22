import os
import sqlite3
from dbfread import DBF, FieldParser

class SafeFieldParser(FieldParser):
    def parse(self, field, data):
        try:
            return super().parse(field, data)
        except Exception:
            # Fallback to raw bytes decoded or stripped
            try:
                return data.decode('latin1', errors='ignore').strip()
            except Exception:
                return str(data)

DTA_DIR = r'I:\Downloads\Softwares\is2000'
DB_PATH = 'is2000.db'

def main():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    dta_files = [f for f in os.listdir(DTA_DIR) if f.upper().endswith('.DTA')]
    print(f"Found {len(dta_files)} .DTA files.")

    for filename in sorted(dta_files):
        table_name = os.path.splitext(filename)[0].lower()
        filepath = os.path.join(DTA_DIR, filename)

        try:
            table = DBF(filepath, load=False, encoding='latin1', parserclass=SafeFieldParser)
            fields = table.field_names
            if not fields:
                continue

            field_defs = ', '.join([f'"{f}" TEXT' for f in fields])
            cursor.execute(f'CREATE TABLE IF NOT EXISTS "{table_name}" ({field_defs});')

            rows = []
            for record in table:
                row = []
                for f in fields:
                    val = record.get(f)
                    if val is not None:
                        if isinstance(val, bytes):
                            val = val.decode('latin1', errors='ignore')
                        else:
                            val = str(val)
                    row.append(val)
                rows.append(row)

            if rows:
                placeholders = ', '.join(['?'] * len(fields))
                cursor.executemany(f'INSERT INTO "{table_name}" VALUES ({placeholders});', rows)
                conn.commit()
            print(f"Migrated {filename} -> table '{table_name}' ({len(rows)} rows, {len(fields)} fields)")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    conn.close()
    print(f"\nMigration complete. SQLite database saved to {DB_PATH}.")

if __name__ == '__main__':
    main()
