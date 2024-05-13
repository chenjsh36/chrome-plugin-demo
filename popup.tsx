import { useState, useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"

function IndexPopup() {
  const [data, setData] = useState("")
  
  const sendMsg = async () => {
    const res = await sendToBackground({
      name: "ping",
      body: {
        id: 123
      }
    });
    console.log(res);
  }

  useEffect(() => {
    sendMsg();
  }, []);

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
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
