<template>

	<div class="practice_c check_contain practice_c_new" ref='practice_c_new'>
		<div class="practice_test">
            <!-- 头部 -->
            <v-header :header_title="''" v-if="!answer_card_show">
                <div class="header_back" slot="left_back" @click="cardSubStatus()"><span class="header_back_span"></span></div>
                <div class="header_right" slot="right_box">
                	<!--答题卡图标-->
                    <div class="header_answerd" @click="showAnswerCard()"></div>
                    <!--是否收藏按钮-->
                    <div :class="collection_false?'new_exercise_collect':'new_exercise_unCollect'" @click ="collection_yes"></div>
                    <!--交卷按钮-->
                    <div class="header_submit" @click="quickSubmit()">交卷</div>
                    
                </div>
            </v-header>

      
            <!-- 练习内容 -->
            <div class="practice_setion" v-if="new_exercises_data.already_get">
                <!-- 内容区 标题 -->
                <div class="practice_h c_padding">
                    <h3 class="practice_top_left" v-text="new_exercises_data.SheetName"></h3>
                    <div class="practice_top_right">
                        <span class="current_num" v-text="current_swiper"></span><span class="con_top_right" >/{{new_exercises_data.Subjects.length}}</span>
                        
                    </div>
                </div>
                <!-- 可滚动区域 -->
                <div class="swip_practice" >
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                        	<!-- 单选题   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.singleCheck" :index="index" >
							<!--子组件向父组件传值      传递当前轮播图的角码   -->
							<single :item="item" :index="index" :page_swiper="current_swiper" v-on:swiperGo ="swiper_go_1"></single>
						</div>
						<!-- 多选题  -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.Check" :index="typeOptions.singleCheck.length+index">
							<multiple :item="item" :index="typeOptions.singleCheck.length+index"></multiple>
						</div>
						<!-- 判断题   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.judge" :index="typeOptions.singleCheck.length+typeOptions.Check.length+index" >
							<!--子组件向父组件传值      传递当前轮播图的角码   -->
							<single :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+index" :page_swiper="current_swiper" v-on:swiperGo ="swiper_go_1"></single>
						</div>
						<!-- 填空  有一个问题做简单 -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.completion" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+index" >
							<fillBlack  @toggleHidden='toggleHidden' :item="item"  :index="typeOptions.singleCheck.length+typeOptions.completion.length+typeOptions.judge.length+index" ></fillBlack>
						</div>
						<!-- 简答题  有一个问题做简单 -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.singleQuestions" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+index" >
							<oneAnswer  @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+index"></oneAnswer>
						</div>
						<!-- 名词解释   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.interpretation" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+index" >
							<oneAnswer   @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.singleQuestions.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.singleQuestions.length+index"></oneAnswer>
						</div>
						
						<!-- 案例分析   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.analysis" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+index" >
							<oneAnswer   @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+index"></oneAnswer>
						</div>
						
						<!-- 论述题   -->
						<div class="swiper-slide" v-for="(item,index) in typeOptions.discuss" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length+index" >
							<oneAnswer   @toggleHidden='toggleHidden' :item="item" :index="typeOptions.singleCheck.length+typeOptions.Check.length+typeOptions.judge.length+typeOptions.completion.length+typeOptions.singleQuestions.length+typeOptions.interpretation.length+typeOptions.analysis.length+index"></oneAnswer>
						</div>
                        </div>
                    </div>
                </div>
            </div>


            

            <v-confirm v-show="card_sub_status==3" :msg="'确定保存练习并离开页面？'" @confirmCas=" ()=>{card_sub_status=0} " @confirmSuc="submit()"></v-confirm>
			<!--点击返回时显示-->
	        <div class="practice_hand_exercise" v-show="card_sub_status==1" >
	            <div class="practice_confirm_exercise">
	                <div class="practice_confirm_title">
	                    <p class="practice_pp">你还有试题未完成，是否提交？</p>
	                </div>
	                <div class="confirm_btns">
	                	<div class="practice_no" @click="closeMask()">取消</div>
	                	<div class="practice_yes" @click="Submits()">提交</div>
		                
		                
	                </div>
	            </div>
	        </div>
	        
	        <div class="practice_hand_exercise" v-show="set_special_chart" >
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
            <div v-show="card_sub_status==2" class="toast_loading"></div>
			 <!--正在交卷retreat-->
		    <div v-show="retreat_sub" ref="retreat_error" class="toast_test"></div>
            <!--首次进入显示提示 左右滑动-->
            <div class="practice_handle" v-show=" handle != -2 && new_exercises_data.Subjects.length>0" >
                <div v-show="handle==0" class="practice_confirm_img" @click="handle=1"></div>
                <div v-show="handle==1" class="practice_confirm_answercard" @click="handle=2"></div>
                <div v-show="handle==2" class="practice_collection_img" @click="handle=3"></div>
                <div v-show="handle==3" class="practice_submit_img" @click="outHandle"></div>
            </div>
            <div class="practice_handle" v-show="handle_show3">
                <div class="practice_confirm_noChoice" @click="outHandle(3)"></div>
            </div>

        </div>

        <!-- 答题卡 -->
        <answer-card @touchmove.stop="" @showAnswerCard="showAnswerCard" :tryGo='tryGo' :Examination_Id='Examination_Id' v-show="answer_card_show" ref="exerciseCard" @callBackParent='callBackParent' ></answer-card>


	</div>
