/*
状态对象
 */

export default {
    // 登陆检测轮询timer
    checkLoopT: null,

    // 用户信息
    checkLogin: {},

	//订单列表
	orderLists:[],
	//我的收藏
	collectLists:[],
	//订单详情专用
    agreeParameteData:{},

    // 地区
    area: [],

    // 地址
    address: {},

    // 协议 1 的时候显示
    is_agreement: 0

}