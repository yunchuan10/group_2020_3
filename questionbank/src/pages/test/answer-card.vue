<template>
    <div class="testp-card" >
    	<div class="tit-time"><img src="../../common/img/icon_times.png"/>{{ timetext }}</div>
        <div class="tit">
                        答题卡
        	<div class="fr">
        		<span class="type">
        			<em></em>
        			未答
        		</span>
        		<span class="type did">
        			<em></em>
        			已答
        		</span>
        	</div>
        </div>
        <ul class="tit_ul">
        	<div  v-if="isSubjects.isSubject1">
                <h3><span class="tit_ul_h3"></span>、单选题</h3>
                <ul class="clearfix">
                    <a  v-if="ele.SubjectCategory==1" v-for="(ele,index) in answercard_test.SubjectRecords" :key="index"
                    :class="{ selected :ele.Answer || ele.SubjectRecordSAnswerOptions.length>0 || ele.AnswerOptionExtendeds.length>0}" @click="jump(index)"
                    >{{index+1}}</a>
                </ul>
        	</div>
        	<div  v-if="isSubjects.isSubject2">
                <h3><span class="tit_ul_h3"></span>、多选题</h3>
                <ul class="clearfix">
                     <a  v-if="ele.SubjectCategory==2" v-for="(ele,index) in answercard_test.SubjectRecords" :key="index"
                    :class="{ selected :ele.Answer || ele.SubjectRecordSAnswerOptions.length>0 || ele.AnswerOptionExtendeds.length>0}" @click="jump(index)"
                    >{{index+1}}</a>
                </ul>
        	</div>
        	<div  v-if="isSubjects.isSubject9">
                <h3><span class="tit_ul_h3"></span>、判断题</h3>
                <ul class="clearfix">
                    <a  v-if="ele.SubjectCategory==9" v-for="(ele,index) in answercard_test.SubjectRecords" :key="index"
                    :class="{ selected :ele.Answer || ele.SubjectRecordSAnswerOptions.length>0 || ele.AnswerOptionExtendeds.length>0}" @click="jump(index)"
                    >{{index+1}}</a>
                </ul>
        	</div>
        	<div  v-if="isSubjects.isSubject6">
                <h3><span class="tit_ul_h3"></span>、填空题</h3>
                <ul class="clearfix">
                    <a  v-if="ele.SubjectCategory==6" v-for="(ele,index) in answercard_test.SubjectRecords" :key="index"
                    :class="{ selected :ele.Answer || ele.SubjectRecordSAnswerOptions.length>0 || ele.AnswerOptionExtendeds.length>0}" @click="jump(index)"
                    >{{index+1}}</a>
                </ul>
        	</div>
        	<div  v-if="isSubjects.isSubject3">
                <h3><span class="tit_ul_h3"></span>、问答题 </h3>
                <ul class="clearfix">
                    <a  v-if="ele.SubjectCategory==3" v-for="(ele,index) in answercard_test.SubjectRecords" :key="index"
                    :class="{ selected :ele.Answer || ele.SubjectRecordSAnswerOptions.length>0 || ele.AnswerOptionExtendeds.length>0}" @click="jump(index)"
                    >{{index+1}}</a>
                </ul>
        	</div>
        	<div  v-if="isSubjects.isSubject7">
                <h3><span class="tit_ul_h3"></span>、名词解释 </h3>
                <ul class="clearfix">
                    <a  v-if="ele.SubjectCategory==7" v-for="(ele,index) in answercard_test.SubjectRecords" :key="index"
                    :class="{ selected :ele.Answer || ele.SubjectRecordSAnswerOptions.length>0 || ele.AnswerOptionExtendeds.length>0}" @click="jump(index)"
                    >{{index+1}}</a>
                </ul>
        	</div>
        	<div  v-if="isSubjects.isSubject10">
                <h3 ><span class="tit_ul_h3"></span>、案例分析 </h3>
                <ul class="clearfix">
					<a  v-if="ele.SubjectCategory==10" v-for="(ele,index) in answercard_test.SubjectRecords" :key="index"
                    :class="{ selected :ele.Answer || ele.SubjectRecordSAnswerOptions.length>0 || ele.AnswerOptionExtendeds.length>0}" @click="jump(index)"
                    >{{index+1}}</a>
                </ul>
        	</div>
        	<div  v-if="isSubjects.isSubject11">
                <h3 ><span class="tit_ul_h3"></span>、论述题 </h3>
                <ul class="clearfix">
					<a  v-if="ele.SubjectCategory==11" v-for="(ele,index) in answercard_test.SubjectRecords" :key="index"
                    :class="{ selected :ele.Answer || ele.SubjectRecordSAnswerOptions.length>0 || ele.AnswerOptionExtendeds.length>0}" @click="jump(index)"
                    >{{index+1}}</a>
                </ul>
        	</div>
        </ul>
        <div class="buttons">
        	<button class="ipbtn submit-btn green" @click="forever_save">我要交卷</button>
        </div>
        
        <div v-show="retreat_sub" ref="retreat_error" class="toast_c">111</div>
        <v-confirm v-show="card_sub_status == 2" :msg="'你还有试题未完成，是否提交？'" @confirmCas=" ()=>{card_sub_status = 0} " @confirmSuc="forever_sure()"></v-confirm>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { Getsubmit } from '../../api'
