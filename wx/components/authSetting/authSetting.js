
//获取应用实例
const app = getApp()
const { ajax } = require('../../utils/ajax.js')//ajax 请求
Component({
  properties: {
    propa:{
      type: Function
    },
    userInfo: {
      type: Object,
      value: null,
    }
  },
  
  data: {
    inputPhone: '',
    userPhone: wx.getStorageSync('userPhone') || '',
    phoneState: true, // 验证手机号验证码弹出框
    phoneCodeState: false, // 验证码和友情提示切换
    sendmsg: true,
    getmsg: "发送",
    wxHeight: '',
    userId:'',
  },

  /**
 * 组件挂载后执行
 */
  ready: function () {
      this.setData({
        userInfo: this.data.userInfo || null,
        userId: wx.getStorageSync('userId') || '',
        wxHeight: wx.getSystemInfoSync().windowHeight,
        userPhone: wx.getStorageSync('userPhone'),
      });
  },


  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {

    },
  },

  methods: {
    // 获取授权
    getUserInfo: function (e) {
      app.globalData.userInfo = e.detail.userInfo||null;
      if ( e.detail.userInfo ){
        app.globalData.userLogin( e.detail.iv, e.detail.encryptedData);  //授权
        setTimeout(() => {
          this.triggerEvent('myevent')
        },1000)
      }
    },

    // 获取用户微信手机号
    getPhoneNumber(e) {
          let data = e.detail;
          let state = e.currentTarget.dataset.state;
          wx.checkSession({  // 检测登录态是否过期
            success: () => {
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
                    console.log(data, '111111');
                    if (data.statusCode == '200') {
                      wx.setStorageSync('userPhone', data.result.mobile + '') //  存储手机号
                      if (data.result.is_new == '0') { // 0 是老用户，1是新用户
                        wx.setStorageSync('userId', data.result.uid)
                        // 重新渲染
                        this.setData({
                          userPhone: data.result.mobile,
                          //userId: data.result.uid  
                        })
                        // 
                        setTimeout(() => {
                          this.triggerEvent('myevent')
                        }, 1000)
                      } else {
                          // 重新渲染
                          this.setData({
                            userPhone: data.result.mobile,
                            phoneState: false,  // 显示绑定手机号弹出框
                          })
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

    // 获取短信验证码 倒计时
    sendmessg: function () {
      let that = this;
      let inputPhone = that.data.inputPhone + '' || wx.getStorageSync('userPhone') + '';
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
          getmsg: '( ' + time + 's )',
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
    bindSendSms: function (inputPhone) {
      ajax({
        url: 'wxSendSms',
        method: 'post',
        data: {
          smsType: 'login',
          type: 'xcx',
          mobile: inputPhone,
        },
        success: data => {
          if (data.statusCode != '200') {
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

    // 验证码和友情提示切换
    bindPhoneCodeState: function (e) {
      this.setData({
        phoneCodeState: !e.currentTarget.dataset.state
      })
    },

    // 绑定用户
    bindUserId: function(){
      this.setData({
        phoneState: false
      })
    },

    // 表单提交验证手机号和验证码
    formSubmit(e) {
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
            this.addUser(phone);
            setTimeout(() => {
              this.triggerEvent('myevent')
            }, 1000)
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

    // 隐藏绑定手机弹出框
    bindPhonePopup: function (e) {
      this.setData({
        phoneState: true,
      })
      setTimeout(() => {
        this.triggerEvent('myevent')
      }, 1000)
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
            phoneState: true,  // 隐藏手机弹出框
          })

        }
      })
    },


  }

})