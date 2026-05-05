import fitz  # PyMuPDF
import docx
import io

def extract_text(file_stream, filename):
    text = ""
    ext = filename.lower().split('.')[-1]
    
    try:
        if ext == 'pdf':
            doc = fitz.open(stream=file_stream, filetype="pdf")
            for page in doc:
                text += page.get_text() + "\n"
        elif ext == 'docx':
            doc = docx.Document(io.BytesIO(file_stream))
            for para in doc.paragraphs:
                text += para.text + "\n"
        elif ext == 'txt':
            text = file_stream.decode('utf-8')
        else:
            raise ValueError(f"Unsupported file type: {ext}")
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""
        
    return text.strip()
