import React, { useState, useEffect } from "react"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { usePort } from '@plasmohq/messaging/hook';
import { Button, Flex, Layout, Image, Table, ConfigProvider, Rate, Typography } from 'antd';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, DownloadOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import type { ImageInfo, MessageBody, ProductInfo } from "~types";
import { ErrorCode, MessageSource, MessageType } from "~constants";
import './index.css';
import type { TableColumnsType } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
const { Meta } = Card;
const { Title } = Typography;

const containerStyle: React.CSSProperties = {
	position: 'relative',
	width: '500px',
}

const headerStyle: React.CSSProperties = {
	textAlign: 'center',
	color: '#fff',
	// height: 64,
	// paddingInline: 48,
	// lineHeight: '64px',
	fontSize: '18px',
	backgroundColor: '#d0011b',
	height: '64px',
	lineHeight: 'initial',
};

const headerContainerStyle: React.CSSProperties = {
	position: 'relative',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
	height: '100%',
}

const headerTitleStyle: React.CSSProperties = {
	position: 'relative',
	marginBottom: '4px',
	fontWeight: 500,
}

const headerSubTitleStyle: React.CSSProperties = {
	position: 'relative',
	fontSize: '14px',
}

const footerStyle: React.CSSProperties = {
	textAlign: 'center',
	color: '#fff',
	backgroundColor: '#d0011b',
	padding: '14px',
	display: 'none',
};

const layoutStyle: React.CSSProperties = {
	overflow: 'hidden',
};

const contentStyle: React.CSSProperties = {
  position: 'relative',
	// textAlign: 'center',
	// minHeight: 120,
	// lineHeight: '120px',
	// color: '#fff',
	// backgroundColor: '#0958d9',
};

const errorWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
};

const errorContentStyle: React.CSSProperties = {
  margin: '8px 0',
  borderRadius: '6px',
  border: 'solid 2px #f44336',
  position: 'absolute',
  top: '4px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300px',
  backgroundColor: '#fff',
  boxShadow: '0px 24px 132px #000',
  padding: '12px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  textAlign: 'center',
  lineHeight: '1.5',
  flexDirection: 'column'
}

