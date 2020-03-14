<template>
	<!--pages/myOrderDetail/myOrderDetail.wxml-->
	<div class='my-detail'>
		<!-- 头部 -->
    	<v-header :header_title="header_title"></v-header>
	    <!-- 内容区域 -->
	    <div class='detail-content'>
	        <div class='detail-content-top'>
	            <!-- <div class='detail-top-left'>
	                <img class='detail-top-img' src='/img/my/blue_seal.png'></img>
	            </div> -->
	            <div class='detail-top-right'>
	                <p class='detail-top-title'>{{ orderData.goods[0].goods_name }}</p>
	                <div class='detail-top-content'>
	                  <p class='detail-top-price'>¥ {{ orderData.goods[0].goods_price }}</p>
	                </div>
	            </div>
	        </div>
	        <!-- 虚线部分-1 -->
	        <div class='detail-line-top'>
	            <div class='detail-circle_left'></div>
	            <div class='detail-line_1'></div>
	            <div class='detail-circle_right'></div>
	        </div>
	        <div class='detail-content-center'>
	            <p class='detail-center-message'>订单信息</p>
	            <div class='detail-center-title'>
	                <p class='detail-center-left'>订单编号</p>
	                <p class='detail-center-right'>{{ orderData.order_no }}</p>
	            </div>
	            <div class='detail-center-title'>
	                <p class='detail-center-left'>下单时间</p>
	                <p class='detail-center-right'>{{ orderData.order_time }}</p>
	            </div>
	            <div class='detail-center-title' v-if="orderData.coupon_sn">
	                <p class='detail-center-left'>优惠码</p>
	                <p class='detail-center-right'>{{ orderData.coupon_sn }}</p>
	            </div>
	            <div class='detail-center-title'>
	                <p class='detail-center-left'>订单状态</p>
	                <p class='detail-center-right right-color'>{{ orderData.order_status_name }}</p>
	            </div>
	            <!-- 根据条件显示/隐藏 是否已支付 -->
	            <div class='detail-center-seal' v-if=" order_status == 1 ">
	                <div class='detail-center-btn' :data-orderId="orderData.order_id" @click='afterSale'>申请售后</div>
	            </div>
	        </div>
	        <!-- 根据条件显示/隐藏 是否已支付-->
	        <div v-if=" order_status == 1">
	          <!-- 虚线部分-2 -->
	          <div class='detail-line-top'>
	            <div class='detail-circle_left'></div>
	            <div class='detail-line_1'></div>
	            <div class='detail-circle_right'></div>
	          </div>
	          <!--<div class='detail-line-center'>
	              <div class='detail-line'></div>
	          </div>-->
	          <!-- 内容底部 -->
	          <div class='detail-content-bottom'>
	              <p class='detail-bottom-pay'>支付信息</p>
	              <div class='detail-bottom-title'>
	                  <p class='detail-bottom-left'>支付方式</p>
	                  <p class='detail-bottom-right'>{{ orderData.payment_type }}</p>
	              </div>
	              <div class='detail-bottom-title'>
	                  <p class='detail-bottom-left'>支付时间</p>
	                  <p class='detail-bottom-right'>{{ orderData.pay_time }}</p>
	              </div>
	              <div class='detail-bottom-title'>
	                  <p class='detail-bottom-left'>原价</p>
	                  <p class='detail-bottom-right'>￥ {{ orderData.goods[0].goods_price }}</p>
	              </div>
	              <div class='detail-bottom-title'>
	                  <p class='detail-bottom-left'>优惠券</p>
	                  <p class='detail-bottom-right'>￥ {{ orderData.discount_amount }}</p>
	              </div>
	              <div class='detail-bottom-title'>
	                  <p class='detail-bottom-left'>实付价</p>
	                  <p class='detail-bottom-right detail-bottom-price'>￥ {{ orderData.amount }}</p>
	              </div>
	              <p class='detail-bottom-notification' @click='studentNotification'>查看学员告知书 > </p>
	          </div>
	          <!-- 蓝色印章 -->
	          <div class='detail-bottom-seal'>
	              <img class='detail-seal-img' src='../common/imgs/my/blue_seal.png'></img>
	          </div>
	        </div>
	        <!-- 收货地址 -->
	        <div v-if="orderData.address && orderData.district ">
			    <div class='detail-line-top'>
		            <div class='detail-circle_left'></div>
		            <div class='detail-line_1'></div>
		            <div class='detail-circle_right'></div>
		        </div>
		        <div class='detail-content-center'>
		            <p class='detail-center-message'>收货信息</p>
		            <div class='detail-center-title' v-if="orderData.express">
		                <p class='detail-center-left'>快递单号</p>
		                <p class='detail-center-right'>{{ orderData.express}}</p>
		            </div>
		            <div class='detail-center-title'>
		                <p class='detail-center-left'>收货人</p>
		                <p class='detail-center-right'>{{ orderData.consignee }}</p>
		            </div>
		            <div class='detail-center-title'>
		                <p class='detail-center-left'>手机号</p>
		                <p class='detail-center-right'>{{ orderData.tel}}</p>
		            </div>
		            <div class='detail-center-title'>
		                <p class='detail-center-left'>所在地址</p>
		                <p class='detail-center-right'>{{ orderData.district }}</p>
		            </div>
		            <div class='detail-center-title'>
		                <p class='detail-center-left'>详细地址</p>
		                <p class='detail-center-right'>{{ orderData.address }}</p>
		            </div>

		        </div>
	        </div>
	          
	          
	          
	    </div>
	    
	    
	    
	</div>
