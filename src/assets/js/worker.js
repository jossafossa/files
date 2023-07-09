export default class FileHandler {
  constructor() {
    this.worker = new Worker("build/worker.js");
    this.files = {};
  }

  /**
   *
   * @param {File} file The input file
   * @param {int} chunkSize  The size of each chunk in bytes
   * @returns {Array[Obj]} The full base64 of the file split into chunks
   */
  async createChunks(file, chunkSize = 16384) {
    // get the full base64 of the file
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // get the base64
    const base64 = await new Promise((resolve) => {
      reader.onload = (event) => {
        resolve(event.target.result);
      };
    });

    // split the base64 into chunks
    const chunks = [];
    let offset = 0;
    while (offset < base64.length) {
      chunks.push({
        data: base64.slice(offset, offset + chunkSize),
        order: chunks.length,
      });
      offset += chunkSize;
    }

    return chunks;
  }

  /**
   *
   * @param {Array[string]} chunks A list of base64 encoded data URLs
   * @returns {File} A file object
   */
  createFile(chunks) {
    // sort chunks by order
    chunks.sort((a, b) => {
      return a.order - b.order;
    });

    const base64 = chunks.reduce((acc, data) => {
      return acc + data.chunk.data;
    }, "");
    return this.base64ToFile(base64, "file");
  }

  /**
   * @param {string} base64Data The base64 encoded data URL
   * @param {string} fileName The name of the file
   * @returns {File} A file object
   */
  base64ToFile(base64Data, fileName) {
    const arr = base64Data.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  addChunk(chunk) {
    const id = chunk.id;
    if (!this.files[id]) {
      this.files[id] = [];
    }

    this.files[id].push(chunk);

    if (this.files[id].length === chunk.total) {
      const file = this.createFile(this.files[id]);
      post("file", file);
    }
  }
}

function post(type, data) {
  postMessage({
    type,
    data,
  });
}

const fileHandler = new FileHandler();
onmessage = async (event) => {
  let result = event.data;
  let type = result.type;
  let data = result.data;

  if (type === "addChunk") {
    fileHandler.addChunk(data);
  }

  if (type === "createFile") {
    const file = fileHandler.createFile(data.chunks);
    post("createFile", file);
    return;
  }

  if (type === "createChunks") {
    const { file, chunkSize } = data;
    const fileHandler = new FileHandler();
    const chunks = await fileHandler.createChunks(file, chunkSize);
    post("createChunks", chunks);
    return;
  }
};
