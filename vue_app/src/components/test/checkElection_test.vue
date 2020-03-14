<template>
    <div class="swiperSlideToptest">
    	<div class="swiperSlideToptest_content">
		    <div class="swiper-slide_title">(<p v-text='item.SubjectCategoryName'></p>)<span v-text="item.Score +'分'"></span></div>
			<div class="practice_content_center">
				<div class="text_html" v-text="repalceHtml((decodeURIComponent(item.Description)+'').trim())"></div>
			</div>
			<ul class="practice_answer" >
	            <!--循环出来所有的选项-->       <!--添加标志位控制能否点击-->
	            <li class="check_select_test"  v-for="(option,index2) in item._SAnswerOptionList" @click="addClass($event,index,index2,item._SAnswerOptionList)"  :key="index2">
	                <span class="single_check" v-text='option.Prefix'></span>
	                <div class="text_check_test" v-text=" repalceHtml((decodeURIComponent(option.Content)+'').trim())"></div>
	            </li>
	        </ul>
	    </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
    export default {
    	props: ['item','index'],
    	data(){
    		return{
    			sec_i: -1
    		}
    	},
    	beforeCreate(){},
        created() {},
        beforeMount(){},
        mounted(){},
        computed:{
        	...mapGetters(['reseve_obj']),
        },
        methods:{
        	addClass:function(event,index,index2,items){
        		//改变页面元素的class 即改变元素背景色
        		if(event.currentTarget.className == 'select_li_test select'){
        			event.currentTarget.className = 'check_select_test'
        		}else{
        			event.currentTarget.className = 'select_li_test select'
        		}
        		//判断多选 并存入数组
        		let _obj = {},flag = true;;
        		//给新对象赋值
        		_obj.SAnswerOption_Id = items[index2].SAnswerOptionId || '';
        		//判断 多选情况
        		if(this.reseve_obj.SubjectRecords[index].SubjectRecordSAnswerOptions.length == 0){
        			flag = true;
        		}else{
        			this.reseve_obj.SubjectRecords[index].SubjectRecordSAnswerOptions.some(item=>{
        				if(item.SAnswerOptionId == _obj.SAnswerOption_Id){
        					flag = false;
        				}
        			})
        		}
        		if(flag){
        			//改变后台数据改变答题卡选中状态
        			this.$store.commit('set_checkElection', { id:this.item.SubjectId, state:true ,_obj });
        		}
        	},
        	
        	
        	
        	
			//过滤HTML标签
			repalceHtml:function(str){
				var dr=str.replace(/<\/?.+?>/g,"");
				var dd = dr.replace(/<[^>]+>|&[^>]+;/g,"");
				var dds=dd.replace(/ /g,"");//dds为得到后的内容
				return dds;
			}
        },
        beforeUpdated(){},
        updated(){},
        beforeDestory(){},
        destoryed(){}
    }
</script>

<style  lang="less" scoped="">
   .swiperSlideToptest{
		position: relative;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0 .3rem;
		width: 94%;
		.swiperSlideToptest_content{
			padding-right: 0.15rem;
		}
		.swiper-slide_title{
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
		.practice_content_center{
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
		.practice_answer{
			.select_li_test{
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
			    .text_check_test{text-align: justify;flex: 8;font-size: 0.32rem;min-height:0.68rem;line-height: 0.68rem;}
			}
			.check_select_test{
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
				.text_check_test{text-align: justify;flex: 8;font-size: 0.32rem;min-height:0.68rem ;line-height: 0.68rem;}
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