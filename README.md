# sails-context

> Sails.js context loader.
> This module preload data like current record, list count ... etc for use in others policies, controllers and views as req.context

## Want to help? see: https://gist.github.com/albertosouza/81bfb2bea761b7b6f5fe

### How it will work? ... a sails acl proposal ...

Link: https://gist.github.com/albertosouza/81bfb2bea761b7b6f5fe

## Installation

```js
npm install sails-context --save
```

Add it to your policies:

```js
// file config/policies.js
var context = require('sails-context').sails.police;

module.exports.policies = {
  '*': [context]
};

```

## Credits
[Alberto Souza](https://github.com/albertosouza/) and contributors

## LICENSE: MIT
