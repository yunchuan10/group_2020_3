/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */

import axios from 'axios'
import { Indicator } from 'mint-ui';
import {setHeaders} from '../common/js/utils'
import { getLocalSto } from "../common/js/utils.js"
import {BASEURL} from '../common/js/base.js'

// axios配置
const baseConfig = {
    // timeout: 7000, // 请求超时时间
    baseURL: BASEURL,
    validateStatus: status => {
        return status >= 200 && status < 500;     // 成功状态码范围
    }
}

export default function ajax( obj = {} ) {

    // 请求传入数据
    let _obj = {
        url: '',
        data: {},
        type: 'get',
        ctp: 'application/x-www-form-urlencoded'
        // 'ctp': 'application/json;charset=UTF-8'
    };
    for(var obj_k in obj){
        obj[obj_k] && (_obj[obj_k] = obj[obj_k])
    }

    _obj.data.uid = _obj.data.uid||getLocalSto('uid')||'';		//获取uid
    let headers = setHeaders(_obj.url, _obj.data);
    // application/x-www-form-urlencoded
    headers['Content-Type'] = _obj.ctp;
    headers['m-version'] = '1.0.0';


    // axios请求配置参数
    let ajax_obj = {
        url: _obj.url,
        method: _obj.type || 'post',
        headers,
        data: {},
        params: {}
    }
    if (_obj.type.toLowerCase().trim() == 'get') {
        ajax_obj.method = 'get';
        ajax_obj.params = _obj.data;
    } else {
        ajax_obj.data = _obj.data;
    }

    // axios 实例
    const instance = axios.create(baseConfig);



    // 添加请求拦截器
    // instance.interceptors.request.use(config => {
    //     if(store.getters.token){
    //         config.headers['TOKEN']=getCookie('TOKEN')
    //     }
    //     return config
    // },
    // error => {
    //     return Promise.reject(error)
    // })

    // 添加响应拦截器
    instance.interceptors.response.use(res => {
        Indicator.close()
        return res.data
    }, error => {
        Indicator.close()
        return Promise.reject(error)
    })

    return instance(ajax_obj);


    // return new Promise((resolve, reject) => {
    //     instance(ajax_obj).then(res => {  //axios返回的是一个promise对象
    //         resolve(res.data)  //resolve在promise执行器内部
    //         Indicator.close()
    //     }).catch(err => {
    //         reject(err)
    //         Indicator.close()
    //     })
    // })


}


