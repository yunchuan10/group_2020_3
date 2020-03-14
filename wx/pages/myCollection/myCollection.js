// pages/myCollection/myCollection.js
const util = require('../../utils/util.js')
const { ajax } = require('../../utils/ajax.js')//ajax 请求
var sectionData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionData: [],
    hidden:true,
    collectionTitle:true,
    newGoods:[],
    ifLoadMore : null,
    page : 1,//默认第一页
    defaultImg: '/img/my/default-teach.png'//默认图片
  },

  //请求收藏数据
  collectionData:function(success){
    var that = this;
    //从缓存中获取
    var uid = wx.getStorageSync('userId') || '';
    //ajax 请求
        ajax({
          method: "POST",
          url:'myCollect',
          data:{
              uid : uid,
              page: that.data.page,
              pageSize : 5
          },
          success:data =>{
            if (data.statusCode !== 200){
              return;
            }
            //将数据存储到一个变量中
            var collectionDatas = data.result ||[];
            
            if (that.data.ifLoadMore){
              if (collectionDatas.length > 0){
                //加载更多
                sectionData['newGoods'] = sectionData['newGoods'].concat(collectionDatas);
              } else {
                that.setData({
                  hidden: true,
                  collectionTitle: false,
                  ifLoadMore : false
                })
                  setTimeout(() => {
                    wx.showToast({
                      title: '暂无更多内容！',
                      icon: "loading",
                    });
                    setTimeout(() => {
                      wx.hideToast();
                    }, 2000)
                  }, 0);
              }
            
            }else{
              if (that.data.ifLoadMore == null){
                //刷新
                sectionData['newGoods'] = collectionDatas;
              }
            }
            that.setData({
              newGoods: sectionData['newGoods']
            });
            wx.stopPullDownRefresh();//结束动画
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
          }
        })
  },
  //点击相应的收藏跳转到相对应的收藏页面
  catchMyCollect:function(e){
    let data = e.currentTarget.dataset;
    if (data.sid == '1'){
      wx.navigateTo({
        url: '../course/course?courderId=' + data.id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    //请求收藏数据
    that.collectionData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数 上拉加载采用的是 调用方法 下拉刷新采取的是配置app.json与当前页面的JSON
   */
  onReachBottom: function () {
    var that = this;
    that.setData({
      ifLoadMore: true,
      page: that.data.page + 1,
    })
    //请求数据
    that.collectionData();
  },

  //图片加载失败
  errorFunction: function (e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var errorimgoutIndex = e.target.dataset.errorimgout //获取错误图片循环的下标
      var imgList = this.data.newGoods    　　　　　　　//将图片列表数据绑定到变量
      imgList[errorimgoutIndex].teaching_teacher[errorImgIndex].photoPath = this.data.defaultImg //错误图片替换为默认图片
      this.setData({
        newGoods: imgList
      })
    }
  }
})