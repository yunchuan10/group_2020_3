<template>
    <div class="mask" v-show="loading">
      <img src="../common/imgs/loading.gif" alt="">
      <!--  <p>加载中...</p>-->
    </div>
</template>
<script>
    export default{
        props: {
            loading: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return{
                loading1: true
            }
        }
    }
</script>
<style lang="less" scoped>
    .mask{
        width: 100%;
        position: fixed;
        background: #fff;
        text-align: center;
        width: 100%;
        height: 100%;
        font-size: 0.12rem;
        overflow: hidden;
        z-index: 10;
        img{
            margin-top: 50%;
            width: 1.8rem;    
        }
        p{
            font-size: 0.3rem;
            line-height: 0.8rem;
            color: #666;
            letter-spacing: 0.02rem;
        }
    }

</style>
