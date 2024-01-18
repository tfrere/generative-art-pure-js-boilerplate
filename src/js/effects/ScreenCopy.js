export default class ScreenCopy {
  constructor(canvas, numRects) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.rectangles = this.generateRandomRectangles(numRects);
  }

  loadMaskImage(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
        const maskCtx = maskCanvas.getContext("2d");
        maskCtx.drawImage(img, 0, 0);
        this.maskData = maskCtx.getImageData(0, 0, img.width, img.height);
        resolve();
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob); // Créer un URL d'objet à partir du Blob
    });
  }

  captureArea(sourceX, sourceY, rectWidth, rectHeight) {
    return this.ctx.getImageData(sourceX, sourceY, rectWidth, rectHeight);
  }

  generateRandomRectangles(numRects) {
    const rectangles = [];
    for (let i = 0; i < numRects; i++) {
      let width, height;
      const type = Math.random() > 0.5 ? "normal" : "repeatFirstLine";
      const orientation = Math.random() > 0.5 ? "horizontal" : "vertical";

      if (type === "repeatFirstLine" && orientation === "horizontal") {
        width = Math.random() * (this.canvas.width / 2) + 50; // Plus large
        height = 10; // Une seule ligne
      } else if (type === "repeatFirstLine" && orientation === "vertical") {
        width = 10; // Une seule colonne
        height = Math.random() * (this.canvas.height / 2) + 50; // Plus longue
      } else {
        width = Math.random() * 100 + 20;
        height = Math.random() * 100 + 20;
      }

      const x = Math.random() * (this.canvas.width - width);
      const y = Math.random() * (this.canvas.height - height);
      const sourceX = Math.random() * (this.canvas.width - width);
      const sourceY = Math.random() * (this.canvas.height - height);

      rectangles.push({
        x,
        y,
        width,
        height,
        sourceX,
        sourceY,
        type,
        orientation,
      });
    }
    return rectangles;
  }

  draw() {
    this.rectangles.forEach((rect) => {
      if (rect.type === "normal") {
        const imageData = this.captureArea(
          rect.sourceX,
          rect.sourceY,
          rect.width,
          rect.height
        );
        this.ctx.putImageData(imageData, rect.x, rect.y);
      } else if (rect.type === "repeatFirstLine") {
        if (rect.orientation === "horizontal") {
          const firstLineData = this.captureArea(
            rect.sourceX,
            rect.sourceY,
            rect.width,
            1
          );
          for (let y = 0; y < rect.height; y++) {
            this.ctx.putImageData(firstLineData, rect.x, rect.y + y);
          }
        } else if (rect.orientation === "vertical") {
          const firstColumnData = this.captureArea(
            rect.sourceX,
            rect.sourceY,
            1,
            rect.height
          );
          for (let x = 0; x < rect.width; x++) {
            this.ctx.putImageData(firstColumnData, rect.x + x, rect.y);
          }
        }
      }
    });
  }
}
