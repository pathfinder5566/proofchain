export default async function hashFile(file, onProgress) {
  const startedAt = performance.now();
  const buffer = await readFile(file, onProgress);
  const digest = await window.crypto.subtle.digest("SHA-256", buffer);
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return {
    hash,
    filename: file.name,
    filesize: file.size,
    readTimeMs: Math.round(performance.now() - startedAt)
  };
}

function readFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      onProgress?.(100);
      resolve(reader.result);
    };
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
