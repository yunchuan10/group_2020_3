<template>
	<div class="swiperSlideTop_answerout jump" >
		<div class="swiperSlideTop_answer">
	    	<div class="practice_content_center" >
	    		<div class="nums">{{index}}、</div>
	    	</div> 
	    	<div style="margin-bottom: 20px;">
				<div class="practice_v_html content_pl40" v-html='item.Description'></div>
			</div>
			<vue-ueditor-wrap v-model="item.subject_answer" :config="myConfig" :key="index" @ready="ready"></vue-ueditor-wrap>
			<div  class="div_able"  contenteditable="true" @click="divClick($event)" v-html="item.subject_answer"></div>
		</div>
	</div>	
    
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
    	props: ['item','index'],
    	data(){
    		return {
    		   ueditorArr:'',
               myConfig: {
			      // 编辑器不自动被内容撑高
			      autoHeightEnabled: true,
			      // 初始容器高度
			      initialFrameHeight: 80,
			      // 初始容器宽度
			      initialFrameWidth: '100%',
			      // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
			      serverUrl: '',
			      // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
			      UEDITOR_HOME_URL: '/static/UE/',
                  elementPathEnabled : false,　　//是否启用元素路径，默认是true显示
                  wordCount:false , //是否开启字数统计
	    		  autoFloatEnabled: true,
	    		  zIndex: 9,
			      toolbars: [
	    				[
			               'undo', //撤销
			               'redo', //重做
			               'bold', //加粗   
			               'italic', //斜体
			               'underline', //下划线
			               'strikethrough', //删除线
			               'subscript', //下标
			               'superscript', //上标
			               'formatmatch', //格式刷        
			               'selectall', //全选      
			               'horizontal', //分隔线
				           'removeformat', //清除格式     
			               'cleardoc', //清空文档             
			               'fontfamily', //字体
			               'fontsize', //字号
			               'paragraph', //段落格式
				           'insertimage', //多图上传                                
				           'justifyleft', //居左对齐
				           'justifyright', //居右对齐
				           'justifycenter', //居中对齐
				           'forecolor', //字体颜色
				           'backcolor', //背景色
				           'insertorderedlist', //有序列表
				           'insertunorderedlist', //无序列表     
	    				]
	    			]
			    }
    		}
    	},
    	mounted(){},
    	
    	computed:{
    		...mapGetters(['set_screenResize']),
    		...mapState(['special_chart'])
    	},
    	
    	methods:{
    		...mapActions(['anserShowAndHidden','special_charts']),
			divClick(event){
				event.currentTarget.style.display = ' none ';
				this.ueditorArr.setShow();
			},
			ready(event){
				this.ueditorArr = event;
				event.setHide()
			}
            
    		
    	},
    	watch:{},
    }
</script>

<style  lang="less" >
.swiperSlideTop_answerout{
	position: relative;
    height: 100%;
    padding: 0 30px;
		.practice_content_center{
			margin-bottom: 32px;
   			margin-top: 10px;
		}
		.div_able{
			padding-left: 20px;
			min-height: 120px;
			border:1px solid #ddd;
			li{ list-style: inherit;}
			
		}
		
}
   
</style>