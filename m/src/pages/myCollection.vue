<template>
	<div class="collection-c my-collection">
		<!-- 头部 -->
    	<v-header :header_title="header_title"></v-header>
	   	<!-- 缺省页面 -->
	    <div class='collection-default-page' v-if="collectLists.length < 0">
	        <div class='collection-default-content'>
	          <img class='collection-default-img' src='../common/imgs/my/collectionDefault_icon.png'></img>
	          <p class='collection-default-text'>您尚未收藏课程哦 </p>
	          <p class='collection-default-text'> 快去课程列表搜索课程吧</p>
	        </div>
	    </div>
	  	<div  class='scroll-div'>
	     	<!-- 根据后台数据显示缺省页或者正常的内容区 -->
		    <div v-if="collectLists.length > 0">
		      <!-- 循环遍历的整体部分 -->
		      	<mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText='bottomText' :auto-fill="false" ref="loadmore">
					<!-- 课程卡片信息 -->
					<course
						:goodsList = "collectLists"
					></course>
                    <!-- <div style="height: .4rem;"></div>
                    <router-link class="my-content" :to="'/courseDetails?goodsId='+item.id"  v-for="(item, index) in collectLists" :key="index"  @click='collectionPage'>
	                    <div class='my-content-t'>
		                    <p v-if="item.cat_name" class='my-content-icon'>{{item.cat_name}}</p>
		                    <p v-if="item.teaching_method" class='my-content-icon'>{{item.teaching_method}}</p>
		                </div>
                        <div class="my-content-title ellipsis2">
                            {{item.goods_name}}
                        </div>
                        <div class='my-content-c'>
                            {{item.course_count}}节课／共{{item.course_hour}}小时
                        </div>
                        <div class='my-footer'>
                            <div class='my-footer-left'>
                                <span class='my-footer-left'>{{item.buy_number}}人购买</span>
                            </div>
                            <div class='my-footer-right'>
                                <span class='footer-right-icon'>¥ </span><span class='footer-right-money'>{{item.shop_price}}</span>
                            </div>
                        </div>
                    </router-link>
                    <div style="height: .4rem;"></div> -->

			    </mt-loadmore>
		    </div>
	    </div>
	    <!-- 到底部提示文案 -->
  		<div class='collection-end-title' v-show="collectionTitle">收藏加载完毕 ~_~</div>
	</div>
</template>
<script>
	import {Indicator, Loadmore, Toast} from 'mint-ui';
	import { getLocalSto } from "../common/js/utils.js";
	import { CollectLists} from '../api';
