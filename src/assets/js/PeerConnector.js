import Peer from "peerjs";
import EventHandler from "./EventHandler";
import FileHandler from "./FileHandler.js";

class PeerConnector {
  constructor({ prefix = "files_" } = {}) {
    // settings
    this.prefix = prefix;

    this.connection = null;
    this.peer = null;
    this.loginPending = false;

    this.events = new EventHandler();
    this.on = this.events.on.bind(this.events);
    this.trigger = this.events.trigger.bind(this.events);

    this.fileHandler = new FileHandler();

    // close connection on window close
    window.addEventListener("beforeunload", (e) => this.destroy());
  }

  generateUID() {
    return Math.random().toString(36).substr(2, 9);
  }

  getName() {
    const name = this.peer ? this.peer.id : null;

    // strip prefix
    if (name && name.startsWith(this.prefix)) {
      return name.substring(this.prefix.length);
    }
  }

  destroy() {
    console.log("destroying");
    if (this.connection) {
      this.connection.close();
    }

    if (this.peer) {
      this.peer.disconnect();
      this.peer.destroy();
    }
  }

  logout() {
    this.destroy();
    this.trigger("logout");
  }

  login(name) {
    this.userID = name;

    // unregister if we're already login
    if (this.peer) {
      this.trigger("error", "already logged in");
    }

    // Check: if already connected, disconnect first
    if (this.connection) {
      this.trigger("error", "already connected");
    }

    const peer = new Peer(`${this.prefix}${name}`);

    peer.on("open", (id) => {
      this.peer = peer;

      this.onOpen(id);
    });

    peer.on("error", (err) => {
      this.trigger("loginError", err);
    });

    peer.on("disconnected", (err) => this.trigger("logout", err));
    peer.on("close", (err) => this.trigger("logout", err));
  }

  onOpen(id) {
    console.log("connected", id);
    if (this.peer === null)
      this.trigger("error", "cannot open connection when not logged in");

    this.trigger("login", this.peer);

    this.peer.on("connection", (conn) => this.setupConnection(conn));

    // handle disconnect
    this.peer.on("disconnected", (err) => this.disconnect());
    this.peer.on("close", (err) => this.disconnect());
  }

  onData(e) {
    this.trigger("data", e);

    // handle handshake data
    if (e.type === "handshake" && this?.ack !== true) {
      this.onHandshake(e);
    }

    // handle file data
    if (e.type === "file") {
      this.trigger("data:file", e);
    }

    // handle message data
    if (e.type === "message") {
      this.trigger("data:message", e);
    }

    // handle chunk data
    if (e.type === "chunk") {
      this.handleChunks(e);
    }
  }

  handleChunks(e) {
    if (e.order == 0) {
      this.fileChunks = [];
    }

    this.fileChunks.push(e.chunk);

    this.trigger("data:chunk", e);

    if (this.fileChunks.length === e.total) {
      const file = this.fileHandler.createFile(this.fileChunks);
      this.trigger("data:file", {
        type: "file",
        id: e.id,
        blob: file,
        name: e.name,
        size: e.size,
      });
    }
  }

  onHandshake(e) {
    this.ack = true;

    // set userData
    console.log("handshake", e);
    this.targetID = e.name;

    this.trigger("data:handshake", e);
    this.sendHandshake();
  }

  async sendFile(file) {
    if (this.connection) {
      const chunks = await this.fileHandler.createChunks(file);
      const total = chunks.length;
      const uiID = this.generateUID();

      for (let [order, chunk] of Object.entries(chunks)) {
        this.connection.send({
          id: uiID,
          type: "chunk",
          order: parseInt(order),
          chunk,
          total,
          name: file.name,
          size: file.size,
        });
      }

      // const blob = new Blob([file], { type: file.type });

      // this.connection.send({
      //   type: "file",
      //   blob,
      //   name: file.name,
      //   size: file.size,
      // });
    }
  }

  sendMessage(message) {
    if (this.connection) {
      this.connection.send({
        type: "message",
        message: message,
      });
    }
  }

  sendHandshake() {
    if (this.connection) {
      this.connection.send({
        type: "handshake",
        name: this.getName(),
      });
    }
  }

  setupConnection(conn) {
    this.connection = conn;
    this.trigger("connected", conn);

    this.connection.on("data", (e) => this.onData(e));

    this.sendHandshake();

    // handle disconnect
    this.connection.on("close", (err) => this.disconnect());
    this.connection.on("disconnected", (err) => this.disconnect());
  }

  disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
      this.ack = false;
      this.trigger("disconnect", this.connection);
    } else {
      this.trigger("error", "cannot disconnect when not connected");
    }
  }

  connect(name) {
    console.log("starting connection");

    // close connection if we have one
    if (this.connection) {
      this.trigger("error", "already connected");
      return;
    }

    if (this.peer) {
      // disallow connecting to ourself
      if (name === this.peer.id) {
        this.trigger("error", "cannot connect to yourself");
        return;
      }

      this.trigger("connect", name);
      let dataConnection = this.peer.connect(`${this.prefix}${name}`);

      // success
      dataConnection.on("open", () => this.setupConnection(dataConnection));
    } else {
      this.trigger("error", "Cannot connect when not logged in");
    }
  }
}

const connector = new PeerConnector({
  prefix: "files_",
});
export default connector;
