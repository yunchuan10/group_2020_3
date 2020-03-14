<template>
    <div class="swiper-slide_top_new">
    	<div class="swiperSlideTop_content">
	        <div class="swiper-slide_title">
	            <p v-text="item.SubjectCategoryName"></p>
	        </div>
	        <div class="practice_content_center">
	            <div class="practice_v_html" v-html="item.Description"></div>
	        </div>
	        <ul class="practice_answer">
	        	<!--添加条件判断是否是正确答案的class是的话添加不是的话忽略-->
	            <li :class="(opt.c_type == 'select_red' ? 'select_default' : opt.c_type )"  v-for="(opt,index) in item.Options" :key="index" class="single_select">
	                <span class="single_new">{{opt.Prefix}}</span>
	                <div class="text_new">{{opt.Content}}</div>
	            </li>
	        </ul>
	     	<!--答案显示-->
	        <ul class="answer">
	        	<li class="answer_li">正确答案：<span v-if="item.answer_str != 'null' && item.answer_str">{{item.answer_str}}</span></li>
	        	<!--  原来显示有我的答案  -->
	        	<!--<li class="answer_li">我的答案：<span  v-if="item.select_str != 'null' && item.select_str" :class= "{'answer_error': item.answer_str != item.select_str}">{{item.select_str}}</span></li>-->
	        	
	        </ul>
	        <!--解析答案 -->
	        <div class="answer_analysis"  v-if="item.Analysis != 'null' && item.Analysis"> 
	        	<div class="title">答案解析</div>
	        	<div class="content" v-html='item.Analysis'></div>
	        </div>
	    </div>   
    </div>

</template>

<script>
export default {
    props: ["item"],
    data() {
        return {

        };
    },
    
    methods: {}
};
</script>

<style  lang="less" >
.swiper-slide_top_new {
	position: relative;
	height: 100%;
	background:#EFEFF4;
	overflow-y: auto;
	width: 102%;
  .swiper-slide_title {
  	/*收藏与错题本题目抬头隐藏*/
  	display: none;
    margin-top: 0.2rem;
    font-size: 0.32rem;
    margin-left: .3rem;
    color: #2c8cff;
    margin: 0.1rem 0.15rem 0rem 0.3rem;
    p {
      display: inline-block;
      text-align: justify;
      word-break: break-all;
      color: #2C8CFF;
    }
    span {
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
  .practice_content_center {
    margin: .2rem .15rem 0.3rem 0.3rem ;
    div {
      // text-indent: 2em;
      line-height: 0.56rem;
      font-size: 0.32rem;
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
		border-radius: 0.08rem;
		overflow: hidden;
		background: #FFFFFF;
		li{
			height: 1.18rem;
			line-height: 1.18rem;
			width:100%;
			font-weight: 700;
			color: #000;
			font-size: 0.36rem;
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
		padding: .4rem 0.3rem;
		background: #FFFFFF;
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
  .practice_answer {
		  	margin: 0.3rem;
		  	margin-bottom: 0.5rem;
		    .select_li {
		      span {
		        background: #0081e6;
		        color: #fff !important;
		      }
		    }
    		.select_green{
				span{background: #28C89F!important;color: #fff!important;}
			}
			.select_red{
				span{background: #FE5B59 ;color: #fff!important;}
			}
			.select_border_green{
			/*	span{border: .01rem solid #28C89F!important;}*/
				span{border: .03rem solid #28C89F!important;width:0.64rem!important;background:#28C89F;
					height:0.64rem!important; color: #fff!important; line-height: 0.64rem!important;}
			}

			.select_default{
				color: #999;
 /*   			border: 1px solid #DDDDDD;*/
			}
    .single_select {
      	margin-bottom: 0.4rem;
		.display(flex);
		line-height:.68rem;
		color:#666;
		font-size: .32rem;
      .single_new {
       		margin-right: .26rem;
			width:0.68rem ;
			height:0.68rem ;
			border-radius:50%;
		/*	line-height: 0.68rem;*/
			text-align: center;
			font-size: 0.32rem;
	/*		flex: 1;*/
			margin-bottom: 0;
			color:#999;
			border: 1px solid #DDDDDD;
      }

      .text_new {flex: 8;font-size: 0.32rem;line-height: 0.68rem;min-height:0.68rem ;text-align: justify;word-break: break-all;}
      .single_checked {
        margin-right: 0.26rem;
        margin-bottom: 0.4rem;
        width: 0.68rem;
        height: 0.68rem;
        /*border-radius:50%*/
        border: 1px solid #2c8cff;
        color: #2c8cff;
        line-height: 0.68rem;
        text-align: center;
        font-size: 0.32rem;
      }
    }
  }
}
</style>

<style  lang="less" >
   .swiper-slide_top_sing{
		position: relative;
		height: 100%;
		background:#EFEFF4;
		overflow-y: auto;
		.swiper-slide_title{
			display: none;
			text-align: justify;
			margin-top: .2rem;
			font-size: .32rem;
			color: #2C8CFF ;
			p{display: inline-block;word-break: break-all;}
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
		.practice_content_center{
			margin: .2rem .15rem .3rem 0.3rem;
			line-height: .56rem;
			font-size: .32rem;
			text-align: justify;
			word-wrap:break-word ;
			.practice_v_html{
				p{
					line-height: .56rem;
					font-size: .32rem;
					text-align: justify;
					word-wrap:break-word ;
				}
				span{
					line-height: .56rem;
					font-size: .32rem;
					text-align: justify;
					word-wrap:break-word ;
				 }
			}
		}
		.answer{
			height:1.18rem;
			display:flex;
			justify-content: space-between;  
  			align-items: center;
  			font-size: .32rem;
  			color:#333;
  			/*border-top: .01rem solid #E2E2E2;
  			border-bottom: .01rem solid #E2E2E2;*/
  			background: #F5F5F5;
			li{
				height: 1.18rem;
				line-height: 1.18rem;
				width:100%;
				text-align: center;
				span{
					color:#28C89F;
				}
			}
			.answer_li{
				border-right:.01rem solid #E2E2E2;
			}
			.answer_error{
				color:#FE5B59;
			}
		}
		.answer_analysis{
			padding: .4rem .15rem 0 0.3rem;
			background: #F5F5F5;
			.title{
				font-size: .28rem;
				color: #999;
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
			.select_green{
				span{background: #28C89F!important;color: #fff!important;}
			}
			.select_red{
				span{background: #FE5B59 ;color: #fff!important;}
			}
			.select_border_green{
				border: .01rem solid #28C89F!important;
				background: #FE5B59!important;
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
					color: #2C8CFF;
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