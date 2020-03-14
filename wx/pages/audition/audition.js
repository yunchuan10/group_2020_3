
const { ajax } = require('../../utils/ajax.js')

Page({

  data: {
    list: [],

    currentIndex: -1,
    currentSrc: '',

    id: '',
    goods_id: '',

    slide_type: 1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id * 1 || -1,
      goods_id: options.goods_id * 1 || -1
    })
  },
  onShow: function () {
    this.getList();
  },
  
  // 请求数据
  getList: function () {
    wx.showLoading({
      title: '加载中'
    })

    ajax({
      url: 'tryLesson',
      method: 'post',
      data: {
        goods_id: this.data.goods_id
      },
      success: data => {
        const list = data.result||[];
        const currentOpt = list.find(item => (item.id == this.data.id))||{};
        const currentIndex = list.findIndex(item => (item.id == this.data.id));
        const currentSrc = currentOpt.aliyun||'';
        // console.log(currentIndex, currentSrc)
        this.setData({
          list,
          currentSrc,
          currentIndex
        }, function(){
          if (!currentSrc) {
            wx.showToast({
              title: '此视频暂时无法播放',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },

  // 列表展开收起
  listSlide: function(){
    console.log(this.data.slide_type,11111)
    let slide_type = this.data.slide_type;
    slide_type = slide_type==1? 2:1;
    this.setData({
      slide_type: slide_type
    })
  },

  // 视频选择
  listCheck(d){
    if( this.data.list.length>0 ){
      const index = d.currentTarget.dataset.index;
      const opt = this.data.list[index]||{};
      // console.log(opt)
      if (!opt.aliyun) {
        wx.showToast({
          title: '此视频暂时无法播放',
          icon: 'none',
          duration: 2000
        })
      }else{
        wx.hideToast();
      }
      this.setData({
        currentSrc: opt.aliyun || '',
        currentIndex: index
      })
    }
  }
  
})