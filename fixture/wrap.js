/**
 * @file common component export
 * @author CaiYu
 */

export {default as Tool, toolFunction as outerToolFunction} from './lib/tool';
export * from './lib/utils';
export {resolve as rlv} from './lib/path';

exports.join = require('lib/path/join');
// not supported
module.exports.notSupported = require('./lib/path/extname').notSupported;

module.exports.join = require('./lib/path/extname');
module.exports.extname = require('./lib/path-2/extname');

export {default as default} from 'index/join';

export {default as Button} from '@befe/erp-comps/basic/Button';

// inject component
export {
    default as formItemRenderer,
    injectComponent
} from '@befe/erp-comps/complex/FormItem/renderer';