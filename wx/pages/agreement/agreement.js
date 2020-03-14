// pages/agreement/agreement.js
//获取应用实例
const app = getApp();
const { ajax } = require('../../utils/ajax.js');
Page({
  data: {
    goodsId:'', // 商品id
    agreementData: {}, // 协议内容
    userPhone:'',  // 绑定的手机号
    msgCode:'',
    userId:'',  // 用户id
    sendmsg: true,
    getmsg: "获取验证码",
    inputPhone: '', // 输入框手机号码:'获取验证码',
    payState: false,
    parameteData:{}, // 支付订单数据-链接
    sendSmsTry:true
  },

  onLoad: function (options) {
    // 接收数据
    let parameteData = JSON.parse(options.parameteData);
    this.setData({
      goodsId: parameteData.goodsId,
      parameteData: parameteData,
      userPhone: wx.getStorageSync('userPhone'),
      inputPhone: wx.getStorageSync('userPhone'),
      userId: wx.getStorageSync('userId'),
    })
  },

  onShow: function () {
    // 获取服务协议
    this.bindServiceAgreement();
  },

  // 获取订单协议
  bindServiceAgreement: function () {
    ajax({
      url: 'courseAgreement',
      method: 'post',
      data: {
        goodsId: this.data.goodsId,
      },
      success: data => {
        if (data.statusCode == '200') {
          if (data.result.content != null) {
            // 清除img样式
            let newContent = data.result.content.replace(/<img[^>]*>/gi, function (match, capture) {
              var match = match.replace(/style\s{0,}=\s{0,}(\"|\')([^(\"|\')]*)(\"|\')/gi, 'class="course-about-img"');
              return match;
            });
            data.result.content = newContent
          }
          this.setData({
            agreementData: data.result
          })
        }
      }
    })
  },

  // 获取输入的手机号
  getPhone: function (e) {
    let phone = e.detail.value;
    let code = this.data.msgCode + '';
    let payState = false;  // 是否同意支付
    if (phone.length == '11' && code.length == '6' && !isNaN(code) && !isNaN(phone)) {
      payState = true
    }
    this.setData({
      inputPhone: phone,
      payState: payState
    });
  },

  // 删除输入框手机号
  delInputPhone: function(){
    this.setData({
      inputPhone: '',
      payState: false,
    });
  },

  // 获取输入的验证码
  getCode: function (e) {
    let code = e.detail.value + '';
    let phone = this.data.inputPhone+'';
    let payState = false;  // 是否同意支付
    if (phone.length == '11' && code.length == '6' && !isNaN(code) && !isNaN(phone) ) {
      payState = true
    }
    this.setData({
      msgCode: code,
      payState: payState
    });
  },

  // 获取短信验证码 倒计时
  sendmessg: function () {
    let that = this;
    let inputPhone = that.data.inputPhone + '';
    if (inputPhone.length != 11 || isNaN(inputPhone)) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: "none"
      })
      return;
    }
    let time = 60 ; // 倒计时时间
    if (that.data.sendmsg && that.data.sendSmsTry){
      // 发送手机号
      that.bindSendSms(inputPhone);
    }
    that.setData({
      sendSmsTry: false
    })
    var inter = setInterval(function () {
      that.setData({
        getmsg: '( ' + time + "S )",
        sendmsg: false,
        sendSmsTry:false
      })
      time--
      if (time < 0) {
        // timer = 1
        clearInterval(inter)
        that.setData({
          sendmsg: true,
          getmsg: "重新发送",
          sendSmsTry:true
        })
      }
    }, 1000)
  },

  // 发送手机验证码
  bindSendSms: function (inputPhone) {
    ajax({
      url: 'wxSendSms',
      method: 'post',
      data: {
        smsType: "readAgree",
        type: 'xcx',
        mobile: inputPhone,
      },
      success: data => {
        if (data.statusCode != '200') {
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
      }
    })
  },

  // 表单提交验证手机号和验证码
  formSubmit(e) {
    let parameteData = JSON.stringify(this.data.parameteData);
    let phone = e.detail.value.phone;
    let code = e.detail.value.code;
    if (phone.length != 11 || isNaN(phone)) {
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
        if (data.statusCode == '200') {
          // 添加新用户
          if (!wx.getStorageSync('userId')){
            this.addUser(phone);
          }
          // 跳转确认订单页面
          let parameteData = JSON.stringify(this.data.parameteData);
          wx.navigateTo({
            url: '../orderSure/orderSure?parameteData=' + parameteData
          })
        } else {
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
      }
    })
  },

  // 添加用户信息
  addUser: function (phone) {
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
          // phoneState: true,  // 隐藏手机弹出框
          userPhone: data.result.mobile,
          userId: data.result.uid
        })

      }
    })
  },
















})