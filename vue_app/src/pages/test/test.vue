<template>
	
	<div class="practice_c check_contain practice_c_test" ref='practice_c_test'>
		<div v-show="!answercard" class="practice_test">
		<!-- 头部 -->
		<!--<v-loading ref="loading"  v-if="reseve_loding" ></v-loading>-->
		<!-- 题目不存在 -->
		<v-nodata ref="nodata"  :nodata="!reseve_loding && reseve_list_result.length==0" :nodatamsg="nodatamsg" ></v-nodata>
		<!-- 动画 -->
		<v-header :header_title="''" >
			<div class="header_back" slot="left_back" @click="back();open5()"><span class="header_back_span"></span></div>
			<div class="header_right" slot="right_box">
				<!--考试时间区域-->
				<div v-show="timetext!='-1'" class="header_timer_box" @click="open5(1)">
					<span class="header_timer"></span>
					<span class="input_text">{{timetext}}</span>
				</div>
				<!--答题卡按钮-->
				<div class="header_answerd" @click="show(currentNum_1-1)"></div>
				<!--是否收藏按钮-->
				<div :class="collection_false?'new_exercise_collect':'new_exercise_unCollect'" @click ="collection_yes"></div>
				<!--交卷按钮-->
				<div class="header_submit" @click="quickSubmitTest()">交卷</div>
			</div>
		</v-header>
		<!-- 练习内容 -->
		<div class="practice_setion pt_82">
			<!-- 内容区 标题 -->
			<v-content v-show="showTitle" >
				<h3 class="practice_top_left" slot="practice_top_left">{{reseve_data.result.SheetName}}</h3>
		        <div class="practice_top_right" slot="practice_top_right">
		            <span class="current_num">{{currentNum_1}}</span><span class="con_top_right">/{{reseve_list_result.length}}</span>
		            
		        </div>
			</v-content>
			<!-- 可滚动区域 -->
			<div class="swip_practice" >
				<div class="swiper-container">
					<div class="swiper-wrapper">
						<!-- 单选题   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.singleCheck" :index="index" >
							<singleElectionTest :item="item" :index="index"  v-on:swiperGo ="swiper_go_1"></singleElectionTest>
						</div>
						<!-- 多选题  -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.Check" :index="typeOptions.singleCheck.length+index">
							<checkElectionTest :item="item" :index="typeOptions.singleCheck.length+index"></checkElectionTest>
						</div>
						<!-- 判断题   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.judge" :index="typeOptions.singleCheck.length+typeOptions.Check.length+index" >
							<singleElectionTest :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+index"  v-on:swiperGo ="swiper_go_1"></singleElectionTest>
						</div>
						<!-- 填空  有一个问题做简单 -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.completion" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+index" >
							<completionTest @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.judge.length+index"></completionTest>
						</div>
						<!-- 简答题  有一个问题做简单 -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.singleQuestions" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+index" >
							<shortAnswerTest @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+index"></shortAnswerTest>
						</div>
						<!-- 名词解释   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.interpretation" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+index" >
							<shortAnswerTest @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+index"></shortAnswerTest>
						</div>
						
						<!-- 案例分析   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.analysis" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+index" >
							<shortAnswerTest @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+index"></shortAnswerTest>
						</div>
						
						<!-- 论述题   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.discuss" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length+index" >
							<shortAnswerTest @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length+index"></shortAnswerTest>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 收藏成功 -->
		<div v-show="retreat_sub" ref="retreat_error" class="toast_test"></div>
		<!--点击暂停时显示-->
        <div class="practice_stop_waring" v-if="hand" >
            <div class="practice_confirm_waring">
                <div class="practice_confirm-top">
                    <p class="practice_pp">休息一下<br>共{{reseve_list_result.length}}道题,您还有{{this.notanswer}}题未答</p>
                </div>
                <div class="practice_no" @click="closeMask()">继续做题</div>
            </div>
        </div>
        
        <!--点击暂停时显示-->
        <div class="practice_hand" v-if="hand_back" >
            <div class="practice_confirm_exercise">
                <div class="practice_confirm_title">
                    <p class="practice_pp">退出后将自动交卷，是否退出？</p>
                </div>
                <div class="confirm_btns">
                	<div class="practice_no" @click="closeMask()">取消</div>
                	<div class="practice_yes" @click="submit()">退出</div>
	                
	                
                </div>
            </div>
        </div>
        <!--点击返回时显示-->
        <div class="practice_hand" v-show="isshowback" >
            <div class="practice_confirm_exercise">
                <div class="practice_confirm_title">
                    <p class="practice_pp">你还有试题未完成，是否提交？</p>
                </div>
                <div class="confirm_btns">
                	<div class="practice_no" @click="closeMask()">取消</div>
                	<div class="practice_yes" @click="submit()">提交</div>
                </div>
            </div>
        </div>
        <!--特殊字符提示框-->
        <div class="practice_hand"  v-show="set_special_chart" >
	        <div class="practice_confirm_exercise">
                <div class="practice_confirm_title">
	               <p class="practice_pp">不能包含特殊字符 :<br/>& =   ?  %  # <br/></p>
	            </div>
                <!--<div class="confirm_btns">
                	<div class="practice_specise" @click="SubmitSpecise()">确认</div>
	                
	                
                </div>-->
	        </div>
	    </div>
        <!--正在交卷retreat-->
        <div v-if="retreat" class="toast_loading"></div>
        <!--首次进入显示提示 左右滑动-->
        <div class="practice_handle" v-show=" handle != -2 && reseve_list_result.length>0" >
        	<div v-show="handle==0" class="practice_confirm_img" @click="handle=1"></div>
        	<div v-show="handle==1" class="practice_timer_img" @click="outHandle(2)"></div>
        	<div v-show="handle==2" class="practice_confirm_answercard" @click="handle=3"></div>
        	<div v-show="handle==3" class="practice_collection_img" @click="handle=4"></div>
            <div v-show="handle==4" class="practice_submit_img" @click="outHandle(4)"></div>

        </div>

        <div class="practice_handle" v-show="handle_show3">
            <div class="practice_confirm_noChoice" @click="outHandle(5)"></div>
        </div>
        </div>
        <AnswercardTest ref="answercard"
            v-show="answercard"
            :questions='reseve_data.result'
            :show='show'
            :start='testTime'
            :back='back'
            :jump = 'jump'
            :currentNum='notanswer'
            :getTime = 'getTime'
            ></AnswercardTest>
	</div>
