import { useState, useEffect } from "react"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { usePort } from '@plasmohq/messaging/hook';

function IndexPopup() {
  const [data, setData] = useState("mail");
  const [csMsg, setCsMsg] = useState('');

  
  const sendMsg = async () => {
    const res = await sendToBackground({
      name: "ping",
      body: {
        id: 123,
        from: 'popup',
      }
    });
    console.log('xxx poup recevie data:', res);
    setData(res?.message ?? 'nothing')

    const csRes = await sendToContentScript({
      name: 'ping',
      body: {
        from: 'popup',
        message: 'hello from popup',
      }
    });
    console.log('xxx popup receive message: ', csRes);
    setCsMsg(csRes?.message ?? 'nothing');
  }

  useEffect(() => {
    sendMsg();
  }, []);


  // const mailPort = usePort('popup');
  // const [mailPortData, setMailPortData] = useState("nothing");

  // const handleGetItemImages = () => {
  //   console.log('xxx handle get item images:');
  //   mailPort.send({
  //     message: 'xxx from popup message' 
  //   })
  // }

  // useEffect(() => {
  //   console.log('xxx popup data changed from mail port ', mailPort?.data?.message);
  //   setMailPortData(`hello ??? ${mailPort?.data?.message ?? 'nothingxxx'}`);
  // }, [mailPort.data]);

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>
        Welcome to your house wowo{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <input onChange={(e) => setData(e.target.value)} value={csMsg} />

      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
      {/* {mailPortData ?? 'nothing'} */}

      <button onClick={sendMsg}>Get the image</button>
    </div>
  )
}

export default IndexPopup
