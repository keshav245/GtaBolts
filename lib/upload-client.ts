export interface UploadResult {
  key: string;
}

// fetch() doesn't expose upload progress, so this uses XMLHttpRequest directly
// for the actual PUT — that's the only part that needs it.
export function uploadToR2(
  file: File,
  kind: 'mod' | 'screenshot' | 'category',
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    fetch('/api/uploads/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, fileType: file.type, kind }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((body) => Promise.reject(new Error(body.error ?? 'Failed to get upload URL')));
        return res.json();
      })
      .then(({ uploadUrl, key }: { uploadUrl: string; key: string }) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress?.(100);
            resolve({ key });
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      })
      .catch(reject);
  });
}