</template>

<script>
import Swiper from 'swiper';
import Vue from 'vuex';
import { collectionOrAndNo} from '../../api';
import { mapState, mapGetters, mapActions } from 'vuex';
//本地存储相关
import { getLocalSto, setLocalSto} from '../../common/js/utils.js'
import { FilterTypeTest } from '../../common/js/dataFilter.js';
//答题卡
import AnswercardTest from './AnswercardTest.vue';
//单选题
import singleElectionTest from '../../components/test/SingleElection_test.vue'
//复选题
import checkElectionTest from '../../components/test/checkElection_test.vue'
//材料选则
import singleQuestionsTest from '../../components/test/SingleQuestions_test.vue'
////天填空选
import completionTest from '../../components/test/completionQueation_test.vue'
////天填空选
import shortAnswerTest from '../../components/test/Shortanswer_test.vue'
	export default {
		name: 'practice',
		data() {
			return {
				//中部内容区 头部
				showTitle:true,
				//是否显示答题卡
				answercard:false,
				int: Function,
		        currentTime: 0,
		        times:0,
		        //是否为最后一页
		        lastIndex: 0,
		        //swiper函数
		        swiper: Function,
		        //暂停图层 是否显示
		        hand:false,
		        //点击回退按钮时显示
		        isshowback: false,
		        //返回（交卷）
		        retreat: false,
		        //未答
		        notanswer:0,
		        //试卷不存在提示文字
		        nodatamsg:"題目不存在",
		        //请求失败
		        errMessage:'请求错误，请与技术人员联系',
		        //url 上获取ID
		        data:{},
		        //题号
		        currentNum_1: 1,
		        //是否是第一题
		        num_bool:true,
		        //开始考试时间
		        startTime:"",
		        //首次进入答题进行手势提示------------------>>>>>暂时隐藏 现在缺少判断字段
		        handle: -2,
		        //首次进入答题进行手势提示  进入答题卡------------->>>>>暂时隐藏 现在缺少判断字段
		        notice_answercard_target:false,
		        //首次进入答题进行手势提示  进入答题------------->>>>>暂时隐藏 现在缺少判断字段
		        Notice_noChoice:false,
		        //计时器 相关
		        testTimeSencond: -2,
		        //首次进入答题进行手势提示--->>暂时隐藏 现在缺少判断字段
                handle: -2,  // -2不显示
                handle_3: -2,   //答题提示
                //结束时间
                endTime:'',
                //当前时间
                nowTime:'',
                hand_back:false,
                //是否收藏
                collection_false:false,
                retreat_sub:false,//收藏提示
                
                
		        
			}
		},
	    computed: {
	        ...mapState(['reseve_data','answercard_test','submitSuc','flags_test','special_chart']),
	        ...mapGetters(['reseve_list_result','reseve_obj','set_screenResize','set_screenResizeIos','set_special_chart']),

			
		    typeOptions(){
				return FilterTypeTest(this.answercard_test.result)
			},
	        //弹出指示层  那些页面显示/隐藏
	        handle_show3(){
                const { handle, handle_3, currentNum_1, reseve_list_result } = this;
//              return ( handle == -2 && handle_3 != -2 && currentNum_1>(typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length) );
				if(!reseve_list_result || reseve_list_result.length==0){
	                return false;
	            }
	            let subjectCategory = reseve_list_result[currentNum_1-1].SubjectCategory;
	            subjectCategory = ( subjectCategory!=1 && subjectCategory!=2 && subjectCategory!=9 );   //是不是在答题中
	            return ( handle == -2 && handle_3 != -2 && subjectCategory  && false);//后缀false为了让其始终不显示后期如有改动去掉即可
	        },
		    
	        reseve_loding(){
	        	return (this.reseve_data.result._SubjectList == undefined);
	        },
	        
	        timetext(){
	        	let timetext = '';
	        	let { testTimeSencond } = this;
	        	timetext = this.toHms(testTimeSencond);
	        	if( testTimeSencond == -2 ){
	        		return -1;
	        	}else{
	        		return timetext;
	        	}
	        }
	        

	    },
		created() {
			
			
			
//			this.data.id =  this.$route.query.id || '236e240f-c90d-4681-b4b3-9843d85653cf';
			this.data.id =  this.$route.query.id || '';
//			this.data.UserId = this.$route.query.UserId || '236e240f-c90d-4681-b4b3-9843d85653cf';
			this.data.UserId = this.$route.query.UserId || '';
			//页面加载时  自动调用此方法
			this.getMessage();
            //开启计时
            this.$nextTick(() => {
                this.testTime();
            });
            //弹出指示层 
            let _handle = getLocalSto('app_handle_test') || 0, handle_3 = getLocalSto('app_handle3_test') || 0;
            let _handle_exercise = getLocalSto('app_handle') || 0, handle_3_exercise = getLocalSto('app_handle3') || 0;
            if(_handle_exercise != -2 ){
            	if(_handle!=-2){this.handle = 0;}
            }else{
            	if(_handle!=-2){this.handle = 1;}
            }
            if(handle_3_exercise != -2){
            	if(handle_3!=-2){this.handle_3 = 0;}
            }
            
		},
		methods:{
			//actions 中方法
			...mapActions(['loadingGetTest','anserShowAndHidden_test']),
			//页面加载时调用
		
			getMessage () {
			    this.loadingGetTest({
			     data: this.data,
			     cb: ()=>{
			     	//开启计时器
			     	this.testTime();
			     	//请求数据成功时是否是收藏状态
			     	this.collection_false = this.reseve_list_result[this.currentNum_1-1].SubjectCollection
			     }
			    });
			    
			},
			
			//提交时是否显示题目未做完提示框
	    	quickSubmitTest(){
	    		//特殊字符
	    		if(this.set_special_chart){
	        		return false
	        	}
	    		
	    		let obj = this.reseve_obj||{};
	    		let _arr_count = obj.SubjectRecords ||[];
	    		let count=0;
	    		for(var i=0;i<_arr_count.length;i++){
	    			if(_arr_count[i].Answer||_arr_count[i].SubjectRecordSAnswerOptions.length>0||_arr_count[i].AnswerOptionExtendeds.length>0){
	    				count++
	    			}
	
	    		}
	    		if(count < _arr_count.length){//题目是否全部做完  没有则显示提示框
	    			//隐藏点击返回时的图层
		      		 this.isshowback = true;
	    		}else{
	    			//执行提交 === 将所作的答案提交
		             this.submit();
		             //改变提交成功======》》》答题卡内提交成功部分显示
		             this.$store.dispatch('set_submitSuccess',true);
		             clearInterval(this.int);
	    		}
	    	},
			
			
			//提示框
			outHandle(_t){
				let _handle_exercise = getLocalSto('app_handle') || 0, handle_3_exercise = getLocalSto('app_handle3') || 0;
                if(_t!=5){
                	if(_handle_exercise == -2){
                		this.handle = -2;  //去除提示
                   		setLocalSto('app_handle_test', -2);
                	}else{
                		if(_t!=4){
                			this.handle = _t;  //去除提示
                		}else{
                			this.handle = -2;  //去除提示
                			setLocalSto('app_handle_test', -2);
                		}
                	}
                }else{
                    this.handle_3 = -2;  //去除提示
                    setLocalSto('app_handle3_test', -2);
                }
            },
			//计时器
			toHms(t){
				t = t*1||0;
				var h=0, m=0, s=0;
				h = Math.floor(t/3600);
				m = Math.floor( (t-h*3600)/60);
				s = Math.floor( (t-h*3600-m*60)/1);
				h = h>9? h+'': '0'+h;
				m = m>9? m+'': '0'+m;
				s = s>9? s+'': '0'+s;
				return (m+':'+s);
			},
			
			 testTime(){
			    clearInterval(this.int);
			    this.int = setInterval( () => {
			     if(!this.reseve_data){
			      return;
			     }else if( this.testTimeSencond == -2){
			      let { StartTime, NowTime, EndTime } = this.reseve_data.result;
			//      console.log(this.reseve_data.result,'this.reseve_data.result')
			//      NowTime = "2018-12-13T15:34:24.2757434+08:00";
			            StartTime = new Date(StartTime).getTime()/1000;
			            NowTime = new Date(NowTime).getTime()/1000;
			            EndTime = new Date(EndTime).getTime()/1000;
			            this.testTimeSencond = 0;
			            this.endTime = EndTime || 0 ;
			            this.nowTime = NowTime || 0
			            return;
			     }
			     this.testTimeSencond ++;
			     let {Timing,Is_FirstExam} = this.reseve_data.result;
			     Timing = Timing*1 || 0;
			     if(Timing == 0){//考试时间为0 则为不限时间
			      
			     }else{
			         if( Math.floor(this.testTimeSencond) > Timing*60 ){
			             //执行提交 === 将所作的答案提交
			             this.submit();
			             //改变提交成功======》》》答题卡内提交成功部分显示
			             this.$store.dispatch('set_submitSuccess',true);
			             clearInterval(this.int);
			           } 
			     }
			           
			       }, 1000);
			    
			   },
    	    //时间被点击弹出层 并  暂停计时
		    open5(e){
		    	//特殊字符
	    		if(this.set_special_chart){
	        		return false
	        	}
    		
		        this.stop()
		        //已做多少道题目
		        var _notanswer = 0;
		        for(let i=0; i<this.reseve_obj.SubjectRecords.length; i++) {
		            if(this.reseve_obj.SubjectRecords[i].state){
		                _notanswer+=1;
		            }
		        }
		        this.notanswer = this.reseve_list_result.length - _notanswer;
		        if(e==1){
		           this.hand= true
		        }
		    },

		    //清除定时器 停止计时
		    stop() {
		      window.clearInterval(this.int);
		    },
		    //子组件将调用此方法获取做题时间
		    getTime() {
		        window.clearInterval(this.int);
		        return this.times
		    },
		    //取消暂停一下
		    closeMask(){
		    	this.hand_back = false;
		        this.hand = false;
		        //隐藏点击返回时的图层
		        this.isshowback = false;
		        this.testTime()
		    },
		    //点击回退按钮时
		    back(){
		    	console.log(this.set_special_chart)
	    		//特殊字符
	    		if(this.set_special_chart){
	        		return false
	        	}
	    		this.hand_back = true;
		        
		    },
		    //结束考试(提交)
		    submit(){
				this.answercard= !this.answercard;
		        this.$refs.answercard.submit();
		        this.isshowback= false;
		    },
		    
		    //结束考试(提交)
		    submit_goback(){
		    	this.hand_back = false;
				this.answercard= !this.answercard;
		        this.$refs.answercard.submit_back();
		        this.isshowback= false;
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
			        }
			        //每一步下一步结束都会根据state数据来判断是否收藏的状态
			   		that.collection_false = that.reseve_list_result[that.currentNum_1-1].SubjectCollection
		        }, 300);
		    },
		    //是否显示 答题卡
		    show(currentNum_1){
		    	console.log(this.set_special_chart)
		    	//特殊字符
	    		if(this.set_special_chart){
	        		return false
	        	}
		    	
		        //停止计时
		        this.open5(2)
		        //显示答题卡
		        this.answercard= !this.answercard;
		        //调用子组件的方法  使其强刷新页面
		        if(this.currentNum_1+1==this.reseve_list_result.length){
		            this.lastIndex= 1;
		        }else{
		            this.lastIndex= 0;
		        }
		        this.anserShowAndHidden_test(true);
		       	this.swiper.unlockSwipeToNext();
				this.swiper.unlockSwipeToPrev();
		    },
		    //底部按钮显示与隐藏
		    toggleHidden(){
		    	this.retreat_sub= true;
               	this.$refs.retreat_error.innerHTML = '拖拽试试';
        		setTimeout(()=>{
        			this.retreat_sub= false;
        		},1500);	
        	
        },
        //单选选择后自动到下一题
        swiper_go_1(){//回调方法，接收子组件传的参数
        	this.swiper && this.swiper.slideNext();
        },
    	//手否收藏-----题目收藏功能 不涉及其他页面
		collection_yes(){
			
			//特殊字符
    		if(this.set_special_chart){
        		return false
        	}
    		
			//声明一个空对象来提交给后台
			let collections_obj = {};
			//获取学生studentId / SheetId
			collections_obj.studentId = this.$route.query.UserId || '';
			collections_obj.sheetId = this.$route.query.id || '';;
			collections_obj.subjectId = this.reseve_list_result[this.currentNum_1-1].SubjectId|| '';
			collections_obj.subjectCategory = this.reseve_list_result[this.currentNum_1-1].SubjectCategory || '';
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
		            if(this.reseve_list_result[this.currentNum_1-1].SubjectId){
		            	this.reseve_list_result.forEach((item,index)=>{
		            		if(item.SubjectId == this.reseve_list_result[this.currentNum_1-1].SubjectId){
		            			this.reseve_list_result[index].SubjectCollection = !this.reseve_list_result[index].SubjectCollection
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
		},
		//关闭提示字符框
//		SubmitSpecise(){
//			this.special_charts(!this.set_special_chart);
//		}
		},
		mounted() {
			 
			//轮播区域初始化
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
		        if(this.currentNum_1 == this.reseve_list_result.length){
		        }else if(this.currentNum_1 == 1){
		        	this.num_bool = !this.num_bool
		        }else{
		        	this.num_bool = false;
		        }
		        //每一步下一步结束都会根据state数据来判断是否收藏的状态
		        this.collection_false = this.reseve_list_result[this.currentNum_1-1].SubjectCollection
			})
		},
		
		watch:{
			set_screenResize:function(val){
				if (/(Android)/i.test(navigator.userAgent)) {
					if(val){
	    				this.swiper.lockSwipeToNext();
	    				this.swiper.lockSwipeToPrev();
	    			}else{
	    				this.swiper.unlockSwipeToNext();
	    				this.swiper.unlockSwipeToPrev();
	    			}
				}
			},
			set_screenResizeIos:function(vals){
				if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
					if(vals){
	    				this.swiper.lockSwipeToNext();
	    				this.swiper.lockSwipeToPrev();
	    			}else{
	    				this.swiper.unlockSwipeToNext();
	    				this.swiper.unlockSwipeToPrev();
	    			}
				}
			}
		},
		updated(){},
	    destroyed(){
	    	//清除计时器
	    	clearInterval(this.int);
	    },
		components:{
			AnswercardTest,
			singleElectionTest,
			checkElectionTest,
			singleQuestionsTest,
			completionTest,
			shortAnswerTest
		}

	}
