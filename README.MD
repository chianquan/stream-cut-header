#stream-cut-header

Hep cut the header from a response or request stream  ,return the header-string and the left stream.
```js
var cutHeader=require('../index.js');

var fs = require('fs');
var simpleStream = fs.createReadStream(__dirname + '/stream_simple.txt');
cutHeader(simpleStream, function (err, header, stream) {
    console.log("header:"+header.toString());
    stream.on('data', function (trunk) {
        console.log("part of body:"+trunk.toString());
    });
});
```