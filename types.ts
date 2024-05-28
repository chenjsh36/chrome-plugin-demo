import type { MessageSource, MessageType } from "~constants";

export interface MessageBody<T extends any = any> {
    from: MessageSource,
    to: MessageSource,
    type: MessageType,
    data?: T,
}