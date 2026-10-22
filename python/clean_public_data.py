import os

public_data_dir = "public/data"
needed_files = {"stock.json", "cust.json", "supp.json", "beli.json", "jual.json", "metadata.json"}

if os.path.exists(public_data_dir):
    deleted_count = 0
    saved_space = 0
    for f in os.listdir(public_data_dir):
        if f not in needed_files:
            filepath = os.path.join(public_data_dir, f)
            if os.path.isfile(filepath):
                size = os.path.getsize(filepath)
                os.remove(filepath)
                deleted_count += 1
                saved_space += size
                print(f"Removed redundant file: {f} ({size/(1024*1024):.2f} MB)")

    print(f"\nCleanup complete: Removed {deleted_count} files, saved {saved_space/(1024*1024):.2f} MB.")

    total_remaining = sum(os.path.getsize(os.path.join(public_data_dir, f)) for f in os.listdir(public_data_dir) if os.path.isfile(os.path.join(public_data_dir, f)))
    print(f"New total size of public/data: {total_remaining/(1024*1024):.2f} MB")
else:
    print(f"Directory {public_data_dir} not found.")
