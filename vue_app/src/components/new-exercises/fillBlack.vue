<template>
	<div class="swiperSlideTop_fillBlack_answer" ref="swipe">
	    <div class="swiperSlideTop_fillBlack">
	    	<div class="swiperSlideDownAnswer_fillBlack" ref="slide_down">
	    		<div class="swiper-slide_down_title"><p v-text='item.SubjectCategoryName'></p></div>
	    		<div class="practice_content_content">
					<div class="practice_v_html" v-html='item.Description'></div>
				</div>		
	    	</div>
	    </div>
	    <div class="swiperSlidewrap_2 moveDiv">
	    	<div class="swiperBlock" ref="children" 
	    		@mousedown="down" @touchstart="down"
	            @mousemove="move" @touchmove="move"
	            @mouseup="end" @touchend="end"
	            @click="toastMask"
	    		></div>
    		<div class="swiper-slide_question" ref='ul_swipe'>
    			
				<ul class="practice_answer"  >
		            <li class="select" v-for="(opt,index) in item.Options"  :key="index">
		                <span class="single_completion">{{opt.Prefix}}.</span>
		                <div class="text" ><input fixedInput type="text" @focus="onFoucs" @blur = "onBlur" v-model="opt.subject_fill" class="swiper-bottom-textarea" placeholder="请输入答案" ref="fillBlack_text"/></div>
		            </li>
		        </ul>
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
                timer: null,
                //底部初始高度
                bottomH:null,
                //答题区域top初始位置
                moveDivTop:null,
                moveDivTopH:null,
                status_chart:false
                
			}
    	},
        created(){
        },
    	methods:{
    		...mapActions(['anserShowAndHidden','special_charts']),
    		onFoucs(event){
    			event.target.placeholder='';
    			if (/(Android)/i.test(navigator.userAgent)) {
    				
	            	let timers = setTimeout(() =>{
	            		this.$refs.ul_swipe.scrollTop = event.target.offsetTop;
	            	},500)
	            }else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
	            	
	            	
	            	event.target.offsetParent.offsetParent.style.top = 0+"%" ;
	            	event.target.offsetParent.offsetParent.style.height = 100+"%";
	            	this.timer = setTimeout(() => {
				      window.scrollTo(0,event.target.offsetTop)
				      // 间隔设为10，减少页面失去焦点定时器的突兀感，
				    },100);
	            	//获取焦点
	            	this.$store.commit('set_screenResizeIos',true);
	            } 
    		},
			onBlur(event){
				event.target.placeholder='请输入答案';
//				console.log(event.target.value)
				if (/(Android)/i.test(navigator.userAgent)) {
    				
	            	
	            }else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	            	
	            	clearTimeout(this.timer);
	            	event.target.offsetParent.offsetParent.style.top = this.moveDivTop ;
	            	event.target.offsetParent.offsetParent.style.height = this.moveDivTopH;
	            	this.$refs.slide_down.style.height = this.bottomH;
	            	this.$store.commit('set_screenResizeIos',false);
	            } 
	            
	            
	           	//特殊字符检测
	            this.encodeSearchKey(event.target.value);
	            console.log(event)
	            if(this.special_chart){
	            	
            		this.special_charts(true)
            		setTimeout(()=>{
            			this.special_charts(false);
            		},1500)
            		setTimeout(()=>{
            			var that = event;
            			that.target.focus();
            		},2000)
            	}else{
            		this.special_charts(false)
            	}
			},
			encodeSearchKey(key) {
			    const encodeArr = [{
			      code: '%',
			      encode: true
			    }, {
			      code: '?',
			      encode: true
			    }, {
			      code: '#',
			      encode: true
			    }, {
			      code: '&',
			      encode: true
			    }, {
			      code: '=',
			      encode: true
			    }];
			    key.replace(/[%?#&=]/g, ($, index, str) => {
			      for (const k of encodeArr) {
			        if (k.code == $) {
			          this.special_charts(true) 
			        }
			      }
			    });
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
	            touch.target.offsetParent.style.top = (this.yPum/parentH)*100 +"%";
	            touch.target.offsetParent.style.height = ((this.$refs.swipe.offsetHeight- this.yPum - this.$refs.children.offsetHeight)/parentH)*100 +"%";
	            this.$refs.slide_down.style.height = ((this.yPum + touch.target.offsetHeight)/parentH)*100+"%";
	            
	            this.bottomH = ((this.yPum + touch.target.offsetHeight)/parentH)*100+"%";
				this.moveDivTop = (this.yPum/parentH)*100 +"%";
				this.moveDivTopH = ((this.$refs.swipe.offsetHeight- this.yPum)/parentH)*100 +"%";
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
					positionmoveDiv[i].style.top = (this.yPum/parentH)*100 +"%";
					positionmoveDiv[i].style.height = (( this.yPum + childrenH )/parentH)*100+"%";
					this.$refs.slide_down.style.height = (1-((this.yPum + childrenH)/parentH))*100+"%";
					
					this.bottomH = (1-((this.yPum + childrenH)/parentH))*100+"%";
					this.moveDivTop = (this.yPum/parentH)*100 +"%";
					this.moveDivTopH = (( this.yPum + childrenH )/parentH)*100+"%";
				}
			},
			
			//提示拖拽
			toastMask(event){
				this.$emit('toggleHidden'); //第一个参数是父组件中v-on绑定的自定义回调方法，第二个参数为传递的参数
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
        	self.startPositions()
		},
    	computed:{
    		...mapGetters(['set_screenResize']),
    		...mapState(['special_chart'])
    	},
    	watch:{
    		set_screenResize:function(val){
    			if (/(Android)/i.test(navigator.userAgent)) {
					if(val){
						this.$refs.slide_down.parentElement.style.display='none';
						this.$refs.ul_swipe.offsetParent.style.position='relative';
	    				this.$refs.ul_swipe.offsetParent.style.top = 0 + '%';
	    				this.$refs.ul_swipe.offsetParent.style.height = 100+'%';
	    			}else{
	    				this.$refs.slide_down.parentElement.style.display='block';
	    				this.$refs.ul_swipe.offsetParent.style.position='absolute';
	    				this.$refs.ul_swipe.offsetParent.style.top =this.moveDivTop;
	    				this.$refs.ul_swipe.offsetParent.style.height = this.moveDivTopH;
	    			}
				}
    		}
    	},
    	destroyed() {
		  clearTimeout(this.timer)
		}
    }
