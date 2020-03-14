<template>
	<div class='orders-c'>
        <!-- 头部 -->
        <v-header :no_hasauth="system || addressDisplay" ></v-header>
        <!-- 收货地址 -->
        <div class="order-address"  v-if="system || addressDisplay">
      <!--  	<div class="address-name">收货地址</div>-->
        	<div class="address-content" @click="addAddress">        	
	        	<div class="address-data" v-if="!address.id">选择收货地址</div>
		        <div class="address-data address-flex" v-else>
		        	<img class='address-img' src='../common/imgs/common/address.png'></img>
	        		<div style="width:97%;">
	        			<div class="address-data-name">{{address.consignee}}<span>{{address.tel}}</span></div>
	        			<div class="address-data-address">{{address.province}}{{address.city}}{{address.district}}{{address.address}}</div>
	        		</div>
	        		
	        	</div>
        		<img class='address-img-right' src='../common/imgs/common/address_right.png'/>
        	</div>
        </div>
        <!-- 产品 -->
        <div class='product'>
            <div class='product-r'>
                <p class='product-r-t'>{{parameteData.goodsName}}</p>
                <p class='product-r-b'>¥ {{parameteData.goodsPrice}}</p>
            </div>
        </div>
        <!-- 优惠券 -->
        <div class='discount'>
            <div v-if="parameteData.goodsPrice!='0'">
                <span>优惠码</span>
                <mt-switch v-model="switchVal" @change="switchChang"></mt-switch>
                <!-- <switch  color="#2C8CFF" bindchange="codeSwitchChange" /> -->
            </div>
            <transition name="fade">
                <div class='discount-input' v-show="switchVal">
                    <input type="text" v-model='coupon_sn' oninput="if(value.length>16)value=value.slice(0,16)" placeholder='请输入16位优惠码' />
                </div>
            </transition>
        </div>
        <div class='pay-msgs'>
                <div>
                    <span>原价</span>
                    <span class='pay-spanr'>￥{{parameteData.goodsPrice}}</span>
                </div>
                <div>
                    <span>优惠券</span>
                    <span class='pay-spanr' >-￥{{couponDiscount}}</span>
                </div>
                <div>
                    <span>实付价</span>
                    <span class='pay-spanr2'>￥
                        {{(parameteData.goodsPrice * 1000 - couponDiscount * 1000)/1000}}
                    </span>
                </div>
            </div>
        <!-- 立即支付 -->
        <div class='pay-form' v-show="hidshow">
            <div class='pay-sub' v-if="parameteData.goodsPrice!='0'">
                <div class='pay-btn button-able' disabled="false" @click="createOrder">立即支付</div>
            </div>
            <div class='pay-sub' v-else>
                <div class='pay-btn button-able'  @click="createFreeOrder">免费获取</div>
            </div>
       </div>

        <!-- 免费获取成功 -->
        <div class="auth-setting" v-if="boxShow">
            <div class='auth-contain'>
                <img class='auth-contain-icon' src='../common/imgs/common/fres.png' />
                <span class='auth-text1'>获取成功</span>
                <span class='auth-text2'>请前往东方尚学app或东方尚学官网，准备开始学习吧！</span>
            </div>
        </div>

    </div>
</template>

