// pages/afterSale/afterSale.js
const util = require('../../utils/util.js')
const { ajax } = require('../../utils/ajax.js')//ajax 请求
var order_no = '';
var order_id= '';
var order_status = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:'',
    select:'',
    textArea:'',
    texTypes:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    order_no = options.order_no || '';
    order_id = options.order_id || '';
    order_status = options.order_status || '';
    
  },
  //问题类型选择
  checkedQuestion:function(e){
    let id = e.currentTarget.dataset.id || '';
    let tex = e.currentTarget.dataset.tex || '';
    this.setData({
      select: id,
      texTypes : tex
    })
  },
  //textArea
  bindTextAreaBlur(e) {
    console.log(e.detail.value);
    let textAreas = e.detail.value || '';
    this.setData({
      textArea : textAreas
    })
  },
  
  //清空手机号
  clearNumber:function(){
    this.setData({
      phoneNumber: ''
    })
    
  },
  
  //提交表单信息
  submit:function(){
    //获取用户userId
    let uid = wx.getStorageSync('userId') || '';
    //手机号码
    let telePhone = this.data.phoneNumber;
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(telePhone)) || telePhone.toString().length != '11') {
      // wx.showToast({
      //   title: '手机号格式有误',
      //   icon: 'none',
      //   duration: 2000
      // })

      setTimeout(() => {
        wx.showToast({
          title: '手机号格式有误',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);


      return;
    } 
    //问题内容选择
    let texTypes = this.data.texTypes;
    //文本框内容
    let textArea = this.data.textArea;
    if (!this.data.phoneNumber ){
        // wx.showToast({
        //   title: '请填写正确的手机号',
        //   icon: 'none',
        //   duration: 2000
        // })
        setTimeout(() => {
          wx.showToast({
            title: '请填写正确的手机号',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);

    } else if ( !this.data.select ){
        // wx.showToast({
        //   title: '问题类型为必选项',
        //   icon: 'none',
        //   duration: 2000
        // })

        setTimeout(() => {
          wx.showToast({
            title: '问题类型为必选项',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
    }else{
      //调取接口向后台传递信息 
      ajax({
        method:'POST',
        url:'myFeedBack',
        data:{//字段自己先做的定义后期接口写好后再做修改
          uid : uid,//用户userId
          mobile : telePhone,
          questionType: texTypes,
          description: textArea,
          orderId: order_id
        },
        success:data =>{
          if (data.statusCode !== 200){
              // wx.showToast({
              //   title: '网络错误,稍后重试!',
              //   icon: 'none',
              //   duration: 2000
              // })
              setTimeout(() => {
                wx.showToast({
                  title: '网络错误,稍后重试!',
                  icon: "none",
                });
                setTimeout(() => {
                  wx.hideToast();
                }, 2000)
              }, 0);
          }else{
            setTimeout(() => {
              wx.showToast({
                title: '提交成功',
                icon: "none",
              });
              setTimeout(() => {
                wx.hideToast();
              }, 2000)
            }, 0);
            //提交信息成功后自动跳转到我的订单详情页
            wx.redirectTo({
              url: '../myOrderDetail/myOrderDetail?order_no=' + order_no + '&order_status=' + order_status,
            })
          }
          
        }
      })
      
    }
  },


  //验证手机号格式
  blurPhone: function (event) {

    let phone = event.detail.value;
    this.setData({
      phoneNumber: phone
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var telePhone = wx.getStorageSync('userPhone')
    this.setData({
      phoneNumber: telePhone
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})