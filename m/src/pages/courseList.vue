<template>
  <div class="list-c">
    <!-- 头部 -->
    <v-header :header_title="header_title"></v-header>

    <div class="list-out nav-fixed">
      <!-- 筛选列表 -->
      <div class="list-selects js-list-selects">
        <div class="scroll-div" ref="navScroll">
          <div
            v-for=" (item, index) in courseListSelect"
            :key="index"
            :class="{sec: s_index==index}"
            @click="navScroll($event, index, item.cat_id)"
          >{{item.cat_name}}</div>
        </div>
      </div>

      <!-- 列表 -->
      <div
        class="my-collection"
        v-if="courseLists.length>0"
        v-infinite-scroll="getList"
        :infinite-scroll-disabled="gettingList||!hasMoreList"
        infinite-scroll-distance="10"
      >

        <course :goodsList="courseLists"></course>
      </div>

      <div class="bott-line" v-show=" courseLists.length!=0&&!hasMoreList ">我是有底线的 ~_~</div>

      <!-- 缺省页 -->
      <v-appoint type="2" v-show=" courseLists.length==0 && !hasMoreList "/>

      <!-- 联系客服 -->
      <div class="loyoo-btn" v-doyoo v-if="!isPad"></div>
    </div>
  </div>
</template>
<script>
// import { Indicator } from "mint-ui";
import { InfiniteScroll, Indicator } from "mint-ui";
import Vue from "vue";
import { isPad } from "../common/js/utils.js";
Vue.use(InfiniteScroll);

