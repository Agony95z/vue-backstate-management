import wx from 'weixin-js-sdk';
import * as api from '@/api';
import env from '@/app-config/env';
export const wxShareInit = (params: any = {}, callback = () => {}) => {
  const ua = navigator.userAgent.toLocaleLowerCase();
  const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  let signatureUrl = window.location.href.split('?')[0];

  if (isIOS) {
    signatureUrl = encodeURIComponent(signatureUrl);
  }
  let targetUrl = params.targetUrl;
  console.log('targetUrl--->', targetUrl);
  targetUrl = window.btoa(`${targetUrl}`);
  const appId = { uat: 'wx638ec357bb5012c7', prod: 'wxa4a28e4248ecf7ad' }[
    env.VITE_API_ENV
  ];
  const baseUrlShare = `${
    params.hosts!.wxshare
  }/wechatweb/tkpcp/oauth/redirect/wechat-oauth-url`;

  const wxShareUrlIndex = `${baseUrlShare}?appId=${appId}&targetUrl=${targetUrl}&scope=web_oauth`;

  api
    .wxshare_signature({ appId, targetUrl: signatureUrl })
    .then((res) => {
      if (res && res.data.code === '200') {
        const { timestamp, nonceStr, signature } = res.data.data;
        wx.config({
          // debug: env.VITE_API_ENV === 'uat' ? true : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          debug: false,
          appId, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature, // 必填，签名
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
        });
        wx.checkJsApi({
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
          success: function (res: any) {
            console.log('wx api 检查', res);
          },
        });

        wx.ready(function () {
          callback();
          //需在用户可能点击分享按钮前就先调用
          function doShareDone() {
            console.log('初始进入页面回调');
          }
          function doShareCancel() {
            console.log('取消了分享');
          }
          // let title =  '北京普惠健康保'
          // let desc = '政府指导，老少同价，保障紧密衔接北京市基本医疗保险，作为北京市补充医疗保险，2023年度重磅升级，扩大参保人群范围，在价格不变的基础上，降低免赔额、增加特药数量，切实减轻大额医疗支出带来的经济负担。'

          // let imgUrl =
          //   encodeURI('http://tkpcp.pension.taikang.com/cityplat/510101/20221024-105733.png');
          const link = wxShareUrlIndex;
          // 分享给好友
          const updateAppMessageShareData = {
            title: params.title,
            desc: params.desc,
            imgUrl: params.imgUrl,
            link,
            success: doShareDone,
            cancel: doShareCancel,
          };
          console.log('onMenuShareAppMessageParam', updateAppMessageShareData);

          wx.updateAppMessageShareData(updateAppMessageShareData);
          // 分享到朋友圈updateTimelineShareData
          const updateTimelineShareDataParam = {
            title: params.title,
            imgUrl: params.imgUrl,
            link,
            success: doShareDone,
            cancel: doShareCancel,
          };
          wx.updateTimelineShareData(updateTimelineShareDataParam);
        });

        wx.error((err: any) => console.log('签名失败', err));
      }
    })
    .catch((err) => console.log(err));
};

// 使用
const urlObj = {}
const getWxSDK = () => {
  let params = {
    targetUrl: '',
    hosts: {
      uat: {
        jiangmenActivity: 'https://jiangmenyybtest.pension.taikang.com',
        wxshare: 'https://cpwxtest.pension.taikang.com',
      },
      prod: {
        jiangmenActivity: 'https://cpgw.pension.taikang.com',
        wxshare: 'https://cpwx.pension.taikang.com',
      },
    }[env.VITE_API_ENV],
    title: '五邑父母专享防癌保障',
    desc: '五邑父母定制防癌重疾险，确诊一次性赔付，门槛低，价格低，三高糖尿病也可投。',
    imgUrl: encodeURI(
      'http://tkpcp.pension.taikang.com/cityplat/activity/0406v2-yl/wxShareYL.png'
    ),
    // encodeURI(wxshare)
  };
  params.targetUrl = `${
    params.hosts?.jiangmenActivity
  }/activity/#/fangai/0412v1?mobile=${urlObj.mobile}&name=${encodeURIComponent(
    urlObj.name
  )}&certType=${urlObj.certType}&certNo=${urlObj.certNo}&organCode=${
    urlObj.organCode
  }&salesmanCode=${urlObj.salesmanCode}&activityCode=${
    urlObj.activityCode
  }&activityMessageId=${urlObj.activityMessageId}&deliverCode=${
    urlObj.deliverCode
  }`;
  wxShareInit(params);
};

// 下载
export function useDownTemplateFile (api, filename = new Date().getTime(), api_params = {}) {
  api(api_params).then(res => {
    const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
    const link = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob) // 创建URL
    link.href = objectUrl
    link.download = `${filename}.xls` // 自定义文件名
    link.click() // 下载文件
    URL.revokeObjectURL(objectUrl) // 释放内存
  })
}