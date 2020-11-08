# A better TailwindCSS bridge to SASS.

This plugin provides you with a set of SASS functions and mixins that makes working with [Tailwind](https://tailwindcss.com) easier in SASS.
Here's quick example:

```js
// tailwind.config.js

module.exports = {
    // ...
    theme: {
        colors: {
            indigo: {
                100: '#ebf4ff',
                200: '#c3dafe',
                300: '#a3bffa',
                400: '#7f9cf5',
                500: '#667eea',
                600: '#5a67d8',
                700: '#4c51bf',
                800: '#434190',
                900: '#3c366b',
            },
        },
        borderRadius: {
            none: '0',
            sm: '0.125rem',
            default: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
            full: '9999px',
        }
    },
    // ...
};
```

```scss
// _btn.scss

.btn {
    border-radius: rounded(lg);
    background-color: color('indigo.500'); // - or - color(indigo, 500)
}
```

```css
/* app.css */

.btn {
    border-radius: 0.5rem;
    background-color: #667eea;
}
```


## How it works

The plugin [receives the entire Tailwind config](https://github.com/VicGUTT/tailwindsass/blob/2b5631dfdd6f5cbc50b906451a91abf0317cb805/lib/index.js#L6) as a JavaScript object and [converts it into a SASS map](https://github.com/VicGUTT/tailwindsass/blob/main/lib/jsToSass.js) that is then exported to a defined path whithin your project.
Along side the generated config, a few SASS functions and mixins are also exported _(unless disabled)_ to make retrieving the config values easier.


## Installation

Install the plugin via NPM _(or yarn)_:

``` bash
# Using npm
npm i @vicgutt/tailwindsass

# Using Yarn
yarn add @vicgutt/tailwindsass
```

Then add the plugin to your tailwind.config.js file:

``` js
// tailwind.config.js
module.exports = {
    theme: {
        // ...
    },
    plugins: [
        require('@vicgutt/tailwindsass')({
            // base: './resources/sass/app.scss',
            dist: './resources/sass',
        }),
        // ...
    ],
};
```


## Options

Some config options may be passed to the plugin to change or disable a behaviour.

| Name              | Type            | Default            | Description                                                                                                                                                               |
| ----------------- | --------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dist _(required)_ | `string|null`   | `null`             | Path to where the files should be exported to. If `null`, an error will be thrown.                                                                                        |
| src               | `string|null`   | _[our stubs folder](https://github.com/VicGUTT/tailwindsass/tree/main/stubs)_ | Path from where the files should be imported from. If `null`, our default stub files will be used.                                                                        |
| [base](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/tailwindsass.scss)              | `bool|string`   | `true`             | A boolean value determines whether or not the file should be exported. If a string is provided it will be considered as a path to where the file should be exported to.   |
| [variables](https://github.com/VicGUTT/tailwindsass/tree/main/stubs/variables)         | `bool|string`   | `true`             | A boolean value determines whether or not the files should be exported. If a string is provided it will be considered as a path to where the files should be exported to. |
| [functions](https://github.com/VicGUTT/tailwindsass/tree/main/stubs/functions)         | `bool|string`   | `true`             | A boolean value determines whether or not the files should be exported. If a string is provided it will be considered as a path to where the files should be exported to. |
| [mixins](https://github.com/VicGUTT/tailwindsass/tree/main/stubs/mixins)            | `bool|string`   | `true`             | A boolean value determines whether or not the files should be exported. If a string is provided it will be considered as a path to where the files should be exported to. |


## Usage

A few SASS functions and mixins are provided and are meant as direct TailwindCSS utilities equivalant. Therefore the terminologie and behaviour are similar to there utility counterpart.

### Functions

#### config
Use the `config()` function to access your Tailwind config's values using dot notation.
It allows you to reference a value from your entire configuration.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_config.scss)

```scss
.my-class {
    @if config('important') {
        background-color: color('indigo.500')!important;
    } @else {
        background-color: color('indigo.500');
    }
}
```

#### theme
Use the `theme()` function to access your Tailwind config's theme values using dot notation.
It allowes you to reference a value from your theme configuration.

It's a shortcurt to `config('theme.x')'`.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_theme.scss) | [Tailwind docs](https://tailwindcss.com/docs/functions-and-directives#theme)

```scss
.my-class {
    background-color: theme('colors.indigo.500');
}
```

#### color
Use the `color()` function to access your Tailwind config theme's color values using dot notation.
It allowes you to reference a value from your theme color configuration.

It's a shortcurt to `theme('colors.x')'`.

As an alternative for dot notation, an unlimited parameters list may be provided to access the nested values.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_color.scss)

```scss
.my-class {
    background-color: color('indigo'); // defaulting to the "500" shade
    background-color: color(indigo); // defaulting to the "500" shade
    background-color: color('indigo.800');
    background-color: color(indigo, '800');
    background-color: color('indigo', 800);
    background-color: color('indigo', '800');
    background-color: color(indigo, 800);
}
```

#### col
Controls how elements are sized and placed across grid columns.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_col.scss) | [Tailwind docs](https://tailwindcss.com/docs/grid-column)

```scss
.my-class {
    grid-column: col(3); // grid-column: span 3 / span 3;
}
```

#### font-family, font-weight, font-size, font
Functions for controlling the font family, size or weight of an element.

The `font()` function relies on the fact that the Tailwind confing won't have same keys for `fontFamily`, `fontWeight`, or `fontSize`.
If your config does have similar key names for those, please use the dedicated font functions instead.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_font.scss) | [Tailwind font-family docs](https://tailwindcss.com/docs/font-family) | [Tailwind font-weight docs](https://tailwindcss.com/docs/font-weight) | [Tailwind font-size docs](https://tailwindcss.com/docs/font-size)

```scss
.my-class {
    font-size: font-size(2xl);
    font-family: font-family(sans);
    font-weight: font-weight(black);

    // - or -

    font-size: font(2xl);
    font-family: font(sans);
    font-weight: font(black);

    // font-size: 1.5rem;
    // font-family: system-ui -apple-system "Segoe UI"...;
    // font-weight: 900;
}
```

#### grid-cols
Specifies the columns in a grid layout.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_grid-cols.scss) | [Tailwind docs](https://tailwindcss.com/docs/grid-template-columns)

```scss
.my-class {
    grid-template-columns: grid-cols(3); // grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

#### leading
Controls the leading _(line height)_ of an element.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_leading.scss) | [Tailwind docs](https://tailwindcss.com/docs/line-height)

```scss
.my-class {
    line-height: leading(relaxed); // line-height: 1.625;
}
```

#### rounded
Controls the border radius of an element.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_rounded.scss) | [Tailwind docs](https://tailwindcss.com/docs/border-radius)

```scss
.my-class {
    border-radius: rounded(full); // border-radius: 9999px;
}
```

#### screen
Reference responsive breakpoints in your project.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_screen.scss) | [Tailwind docs](https://tailwindcss.com/docs/breakpoints)

```scss
.my-class {
    @media (min-width: screen(md)) {
        background-color: color('indigo.500');
    }

    // @media (min-width: 768px) {
    //     background-color: #667eea;
    // }
}
```

#### shadow
Controls the box shadow of an element.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_shadow.scss) | [Tailwind docs](https://tailwindcss.com/docs/box-shadow)

```scss
.my-class {
    box-shadow: shadow(sm); // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
```

#### size
Function for setting the "size" of an element.
It referes to your theme's `width` and `maxWidth` values.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_size.scss)

```scss
.my-class {
    height: size('1/2'); // height: 50%;
}
```

#### space
Reference a value from the global spacing and sizing scale configuration of your project.
It referes to your theme's margin value. It will most likely have the "auto", positive and negative spacing values.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_space.scss)

```scss
.my-class {
    margin-top: space(4);
    margin-left: space(auto);
    margin-right: space(auto);
    margin-bottom: space(-4);

    // margin-top: 1rem;
    // margin-left: auto;
    // margin-right: auto;
    // margin-bottom: -1rem;
}
```

#### tracking
Controls the tracking _(letter spacing)_ of an element.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_tracking.scss) | [Tailwind docs](https://tailwindcss.com/docs/letter-spacing)

```scss
.my-class {
    letter-spacing: tracking(wide); // letter-spacing: 0.025em;
}
```

#### transition-property, transition-duration, transition-timing, transition-delay, transition
Functions for controlling CSS transitions.

[Source](https://github.com/VicGUTT/tailwindsass/blob/main/stubs/functions/_transition.scss) | [Tailwind transition-property docs](https://tailwindcss.com/docs/transition-property) | [Tailwind transition-duration docs](https://tailwindcss.com/docs/transition-duration) | [Tailwind transition-timing-function docs](https://tailwindcss.com/docs/transition-timing-function) | [Tailwind transition-delay docs](https://tailwindcss.com/docs/transition-delay)

```scss
.my-class {
    transition-property: transition-property(colors);
    transition-duration: transition-duration(700);
    transition-timing-function: transition-timing(in-out);
    transition-delay: transition-delay(100);

    // - or -

    transition: transition(colors, 700, in-out, 100); // Defaults : transition($property: default, $duration: 200, $timing: in-out, $delay: '')

    // transition-property: background-color, border-color, color, fill, stroke;
    // transition-duration: 700ms;
    // transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    // transition-delay: 100ms;
}
```

### Mixins

For a list of available mixins, check out [our mixins folder](https://github.com/VicGUTT/tailwindsass/tree/main/stubs/mixins).


### Variables

#### $config
The config variable that makes this whole thing work!

The values are generated from your Tailwind config file. If you would like to make changes do so in that file instead as any changes here will be overwritten.


### Base

#### tailwindsass.scss
The base entry point for your SASS styles.

```scss
// Functions
@import "functions/helpers";
@import "functions/config";
@import "functions/theme";
@import "functions/color";
@import "functions/col";
@import "functions/font";
@import "functions/grid-cols";
@import "functions/leading";
@import "functions/rounded";
@import "functions/screen";
@import "functions/shadow";
@import "functions/size";
@import "functions/space";
@import "functions/tracking";
@import "functions/transition";

// Mixins
@import "mixins/feature-testing";
@import "mixins/miscellaneous";
@import "mixins/screen-reader";
@import "mixins/screens";
@import "mixins/transition";
@import "mixins/typography";

// Variables
@import "variables/config";

// TailwindCSS
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```