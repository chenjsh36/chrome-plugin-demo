import { sendToBackground } from '@plasmohq/messaging';
import { getPort } from '@plasmohq/messaging/port';

console.log(
  "xxx Hello ? You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
)

// 一次性请求
sendToBackground({
  name: "ping",
  body: {
    id: 123,
    from: 'content script',
  },
  // extensionId: 'kkfadmjoonebkhpogbjfcmnnjcdonmaj' // find this in chrome's extension manager
})
  .then((res) => {
    console.log('xxx content script recive message', res);
  })

/**
 * https://docs.plasmo.com/framework/messaging#ports port 实现长链接
 */
const mailPort = getPort('mail');
mailPort.onMessage.addListener((msg) => {
  console.log('xxx port message:', msg);
});

// setTimeout(() => {
//   mailPort.postMessage({
//     from: 'content',
//     data: 'message from content',
//   })
// }, 1000);

export {}

