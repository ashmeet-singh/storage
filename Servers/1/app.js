var express = require('express');
var app = express();
var port = 3000;

app.use(express.static('public'));

var server = app.listen(port, function () {
    console.log(`App listening at ${port}`);
});

process.on('SIGINT', function () {
    console.log('Closing app');
    server.close(function () {
        console.log('App closed');
    });
});