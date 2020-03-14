<template>
	<!-- 订单/收藏/客服/预约 区域 -->
	<div class="my-page">
	    <div class="my-page-bd">
	    	<!-- 头部 -->
        	<div class="header-c ">
		        <div class="header-contain">
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
	        <div class='my-page-top'>
	            <div class='my-page-top-content'>
	                <div @click="openMask" class="my-page-list-access" hover-class="my-page-list-active">
		                <div class="my-page-list-bd">头像</div>
		                <input type="file" accept="image/*" @change="handleFile" class="hiddenInput" ref="upyun"/>
		                <div class="my-page-list-arrow ">
		                	<img :src="face_img" class="my-page-imgs" alt="头像">
		                    <img class='my-page-list-arrow-right' src="../common/imgs/my/arrow_icon.png" />
		                </div>
		            </div>
		            <div class="my-page-list-access my-page-list-order-top"  @click="changeName" style="display:none">
		                <div class="my-page-list-bd">昵称</div>
		                <div class="my-page-list-arrow ">
		                	{{ checkLogin.display_name }}
		                    <img class='my-page-list-arrow-right' src="../common/imgs/my/arrow_icon.png" />
		                </div>
		            </div>
					<div  class="my-page-list-access my-page-list-access-customer " hover-class="my-page-list-active">
		                <div class="my-page-list-bd">
		                  <button open-type="contact"  class='my_order_btn'>姓名</button>
		                </div>
		                <div class="my-page-list-arrow ">
		                	{{ checkLogin.full_name }}
		                 <!--   <img class='my-page-list-arrow-right'src="../common/imgs/my/arrow_icon.png" ></img>-->
		                </div>
		            </div>
		            <div  class="my-page-list-access my-page-list-access-customer " hover-class="my-page-list-active">
		                <div class="my-page-list-bd">
		                  <button open-type="contact"  class='my_order_btn'>手机号</button>
		                </div>
		                <div class="my-page-list-arrow ">
		                	{{ checkLogin.mobile }}
		                 <!--   <img class='my-page-list-arrow-right'src="../common/imgs/my/arrow_icon.png" ></img>-->
		                </div>
		            </div>
	            </div>
	        </div>
	        <div class="my-page-list-cells my-page-list">
	            <!-- 一期不做开发 故先不放开 -->
	             <!--<router-link  to="/myCampus" class="my-page-list-access" hover-class="my-page-list-active">
	                <div class="my-page-list-bd">我的校区</div>
	                <div class="my-page-list-arrow ">
	                    <img class='my-page-list-arrow-right'src="../common/imgs/my/arrow_icon.png" ></img>
	                </div>
	            </router-link > -->
	            <router-link to="/myCollection" class="my-page-list-access my-page-list-order-top" hover-class="my-page-list-active">
	                <div class="my-page-list-bd">我的收藏</div>
	                <div class="my-page-list-arrow ">
	                    <img class='my-page-list-arrow-right' src="../common/imgs/my/arrow_icon.png" />
	                </div>
	            </router-link>
	            <router-link to="/myOrder" class="my-page-list-access my-page-list-order-top list-order-top" hover-class="my-page-list-active">
	                <div class="my-page-list-bd">我的订单</div>
	                <div class="my-page-list-arrow ">
	                    <img class='my-page-list-arrow-right' src="../common/imgs/my/arrow_icon.png" />
	                </div>
	            </router-link>
	            <router-link to="/address" class="my-page-list-access my-page-list-order-top list-order-top" hover-class="my-page-list-active">
	                <div class="my-page-list-bd">收货地址</div>
	                <div class="my-page-list-arrow ">
	                    <img class='my-page-list-arrow-right' src="../common/imgs/my/arrow_icon.png" />
	                </div>
	            </router-link>
	            <div class="my-page-list-access my-page-list-access-customer login-out" hover-class="my-page-list-active" @click="outLogin">
	                <div class="my-page-list-bd">
	                  <button class='my_order_btn my_order_out'>退出登录</button>
	                </div>

	            </div>
	        </div>

	    </div>


	</div>
