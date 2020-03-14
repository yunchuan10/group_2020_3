<template>

    <div class="swiperSlideTop_multiple jump">
		<div class="swiperSlideTop_content">
			<div class="nums">{{index}}、</div>
		    <!--<div class="swiper-slide_title ">
		    	<p class="label " v-text='item.SubjectCategoryName'></p>
		    </div>-->
			<div class="practice_content_center ">
				<div class="practice_v_html content_pl40" v-html='item.Description'></div>
			</div>
			<ul class="practice_answer" >
	            <!--循环出来所有的选项-->       <!--添加标志位控制能否点击-->
	            <li class="check_radio_li" @click="setSelectStatus(opt)"  v-for="(opt,index) in item.Options" :key="index">
	                <label class="label_c" :class="opt.is_select ? 'select_checked':'unselect_checked'"></label>
	                <span class="check_content" >{{ opt.Prefix }}、</span>
	                <div class="check_content" v-html="opt.Content"></div>
	            </li>
	        </ul>
	   </div>
    </div>
</template>

<script>
    export default {
    	props: ['item','index'],
    	data(){
    		return{

    		}
    	},
        computed:{},
        methods:{
            setSelectStatus(opt){
                opt.is_select = !opt.is_select;
            }

        }

    }
</script>

<style  lang="less">
   .swiperSlideTop_multiple{
		position: relative;
		height: 100%;
		overflow-y: auto;
		padding: 0 30px;
		width: 94%;
		.swiperSlideTop_content{
			padding-right: 15px;
		}
		.practice_content_center{
			margin-bottom: 32px;
			margin-top: 10px;
			
		}

	}
</style>