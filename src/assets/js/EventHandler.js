export default class EventHandler {
  constructor() {
    this.events = {};
  }

  on(events, callback) {
    if (typeof events === "string") {
      events = [events];
    }

    for (let event of events) {
      if (!this.events[event]) {
        this.events[event] = [];
      }

      this.events[event].push(callback);
    }
  }

  trigger(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(data);
      });
    }
  }
}
