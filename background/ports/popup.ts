import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getPort } from "@plasmohq/messaging/port"


const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  console.log('xxx message to popup port handler', req.body?.message);
 
  res.send({
    message: "xxx background  Hello from popup port handler"
  })

  
  const mailPort = getPort('mail');
  mailPort.postMessage({
    from: 'background',
    data: 'xxx background message from pop up port handler'
  })
}
 
export default handler