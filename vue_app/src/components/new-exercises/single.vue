<template>
    <div class="swiperSlideTop_single">
    	<div class="swiperSlideTop_content">
	        <div class="swiper-slide_title">
	            <p v-text="item.SubjectCategoryName"></p>
	        </div>
	        <div class="practice_content_center">
	            <div class="practice_v_html" v-html="item.Description"></div>
	        </div>
	        <ul class="practice_answer">
	            <li :class=" {'select_li': opt.is_select}" v-for="(opt,index) in item.Options" :key="index" class="single_select"
	            @click="setSelectStatus(opt, index)">
	                <span class="single_new">{{opt.Prefix}}</span>
	                <div class="text_new">{{opt.Content}}</div>
	            </li>
	            
	        </ul>
	    </div>
    </div>

</template>

<script>

export default {
    props: ["item"],
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
            this.$emit('swiperGo'); //第一个参数是父组件中v-on绑定的自定义回调方法，第二个参数为传递的参数
        }
    }
};
</script>

<style  lang="less" >
.swiperSlideTop_single {
  position: relative;
  height: 100%;
  overflow-y: auto;
  padding: 0 0.3rem;
  width: 94%;
  .swiper-slide_title {
    margin-top: 0.2rem;
    font-size: 0.32rem;
    color: #666;
    text-align: justify;
    word-break: break-all;
    p {
      display: inline-block;
      color: #2C8CFF;
    }
    span {
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
  .swiperSlideTop_content{
  	padding-right: 0.15rem;
  	
  }
  .practice_content_center {
    margin-bottom: 0.32rem;
    margin-top: 0.1rem;
   
    .practice_v_html{
				word-wrap:break-word !important;
				line-height: .56rem!important;
				font-size: .32rem!important;
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
  .practice_answer {
    .select_li {
      span {
        background: #0081e6;
        color: #fff !important;
      }
    }
    .single_select {
      	margin-bottom: 0.4rem;
		.display(flex);
		line-height:.68rem;
		color:#666;
		font-size: .32rem;
      .single_new {
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

      .text_new {flex: 8;font-size: 0.32rem;line-height: 0.68rem;min-height:0.68rem ;text-align: justify;}
      .single_checked {
        margin-right: 0.26rem;
        margin-bottom: 0.4rem;
        width: 0.68rem;
        height: 0.68rem;
        /*border-radius:50%*/
        border: 1px solid #2c8cff;
        color: #2c8cff;
        line-height: 0.68rem;
        text-align: center;
        font-size: 0.32rem;
      }
    }
  }
}
</style>