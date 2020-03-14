<template>
	<div class='my-order'>
		<!-- 头部 -->
    	<div class="header-c ">
	        <div class="header-contain" >
	            <!-- 左侧 -->
	            <div class="head-l1" @click="routeBack">
	                <img src="../common/imgs/head2.png" alt="">
	            </div>
	            <div class="head-center">
	                {{header_title}}
	            </div>
	            <!-- 右侧不同部分传入 -->
	            <div class="head-r1">
	                <slot name="head_sr"></slot>
	            </div>
	        </div>
	    </div>
		<!-- 缺省页面 -->
	    <div class='order-default-page' v-if=" orderLists.length < 0 ">
	        <div class='order-default-content'>
	            <img class='order-default-img' src='../common/imgs/my/orderDefault_icon.png'></img>
	            <p class='order-default-text'>没有订单哦 </p>
	            <p class='order-default-text'>快去购买课程吧！</p>
	        </div>
	    </div>
	    <!-- 根据后台数据显示缺省页或者正常的内容区 -->
      	<div v-if=" orderLists.length > 0 ">
      		<mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText='bottomText' :auto-fill="false" ref="loadmore">
		        <!-- 根据后台数据进行循环遍历的代码块  order-content -->
		        <div class="order-content" v-for="(item, index) in orderLists " :key="index" >
		            <!-- 印章部分 -->
		            <div class='order-content-seal'>
		                <img class='order-seal-img' src='../common/imgs/my/red_seal.png' v-if="item.order_status == 1"></img>
		            </div>
		            <!-- top 部分 -->
		            <div class='order-content-top'>
		                <div class='order-top-left'>订单编号：
		                    <p class='order-top-number' v-text=" item.order_no "></p>
		                </div>
		                <div class='order-top-right'>
		                  <p class='order-top-state' v-if = " item.order_status == 0 ">待支付</p>
		                  <p class='order-top-state' v-if = " item.order_status == 1 ">已支付</p>
		                  <p class='order-top-state' v-if = " item.order_status == 2 ">已取消</p>
		                  <p class='order-top-state' v-if = " item.order_status == 4 ">已退款</p>
		                </div>
		            </div>
		            <!-- center 中间部分 -->
		            <div class='order-content-center'>
		                <div class='order-center-right'>
		                    <p class='order-center-title' v-text = " item.goods_name "></p>
		                    <div class="order-time">
		                    	<span>下单时间：</span>
		                    	<span v-text = " item.created_at "></span>
		                    </div>
		                    <div class="order-time">
		                    	<span>总价：￥</span>
		                    	<span v-text = " item.amount "></span>
		                    </div>
		                    <!--<p class='order-center-footer'>
		                        <div class='order-center-wrap'>
		                            ￥<p class='order-center-price' v-text = " item.amount "></p>
		                        </div>
		                    </p>-->
		                </div>
		            </div>
		            <!-- footer 底部部分 -->
		            <div class='order-content-footer'>
		                <div class='order-footer-left'>
		                 <!-- <p class='order-footer-date' v-text = " item.created_at "></p>-->
		                </div>
		                <!-- 以下按钮根据数据保留相应的 绑定相应的点击事件在 js 中完成页面跳转-->
		                <div class='order-footer-right'>
		                    <div class='order-footer-cancel order-btn' bindtap='cancleOrder' v-if=" item.order_status == 0 " :data-id=" item.id " @click="cancelOrders($event)">取消订单</div>
		                    <div class='order-footer-pay order-btn' v-if = " item.order_status == 0 " :data-orderNo="item.order_no" @click="immediatePayment($event)">立即支付</div>  
		                    <div class='order-footer-details order-btn' @click="orderDetails($event)" v-if = "item.order_status != 0" :data-orderNo="item.order_no" :data-order_id=" item.order_id "  :data-orderStatus=" item.order_status " >订单详情</div>                
		                </div>
		            </div>
		        </div> 
		    </mt-loadmore>
      </div>
      
       <!-- 到底部提示文案 -->
  		<div class='collection-end-title' v-show="collectionTitle">订单加载完毕 ~_~</div>
	</div>
	
	