<script>
	import { Indicator, Toast ,Switch ,MessageBox } from 'mint-ui';
	import { createOrder,getCouponData,CourseDetail,courseAddress} from '../api';
	import Vue from 'vuex';
    import { mapGetters, mapActions } from 'vuex';
	export default {
		data(){
			return{
                switchVal: false,
                parameteData: {},
			    couponDiscount: '0', // 优惠券金额
			    parameteData:{
			    	goodsName: '',
			    	goodsPrice: '',
			    	goodsAllId:'',
			    	goodsId:'',
			    }, 
			    coupon_sn:'',  // 优惠码
			    baseURL:this.GLOBAL.baseURL, //直接通过this访问全局变量。//支付页面的公共路径 
			    // app数据地址
			    system:'',
				addressDisplay: false,  // 是否显示地址
			    address:{},
			    isAddress:'',
			    // 键盘弹出
			    docmHeight: '0',  //默认屏幕高度
                hidshow:true,  //显示或者隐藏footer,
                boxShow: false, // 免费领取成功显示
                jumpId: '',  // 免费获取之后跳转判断
			}
		},
		// 挂载  reisze 事件
		mounted() {
			// 安卓控制
			if (/(Android)/i.test(navigator.userAgent)) {
				setTimeout(()=>{
					this.docmHeight = document.documentElement.clientHeight;
	            	window.onresize =()=>{
	            		this.heightCheck();
			  	  	}
				},500)
			}
        },
			
        created() {
        	Indicator.open("加载中...");
	        //获取URL上传递过来的参数
	        this.parameteData.goodsId = this.$route.query.goodsId;
	        this.parameteData.goodsAllId = this.$route.query.goodsAllId;
	        this.system = this.$route.query.system;        
	        // app数据
	        if(this.system){
	        	this.uid = this.$route.query.uid || "";
	        }else{
	        	this.uid = this.checkLogin.id || "";
	        }
	        // 获取课程详情
	        this.courseDetail(this.parameteData.goodsId,this.uid);
	        
	        // 获取我的地址
	        this.getUserAddress(this.uid);
	        
	        // 获取商品是否是实物
	        if(this.$route.query.goodsAllId){
	        	this.showAddress(this.$route.query.goodsAllId);  
	        }else{
	        	this.showAddress(this.$route.query.goodsId);  
	        }
	        
        },
        computed: {
        	...mapGetters(["checkLogin"])
    	},
    	watch: {
    		coupon_sn:'getDiscountCode'
        },
        //当进入组件之前，执行 beforRouteEnter 路由钩子函数
        beforeRouteEnter(to,from,next){
            next((vm)=>{ //参数vm就是当前组件的实例。
            var that = vm;
             if(from.name== 'serviceAgreement'){
                 that.jumpId = '2'
             }else{
                  that.jumpId = '1'
             }
            })
        },

        methods: {
          ...mapActions(["getAddress"]),
          // 获取屏幕高度
          heightCheck(){
          	if(this.$route.path!="/orderSure"){
          		return;
          	}
          	if(this.docmHeight>document.documentElement.clientHeight+2){
		  		this.hidshow = false;
		  	  }else{
		  	    this.hidshow = true;
		  	  }
          },
          
    	  // 优惠券更改
          switchChang(){
            if(this.switchVal == false){
           	  this.coupon_sn = '';
           	  this.couponDiscount = '0';
            }
          },
          // 获取商品是否是实物
       	 showAddress: function(goodsId) {
            courseAddress({
                goodsId: goodsId,
            }).then(res => {
            	if(res.statusCode ==200 && res.result.is_object ==1){
            		this.addressDisplay = true;
            	}
            })
            .catch(err => {
               Toast({
                   message: "网络异常,稍后重试",
                   duration: 2000
               });
            });
         },
          // 获取优惠码
          getDiscountCode:function(){
          	if(this.coupon_sn.length == 16){
          		getCouponData({
		            uid: this.uid,
			        goods_id: this.parameteData.goodsId,
			        coupon_sn: this.coupon_sn,
			        goodsAllId: this.parameteData.goodsAllId,
	            }).then(res => {
	                if (res.statusCode == '200') {
				        this.couponDiscount =  res.result.discount
				    }else{
				    	Toast({
				           message: res.message,
				           duration: 2000
				       });	
				    } 
	            })
	            .catch(err => {
	               Toast({
	                   message: "网络异常,稍后重试",
	                   duration: 2000
	               });
	            });
          	}else{
               	this.couponDiscount = '0';  // 优惠金额重置
          	}
          },
        //获取课程详情方法
        courseDetail: function(goodsId, uid) {
            CourseDetail({
                goodsId: goodsId,
                uid: uid 
            }).then(res => {
				let resInfo = res.result.info;
				this.parameteData.goodsName = resInfo.goods_name;
				this.parameteData.goodsPrice = resInfo.shop_price;
            })
            .catch(err => {
               Toast({
                   message: "网络异常,稍后重试",
                   duration: 2000
               });
            });
        },
        // 新增订单地址
        addAddress: function(){
        	this.$router.push({ path: '/address', query:{uid: this.uid}})
        },
        // 新增订单地址
        getUserAddress: function(uid){
        	const {address} = this.$store.state;
            if(address.id||address.tel){
                this.address = address;
            }else{  // 没有去请求
                Indicator.open('加载中...');
                this.getAddress({uid, cb: (res)=>{
                     this.address =  res;
                }});
            }     	
        },
        // 地址弹出框
        addressBox: function(){
	        Toast({
                message: '请选择收货地址',
                duration: 2000
            });
        },
        // 免费获取
        createFreeOrder: function(){
		  	createOrder({
		  		uid: this.uid,
		        goods_id: this.parameteData.goodsId,
		        coupon_sn: this.coupon_sn,
		        goodsAllId: this.parameteData.goodsAllId,
		        source: '1',
		        isAddress: this.isAddress,
		  	}).then(res =>{
		  		if(res.statusCode == 200){
		  			this.boxShow = true;
                    setTimeout(() => {
                            if(this.jumpId == '2'){
                                 window.history.go(-2);
                            }else{
                                 this.$router.replace({ path: '/courseDetails', query:{goodsId: this.parameteData.goodsId}})
                            }
                    }, 3000);
		  		}
		  	}).catch(err =>{
		  	   Toast({
                   message: "网络异常,稍后重试",
                   duration: 2000
               });
		  	});
	    },
	     // 支付 
	     createOrder: function(){
	     	if((!this.address.id && this.system) || (!this.address.id && this.addressDisplay) ){
		  		// 弹出添加收货地址弹出框
		  		this.addressBox();
		  		return false;
		  	}
	     	if((this.address.id && this.system) || (this.address.id && this.addressDisplay)){
	     		this.isAddress = '1';
	     	}
		  	createOrder({
		  		uid: this.uid,
		        goods_id: this.parameteData.goodsId,
		        coupon_sn: this.coupon_sn,
		        goodsAllId: this.parameteData.goodsAllId,
		        source: '1',
		        isAddress: this.isAddress,
		  	}).then(res =>{
		  		if(res.statusCode == 200){
		  			if(res.result){
			            // 跳转到app地址
		              	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && this.$route.query.system) {
			                //原生返回
		                	window.webkit.messageHandlers.immediatePayment.postMessage(res.result);
			            } else if (/(Android)/i.test(navigator.userAgent) && this.$route.query.system) {
			            	let order_no = res.result + '';
			            	javascript:onPay.onPay(order_no);
			            } else { 
			            	 window.location.href=this.baseURL + res.result;
			            }	
			        }
		  		}
		  		
		  	}).catch(err =>{
		  	   Toast({
                   message: "网络异常,稍后重试",
                   duration: 2000
               });
		  	});
	    }

 },
}
</script>
<style lang="less">
    .confirmButton{
   		color: #3CC51E;
   		/*font-size: .34rem;*/
    }
    .orders-c{
        padding-bottom: .5rem;
        .product{
            margin: .20rem 0 .20rem;
            background: #fff;
            min-height: .30rem;
            padding: .4rem;
            display: flex;
            align-items: flex-start;
        }
        .product-l{
            width: 2.20rem;
            height: 1.40rem;
            line-height: 1.40rem;
            font-size: 0;
            text-align: center;
            border-radius: .12rem;
            overflow: hidden;
        }
        .product-l img{
            width: 100%;
            max-height: 100%;
        }

        .product-r{
            display: flex;
            height: 100%;
            justify-content: space-between;
            align-items: center;
            font-size: .27rem;
            width: 100%;
        }
        .product-r-t{
            font-size:.27rem;
            color:#494949;
            line-height:.37rem;
            width: 80%;
            min-height: .1rem;
        }

        .product-r-b{
            font-size:.32rem;
            color:#FE5B59;
            line-height:.33rem;
            text-align: right;
         /*   width: 15%;*/
        }
        /* 优惠卷 */
        .discount>div{
            display: flex;
            justify-content: space-between;
            padding: 0 .40rem;
            background: #fff;
            height: 1.00rem;
            line-height: 1.00rem;
            color: #555;
        }
        .discount>.discount-input{
            border-top: 1px solid #efeff4;
            text-align: right;
            input{
                width: 100%;
                flex: 1;
                align-self: center;
                text-align: right;
            }
        }
        /* 立即支付 */
        .pay-form{
            position: fixed;
            z-index: 9;
            bottom: 0;
            left: 0;
            width: 100%;
         /*   height: 3.93rem;*/
            /*background: #fcfcfc;*/
        }
        .pay-msgs{
            height: 1.80rem;
            padding: .2rem .40rem .3rem;
            line-height: .60rem;
            color: #555;
            background: #fff;
            margin-top: .2rem;
        }
        .pay-msgs>div{
            display: flex;
            justify-content: space-between;
        }
        .pay-spanr{
            color: #111;
        }
        .pay-spanr2{
            color: #F43530;
        }
        .pay-sub{
            height: 1.40rem;
            text-align: center;
            padding: .20rem .32rem 0;
        }
        .pay-btn{
            color: #fff;
            font-size: .36rem;
            height: .86rem;
            line-height: .86rem;
            border-radius: .44rem;
            border: 0 none;
            width: 100%;
        }
        .pay-code{
            background: #fff;
            position: fixed;
            z-index: 12;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.6);
        }

        /*免费获取成功*/
        /**index.wxss**/
        .auth-setting{
            position: fixed;
            z-index: 500;
            background: rgba(0, 0, 0, .6);
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
        .auth-contain{
            display: flex;
            flex-direction: column;
            position: absolute;
            z-index: 502;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            border-radius: .12rem;
            width: 4.86rem;
            height: 3.75rem;
            background: #fff; 
            text-align: center;
        }
        .auth-contain-icon{
            margin-top:20px;
            width: 1.42rem;
            height: 1.5rem;
            margin-left: 36%;
        }
        .auth-text1{
            color: #494949;
            font-size: .32rem;
            line-height: .5rem;
            padding: .2rem 0 .1rem;
            font-weight: bold;
        }
        .auth-text2{
            color: #999999;
            font-size: .24rem;
            line-height: .37rem;
            padding: 0 .4rem;
        }

        /* 地址管理 */
        .order-address{
        	min-height: 1rem;
        	background: #fff;
        	margin-top: .2rem;
        	padding: 0 .3rem 0rem .3rem;
        	.address-name{
        		font-size: .4rem;
        		font-weight: bold;
        		padding-top: .3rem;
        	}
        	.address-content{
        		display: flex;
        		align-items: center;
        		/*justify-content: space-between;*/
        		min-height: .4rem;
        		margin-top: .18rem;
        		padding: .4rem 0;
        		.address-data{
        			width: 96%;
        			color:#494949;
        			font-size:.34rem;
        		/*	margin-left: .2rem;*/
        			.address-data-name{
        				font-size: .32rem;
        				color: #494949;
        				margin-bottom: .15rem;
        				/*margin-left: .58rem;*/
        				span{
        					margin-left: .28rem;
        					color: #999;
        				}
        			}
        			.address-data-address{
        				min-height: .34rem;
        				font-size: .28rem;
        				color: #494949;
        				width: 92%;
        			}
        		}
        		span{
        			font-size: .27rem;
        			color: #555;
        			margin-left: .1rem;
        			margin-right: 4.6rem;
        		}
	        	.address-img{
	        		width: .48rem;
	        		height: .48rem;
	        		margin-right: .10rem;
	        	}
	        	.address-flex{
	        		display: flex;
	        		align-items: center;
	        	}
	        	.address-img-right{
	        		width: .12rem;
	        		height: .23rem;
	        		margin-left: .1rem;
	        	}
        	}
        }
    }
</style>