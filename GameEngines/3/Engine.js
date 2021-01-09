var Engine = {};

(function () {

    Engine.start = function (engine) {
        if (engine.time === undefined) { engine.time = Date.now(); }

        (function loop() {
            var time = Date.now();

            if (time > engine.time) {
                Engine.beforeTick(engine);
                while (time > engine.time) {
                    Engine.update(engine);
                    engine.time += engine.ms_per_update;
                }
                Engine.render(engine);
                Engine.afterTick(engine);
            }

            engine.frameRequestId = window.requestAnimationFrame(function () { loop(); });
        })();
    };

    Engine.stop = function (engine) {
        window.cancelAnimationFrame(engine.frameRequestId);
        engine.frameRequestId = undefined;
        engine.time = undefined;
    };

    Engine.create = function (options) {
        var engine = {
            frameRequestId: undefined,
            time: undefined,
            ms_per_update: 1000 / 60
        };

        return engine;
    };

    Engine.beforeTick = function (engine) { };

    Engine.update = function (engine) { };

    Engine.render = function (engine) { };

    Engine.afterTick = function (engine) { };

})();