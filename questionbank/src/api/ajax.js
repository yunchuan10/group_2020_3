/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */

import {setHeaders} from '../common/js/utils'

console.log(process.env.API_BASE_URL, '的单独的')


import axios from 'axios'
const baseConfig = {
    baseURL: process.env.API_BASE_URL,
    validateStatus: status => {
        return status >= 200 && status < 500;     // 成功状态码范围
    }
}

export default function ajax(obj) {
    var _obj = {
        url: obj.url || '',
        data: obj.data || {},
        type: obj.type || 'get',
    }
    const instance = axios.create(baseConfig);

    let headers = setHeaders(_obj.url, _obj.data);
    let ajax_obj = {
        url: _obj.url,
        method: obj.type || 'post',
        data: {},
        headers,
        params: {}
    }


    // 添加请求拦截器
    // instance.interceptors.request.use( res => {
    //     // 在发送请求之前做些什么
    //     // return Promise.resolve(res.data);
    //     console.log(1,res)
    //     return res.data;
    // }, function (error) {
    //     // 对请求错误做些什么
    //     console.log(2,error)
    //     return Promise.reject(error);
    // });

    //添加响应拦截器
    // instance.interceptors.response.use( res => {
    //     return res.data;
    // }, function (error) {
    //     console.log('err失败' + error)
    //     return Promise.reject(error)
    // })


    if (_obj.type.toLowerCase().trim() == 'get') {
        ajax_obj.method = 'get';
        ajax_obj.params = obj.data || {};
        // return instance.get( obj.url, {params: obj.data} )
    } else {
        ajax_obj.data = obj.data || {};
        // return instance.post( obj.url, {data: obj.data} )
    }

    return new Promise((resolve, reject) => {
        instance(ajax_obj).then(res => {  //axios返回的是一个promise对象
            resolve(res.data)  //resolve在promise执行器内部
        }).catch(err => {
            reject(err)
        })
    })


}


