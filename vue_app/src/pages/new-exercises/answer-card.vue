<template>
    <div class="answercard_new" v-if="answercard_new_exercise.Sheet_Id">
        <v-header :header_title="'答题卡'" v-if="!answer_card_show">
				<div class="header_back_cancel" slot="left_back" @click="cardClose()"><span class="header_back_answercard"></span></div>
				<div class="header_right" slot="right_box"></div>
		</v-header>
        <div class="practice_setion pt_82">
			<!-- 内容区 标题 -->
            <div class="practice_h c_padding">
                <h3 class="practice_top_left" v-text="answercard_new_exercise.SheetName"></h3>
            </div>

			<!-- 可滚动区域 -->
			<div class="swip_practice" >
				<div class="answercard_single_area">
				<div class="single_area" v-if="typeOptions.singleCheck.length > 0">
	                <h3>单选题</h3>
	                <ul class="clearfix">
	                    <li  v-for="(ele,index) in typeOptions.singleCheck" :key="index"
                        :class="{checked: ele.Answer||ele.SubjectRecordSAnswerOptions.length>0||ele.AnswerOptionExtendeds.length>0}" @click="cardClose(index)"
                        >{{index+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="typeOptions.Check.length > 0">
	                <h3>多选题</h3>
	                <ul class="clearfix">
	                    <li  v-for="(ele,index) in typeOptions.Check" :class="{checked: ele.Answer||ele.SubjectRecordSAnswerOptions.length>0||ele.AnswerOptionExtendeds.length>0}" :key="index" @click="cardClose(index+typeOptions.singleCheck.length)">{{index+typeOptions.singleCheck.length+1}}</li>
	                </ul>
            	</div>
            	
            	<div class="single_area" v-if="typeOptions.judge.length > 0">
	                <h3>判断题</h3>
	                <ul class="clearfix">
                        <li v-if="ele.SubjectCategory==9" v-for="(ele,index) in typeOptions.judge" :key="index"
                        :class="{checked: ele.Answer||ele.SubjectRecordSAnswerOptions.length>0||ele.AnswerOptionExtendeds.length>0}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length)">{{index+typeOptions.singleCheck.length+typeOptions.Check.length+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="typeOptions.completion.length > 0">
	                <h3>填空题</h3>
	                <ul class="clearfix">
                        <li  v-for="(ele,index) in typeOptions.completion" :key="index"
                        :class="{checked: ele.Answer||ele.SubjectRecordSAnswerOptions.length>0||ele.AnswerOptionExtendeds.length>0}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+1}}</li>
	                </ul>
            	</div>
            	<div class="single_area" v-if="typeOptions.singleQuestions.length > 0">
	                <h3>问答题 </h3>
	                <ul class="clearfix">
                        <li  v-for="(ele,index) in typeOptions.singleQuestions" :key="index"
                        :class="{checked: ele.Answer||ele.SubjectRecordSAnswerOptions.length>0||ele.AnswerOptionExtendeds.length>0}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+1}}</li>
	                </ul>
            	</div>

            	<div class="single_area" v-if="typeOptions.interpretation.length > 0">
	                <h3>名词解释</h3>
	                <ul class="clearfix">
                        <li  v-for="(ele,index) in typeOptions.interpretation " :key="index"
                        :class="{checked: ele.Answer||ele.SubjectRecordSAnswerOptions.length>0||ele.AnswerOptionExtendeds.length>0}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+1}}</li>
	                </ul>
            	</div>

            	<div class="single_area" v-if="typeOptions.analysis.length > 0">
	                <h3 >案例分析 </h3>
	                <ul class="clearfix">
						<li  v-for="(ele,index) in typeOptions.analysis" :key="index"
                        :class="{checked: ele.Answer||ele.SubjectRecordSAnswerOptions.length>0||ele.AnswerOptionExtendeds.length>0}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+1}}</li>
	                </ul>
            	</div>


            	<div class="single_area" v-if="typeOptions.discuss.length > 0">
	                <h3 >论述题 </h3>
	                <ul class="clearfix">
						<li  v-for="(ele,index) in typeOptions.discuss" :key="index"
                        :class="{checked: ele.Answer||ele.SubjectRecordSAnswerOptions.length>0||ele.AnswerOptionExtendeds.length>0}" @click="cardClose(index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length)"
                        >{{index+typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length+1}}</li>
	                </ul>
            	</div>
				</div>
			</div>

	    </div>
	    <div class="submit" @click="card_sub">提交并查看解析</div>
	    <!--点击返回时显示-->
        <div class="practice_hand_exercise" v-show="card_sub_status==1" >
            <div class="practice_confirm_exercise">
                <div class="practice_confirm_title">
                    <p class="practice_pp">你还有试题未完成，是否提交？</p>
                </div>
                <div class="confirm_btns">
                	<div class="practice_no" @click="closeMask()">取消</div>
                	<div class="practice_yes_a" @click="submits()">提交</div>
                </div>
            </div>
        </div>
        <!--正在交卷retreat-->
        <div v-show="card_sub_status==2" class="toast_test">
        	正在提交..
        </div>
		<!--正在交卷retreat-->
	    <div v-if="retreat_sub" ref="retreat_error" class="toast_test">
	        	
	    </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { FilterType } from '../../common/js/dataFilter.js';
import { subHomework } from '../../api'
export default {
    name: "answer-card",
    props:{
    	tryGo:Boolean,
    	Examination_Id:String
    },
    data(){
        return{
            card_sub_status: 0,
            answer_card_show: false,
            retreat_sub:false,
            answer_boolean:false
        }
    },
    computed:{
        ...mapGetters(['answercard_new_exercise']),
        ...mapState(['studentId','new_exercises_data_submint']),
	    

			typeOptions(){
				return FilterType(this.answercard_new_exercise)
			},
	    
	    
	    
    },
    methods: {
    	//提交时是否显示题目未做完提示框
    	card_sub(){
    		let obj = this.answercard_new_exercise||{};
    		let _arr_count = obj.SubjectRecords ||[];
    		let count=0;
    		for(var i=0;i<_arr_count.length;i++){
    			if(_arr_count[i].Answer||_arr_count[i].SubjectRecordSAnswerOptions.length>0||_arr_count[i].AnswerOptionExtendeds.length>0){
    				count++
    			}

    		}
    		if(count < _arr_count.length){//题目是否全部做完  没有则显示提示框
    			//隐藏点击返回时的图层
	      		 this.card_sub_status = 1;
    		}else{
    			this.submits();
    		}
    	},
    	//关闭答题卡
    	cardClose( num ){
            this.$emit('showAnswerCard', num);
        },

	    //结束考试(提交)
	    submits(){
            this.$store.commit('setNewExercisesState', {name: 'State', value: 1}); // 提交状态
            this.card_sub_status = 2;  //正在提交...
            //最后确认时间
            let ReviewTime = this.$moment().format('YYYY-MM-DD h:mm:ss');
            //let reseve_obj = {...this.answercard_new_exercise};//因为是getters方法获取故不能操作用下一行的state字段代替
            let reseve_obj = {...this.new_exercises_data_submint};
            reseve_obj.LastReviewTime = ReviewTime;
            reseve_obj.StudentId = this.$route.query.StudentId || '';
            reseve_obj.State = 1;
//          let ExaminationId = '63300189-2de0-44d6-864c-fe62f8ea8a2e'||this.$route.query.ExaminationId;
            let ExaminationId = this.$route.query.ExaminationId|| this.Examination_Id ||'';
            let sub_obj = {
            	data:reseve_obj,
            	type:"post"
            };
            //判断是否保存过调用不同接口
            if( this.tryGo ){//没有临时保存过使用post
            	//循环遍历只留下答题项
//	            for(var i = reseve_obj.SubjectRecords.length -1;i>=0;i--){//倒序循环防止index改变
//	            	let subjectRecord = reseve_obj.SubjectRecords[i]||{};
//	            	//填空题
//	            	if(subjectRecord.SubjectCategory == 6){
//	            		if(!subjectRecord.AnswerOptionExtendeds.length){
//	            			reseve_obj.SubjectRecords.splice(i,1);
//	            		}
//	            	}
//	//          	//单选 多选 判断
//	            	if(subjectRecord.SubjectCategory == 1 || subjectRecord.SubjectCategory == 2 || subjectRecord.SubjectCategory == 9){
//	            		if(!subjectRecord.SubjectRecordSAnswerOptions.length){
//	            			reseve_obj.SubjectRecords.splice(i,1);
//	            		}
//	            	}
//	////          	//问答题  上机题  项目题 名词解释 案例分析
//	            	if(subjectRecord.SubjectCategory == 3 || subjectRecord.SubjectCategory == 4 || subjectRecord.SubjectCategory == 5 || subjectRecord.SubjectCategory == 7 || subjectRecord.SubjectCategory == 10 || subjectRecord.SubjectCategory == 11 || subjectRecord.SubjectCategory == 8){
//	            		if(!subjectRecord.Answer){
//	            			reseve_obj.SubjectRecords.splice(i,1);
//	            		}
//	            	}
//	            }
            	
            	
            	let { StudentId,Sheet_Id,EndTime,State,SubjectRecords,SubjectIdLocation } = reseve_obj;
            	let reseve_obj_try = {ExaminationId,StudentId,Sheet_Id,EndTime,State,SubjectRecords,SubjectIdLocation};
            	sub_obj = {
	            	data: reseve_obj_try,
	            	type: "put"
	            }
           }
            console.log(sub_obj);
            subHomework(sub_obj).then(res=>{
            	if(res.statusCode == 200){
            		//提交成功 则关闭提示框
            		this.card_sub_status = 0;
            		
            		//子组件向父组件传值
            		this.$emit('callBackParent',true);
            		/*跳转给解析页面  临时暂用*/
            		//页面跳转
					 this.$router.push({  //核心语句
				        path:'/testReport',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          sheetId:this.$route.query.sheetId || '' ,
				          StudentId:this.$route.query.StudentId || '' ,
				          
				        }
				      })
					 
            	}else{
					this.$refs.retreat_error.innerHTML = '网络错误'
					//子组件向父组件传值
            		this.$emit('callBackParent',false);
	        		setTimeout(()=>{
	        			this.retreat_sub= false;
	        		},1500);
                }
                this.card_sub_status = 0;
            }).catch( err => {

            })
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
				    .practice_yes_a {
				    	color: #2C8CFF;
				    	border-left: 1px solid #e5e5e5;
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