</template>
<script>
	import { PersonMessage, updateuser} from '../api';
	import { mapActions ,mapGetters} from 'vuex';
	import { Toast } from 'mint-ui';
	import { getLocalSto, delLocalSto} from "../common/js/utils.js";
	import {setHeaders} from '../common/js/utils';
	import axios from 'axios';
	import { BASEURL } from '../common/js/base.js';


	export default {
		data(){
			return {
				user:{},
				mask_img:false,
				header_title:'个人中心',
			}
		},
		created(){
			//guid 从内存中获取
//			this.guid = '0C199FBD-71C1-468A-A567-3F987E53353F' || ''; //后台给的暂时的
//			this.guid = this.checkLogin.guid || ''; //从vuex的state中获取guid
		},
		computed:{
			...mapGetters(['checkLogin']),
			face_img(){
				return ( this.checkLogin.face_img || require('../common/imgs/common/d.png'))
			}

		},
		methods:{
			...mapActions(['unCheckLogin']),

			//退出登陆
			outLogin(){
				//清空本地存储
                delLocalSto('user');
                delLocalSto('uid');
                delLocalSto('guid');

				//清空vuex缓存的数据
				this.users = {};
				this.unCheckLogin(this.users);
				//清空缓存后跳转到登陆页面
				this.setLoginBack();
//				this.$router.push({path: '/login'});
			},
			//开启弹出层--切换头像
			openMask(){
				if(!this.mask_img){
					this.mask_img = !this.mask_img
				}
			},
			//隐藏图层
			hiddenMask(){
				if(this.mask_img){
					this.mask_img = !this.mask_img
				}
			},
			//修改昵称
			changeName(){
				this.$router.push({path: '/myChangeName'});
			},
			//上传图片
			imgPost(params){
				console.log(params)
				//console.log(params.get('upfile')); FormData私有类对象，访问不到，可以通过get判断值是否传进去
          	   let config = {
			    headers: {'Content-Type': 'multipart/form-data'}
			   }
			   // 添加请求头 根据请求接口上传云存储-----返回的字段中有网络图片路径
			   axios.post( BASEURL + 'upyun', params, config)
			    .then(response => {
				     let res = response.data;
				     console.log(res,'res')
				     if(res.statusCode == 200){
				     	this.$store.state.checkLogin.face_img = res.result[1];//页面显示
//				     	this.checkLogin.face_img = res.result[1];//页面显示
				     	//上传云成功后  -----  再将返回的图片路径传递给后台进行存储
     			        updateuser(
							{
								guid:this.checkLogin.guid,
								faceimg:this.checkLogin.face_img
							}
						).then(res =>{
							if(res.statusCode == 200){
								Toast({
								  message: '头像上传成功！',
								  duration: 2000
								})
								//上传成功后关闭遮罩层
								this.mask_img = !this.mask_img
							}else{
								Toast({
								  message: '网络异常,稍后重试',
								  duration: 2000
								});
							}
						}).catch(err=>{
							Toast({
							  message: '网络异常,稍后重试',
							  duration: 2000
							});
						})
				    }else{
				    	Toast({
							  message: '图片过大，请换小图!',
							  duration: 2000
							});
				    }
			    })
			},
			//上传从相册中调取图片
			handleFile(e){
				var _this = this;
		        let file = _this.$refs.upyun.files[0];
		        var reader = new FileReader();
		        reader.onload = (data) => {
			        let res = data.target || data.srcElement;

			    }
			    reader.readAsDataURL(file);
//			    let params = new FormData() ; //创建一个form对象
//        		params.append('upfile',file);  //append 向form表单添加数据
//        		params.append('code','face');  //append 向form表单添加数据
//
				lrz(file,{
					width:30,
					height:30,
					quality:0.8
				})
				.then(function(rst){
//					console.log(rst,'tst')
//					console.log(file,'file')
//					console.log(rst.formData,'顶飒飒撒');
					rst.formData.append("upfile",rst.file);
					rst.formData.append("code","face");
//					console.log(rst.formData.get("upfile"),'顶顶顶顶');
					_this.imgPost(rst.formData)
				}).catch(function(err){
//					console.log(err)
					Toast({
					  message: '网络错误！',
					  duration: 2000
					})
				}).always(function(){

				})


			},
			routeBack(){
				this.$router.push({ name: 'home'})
			}
		}
	}
