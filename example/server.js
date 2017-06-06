var Obv = require('obv')
var obv = Obv() //use the Obv module to contain a changing data object.
var pull = require('pull-stream')
var Diff = require('../')

var createStream = Diff(obv)

obv.set({time: Date.now()})

//create a server...
var toPull = require('stream-to-pull-stream')
var JSONDL = require('pull-json-doubleline')

require('net').createServer(function (stream) {
  stream = toPull.duplex(stream)
  pull(createStream(), JSONDL.stringify(), stream)
}).listen(8000)

setInterval(function () {
  obv.set({
    time: Date.now(),
    mem: process.memoryUsage()
  })
}, 100)


