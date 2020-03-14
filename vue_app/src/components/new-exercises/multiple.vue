<template>

    <div class="swiperSlideTop_multiple">
		<div class="swiperSlideTop_content">
		    <div class="swiper-slide_title">
		    	<p v-text='item.SubjectCategoryName'></p>
		    </div>
			<div class="practice_content_center">
				<div class="practice_v_html" v-html='item.Description'></div>
			</div>
			<ul class="practice_answer" >
	            <!--循环出来所有的选项-->       <!--添加标志位控制能否点击-->
	            <li class="check_select" @click="setSelectStatus(opt)" :class="{'select_li_multiple': opt.is_select}" v-for="(opt,index) in item.Options" :key="index">
	                <span class="single_check" v-text='opt.Prefix'></span>
	                <div class="text_check_multiple" v-html="opt.Content"></div>
	            </li>
	        </ul>
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
        computed:{},
        methods:{
            setSelectStatus(opt){
                opt.is_select = !opt.is_select;
            }

        }

    }
</script>

<style  lang="less">
   .swiperSlideTop_multiple{
		position: relative;
		height: 100%;
		overflow-y: auto;
		padding: 0 .3rem;
		width: 94%;
		.swiperSlideTop_content{
			padding-right: 0.15rem;
		}
		.swiper-slide_title{
			margin-top: .2rem;
			font-size: .32rem;
			color: #666 ;
			text-align: justify;
			p{display: inline-block;word-break: break-all;color: #2C8CFF;}
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
		.practice_content_center{
			margin-bottom: .32rem;
			margin-top: .1rem;
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
		.practice_answer{
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
					border-radius: 0.04rem;
					}
				.text_check_multiple{text-align:justify;flex: 8;font-size: 0.32rem;min-height:0.68rem;line-height: 0.68rem;text-align: justify;}
				
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
					border: 1px solid #2C8CFF;
					color: #2C8CFF;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
					border-radius: 0.08rem;
				}
				.text_check_multiple{text-align:justify;flex: 8;font-size: 0.32rem;min-height:0.68rem;line-height: 0.68rem;}
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