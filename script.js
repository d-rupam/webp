document.addEventListener('DOMContentLoaded', () => {
    const upload = document.getElementById('upload');
    const convertBtn = document.getElementById('convert-btn');
    const downloadLink = document.getElementById('download-link');
    const stats = document.getElementById('stats');
    const dropZone = document.getElementById('drop-zone');

    upload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("File selected:", file.name);
            dropZone.textContent = "File: " + file.name;
            convertBtn.disabled = false;
            
            // Hide previous results
            stats.style.display = 'none';
            downloadLink.style.display = 'none';
        }
    });

    convertBtn.addEventListener('click', () => {
        const file = upload.files[0];
        if (!file) return;

        // Change button to show progress
        convertBtn.textContent = "Converting...";
        convertBtn.disabled = true;

        new Compressor(file, {
            quality: 0.8,
            mimeType: 'image/webp',
            success(result) {
                console.log("Conversion successful!");
                const url = URL.createObjectURL(result);
                
                // Update download link
                downloadLink.href = url;
                downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                
                // Show elements
                downloadLink.style.display = 'block';
                stats.style.display = 'block';
                
                // Calculate and display stats
                const initialSize = (file.size / 1024).toFixed(2);
                const finalSize = (result.size / 1024).toFixed(2);
                const saved = (((file.size - result.size) / file.size) * 100).toFixed(1);
                
                stats.innerHTML = `Original: ${initialSize}KB<br>Converted: ${finalSize}KB<br><strong>Saved: ${saved}%</strong>`;
                
                // Reset button text
                convertBtn.textContent = "Convert to WebP";
                convertBtn.disabled = false;
            },
            error(err) {
                console.error("Compression error:", err);
                convertBtn.textContent = "Error! Try again.";
                convertBtn.disabled = false;
            },
        });
    });
});
