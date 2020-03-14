//index.js
//获取应用实例
const app = getApp();
const { ajax } = require('../../utils/ajax.js');

Page({
  data: {
    currentData: 0,   // 选项卡切换
    chapterId: '1',
    displayState:'false',
    educationState: true,
    courseId:'', // 课程id
    courseData: {},  // 课程详情
    courseInfo: {},  // 课程具体详情
    courseGroup: [], // 学历套餐组合
  
    userPhone: '', // 缓存-用户手机号
    userId: '', // 用户id
    goodsId: '', // 课程id
    groupId: '', // 套餐组合

    groupItem: [],  // 选中的组合套餐

    phoneState: true, // 验证手机号验证码弹出框
    phoneCodeState: false, // 验证码和友情提示切换
    
    sendmsg: true,
    getmsg: "发送",
    
    inputPhone: '', // 输入框手机号码

    parameteData:{}, // 传递的参数

    iponeX:'',

    bindstate: '0',

    companyId: '',  // 小程序来源
  },

  onLoad: function (options) {
    let [iponeX, companyId, courderId] = ['','',''];
    wx.getSystemInfo({
      success(res) {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone XS') != -1 ) {
          iponeX = "iponeX-bottom"
        }
      }
    })
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      courderId = scene.split("&")[0];
      companyId = scene.split('&')[1];
    }else{
      courderId = options.courderId;
    }
    this.setData({
      companyId: companyId,
      goodsId: courderId,
      iponeX: iponeX,
    })
  },

  onShow: function () {
    // 添加收藏
    wx.showLoading({
      title: '加载中'
    })
    // 右上角转发
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      userId: wx.getStorageSync('userId'),
      openId: wx.getStorageSync('openid'),
      userPhone: wx.getStorageSync('userPhone'),
    })
    // 获取课程详情
    this.getCourseDetail();
  },

  // 登录试听微信授权
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo || null;
    if (e.detail.userInfo) {
      app.globalData.userLogin(e.detail.iv, e.detail.encryptedData, ()=>{
        this.setData({
          userId: wx.getStorageSync('userId'),
          openId: wx.getStorageSync('openid'),
          userPhone: wx.getStorageSync('userPhone'),
        })
        this.getCourseDetail();
      });
    }
  },

  // 获取课程详情
  getCourseDetail: function(){
    ajax({
      url: 'courseDetail',
      method: 'post',
      data: {
        openId: wx.getStorageSync('openid'),
        goodsId: this.data.goodsId,
        sourceId: this.data.companyId,
      },
      success: data => {
        let res = data.result || null;
        // 图文介绍 去除img里面style属性
        if (res == null) {
          this.setData({
            courseData: res,
          })
          return;
        }
        if (res && res.detail.length > 0) {
          let newContent = res.detail[0].content.replace(/<img[^>]*>/gi, function (match, capture) {
            var match = match.replace(/style\s{0,}=\s{0,}(\"|\')([^(\"|\')]*)(\"|\')/gi, 'class="course-about-img"');
            return match;
          });
          res.detail[0].content = newContent
        }
        if (res && res.arrange.length > 0) {
          // 课程安排 展开收起
          res.arrange.map(item => item.state = false);
          res.arrange[0].state = true;
        }
        let courseData = this.data.courseData;
        let parameteData = this.data.parameteData;

        parameteData = {
          goodsId: res.info.id,
          goodsAllId: '',
          goodsName: res.info.goods_name,
          goodsPrice: res.info.shop_price,
          source: this.data.companyId,
        };
        // 渲染
        this.setData({
          courseData: res,
          courseInfo: res.info,
          courseGroup: res.group,
          parameteData: parameteData,
          groupItem: res.info.order_goods,
        })
        // 隐藏渲染
        wx.hideLoading();
      }
    })
  },

// 验证码和友情提示切换
bindPhoneCodeState: function(e){
  this.setData({
    phoneCodeState: !e.currentTarget.dataset.state
  }) 
},

// 已授权手机号，跳转协议
bindJumpPage:function(){
  let parameteData = JSON.stringify(this.data.parameteData);
  let courseInfo = this.data.courseInfo;
  if (courseInfo.agreement_id == '0'){
    wx.navigateTo({
      url: '../orderSure/orderSure?parameteData=' + parameteData
    })
  }else{
    wx.navigateTo({
      url: '../agreement/agreement?parameteData=' + parameteData
    })
  } 
},

// 立即支付
paymentOrder: function (e) {
  wx.getSystemInfo({
    success(res) {
      if (res.platform == "android"){
        wx.navigateTo({
          url: '../androidPay/androidPay?order_no=' + e.currentTarget.dataset.orderno
        })
      }
      // else if (res.platform == "android"){
      else{
        wx.navigateTo({
          url: '../iosCode/iosCode?order_no=' + e.currentTarget.dataset.orderno
        })
      }
    }
  })
},

// 获取用户微信手机号
getPhoneNumber(e) {
  let data = e.detail;
  let state = e.currentTarget.dataset.state;
  wx.checkSession({  // 检测登录态是否过期
    success:()=> {
      if (data.encryptedData && data.iv && app.globalData.openid) {
        ajax({
          url: 'getPhone',
          method: 'post',
          data: {
            encryptedData: data.encryptedData,
            iv: data.iv,
            openId: app.globalData.openid,
          },
          success: data => {
            if (data.statusCode == '200') {
              wx.setStorageSync('userPhone', data.result.mobile+'') //  存储手机号
              if (data.result.is_new == '0'){ // 0 是老用户，1是新用户
                wx.setStorageSync('userId', data.result.uid)
                // 重新渲染
                this.setData({
                  userPhone: data.result.mobile,
                  inputPhone: data.result.mobile,  // 发送短信的手机号
                  userId: data.result.uid
                })
                // 立即购买-跳转到协议页面
                if (state == '1'){  // 等于1，授权成功后，跳转页面
                  let parameteData = JSON.stringify(this.data.parameteData);
                
                  let courseInfo = this.data.courseInfo;
                  if (courseInfo.agreement_id == '0') {
                    wx.navigateTo({
                      url: '../orderSure/orderSure?parameteData=' + parameteData
                    })
                  } else {
                    wx.navigateTo({
                      url: '../agreement/agreement?parameteData=' + parameteData
                    })
                  }
                }
              }else{
               
                // 立即购买-跳转到协议页面
                if (state == '1') {
                  let parameteData = this.data.parameteData;
                  let courseInfo = this.data.courseInfo;
                  if (courseInfo.agreement_id == '0') {
                    if ((parameteData.goodsAllId == "undefined" || parameteData.goodsAllId == null || parameteData.goodsAllId == "") && courseInfo.is_group == '1'){
                      this.setData({
                        userPhone: data.result.mobile,
                      })
                    }else{
                      this.setData({
                        bindstate: '2',
                        phoneState: false,
                        userPhone: data.result.mobile,
                      })
                    }
                  } else {
                    if (courseInfo.is_group == '1' && (parameteData.goodsAllId == "undefined" || parameteData.goodsAllId == null || parameteData.goodsAllId == "")){
                      this.setData({
                        userPhone: data.result.mobile,
                      })
                    }else{
                      wx.navigateTo({
                        url: '../agreement/agreement?parameteData=' + JSON.stringify(parameteData)
                      })
                    }
                  }
                }else{
                  this.setData({
                    userPhone: data.result.mobile,
                    inputPhone: data.result.mobile,  // 发送短信的手机号
                    phoneState: false,
                  })
                }
              }  
            } else {
              setTimeout(() => {
                wx.showToast({
                  title: data.message,
                  icon: "none",
                });
                setTimeout(() => {
                  wx.hideToast();
                }, 2000)
              }, 0);
            }
          }
        })
      }
    },
    fail() {
      setTimeout(() => {
        wx.showToast({
          title: '请重新登录授权',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    }
  })
},

// 点击学历选项
bindClickCombination: function(e){
  let [groupArr, courseGroup, groupItem] = [e.currentTarget.dataset, this.data.courseGroup, this.data.groupItem];
  courseGroup[groupArr.index].selectionId = groupArr.id;
  // 选中的数据
  let groupItemOption = {
    id: groupArr.id,
    goods_name: groupArr.goodsname,
    group_name: groupArr.groupname,
  };
  groupItem[groupArr.index] = groupItemOption;
  // 选择的组合套餐id
  let goodsAllId = "";
  groupItem.map(item => {
    goodsAllId += item.id + ',';
  });  
  goodsAllId = goodsAllId.substr(0, goodsAllId.length - 1);
  let parameteData = this.data.parameteData;
  parameteData.goodsAllId = goodsAllId;

  this.setData({
    courseGroup: courseGroup,
    groupItem: groupItem,
    parameteData: parameteData
  })
},

// 获取输入的手机号
getPhone: function (e) {
  let inputPhone = e.detail.value;
  this.setData({
    inputPhone: inputPhone
  });
},

// 获取短信验证码 倒计时
sendmessg: function(){
  let that = this;
  let inputPhone = that.data.inputPhone + '' || wx.getStorageSync('userPhone')+'';
  if (inputPhone.length != 11 || isNaN(inputPhone)) {
    wx.showToast({
      title: '请输入有效的手机号码',
      icon: "none"
    })
    return;
  }
  let time = 60  // 倒计时时间
  // 发送手机号
  that.bindSendSms(inputPhone);
    var inter = setInterval(function () {
      that.setData({
        getmsg: '( '+ time +'s )',
        sendmsg: false,
      })
      time--
      if (time < 0) {
        // timer = 1
        clearInterval(inter)
        that.setData({
          sendmsg: true,
          getmsg: "重新发送",
        })
      }
    }, 1000)
},

// 发送手机验证码
bindSendSms: function (inputPhone){
  ajax({
    url: 'wxSendSms',
    method: 'post',
    data: {
      smsType: 'login',
      type: 'xcx',
      mobile: inputPhone,
    },
    success: data => {
      if (data.statusCode!= '200'){
        setTimeout(() => {
          wx.showToast({
            title: '短信发送失败',
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

// 表单提交验证手机号和验证码
formSubmit(e){
  let bindstate = e.detail.value.bindstate;
  let phone = e.detail.value.phone;
  let code = e.detail.value.code;
  let goodsid = e.detail.value.goodsid;
  if (phone.length != 11 || isNaN(phone)){
    setTimeout(() => {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: "none",
      });
      setTimeout(() => {
        wx.hideToast();
      }, 2000)
    }, 0);
    return;
  }
  if (code.length != 6 || isNaN(code)) {
    setTimeout(() => {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: "none",
      });
      setTimeout(() => {
        wx.hideToast();
      }, 2000)
    }, 0);
    return;
  }  
  ajax({
    url: 'checkSms',
    method: 'post',
    data: {
      type: 'xcx',
      mobile: phone,
      code: code,
    },
    success: data => {
      if (data.statusCode =='200'){
        // 添加新用户
        this.addUser(phone);
        // bindstate=1 是收藏， 2是无协议
        if (bindstate == '1'){
          // 添加收藏
          this.cancelCollect('', 1, goodsid);
        }
        if (bindstate == '2'){
          let parameteData = JSON.stringify(this.data.parameteData);
          wx.navigateTo({
            url: '../orderSure/orderSure?parameteData=' + parameteData
          })
        }
      }else{
        setTimeout(() => {
          wx.showToast({
            title: data.message.msg,
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
      }
      this.setData({
        bindstate: '0',
      })
    },
  })
},

// 添加用户信息
addUser: function (phone){
  ajax({
    url: 'addUser',
    method: 'post',
      data: {
        openId: wx.getStorageSync('openid'),
        mobile: phone,
      },
      success: data => {
        wx.setStorageSync('userPhone', data.result.mobile)
        wx.setStorageSync('userId', data.result.uid)
        wx.setStorageSync('guid', data.result.guid)
        this.setData({
          phoneState: true,  // 隐藏手机弹出框
          userPhone: data.result.mobile,
          userId: data.result.uid
        })

      }
    })
},

  // 添加,取消收藏
  cancelCollect: function (e, cancelState, gId){
    let courseInfo = this.data.courseInfo;
    let state = ''
    let goodsid =''
    if (cancelState == '1'){  // 未注册收藏
       state = '1';
       goodsid = gId
    }else{
      [state, goodsid] = [e.currentTarget.dataset.state, e.currentTarget.dataset.goodsid];
      if (state == '0') {
        state = '1'
      } else {
        state = '0'
      }
    }
    courseInfo.is_collect = state
    ajax({
      url: 'cancelCollect',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userId'),
        goodsId: goodsid,
      },
      success: data => {
        if (data.statusCode == 200){
          this.setData({
            courseInfo: courseInfo
          })
        }
      }
    })
  },

  // 显示隐藏学组合套餐弹出框
  bindClickEducation: function(e){
    let courseGroup = this.data.courseGroup;
    let groupItem = this.data.groupItem;
    let isorder = e.currentTarget.dataset.isorder
    // 立即支付支付-1，已购买-2，不允许再更改组合套餐
    if (isorder == '1' || isorder == '2'){
      return;
    }
    let state = groupItem.includes(undefined);  // 数组里是否有undefined
    if (courseGroup.length != groupItem.length && groupItem.length != 0 || state ){
      setTimeout(() => {
        wx.showToast({
          title: '请选择完整的组合套餐',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    }else{
      this.setData({
        educationState: !this.data.educationState,
      })
    }
  },

  // 章节展开和收起
  bindChapter: function(e) {
    let chapterArr = e.currentTarget.dataset;
    let courseData = this.data.courseData;
    courseData.arrange[chapterArr.index].state = !chapterArr.state
    this.setData({
      courseData: courseData
    })
  },

  // 课程试听
  bindCourseAuditions: function(e){
    if (e.currentTarget.dataset.id){
      wx.navigateTo({
        url: '../audition/audition?id=' + e.currentTarget.dataset.id + '&goods_id=' + this.data.goodsId
      })
    }else{
      wx.showToast({
        title: '尚未上传此试听课程',
        icon: "none",
      });
    }
  },

  // 课程介绍+课程安排 -切换
  bindCheckCurrent: function (e) {
    const that = this;
    let current = e.target.dataset.current;
    if (that.data.currentData === current) {
      return false;
    } else {
      that.setData({
        currentData: current
      })
    }
  },

  // 弹出绑定手机号弹出框
  bindUserId: function (e) {
    this.setData({
      phoneState: false,
      bindstate: e.currentTarget.dataset.bindstate,
    })
  },

  // 隐藏绑定手机弹出框
  bindPhonePopup: function (e) {
    this.setData({
      phoneState: true,
    })
  },

})