<template>
    <div id="app"  class="out-contain">
        <!-- 协议弹框 -->
        <v-agreement v-if="this.$store.state.is_agreement"></v-agreement>
        <!-- 页面路由 -->
        <router-view/>
    </div>
</template>

<script>
import { getLocalSto,setLocalSto,delLocalSto } from './common/js/utils'
import { mapActions } from 'vuex'
import { Toast } from 'mint-ui';
export default {
    name: 'App',
    created() {
        // 先获取用户信息
        if( !this.$store.state.checkLogin.guid ){
            let token = getLocalSto('user')||'';
            if(token){
                this.checkLogin(token);

                // 轮询检测登陆状态
                this.checkLoop();

            }
        }
    },
    methods: {
        ...mapActions(['checkLogin','checkLoginLoop','unCheckLogin']),
        // 轮询检测登陆状态
        checkLoop(){
            this.$store.state.checkLoopT = setTimeout(()=>{
                let token = getLocalSto('user')||'';
                if(!token || this.$router,this.$route.system){ // 有system是app不验证
                    clearTimeout(this.$store.state.checkLoopT)
                    return;
                }
                this.checkLoginLoop({token, cb:(res)=>{
                    if(res.statusCode==200){
                        this.checkLoop()
                    }else{
                        Toast({
                            message: '你的账号在其他地方登录，你被踢出，请重新登录',
                            duration: 2000
                        });
                        this.$store.state.checkLoopT && clearTimeout(this.$store.state.checkLoopT)
                        //清空本地存储
                        delLocalSto('user');
                        delLocalSto('uid');
                        delLocalSto('guid');
                        this.unCheckLogin({});
                        //清空缓存后跳转到登陆页面
                        setLocalSto('loginBack', '/');
                        setTimeout(()=>{
                            this.$router.replace({path: '/login'});
                        }, 2000)
                    }
                }})
            }, 2*60*1000)
        }
    }
}
</script>

<style lang="less">
    @import "./common/css/base.less";
</style>
