import firebase_admin
from firebase_admin import credentials, firestore
import os

def init_firebase():
    if not firebase_admin._apps:
        try:
            # Check for JSON string in environment variable (for Render production)
            firebase_json = os.environ.get("FIREBASE_CREDENTIALS_JSON")
            if firebase_json:
                import json
                cred_dict = json.loads(firebase_json)
                cred = credentials.Certificate(cred_dict)
            else:
                # Fallback to local file path (for local development)
                cred_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH", "service-account.json")
                cred = credentials.Certificate(cred_path)
                
            firebase_admin.initialize_app(cred)
            print("Firebase Admin Initialized successfully.")
        except Exception as e:
            print(f"Warning: Could not initialize Firebase Admin SDK. Error: {e}")
    return firestore.client() if firebase_admin._apps else None

db = init_firebase()
