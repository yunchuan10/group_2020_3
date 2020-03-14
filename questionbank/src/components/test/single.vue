<template>
    <div class="swiperSlideTop_single jump">
    	<div class="swiperSlideTop_content">
    		<div>
	    		<div class="nums">{{index}}、</div>
		        <!--<div >
		            <p class="label " v-text="item.SubjectCategoryName"></p>
		        </div>-->
	        </div>
	        <div class="practice_content_center ">
	            <div class="practice_v_html content_pl40" v-html="item.Description"></div>
	        </div>
	        <ul class="practice_answer">
	            <li  v-for="(opt,index) in item.Options" :key="index" class="check_radio_li"
	            @click="setSelectStatus(opt, index)">
	            	<label class="label_c" :class="opt.is_select ? 'select_radio':'unselect_radio'"></label>
	                <span class="check_content">{{opt.Prefix}}、</span>
	                <div class="check_content">{{opt.Content}}</div>
	            </li>
	        </ul>
	    </div>
    </div>

</template>

<script>

export default {
    props: ["item",'index'],
    data() {
        return {

        };
    },
    methods: {
    	//单选或者判断进行选择项
        setSelectStatus(opt, i){
            if(opt.is_select){ return; }
            let { Options } = this.item;
            Options.forEach(element => {
                element.is_select = false;
            });
            opt.is_select = true;
            //轮播图走到下一个题目
        }
    }
};
</script>

<style  lang="less" >
.swiperSlideTop_single {
  position: relative;
  height: 100%;
  overflow-y: auto;
  padding: 0 30px;
  width: 94%;
  
  .swiperSlideTop_content{
  	padding-right: 15px;
  	
  }
  .practice_content_center {
    margin-bottom: 32px;
    margin-top: 10px;
   
  }
}
</style>