</template>

<script>

import Swiper from 'swiper';
import { mapState, mapGetters, mapActions } from 'vuex';
import { getLocalSto, setLocalSto} from '../../common/js/utils.js';
import { FilterType } from '../../common/js/dataFilter.js';
import { subHomework, testReport ,exercises, collectionOrAndNo} from '../../api';


// 单选 判断
import single from '../../components/new-exercises/single'
// 多选
import multiple from '../../components/new-exercises/multiple'
// 填空
import fillBlack from '../../components/new-exercises/fillBlack'
// 问答
import oneAnswer from '../../components/new-exercises/oneAnswer'

// 答题卡
import answerCard from './answer-card'

export default {
    name: 'new-practice',
    data() {
        return {
            answer_card_show: false,
            swiper: null,       //轮播
            current_swiper: 1,
            card_sub_status: 0,
            //首次进入答题进行手势提示--->>暂时隐藏 现在缺少判断字段
            handle: -2,  // -2不显示
            handle_3: -2,   //答题提示
            tryGo:false,//二期再上到时间在下面条件放开即可！！！！！！！！！
            retreat_sub:false,//收藏提示
           	collection_false:false,//是否收藏
			Examination_Id:'',
			//特殊字符
			specile:false,
			
        }
    },
    created() {
        //页面加载时获取练习  学生Sheet_Id   d66ec1fc-4deb-4d0d-a296-27ddffe1bae2
        const id = this.$route.query.sheetId || '';
        //页面加载时获取练习  学生StudentId   f4d10bd1-8fcc-11e8-9cca-00163e0f085f
		const StudentId = this.$route.query.StudentId || '';
		const tryAgin = this.$route.query.tryAgin || '';
		//判断手势提示是否显示  本地存储
        let _handle = getLocalSto('app_handle') || 0, handle_3 = getLocalSto('app_handle3') || 0;
        let _handle_test = getLocalSto('app_handle_test') || 0, handle_3_test = getLocalSto('app_handle3_test') || 0;
        if(_handle_test!=-2){
        	if(_handle!=-2){ this.handle = 0; }
        }
        if(handle_3_test!=-2){
        	if(handle_3!=-2){ this.handle_3 = 0; }
        }
        if(tryAgin){
            
        	this.getNewExercises( { data:{id:id,UserId:StudentId}, test_obj:'', cb: (res)=>{    //回调
                let active_index = (res.current_swiper*1||0);
                this.current_swiper = active_index+1;
                //初始数据时收藏显示状态------------------------------------------------------------后台数据中获取
                 this.collection_false = this.new_exercises_data.Subjects[this.current_swiper-1].selected;
                this.$nextTick(() => {
                    //轮播区域
                    this.swiper = new Swiper('.swiper-container', {
                        autoplay: false,
                        initialSlide: active_index,
                        direction: 'horizontal',
                        loop:false,
                        observer: true,
                        observeParents: true
                    })
                    this.swiper.on('onSlideChangeEnd', () => {
                        this.current_swiper = this.swiper.activeIndex+1;
                        //轮播图发生改变后根据下边查询数据状态
                        this.collection_false = this.new_exercises_data.Subjects[this.current_swiper-1].selected
                    })
                })

            } } );
            return;
        }else{
        	//数据请求
	        testReport({
	            data: { Sheet_Id: id,StudentId:StudentId }
	        }).then( (test_obj={Sheet:{}})=>{
	            test_obj.Sheet = test_obj.Sheet||{};
	            test_obj.Sheet.Examinations = test_obj.Sheet.Examinations||[];
	            var _states = test_obj.Sheet.Examinations[0]||{};
	            this.Examination_Id = _states.ExaminationId;
	            
	            //tryAgin 表明是否为再做一次    如果为空状态不为1 则为再做一次  
	            if(_states.State==1 && !tryAgin){   //如果是做过的 去解析页面
	//                 this.$router.replace({path: '/testReport?id='+id });
	                    this.$router.push({  //核心语句
					        path:'/testReport',   //跳转的路径
					        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					          sheetId:this.$route.query.sheetId || '',
					          StudentId:this.$route.query.StudentId||'', //临时保存在全局的state中
					          ExaminationId:this.$route.query.ExaminationId||''
					        }
					      })
	                   return;
	            }else if(_states.State==2){//继续做题 第二次进来
	            	this.tryGo = true; //二期再上
	            }
	            
	            
	            this.getNewExercises( { data:{id:id,UserId:StudentId}, test_obj, cb: (res)=>{    //回调
	                let active_index = (res.current_swiper*1||0);
	                this.current_swiper = active_index+1;
	                this.collection_false = this.new_exercises_data.Subjects[this.current_swiper-1].selected;
	                this.$nextTick(() => {
	                    //轮播区域
	                    this.swiper = new Swiper('.swiper-container', {
	                        autoplay: false,
	                        initialSlide: active_index,
	                        direction: 'horizontal',
	                        loop:false,
	                        observer: true,
	                        observeParents: true
	                    })
	                    this.swiper.on('onSlideChangeEnd', () => {
	                        this.current_swiper = this.swiper.activeIndex+1;
	                        this.collection_false = this.new_exercises_data.Subjects[this.current_swiper-1].selected
	                    })
	                })
	
	            } } );
	        })
	    }
    },
    computed: {
        ...mapState(['new_exercises_data','studentId','flags','new_exercises_data_submint','special_chart']),
        ...mapGetters(['answercard_new_exercise','set_screenResize','set_screenResizeIos','set_special_chart']),
		

		typeOptions(){
			return FilterType(this.new_exercises_data)
		},

		
        handle_show3(){
            const { handle, handle_3, current_swiper, new_exercises_data } = this;
            if(!new_exercises_data.Subjects || new_exercises_data.Subjects.length==0){
                return false;
            }
            let subjectCategory = new_exercises_data.Subjects[current_swiper-1].SubjectCategory;
            subjectCategory = ( subjectCategory!=1 && subjectCategory!=2 && subjectCategory!=9 );   //是不是在答题中
            return ( handle == -2 && handle_3 != -2 && subjectCategory && false);//后缀false为了让其始终不显示后期如有改动去掉即可
        },
    },
    methods:{
        ...mapActions(['getNewExercises','anserShowAndHidden']),
        //提交时是否显示题目未做完提示框
    	quickSubmit(){
    		//特殊字符
    		if(this.set_special_chart){
        		return false
        	}
    		
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
    			//调用答题卡内的提交练习正式提交
    			this.$refs.exerciseCard.submits();
    		}
    	},
    	//弹出层点击事件调用子组件提交
    	Submits(){
    		//调用答题卡内的提交练习正式提交
			this.$refs.exerciseCard.submits();
    	},
		 //取消暂停一下
	    closeMask(){
	        //隐藏点击返回时的图层
	       this.card_sub_status = 0;
	    },
	    // 答题卡控制
        showAnswerCard( num ){  
        	if(this.set_special_chart){
        		return false
        	}
            //显示答题卡  并禁止滑动
            if(this.swiper){
					this.swiper.unlockSwipeToNext();
					this.swiper.unlockSwipeToPrev();
                if( typeof num != 'undefined' ){
                	this.anserShowAndHidden(false)
                    this.swiper.slideTo( num,0);
                    this.current_swiper = num+1;
                }else{
                    this.swiper.slideTo(this.current_swiper-1);
                   
                }
                this.anserShowAndHidden(!this.flags)
                //控制答题卡的显示与隐藏
                this.answer_card_show= !this.answer_card_show;
                //控制收藏按钮的切换--通过state   请求过来的数据
                this.collection_false = this.new_exercises_data.Subjects[this.current_swiper-1].selected
            }
        },

        

        outHandle(_t){
            if(_t!=3){
                this.handle = -2;  //去除提示
                setLocalSto('app_handle', -2);
            }else{
                this.handle_3 = -2;  //去除提示
                setLocalSto('app_handle3', -2);
            }
        },
        //直接提交练习---子组件向父组件传值
        callBackParent(event){
        	if(event){
        		this.retreat_sub= true;
	           	this.$refs.retreat_error.innerHTML = '提交成功！'
	    		setTimeout(()=>{
	    			this.retreat_sub= false;
	    		},1500);
        	}else{
        		this.retreat_sub= true;
	           	this.$refs.retreat_error.innerHTML = '网络错误！'
	    		setTimeout(()=>{
	    			this.retreat_sub= false;
	    		},1500);
        	}
        	
        },
        //结束考试(提交)
	    submit(){
            this.card_sub_status = 2;  //正在提交...
            let ReviewTime = this.$moment().format('YYYY-MM-DD h:mm:ss');
            //let reseve_obj = {...this.answercard_new_exercise } ;//原来的  由于gettets 获得故不能操作换为下一行state
            let reseve_obj = {...this.new_exercises_data_submint } ;
            reseve_obj.LastReviewTime = ReviewTime;
            reseve_obj.StudentId = this.$route.query.StudentId || '';
			reseve_obj.State = 2;
//          let ExaminationId = 'ED825671-F34E-49C2-A904-5CEE4894BFCF'||this.$route.query.ExaminationId;

            let ExaminationId = this.$route.query.ExaminationId|| this.Examination_Id ||'';
			
            let sub_obj = {
            	data:reseve_obj,
            	type:"post"
            }
            if(this.tryGo){  //更新
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
//          console.log(sub_obj)
            subHomework(sub_obj).then(res=>{
             if(res.statusCode == 200){
             	
                this.card_sub_status = 0;
                //判断设备是ios还是Android
	            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	                 //原声返回
                	window.webkit.messageHandlers.backAct.postMessage(null);
	            } else if (/(Android)/i.test(navigator.userAgent)) {
	            	javascript:onKeyBackPressed.onKeyBackPressed(true);
	            } else { 
	            
	            };
             }else{
               	this.card_sub_status = 0;
               	this.retreat_sub= true;
               	this.$refs.retreat_error.innerHTML = '网络错误'
        		setTimeout(()=>{
        			this.retreat_sub= false;
        		},1500);
               }
            }).catch( err => {
                	//判断设备是ios还是Android
		            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		                 //原声返回
	                	window.webkit.messageHandlers.backAct.postMessage(null);
		            } else if (/(Android)/i.test(navigator.userAgent)) {
		            	javascript:onKeyBackPressed.onKeyBackPressed(true);
		            } else { 
		            
		            };
            })
            
        },
        // 答题卡
        cardSubStatus(){
        	//特殊字符
    		if(this.set_special_chart){
        		return false
        	}
    		
            if(this.new_exercises_data.already_get){ //数据加载完成
                let subject_Id = this.new_exercises_data.Subjects[this.current_swiper-1].SubjectId;
                this.card_sub_status = 3;
                this.$store.commit('setNewExercisesState', {name: 'State', value: 2}); //临时保存状态
                this.$store.commit('setNewExercisesState', {name: 'SubjectIdLocation', value: subject_Id}); //临时保存状态
            }
        },
        
        //手势提示框---针对填空简答的题型
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
		//此时只是模拟 -后需要将其操作放在接口调用成功的回调中
		collection_yes(){
			
			if(this.set_special_chart){
        		return false
        	}
			
			//声明一个空对象来提交给后台
			let collection_obj = {};
			//获取学生studentId / SheetId
			collection_obj.studentId = this.$route.query.StudentId || '';
			collection_obj.sheetId = this.$route.query.sheetId || '';;
			collection_obj.subjectId = this.new_exercises_data.Subjects[this.current_swiper-1].SubjectId || '';
			collection_obj.subjectCategory = this.new_exercises_data.Subjects[this.current_swiper-1].SubjectCategory || '';
			collection_obj.type = 1;//  1 收藏  0 错题集
			collection_obj.isDelete = !this.collection_false;
			//调用收藏接口API
			collectionOrAndNo({
				data: collection_obj,
            	type: "post"
			}).then(res =>{
				if(res.statusCode == 200){
					//改变当前收藏标记状态
					this.collection_false = !this.collection_false;
					//改变对应标题的状态
		            if(this.new_exercises_data.Subjects[this.current_swiper-1].SubjectId){
		            	this.new_exercises_data.Subjects.forEach((item,index)=>{
		            		if(item.SubjectId == this.new_exercises_data.Subjects[this.current_swiper-1].SubjectId){
		            			this.new_exercises_data.Subjects[index].selected = !this.new_exercises_data.Subjects[index].selected
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
    components:{
        single,
        multiple,
        fillBlack,
        oneAnswer,

        answerCard,
    }

}
</script>

<style lang="less">
	.practice_c_new {
        .practice_setion{
            height: 100%;
            box-sizing: border-box;
            padding-top: 0.82rem;
            position: relative;
        }
        
       .practice_v_html *{
        	font-family: "Arial","PingFang SC","Microsoft YaHei","SimSun","sans-serif"!important;
        	word-wrap: break-word !important;
    		line-height: 0.56rem !important;
   			font-size: 0.32rem !important;    	
        }

		/* 页面显示 隐藏 元素 */
		.practice_test{
			height: 100%;
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
				    .practice_yes {color: #2C8CFF;border-left: 1px solid #e5e5e5;;}
				    .practice_specise{
	            	color: #fc6668;
	                float: left;
	                width: 100%;
	                height: 0.78rem;
	                line-height: 0.78rem;
	                border-top: 1px solid #cccccc;
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
		.toast_loading {
			display: block;
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

	    /*  暂停图层--start */
	  	.practice_stop{
	        background: rgba(0,0,0,0.7);
	        // opacity: 0.7;
	        position: fixed;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        z-index: 99999;
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
	    /**L****   首次进入显示提示 左右滑动   *****/
	   .practice_handle{
		   	background: rgba(0,0,0,0.7);
		   	position: fixed;
		    top: 0;
		    left: 0;
		    width: 100%;
		    height: 100%;
		    z-index: 99999!important;

       }
       .practice_confirm_img{
            background-image: url(../../common/imgs/handle.png);
            background-repeat: no-repeat;
            background-position: center;
            background-position-y: -0.36rem;
            width: 100%;
            height: 100%;
            background-size:100% auto;
        }
        .practice_submit_img{
        	background-image: url(../../common/imgs/submit_icon.png);
            background-repeat: no-repeat;
            background-position: center;
            background-position-y: -0.38rem;
            width: 100%;
            height: 100%;
            background-size:100% auto;
        }
        .practice_collection_img{
        	background-image: url(../../common/imgs/handle_collection_icon.png);
            background-repeat: no-repeat;
            background-position: center;
            background-position-y: -0.36rem;
            width: 100%;
            height: 100%;
            background-size:100% auto;
        }
        .practice_confirm_answercard{
            background-image: url(../../common/imgs/handle_answercard.png);
            background-repeat: no-repeat;
            background-position-y: -0.38rem;
            background-position-x: 0.01rem;
            width: 100%;
            height: 100%;
            background-size:100% auto;
        }
	    /**L****   首次进入显示提示  跳转答题卡   *****/
	    .practice_handle_ansercard{
		   	background: rgba(0,0,0,0.7);
		   	position: fixed;
		    top: 0;
		    left: 0;
		    width: 100%;
		    height: 100%;
		    z-index: 99999;
        }
        .practice_confirm_noChoice{
            width: 100%;
            height: 100%;
            background:url(../../common/imgs/answerd_target.png) no-repeat bottom;
            
            background-size:100%;
        }

	    /**L****   首次进入显示提示 非选择题   *****/
	    .practice_noChoice{
		   	background: rgba(0,0,0,0.7);
		   	position: fixed;
		    top: 0;
		    left: 0;
		    width: 100%;
		    height: 100%;
		    z-index: 99999;
	    }
	    /*-- 回退按钮 弹出层  start---*/
		.practice_hand{
	        background: rgba(0,0,0,0.7);
	        // opacity: 0.7;
	        position: fixed;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        z-index: 99999;
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
	            .practice_specise{
	            	color: #fc6668;
	                float: left;
	                width: 100%;
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
		.swip_practice {
			height: 100%;
			.swiper-container{
				height: 100%;
				.swiper-slide{
					height: 100%!important;
					position: relative;
					overflow-x: hidden;
					zoom: 1;
					overflow-y: hidden!important;

				}
			}
        }

        

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
            border-bottom: .01rem solid #DDDDDD;
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
                font-size: 0.28rem;
                line-height: .83rem;
                .current_num{
                    color: #2C8CFF;
                }
            }
        }





	}
</style>
