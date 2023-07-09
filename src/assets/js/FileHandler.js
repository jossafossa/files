export default class FileHandler {
  constructor() {
    this.worker = new Worker("build/worker.js");

    this.callbacks = [];
    this.worker.onmessage = (event) => {
      this.callbacks.forEach((callback) => callback(event));
    };
  }

  sendData(type, data) {
    let params = {
      type,
      data,
    };
    this.worker.postMessage(params);

    return new Promise((resolve) => {
      this.onMessage((event) => {
        let data = event.data;
        if (data.type !== type) return;
        resolve(data.data);
      });
    });
  }

  onMessage(callback) {
    this.callbacks.push(callback);
  }

  /**
   *
   * @param {File} file The input file
   * @param {int} chunkSize  The size of each chunk in bytes
   * @returns {Array[Obj]} The full base64 of the file split into chunks
   */
  async createChunks(file, chunkSize = 16384) {
    return this.sendData("createChunks", { file, chunkSize });
  }

  createFile(chunks) {
    return this.sendData("createFile", { chunks });
  }

  addChunk(chunk) {
    return this.sendData("addChunk", chunk);
  }

  onFileComplete(callback) {
    this.onMessage((event) => {
      let data = event.data;
      if (data.type !== "file") return;
      callback(data.data);
    });
  }
}
