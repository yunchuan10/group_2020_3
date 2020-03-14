<template>
	<div class="home-c">

        <!-- 头部 -->
        <v-header ></v-header>

        <!--index.wxml-->
        <div class="container">

            <div class="course-navs">
                <router-link class="course-item" :to="'/course-list?id='+item.cat_id +'&cat_name='+item.cat_name" v-for="(item, index) in courseNavs" :key="index">
                    <img :src="item.icon_m" alt="">
                    <span>{{item.cat_name}}</span>
                </router-link>
            </div>
			<div class="jin-head">
                <span>推荐课程</span>
            </div>
            <!-- 精品区 -->
            <!-- <div class="course-jin">
                <div class="my-collection" v-if="goodsList.length" style="display:none;">
                    <router-link class="my-content" :to="'/courseDetails?goodsId='+item.id"  v-for="(item, index) in goodsList" :key="index">
                        <div class='my-content-t'>
                            <p v-if="item.cat_name" class='my-content-icon'>{{item.cat_name}}</p>
                            <p v-if="item.teaching_method" class='my-content-icon'>{{item.teaching_method}}</p>
                        </div>
                        <div class="my-content-title ellipsis2">
                            {{item.goods_name}}
                        </div>
                        <div class='my-content-c'>
                            {{item.course_count}}节课／共{{item.course_hour}}小时
                        </div>
                        <div class='my-footer'>
                            <div class='my-footer-left'>
                                <span class='my-footer-left'>{{item.buy_number}}人购买</span>
                            </div>
                            <div class='my-footer-right'>
                                <span class='footer-right-icon'>¥ </span><span class='footer-right-money'>{{item.shop_price}}</span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div> -->
            <!-- 课程详情 -->
            <course
                :goodsList = "goodsList"
            ></course>
        

        </div>

        <!-- 联系客服 -->
        <div class="loyoo-btn" v-doyoo v-if="!isPad"></div>

	</div>
</template>
<script>
    import { Indicator,Toast } from "mint-ui"; // 视图
    import { HomeIndex,GetCategory } from '../api'
    import { isPad } from '../common/js/utils.js'
    import course from '../components/course.vue'
	export default {
		data(){
			return{
                isPad: true,
                // 导航
                courseNavs: [],
                goodsList: [],
			}
		},
        created() {
            this.isPad = isPad();
            Indicator.open('加载中...');
            // 获取首页精品课
            HomeIndex().then(res=>{
                res.result = res.result||{goodsList:[]}
                this.goodsList = res.result.goodsList||[];
            }).catch(err=>{
			   Toast({
                   message: "网络异常,稍后重试",
                   duration: 2000
               });
            })
            // 获取首页分类
            GetCategory().then(res =>{
            	this.courseNavs = res.result || [];
            }).catch(err=>{
			   Toast({
                   message: "网络异常,稍后重试",
                   duration: 2000
               });
            })
        },
        components:{
            course,
        }
	}
</script>
<style lang="less">

    .home-c{

        background: #fff;

        .loyoo-btn{
            position: fixed;
            z-index: 199;
            height: 1.22rem;
            width: 1.2rem;
            right: .4rem;
            bottom: .56rem;
            border-radius: .6rem;
            background: url(../common/imgs/common/i4.png) center no-repeat;
            background-size: 120% auto;
            background-position: top;
        }

        /**头部导航**/
        .course-navs{
            // margin-top: .46rem ;
            padding: 0.46rem 0 .6rem;
            background: #fff;
            height: 3.20rem;
            display: flex;
            flex-wrap: wrap;
        }

        .course-item{
            text-align: center;
            width: 25%;
            /*height: 1.40rem;*/
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: .24rem;
            margin-bottom: .36rem;
        }
        .course-item img{
            width: .96rem;
            height: .96rem;
            margin-bottom: .07rem;
        }


        /* 精品区 */
        .course-jin{
            background: #fff;
        }
        .jin-head{
            height: .60rem;
            display: flex;
            padding: 0rem 0 .2rem 0.4rem;
            justify-content: space-between;
            align-items: center;
            span{
	            font-size: .44rem;
	            color: #494949;
	            font-weight: bold;
	        }
        }
        /* 精品课循环 */
        .my-collection{
            display: block;
        }
        .my-content-title{
            word-break: break-all;
            display: block;
            font-size: .32rem;
            color: #494949;
            line-height: .40rem;
            font-weight: 700;
        }
        .my-collection{
            padding: 0 .40rem .4rem;
        }
        .my-collection>.my-content+.my-content{
            margin-top: .4rem;
        }
        .my-content{
            display: block;
            padding: .3rem .4rem 0;
            box-shadow: 0 .04rem .32rem 0 rgba(0,0,0,0.1);
            border-radius: 5px;
            background: #fff;
        }
        .my-content-t{
            display: flex;
            width: 100%;
        }
        .my-content-t>p{
            margin-bottom: .24rem;
            height: .38rem;
            line-height: .38rem;
            border: .01rem solid #2c8cff;
            color: #2c8cff;
            font-size: .22rem;
            padding: 0 .18rem;
            margin-right: .16rem;
            border-radius: .22rem;
        }
        .my-content-title{
            font-size: .36rem;
            color: #494949;
            line-height: 1.2;
        }
        .my-content-c{
            color: #999;
            font-size: .24rem;
            padding: .08rem 0 .32rem;
        }

        .my-footer{
            display: flex;
            justify-content: space-between;
            border-top: .01rem solid #ddd;
            line-height:.80rem ;
            height: .80rem;
        }
        .my-footer-left{
            font-size:.24rem ;
            color: #999;
        }
        .my-footer-right{
            color: #111;
        }
        .footer-right-icon{
            font-size: .24rem;
            height: .40rem;
            line-height: .40rem;
            color: #FE5B59;
            font-weight: 700;
        }
        .footer-right-money{
            font-size: .4rem;
            height: .40rem ;
            line-height: .40rem;
            color: #FE5B59;
            font-weight: 700;
        }



    }

</style>