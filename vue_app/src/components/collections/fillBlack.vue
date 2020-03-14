<template>

    <div class="swiper-slide_top_fillBlack" ref="swipe">

    	<div class="swiperSlide_down" ref="slide_down">
    		<div class="swiper-slide_down_title"><p v-text='item.SubjectCategoryName'></p></div>
    		<div class="practice_content_content">
				<div class="practice_v_html" v-html='item.Description'></div>
			</div>
		</div>
    	<div class="swiperSlidewrap_2 answer_bg moveDiv">
    		<div class="swiperBlock" ref="children"
    			@mousedown="down" @touchstart="down"
	            @mousemove="move" @touchmove="move"
	            @mouseup="end" @touchend="end"
    			></div>
    		<div class="swiper-slide_question">
    			<!-- 收藏当中不显示我的答案 设置外部ul高度和背景颜色如需显示去掉行内样式即可  -->
    			<!--<div class="answer_title" >我的答案</div>
				<ul class="practice_answer" style="height: 0.68rem;background: #fff;">
		            <li class="select" v-for="(opt,index) in item.Options"  :key="index" >
		                <span class="single_completion" v-text='opt.Prefix'></span>
		                <div class="text" ><div  v-html="decodeURIComponent(opt.subject_fill)" disabled="true" style="background: #fff;"  /></div>
		            </li>
		        </ul>-->
	            <!--得分 收藏隐藏-->
		        <!--<div class="answer_score">得分</div>
		        <div  class="answer_score_sum" v-text='item.Score' ></div>-->
		        <!--参考答案-->
		        <div v-if="item.Options && item.Options.length">
			        <div class="answer_title">正确答案</div>
					<ul class="practice_answer" >
			            <li class="select" v-for="(opt,index) in item.Options"  :key="index">
			                <span class="single_completion" v-text="opt.Prefix + '.'"></span>
			                <div class="text" ><p v-if="opt.Content && opt.Content != 'null'" v-text="opt.Content" disabled="true" ></p></div>
			            </li>
			        </ul>
		        </div>
		        <!--答案解析-->
		        <div v-if="item.Analysis && item.Analysis != 'null'">
			        <div class="answer_title">答案解析</div>
			        <div class="answer_reference" v-html='item.Analysis'></div>
		        </div>
		        <!--教师评语-->
		        <!--<div v-if="item.Comment && item.Comment != 'null'" >
		        	<div class="answer_title">教师评语</div>
		        	<div class="answer_reference" v-html='item.Comment'></div>
		        </div>-->
		        <div style="height:1rem;">
		        	
		        </div>

	        </div>
	    </div>           
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions} from 'vuex'
    export default {
    	props: ['item'],
    	data(){
    		return {
				flag: false,
                position: { x: 0, y: 0 },
                nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
			}
    	},
        created(){},
		methods: {
			...mapActions(['anserShowAndHidden_exercise_analysis']),
			toggle(){
//				this.flags=!this.flags;
				this.anserShowAndHidden_exercise_analysis(!this.flags_exercise_analysis)
				this.$emit('toggleHidden')
			},
			
			 //拖动实现区域
		    down(){
	          this.flag = true;
	          var touch;
	          if(event.touches){
	            touch = event.touches[0];
	          }else {
	            touch = event;
	          }
	          
	          this.position.y = touch.clientY;
	          
	          this.dy = touch.target.offsetParent.offsetTop;
	          
	        },
	        move(){
	          //获取父元素的高度
	          var parentH = this.$refs.swipe.offsetHeight-this.$refs.children.offsetHeight-5;
	          if(this.flag){
	            var touch ;
	            if(event.touches){
	              touch = event.touches[0];
	            }else {
	              touch = event;
	            }
	            this.ny = touch.clientY - this.position.y;
	            this.yPum = this.dy+this.ny;
	            if(this.yPum<= 25){
	              this.yPum = 25
	            }else if(this.yPum >= parentH-40){
	              this.yPum = parentH-40;
	            }
	            
	            touch.target.offsetParent.style.top = this.yPum +"px";
	            touch.target.offsetParent.style.height = (this.$refs.swipe.offsetHeight- this.yPum) +"px";
	            this.$refs.slide_down.style.height = (this.yPum + touch.target.offsetHeight) +"px";
	            
	            //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove  passive 兼容ios和andirod
	            document.addEventListener("touchmove",this.preventDefault,{passive: false});
	          }
	        },
	        //事件的阻止默认事件
	        preventDefault(e) {
			    e.preventDefault(); 
			},
	         //鼠标释放时候的函数
	        end(){
	          this.flag = false;
	          //取消默认事件
	          document.removeEventListener('touchmove',this.preventDefault, {passive: false});
	        },
	        //组建渲染完成时答题区域的位置
			startPositions(){
				 //获取父元素的高度
	            var parentH = this.$refs.swipe.offsetHeight;
	            var childrenH = this.$refs.children.offsetHeight;
	            
				this.yPum =  Math.floor( ( parentH-childrenH ) / 2  ) ;
				var positionmoveDiv = document.getElementsByClassName('moveDiv');
				for(var i=0;i < positionmoveDiv.length;i++){
					positionmoveDiv[i].style.top = this.yPum +"px";
					positionmoveDiv[i].style.height = ( this.yPum + childrenH ) +"px";
					this.$refs.slide_down.style.height = ( this.yPum + childrenH ) +"px";
				}
			}
		},
		mounted(){
			let self = this;
			//组建渲染完成时答题区域的位置
        	self.startPositions()
		},
        computed:{
			...mapState(['flags_exercise_analysis']),
        }
    }
