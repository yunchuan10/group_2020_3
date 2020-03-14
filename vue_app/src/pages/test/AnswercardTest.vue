<template>
    <div class="answercard_test" >   
        <div v-show="!submitSuc" class="answer_wrap">
	        <v-header :header_title="'答题卡'">
				<div class="header_back_cancel" slot="left_back" @click="close()"><span class="header_back_answercard"></span></div>
				<div class="header_right" slot="right_box"></div>
			</v-header>
	        <div class="practice_setion  pt_82" style="padding-bottom: 0.98rem;">
	        	<div class="practice_wrap" style="height: 100%;">
				<v-content>
					<h3 class="practice_top_left" slot="practice_top_left">{{questions.SheetName}}</h3>
				</v-content>
				<!-- 可滚动区域 -->
				<div class="swip_practice" >
					<div class="single_area">
	                <h3 v-if="typeOptions.singleCheck.length >0">单选题</h3>
	                <!--单选题-->
	                <ul class="clearfix">
	                    <li v-for="(ele,index) in typeOptions.singleCheck" :class="ele.state ?'checked': ''" :key="index" @click="jumpBtn(index)">{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area">
	                <h3 v-if="typeOptions.Check.length >0">多选题</h3>
	                 <!--多选题-->
	                <ul class="clearfix">
	                    <li v-for="(ele,index) in typeOptions.Check" :class="ele.state ?'checked': ''" :key="index" @click="jumpBtn(index+typeOptions.singleCheck.length)">{{index+typeOptions.singleCheck.length+1}}</li>
	                </ul>
	            	</div>
	            	<div class="single_area">
		                <h3 v-if="typeOptions.judge.length >0">判断题</h3>
		                 <!--判断题-->
		                <ul class="clearfix">
		                    <li v-for="(ele,index) in typeOptions.judge" :class="ele.state ?'checked': ''" :key="index" @click="jumpBtn(index+typeOptions.singleCheck.length+typeOptions.Check.length)">{{index+typeOptions.singleCheck.length+typeOptions.Check.length+1}}</li>
		                </ul>
	            	</div>
	            	<div class="single_area">
		                <h3 v-if="typeOptions.completion.length >0">填空题</h3>
		                 <!--填空-->
		                <ul class="clearfix">
		                    <li v-for="(ele,index) in typeOptions.completion" :class="ele.state ?'checked': ''" :key="index" @click="jumpBtn(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length)">{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+1}}</li>
		                </ul>
	            	</div>
	            	<div class="single_area">
		                <h3 v-if="typeOptions.singleQuestions.length >0">问答题 </h3>
		                 <!--问答题 -->
		                <ul class="clearfix">
		                    <li v-for="(ele,index) in typeOptions.singleQuestions" :class="ele.state ?'checked': ''" :key="index" @click="jumpBtn(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length)">{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+1}}</li>
		                </ul>
	            	</div>
	            	
	            	<div class="single_area">
		                <h3 v-if="typeOptions.interpretation.length >0">名词解释 </h3>
		                 <!--名词解释 -->
		                <ul class="clearfix">
		                    <li v-for="(ele,index) in typeOptions.interpretation" :class="ele.state ?'checked': ''" :key="index" @click="jumpBtn(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length)">{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+1}}</li>
		                </ul>
	            	</div>
	            	
	            	<div class="single_area">
		                <h3 v-if="typeOptions.analysis.length >0">案例分析 </h3>
		                 <!--案例分析 -->
		                <ul class="clearfix">
		                    <li v-for="(ele,index) in typeOptions.analysis" :class="ele.state ?'checked': ''" :key="index" @click="jumpBtn(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length)">{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+1}}</li>
		                </ul>
	            	</div>
	            	
	            	<div class="single_area">
		                <h3 v-if="typeOptions.discuss.length >0">论述题 </h3>
		                 <!--案例分析 -->
		                <ul class="clearfix">
		                    <li v-for="(ele,index) in typeOptions.discuss" :class="ele.state ?'checked': ''" :key="index" @click="jumpBtn(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length)">{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length+1}}</li>
		                </ul>
	            	</div>
				</div>
				</div>
		    </div>
		    <div class="submit" style="background: #2C8CFF;height: 0.98rem;" @click="submit_mask">提交</div>
		    <!--点击返回时显示-->
	        <div class="practice_hand_test" v-show="isBack" >
	            <div class="practice_confirm_test">
	                <div class="practice_confirm_title">
	                    <p class="practice_pp">你还有试题未完成，是否提交？</p>
	                </div>
	                <div class="confirm_btns">
	                	<div class="practice_yes" @click="closeMask()">取消</div>
		                <div class="practice_no" @click="submit()">提交</div>
		                
	                </div>
	            </div>
	        </div>
	       
	        
	    </div>
	     <!--正在交卷retreat-->
	    <div v-if="retreat_sub" ref="retreat_error" class="toast_test">
	        	正在提交..
	    </div>
	    <submitSuccess 
	      	v-show="submitSuc"
	      	></submitSuccess>
    </div>
