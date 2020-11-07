const $path        = require('path');
const $fs          = require('fs-extra');
const TailwindSass = require('../../lib/TailwindSass');

const paths = {
    src: $path.resolve(__dirname + '/stubs'),
    dist: $path.resolve(__dirname + '/output'),
};

describe('TailwindSass.js', () => {
    beforeEach(() => {
        $fs.removeSync(paths.dist);
    });

    it('throws an error if no dist path is provided', () => {
        expect(() => new TailwindSass({}, { dist: null }).start()).toThrow('Please provide a valid output directory to which the SASS files should be exported.');
    });

    it('throws an error if no src path is provided', () => {
        expect(() => new TailwindSass({}, { dist: '/some/path', src: null }).start()).toThrow('Please provide a valid source directory from which the SASS files should be imported.');
    });

    it('exports all paths by default', () => {
        expect($fs.pathExistsSync(paths.dist)).toBe(false);

        new TailwindSass({}, { ...paths }).start();

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

        new TailwindSass({}, options).start();

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

        new TailwindSass({}, options).start();

        expect($fs.pathExistsSync(paths.dist)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/new-file-name.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/new-variables`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/new-variables/_config.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/new-functions/subfolder/_function.scss`)).toBe(true);
        expect($fs.pathExistsSync(`${paths.dist}/mixins/_mixin.scss`)).toBe(true);
    });

    it('exports and converts the provided config correctly', () => {
        const config = {
            key1: true,
            key2: [1, 2, 3],
            key3: {hey: 'hello'},
        };

        new TailwindSass(config, { ...paths }).start();

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