export default {
    name: "answer-card",
    props:{
    	timetext:String,
    	getTime:Function
    },
    data(){
        return{
            card_sub_status: 0,
            retreat_sub:false,
            forever_submit:false,
        }
    },
    created(){
    	this.$nextTick(() => {});
    },
    computed:{
        ...mapGetters(['answercard_test']),
        ...mapState(['new_test_data_submint','test_submit_sucess']),
        isSubjects(){
        	//Subject_Score 这道题分数     // Score 我获得的分数
   			let _arr = this.answercard_test.SubjectRecords || [];
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
            return { isSubject1, isSubject2, isSubject3, isSubject4, isSubject5, isSubject6, isSubject7, isSubject8, isSubject9, isSubject10, isSubject11};
        },  
    },
    methods: {
    	jump (index) {
        	// 用 class="d_jump" 添加锚点---过渡动画
	        var jump = document.querySelectorAll('.jump');
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
	          　　　　document.body.scrollTop = distance - 60;
	            document.documentElement.scrollTop = distance - 60
	            setTimeout(smoothDown, 20)
	          } else {
	            document.body.scrollTop = total - 60;
	            document.documentElement.scrollTop = total - 60
	          }
	        }
	        function smoothUp () {
	          if (distance > total) {
	            distance -= step;
	            　　　 document.body.scrollTop = distance - 60;
	            document.documentElement.scrollTop = distance - 60;
	            setTimeout(smoothUp, 20)
	          } else {
	          	document.body.scrollTop = total- 60;
	          	document.documentElement.scrollTop = total - 60 
	          }
	          }
        },
        //提交时是否显示题目未做完提示框
    	card_sub(){
    		let obj = this.answercard_test||{};
    		let _arr_count = obj.SubjectRecords ||[];
    		let count=0;
    		for(var i=0;i<_arr_count.length;i++){
    			if(_arr_count[i].Answer||_arr_count[i].SubjectRecordSAnswerOptions.length>0||_arr_count[i].AnswerOptionExtendeds.length>0){
    				count++
    			}
    		}
    		if(count < _arr_count.length){//题目是否全部做完  没有则显示提示框
    			this.forever_submit = false;
    			//隐藏点击返回时的图层
	      		 this.card_sub_status = 2;
    		}else{
    			this.forever_submit = true;
    			this.temporary_save();
    		}
    	},
        //永久提交---判断框
        forever_save(){
        	this.card_sub()
        },
        //永久提交---确认
        forever_sure(){
        	this.forever_submit = true;
        	this.temporary_save();
        },
        //确认临时提交
        temporary_save(){
        	//记录提交时最后的确认时间
	        let ReviewTime = this.$moment().format('YYYY-MM-DD h:mm:ss');
            this.new_test_data_submint.LastReviewTime = ReviewTime;
            //考试用时多久 
            this.new_test_data_submint.userTime = this.timetext || '';
            //提交给后台的答题内容
	        let reseve_obj = this.new_test_data_submint;
	        //学生的 StudentId 
            reseve_obj.StudentId = this.$route.query.UserId || '';
	        //请求接口
	        Getsubmit({
	        	data: reseve_obj,
	        	type:'post'
	        }).then(res =>{
	        	if(res.statusCode >= 200){
	        		this.card_sub_status = 0;
	        		this.$refs.retreat_error.innerHTML = res.message;
	        		this.retreat_sub= true;
	        		setTimeout(()=>{
	        			this.retreat_sub= false;
	        		},1500);
	        		//清除定时器
	        		this.getTime();
	        		//隐藏页面上的相应位置
	        		this.$store.commit('set_test_submit_sucess',{status:true})
	        	}else{
	        		this.$refs.retreat_error.innerHTML = res.message;
	        		this.retreat_sub= true;
	        		setTimeout(()=>{
	        			this.retreat_sub= false;
	        		},1500);
	        		
	        	}
	        })
        },  
    }
}
</script>