</script>

<style  lang="less" >
	.swiperSlideTop_fillBlack_answer{
		position: relative;
	    height: 100%;
		
		.swiperSlidewrap_2{
			/*overflow-x: hidden;
			overflow-y: hidden;*/
			position: absolute;
			min-height: 0.3rem;
		    top: 0;
		    bottom: 0;
		    right:0%;
		    width: 102%;
		    left: 0;
		    transition: all 10ms linear  ;
		    -moz-transition: all 10ms linear  ;
		    -webkit-transition: all 10ms linear  ;
		    -o-transition: all 10ms linear  ;
		    background:rgba(255,255,255,0);
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
				width: 102%;
				background: #FFFFFF;
				overflow-y: auto;
				box-shadow: -0px -5px 7px rgba(0,0,0,.1);
				position: relative;
				ul.practice_answer{
					li.select{
						width: 100%;
						height: 100%;
						background: #fff;
						box-sizing: border-box;
						padding-right:0.3rem;
						border-bottom: 0.01rem solid #ddd;
						display: flex;
						span.single_completion{
								padding: 0 0.2rem 0 0.3rem;
								height:1.08rem ;
								border-radius:50% ;
								color: #666;
								line-height: 1.08rem;
								text-align: center;
								font-size: 0.32rem;
								display: inline-block;
							}
						div.text{
							height: 100%;
							flex: 1;
							input{
								height: 1.08rem;
							    outline: none;
							    resize: none;
							    font-size: 0.28rem;
							    color: #494949;
							    width: 100%;
							    background:rgba(0,0,0,0)
							}
							/*修改提示文字的颜色*/

							input::-webkit-input-placeholder { /* WebKit browsers */ 
								color: #BBBBBB; 
							} 
							input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
								color: #BBBBBB; 
							} 
							input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
								color: #BBBBBB; 
							} 
							input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
								color: #BBBBBB; 
							} 
						}
					}
				}
			}

		}
		.swiperSlideTop_fillBlack{
			height: 100%;
			overflow-y: auto;
			
			.swiperSlideDownAnswer_fillBlack{
				padding: 0 .3rem;
				height: 100%;
				overflow-y: auto;
			}
			.swiper-slide_down_title{
				padding-right: 0.1rem;
				margin-top: .2rem;
				font-size: .32rem;
				color: #666 ;
				word-break: break-all;
				p{display: inline-block;text-align: justify;color: #2C8CFF;}
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
			
			
			.swiper-slide_title{
				color: #666;
				margin-top: .2rem;
				font-size: .32rem;
				margin-bottom: .2rem;
				background: #f4f4f4;
				text-align: justify;
				p{display: inline-block;word-wrap:break-word ;}
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
					padding-bottom: 0.9rem;
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
				margin-top: .2rem;
				.select{
					background: #fff;
					.display(flex);
					line-height:.68rem;
					color:#666;
					font-size: .32rem;
					.single_completion{
						margin: .2rem .0rem 0.2rem 0;
						padding: 0 0.2rem 0 0.3rem;
						height:0.68rem ;
						border-radius:50% ;
						/*border: 1px solid #2C8CFF;*/
						color: #666;
						line-height: 0.72rem;
						text-align: center;
						font-size: 0.32rem;
						flex: 1;
					}
					.text{
						flex: 8;
						font-size: 0.32rem;
						border: 0;
						margin-top: 0.18rem;
						input{
							height: .68rem;
							line-height: .68rem;
							outline:none;
							resize:none;
							display: inline-block;
							font-size: 0.28rem;
							width: 94%;
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
		
	}
   
</style>