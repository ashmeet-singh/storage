var Events = {};

(function () {

    Events.on = function (target, name, callback) {
        if (target.events === undefined) { target.events = {}; }
        if (target.events[name] === undefined) { target.events[name] = []; }

        target.events[name].push(callback);
    };

    Events.off = function (target, name, callback) {
        if (target.events !== undefined && target.events[name] !== undefined) {
            var callbacks = target.events[name],
                newCallbacks = [],
                i;

            if (callback !== undefined) {
                for (i = 0; i < callbacks.length; i++) {
                    if (callbacks[i] !== callback) {
                        newCallbacks.push(callbacks[i]);
                    }
                }
            }

            target.events[name] = newCallbacks;
        }
    };

    Events.trigger = function (target, name, event) {
        if (target.events !== undefined && target.events[name] !== undefined) {
            var callbacks = target.events[name],
                i;

            for (i = 0; i < callbacks.length; i++) {
                callbacks[i](event);
            }
        }
    };

})();
