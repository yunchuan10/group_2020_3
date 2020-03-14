<template>
	<div>
		<v-header :header_title="new_test_data.SheetName"></v-header>
		<div class="body_c">
			<div class="w1200 " v-show="!test_submit_sucess">
				<div class="exercise_top" ref="exercise_top">
					<div class="exercise_fl">
						<div class="exercise_title">{{ new_test_data.SheetName }}</div>
						<div class="exercise_count">
							<span>总分数: {{ new_test_data.TotalScore}} 分</span>
							<span v-show="new_test_data.Timing != 0">限时: {{ new_test_data.Timing }} 分钟</span>
							<span>共 {{ new_test_data.Subjects.length }} 道题</span>
						</div>
					</div>
					<div class="exercise_fr green normal-btn">答题中</div>
					<div class="exercise_nav_out">
						<ul class="exercise_nav" ref="exercise_nav" style="z-index: 9;">
							<li @click="jumpNav" v-if="isSubjects.isSubject1" ref="exercise_nav_li_0">单选</li>
							<li @click="jumpNav" v-if="isSubjects.isSubject2" >多选</li>
							<li @click="jumpNav" v-if="isSubjects.isSubject9" >判断</li>
							<li @click="jumpNav" v-if="isSubjects.isSubject6" >填空</li>
							<li @click="jumpNav" v-if="isSubjects.isSubject3" >问答</li>
							<li @click="jumpNav" v-if="isSubjects.isSubject7" >名词解释</li>
							<li @click="jumpNav" v-if="isSubjects.isSubject10" >案例分析</li>
							<li @click="jumpNav" v-if="isSubjects.isSubject11" >讨论题</li>
						</ul>
					</div>
				</div>
				<div class="exercise_content " style="min-height: 20px;" ref="exercise_content_top">
					<div class="swiper-slide exercise-report " v-if="isSubjects.isSubject1" >
						<!--单选 -->
						<p class="exercise_content_title"><span class="content_num_title"></span>、单选题 ( {{ countAndNumber.isSubject1_num}} 道) </p>
						<single  v-for="(item,index) in new_test_data.Subjects" v-if="item.SubjectCategory == 1 " :item="item" :index="index+1"  :id="index+1" :key="index"></single>
					</div>
					<div class="swiper-slide exercise-report " v-if="isSubjects.isSubject2" >
						<!--多选-->
						<p class="exercise_content_title"><span class="content_num_title"></span>、多选题 ( {{ countAndNumber.isSubject2_num}} 道) </p>
						<multiple v-for="(item,index) in new_test_data.Subjects"  v-if="item.SubjectCategory == 2" :item="item" :index="index+1"  :id="index+1" :key="index"></multiple>
					</div>
					<div class="swiper-slide exercise-report " v-if="isSubjects.isSubject9"  >
						<!--判断-->
						<p class="exercise_content_title"><span class="content_num_title"></span>、 判断题 ( {{ countAndNumber.isSubject9_num}} 道) </p>
						<single v-for="(item,index) in new_test_data.Subjects" v-if="item.SubjectCategory == 9" :item="item" :index="index+1"  :id="index+1" :key="index"></single>
					</div>
					<div class="swiper-slide exercise-report " v-if="isSubjects.isSubject6"  >
						<!--填空-->
						<p class="exercise_content_title"><span class="content_num_title"></span>、填空题 ( {{ countAndNumber.isSubject6_num}} 道) </p>
						<fillBlack v-for="(item,index) in new_test_data.Subjects" v-if="item.SubjectCategory == 6" :item="item" :index="index+1"  :id="index+1" :key="index"></fillBlack>
					</div>
					<div class="swiper-slide exercise-report " v-if="isSubjects.isSubject3" >
						<!--问答-->
						<p class="exercise_content_title"><span class="content_num_title"></span>、问答题 ( {{ countAndNumber.isSubject3_num}} 道) </p>
						<oneAnswer  v-for="(item,index) in new_test_data.Subjects" v-if="item.SubjectCategory == 3" :item="item" :index="index+1"  :id="index+1" :key="index"></oneAnswer>
					</div>
					<div class="swiper-slide exercise-report " v-if="isSubjects.isSubject7"  >
						<!--名词解释-->
						<p class="exercise_content_title"><span class="content_num_title"></span>、名词解释 ( {{ countAndNumber.isSubject7_num}} 道) </p>
						<oneAnswer v-for="(item,index) in new_test_data.Subjects"  v-if="item.SubjectCategory == 7" :item="item" :index="index+1"  :id="index+1" :key="index"></oneAnswer>
					</div>
					<div class="swiper-slide exercise-report " v-if="isSubjects.isSubject10" >
						<!--案例分析-->
						<p class="exercise_content_title"><span class="content_num_title"></span>、案例分析  ( {{ countAndNumber.isSubject10_num}} 道) </p>
						<oneAnswer v-for="(item,index) in new_test_data.Subjects" v-if="item.SubjectCategory == 10" :item="item" :index="index+1"  :id="index+1" :key="index"></oneAnswer>
					</div>
					<div class="swiper-slide exercise-report " v-if="isSubjects.isSubject11" >
						<!--讨论题-->
						<p class="exercise_content_title"><span class="content_num_title"></span>、讨论题 ( {{ countAndNumber.isSubject11_num}} 道) </p>
						<oneAnswer v-for="(item,index) in new_test_data.Subjects"  v-if="item.SubjectCategory == 11" :item="item" :index="index+1"  :id="index+1" :key="index"></oneAnswer>
					</div>
				</div>
				<!-- 答题卡 -->
        		<answer-card ref="exerciseCard" :timetext="timetext" :getTime = 'getTime' v-show="!test_submit_sucess"></answer-card>
        		<v-confirm-s v-show="timing_starts == 1" @confirmSuc="timingStarts()"></v-confirm-s>
        		<alert-td v-show="alert_td" @confirmSuc="testEnd()"></alert-td>
			</div>
			<div class="w1200 test-sucess" v-show="test_submit_sucess">
				<br/><br/><br/><br/><br/><br/><br/><br/>
				<h3 style="margin-bottom: 30px;font-size: 20px;">当前考试尚未结束，暂时无法查看考试结果，请耐心等待老师发布考试结果。</h3>
				<a class="ipbtn submit-btn" href="#">关闭页面</a>
			</div>
		</div>
		<v-footer></v-footer>
	</div>
