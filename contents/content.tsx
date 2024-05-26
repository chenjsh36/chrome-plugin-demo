import { useMessage } from "@plasmohq/messaging/hook"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: true,
    run_at: "document_start",
    // world: "MAIN"
}
  
//   export const getStyle = () => {
//     const style = document.createElement("style")
//     style.textContent = cssText
//     return style
//   }
  
const PlasmoOverlay = () => {
    const { data } = useMessage<string, string>(async (req, res) => {
        console.log("xxx content script receive useMessage()", req);
        res.send('I dont know what to say')
    })

    return <div>hello world</div>
}
  
export default PlasmoOverlay