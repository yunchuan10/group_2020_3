<template>
    <div class="swiper-slide_top_sing ">
		<div class="swiperContent">
		<div class="swiper-slide_title"><p v-text='item.SubjectCategoryName'></p></div>
		<div class="practice_content_center">
			<div class="text_html" v-text='repalceHtml(decodeURIComponent(option_resolution.Description))'></div>
		</div>

		<div>
			
			<ul class="practice_answer">
		       <!--循环出来所有的选项-->
	            <div  v-for="(option,index) in option_resolution._SAnswerOptionList">
		             <li v-if="option.OptionStatus == '1'" class="single_select select_green">
		                <span class="single" v-text='option.Prefix'></span>
		                <div class="text" v-text="repalceHtml(decodeURIComponent(option.Content))"></div>
		             </li>
		             <li v-else-if="option.OptionStatus == '2'" class="single_select select_red">
		                <span class="single" v-text='option.Prefix'></span>
		                <div class="text" v-text="repalceHtml(decodeURIComponent(option.Content))"></div>
		             </li>
		             <li v-else-if="option.OptionStatus == '3'" class="single_select select_green">
		                <span class="single select_border_green" style="background: #28C89F!important;" v-text='option.Prefix'></span>
		                <div class="text" v-text="repalceHtml(decodeURIComponent(option.Content))"></div>
		             </li>
		              <li v-else class="single_select">
		                <span class="single" v-text='option.Prefix'></span>
		                <div class="text" v-text="repalceHtml(decodeURIComponent(option.Content))"></div>
		             </li>
	            </div>    
	        </ul>
	        <!--答案显示-->
	        <ul class="answer">
	        	<li class="answer_li answer_left">正确答案：<span v-if="option_resolution.RightKey != 'null' && option_resolution.RightKey">{{option_resolution.RightKey}}</span></li>
	        	<li>我的答案：<span v-if="option_resolution.MyAnswer != 'null' && option_resolution.MyAnswer" :class= "{'answer_error': option_resolution.RightKey != option_resolution.MyAnswer}">{{option_resolution.MyAnswer}}</span>
	       		</li>
	        </ul>
	        <!--解析答案 -->
	        <div class="answer_analysis" v-if="option_resolution.Analysis && option_resolution.Analysis!='null'">
	        	<div class="title">答案解析</div>
	        	<div class="content" v-text='repalceHtml(decodeURIComponent(option_resolution.Analysis))'></div>
	        </div>

     	</div>
     	</div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions ,mapMutations} from 'vuex'
    export default {
    	props: ['item','index'],
    	data(){
    		return{
    			sec_i: -1
    		}
    	},
        created() {
        	// this.report_list();
        },
        computed:{
        	// ...mapGetters(['reseve_obj']),
	        // 试卷解析
	        option_resolution(){
        		let option_resolution = this.item || {}  // 题目详情
        		let SAnswerOptionList =  this.item._SAnswerOptionList || []  // 选项和答案
        		let StudentAnswer =  this.item._StudentAnswer || []          // 学生选择答案
        		option_resolution.MyAnswer = ''   // 我的答案
        		option_resolution.RightKey = ''   // 正确答案

        		// 我的答案
        		for(let i = 0; i< StudentAnswer.length ; i++){
        		    option_resolution.MyAnswer += StudentAnswer[i].StudentPrefix;
        		}
        		
        		// 获取选项和答案
        		for(let i = 0; i< SAnswerOptionList.length; i++){
    			   // 正确答案和选择答案
    				for (let index in StudentAnswer) {
    					let OptionStatus = '4';  
    					// 选项和学生选择一样
    					if(SAnswerOptionList[i].SAnswerOptionId.indexOf(StudentAnswer[index].SAnswerOptionId) === -1){  // 未选择
    						if(SAnswerOptionList[i].IsAnser == true){
								OptionStatus = '3';   // 正确答案未选择
    						}else{
    							OptionStatus = '4';   // 错误答案未选择
    						}
    					}else{  												// 已选择
    						if(SAnswerOptionList[i].IsAnser == true){
								OptionStatus = '1';   // 正确答案已选择
    						}else{
    							OptionStatus = '2';   // 错误答案未选择
    						}
    					}
    					SAnswerOptionList[i].OptionStatus = OptionStatus;
    				}
        			// 正确答案
        			if(SAnswerOptionList[i].IsAnser == true){
        				option_resolution.RightKey += SAnswerOptionList[i].Prefix;
        			}
        			
        		}
        		// 返回重构对象
        		return option_resolution || [];  // 解析数据
        	},

        },
        methods:{
			//过滤HTML标签
			repalceHtml:function(str){
				var dr=str.replace(/<\/?.+?>/g,"");
				var dd = dr.replace(/<[^>]+>|&[^>]+;/g,"");
				var dds=dd.replace(/ /g,"");//dds为得到后的内容
				return dds;
			}
        },
    }
