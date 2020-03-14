<template>
    <div class="swiperSlideToptest">
    	<div class="swiperSlideToptest_content">
		    <div class="swiper-slide_title">(<p v-text='item.SubjectCategoryName'></p>)<span v-text="item.Score +'分'"></span></div>
			<div class="practice_content_center">
				<div class="text_html" v-text=" repalceHtml((decodeURIComponent(item.Description)+'').trim()) "></div>
			</div>
			<ul class="practice_answer" >
	            <!--循环出来所有的选项-->       <!--添加标志位控制能否点击-->
	            <li class="single_select" :class=" {'select_li': sec_i==index2} " v-for="(option,index2) in item._SAnswerOptionList" @click="addClass(index,index2,option,item._SAnswerOptionList)" :key="index2">
	                <span class="single" v-text='option.Prefix'></span>
	                <div class="text" v-text=" repalceHtml((decodeURIComponent(option.Content)+'').trim()) "></div>
	            </li>
	        </ul>
	    </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions ,mapMutations} from 'vuex'
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
        	addClass:function(index,index2,item,item2){
        		//改变当前页选项状态
        		this.sec_i=index2;
        		//存储数据  到时间传递给后台
        		var obj = {};
        		obj.SAnswerOption_Id = item.SAnswerOptionId;
        		//改变后台数据改变答题卡选中状态
        		this.$store.commit('set_singleCheck', {id:this.item.SubjectId, state:true ,obj});
        		//轮播图走到下一个题目
            	this.$emit('swiperGo'); //第一个参数是父组件中v-on绑定的自定义回调方法，第二个参数为传递的参数
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

<style  lang="less" >
   .swiperSlideToptest{
		position: relative;
		height: 100%;
		overflow-y: auto;
		padding: 0 .3rem;
		width: 94%;
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
		.swiperSlideToptest_content{
			padding-right: 0.15rem;
		}
		.practice_content_center{
			margin-bottom: .5rem;
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
			.select_li{
				span{background: #0081E6;color: #fff!important;}
			}
			.single_select{
				margin-bottom: 0.4rem;
				.display(flex);
				line-height:.68rem;
				color:#666;
				font-size: .32rem;
				
				.single{
					margin-right: .26rem;
					width:0.68rem ;
					height:0.68rem ;
					border-radius:50% ;
					border: 1px solid #2C8CFF;
					color: #2C8CFF;
					line-height: 0.68rem;
					text-align: center;
					font-size: 0.32rem;
					/*flex: 1;*/
					margin-bottom: 0;
				}
				
				.text{text-align: justify;flex: 8;font-size: 0.32rem;line-height: 0.68rem;min-height:0.68rem ;}
				.single_checked{
					margin-right: .26rem;
					margin-bottom: .4rem;
					width:0.68rem ;
					height:0.68rem ;
					/*border-radius:50%*/ ;
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