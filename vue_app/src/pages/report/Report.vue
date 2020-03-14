<template>
	<div class="practice_c_report check_contain" >
		<!-- 顶部 -->
		<v-header :header_title="analytical_answer_card?'试卷报告':'答题卡'" >
			<div v-if="analytical_answer_card == true" class="header_back" slot="left_back" @click="back();"><span class="header_back_span"></span></div>
			<div v-if="analytical_answer_card == false" class="header_back_cancel" slot="left_back" @click="close()"><span class="header_back_answercard"></span></div>
			<div class="header_right" slot="right_box">
			</div>
		</v-header>

		<!-- 内容区域 -->
		<div class="practice_setions pt_82">
			<!-- 内容标题 -->
			<v-content>
				<h3 class="practice_top_left" slot="practice_top_left">{{report_data.SheetName}}</h3>
			</v-content>
			<!-- 具体内容 -->
			<div class="swip_practice swip_practice_wrap">
				<div class="answercard_single_area">
				<!-- 用时和分数 -->
				<div class="test_paper" v-show="analytical_answer_card">
					<div class="test_time">用时：{{report_data.GetTime}}</div>
					<div class="test_fraction">
						{{report_data.GetScore}}<span>分</span>
					</div>
				</div>
				<!-- 可滚动区域 -->
				<div class="swip_practice ">
					
					<!--单选题-->
		  			  <div class="single_area">
		                  <h3 v-if="reseve_list_singleCheck.length >0">单选题</h3>
		                  <ul class="clearfix">
		                      <li v-for="(ele,index) in reseve_list_singleCheck" :class="ele.State ?'': 'clearfix_red'" :key="index" @click="jumpBtn(index)">{{index+1}}</li>
		                  </ul>
		              </div>
		              <!--多选题-->
		              <div class="single_area">
		                  <h3 v-if="reseve_list_Check.length >0">多选题</h3>
		                  <ul class="clearfix">
		                      <li v-for="(ele,index) in reseve_list_Check" :class="ele.State ?'': 'clearfix_red'" :key="index" @click="jumpBtn(index+reseve_list_singleCheck.length)">{{index+reseve_list_singleCheck.length+1}}</li>
		                  </ul>
		              </div>
		              <div class="single_area">
		                  <h3 v-if="reseve_list_judge.length >0">判断题</h3>
		                   <!--判断题-->
		                  <ul class="clearfix">
		                      <li v-for="(ele,index) in reseve_list_judge"  :class="ele.State ?'': 'clearfix_red'" :key="index" @click="jumpBtn(index+reseve_list_singleCheck.length+reseve_list_Check.length)">{{index+reseve_list_singleCheck.length+reseve_list_Check.length+1}}</li>
		                  </ul>
		              </div>
		              <div class="single_area">
		                  <h3 v-if="reseve_list_completion.length >0">填空题</h3>
		                   <!--填空-->
		                  <ul class="clearfix">
		                      <li v-for="(ele,index) in reseve_list_completion"  :class="ele.State ?'': 'clearfix_red'" :key="index" @click="jumpBtn(index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length)">{{index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+1}}</li>
		                  </ul>
		              </div>
		              
		              <div class="single_area">
		                  <h3 v-if="reseve_list_singleQuestions.length >0">问答题 </h3>
		                   <!--问答题 -->
		                  <ul class="clearfix">
		                      <li v-for="(ele,index) in reseve_list_singleQuestions"  :class="ele.State ?'': 'clearfix_red'" :key="index" @click="jumpBtn(index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length)">{{index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+1}}</li>
		                  </ul>
		              </div>
		              
		              <div class="single_area">
		                  <h3 v-if="reseve_list_interpretation.length >0">名词解释 </h3>
		                   <!--名词解释 -->
		                  <ul class="clearfix">
		                      <li v-for="(ele,index) in reseve_list_interpretation"  :class="ele.State ?'': 'clearfix_red'" :key="index" @click="jumpBtn(index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length)">{{index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+1}}</li>
		                  </ul>
		              </div>
		              
		              <div class="single_area">
		                  <h3 v-if="reseve_list_analysis.length >0">案例分析 </h3>
		                   <!--案例分析 -->
		                  <ul class="clearfix">
		                      <li v-for="(ele,index) in reseve_list_analysis"  :class="ele.State ?'': 'clearfix_red'" :key="index" @click="jumpBtn(index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length)">{{index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length+1}}</li>
		                  </ul>
		              </div>
		              
		              <div class="single_area">
		                  <h3 v-if="reseve_list_discuss.length >0">论述题 </h3>
		                   <!--案例分析 -->
		                  <ul class="clearfix">
		                      <li v-for="(ele,index) in reseve_list_discuss"  :class="ele.State ?'': 'clearfix_red'" :key="index" @click="jumpBtn(index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length+reseve_list_discuss.length)">{{index+reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length+reseve_list_discuss.length+1}}</li>
		                  </ul>
		              </div>
	            </div>
				</div>
			</div>
		</div>
		<!-- 底部查看解析 -->
		<ul class="report_analysis" v-show="analytical_answer_card">
			<li @click="jumpBtn(0)">查看解析</li>
			<li @click="jumpTest">再做一次</li>
		</ul>
	</div>
