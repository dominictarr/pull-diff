# pull-diff

stream changes to an object.

lets say we have an object that contains state about a running
application. It might tell us about how many peer connections there
are, how much bandwidth or memory is in use, how many database
requests there have been in the last few seconds, various indicators,
meters or progress statuses. maybe it tells us the GPS coordinates
and heading of our robot sailboat or etc etc blah blah blah.

We _probably_ want to send that data to a app/web ui so that we
can see what our stuff is doing as it happens.
Probably, we are currently doing this in some ad hoc way, a combination
of polling, or update streams in various places!
This module fixes all that!

``` js
//see example/server.js for runnable code

var obv = Obv() //use the Obv module to contain a changing data object.
var createStream = Diff(obv)

//create a server...
var toPull = require('stream-to-pull-stream')
var JSONDL = require('pull-json-doubleline')

require('net').createServer(function (stream) {
  pull(createStream(), JSONDL.stringify(), toPull.duplex(stream))
}).listen(8000)

setInterval(function () {
  obv.set({
    time: Date.now(),
    mem: process.memoryUsage()
  })
}, 1000)

```

and then a client...

``` js
var pull = require('pull-stream')
var toPull = require('stream-to-pull-stream')
var JSONDL = require('pull-json-doubleline')
var obv = require('obv')()
var Diff = require('../')

obv(console.log)

pull(
  toPull.duplex(require('net').connect(8000)),
  JSONDL.parse(),
  Diff.sink(obv)
)
```
you'll see a lot of output like:

```
{ time: 1496743052633,
  mem: 
   { rss: 27910144,
     heapTotal: 6209536,
     heapUsed: 4429176,
     external: 16964 } }
```
and you'll notice that it's the heapUsed that changes
most frequently! (if you watch long enough, it'll go down too
-- garbage collection)

if you view the raw data with telnet you'll see that after
the first item it only sends the changed data!
this doesn't make much difference here, but it will if
your status object is quite large!

```
> telnet localhost 8000
{
  "time": 1496743204196,
  "mem": {
    "rss": 28450816,
    "heapTotal": 6209536,
    "heapUsed": 4527744,
    "external": 30228
  }
}

{
  "time": 1496743204297,
  "mem": {
    "rss": 28459008,
    "heapTotal": 7258112,
    "heapUsed": 4696720
  }
}

{
  "time": 1496743204399,
  "mem": {
    "heapUsed": 4713408
  }
}

...
```

## License

MIT

