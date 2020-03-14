<template>

    <div class="swiper-slide_top_answer" ref="swipe">
    	<div class="swiperSlideTop_content">
	    	<div class="swiperSlideDownanswer" ref="slide_down">
	    		<div class="swiper-slide_down_title">
	    			<p v-text="item.SubjectCategoryName"></p>
	    		</div>
	    		<div class="practice_content_content">
					<div class="practice_v_html" v-html='item.Description'></div>
				</div>
			</div>
	    	<div class="swiperSlidewrap_sinQue_2 answer_bg moveDiv" >
	    		<div class="swiperBlock" ref="children"
	    			@mousedown="down" @touchstart="down"
		            @mousemove="move" @touchmove="move"
		            @mouseup="end" @touchend="end"
	    			></div>
	    		<div class="swiper-slide_question">
	    			<div class="swiperContent_one">
		    			<div class="answer_inner">
					       <div class="answer_title">我的答案</div>
					       <div class="completion_content">
				           		<p v-if="item.subject_answer != 'null' && item.subject_answer" v-model="item.subject_answer" style="background: #fff;" v-html='decodeURIComponent(item.subject_answer)' class="swiper-bottom-textarea" ></p>
				           </div>
					    </div>
			            <!--得分-->
				        <!--<div class="answer_score">得分</div>
				        <div  class="answer_score_sum" v-text='item.Score'></div>-->
				        <!--参考答案-->
				        <div class="answer_inner" v-if="item.Remark != 'null' && item.Remark">
				        	<div class="answer_title">参考答案</div>
				        	<div class="answer_reference" v-html='item.Remark'></div>
				        </div>
				        <!--答案解析-->
				        <div class="answer_inner" v-if="item.Analysis && item.Analysis != 'null'">
					        <div class="answer_title">答案解析</div>
					        <div class="answer_reference" v-html='item.Analysis'></div>
				        </div>
				        <!--教师评语-->
				        <div class="answer_inner" v-if="item.Comment && item.Comment != 'null'" >
				        	<div class="answer_title">教师评语</div>
				        	<div class="answer_reference" v-html='item.Comment'></div>
				        </div>
				    </div>
		        </div>
	      	</div>
		</div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
    	props: ['item'],
    	data(){
    		return {
				flag: false,
                position: { x: 0, y: 0 },
                nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
            }
    	},
    	mounted(){
    		//组建渲染完成时答题区域的位置
        	this.startPositions()
    	},
    	methods: {
    		...mapActions(['anserShowAndHidden_exercise_analysis']),
			toggle(){
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
	            this.$refs.slide_down.style.height = (this.yPum + touch.target.offsetHeight)+"px";
	            
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
		computed:{
    		...mapState(['flags_exercise_analysis']),
    	},
    }
</script>

<style  lang="less" >
   .swiper-slide_top_answer{
		height: 100%;
		overflow-y: auto;
		.swiperSlideDownanswer{
			padding: 0 0.3rem;
			height: 100%;
			overflow-y: auto;
		}
		.swiper-slide_down_title{
			margin-top: .2rem;
			font-size: .32rem;
			color: #2C8CFF ;
			p{display: inline-block;color: #2C8CFF; text-align: justify;word-break: break-all;}
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
		  	height: 100%;
		}
		.answer_bg{
			
			color:#333;
			height: 100%;
			/*overflow: auto;*/
			.answer_title{
				height:0.6rem;
				line-height:0.6rem;
				padding-left:.3rem;
				margin-left: 0.3rem;
				position: relative;
				margin-top: 0.6rem;
				font-size: .36rem;
				color: rgba(0, 0, 0, 1);
				font-weight: 700;
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
			height:1rem;
			line-height: 1rem;
			padding-left:.3rem;
			margin-left: 0.3rem;
			position: relative;
			color: rgba(0, 0, 0, 1);
			font-weight: 700;
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
			font-size: .32rem;
		}
		.answer_reference{
			padding-left:.3rem;
			margin-left: 0.3rem;
			margin-right: 0.3rem;
			min-height: .01rem;
			background: #fff;
			font-size: .32rem;
			text-align: justify;
			word-wrap:break-word !important;
			line-height:.60rem;
			color: #666;
		}
		.swiperSlidewrap_sinQue_2{
			/*overflow-y: hidden;*/
			position: absolute;
		    top: 0;
		    background:rgba(255,255,255,0);
		    transition: all 10ms linear  ;
		    -moz-transition: all 10ms linear  ;
		    -webkit-transition: all 10ms linear  ;
		    -o-transition: all 10ms linear  ;
		    right:-2%;
		    width: 102%;
		    min-height: 0.3rem ;
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
					overflow-x: hidden;
					overflow-y: auto;
					width: 100%;
					box-shadow: -0px -5px 7px rgba(0,0,0,.1);
					.completion_content{
						height: 100%;
						/*padding-left: 0.3rem;
					    margin-left: 0.3rem;*/
						.swiper-bottom-textarea{
							width: 100%;
							border: 0;
							font-size: 0.32rem;
							text-indent: 0.3rem;
							height: 100%;
							outline:none;
							resize:none;
							padding: 0.15rem 0.38rem 0.15rem 0.3rem;
							line-height: 0.56rem;
							text-align: justify;
							word-break: break-all;
							box-sizing: border-box;
							margin-right:0.3rem;
							color: #666;
						}

					}
				.swiperContent_one{
					padding-right: 0.15rem;
					.answer_inner{
						margin-top:0.5rem
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
			margin-bottom: .32rem;
			margin-top: .1rem;
			line-height: .56rem;
			font-size: .32rem;
			text-align: justify;
			word-wrap:break-word ;
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


	}
</style>