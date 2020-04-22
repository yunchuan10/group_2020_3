<template>
    <div id="app" class="out_contain">
        <!-- 路由 -->
        <router-view/>
        
    </div>
</template>

<script>
// import { mapState, mapGetters, mapActions } from 'vuex'
// import { req1, req2 } from './api'
import { mapState} from 'vuex';
export default {
    name: 'App',
    data(){
		return {
			snHeight: document.documentElement.clientHeight,        //此处也可能是其他获取方法
            onHeight: document.documentElement.clientHeight,
            timer:false
        }
	},
    created() {
        
    },
    mounted() {
        // console.log( process.env.API_BASE_URL )
        const that = this
        window.addEventListener("resize", function() {
           return (() => {
                that.snHeight= document.documentElement.clientHeight;
             })();

         })
       
    },
    computed: {
        // ...mapState(['a']),
        // ...mapGetters(['a1'])
    },
    methods: {
        // ...mapActions( ['setA'] )
    },
    watch:{
		snHeight (val) {
            if (!this.timer) {
                this.snHeight = val;
                this.timer = true;
                let that = this;
                if(this.onHeight > this.snHeight){
                	this.$store.commit('set_screenResize',true);
                }else{
                	this.$store.commit('set_screenResize',false);
                }
                setTimeout(function () {
                    that.timer = false
                }, 400)
            }

        }
	}
}
</script>

<style lang="less">
    @import "./common/css/base.less";
    
    @import 'swiper/dist/css/swiper.min.css';
</style>