</template>
<script>
import { MessageBox ,Indicator, Toast, Loadmore} from 'mint-ui';
import { getLocalSto } from "../common/js/utils.js";
import { OrderLists, CancelOrder} from '../api';
//import Vue from 'vuex';
import {  mapActions,mapGetters } from 'vuex';
	export default{
		data(){
			return{
				pages:1,//页码数
				header_title:'我的订单',//头部文案
				list:[],//请求过来的数据存放的变量
				collectionTitle:false,
				allLoaded:false,
				bottomText: '上拉加载更多...',
				uid:'',
				baseURL:this.GLOBAL.baseURL,//直接通过this访问全局变量。//支付页面的公共路径
			}
		},
		created(){
			Indicator.open('加载中...');
			this.uid = this.checkLogin.id || '';
			
		},
		computed:{
			...mapGetters(['orderLists','checkLogin'])
		},
		
		mounted(){
			//调取获取列表方法
			this.OrderList();
			
		},
		methods:{
			...mapActions(['set_orderList','delOrder']),
			routeBack(){
				this.$router.push({ name: 'my'})
			},
			//获取订单
			OrderList(){
				let that = this;
				OrderLists(
				{
					uid: that.uid,
			        page: that.pages,
			        pageSize: 4
				}
				).then(res=>{
					if(res.result && res.result.length > 0){
						that.list = that.list.concat(res.result);
						that.pages = that.pages+1
					}else if(!res.result){
						that.collectionTitle = true;
					}
					that.getorderList(that.list);
					
	            }).catch(err=>{
					Toast({
					  message: '网络异常,稍后重试',
					  duration: 2000
					});
	            });
			},
			//下拉加载
			loadBottom: function(){
                this.$refs.loadmore.onBottomLoaded();
                this.OrderList();
            },
			getorderList (dat) {
			    this.set_orderList({
			     data : dat
			    });
			    
			   },
			
			//取消订单
			cancelOrders:function(e){
				let cancelId = e.target.getAttribute('data-id');
				
				//从缓存中获取
				MessageBox.confirm('确定执行此操作?').then(action => {
					if (action == 'confirm') {     //确认的回调
   	  					CancelOrder(
							{
								uid: this.uid,//从store中获取
								orderId: cancelId
							}
						).then(res=>{
							Toast({
							  message: '提交成功',
							  duration: 2000
							});
							let dat = {};
							dat.id = cancelId || '';
							this.delOrder({
								data:dat
							})
							
						}).catch(err=>{
							Toast({
							  message: '网络异常,稍后重试',
							  duration: 2000
							});
						})
					 }
				});
				

			},
			//立即支付
			immediatePayment:function(e){
				 let order_no = e.target.getAttribute('data-orderNo');
//				window.location.href="http://www.dongfangshangxue.com/orderpay/" +order_no;
//				 this.$router.push({ name: 'androidPay', params: { order_no: order_no }})
//				//设备类型判断
//				if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
//				    //alert(navigator.userAgent);  
//				    //页面跳转
//				    this.$router.push({ name: 'iosCode', params: { order_no: order_no }})
//				} else if (/(Android)/i.test(navigator.userAgent)) {
//				    //alert(navigator.userAgent); 
//				    this.$router.push({ name: 'androidPay', params: { order_no: order_no }})
//				} else {
//				    //alert(navigator.userAgent);
//
//				}
				//根据订单号跳转到立即支付页面
				if(order_no){
					window.location.href = this.baseURL + order_no;
				}else{
					Toast({
					  message: '订单不存在,请重新下单！',
					  duration: 2000
					});
				}
			},
			//查看详情
			orderDetails(e){
				let order_no = e.target.getAttribute('data-orderNo');
				let order_status = e.target.getAttribute('data-orderStatus');

				this.$router.push({ path: '/myOrderDetail',query:{ order_no:order_no,order_status:order_status }});
			}
			}
        }
        
		
	
	
