export default class ScrollDown {
  constructor(element) {
    console.log(element);
    const config = { childList: true };

    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log("A child node has been added or removed.");
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(element, config);
  }
}
