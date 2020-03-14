<template>
    <!-- 协议 -->
    <div class='agreement-c' v-if="tab!=-1">

        <div class="a-section"  v-for="(item, index) in agreement" :key="index" v-show="tab==index">
            <h2> <img v-show="index!=0" @click="tab--" style="left:.4rem;" src="../common/imgs/course/arrow-left.png"/>服务协议</h2>
            <div class="s-contain">
                <div v-html="item.content||''"></div>
            </div>
            <div class="alre-red" @click="item.sec = !item.sec">
                <div :class="{'agree-sec': item.sec}"><img src="../common/imgs/common/i12.png"></div> 我已阅读并同意上述协议
            </div>
            <div class="agree-next" :class="{'sec': item.sec}" @click="setTab(index,item.sec)">下一步</div>
        </div>

        <!-- 完善信息 -->
        <div class="a-section last-agree" v-show="tab>=agreement.length">
            <h2> <img @click="tab--" v-show="agreement.length>0" src="../common/imgs/course/arrow-left.png"/>完善协议信息 </h2>
            <p class="l-text">为保障我们更好地为您服务并提供相应的课程观看，请正确填写您的个人信息，来完善并签订东方尚学的服务协议</p>

            <ul>
                <li>
                    <div><span>*</span>真实姓名:</div> <input v-model="real_name" maxlength="10" type="text" placeholder="请填写真实姓名">
                </li>
                <li>
                    <div><span>*</span>手机号码:</div> <input maxlength="11" v-model="phone" type="text" placeholder="请填写手机号码">
                </li>
                <li>
                    <div><span>*</span>手机验证码:</div>
                    <input style="width:50%;" maxlength="6" v-model="phone_code" type="text" placeholder="请填写验证码">
                    
                    <!-- <button class="code-but">获取验证码</button> -->

                <div class="code-but"  @click="getSms">
                    <button v-show="!isSms">获取验证码</button>
                    <button v-show="isSms">{{smsCode}}s</button>
                </div>
                </li>
                <li>
                    <div><span>*</span>身份证号:</div> <input v-model="id_number" type="text" placeholder="请填写身份证号">
                </li>
            </ul>

            <p class="err-text"><span v-show="subTab">{{errMsg}}</span></p>
            <div class="agree-next"  @click="agreeSub">提交</div>

        </div>

    </div>
</template>

