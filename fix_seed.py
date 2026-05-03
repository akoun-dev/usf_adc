import re
import os

fpath = 'supabase/seed.sql'
if os.path.exists(fpath):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Comment out the countries block
    # We use a non-greedy match for the semicolon to only catch one statement
    new_content = re.sub(r'(INSERT INTO "public"\."countries".*?;)', r'/* \1 */', content, flags=re.DOTALL)
    
    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully commented out countries block.")
    else:
        print("Countries block not found or already commented out.")
else:
    print("seed.sql not found.")
