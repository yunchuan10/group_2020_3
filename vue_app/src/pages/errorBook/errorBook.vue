<template>

	<div class="practice_c check_contain_not_footer " ref='testreport'>
		<div class="practice_test">
            <!-- 练习报告-返回首页 -->
            <div >
	            <!-- 试题-->
	            <v-header v-if="!answer_card_show"  :header_title="''" >
	                <div class="header_back" slot="left_back" @click="cardSubStatusSub()"><span class="header_back_span"></span></div>
	                <div class="header_right header_right_error" slot="right_box">
	               		<div  class="header_answerd"  @click="leftAnswerCard()"></div>
	               		<!--收藏取消-->
	               		<div :class="collections_false ? 'new_exercise_collect' : 'new_exercise_unCollect'"  @click ="collection_cancel"></div>
	               		<!--收藏按钮-->
	               		<div class="new_exercise_del" @click ="collection_del"></div>
	                </div>
	            </v-header>
            </div>

            <!-- 加载 -->
            <v-loading ref="loading"  v-if="!new_exercises_analysis.already_get"></v-loading>
            <!-- 练习内容 -->
            <div class="practice_setion" v-if="new_exercises_analysis.already_get">
                <!-- 内容区 标题 -->
                <div class="practice_h c_padding">
                    <h3 class="practice_top_left" v-text="SheetName"></h3>
                    <div class="practice_top_right">
                        <span class="current_num">{{current_swiper}}</span>/<span class="con_top_right">{{new_exercises_analysis.Subjects.length}}</span>
                        
                    </div>
                </div>
                <!-- 可滚动区域 -->
                <div class="swip_practice" >
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                            <!-- 滚动列表 -->
                            <div class="swiper-slide" v-for="(item,index) in new_exercises_analysis.Subjects" :key="index" >

                                <!-- 单选, 判断 -->
                                <single v-if="item.SubjectCategory==1||item.SubjectCategory==9" :item="item"></single>
                                <!-- 多选 -->
                                <multiple v-else-if="item.SubjectCategory==2" :item="item"></multiple>
                                <!-- 填空 -->
                                <fillBlack  v-else-if="item.SubjectCategory==6" :item="item"></fillBlack>
                                <!-- 问答等一个回答的 -->
                                <oneAnswer  v-else-if="item.SubjectCategory==3||item.SubjectCategory==7||item.SubjectCategory==10||item.SubjectCategory==11" :item="item"></oneAnswer>


                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- 上下题 -->
            <div class="course_check_c bc_base2" v-show="footHiddenOrshow">
                <p @click="swiperPrev()" :class="(( current_swiper == 1 || new_exercises_analysis.Subjects.length ==0) ? 'btn_left' : 'btn_left_pre')"><span :class="(( current_swiper ==1 || new_exercises_analysis.Subjects.length ==0) ? 'btn_pre_unChecked ' : 'btn_pre')"></span>上一题</p>
                <p @click="swiperNext()" :class="{ btn_left : current_swiper >= new_exercises_analysis.Subjects.length }">
                	<span  v-text="(( current_swiper < new_exercises_analysis.Subjects.length || new_exercises_analysis.Subjects.length==0) ? '下一题' : '下一题')"></span>
                	<span class="btn_next" :class="(current_swiper < new_exercises_analysis.Subjects.length ? 'btn_next' : 'btn_next_unChecked')"></span></p>
            </div>
			<!--正在交卷retreat-->
		    <div v-show="retreat_sub" ref="retreat_error" class="toast_test"></div>
            <!--<v-confirm v-show="card_sub_status==1" :msg="'确定临时保存练习并离开页面？'" @confirmCas=" ()=>{card_sub_status=0} " @confirmSuc="submit()"></v-confirm>-->
			<!--首次进入显示提示 左右滑动-->
            <div class="practice_handle" v-show=" handle != -2 && new_exercises_analysis.Subjects.length>0" >
                <div v-show="handle==0" class="practice_cancle_img" @click="outHandle"></div>
            </div>
        </div>

        <!-- 答题卡 -->
        <collectionCard  @touchmove.stop="" @showAnswerCard="showAnswerCard"  @answershowAnswer= "answershowAnswer" v-show="answer_card_show" :answer_card_show='answer_card_show' :SheetName='SheetName'></collectionCard>


	</div>
</template>

<script>

import Swiper from 'swiper';
import { mapState, mapGetters, mapActions } from 'vuex';
import { getLocalSto, setLocalSto} from '../../common/js/utils.js'
import { collection,collectionOrAndNo} from '../../api'


