import sys
import os
import traceback

print("=== BIZWIZ STARTUP ===")
print(f"Python: {sys.version}")
print(f"CWD: {os.getcwd()}")
print(f"Files: {os.listdir('.')}")
print(f"FIREBASE_CREDENTIALS_JSON set: {'FIREBASE_CREDENTIALS_JSON' in os.environ}")
print(f"groq_api_key set: {'groq_api_key' in os.environ}")

try:
    print("Importing firebase_admin_setup...")
    from firebase_admin_setup import db
    print(f"Firebase OK, db={db}")
except Exception as e:
    print(f"FIREBASE IMPORT ERROR: {e}")
    traceback.print_exc()

try:
    print("Importing document_processor...")
    from document_processor import extract_text
    print("document_processor OK")
except Exception as e:
    print(f"DOCUMENT_PROCESSOR IMPORT ERROR: {e}")
    traceback.print_exc()

try:
    print("Importing llm_service...")
    from llm_service import analyze_document_text, chat_with_bot_langchain, get_chat_chain
    print("llm_service OK")
except Exception as e:
    print(f"LLM_SERVICE IMPORT ERROR: {e}")
    traceback.print_exc()

try:
    print("Importing Flask app...")
    from app import app
    print("Flask app imported OK")
except Exception as e:
    print(f"APP IMPORT ERROR: {e}")
    traceback.print_exc()
    sys.exit(1)

print("=== STARTUP COMPLETE ===")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