import { CourseList } from "../api";
import course from "../components/course.vue";
// const courseListOpts = {
//   "3": "本科",
//   "2": "专科",
//   "4": "专本连读",
//   "5": "在职研究生",
//   "15": "成人教育",
//   "16": "等级考试",
//   "24": "资格考试"
// };
export default {
  data() {
    return {
      isPad: true,
      id: 0,
      catid: 0,
      pageIndex: 1,
      hasMoreList: true,
      gettingList: false,
      s_index: 0,
      header_title: "", //当前页面title
      // 列表数据
      courseLists: [],
      // 列表数据筛选项
      courseListSelect: []
    };
  },
  created() {
    this.isPad = isPad();
    this.id = this.$route.query.id;
    this.header_title = this.$route.query.cat_name;
    // 请求数据
    this.getList({
      topCategory: this.id,
      secCategory: this.catid,
      page: this.pageIndex,
      pageSize: 10
    });
  },
  methods: {
    navScroll(e, i, cat_id) {
      this.gettingList = false;
      this.$refs.navScroll.scrollLeft = e.target.offsetLeft - 20;
      this.s_index = i;
      this.catid = cat_id;
      this.pageIndex = 1;
      this.courseLists = [];
      this.hasMoreList = true;
      // 请求数据
      this.getList();
    },
    getList() {
      if (this.gettingList || !this.hasMoreList) {
        return;
      }
      this.gettingList = true;
      Indicator.open("加载中...");
      CourseList({
        topCategory: this.id,
        secCategory: this.catid,
        page: this.pageIndex,
        pageSize: 10
      })
        .then(res => {
          let { category, goodsList, totalPage } = res.result;
          // category.unshift({
          //   cat_id: 0,
          //   cat_name: "全部"
          // });
          if (this.courseListSelect.length == 0) {
            this.courseListSelect = category;
          }
          this.courseLists = this.courseLists.concat(goodsList);
          if (this.pageIndex >= totalPage) {
            this.hasMoreList = false; //没有数据了
          }
          this.pageIndex++;
          this.gettingList = false; //跳出加载
        })
        .catch(err => {
          this.gettingList = false; //跳出加载
        });
    }
  },
  components: {
    course
  }
};
</script>
<style lang="less">
.list-c {
  min-height: 100%;
  background: #fff;
  .loyoo-btn {
    position: fixed;
    z-index: 199;
    height: 1.22rem;
    width: 1.2rem;
    right: 0.4rem;
    bottom: 0.56rem;
    border-radius: 0.6rem;
    background: url(../common/imgs/common/i4.png) center no-repeat;
    background-size: 120% auto;
    background-position: top;
  }

  /* pages/courseList/courseList.wxss */
  .list-out {
    margin-top: .8rem;
  }
  .list-selects {
    position: fixed;
    z-index: 6;
    box-sizing: border-box;
    width: 100%;
    height: 1rem;
    left: 0;
    top: 1rem;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    word-break: break-all;
  }
  .list-selects::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    top: -0.5rem;
    background: #efeff4;
    height: 0.5rem;
  }

  .list-selects .scroll-div {
    overflow-x: auto;
    padding: 0 0.4rem;
    position: relative;
  }
  .list-selects .scroll-div > div {
    height: 0.6rem;
    line-height: 0.6rem;
    margin: 0.02rem 0;
    margin-right: 0.4rem;
    font-size: 0.27rem;
    color: #555;
    position: relative;
    z-index: 2;
    word-break: break-all;
    display: inline-block;
    margin-top: 0.3rem;
  }
  .list-selects div.sec {
    /* padding-bottom: 0; */
    color: #2c8cff;
    display: inline-block;
    box-sizing: border-box;
    /* border-bottom: 2rem solid #2C8CFF; */
  }
  .list-selects div.sec::after {
    content: "";
    display: block;
    position: absolute;
    z-index: 2;
    left: 10%;
    bottom: -2px;
    width: 80%;
    height: 0.03rem;
    background: #2c8cff;
  }

  /* 列表循环 */
  .my-collection {
    // padding: .4rem;
    // display: block;
    // background: #fff;
    // // border-top: 1px solid rgba(239, 239, 244, 1);
    // padding-: .3rem;
    padding-top: 0.3rem;
  }

  .my-collection > .my-content + .my-content {
    margin-top: 0.4rem;
  }
  .my-content {
    display: block;
    padding: 0.3rem 0.4rem 0;
    box-shadow: 0 0.04rem 0.32rem 0 rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background: #fff;
  }

  .my-content-t {
    display: flex;
    width: 100%;
  }
  .my-content-t > p {
    margin-bottom: 0.24rem;
    height: 0.38rem;
    line-height: 0.38rem;
    border: 0.01rem solid #2c8cff;
    color: #2c8cff;
    font-size: 0.22rem;
    padding: 0 0.18rem;
    margin-right: 0.16rem;
    border-radius: 0.22rem;
  }
  .my-content-title {
    font-size: 0.36rem;
    color: #494949;
    line-height: 1.2;
  }
  .my-content-c {
    color: #999;
    font-size: 0.24rem;
    padding: 0.08rem 0 0.32rem;
  }

  .my-footer {
    display: flex;
    justify-content: space-between;
    border-top: 0.01rem solid #ddd;
    line-height: 0.8rem;
    height: 0.8rem;
  }
  .my-footer-left {
    font-size: 0.24rem;
    color: #999;
  }
  .my-footer-right {
    color: #111;
  }
  .footer-right-icon {
    font-size: 0.24rem;
    height: 0.4rem;
    line-height: 0.4rem;
    color: #fe5b59;
    font-weight: 700;
  }
  .footer-right-money {
    font-size: 0.4rem;
    height: 0.4rem;
    line-height: 0.4rem;
    color: #fe5b59;
    font-weight: 700;
  }

  //   .my-content-title {
  //     word-break: break-all;
  //     display: block;
  //     font-size: 0.32rem;
  //     color: #494949;
  //     line-height: 0.4rem;
  //     font-weight: 700;
  //   }

  //   .my-content {
  //     display: flex;
  //     flex-direction: column;
  //     background: #fff;
  //     padding: .36rem 0;
  //   }
  //   .my-collection .my-content + .my-content {
  //     border-top: 1px solid #EAEAEA;
  //   }
  //   .my-content-icon {
  //     margin-bottom: 0.1rem;
  //     min-width: 0.68rem;
  //     padding: 0 0.1rem;
  //     height: 0.35rem;
  //     line-height: 0.37rem;
  //     text-align: center;
  //     display: inline-block;
  //     font-size: 0.24rem;
  //     color: #2C8CFF;
  //     border: 1px solid #2c8cff;
  //     position: relative;
  //     top: -0.03rem;
  //   }
  //   .my-content-center {
  //     display: flex;
  //     justify-content: space-between;
  //     margin-top: .18rem;
  //   }
  //   .my-content-left {
  //     font-size: .24rem;
  //     color: #999;
  //     line-height: .40rem;
  //     height: .40rem;
  //   }
  //   .content-right-icon {
  //     font-size: .24rem;
  //     color: #555;
  //     line-height: .40rem;
  //     height: .40rem;
  //     vertical-align: bottom;
  //     text-decoration: line-through;
  //     text-decoration-color: #555;
  //     margin-right:.05rem;
  //   }
  //   .content-right-money {
  //     font-size: .24rem;
  //     color: #555;
  //     text-decoration: line-through;
  //     text-decoration-color: #555;
  //   }
  //   .my-content-right {
  //     text-decoration: line-through;
  //     text-decoration-color: #555;
  //   }

  //   .my-footer {
  //     display: flex;
  //     justify-content: space-between;
  //     margin-top: .08rem;
  //   }
  //   .my-footer-left {
  //     font-size: .20rem;
  //     color: #999;
  //     line-height: .40rem;
  //     height: .40rem;
  //   }
  //   .my-footer-right {
  //     color: #111;
  //   }
  //   .footer-right-icon {
  //     font-size: .24rem;
  //     height: .40rem;
  //     line-height: .40rem;
  //     color:#FE5B59;
  //     font-weight: 700;
  //   }
  //   .footer-right-money {
  //     font-size: .4rem;
  //     height: .40rem;
  //     line-height: .40rem;
  //     color: #FE5B59;
  //     font-weight: 700;
  //   }

  .bott-line {
    font-size: 0.27rem;
    text-align: center;
    padding: 0.4rem 0;
    background: #fff;
    color: #999;
  }

  .scroll-div {
    white-space: nowrap;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
  }
}
</style>