const $path  = require('path');
const $fs    = require('fs-extra');
const plugin = require('../../lib');
const config = require('../../tailwind.config');

const paths = {
    src: $path.resolve(__dirname + '/stubs'),
    dist: $path.resolve(__dirname + '/output'),
};

describe('lib/index.js', () => {
    beforeEach(() => {
        $fs.removeSync(paths.dist);
    });

    it('is a TailwindCSS plugin function', () => {
        expect(typeof plugin === 'function').toBe(true);
        expect(typeof plugin().handler === 'function').toBe(true);
    });

    it('exports all paths by default', () => {
        expect($fs.pathExistsSync(paths.dist)).toBe(false);

        plugin({ ...paths }).handler({ config: () => config });

        expect($fs.pathExistsSync(paths.dist)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/tailwindsass.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/variables`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/variables/_config.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/functions/_function.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/mixins/_mixin.scss`)).toBe(true);
    });

    it('does not export disabled paths', () => {
        expect($fs.pathExistsSync(paths.dist)).toBe(false);

        const options = {
            ...paths,
            base: false,
            variables: false,
            functions: true,
            mixins: false,
        };

        plugin(options).handler({ config: () => config });

        expect($fs.pathExistsSync(paths.dist)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/tailwindsass.scss`)).toBe(false);
        expect($fs.pathExistsSync(`${paths.dist}/variables`)).toBe(false);
        expect($fs.pathExistsSync(`${paths.dist}/variables/_config.scss`)).toBe(false);
        expect($fs.pathExistsSync(`${paths.dist}/functions/_function.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/mixins/_mixin.scss`)).toBe(false);
    });

    it('used the provided path to export its files', () => {
        expect($fs.pathExistsSync(paths.dist)).toBe(false);

        const options = {
            ...paths,
            base: `${paths.dist}/new-file-name.scss`,
            variables: `${paths.dist}/new-variables`,
            functions: `${paths.dist}/new-functions/subfolder`,
        };

        plugin(options).handler({ config: () => config });

        expect($fs.pathExistsSync(paths.dist)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/new-file-name.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/new-variables`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/new-variables/_config.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/new-functions/subfolder/_function.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/mixins/_mixin.scss`)).toBe(true);
    });

    it('exports and converts the provided config correctly', () => {
        const _config = {
            key1: true,
            key2: [1, 2, 3],
            key3: { hey: 'hello' },
        };

        plugin({ ...paths }).handler({ config: () => _config });

        const content = $fs.readFileSync(`${paths.dist}/variables/_config.scss`, 'utf8');

        const expected = `$config: (
    "key1": true,
    "key2": (1, 2, 3),
    "key3": (
        "hey": hello
    )
);`;

        expect(content).toBe(expected);
    });
});