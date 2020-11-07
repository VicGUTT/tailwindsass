const plugin       = require('tailwindcss/plugin');
const TailwindSass = require('./TailwindSass');

module.exports = function (options) {
    return plugin(function ({ config }) {
        new TailwindSass(config(), options).start();
    });
};