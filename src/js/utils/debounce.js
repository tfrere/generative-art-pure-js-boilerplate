export function debounce(fun, delay) {
  let time;
  return function (args) {
    if (time) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      fun(args);
    }, delay);
  };
}
