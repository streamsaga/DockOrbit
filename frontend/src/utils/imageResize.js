// imageResize.js
//
// Resizes and crops an uploaded photo to a square JPEG data URL,
// entirely client-side via a <canvas>, before it's sent to the
// server. This keeps the upload small (a few hundred KB at most)
// without needing any cloud image storage - the resized result is
// what actually gets stored as avatar_data in the database.

export function resizeImageToDataUrl(file, size = 480, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file doesn't look like a valid image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Cover-crop: scale so the shorter side fills the square,
        // then center-crop the overflow on the longer side.
        const scale = Math.max(size / img.width, size / img.height);
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const offsetX = (size - drawWidth) / 2;
        const offsetY = (size - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}