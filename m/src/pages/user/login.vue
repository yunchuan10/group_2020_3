<template>
	<div class="login-c">
        <!-- 头部 -->
        <v-header ></v-header>

        <div class="login-type">
            <div class="types" :class="{'type-sec':loginType==1}" @click="loginType=1">验证码登录</div>
            <div class="types-line"></div>
            <div class="types" :class="{'type-sec':loginType==2}" @click="loginType=2">密码登录</div>
        </div>

        <div class="login-form" v-show="loginType==1">
            <div class="login-item">
                <img src="../../common/imgs/user/i3.png" alt="icon">
                <input type="text" maxlength="11" v-model.trim="phone1" placeholder="请输入您的手机号">
            </div>
            <div class="login-item login-item-sms" :class="{'login-in-sms': isSms}">
                <img src="../../common/imgs/user/i4.png" alt="icon">
                <input type="text" max-length="8" v-model.trim="sms" placeholder="请输入手机验证码">
                <div class="get-sms" :class="{'in-sms': isSms}" @click="getSms">
                    <span v-show="!isSms">获取验证码</span>
                    <span v-show="isSms">请 {{smsCode}}s 后重新获取</span>
                </div>
            </div>

            <div class="login-tip">
                <span>*</span> 未注册的手机号验证后将自动注册
            </div>

            <div class='login-btn' :class="{'login-able':loginAble1}" @click="smsLogin">
                立即登录
            </div>
        </div>

        <div class="login-form" v-show="loginType==2">
            <div class="login-item">
                <img src="../../common/imgs/user/i1.png" alt="icon">
                <input type="text" maxlength="11" v-model.trim="phone2" placeholder="请输入您的手机号">
            </div>
            <div class="login-item">
                <img src="../../common/imgs/user/i2.png" alt="icon">
                <input type="password" maxlength="50" v-model.trim="password" placeholder="请输入您的密码">
                <router-link class="set-pasw" to='/setPassword'>忘记密码？</router-link>
            </div>

            <div class="login-tip"></div>

            <div class='login-btn' :class="{'login-able':loginAble2}" @click="passwdLogin">
                立即登录
            </div>
        </div>

        <div class="agreement">登录即表示同意东方尚学的 <router-link to="/agreement">《用户协议》</router-link>  </div>

	</div>
</template>
<script>
    import { mapActions } from 'vuex'
    import { Toast } from 'mint-ui';
    import { LoginSms, SmsLogin, PasswdLogin } from "../../api"
    import { getLocalSto, setLocalSto, delLocalSto } from "../../common/js/utils.js"
	export default {
		data(){
			return{
                loginType: 1,

                phReg: /^1\d{10}$/,
                phone1: '',
                phone2: '',
                sms: '',
                password: '',

                isSms: false,
                smsCode: 0,
                smsTimer: null

			}
        },

        created() {
            var type = this.$route.query.type||1;
            this.loginType = type;
        },

        computed: {
            loginAble1(){
                let { phone1, sms } = this;
                phone1 = (phone1+'').trim();
                sms = (sms+'').trim();
                return ( phone1 && sms )
            },
            loginAble2(){
                let { phone2, password } = this;
                phone2 = (phone2+'').trim();
                password = (password+'').trim();
                return ( phone2 && password )
            }
        },

        methods: {
            ...mapActions(['checkLogin','checkLoginLoop','unCheckLogin']),

            // 轮询检测登陆状态
            checkLoop(){
                this.$store.state.checkLoopT = setTimeout(()=>{
                    let token = getLocalSto('user')||'';
                    if(!token || this.$router,this.$route.system){ // 有system是app不验证
                        clearTimeout(this.$store.state.checkLoopT)
                        return;
                    }
                    this.checkLoginLoop({token, cb:(res)=>{
                        if(res.statusCode==200){
                            this.checkLoop()
                        }else{
                            Toast({
                                message: '你的账号在其他地方登录，你被踢出，请重新登录',
                                duration: 2000
                            });
                            this.$store.state.checkLoopT && clearTimeout(this.$store.state.checkLoopT)
                            //清空本地存储
                            delLocalSto('user');
                            delLocalSto('uid');
                            delLocalSto('guid');
                            this.unCheckLogin({});
                            //清空缓存后跳转到登陆页面
                            setLocalSto('loginBack', '/');
                            setTimeout(()=>{
                                this.$router.replace({path: '/login'});
                            }, 2000)
                        }
                    }})
                }, 2*60*1000)
            },

            // 获取短信
            getSms(){
                let { phone1, phReg } = this;
                phone1 = (phone1+'').trim();
                if( this.isSms ){
                    return;
                }
                if( !phReg.test(phone1) ){
                    if( !phone1 ){
                        Toast({
                            message: '手机号不能为空！',
                            duration: 2000
                        });
                    }else{
                        Toast({
                            message: '手机号格式错误！',
                            duration: 2000
                        });
                    }
                    return;
                }
                LoginSms(phone1,'app_sms_login','login').then( res=>{
                    if(res.statusCode == 200){
                        if( this.isSms ){
                            return;
                        }
                        this.isSms = true;
                        clearInterval(this.smsTimer);
                        this.smsCode = 60;
                        this.smsTimer = setInterval( ()=>{
                            if( this.smsCode <= 1 ){
                                clearInterval(this.smsTimer);
                                this.isSms = false;
                                return false;
                            }
                            this.smsCode--;
                        }, 1000);
                    }else{
                        const message = res.message||'网络错误,请稍后重试';
                        Toast({
                            message,
                            duration: 2000
                        });
                    }
                } )
            },

            // 短信登录
            smsLogin(){
                let { phone1, phReg, sms } = this;
                phone1 = (phone1+'').trim();
                sms = (sms+'').trim();
                if( !phReg.test(phone1) ){
                    if( !phone1 ){
                        Toast({
                            message: '手机号不能为空！',
                            duration: 2000
                        });
                    }else{
                        Toast({
                            message: '手机号格式错误！',
                            duration: 2000
                        });
                    }
                    return;
                }
                if(!sms){
                    Toast({
                        message: '短信验证码不能为空！',
                        duration: 2000
                    });
                    return;
                }
                SmsLogin({
                    "smsCode": sms,
                    "mobile": phone1
                }).then( res=>{
                    if(res.statusCode == 200){
                        const loginBack = getLocalSto('loginBack')||'/';
                        const result = res.result+''||'1';
                        this.checkLogin(result);
                        setLocalSto('user', result);    //存储用户
                        Toast({
                            message: '登录成功',
                            duration: 2000
                        });
                        setTimeout( ()=>{
                            this.$router.push({
                                path: loginBack
                            })
                        }, 2000 )
                        // 轮询检测登陆状态
                        this.checkLoop();
                    }else{
                        const message = res.message||'登录失败';
                        Toast({
                            message,
                            duration: 2000
                        });
                    }
                } )
            },

            // 密码登录
            passwdLogin(){
                let { phone2, phReg, password } = this;
                phone2 = (phone2+'').trim();
                password = (password+'').trim();
                if( !phReg.test(phone2) ){
                    if( !phone2 ){
                        Toast({
                            message: '手机号不能为空！',
                            duration: 2000
                        });
                    }else{
                        Toast({
                            message: '手机号格式错误！',
                            duration: 2000
                        });
                    }
                    return;
                }
                if( !password ){
                    Toast({
                        message: '密码不能为空！',
                        duration: 2000
                    });
                    return;
                }else if( !password.match(/[A-Z]/) ){
                    Toast({
                        message: '密码必须包含一个大写字母！',
                        duration: 2000
                    });
                    return;
                }

                PasswdLogin({
                    'mobile': phone2,
                    'passwd': password
                }).then( res=>{
                    if(res.statusCode == 200){
                        const loginBack = getLocalSto('loginBack')||'/';
                        const result = res.result+''||'1';
                        this.checkLogin(result);
                        setLocalSto('user', result);    //存储用户
                        Toast({
                            message: '登录成功',
                            duration: 2000
                        });
                        setTimeout( ()=>{
                            this.$router.push({
                                path: loginBack
                            })
                        }, 2000 )

                        // 轮询检测登陆状态
                        this.checkLoop();

                    }else{
                        const message = res.message||'登录失败';
                        Toast({
                            message,
                            duration: 2000
                        });
                    }
                } )
            }

        }

	}
