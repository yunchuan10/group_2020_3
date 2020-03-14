<template>

    <div class="swiper-slide_top_multiple">
		<div class="swiperSlideTop_content">
		    <div class="swiper-slide_title">(<p v-text='item.SubjectCategoryName'></p>)</div>
			<div class="practice_content_center">
				<div class="practice_v_html" v-html='item.Description'></div>
			</div>
			<ul class="practice_answer" >
	            <!--循环出来所有的选项-->       <!--添加标志位控制能否点击-->
	            <li class="check_select" @click="setSelectStatus(opt)" :class="opt.c_type"  v-for="(opt,index) in item.Options" :key="index">
	                <span class="single_check" v-text='opt.Prefix'></span>
	                <div class="text_check_multiple" v-html="opt.Content"></div>
	            </li>
	        </ul>
	        <!--答案显示-->
	        <ul class="answer">
	        	<li class="answer_li answer_left">正确答案：<span v-if="item.answer_str != 'null' && item.answer_str">{{item.answer_str}}</span></li>
	        	<li class="answer_li">我的答案：<span v-if="item.select_str != 'null' && item.select_str" :class= "{'answer_error': item.answer_str != item.select_str}">{{item.select_str}}</span></li>
	        </ul>
	        <!--解析答案 -->
	        <div class="answer_analysis" v-if="item.Analysis != 'null' && item.Analysis">
	        	<div class="title">答案解析</div>
	        	<div class="content" v-html='item.Analysis'></div>
	        </div>
	    </div>
    </div>
</template>

<script>
    export default {
    	props: ['item'],
    	data(){
    		return{

    		}
    	},
    	created(){},
        computed:{},
        methods:{
            setSelectStatus(opt){
                opt.is_select = !opt.is_select;
            }

        }

    }
</script>

<style  lang="less">
   .swiper-slide_top_multiple{
		position: relative;
		height: 100%;
		background:#EFEFF4;
		overflow-y: auto;
		width: 102%;
		.swiper-slide_title{
			margin-top: 0.2rem;
		    margin-left: .3rem; 
    		color: #2c8cff;
    		text-align: justify;
    		margin: 0.1rem 0.3rem 0rem 0.3rem;
    		word-wrap:break-word !important;
			line-height: .56rem!important;
			font-size: .32rem!important;
			p{
				display: inline-block;
		        text-align: justify;
		        word-break: break-all;
		        color: #2C8CFF;
				}
			span{
				height:.34rem ;
				width:.8rem ;
				font-size: 0.24rem;
				border:1px solid #2C8CFF  ;
				line-height: .34rem;
				text-align: center;
				display: inline-block;
				margin-left: .18rem;

			}

		}
		.swiperSlideTop_content{
		  	padding-right: 0.15rem;
		  	height: 100%;
		  	
		}
		.practice_content_center{
			margin: .1rem .3rem 0.3rem 0.3rem ;
			.practice_v_html{
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
			font-weight: 700;
			font-size: 0.36rem;
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
		text-align: justify;
		word-break: break-all;
		margin-top: 0.3rem;
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
			text-align: justify;
			word-break: break-all;
		}
	}
		.practice_answer{
			margin: 0.3rem;
			margin-bottom: 0.5rem;
			.select_li_multiple{
				margin-bottom: .4rem;
				background: none;
				.display(flex);
				span{
					background: #0081E6;
					color: #fff!important;
					margin-right: .26rem;
					width:0.68rem ;
					height:0.68rem ;
					border: 1px solid #2C8CFF;
					color: #2C8CFF;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
					border-radius: 0.08rem;
					}
				.text_check_multiple{flex: 8;font-size: 0.32rem;min-height:0.68rem;line-height: 0.68rem;}
				
			}
			.select_green{
				span{background: #28C89F!important;color: #fff!important;}
			}
			.select_red{
				span{background: #FE5B59 ;color: #fff!important;}
			}
			.select_border_green{
				span{border: .03rem solid #28C89F!important;width:0.64rem!important;;
					height:0.64rem!important;    line-height: 0.64rem!important;
					border-radius: 0.08rem;
					}
			}
			.select_default{
				color: #999;
 /*   			border: 1px solid #DDDDDD;*/
			}
			.check_select{
				.display(flex);
				line-height:.68rem;
				color:#666;
				font-size: .32rem;
				margin-bottom: .4rem;
				.single_check{
					margin-right: .26rem;
					width:0.68rem ;
					height:0.68rem ;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
					border-radius: 0.08rem;
					color:#999;
					border: 1px solid #DDDDDD;
				}
				.text_check_multiple{flex: 8;font-size: 0.32rem;min-height:0.68rem;line-height: 0.68rem;;text-align: justify;word-break: break-all;}
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
			}
		}

	}
</style>