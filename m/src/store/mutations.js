/*
直接同步更新state的多个方法的对象
 */

export default {

    // 用户信息
    checkLogin(state, data ){
        state.checkLogin = data;
    },
	//删除用户信息
	unCheckLogin(state, data ){
        state.checkLogin = data;
    },
	//我的订单
   	set_orderList(state,{data}){
        state.orderLists = data;
    },
    //删除订单
    delOrder(state,{data}){
    	var order = state.orderLists || [];
    	for(let i = 0; i < order.length; i++ ){
    		if(order[i].id == data.id){
    			state.orderLists[i].order_status = 2;
    		}
    	}


    },
    //我的收藏
    set_collectList(state,{data}){
    	state.collectLists = data
    },
    //订单详情专用
    set_agree(state,{data}){
    	state.agreeParameteData = data
    },


    // 地区
    getArea(state, data){
    	state.area = data
    },

    // 收货地址
    getAddress(state, data){
    	state.address = data
    },


    // 协议
    isAgreement(state, is_agreement){
    	state.is_agreement = is_agreement;
    },




}