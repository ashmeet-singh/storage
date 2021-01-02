var Captcha = {};

module.exports = Captcha;

(function () {

    var symbols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    var symbolsLines = {
        "A": [0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 2, 2, 0, 1, 2, 1],
        "B": [0, 0, 2, 0, 2, 0, 2, 2, 2, 2, 0, 2, 0, 2, 0, 0, 0, 1, 2, 1],
        "C": [2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2],
        "D": [0, 0, 2, 0, 2, 0, 2, 2, 2, 2, 0, 2, 1, 2, 1, 0],
        "E": [2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 0, 1, 2, 1],
        "F": [2, 0, 0, 0, 0, 0, 0, 2, 0, 1, 2, 1],
        "G": [2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2],
        "H": [0, 0, 0, 2, 2, 0, 2, 2, 0, 1, 2, 1],
        "I": [0, 0, 2, 0, 1, 0, 1, 2, 0, 2, 2, 2],
        "J": [0, 0, 2, 0, 1, 0, 1, 2, 1, 2, 0, 1],
        "K": [0, 0, 0, 2, 0, 1, 2, 0, 0, 1, 2, 2],
        "L": [0, 0, 0, 2, 0, 2, 2, 2],
        "M": [0, 2, 0, 0, 0, 0, 1, 1, 1, 1, 2, 0, 2, 0, 2, 2],
        "N": [0, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0],
        "O": [0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0],
        "P": [0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 2, 1, 2, 1, 0, 1],
        "Q": [1, 2, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2],
        "R": [0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 2, 1, 2, 1, 0, 1, 0, 1, 2, 2],
        "S": [2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 1, 2, 1, 2, 2, 2, 2, 0, 2],
        "T": [0, 0, 2, 0, 1, 0, 1, 2],
        "U": [0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0],
        "V": [0, 0, 1, 2, 1, 2, 2, 0],
        "W": [0, 0, 0, 2, 0, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0],
        "X": [0, 0, 2, 2, 2, 0, 0, 2],
        "Y": [0, 0, 1, 1, 1, 1, 2, 0, 1, 1, 1, 2],
        "Z": [0, 0, 2, 0, 2, 0, 0, 2, 0, 2, 2, 2]
    };


    function forEachItem(array, F) {
        var l = array.length, i;
        for (i = 0; i < l; i++) { F(array[i], i, l); }
    }

    var nextId = 1;

    function getNextId() { return 'I' + nextId++; }

    function getRndNum(min, max, scale) {
        if (scale === undefined) { scale = 0; }
        scale = Math.pow(10, scale);
        min *= scale;
        max *= scale;
        return (Math.floor(Math.random() * (max - min + 1)) + min) / scale;
    }

    function getRndItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function shuffleItems(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    var Vector = {};

    (function () {

        Vector.create = function (x, y) {
            return { x: x || 0, y: y || 0 };
        };

        Vector.clone = function (vector) {
            return { x: vector.x, y: vector.y };
        };

        Vector.magnitude = function (vector) {
            return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
        };

        Vector.add = function (vectorA, vectorB, output) {
            if (!output) output = {};
            output.x = vectorA.x + vectorB.x;
            output.y = vectorA.y + vectorB.y;
            return output;
        };

        Vector.sub = function (vectorA, vectorB, output) {
            if (!output) output = {};
            output.x = vectorA.x - vectorB.x;
            output.y = vectorA.y - vectorB.y;
            return output;
        };

        Vector.mult = function (vector, scalar) {
            return { x: vector.x * scalar, y: vector.y * scalar };
        };

        Vector.rotate = function (vector, angle, output) {
            var cos = Math.cos(angle), sin = Math.sin(angle);
            if (!output) output = {};
            var x = vector.x * cos - vector.y * sin;
            output.y = vector.x * sin + vector.y * cos;
            output.x = x;
            return output;
        };

    })();

    function compressLines(lines) {
        var newLines = [];

        forEachItem(lines, function (line) {
            newLines.push(line[0].x, line[0].y, line[1].x, line[1].y);
        });

        return newLines;
    }

    function decompressLines(lines) {
        var l = lines.length, i, newLines = [];

        for (i = 0; i < l; i = i + 4) {
            newLines.push([{ x: lines[i], y: lines[i + 1] }, { x: lines[i + 2], y: lines[i + 3] }]);
        }

        return newLines;
    }

    function translateLines(lines, translation) {

        forEachItem(lines, function (line) {
            Vector.add(line[0], translation, line[0]);
            Vector.add(line[1], translation, line[1]);
        });

        return lines;
    }

    function getLinesBounds(lines) {
        var min = { x: Infinity, y: Infinity },
            max = { x: -Infinity, y: -Infinity };

        function checkPoint(p) {
            if (p.x < min.x) { min.x = p.x; }
            if (p.y < min.y) { min.y = p.y; }
            if (p.x > max.x) { max.x = p.x; }
            if (p.y > max.y) { max.y = p.y; }
        }

        forEachItem(lines, function (line) {
            checkPoint(line[0]);
            checkPoint(line[1]);
        });

        return { min: min, max: max };
    }

    function cutLines(lines) {
        var newLines = [],
            v1, v2,
            minLineLength = 0.01;

        forEachItem(lines, function (line) {
            v1 = Vector.sub(line[1], line[0]);
            if (Vector.magnitude(v1) <= minLineLength * 3) {
                newLines.push([Vector.clone(line[0]), Vector.clone(line[1])]);
            } else {
                v2 = Vector.add(Vector.mult(v1, getRndNum(1 / 3, 2 / 3, 3)), line[0]);
                newLines.push(
                    [Vector.clone(line[0]), Vector.clone(v2)],
                    [Vector.clone(v2), Vector.clone(line[1])]
                );
            }
        });

        if (newLines.length === lines.length) {
            return newLines;
        }

        return cutLines(newLines);
    }

    function applySinFunction(lines) {
        var bounds = getLinesBounds(lines),
            wavelength = getRndNum(1.5, 2.5, 3),
            amplitude = getRndNum(1.5, 2.5, 3),
            shift = getRndNum(0, 1000, 6);

        translateLines(lines, Vector.create(0 - bounds.min.x, 0 - bounds.min.y - ((bounds.max.y - bounds.min.y) * 0.5)));

        forEachItem(lines, function (line) {
            line[0].y += Math.sin((line[0].x + shift) / wavelength) * amplitude;
            line[1].y += Math.sin((line[1].x + shift) / wavelength) * amplitude;
        });

        return lines;
    }

    function addSymbols(lines, count, margin) {
        var newSymbols = "",
            symbol,
            symbolLines,
            translation,
            i;
        for (i = 0; i < count; i++) {
            symbol = getRndItem(symbols);
            symbolLines = decompressLines(symbolsLines[symbol]);

            translation = Vector.create((i * (2 + margin)) + getRndNum(0.1, margin - 0.1, 3), getRndNum(0, margin, 3));

            forEachItem(symbolLines, function (line) {
                Vector.add(line[0], translation, line[0]);
                Vector.add(line[1], translation, line[1]);
                lines.push(line);
            });

            newSymbols += symbol;
        }

        return newSymbols;
    }

    function addNoise(lines, symbolsCount) {
        var count = symbolsCount * 500,
            noiseLines = [],
            line, vector, translation,
            bounds = getLinesBounds(lines);

        while (count > 0) {
            line = getRndItem(lines);
            vector = Vector.sub(line[1], line[0]);
            translation = Vector.create(getRndNum(bounds.min.x, bounds.max.x, 3), getRndNum(bounds.min.y, bounds.max.y, 3));
            noiseLines.push([translation, Vector.add(Vector.mult(Vector.rotate(vector, getRndNum(0, Math.PI * 2, 3)), getRndNum(0.9, 1.1, 3)), translation)]);
            count--;
        }

        noiseLines = cutLines(noiseLines);

        forEachItem(noiseLines, function (line) {
            lines.push(line);
        });

        return lines;
    }

    function arrangeLines(lines) {
        var bounds = getLinesBounds(lines);

        translateLines(lines, Vector.create(0 - bounds.min.x, 0 - bounds.min.y));

        return lines;
    }

    function applyFilter(lines) {
        return lines.filter(function () { return Math.random() < 0.5 });
    }

    function addRndLines(lines) {
        var bounds = getLinesBounds(lines),
            count = getRndNum(3, 4);

        while (count > 0) {
            lines.push([Vector.create(getRndNum(bounds.min.x, bounds.max.x, 3), getRndNum(bounds.min.y, bounds.max.y, 3)),
            Vector.create(getRndNum(bounds.min.x, bounds.max.x, 3), getRndNum(bounds.min.y, bounds.max.y, 3))]);
            count--;
        }

        return cutLines(lines);
    }

    function create(symbolsCount) {
        var newLines = [],
            margin = getRndNum(0.5, 0.75, 3),
            newSymbols = addSymbols(newLines, symbolsCount, margin);

        newLines = compressLines(shuffleItems(arrangeLines(addNoise(applyFilter(addRndLines(arrangeLines(applySinFunction(cutLines(newLines))))), symbolsCount))));

        return {
            id: getNextId(),
            lines: newLines,
            symbols: newSymbols
        };
    }

    Captcha.create = create;

})();