</template>
<script>
import { MessageBox, Indicator, Toast} from 'mint-ui';
import { getLocalSto } from "../common/js/utils.js";
import { mapGetters } from 'vuex';
import { OrderDetail } from '../api'
	export default{
		data(){
			return{
				orderData:{goods:[{goods_name:'',goods_price:''}]},
      			order_status:null,
      			order_no:'',
      			header_title:'订单详情',
      			uid:'',
      			address:'',
			}
		},
		created(){
			Indicator.open('加载中...');
			let that = this;
			//获取URL上传递过来的参数
			let order_no = that.$route.query.order_no || '';
			let order_status = that.$route.query.order_status || '';
			//获取ID
			that.uid = that.checkLogin.id || ''
			//调取获取订单详情方法
			that.orderDetail(order_no, order_status,that.uid);
			
		},
		computed:{
			...mapGetters(['checkLogin'])
		},
		methods:{
			//获取订单详情方法
			orderDetail:function(order_no, order_status,uid){
				OrderDetail(
					{
						order_no:order_no,
				        uid : uid//从store中获取
					}
				).then(res=>{
		                this.orderData = res.result || [];
          				this.order_status = order_status;
          				this.order_no = order_no;
		            }).catch(err=>{
						Toast({
						  message: '网络异常,稍后重试',
						  duration: 2000
						});
		            })
			},
			//售后服务
			afterSale:function(e){
				let order_id = e.target.getAttribute('data-orderId');
				
				//页面跳转
			    this.$router.replace({ name: 'afterSale', params: {order_id:order_id ,order_status:this.order_status, order_no:this.order_no}})
			},
			//查看学员告知书
			studentNotification:function(e){
				//页面跳转
			    this.$router.push({ name: 'myInform', params: {}})
			}
		}
	}