</script>

<style  lang="less" >
   .swiper-slide_top_sing{
		position: relative;
		height: 100%;
		background:#EFEFF4;
		overflow-y: auto;
		width: 102%;
		.swiper-slide_title{
			margin-top: .2rem;
			font-size: .32rem;
			color: #2C8CFF ;
			margin-left: .2rem;
			p{display: inline-block;color: #2C8CFF;}
			span{
				height:.32rem ;
				width:.8rem ;
				border:1px solid #2C8CFF  ;
				line-height: .32rem;
				text-align: center;
				font-size: .12rem;
				display: inline-block;
				margin-left: .18rem;
			}
		}
		.swiperContent{
			height: 100%;
		    margin-right: 2%;
		    text-align: justify;
		}
		.practice_content_center{
			margin: .1rem .32rem .3rem;
			text-align: justify;
			word-break: break-all;
			.text_html{
				word-wrap:break-word !important;
				line-height: .56rem!important;
				font-size: .32rem!important;
				p{
					word-wrap:break-word ;
					line-height: .56rem!important;
					font-size: .32rem!important;
				}
				span{
					word-wrap:break-word ;
					line-height: .56rem!important;
					font-size: .32rem!important;
				}
				
			}
		}
		.answer{
			margin: 0 0.3rem;
			height:1.18rem;
			display:flex;
			justify-content: space-between;  
  			align-items: center;
  			font-size: .32rem;
  			color:#000;
  			background: #FFFFFF;
  			overflow: hidden;
  			border-radius: 0.08rem;
			li{
				height: 1.18rem;
				line-height: 1.18rem;
				width:50%;
				font-weight: 700;
				font-size: 0.36rem;
				color: #000000;
				text-align: center;
				border: 0 !important;
				span{
					color:#28C89F;
				}
			}
			.answer_left:after{
				content: '';
				width: 0.02rem;
				height: 0.3rem;
				background: #E2E2E2;
				position: absolute;
				right: 0;
				top: 0.44rem;
			}
			.answer_left{
				position: relative;
			}
			.answer_error{
				color:#FE5B59;
			}
		}
		.answer_analysis{
			margin: 0 0.3rem;
			padding: .4rem .3rem;
			background: #FFFFFF;
			margin-top: 0.3rem;
			border-radius: 0.08rem;
			.title{
				font-size: .36rem;
				color: #000;
				position: relative;
				padding-left: 0.27rem;
				font-weight: 700;
			}
			.title:before{
				content: '';
				width: 0.1rem;
				height: 0.1rem;
				display: block;
				border-radius: 50%;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				background: #2C8CFF;
			}
			.content{
				font-size:.32rem;
				color: #666;
				padding-top:10px;
			}
		}
		.practice_answer{
			margin: 0.3rem;
			margin-bottom: 0.5rem;
			.select_green{
				span{background: #28C89F!important;color: #fff!important;}
			}
			.select_red{
				span{background: #FE5B59 ;color: #fff!important;}
			}
			.select_border_green{
				border: .03rem solid #28C89F!important;
				background: #28C89F!important;
				color: #fff!important;
				width:0.64rem!important;
				height:0.64rem!important;
				line-height: 0.64rem!important;
			}
			.select_default{
				color: #999;
    			border: 1px solid #DDDDDD;
			}
			.single_select{
				.display(flex);
				line-height:.68rem;
				color:#666;
				font-size: .32rem;
				.single{
					margin-right: .26rem;
					margin-bottom: .4rem;
					width:0.68rem ;
					height:0.68rem ;
					border-radius:50% ;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
					/*flex: 1;*/
					color:#999;
					border: 1px solid #DDDDDD;
				}
				.text{flex: 8;font-size: 0.32rem;}
				.single_checked{
					margin-right: .26rem;
					margin-bottom: .4rem;
					width:0.68rem ;
					height:0.68rem ;
					/*border-radius:50%*/ ;
					border: 1px solid #2C8CFF;
					color: #2C8CFF;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
				}
			}
		}
		
	}
</style>