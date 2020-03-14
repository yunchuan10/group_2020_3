<template>
    <div class="swiper-slide_top_completion" ref="swipe">
    	<div class="swiper-slide_down" ref="slide_down">
    		<div class="swiper-slide_down_title"><p v-text='item.SubjectCategoryName'></p></div>
    		 <div class="practice_content_content">
				<div class="text_html" v-html='decodeURIComponent(item.Description)'></div>
			 </div>
			
    	</div>
    	<!-- 解析答案 -->
    	<div class="swiperSlidewrap_2 moveDiv" >
    		<div class="swiperBlock" ref="children"
    		@mousedown="down" @touchstart="down"
            @mousemove="move" @touchmove="move"
            @mouseup="end" @touchend="end"		
    		></div>
    		<div class="answer_bg">
	    		<div class="swiper-slide_question">
	    			<div class="answer_title">我的答案</div>
					<ul class="practice_answer">
			            <li class="select"  v-for="(option,index) in item._StudentAnswer">
			                <span class="single_completion">{{index+1}}.</span>
			                <div class="text" style="margin-right: 0.3rem;">
			                 	<span v-if="option.ExtendAnswer && option.ExtendAnswer!='null'" class="single_check" v-html="decodeURIComponent(option.ExtendAnswer)"></span>
			                </div>
			            </li>
			        </ul>
				    <div class="answer_score">得分</div>
			        <div  class="answer_score_sum" v-text='item._StudentAnswer[0].StudentScore'></div>
			        <!--正确答案-->
			        <div v-if="item._SAnswerOptionList && item._SAnswerOptionList.length">
			        	<div class="answer_title" >正确答案</div>
			        	<ul class="practice_answer">
				            <li class="select"  v-for="(option,index) in item._SAnswerOptionList">
				                <span class="single_completion">{{index+1}}.</span>
				                <div class="text">
				                 	<p class="single_check" v-if="option.Content && option.Content!='null'" v-html="decodeURIComponent(option.Content)"></p>
				                </div>
				            </li>
			        	</ul>
			        </div>
			
			        <!--答案解析-->
			        <div v-if="item.Analysis && item.Analysis!='null'">
			        	<div class="answer_title" >答案解析</div>
			        	<div class="answer_reference" v-html='decodeURIComponent(item.Analysis)'></div>
			        </div>
			        <!--教师评语-->
			        <div v-if="item._StudentAnswer[0].Comment && item._StudentAnswer[0].Comment!='null'">
			        	<div class="answer_title">教师评语</div>
			        	<div class="answer_reference" v-html='decodeURIComponent(item._StudentAnswer[0].Comment)'></div>
			        </div>
			        <div style="height:1rem;"></div>
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
    		return {
//				flags: true
				flag: false,
                position: { x: 0, y: 0 },
                nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
			}
    	},
    	mounted(){
	        let self = this;
            document.body.addEventListener('focusout', function () {
		        window.scrollTo(0,0);
		    }),
		    document.body.addEventListener('touchmove', e => {
			    return false
			}, false),
			
			//组建渲染完成时答题区域的位置
        	this.startPositions()
        },
		methods: {
			//点击切换按钮
			...mapActions(['anserShowAndHidden_test_analysis']),
			toggle:function(){
				this.anserShowAndHidden_test_analysis(!this.flags_test_analysis)
				this.$emit('toggleHidden',this.flags)
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
			    //取消默认事件
	          document.removeEventListener('touchmove',this.preventDefault, {passive: false});
			},
	        //鼠标释放时候的函数
	        end(){
	          this.flag = false;
	        },
	        //组建渲染完成时答题区域的位置
			startPositions(){
				 //获取父元素的高度
	            var parentH = this.$refs.swipe.offsetHeight;
	            var childrenH = this.$refs.children.offsetHeight;
	            
	            this.yPum = ( parentH-childrenH ) / 2;
//				this.yPum = parentH-childrenH -5;
				var positionmoveDiv = document.getElementsByClassName('moveDiv');
				for(var i=0;i < positionmoveDiv.length;i++){
					positionmoveDiv[i].style.top = this.yPum +"px";
					positionmoveDiv[i].style.height = (this.yPum + childrenH) +"px";
					this.$refs.slide_down.style.height = (this.yPum + childrenH)+"px";
				}
			},
			
			
			
		},
        computed:{
//      	...mapGetters(['reseve_obj']),
			...mapState(['flags_test_analysis']),
        },
    }
</script>

<style  lang="less" >
   .swiper-slide_top_completion{
		height: 100%;
		overflow-y: auto;
		background: #F4F4F4;
		
		.swiper-slide_down{
			padding: 0 0.3rem;
			height: 100%;
			overflow-y: auto;
		}
		.swiper-slide_down_title{
			margin-top: .2rem;
			font-size: .32rem;
			color: #2C8CFF ;
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
		.answer_bg{
			/*background:#EFEFF4!important;*/
			
			color:#333;
			height: 100%;
			width: 102%;
			/*overflow: auto;*/
			padding-right: 0.15rem;
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
			height:0.6rem;
			line-height: 0.6rem;
			padding-left:.3rem;
			margin-left: 0.3rem;
			position: relative;
			margin-top: 0.6rem;
			font-size: 0.36rem;
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
			color: #FE5B59;
			font-size: .32rem;
		}
		.answer_reference{
		    line-height:.60rem;
			background: #fff;
			color: #666;
			font-size: .32rem;
			margin-left:.6rem;
		}

		.swiperSlidewrap_2{
			position: absolute;
			min-height: 0.3rem ;
		    top: 0%;
		    right:-2%;
		    width: 102%;
		    transition: all 10ms linear;
		    -moz-transition: all 10ms linear;
		    -webkit-transition: all 10ms linear;
		    -o-transition: all 10ms linear;
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
				overflow-y: auto;
				overflow-x:hidden;
				text-align:justify;
				box-shadow: -0px -5px 7px rgba(0,0,0,.1);
				margin-right: 0.3rem;
				ul.practice_answer{
					margin-top: 0rem;
					li.select{
						width: 100%;
						height: 100%;
						background: #fff;
						box-sizing: border-box;
						padding-left: 0.3rem;
						span.single_completion{
								width:0.68rem ;
								border-radius:50% ;
								color: #666666;
								text-align: center;
								font-size: 0.32rem;
								flex: 1;
							}
						div.text{
							height: 100%;
							color: #666;
							p{
								display: inline-block;
								outline: none;
    							resize: none;
    							font-size: 0.32rem;
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
			p{display: inline-block;}
			span{
			color: #2C8CFF ;	
				
			}
			
		}
		.practice_content_content{
			margin-bottom: .32rem;
			margin-top: .1rem;
			text-align: justify;
			word-wrap:break-word !important;
			line-height: .56rem!important;
			font-size: .32rem!important;
			.text_html{
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
			background: #F4F4F4;
			.select{
				background: #fff;
				.display(flex);
				line-height:.68rem;
				color:#666;
				font-size: .32rem;
				padding-left: 0.3rem;
				.single_completion{
					width:0.68rem ;
					border-radius:50% ;
					color: #666;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
					flex: 1;
				}
				.text{
					flex: 8;
					font-size: 0.32rem;
					border: 0;
					margin-right: 0.3rem;
					color: #666;
					p{
						outline: none;
						resize: none;
						display: inline-block;
						font-size: 0.32rem;
						color: #666;
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