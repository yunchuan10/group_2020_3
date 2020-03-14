<template>
	<div class='order-pay'>
	  <!-- 头部 -->
	  <v-header :header_title="header_title"></v-header>
	  <!-- 请选择问题类型 -->
	  <div class='pay-type'>
	    <div class='pay-title'>请选择问题类型</div>
	    <div class='type-box' data-id='1' data-tex='休学' @click='checkedQuestion'>
	      <p class=''>休学</p>
	      <p :class=" select == 1 ? 'selected' :'unselected'" data-id='1' @click='checkedQuestion'></p>
	    </div>
	    <div class='type-box' data-id='2' data-tex='换课程换专业' @click='checkedQuestion'>
	      <p class=''>换课程换专业</p>
	      <p :class=" select == 2 ? 'selected' :'unselected'" data-id='2' @click='checkedQuestion'></p>
	    </div>
	    <div class='type-box' data-id='3' data-tex='其他' @click='checkedQuestion'>
	      <p class=''>其他</p>
	      <p  :class=" select == 3 ? 'selected' :'unselected'" data-id='3'@click='checkedQuestion'></p>
	    </div>
	  </div>

	   <!-- 问题描述 -->
	  <div class='pay-type'>
	    <div class='pay-title'>问题描述</div> <!--@blur.prevent="bindTextAreaBlur"-->
	    <textarea class="qs-texta"   placeholder="请简单描述要投诉或反馈的内容，我们会尽快处理您的问题" v-model="textArea"></textarea>
	  </div>

	  <!-- 手机号 -->
	  <div class='pay-type'>
	    <div class='pay-title'>手机号</div>
	    <div class='type-box'><!--@blur.prevent='blurPhone'-->
	      <input class='pay-ph' maxlength='11' placeholder='请输入手机号' type='number' value="" v-model='phoneNumber' />
	      <img class='type-box-r' src="../common/imgs/afterSale/i8.png" @click='clearNumber' />
	    </div>
	  </div>
	  <div class='ph-tips'>
	    <p class="ph-red">* </p>  请填写您常用的正确手机号，确保我们能联系上您本人。
	  </div>



	  <!-- 立即支付 -->
	  <div class='pay-btn'>
	    <button class='button-able'  @click='submitAll'>提交</button>
	  </div>

	</div>
</template>
<script>
import { Toast } from 'mint-ui';
import { mapState } from 'vuex';
import { afterSale } from '../api'
	export default{
		data(){
			return{
				//选中项目
				select:'',
				//选中项的文案
				texTypes:'',
				//textare文案
				textArea:'',
				//电话号码
				phoneNumber:'',
				//头部内容
				header_title:'申请售后',
				uid:''//用户id
			}
		},
		created(){
			this.phoneNumber = this.checkLogin.mobile || '';
			this.uid = this.checkLogin.id || ''
		},
		computed:{
			...mapState(['checkLogin'])
		},
		methods:{
			//请选择问题类型
			checkedQuestion:function(e){
				let tex = e.target.getAttribute('data-tex') || '';
				let id = e.target.getAttribute('data-id') || '';
				this.select = id;
				this.texTypes = tex
			},
			clearNumber:function(){
				this.phoneNumber = ''
			},
			//提交表单
			submitAll:function(){
				
    			//手机号验证
    			let telePhone = this.phoneNumber;//电话号码
    			//订单id
    			let order_id = this.$route.params.order_id || '';
    			//订单状态
    			let order_status = this.$route.params.order_status || '';
    			//订单编号
    			let order_no = this.$route.params.order_no || '';
    			if(!(/^1(3|4|5|7|8)\d{9}$/.test(telePhone)) || telePhone.toString().length != '11'){
    				Toast({
					  message: '手机号格式有误',
					  duration: 2000
					});
    			}else if( !telePhone ){
    				Toast({
					  message: '请填写正确的手机号',
					  duration: 2000
					});
    			}else if( !this.select){
    				Toast({
					  message: '问题类型为必选项',
					  duration: 2000
					});
    			}else{
    				//向后台进行数据请求
    				afterSale(
    					{
    						uid : this.uid,////获取用户userId
    						mobile : telePhone,
    						questionType: this.texTypes,
          					description: this.textArea,
          					orderId: order_id
    					}
    				).then(res=>{
    					Toast({
						  message: '提交成功',
						  duration: 2000
						});
						//页面跳转
				    this.$router.replace({ path: 'myOrderDetail', query: { order_no: order_no,order_status:order_status, }})
    				}).catch(err=>{
    					Toast({
						  message: '网络错误,稍后重试!',
						  duration: 2000
						});
    				})
    			}
			}
		}
	}
</script>
<style lang="less">

	.order-pay{
	  padding-bottom: 1.80rem;
	    .pay-title{
		  padding: 0.52rem 0 0.35rem 0.40rem;
		  color: #111;
		  font-size: 0.40rem;
		}
		/* 请选择问题类型 */
		.type-box{
		  display: flex;
		  background: #fff;
		  height: 1rem;
		  line-height: 1.00rem;
		  padding: 0 0.40rem;
		  justify-content: space-between;
		  align-items: center;
		  font-size: 0.27rem;
		    .type-box-r{
			  width: 0.34rem;
			  height: 0.34rem;
		    }
		    /*选中与否*/
			.selected{
				background: url('../common/imgs/afterSale/i5.png');
				background-repeat: no-repeat;
				background-size: contain;
				width: 0.34rem;
			  	height: 0.34rem;
			}
			.unselected{
				background: url('../common/imgs/afterSale/i4.png');
				background-repeat: no-repeat;
				background-size: contain;
				width: 0.34rem;
			 	height: 0.34rem;
			}
		}
		.type-box+.type-box{
		  border-top: 0.01rem solid #EFEFF4;
		}
		.qs-texta{
		  display: block;
		  background: #fff;
		  width: 100%;
		  box-sizing: border-box;
		  font-size: 0.24rem;
		  padding: 0.30rem 0.40rem;
		  height: 3.00rem;
		  border: 0;
		}

		.pay-btn{
		  padding: 0.32rem 0.40rem;
		  text-align: center;
		  position: fixed;
		  z-index: 9;
		  left: 0;
		  bottom: 0;
		  width: 100%;
		  box-sizing: border-box;
		  height: 1.50rem;
			button{
			  color: #fff;
			  font-size: 0.36rem;
			  height: 0.86rem;
			  line-height: 0.86rem;
			  border-radius: 0.44rem;
			  border: 0 none;
			  width: 100%;
			  background: url('../common/imgs/afterSale/blue_bg.png');
			  background-repeat: no-repeat;
			  background-size: contain;
			  background-position:center ;
			}
		}

		.ph-tips{
		  height: 0.60rem;
		  line-height: 0.60rem;
		  padding: 0 0.40rem;
		  font-size: 0.20rem;
		  color: #555;
		  vertical-align: middle;
		   .ph-red{
				display: inline-block;
				color: #f00;
			}
			.pay-ph{
			  flex: 1;
			  font-size: 0.24rem;
			  color: #555;
			  margin-right: 0.40rem;
			}
			text{
			  color: #F43530;
			}
		}
	}
</style>