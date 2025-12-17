import os
import uuid
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pdf2docx import Converter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# CLEANUP FUNCTION
def remove_file(path: str):
    try:
        os.remove(path)
    except Exception:
        pass

@app.post("/convert")
def convert_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    
    # 1. Unique IDs to prevent clashes
    unique_id = str(uuid.uuid4())
    pdf_filename = f"{unique_id}.pdf"
    docx_filename = f"{unique_id}.docx"
    
    # 2. Save Uploaded File
    try:
        with open(pdf_filename, "wb") as buffer:
            while content := file.file.read(1024 * 1024): # 1MB chunks
                buffer.write(content)
    except Exception as e:
        return {"error": "Failed to save file."}

    # 3. CONVERT (The Fast Way)
    print(f"🚀 Speed Converting {pdf_filename}...")
    try:
        cv = Converter(pdf_filename)
        # start=0, end=None means convert all pages
        cv.convert(docx_filename, start=0, end=None)
        cv.close()
    except Exception as e:
        print(f"Error: {e}")
        return {"error": "Conversion failed."}

    # 4. Check if it worked
    if not os.path.exists(docx_filename):
         return {"error": "Conversion failed. Output not found."}

    # 5. Schedule Cleanup
    background_tasks.add_task(remove_file, pdf_filename)
    background_tasks.add_task(remove_file, docx_filename)

    # 6. Send File
    return FileResponse(docx_filename, filename=file.filename.replace(".pdf", ".docx"))
