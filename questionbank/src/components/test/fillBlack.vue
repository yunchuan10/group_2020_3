<template>
	<div class="swiperSlideTop_fillBlack_answer jump">
	    <div class="swiperSlideTop_fillBlack">
	    	<div class="practice_content_center">
	    		<div class="nums">{{index}}、</div>
		        <!--<div>
		            <p class="label " v-text="item.SubjectCategoryName"></p>
		        </div>-->
	        </div>
	        <div class="practice_content_center ">
	            <div class="practice_v_html content_pl40" v-html="item.Description"></div>
	        </div>
	        <ul class="practice_answer"  >
	            <li class="select" v-for="(opt,index) in item.Options"  :key="index">
	                <span class="single_completion">{{opt.Prefix}}.</span>
	                <div class="text" ><input fixedInput type="text"  v-model="opt.subject_fill" class="iptxt-180 iptxt" placeholder="请输入答案" /></div>
	            </li>
	        </ul>
	    </div>
       
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions} from 'vuex'
    export default {
    	props: ['item','index'],
    	data(){
    		return {}
    	},
        created(){},
    	methods:{
    		...mapActions(['anserShowAndHidden','special_charts']),
    	},
		mounted(){},
    	computed:{
    		...mapGetters(['set_screenResize']),
    		...mapState(['special_chart'])
    	},
    	watch:{},
    	destroyed() {}
    }
</script>

<style  lang="less" >
	.swiperSlideTop_fillBlack_answer{
		position: relative;
	    height: 100%;
		padding: 0 30px;
		.practice_content_center{
			margin-bottom: 32px;
    		margin-top: 10px;
    		
		}
		.select{
    			padding-left:40px ;
    			line-height: 24px;
    			margin-bottom: 5px;
    			.text{
    				display: inline-block;
    			}
    		}
	}
   
</style>