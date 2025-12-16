// REQUIRED for pdf.js on GitHub Pages
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

document.getElementById("compressBtn").addEventListener("click", compress);

async function compress() {
  const fileInput = document.getElementById("fileInput");
  const quality = parseFloat(document.getElementById("quality").value);
  const bar = document.getElementById("bar");
  const status = document.getElementById("status");

  if (!fileInput.files.length) {
    alert("Please select a PDF file");
    return;
  }

  const file = fileInput.files[0];

  status.innerText = "Loading PDF…";
  bar.style.width = "5%";

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const newPdf = await PDFLib.PDFDocument.create();
  const total = pdf.numPages;

  for (let i = 1; i <= total; i++) {
    status.innerText = `Compressing page ${i} of ${total}`;
    bar.style.width = `${5 + (i / total) * 80}%`;

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: quality });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imgData = canvas.toDataURL("image/jpeg", quality);
    const img = await newPdf.embedJpg(imgData);

    const pdfPage = newPdf.addPage([canvas.width, canvas.height]);
    pdfPage.drawImage(img, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    });
  }

  status.innerText = "Finalizing…";
  bar.style.width = "95%";

  const finalPdf = await newPdf.save();
  download(finalPdf, file.name);

  bar.style.width = "100%";
  status.innerText = "Done!";
}

function download(bytes, name) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "compressed_" + name;
  link.click();
}
