
function isObject(o) {
  return o && 'object' === typeof o
}

exports.diff = function (was, now) {
  if(!isObject(now))
    return now === was ? undefined : now

  if(was == null || now == null) return now

  var diff = {}, changed = false
  for(var k in now) {
    if(null === now[k]) {
      changed = true
      diff[k] = null
    }
    else if(isObject(now[k]) == isObject(was[k])) {
      var v = exports.diff(was[k], now[k])
      if(v !== undefined) {
        changed = true
        diff[k] = v
      }
    }
    else if(now[k] !== was[k]) {
      changed = true
      diff[k] = now[k]
    }
  }
  for(var k in was) {
    if(now[k] == undefined) {
      changed = true
      diff[k] = null
    }
  }
  if(!changed) return undefined
  return diff
}

exports.patch = function (obj, patch) {
  if(!isObject(patch) || !isObject(obj))
    return patch

  for(var k in patch)
    if(patch[k] === null)
      delete obj[k]
    else if(isObject(patch[k]))
        obj[k] = exports.patch(obj[k], patch[k])
    else
      obj[k] = patch[k]
  return obj
}



