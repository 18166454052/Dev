function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}
export function unixTime(time, flag) {
  if (time <= 0) {
    return time
  }
  let unixtime = time
  let unixTimestamp = new Date(+unixtime)
  let Y = unixTimestamp.getFullYear()
  let M = ((unixTimestamp.getMonth() + 1) >= 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1))
  let D = (unixTimestamp.getDate() >= 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate())
  let H = (unixTimestamp.getHours() >= 10 ? unixTimestamp.getHours() : '0' + unixTimestamp.getHours())
  let m = (unixTimestamp.getMinutes() >= 10 ? unixTimestamp.getMinutes() : '0' + unixTimestamp.getMinutes())
  let S = (unixTimestamp.getSeconds() >= 10 ? unixTimestamp.getSeconds() : '0' + unixTimestamp.getSeconds())
  let toDay = Y + '-' + M + '-' + D
  if (!flag) {
    return toDay
  } else {
    return Y + ":" + M + ":" + D +  "-" + H + ":" + m + ":" + S
  }

}

/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [{
      value: 1E18,
      symbol: 'E'
    },
    {
      value: 1E15,
      symbol: 'P'
    },
    {
      value: 1E12,
      symbol: 'T'
    },
    {
      value: 1E9,
      symbol: 'G'
    },
    {
      value: 1E6,
      symbol: 'M'
    },
    {
      value: 1E3,
      symbol: 'k'
    }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function sliceTime(time) {
  if (time) { // undefined
    return time.slice(0, -2);
  }
}
export function status(status) {
  if (status == 0) {
    return '未激活';
  } else if (status == 1) {
    return '激活';
  }
}
export function operation(num) {
  if (num == 1) {
    return '发布';
  } else if (num == 2) {
    return '订阅';
  } else if (num == 3) {
    return '发布和订阅';
  } else {
    return '权限未知';
  }
}
export function online(online) {
  if (online == 0) {
    return '断线';
  } else if (online == 1) {
    return '在线';
  }
}
export function deploy(deploy) {
  if (deploy == 0) {
    return '未部署';
  } else if (deploy == 1) {
    return '已部署';
  } else if (deploy == -1) {
    return '部署失败';
  }
}
export function enable(enable) {
  if (enable == 0) {
    return '禁用';
  } else if (enable == 1) {
    return '启用';
  }
}
export function device(device) { //
  if (device == 1) {
    return 'Arduino';
  }
}

export function published(statue) { //
  if (statue == 0) {
    return '未发布';
  } else if (statue == 1) {
    return '已发布';
  }
}
export function effectiveDigits(num, count) {
  if (num >= 0) {
    if (typeof num !== 'string') {
      num = num.toString()
    }

    if (num.indexOf('.') == '-1') {
      return num
    } else {
      let count1
      if (count) {
        count1 = Number(count)
      } else {
        count1 = 3
      }

      let arr = num.toString().split('.');
      return arr[0] + '.' + arr[1].slice(0, count1)

    }
  }
}
export function countBytes(bytes) {
  // if (Number(bytes) < 1024) {
  //   return bytes + 'KB'
  // } else {
  //   return (bytes / 1024).toFixed(2) + 'MB'
  // }
  return bytes + 'kB'
}
