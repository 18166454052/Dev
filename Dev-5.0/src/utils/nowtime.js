export function parseTime() {

  const format = '{y}-{m}-{d} {h}:{i}:{s}'
  let date = new Date()

  let y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    i = date.getMinutes(),
    s = date.getSeconds();
  // a: date.getDay()
  function formater(t) {
    if (t < 10) {
      return '0' + t;
    }
    return t;
  }
  const time_str = y + ':' + formater(m) + ':' + formater(d) + '-' + formater(h) + ':' + formater(i) + ':' + formater(s);
  return time_str
}
