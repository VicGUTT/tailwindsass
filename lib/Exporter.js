const $path = require('path');
const $fs   = require('fs-extra');

module.exports = class Exporter {
    #sourceDir = null;
    #outputDir = null;

    /**
     * @param {string} outputDir 
     * @param {string} sourceDir
     */
    constructor(outputDir = null, sourceDir = null) {
        this.#outputDir = outputDir;
        this.#sourceDir = sourceDir;

        if (!this.#outputDir) {
            throw Error('Please provide a valid output directory to which the SASS files should be exported.');
        }
        if (!this.#sourceDir) {
            throw Error('Please provide a valid source directory from which the SASS files should be imported.');
        }
    }

    /**
     * @param {string} config
     * @param {string|null} path
     */
    config(config, path = null) {
        if (!path) {
            path = `${this.#outputDir}/variables`;
        }

        path = `${path}/_config.scss`;

        this._ensureParentDirExists(path);

        $fs.writeFileSync(path, `$config: ${config};`);
    }

    /**
     * @param {string} config
     * @param {string|null} path
     */
    base(dist = null, src = null) {
        this._copy(dist, src, 'tailwindsass.scss');
    }

    /**
     * @param {string|null} dist
     * @param {string|null} src
     */
    variables(dist = null, src = null) {
        this._copy(dist, src, 'variables');
    }

    /**
     * @param {string|null} dist
     * @param {string|null} src
     */
    functions(dist = null, src = null) {
        this._copy(dist, src, 'functions');
    }

    /**
     * @param {string|null} dist
     * @param {string|null} src
     */
    mixins(dist = null, src = null) {
        this._copy(dist, src, 'mixins');
    }

    /**
     * @param {string|null} dist
     * @param {string|null} src
     * @param {string} path
     */
    _copy(dist = null, src = null, path) {
        if (!dist) {
            dist = `${this.#outputDir}/${path}`;
        }
        if (!src) {
            src = `${this.#sourceDir}/${path}`;
        }

        this._ensureParentDirExists(dist);
        this._ensureParentDirExists(src);

        $fs.copySync(src, dist);
    }

    /**
     * @param {string} path
     */
    _ensureParentDirExists(path) {
        $fs.ensureDirSync($path.dirname(path));
    }
};