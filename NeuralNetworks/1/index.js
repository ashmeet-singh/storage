var neuralNetwork = (function () {

    var THIS = {
        getLayerOutput: function (input, weights, biases) {
            var output = [],
                i1, i2,
                l1 = weights.length,
                l2 = input.length;

            for (i1 = 0; i1 < l1; i1++) {
                for (i2 = 0; i2 < l2; i2++) {
                    output[i1] = input[i2] * weights[i1][i2];
                };
                output[i1] += biases[i1];
                if (output[i1] < 0) { output[i1] = 0; };
            };

            return output;
        },

        getLayersOutput: function (input, layers) {
            var i, l = layers.length, output;

            output = THIS.getLayerOutput(input, layers[0].weights, layers[0].biases);
            for (i = 1; i < l; i++) {
                output = THIS.getLayerOutput(output, layers[i].weights, layers[i].biases);
            };

            return output;
        },

        randomNumberDecimal: 1000,

        getRandomNumber: function (min, max, decimal) {
            if (decimal === undefined) { decimal = THIS.randomNumberDecimal; };
            min *= decimal;
            max *= decimal;
            return ((Math.floor(Math.random() * (max - min + 1)) + min) / decimal);
        },

        getRandomNumbersArray: function (min, max, length) {
            var newArray = [], i;

            for (i = 0; i < length; i++) {
                newArray[i] = THIS.getRandomNumber(min, max);
            };

            return newArray;
        },

        createLayer: function (inputs, outputs, weightsMin, weightsMax, biasesMin, biasesMax) {
            var newLayer = {}, i;

            newLayer.biases = THIS.getRandomNumbersArray(biasesMin, biasesMax, outputs);

            newLayer.weights = [];
            for (i = 0; i < outputs; i++) {
                newLayer.weights[i] = THIS.getRandomNumbersArray(weightsMin, weightsMax, inputs);
            };

            return newLayer;
        },

        create: function (layersDesign, weightsMin, weightsMax, biasesMin, biasesMax) {
            var i, newNetwork = [];

            for (i = 0; i < layersDesign.length - 1; i++) {
                newNetwork[i] = THIS.createLayer(layersDesign[i], layersDesign[i + 1], weightsMin, weightsMax, biasesMin, biasesMax);
            };

            return newNetwork;
        },

        getOutput: function (input, network) {
            return THIS.getLayersOutput(input, network);
        },

        changeRandomly: function (network, weightsMin, weightsMax, biasesMin, biasesMax) {
            network = JSON.parse(JSON.stringify(network));
            var i1, i2, i3, l1, l2, l3;
            l1 = network.length;
            for (i1 = 0; i1 < l1; i1++) {
                l2 = network[i1].weights.length;
                for (i2 = 0; i2 < l2; i2++) {
                    l3 = network[i1].weights[i2].length;
                    for (i3 = 0; i3 < l3; i3++) {
                        network[i1].weights[i2][i3] += THIS.getRandomNumber(weightsMin, weightsMax);
                    };
                };

                l2 = network[i1].biases.length;
                for (i2 = 0; i2 < l2; i2++) {
                    network[i1].biases[i2] += THIS.getRandomNumber(biasesMin, biasesMax);
                };
            };
        }
    };

    return THIS;
})();