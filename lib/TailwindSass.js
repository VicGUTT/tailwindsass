const $path    = require('path');
const Exporter = require('./Exporter');
const jsToSass = require('./jsToSass');

module.exports = class TailwindSass {
    #config  = null;
    #options = {
        dist: null,
        src: $path.resolve($path.dirname(__dirname) + '/stubs'),
        base: true,
        variables: true,
        functions: true,
        mixins: true,
    };
    #export = null;

    /**
     * @param {object} config The Tailwind's full config object
     */
    constructor(config = {}, options = {}) {
        this.#config  = config;
        this.#options = { ...this.#options, ...options };
        this.#export  = new Exporter(this.#options.dist, this.#options.src);
    }

    start() {
        if (this.#options.base) {
            this.#export.base(this._extractPath(this.#options.base));
        }

        if (this.#options.variables) {
            this.#export.variables(this._extractPath(this.#options.variables));

            this.#export.config(
                jsToSass(this.#config),
                this._extractPath(this.#options.variables)
            );
        }

        if (this.#options.functions) {
            this.#export.functions(this._extractPath(this.#options.functions));
        }

        if (this.#options.mixins) {
            this.#export.mixins(this._extractPath(this.#options.mixins));
        }
    }

    _extractPath(value) {
        if (typeof value === 'string') {
            return value;
        }

        return null;
    }
};