//	import Vue from 'vuex';
	import {  mapActions,mapGetters} from 'vuex';
	import course from '../components/course.vue'
	export default {
		data(){
			return{
				pages:1,
				header_title:'我的收藏',
				list:[],//请求过来的数据存放的变量
				collectionTitle:false,
				allLoaded:false,
				bottomText: '上拉加载更多...',
				//uid从内存中获取
				uid:''
			}
		},
		created(){
			Indicator.open('加载中...');
			//从缓存中获取
//    		this.uid =  '1';
			this.uid =  this.checkLogin.id || '';
//			console.log(this.checkLogin)
		},
		mounted(){
			this.CollectList()
		},
		computed:{
			...mapGetters(['collectLists','checkLogin'])

		},
		components: {
    		course
  		},
		methods:{
			...mapActions(['set_collectLists']),
			//action中的方法
			getCollectList(dat){
				this.set_collectLists({
			     data : dat
			    });
			},
			//请求数据
			CollectList(uid){
				let that = this;
				CollectLists(
					{
						uid: that.uid,
				        page: that.pages,
				        pageSize: 5
					}
				).then(res=>{
					if(res.result.length > 0){
						that.list = that.list.concat(res.result);
						that.pages = that.pages+1;
					}else if(res.result.length == 0){
						that.collectionTitle = true;
					}
					that.getCollectList(that.list);

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
                this.CollectList();
            },
			//点击相应的收藏跳转到指定的收藏页面
			collectionPage(e){
				let collectId = e.target.getAttribute('data-id');
				//进行页面跳转并将产品id传递过去  name 页面路径--后期改动
				this.$router.push({ path: '/courseDetails',query:{ goodsId:collectId }});
			}
		}
	}
</script>
<style lang="less">
	.collection-c.my-collection{
	  display: block;
	  width: 100%;
	  /*margin-top: 1.2rem;*/
	 	 /* 缺省页面 */
		.collection-default-page{
		  width: 100%;
		  height: 100%;
		  position: relative;
		  margin-top:1.2rem;
		  	.collection-default-content{
			  width:2.68rem ;
			  height: 3.36rem;
			  position: absolute;
			  left: 50%;
			  top: 50%;
			  transform: translate(-50%,50%);
			  display: flex;
			  flex-direction: column;
			  	.collection-default-text{
				  font-size:0.24rem;
				  color:rgba(153,153,153,1);
				  line-height:0.36rem;
				  text-align: center;
				  display: block
				}
				.collection-default-img{
				  width: 2.67rem;
				  height: 2.67rem;
				}
			}
		}
		.scroll-div{
			// padding: 0 .4rem;
			margin-top: .4rem;

            .my-content+.my-content{
                margin-top: .4rem;
            }
            .my-content{
                display: block;
                padding: .3rem .4rem 0;
                box-shadow: 0 .04rem .32rem 0 rgba(0,0,0,0.1);
                border-radius: 5px;
                background: #fff;
            }


            .my-content-t{
                display: flex;
                width: 100%;
            }
            .my-content-t>p{
                margin-bottom: .24rem;
                height: .38rem;
                line-height: .38rem;
                border: .01rem solid #2c8cff;
                color: #2c8cff;
                font-size: .22rem;
                padding: 0 .18rem;
                margin-right: .16rem;
                border-radius: .22rem;
            }
            .my-content-title{
                font-size: .36rem;
                color: #494949;
                line-height: 1.2;
            }
            .my-content-c{
                color: #999;
                font-size: .24rem;
                padding: .08rem 0 .32rem;
            }

            .my-footer{
                display: flex;
                justify-content: space-between;
                border-top: 1px solid #ddd;
                line-height:.80rem ;
                height: .80rem;
            }
            .my-footer-left{
                font-size:.24rem ;
                color: #999;
            }
            .my-footer-right{
                color: #111;
            }
            .footer-right-icon{
                font-size: .24rem;
                height: .40rem;
                line-height: .40rem;
                color: #FE5B59;
                font-weight: 700;
            }
            .footer-right-money{
                font-size: .4rem;
                height: .40rem ;
                line-height: .40rem;
                color: #FE5B59;
                font-weight: 700;
            }
		  	// .my-content{
			//    display: flex;
			//    margin-top: 0.40rem;
			//    flex-direction: column;
			//    background: #fff;
			//    padding:0.37rem 0.40rem;
			//    	.my-content-title{
			// 		  display: block;
			// 		  font-size: 0.32rem;
			// 		  color: #000;
			// 		  font-weight: 600;
			// 		  line-height: 0.40rem;
			// 		  display: -webkit-box;
			// 		  overflow: hidden;
			// 		  text-overflow: ellipsis;
			// 		  word-wrap: break-word;
			// 		  white-space: normal !important;
			// 		  -webkit-line-clamp: 2;
			// 		  -webkit-box-orient: vertical;
			// 	}
			// 	.my-content-icon{
			// 	  /* min-width:68rpx ; */
			// 	  /* height:40rpx ; */
			// 	  padding: 0.0rem 0.09rem;
			// 	  /*line-height: 0.40rem;*/
			// 	  text-align: center;
			// 	  display: inline-block;
			// 	  font-size: 0.24rem;
			// 	  color: #2C8CFF;
			// 	  border:0.01rem solid rgba(44,140,255,1);
			// 	  margin-bottom: 0.05rem;
			// 	}
			// }

			// .my-content-center{
			//   display: flex;
			//   justify-content: space-between;
			//   margin-top: 0.18rem ;
			//     .my-content-left{
			// 	  font-size:0.24rem ;
			// 	  color: #555;
			// 	  line-height:0.40rem ;
			// 	  height: 0.40rem;

			// 	}
			// 	.my-content-right{
			// 		text-decoration: line-through;
			// 		text-decoration-color: #555;
			//   		.content-right-icon{
			// 		  font-size:0.24rem ;
			// 		  color: #555;
			// 		  line-height:0.40rem ;
			// 		  height: 0.40rem;
			// 		  vertical-align: bottom;
			// 		  text-decoration: line-through;
			// 		  text-decoration-color: #555;
			// 		  margin-right: 0.05rem;
			// 		}
			// 		.content-right-money{
			// 		  font-size:0.24rem ;
			// 		  color: #555;
			// 		  text-decoration: line-through;
			// 		  text-decoration-color: #555
			// 		}
			// 	}
			// }

			// .my-footer{
			//     display: flex;
			//     justify-content: space-between;
			//     margin-top: 0.08rem;
			//     .my-footer-left{
			//     	display: flex;
			// 	 	font-size:0.20rem ;
			// 		color: #999;
			// 		line-height:0.40rem ;
			// 		height: 0.40rem;
			// 	}
			// 	.my-footer-right{
			// 		display: flex;
			// 	  	color: #999;
			// 	  	.footer-right-icon{
			// 		  font-size: 0.32rem;
			// 		  color: #F43530;
			// 		  height: 0.40rem;
			// 		  line-height: 0.40rem;
			// 		}
			// 		.footer-right-money{
			// 		  font-size: 0.4rem;
			// 		  color:#F43530 ;
			// 		  height:0.40rem ;
			// 		  line-height:0.40rem;
			// 		}
			// 	}
			// }
		}

		/* 加载完毕 到底提示 */
		.collection-end-title{
		  text-align: center;
		  color: #999;
		  font-size: 0.24rem;
		  width: 100%;
		  padding: 0.47rem 0 0.47rem 0;
		}
	}
</style>