</template>
<script>
import Swiper from 'swiper';
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
	    name: "practice_c",
	    props: {
	    	analytical_answer_card: Boolean,
	        show:Function,
	        jump:Function,
	        currentNum:Number,
	        userId:String,
	    },
    	data(){
    		return {
		        data:{},
		        title:'试卷报告',
    		}
    	},

        created() {
//			this.data.SheetId = '236e240f-c90d-4681-b4b3-9843d85653cf';
//			this.data.ExamId = '39b6f308-3207-44ef-a417-973d9ba07b51';
//			//页面加载时  自动调用此方法
//			this.getMessageresult();   
		},
		
        mounted(){},      
		methods: {
			//actions 中方法
			...mapActions([
		      'loadingGetTest_result'
		    ]),
		    //关闭答题卡
	    	close(){
	            this.show(this.currentNum-1)
//	            this.start()
	        },

		    // 再做一次试卷
		    jumpTest(index){
			   this.$router.push({  //核心语句
			        path:'/test',   //跳转的路径
			        query:{         //路由传参时push和query搭配使用 ，作用时传递参数
			          id:this.$route.query.id, 

			          UserId:this.$route.query.UserId || '',  
			          

			        }
		       })
		    },
			//页面加载时调用
//			getMessageresult () {
//				// this.loadingGetTest_result(this.data)
//			},
			//跳转到指定的习题
	        jumpBtn(index){
	            this.jump(index)
	            this.show(index)
       		 },
			//页面回退
			back(){
//				this.$router.go(-1);
				//判断设备是ios还是Android
		            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		                 //原声返回
	                	window.webkit.messageHandlers.backAct.postMessage(null);
		            } else if (/(Android)/i.test(navigator.userAgent)) {
		            	javascript:onKeyBackPressed.onKeyBackPressed(true);
		            } else { 
		            
		            };
			}
		},
        computed:{
        	...mapState(['report_data']),
        	// 数据选项
        	report_list(){
	        	let report_list = this.report_data._SubjectList || []  // 题目详情
	    		report_list.map( obj => {
	    			let State = false;
	    		  	if(obj.SubjectCategory == 1 || obj.SubjectCategory == 2 || obj.SubjectCategory == 9 ){
	    		  		if(obj._StudentAnswer.length){
	    		  		if(obj.Score == obj._StudentAnswer[0].StudentScore && obj._StudentAnswer[0].StudentScore!=0 &&obj._StudentAnswer[0].StudentScore!=''){
	    		  			State = true;
	    		  		}
	    		  		}
	    		  	}
	    		  	if(obj.SubjectCategory == 3 || obj.SubjectCategory == 6 || obj.SubjectCategory == 7 || obj.SubjectCategory == 10  || obj.SubjectCategory == 11 ){
	    		  		if(obj._StudentAnswer.length){
	    		  		if(obj._StudentAnswer[0].StudentScore!=0 && obj._StudentAnswer[0].StudentScore!='' && obj._StudentAnswer[0].StudentScore >= parseInt(obj.Score*0.6)){
	    		  			
	    		  			State = true;
	    		  		}
	    		  		}
	    		  	}
	    		  	obj.State = State;
	            });
	            return report_list || [];
        	},
        	 //单选题
		    reseve_list_singleCheck () {
		    	let _arr_2 = [],singleCheck=[];
			    _arr_2 = this.report_list || [];
			    for(var i=0;i<_arr_2.length;i++){
			    	if(_arr_2[i].SubjectCategory == 1 ){
			    		singleCheck.push(_arr_2[i])
			    	}
			    }
				return singleCheck;
		    },
		    
		    //多选题
		    reseve_list_Check () {
		    	let _arr_3 = [],Check=[];
			    _arr_3 = this.report_list || [];
			    for(var i=0;i<_arr_3.length;i++){
			    	if(_arr_3[i].SubjectCategory == 2 ){
			    		Check.push(_arr_3[i])
			    	}
			    }
				return Check;
		    },
		    
		    //简答题
		    reseve_list_singleQuestions () {
		    	let _arr_4 = [],singleQuestions=[];
			    
			    _arr_4 = this.report_list || [];
			    for(var i=0;i<_arr_4.length;i++){
			    	if(_arr_4[i].SubjectCategory == 3 ){
			    		singleQuestions.push(_arr_4[i])
			    	}
			    }
				return singleQuestions;
		    },
		    //简答题
		    reseve_list_shortAnswer () {
		    	let _arr_5 = [],shortAnswer=[];
			    
			    _arr_5 = this.report_list || [];
			    for(var i=0;i<_arr_5.length;i++){
			    	if(_arr_5[i].SubjectCategory == 4 ){
			    		shortAnswer.push(_arr_5[i])
			    	}
			    }
				return shortAnswer;
		    },
		    //填空题
		    reseve_list_completion (state) {
		    	let _arr_6 = [],completion=[];
			   	
			    _arr_6 = this.report_list || [];
			    for(var i=0;i<_arr_6.length;i++){
			    	if(_arr_6[i].SubjectCategory == 6 ){
			    		completion.push(_arr_6[i])
			    	}
			    }
				return completion;
		    },
	    	//判断题
	    	reseve_list_judge (state) {
		    	let _arr_7 = [],judge=[];
			   	
			    _arr_7 = this.report_list || [];
			    for(var i=0;i<_arr_7.length;i++){
			    	if(_arr_7[i].SubjectCategory == 9 ){
			    		judge.push(_arr_7[i])
			    	}
			    }
				return judge;
		    },
	    	//名词解释
	    	reseve_list_interpretation (state) {
		    	let _arr_8 = [],interpretation=[];
			   	
			    _arr_8 = this.report_list || [];
			    for(var i=0;i<_arr_8.length;i++){
			    	if(_arr_8[i].SubjectCategory == 7 ){
			    		interpretation.push(_arr_8[i])
			    	}
			    }
				return interpretation;
		    },
		    //案例分析
		    reseve_list_analysis (state) {
		    	let _arr_9 = [],analysis=[];
			    
			    _arr_9 = this.report_list || [];
			    for(var i=0;i<_arr_9.length;i++){
			    	if(_arr_9[i].SubjectCategory == 10 ){
			    		analysis.push(_arr_9[i])
			    	}
			    }
				return analysis;
		    },
	    	//论述题
		     reseve_list_discuss (state) {
		    	let _arr_11 = [],discuss=[];
			    
			    _arr_11 = this.report_list || [];
			    for(var i=0;i<_arr_11.length;i++){
			    	if(_arr_11[i].SubjectCategory == 11 ){
			    		discuss.push(_arr_11[i])
			    	}
			    }
				return discuss;
		    },
		    
        },


    }	
