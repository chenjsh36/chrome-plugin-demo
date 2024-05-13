import type { PlasmoMessaging } from "@plasmohq/messaging"

function delay(res, time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(res), time);
  });
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await delay('xxx Message from background');
 
  res.send({
    message
  })
}
 
export default handler