


let config = require('../../utils/config');

//获取应用实例
const app = getApp()
Component({
  properties: {
    // myProperty: { // 属性名
    //   type: String, // 类型String, Number, Boolean, Object, Array, null
    //   value: '', // 属性初始值
    //   observer: function (newVal, oldVal) { } // 属性被改变时执行的函数
    // },
    // myProperty2: String // 简化的定义方式
  },
  options: {
    multipleSlots: true,
    properties: {

    },
    methods: {

    }
  },
  data: {
    capsuleHeight: config.capsuleHeight,
    statusBarHeight: config.statusBarHeight,
    pixelRate: config.pixelRate,
  }, 

  attached(){},
  // 生命周期函数，可以为函数，或method
  // ready: function () { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },
  
  // 事件处理
  methods: {
    // 跳转到首页
    bindJumpIndex: function () {
      wx.switchTab({
        url: '../index/index'
      })
    },

    // 返回上一页
    bindReturnPage: function () {
      wx.navigateBack({
        delta: 1
      })
    },

  }

})