</template>
<script>
	import { mapActions , mapState } from 'vuex';
	// 单选 判断
	import single from '../../components/test/single'
	// 多选
	import multiple from '../../components/test/multiple'
	// 填空
	import fillBlack from '../../components/test/fillBlack'
	// 问答
	import oneAnswer from '../../components/test/oneAnswer'
	// 答题卡
	import answerCard from './answer-card'
	export default {
		name: 'test',
	    data(){
	        return {
	        	//url 上获取ID
		        data:{},
		        //计时器 相关
			    testTimeSencond: -2,
			    //结束时间
	            endTime:'',
	            //当前时间
	            nowTime:'',
	            //延时器
	            int: Function,
	            //时间
	            times:0,
	            //开始开始
	            timing_starts:1,
	            //考试时间结束
	            alert_td:false
	        }
	    },
	    created(){
	    	var id =  this.$route.query.id || '';
			var UserId = this.$route.query.UserId || '';
			this.getNewTest( { data:{id:id,UserId:UserId}, test_obj:'', cb: (res)=>{    //回调
	              this.$nextTick(() => { 
	              	//第一种类型的试题被选中exercise_nav_li_0
				    this.$refs.exercise_nav_li_0.style.background ='#3366cc';
					this.$refs.exercise_nav_li_0.style.color ='#fff';
					//為上面的導航添加自定義屬性data-index
					
					let navs_index = this.$refs.exercise_nav.children || [];
					for(var s = 0 ; s < navs_index.length; s++){
						navs_index[s].setAttribute('data-index',s); 
					};
					//页面题目类型排序
					let arrTitle =  document.querySelectorAll('.content_num_title') || []; // 选择有该类名的所有元素 
					let arrNavs =  document.querySelectorAll('.tit_ul_h3') || []; // 选择有该类名的所有元素 
					let arr_numbers = ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三'];
					arrTitle.forEach((item,index) => item.innerHTML = arr_numbers[index]); 
					arrNavs.forEach((item,index) => item.innerHTML = arr_numbers[index]); 
	              })
	        } } );
	    },
	    computed:{
	    	...mapState(['new_test_data','test_submit_sucess']),
	    	isSubjects(){
        	    //Subject_Score 这道题分数     // Score 我获得的分数
	   			let _arr = this.new_test_data.Subjects || [];
				//相对应题型是否存在
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
	            //对应题型的题目个数和总分值
	            return { isSubject1, isSubject2, isSubject3, isSubject4, isSubject5, isSubject6, isSubject7, isSubject8, isSubject9, isSubject10, isSubject11};
	        },
	        //对应题型的题目个数和总分值====================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        	countAndNumber(){
	        	let _objs = this.new_test_data.Subjects;
	        	let isSubject1_score = 0,isSubject2_score = 0,isSubject3_score = 0,isSubject4_score = 0,isSubject5_score = 0,isSubject6_score = 0
	        		  ,isSubject7_score = 0,isSubject8_score = 0,isSubject9_score = 0,isSubject10_score = 0,isSubject11_score = 0;
	        	let isSubject1_num = 0,isSubject2_num = 0,isSubject3_num = 0,isSubject4_num = 0,isSubject5_num = 0,isSubject6_num = 0
	        		  ,isSubject7_num = 0,isSubject8_num = 0,isSubject9_num = 0,isSubject10_num = 0,isSubject11_num = 0;
	        	_objs.forEach((item,index)=>{
	        		switch( item.SubjectCategory ){
	        			case 1:
	        				isSubject1_score += item.Subject_Score;
	        				isSubject1_num += 1;
	        			break;
	        			
	        			case 2:
	        				isSubject2_score += item.Subject_Score;
	        				isSubject2_num += 1;
	        			break;
	        			
	        			case 3:
	        				isSubject3_score += item.Subject_Score;
	        				isSubject3_num += 1;
	        			break;
	        			
	        			case 4:
	        				isSubject4_score += item.Subject_Score;
	        				isSubject4_num += 1;
	        			break;
	        			
	        			case 5:
	        				isSubject5_score += item.Subject_Score;
	        				isSubject5_num += 1;
	        			break;
	        			
	        			case 6:
	        				isSubject6_score += item.Subject_Score;
	        				isSubject6_num += 1;
	        			break;
	        			
	        			case 7:
	        				isSubject7_score += item.Subject_Score;
	        				isSubject7_num += 1;
	        			break;
	        			
	        			case 8:
	        				isSubject8_score += item.Subject_Score;
	        				isSubject8_num += 1;
	        			break;
	        			
	        			case 9:
	        				isSubject9_score += item.Subject_Score;
	        				isSubject9_num += 1;
	        			break;
	        			
	        			case 10:
	        				isSubject10_score += item.Subject_Score;
	        				isSubject10_num += 1;
	        			break;
	        			
	        			case 11:
	        				isSubject11_score += item.Subject_Score;
	        				isSubject11_num += 1;
	        			break;
	        			default:
	        		}
	        	})
	        	return {
	        		isSubject1_score,isSubject2_score,isSubject3_score,isSubject4_score,isSubject5_score,isSubject6_score,isSubject7_score,isSubject8_score,isSubject9_score,isSubject10_score,isSubject11_score,
	        		isSubject1_num,isSubject2_num,isSubject3_num,isSubject4_num,isSubject5_num,isSubject6_num,isSubject7_num,isSubject8_num,isSubject9_num,isSubject10_num,isSubject11_num
	        	}
        },
        //倒计时
        timetext(){
        	let timetext = '';
        	let { testTimeSencond } = this;
        	if(this.new_test_data && this.new_test_data.Timing == 0){
        		timetext = '不限时'
        	}else{
        		timetext = this.toHms(testTimeSencond);
        	}
        	
        	if( testTimeSencond == -2 ){
        		return '-1';
        	}else{
        		return timetext;
        	}
        }
	    },
	    methods:{
	    	...mapActions(['getNewTest']),
		    	//左侧答题卡
				//滚动条事件
			handleScroll(e){
				//滚动条距离顶部距离
				let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
				let exercise_content_top = this.$refs.exercise_content_top.offsetTop;
				//标题距离右边的距离
		        let exercise_top_rg = document.documentElement.clientWidth - this.$refs.exercise_top.offsetLeft - this.$refs.exercise_top.offsetWidth;
		        if(scrollTop-20 >= exercise_content_top){
					this.$refs.exerciseCard.$el.style.position = "fixed";
		        	this.$refs.exerciseCard.$el.style.right = exercise_top_rg + 'px';
		        	this.$refs.exerciseCard.$el.style.top = 100 + 'px';
		        }else{
		        	this.$refs.exerciseCard.$el.style.position = "static";
		        }
		        //导航栏
		        if(scrollTop > this.$refs.exercise_nav.offsetTop){
		        	this.$refs.exercise_nav.style.position = "fixed";
		        	this.$refs.exercise_nav.style.top = 80 + 'px';
		        	this.$refs.exercise_nav.style.marginTop = 0 + 'px';
		        }else{
		        	this.$refs.exercise_nav.style.position = "static";
		        	this.$refs.exercise_nav.style.marginTop = 20 + 'px';
		        }
		        //各种试题类型答题区域
		        let exerciseReport = document.querySelectorAll('.exercise-report ');
		        for(let i = 1; i < exerciseReport.length ; i++ ){
		        	if( exerciseReport[i].offsetTop < scrollTop+100 ){
		        		this.$refs.exercise_nav.children[i].style.background ='#3366cc';
		        		this.$refs.exercise_nav.children[i].style.color ='#fff';
		        	}else{
		        		this.$refs.exercise_nav.children[i].style.background ='#fff';
		        		this.$refs.exercise_nav.children[i].style.color ='#666';
		        	}
		        } 
		    },
		    //左侧答题卡
			jumpNav (e) {
	        	//导航点击时的元素下标 === 元素的自定义属性
	        	let index = e.target.getAttribute('data-index');
		        let jump = document.querySelectorAll('.swiper-slide ');
		        let total = jump[index].offsetTop;
		        let distance = document.documentElement.scrollTop || document.body.scrollTop;
		        // 平滑滚动，时长500ms，每10ms一跳，共50跳
		        let step = total / 50;
		        if (total > distance) {
		          smoothDown();
		        } else {
		          let newTotal = distance - total;
		          step = newTotal / 50;
		          smoothUp()
		        }
		        function smoothDown () {
		          if (distance < total) {
		            distance += step;
		          　　　　document.body.scrollTop = distance -84;
		            document.documentElement.scrollTop = distance-84
		            setTimeout(smoothDown, 20)
		          } else {
		            document.body.scrollTop = total-84;
		            document.documentElement.scrollTop = total-84
		          }
		        }
		        function smoothUp () {
		          if (distance > total) {
		            distance -= step;
		            　　　 document.body.scrollTop = distance-84;
		            document.documentElement.scrollTop = distance-84;
		            setTimeout(smoothUp, 20)
		          } else {
		          	document.body.scrollTop = total-84;
		          	document.documentElement.scrollTop = total-84
		          }
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
				return (h+':'+m+':'+s);
			},
			testTime(){
			    clearInterval(this.int);
			    this.int = setInterval( () => {
				     if(!this.new_test_data){
				      return;
				     }else if( this.testTimeSencond == -2){
				      let { BeginTime, NowTime, EndTime } = this.new_test_data;
				            BeginTime = new Date(BeginTime).getTime()/1000;
				            NowTime = new Date(NowTime).getTime()/1000;
				            EndTime = new Date(EndTime).getTime()/1000;
				            this.testTimeSencond = 0;
				            this.endTime = EndTime || 0 ;
				            this.nowTime = NowTime || 0
				            return;
				     }
				     this.testTimeSencond ++;
				     let {Timing,Is_FirstExam} = this.new_test_data;
				     Timing = Timing*1 || 0;
				     
				     if(Timing == 0){//考试时间为0 则为不限时间
						
				     }else{
				         if( Math.floor(this.testTimeSencond) >= Timing*60 ){
				             //执行提交 === 将所作的答案提交
				             this.$refs.exerciseCard.temporary_save();
				             this.alert_td = true;
				             clearInterval(this.int);
				           } 
				    } 
			    }, 1000);
			    
			},
			//清除定时器  返回使用时间
		    getTime(){
		        window.clearInterval(this.int);
		        return this.times
		    },
		    //计时开始  ---- 考试开始
		    timingStarts(){
		    	this.timing_starts = 0;
		    	this.testTime();
		    },
		    //考试结束操作
		    testEnd(){//==============================================》》》》》》》》》》》》》》》》确认提交成功跳转新的页面====最好是试卷列表页面
		    	this.alert_td = false;
		    }
	    },
	    mounted(){
	      window.addEventListener('scroll',this.handleScroll);
	    },
	    beforeDestroy() {
	       window.removeEventListener('scroll',this.handleScroll);
	       window.clearInterval(this.int);
	    },
	    watch:{},
	    components:{
	    	single,
	        multiple,
	        fillBlack,
	        oneAnswer,
	        answerCard
	    }
	}
