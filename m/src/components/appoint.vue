<template>
    <!-- 缺省页面 -->
    <div class='appointment-c' >
        <div class='appointment-content'>
            <img class="appointment-img" :src="src" alt="">
            <span class='appointment-text'>还没有当前专业的课程哦 ^_^</span>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['type'],
        data(){
            return{
                src: ''
            }
        },
        created() {
            let _type = this.type||3;
            this.src = require('../common/imgs/common/i'+_type+'.png')
        },
        methods: {

        },
    }
</script>

<style lang="less">

    /* 缺省页面 */
    .appointment-c{
        padding: 1rem 0 .4rem;
        .appointment-content{
            text-align: center;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .appointment-text{
            font-size:.24rem;
            color:rgba(153,153,153,1);
            line-height:.36rem;
            text-align: center;
            display: block;
        }
        .appointment-img{
            width: 2.67rem;
            margin: 0 auto;
        }
    }




</style>