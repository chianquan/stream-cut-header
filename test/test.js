var assert = require('assert');
var cutHeader = require('../index.js');
var fs = require('fs');
var simpleStream = fs.createReadStream(__dirname + '/stream_simple.txt');
var headStream = fs.createReadStream(__dirname + '/onlyHead.txt');
var emptyStream = fs.createReadStream(__dirname + '/empty.txt');
describe('Cut Stream header', function () {
    it('Simple stream should return head `head Content` and body `body Content`!', function (done) {
        cutHeader(simpleStream, function (err, header, stream) {
            stream.on('data', function (trunk) {
                assert.equal(header.toString(), 'head Content');
                assert.equal(trunk.toString(), 'body Content');
                done();
            });
        });
    });
    it('Empty stream should return Empty header buffer and empty stream!', function (done) {
        cutHeader(emptyStream, function (err, header, stream) {
            assert.equal(header.toString(),'');
            var hasTriData = false;
            stream.on('data', function () {
                hasTriData = true;
            });
            stream.on('end', function () {
                if (hasTriData) {
                    done(new Error('It should not trigger'));
                } else {
                    done();
                }
            });
        });
    });
    it('OnlyHead stream should return common header buffer and empty stream!', function (done) {
        cutHeader(headStream, function (err, header, stream) {
            assert.equal(header.toString(),'head Content');
            var hasTriData = false;
            stream.on('data', function () {
                hasTriData = true;
            });
            stream.on('end', function () {
                if (hasTriData) {
                    done(new Error('It should not trigger'));
                } else {
                    done();
                }
            });
        });
    });
});

