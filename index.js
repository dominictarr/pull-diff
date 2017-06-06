var Obv = require('obv')
var D = require('./diff')

function isObject (o) {
  return o && 'object' === typeof o
}

function clone (obj) {
  if(!isObject(obj)) return obj
  var _obj = {}
  for(var k in obj)
    _obj[k] = clone(obj[k])
  return _obj
}


module.exports = function (obv) {
  var ready = false, waiting = []
  obv(function (value) {
    var l = waiting.length
    while(l--)
      waiting.shift()(value)
  })
  return function createSource () {
    var value = obv.value, _value
    return function (abort, cb) {
      if(abort) {
        remove && remove()
        return cb(abort)
      }
      else {
        if(_value == null) {
          obv.once(function (value) {
            cb(null, _value = value)
          })
        } else {
          obv.once(function next (value) {
            var patch = D.diff(_value, value)
            if(patch != null) {
              _value = clone(value)
              cb(null, patch)
            } else {
              waiting.push(next)
            }
          })
        }
      }
    }
  }
}

module.exports.sink = function (obv, cb) {
  var value
  function sink(read) {
    read(null, function next (err, patch) {
      if(err) return cb && cb(err === true ? null : err)
      value = D.patch(value, patch)
      obv.set(value)
      read(null, next)
    })
  }
  sink.obv = obv
  return sink
}






