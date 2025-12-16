// REQUIRED for pdf.js on GitHub Pages
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const fileInput = document.getElementById("fileInput");
const compressBtn = document.getElementById("compressBtn");
const qualitySelect = document.getElementById("quality");
const bar = document.getElementById("bar");
const statusElement = document.getElementById("status");
const fileLabel = document.getElementById("fileLabel");

// --- UI Helper Functions ---

/** Updates the status message and progress bar. */
function updateStatus(message, progressPercentage = 0, type = 'info') {
    statusElement.innerText = message;
    
    // Set appropriate class and icon based on type
    let iconClass = 'fa-info-circle';
    let barColor = '#22c55e'; // Green for success/progress (default)
    
    statusElement.className = ''; // Clear existing classes

    if (type === 'success') {
        iconClass = 'fa-check-circle';
        statusElement.classList.add('success-message');
    } else if (type === 'error') {
        iconClass = 'fa-exclamation-circle';
        barColor = '#ef4444'; // Red for error
        statusElement.classList.add('error-message');
    }

    statusElement.innerHTML = `<i class="fas ${iconClass}"></i> ${message}`;
    
    bar.style.backgroundColor = barColor;
    bar.style.width = `${Math.min(100, Math.max(0, progressPercentage))}%`;
}

/** Resets UI to initial state */
function resetUI() {
    fileInput.value = ''; // Clear file input
    updateStatus("Waiting for file selection...");
    fileLabel.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to select or drag & drop a PDF</span>';
    fileLabel.classList.remove('file-selected');
    compressBtn.disabled = true;
    updateStatus("Waiting for file selection...", 0, 'info');
}

// --- File Selection & Drag/Drop Logic ---

// Handles file selection via click or drop
function handleFileSelection() {
    const file = fileInput.files[0];
    if (file && file.type === 'application/pdf') {
        fileLabel.innerHTML = `<i class="fas fa-file-pdf"></i><span>File Selected: **${file.name}**</span>`;
        fileLabel.classList.add('file-selected');
        compressBtn.disabled = false;
        updateStatus(`File ready: ${file.name}`, 0, 'info');
    } else {
        resetUI();
        if (file) {
            updateStatus("Invalid file type. Please select a PDF.", 0, 'error');
        }
    }
}

fileInput.addEventListener('change', handleFileSelection);

// Drag and Drop implementation
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileLabel.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    fileLabel.addEventListener(eventName, () => fileLabel.classList.add('dragging'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileLabel.addEventListener(eventName, () => fileLabel.classList.remove('dragging'), false);
});

fileLabel.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    
    if (dt.files.length) {
        const pdfFile = Array.from(dt.files).find(f => f.type === 'application/pdf');
        
        if (pdfFile) {
            // Create a DataTransfer object to assign the file(s) to the hidden input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(pdfFile);
            fileInput.files = dataTransfer.files;
            
            fileInput.dispatchEvent(new Event('change', { bubbles: true })); 
        } else {
            updateStatus("Please drop a valid PDF file (.pdf).", 0, 'error');
        }
    }
}


// --- Compression Logic ---

compressBtn.addEventListener("click", compress);

async function compress() {
    const file = fileInput.files[0];
    const quality = parseFloat(qualitySelect.value);

    if (!file) {
        updateStatus("No file selected.", 0, 'error');
        return;
    }
    
    // Disable button to prevent re-pressing and start processing
    compressBtn.disabled = true;

    try {
        updateStatus("Loading PDF data…", 5);

        const buffer = await file.arrayBuffer();
        
        // Use a hidden canvas for rendering
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Load PDF using pdf.js
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const newPdf = await PDFLib.PDFDocument.create();
        const total = pdf.numPages;

        for (let i = 1; i <= total; i++) {
            const pageIndex = i - 1;
            // Progress goes from 5% (loading) to 90% (just before finalizing)
            const progress = 5 + (i / total) * 85; 
            updateStatus(`Compressing page ${i} of ${total}…`, progress);

            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1 }); 

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render page to canvas
            await page.render({ canvasContext: ctx, viewport }).promise;

            // Convert canvas content to JPEG with specified quality
            const imgData = canvas.toDataURL("image/jpeg", quality); 
            const img = await newPdf.embedJpg(imgData);

            // Add new page to PDF-LIB document and draw the compressed image
            const pdfPage = newPdf.addPage([canvas.width, canvas.height]);
            pdfPage.drawImage(img, {
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height
            });
        }

        updateStatus("Finalizing and saving compressed PDF…", 95);

        const finalPdf = await newPdf.save();
        download(finalPdf, file.name);

        updateStatus(`Compression Complete! File saved as 'compressed_${file.name}'.`, 100, 'success');
        
        // Reset UI after a short delay for the user to see the success message
        setTimeout(resetUI, 3000);
        
    } catch (e) {
        console.error("Compression Error:", e);
        updateStatus(`Compression failed. Error: ${e.message}`, 100, 'error');
        compressBtn.disabled = false; 
    }
}

function download(bytes, originalName) {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "compressed_" + originalName.replace(/\.pdf$/i, '') + ".pdf";
    link.click();
    // Clean up the object URL
    URL.revokeObjectURL(link.href);
}

// Set initial state when the script loads
resetUI();
