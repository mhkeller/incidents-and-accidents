/* --------------------------------------------
 *
 * Underscore's debounce function
 *
 * --------------------------------------------
 */
var now = Date.now || function () { return new Date().getTime(); };

module.exports = function debounce (func, wait, immediate) {
  var timeout;
  var args;
  var context;
  var timestamp;
  var result;

  var later = function () {
    var last = now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function debouncer () {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};
