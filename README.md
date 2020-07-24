# rollup-plugin-precompile-intl

This is a rollup plugin that wires together `babel-plugin-precompile-intl` and `precompile-intl-runtime` in your rollup-powered
app. It was authored with Svelte.js in mind, but it could be used with any other library.

### Why would I want to use it? How does it work?

This approach is different than the taken by libraries like [intl-messageformat](https://www.npmjs.com/package/intl-messageformat) or [format-message](https://github.com/format-message/format-message), which do all the work in the browser. The approach taken by those libraries is more flexible as you can just load json files with translations in plain text and that's it, but it also means the library needs to ship a parser for the ICU message syntax, and it always has to have ship code for all the features that the ICU syntax supports, even features you might not use, making those libraries several times bigger.

The strategy used by this library assumes that your app will have some sort of built process that you can use to analyze and precompile
the messages in your app. This process spares the browser of the burden of doing the same process in the user's devices, resulting in
smaller and faster apps.

For instance if an app has the following set of translations:

```json
{
  "plain": "Some text without interpolations",
  "interpolated": "A text where I interpolate {count} times",
  "time": "Now is {now, time}",
  "number": "My favorite number is {n, number}",
  "pluralized": "I have {count, plural,=0 {no cats} =1 {one cat} other {{count} cats}}",
  "pluralized-with-hash": "I have {count, plural, zero {no cats} one {just # cat} other {# cats}}",
  "selected": "{gender, select, male {He is a good boy} female {She is a good girl} other {They are good fellas}}",
}
```

The babel plugin will analyze and understand the strings in the ICU message syntax and transform them into something
like:

```js
import { __interpolate, __number, __plural, __select, __time } from "precompile-intl-runtime";
export default {
  plain: "Some text without interpolations",
  interpolated: `A text where I interpolate ${__interpolate(count)} times`,
  time: now => `Now is ${__time(now)}`,
  number: n => `My favorite number is ${__number(n)}`,
  pluralized: count => `I have ${__plural(count, { 0: "no cats", 1: "one cat", h: `${__interpolate(count)} cats`})}`,
  "pluralized-with-hash": count => `I have ${__plural(count, { z: "no cats", o: `just ${count} cat`, h: `${count} cats`})}`,
  selected: gender => __select(gender, { male: "He is a good boy", female: "She is a good girl", other: "They are good fellas"})
}
```

Now the translations are either strings or functions that take some arguments and generate strings using some utility helpers.
Those utility helpers are very small and use the native `Intl` API available in all modern browsers and in node. Also, unused helpers
are tree-shaken by rollup.

When the above code is minified it will results in an output that compact that often is shorter than the original ICU string:

```
"pluralized-with-hash": "I have {count, plural, zero {no cats} one {just # cat} other {# cats}}",
--------------------------------------------------------------------------------------------------
"pluralized-with-hash":t=>`I have ${jt(t,{z:"no cats",o:`just ${t} cat`,h:`${t} cats`})}`
```

The combination of a very small and treeshakeable runtime with moving the parsing into the build step results in an extremely small
footprint, often < 2kb.

### Setup

1. Install `rollup-plugin-precompile-intl` and `precompile-intl-runtime` as devDependencies.

2. Create a folder to put your translations. I like to use a `/messages` folder on the root. On that folder, create `en.js`, `es.js` and as many files
   as languages you want. On each file, export an object with your translations:
   ```js
    export default {
      "recent.aria": "Find recently viewed tides",
      "menu": "Menu",
      "foot": "{count} {count, plural, =1 {foot} other {feet}}",
    }
   ```

3. In your `rollup.config.js` add the plugin exported by `rollup-plugin-precompile-intl`, and let it know what folder your translations live in:
```diff
  import svelte from 'rollup-plugin-svelte';
  import resolve from '@rollup/plugin-node-resolve';
  import commonjs from '@rollup/plugin-commonjs';
  import replace from "@rollup/plugin-replace";
  import livereload from 'rollup-plugin-livereload';
  import { terser } from 'rollup-plugin-terser';
+ import precompileIntl from 'rollup-plugin-precompile-intl'

  const production = !process.env.ROLLUP_WATCH;
  export default [
    {
      input: "src/main.js",
      output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "public/build/bundle.js"
      },
      plugins: [
+       precompileIntl({ include: 'messages/*' }),
        svelte({
          // enable run-time checks when not in production
          dev: !production,
          preprocess: [],
          // we'll extract any component CSS out into
          // a separate file — better for performance
          css: css => {
            css.write("public/build/bundle.css");
          }
        })
      ]
    }
  ]
```

*From this step onward the library almost identical to use and configure to the popular [svelte-i18n](https://github.com/kaisermann/svelte-i18n)*.
It has the same features and only some import path is different. You can check the docs of [svelte-i18n](https://github.com/kaisermann/svelte-i18n)
for examples and details in the configuration options.

4. Create an initializer where you can register your locales and configure your preferences. You can import
your languages statically (which will add them to your bundle) or register loaders that will load the translations
asynchronously.
I like to use `/src/i18n.js`:
```js
import { addMessages, init /*, register */ } from 'precompile-intl-runtime'
import en from "../messages/en.js";

addMessages("en", en);
// register('es', () => import('../messages/en.json')); // you can define other locales that will be imported lazily

init({
  fallbackLocale: "en",
  initialLocale: { navigator: true }
});
```
5. Import this initializer from your `/src/main.js`
6. Now on your `.svelte` files you start translating using the `t` store exported from `precompile-intl-runtime`:
```jsx
<script>
  import { t } from 'precompile-intl-runtime'
</script>
<footer class="l-footer">
  <p class="t-footer">{$t("hightide")} {$t("footer.cta")}</p>
</footer>
```

### Testing
If you want translations to work in node (for instance when running jest unit tests) you will need to
install babel and configure it on the `babel.config.js`
```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ]
};
```
If a test uses translations you will have to import the `src/i18n.js` initializer on the test or setup your locale and
load the messages yourself.