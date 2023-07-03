export default class FileHandler {
  constructor() {}

  createChunks(file, chunkSize = 1638400) {
    const fileSize = file.size;
    const chunks = Math.ceil(fileSize / chunkSize);
    const chunkPromises = [];

    let offset = 0;
    for (let i = 0; i < chunks; i++) {
      const chunk = file.slice(offset, offset + chunkSize);
      offset += chunkSize;

      const chunkPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            data: event.target.result,
            order: i,
          });
        };
        reader.readAsDataURL(chunk);
      });

      chunkPromises.push(chunkPromise);
    }

    return Promise.all(chunkPromises);
  }

  createFile(chunks) {
    const sortedChunks = chunks.sort((a, b) => a.order - b.order);
    const dataURLs = sortedChunks.map((chunk) => chunk.data);
    const blob = this.dataURLToBlob(dataURLs.join(""));
    return blob;
  }
}

// example usage
// let chunks = await createChunks(file);
// let file = createFile(chunks);
