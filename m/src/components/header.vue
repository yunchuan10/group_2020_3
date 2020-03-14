<template>
    <div class="header-c ">

        <div class="header-contain" v-if="header_title||$route.meta.title">

            <!-- 左侧 -->
            <div class="head-l1" @click="routeBack">
                <img src="../common/imgs/head2.png" alt="">
            </div>

            <div class="head-center">
                {{header_title||$route.meta.title}}
            </div>

            <!-- 右侧 -->
            <!-- <div class="head-r1" v-show="!out_login">
                <a href="">注册/登陆</a>
            </div> -->
            <!-- 右侧不同部分传入 -->
            <div class="head-r1" v-if="!no_hasauth">
            	<slot name="head_sr"></slot>
            	<div v-if="out_login && $route.meta.hasAuth">
	                <router-link to="/my" style="" >
				        <!-- 头像 -->
				        <img :src="face_img" alt="头像">
			    	</router-link>
		    	</div>
		    	<div v-else-if="$route.meta.hasAuth">
		    		<router-link to="/login">注册/登录</router-link>
		    	</div>
            </div>

        </div>
    	<div class="header-contain" v-else>
            <!-- 左侧 -->
            <div class="head-l">
                <img src="../common/imgs/head1.png" alt="东方尚学">
                <a @click="downApp" href="javascript:void(0);">下载APP</a>
            </div>

            <!-- 右侧 -->
            <div class="head-r" v-show="!out_login">
                <!-- <a href="">注册/登录</a> -->
                <router-link to="/login">注册/登录</router-link>
            </div>

            <!-- 个人中心 -->
            <div class="head-r" v-show="out_login && !no_hasauth">
                <router-link to="/my" style="">
                    <!-- 头像 -->
                    <img :src="face_img" alt="头像">
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>
    import { mapGetters} from 'vuex';
    import { Toast } from 'mint-ui';
    export default {
        props: ['header_title','no_hasauth'],
        data(){
            return {

            }
        },
        created() {
        },
        methods: {
            routeBack(){
        	    //判断设备是ios还是Android
	            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && this.$route.query.system && this.$route.name == 'courseDetails') {
	                 //原生返回
                	window.webkit.messageHandlers.backAct.postMessage(null);
	            } else if (/(Android)/i.test(navigator.userAgent) && this.$route.query.system && this.$route.name == 'courseDetails') {
	            	javascript:onKeyBackPressed.onKeyBackPressed(true);
	            } else { 
	            	
	            	this.$router.back(-1);
	            };
            },
            downApp(){
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                var weixin = u.indexOf('MicroMessenger') > -1; //是否微信
                if(isAndroid){
                    if(weixin){
                        Toast({
                            message: '请从右上角在浏览器中打开去下载',
                            duration: 2000
                        });
                    }else{
                        window.location.href="https://static.xkedu.org/dfsx/app-release.apk";
                    }
                }else{
                    window.location.href="https://itunes.apple.com/cn/app/id1441752178?mt=8";
                }
                // if(weixin == true){
                //     Toast({
                //         message: '请从右上角在浏览器中打开',
                //         duration: 2000
                //     });
                // }
            }
        },

        computed: {
            ...mapGetters(['checkLogin']),
            out_login(){
                return !!localStorage.user;
            },
            face_img(){
                let _img = this.checkLogin.face_img || require('../common/imgs/common/d.png')
                return _img;
            }
        },

    }
</script>

<style lang="less">
    .header-c{
        position: fixed;
        width: 100%;
        height: 1rem;
        background: @base1;
        left: 0;
        top: 0;
        z-index: 99999;
        box-sizing: border-box;
        padding: 0 .4rem;
        border-bottom: .01rem solid #ddd;

        .header-contain{
            display: flex;
            justify-content: space-between;
            position: relative;
            height: 100%;
            align-content: center;
            .head-l{
                display: flex;
                height: 100%;
                justify-content: left;
                align-items: center;
                img{
                    height: .51rem;
                    margin-right: .4rem;
                    margin-top: 2px;
                }
                a{
                    display: inline-block;
                    height: .48rem;
                    line-height: .51rem;
                    text-align: center;
                    border-radius: .3rem;
                    border:1px solid #2C8CFF;
                    padding: 0 .2rem;
                    color: #2C8CFF;
                    white-space: nowrap;
                    font-size: .22rem;
                    margin-top: 3px;
                }
            }

            .head-r{
                height: 100%;
				color: #494949;
                a{
                    height: 100%;
                    line-height: 1rem;
                    font-size: .27rem;
                    color: #2c8cff;
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
                    color: #2c8cff;
                }
                img{
                        height: .7rem;
                        width: .7rem;
                        vertical-align: middle;
                        border-radius: .42rem;
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
                padding: 0 .4rem;
                margin-left: -.4rem;
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

</style>