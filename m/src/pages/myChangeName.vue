<template>
	<!--修改昵称位置-->
    <div class="my-page-name" >
    	<v-header :header_title="header_title">
    		<div slot='head_sr' class="my-sure" @click='saveName'>保存</div>
    	</v-header>
    	<div class='type-box-change'>
	      <input class='pay-ph'  placeholder='输入一个萌萌哒昵称吧' type='text' v-model="nickName" ref='changeName' />
	      <img class='type-box-r' src="../common/imgs/my/i8.png" @click='clearName()' />
	    </div>
    </div>
</template>
<script>
import { updateuser } from '../api';
import { getLocalSto } from "../common/js/utils.js";
import { mapActions,mapState } from 'vuex';
import { Toast } from 'mint-ui';
	export default {
		data(){
			return{
				header_title:'修改昵称',
				nickName:'',
//				guid:'',//uid从内存中获取
			}
		},
		created(){
			//从缓存中获取
			this.nickName = this.checkLogin.display_name || '';
		},
		computed:{
			...mapState(['checkLogin']),
		},
		methods:{
			...mapActions(['unCheckLogin']),
			//清空输入框的内容
			clearName(){
				this.$refs.changeName.value = ''
			},
			//提交修改的昵称
			saveName(){
				let changeName = this.$refs.changeName.value;
				//用户名添加正则验证
				let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
				let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
				if(changeName == ''){
					Toast({
					  message: '昵称不能为空！',
					  duration: 2000
					})
				}else if(regEn.test(changeName) || regCn.test(changeName)){
					Toast({
					  message: '昵称包含特殊字符',
					  duration: 2000
					});
					return false;
				}else{
					//保存昵称到后台
					updateuser(
						{
							guid:this.checkLogin.guid,
							nickname:changeName
						}
					).then(res =>{
						if(res.statusCode == 200){
							Toast({
							  message: '昵称修改成功！',
							  duration: 2000
							})
							//修改vuex中的名字
							this.checkLogin.display_name = this.$refs.changeName.value;
							this.unCheckLogin(this.checkLogin);
							//提交成功后完成页面跳转
							this.$router.push({path: '/my'});
						}else{
							Toast({
						  		message: res.message,
						  		duration: 2000
							});
						}
					}).catch(err=>{
						Toast({
						  message: '网络异常,稍后重试',
						  duration: 2000
						});
					})
				}


			}
		}
	}
</script>
<style lang="less">
	/*修改昵称*/
	.my-page-name{
		margin-top: .2rem;
		.my-sure{
			color: #fff;
            font-size: 0.27rem;
            line-height: 1rem;
		}
		.type-box-change{
            display: flex;
            height: 1.2rem;
            line-height: 1.2rem;
            padding: 0 0.4rem;
            background: #fff!important;
            opacity: 1;
            justify-content: space-between;
            align-items: center;
            .pay-ph{
                font-size: 0.32rem;
                color: #999;
                flex: 1;
                height: 100%;
                display: flex;
            }
            .type-box-r{
                width: 0.34rem;
                height: 0.34rem;
            }
		}
	}
</style>