</script>

<style  lang="less" >
   .swiper-slide_top_fillBlack{
   		height: 100%;
		overflow-y: auto;
		width: 100%;
	   	.swiperSlide_down{
	   		padding: 0 .3rem;
			height: 100%;
			overflow-y: auto;
	   	}
		
		.swiper-slide_down_title{
			display: none;
			margin-top: .2rem;
			padding-right: 0.1rem;
			font-size: .32rem;
			color: #2C8CFF ;
			p{display: inline-block;color: #2C8CFF;}
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
		  	padding-right: 0.6rem;
		  	/*padding-right: 6%;*/
		  	height: 100%;
		  	
		  }
		.answer_bg{
			/*background:#EFEFF4!important;*/
			
			color:#333;
			height: 100%;
			/*overflow: auto;*/
			.answer_title{
				font-weight: 700;
				height:0.6rem;
				line-height:0.6rem;
				padding-left:.3rem;
				margin-left: 0.3rem;
				position: relative;
				margin-top: 0.6rem;
				font-size: .36rem;
				color: rgba(0, 0, 0, 1);
				
			}
			.answer_title:before{
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
		}
		.answer_score{
			height:0.6rem;
			line-height: 0.6rem;
			padding-left:.3rem;
			margin-left: 0.3rem;
			position: relative;
			margin-top: 0.6rem;
			color: rgba(0, 0, 0, 1);
		}
		.answer_score:before{
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
		.answer_score_sum{
			padding-left:.6rem;
			color: #FE5B59;
			font-size: .32rem;
		}
		.answer_reference{
			line-height:.60rem;
			background: #fff;
			color: #666;
			font-size: .32rem;
			margin-left:.6rem;
			margin-right: 0.3rem;
		}
		.swiperSlidewrap_2{
			/*overflow-y: hidden;*/
			position: absolute;
			min-height: 0.3rem ;
		    top: 0;
		    right:-2%;
		    width: 102%;
		    transition: all 10ms linear  ;
		    -moz-transition: all 10ms linear  ;
		    -webkit-transition: all 10ms linear  ;
		    -o-transition: all 10ms linear  ;
		    background: rgba(255,255,255,0);
		    .swiperBlock{
		    	width: 1.86rem;
    			height: 0.6rem;
		    	background: url(../../common/imgs/up_down_icon.png) no-repeat center;
    			background-size: contain;
		    	position: absolute;
		    	top: -0.6rem;
		    	transform: translateX(-50%);
		    	left:50% ;
		    	z-index: 9999;
		    }
		    .swiper-slide_question{
				height: 100%;
				background: #FFF;
				/*background: #F8F8F8;*/
				overflow-y: auto;
				padding-right: 0.15rem;
				text-align: justify;
				word-break: break-all;
				box-shadow: -0px -5px 7px rgba(0,0,0,.1);
				ul.practice_answer{
					margin-top: 0rem;
					li.select{
						width: 100%;
						height: 100%;
						box-sizing: border-box;
						padding-right:0.3rem;
						span.single_completion{
								margin: 0rem .0rem 0rem 0.3rem;
								width:0.6rem ;
								border-radius:50% ;
								text-align: center;
								font-size: 0.32rem;
								flex: 1;
							}
						div.text{
							height: 100%;
							word-break: break-all;
							color: #666;
							p{
								display: inline-block;
								outline:none;
							    resize:none;
							    font-size: 0.32rem;
							    text-align: justify;
							    word-break: break-all;
							    color: #666;
							}
						}
					}
				}
			}

		}
		.swiper-slide_title{
			margin-top: .2rem;
			font-size: .32rem;
			margin-bottom: .2rem;
			background: #f4f4f4;
			text-align: justify;
			p{display: inline-block;}
			span{
			color: #2C8CFF ;

			}

		}
		.practice_content_content{
			padding-bottom: .5rem;
			margin-top: .2rem;
			.practice_v_html{
				word-wrap:break-word !important;
				line-height: .56rem!important;
				font-size: .32rem!important;
				padding-bottom:0.9rem;
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
			.select{
				.display(flex);
				line-height:.68rem;
				color:#666;
				font-size: .32rem;
				.single_completion{
					margin: .0rem .26rem 0rem 0.3rem;
					width:0.68rem ;
					border-radius:50% ;
					text-align: center;
					font-size: 0.32rem;
					flex: 1;
				}
				.text{
					flex: 8;
					font-size: 0.32rem;
					border: 0;
					p{
						outline:none;
						resize:none;
						display: inline-block;
						font-size: 0.32rem;
						text-align: justify;
						word-break: break-all;
						}
					}
				.single_checked{
					margin: .2rem .26rem 0.2rem 0;
					width:0.68rem ;
					height:0.68rem ;
					border-radius:50% ;
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