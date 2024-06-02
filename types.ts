import type { ErrorCode, MessageSource, MessageType } from "~constants";

export interface MessageBody<T extends any = any> {
    from: MessageSource,
    to: MessageSource,
    type: MessageType,
    error?: boolean,
    errorCode?: ErrorCode,
    data?: T,
}

export interface ImageInfo {
    url: string;
    label: string;
    type?: string;
}

export interface ProductInfo {
    itemId?: string;
    mainImages: ImageInfo[];
    variationImages: ImageInfo[];
}