# Indian Languages in PDF - Important Note

## Current Limitation

The PDF generation library (jsPDF) uses standard fonts that **do not support Indian language scripts** such as:
- Kannada (ಕನ್ನಡ)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Hindi (हिंदी)
- Malayalam (മലയാളം)
- Bengali (বাংলা)
- Gujarati (ગુજરાતી)
- Punjabi (ਪੰਜਾਬੀ)

## Why This Happens

jsPDF uses Helvetica font by default, which only supports Latin characters (A-Z, a-z, 0-9). Indian language characters appear as garbled symbols or boxes in the PDF.

## Solutions

### ✅ Recommended: View Exam Online
Students should take exams directly in the browser where all Indian languages display perfectly. The online exam interface fully supports all Unicode characters.

### ⚠️ PDF Download
If you need a PDF with Indian language content:

1. **Use Browser Print to PDF**
   - Open the exam page in browser
   - Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
   - Select "Save as PDF"
   - This preserves all formatting and Indian languages

2. **Use English Content**
   - Create exams in English for PDF downloads
   - Use Indian languages only for online exams

## Technical Details

To properly support Indian languages in jsPDF, we would need to:
1. Embed custom fonts (Noto Sans, etc.) - adds 2-5MB per PDF
2. Use complex text rendering libraries
3. Handle right-to-left and complex scripts

This significantly increases PDF file size and generation time, which is why we recommend the online exam approach.

## Current Implementation

The PDF now includes a warning message when Indian language content is detected:
> ⚠ Note: This PDF may not display Indian language characters correctly. Please view the exam online for proper formatting.

## For Teachers

If you need to create question papers in Indian languages:
- ✅ Students take exam online (fully supported)
- ✅ Use browser print-to-PDF for archival
- ❌ Don't rely on the "Download PDF" button for Indian languages
