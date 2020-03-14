//获取应用实例
const app = getApp();
const {ajax} = require('../../utils/ajax.js');
Page({
  data: {
    courseNavs: [], // 导航
    userInfo: null,
    // 精品课
    jinsArr: [],
    openClassList: [], // 公开课
    page: 1,    //分页请求
    isLoading: true,    //是否显示加载完毕
    title:'加载中',

    is_agreement: false,   //是否有协议
    defaultImg:'/img/my/default-teach.png'//默认图片
  }, 
  onShow: function () { 
    this.setData({
      userInfo: app.globalData.userInfo,
      page: 1,  
      isLoading: true,
      openClassList:[],
    })
    // 获取首页分类
    this.getCategory();
    // 获取推荐课程
    this.getRecommendedCourses();
    // 获取公开课
    // this.getOpenClassList();
    // 右上角转发
    wx.showShareMenu({
      withShareTicket: true
    })

    // 判断是否有协议
    this.userMessage();
  },

  // 登录成功回调
  userMessage(){
    let uid = wx.getStorageSync('userId')||'';
    // console.log(app.globalData.userInfo)
    if (uid && app.globalData.userInfo){
      ajax({
        url: 'getOrderAgreement',
        method: 'post',
        data: {
          uid
        },
        success: data => {
          const res = data.result || {};
          // console.log(res, 111)
          if(res.is_agreement!=0){
            wx.hideTabBar({});
          }else{
            wx.showTabBar({});
          }
          this.setData({
            is_agreement: res.is_agreement
          })
        }
      })
    }
  },

  // 服务协议同意成功
  agreementSub(){
    wx.showTabBar({});
    this.setData({
      is_agreement: 0
    })
  },

  // 请求精品课
  getRecommendedCourses: function () {
    ajax({
      url: 'index',
      method: 'post',
      data: {
        topCategory: 0,
        secCategory: 0,
        page: 1,
        pageSize: 10
      },
      success: data => {
        const res = data.result || {};
        this.setData({
          jinsArr: res.goodsList
        })
      }
    })
  },

  // 开课通知
  appointmentFormSubmit: function (e) {
    this.getFormId(e.detail.formId);  // 开发环境formid不正确
    this.jumpOpenClass(e);
  },

  // 获取微信小程序的formId
  getFormId: function (formId) {
    ajax({
      url: 'wxFormId',
      method: 'post',
      data: {
        "uid": wx.getStorageSync('userId'),
        "formId": formId,
      },
      success: data => {
      }
    })
  },

  // 获取首页分类
  getCategory: function () {
    ajax({
      url: 'getCategory',
      method: 'post',
      data: {},
      success: data => {
        if (data.statusCode == '200') {
          this.setData({
            courseNavs: data.result,
          })
        } else {
          setTimeout(() => {
            wx.showToast({
              title: '网络错误,稍后重试!',
              icon: "none",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
        }
      }
    })
  },

  // 获取公开课
  getOpenClassList: function () {
    wx.showLoading({
      title: this.data.title
    })
    ajax({
      url: 'openClassList',
      method: 'post',
      data: {
        "page": this.data.page,
        "pageSize": 6,
      },
      success: data => {
        if (data.result.totalPage > this.data.page -1 ){
          this.setData({ //页码自动加一
            page: this.data.page + 1
          })
          if (data.statusCode == '200') {
            this.setData({
              openClassList: this.data.openClassList.concat(data.result.list) ,
            })
          } else {
            setTimeout(() => {
              wx.showToast({
                title: '网络错误,稍后重试!',
                icon: "none",
              });
              setTimeout(() => {
                wx.hideToast();
              }, 2000)
            }, 0);
          }
        }else{
          this.setData({
            isLoading: true,
          })
        }
      }
    })
  },

  /**
 * 页面上拉触底事件的处理函数 上拉加载采用的是 调用方法 下拉刷新采取的是配置app.json与当前页面的JSON
 */
  // onReachBottom: function () {
  //   //请求数据
  //   !this.data.isLoading&&this.getOpenClassList();
  // },

  // 跳转到公开课
  jumpOpenClass: function(e){
    wx.navigateTo({
      url: '../openCourse/openCourse?courderId=' + e.currentTarget.dataset.id
    })
  },
  //图片加载失败
  errorFunction:function(e){
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var errorimgoutIndex = e.target.dataset.errorimgout //获取错误图片循环的下标
      var imgList = this.data.jinsArr    　　　　　　　//将图片列表数据绑定到变量
      imgList[errorimgoutIndex].teaching_teacher[errorImgIndex].photoPath = this.data.defaultImg //错误图片替换为默认图片
      this.setData({
        jinsArr: imgList
      })
    }
  }
})