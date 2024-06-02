import { useMessage } from "@plasmohq/messaging/hook"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react";
import { ErrorCode, MessageSource, MessageType } from "~constants";
import type { ImageInfo, MessageBody, ProductInfo } from "~types";


function delay(res, time = 1000) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(res), time);
    });
  }
  

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: false, // 貌似会给页面里所有的 frame 添加 cs
    run_at: "document_start",
    // world: "MAIN"
}
  
//   export const getStyle = () => {
//     const style = document.createElement("style")
//     style.textContent = cssText
//     return style
//   }
  
const PlasmoOverlay = () => {
    const [mainImages, setMainImages] = useState<ImageInfo[]>([]);
	const [variationImages, setVariationImages ] = useState<ImageInfo[]>([]);

    const { data } = useMessage<MessageBody, MessageBody<ProductInfo>>(async (req, res) => {
        const { from, to, type } = req.body ?? {};
		const isShopeePage = checkIfShopeePage();
		if (!isShopeePage) {
			const result: MessageBody<ProductInfo> = {
				from: to,
				to: from,
				type,
				error: true,
				errorCode: ErrorCode.NotShopeePage,
				data: {
					mainImages: [],
					variationImages: [],
				}
			}
			res.send(result);
			return;
		}
		if (type === MessageType.REQUEST_PRODUCT_INFO) {
			const itemId = getProductId();
            const mainImages = getMainImages();
			const variationImages = getVariationImages();
			const notPageDetailPage = !mainImages.length && !variationImages.length;
            const result: MessageBody<ProductInfo> = {
                from: to,
                to: from,
                type,
				error: notPageDetailPage,
				errorCode: notPageDetailPage ? ErrorCode.NotShopeeDetailPage : ErrorCode.Normal,
                data: {
					itemId,
					mainImages,
					variationImages,
                },
            };
			console.log('content script res:', result);
			res.send(result);
            return;
		}
        res.send({
            from: to,
            to: from,
            type,
			error: true,
			errorCode: ErrorCode.UnknownError,
            data: {
				mainImages: [],
				variationImages: [],
            },
        })
    });

    // 返回商品的主图片
    const getMainImages = (): ImageInfo[] => {
        const tnImagesContainer = document.querySelector('#main .page-product .container .product-briefing section .flex > :nth-child(2)');
        if (!tnImagesContainer) {
            console.error('Get main TN Images container failed!');
            return [];
        }
        const tnImages = tnImagesContainer.querySelectorAll('picture img');
        const tnImageUrls: ImageInfo[] = Array.from(tnImages).map((ele, index) => {
            const tnImageUrl = ele?.getAttribute('src') ?? '';

            return {
				type: 'main',
				url: tnImageUrl,
				label: `main-${index + 1}`,
			}
        }).filter(item => !!item.url);
        setMainImages(tnImageUrls);
        return tnImageUrls;
    }

	// 返回商品的 variation 图片
	const getVariationImages = (): ImageInfo[] => {
        const tnImagesContainer = document.querySelector('#main .page-product .container .product-briefing section.flex div.flex-auto div div.flex-column > div.flex > div.flex > section.flex.items-center > div.items-center');
        if (!tnImagesContainer) {
            console.error('Get variation TN Images container failed!');
            return [];
        }
        const tnImages = tnImagesContainer.querySelectorAll('button');
        const tnImageUrls: ImageInfo[] = Array.from(tnImages).map(ele => {
			const img = ele.querySelector('img');
			const label = ele.innerText;
            const tnImageUrl = img?.getAttribute('src') ?? '';
            return {
				url: tnImageUrl,
				label,
				type: 'variation',
			}
        }).filter(item => !!item.url);
        setVariationImages(tnImageUrls);
        return tnImageUrls;
	}

	// 返回商品的信息
	const getProductId = () => {
		const itemLink = document.querySelector('link[rel="canonical"]');
		if (!itemLink) {
			return '';
		}
		const url = itemLink.getAttribute('href');
		const infos = url.split('.')
		if (!infos.length) {
			return '';
		}
		return infos[infos.length - 1];
	}

	// 返回是否在 shopee 官网
	const checkIfShopeePage = (): boolean => {
		return window.location.host.includes('shopee');
	}

    return <div style={{display: 'none'}} className="shopee-assistant"></div>
}
  
export default PlasmoOverlay