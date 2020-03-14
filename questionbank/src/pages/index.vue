<template>
	<div class="header_index">
		<h2>首页</h2>
		<div class="content_index">
			<ul class="practice_answer" >
	            <li class="single_select">
	                <span class="single">sheetID</span>
	                <input class="text_input" v-model='sheetIdTest'></input>
	            </li>
	            <li class="single_select">
	                <span class="single">UserId</span>
	                <input class="text_input" v-model="UserId"></input>
	            </li>
        	</ul>
        	<div class="button" @click="clickText()">进入考试-测试</div>
		</div>
		<div class="content_index">
			<ul class="practice_answer" >
	            
	            <li class="single_select">
	                <span class="single">sheetID</span>
	                <input class="text_input" v-model='sheetIdExerciser'></input>
	            </li>
	             <li class="single_select">
	                <span class="single">StudentId</span>
	                <input class="text_input" v-model='StudentId'></input>
	            </li> 
        	</ul>
        	<div class="button" @click='clickExercise()'>进入练习</div>
		</div>
		<!--<div class="content_index">
			<ul class="practice_answer" >
	            
	            <li class="single_select">
	                <span class="single">courseId</span>
	                <input class="text_input" v-model='sheetIdExerciser'></input>
	            </li>
	             <li class="single_select">
	                <span class="single">StudentId</span>
	                <input class="text_input" v-model='StudentId'></input>
	            </li> 
	            <li class="single_select">
	                <span class="single">subjectCategory</span>
	                <input class="text_input" type="number" v-model='subjectCategory'></input>
	            </li>
	            <li class="single_select">
	                <span class="single">type</span>
	                <input class="text_input" type="number" v-model='type'></input>
	            </li>
        	</ul>
        	<div class="button" @click='errorBook()'>进入错题集</div>
		</div>-->
		
		
		<!--<div class="content_index">
			<ul class="practice_answer" >
	            
	            <li class="single_select">
	                <span class="single">courseId</span>
	                <input class="text_input" v-model='courseId'></input>
	            </li>
	            <li class="single_select">
	                <span class="single">StudentId</span>
	                <input class="text_input" v-model='StudentId'></input>
	            </li> 
	            <li class="single_select">
	                <span class="single">subjectCategory</span>
	                <input class="text_input" type="number" v-model='subjectCategory'></input>
	            </li>
	            <li class="single_select">
	                <span class="single">type</span>
	                <input class="text_input" type="number" v-model='type'></input>
	            </li>
        	</ul>
        	<div class="button" @click='collection()'>进入收藏</div>
		</div>-->
		
		<div class="content_index">
			<ul class="practice_answer" >
	            <!--<li class="single_select">
	                <span class="single">ID</span>
	                <input class="text_input" ></input>
	            </li>--> 
	            <p class="p_1">examId 每次提交试卷都会动态改变</p>
	            <p class="p_2"> 故测试请联系后台配合,谢谢!!!</p>
	            <li class="single_select">
	                <span class="single">sheetID</span>
	                <input class="text_input" v-model='sheetIdAnalysis'></input>
	            </li>
	           
	            <li class="single_select">
	                <span class="single">examId</span>
	                <input class="text_input" v-model='examId'></input>
	            </li>
	            <li class="single_select">
	                <span class="single">UserId</span>
	                <input class="text_input" v-model="UserId_ay"></input>
	            </li>
        	</ul>
        	<div class="button" @click='clickAnalysis()'>进入考试解析</div>
		</div>
		
		<div class="fixed">
			
		</div>
		
	</div>
