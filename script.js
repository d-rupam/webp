// Ensure Compressor.js is loaded before running
document.addEventListener('DOMContentLoaded', () => {
    const upload = document.getElementById('upload');
    const convertBtn = document.getElementById('convert-btn');
    const downloadLink = document.getElementById('download-link');
    const stats = document.getElementById('stats');
    const dropZone = document.getElementById('drop-zone');

    let selectedFile = null;

    // Handle File Selection
    upload.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            dropZone.textContent = "Selected: " + selectedFile.name;
            convertBtn.disabled = false;
            stats.style.display = 'none';
            downloadLink.style.display = 'none';
        }
    });

    // Handle Conversion
    convertBtn.addEventListener('click', () => {
        if (!selectedFile) return;

        // Change button state during processing
        convertBtn.textContent = "Converting...";
        convertBtn.disabled = true;

        new Compressor(selectedFile, {
            quality: 0.8,
            mimeType: 'image/webp',
            success(result) {
                const url = URL.createObjectURL(result);
                
                // Set up download link
                downloadLink.href = url;
                downloadLink.download = selectedFile.name.replace(/\.[^/.]+$/, "") + ".webp";
                
                // Display results
                downloadLink.style.display = 'block';
                stats.style.display = 'block';
                
                const initialSize = (selectedFile.size / 1024).toFixed(2);
                const finalSize = (result.size / 1024).toFixed(2);
                const saved = (((selectedFile.size - result.size) / selectedFile.size) * 100).toFixed(1);
                
                stats.innerHTML = `Original: ${initialSize}KB<br>Converted: ${finalSize}KB<br><strong>Saved: ${saved}%</strong>`;
                
                // Reset button
                convertBtn.textContent = "Convert to WebP";
                convertBtn.disabled = false;
            },
            error(err) {
                console.error(err.message);
                convertBtn.textContent = "Error!";
            },
        });
    });
});
