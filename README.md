# babel-plugin-tiny-import

## Feature

- wrap.js
```javascript
export {default as Tool, toolFunction as outerToolFunction} from 'lib/tool';
export * from 'lib/utils';
export {resolve as rlv} from 'lib/path';

exports.join = require('lib/path/join');
module.exports.join = require('lib/path/extname');
module.exports.extname = require('lib/path-2/extname');

export {default as default} from 'index/join';
```

Input:  
```javascript
import {rlv, join as Join} from 'wrap'
const {outerToolFunction: $outerToolFunction} = require('wrap')
```

Output:  
```javascript
import { resolve as rlv } from "lib/path";
import Join from "lib/path/extname";
const $outerToolFunction = require("lib/tool").toolFunction;
```

## Options

```text
{
    test: /^wrap$/, // RegExp | Function | String
    moduleMapper: {} // {} | string | (imported, moduleName) => moduleName | {moduleName: string, ref: string},
    easyModuleMapper: {
        // `true` means that opt.moduleMapper will be regarded as filename
        enable: true,
        // watch the opt.moduleMapper file's change.
        watch: true,
        // the basename of opt.moduleMapper file's *Relative Module*.
        basename: false, // true | false | string
        resolvePackageAsAbsolute, // boolean | https://www.npmjs.com/package/resolve options, false by default
    },
}
```

## Note!!!

the syntax of `require` is not supported yet, which are as follow.

- wrap.js  
```javascript
exports.supported = require('lib/total/support');
// MemberExpression
exports.notSupported = require('lib/total').notSupported;
```

- Input  
```javascript
// MemberExpression
const notSupported = require('wrap').supported;
const {notSupported: alsoNotSupported} = require('wrap');

let {supported} = require('@befe/wrap');
```

- Output  
```javascript
const notSupported = require('wrap').supported;
const {notSupported: alsoNotSupported} = require('wrap');

let supported = require('lib/total/support');
```
