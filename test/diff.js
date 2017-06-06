
var D = require('../diff')
var tape = require('tape')

var objects = require('./data.json')

function clone (o) {
  return JSON.parse(JSON.stringify(o))
}

tape('simple', function (t) {
  for(var k in objects) {
    //diff of itself is nothing
    t.equal(D.diff(objects[k], objects[k]), undefined, 'diff of itself is undefined')
    for(var j in objects) {
      var p = D.diff(objects[k], objects[j])
      if(p !== undefined) {
        t.deepEqual(D.patch(clone(objects[k]), p), objects[j], 'apply patch:'+JSON.stringify(p)+ ' to:'+JSON.stringify(objects[k]))
      }
      else
        t.equal(k, j)
    }
  }
  t.end()
})