</template>
<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	export default {
		data(){
			return{
				sheetIdTest:'236e240f-c90d-4681-b4b3-9843d85653cf',
				UserId:'236e240f-c90d-4681-b4b3-9843d85653cf',
				sheetIdExerciser:'5314978f-765b-41dc-b88a-92bb80666cfd',
				StudentId:'3d1eb9ea-8fcd-11e8-9cca-00163e0f085f',
				sheetIdAnalysis:'',
				studentIdTest:'',
				studentIdExerciser:'',
				examId:'',
				UserId_ay:'',
				type:'',
				subjectCategory:'',
				courseId:'',
				
				defaultMsg: 'test',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 150,
                }
			}
		},
		methods:{
			...mapActions(['studentId']),
			clickText:function(){
				if(this.sheetIdTest && this.UserId){
					//页面跳转
					 this.$router.push({  //核心语句
				        path:'/test',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          id:this.sheetIdTest || '',  
				          //'236e240f-c90d-4681-b4b3-9843d85653cf' || ''
				          UserId:this.UserId || '' 
				        }
				      })
				}
			},
			clickExercise:function(){
				if(this.sheetIdExerciser && this.StudentId){
//					this.studentId(this.StudentId)
					 
					//页面跳转
					 this.$router.push({  //核心语句
				        path:'/newExercises',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          sheetId:this.sheetIdExerciser ,  
				          //'f4d10bd1-8fcc-11e8-9cca-00163e0f085f' || ''
				          StudentId:this.StudentId
				        }
				      })
					
				}
			},
			errorBook:function(){
				if(this.sheetIdExerciser && this.StudentId){
//					this.studentId(this.StudentId)
					 
					//页面跳转
					 this.$router.push({  //核心语句
				        path:'/errorBook',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          sheetId:this.sheetIdExerciser ,  
				          //'f4d10bd1-8fcc-11e8-9cca-00163e0f085f' || ''
				          StudentId:this.StudentId,
				          subjectCategory:this.subjectCategory,
				          type:this.type
				        }
				      })
					
				}
			},
			
			collection:function(){
				if(this.sheetIdExerciser && this.StudentId){
//					this.studentId(this.StudentId)
					 
					//页面跳转
					 this.$router.push({  //核心语句
				        path:'/collection',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          courseId:this.courseId ,  
				          //'f4d10bd1-8fcc-11e8-9cca-00163e0f085f' || ''
				          StudentId:this.StudentId,
				          subjectCategory:this.subjectCategory,
				          type:this.type
				        }
				      })
					
				}
			},
			
			clickAnalysis:function(){
				if(this.sheetIdAnalysis && this.examId && this.UserId_ay){
					console.log(this.sheetIdAnalysis,'this.sheetIdAnalysis')
					//页面跳转
					 this.$router.push({  //核心语句
				        path:'/report',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          id:this.sheetIdAnalysis ,  
				          //ExamId 每次提交试卷都会动态改变 故需要测试需要后台配合 53388AC5-BEC1-45F3-BFCB-74713148B0F9
				          ExamId:this.examId || '',
				          UserId:this.UserId_ay || ''
				        }
				      })
					
				}
			},
			
			
			

		}
	}
</script>
<style lang="less">
	.header_index{
		.fixed{width: 20px;height: 20px;position: absolute;top: 50%;background: #2C8CFF;}
		h2{text-align: center;margin-bottom: 26px;}
		position:relative;
		.content_index{
			.button{
				width: 60%;
				height: 80px;
				text-align: center;
				line-height: 80px;
				background: #0081E6;
				color: #fff;margin: 0 auto;
				margin-bottom: 26px;
				border-radius: 30px;
			}
			.practice_answer{
				.p_1{
					text-align: center
				}
				.p_2{
					text-align: center;color: #FE5B59;
					animation: change 1s  ease-in  infinite ;
					margin-bottom: 15px;
				}
				@keyframes change {
		            0%{ text-shadow: 0 0 4px #f00}
		            25%{ text-shadow: 0 0 40px #f00}
		            50%{ text-shadow: 0 0 40px #f00}
		            75%{ text-shadow: 0 0 40px #f00}
		            100%{ text-shadow: 0 0 4px #f00}
				}
				.select{
					span{background: #0081E6;color: #fff!important;}
				}
				.single_select{
					margin-bottom: 40px;
					/*.display(flex);*/
					line-height:68px;
					color:#666;
					font-size: 32px;
					
					.single{
						margin-right: 26px;
						margin-left: 126px;
						margin-top: 26px;
						min-width:68px ;
						/*height:0.68px ;*/
						border-radius:50% ;
						/*border: 1px solid #2C8CFF;*/
						color: #2C8CFF;
						/*line-height: 0.68px;*/
						text-align: center;
						font-size: 32px;
						/*flex: 1;*/
						margin-bottom: 0;
					}
					
					.text_input{/*flex: 8;*/font-size: 32px;}
					.single_checked{
						margin-right: 26px;
						margin-bottom: 40px;
						width:68px ;
						height:68px ;
						/*border-radius:50%*/ ;
						border: 1px solid #2C8CFF;
						color: #2C8CFF;
						line-height: 0.68px;
						text-align: center;
						font-size: 32px;
					}
				}
			}
		}
	}
</style>