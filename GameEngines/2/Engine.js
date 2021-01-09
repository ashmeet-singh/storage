var Engine = {};

(function () {

    Engine.create = function () {
        var engine = {
            frameRequestId: undefined,
            time: undefined,
            ms_per_update: 1000 / 60
        };

        return engine;
    };

    Engine.start = function (engine) {
        if (engine.time === undefined) { engine.time = Date.now(); }

        (function loop() {
            var time = Date.now();
            var isUpdateRequired = (time > engine.time);

            if (isUpdateRequired) {
                Events.trigger(engine, 'beforeTick', engine);
            }

            while (time > engine.time) {
                Events.trigger(engine, 'beforeUpdate', engine);
                Events.trigger(engine, 'update', engine);
                Events.trigger(engine, 'afterUpdate', engine);
                engine.time += engine.ms_per_update;
            }

            if (isUpdateRequired) {
                Events.trigger(engine, 'beforeRender', engine);
                Events.trigger(engine, 'render', engine);
                Events.trigger(engine, 'afterRender', engine);
                Events.trigger(engine, 'afterTick', engine);
            }

            engine.frameRequestId = window.requestAnimationFrame(function () { loop(); });
        })();
    };

    Engine.stop = function (engine) {
        window.cancelAnimationFrame(engine.frameRequestId);
        engine.frameRequestId = undefined;
        engine.time = undefined;
    };

})();