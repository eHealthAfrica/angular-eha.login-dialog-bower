# angular-eha.login-dialog

[![Build Status][travis-image]][travis-url]

> Login dialog box

[travis-image]: https://img.shields.io/travis/eHealthAfrica/angular-eha.login-dialog.svg
[travis-url]: https://travis-ci.org/eHealthAfrica/angular-eha.login-dialog

A login dialog box UI for [angular-eha.login-service][]. Check out the [demo][].

[demo]: http://docs.ehealthafrica.org/angular-eha.login-dialog/
[angular-eha.login-service]: https://github.com/eHealthAfrica/angular-eha.login-service

## Usage

The provided template depends on:

* Bootstrap (css)
* Font Awesome
* `$modal` from UI Bootstrap
* Angular Gettext

After you've ensured they are sourced, add this module to your app's
dependencies and configure `ehaLoginService` with a CouchDB database endpoint:

```js
angular.module('app', [
  'eha.login-service',
  'eha.login-dialog'
])
  .config(function(ehaLoginServiceProvider) {
    ehaLoginServiceProvider.config('https://couchdb.example.com/my-db')
  })
```

Then call `ehaLoginService.maybeShowLoginUi` somewhere in your application.

## Installation

Install with npm:

    npm install --save angular-eha.login-dialog

Or alternatively bower:

    bower install --save angular-eha.login-dialog

Then simply add `eha.login-dialog` as a dependency somewhere in your project
that makes sense and you're good to go.

## Contributors

* © 2015 Karl Westin <karl.westin@ehealthnigeria.org>
* © 2015 Tom Vincent <tom.vincent@ehealthnigeria.org> (https://tlvince.com)

## License

Released under the [Apache 2.0 License][license].

[license]: http://www.apache.org/licenses/LICENSE-2.0.html
