var CaptchaImageGenerator = {};

(function () {

    function forEachItem(array, F) {
        var l = array.length, i;
        for (i = 0; i < l; i++) { F(array[i], i, l); }
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

    function decompressLines(lines) {
        var l = lines.length, i, newLines = [];

        for (i = 0; i < l; i = i + 4) {
            newLines.push([{ x: lines[i], y: lines[i + 1] }, { x: lines[i + 2], y: lines[i + 3] }]);
        }

        return newLines;
    }

    Vector = {};

    Vector.create = function (x, y) {
        return { x: x || 0, y: y || 0 };
    };

    Vector.add = function (vectorA, vectorB, output) {
        if (!output) output = {};
        output.x = vectorA.x + vectorB.x;
        output.y = vectorA.y + vectorB.y;
        return output;
    };

    function translateLines(lines, translation) {

        forEachItem(lines, function (line) {
            Vector.add(line[0], translation, line[0]);
            Vector.add(line[1], translation, line[1]);
        });

        return lines;
    }

    var create = function (captcha, width, backgroundColor, textColor) {

        var cvs = document.createElement('canvas'),
            ctx = cvs.getContext("2d"),
            P = 0.1,
            lines = translateLines(decompressLines(captcha.lines), Vector.create(P, P)),
            bounds = getLinesBounds(lines);
        bounds.max.x += P;
        bounds.max.y += P;
        var linesRatio = bounds.max.x / bounds.max.y,
            W = width, H = W / linesRatio;

        cvs.style.width = W + 'px';
        cvs.style.height = H + 'px';
        cvs.width = W * 2;
        cvs.height = H * 2;

        ctx.fillStyle = backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        ctx.scale((W * 2) / bounds.max.x, (H * 2) / bounds.max.y);

        var l = lines.length,
            line,
            i;

        ctx.strokeStyle = textColor || '#000000';

        ctx.lineWidth = 0.1;

        for (i = 0; i < l; i++) {
            line = lines[i];
            ctx.beginPath();
            ctx.moveTo(line[0].x, line[0].y);
            ctx.lineTo(line[1].x, line[1].y);
            ctx.stroke();
        }

        return cvs.toDataURL('image/jpeg', 1.0);
    }

    CaptchaImageGenerator.create = create;

})();