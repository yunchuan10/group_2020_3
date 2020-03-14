/*
    包含n个接口请求函数的模块,函数的返回值: promise对象
 */

import ajax from './ajax'


// 首页接口
export const HomeIndex = () => ajax(
	{
		url: 'index',
        type: 'post',
        data: {
            topCategory: 0,
            secCategory: 0,
            page: 1,
            pageSize: 10
        }
	}
)
// 获取首页分类
export const GetCategory = ( data ) => ajax(
	{
		url: 'getCategory',
        type: 'post',
        data
	}
)

// 课程列表接口
export const CourseList = ( data ) => ajax(
	{
		url: 'index',
        type: 'post',
        data
	}
)
//售后提交接口
export const afterSale = ( data ) => ajax(
	{
		url: 'myFeedBack',
        type: 'post',
        data
	}
)
//图片上传返回路径接口--已写在页面中
//export const upyun = ( data ) => ajax(
//	{
//		url:'upyun',
//		type:'post',
//		ctp: 'multipart/form-data',
//		data
//	}
//)
//修改昵称或头像接口
export const updateuser = ( data ) => ajax(
	{
		url:'updateuser',
		type:'post',

		data
	}
)
//收藏列表接口
export const CollectLists = ( data ) => ajax(
	{
		url:'myCollect',
		type:'post',
		data
	}
)
//订单列表接口
export const OrderLists = ( data ) => ajax(
	{
		url:'myOrder',
		type:'post',
		data
	}
)
// 课程详情
export const CourseDetail = ( data ) => ajax(
	{
		url:'courseDetail',
		type:'post',
		data
	}
)

// 课程收藏
export const cancelCollect = ( data ) => ajax(
	{
		url:'cancelCollect',
		type:'post',
		data
	}
)

// 查询优惠码
export const getCouponData = ( data ) => ajax(
	{
		url:'xcx_check_coupon',
		type:'post',
		data
	}
)

// 查询课程是否是实物
export const courseAddress = ( data ) => ajax(
	{
		url:'isObject',
		type:'post',
		data
	}
)

courseAddress

// 立即支付生成订单号
export const createOrder = ( data ) => ajax(
	{
		url: 'Android_create_order',
        type: 'post',
        data
	}
)

// 服务协议
export const serviceAgreement = ( data ) => ajax(
	{
		url:'courseAgreement',
		type:'post',
		data
	}
)

//订单详情接口
export const OrderDetail = ( data ) => ajax(
	{
		url:'order_detail',
		type:'post',
		data
	}
)
//订单取消接口
export const CancelOrder = ( data ) => ajax(
	{
		url:'wxCancelOrder',
		type:'post',
		data
	}
)
//获取个人信息
export const PersonMessage = ( data ) =>ajax(
	{
		url:'myMsg',
		type:'post',
		data
	}
)

// 登陆短信验证码
export const agrementCheckSms = ( data ) =>ajax(
	{
		url:'checkSms',
		type: 'post',
		data: {
            type: data.type||'m',
            mobile:data.mobile,
            code:data.code
       }
	}
)

// 登陆手机验证码
export const agrementSendSms = ( mobile ) =>ajax(
	{
		url:'wxSendSms',
		type: 'post',
		data: {
			smsType: mobile.smsType||'',
            type: mobile.type||'m',
            mobile:mobile.mobile
       }
	}
)

// 登陆获取短信验证码
export const LoginSms = ( mobile, type , smsType ) =>ajax(
	{
		url:'app_smscaptcha',
		type: 'post',
		data: {
			smsType: smsType ||'login',
            type: type||'m',
            mobile
        }
	}
)

// 短信登陆
export const SmsLogin = ( data ) =>ajax(
	{
		url:'smslogin',
		type: 'post',
		data
	}
)

// 登陆获取短信验证码
export const PasswdLogin = ( data ) =>ajax(
	{
		url:'passwd_login',
		type: 'post',
		data
	}
)


// modify_passwd重置密码
export const ModifyPasswd = ( data ) =>ajax(
	{
		url:'modify_passwd',
		type: 'post',
		data
	}
)

// 获取用户信息
export const CheckLogin = ( token ) =>ajax(
	{
		url:'checklogin',
		type: 'get',
		data: {
            token,
            type: 'm'
        }
	}
)



// 获取用户信息
export const GetArea = ( ) =>ajax(
	{
		url:'area',
		type: 'post'
	}
)


// 获取地址
export const GetAddress = ( uid ) =>ajax(
	{
		url:'getAddress',
        type: 'post',
        data:{uid}
	}
)


// 编辑地址
export const AddAddress = ( data ) =>ajax(
	{
		url:'addAddress',
        type: 'post',
        data
	}
)

// 获取协议接口
export const getAgreementContent = (uid) => ajax(
	{
		url:'getAgreementContent',
        type: 'post',
        data:{
            uid
        }
	}
)

// 获取协议接口
export const myAgreement = (data) => ajax(
	{
		url:'myAgreement',
        type: 'post',
        data
	}
)


// 获取试听列表接口
export const tryLesson = (goods_id) => ajax(
	{
		url:'tryLesson',
        type: 'post',
        data: {
            goods_id
        }
	}
)











