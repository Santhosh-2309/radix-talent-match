import io
import pdfplumber
import docx

def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    ext = filename.lower().split(".")[-1]
    text = ""
    
    if ext == "pdf":
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"Error extracting PDF: {e}")
            
    elif ext in ["doc", "docx"]:
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error extracting DOCX: {e}")
            
    else:
        # Fallback to plain text
        try:
            text = file_bytes.decode("utf-8")
        except:
            text = str(file_bytes)
            
    return text.strip()
