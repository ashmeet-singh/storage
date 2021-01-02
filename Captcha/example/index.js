var express = require('express');
var app = express();
var port = 3000;
var Captcha = require('../index.js');
var bodyParser = require('body-parser');

var store = {};

app.use(express.static('./'));

app.use(express.static('../'));

app.use(bodyParser.json());

app.get('/refresh', function (req, res) {
    var c = Captcha.create(8);
    store[c.id] = c.symbols;
    res.json({ id: c.id, lines: c.lines });
});

app.post('/check', function (req, res) {
    if (store[req.body.id] === req.body.symbols)
        res.json({ result: "Right" });
    else {
        res.json({ result: "Wrong" });
    }
});

app.listen(port, function () {
    console.log(`App listening at ${port}`);
});
