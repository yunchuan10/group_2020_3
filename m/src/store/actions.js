/*
通过mutation间接异步更新state的多个方法的对象
 */

//引入ajax
import { Toast,Indicator } from "mint-ui";
import { CheckLogin, GetArea, GetAddress, AddAddress } from '../api'
import { setLocalSto } from "../common/js/utils.js"
export default {

    // 轮询登陆状态
    checkLoginLoop( {commit, state}, {token, cb} ){
        state.checkLoopT && clearTimeout(state.checkLoopT)
        CheckLogin(token).then( res=>{
            res.result = res.result||{};
            let is_agreement = res.result.is_agreement||0;
            commit('isAgreement', is_agreement );
            cb && cb(res)
        }).catch( err=>{
            cb && cb({})
        })
    },

    // 请求用户信息
    checkLogin( {commit, state}, token ){
        CheckLogin(token).then( res=>{
            if(res.statusCode==200){
                res.result = res.result||{};
            	setLocalSto('uid', res.result.id+''||'');
            	setLocalSto('guid', res.result.guid+''||'');
                commit('checkLogin', (res.result||{}) );

                let is_agreement = res.result.is_agreement||0;
                commit('isAgreement', is_agreement );
            }
        } )
    },
	//删除用户信息
	unCheckLogin({commit,state},data){
    	commit('unCheckLogin',data);
    	commit('getAddress', {});
    },
	//我的订单对数据操作
	set_orderList({commit,state},data){
    	commit('set_orderList',data);
    },
    //删除订单
    delOrder({commit,state},data){
    	commit('delOrder',data);
    },
    //我的收藏
    set_collectLists({commit,state},data){
    	commit('set_collectList',data);
    },
    //订单详情专用
    set_agree({commit,state},data){
    	commit('set_agree',data);
    },

    // 获取地区
    getArea({commit,state}, cb){
        GetArea().then(res=>{
            res.result = res.result||[];
            cb && cb(res.result)
            commit('getArea', res.result);
        }).catch(err=>{

        })
    },

    // 收货地址
    getAddress({commit,state}, {uid,cb}){
        GetAddress(uid).then(res=>{
            res.result = res.result||{};
            cb && cb(res.result)
            commit('getAddress', res.result);
        }).catch(err=>{

        })
    },

    // 编辑收货地址
    addAddress({commit,state}, {data, cb}){
        AddAddress(data).then(res=>{
        	if(res.statusCode == 200){
	        	res.result = res.result||{};
	            commit('getAddress', res.result);
	            Toast({
	                message: '收货地址保存成功！',
	                duration: 1
	            });
	            setTimeout(()=>{
	            	cb && cb()
	            }, 1)
        	}else{
        	Toast({
                message: res.message,
                duration: 1500
           });
          }
        }).catch(err=>{
            Toast({
                message: '收货地址保存失败！',
                duration: 1500
            });
        })
    },


}