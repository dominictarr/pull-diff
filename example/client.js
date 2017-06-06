var pull = require('pull-stream')
var toPull = require('stream-to-pull-stream')
var JSONDL = require('pull-json-doubleline')
var obv = require('obv')()
var Diff = require('../')

obv(console.log)

obv.once(console.log)

pull(
  toPull.duplex(require('net').connect(8000)),
//  toPull.sink(process.stdout)
  JSONDL.parse(),
  Diff.sink(obv)
)