</script>
<style lang="less">
	html{
		touch-action: none;
	}
	/* 自己的css */
	.my-page{
      min-height: 100%;
      box-sizing: border-box;
      background: #f4f4f4;
      padding-top: .3rem;
	  display: block;
	  .my-page-bd{
	   display: block;
	   	/* 中部列表部分 */
		.my-page-list{
		  margin-top: 0
		}

		.my-page-list-cells{
			  position:relative;
			  margin-top:0.30rem;
			  line-height:0.60rem;
			  font-size:0.48rem;
			  color: #555;
		    .my-page-list-access{
			  padding: 0.36rem 0.40rem 0.39rem 0.40rem;
			  position:relative;
			  display:flex;
			  align-items:center;
			  background: #fff;
			}
			.login-out{
				/*border-radius: 0.2rem;*/
			}
		  	.my-page-list-bd{
				/*height: 0.40rem;*/
				flex:1;
				font-size: 0.32rem;
				/*line-height: 0.40rem;*/
				color: #494949;
			}
			.my-page-list-arrow{
			   padding-right:0.13rem;
			   position:relative;
			   text-align: right

			}
		}


		.my-page-list-hd{
		  display: block
		}
		.my-page-list-img{
		  margin-right:0.40rem;
		  vertical-align: middle;
		  width:0.40rem;
		  height: 0.40rem;
		}

		.my-page-list-arrow-right{
		  width:0.12rem ;
		  height: 0.23rem;
		  align-self: center;
		  margin-left: 0.26rem;
		}
		.my-page-list-access-customer{
		  margin-top: 0.30rem
		}
		.my-page-list-order-top{
		  margin-top: 0.02rem;
		  /*margin-bottom: 0.01rem;*/
		}
		.my-page-list-order-bottom{
		  margin-bottom: 0.03rem
		}

		/* 按钮自定义 */
		.my_order_btn{
		  background: #fff;
		  border: none;
		  text-align: left;
		  padding-left: 0!important;
		  padding-right: 0!important;
		  font-size: 0.32rem!important;
		  line-height: 0.45rem!important;
		  position: inherit!important;
		  color: #494949
		}
		.my_order_out{
			width: 100%;
			text-align: center;
			color: #494949;
			font-size: .32rem;
		}
	   /* 头部头像区域 */
		.my-page-top{
			// margin-top: .46rem;
		 	margin-bottom: 0.02rem;
		 	.my-page-top-content{
				display:flex;
				flex-direction: column;
				.hiddenInput{
							width: 100%;
							height: 100%;
							opacity: 0;
							position: absolute;
							left: 0;
							top: 0;
							z-index:999
						}
				.my-page-list-access{
				    padding: 0.36rem 0.40rem 0.39rem 0.40rem;
				    position:relative;
				    display:flex;
				    align-items:center;
				    background: #fff;
				    .my-page-list-bd{
						/*height: 0.40rem;*/
						flex:1;
						font-size: 0.32rem;
						line-height: 0.50rem;
						color: #494949;
					}
					.my-page-list-arrow{
					   padding-right:0.13rem;
					   position:relative;
					   text-align: right;
					   line-height: 0.6rem;
					   color: #666;
					}
				}
				.my-page-list-active{
				   background: #ddd
				}
				.my-page-list-access-customer{
				   margin-top: 0.02rem;
				}
				.my-page-list-arrow {
					display: flex;
                    flex-wrap: nowrap;
                    font-size: .28rem;
					.my-page-imgs{
						width: 0.6rem;
						height: 0.6rem;
						border-radius: 50%;
					}
				}
	  	}
		}
		/* 弹出层 调用相机和相册 */
		.my-page-mask{
			width: 100%;
			height: 100%;
			background:url('../common/imgs/my/mask.png') no-repeat;
			background-position: center;
			position: absolute;
			left: 0;
			top: 0;
			.my-mask-bottom{
				width: 100%;
				height: 4.25rem;
				position: absolute;
				bottom: 0;
				.my-mask-inner{
					width: 7.1rem;
					height: 2.28rem;
					margin: 0 auto;
					border-radius: 0.26rem;
					overflow: hidden;
					background:rgba(252,252,252,0.8);
					.my-mask-cammer{
						position: relative;
						width: 100%;
						height: 1.14rem;
						line-height: 1.14rem;
						color: #111111;
						text-align: center;
						font-size: 0.4rem;
						&.my-mask-select{
							border-top: 0.02rem solid rgba(77,77,77,1);
						}
						.hiddenInput{
							width: 100%;
							height: 100%;
							opacity: 0;
							position: absolute;
							left: 0;
							top: 0;

						}
					}

				}
				.my-mask-inner-bottom{
					width: 7.1rem;
					height: 1.14rem;
					margin: 0 auto;
					border-radius: 0.26rem;
					overflow: hidden;
					background:rgba(252,252,252,0.8);
					margin-top: 0.2rem;
					line-height: 1.14rem;
					color: #FF3B30;
					text-align: center;
					font-size: 0.4rem;
				}
			}
		}
		/*  头部导航  */
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
	}

</style>
