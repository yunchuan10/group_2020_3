<template>

    <div class="swiperSlideTopQue">
    	<div class="swiper-slide_down">
    		 <div class="swiper-slide_down_title">(<p v-text='item.SubjectCategoryName'></p>)<span v-text="item.Score +'分'"></span></div>
    		 <div class="practice_content_content">
				<div class="text_html" v-html='decodeURIComponent(item.Description)'></div>
			</div>
			<div :class="{'swiperSlide_trag_rg' : flags ,'swiperSlide_trag_none': !flags}" ref='trarget'  @click="toggle()"><span></span><p>答<br/>题</p></div>
			<div :class="{'swiperSlide_trag_lf' : !flags ,'swiperSlide_trag_none': flags}" ref='trarget'  @click="toggle()"><p>返<br/>回</p><span></span></div>
    	</div>
    	<div :class="{'swiperSlidewrap_sinQue' :flags ,'swiperSlidewrap_sinQue_2':!flags}" >
    		
    		<div class="swiper-slide_question">
    			<!--  -- 答题区域的标题 --  -->
	    		<!--<div class="swiper-slide_title"><p>(<span>单选题</span>)循环出来所有的选项循环出来所有的选项循环出来所有的选项循环出来所有的选项循环出来所有的选项</p></div>-->
				<ul class="practice_answer_completion" >
		            <!--添加标志位控制能否点击   循环出来所有的选项   -->
		            <li class="select"  v-for="(option,index2) in item._SAnswerOptionList"  :key="index2" :class="{active:index2 == num}" @click="tab(index2)">
		                <!--<span class="single_completion" v-text='option.Prefix'></span>-->
		                 <span class="single_completion" >问题{{ index2 | filter1}}</span>
		            </li>
		        </ul>
		        <!--  -- 填写内容区 -- -->
		        <div class="completion_content" v-for="(option,index2) in item._SAnswerOptionList"  v-show="index2 == num">
		        	<p v-text="option.Content"></p>
		        	<textarea  type="text" v-on:focus="focusing()" maxlength="500" v-on:blur="blured(index2,item)" ref="singleQue" v-on:input="writeAns(index2)" class="swiper-bottom-textarea" placeholder="请输入答案，500字以内" ></textarea>
		        </div>
	        </div>
      </div>
    </div>
</template>

<script>
    export default {
    	props: ['item'],
    	data(){
    		return {
    		sec_i: -1,
		    flags: true,
		    comple_arr:[],
			num:0
		  }
    	},
    	beforeCreate(){},
        created() {
        	
            /*
             
             * 
             * 问答题 与 填空题  的  区别？？？？？？？？
             * 所用保存  的字段是哪一个呢？？？  
             * 
             * 现在暂时用  SubjectRecordAppendixes 这个集合  到时间具体再确认？？？
             * 
             * 
             * */
        },
        beforeMount(){},
        mounted(){
        	for(var k=0;k<this.item._SAnswerOptionList.length;k++){
	       		let _obj = {};
		       	_obj.SAnswerOption_Id = this.item._SAnswerOptionList[k].SAnswerOptionId;
		       	//暂时自己定义的  明天讨论
		       	_obj.Answer = ''
	       		this.comple_arr.push(_obj);	
	          }  
        },
		methods: {
			//tab切换
			tab(index){
				 this.num = index;
			},
			toggle:function(){
				this.flags = !this.flags
			},
			//得到焦点
			focusing(){},
			//失去焦点 
			blured(index2,item){
				
				var comple_Array = this.comple_arr;
				//在此获取答案 并提交数据
				//改变后台数据改变答题卡选中状态
          		this.$store.commit('set_singQue', {id:this.item.SubjectId, state:true ,comple_Array});
			},
		    //实时记录
		    writeAns(index2) {
		        for(let i=0;i<this.$refs.singleQue.length;i++){
		            if(this.$refs.singleQue[i].value){
		            	//暂时自己定义的  明天讨论   Answer
		            	this.comple_arr[index2].Answer = this.$refs.singleQue[i].value
		            }
		        }
		    },
		},
        computed:{},
        beforeUpdated(){},
        updated(){},
        beforeDestory(){},
        destoryed(){},
        filters: {
		    filter1: (index2)=>{
		          if (index2==0){
		            return "一"
		          }else if(index2==1){
		            return "二"
		          }else if(index2==2){
		            return "三"
		          }else if(index2==3){
		            return "四"
		          }else if(index2==4){
		            return "五"
		          }else if(index2==5){
		            return "六"
		          }
		    }
	  }
    }
