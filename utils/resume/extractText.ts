type PdfTextItem = {
  str?: string;
  hasEOL?: boolean;
};

export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (file.type.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md")) {
    return file.text();
  }

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value.trim();
  }

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const document = await pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer())
    }).promise;

    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = (content.items as PdfTextItem[])
        .map((item) => `${item.str ?? ""}${item.hasEOL ? "\n" : " "}`)
        .join("")
        .replace(/[ \t]+\n/g, "\n")
        .trim();
      pages.push(pageText);
    }

    return pages.join("\n\n").trim();
  }

  throw new Error("This file type cannot be parsed yet. Upload a PDF, DOCX, TXT, or Markdown resume.");
}
