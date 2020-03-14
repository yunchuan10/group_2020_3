<template>
  <div
    class="course-index"
    style="position:absolute;height: 100%;overflow: hidden; top:0;left:0;right:0;bottom:0;-webkit-overflow-scrolling:touch;"
  >
    <!-- 头部 -->
    <v-header
      :header_title="header_title"
      :no_hasauth="appData.system"
      :class_detail="class_detail"
      :class_detail_yes="class_detail_yes"
    ></v-header>

    <div
      style="position:absolute;top:1rem;left:0;right:0;bottom:0;overflow-y:scroll;-webkit-overflow-scrolling:touch;"
    >
      <div :class="{'content-minh': content_minh}">
        <!-- 课程详情头部数据 -->
        <div class="course-header">
          <!--<div class="course-type" v-if="courseInfo.teaching_method">{{courseInfo.teaching_method}}</div>-->
          <div class="course-title">{{courseInfo.goods_name}}</div>
          <div class="course-describe">{{courseInfo.subhead}}</div>
          <!--公开课-->
	          <div class='course-teacher' v-if="courseInfo.type_id == '2'">
				      <span>试听时间：</span>
				      <span>{{courseInfo.start_time}} / {{courseInfo.end_time}}</span>
				    </div>
	        <!-- 课时+小时-->
          <div  v-if="courseInfo.type_id != '3'">
				    <div class='course-teacher'>
				      <span>时间：</span>
				      <span class='left'>{{courseInfo.course_count}}课次</span>
				      <span class='right'>共{{courseInfo.course_hour}}{{courseInfo.time_unit}}</span>
				    </div>
				    <div class='course-teacher'>
				      <span>教师：</span>
				      <span>{{courseInfo.teaching_teacher}}</span>
				    </div>
				    <div class='course-teacher course-type-m ' >
				      <span>类型：</span>
				      <span class='course-type'>{{courseInfo.teaching_method}}</span>
				    </div>
				    <div class='course-border'>
				      <div></div>
				    </div>
        </div>
        <div v-else>
           <div class='course-teacher'>
				      <span>作者：</span>
				      <span>{{courseInfo.start_time}}</span>
				    </div>
				    <div class='course-teacher course-type-m ' >
				      <span>出版社：</span>
				      <span>{{courseInfo.end_time}}</span>
				    </div>
        </div>
        </div>
        <!-- 学历组合套餐选择 -->
        <div class="course-group-meal" v-if="courseInfo.type_id != '3'">
          <!-- 组合套餐  -->
          <div v-if="courseInfo.is_group == '1'" :data-isorder="courseInfo.is_order">
            <div class="course-group" @click="bindClickEducation(courseInfo.is_order)">
              <div>
                <span>学历：</span>
                <span>{{groupItem.length>0?'已选':'请选择您的组合套餐'}}</span>
              </div>
              <img src="../common/imgs/course/arrow-right.png" alt="">
            </div>
            <div v-for="(item,index) in groupItem" :key="index" class="group-name" v-show="item">
              {{item.group_name}} ·
              <span>{{item.goods_name}}</span>
            </div>
          </div>
          <!--单课程-->
          <div class="course-group" v-else>
            <div>
            	<span>学历：</span>
              <span>{{courseInfo.topCategory}} - {{courseInfo.secCategory}}</span>
            </div>
          </div>
        </div>
        <!-- 组合套餐-弹出内容 -->
        <div
          v-show="popupVisible"
          class="course-bg"
          @click="bindClickEducation(3)"
          @touchmove.stop.prevent="()=>{}"
        ></div>
        <div v-show="popupVisible" class="education" @touchmove.stop="()=>{}">
          <!-- <scroll-div scroll-y style='max-height:785rpx;'>-->
          <div style="height:385px; overflow: scroll;">
            <div class="education-lsit">
              <div class="education-title">{{courseInfo.goods_name}}</div>
              <!-- 详情内容 -->
              <div
                class="education-li"
                v-for="(groupIteml,groupIndex) in courseGroup"
                :key="groupIndex"
              >
                <div class="education-li-name">{{groupIteml.group_name}}</div>
                <div v-for="(item,index) in groupIteml.goods" :key="index">
                  <div
                    :class="item.id == groupIteml.selectionId?'education-li-selection':'education-li-detail'"
                    @click="bindClickCombination(groupIndex,item.id,groupIteml.id,groupIteml.group_name,item.goods_name)"
                  >{{item.goods_name}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="education-main-btn">
            <div class="education-btn" @click="bindClickEducation(3)">确定</div>
          </div>
        </div>

        <!-- 课程试听 -->
        <div class="course-audition" v-if="courseAudition.length>0">
        	<div class="audition">课程试听</div>
        	<div class="audition-content clear">
        		<div class="audition-box"
        		v-for="(item,index) in courseAudition"
            :key="index"
            @click="bindCourseAudition(item.id)">
        			<div class="auditions-details">
        				<div class="auditions-num">0{{index+1}}</div>
        				<div class="auditions-titile">{{item.content}}</div>
        			</div>
        			<div class="auditions-img">
        				<span>马上去听</span>
        				<img src="../common/imgs/course/vidio.png" />
        			</div>
        		</div>
        		<div style="height: 10px;width: 1px;"></div>
        	</div>
        </div>
        <!-- 课程介绍+课程安排 -->
        <div class="course-details">
          <div class="topTabSwiper" v-if="courseInfo.type_id != '3'">
            <div
              :class="currentData == 0 ? 'tabBorer' : ''"
              data-current="0"
              @click="bindCheckCurrent(0)"
            >课程介绍</div>
            <!--@click='bindCheckCurrent'-->
            <div
              :class="currentData == 1 ? 'tabBorer' : ''"
              data-current="1"
              @click="bindCheckCurrent(1)"
            >课程安排</div>
          </div>
          <!-- 教材 -->
          <div class="tabMaterial" v-else>教材介绍</div>
          <div v-show="currentData == 0" class="course-introduce c-padding">
          	<div v-if="courseData.class.length>0" class="course-flex">
	          	<div class='course-service-circular'></div>
	            <div class="course-about" >
	              <span>课程详情</span>
	              <div
	                v-for="(item,index) in courseData.class"
	                :key="index"
	              >{{index+1}}.{{item.content}}</div>
	            </div>
            </div>


            <!-- 特色服务 -->
            <div class="course-flex" v-if="courseData.server.length>0">
            	<div class='course-service-circular'></div>
	            <div class="course-service" >
	              <span class="course-service-span">特色服务</span>
	              <div class="course-service-list">
	                <span v-for="(item,index) in courseData.server" :key="index">{{item.content}}</span>
	              </div>
	            </div>
            </div>

            <!-- 适用人群 -->
            <div class="course-flex" v-if="courseData.person.length>0" >
            	<div class='course-service-circular'></div>
            	<div class="course-service" >
	              <span class="course-service-span">使用人群</span>
	              <div class="course-service-list">
	                <span v-for="(item,index) in courseData.person" :key="index">{{item.content}}</span>
	              </div>
            	</div>
            </div>

            <!-- 学习目标 -->
            <div class="course-flex" v-if="courseData.study.length>0">
            	<div class='course-service-circular'></div>
	            <div class="course-about" >
	              <span>学习目标</span>
	              <div
	                v-for="(item,index) in courseData.study"
	                :key="index"
	              >{{index+1}}.{{item.content}}</div>
	            </div>
            </div>

            <!-- 图文介绍 -->
            <div class="course-flex" v-if="courseData.detail.length>0">
            	<div class='course-service-circular'></div>
	            <div class="course-about course-about_img" >
	            	<span>图文详情</span>
	            </div>
            </div>
	          <div v-if="courseData.detail.length>0"
	            class="course-about-img"
	            style="width:100%;"
	            v-html="courseData.detail[0].content"
	          ></div>
          </div>
          <div v-show="currentData == 1" class="course-introduce">
            <div class="course-arrange">
              <div v-for="(chapterItem,chapterIndex) in courseData.arrange" :key="chapterIndex">
                <!-- 章节 -->
                <div
                  class="course-chapter c-padding"
                  @click="chapterItem.state=!chapterItem.state"
                  v-if="chapterItem.content.length>0"
                >
                  <div class="chapter-title">
                    <img src="../common/imgs/course/course_chapter.png">
                    <span class="chapter-name">{{chapterItem.profession}}</span>
                    <span>共{{chapterItem.content.length}}节</span>
                  </div>
                  <div>
                    <span class="chapter-up">{{chapterItem.state? '收起' : '展开'}}</span>
                    <img :src="chapterItem.state? downIcon : upIcon" class="chapter-up-img">
                  </div>
                </div>
                <!-- 章节详情 -->
                <!-- <transition name="course"> -->
                <div class="course-section" v-show="chapterItem.state">
                  <div v-for="(item,index) in chapterItem.content" :key="index">
                    <div class="c-padding ellipsis">
                      <span v-if="index<9">{{item.length}}0{{index+1}}.</span>
                      <span v-else>{{index+1}}.</span>
                      {{item.content}}
                    </div>
                  </div>
                </div>
                <!-- </transition> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 课程介绍完毕 -->
        <!--<div class="course-end-title">课程介绍完毕 ~_~</div>-->
        <div class="course-end-bottom"></div>
        <div style="height: 1.5rem;" v-if="appData.system == 'ios'"></div>
        <!-- 课程详情底部 -->
        <div class="course-footer" v-else>
        	<!--价格-->
			    <div class='course-price'>
			        <div class='course-price-number'>
			          <span class='price_icon'>¥</span>
			          <span>{{courseInfo.shop_price}}</span>
			        </div>
			        <div class='course-price-m' >已有{{courseInfo.buy_number}}人购买</div>
			    </div>
          <!--<div class="course-price">
            <span class="course-pirce-icon">¥</span>
            <span>{{courseInfo.shop_price}}</span>
          </div>-->
          <!--分享 收藏-->
          <button class="course-collection">
            <div class="course-share-c course-share-border">
              <!--<img src="../common/imgs/course/share.png">
              <span>分享</span>-->
            </div>
          </button>
          <!-- 收藏 -->
          <div
            class="course-share"
            v-show="!appData.system"
            @click="cancelCollect(courseInfo.id,courseInfo.is_collect)"
          >
            <img :src="courseInfo.is_collect == '0'? grayCollection : collection">
            <span>收藏</span>
          </div>
          <!-- 支付状态 is_group-1是组合产品，is_order=1已下单立即支付 -->
          <!-- @click='bindClickEducation'-->

          <!-- <div class="course-btn" v-if="appData.system == 'ios' && !isPad" v-doyoo>课程咨询</div> -->

          <div v-if="courseInfo.shop_price != '0'">
            <div
              v-if="courseInfo.is_group == '1' && courseInfo.is_order=='0' && parameteData.goodsAllId==''"
              @click="bindClickEducation(3)"
            >
              <div class="course-btn">立即报名</div>
            </div>
            <div v-else>
              <div
                class="course-btn"
                v-if="courseInfo.is_order=='1'"
                :data-orderno="courseInfo.order_no"
                @click="bindJumpPay"
              >立即支付</div>
              <div class="course-btn course-btn-gray" v-else-if="courseInfo.is_order=='2'">已报名</div>
              <div
                class="course-btn"
                v-else
                :data-goodsid="courseInfo.id"
                @click="bindJumpPage"
              >立即报名</div>
            </div> 
          </div>
          <div v-else>
              <div class="course-btn course-btn-gray" v-if="courseInfo.is_order=='2'">已获取</div>
              <div
                class="course-btn"
                v-else
                :data-goodsid="courseInfo.id"
                @click="bindJumpPage"
              >免费获取</div>
            </div>


        </div>
      </div>
    </div>
  </div>


</template>

<script>
import Vue from "vue";
import { Indicator, Toast, Popup } from "mint-ui"; // 视图
import { CourseDetail, cancelCollect } from "../api";
import { mapState, mapActions } from "vuex";
import { getLocalSto, mobileType, isPad } from "../common/js/utils.js";
//import Share from 'vue-social-share'
//Vue.use(Share)
export default {
  data() {
    return {
      content_minh: false,

      isPad: isPad(),
      courseInfo: {}, // 课程详情
      courseGroup: [], // 组合套餐
      courseAudition:[], // 课程试听
      parameteData: {},
      courseData: {
        class: [],
        server: [],
        person: [],
        study: [],
        detail: [],
        arrange: []
      },
      popupVisible: false,
      groupItem: [], //
      currentData: 0, // 选项卡切换
      header_title: "课程详情",
      uid: "",
      upIcon: require("../common/imgs/course/chapter_up.png"),
      downIcon: require("../common/imgs/course/chapter_open.png"),
      // 收藏图标
      grayCollection: require("../common/imgs/course/collection_gray.png"),
      collection: require("../common/imgs/course/collection.png"),
      baseURL: this.GLOBAL.baseURL, //直接通过this访问全局变量。//支付页面的公共路径
      face_img: require("../common/imgs/common/d.png"),
      class_detail: false, //显示用户头像
      class_detail_yes: true, //详情页
      mobileType: {},
      goodsId: "",
      // app 数据
      appData: {
        mobile: "",
        system: "",
        goodsId: ""
      },
      groupItemOption: {
        id: "",
        goods_name: "",
        group_name: ""
      }
    };
  },
  created() {
      this.isPad = isPad();
    Indicator.open("加载中...");
    //获取URL上传递过来的参数
    // APP跳转参数
    this.appData.mobile = this.$route.query.mobile;
    this.appData.system = this.$route.query.system;
    this.appData.goodsId = this.$route.query.goodsId;
    //获取ID
    if (this.appData.system) {
      this.uid = this.$route.query.uid;
    } else {
      // 需要测试一下APP是否能使用本地缓存
      this.uid = getLocalSto("uid") || "";
    }

    this.mobileType = mobileType() || {};
    // 获取课程详情
    if (this.mobileType.isQQ == true) {
      setTimeout(() => {
        this.courseDetail(this.$route.query.goodsId, this.uid);
      }, 3000);
    } else {
      this.courseDetail(this.$route.query.goodsId, this.uid);
    }
    //判断是否登陆
    this.noRoYesLogin(this.checkLogin.id);
  },

  computed: {
    ...mapState(["checkLogin"])
  },

  methods: {
    ...mapActions(["set_agree"]),
    //判断是否登陆
    noRoYesLogin: function(id) {
      if (id) {
        this.class_detail = true;
      }
    },
    // 已授权手机号，跳转协议
    bindJumpPage: function() {
      // 未登录跳转登录
      if (!this.uid ) {
        this.setLoginBack();
        return;
      }
      if (
        this.courseInfo.agreement_id == "0"
      ) {
        this.$router.push({
          path: "/orderSure",
          query: {
            goodsId: this.parameteData.goodsId,
            goodsAllId: this.parameteData.goodsAllId,
          }
        });
      }else {
        if (this.appData.system) {
          this.$router.push({
            path: "/serviceAgreement",
            query: {
              goodsId: this.appData.goodsId,
              goodsAllId: this.parameteData.goodsAllId,
              mobile: this.appData.mobile,
              uid: this.uid,
              system: this.appData.system
            }
          });
        } else {
          this.$router.push({
            path: "/serviceAgreement",
            query: {
              goodsId: this.parameteData.goodsId,
              goodsAllId: this.parameteData.goodsAllId
            }
          });
        }
      }
    },

    // 跳转支付
    bindJumpPay: function() {
      if (this.courseInfo.order_no) {
        // 判断app支付还是m站支付
        if (
          /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) &&
          this.appData.system
        ) {
          //原生返回
          window.webkit.messageHandlers.immediatePayment.postMessage(
            this.courseInfo.order_no
          );
        } else if (
          /(Android)/i.test(navigator.userAgent) &&
          this.appData.system
        ) {
          let order_no = this.courseInfo.order_no + "";
          javascript: onPay.onPay(order_no);
        } else {
          window.location.href = this.baseURL + this.courseInfo.order_no;
        }
      }
    },

    // 课程试听
    bindCourseAudition: function(id){
        this.$router.push('./audition?id=' + id + '&goods_id=' + this.$route.query.goodsId);
    },

    // 点击学历选项
    bindClickCombination: function(index, id, optionid, groupname, goodsname) {
      //  选中的当前数据
      let groupArr = {
        index: index,
        id: id,
        optionid: optionid,
        groupname: groupname,
        goodsname: goodsname
      };

      let courseGroup = this.courseGroup; // 原始组合套餐内容
      let groupItem = this.groupItem; // 选中的全部数据
      courseGroup[index].selectionId = groupArr.id;
      // 选中的数据
      let groupItemOption = {
        id: groupArr.id,
        optionid: groupArr.optionid,
        goods_name: groupArr.goodsname,
        group_name: groupArr.groupname
      };

      let thisGroupItem = [];
      this.courseGroup.forEach(item => {
        let good = item.goods.filter(g => item.selectionId == g.id);
        good.length > 0 ? (good[0].group_name = item.group_name) : null;
        thisGroupItem = [...thisGroupItem, ...good];
      });
      this.groupItem = thisGroupItem;

      // 选择的组合套餐id
      let goodsAllId = "";
      this.groupItem.map(item => {
        goodsAllId += item.id + ",";
      });
      goodsAllId = goodsAllId.substr(0, goodsAllId.length - 1);
      let parameteData = this.parameteData; // 全局数据，选中的类型
      parameteData.goodsAllId = goodsAllId;
      this.courseGroup = courseGroup;
      this.parameteData = parameteData;
    },

    // 显示隐藏学组合套餐弹出框
    bindClickEducation: function(isorder) {
      if (!this.uid && !this.appData.system) {
        this.setLoginBack();
        return;
      }
      let courseGroup = this.courseGroup;
      let groupItem = this.groupItem;
      // 立即支付支付-1，已购买-2，不允许再更改组合套餐  e.currentTarget.dataset.isorder
      if (isorder == "1" || isorder == "2") {
        return;
      }
      let state = groupItem.includes(undefined); // 数组里是否有undefined
      if (
        (courseGroup.length != groupItem.length && groupItem.length != 0) ||
        state
      ) {
        Toast({
          message: "请选择完整的组合套餐",
          duration: 2000
        });
      } else {
        this.popupVisible = !this.popupVisible;
      }
    },

    // 课程添加收藏，取消收藏
    cancelCollect: function(goodsId, is_collect) {
      if (!this.uid) {
        this.setLoginBack();
        return;
      }
      let courseInfo = this.courseInfo;
      courseInfo.is_collect = is_collect == 1 ? 0 : 1;
      cancelCollect({
        goodsId: goodsId,
        uid: this.uid
      })
        .then(res => {
          if (res.statusCode == 200) {
            this.courseInfo = courseInfo;
          }
        })
        .catch(err => {
          Toast({
            message: "网络异常,稍后重试",
            duration: 2000
          });
        });
    },

    // 课程安排和课程安排切换
    bindCheckCurrent: function(id) {
      this.currentData = id;
    },

    //获取订单详情方法
    courseDetail: function(goodsId, uid) {
      CourseDetail({
        goodsId: goodsId,
        uid: uid
      })
        .then(res => {
          if (res.result.arrange.length > 0) {
            // 课程安排 展开收起
            res.result.arrange.map(item => (item.state = false));
            res.result.arrange[0].state = true;
          }
          if (res.result.group.length > 0) {
            // 课程安排 展开收起
            res.result.group.map(item => (item.selectionId = ""));
          }

          let parameteData = {};

          parameteData = {
            goodsId: res.result.info.id,
            goodsAllId: "",
            goodsName: res.result.info.goods_name,
            goodsPrice: res.result.info.shop_price
          };
          this.content_minh = true;
          this.courseData = res.result || {};
          this.courseInfo = res.result.info || {};
          this.courseGroup = res.result.group || [];
          this.courseAudition = res.result.course || [];
          this.courseData.person = res.result.person;
          this.courseData.class = res.result.class;
          this.courseData.study = res.result.study;
          this.courseData.detail = res.result.detail;
          this.courseData.arrange = res.result.arrange; // 课程安排
          this.groupItem = res.result.info.order_goods || []; // 下订单后的组合套餐数据
          this.parameteData = parameteData;

          //              setTimeout(()=>{
          //              	this.img_minh = false;
          //              }, 200)
        })
        .catch(err => {
          Toast({
            message: "网络异常,稍后重试",
            duration: 2000
          });
        });
    }
  }
};
</script>