<script>
    import { Indicator,Toast } from "mint-ui"; // 视图
    import { getAgreementContent,myAgreement,LoginSms } from '../api'
    import { getLocalSto } from '../common/js/utils.js'
    export default {
        data(){
            return{
                agreement: [],
                tab: -1,
                real_name: '',
                phone: '',
                id_number: '',
                phone_code: '',
                phReg: /^1\d{10}$/,
                phone_codeReg:/^\d{6}$/,
                idReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                subTab: 0,
              
                isSms: false,
                smsCode: 0,
                smsTimer: null,
                code : '',
            }
        },
        created() {
            let uid = getLocalSto('uid')*1||'';
            if(uid){
                getAgreementContent(uid).then(res=>{
                    var agreement = res.result.agreement||[];
                    agreement.forEach(element => {
                        element.sec = true;
                        // element.content = element.content.replace(/pt\;/g, /px\;/);
                    });
                    this.agreement = agreement;
                    this.tab = 0;
                })
            }
        },
        computed: {
            errMsg(){
              
                let {real_name,phone,id_number,phone_code} = this;
                real_name = (real_name+'').trim();
                phone = (phone+'').trim();
                id_number = (id_number+'').trim();
                phone_code = (phone_code+'').trim();

                let msg = '';
                if(!real_name){
                    msg = '真实姓名不能为空'
                }else if(!phone){
                    msg = '手机号码不能为空'
                }else if(!this.phReg.test(phone)){
                    msg = '请输入正确的手机号码'
                }else if(!phone_code){
                    msg = '手机验证码不能为空'
                }else if(!this.phone_codeReg.test(phone_code)){
                    msg = '请输入正确的手机验证码'
                }else if(!id_number){
                    msg = '身份证号不能为空！'
                }else if(!this.idReg.test(id_number)){
                    msg = '请输入正确的身份证号'
                }
                return msg;
            }
        },
        methods: {
            setTab(i, sec){
                if(!sec){
                    Toast({
                        message: "请先同意协议",
                        duration: 2000
                    });
                    return;
                }
                this.tab = ++i;
            },
            // 获取短信验证码
            getSms(){
                let { phone, phReg } = this;
                phone = (phone+'').trim();
                if( this.isSms ){
                    return;
                }
                if( !phReg.test(phone) ){
                    if( !phone ){
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
                LoginSms(phone, 'm' ,'signAgree').then( res=>{
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
            // 提交数据
            agreeSub(){
                this.subTab = 1;
                if(this.errMsg){
                    return;
                }
                let guid = getLocalSto('guid')||'';
                let {real_name,phone,id_number,phone_code} = this;
                real_name = (real_name+'').trim();
                phone = (phone+'').trim();
                id_number = (id_number+'').trim();
                let code = (phone_code+'').trim();
                let type = 'm';
                let data = {real_name,phone,code,type,id_number,guid};
                myAgreement(data).then(res=>{
                    if (res.statusCode == 200) {
                        Toast({
                            message: '操作成功',
                            duration: 2000
                        });
                        this.$store.commit('isAgreement',0);
                    }else{
                        Toast({
                            message: res.message||'操作失败',
                            duration: 2000
                        });
                    }
                }).catch((res={})=>{
                    Toast({
                        message: res.message||'操作失败',
                        duration: 2000
                    });
                })
            }

        },
    }
</script>

<style lang="less">
    .code-but{
        border-radius: .3rem;
        border: 1px solid #2C8CFF;
        background: #2C8CFF;
        color: #fff;
        height: .44rem;
        line-height: 1;
        padding: 0;
    }
    .code-but button{
        font-size: .24rem;
        color: #fff;
        padding: 0 .1rem;
    }
    .agreement-c{
        position: fixed;
        z-index: 199999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background: rgba(0, 0, 0, .3);
        // 协议
        .a-section{
            // height: auto;
            background: #fff;
            width: 5.60rem;
            position: absolute;
            left: 50%;
            top: 50%;
            border-radius: 4px;
            transform: translate(-50%,-50%);
            padding-bottom: .45rem;
            h2{
                color: #494949;
                font-size: .48rem;
                height: .5rem;
                line-height: .5rem;
                text-align: center;
                padding: .55rem 0 .22rem;
                position: relative;
            }
            h2>img{
                width: .4rem;
                height: .4rem;
                position: absolute;
                left: 0;
                top: .6rem;
            }
            .s-contain{
                padding: 0 .5rem ;
                overflow-y: auto;
                height: 4.88rem;
                margin-bottom: .26rem;

            }
            .s-contain div{
                background: #f8f8f8;
                min-height: 100%;
                padding: .2rem;
                box-sizing: border-box;
                font-size: .24rem;
            }

            .alre-red{
                padding: 0 .5rem ;
                font-size: .24rem;
                line-height: .28rem;
                display: flex;
                justify-content: flex-start;
            }

            .alre-red>div {
                border: .01rem solid #ddd;
                width: .22rem;
                height: .22rem;
                margin-right: 5px;
            }
            .alre-red>div img{
                vertical-align: middle;
                width: .24rem;
                height: .24rem;
                display: none;
            }
            .alre-red>.agree-sec{
                border: 0 none;
                width: .24rem;
                height: .24rem;
            }
            .alre-red>.agree-sec img{
                display: block;
            }
            .agree-next{
                width: 4.60rem;
                margin: 0 auto;
                border-radius: 5px;
                height: .8rem;
                line-height: .8rem;
                text-align: center;
                font-size: .32rem;
                color: #fff;
                background: #2c8cff;
                margin-top: .36rem;
            }
            .agree-next.sec{
                background: #2c8cff;
            }


        }

    }


    // 完善信息
    .last-agree{
        padding-left: .4rem;
        padding-right: .4rem;
        box-sizing: border-box;

        .l-text{
            font-size: .24rem;
            line-height: .32rem;
            padding-bottom: .42rem;
            color: #494949;
        }

        ul>li{
            height: 1rem;
            line-height: 1rem;
            display: flex;
            justify-content: space-between;
            font-size: .26rem;
            position: relative;
            border-bottom: 1px solid #ddd;
            align-items: center;
        }
        ul>li span{
            color: #FE5B59;
        }
        ul>li div{
            display: flex;
            margin-right: 5px;
            flex-shrink: 0;
        }
        ul>li input{
            flex: 1;
            display: block;
            height: .6rem;
            line-height: .6rem;
            font-size: .26rem;
        }


        .err-text{
            color: #FE5B59;
            font-size: .24rem;
            height: .3rem;
            line-height: .3rem;
            padding: .26rem 0;
        }

    }




    @media ( orientation: landscape ){
        //横屏CSS
        .agreement-c{
            .a-section{
                top: 0;
                transform: translate(-50%,0%)
            }
        }
    }





</style>