<template>
	<div class="swiperSlideTopShortanswers_wrap" ref="swipe">
	    <div class="swiperSlideTopShortanswers">
	    	<div class="swiper-slide_down" ref="slide_down">
	    		 <div class="swiper-slide_down_title">(<p v-text='item.SubjectCategoryName'></p>)<span v-text="item.Score +'分'"></span></div>
	    		 <div class="practice_content_content">
					<!--<p v-html='添加标志位控制能否点击添加标志位控制能否点击添加标志位控制能否点击'></p>-->
					<div class="text_html" v-html="decodeURIComponent(item.Description)"></div>
				</div>
	    	</div>
	    </div>
	    <div class="swiperSlidewrap_sinQue_2 moveDiv" >
	    	<div class="swiperBlock" ref="children"
	    		@mousedown="down" @touchstart="down"
	            @mousemove="move" @touchmove="move"
	            @mouseup="end" @touchend="end"
	            @click="toastMask"
	    		></div>
	    		<div class="swiper-slide_question" ref='ul_swipe'>
			        <div class="completion_content">
			        	<textarea fixedInput  type="text"  v-on:focus="focusing()" v-on:blur="blured(item)" ref="ShortanswerTest" v-on:input="writeAns()" class="swiper-bottom-textarea" placeholder="在此输入答案" ></textarea>
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
    		sec_i: -1,
    		//切换答题区显示与隐藏
		    //记录简答题答案
		    ShortAnwser_Test:{},
            flag: false,
            position: { x: 0, y: 0 },
            nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
            
            //底部初始高度
            bottomH:null,
            //答题区域top初始位置
            moveDivTop:null,
            moveDivTopH:null
		  }
    	},
    	beforeCreate(){},
        created() {},
        beforeMount(){},
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
		methods: {
			...mapActions(['anserShowAndHidden_test','special_charts']),
			toggle:function(){
//				this.flags = !this.flags,
				this.anserShowAndHidden_test(!this.flags_test)
				this.$emit('toggleHidden')
			},
			//得到焦点
			focusing(){
				event.target.placeholder='';
				if (/(Android)/i.test(navigator.userAgent)) {
    				
	            	let timers = setTimeout(() =>{
	            		this.$refs.ul_swipe.scrollTop = event.target.offsetTop;
	            	},500)
	            }else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
	            	event.target.offsetParent.style.top = 0+"%" ;
	            	event.target.offsetParent.style.height = 100+"%";
	            	this.timer = setTimeout(() => {
				      window.scrollTo(0,2)
				      // 间隔设为10，减少页面失去焦点定时器的突兀感，
				    },100);
	            	this.$store.commit('set_screenResizeIos',true);
	            } 
			},
			//失去焦点 
			blured(item){
				event.target.placeholder='请输入答案';
				var ShortAnwser_test= this.ShortAnwser_Test;
				//在此获取答案 并提交数据
				//改变后台数据改变答题卡选中状态
          		this.$store.commit('ShortAnwser_Test', {id:this.item.SubjectId, state:true ,ShortAnwser_test});
          		
          		if (/(Android)/i.test(navigator.userAgent)) {
    				
	            	
	            }else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	            	clearTimeout(this.timer);
	            	event.target.offsetParent.style.top = this.moveDivTop;
	            	event.target.offsetParent.style.height = this.moveDivTopH;
	            	this.$refs.slide_down.style.height = this.bottomH;
	            	this.$store.commit('set_screenResizeIos',false);
	            } 
	            
	            //判断特殊字符
          		this.encodeSearchKey(event.target.value);
          		if(this.special_chart){
	            	let ta = event;
            		this.special_charts(true)
            		setTimeout(()=>{
            			this.special_charts(false)
            		},1500)
            		setTimeout(()=>{
            			console.log(ta)
            			ta.target.focus();
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
		    //实时记录
		    writeAns() {
	            if(this.$refs.ShortanswerTest.value){
	            	//暂时自己定义的  明天讨论   Answer
	            	this.ShortAnwser_Test.Answer = this.$refs.ShortanswerTest.value
	            }else{
	            	this.ShortAnwser_Test.Answer = ''
	            }
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
//				this.yPum = parentH-childrenH -5;
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
        computed:{
        	...mapState(['flags_test','special_chart']),
        	...mapGetters(['set_screenResize']),
        },
        beforeUpdated(){},
        updated(){},
        beforeDestory(){},
        destroyed(){}
    }
</script>

<style  lang="less" >
	.swiperSlideTopShortanswers_wrap{
		position: relative;
	    overflow: hidden;
	    height: 100%;
		.swiperSlidewrap_sinQue_2{
			position: absolute;
		    top: 0;
		    bottom: 0;
		    background: rgba(255,255,255,0);
		    min-height: 0.3rem ;
		    transition: all 10ms linear  ;
		    -moz-transition: all 10ms linear  ;
		    -webkit-transition: all 10ms linear  ;
		    -o-transition: all 10ms linear  ;
		    width: 100%;
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
					background: #F4F4F4;
					overflow: hidden;
					box-shadow: -0px -5px 7px rgba(0,0,0,.1);
					.completion_content{
						width: 100%;
						height: 100%;
						.swiper-bottom-textarea{
							width: 100%;
							border: 0;
							font-size: 0.28rem;
							text-indent: 0.3rem;
							height: 100%;
							outline:none;
							resize:none;
							padding: 0.3rem 0.38rem 0 0.3rem;
							line-height: 0.56rem;
							box-sizing: border-box;
						}

					}


				}

		}
		
		.swiperSlideTopShortanswers{
			height: 100%;
			overflow-y: auto;
			overflow-x: auto;
			
			.swiper-slide_down{
				padding: 0 0.3rem;
				height: 100%;
				overflow-y: auto;
				
			}
			.swiper-slide_down_title{
				margin-top: .2rem;
				font-size: .32rem;
				color: #2C8CFF ;
				text-align: justify;
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
					word-wrap:break-word ;
					line-height: .56rem!important;
					font-size: .32rem!important;
					padding-bottom:0.9rem;
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


		}
	}
  	
</style>