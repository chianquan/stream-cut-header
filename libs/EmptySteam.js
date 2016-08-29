var steam = require('stream');
var Readable = steam.Readable;
var util = require('util');
module.exports = EmptyStream;
util.inherits(EmptyStream, Readable);
function EmptyStream() {
    Readable.call(this);
}
EmptyStream.prototype._read=function(){
    this.push(null);
}