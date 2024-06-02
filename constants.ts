export enum MessageSource {
    CONTENT_SCRIPT = 1,
    BACKGROUND_SERVICE = 2,
    POPUP = 3,
}

export enum ErrorCode {
    Normal = 0,
    UnknownError = 1,
    NotShopeePage = 2,
    NotShopeeDetailPage = 3,
}

export enum MessageType {
    REQUEST_COVER_IMAGES = 'REQUEST_COVER_IMAGES',
    REQUEST_PRODUCT_INFO = 'REQUEST_PRODUCT_INFO',
};