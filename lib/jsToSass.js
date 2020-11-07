/**
 * Inspired by : https://bit.dev/wurielle/pristine/webpack/json-sass-plugin/~code#json-sass/lib/js-to-sass-string.js
 */

let indentLevel = 0;

/**
 * @param {number} indentCount
 * @param {number} spaceAmount
 */
function indentsToSpaces(indentCount, spaceAmount = 4) {
    let indentation = '';

    for (let index = 0; index < spaceAmount; index++) {
        indentation += ' ';
    }

    return Array(indentCount + 1).join(indentation);
}

/**
 * @param {string} key
 * @returns {string}
 */
function normalizeKey(key) {
    return `"${key}"`;
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeValue(value) {
    if (!/^[a-zA-Z-0-9 /%"#\(\)._-]*$/.test(value)) {
        return `"${value}"`;
    }

    if (value === '') {
        return `""`;
    }

    return value;
}

/**
 * @param {Array} value
 * @param {Object} params
 */
function handleArray(value, params) {
    const sassStrings = value.map(val => jsToSass(val, params)).filter(sassString => !!sassString);

    return `(${sassStrings.join(', ')})`;
}

/**
 * @param {Object} value
 * @param {Object} params
 */
function handleObject(value, params) {
    if ((value || {}).constructor !== Object) {
        return value.toString();
    }

    indentLevel++;

    const indent = indentsToSpaces(indentLevel, params.indent);

    const sassKeyValuePairs = Object
        .entries(value)
        .map(([key, val]) => {
            const sassString = jsToSass(val, params);

            if (sassString === null) {
                return null;
            }

            return `${normalizeKey(key)}: ${sassString}`;
        })
        .filter(sassString => !!sassString);

    const result = `(\n${indent}${sassKeyValuePairs.join(',\n' + indent)}\n${indentsToSpaces(indentLevel - 1, params.indent)})`;

    indentLevel -= 1;

    return result;
}

/**
 * @param {Object} value
 * @param {Object} params
 * @returns {String}
 */
function jsToSass(value, params = { indent: 4, throwOnUnconvertable: false }) {
    if ([null, undefined, 'null', 'undefined'].includes(value)) {
        return 'null';
    }

    if (['boolean', 'number'].includes(typeof value)) {
        return value.toString();
    }

    if (typeof value === 'string') {
        return normalizeValue(value);
    }

    if (Array.isArray(value)) {
        return handleArray(value, params);
    }

    if (typeof value === 'object') {
        return handleObject(value, params);
    }

    if (params.throwOnUnconvertable) {
        throw new Error(`The provided value type \`${typeof value}\` is not convertable.`);
    }

    return null;
}

module.exports = jsToSass;