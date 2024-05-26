import type { PlasmoMessaging } from "@plasmohq/messaging"

function delay(res, time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(res), time);
  });
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log('xxx background recive message:', req);
  const message = await delay('xxx Message from background');
 
  res.send({
    from: 'background',
    message
  })
}
 
export default handler