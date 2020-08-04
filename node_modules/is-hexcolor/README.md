# is-hexcolor [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Check that given value is valid hex color, using `hex-color-regex` - the best regex for matching hex color values

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coverage-img]][coverage-url] [![dependency status][david-img]][david-url]


## Install
```
npm i is-hexcolor --save
npm test
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
var isHexcolor = require('is-hexcolor')

isHexcolor('#ffffff') //=> true
isHexcolor('#fff') //=> true

isHexcolor('fff') //=> false
isHexcolor('#9gg') //=> false
isHexcolor('#abcZZZ') //=> false
isHexcolor('#3333') //=> false
isHexcolor('#44445555') //=> false
isHexcolor('foo bar') //=> false
isHexcolor('foo #fff bar') //=> false
isHexcolor('foo #f3f3f3 bar') //=> false
```


## Related
- [copyright-regex](https://github.com/regexps/copyright-regex): Regex for matching and parsing copyright statements.
- [github-short-url-regex](https://github.com/regexps/github-short-url-regex): Regular expression (Regex) for matching github shorthand (user/repo#branch).
- [hex-color-regex](https://github.com/regexps/hex-color-regex): The best regular expression (regex) for matching hex color values from string.
- [mentions-regex](https://github.com/regexps/mentions-regex): 100% twitter compatible `@mentions` regex! Regular expression for matching `@username` mentions, as used on twitter, facebook, github, etc.
- [todo-regex](https://github.com/regexps/todo-regex): Regular expression for matching TODO statements in a string.


## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/is-hexcolor/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.


## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckocore.tk][author-www-img]][author-www-url] [![keybase tunnckocore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]


[npmjs-url]: https://www.npmjs.com/package/is-hexcolor
[npmjs-img]: https://img.shields.io/npm/v/is-hexcolor.svg?label=is-hexcolor

[license-url]: https://github.com/tunnckoCore/is-hexcolor/blob/master/LICENSE.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg


[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/is-hexcolor
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/is-hexcolor.svg

[coverage-url]: https://codeclimate.com/github/tunnckoCore/is-hexcolor
[coverage-img]: https://img.shields.io/codeclimate/coverage/github/tunnckoCore/is-hexcolor.svg

[travis-url]: https://travis-ci.org/tunnckoCore/is-hexcolor
[travis-img]: https://img.shields.io/travis/tunnckoCore/is-hexcolor.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/is-hexcolor
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/is-hexcolor.svg

[david-url]: https://david-dm.org/tunnckoCore/is-hexcolor
[david-img]: https://img.shields.io/david/tunnckoCore/is-hexcolor.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg


[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/messages
[new-message-img]: https://img.shields.io/badge/send%20me-message-green.svg
