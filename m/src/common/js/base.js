
import Vue from 'vue'
// import { Header } from 'mint-ui';



// ----------- 环境配置 --------------

// export const dev_online = {
//     BASEURL : 'http://newapi.xkedu.top/',
//     baseURL : "http://www.xkedu.top/orderpay/"
// }

export const dev_online = {
    BASEURL : 'https://newapi.dongfangshangxue.com/',
    baseURL : "http://www.dongfangshangxue.com/orderpay/"
}

// export const BASEURL = 'http://newapi.xkedu.top/'
export const BASEURL = dev_online.BASEURL;

// ----------- 环境配置结束 --------------





// 公共头部
import header from '../../components/header'
import appoint from '../../components/appoint'
import agreement from '../../components/agreement'








// 添加公共组件
export const commonComp = () => {
    Vue.component("v-header", header);
    Vue.component("v-appoint", appoint);
    Vue.component("v-agreement", agreement);
}




