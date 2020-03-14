<template>
    <div class="answercard" v-if="answercard_new_exercise_analysis.SheetId">
	    <v-header v-if="!analytical_answer_card" :header_title="'答题卡'" >
			<div class="header_back_cancel" slot="left_back" @click="close()"><span class="header_back_answercard"></span></div>
		<div class="header_right" slot="right_box"></div>
		</v-header>
        <div class="practice_setion pt_82">
			<!-- 内容区 标题 -->
            <div class="practice_h c_padding">
                <h3 class="practice_top_left" v-text="answercard_new_exercise_analysis.SheetName"></h3>
            </div>
        	<!-- 答对题目+正确率 -->
			<div class="test_paper" v-show="analytical_answer_card">
				<div class="right_subject">
					<div class="right_subject_sum">{{isSubjects.correctNumber}}</div>
					<div>答对(题)</div>
				</div>
				<div class="subject_border"></div>
				<div class="right_subject"> 
					<div class="right_subject_sum">{{isSubjects.accuracyRate}}<span>%</span></div>
					<div>正确率</div>
				</div>
			</div>
			<!-- 可滚动区域 -->
			<div class="swip_practice">
				<div class="answercard_single_area">
            	<div class="single_area" v-if="isSubjects.isSubject1">
	                <h3>单选题</h3>
	                <ul class="clearfix">
	                    <li v-if="ele.SubjectCategory==1" v-for="(ele,index) in answercard_new_exercise_analysis.Subjects" :key="index"
                        :class="{checked: ele.State  == true}" @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="isSubjects.isSubject2">
	                <h3>多选题</h3>
	                <ul class="clearfix">
	                    <li v-if="ele.SubjectCategory==2" v-for="(ele,index) in answercard_new_exercise_analysis.Subjects" 
	                    	:class="{checked: ele.State  == true}" :key="index" @click="cardClose(index)">{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="isSubjects.isSubject9">
	                <h3>判断题</h3>
	                <ul class="clearfix">
                        <li v-if="ele.SubjectCategory==9" v-for="(ele,index) in answercard_new_exercise_analysis.Subjects" :key="index"
                        :class="{checked: ele.State  == true}" @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="isSubjects.isSubject6">
	                <h3>填空题</h3>
	                <ul class="clearfix">
                        <li v-if="ele.SubjectCategory==6" v-for="(ele,index) in answercard_new_exercise_analysis.Subjects" :key="index"
                        :class="{checked: ele.State  == true}" @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="isSubjects.isSubject3">
	                <h3>问答题 </h3>
	                <ul class="clearfix">
                        <li v-if="ele.SubjectCategory==3" v-for="(ele,index) in answercard_new_exercise_analysis.Subjects" :key="index"
                        :class="{checked: ele.State  == true}" @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="isSubjects.isSubject7">
	                <h3>名词解释 </h3>
	                <ul class="clearfix">
                        <li v-if="ele.SubjectCategory==7" v-for="(ele,index) in answercard_new_exercise_analysis.Subjects" :key="index"
                        :class="{checked: ele.State  == true}" @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="isSubjects.isSubject10">
	                <h3 >案例分析 </h3>
	                <ul class="clearfix">
						<li v-if="ele.SubjectCategory==10" v-for="(ele,index) in answercard_new_exercise_analysis.Subjects" :key="index"
                        :class="{checked: ele.State  == true}"  @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="isSubjects.isSubject11">
	                <h3 >论述题 </h3>
	                <ul class="clearfix">
						<li v-if="ele.SubjectCategory==11" v-for="(ele,index) in answercard_new_exercise_analysis.Subjects" :key="index"
                        :class="{checked: ele.Score >0}"  @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	</div>
            	<!--暂时处理-->
            	<div style="height: 3.6rem;"></div>
			</div>
	    </div>
	    <!--点击返回时显示-->
        <!--<div class="practice_hand_exercise" v-show="card_sub_status==1" >
            <div class="practice_confirm_exercise">
                <div class="practice_confirm_title">
                    <p class="practice_pp">您还有未答的题目，确定提交？</p>
                </div>
                <div class="practice_no" @click="closeMask()">继续做题</div>
                <div class="practice_yes" @click="submit()">结束练习</div>
            </div>
        </div>-->
    	<!-- 底部查看解析 -->
		<ul class="report_analysis" v-show="analytical_answer_card">
			<li @click="cardClose(0)">查看解析</li>
			<li @click="jumpTest">再做一次</li>
		</ul>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { subHomework } from '../../api'
export default {
    name: "answer-card",
	props: {
    	analytical_answer_card: Boolean,
    	answer_card_show:Boolean
    },
    data(){
        return{
            card_sub_status: 0,
        }
    },

    computed:{

        ...mapGetters(['answercard_new_exercise_analysis']),
        isSubjects(){
        	//Subject_Score 这道题分数     // Score 我获得的分数
   			let _arr = this.answercard_new_exercise_analysis.Subjects;
            let report_list = this.answercard_new_exercise_analysis.Subjects || [];

            let correctNumber ='0';  // 正确题目个数
        	_arr.map( obj => {
    			let State = false;
    			// 单选题和多选题
    		  	if(obj.SubjectCategory == 1 || obj.SubjectCategory == 2 || obj.SubjectCategory == 9 ){
    		  		if(obj.Score == obj.Subject_Score && obj.Score !=''){
    		  			State = true;
    		  			correctNumber =parseInt(correctNumber) + parseInt(1);
    		  		}
    		  	}
    		  	// 问答题
    		  	if(obj.SubjectCategory == 3 || obj.SubjectCategory == 6 || obj.SubjectCategory == 7 || obj.SubjectCategory == 10  || obj.SubjectCategory == 11 ){
    		  		if( obj.Score!=0 && obj.Score !='' && obj.Score !=null && obj.Score >parseInt(obj.Subject_Score*0.6)){
    		  			// 我的分数大于总分数的百分60
    		  			State = true;
    		  			correctNumber =parseInt(correctNumber) + parseInt(1);
    		  		}
    		  	}
    		  	obj.State = State;
            });
            
            let arrLength  = _arr.length || '';   // 题目总个数
            // 正确率
            let accuracyRate = parseInt(correctNumber/arrLength * 100 );  

            const isSubject1 = _arr.some( o => (o.SubjectCategory==1) );
            const isSubject2 = _arr.some( o => (o.SubjectCategory==2) );
            const isSubject3 = _arr.some( o => (o.SubjectCategory==3) );
            const isSubject4 = _arr.some( o => (o.SubjectCategory==4) );
            const isSubject5 = _arr.some( o => (o.SubjectCategory==5) );
            const isSubject6 = _arr.some( o => (o.SubjectCategory==6) );
            const isSubject7 = _arr.some( o => (o.SubjectCategory==7) );
            const isSubject8 = _arr.some( o => (o.SubjectCategory==8) );
            const isSubject9 = _arr.some( o => (o.SubjectCategory==9) );
            const isSubject10 = _arr.some( o => (o.SubjectCategory==10) );
            const isSubject11 = _arr.some( o => (o.SubjectCategory==11) );
            return { isSubject1, isSubject2, isSubject3, isSubject4, isSubject5, isSubject6, isSubject7, isSubject8, isSubject9, isSubject10, isSubject11,report_list,accuracyRate,correctNumber};
        },
    },
    methods: {
	    // 再做一次试卷
	    jumpTest(index){
			   this.$router.push({  //核心语句
			        path:'/new-exercises',   //跳转的路径
			        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			          sheetId:this.$route.query.sheetId,  
			          StudentId:this.$route.query.StudentId,
			          tryAgin:1
			        }
		       })
			   
	    },
		//页面回退
		back(){
//			this.$router.go(-1);
			//判断设备是ios还是Android
	            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	                 //原声返回
                	window.webkit.messageHandlers.backAct.postMessage(null);
	            } else if (/(Android)/i.test(navigator.userAgent)) {
	            	javascript:onKeyBackPressed.onKeyBackPressed(true);
	            } else { 
	            
	            };
		},
		//关闭答题卡
		cardClose( num ){
	        this.$emit('showAnswerCard', num);
//	        this.analytical_answer_card = true;
	   },
	   // 关闭答题卡
	   close(){
	   	 this.$emit('answershowAnswer');
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
	.report_analysis{
		height: .98rem;
		line-height: .98rem;
		width: 100%;
		position: fixed;
		bottom: 0;
		background: #2C8CFF;
		font-size: .36rem;
		color: #fff;
		li{
			float: left;
			width: 3.725rem;
			text-align: center;
		}
		li:first-child{
			background: #28C89F;
		}
	}
	.answercard{
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
            /*padding-bottom: .98rem;*/
            padding-top: 0.82rem;
            position: relative;
			.swip_practice{
				width: 102%;
				height: 100%;
				padding: 0.3rem;
				padding-bottom: 1rem;
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
							border: 1px solid #FE5B59;
							text-align: center;
							border-radius: 50%;
							line-height: .68rem;
							color: #fff;
							margin-right: 0.2rem;
							margin-left: 0.22rem;
							margin-bottom: 0.6rem;
								&.checked{
									color: #fff;
									background: #28C89F;
									border: 1px solid #28C89F;
								}
							}
					}
				}
			}
			/*试卷报告*/
			.test_paper{
				height: 2.57rem;
				height: 1.67rem;
				padding: 0 0.3rem;
				background: #fff;
				margin-bottom:.2rem;
				.right_subject{
					float: left; width: 49.8%; text-align: center;color: #333; font-size: .28rem; margin-top: .2rem;
					.right_subject_sum{
						font-size:.8rem; color: #2C8CFF;
						span{
							font-size: .48rem;
							display: inline-block;
						}
					}
				}
				.subject_border{
					height: .88rem; width:1px; float: left; background: #ddd; margin-top: .42rem;
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
	        z-index: 999;
	        .practice_confirm_exercise{
	            width: 4.5rem;
	            height: 2.5rem;
	            background: #fff;
	            font-size: 0.28rem;
	            color: #000000;
	            text-align: center;
	            border-radius: 0.2rem;
	            border-bottom: 1px solid #cccccc;
	            position: fixed;
	            top: 50%;
	            left: 50%;
	            margin-top: -1.25rem;
	            margin-left: -2.25rem;
	            .practice_confirm_title{
	                height: 1.7rem;
	                line-height: 0.48rem;
	                .practice_pp{
	                    padding-top: 0.47rem;
	                }
	            }
	            .practice_yes{
	                color: #fc6668;
	                float: left;
	                width: 50%;
	                height: 0.78rem;
	                line-height: 0.78rem;
	                border-top: 1px solid #cccccc;
	            }
	            .practice_no{
	                color: #0081e6;
	                float: left;
	                width: 49%;
	                height: 0.78rem;
	                line-height: 0.78rem;
	                border-top: 1px solid #cccccc;
	                border-right: 1px solid #cccccc;
	            }
	        }
        }

	    /*--正在提交--start--*/
		.toast_test {
	        width: 2rem;
	        height: 1.35rem;
	        padding-top: 0.65rem;
	        background: rgba(0, 0, 0, 0.8);
	        font-size: 0.28rem;
	        color: #fff;
	        text-align: center;
	        border-radius: 0.2rem;
	        border-bottom: 1px solid #cccccc;
	        position: fixed;
	        top: 50%;
	        left: 50%;
	        margin-top: -1.25rem;
	        margin-left: -1.25rem;
	        z-index: 9999;
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
            border-bottom: .01rem solid #ddd;
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

	.answercard{
		height: 100%;
		.practice_setion{
			height: 100%;
			.swip_practice{
				height:100%;
				padding: 0 0.3rem;
				overflow:auto;
				background:#FFFFFF;
				.single_area{
					overflow: hidden;
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
							border: 1px solid #FE5B59;
							text-align: center;
							border-radius: 50%;
							line-height: .68rem;
							background: #FE5B59;
							color: #fff;
							margin-left: 4%;
    						margin-right: 5%;
							margin-bottom: 0.6rem;
								&.checked{
									color: #fff;
									background: #28C89F;
									border: 1px solid #28C89F;
								}
							}
					}
				}
			}
		}

	}
</style>