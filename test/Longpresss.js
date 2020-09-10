(function () {
  const addEvent = HTMLElement.prototype.addEventListener;
  function addEvents(el, event, cb, bubble) {
    addEvent.call(el, event, cb, bubble);
  }
  if (typeof window.CustomEvent !== "function") {
    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: null,
      };
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      return evt;
    }
    window.CustomEvent = CustomEvent;
  }

  HTMLElement.prototype.addEventListener = function (event, callback, bubble) {
    bubble = bubble || false;
    let interval;
    const __el = this;
    if (/longpress/.test(event)) {
      const _ev = event.split("-");
      const dur = Number(_ev[1]) || 500;
      function longpressStart(e) {
        let _event_ = new CustomEvent("longpress", {
          detail: e.touches ? e.touches[0] : e,
        });
        _event_.duration = dur;

        interval = setTimeout(function () {
          e.target.dispatchEvent(_event_);
        }, dur);
        function longpressEnd() {
          clearTimeout(interval);
          __el.removeEventListener("touchend", longpressEnd);
          __el.removeEventListener("mousedown", longpressEnd);
          __el.removeEventListener("touchcancel", longpressEnd);
        }
        addEvents(__el, "touchend", longpressEnd, bubble);
        addEvents(__el, "touchcancel", longpressEnd, bubble);
        addEvents(__el, "mouseup", longpressEnd, bubble);
      }
      addEvents(__el, _ev[0], callback, bubble);
      addEvents(__el, "touchstart", longpressStart, bubble);
      addEvents(__el, "mousedown", longpressStart, bubble);
    } else {
      addEvents(__el, event, callback, bubble);
    }
  };
  window.addEventListener = HTMLElement.prototype.addEventListener;
})();
