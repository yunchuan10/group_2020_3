<template>
    <!-- 新版首页 -->
    <div class="course-box">
        <router-link  :to="'/courseDetails?goodsId='+item.id"  v-for="(item, index) in goodsList" :key="index">
            <div class="course">
                <div class="course-top">
                    <div class="course-title">{{item.goods_name}}</div>
                    <div class="course-time">{{item.course_count}}课次／共{{item.course_hour}}{{item.time_unit}}</div>
                    <ul>
                        <li v-for="(item, index) in item.tag" :key="index">{{item}}</li>
                    </ul>
                </div>
                <div class="course-info">
                    <div class="info-left">
                        <div v-for="(item, index) in item.teaching_teacher" :key="index">
                            <!-- <img v-bind:src="item.photoPath" :onerror="defaultImg"> -->
                            <p :style ='{ backgroundImage  : "url(" + item.photoPath + " )"}' ></p>
                            <span>{{item.userDisplayName}}</span>
                        </div>
                    </div>
                    <div class="info-right">
                        <p class="price">¥<span>{{item.shop_price}}</span></p>
                        <p class="number">已有{{item.buy_number}}人购买</p>
                    </div>
                </div>    
            </div>
        </router-link>
    </div>
    <!-- 新版首页 -->
</template>

<script>
    export default {
        props: ['goodsList'],
        data(){
            return {
                defaultImg: 'this.src="' + require('../common/imgs/common/d.png') + '"'
            }
        },
        created() {
        },
    }
</script>

<style lang="less">
/* 新版推荐课程 */
.course-box{
    overflow: hidden;
    display: block;
    padding-top: .2rem;
    .course{ 
        min-height: 2.3rem;
        // width: 6.7rem;
        margin: 0 .4rem .4rem;
        // box-shadow:0px .1rem .2rem 0px rgba(50,50,50,0.08);
        box-shadow: 0 0.04rem 0.32rem 0 rgba(0,0,0,.1);
        border-radius: .08rem;
        // border: .02rem solid rgba(240,240,240,1);
        overflow: hidden;
        padding: .4rem .32rem .4rem;
        background: #fff;
        .course-top{
            min-height:1rem;
            // margin-bottom: .2rem;
        }
        .course-title{
            line-height: 1.3;
            font-size: .36rem;
            color: #494949;
            max-height: .9rem;
            overflow: hidden;
            font-weight: 500;
        }
        .course-time{
            font-size: .24rem;
            color: #999;
            margin: .24rem 0;
        }
        ul{
            display: flex;
            margin-bottom: .3rem;
            li{
                background:rgba(222,222,222,0.3);
                border-radius: .04rem;
                padding: .06rem .12rem;
                align-items: center;
                margin-right: .2rem;
                color: #999;
                font-size: .24rem;
            }
        }
        .course-info{
            display: flex;
            justify-content: space-between;
            // border: 1px solid red;
            .info-left{
                display: flex;
                width: 65%;
                div{  
                    display: flex;
                    flex-direction: column;
                    margin-right: .2rem;
                    align-items: center;
                    p{
                        width: .52rem;
                        height: .52rem;
                        border-radius: 50%;
                        display: block; 
                        background: center /100% auto no-repeat;
                    }
                    img{
                        width: .52rem;
                        height: .52rem;
                        border-radius: 50%;
                        display: block;
                    }
                    span{
                        color: #999;
                        font-size: .24rem;
                        display: block;
                        height: .26rem;
                        line-height: .26rem;
                        overflow: hidden;
                        margin-top: .14rem;
                        max-width: 1.2rem;
                    }
                }
            }
            .info-right{
                display: flex;
                flex-direction: column;
                text-align: right;
                width: 35%;
                .price{
                    color: #FF7549;
                    font-size: .24rem;
                    span{
                        margin-left: .08rem;
                        font-size: .48rem;
                    }
                }
                .number{
                    font-size: .24rem;
                    color: #999; 
                }
            }
        }
    }
}




</style>