</script>

<style  lang="less" >
   .swiperSlideTopQue{
		height: 100%;
		overflow-y: auto;
		padding: 0 .3rem;
		overflow-x: hidden;
		position: relative;
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
			    top:50%;
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
		    top: -0.0001rem;
		    right:0%;
		    background: #F4F4F4;
		    height: 100%;
		    transition: all 2s linear  ;
		    -moz-transition: all 2s linear  ;
		    -webkit-transition: all 2s linear  ;
		    -o-transition: all 2s linear  ;
		    width: 100%;
		    background: #F4F4F4;
		    .swiper-slide_question{
					height: 100%;
					background: #F4F4F4;
					.completion_content{
						width: 100%;
						box-sizing: border-box;
						padding: 0 0.3rem;
						p{font-size: 0.32rem;color: #666;padding: .2rem 0;line-height: 0.48rem;}
						.swiper-bottom-textarea{
							width: 100%;
							min-height: 5rem;
							border: 0;
							overflow: auto;
						}
						
					}
					ul.practice_answer_completion{
						border-bottom: 1px solid #ddd;
						padding-left: 0.3rem;
						.display(flex);
						background: #F4F4F4;
						li.select{
							&.active{
								span{border-bottom: 1px solid #2C8CFF;}
							}
							div.text{
								width: 96%;
								input{
									    min-height: 0.68rem;
									    line-height: 0.68rem;
									    display: inline-block;
									    width: 95%;
									    box-sizing: border-box;
								}
							}
						}
					}
					
				}
		    
		}
		.swiperSlidewrap_sinQue{
				background: #F4F4F4;
		        height: 100%;
				transition: all 2s linear  ;
				transition: all 2s linear  ;
			    -moz-transition: all 2s linear  ;
			    -webkit-transition: all 2s linear  ;
			    -o-transition: all 2s linear  ;
			    background: #F4F4F4;
			    position: absolute;
			    top: 0;
			    background: transparent;
			    height: 100%;
			    width: 100%;
			    right: -100%;
			    .swiper-slide_down_title{
				margin-top: .2rem;
				font-size: .32rem;
				color: #2C8CFF ;
				overflow:hidden;
				p{display: inline-block;}
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
			.swiper-slide_question{
					height: 100%;
					background: #F4F4F4;
					.completion_content{
						width: 100%;
						box-sizing: border-box;
						padding: 0 0.3rem;
						p{font-size: 0.32rem;color: #666;padding: .2rem 0;line-height: 0.48rem;}
						.swiper-bottom-textarea{
							width: 100%;
							min-height: 5rem;
							border: 0;
							overflow: auto;
						}
						
					}
					ul.practice_answer_completion{
						border-bottom: 1px solid #ddd;
						padding-left: 0.3rem;
						.display(flex);
						background: #F4F4F4;
						li.select{
							&.active{
								span{border-bottom: 1px solid #2C8CFF;}
							}
							div.text{
								width: 96%;
								input{
									    min-height: 0.68rem;
									    line-height: 0.68rem;
									    display: inline-block;
									    width: 95%;
									    box-sizing: border-box;
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
			.text_html{
				word-wrap:break-word !important;
				line-height: .56rem!important;
				font-size: .32rem!important;
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
		.practice_answer_completion{
			.display(flex);
			background: #F4F4F4;
			.select{
				.display(flex);
				line-height:.68rem;
				color:#666;
				font-size: .32rem;
				.single_completion{
					margin: .2rem .26rem 0rem 0;
					min-width:0.68rem ;
					height:0.68rem ;
					/*border-radius:50% ;*/
					/*border: 1px solid #2C8CFF;*/
					color: #333;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.28rem;
					flex: 1;
				}
				.text{
					flex: 8;
					font-size: 0.32rem;
					border: 0;
					margin-top: 0.2rem;
					input{
							height: .68rem;
							line-height: .68rem;
							
							display: inline-block;
						}
					}
				.single_checked{
					margin: .2rem .26rem 0rem 0;
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