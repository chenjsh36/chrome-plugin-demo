import { useMessage } from "@plasmohq/messaging/hook"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react";
import { MessageSource, MessageType } from "~constants";
import type { MessageBody } from "~types";


function delay(res, time = 1000) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(res), time);
    });
  }
  

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
    const [coverImages, setCoverImages] = useState<string[]>([]);

    const { data } = useMessage<MessageBody, MessageBody>(async (req, res) => {
        await delay('I dont know what to say');

        console.log("xxx content script receive useMessage()", req, req.body.type);
        const { from, to, type } = req.body ?? {};
        if (type === MessageType.REQUEST_COVER_IMAGES) {
            const coverImages = getCoverImages();
            res.send({
                from: to,
                to: from,
                type,
                data: {
                    coverImages,
                },
            });
            return;
        }
        res.send({
            from: to,
            to: from,
            type,
            data: {
                message: "I dont know"
            },
        })
    });

    // 返回商品的图片
    const getCoverImages = (): string[] => {
        const tnImagesContainer = document.querySelector('#main .page-product .container .product-briefing section .flex > :nth-child(2)');
        if (!tnImagesContainer) {
            console.error('Get TN Images container failed!');
            return [];
        }
        const tnImages = tnImagesContainer.querySelectorAll('picture img');
        const tnImageUrls = Array.from(tnImages).map(ele => {
            const tnImageUrl = ele?.getAttribute('src') ?? '';
            return tnImageUrl;
        });
        setCoverImages(tnImageUrls);
        return tnImageUrls;
    }

    return <div>
        <ul>
            {
                coverImages.map(url => {
                    return (
                        <li key={url}>{url}</li>
                    )
                })
            }
        </ul>
    </div>
}
  
export default PlasmoOverlay