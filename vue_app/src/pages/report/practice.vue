<template>
	
	<div class="practice_c_practice check_contain_not_footer" ref='practice_c_practice_exercise'>
		<!--
			这样将分析放在头部 习题放在下面一起加载出来解析--超出部分隐藏
			是为了规避 v-show 的弊端 隐藏时取不到元素的offSetHeight 
			权宜之计先这样操作   如有更好的方法时再做替换  此次改动的原版
			在文件夹--题库二期改动  待优化-文件夹
			
		-->
		<Report ref="report"
            v-show="answercard"
            :analytical_answer_card = 'analytical_answer_card'
            :show='show'
            :jump = 'jump'
            :currentNum='currentNum_1'
            :userId='userId'
            ></Report>
		<div  class="practice_test">
		<!-- 头部 -->
		<v-loading ref="loading"  v-if="reseve_loding" ></v-loading>
		<!-- 题目不存在 -->
		<!--<v-nodata ref="nodata"  :nodata="!reseve_loding && report_list.length==0" :nodatamsg="nodatamsg" ></v-nodata>-->
		<!-- 动画 -->
		<v-header :header_title="''" v-show="!answercard">
			<div class="header_back" slot="left_back" @click="back();"><span class="header_back_span"></span></div>
			<div class="header_right" slot="right_box">
				<div class="header_answerd" @click="show(currentNum_1-1)"></div>
				<div :class="collection_false?'new_exercise_collect':'new_exercise_unCollect'" @click ="collection_yes" ></div>
			</div>
		</v-header>
		<!-- 练习内容 -->
		<div class="practice_setion pt_82">
			<!-- 内容区 标题 -->
			<v-content v-show="showTitle" >
				<h3 class="practice_top_left" slot="practice_top_left">{{report_data.SheetName}}</h3>
		        <div class="practice_top_right" slot="practice_top_right">
		            <span class="current_num">{{currentNum_1}}</span>
		            <span class="con_top_right">/{{report_list.length}}</span>
		        </div> 
			</v-content>
			<!-- 可滚动区域 -->
			<div class="swip_practice" >
				<div class="swiper-container">
					<div class="swiper-wrapper">
						<!-- 单选题   -->
						<div class="swiper-slide" v-for="(item,index) in reseve_list_singleCheck" :index="index" >
							<singleElection :item="item" :index="index"></singleElection>
						</div> 
						<!-- 多选题  -->
					 	<div class="swiper-slide" v-for="(item,index) in reseve_list_Check" :index="reseve_list_singleCheck.length+index">
							<checkElection :item="item" :index="reseve_list_singleCheck.length+index"></checkElection>
						</div>
						<!-- 判断题   -->
						<div class="swiper-slide" v-for="(item,index) in reseve_list_judge" :index="reseve_list_singleCheck.length+reseve_list_Check.length+index" >
							<singleElection :item="item" :index="reseve_list_singleCheck.length+reseve_list_Check.length+index"></singleElection>
						</div>
						<!-- 填空  有一个问题做简单 -->
						<div class="swiper-slide" v-for="(item,index) in reseve_list_completion" :index="reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+index" >
							<completion @toggleHidden='toggleHidden' :item="item" :index="reseve_list_singleCheck.length+reseve_list_completion.length+reseve_list_judge.length+index"></completion>
						</div>
						<!-- 简答题  有一个问题做简单 -->
						<div class="swiper-slide" v-for="(item,index) in reseve_list_singleQuestions" :index="reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+index" >
							<shortAnswer  @toggleHidden='toggleHidden' :item="item" :index="reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+index"></shortAnswer>
						</div>
						<!-- 名词解释   -->
						<div class="swiper-slide" v-for="(item,index) in reseve_list_interpretation" :index="reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+index" >
							<shortAnswer @toggleHidden='toggleHidden' :item="item" :index="reseve_list_singleCheck.length+reseve_list_singleQuestions.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length+reseve_list_singleQuestions.length+index"></shortAnswer>
						</div>
						
						<!-- 案例分析   -->
						<div class="swiper-slide" v-for="(item,index) in reseve_list_analysis" :index="reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length+index" >
							<shortAnswer @toggleHidden='toggleHidden' :item="item" :index="reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length+index"></shortAnswer>
						</div>
						
						<!-- 论述题   -->
						<div class="swiper-slide" v-for="(item,index) in reseve_list_discuss" :index="reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length+reseve_list_analysis.length+index" >
							<shortAnswer @toggleHidden='toggleHidden' :item="item" :index="reseve_list_singleCheck.length+reseve_list_Check.length+reseve_list_judge.length+reseve_list_completion.length+reseve_list_singleQuestions.length+reseve_list_interpretation.length+reseve_list_analysis.length+index"></shortAnswer>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 收藏成功 -->
		<div v-show="retreat_sub" ref="retreat_error" class="toast_test"></div>
	    <!-- 上下题 -->
	    <v-course-check :swiper = 'swiper' :currentNum = 'currentNum_1' :show = 'show' v-if="footHiddenOrshow">
	    	<p  @click="pre()" slot="btn_left" :class="{btn_left:num_bool}"><span :class="{btn_pre:!num_bool,btn_pre_unChecked:num_bool}"></span>上一题</p>
	    	<p @click="next()" slot="btn_right" :class="{btn_left:next_num_bool}">
	    		<span ref="btn_right_p" v-text="(( currentNum_1 < report_list.length || report_list.length==0) ? '下一题' : '下一题')"></span>
	    		<span class="btn_next" :class="(currentNum_1 < report_list.length ? 'btn_next' : 'btn_next_unChecked')"></span>
	    	</p>
	    </v-course-check>
        </div>
         
	</div>
