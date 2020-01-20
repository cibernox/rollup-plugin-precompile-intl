# babel-plugin-precompile-intl

This babel plugin compiles translations in the ICU message syntax into executable functions at build time,
analyzing the used features and importing the required runtime helpers from [precompile-intl-runtime](https://github.com/cibernox/precompile-intl-runtime)
to perform the operations that can't be performed at build time.

### Differences with other internationalization libraries

This approach is different than the taken by libraries like [intl-messageformat](https://www.npmjs.com/package/intl-messageformat) or [format-message](https://github.com/format-message/format-message), which do all the work in the browser. The approach taken by those libraries is more flexible as you can just load json files with translations in plain text and that's it, but it also means the library needs to ship a parser for the ICU message syntax, and it always has to have ship code for all the features that the ICU syntax supports, even features you might not use, making those libraries several times bigger.

The strategy used by this library assumes that your app will have some sort of built process that you can use to analyze and precompile
the messages in your app. This process spares the browser of the burden of doing the same process in the user's devices, resulting in
smaller and faster apps.

