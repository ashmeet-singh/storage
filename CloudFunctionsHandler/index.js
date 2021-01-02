function CloudFunctionsHandler(functions, store) {

    function isPlainObject(x) {
        return (Object.prototype.toString.call(x) === '[object Object]');
    }

    function isString(x) {
        return (typeof x === 'string');
    }

    return function (req, res) {
        var resString = 'Error!';
        try {
            if (isString(req.body)) {
                var body = JSON.parse(req.body);
                if (isPlainObject(body) && isString(body.f) && functions[body.f] !== undefined && isPlainObject(body.x)) {
                    var tempResString = functions[body.f](body.x, store);
                    if (isPlainObject(tempResString)) {
                        resString = JSON.stringify(tempResString);
                    }
                }
            }
        }
        catch (err) { }
        finally {
            res.type('text/plain');
            res.send(resString);
        }
    };
}

module.exports = CloudFunctionsHandler;