function IndexPopup() {
	// 评分
	const [rateValue, setRateValue] = useState(5);
	// loading 状态
	const [loading, setLoading] = useState<boolean>(false);
	const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
	const [errorCode, setErrorCode] = useState<ErrorCode>(ErrorCode.Normal);
	// 商品信息
	const [productInfo, setProductInfo] = useState<ProductInfo>({ itemId: '', mainImages: [], variationImages: [] });

	// 获取商品信息
	const getProductInfo = async () => {
		setLoading(true);
		const requestBody: MessageBody = {
			from: MessageSource.POPUP,
			to: MessageSource.CONTENT_SCRIPT,
			type: MessageType.REQUEST_PRODUCT_INFO,
		}
		const res = await sendToContentScript<MessageBody, MessageBody<ProductInfo>>({
			name: MessageType.REQUEST_PRODUCT_INFO,
			body: requestBody,
		});
		if (!res.error) {
			console.log('get res from:', res);
			const { data } = res ?? {};
			const { itemId, mainImages, variationImages } = data ?? {};
			setProductInfo({
				itemId,
				mainImages,
				variationImages,
			});
			setErrorCode(ErrorCode.Normal);
		} else {
			setErrorCode(res.errorCode);
		}
		setLoading(false);
	}

	// 展示 pop up 时触发
	useEffect(() => {
		getProductInfo();
	}, []);


	const onTabChange = (key: string) => {
		console.log(key);
	};

	const downloadAllProductInfo = async () => {
		const { mainImages, variationImages, itemId } = productInfo;
		setDownloadLoading(true);
		await downloadImages([...mainImages, ...variationImages], itemId);
		setDownloadLoading(false);
	}

	const downloadImages = async (imagesInfo: ImageInfo[], prefix?: string) => {
		const imageLinksPromise = imagesInfo.map((info: ImageInfo) => {
			return new Promise<HTMLAnchorElement>((resolve) => {
				const { url, label, type = 'default' } = info;
				var xml = new XMLHttpRequest();
				xml.open('GET', url, true);
				xml.responseType = 'blob';
				xml.onload = function () {
					var a = document.createElement('a');
					var url = window.URL.createObjectURL(xml.response);
					a.href = url;
					a.download = `shopee_assistant_${prefix ?? 'item'}_${type}_${label}.jpg`;
					resolve(a);
				}
				xml.send();
			})
		});
		const imageLinks = await Promise.all(imageLinksPromise);
		imageLinks.forEach((a => a.click()))
	}

	// 表格 columns 配置
	const columns: TableColumnsType<ImageInfo> = [
		{
			title: 'Image',
			dataIndex: 'url',
			key: 'url',
			render: (url: string, info: ImageInfo) => <Image src={url} alt={info.label} />,
			width: 120,
		},
		{
			title: 'Label',
			dataIndex: 'label',
			key: 'label',
			width: 250
		},
		{
			title: 'Action',
			dataIndex: 'url',
			key: 'url',
			width: 80,
			render: (url, info) => {
				return (
					<Button type="link" onClick={() => downloadImages([info], productInfo.itemId)}>Download</Button>
				)
			},
		},
	];

	const items: TabsProps['items'] = [
		{
			key: 'main',
			label: 'Main Images',
			children: (
				<div style={{ position: 'relative', width: '100%', height: '400px', overflowY: 'scroll' }}>
					<Table columns={columns} dataSource={productInfo?.mainImages ?? []} showHeader={false} pagination={false} />
				</div>
			),
		},
		{
			key: 'variation',
			label: 'Variation Images',
			children: (
				<div style={{ position: 'relative', width: '100%', height: '400px', overflowY: 'scroll' }}>
					<Table columns={columns} dataSource={productInfo?.variationImages ?? []} showHeader={false} pagination={false} />
				</div>
			),
		},
	];

	const operations = <Button type="link" onClick={downloadAllProductInfo} loading={downloadLoading}>Download ALL Images</Button>;

	return (
		<ConfigProvider
			theme={{
				token: {
					// Seed Token，影响范围大
					colorPrimary: '#d0011b',
					// borderRadius: 2,
					// 派生变量，影响范围小
					// colorBgContainer: '#f6ffed',
				},
			}}
		>
			<div style={containerStyle}>
				<Flex gap="middle" wrap>
					<Layout style={layoutStyle}>
						<Header style={headerStyle}>
							<div style={headerContainerStyle}>
								<div style={headerTitleStyle}>
									Shopee Assistance
								</div >
								<div style={headerSubTitleStyle}>
									Download Shopee Images & Video
								</div>
							</div>
						</Header>
						<Content style={contentStyle}>
							<Tabs tabBarStyle={{ margin: '0 8px' }} tabBarExtraContent={operations} defaultActiveKey="1" items={items} onChange={onTabChange} />
							{
								!loading && errorCode !== ErrorCode.Normal && (
									<div style={errorWrapperStyle}>
                    <div style={errorContentStyle}>
                      <div>
                        Only work with
                        <br/>
                        Shopee Save Product Page
                      </div>
                      {
                        errorCode === ErrorCode.NotShopeePage && (
                          <Button type="link" target="_blank" href="https://shopee.com/index.html">
                            Go to Shopee
                          </Button>
                        )
                      }
                    </div>
									</div>
								)
							}
						</Content>
						<Footer style={footerStyle}>
							<Button
								style={{
									position: 'relative',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
								}}
								type="link" href="https://chromewebstore.google.com/category/extensions?hl=en" target="_blank">
								<span style={{ paddingBottom: '4px' }}>
									Rate us
								</span>
								<Rate style={{ fontSize: '14px' }} onChange={setRateValue} value={rateValue} />
							</Button>
						</Footer>
					</Layout>
				</Flex>
			</div>
		</ConfigProvider>
	)
}

export default IndexPopup
