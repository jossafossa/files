import EventHandler from "./EventHandler.js";

class ChatSystem {
  constructor() {
    this.events = new EventHandler();
    this.on = this.events.on.bind(this.events);
    this.trigger = this.events.trigger.bind(this.events);
  }

  setConnection(connection) {
    this.peer = connection.peer;
    this.connection = connection;

    // setup disconnect event
    this.connection.on("close", () => this.disconnected());

    // set data connection event
    this.connection.on("data", (data) => this.data(data));
  }

  disconnected() {
    // this.peer.reconnect();
    this.trigger("disconnected");
  }

  data(data) {
    this.trigger("data", data);
  }

  sendMessage(message) {
    this.connection.send(message);
    this.trigger("message", message);
  }
}

export default new ChatSystem();
