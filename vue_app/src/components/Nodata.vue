<template>
    <div class="mask" v-show="nodata">
        <img src="../common/imgs/nodata.png" alt="">
        <p>{{nodatamsg}}</p>

         <!--<span class="ceshi">token值: {{tokenMsg}}</span>-->
        <!--<p>categoryId: {{categoryId}}</p>
        <span class="ceshi">签名: {{signature11}}</span></br>
        <div class="ceshi">数据: {{data88}}</div>
        <div class="ceshi">结果: {{result}}</div>
        <div class="ceshi">url: {{url}}</div>-->

    </div>
</template>
<script>
    export default{
        props: {
            nodata: {
                type: Boolean,
                default: false
            },
            nodatamsg:String,
            tokenMsg:String,
            // signature11:String,
            // categoryId: Number,
            // data88: [],
            // result: String
        },
        data(){
            return{
                // url:"链接"
            }
        },
        mounted(){
            // this.url = window.location.href

        }
    }
</script>
<style lang="less" scoped>
    .ceshi{
        width: 80%;
    }
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
            margin-top: 3rem;
           width: 4.2rem;
        }
        p{
            font-size: 0.3rem;
            line-height: 0.8rem;
            color: #666;
            letter-spacing: 0.02rem;
        }
    }

</style>