<style lang="less" >
	.testp-card{
		float: right;
	    z-index: 10;
	    width: 240px;
	    background: #fff;
	    padding: 15px;
	    border: 1px solid #eaedf1;
	    .tit-time{
	    	color: #349bf7;
	    }
	    .tit,.tit-time {
		    margin: 0 -15px;
		    padding: 15px;
		    font-size: 16px;
		    border-bottom: 1px solid #eaedf1;
		    line-height:22px;
		    img{
		    	width: 20px;
		    	height: 20px;
		    	float: left;
		    	margin-right: 10px;
		    }
		    .fr {
			    float: right;
			    display: inline;
			    .type {
				    margin-left: 10px;
				    font-size: 14px;
				    color: #999;
				    em {
					    margin-right: 5px;
					    display: inline-block;
					    width: 11px;
					    height: 11px;
					    border: 1px solid #dcdcdc;
					}
					
				}
				.did{
					em {
					    border: 1px solid #08b867;
					    background: #08b867;
					   }
					}
			}
		}
		.tit_ul{
			padding: 10px 0 20px;
			height: 250px;
			overflow-y: scroll;
			div{
				padding: 10px 0;
    			overflow: hidden;
    			h3{
    				margin-bottom: 15px;
				    font-size: 14px;
				    font-weight: normal;
    			}
			}
			a{
				float: left;
			    display: inline-block;
			    margin-right: 14px;
			    margin-bottom: 15px;
			    min-width: 30px;
			    height: 30px;
			    line-height: 30px;
			    text-align: center;
			    border: 1px solid #dcdcdc;
			    cursor: pointer;
			    border-radius: 50%;
			    &.selected{
			    	border: 1px solid #08b867;
				    background: #08b867;
			    }
			}
		}
		.tit_ul:after{
			/*添加一个内容*/
			content: "";
			/*转换为一个块元素*/
			display: block;
			/*清除两侧的浮动*/
			clear: both;
		}
		
		.buttons{
			overflow: hidden;
    		margin: 0 -15px -15px;
    		.ipbtn {
			    width: 100%;
			    border-radius: 0;
			}
			.orange {
			    background: #fd813c;
			    border-color: #fd813c;
			}
			.green{
				background: #08b766;
			    border-color: #08b766;
			}
			.submit-btn {
			    color: #fff;
			    cursor: pointer;
			    display: inline-block;
			    /*width: 120px;*/
			    height: 40px;
			    line-height: 40px;
			    text-align: center;
			    font-size: 16px;
			    border-radius: 5px;
			    border: 1px solid #e4e7e8;
			}
		}
	}
	

</style>