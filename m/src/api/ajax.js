/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */

import { Indicator } from 'mint-ui';
import {setHeaders} from '../common/js/utils'
import {BASEURL} from '../common/js/base.js'
import { getLocalSto } from "../common/js/utils.js"
import axios from 'axios'
const baseConfig = {
    baseURL: BASEURL,
    validateStatus: status => {
        return status >= 200 && status < 500;     // 成功状态码范围
    }
}

export default function ajax(obj) {
    obj=obj||{};
    var _obj = {
        url: obj.url || '',
        data: obj.data || {},
        type: obj.type || 'get',
        ctp: obj.ctp || 'application/x-www-form-urlencoded'
    }
    const instance = axios.create(baseConfig);

    _obj.data.uid = _obj.data.uid||getLocalSto('uid')||'';		//获取uid

    let headers = setHeaders(_obj.url, _obj.data);
    // application/x-www-form-urlencoded
    headers['Content-Type'] = _obj.ctp;
    headers['m-version'] = '1.0.0';
    let ajax_obj = {
        url: _obj.url,
        method: 'post',
        data: {},
        headers,
        params: {}
    }

    if (_obj.type.toLowerCase().trim() == 'get') {
        ajax_obj.method = 'get';
        ajax_obj.params = _obj.data;
    } else {
        ajax_obj.data = _obj.data;
    }

    return new Promise((resolve, reject) => {
        instance(ajax_obj).then(res => {  //axios返回的是一个promise对象
            resolve(res.data)  //resolve在promise执行器内部
            Indicator.close()
        }).catch(err => {
            reject(err)
            Indicator.close()
        })
    })


}


