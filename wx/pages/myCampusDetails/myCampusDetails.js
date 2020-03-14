// pages/myCampusDetails/myCampusDetails.js
const { ajax } = require('../../utils/ajax.js')//ajax 请求

Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin:0,
    nextMargin: -200,
    campusSchool:'',
    imgArr:[],
    serviceArr:[],
    phonecall:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取URL中想以参数
    let _Id = options.Id;
    //获取当前用户经纬度
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        let latitude = res.latitude+'';
        let longitude = res.longitude+'';
        //加载相应的数据
        that.getMessage(_Id, latitude, longitude)
      },
      fail(err) {
        setTimeout(() => {
          wx.showToast({
            title: '获取位置失败!请打开GPS',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 3000)
        }, 1000);
        let latitude =  '';
        let longitude =  '';
        that.getMessage(_Id,latitude, longitude)
      }
    })
   
  },
  // 点击事件拉起打电话
  phonecallevent: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phonecall+'' 
    })
  },
  // 地图导航
  bindNavigationMap: function (e){
    const { coordinate, name, address } = e.currentTarget.dataset;
    let [latitude, longitude] = coordinate.split(",");
    // wx.getLocation({
    //   type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
    //   success(res) {
        wx.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          scale: 18,
          name,
          address
        })
    //   }
    // })
  },
  //获取后台信息
  getMessage: function (_Id, _longitudeCampus, _latitudeCampus){
    ajax({
      method: "POST",
      url: 'detailsCampus',
      data: {
        id: _Id,
        latitude: _longitudeCampus,
        longitude: _latitudeCampus
      },
      success: data => {
        if (data.statusCode == 200) {//userID参数为空
          this.setData({
            campusSchool: data.result.campus,
            imgArr: data.result.img,
            phonecall: data.result.campus.phone,
            serviceArr: data.result.introduce
          })
        }
      },
      fail: res => {
        setTimeout(() => {
          wx.showToast({
            title: '网络异常,刷新重试!',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 右上角转发
    wx.hideShareMenu()
  },

})