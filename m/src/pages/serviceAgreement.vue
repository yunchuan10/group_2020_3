
<template>
	<div class='serverAgreement-c'>
        <!-- 头部 -->
        <v-header :no_hasauth="system" ></v-header>

		<div class=''>
		  <div class='scroll-box div-item'>
		    <!--<div class="div-item">-->
		      <div v-if="agreementData.content" v-html="agreementData.content"></div>
		      <span v-else style="height: 5.8rem;display: inline-block;">暂无服务协议</span>
		    <!--</div>-->
		  </div>
		  <!-- 验证手机号码 -->
		  <form class='ph-form' bindsubmit="formSubmit" style="display: block;">
		    <div class='ph-inputs'>
		      <div class='ph-item ph-item-bord'>
		        <img class='ph-item-l' src='../common/imgs/common/i5.png' />
		        <div class='ph-item-c'>
		        	<div>{{user_data.mobile}}</div>
		        </div>
		      </div>
		      <!-- 验证码 -->
		      <div class='ph-item'>
		        <img class='ph-item-l' src='../common/imgs/common/i6.png' />
		        <div class='ph-item-c'>
		          <input type="text" name="code" oninput="if(value.length>6)value=value.slice(0,6)" v-model="phoneSms" placeholder='请输入手机验证码'>
		        </div>
		        <div class='ph-item-r1' @click="bindSendSms" v-if="sendmsg">获取验证码</div>
		        <div class='ph-item-r2'  v-if="!sendmsg">( {{times}} )</div>
		        <!--<div class='ph-item-r1' v-if="sendmsg" bindtap="sendmessg">{{getmsg}}</div> 
		        <div class='ph-item-r1' v-else >{{getmsg}}</div> -->
		      </div>
		    </div>
		    <!-- 提交支付 -->
		    <div class='ph-sub'>
		      <div :class="btnTrure ? 'ph-btn button-able' : 'ph-btn ' "  @click="submitAgree">我已阅读并同意，去支付</div>
		     <!-- <button v-else class='ph-btn' disabled="{{!payState}}" form-type="submit" >我已阅读并同意，去支付</button>-->
		    </div>
		  </form>
		</div>

    </div>
</template>

<script>
import Vue from 'vue'
import { Indicator,Toast, Popup } from "mint-ui"; // 视图
import { mapGetters } from "vuex";
import { serviceAgreement, agrementSendSms, agrementCheckSms} from "../api";

export default {
    data() {
        return {
	    	uid:'',  	 // 用户id
	    	mobile: '',  // 用户手机号
	        agreementData: {},  // 服务协议
	        phoneSms:'', //短信验证
	        btnTrure: false,
	        parameteData:{},
	        sendmsg:true,
	        times: "60",  //60秒倒计时
	        system:'',
        };
    },
    created() {
        Indicator.open("加载中...");
        //获取URL上传递过来的参数（后期可以处理掉）
        this.parameteData = this.$route.query;
    	// 判断是否是app跳转过来
    	if(this.parameteData.system){
    		this.uid = this.parameteData.uid || "";
        	this.mobile = this.parameteData.mobile || "";
        	this.system = this.parameteData.system || "";
    	}else{
    		this.uid = this.checkLogin.id || "";
        	this.mobile = this.checkLogin.mobile || "";
    	}
        // 获取服务协议
        this.serviceAgreement(this.parameteData.goodsId);

    },
    computed: {
        ...mapGetters(["checkLogin"]),
        
        user_data(){
        	if(this.parameteData.system){
        		return this.parameteData||{};
	    	}else{
	    		let obj = this.checkLogin||{};
	    		obj.uid = this.checkLogin.id || "";
	    		return obj;
	    	}
        	
        }
        
        
    },
    watch:{
    	phoneSms:'changeBtn'
    },
    methods: {
	    // 获取服务协议
	    serviceAgreement: function(goodsId) {
            serviceAgreement({
                goodsId: goodsId,
            }).then(res => {
              if (res.statusCode == 200){
			  	this.agreementData =  res.result
			  }
            })
            .catch(err => {
               Toast({
                   message: "网络异常,稍后重试",
                   duration: 2000
               });
            });
        },
			  
        // 课程安排和课程安排切换
        bindCheckCurrent: function(id) {
            this.currentData = id;
        },
        //60秒倒计时
        countdown: function() {
                var that = this;
                if(that.times == 0) {
                    that.sendmsg = true;
                    that.times = 60;
                    return false;
                } else {
                    that.sendmsg = false;
                    that.times--;
                }
                setTimeout(function() {  
                    that.countdown();
                }, 1000);
		},
		// 发送手机验证码
	    bindSendSms: function () {
    		
		    agrementSendSms({
				"smsType": "readAgree",
		    	"type": "m",
		    	"mobile": this.mobile,
		    }).then(res => {
		    	if (res.statusCode == 200){
		    		this.countdown();
		    		setTimeout(() => {
			            Toast({
		                   message: res.message.msg,
		                   duration: 2000
		              });
			          }, 0);
		    	}else if(res.statusCode == 500){
		    		let messageMsg = res.message.msg;
		    		if(messageMsg.indexOf('分钟')>0){
		    			this.countdown();
			    		setTimeout(() => {
				            Toast({
			                   message: '',
			                   duration: 2000
			              });
				          }, 0);
		    		}
		    		setTimeout(() => {
			            Toast({
		                   message: res.message.msg,
		                   duration: 2000
		              });
			          }, 0);
		    	}
		    })
		},
		//同意提交并跳转支付
		submitAgree:function(){
//			this.$router.push({ path: '/orderSure',query:{goodsId:this.parameteData.goodsId,goodsAllId:this.parameteData.goodsAllId}});	
//			return;
			//验证手机号
			this.mobile = this.mobile.toString();
			if (this.mobile.length != 11 || isNaN(this.mobile)) {
		      setTimeout(() => {
		        Toast({
		        	message: '手机号码错误,请重新登录',
		        	duration: 2000
		        });
		      }, 0);
		    }else if (this.phoneSms.length != 6 || isNaN(this.phoneSms)) {//验证短信验证码
		      setTimeout(() => {
		        Toast({
		          message: '请输入正确的验证码',
		          duration: 2000
		        });
		      }, 0);
		    }else{

			//向后台发送请求
			agrementCheckSms({
		    	"type": "m",
		    	"mobile": this.mobile,
		    	"code": this.phoneSms
		    }).then(res => {
		    	if(res.statusCode == 200){
		    		// 如果是app跳转
		    		if(this.system){
		    			this.$router.push({ path: '/orderSure',query:{uid:this.uid,goodsId:this.parameteData.goodsId,goodsAllId:this.parameteData.goodsAllId,system:this.system}});
		    		}else{
		    			this.$router.push({ path: '/orderSure',query:{goodsId:this.parameteData.goodsId,goodsAllId:this.parameteData.goodsAllId}});	
		    		}
					
		    	}else{
		    		setTimeout(() => {
			            Toast({
			              message: res.message.msg,
			              duration: 2000
			            });
			        }, 0);
		    	}
		    })
		    }
		},
		//改变按钮颜色
		changeBtn:function(){
			if(this.phoneSms.length >=6  ){
				this.btnTrure = true
			}else{
				this.btnTrure = false
			}
		}

    }
};
</script>


