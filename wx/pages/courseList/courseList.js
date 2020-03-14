
const courseListOpts = {
  '3': '本科',
  '2': '专科',
  '4': '专本连读',
  '5': '研究生',
  '15': '成人教育',
  '16': '资格考试',
  '24': '教师资格',
  '208': '配套教材'
}

const {ajax} = require('../../utils/ajax.js')

Page({

  data: {

    id: 0,
    catid: 0,
    pageIndex: 1,
    hasMoreList: true,

    navFixed: false,
    navFixedHeight: 0,
    index_:0,

    // 列表数据
    courseLists: [],
    defaultImg: '/img/my/default-teach.png',//默认图片
    // 列表数据筛选项
    courseListSelect: [
      {
        text: '全部',
        url: '',
        sec: 'sec'
      },
      {
        text: '远程高中',
        url: ''
      },
      {
        text: '远程中专',
        url: ''
      },
      {
        text: '成人高考',
        url: ''
      },
      {
        text: '远程高专连读',
        url: ''
      },
      {
        text: '远程高专本连读',
        url: ''
      }
    ]

  },

  onLoad: function (options) {
    const this_title = courseListOpts[options.id+''];
    this.setData({
      id: options.id*1||0,
      catid: options.catid * 1 || 0
    })
    if (this_title){
      wx.setNavigationBarTitle({
        title: this_title
      })
    }
  },

  onShow: function (options) {
    // 右上角转发
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      pageIndex: 1,
      courseLists: [],
      hasMoreList: true,
      navFixed: false
    })
    this.getList();
  },

  // 请求数据
  getList: function (_index){
    const id = this.data.id;
    const catid = this.data.catid;
    const pageIndex = this.data.pageIndex;
    const courseLists = this.data.courseLists || [];
    const courseListSelect = this.data.courseListSelect||[];
    ajax({
      url: 'index',
      method: 'post',
      data: {
        topCategory: id,
        secCategory: catid,
        page: pageIndex,
        pageSize: 10,
        uid: wx.getStorageSync('userId') || ''
      },
      success: data => {
        const res = data.result || {};
        const totalPage = res.totalPage*1;

        if (res.goodsList && res.goodsList.length>0 ){
          this.setData({
            courseLists: courseLists.concat(res.goodsList)
          })

        }

        if (pageIndex >= totalPage && (courseLists.length > 0 || res.goodsList.length>0) ) {
          this.setData({
            hasMoreList: false
          })
        }

        if (courseListSelect && courseListSelect.length>0 ){  //导航
          let category = res.category||[];
          // category.unshift({
          //   cat_id: 0,
          //   cat_name: '全部'
          // })
          category = category.map( (item,index)=> ({
              cat_name: item.cat_name,
              id: id,
              cat_id:item.cat_id,
              indx:index
            })
          )
          let that = this;
          this.setData({
            courseListSelect: category,
            // index_: _index || 0
          }, function(){

            wx.createSelectorQuery().select('.js-list-selects').boundingClientRect(function (rect) {
              that.setData({
                navFixedHeight: rect.height + 'px',
                navFixed: true
              })
            }).exec();
          })
        }
        
        // wx.hideLoading();
        this.setData({
          pageIndex: pageIndex + 1
        })
      }
    })
  },



  // 下拉刷新index
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    if (this.data.hasMoreList ){
      wx.showLoading({
        title: '加载中'
      })
      this.getList();
    }
  },
  //改变下面列表内容
  changContent:function(e){
    let id = e.currentTarget.dataset.id;
    let catid = e.currentTarget.dataset.idcat;
    let _index = e.currentTarget.dataset.index;
    this.setData({
      courseLists: [],
      id:id,
      catid: catid,
      pageIndex:1,
      hasMoreList: true,
      index_: _index
    })
    this.getList(_index)
   

   
  },
  //图片加载失败
  errorFunction: function (e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var errorimgoutIndex = e.target.dataset.errorimgout //获取错误图片循环的下标
      var imgList = this.data.courseLists    　　　　　　　//将图片列表数据绑定到变量
      imgList[errorimgoutIndex].teaching_teacher[errorImgIndex].photoPath = this.data.defaultImg 
      
      //错误图片替换为默认图片
      this.setData({
        courseLists: imgList
      })
      
    }
    
  }


})