</template>
<script>
import Swiper from 'swiper';
import Vue from 'vuex';
//引入封装的ajax
import {Getsubmit} from '../../api'
import { mapState, mapGetters, mapActions } from 'vuex';
import { FilterTypeTest } from '../../common/js/dataFilter.js';
import submitSuccess from './submitSuccess.vue';
export default {
    name: "answercard",
    props:{
        questions:Object,
        show:Function,
        start:Function,
        jump:Function,
        getTime:Function,
        currentNum:Number,
//      submitSuc:Boolean,
    },
    data(){
        return{
        	isBack:false,
        	retreat_sub:false,
        }
    },
    beforecreate(){
    },
    computed:{
    	...mapGetters(['reseve_obj']),
    	...mapState(['submitSuc']),

	    typeOptions(){
			return FilterTypeTest(this.reseve_obj)
		},
	    
    },
    methods: {
    	//关闭答题卡
    	close(){
            this.show(this.currentNum-1)
            this.start()
        },
        //跳转到指定的习题
        jumpBtn(index){
            this.jump(index)
            this.show(index)
            this.start()
        },
        //提交答题卡
        submit_mask(){
        	let num=0;
        	for(var i=0;i<this.reseve_obj.SubjectRecords.length;i++){
        		if(this.reseve_obj.SubjectRecords[i].state){
        			num++
        		}
        	}
        	if(num == this.reseve_obj.SubjectRecords.length){
        		this.submit();
        		return;
        	}else{
        		this.isBack = !this.isBack
        	}
        	
        },
        //取消暂停一下
	    closeMask(){
	        //隐藏点击返回时的图层
	        this.isBack = false;
	    },
	    //结束考试回退按钮(提交)
	    submit_back(){
	        this.retreat_sub= true;
	        this.isBack= false;
	        //学生考试用时 单位   秒
	        let userTime = this.getTime()/60;
	        //记录提交时最后的确认时间
	        let ReviewTime = this.$moment().format('YYYY-MM-DD h:mm:ss');
            this.reseve_obj.LastReviewTime = ReviewTime;
	        let reseve_obj = this.reseve_obj;
	        reseve_obj.StudentId = this.$route.query.UserId || '';
	        console.log(reseve_obj,'考试结束')
	        Getsubmit({
	        	data: reseve_obj,
	        	type:'post'
	        }).then(res =>{
	        	if(res.statusCode == 200){
	        		//提交成功显示提交成功 组件
					this.$store.dispatch('set_submitSuccess',true);
	        		this.retreat_sub= false;
	        		 //判断设备是ios还是Android
		            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		                 //原声返回
	                	window.webkit.messageHandlers.backAct.postMessage(null);
		            } else if (/(Android)/i.test(navigator.userAgent)) {
		            	javascript:onKeyBackPressed.onKeyBackPressed(true);
		            } else { 
		            
		            };
	        	}else{
	        		//提交失败不显示提交成功 组件
					this.$store.dispatch('set_submitSuccess',false);
	        		this.$refs.retreat_error.innerHTML = '网络错误'
	        		setTimeout(()=>{
	        			this.retreat_sub= false;
	        		},1500);
	        		//判断设备是ios还是Android
		            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		                 //原声返回
	                	window.webkit.messageHandlers.backAct.postMessage(null);
		            } else if (/(Android)/i.test(navigator.userAgent)) {
		            	javascript:onKeyBackPressed.onKeyBackPressed(true);
		            } else { 
		            
		            };
	        		
	        	}
	        })
	    }, 
	    //结束考试(提交)
	    submit(){
	        this.retreat_sub= true;
	        this.isBack= false;
	        //学生考试用时 单位   秒
	        let userTime = this.getTime()/60;
	        //记录提交时最后的确认时间
	        let ReviewTime = this.$moment().format('YYYY-MM-DD h:mm:ss');
            this.reseve_obj.LastReviewTime = ReviewTime;
	        let reseve_obj = this.reseve_obj;
			reseve_obj.StudentId = this.$route.query.UserId || '';
	        Getsubmit({
	        	data: reseve_obj,
	        	type:'post'
	        }).then(res =>{
	        	if(res.statusCode == 200){
	        		//提交成功显示提交成功 组件
					this.$store.dispatch('set_submitSuccess',true);
	        		this.retreat_sub= false;
	        	}else{
	        		//提交失败不显示提交成功 组件
					this.$store.dispatch('set_submitSuccess',false);
	        		this.$refs.retreat_error.innerHTML = '网络错误'
	        		setTimeout(()=>{
	        			this.retreat_sub= false;
	        		},1500)
	        		
	        	}
	        })
	    }, 
    },
    beforemount(){},
    mounted(){},
    updated(){},
    components:{
    	submitSuccess
    }
}
</script>

