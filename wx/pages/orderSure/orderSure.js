// pages/orderSure/orderSure.js
const app = getApp();
const { ajax } = require('../../utils/ajax.js');

Page({

  data: {
    discountCode: false, // 是否显示优惠券
    couponDiscount: '0', // 优惠券金额
    parameteData:{}, // 订单数据
    coupon_sn:'',  // 优惠码

    buyer_name: '',                                                 //收件人
    buyer_phone: '',                                                //收件人电话
    detail_address: '',                                              //详情地址
    addressName: '', 
    uid: '',
    id: '',
    is_object:'',
    is_object_list:'',
    is_not_address:'',
    is_not_address_no: false,
    boxShow: false,
  },

  onLoad: function (options) {
    // 接收数据
    let parameteData = JSON.parse(options.parameteData);
    this.setData({
      parameteData: parameteData
    })
  },
  
  onShow: function (){
    this.setData({
      goodsPrice: this.data.parameteData.goodsPrice,
      uid: wx.getStorageSync('userId'),
    });
    //获取收货地址信息
    this.getIsObject();
  },
  //是否为实物
  getIsObject(){
    let goodsIds ='';
    if (this.data.parameteData.goodsAllId){
      goodsIds = this.data.parameteData.goodsAllId
    }else{
      goodsIds = this.data.parameteData.goodsId
    };
    ajax({
      method: "POST",
      url: "isObject",
      data: {
        goodsId: goodsIds
      },
      success: data => {
        // 实物
        if (data.result.is_object == 1){
          this.setData({
            is_object: data.result.is_object,
            is_object_list:1,
            is_not_address_no: true,
          })
          this.getBackstageMessage();
        }else{
          this.setData({
            is_not_address_no: false
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
  //获取后台用户数据
  getBackstageMessage() {
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
        if (data.result != null) {
          let province = data.result.province || '';
          let city = data.result.city || '';
          let district = data.result.district || '';
          let addressBfore = province + city  + district;
          
          this.setData({
            buyer_name: data.result.consignee || '',
            buyer_phone: data.result.tel || '',
            detail_address: data.result.address || '',
            addressName: addressBfore,
            id: data.result.id,
            is_not_address:true,
            is_not_address_no: false,
          })
        }else{
          this.setData({
            is_not_address_no: true
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
  //跳转编辑收货地址页面
  editAddress:function(){
    wx.navigateTo({
      url: '../myAddress/myAddress'
    })
  },
  // 立即支付
  createOrder: function () {
    //判断是否有收货地址
    if (this.data.is_not_address_no){
      setTimeout(() => {
        wx.showToast({
          title: '请先添加您的收货地址',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
      return;
    }
    ajax({
      url: 'Android_create_order',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userId'),
        goods_id: this.data.parameteData.goodsId,
        coupon_sn: this.data.coupon_sn,
        goodsAllId: this.data.parameteData.goodsAllId,
        isAddress: this.data.is_object_list,//需要查询收货地址
        source: '3', // 订单来源
      },
      success: data => {
        if (data.statusCode == '200') {
          // 判断是ios支付还是安卓支付
          wx.getSystemInfo({
            success: res => {
              if (res.platform == "android") {
                wx.navigateTo({
                  url: '../androidPay/androidPay?order_no=' + data.result
                })
              }
              else {
                this.sendXcxSmsTz(data.result);
                wx.navigateTo({
                  url: '../iosCode/iosCode?order_no=' + data.result
                })
      
              }
            }
          })
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
  },

  // 免费领取
  bindFreeCollection:function(){
    ajax({
      url: 'Android_create_order',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userId'),
        goods_id: this.data.parameteData.goodsId,
        coupon_sn: this.data.coupon_sn,
        goodsAllId: this.data.parameteData.goodsAllId,
        isAddress: this.data.is_object_list,   //需要查询收货地址
        source: this.data.parameteData.source,
      },
      success: data => {
        if (data.statusCode == '200') {
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
    // 下订单
    this.setData({
      boxShow: true
    })
    // 跳转页面
    setTimeout(()=>{
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。  
      let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
      let deltaData = 1;
      if (prevPage.route == 'pages/agreement/agreement'){
        deltaData = 2
      }
      wx.navigateBack({
        delta: deltaData  // 返回上一级页面
      })
    },3000)
  },

  // ios支付发送短信
  sendXcxSmsTz: function (trade_no) {
    ajax({
      url: 'xcxSmsTz',
      method: 'post',
      data: {
        trade_no: trade_no,
        mobile: wx.getStorageSync('userPhone'),
      },
      success: data => {
        // console.log(data,'ios发送手机号');
      }
    })
  },

  // 使用优惠码
  codeSwitchChange(e) {
    this.setData({
      discountCode: e.detail.value,
      couponDiscount:'0',
      coupon_sn:'',
    })
  },

  // 查询优惠码金额
  bindInputCode:function(e){
    let coupon_sn = e.detail.value;
    if (coupon_sn.length == '16'){
      this.getCouponData(coupon_sn);
    }
  },
  
  // 查询优惠码
  getCouponData: function (coupon_sn) {
    ajax({
      url: 'xcx_check_coupon',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userId'),
        goods_id: this.data.parameteData.goodsId,
        coupon_sn: coupon_sn,
      },
      success: data => {
        if (data.statusCode == '200') {
          this.setData({
            coupon_sn: coupon_sn,
            couponDiscount: data.result.discount
          })   
        }else{
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
  },

  
})