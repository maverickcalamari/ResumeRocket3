import pdfParse from 'pdf-parse';

/**
 * Extracts text from a PDF buffer using pdf-parse.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const result = await pdfParse(buffer);
    return result.text || '';
  } catch (err) {
    console.error("❌ Error parsing PDF:", err);
    return '';
  }
}