</template>

<script>
import Swiper from 'swiper';
import { mapState, mapGetters, mapActions } from 'vuex';
import { collectionOrAndNo} from '../../api';
import Report from './Report.vue';
// 单选题，判断题
import singleElection from '../../components/report/singleElectionAnalysis.vue'
// 多选题
import checkElection from '../../components/report/checkElectionAnalysis.vue'
// 填空题
import completion from '../../components/report/completionQueationAnalysis.vue'
// 问答题，名词解释，案例分析，论述题
import shortAnswer from '../../components/report/shortAnswerAnalysis.vue'

/* 单选-1
 * 多选-2
 * 判断-9
 * 填空-6
 * 问答-3
 **上机题-4    // 暂无题型
 **项目题-5	  //暂无题型
 * 名词解释-7
 **计算题-8    // 暂无题型 
 * 案例分析-10
 * 论述题-11
 * 非选择题，问答正确判断，所得分数 >=总分*60% ,正确；否则错误；
 * */
	export default {
		name: 'practice',
		data() {
			return {
				//中部内容区 头部
				showTitle:true,
				//是否显示答案解析
				answercard: true,    //因为 v-show 影响了css 故而影响到了初始定位上下拖动的位置 ？？？？ 如何解决？？？？？？
				int: Function,
		        currentTime: 0,
		        //是否为最后一页
		        lastIndex: 0,
		        //swiper函数
		        swiper: Function,
		        //暂停图层 是否显示
		        hand:false,
		        //点击回退按钮时显示
		        isshowback: false,

				//題目不存在
		        nodatamsg:"題目不存在",
		        //请求失败
		        errMessage:'请求错误，请与技术人员联系',
		        //url 上获取ID
		        data:{},
		        //题号
		        currentNum_1: 1,
		        //是否是第一题
		        num_bool:true,
		        // 下一题
		        next_num_bool: false,
		        
		        // 解析答题卡
		        analytical_answer_card: true,
		        // 用户id
		        userId: '',
		        //底部按钮显示与隐藏
                footHiddenOrshow:false,
                //是否收藏
                collection_false:false,
                retreat_sub:false,//收藏提示
                
                
			}
		},
	    computed: {
	        ...mapState(['reseve_data','answercard_test','report_data','flags_test_analysis']),
//	        ...mapGetters(['report_list','reseve_obj']),
	        // 试卷解析
	        report_list(){ 
        		let report_list = this.report_data._SubjectList || []  // 题目详情
        		// 返回重构对象
        		return report_list || [];  // 解析数据
        	},

        	
	        // 单选题
		    reseve_list_singleCheck () {
		    	let _arr_2 = [],singleCheck=[];
			    _arr_2 = this.report_list || [];
			    for(let i=0;i<_arr_2.length;i++){
			    	if(_arr_2[i].SubjectCategory == 1 ){
			    		_arr_2[i].SubjectCategoryName = '单选题'
			    		singleCheck.push(_arr_2[i])
			    	}
			    }
				return singleCheck;
		    },
		    // 多选题
		    reseve_list_Check () {
		    	let _arr_3 = [],Check=[];
			    _arr_3 = this.report_list || [];
			    for(let i=0;i<_arr_3.length;i++){
			    	if(_arr_3[i].SubjectCategory == 2 ){
			    		_arr_3[i].SubjectCategoryName = '多选题'
			    		Check.push(_arr_3[i])
			    	}
			    }
				return Check;
		    },
		    //问答题
		    reseve_list_singleQuestions () {
		    	let _arr_4 = [],singleQuestions=[];
			    _arr_4 = this.report_list || [];
			    for(var i=0;i<_arr_4.length;i++){
			    	if(_arr_4[i].SubjectCategory == 3 ){
			    		_arr_4[i].SubjectCategoryName = '问答题'
			    		singleQuestions.push(_arr_4[i])
			    	}
			    }
				return singleQuestions;
		    },
		    //上机题
		    reseve_list_shortAnswer () {
		    	let _arr_5 = [],shortAnswer=[];
			    _arr_5 = this.report_list || [];
			    for(var i=0;i<_arr_5.length;i++){
			    	if(_arr_5[i].SubjectCategory == 4  ){
			    		_arr_5[i].SubjectCategoryName = '上机题'
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
			    		_arr_6[i].SubjectCategoryName = '填空题'
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
			    		_arr_7[i].SubjectCategoryName = '判断题'
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
			    		_arr_8[i].SubjectCategoryName = '名词解释'
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
			    		_arr_9[i].SubjectCategoryName = '案例分析'
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
			    		_arr_11[i].SubjectCategoryName = '论述题'
			    		discuss.push(_arr_11[i])
			    	}
			    }
				return discuss;
		    },
		    
	        // 控制加载中显示
	        reseve_loding(){
	        	return (this.report_list == undefined);
	        },
	        
	    },
		created() {
			this.data.SheetId = this.$route.query.id || '';
			this.data.ExamId = this.$route.query.ExamId || '';
			
			//页面加载时  自动调用此方法
			this.getMessage();
			
		},
		methods:{
			
			//actions 中方法(huqo )
			...mapActions(['loadingGetTest_result','anserShowAndHidden_test_analysis']),
			//页面加载时调用
			getMessage () {
				this.loadingGetTest_result(this.data)
			},
		    //左边上一题按钮
		    pre(){
		    	this.swiper && this.swiper.slidePrev();
		    },
		    //右边下一题按钮
		    next(){
		       if(this.currentNum_1 >= this.report_list.length){
					this.swiper;
					//当超出长度时 显示答题卡
//		        		this.show();
                }else{
                    this.swiper && this.swiper.slideNext();
                }
		    },

		    // 试卷里面返回试卷报告
		    back(){
		    	this.answercard = true,  // 
		    	this.analytical_answer_card = true;
//				this.$router.push({path: '/report'});
				this.$router.push({  //核心语句
			        path:'/report',   //跳转的路径
			        query:{         //路由传参时push和query搭配使用 ，作用时传递参数
			          id:this.$route.query.id, 
			          ExamId:this.$route.query.ExamId,
			          UserId:this.$route.query.UserId, 
			        }
		       })
		    },

		    //子组件将调用这个方法
		    jump(index) {
		       const that= this;
		        setTimeout(function() {
		            that.swiper.slideTo(index,false);
		            that.currentNum_1= index+1;
		            //当从答题卡跳转到最后一题时下一题按钮 文案发生改变
			        if(that.currentNum_1 == 1){}else{
			        	that.num_bool = false;
			        };
			        //每一步下一步结束都会根据state数据来判断是否收藏的状态
			   		 that.collection_false = that.report_list[that.currentNum_1-1].SubjectCollection
		        }, 300);
		        
		    },
		    //是否显示 答题卡
		    show(currentNum_1){
		    	this.footHiddenOrshow = false;//底部按钮
        		this.$refs.practice_c_practice_exercise.style.paddingBottom=0.98+'rem';
        		this.swiper.unlockSwipeToNext();
				this.swiper.unlockSwipeToPrev();
		        this.answercard= !this.answercard;
		        this.analytical_answer_card = false;
		        this.anserShowAndHidden_test_analysis(true)
		        //调用子组件的方法  使其强刷新页面

//		        if(this.currentNum_1+1==this.report_list.length){
//		            this.lastIndex= 1;
//		        }else{
//		            this.lastIndex= 0;
//		        }
		    },
		    //底部按钮显示与隐藏
		    toggleHidden(){
	        	if(this.flags_test_analysis){
	        		this.footHiddenOrshow = this.flags_test_analysis;//底部按钮
	        		this.$refs.practice_c_practice_exercise.style.paddingBottom=0.98+'rem';
	        		this.swiper.unlockSwipeToNext();
					this.swiper.unlockSwipeToPrev();
	        	}else{
	        		this.footHiddenOrshow = this.flags_test_analysis;//底部按钮
	        		this.$refs.practice_c_practice_exercise.style.paddingBottom= 0;
	        		this.swiper.lockSwipeToNext();
					this.swiper.lockSwipeToPrev();
	        		
	        	}
        	},
        	//手否收藏-----题目收藏功能 不涉及其他页面
			collection_yes(){
				//声明一个空对象来提交给后台
				let collections_obj = {};
				//获取学生studentId / SheetId
				collections_obj.studentId = this.$route.query.UserId || '';
				collections_obj.sheetId = this.$route.query.id || '';;
				collections_obj.subjectId = this.report_list[this.currentNum_1-1].SubjectId|| '';
				collections_obj.subjectCategory = this.report_list[this.currentNum_1-1].SubjectCategory || '';
				collections_obj.type = 1;//  1 收藏  0 错题集
				collections_obj.isDelete = !this.collection_false;
				
				
				//调用收藏接口API
				collectionOrAndNo({
					data: collections_obj,
	            	type: "post"
				}).then(res =>{
					if(res.statusCode == 200){
						//改变当前收藏标记状态
						this.collection_false = !this.collection_false;
						//改变对应标题的状态
			            if(this.report_list[this.currentNum_1-1].SubjectId){
			            	this.report_list.forEach((item,index)=>{
			            		if(item.SubjectId == this.report_list[this.currentNum_1-1].SubjectId){
			            			this.report_list[index].SubjectCollection = !this.report_list[index].SubjectCollection
			            		}
			            	})
			            }
			            this.retreat_sub= true;
		               	this.$refs.retreat_error.innerHTML = this.collection_false ? '收藏成功' : '取消收藏';
		        		setTimeout(()=>{
		        			this.retreat_sub= false;
		        		},1500);
					}else{
						this.retreat_sub= true;
		               	this.$refs.retreat_error.innerHTML = '请稍后重试';
		        		setTimeout(()=>{
		        			this.retreat_sub= false;
		        		},1500);
					}
					
				})
			}
		},
		mounted() {	
			//轮播区域
			this.swiper = new Swiper('.swiper-container', {
				autoplay: false,
				direction: 'horizontal',
				loop:false,
				observer: true,
				observeParents: true
			})
			this.swiper.on('onSlideChangeEnd', () => {
                this.currentNum_1 = this.swiper.activeIndex+1;
                //当到达最后一题时下一题按钮 文案发生改变
		        if(this.currentNum_1 == this.report_list.length){
		        	this.next_num_bool = !this.next_num_bool
		        }else if(this.currentNum_1 == 1){
		        	this.num_bool = !this.num_bool
		        }else{
//		        	this.$refs.btn_right_p.innerText = '下一题';//
		        	this.num_bool = false;
		        	this.next_num_bool = false; // 下一题样式显示
		        }
		        //每一步下一步结束都会根据state数据来判断是否收藏的状态
		        this.collection_false = this.report_list[this.currentNum_1-1].SubjectCollection
			})
		},
		components:{
			Report,
			singleElection,
			checkElection,
			completion,
			shortAnswer
		}
	}