</script>
<style lang="less">
	.my-detail{
	  display: block;
	  padding: 0 0.40rem;
	  padding-bottom: 1.2rem;
	  margin-top: .4rem;
	  	/* 内容区 */
		.detail-content{
		  background: #fff;
		  display: block;
		  position: relative;
		  	/* 内容区 顶部 */
			.detail-content-top{
			  padding:0.53rem 0.40rem 0.53rem 0.40rem;
			  display: flex;
			  	.detail-top-left{
				  width:2.00rem ;
				  height: 1.40rem;
				  margin-right: 0.30rem;
					.detail-top-img{
					  width: 100%;
					  height: 100%;
					}
				}
				.detail-top-right{
				  display: flex;
				 /* flex-direction: column;*/
				  justify-content: space-between;
				  flex: 1;
				  	.detail-top-title{
				  	  min-height: .1rem;
					  width:3.60rem;
					  font-size:0.32rem;
					  font-weight:400;
					  color:rgba(17,17,17,1);
					  line-height:0.37rem;
					  /* 显示省略号 */
					  display: -webkit-box;
					  overflow: hidden;
					  text-overflow: ellipsis;
					  word-wrap: break-word;
					  white-space: normal !important;
					  -webkit-line-clamp: 2;
					  -webkit-box-orient: vertical;
					}
					.detail-top-content{
					  	display: flex;
					  	justify-content: flex-end;
					  	.detail-top-price{
						  color: #FE5B59;
						  font-size:0.32rem;
						}
					}
				}
			}
			/* 虚线二 */
			.detail-line-top{
			  display: flex;
			  justify-content: space-between;
			  align-items: center;
				.detail-line_1{
				  height: 0.01rem;
				  border-bottom: 0.01rem  dashed rgba(153,153,153,1);
				  width: 91%;
				}
				.detail-circle_left,.detail-circle_right{
				  width: 0.26rem;
				  height: 0.26rem;
				  border-radius: 50%;
				  background: #F4F4F4;
				  margin-right: -.12rem;
				  margin-left: -.12rem;
				}
			}
			/* 内容去 中部 */
			.detail-content-center{
			    display: flex;
			    flex-direction: column;
			    padding: 0 0.40rem 0.53rem 0.40rem;
			    .detail-center-message{
				  font-size:0.36rem ;
				  line-height: 1.30rem;
				  color: #494949;
				  font-weight: bold;
				}
				.detail-center-title{
				  display: flex;
				  justify-content: space-between;
				  align-items: center;
				  min-height: .3rem;
				  	.detail-center-left{
					  font-size:0.27rem ;
					  line-height: 0.60rem;
					  color: #494949;
					  width: 1.5rem;
					}
					.detail-center-right{
						width: 80%;
						min-height: 10px;
					}
					.right-color{
					  font-size:0.27rem ;
					  line-height: 0.60rem;
					  color: #2C8CFF;
					}
				}
				.detail-center-seal{
				  display: flex;
				  justify-content: flex-end;
				  margin-top: 0.23rem;
				  	.detail-center-btn{
					  line-height: 0.56rem;
					  text-align: center;
					  color: #555;
					  width:1.40rem;
					  height:0.56rem;
					  font-size: 0.24rem;
					  background:rgba(255,255,255,1);
					  border-radius:0.04rem;
					  border:0.01rem solid rgba(204,204,204,1);
					}
				}
			}
			
			/*底部部分*/
			/* 虚线 */
			.detail-line-center{
			  padding: 0 0.40rem;
			  	.detail-line{
				  height: 0.01rem;
				  border-bottom: 0.01rem  dashed rgba(153,153,153,1);
				}
			}
			/* 内容去 底部 */
			.detail-content-bottom{
			    display: flex;
			    flex-direction: column;
			    padding: 0 0.40rem 0.50rem 0.40rem;
			    .detail-bottom-pay{
				  font-size:0.36rem ;
				  line-height: 1.30rem;
				  color: #494949;
				  font-weight: 700
				}
				.detail-bottom-title{
				  display: flex;
				  justify-content: space-between;
				  	.detail-bottom-left,.detail-bottom-right{
					  font-size:0.27rem ;
					  line-height: 0.60rem;
					  color: #111111;
					}
					.detail-bottom-price{
						font-size: .32rem;
						color: #FE5B59;
					}
				}
				/* 水印盖章     查看学员告知书   */
				.detail-bottom-notification{
				  font-size:0.24rem ;
				  line-height: 0.34rem;
				  color: #2C8CFF;
				  margin-top: 0.43rem;
				  text-align: center;
				  display: block;
				  width: 100%
				}
			}
			/* 印章部分 */
			.detail-bottom-seal{
			  width:2.88rem ;
			  height: 2.92rem;
			  position: absolute;
			  bottom: 0;
			  right: 0;
			  	.detail-seal-img{
				  width: 100%;
				  height: 100%
				}
			}
		}
	}
</style>