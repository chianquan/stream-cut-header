var EmptyStream = require('./libs/EmptySteam');
module.exports = parseHeader;
function parseHeader(stream, callback) {
    var header = [];
    var splitStrArr = ['\n\n', '\r\n\r\n'];
    var stop = false;
    var onReadable = function () {
        var chunk = stream.read();
        if (chunk === null) {
            return;
        }
        var match;
        var index = Infinity;
        for (var i = 0, len = splitStrArr.length; i < len; i++) {
            var splitStr = splitStrArr[i];
            var pos = chunk.indexOf(splitStr);
            if (pos > -1 && pos < index) {
                match = splitStr;
                index = pos;
            }
        }
        if (index === Infinity) {
            header.push(chunk);
            return onReadable();
        }
        //unshift will emit readable event ,so we have to removeListener first;
        stream.removeListener('readable', onReadable);
        header.push(chunk.slice(0, index));
        stream.unshift(chunk.slice(index + match.length));
        // }
        stop = true;
        stopAndReturn(stream);
    };
    var stopAndReturn = function (stream) {
        stream.removeAllListeners();
        callback(null, Buffer.concat(header), stream);
    };
    stream.on('end', function () {
        if (stop) {
            return;
        }
        stop = true;
        stopAndReturn(new EmptyStream());

    });
    stream.on('error', callback);
    // stream.on('readable', onReadable);
    /*
     *If use 'data' event ,then the return the stream 's need resume by yourself or
     *set the steam._readableState.flowing=null(No the standard API).
     *
     * readable not excuse in the nextTick
     */
    stream.on('readable', onReadable);

}