</script>
<style lang="less">
    .login-c{
        min-height: 100%;
        background: #fff;
        padding: 2rem .76rem .5rem;
        .types{
            color: #999;
        }
        .login-type{
            display: flex;
            align-items: center;
            font-size: .42rem;
            // color: #999;
            .type-sec{
                color: #111;
            }
            .types-line{
                height: .32rem;
                width: 1px;
                background: #bbb;
                margin: 0 .32rem;
            }
        }


        .login-form{
            padding-top: .8rem;
            .login-item{
                position: relative;
                height: .6rem;
                border-bottom: 1px solid #ddd;
                padding-bottom: .2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                img{
                    width: .5rem;
                    margin-right: .2rem;
                }
                input{
                    flex: 1;
                    display: block;
                    height: .6rem;
                    line-height: .6rem;
                    font-size: .27rem;
                }

                input::-webkit-input-placeholder {
                    color: #ddd;
                }

                .get-sms{
                    flex-shrink: 0;
                    width: 1.72rem;
                    // padding: 0 .27rem;
                    height: .6rem;
                    line-height: .6rem;
                    border-radius: .32rem;
                    background: #2c8cff;
                    color: #fff;
                    text-align: center;
                    font-size: .24rem;
                    // margin: 0 .2rem;
                    position: absolute;
                    z-index: 2;
                    right: 0.2rem;
                    top: 0.6rem;
                }
                .set-pasw{
                    font-size: .24rem;
                    color: #2c8cff;
                    margin: 0 .2rem;
                    flex-shrink: 0;
                }
            }

            .login-item-sms{
                padding-right: 2.12rem;
            }

            .login-in-sms{
                padding-right: 2.9rem;
                .get-sms{
                    width: 2.5rem;
                }
            }

            .login-tip{
                padding: .35rem 0 0;
                font-size: .24rem;
                color: #999;
                line-height: .42rem;
                height: .42rem;
                span{
                    color: #f00;
                    vertical-align: middle;
                    display: inline-block;
                }
            }

            .login-btn{
                margin-top: 1.1rem;
                height: .9rem;
                font-size: .36rem;
                text-align: center;
                line-height: .9rem;
                color: #fff;
                border-radius: 4px;
                background: #2c8cff;
                opacity: .45;
            }
            .login-able{
                opacity: 1;
            }
        }

        .login-form>.login-item+.login-item{
            padding-top: .6rem;
        }

        .agreement{
            font-size: .24rem;
            color: #999;
            padding-top: 2.46rem;
            text-align: center;
            a{
                color: #2c8cff;
            }
        }

    }

</style>