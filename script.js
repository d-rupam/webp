document.addEventListener('DOMContentLoaded', () => {
    const upload = document.getElementById('upload');
    const convertBtn = document.getElementById('convert-btn');
    const downloadLink = document.getElementById('download-link');
    const stats = document.getElementById('stats');
    const dropZone = document.getElementById('drop-zone');
    
    // Progress Bar Elements
    const progressWrap = document.getElementById('progress-wrap');
    const progressBar = document.getElementById('progress-bar');

    upload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            dropZone.textContent = "File: " + file.name;
            convertBtn.disabled = false;
            
            // Reset UI for a fresh start
            stats.style.display = 'none';
            downloadLink.style.display = 'none';
            progressWrap.style.display = 'none';
            progressBar.style.width = '0%';
            progressBar.style.backgroundColor = '#ef4444'; // Red
            convertBtn.textContent = "Convert to WebP";
        }
    });

    convertBtn.addEventListener('click', () => {
        const file = upload.files[0];
        if (!file) return;

        convertBtn.textContent = "Converting...";
        convertBtn.disabled = true;
        
        // 1. Show the progress bar container
        progressWrap.style.display = 'block';
        
        // 2. Start animation to 40% and turn Orange
        requestAnimationFrame(() => {
            progressBar.style.width = '40%';
            progressBar.style.backgroundColor = '#f59e0b'; // Orange
        });

        // 3. Pause for a tiny moment so the browser can draw the red/orange bar
        setTimeout(() => {
            new Compressor(file, {
                quality: 0.8,
                mimeType: 'image/webp',
                success(result) {
                    
                    // 4. On success, jump to 100% and turn Green
                    progressBar.style.width = '100%';
                    progressBar.style.backgroundColor = '#10b981'; // Green
                    
                    const url = URL.createObjectURL(result);
                    downloadLink.href = url;
                    downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    
                    // Show final buttons and stats
                    downloadLink.style.display = 'block';
                    stats.style.display = 'block';
                    
                    const initialSize = (file.size / 1024).toFixed(2);
                    const finalSize = (result.size / 1024).toFixed(2);
                    const saved = (((file.size - result.size) / file.size) * 100).toFixed(1);
                    
                    stats.innerHTML = `Original: ${initialSize}KB<br>Converted: ${finalSize}KB<br><strong>Saved: ${saved}%</strong>`;
                    
                    convertBtn.textContent = "Convert Another";
                    convertBtn.disabled = false;
                },
                error(err) {
                    console.error("Compression error:", err);
                    convertBtn.textContent = "Error! Try again.";
                    convertBtn.disabled = false;
                },
            });
        }, 150); // The magic 150-millisecond delay
    });
});
