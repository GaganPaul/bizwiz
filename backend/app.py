from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from datetime import datetime
import traceback

try:
    from firebase_admin_setup import db
    from document_processor import extract_text
    from llm_service import analyze_document_text, chat_with_bot_langchain, get_chat_chain
except Exception as _import_err:
    print("STARTUP IMPORT ERROR:", _import_err)
    traceback.print_exc()
    raise

app = Flask(__name__)
CORS(app, origins=[
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://bizwiz-khbx.onrender.com",
    "https://bizwiz-frontend-aav7.onrender.com",
])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    user_id = request.form.get('user_id', 'anonymous')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    file_bytes = file.read()
    text = extract_text(file_bytes, file.filename)
    
    if not text:
        return jsonify({"error": "Could not extract text from the file"}), 400
        
    analysis_result = analyze_document_text(text)
    
    doc_id = str(uuid.uuid4())
    doc_data = {
        "id": doc_id,
        "user_id": user_id,
        "file_name": file.filename,
        "extracted_text": text,
        "analysis_result": analysis_result,
        "timestamp": datetime.utcnow()
    }
    
    if db:
        try:
            db.collection("documents").document(doc_id).set(doc_data)
        except Exception as e:
            print(f"Failed to save to Firestore: {e}")
            
    return jsonify({"message": "File uploaded and analyzed", "document": doc_data}), 200

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    user_id = data.get('user_id', 'anonymous')
    chat_id = data.get('chat_id')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
        
    if not chat_id:
        chat_id = str(uuid.uuid4())
        
        # Initialize a new chat session record
        if db:
            db.collection("chats").document(chat_id).set({
                "id": chat_id,
                "user_id": user_id,
                "title": user_message[:50] + "...",
                "timestamp": datetime.utcnow()
            })
    else:
        # Update timestamp for existing chat
        if db:
            db.collection("chats").document(chat_id).update({
                "timestamp": datetime.utcnow()
            })
            
    bot_response = chat_with_bot_langchain(user_message, chat_id)
    return jsonify({"response": bot_response, "chat_id": chat_id}), 200

@app.route('/chats/<user_id>', methods=['GET'])
def get_user_chats(user_id):
    if not db:
        return jsonify({"error": "Database not initialized"}), 500
    try:
        chats = db.collection("chats").where("user_id", "==", user_id).stream()
        results = []
        for c in chats:
            d = c.to_dict()
            d['id'] = c.id
            results.append(d)
        
        results.sort(key=lambda x: x.get('timestamp').timestamp() if x.get('timestamp') else 0, reverse=True)
        return jsonify({"chats": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chat/<chat_id>', methods=['GET', 'DELETE'])
def chat_by_id(chat_id):
    if request.method == 'GET':
        try:
            history = get_chat_chain(chat_id)
            messages = history.messages
            formatted_messages = []
            for msg in messages:
                role = "user" if msg.type == "human" else "assistant"
                formatted_messages.append({"role": role, "content": msg.content})
            return jsonify({"messages": formatted_messages}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == 'DELETE':
        if not db:
            return jsonify({"error": "Database not initialized"}), 500
        try:
            db.collection("chats").document(chat_id).delete()
            db.collection("chat_history").document(chat_id).delete()
            return jsonify({"message": "Chat deleted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route('/documents/<user_id>', methods=['GET'])
def get_documents(user_id):
    if not db:
        return jsonify({"error": "Database not initialized"}), 500
    try:
        docs = db.collection("documents").where("user_id", "==", user_id).stream()
        results = []
        for doc in docs:
            d = doc.to_dict()
            d['extracted_text'] = d.get('extracted_text', '')[:100] + '...'
            results.append(d)
        return jsonify({"documents": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/document/<doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    if not db:
        return jsonify({"error": "Database not initialized"}), 500
    try:
        db.collection("documents").document(doc_id).delete()
        return jsonify({"message": "Document deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