<style lang="less">
.serverAgreement-c{
	.scroll-box{
	  /*height: 100%;*/
	  background:rgba(249,249,249,1);
	  font-size:.27rem;
	  line-height:.37rem;
	  overflow-y: auto;
	}
	.div-item{
	  padding: .12rem .24rem;
	  position: fixed;
	  z-index: 2;
	  /*height: 100%;*/
	  width: 100%;
	  box-sizing: border-box;
	  overflow: hidden;
	  /*bottom: 4.1rem;*/
	  top: 1.2rem;
	  bottom: 4.2rem;
	 /*margin-top: 0.2rem;*/
	}
	.div-item div{
	  /*overflow: auto;*/
	  height: 100%;
	  overflow-y: auto;
      overflow-x: hidden;
      padding-top: 0.1rem;
      padding-left: 0.24rem;
      padding-right: 0.24rem;
	}
	.text-item{padding: .20rem 0;display: block;}

	/* 底部表单 */
	.ph-form{
	  position: fixed;
	  z-index: 666666;
	  left: 0;
	  bottom: 0;
	  height: 4.1rem;
	  width: 100%;
	  background: #fff;
	}
	.form-tip{
	  padding: .17rem .37rem .17rem .7rem;
	  height: .66rem;
	  background: #111;
	  color: #fff;
	  line-height: .33rem;
	  font-size: .24rem;
	  position: relative;
	}
	.form-tip::after{
	  font-size: .24rem;
	  content: '*';
	  color: #f43530;
	  position: absolute;
	  left: .32rem;
	  top: .20rem;
	}
	
	.ph-inputs{
	  height: 2.40rem;
	  padding: 0 .32rem;
	}
	
	.ph-inputs .ph-item-bord::after{
	  content: '';
	  display: block;
	  width: 100%;
	  position: absolute;
	  height: 1px;
	  z-index: 2;
	  left: 0;
	  bottom: 0;
	  background:rgba(221,221,221,1);
	}
	.ph-item{
	  font-size:.27rem;
	  color: #111;
	  position: relative;
	  display: flex;
	  height: 1.2rem;
	  align-items: center;
	}
	.ph-item-c{
	  flex: 1;
	  padding: 0 .2rem;
	}
	.ph-item-r1{
	  font-size:.24rem;
	  color: #fff;
	  height: .52rem;
	  width: 1.62rem;
	  line-height: .52rem;
	  background: #2C8CFF;
	  padding: 0 0rem;
	  border-radius: .04rem;
	  text-align: center;
	}
	.ph-item-r2{
	  font-size:.24rem;
	  color: #fff;
	  height: .52rem;
	  width: 1.62rem;
	  line-height: .52rem;
	  background: #ddd;
	  padding: 0 0rem;
	  border-radius: .04rem;
	  text-align: center;
	}
	.ph-item img
{
	  height: .40rem;
	  width: .40rem;
	}
	.ph-sub{
	  height: 1.40rem;
	  text-align: center;
	  padding: .20rem .32rem 0;
	}
	.ph-btn{
	  background: #dfdfdf;
	  color: #fff;
	  font-size: .36rem;
	  height: .86rem;
	  line-height: .86rem;
	  border-radius: .44rem;
	  border: none;
	  width: 100%;
	
	}
}

</style>