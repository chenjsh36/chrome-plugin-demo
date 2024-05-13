import { sendToBackground } from '@plasmohq/messaging';
import type { PlasmoCSConfig } from "plasmo"

sendToBackground({
  name: "ping",
  body: {
    id: 123
  },
  extensionId: 'eipignphbeifaoppngphjhdbdiicglnk' // find this in chrome's extension manager
})
  .then((res) => {
    console.log(res);
  })

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}  

export {}
console.log(
  "xxx Hello ? You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
)