</script>
<!-- 样式 -->
<style lang="less">
.practice_c_report{
	width: 102%;
	.report_analysis{
		height: .98rem;
		line-height: .98rem;
		width: 100%;
		position: fixed;
		bottom: 0;
		background: #2C8CFF;
		font-size: .36rem;
		color: #fff;
		z-index:9999;
		li{
			float: left;
			width: 3.725rem;
			text-align: center;
		}
		li:first-child{
			background: #28C89F;
		}
	}
	.practice_setions{

			height: 100%;
			/*试卷报告*/
			.test_paper{
				height: 2.57rem;
				padding: 0 0.3rem;
				background: #fff;
				margin-bottom:.2rem;
				.test_time{
					height: .4rem;
					line-height: .4rem;
					color: #999;
					padding-top: .3rem;
				}
				.test_fraction{
					font-size: 1.74rem;
					color: #2C8CFF;
					font-weight: bold;
					text-align: center;
					line-height: 1;
					span{
						font-size: .28rem;
					}
				}

			}
			/*题号*/
			.swip_practice_wrap{
				width: 100%!important;
				overflow-x: hidden!important;
				overflow-y: auto;
				padding-bottom: 0.49rem;
				.answercard_single_area{
					width: 102%;
				}
			}
			.swip_practice_wrap::selection{
				display: none;
			}
			.swip_practice{
				height: 100%;
				margin-bottom: .8rem;
				.single_area{
					background: #fff;
					padding:.2rem 0 .01rem .3rem;
					overflow: hidden;
					h3{
						font-size: .28rem;
						padding:0 0 .4rem 0;
						color: #999;
					}
					.clearfix{
						.display(flex);
						flex-wrap:wrap;
						li{
							width: .68rem;
							height: .68rem;
							border: 1px solid #28C89F;
							text-align: center;
							border-radius: 50%;
							line-height: .68rem;
							color: #fff;
							background: #28C89F;
							margin-right: 0.69rem;
							margin-left: 0.1rem;
							margin-bottom: 0.6rem;
								&.checked{
									color: #fff;
									background: #2C8CFF;
									border: 1px solid #28C89F;
								}
							}
							.clearfix_red{
								background:#FE5B59;
								border: 1px solid #FE5B59;
							}
							li:nth-child(5),li:nth-child(10),li:nth-child(15){
								margin-right: 0px;
							}
					}
				}
			}
		}
}

</style>