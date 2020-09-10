(function () {
  var addEvent = HTMLElement.prototype.addEventListener;

  function addEvents(el, event, cb, bubble) {
    addEvent.call(el, event, cb, bubble);
  }

  if (typeof window.CustomEvent !== "function") {
    var _CustomEvent = function _CustomEvent(event, params) {
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
    };

    window.CustomEvent = _CustomEvent;
  }

  HTMLElement.prototype.addEventListener = function (event, callback, bubble) {
    bubble = bubble || false;
    var interval;

    var __el = this;

    if (/longpress/.test(event)) {
      var longpressStart = function (e) {
        var _event_ = new CustomEvent("longpress", {
          detail: e.touches ? e.touches[0] : e,
        });

        _event_.delay = dur;
        interval = setTimeout(function () {
          e.target.dispatchEvent(_event_);
        }, dur);
      };
      function longpressEnd() {
        clearTimeout(interval);
      }
      var _ev = event.split("-");
      var isTouch =
        "ontouchstart" in window ||
        navigator.MaxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
      var dur = Number(_ev[1]) || 500;
      addEvents(__el, _ev[0], callback, bubble);
      if (isTouch) {
        addEvents(__el, "touchstart", longpressStart, bubble);
        addEvents(__el, "touchend", longpressEnd, bubble);
        addEvents(__el, "touchcancel", longpressEnd, bubble);
      } else {
        addEvents(__el, "mousedown", longpressStart, bubble);
        addEvents(__el, "mouseup", longpressEnd, bubble);
      }
    } else {
      addEvents(__el, event, callback, bubble);
    }
  };
  window.addEventListener = HTMLElement.prototype.addEventListener;
})();
