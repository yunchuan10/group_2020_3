<template>

    <div class="swiper-slide_top_short" ref="swipe">
    	<div class="swiper-slide_down" ref="slide_down">
    		<div class="swiper-slide_down_title"><p v-text='item.SubjectCategoryName'></p></div>
    		 <div class="practice_content_content">
				<div class="text_html" v-html='decodeURIComponent(item.Description)'></div>
			</div>
			
    	</div>
    	<!--解析答案-->
    	<div class="swiperSlidewrap_sinQue_2 moveDiv" >
    		<div class="swiperBlock" ref="children"
    			@mousedown="down" @touchstart="down"
	            @mousemove="move" @touchmove="move"
	            @mouseup="end" @touchend="end"
    			></div>
    		<div class="swiper-slide_question">
		        <div>
			       <div class="answer_title">我的答案</div>
			       <div class="answer_reference" v-if="item._StudentAnswer[0].StudentA && item._StudentAnswer[0].StudentA!='null'"  v-html="decodeURIComponent(item._StudentAnswer[0].StudentA)"></div>
			    </div>
		    	<!--得分-->
		        <div class="answer_score">得分</div>
		        <div  class="answer_score_sum" v-text='item._StudentAnswer[0].StudentScore'></div>
		        <!--参考答案-->
		        <div v-if="item.Remark && item.Remark!='null'">
		        	<div class="answer_title">参考答案</div>
		        	<div class="answer_reference" v-html='decodeURIComponent(item.Remark)'></div>
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
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
    	props: ['item','index'],
    	data(){
    		return {
    		//切换答题区显示与隐藏
			flag: false,
            position: { x: 0, y: 0 },
            nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
		  }
    	},
    	mounted(){
			//组建渲染完成时答题区域的位置
			let self = this;
        	self.startPositions()
		},
		methods: {
			...mapActions(['anserShowAndHidden_test_analysis']),
			toggle:function(){
				this.anserShowAndHidden_test_analysis(!this.flags_test_analysis)
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
	            //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
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
//				this.yPum = parentH-childrenH -5;
				var positionmoveDiv = document.getElementsByClassName('moveDiv');
				for(var i=0;i < positionmoveDiv.length;i++){
					positionmoveDiv[i].style.top = this.yPum +"px";
					positionmoveDiv[i].style.height = ( this.yPum + childrenH ) +"px";
					this.$refs.slide_down.style.height = (this.yPum + childrenH)+"px";
				}
			},
			
			
			
		},
        computed:{
        	...mapState(['flags_test_analysis']),
        },
    }
</script>
<style  lang="less" >
   .swiper-slide_top_short{
		    height: 100%;
		    overflow-y: auto;
		    width: 100%;	
		.swiper-slide_down{
			padding:0 0.3rem;
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
		.swiperSlide_trag_rg{
				width: .8rem;
			    height: 1.4rem;
			    position: absolute;
			    background: rgba(44,140,255,.8);
			    color: #fff;
			    right: 0;
			    cursor: pointer;
			    z-index: 999;
			    top:50%;
			    transform: translate(0%,-50%);
			    border-top-left-radius: .2rem;
			    border-bottom-left-radius: .2rem;
			    transform:translateY(-0.8rem);
			    .display(flex);
			    justify-content: space-around;
			    p{
			    	font-size: 0.28rem;
			    	line-height: 2.5;
			    }
			    span{
			    	display: inline-block;
			    	width: 0.18rem;
			    	height: 0.3rem;
			    	background: url(../../common/imgs/meta_pre.png);
			    	background-repeat: no-repeat;
			    	background-size: contain;
			    	margin-top: 0.6rem;
			    	}
			    
			}
		.swiperSlide_trag_none{
			display: none;
		}
		.swiperSlide_trag_lf{
				width: .8rem;
			    height: 1.4rem;
			    position: absolute;
			    background: rgba(44,140,255,.8);
			    color: #fff;
			    left: .02rem;
			    cursor: pointer;
			    z-index: 999;
			    top:46%;
			    transform: translate(0%,-46%);
			    border-top-right-radius: .2rem;
			    border-bottom-right-radius: .2rem;
			    transform:translateY(-0.8rem);
			    .display(flex);
			    justify-content: space-around;
			    p{
			    	font-size: 0.28rem;
			    	line-height: 2.5;
			    }
			    span{
			    	display: inline-block;
			    	width: 0.18rem;
			    	height: 0.3rem;
			    	background: url(../../common/imgs/meta_next.png);
			    	background-repeat: no-repeat;
			    	background-size: contain;
			    	margin-top: 0.6rem;
			    }
			}
		.swiperSlidewrap_sinQue_2{
			position: absolute;
		    top: -0.01rem;
		    right:-2%;
		    background: rgba(255,255,255,0);
		    transition: all 10ms linear  ;
		    -moz-transition: all 10ms linear  ;
		    -webkit-transition: all 10ms linear  ;
		    -o-transition: all 10ms linear  ;
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
				overflow-y: auto;
				padding-right: 0.15rem;
				text-align: justify;
				box-shadow: -0px -5px 7px rgba(0,0,0,.1);
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
				.answer_reference{
					line-height:.60rem;
					background: #fff;
					color: #333;
					font-size: .32rem;
					margin-left:.6rem;
					margin-right: 0.3rem;
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
	}
</style>