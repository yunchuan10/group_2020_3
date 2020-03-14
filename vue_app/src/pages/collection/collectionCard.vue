<template>
    <div class="answercard_new" v-if="true">
        <v-header :header_title="'答题卡'" v-if="answer_card_show">
				<div class="header_back_cancel" slot="left_back" @click="cardClose()"><span class="header_back_answercard"></span></div>
				<div class="header_right" slot="right_box"></div>
		</v-header>
        <div class="practice_setion pt_82">
			<!-- 内容区 标题 -->
            <div class="practice_h c_padding">
                <h3 class="practice_top_left" v-text="SheetName"></h3>
            </div>

			<!-- 可滚动区域 -->
			<div class="swip_practice" >
				<div class="answercard_single_area">
				<div class="single_area" v-if="typeOptions.singleCheck.length > 0">
	                <h3>单选题</h3>
	                <ul class="clearfix">
	                    <li  v-for="(ele,index) in typeOptions.singleCheck" :key="index"
                        	:class="{checked: ele.swiper_number == index}" @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="typeOptions.Check.length > 0">
	                <h3>多选题</h3>
	                <ul class="clearfix">
	                    <li  v-for="(ele,index) in typeOptions.Check" 
	                    	:class="{checked: ele.swiper_number == index}" :key="index" @click="cardClose(index+typeOptions.singleCheck.length)">{{index+typeOptions.singleCheck.length+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="typeOptions.judge.length > 0">
	                <h3>判断题</h3>
	                <ul class="clearfix">
                        <li v-if="ele.SubjectCategory==9" v-for="(ele,index) in typeOptions.judge" :key="index"
                        	:class="{checked: ele.swiper_number == index}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length)">{{index+typeOptions.singleCheck.length+typeOptions.Check.length+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="typeOptions.completion.length > 0">
	                <h3>填空题</h3>
	                <ul class="clearfix">
                        <li  v-for="(ele,index) in typeOptions.completion" :key="index"
                        	 :class="{checked: ele.swiper_number == index}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="typeOptions.singleQuestions.length > 0">
	                <h3>问答题 </h3>
	                <ul class="clearfix">
                        <li  v-for="(ele,index) in typeOptions.singleQuestions" :key="index"
                        	 :class="{checked: ele.swiper_number == index}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+1}}</li>
	                </ul>
            	</div>

            	<div class="single_area" v-if="typeOptions.interpretation.length > 0">
	                <h3>名词解释</h3>
	                <ul class="clearfix">
                        <li  v-for="(ele,index) in typeOptions.interpretation " :key="index"
                        	 :class="{checked: ele.swiper_number == index}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+1}}</li>
	                </ul>
            	</div>

            	<div class="single_area" v-if="typeOptions.analysis.length > 0">
	                <h3 >案例分析 </h3>
	                <ul class="clearfix">
						<li  v-for="(ele,index) in typeOptions.analysis" :key="index"
                        	 :class="{checked: ele.swiper_number == index}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+1}}</li>
	                </ul>
            	</div>


            	<div class="single_area" v-if="typeOptions.discuss.length > 0">
	                <h3 >论述题 </h3>
	                <ul class="clearfix">
						<li  v-for="(ele,index) in typeOptions.discuss" :key="index"
                        	 :class="{checked: ele.swiper_number == index}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length+1}}</li>
	                </ul>
            	</div>
				</div>
			</div>

	    </div>
	    
       
		
    </div>
</template>
<script>
import { mapGetters} from 'vuex';
import { FilterType } from '../../common/js/dataFilter.js';
export default {
    name: "answer-card",
    props:{
    	answer_card_show:Boolean,
    	SheetName:String
    },
    data(){
        return{
            card_sub_status: 0,
        }
    },
    computed:{
        ...mapGetters(['answercard_collection_error_analysis']),
	    

			typeOptions(){
				return FilterType(this.answercard_collection_error_analysis)
			},
    },
    methods: {
    	
    	//关闭答题卡
    	cardClose( num ){
           this.$emit('showAnswerCard', num);
        },

	     //取消暂停一下
	    closeMask(){
	        //隐藏点击返回时的图层
	       this.card_sub_status = 0;
	    },
    }
}
</script>

<style lang="less" >
	.answercard_new{
        position: fixed;
        z-index: 200;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        background: #f4f4f4;
        box-sizing: border-box;
        padding-top: .9rem;
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

		}

		.practice_setion{
            height: 100%;
            box-sizing: border-box;
            padding-bottom: .98rem;
            padding-top: 0.82rem;
            position: relative;
			.swip_practice{
				width: 102%;
				height: 100%;
				padding: 0 0.3rem;
				overflow:auto;
				.answercard_single_area{padding-right: 0.7rem;}
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
   						    margin-right: 5.5%;
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
		 .practice_hand_exercise{
	        background: rgba(0,0,0,0.7);
	        // opacity: 0.7;
	        position: fixed;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        z-index: 99999;
	        .practice_confirm_exercise{
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
				    .practice_yes {color: #666;;}
				    .practice_no {
				      	/*border-left: 1px solid #cccccc;*/
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
        .practice_h {
            height: .82rem;
            background: #fff;
            font-size: 14px;
            color: #333333;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-sizing: border-box;
            border-bottom: .01rem solid #bbb;
            border-top: .01rem solid #DDDDDD;
            .display(flex);
            justify-content: space-between;
            line-height: .82rem;
            .practice_top_left{
                font-size: 0.28rem;
                line-height: .83rem;
                max-width: 82%;
                .ellipsis()
            }
            .practice_top_right{
                font-size: 0.16rem;
                line-height: .83rem;
                .current_num{
                    color: #2C8CFF;
                }
            }
        }
	}

</style>