// 单选 判断
import single from '../../components/errorBook/single'
// 多选
import multiple from '../../components/errorBook/multiple'
// 填空
import fillBlack from '../../components/errorBook/fillBlack'
// 问答
import oneAnswer from '../../components/errorBook/oneAnswer'

// 答题卡
import collectionCard from './errorBookCard.vue'

export default {
    name: 'new-practice',
    data() {
        return {
            answer_card_show: false,  // 作业报告和题目切换
            swiper: null,       //轮播
            current_swiper: 1,
            card_sub_status: 0,
            //首次进入答题进行手势提示--->>暂时隐藏 现在缺少判断字段
            handle: -2,  // -2不显示
            handle_3: -2,   //答题提示   
            footHiddenOrshow:false,//解析底部按钮是否显示
            collections_false:false,//是否收藏
            SheetName:'',//标题
            retreat_sub:false,//收藏提示
        }
    },
    created(){
    	
        //页面加载时获取练习
        const id = this.$route.query.sheetId || '';
        const StudentId = this.$route.query.StudentId || '';
        
        let _handle = getLocalSto('app_handle_error') || 0, handle_3 = getLocalSto('app_handle3_error') || 0;
        if(_handle!=-2){ this.handle = 0; }
        if(handle_3!=-2){ this.handle_3 = 0; }
		
		
		let obj_r = {};
        obj_r.courseId = this.$route.query.courseId || '' ;
        obj_r.studentId = this.$route.query.StudentId || '';
        obj_r.subjectCategory = this.$route.query.subjectCategory || 1;
        obj_r.type = this.$route.query.type || 0
        
		//调用action动作进行数据请求
        this.error_Actions( { data:obj_r, cb: (res)=>{    //回调
                let active_index = 0;  // 默认第一道题
                this.current_swiper = active_index+1;
                //初始数据时收藏显示状态
               
                this.collections_false = this.new_exercises_analysis.Subjects[this.current_swiper-1].selected;
                //试题名称
                this.SheetName = this.new_exercises_analysis.Subjects[this.current_swiper-1].SheetName;
                //显示答题卡时当前题目序号
                this.$store.commit('error_number', { value: this.current_swiper}); //临时保存状态
               
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
                        this.collections_false = this.new_exercises_analysis.Subjects[this.current_swiper-1].selected;
                        //试题名称
                		this.SheetName = this.new_exercises_analysis.Subjects[this.current_swiper-1].SheetName;
                    	//显示答题卡时当前题目序号
                		this.$store.commit('error_number', { value: this.current_swiper}); //临时保存状态
                    })
                })

            } 
        });
    },
    computed: {
        new_exercises_analysis(){
        	return this.$store.state.error_analysis
        }
    },
    
    methods:{
        ...mapActions(['error_Actions','errorBookDel']),

        showAnswerCard( num ){  // 答题卡控制
            //显示答题卡  并禁止滑动
            if(this.swiper){
                if( typeof num != 'undefined' ){
                    this.swiper.slideTo( num,false);
                    this.current_swiper = num+1;
                }else{
                    this.swiper.slideTo(this.current_swiper-1,false);
                }
                this.answer_card_show= !this.answer_card_show;
                 //控制收藏按钮的切换--通过state   请求过来的数据
                this.collections_false = this.new_exercises_analysis.Subjects[this.current_swiper-1].selected;
                //试题名称
                this.SheetName = this.new_exercises_analysis.Subjects[this.current_swiper-1].SheetName;
                //显示答题卡时当前题目序号
                this.$store.commit('error_number', { value: this.current_swiper}); //临时保存状态
            }
        },
        // 答题卡
        leftAnswerCard(){
        	this.footHiddenOrshow = false;//底部按钮
    		this.$refs.testreport.style.paddingBottom=0.98+'rem';
        	this.answer_card_show= !this.answer_card_show;
        },
        // 答题卡关闭
        answershowAnswer(state){
        	this.answer_card_show = false;
        },
 	   //关闭答题卡
    	close(){
			this.answer_card_show = false;
       	},
        // 上下题切换
        swiperPrev(){
            this.swiper && this.swiper.slidePrev();
        },
        swiperNext(){
            if(this.current_swiper >= this.new_exercises_analysis.Subjects.length){
//              this.showAnswerCard();
            }else{
                this.swiper && this.swiper.slideNext();
            }
        },
        outHandle(_t){
            if(_t!=2){
                this.handle = -2;  //去除提示
                setLocalSto('app_handle_error', -2);
            }else{
                this.handle_3 = -2;  //去除提示
                setLocalSto('app_handle3_error', -2);
            }
        },
        // 答题卡
        cardSubStatus(){
    	    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                 //原声返回
            	window.webkit.messageHandlers.backAct.postMessage(null);
            } else if (/(Android)/i.test(navigator.userAgent)) {
            	javascript:onKeyBackPressed.onKeyBackPressed(true);
            } else { 
//             this.$router.go(0);  // 强制刷新页面
            };
			
        },
        // 错题集左上角的返回按钮 点击返回App
        cardSubStatusSub(){
            //点击返回App
            //判断设备是ios还是Android
	            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	                 //原声返回
                	window.webkit.messageHandlers.backAct.postMessage(null);
	            } else if (/(Android)/i.test(navigator.userAgent)) {
	            	javascript:onKeyBackPressed.onKeyBackPressed(true);
	            } else { 
	            
	            };
        },
        //错题集删除错题
        collection_del(){
        	//声明一个空对象来提交给后台
			let collection_obj = {};
			//获取学生studentId / SheetId
			collection_obj.studentId = this.$route.query.StudentId || '';
			collection_obj.sheetId = this.new_exercises_analysis.Subjects[this.current_swiper-1].SheetId || '';;
			collection_obj.subjectId = this.new_exercises_analysis.Subjects[this.current_swiper-1].SubjectId || '';
			collection_obj.subjectCategory = this.new_exercises_analysis.Subjects[this.current_swiper-1].SubjectCategory || '';
			collection_obj.type = 0;//  1 收藏  0 错题集
			collection_obj.isDelete = false;
			//调用收藏接口API
			collectionOrAndNo({
				data: collection_obj,
            	type: "post"
			}).then(res =>{
				//删除成功
				if(res.statusCode == 200){
					for(let i = this.new_exercises_analysis.Subjects.length -1;i>=0;i--){
						if(this.new_exercises_analysis.Subjects[i].SubjectId == this.new_exercises_analysis.Subjects[this.current_swiper-1].SubjectId ){
							this.new_exercises_analysis.Subjects.splice(i,1);
							this.errorBookDel(this.new_exercises_analysis)
							if(this.current_swiper >= this.new_exercises_analysis.Subjects.length){
								this.current_swiper = this.new_exercises_analysis.Subjects.length;
								this.swiper_change(this.current_swiper);
								//提示删除错题成功
								this.retreat_sub= true;
				               	this.$refs.retreat_error.innerHTML = '删除成功';
				        		setTimeout(()=>{
				        			this.retreat_sub= false;
				        		},1500);
				        		//防止多删除
								return ;
							}else if(this.current_swiper == 1){
								//左边界
								this.current_swiper=1;
								this.swiper_change(this.current_swiper);
								//提示删除错题成功
								this.retreat_sub= true;
				               	this.$refs.retreat_error.innerHTML = '删除成功';
				        		setTimeout(()=>{
				        			this.retreat_sub= false;
				        		},1500);
				        		//防止多删除
				        		return ;
							}
							
						}
					}
				}else{
					this.retreat_sub= true;
	               	this.$refs.retreat_error.innerHTML = '请刷新重试';
	               	this.$forceUpdate();
	        		setTimeout(()=>{
	        			this.retreat_sub= false;
	        		},1500);
				}
			})
        },
        
        //监听this.current_swiper 如果他发生改变即重新检测数据中是否收藏属性
		swiper_change(index) {
			if(this.new_exercises_analysis.Subjects.length !== 0){
				this.collections_false = this.new_exercises_analysis.Subjects[index-1].selected;
				//试题名称
                this.SheetName = this.new_exercises_analysis.Subjects[this.current_swiper-1].SheetName;
				 //显示答题卡时当前题目序号
                this.$store.commit('error_number', { value: this.current_swiper}); //临时保存状态
			}else{
				//收藏置空
				this.collections_false = false
				//当错题集内试题数量为空时，返回app
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
        
		//collection_cancel 收藏题目与否
		collection_cancel(){
			//声明一个空对象来提交给后台
			let collection_obj = {};
			//获取学生studentId / SheetId
			collection_obj.studentId = this.$route.query.StudentId || '';
			collection_obj.sheetId = this.new_exercises_analysis.Subjects[this.current_swiper-1].SheetId || '';;
			collection_obj.subjectId = this.new_exercises_analysis.Subjects[this.current_swiper-1].SubjectId || '';
			collection_obj.subjectCategory = this.new_exercises_analysis.Subjects[this.current_swiper-1].SubjectCategory || '';
			collection_obj.type = 1;//  1 收藏  0 错题集
			collection_obj.isDelete = !this.collections_false;
			//调用收藏接口API
			collectionOrAndNo({
				data: collection_obj,
            	type: "post"
			}).then(res =>{
				if(res.statusCode == 200){
					//改变当前收藏标记状态
					this.collections_false = !this.collections_false;
					//改变对应标题的状态
					if(this.new_exercises_analysis.Subjects[this.current_swiper-1].SubjectId){
		            	this.new_exercises_analysis.Subjects.forEach((item,index)=>{
		            		if(item.SubjectId == this.new_exercises_analysis.Subjects[this.current_swiper-1].SubjectId){
		            			this.new_exercises_analysis.Subjects[index].selected = !this.new_exercises_analysis.Subjects[index].selected
		            		}
		            	})
		            }
					this.retreat_sub= true;
	               	this.$refs.retreat_error.innerHTML = this.collections_false ? '收藏成功' : '取消收藏';
	        		setTimeout(()=>{
	        			this.retreat_sub= false;
	        		},1500);
				}else{
					this.retreat_sub= true;
	               	this.$refs.retreat_error.innerHTML = '收藏失败,稍后重试';
	        		setTimeout(()=>{
	        			this.retreat_sub= false;
	        		},1500);
				}
			})
			

			
		},
		
	   //页面初始化时
		initPage(){
			this.collections_false = this.new_exercises_analysis.Subjects[this.current_swiper-1].selected;
			//试题名称
            this.SheetName = this.new_exercises_analysis.Subjects[this.current_swiper-1].SheetName;
			 //显示答题卡时当前题目序号
                this.$store.commit('error_number', { value: this.current_swiper}); //临时保存状态
		}
    },
    
    components:{
        single,
        multiple,
        fillBlack,
        oneAnswer,
        collectionCard,
    }

}
</script>

