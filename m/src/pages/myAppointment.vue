<template>
	<div class='my-appointment'>
		<!-- 头部 -->
      	<v-header :header_title='header_title'></v-header>
	     <!-- 缺省页面 -->
	    <div class='appointment-default-page' v-if="5 < 4">
	        <div class='appointment-default-content'>
	          <img class='appointment-default-img' src='../common/imgs/my/appointmentDefault_icon.png'></img>
	          <p class='appointment-default-text'>您尚未预约公开课哦 </p>
	          <p class='appointment-default-text'>快去课程列表预约公开课吧！</p>
	        </div>
	    </div>
	    <!-- 内容区域 -->
	    <div class='appointment-content' v-if="5 > 4">
	        <!-- center 中间部分 有数据时 循环遍历的主体 -->
	        <div class="appointment-content-out">
	          <div class='appointment-content-wraps'>
	            <div class='appointment-content-center'>
	                <div class='appointment-center-left'>
	                    <img class='appointment-center-img' src="../common/imgs/my/order_icon.png"></img>
	                </div>
	                <div class='appointment-center-right'>
	                    <p class='appointment-center-title'>上海师范大学-人力资源管理上海师范大学-人力资源管理上海师范大学-人力资源管理上海</p>
	                    <div class='appointment-center-footer'>
	                        <div class='appointment-center-wrap'>
	                            <p class='appointment-center-number'>1</p> 件商品，共计￥<p class='appointment-center-price'>16,999</p>
	                        </div>
	                    </div>
	                </div>
	                <div class='appointment-content-hidden'>
			            <div class='appointment-hidden-box'>
			                <img class='appointment-hidden-img' src='../common/imgs/my/cancel_icon.png'></img>
			                <p class='appointment-hidden-cancel'>取消预约</p>
			            </div>
			        </div>
	            </div>
	          </div>
	          
	        </div>
	        
	        <div class="appointment-content-out">
	          <div class='appointment-content-wraps'>
	            <div class='appointment-content-center'>
	                <div class='appointment-center-left'>
	                    <img class='appointment-center-img' src="../common/imgs/my/order_icon.png"></img>
	                </div>
	                <div class='appointment-center-right'>
	                    <p class='appointment-center-title'>上海师范大学-人力资源管理上海师范大学-人力资源管理上海师范大学-人力资源管理上海</p>
	                    <div class='appointment-center-footer'>
	                        <div class='appointment-center-wrap'>
	                            <p class='appointment-center-number'>1</p> 件商品，共计￥<p class='appointment-center-price'>16,999</p>
	                        </div>
	                    </div>
	                </div>
	                <div class='appointment-content-hidden'>
			            <div class='appointment-hidden-box'>
			                <img class='appointment-hidden-img' src='../common/imgs/my/cancel_icon.png'></img>
			                <p class='appointment-hidden-cancel'>取消预约</p>
			            </div>
			        </div>
	            </div>
	          </div>
	          
	        </div>
	    </div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				header_title:'我的预约',
			}
		}
	}
</script>
<style lang="less">
	/* 主体部分 */
	.my-appointment{
	  display: block;
	  	/* 内容区域 */
		.appointment-content{
		  display: block;
		  margin-top: 1.2rem;
		  	.appointment-content-out{
				width: 100%;
				overflow: auto;
				margin-bottom: 0.2rem;
				.appointment-content-wraps{
				  display: inline-block;
				  vertical-align: top;
				  background: #fff;
				}
				/* center 中间部分 */
				.appointment-content-center{
				  background:#fff;
				  padding-left:.40rem;
				  display: flex;
				 	.appointment-center-left{
					  width:2.00rem;
					  height:1.40rem;
					  background:rgba(0,0,0,1);
					  border-radius:.13rem;
					  opacity:0.1;
					  overflow: hidden;
					  margin-right: .27rem;
					  margin-top: 0.4rem;
					  	.appointment-center-img{
						  width: 100%;
						  height: 100%
						}
					}
					.appointment-center-right{
					  width: 4.47rem;
					  	.appointment-center-title{
						  font-size:.27rem ;
						  color: #111111;
						  line-height:.38rem ;
						  height: .74rem;
						  display: -webkit-box;
						  overflow: hidden;
						  text-overflow: ellipsis;
						  word-wrap: break-word;
						  white-space: normal !important;
						  -webkit-line-clamp: 2;
						  -webkit-box-orient: vertical;
						  margin-top: 0.4rem;
						}
						.appointment-center-footer{
						  display: flex;
						  justify-content: flex-end;
						  margin-top: .43rem;
						  	.appointment-center-wrap{
							  display: block;
							  font-size: .24rem;
							  color: #111111;
							  line-height: .34rem;
							  display: flex;
							  	.appointment-center-number{
								  font-size: .24rem;
								  color: #111111;
								  line-height: .34rem;
								}
								.appointment-center-price{
								  font-size: .34rem;
								  color: #111111;
								  line-height: .34rem;
								}
							}
						}
					}
					/* 隐藏部分 */
					.appointment-content-hidden{
					  width:1.87rem ;
					  height:2.20rem ;
					  background:rgba(244,53,48,1);
					  display: inline-block;
					  vertical-align: top;
					  position: relative;
					  margin-left: 0.4rem;
					  	.appointment-hidden-box{
						  width:1.00rem ;
						  height:1.00rem;
						  position: absolute;
						  left: 50%;
						  top:50%;
						  margin-top: -.50rem;
						  margin-left: -.50rem;
						  	.appointment-hidden-img{
							  width: .48rem;
							  height:.48rem ;
							  display: block;
							  margin: 0 auto;
							}
						  	.appointment-hidden-cancel{
							  width: 100%;
							  font-size: .24rem;
							  color: #fff;
							  line-height: .34rem;
							  text-align: center;
							  display: block;
							  margin-top: 0.08rem
							}
						}
					}
				}
			}
		}
		/* 缺省页面 */
		.appointment-default-page{
		  width: 100%;
		  height: 100%;
		  position: relative;
		  	.appointment-default-content{
				width:2.68rem ;
				height: 3.36rem;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,50%);
				display: flex;
				flex-direction: column;
					.appointment-default-text{
					  font-size:0.24rem;
					  color:rgba(153,153,153,1);
					  line-height:0.36rem;
					  text-align: center;
					  display: block
					}
					.appointment-default-img{
					  width: 2.67rem;
					  height: 2.67rem;
					}
			}
		}
	}
	
	
	
	

</style>