</script>

<style lang="less">
	.practice_c_practice {
		overflow: hidden;
		.text_html *{
        	font-family: "Arial","PingFang SC","Microsoft YaHei","SimSun","sans-serif"!important;
        	word-wrap: break-word !important;
    		line-height: 0.56rem !important;
   			font-size: 0.32rem !important;    	
        }
		/* 页面显示 隐藏 元素 */
		.practice_test{
			height: 100%;
		}
		/*--正在提交--end--*/
		   
	   /*  暂停图层--start */
	  	.practice_stop{
	        background: rgba(0,0,0,0.7);
	        // opacity: 0.7;
	        position: fixed;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        z-index: 999;
	        .practice_confirm{
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
	            .practice_confirm-top{
	                height: 1.7rem;
	                line-height: 0.48rem;
	                .pp{
	                    padding-top: 0.47rem;
	                }
	            }
	            .practice_no{
	                color: #0081e6;
	                float: right;
	                width: 100%;
	                height: 0.78rem;
	                line-height: 0.78rem;
	                border-top: 1px solid #cccccc;
	                cursor: pointer;
	            }
	        }
	    }
	   /*-- 暂停图层 --end --*/
	  /*-- 回退按钮 弹出层  start---*/
		 .practice_hand{
	        background: rgba(0,0,0,0.7);
	        // opacity: 0.7;
	        position: fixed;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        z-index: 999;
	        .practice_confirm{
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
	            .practice_confirm-top{
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
	 /*---回退按钮 弹出层   end---*/
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
		.swip_practice {
			height: 100%;
			.swiper-container{
				height: 100%;
				
				.swiper-slide{
					height: 100%;
					position: relative;
				    overflow-x: hidden;
					overflow-y: hidden;
				}
			}
			
		}
	}
</style>