/** components */

export type { IRobinConfig } from './packages/global-config';
export { RobinConfig } from './packages/global-config';

/** responsive-container */
export type { ResponsiveContainerProps } from './packages/responsive-container';
export { ResponsiveContainer } from './packages/responsive-container';

// 页面卡片组件
export type { IPanelProps } from './packages/panel';
export { Panel } from './packages/panel';

// 暗水印组件
export {
    DarkWaterMark,
    fetchDarkWaterMarkImage,
    registerFetchImage,
    WithDarkWaterMark,
} from './packages/dark-water-mark';
export { useFontWatermark } from './packages/dark-water-mark/src/font-water-mark';
export type { IDarkWaterMarkProps, ImgSize } from './packages/dark-water-mark/src/type';

// 超出...并tooltip展示
export type { IEllipsisProps } from './packages/ellipsis';
export { Ellipsis } from './packages/ellipsis';

// 按钮组组件
export type { Actions, IBuildActionButton } from './packages/action-button';
export { buildAction, buildActionButton } from './packages/action-button';
export { ACTION_BUTTON_TYPE } from './packages/action-button/src/constants';

// 按钮组件
export type { IButtonProps } from './packages/button';
export { Button } from './packages/button';

// 倒计时组件，类似剩余时间组件，传入deadline时间戳
export { CountDown, useCountDown } from './packages/count-down';

// 倒计时按钮
export type { ICountDownButtonProps } from './packages/count-down-button';
export { CountDownButton } from './packages/count-down-button';

// 抽屉组件
export type { IDrawerFactoryConfig } from './packages/drawer';
export { drawerFactory } from './packages/drawer';

// 复制组件
export type { IFlexibleCopyProps } from './packages/flexible-copy';
export { FlexibleCopy } from './packages/flexible-copy';

// 剩余时间组件，类似于倒计时组件，传入剩余时间秒数
export type { ILeftTimeProps } from './packages/left-time';
export { LeftTime, useLeftTimer } from './packages/left-time';

// 弹唱组件
export type { IModalOpts } from './packages/modal';
export { ModalFactory, modalFactory } from './packages/modal';

// 手机验证码发送输入框组件
export type { ISendVerifyCodeProps } from './packages/send-verify-code';
export { SendVerifyCode } from './packages/send-verify-code';

// 图片预览组件
export type { IPreviewImageProps } from './packages/preview-image';
export { PreviewImage } from './packages/preview-image';

//
export type { JsxRenderElementSchema, JsxRenderProps } from './packages/jsx-render';
export { JsxRender } from './packages/jsx-render';

// 状态点组件（auxo支持后移除）
export type { IStatusSpotProps, SpotType } from './packages/spot';
export { getWrappedStatusSpot, StatusSpot } from './packages/spot';

// 待请求及分页功能的表格
export type { ICustomTableProps, CustomPaginationConfig } from './packages/table';
export { Table } from './packages/table';

// search组件
export { Search, SELECT_ALL } from './packages/search';

// search form组件
export type { FieldItem, ISearchFormProps, SearchFormRef } from './packages/search-form';
export { FORM_ITEM_TYPE, SearchForm } from './packages/search-form';

// 商品选择抽屉组件
export { GoodsDrawer, OriginFilterOptions, OptionType } from './packages/goods-drawer';
export type { IGoodsDrawer, FilterOptionItem } from './packages/goods-drawer';

// 日志组件
export { openOperationLogDrawer } from './packages/operation-log-drawer';

// 加载中
export { appendToDivFactory, LoadingSpin, openSpin } from './packages/spin';

// flash
export { Flash, convertTableConfig } from './packages/flash';
export type { FlashColumnType } from './packages/flash/types';

// 仅在cyborg中使用
export type {
    IExportBigFile,
    ErrorBoundaryProps,
    ErrorBoundaryPropsWithComponent,
    ErrorBoundaryPropsWithFallback,
    ErrorBoundaryPropsWithRender,
    FallbackProps,
} from './packages/cybory-depend';
export {
    attachMessageApi,
    attachModalApi,
    ExportBtn,
    useExportBigFile,
    withCatchError,
    ErrorBoundary,
    useErrorHandler,
    withErrorBoundary,
} from './packages/cybory-depend';

/** utils */
export type { IBaseRes, IPlaceholder, IPlaceholderItem, RobinAxiosInstance } from './packages/utils';
export {
    beforeUpload,
    beforeUploadFactory,
    buildHighLight,
    buildRichText,
    transformPlaceHolerToLink,
    Delimiter,
    fenToCurrency,
    getAxiosInstance,
    // hashUrlParams,
    mapToList,
    mapToListByMapSort,
    mapToSelectOptions,
    mapToOptionsByKey,
    mapToOptionsByValue,
    reverseMap,
    setAxiosInstance,
    // urlParams,
    yuanToCurrency,
} from './packages/utils';
