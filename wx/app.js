//app.js
const { ajax } = require('./utils/ajax.js')
import Touches from './utils/Touches.js'
App({
  // 全局公共数据
  globalData: {

    ccsdk: requirePlugin('ccsdk'),

    // 用户相关信息
    userInfo: null,
    userCode: '',
    openid: '',

    // login只发一次
    loginAjax: false,

    // currentPath: '',
    // 授权登陆接口  userCode和userInfo同时都有的时候存储
    userLogin: function ( iv, encryptedData, cb ){
      if (this.userInfo && this.userCode && !this.openid && iv && !this.loginAjax){
        this.loginAjax = true;
        ajax({
          url: 'login',
          method: 'post',
          data: {
            code: this.userCode, 
            nick: this.userInfo.nickName,
            avatar: this.userInfo.avatarUrl,
            iv,
            encryptedData
          },
          success: (res) => {
            if ( res.statusCode == 200 ){
              this.openid = res.result.openid;
              wx.setStorage({
                key: 'openid',
                data: res.result.openid
              })
              wx.setStorage({
                key: 'userPhone',
                data: res.result.mobile
              })
              wx.setStorage({
                key: 'guid',
                data: res.result.guid
              })
              
              wx.setStorage({
                key: 'userId',
                data: res.result.uid
              })
              // ccUser
              wx.setStorage({
                key: 'ccUser',
                data: {
                  ccUserId: '',
                  userName: this.userInfo.nickName,
                  guid: res.result.guid,
                },
              })

              // if ( _d == 'reload' && this.currentPath ){
              //   wx.redirectTo({
              //     url: this.currentPath
              //   })
              // }
              cb && cb();
            }
            
          }
        })
      }
    }

    



  },
  onShow: function(options) {
    this.upDataApp();
  },
  
  upDataApp: function () {//版本更新

    if (wx.canIUse('getUpdateManager')) {//判断当前微信版本是否支持版本更新

      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate(function (res) {

        if (res.hasUpdate) { // 请求完新版本信息的回调

          updateManager.onUpdateReady(function () {

            wx.showModal({

              title: '更新提示',

              content: '新版本已经准备好，是否重启应用？',

              success: function (res) {

                if (res.confirm) {// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启

                  updateManager.applyUpdate()

                }

              }

            })

          });

          updateManager.onUpdateFailed(function () {

            wx.showModal({// 新的版本下载失败

              title: '已经有新版本了哟~',

              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',

            })

          })

        }

      })

    } else {

      // wx.showModal({// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示

      //   title: '提示',

      //   content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'

      // })

    }

  },

  onLaunch: function (options) {
    
    wx.setKeepScreenOn({
      　keepScreenOn: true
    })

    // this.globalData.openid = '';
    // 登录
    wx.login({
      success: res => {
        this.globalData.userCode = res.code;
        // this.globalData.userLogin();  //授权
      }
    })


    // 获取用户信息
    if (!this.globalData.userInfo){
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) { // 已经授权
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo;
                this.globalData.userLogin(res.iv, res.encryptedData);  //授权
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // if (this.userInfoReadyCallback) {
                //   this.userInfoReadyCallback(res)
                // }
              }
            })
          }
        },
        error: err => {

        }
      })
    }
    
  },
   Touches: new Touches()

})