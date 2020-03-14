<template>
    <div class="swiper-slide_top_multiple">
    	<div class="swiperContent">
    		<div class="swiper-slide_title"><p v-text='item.SubjectCategoryName'></p></div>
			<div class="practice_content_center">
				<div class="text_html" v-text='repalceHtml(decodeURIComponent(option_resolution.Description))'></div>
			</div>
			<ul class="practice_answer" >
	            <!--循环出来所有的选项-->
		        <li v-for="(option,index) in option_resolution._SAnswerOptionList" :key="index"  class="check_select">
	                <span class="single_check " :class="option.c_type" v-text='option.Prefix'></span>
	                <div class="text_check" v-text="repalceHtml(decodeURIComponent(option.Content))"></div>
	            </li>
	        </ul>
	        <!--答案显示-->
	        <ul class="answer">
	        	<li class="answer_li answer_left" v-if="option_resolution.RightKey != 'null' && option_resolution.RightKey">正确答案：<span>{{option_resolution.RightKey}}</span></li>
	        	<li class="answer_li">我的答案：<span v-if="option_resolution.MyAnswer != 'null' && option_resolution.MyAnswer"  :class= "{'answer_error': option_resolution.RightKey != option_resolution.MyAnswer}">{{option_resolution.MyAnswer}}</span>
	        	</li>
	        </ul>
	        <div class="answer_analysis" v-if="option_resolution.Analysis != 'null' && option_resolution.Analysis">
	        	<div class="title">答案解析</div>
	        	<div class="content" v-text='repalceHtml(decodeURIComponent(option_resolution.Analysis))'></div>
	        </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
    export default {
    	props: ['item','index'],
    	data(){
    	  return {}
    	},
        mounted(){},
        computed:{
            option_resolution(){
                let option_resolution = this.item || {};  // 题目详情
        		let SAnswerOptionList =  option_resolution._SAnswerOptionList || [];  // 选项和答案
        		let StudentAnswer =  option_resolution._StudentAnswer || [];          // 学生选择答案
                let result = {
                    Description: option_resolution.Description||'',
                    Analysis: option_resolution.Analysis||'',
                    MyAnswer: '',       // 我的答案
                    RightKey: '',       // 正确答案
                    _SAnswerOptionList: SAnswerOptionList,
                };
                // 我的答案
        		for(var i = 0; i< StudentAnswer.length ; i++){
        		    result.MyAnswer += StudentAnswer[i].StudentPrefix;
                }

                // 正确答案
        		for(var i = 0; i< SAnswerOptionList.length; i++){
        			if(SAnswerOptionList[i].IsAnser == true){
        				result.RightKey += SAnswerOptionList[i].Prefix;
        			}
                }

				// 答案选项
                result._SAnswerOptionList.map( obj => {
                    var c_type = 'select_default';
                    if( result.RightKey.indexOf(obj.Prefix) != -1 ){ //正确
                        c_type = 'select_border_green';     // 正确没选
                        if(result.MyAnswer.indexOf(obj.Prefix) != -1){
                            c_type = 'select_green';     //正确选了
                        }
                    }else{
                        c_type = 'select_default';     // 错误没选
                        if(result.MyAnswer.indexOf(obj.Prefix) != -1){
                            c_type = 'select_red';     //错误选了
                        }
                    }
                    obj.c_type = c_type;
                });
                return result;
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
<style  lang="less">
   .swiper-slide_top_multiple{
		position: relative;
		height: 100%;
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
			word-wrap:break-word !important;
			line-height: .56rem!important;
			font-size: .32rem!important;
			.text_html{
				word-wrap:break-word !important;
				line-height: .56rem!important;
				font-size: .32rem!important;
				p{
				word-wrap:break-word !important;
				line-height: .56rem!important;
				font-size: .32rem!important;
				text-align: justify;
				}
				span{
					word-wrap:break-word !important;
					line-height: .56rem!important;
					font-size: .32rem!important;
					text-align: justify;
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
  			/*border-top: .01rem solid #E2E2E2;
  			border-bottom: .01rem solid #E2E2E2;*/
  			background: #FFFFFF;
  			border-radius: 0.08rem;
  			overflow: hidden;
			li{
				height: 1.18rem;
				line-height: 1.18rem;
				width:50%;
				font-size: 0.36rem;
				font-weight: 700;
				color: #000000;
				text-align: center;
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
			word-break: break-all;
			border-radius: 0.08rem;
			.title{
				font-size: .36rem;
				color: #000;
				position: relative;
				padding-left: 0.27rem;
				height:0.6rem;
				line-height:0.6rem;
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
			.check_select{
				.display(flex);
				line-height:.68rem;
				color:#666;
				font-size: .32rem;
				margin-bottom: .4rem;
				.single_check{
					margin-right: 0.26rem;
					width:0.68rem ;
					height:0.68rem ;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
					color: #999;
    				border: 1px solid #DDDDDD;
				}
				.text_check{flex: 8;font-size: 0.32rem;}
				.single_checked{
					margin-right: .26rem;
					width:0.68rem ;
					height:0.68rem ;
					border: 1px solid #2C8CFF;
					color: #2C8CFF;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
				}
				.select_green{background: #28C89F!important;color: #fff!important;border-radius: 0.08rem;}
				.select_red{background: #FE5B59 ;color: #fff!important;border-radius: 0.08rem;}
				.select_border_green{
					/*border: .01rem solid #28C89F;border-radius: 0.08rem;*/
				border: .03rem solid #28C89F!important;width:0.64rem!important;
					height:0.64rem!important;    line-height: 0.64rem!important;
					border-radius: 0.08rem;
				}
				
				.select_default{color: #999;border: 1px solid #DDDDDD;border-radius: 0.08rem;}
			}
		}

	}
</style>