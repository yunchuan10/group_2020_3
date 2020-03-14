
<template>
	<div class='order-pay-c'>
        <!-- 头部 -->
        <v-header ></v-header>

        <!-- 订单信息 -->
        <div class='order-d'>
            <div class='pay-title'>订单信息</div>
            <div class='order-dist'>
                <div>
                    <span>订单编号</span>
                    <span class='dist-r'>orderInfo.order_no</span>
                </div>
                <div>
                    <span>课程名称</span>
                    <span class='dist-r'>orderInfo.goods[0].goods_name</span>
                </div>
                <div>
                    <span>原价</span>
                    <span class='dist-r'>￥orderInfo.goods[0].goods_price</span>
                </div>
                <div>
                    <span>优惠券</span>
                    <span class='dist-r pay-spanr2'>-￥orderInfo.discount_amount</span>
                </div>
                <div>
                    <span>实付价</span>
                    <span class='dist-r'>￥orderInfo.amount</span>
                </div>
            </div>
        </div>

        <!-- 支付方式 -->
        <div class='pay-type'>
            <div class='pay-title'>支付方式</div>
            <div class='type-box'>
                <img class='type-box-l' src="../common/imgs/common/i10.png" alt="">
                <div class='type-box-c'>
                    <span class='box-c1'>微信支付</span>
                    <span class='box-c2'>推荐安装微信7.0及以上版本的用户使用</span>
                </div>
                <img class='type-box-r' :src="sec_icon1">
            </div>
            <div class='type-box'>
                <img class='type-box-l' src="../common/imgs/common/i11.png" alt="">
                <div class='type-box-c'>
                    <span class='box-c1'>微信支付</span>
                    <span class='box-c2'>推荐安装微信7.0及以上版本的用户使用</span>
                </div>
                <img class='type-box-r' :src="sec_icon2">
            </div>
        </div>

        <!-- 立即支付 -->
        <div class='pay-btn'>
            <button class='button-able'>立即支付</button>
        </div>

    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
	export default {
		data(){
			return{
                sec_icon1: require('../common/imgs/common/i8.png'),
                sec_icon2: require('../common/imgs/common/i9.png')
			}
		},
        created() {

        },
        methods: {
            switchChang(){
                // console.log(this.switchVal)
            }
        },
	}
</script>
<style lang="less">

.order-pay-c{
    padding-bottom: 1.50rem;
    .pay-textr2{
        color: #F43530;
    }
    .pay-title{
        padding: .52rem 0 .35rem .40rem;
        color: #111;
        font-size: .40rem;
    }
    .order-dist{
        line-height: .70rem;
        background: #fff;
        padding: .10rem .40rem;
    }
    .order-dist>div{
        color: #555;
        display: flex;
        justify-content: space-between;
        min-height: .46rem;
        padding: .12rem 0;
        line-height: .46rem;
        flex-wrap: wrap;
    }
    .dist-r{
        color: #111;
        text-align: right;
        padding-left: .15rem;
        width: 70%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
    }


    /* 支付方式 */
    .type-box{
        display: flex;
        background: #fff;
        height: 1.40rem;
        padding: 0 .40rem 0 .30rem;
        justify-content: space-between;
        align-items: center;
    }
    .type-box-l{
        width: .80rem;
        height: .80rem;
    }

    .type-box-c{
        flex: 1;
        padding: 0 .15rem 0 .30rem;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .box-c1{
        font-size: .32rem;
        color: #111;
        width: 100%;
    }
    .box-c2{
        font-size: .24rem;
        color: #999;
        padding-top: .15rem;
        width: 100%;
    }

    .type-box-r{
        width: .34rem;
        height: .34rem;
    }



    .pay-btn{
        padding: .32rem .40rem;
        text-align: center;
        position: fixed;
        z-index: 9;
        left: 0;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        height: 1.50rem;
    }

    .pay-btn button{
        color: #fff;
        font-size: .36rem;
        height: .86rem;
        line-height: .86rem;
        border-radius: .44rem;
        border: 0 none;
        width: 100%;
    }
}



</style>