<style lang="less" >
	.answercard_test{
		width: 99.99%;
		/*overflow-x: hidden;*/
		.submit{
			position: fixed;
			bottom: 0;
			height: 0.98rem;
			width: 100%;
			text-align: center;
			line-height: 0.98rem;
			background: #2C8CFF;
			color: #fff;
			font-size: 0.36rem;
			z-index: 9999;
			
		}
		height: 100%;
		.answer_wrap{
			width: 102%;
			height: 100%;
		}
		.practice_setion{
			height: 100%;
			overflow-x: hidden;
			.swip_practice{
				height: 100%;
				padding: 0 0.3rem;
				overflow:auto;
				background:#FFFFFF;
				padding-bottom:0.49rem;
				.single_area{
					h3{
						font-size: .28rem;
						padding:.2rem  0 .4rem 0;
						color: #999;
					}
					.clearfix{
						.display(flex);
						flex-wrap:wrap;
						li{
							width: .68rem;
							height: .68rem;
							border: 1px solid #ddd;
							text-align: center;
							border-radius: 50%;
							line-height: .68rem;
							color: #2C8CFF;
							margin-left: 4%;
   						    margin-right: 5%;
							margin-bottom: 0.6rem;
								&.checked{
									color: #fff;
									background: #2C8CFF;
									border: 1px solid #2C8CFF;
								}
							}
					}
				}
			}
		}
		 /*-- 回退按钮 弹出层  start---*/
		 .practice_hand_test{
	        background: rgba(0,0,0,0.6);
	        // opacity: 0.7;
	        position: fixed;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        z-index: 99999;
	        .practice_confirm_test{
	           text-align: center;
			    position: absolute;
			    left: 50%;
			    top: 50%;
			    z-index: 501;
			    transform: translate(-50%, -50%);
			    width: 75%;
			    background: #fff;
			    border-radius: 5px;
	            .practice_confirm_title{
	            	.practice_pp{
	            		  font-size: 0.32rem;
					      color: #333333;
					      line-height: 0.44rem;
					      padding: 0.6rem 0.5rem;
	            	}
	                 
	            }
	            .confirm_btns{
	            	 border-top: 1px solid #e5e5e5;
				      height: 1rem;
				      line-height: 1rem;
				      font-size: 0.32rem;
				      text-align: center;
				      color: #666666;
				      .display(flex);
				      div {
				        width: 50%;
				        height: 100%;
				        position: relative;
				      }
				    .practice_yes {
				    	color: #2C8CFF;
				    	border-right: 1px solid #e5e5e5;
				    }
				    .practice_no {
				        color: #2C8CFF;
				        span {
				          position: absolute;
				          z-index: 2;
				          left: 0;
				          top: 0;
				          width: 1px;
				          height: 100%;
				          background: #e5e5e5;
				        }
				      }
	            }
	            
	        }
	    }
	 /*---回退按钮 弹出层   end---*/
	/*--正在提交--start--*/
		.toast_test {
	        width: 2.12rem;
	        /*height: 1.35rem;*/
	        height: 0.92rem;
	        line-height: 0.92rem;
	        background: #313131;
	        font-size: 0.32rem;
	        color: #fff;
	        text-align: center;
	        border-radius: 0.08rem;
	        border-bottom: 1px solid #cccccc;
	        position: fixed;
	        top: 50%;
	        left: 50%;
	        transform: translate(-50%,-50%);
	        z-index: 999999;
	    }
		/*--正在提交--end--*/
	}
	
</style>