
// import sha1 from 'js-sha1'
// const ShaFn = require('./sha.js');
// const Sha1 = ShaFn();
import {sha1} from './sha'
// const sha1 = ShaFn();

// 配置请求头
export const setHeaders = function ( url='', data={} ){
    let headers = {
        "dfsx-authorize": {}
    };
    let header_array = (function (url) {
        var result = {};
        var query = url.split("?");
        if (query.length === 1) {
            return result;
        }
        query = query[1];
        var queryArr = query.split("&");
        queryArr.forEach(function (item) {
            var value = item.split("=")[1];
            var key = item.split("=")[0];
            result[key] = value;
        });
        return result;
    })(url);
    let header_config = {
        "client_id": "0005",
        "client_key": "c62c854d4d756cccd556173594f85d0fa3b6be26"
    };
    let headers_opt = {
        "clientId": header_config.client_id,
        "stamp": Math.round((new Date()).getTime() / 1000)
    };
    let key_arr = [];
    let sign = '';

    for (var key in headers_opt) {
        header_array[key] = headers_opt[key];
    }
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            header_array[key] = data[key];
        }
    }
    for (var key in header_array) {
        key_arr.push(key);
    }
    key_arr.sort();
    for (var key in key_arr) {
        sign += "&" + key_arr[key] + "=" + header_array[key_arr[key]];
    }
    sign += header_config.client_key;
    // console.log(sign, sha1(sign.substr(1)).toUpperCase(), 'headers-sign')
    headers_opt["sign"] = sha1(sign.substr(1)).toUpperCase();
    headers_opt = JSON.stringify(headers_opt);
    headers["dfsx-authorize"] = headers_opt;
    return headers;
}

//获取cookie
export const getCookie = function (name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null){
        return unescape(arr[2]);
    }else{
        return null;
    }
}

// 设置cookie
export const setCookie = function (name,value,Days){
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);    //设置过期时间
    document.cookie = name + "="+ (value) + ";expires=" + exp.toGMTString()+";path=/";
}

// 获取存储
export const getLocalSto = function(sto_name){
    if(window.localStorage){
        // 支持localStorage
        var val=localStorage.getItem(sto_name);
        if(val==="undefined"){
            return "undefined";
        }else if(typeof val === "number"){
            return val;
        }else if(val){
            return JSON.parse(val)?JSON.parse(val):"";
        }
    }else{
        // 用cookie
        return JSON.parse(a.getCookie(sto_name))?JSON.parse(a.getCookie(sto_name)):"";
    }
}

// 存储本地
export const setLocalSto = function(sto_name,data){
    var a=this;
    if(window.localStorage){
        localStorage.setItem(sto_name,JSON.stringify(data));
    }else{
        setCookie(sto_name,JSON.stringify(data),10000);
    }
}

// 删除本地存储
export const delLocalSto = function(sto_name){
    if(window.localStorage){
        if(localStorage.getItem(sto_name)){
            localStorage.removeItem(sto_name);
        }
    }else{
        if(getCookie(sto_name)){
            setCookie(sto_name,"",-9999999);
        }
    }
}

// 判断移动端
export const isMobile = function() {
    var userAgentInfo = navigator.userAgent;
    var Agents=["Android","iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
    var flag=false;
    for(var v=0;v<Agents.length;v++) {
        if(userAgentInfo.indexOf(Agents[v])>0){
            flag=true;
            break;
        }
    }
    return flag;
};

// 判断设备
export const mobileType = function() {
	let obj = {};
    let userAgentInfo = navigator.userAgent+'';
    if(userAgentInfo.indexOf('Android')>0){
        obj.isAndroid = true;
    }
    if(userAgentInfo.indexOf('iPhone')>0){
        obj.isIos = true;
    }
    if(userAgentInfo.indexOf('iPad')>0){
        obj.isPad = true;
    }
    if(/qq\s*\//i.test(navigator.userAgent) == true){
        obj.isQQ = true;
    }
    if(/micromessenger\s*\//i.test(navigator.userAgent) == true){
    	obj.isWX = true;
    }
    return obj;
};

// 判断pad
export const isPad = function() {
    var userAgentInfo = navigator.userAgent+''||'';
    var flag=false;
    if(userAgentInfo.indexOf('iPad')>0){
        flag=true;
    }
    return flag;
};

























