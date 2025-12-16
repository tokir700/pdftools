async function compressPDF() {
  const input = document.getElementById("pdfInput");
  const status = document.getElementById("status");

  if (!input.files.length) {
    alert("Please select a PDF file");
    return;
  }

  status.innerText = "Compressing...";

  const file = input.files[0];
  const arrayBuffer = await file.arrayBuffer();

  const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

  const compressedPdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    compress: true
  });

  downloadPDF(compressedPdfBytes, file.name);
  status.innerText = "Done! Download started.";
}

function downloadPDF(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "compressed_" + filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
