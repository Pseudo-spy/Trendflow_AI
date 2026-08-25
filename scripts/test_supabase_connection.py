from __future__ import annotations

import os

from dotenv import load_dotenv
from supabase import create_client


load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url:
    raise RuntimeError("SUPABASE_URL is missing")

if not key:
    raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is missing")

client = create_client(url, key)

response = client.table("products").select("*").limit(1).execute()

print("SUPABASE CONNECTION: OK")
print("PRODUCT TABLE READ: OK")
print(f"ROWS RETURNED: {len(response.data or [])}")