<style lang="less">
	.practice_c {
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
	    /**L****   首次进入显示提示 左右滑动   *****/
	   .practice_handle{
		   	background: rgba(0,0,0,0.7);
		   	position: fixed;
		    top: 0;
		    left: 0;
		    width: 100%;
		    height: 100%;
		    z-index: 9999;

       }
       .practice_confirm_img{
            background-image: url(../../common/imgs/handle.png);
            background-repeat: no-repeat;
            background-position: center;
            width: 100%;
            height: 100%;
            background-size:100% auto;
        }
        .practice_confirm_answercard{
            background-image: url(../../common/imgs/handle_answercard.png);
            background-repeat: no-repeat;
            background-position-y: -0.38rem;
            width: 100%;
            height: 100%;
            background-size:100% auto;
        }
        .practice_cancle_img{
        	background-image: url(../../common/imgs/errorBook_handle_icon.png);
            background-repeat: no-repeat;
            background-position-y: -0.375rem;
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
		    z-index: 999;
        }
        .practice_confirm_noChoice{
            width: 100%;
            height: 100%;
            background:url(../../common/imgs/answerd_target.png) no-repeat center;
            background-size:100% auto;
        }

	    /**L****   首次进入显示提示 非选择题   *****/
	    .practice_noChoice{
		   	background: rgba(0,0,0,0.7);
		   	position: fixed;
		    top: 0;
		    left: 0;
		    width: 100%;
		    height: 100%;
		    z-index: 999;
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
        .course_check_c {
                height: .98rem;
		        position: fixed;
		        z-index: 99;
		        width: 100%;
		        left: 0;
		        bottom: 0;
				.display(flex);
				justify-content: space-between;
				line-height: .98rem;
				box-sizing: border-box;
				padding:0 0.3rem;
				border-top:0.01rem solid #ddd;
            span{
                display: inline-block;
            }
            p.btn_left{color: #DDDDDD;
            	span.btn_next{
            
            		background: url(../../common/imgs/next_gray.png) no-repeat center!important;
					background-size: 5px 9px!important;
					margin-left: 0.2rem;
					display: inline-block;
					width:0.1rem ;
					height:0.18rem;
            	}
            }
    
            P.btn_left_pre{/*color: #999;*/}
            span.btn_pre{
                    background: url(../../common/imgs/pre.png) no-repeat center;
					background-size: contain;
					margin-right: 0.2rem;
					display: inline-block;
					width:0.1rem ;
					height:0.18rem;
            }
            span.btn_pre_unChecked{
                    background: url(../../common/imgs/pre_unChecked.png) no-repeat center;
					background-size: contain;
					color: #ddd;
					margin-right: 0.2rem;
					display: inline-block;
					width:0.1rem ;
					height:0.18rem;
            }
            span.btn_next{
                    background: url(../../common/imgs/next.png) no-repeat center;
					background-size: contain;
					margin-left: 0.2rem;
					display: inline-block;
					width:0.1rem ;
					height:0.18rem;
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