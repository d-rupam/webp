document.addEventListener('DOMContentLoaded', () => {
    const upload = document.getElementById('upload');
    const convertBtn = document.getElementById('convert-btn');
    const downloadLink = document.getElementById('download-link');
    const stats = document.getElementById('stats');
    const dropZone = document.getElementById('drop-zone');
    
    
    const progressWrap = document.getElementById('progress-wrap');
    const progressBar = document.getElementById('progress-bar');

    upload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            dropZone.textContent = "File: " + file.name;
            convertBtn.disabled = false;
            
            
            stats.style.display = 'none';
            downloadLink.style.display = 'none';
            progressWrap.style.display = 'none';
            progressBar.style.width = '0%';
            progressBar.style.backgroundColor = '#ef4444'; 
            convertBtn.textContent = "Convert to WebP";
        }
    });

    convertBtn.addEventListener('click', () => {
        const file = upload.files[0];
        if (!file) return;

        convertBtn.textContent = "Converting...";
        convertBtn.disabled = true;
        
        
        progressWrap.style.display = 'block';
        
        
        requestAnimationFrame(() => {
            progressBar.style.width = '40%';
            progressBar.style.backgroundColor = '#f59e0b'; 
        });

        
        setTimeout(() => {
            new Compressor(file, {
                quality: 0.8,
                mimeType: 'image/webp',
                success(result) {
                    
                    
                    progressBar.style.width = '100%';
                    progressBar.style.backgroundColor = '#10b981'; 
                    
                    const url = URL.createObjectURL(result);
                    downloadLink.href = url;
                    downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    
                    
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
        }, 150); 
    });
});
