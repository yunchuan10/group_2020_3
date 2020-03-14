<template>
	<div class='infor-out'>
	  <!-- 头部 -->
      <v-header :header_title="header_title"></v-header>
	  <div class='infor'>
	    <img src="../common/imgs/my/p1.jpg" />
	    <div class='infor-box'>
	      <div class='infor-msg'>
	        <p>您已成功购买东方尚学的课程，请在PC上打开我们的官网www.dongfangshangxue.com/mall使用手机号 {{ this.tel }}登录，完善个人资料并签订合同！</p>
	        <p class='infor-msg2'>我们工作人员将会在14个工作日联系您，或者拨打我们的客服热线400-060-6080咨询！</p>
	      </div>
	      <!-- 我的订单 -->
	      <div class='to-order-detail' @click='goMyOrder'>查看我的订单</div>
	    </div>
	  </div>
	</div>
</template>
<script>
	import { Indicator} from 'mint-ui';
	import { mapGetters } from 'vuex';
	export default{
		data(){
			return{
				tel:'',
				//头部内容
				header_title:'学员告知书',
			}
		},
		created(){
			this.tel = this.checkLogin.mobile.toString().replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3") || '';
		},
		computed:{
			...mapGetters(['checkLogin'])
		},
		methods:{
			goMyOrder:function(e){
				this.$router.replace({ name: 'myOrder', params: {}})
			}
		}
	}
</script>
<style lang="less">
	.infor-out{
	  padding-top: 1.40rem;
	  	.infor{
		  width: 6.13rem;
		  height: 8.13rem;
		  margin: 0 auto;
		  position: relative;
		  font-size: 0;
		  	img{
			  width: 100%;
			  height: 100%;
			}
			.infor-box{
			  position: absolute;
			  left: 0;
			  bottom: 0;
			  box-sizing: border-box;
			  z-index: 4;
			  width: 100%;
			  height: 5.30rem;
			  padding: 0 0.6rem;
				.infor-msg{
				  font-size: 0.24rem;
				  color: #111;
				  line-height: 0.40rem;
				    .infor-msg2{
					  display: block;
					  padding-top: 0.40rem;
					}
				}
				.to-order-detail{
				  display: block;
				  background:linear-gradient(180deg,rgba(235,218,173,1) 0%,rgba(229,198,140,1) 100%);
				  border-radius:0.43rem;
				  width: 3.60rem;
				  height: 0.86rem;
				  line-height: 0.86rem;
				  text-align: center;
				  font-size: 0.32rem;
				  margin: 0.40rem auto 0;
				  color: #fff;
				}
	
			}
		}
	}
</style>