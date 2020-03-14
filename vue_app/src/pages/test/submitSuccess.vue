<template>
    <div class="answercard_submitSuccess" >   
        <v-header :header_title="''" >
			
		</v-header>
        <div class="practice_setion pt_82 submit_success">
			
			<!-- 可滚动区域 -->
			<div class="swip_practice" >
				<div class="submitSucess">
					<div class="submitSucess_img"></div>
					<div class="submitSucess_content">
						<h3>提交成功</h3>
						<p>请您耐心等待，老师正在批阅中…</p>
					</div>
					<div class="submitSucess_button" @click="goHome()">
						返回首页
					</div>
				</div>
			</div>
			
	    </div>
	    
    </div>
</template>
<script>
export default {
    name: "submitSuccess",
    props: {},
    data(){
        return{}
    },
    beforecreate(){
    },
    computed:{},
    methods: {
    	goHome(){
    		    //判断设备是ios还是Android
		            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		                 //原声返回
	                	window.webkit.messageHandlers.backAct.postMessage(null);
		            } else if (/(Android)/i.test(navigator.userAgent)) {
		            	javascript:onKeyBackPressed.onKeyBackPressed(true);
		            } else { 
		            
		            };
    		    //点击跳回首页
//  		    this.$router.push({path: '/'});
    	}
    },
    beforemount(){},
    mounted(){},
    updated(){}
}
</script>

<style lang="less" >
	.answercard_submitSuccess{
		height: 100%;
		.submit_success{
				padding-top:0!important
			}
		.practice_setion{
			/*height: 100%;*/
			.swip_practice{
				/*height: 100%;*/
				padding: 0 0.3rem;
				padding-top: 0.82rem;
				.submitSucess{
					.display(flex);
					flex-direction: column;
					padding-bottom: 1.02rem;
					.submitSucess_button{
						width: 3rem;
						height: .88rem;
						border-radius: .44rem;
						text-align: center;
						line-height: .88rem;
						color: #fff;
						font-size: .28rem;
						background: #2C8CFF;
						align-self: center;
						
					}
					.submitSucess_content{
						margin-top: 0.48rem;
						margin-bottom: 0.6rem;
						h3{
							font-size:0.36rem ;
							color:#666 ;
							text-align: center;
							margin-bottom: 0.24rem;
						}
						p{
							font-size:0.28rem ;
							color:#999 ;
							text-align: center;
						}
					}
					.submitSucess_img{
						width:1.36rem ;
						height:1.66rem ;
						background: url(../../common/imgs/success.png) no-repeat center;
						background-size: contain;
						align-self: center;
					}
				}
				
			}
			
		}
	}
</style>