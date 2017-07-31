///<reference path="../wx/wechat.d.ts" />
import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/httpclient';
import { baseUrl } from '../shared/settings';
import { authUrl } from '../shared/settings';
import 'rxjs/add/operator/map';
import { Address } from '../models/address';
import { Md5 } from 'ts-md5/dist/md5';
import { PatchDoc } from '../models/patchdoc';
import { Router } from '@angular/router';

@Injectable()
export class OrderService {

    constructor(private http: HttpClient, private router: Router) { }

    addOrder(order: any, openId?: string) {
        let url = baseUrl + 'orders/';
        if (openId) {
            url += openId;
        }
        return this.http.post(url, order)
            .map(res => res.json());
    }

    getAllOrders(openId?: string) {
        let url = baseUrl + 'orders/';
        if (openId) {
            url += openId;
        }
        url += '?noshowRemove=true';
        return this.http.get(url)
            .map(res => res.json());
    }

    updateOrder(id, order) {
        return this.http.patch(baseUrl + 'orders/' + id, order)
            .map(res => res.json());
    }

    getWxConfig() {
        return this.http.get(baseUrl + 'wechat/getwxconfig')
            .map(res => res.json());
    }

    prePay(infoXml) {
        return this.http.post('https://api.mch.weixin.qq.com/pay/unifiedorder', infoXml);
    }

    getIp() {
        const response = this.http.get(authUrl + 'getclientip');
        return response.map(res => res.json());
    }

    prepay(id, totalfee) {
        const openid = sessionStorage.getItem('openid');
        return this.http.put(baseUrl + `wechat/prepay/${id}/${totalfee}/${openid}`, null)
            .map(res => res.json());
    }

    processPay(totalCost, orderid, orderState) {
        this.prepay(orderid, totalCost * 100)
            .subscribe(res => {
                if (res.state === 1) {
                    const wxconfig = res.body;
                    const prepayid = wxconfig.prepayid;
                    const key = wxconfig.key;
                    const appid = wxconfig.appId;
                    const wxpay: any = {};
                    wxpay.timeStamp = new Date().getTime().toString();
                    wxpay.nonceStr = Math.random().toString(36).substr(2);
                    wxpay.package = `prepay_id=${prepayid}`;
                    wxpay.signType = 'MD5';
                    wxpay.appId = appid;
                    wxpay.paySign = this.buildSign(wxpay, key);
                    WeixinJSBridge.invoke('getBrandWCPayRequest', wxpay, rrr => {
                        if (rrr.err_msg === 'get_brand_wcpay_request:ok') {
                            const patchDoc = [];
                            if (orderState === 0) {
                                const stateOp: PatchDoc = new PatchDoc();
                                stateOp.path = '/State';
                                stateOp.value = '1';
                                patchDoc.push(stateOp);
                            }
                            const notifyState: PatchDoc = new PatchDoc();
                            notifyState.path = '/NotifyState';
                            notifyState.value = '2';
                            patchDoc.push(notifyState);
                            const ispaid: PatchDoc = new PatchDoc();
                            ispaid.path = '/IsPaid';
                            ispaid.value = '1';
                            patchDoc.push(ispaid);
                            // const wxorderid: PatchDoc = new PatchDoc();
                            // wxorderid.path = 'WXOrderId';
                            // patchDoc.push(wxorderid);
                            this.updateOrder(orderid, patchDoc)
                                .subscribe(r => {
                                    if (r.state === 1) {
                                        this.router.navigate(['orderlist/#'], { replaceUrl: true });
                                    } else {
                                        alert(r.message);
                                    }
                                }, e => { alert(e); });
                            delete wxconfig.prepayid;
                            delete wxconfig.key;
                            wx.config(wxconfig);
                            wx.ready(() => {
                                wx.getLocation({
                                    type: 'wgs84',
                                    success: location => {
                                        const latitude = location.latitude; // 纬度，浮点数，范围为90 ~ -90
                                        const longitude = location.longitude; // 经度，浮点数，范围为180 ~ -180。
                                        const geo = [];
                                        const lanDoc = new PatchDoc();
                                        lanDoc.path = '/Latitude';
                                        lanDoc.value = latitude;
                                        geo.push(lanDoc);
                                        const longDoc = new PatchDoc();
                                        longDoc.path = '/Longitude';
                                        longDoc.value = longitude;
                                        geo.push(longDoc);
                                        this.updateOrder(orderid, geo)
                                            .subscribe();
                                    }
                                });
                            });
                            wx.error(function (err) {
                                alert(err);
                            });
                        } else if (rrr.err_msg === 'get_brand_wcpay_request:fail') {
                            alert(rrr.err_desc);
                        } else if (rrr.err_msg === 'get_brand_wcpay_request:cancel') {
                            this.router.navigate(['orderlist/#'], { replaceUrl: true });
                        }
                    });
                } else {
                    alert(res.message);
                }
            }, err => {
                alert(err);
            });
    }

    buildOutId(order) {
        const now = new Date();
        const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate}`;
        return `vege${date}-${order.Id}`;
    }
    buildSign(info, wxkey) {

        const keys = Object.keys(info);
        keys.sort();
        const infos = [];
        keys.forEach(key => {
            infos.push(key + '=' + info[key]);
        });
        let tempStr = infos.join('&');
        tempStr += '&key=' + wxkey;
        // console.log('tempStr is :' + tempStr);
        const sign = Md5.hashStr(tempStr);
        return sign.toString().toUpperCase();
    }
    buildDeal(dealInfo, wxkey) {
        const sign = this.buildSign(dealInfo, wxkey);
        const dealXml = `
       <xml>
          <appid>${dealInfo.appid}</appid>
          <body>${dealInfo.body}</body>
          <mch_id>${dealInfo.mch_id}</mch_id>
          <nonce_str>${dealInfo.nonce_str}</nonce_str>
          <notify_url>http://wxpay.wxutil.com/pub_v2/pay/notify.v2.php</notify_url>
          <openid>${dealInfo.openid}</openid>
          <out_trade_no>${dealInfo.out_trade_no}</out_trade_no>
          <spbill_create_ip>${dealInfo.spbill_create_ip}}</spbill_create_ip>
          <total_fee>${dealInfo.total_fee}</total_fee>
          <trade_type>${dealInfo.trade_type}</trade_type>
          <sign>${sign}</sign>
        </xml>`;
        return dealXml;
    }
}
