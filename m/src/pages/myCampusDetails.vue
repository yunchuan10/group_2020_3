<template>
	<div class='campus-detail'>
		<!-- 头部 -->
        <v-header :header_title='header_title'></v-header>
	    <div class='campus-detail-content'>
	        <!-- 轮播区域 start-->
	        <div class="page-section page-section-spacing swiper">
		        <mt-swipe :show-indicators="indicatorDots" :auto="autoplay" :previous-margin="previousMargin" :next-margin="nextMargin">
		            <mt-swipe-item class="swiper-items" v-for="(item,index) in background" :key="index">
		            	<div :class=" item  " class="swiper-item  " ></div>
		            </mt-swipe-item>
		        </mt-swipe>
	     	 </div>
	        <!-- 轮播区域 end -->
	        <div class='campus-detail-center'>
	            <div class='detail-center'>
	                <div class='campus-titles'>上海普陀校区</div>
	                <img class='campus-center-telephone' src="../common/imgs/myCampus/telephone_icon.png"></img>
	            </div>
	            <div class='detail-center'>
	                <div class='campus-titles'>
	                    <img class='detail-center-icon' src='../common/imgs/myCampus/clock_icon.png'></img>
	                    <p class='detail-center-text'>工作时间：09:00-21:00</p>
	                </div>
	            </div>
	            <div class='detail-center'>
	                <div class='campus-titles'>
	                    <img class='detail-center-icon' src='../common/imgs/myCampus/location_icon.png'></img>
	                    <div class='detail-center-location'>
	                      <p class='detail-center-text'>上海市普陀区中山北路3553号伸大厦402</p>
	                      <!--<p class='detail-center-text'>距离你{{ distance }} km</p>-->
	                      <p class='detail-center-text'>距离你355 km</p>
	                    </div>
	                </div>
	            </div>
	        </div>
	        <div class='campus-service'>
	            <div class='campus-title'>特色服务</div>
	            <div class='campus-service-content'>
	              <p>【VIP学习定制】自考 1v1 线下VIP咨询精讲 </p>
	              <p>【职场规划】测评、大数据分析升职规划</p>
	              <p>【课程试听】先学再买，保障核心体验（小程序专属</p>
	              <p>【MBA】最新考情咨询，19年招生信息及备考规划</p>
	              <p>【领取考试资料】咨询报告、自考学习资料（电子版）</p>
	            </div>
	        </div>
	
	        <div class='campus-service-call'>
	          <div class='campus-service-wrap'>
	              <button  open-type="contact" bindcontact="handleContact" class='my_order_btn' >客服咨询</button>
	          </div>
	        </div>
	    </div>
	</div>
</template>
<script>
import { Swipe, SwipeItem,Indicator, Toast, Loadmore} from 'mint-ui';
	export default{
		data(){
			return{
				header_title:'校区详情',
				background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
			    indicatorDots: true,
			    vertical: false,
			    autoplay: 0,
			    circular: true,
			    interval: 2000,
			    duration: 500,
			    previousMargin: 0,
			    nextMargin: 0,
			}
		}
	}
</script>
<style lang="less">
	.campus-detail{
	  position: absolute;
	  top: 0;
	  bottom: 1.28rem;
	  overflow: scroll;
	  width: 100%;
	  	.campus-detail-content{
			margin-top: 1.2rem;
			/* 轮播区域 */
			.page-section{
			  width: 100%;
			  height: 3.55rem;
			  /* margin-bottom: 60rem; */
			}
			.page-section-spacing{
			  box-sizing: border-box;
			  /* padding: 0 80rem; */
			 	.swiper-items{
				  height: 3.55rem!important;
				  	.swiper-item{
					  display: block;
					  height: 3.55rem;
					}
					/*  start --暂时的  */
					.demo-text-1{
					  position: relative;
					  align-items: center;
					  justify-content: center;
					  background-color: #1AAD19;
					  color: #FFFFFF;
					  font-size: .36rem;
					}
					.demo-text-1:before{
					  content: 'A';
					  position: absolute;
					  top: 50%;
					  left: 50%;
					  transform: translate(-50%, -50%);
					}
					.demo-text-2{
					  position: relative;
					  align-items: center;
					  justify-content: center;
					  background-color: #2782D7;
					  color: #FFFFFF;
					  font-size: .36rem;
					}
					.demo-text-2:before{
					  content: 'B';
					  position: absolute;
					  top: 50%;
					  left: 50%;
					  transform: translate(-50%, -50%);
					}
					.demo-text-3{
					  position: relative;
					  align-items: center;
					  justify-content: center;
					  background-color: #F1F1F1;
					  color: #353535;
					  font-size: .36rem;
					}
					.demo-text-3:before{
					  content: 'C';
					  position: absolute;
					  top: 50%;
					  left: 50%;
					  transform: translate(-50%, -50%);
					}
					/*-----end---暂时的*/
				}
			}
			/* 校区位置 */
			.campus-detail-center{
			  padding:.32rem .40rem .25rem .40rem;
			  background: #fff;
			  	.detail-center{
				  display: flex;
				  justify-content: space-between;
				  margin-bottom: .25rem;
				  	.campus-titles{
					  font-size:.40rem;
					  font-weight:700;
					  color:#111;
					  line-height:.56rem;
					  display: flex;
					}
					.campus-center-telephone{
					  width:.36rem ;
					  height: .37rem;
					}
					.detail-center-icon{
					  width: .27rem;
					  height:.27rem ;
					  margin-right: .16rem
					}
					.detail-center-location{
					  display: flex;
					  flex-direction: column
					}
					.detail-center-text{
					  font-size:.27rem;
					  color:#111;
					  font-weight: 400;
					  line-height:.37rem;
					}
				}
			}
			.campus-service{
			  padding:0 .40rem .40rem .40rem;
			  background: #fff;
			  margin-top: .20rem;
			  	.campus-title{
				  font-size:.40rem;
				  font-weight:700;
				  color:#111;
				  line-height:.56rem;
				  padding:.43rem 0 .27rem 0;
				}
				.campus-service-content{
				  display: flex;
				  flex-direction: column;
				  color: #555;
				  font-size: .27rem;
				  	p{
					  text-align: left;
					  height: .37rem;
					  line-height: .37rem;
					  overflow: hidden;
					  margin-bottom: .20rem;
					}
					p:before{
					  content: ""; 
					  width:.07rem; 
					  height: .07rem; 
					  background-color: #2C8CFF;
					  border-radius: 50%; 
					  display: inline-block;
					  margin: .10rem;
					}
				}
			}
			/* 微信按钮 */
			.campus-service-call{
			  position: fixed;
			  bottom: 0;
			  left: 0;
			  width: 100%;
			  	.campus-service-wrap{
				  padding: .20rem .40rem;
				  background: #fff;
				  	.my_order_btn{
					  background:rgba(44,140,255,1);
					  border-radius: .50rem;
					  color: #fff;
					  font-size: .36rem;
					  height: .88rem;
					  line-height: .88rem;
					  width: 100%;
					}
				}
			}
			
			
		}
	}
	
	
	
	.mint-swipe-items-wrap > div{
		display: block!important;
	}
	
	
	
	
	
	
</style>