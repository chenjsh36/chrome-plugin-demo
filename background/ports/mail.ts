import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  console.log(req)
 
  res.send({
    message: "xxx Hello from port handler"
  })
}
 
export default handler