</script>
<style lang="less">
	.my-order{
	  display: block;
	  /* 缺省页面 */
		.order-default-page{
		  width: 100%;
		  height: 100%;
		  position: relative;
		  	.order-default-content{
				width:2.68rem ;
				height: 3.36rem;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,50%);
				display: flex;
				flex-direction: column;
					.order-default-text{
					  font-size:0.24rem;
					  color:rgba(153,153,153,1);
					  line-height:0.36rem;
					  text-align: center;
					  display: block
					}
					.order-default-img{
					  width: 2.67rem;
					  height: 2.67rem;
					}
			}
		}
		
		/*内容区域*/
		.order-content{
			margin-top: 0.6rem;
			position: relative;
			padding: .1rem .4rem .4rem .4rem;
			margin: .4rem;
			background: #fff;
			border-radius: .08rem;
			.order-content-seal{
				position: absolute;
				top: 0;
				right: 0.98rem;
				width: 1.33rem;
				height: 1.10rem;
				.order-seal-img{
					width: 2.02rem;
					height: 1.76rem;
				}
			}
			
			/* top 顶部 */
			.order-content-top{
			  display: flex;
			  justify-content: space-between;
			  /*padding:0 0.40rem;*/
			  background: #fff;
			  border-bottom:0.01rem solid rgba(221,221,221,1);
			  	.order-top-left{
				    font-size:0.24rem ;
				    color: #555;
				    line-height:0.9rem ;
					.order-top-number{
					  font-size:0.24rem ;
					  color: #555;
					  line-height:0.78rem ;
					  display: inline-block
					}
				}
				.order-top-right{
				  display: block;
				  	.order-top-state{
					  display: inline-block;
					  text-align: center;
					  line-height:0.78rem ;
					  color:#2C8CFF;
					  font-size: 0.24rem;
					}
				}
			}
			
			/* center 中间部分 */
			.order-content-center{
/*			  background:rgba(245,245,245,1);*/
			  height: 1.40rem;
			  padding:0.27rem 0rem;
			  display: flex;
			  
			  	.order-center-right{
				   width: 4.47rem;
				   flex: 1;
				  	.order-center-title{
					  font-size:0.28rem ;
					  color: #494949;
					  line-height:0.36rem ;
					  min-height: 0.4rem;
					  display: -webkit-box;
					  text-overflow: ellipsis;
					  word-wrap: break-word;
					  white-space: normal !important;
					  -webkit-box-orient: vertical;
					  font-weight: bold;
					  margin-bottom: .1rem;
					}
					.order-time{
						margin: .2rem 0;
						line-height: 1.2;
					}
					
					/*底部*/
					.order-center-footer{
					  display: flex;
					  justify-content: flex-end;
					  margin-top: 0.43rem;
					}	
					
					.order-center-wrap{
					  display: flex;
					  font-size: 0.24rem;
					  color: #111111;
					  line-height: 0.34rem;
					  justify-content: flex-end;
					  	.order-center-price{
						  font-size: 0.34rem;
						  color: #111111;
						  line-height: 0.34rem;
						}
					}
					
				}
			}
			
			
			/* footer 底部 */
			.order-content-footer{
			  min-height:0.74rem;
			  background: #fff;
			  display: flex;
			  justify-content: space-between;
			/*  padding: 0 0.40rem;*/
			  	.order-footer-left{
			  		.order-footer-date,.order-footer-time{
					  font-size:0.24rem ;
					  line-height:0.84rem ;
					  color: #999;
					  margin-right: 0.10rem
					}
			  	}
			  	.order-footer-right{
				    display: flex;
					.order-footer-cancel,.order-footer-details{
					  background:rgba(255,255,255,1);
					  border-radius:0.04rem;
					  border:0.01rem solid rgba(204,204,204,1);
					}
					.order-btn{
					  font-size:0.24rem ;
					  line-height:0.56rem ;
					  color: #555;
					  padding:0 0.22rem;
					  height: 0.56rem;
					  margin-top: 0.14rem;
					  margin-left: 0.20rem;
					}
					.order-footer-pay{
					  background:rgba(255,255,255,1);
					  border:0.01rem solid rgba(126,185,255,1);
					  border-radius:0.04rem;
					  color: #2C8CFF
					}
				}
			}	
			
		}
		/* 加载完毕 到底提示 */
		.collection-end-title{
		  text-align: center;
		  color: #999;
		  font-size: 0.24rem;
		  width: 100%;
		  padding: 0.47rem 0 0.47rem 0;
		}
		
		/*头部导航区域*/
		.header-c{
	        position: fixed;
	        width: 100%;
	        height: 1rem;
	        background: @base1;
	        left: 0;
	        top: 0;
	        z-index: 99;
	        box-sizing: border-box;
	        padding: 0 .4rem;
	
	        .header-contain{
	            display: flex;
	            justify-content: space-between;
	            position: relative;
	            height: 100%;
	            .head-l{
	                display: flex;
	                height: 100%;
	                justify-content: left;
	                align-items: center;
	                img{
	                    height: .6rem;
	                    margin-right: .35rem;
	                }
	                a{
	                    display: inline-block;
	                    height: .58rem;
	                    line-height: .58rem;
	                    text-align: center;
	                    border-radius: .3rem;
	                    border:1px solid rgba(255,255,255,1);
	                    padding: 0 .2rem;
	                    color: #fff;
	                }
	            }
	
	            .head-r{
	                height: 100%;
	
	                a{
	                    height: 100%;
	                    line-height: 1rem;
	                    font-size: .27rem;
	                    color: #fff;
	                    img{
	                        height: .7rem;
	                        width: .7rem;
	                        vertical-align: middle;
	                        border-radius: .42rem;
	                    }
	                }
	            }
	
	            .head-r1{
	                height: 100%;
	                position: absolute;
	                z-index: 2;
	                top: 0;
	                right: 0;
	                a, div{
	                    height: 100%;
	                    line-height: 1rem;
	                    font-size: .27rem;
	                    color: #fff;
	                }
	            }
	
	            .head-l1{
	                height: 100%;
	                position: absolute;
	                z-index: 2;
	                top: 0;
	                left: 0;
	                display: flex;
	                align-items: center;
	                padding-right: .15rem;
	                img{
	                    height: .34rem;
	                }
	            }
	
	            .head-center{
	                flex: 1;
	                width: 100%;
	                height: 100%;
	                line-height: 1rem;
	                font-size: .36rem;
	                color: #494949;
	                text-align: center;
	            }
	
	
	        }
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	

</style>