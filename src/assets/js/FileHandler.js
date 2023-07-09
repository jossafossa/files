export default class FileHandler {
  constructor() {
    this.worker = new Worker("build/worker.js");
  }

  sendData(type, args) {
    let params = {
      type,
      ...args,
    };
    this.worker.postMessage(params);

    return new Promise((resolve) => {
      this.worker.onmessage = (event) => {
        let data = event.data;
        if (data.type !== type) return;
        resolve(data.data);
      };
    });
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
    console.log(chunk);
    return this.sendData("addChunk", chunk);
  }
}
