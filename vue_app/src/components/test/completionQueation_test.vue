<template>
	<div class="swiper-slide_top_completion_answer" ref="swipe">
	    <div class="swiper-slide_top_completion">
	    	<div class="swiper-slide_down" ref="slide_down">
	    		 <div class="swiper-slide_down_title">(<p v-text='item.SubjectCategoryName'></p>)<span v-text="item.Score +'分'"></span></div>
	    		 <div class="practice_content_content">
					<div class="text_html" v-html="decodeURIComponent(item.Description)"></div>
				 </div>
	    	</div>
	    </div>
	    <div class="swiperSlidewrap_2 moveDiv answer_bg" >
    		<div class="swiperBlock" ref="children"
    			@mousedown="down" @touchstart="down"
	            @mousemove="move" @touchmove="move"
	            @mouseup="end" @touchend="end"
	            @click="toastMask"
    			></div>
    		<div class="swiper-slide_question" ref='ul_swipe'>
				<ul class="practice_answer" >
		            <li class="select"  v-for="(option,index2) in item._SAnswerOptionList"  :key="index2">
		                <span class="single_completion" v-text='option.Prefix'></span>
		                <div class="text" ><input fixedInput  type="text" @focus="onFoucs" v-on:blur="blured(index2,item)" ref="essayAnswer" v-on:input="writeAns(index2)" class="swiper-bottom-textarea" placeholder="在此输入答案" /></div>
		            </li>
		        </ul>
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
	    		sec_i: -1,
//			    flags: true,
				comple_arr:[],
                flag: false,
                position: { x: 0, y: 0 },
                nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
                timer: null,
                
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
        	for(var k=0;k<this.item._SAnswerOptionList.length;k++){
	       		let _obj = {};
		       	_obj.SAnswerOptionId = this.item._SAnswerOptionList[k].SAnswerOptionId;
		       	//确定
		       	_obj.Answer = ''
	       		this.comple_arr.push(_obj);	
	          } 
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
		methods: {
			//点击切换按钮
			...mapActions(['anserShowAndHidden_test','special_charts']),
			toggle:function(){
				this.anserShowAndHidden_test(!this.flags_test)
				this.$emit('toggleHidden')
			},
			//得到焦点
			onFoucs(event){
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
			blured(index2,item){
				for(var i=0;i <this.$refs.essayAnswer.length;i++){
					this.comple_arr[i].Answer = this.$refs.essayAnswer[i].value
				}
				let comple_Array = this.comple_arr;
				//在此获取答案 并提交数据
				//改变后台数据改变答题卡选中状态
        		this.$store.commit('set_comple', {id:this.item.SubjectId, state:true ,comple_Array});
			
				
				event.target.placeholder='请输入答案';
				if (/(Android)/i.test(navigator.userAgent)) {
    				
	            }else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	            	clearTimeout(this.timer);
	            	event.target.offsetParent.style.top = this.moveDivTop;
	            	event.target.offsetParent.style.height = this.moveDivTopH;
	            	this.$refs.slide_down.style.height = this.bottomH;
	            	this.$store.commit('set_screenResizeIos',false);
	            } 
				//特殊字符检测
				this.encodeSearchKey(event.target.value);
	            if(this.special_chart){
	            	let ta = event;
            		this.special_charts(true)
            		setTimeout(()=>{
            			this.special_charts(false)
            		},1500)
            		setTimeout(()=>{
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
		    writeAns(index2) { },
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
	            //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
	            document.addEventListener("touchmove",this.preventDefault,{passive: false});
	          }
	        },
			preventDefault(e) {
			    e.preventDefault(); 
			},
	        //鼠标释放时候的函数
	        end(){
	          this.flag = false;
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
        computed:{
        	...mapGetters(['reseve_obj','set_screenResize']),
        	...mapState(['flags_test','special_chart']),
        },
        beforeUpdated(){},
        updated(){},
        beforeDestory(){},
        destroyed() {
		  clearTimeout(this.timer)
		}
    }
</script>

<style  lang="less" >
	.swiper-slide_top_completion_answer{
	    position: relative;
	    overflow: hidden;
	    height: 100%;
	    .answer_bg{
			/*background:#EFEFF4!important;*/
			font-size:.28rem;
			color:#333;
		}
		.swiperSlidewrap_2{
			position: absolute;
			min-height: 0.3rem;
		    top: 0%;
		    bottom: 0;
		    right:0%;
		    left: 0;
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
				background: #fff;
				overflow-y: auto;
				/*overflow-x:hidden;*/
				padding-right:0.2rem;
				text-align:justify;
				box-shadow: -0px -5px 7px rgba(0,0,0,.1);
				ul.practice_answer{
					li{
						border-bottom: 0.01rem solid #ddd;
					}
					li.select{
						width: 100%;
						height: 100%;
						background: #fff;
						box-sizing: border-box;
						display: flex;
						span.single_completion{
								padding: 0 0.2rem 0 0.3rem;
								height:1.08rem ;
								border-radius:50% ;
								color: #666;
								line-height: 1.08rem;
								text-align: center;
								font-size: 0.32rem;
								display: block;
							}
						div.text{
							width: 100%;
							height: 100%;
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
		
		 .swiper-slide_top_completion{
			height: 100%;
			overflow-y: auto;
			background: #F4F4F4;
			overflow-x: auto;
			
			.swiper-slide_down{
				height: 100%;
				padding: 0 0.3rem;
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
					font-size: .24rem;
					display: inline-block;
					margin-left: .18rem;
				}
			}
			.answer_bg{
				font-size:.28rem;
				color:#333;
				height: 100%;
				overflow: auto;
				.answer_title{
					height:1rem;
					line-height:1rem;
					margin-left:.3rem;
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
			.practice_answer{
				background: #F4F4F4;
				.select{
					background: #fff;
					.display(flex);
					line-height:.68rem;
					color:#666;
					font-size: .32rem;
					.single_completion{
						margin: .2rem .26rem 0.2rem 0;
						width:0.68rem ;
						height:0.68rem ;
						border-radius:50% ;
						color: #2C8CFF;
						line-height: 0.68rem;
						text-align: center;
						font-size: 0.32rem;
						flex: 1;
					}
					.text{
						flex: 8;
						font-size: 0.32rem;
						border: 0;
						margin-top: 0.2rem;
						input{
								min-height: .68rem;
								line-height: .68rem;
								word-break: break-all;
								outline: none;
	    						resize: none;
								display: inline-block;
								width: 94%;
								font-size: 0.26rem;
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