</script>

<style lang="less">
	.practice_c_test {
		.text_html *{
        	font-family: "Arial","PingFang SC","Microsoft YaHei","SimSun","sans-serif"!important;
        	word-wrap: break-word !important;
    		line-height: 0.56rem !important;
   			font-size: 0.32rem !important;    	
        }
        .swiperSlideToptest .swiper-slide_title{
        	margin-top: 0.2rem;
		    font-size: 0.32rem;
		    color: #2C8CFF;
		    display: flex;
		    align-items: center;
		    span{	    	 
		    	line-height: .38rem;
		    }
        }
        .swiper-slide_down_title{
        	display: flex;
		    align-items: center;
		    span{
		    	line-height: .38rem;
		    }
        }
		/* 页面显示 隐藏 元素 */
		.practice_test{
			height: 100%;
		}

		/*--正在提交--start--*/
		.toast_loading {
	        width: 2rem;
	        height: 1.35rem;
	        padding-top: 0.65rem;
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
	        z-index: 99999;
	        background: url(../../common/imgs/submitting.png) no-repeat;
	        background-size: contain;
	    }
		/*--正在提交--end--*/
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
	   /*  暂停图层--start */
	  	.practice_stop_waring{
	        background: rgba(0,0,0,0.6);
	        // opacity: 0.7;
	        position: fixed;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        z-index: 99999;
	        .practice_confirm_waring{
	            text-align: center;
			    position: absolute;
			    left: 50%;
			    top: 50%;
			    z-index: 99999!important;
			    transform: translate(-50%, -50%)!important;
			    width: 75%!important;
			    background: #fff;
			    border-radius: 5px;
	            .practice_confirm-top{
	                height: 1.7rem;
	                line-height: 0.48rem;
	                .practice_pp{
	                    font-size: 0.30rem;
					      color: #333333;
					      line-height: 0.44rem;
					      padding: 0.4rem 0.5rem;
	                }
	                div {
				        /*width: 50%;*/
				        height: 100%;
				        position: relative;
				      }
	                .pp_submit{
	                    padding-top: 0.47rem;
	                    font-size: 0.32rem;
	                }
	            }
	            .practice_no{
	                color: #0081e6;
	                float: right;
	                width: 100%;
	                height: 1rem;
	                line-height: 1rem;
	                font-size: 0.36rem;
	                //line-height: 0.78rem;
	                border-top: 1px solid #cccccc;
	                cursor: pointer;
	                font-weight: inherit;
	            }
	        }
	    }
	   /*-- 暂停图层 --end --*/
	  /**L****   首次进入显示提示 左右滑动   *****/
	   .practice_handle{
		   	background: rgba(0,0,0,0.7);
		   	position: fixed;
		    top: 0;
		    left: 0;
		    width: 100%;
		    height: 100%;
		    z-index: 999999!important;
		    .practice_confirm_img{
                background-image: url(../../common/imgs/handle.png);
                background-repeat: no-repeat;
                background-position: center;
                background-position-y:-0.36rem;
		    	width: 100%;
		        height: 100%;
		        background-size:100% auto;
		    }
		    .practice_timer_img{
		    	background-image: url(../../common/imgs/timer_test_icon.png);
                background-repeat: no-repeat;
                background-position: center;
                background-position-y:-0.37rem;
		    	width: 100%;
		        height: 100%;
		        background-size:100% auto;
		    }
		    .practice_collection_img{
	        	background-image: url(../../common/imgs/handle_collection_icon.png);
	            background-repeat: no-repeat;
	            background-position: center;
	            background-position-y:-0.36rem;
	            width: 100%;
	            height: 100%;
	            background-size:100% auto;
	        }
            .practice_submit_img{
	        	background-image: url(../../common/imgs/submit_icon.png);
	            background-repeat: no-repeat;
	            background-position: center;
	            background-position-y:-0.38rem;
	            width: 100%;
	            height: 100%;
	            background-size:100% auto;
	        }
		     /**L****   首次进入显示提示  跳转答题卡   *****/
		    .practice_confirm_answercard{
		    	width: 100%;
		        height: 100%;
		        background:url(../../common/imgs/handle_answercard.png) no-repeat center;
		        background-size:100%;
		        background-position-y:-0.36rem;
		        background-position-x: 0.02rem;
		    }
		    /**L****   首次进入显示提示 非选择题   *****/
		    .practice_confirm_noChoice{
		    	width: 100%;
		        height: 100%;
		        background:url(../../common/imgs/answerd_target.png) no-repeat bottom left;
		        background-size:100%;
		    }
		    
	   }
	  /*-- 回退按钮 弹出层  start---*/
		 .practice_hand{
	        background: rgba(0,0,0,0.6);
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
	            		  font-size: 0.3rem;
					      color: #333333;
					      line-height: 0.44rem;
					      padding: 0.6rem 0.5rem;
	            	}
	                 
	            }
	            .confirm_btns{
	            	 border-top: 1px solid #e5e5e5;
				      height: 1rem;
				      line-height: 1rem;
				      font-size: 0.36rem;
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
	 /*---回退按钮 弹出层   end---*/

		.swip_practice {
			height: 100%;
			.swiper-container{
				height: 100%;

				.swiper-slide{
					height: 100%;
					position: relative;
					overflow-x: hidden;
					overflow-y: auto;

				}
			}
		}
	}
</style>