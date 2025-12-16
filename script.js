async function compress() {
  const file = document.getElementById("fileInput").files[0];
  const quality = parseFloat(document.getElementById("quality").value);
  const bar = document.getElementById("bar");
  const status = document.getElementById("status");

  if (!file) return alert("Select a PDF");

  status.innerText = "Reading PDF...";
  bar.style.width = "10%";

  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

  const newPdf = await PDFLib.PDFDocument.create();
  const total = pdf.numPages;

  for (let i = 1; i <= total; i++) {
    status.innerText = `Compressing page ${i} of ${total}`;
    bar.style.width = `${10 + (i / total) * 70}%`;

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width * quality;
    canvas.height = viewport.height * quality;

    await page.render({
      canvasContext: ctx,
      viewport: page.getViewport({ scale: quality })
    }).promise;

    const img = canvas.toDataURL("image/jpeg", quality);
    const imgEmbed = await newPdf.embedJpg(img);

    const pdfPage = newPdf.addPage([canvas.width, canvas.height]);
    pdfPage.drawImage(imgEmbed, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    });
  }

  bar.style.width = "95%";
  status.innerText = "Finalizing PDF...";

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
