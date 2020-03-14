<template>
	<div class="login-c">
        <!-- 头部 -->
        <v-header >
            <div slot="head_sr" @click="setPsw">保存</div>
        </v-header>

        <div class="login-type">
            <div class="types">重置密码</div>
        </div>

        <div class="login-form">
            <div class="login-item">
                <input type="text" maxlength="11" v-model.trim="phone1" placeholder="请输入您的手机号">
            </div>
            <div class="login-item login-item-sms" :class="{'login-in-sms': isSms}">
                <input type="text" max-length="20" v-model.trim="sms" placeholder="请输入手机验证码">
                <div class="get-sms in-sms" :class="{'in-sms': isSms}" @click="getSms">
                    <span v-show="!isSms">获取验证码</span>
                    <span v-show="isSms">请 {{smsCode}}s 后重新获取</span>
                </div>
            </div>

            <div class="login-item">
                <input type="text" v-model.trim="psw" maxlength="50" placeholder="请输入新密码">
            </div>

        </div>

	</div>
</template>
<script>
    import { Toast } from 'mint-ui';
    import { LoginSms, ModifyPasswd } from "../../api"
	export default {
		data(){
			return{

                phReg: /^1\d{10}$/,
                phone1: '',
                psw: '',
                sms: '',
                password: '',

                isSms: false,
                smsCode: 0,
                smsTimer: null

			}
        },

        methods: {
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
                LoginSms(phone1, 'm' ,'changePwd').then( res=>{
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

            // 重置密码
            setPsw(){
                let { phone1, phReg, sms, psw } = this;
                phone1 = (phone1+'').trim();
                sms = (sms+'').trim();
                psw = (psw+'').trim();
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
                if( !psw ){
                    Toast({
                        message: '密码不能为空！',
                        duration: 2000
                    });
                    return;
                }else if( !psw.match(/[A-Z]/) ){
                    Toast({
                        message: '密码必须包含一个大写字母！',
                        duration: 2000
                    });
                    return;
                }
                ModifyPasswd({
                    'mobile' : phone1,
                    'smsCode' : sms,
                    'passwd' : psw
                }).then( res=>{
                    if(res.statusCode == 200){
                        Toast({
                            message: '重置密码成功',
                            duration: 2000
                        });
                        setTimeout( ()=>{
                            this.$router.push({
                                path: 'login?type=2'
                            })
                        }, 2000 )
                    }else{
                        const message = res.message||'重置密码失败';
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
        .login-type{
            display: flex;
            align-items: center;
            font-size: .42rem;
            color: #111;
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
        }

        .login-form>.login-item+.login-item{
            padding-top: .6rem;
        }

    }

</style>