<style lang="less">
/* @import "../common/share/css/share.css";*/
.course-index {
	background:#fff!important;
  .header-c {
    position: absolute;
  }
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

  .content-minh {
    min-height: 100.2%;
  }

  /*课程标题*/
  .course {
    height: 10rem;
    overflow: hidden;
  }
  .course-header {
    min-height: 2.3rem;
    background: #fff;
    padding: 0.4rem 0.4rem 0 0.4rem;
  }
  .course-type{
	  height: .42rem;
	  line-height: .42rem;
	  padding: 0 .24rem;
	  border: 0.02rem solid rgba(240,240,240,1);
	  display: inline-block;
	  border-radius: .21rem;
	  font-size: .24rem;
	  color: #494949
	}
	.course-type-m{
	  display: flex;
	  align-items: center;
	  color: #999;
	  font-size: .24rem;
	  margin-top: .25rem;
	  height: .40rem;
	  line-height: .40rem;
	}
  .course-title {
    font-size: 0.4rem;
    color: #494949;
    font-weight: bold;
    min-height: 0.56rem;
    line-height: 0.56rem;
    margin: 0.1rem 0;
    max-height: 1.07rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .course-describe {
    font-size: 0.27rem;
    color: #999;
    min-height: 0.4rem;
    max-height: 0.8rem;
    line-height: 0.4rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-top: 5px;
  }
  .course-teacher {
	  display: flex;
	  color: #494949;
	  font-size: .24rem;
	  margin-top: .25rem;
	  height: .40rem;
	  line-height: .40rem;
  }
  .course-teacher span:first-child{
  	color: #999;
  	margin-right: .1rem;
	}
  .course-teacher .left {
    padding-right: 0.14rem;
    /*border-right: 0.01rem solid #999;*/
  }

  .course-teacher .left:before{
	  content: ""; display:block;width:.02rem; height: .18rem; background-color: #979797;
	  margin-left: 1rem;
	  position: absolute;
	  margin-top: .1rem;
  }
  .course-teacher .right {
    padding-left: 0.2rem;
  }
  /*套餐选择*/
  .course-group-meal {
    min-height: 1rem;
    background: #fff;
    border-bottom: .2rem solid #F5F5F5;
  }
  .course-group {
    min-height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 0.4rem;
    font-size: 0.24rem;
    color: #494949;
  }
  .course-border{
  	padding-top: .4rem;
	}
	.course-border div{
  	height:.02rem;
  	background:rgba(240,240,240,1);
  	width:6.70rem;
	}
  .group-name {
    min-height: 0.4rem;
    line-height: 0.4rem;
    padding-bottom: 0.32rem;
    margin-left: 1.25rem;
    margin-right: 0.4rem;
  }
  .group-name span {
    color: #2c8cff;
  }
.course-group span:first-child {
    color: #999;
    margin-left: 0rem;
  }
  .course-group span {
    color: #333;
    margin-left: 0.1rem;
  }
  .course-group img {
    width: 0.12rem;
    height: 0.23rem;
  }
  /*课程介绍+课程安排*/
  .course-details {
    /* background-color: #fff;*/
    margin-top: 0.2rem;
    min-height: 1rem;
  }
  /*切换效果*/
  .topTabSwiper {
    height: 1rem;
    display: flex;
    font-size: 0.32rem;
    color: #555;
/*    justify-content: space-around;*/
/*    border-bottom: 0.01rem solid #ddd;*/
    background-color: #fff;
    padding-left: .4rem;
  }
  .topTabSwiper div {
    margin-top: 0.35rem;
    color: #999;
    margin-right:.4rem;
  	font-size: .32rem;
  }
  .tabBorer {
    color: #494949!important; font-size:.40rem!important; font-weight: bold;
  }
  .topTabSwiper .tabBorer::after {
    content: "";
    margin-top: 0.15rem;
    clear: both;
    display: block;
    width: 0.38rem;
    height: 0.06rem;
    background-color: #2c8cff;
    margin-left: 0.55rem;
  }
  .swiper {
    width: 100%;
  }
  .swiper_con {
    padding: 0.4rem;
  }
  /*课程介绍*/
  .course-introduce {
    overflow-y: hidden;
    min-height: 0.5rem;
    margin-top: .15rem;
  }
  .course-about {
    /*margin: 0.4rem 0 0rem 0;*/
    overflow: hidden;
   /* padding: 0.3rem;*/
    background: #fff;
    border-radius: 0.08rem;
    width: 95%;
  }
  .course-about_img {
    padding: 0;
  }
  .course-about-img {
    width: 100%;
  }
  .course-about-img img {
    width: 100% !important;
  }
  .course-about span {
    font-size: 0.32rem;
    color: #494949;
    font-weight: 700;
    margin-bottom: 0.27rem;
    display: inline-block;
  }
  .course-about div {
    color: #555;
    font-size: 0.27rem;
    line-height: 0.48rem;
  }
  /*特色服务*/
 .course-flex{
	  display: flex;
	  justify-content: space-between;
	  min-height: .1rem;
	  margin-top: .5rem;
		}
  .course-service {
    border-radius: 0.08rem;
    background-color: #fff;
	  padding-bottom: .2rem;
	  border-radius:  0.12rem;
	  width: 95%;
  }
  .course-service-circular{
	  width:.1rem;height:.1rem;background:rgba(32,141,253,1);  border-radius: 50%;
	  margin-top: .15rem;
		}
  .course-service-span {
    font-size: 0.32rem;
    color: #494949;
    font-weight: 700;
    margin-bottom: 0.27rem;
    display: inline-block;
  }
  .course-service-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    color: #555;
    font-size: 0.27rem;
  }
  .course-service-list span {
    text-align: left;
    width: 50%;
    height: 0.37rem;
    line-height: 0.37rem;
    overflow: hidden;
    margin-bottom: 0.2rem;
  }
  .course-service-list span :before {
    content: "";
    width: 0.07rem;
    height: 0.07rem;
    background-color: #2c8cff;
    border-radius: 50%;
    display: inline-block;
    margin: 0.1rem;
  }
  /*课程安排*/
  .course-arrange {
    background: #fff;
    /* margin-top: 40rem; */
  }
  .course-chapter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1rem;
    background: rgba(250, 250, 250, 1);
    border-bottom: 0.01rem solid #dadada;
  }
  .chapter-title img {
    width: 0.24rem;
    height: 0.2rem;
  }
  .chapter-title {
    color: #999;
    font-size: 0.2rem;
  }
  .chapter-name {
    color: #494949;
    font-size: 0.32rem;
    margin: 0 0.15rem 0.2rem;
    font-weight: 700;
  }
  .chapter-up {
    font-size: 0.24rem;
    color: #999;
    margin-right: 0.1rem;
  }
  .chapter-up-img {
    width: 0.18rem;
    height: 0.18rem;
  }
  .course-section div {
    height: 1rem;
    line-height: 1rem;
    font-size: 0.27rem;
    color: #111;
    overflow: hidden;
    border-bottom: 0.01rem solid #ddd;
  }
  .course-section div span {
    color: #333;
    font-size: 0.32rem;
    font-style: italic;
    font-weight: bold;
    margin-right: 0.1rem;
  }
  /*课程结束*/
  .course-end-title {
    text-align: center;
    color: #999;
    font-size: 0.24rem;
    width: 100%;
    padding: 0.47rem 0 0.37rem 0;
  }
  /*学历套餐组合选择--弹出框*/
  .education {
    overflow: hidden;
    position: fixed;
    bottom: 0rem;
    min-height: 2rem;
    max-height: 9.15rem;
    background: #fff;
    border-radius: 0.27rem 0.27rem 0rem 0rem;
    font-size: 0.32rem;
    width: 100%;
    z-index: 900;
  }
  .education-lsit {
    padding: 0.4rem 0.4rem 0.02rem 0.4rem;
  }
  .education-title {
    font-size: 0.32rem;
    color: #111;
    font-weight: bold;
    line-height: 0.45rem;
    margin-bottom: 0.35rem;
  }
  .education-li {
    margin-bottom: 0.45rem;
    min-height: 0.5rem;
  }
  .education-li-selection {
    font-size: 0.27rem;
    border: 0.01rem solid #2c8cff;
    padding: 0 0.2rem;
    height: 0.67rem;
    line-height: 0.67rem;
    display: inline-block;
    margin-top: 0.27rem;
    color: #2c8cff;
    background: #eef6ff;
    overflow: hidden;
  }
  .education-li-detail {
    font-size: 0.27rem;
    border: 0.01rem solid #f5f5f5;
    padding: 0 0.2rem;
    height: 0.67rem;
    line-height: 0.67rem;
    display: inline-block;
    margin-top: 0.27rem;
    color: #555;
    background: #f5f5f5;
    overflow: hidden;
  }
  .education-btn {
    width: 6.7rem;
    text-align: center;
    height: 0.87rem;
    line-height: 0.87rem;
    border-radius: 0.5rem;
    margin-right: 0.36rem;
    color: #fff;
    font-size: 0.32rem;
    background: #2c8cff;
    background: linear-gradient(#18b3ff, #2a94ff);
    margin: 0.2rem 0.4rem;
    position: fixed;
    bottom: 0rem;
  }
  .course-bg {
    background: rgba(0, 0, 0, 0.6);
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  /*底部高度*/
  .course-end-bottom {
    height: 1.2rem;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }
  /*课程底部*/
  .course-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.2rem;
    align-items: center;
    background: #fff;
    overflow: hidden;
    border-top: 0.01rem solid #ddd;
  }

	.course-price{
	  margin-top: .2rem;
	  display: flex;
	  font-size: .24rem;
	  color: #999;
	  margin-left: .4rem;
	  width: 40%;
	  height: 1.16rem;
	  float: left;
	  flex-wrap: wrap;
	  align-items: center;
	  line-height: 0.1;
	}
	.course-price-number{
	  display: flex;
	  align-items: flex-end;
	  width: 100%;
	}
	.course-price-m{
	  height: .3rem;
	  margin-top: .01rem;
	}
	.price_icon{
	  font-size: .28rem!important;
	  margin-right: .1rem;
	  margin-left: 0;
	}
  .course-price span {
    font-size: 0.52rem;
    color: #FF7549;
  }
  .course-price span.course-pirce-icon {
    font-size: 0.32rem;
    padding-top: 0.11rem;
    margin-right: 0.1rem;
  }
  .course-share {
    width: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 1.35rem;
    float: left;
    line-height: 0.6rem;
    color: #999;
    font-size: 0.24rem;
  }
  /*.course-share::before {
    content: "";
    width: 0.02rem;
    height: 0.6rem;
    background-color: #ddd;
    display: inline-block;
    position: absolute;
    left: 0px;
  }*/
  .course-share img {
    width: 0.36rem;
    height: 0.36rem;
  }
  .course-collection {
    float: left;
    border: none !important;
    padding: 0;
  }
  .education-main-btn {
    border: 0.01rem solid #ddd;
    height: 1.3rem;
    width: 100%;
  }
  .course-btn {
    width: 2.4rem;
    text-align: center;
    height: 0.80rem;
    line-height: 0.80rem;
    float: right;
    border-radius: 0.08rem;
    margin-top: 0.2rem;
    margin-right: 0.36rem;
    color: #fff;
    font-size: 0.32rem;
    color:rgba(255,255,255,1);
  	background:rgba(32,141,253,1);
  }
  .course-btn-gray {
    background: #dfdfdf;
  }
  /*.user-phone {
        height: 6rem;
        background: #fff;
        position: fixed;
        bottom: 0;
        z-index: 500;
        width: 100%;
        padding: 0.4rem;
    }
    .user-phone-top {
        height: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 6.7rem;
    }
    .phone-form {
        display: inline-block;
    }
    .user-phone-top img {
        height: 0.26rem;
        width: 0.28rem;
    }
    .user-phone-logo {
        font-size: 0.32rem;
        color: #000;
        margin: 0 0.3rem 0 0.3rem;
    }
    .phone-confirm {
        font-size: 0.48rem;
        color: #111;
        margin: 0.2rem 0 0.5rem 0;
    }
    .phone-btn {
        width: 6.7rem;
        color: #fff;
        background: #009802;
        margin: 0;
        margin-top: 0.5rem;
    }
    .phone-input {
        height: 1.1rem;
        line-height: 1.1rem;
        border-top: 0.01rem solid #e6e6e6;
        border-bottom: 0.01rem solid #e6e6e6;
        width: 6.7rem;
        display: inline-block;
        color: #111;
    }
    .phone-code {
        height: 1.1rem;
        line-height: 1.1rem;
        width: 6.7rem;
        color: #111;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .phone-code input {
        display: flex;
        width: 5rem;
    }
    .phone-code span {
        color: #7485a9;
        font-size: 0.28rem;
        font-weight: bold;
    }*/
  /*友情提示*/
  /*.phone-tips {
        width: 6.7rem;
        font-size: 0.32rem;
    }
    .tips-img img {
        height: 0.4rem;
        width: 0.4rem;
    }
    .tips-title {
        margin: 0.2rem 0 0.4rem 0;
    }
    .tips-content {
        line-height: 0.42rem;
    }
    */

  /*// .course-enter-active, .course-leave-active {
    //     transition: height .2s ease-out;
    // }

    // .course-enter, .course-leave-to {
    //     height: 0;
    // }*/
  .c-padding {
    padding: 0 0.4rem;
  }
  .tabMaterial{
    height: 1.05rem;
    padding-left: .40rem;
    display: flex;
    background-color: #fff;
    border-top: .2rem solid #F5F5F5;
    color: #494949;
    font-size: .4rem;
    font-weight: bold;
    padding-top: .45rem;
}
  /*课程试听*/
  .course-audition{
  	min-height: 3.38rem;
  	background-color: #fff;
  	border-bottom: 0.2rem solid #F5F5F5;
  	.audition{
  		color: #000;
  		font-size: .4rem;
  		height: .56rem;
  		line-height: .56rem;
  		margin: .4rem 0 .2rem .4rem;
  	}
  	.audition-content::-webkit-scrollbar{
   		display: none;
		}
  	.audition-content{
  		display: -webkit-box;
  /*		display: block;*/
  		overflow-x: auto;
  		-webkit-overflow-scrolling: touch;
  		.audition-box{
  			width:5.24rem;
				height:1.3rem;
				background:rgba(255,255,255,1);
				box-shadow:0 0 .2rem 0 rgba(145,145,145,0.22);
				border-radius:.08rem;
				margin: .2rem .4rem .2rem 0;
				padding: .24rem;
				.auditions-details{
				  display: flex;
				  justify-content: space-between;
				  align-items: center;
				  .auditions-num{
					  color: #D2E8FF;
					  font-size: .6rem;
					  font-weight: bold;
					  font-style: italic;
					  margin-right: .2rem;
					}
					.auditions-titile{
			/*		  width:4.19rem;*/
					  height:.9rem;
					  font-size:.32rem;
					  font-weight:400;
					  color:#494949;
					  word-wrap:break-word;
					  word-break: normal;
					  white-space:pre-wrap;
					  overflow: hidden;
					  line-height:.45rem;
					}
	 			}
	 			.auditions-img{
				  display: flex;
				  align-items: center;
				  justify-content: flex-end;
				  color: #208DFD;
				  font-size: .24rem;
				  margin-top: .15rem;
				  img{
				  	width: .34rem;
				  	height: .34rem;
				  	margin-left: .1rem;
				  }
				}
  		}
  		.audition-box:first-child{
  			margin-left: .4rem;
  		}

  	}
  }
}
</style>