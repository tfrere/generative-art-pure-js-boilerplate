class VideoRecorder {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.stream = canvas.captureStream(60); // 30 FPS par défaut
    this.recorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.isMp4Supported = MediaRecorder.isTypeSupported(
      "video/mp4; codecs=avc1.42E01E"
    );

    this.options = {
      mimeType: this.isMp4Supported
        ? "video/mp4; codecs=avc1.42E01E"
        : "video/webm; codecs=vp9",
      videoBitsPerSecond: 5000000, // 2.5 Mbps, par exemple

      ...options,
    };
  }

  startRecording() {
    this.recordedChunks = [];
    this.isRecording = true;
    this.recorder = new MediaRecorder(this.stream, this.options);

    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.recorder.start();
  }

  stopRecording() {
    return new Promise((resolve, reject) => {
      this.recorder.onstop = () => {
        const videoBlob = new Blob(this.recordedChunks, {
          type: this.options.mimeType,
        });
        resolve(videoBlob);
      };

      this.recorder.onerror = (event) => reject(event.name);

      this.recorder.stop();
      this.isRecording = false;
    });
  }
}

export default VideoRecorder;
