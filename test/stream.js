
var tape = require('tape')
var Obv = require('obv')
var pull = require('pull-stream')
var Diff = require('../')

var data = require('./data.json')

tape('simple', function (t) {
  var obv = Obv()
  var source = Diff.source(obv)()
  var sink = Diff.sink(function (err) {
    if(err) throw err
  })

  var i = 0
  sink.obv(function (value) {
    if(i < data.length) {
      t.deepEqual(value, data[i++])
      obv.set(data[i])
    }

    if(i === data.length)
      t.end()
  })

  pull(source, pull.through(console.log), sink)

  obv.set(data[0])
})