</script>
<style lang="less">
	.test-sucess{
		padding: 20px 15px;
		background: #fff;
		text-align: center;
		min-height: 546px;
		.submit-btn {
		    color: #fff;
		    background: #08b766;
		    border-color: #08b766;
		    display: inline-block;
		    width: 120px;
		    height: 40px;
		    line-height: 40px;
		    text-align: center;
		    font-size: 16px;
		    border-radius: 5px;
		    border: 1px solid #e4e7e8;
		    cursor: pointer;
		}
	}
	.exercise_content{
	    width: 880px;
	    display: inline-block;
	    padding:0 15px;
	    .exercise-report{
	    	padding: 20px 0;
		    margin-bottom: 20px;
		    background: #fff;
		    .exercise_content_title{
		    	padding: 0px 30px;
		    	color: #333;
		    	font-size: 18px;
		    }
	    }
	}
	.exercise_top{
	    padding: 20px;
	    color: #999;
	    background: #fff;
	    margin-bottom: 20px;
	    .exercise_fl{
	    	display:inline-block;
	    	.exercise_title{
    		    margin-bottom: 10px;
			    font-size: 20px;
			    line-height: 30px;
			    color: #1d242f;
			    overflow: hidden;
			    text-overflow: ellipsis;
			    white-space: nowrap;
			    font-family: inherit;
    			font-weight: 500;
	    	}
	    	.exercise_count{
	    		color: #999;
	    		margin-left: -10px;
	    		padding: 0 10px;
	    		span{
	    			margin-right: 15px;
	    		}
	    	}
	    }
	    .exercise_fr{
	    	float: right;
	    	display: inline;
	    	width: 80px;
		    height: 30px;
		    line-height: 30px;
	    }
	    .exercise_nav:after{
	    	content:'';
	    	display: block;
	    	clear: both;
	    }
	    .exercise_nav_out {
	    	margin-top: 20px;
	    	height: 36px;
	    }
	    .exercise_nav{
	    	margin-top: 20px;
	    	background: #fff;
	    }
	    .exercise_nav li{
	    	float: left;
	    	width: 92px;
	    	height: 36px;
	    	line-height: 36px;
	    	text-align: center;
	    	color: #666;
	    	margin-left: 15px;
	    	border: 1px solid #eaedf1;
	    	cursor: pointer;
	    }
	    .exercise_nav li:hover{
	    	background: #3366cc;
    		color: #fff;
	    }
	    .green{
	    	color: #fff;
		    background: #08b766;
		    border-color: #08b766;
	    }
	    .normal-btn{
	    	display: inline-block;
		    width: 120px;
		    height: 40px;
		    line-height: 40px;
		    text-align: center;
		    font-size: 16px;
		    border-radius: 5px;
		    border: 1px solid #e4e7e8;
	    }
	}
	
</style>