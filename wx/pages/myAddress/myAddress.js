// pages/myAddress/myAddress.js
let AreaData = {};
let timeOutName;
let timeOutTel;
let timeAdsress;
let timeClear;
const { ajax } = require('../../utils/ajax.js')//ajax 请求
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyer_name: '',                                                 //收件人
    buyer_phone: '',                                                //收件人电话
    detail_address: '',                                              //详情地址
    addressName: '',                                                //所在地区
    isdefault: false,                                               //控制设置默认地址
    showPickerView: false,                                          //控制省市区三级联动显隐
    value: [0, 0, 0],
    tempValue: [0, 0, 0],
    provArr: [],                                       //省数组
    cityArr: [],                               //市数组
    areaArr: [],                       //区数组
    type: '',

    uid:'',
    id:'',
    selectName:0,
    selectTel: 0,
    selectAddress: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uid = wx.getStorageSync('userId') || '' ;
    this.setData({
      uid : uid
    })
    //请求后台数据
    this.getBackstageMessage();
  },
  //获取后台用户数据
  getBackstageMessage(){
    //判断有无uid
    if (!this.data.uid) {
      setTimeout(() => {
        wx.showToast({
          title: '请登录再编辑收货地址！',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
      return;
    }
    ajax({
      method: "POST",
      url: "getAddress",
      data: {
        uid: this.data.uid
      },
      success: data => {
        if (data.statusCode !== 200) {//userId参数为空
          setTimeout(() => {
            wx.showToast({
              title: '网络异常,刷新重试',
              icon: "none",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
          return;
        }
        if (data.result != null){
          let province = data.result.province || '';
          let city = data.result.city || '';
          let district = data.result.district || '';
          let addressBfore = province + '-' + city + '-' + district;
          this.setData({
            buyer_name: data.result.consignee || '',
            buyer_phone: data.result.tel || '',
            detail_address: data.result.address || '',
            addressName: addressBfore,
            id: data.result.id
          })
        }
        
      },
      fail: res => {
        setTimeout(() => {
          wx.showToast({
            title: '网络异常,刷新重试',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
      },
    })
  },
  //请求三级联动信息
  getThreeLevelLinkage(){
    //请求三级联动数据
    ajax({
      method: "POST",
      url: "area",
      data: {},
      success: data => {
        if (data.statusCode !== 200) {//userId参数为空
          setTimeout(() => {
            wx.showToast({
              title: '网络异常,刷新重试',
              icon: "none",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
          return;
        }
        AreaData = data;
        this.setData({
          provArr: AreaData.result,                                       //省数组
          cityArr: AreaData.result[0].children,                               //市数组
          areaArr: AreaData.result[0].children[0].children,
        })
      },
      fail: res => {
        setTimeout(() => {
          wx.showToast({
            title: '网络异常,刷新重试',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
      },
    })
  },
  
  //清空手机号
  clearNumber: function () { 
    timeClear = setTimeout(()=>{
      if(this.data.selectName == 1){
        this.setData({ buyer_name: '' });
      } else if (this.data.selectTel == 2){
        this.setData({ buyer_phone: '' });
      } else if (this.data.selectAddress == 3){
        this.setData({ detail_address: '' });
      }
    },200)
  },
  //收件人
  blurName: function (event) {
     this.setData({ buyer_name: event.detail.value });
     timeOutName =  setTimeout(()=>{
       this.setData({ selectName: 0 });
     },800)
  },
  focusName: function () { 
    this.setData({ selectName:1});
    clearTimeout(timeOutName);
  },
  //联系方式
  //手机号码
  focusTel: function () { 
    clearTimeout(timeOutTel);
    this.setData({ selectTel: 2 });
  },
  bindPhoneNumInput(event) {
    this.setData({ buyer_phone: event.detail.value });
    timeOutTel = setTimeout(() => {
      this.setData({ selectTel: 0 });
    }, 800)
  },
  //详细地址
  watchName:function(event){
    if (event.detail.value.length>=20){
      setTimeout(() => {
        wx.showToast({
          title: '收货人姓名最多20个字',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    }
  },
  
  

  //详细地址
  watchAddress:function(event){
    if (event.detail.value.length >= 50) {
      setTimeout(() => {
        wx.showToast({
          title: '详细地址最多50个字',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    }
  },
  focusAddress: function () { 
    clearTimeout(timeAdsress);
    this.setData({ selectAddress: 3 }); 
    

  },
  bindDetailAddress(event) {
    this.setData({ detail_address: event.detail.value });
    timeAdsress = setTimeout(() => {
      this.setData({ selectAddress: 0 });
    }, 800)
  },

  //三级联动触发方法
  bindChange: function (e) {
    let val = e.detail.value
    if (val[0] != this.data.tempValue[0]) {
      val = [val[0], 0, 0]
    }
    if (val[1] != this.data.tempValue[1]) {
      val = [val[0], val[1], 0]
    }
    this.setData({
      tempValue: val,
      value: val,
      cityArr: AreaData.result[val[0]].children,
      areaArr: AreaData.result[val[0]].children[val[1]].children,
    })
  },

  //打开省市区三级联动
  openPickerView() {
    this.setData({ showPickerView: true });
  },
  //关闭省市区三级联动
  closePickerView() {
    this.setData({ showPickerView: false });
  },

  //省市区三级联动确定
  confirmPickerView() {
    let val = this.data.value;
    let provName = AreaData.result[val[0]].name;
    let cityName = AreaData.result[val[0]].children[val[1]].name;
    let areaName = AreaData.result[val[0]].children[val[1]].children[val[2]];
    let addressName = provName +' - '+ cityName +' - '+ areaName;
    this.setData({
      addressName: addressName,
      showPickerView: false,
    })
  },


 

  

  //保存按钮
  bindSaveButton() {
    let that = this;
    //判断有无uid
    if (!that.data.uid) {
      setTimeout(() => {
        wx.showToast({
          title: '请登录再编辑收货地址！',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
      return;
    }
    if (!that.data.buyer_name) {
      setTimeout(() => {
        wx.showToast({
          title: '请填写收货人姓名',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    }

    else if (!that.data.buyer_phone) {
      setTimeout(() => {
        wx.showToast({
          title: '请填写收件人电话',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    } else if (!(/^1\d{10}$/).test(that.data.buyer_phone)){
      setTimeout(() => {
        wx.showToast({
          title: '手机号格式不对，请重新输入',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);

    }
    else if (!that.data.addressName) {
      setTimeout(() => {
        wx.showToast({
          title: '请选择所在地区',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    }
    else if (!that.data.detail_address) {
      setTimeout(() => {
        wx.showToast({
          title: '请输入详细地址',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    } else {
      //保存更改新到后台ajax
      //ajax请求
      //请求三级联动数据
      ajax({
        method: "POST",
        url: "addAddress",
        data: {
          "uid": that.data.uid,
          "id": that.data.id,
          "consignee": that.data.buyer_name,
          "tel": that.data.buyer_phone,
          "provinces": that.data.addressName,
          "address": that.data.detail_address
        },
        success: data => {
          if (data.statusCode !== 200) {//userId参数为空
            setTimeout(() => {
              wx.showToast({
                title: data.message,
                icon: "none",
              });
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }, 0);
            return;
          } else if (data.statusCode == 200){
            setTimeout(() => {
              wx.showToast({
                title: data.message,
                icon: "none",
              });
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }, 0);
            wx.navigateBack();
          }
          
        },
        fail: res => {
          setTimeout(() => {
            wx.showToast({
              title: '网络异常,刷新重试',
              icon: "none",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
        },
      })

     

    }

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
    //三级联动信息
    this.getThreeLevelLinkage();
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