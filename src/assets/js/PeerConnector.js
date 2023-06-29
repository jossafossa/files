import Peer from "peerjs";
import EventHandler from "./EventHandler";

class PeerConnector {
  constructor() {
    this.connection = null;
    this.peer = null;
    this.registerPending = false;
    this.events = new EventHandler();

    this.on = this.events.on.bind(this.events);
    this.trigger = this.events.trigger.bind(this.events);

    this.on("open", (e) => this.open(e));
  }

  register(name) {
    this.trigger("register", name);

    // unregister if we're already registered
    if (this.peer) {
      this.peer.destroy();
      this.trigger("error", "already registered");
      console.log("unregistering");
      this.peer = null;
    }

    // Check: if already connected, disconnect first
    if (this.connection) {
      this.connection.close();
      this.trigger("error", "already connected");
    }

    const peer = new Peer(name);

    peer.on("open", (id) => {
      this.peer = peer;

      this.open(id);
    });

    peer.on("error", (err) => {
      this.trigger("registerError", err);

      console.dir(err);

      // retry if were connected
      if (err.type === "peer-unavailable") {
        this.connect(this.pendingConnection);
      }
    });
  }

  open(id) {
    this.trigger("registered", this.peer);

    this.peer.on("connection", (conn) => {
      this.connection = conn;
      this.trigger("connected", conn);
    });

    this.peer.on("disconnected", (err) => {
      if (this.connection) this.connection.close();
      this.connection = null;
      this.trigger("disconnect", err);
    });

    // retry if connection pending
    if (this.pendingConnection) {
      console.log("retrying connection");
      this.connect(this.pendingConnection);
    }
  }

  connect(name) {
    // close connection if we have one
    if (this.connection) {
      this.trigger("error", "already connected");
      return;
    }

    // if were not registered yet
    if (!this.peer) {
      // connect when we're registered
      this.on("registered", () => this.connect(name));
    }

    if (this.peer) {
      this.pendingConnection = name;

      // disallow connecting to ourself
      if (name === this.peer.id) {
        this.trigger("error", "cannot connect to yourself");
        return;
      }

      this.trigger("connect", name);
      let dataConnection = this.peer.connect(name);

      // success
      dataConnection.on("open", () => {
        this.connection = dataConnection;
        this.pendingConnection = null;
        this.trigger("connected", dataConnection);
        setTimeout((e) => {
          console.log(this.connection);
          this.connection.send("hello world inside");
        }, 1000);
      });

      dataConnection.on("close", () => {
        this.connection = null;
        this.pendingConnection = null;
        this.trigger("disconnect", dataConnection);
      });
    }
  }
}

const connector = new PeerConnector();
export default connector;
