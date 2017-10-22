/**
 * @file common component export
 * @author CaiYu
 */

export {default as Tool, toolFunction as outerToolFunction} from './lib/tool';
export * from './lib/utils';
export {resolve as rlv} from './lib/path';

exports.join = require('lib/path/join');
module.exports.join = require('./lib/path/extname');
module.exports.extname = require('./lib/path-2/extname');

export {default as default} from 'index/join';

export {default as Button} from '@befe/erp-comps/basic/Button';
export {default as Calendar} from '@befe/erp-comps/basic/Calendar';
export {default as RangeCalendar} from '@befe/erp-comps/complex/RangeCalendar';
export {default as Checkbox} from '@befe/erp-comps/basic/Checkbox';
export {default as Download} from '@befe/erp-comps/basic/Download';
export {default as Upload} from '@befe/erp-comps/basic/Upload';
export {default as Upload2} from '@befe/erp-comps/basic/Upload2';
export {default as Select} from '@befe/erp-comps/basic/Select';
export {default as Section} from '@befe/erp-comps/basic/Section';
export {default as Text} from '@befe/erp-comps/basic/Text';
export {default as ValidateText} from '@befe/erp-comps/complex/ValidateText';
export {default as Password} from '@befe/erp-comps/basic/Password';
export {default as Popup} from '@befe/erp-comps/basic/Popup';
export {default as Textarea} from '@befe/erp-comps/basic/Textarea';
export {default as ButtonGroup} from '@befe/erp-comps/basic/ButtonGroup';
export {default as MultiUpload} from '@befe/erp-comps/complex/MultiUpload';
export {default as Radio} from '@befe/erp-comps/basic/Radio';
export {default as Suggest} from '@befe/erp-comps/complex/Suggest';
export {default as MultipleSuggest} from '@befe/erp-comps/complex/MultipleSuggest';
export {default as WrapperUpload} from '@befe/erp-comps/complex/WrapperUpload';
export {default as FormItem} from '@befe/erp-comps/complex/FormItem';
export {default as Segments8Pop} from '@befe/erp-comps/complex/Segments8/Segments8Pop';
export {default as Slider} from '@befe/erp-comps/basic/Slider';
export {default as Switch} from '@befe/erp-comps/basic/Switch';
export {default as Link} from '@befe/erp-comps/basic/Link';
export {default as Message} from '@befe/erp-comps/basic/Message';
export {default as Modal} from '@befe/erp-comps/basic/Modal';
export {default as PopoverConfirm} from '@befe/erp-comps/basic/PopoverConfirm';
export {default as AutoComplete} from '@befe/erp-comps/basic/AutoComplete';
export {default as Tree} from '@befe/erp-comps/basic/Tree';
export {default as TwoSelectionList} from '@befe/erp-comps/basic/TwoSelectionList';
// Pagination
export {default as Pagination} from '@befe/erp-comps/basic/Pagination';

// Table
export {default as PlainTable} from '@befe/erp-comps/basic/PlainTable';
export {default as FixTable} from '@befe/erp-comps/basic/FixTable';

// inject component
export {
    default as formItemRenderer,
    injectComponent
} from '@befe/erp-comps/complex/FormItem/renderer';