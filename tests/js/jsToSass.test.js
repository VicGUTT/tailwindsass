const jsToSass = require('../../lib/jsToSass');

describe('jsToSass.js', () => {
    it('returns nullish values as null', () => {
        const object = {
            key1: null,
            key2: 'null',
            key3: undefined,
            key4: 'undefined',
        };
const expected = `(
    "key1": null,
    "key2": null,
    "key3": null,
    "key4": null
)`;
        const actual = jsToSass(object);
        
        expect(actual).toBe(expected);
    });


    it('returns boolean and numeric values as is', () => {
        const object = {
            key1: true,
            key2: false,
            key3: -1,
            key4: 0,
            key5: 1,
        };
const expected = `(
    "key1": true,
    "key2": false,
    "key3": -1,
    "key4": 0,
    "key5": 1
)`;
        const actual = jsToSass(object);
        
        expect(actual).toBe(expected);
    });


    it('handles and normalizes string values correctly', () => {
        const object = {
            key1: '#f7fafc',
            key2: '1280px',
            key3: 'spin 1s linear infinite',
            key4: '0 0 0 1px rgba(0, 0, 0, 0.05)',
            key5: 'currentColor',
            key6: 'span 1 / span 1',
            key7: '',
        };
const expected = `(
    "key1": #f7fafc,
    "key2": 1280px,
    "key3": spin 1s linear infinite,
    "key4": "0 0 0 1px rgba(0, 0, 0, 0.05)",
    "key5": currentColor,
    "key6": span 1 / span 1,
    "key7": ""
)`;
        const actual = jsToSass(object);
        
        expect(actual).toBe(expected);
    });


    it('converts arrays into SASS lists', () => {
        const object = {
            key1: [],
            key2: ['#f7fafc', '1280px', 'span 1 / span 1'],
            key3: [['#f7fafc', '1280px', 'span 1 / span 1']],
            key4: ['#f7fafc', ['1280px', 'span 1 / span 1']],
            key5: [[['currentColor'], '0 0 0 1px rgba(0, 0, 0, 0.05)']],
        };
const expected = `(
    "key1": (),
    "key2": (#f7fafc, 1280px, span 1 / span 1),
    "key3": ((#f7fafc, 1280px, span 1 / span 1)),
    "key4": (#f7fafc, (1280px, span 1 / span 1)),
    "key5": (((currentColor), "0 0 0 1px rgba(0, 0, 0, 0.05)"))
)`;
        const actual = jsToSass(object);
        
        expect(actual).toBe(expected);
    });


    it('converts objects into SASS maps', () => {
        const object = {
            key1: {key1: []},
            key2: {key1: {subKey: {}}},
            key3: {key1: [{subKey: []}]},
            key4: {key1: {subKey: {1: null, 2: 'some-val_ue'}}},
            key5: {
                key1: '#f7fafc',
                key2: {
                    key1: '0 0 0 1px rgba(0, 0, 0, 0.05)',
                    key2: {
                        key1: ['#f7fafc', ['1280px', 'span 1 / span 1']],
                        key2: '1280px',
                        key3: 'spin 1s linear infinite',
                        key7: '',
                    },
                },
            },
        };
const expected = `(
    "key1": (
        "key1": ()
    ),
    "key2": (
        "key1": (
            "subKey": (
                
            )
        )
    ),
    "key3": (
        "key1": ((
            "subKey": ()
        ))
    ),
    "key4": (
        "key1": (
            "subKey": (
                "1": null,
                "2": some-val_ue
            )
        )
    ),
    "key5": (
        "key1": #f7fafc,
        "key2": (
            "key1": "0 0 0 1px rgba(0, 0, 0, 0.05)",
            "key2": (
                "key1": (#f7fafc, (1280px, span 1 / span 1)),
                "key2": 1280px,
                "key3": spin 1s linear infinite,
                "key7": ""
            )
        )
    )
)`;
        const actual = jsToSass(object);
        
        expect(actual).toBe(expected);
    });
});