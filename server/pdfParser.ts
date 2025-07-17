import pdfParse from "pdf-parse";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const { text } = await pdfParse(buffer); // ✅ buffer passed
  return text;
}
