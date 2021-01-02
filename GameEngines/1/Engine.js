var Engine = {};

(function () {

    Engine.create = function () {
        var engine = {
            frameRequestId: undefined,
            sceneSwitch: undefined,
            scenes: {},
            storage: {}
        };

        Engine.switchScene(engine, 'scene');

        return engine;
    };

    Engine.update = function (engine, ms_per_update) {
        var sceneSwitch = engine.sceneSwitch,
            scene = engine.scenes[sceneSwitch],
            timing = scene.timing;

        if (timing.previous === undefined) { timing.previous = Date.now(); }
        timing.current = Date.now();
        timing.elapsed = timing.current - timing.previous;
        if (timing.lag === undefined) { timing.lag = 0; }
        timing.lag += timing.elapsed;
        if (ms_per_update === undefined) { timing.ms_per_update = 1000 / 60; }
        else { timing.ms_per_update = ms_per_update; }

        var bodies = scene.bodies,
            storage = engine.storage,
            i, body;

        function getEventArg1() {
            return { engine: engine, scene: scene, timing: timing, bodies: bodies, storage: storage };
        }

        function getEventArg2() {
            return { scene: scene, timing: timing, bodies: bodies, storage: storage, body: body, bodyIndex: i };
        }

        Events.trigger(engine, 'beforeTick', getEventArg1());

        var isSceneUpdated = false;
        while (timing.lag >= timing.ms_per_update) {
            Events.trigger(scene, 'beforeUpdate', getEventArg1());
            for (i = 0; i < bodies.length; i++) {
                body = bodies[i];
                Events.trigger(body, 'update', getEventArg2());
            }
            Events.trigger(scene, 'afterUpdate', getEventArg1());
            timing.lag -= timing.ms_per_update;
            isSceneUpdated = true;
        }

        if (isSceneUpdated) {
            Events.trigger(scene, 'beforeRender', getEventArg1());
            for (i = 0; i < bodies.length; i++) {
                body = bodies[i];
                Events.trigger(body, 'render', getEventArg2());
            }
            Events.trigger(scene, 'afterRender', getEventArg1());
        }

        Events.trigger(engine, 'afterTick', getEventArg1());

        timing.previous = timing.current;
        timing.current = undefined;
        timing.elapsed = undefined;
    };

    Engine.start = function (engine, ms_per_update) {
        (function loop() {
            Engine.update(engine, ms_per_update);
            engine.frameRequestId = window.requestAnimationFrame(function () { loop(); });
        })();
    };

    Engine.stop = function (engine) {
        window.cancelAnimationFrame(engine.frameRequestId);
        Engine.resetTiming(engine);
        engine.frameRequestId = undefined;
    };

    Engine.addScene = function (engine, name) {
        var newScene = {
            timing: { previous: undefined, current: undefined, elapsed: undefined, lag: undefined, ms_per_update: undefined },
            bodies: []
        };

        engine.scenes[name] = newScene;

        return newScene;
    };

    Engine.resetTiming = function (engine) {
        if (engine.sceneSwitch !== undefined) {
            engine.scenes[engine.sceneSwitch].timing = { previous: undefined, current: undefined, elapsed: undefined, lag: undefined, ms_per_update: undefined }
        };
    };

    Engine.switchScene = function (engine, name) {
        Engine.resetTiming(engine);

        if (engine.scenes[name] === undefined) {
            Engine.addScene(engine, name);
        }

        engine.sceneSwitch = name;

        return engine.scenes[name];
    };

    Engine.addBody = function (engine) {
        var body = {};
        engine.scenes[engine.sceneSwitch].bodies.push(body);
        return body;
    };

})();