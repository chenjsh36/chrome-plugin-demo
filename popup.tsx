import { useState, useEffect } from "react"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { usePort } from '@plasmohq/messaging/hook';
import type { MessageBody } from "~types";
import { MessageSource, MessageType } from "~constants";

function IndexPopup() {
  // 存储封面图片
  const [loading, setLoading ] = useState<boolean>(false);
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [tmpRes, setTmpRes] = useState<string[]>([]);

  const getItemCoverImage = async () => {
    setLoading(true);
    const requestBody: MessageBody = {
      from: MessageSource.POPUP,
      to: MessageSource.CONTENT_SCRIPT,
      type: MessageType.REQUEST_COVER_IMAGES,
    }
    const res = await sendToContentScript<MessageBody>({
      name: MessageType.REQUEST_COVER_IMAGES,
      body: requestBody,
    });
    setTmpRes([res, tmpRes.slice(0, 4)]);
    setLoading(false);
  }
  useEffect(() => {
    getItemCoverImage();
  }, []);

  return (
    <div>
      {
        loading ? (
          <div>
            loading....
          </div>
        ) : (
          <div>
            Response: 
            
            {
              tmpRes.map(res => {
                return (
                  <div>{res}</div>
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}

export default IndexPopup
