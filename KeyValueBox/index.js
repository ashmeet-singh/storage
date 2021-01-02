var KeyValueBox = {};

var fs = require('fs');
var crypto = require('crypto');

(function () {

    KeyValueBox.create = function (settings) {
        var box = {};

        var filePath = settings.filePath;
        var keySize = settings.keySize;
        var valueSize = settings.valueSize;
        var blockSize = keySize + valueSize;
        var keySalt = settings.keySalt;

        function getBlockPositionInAllClusters(key) {
            var keyHash = crypto.createHash('sha256').update(Buffer.concat([key, keySalt], key.length + keySalt.length)).digest('hex');
            var blockIndex = parseInt(keyHash.substr(56, 8), 16);
            var clusterSize;
            var clusterMaxPosition;
            var clusterOffset = 0;
            var clusterIndex;
            var positions = [];
            for (clusterIndex = 0; clusterIndex < 16; clusterIndex++) {
                clusterSize = Math.pow(2, 12 + clusterIndex);
                clusterMaxPosition = clusterSize - 1;
                positions[clusterIndex] = (((blockIndex & clusterMaxPosition) + clusterOffset) * blockSize) + 1024;
                clusterOffset += clusterSize;
            };
            return positions;
        }

        box.set = function (key, value) {
            var blockPosition;
            var positions = getBlockPositionInAllClusters(key);
            var emptyBuffer = Buffer.alloc(blockSize);
            var tempBuffer;
            var fd = fs.openSync(filePath, 'r+');
            var stats = fs.fstatSync(fd);
            var i;
            for (i = 0; i < positions.length; i++) {
                if (positions[i] >= stats.size) {
                    blockPosition = positions[i];
                    break;
                };
                tempBuffer = Buffer.alloc(blockSize);
                fs.readSync(fd, tempBuffer, 0, tempBuffer.length, positions[i]);
                if (emptyBuffer.equals(tempBuffer) === true || key.equals(tempBuffer.subarray(0, key.length)) === true) {
                    blockPosition = positions[i];
                    break;
                };
            };
            if (blockPosition !== undefined) {
                tempBuffer = Buffer.concat([key, value], blockSize);
                fs.writeSync(fd, tempBuffer, 0, tempBuffer.length, blockPosition);
                fs.closeSync(fd);
                return true;
            };
            fs.closeSync(fd);
            return false;
        };

        box.get = function (key) {
            var blockPosition;
            var positions = getBlockPositionInAllClusters(key);
            var tempBuffer;
            var fd = fs.openSync(filePath, 'r');
            var stats = fs.fstatSync(fd);
            var i;
            for (i = 0; i < positions.length; i++) {
                if (positions[i] >= stats.size) {
                    break;
                };
                tempBuffer = Buffer.alloc(blockSize);
                fs.readSync(fd, tempBuffer, 0, tempBuffer.length, positions[i]);
                if (key.equals(tempBuffer.subarray(0, key.length)) === true) {
                    blockPosition = positions[i];
                    break;
                };
            };
            fs.closeSync(fd);
            var value;
            if (blockPosition !== undefined) {
                value = tempBuffer.subarray(keySize, blockSize);
            };
            return value;
        };

        box.exists = function (key) {
            var blockPosition;
            var positions = getBlockPositionInAllClusters(key);
            var tempBuffer;
            var fd = fs.openSync(filePath, 'r');
            var stats = fs.fstatSync(fd);
            var i;
            for (i = 0; i < positions.length; i++) {
                if (positions[i] >= stats.size) {
                    break;
                };
                tempBuffer = Buffer.alloc(keySize);
                fs.readSync(fd, tempBuffer, 0, tempBuffer.length, positions[i]);
                if (key.equals(tempBuffer) === true) {
                    blockPosition = positions[i];
                    break;
                };
            };
            fs.closeSync(fd);
            if (blockPosition !== undefined) {
                return true;
            };
            return false;
        };

        box.remove = function (key) {
            var blockPosition;
            var positions = getBlockPositionInAllClusters(key);
            var tempBuffer;
            var fd = fs.openSync(filePath, 'r+');
            var stats = fs.fstatSync(fd);
            var i;
            for (i = 0; i < positions.length; i++) {
                if (positions[i] >= stats.size) {
                    break;
                };
                tempBuffer = Buffer.alloc(keySize);
                fs.readSync(fd, tempBuffer, 0, tempBuffer.length, positions[i]);
                if (key.equals(tempBuffer) === true) {
                    blockPosition = positions[i];
                    break;
                };
            };
            if (blockPosition !== undefined) {
                var emptyBuffer = Buffer.alloc(blockSize);
                fs.writeSync(fd, emptyBuffer, 0, emptyBuffer.length, blockPosition);
                fs.closeSync(fd);
                return true;
            };
            fs.closeSync(fd);
            return false;
        };

        return box;
    };
})();

module.exports = KeyValueBox;