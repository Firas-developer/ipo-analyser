from fastapi import UploadFile
import pdfplumber
import io
import asyncio
from functools import partial


def _extract_pdf_text_sync(content: bytes, max_chars: int = None) -> tuple:
    """
    Synchronous PDF text extraction without character limit.
    Extracts ALL content from the PDF document for comprehensive analysis.
    Returns: (text, total_pages, pages_read)
    """
    text = ""
    pages_read = 0
    
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        total_pages = len(pdf.pages)
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"
            pages_read += 1
    
    return text, total_pages, pages_read


async def extract_pdf_text(file: UploadFile, max_chars: int = None) -> str:
    """
    Reads an uploaded PDF file and extracts ALL text asynchronously.
    No character limit - extracts complete document for comprehensive analysis.
    """
    # Read the file content into memory
    content = await file.read()
    
    print("\n" + "="*80)
    print("📄 PDF EXTRACTION STARTED")
    print("="*80)
    print(f"File Name: {file.filename}")
    print(f"File Size: {len(content)} bytes")
    print(f"Extraction Mode: FULL DOCUMENT (No Limit)")
    
    # Run CPU-intensive PDF processing in thread pool
    loop = asyncio.get_event_loop()
    text, total_pages, pages_read = await loop.run_in_executor(
        None,
        partial(_extract_pdf_text_sync, content, max_chars)
    )
    
    # Calculate percentage of document read
    percentage_read = (pages_read / total_pages * 100) if total_pages > 0 else 0
    
    print(f"\n✅ PDF EXTRACTION COMPLETED")
    print(f"Total Pages in Document: {total_pages}")
    print(f"Pages Read: {pages_read} ({percentage_read:.1f}%)")
    print(f"Extracted Text Length: {len(text)} characters")
    print(f"\n--- EXTRACTED TEXT PREVIEW (First 500 chars) ---")
    print(text[:500] + "..." if len(text) > 500 else text)
    print("="*80 + "\n")
    
    # Reset file pointer in case something else wants to read it later
    await file.seek(0)
    
    return text
