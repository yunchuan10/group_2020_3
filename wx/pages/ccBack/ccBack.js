// pages/ccLive/ccLive.js

var cc = getApp().globalData.ccsdk;

const { ajax } = require('../../utils/ajax.js')
const { ccLiveData } = require('../../utils/ccLiveData.js');



Page({
  cc_def : {
    forbiddens:{},
    course_list: [],
    pageX: 0,

    uid: '',
    options: {},
    // 初次请求
    live_opt: {},
    // 页面和文档大小
    systemInfoSize: {},

    _interval: null,
    touchendDelay: null,
    timestamp: {},

    prinWidth: 1,
    moveWidth: 0,
    prinLeft: 0,
    progressActive: true,     // 是不是可以操作进度条  

    chart_list: [],       //聊天信息
    chart_time: null,

    start_time: ''

  },
  data: {
    hasForbid: false,

    max_drawing: false,
    title: '',
    renderer: false,
    x: 235,
    y: 15,
    talk_tab: 0,
    playerUrl: '',
    
    course_list: [],

    // 讨论列表
    talk_list: [],
    replay_type: 0,    // 0等待录播，1录播中，2录播结束

    toChat: "",
    drawingBoardHeight: '100%',
    drawingBoardTop: '0px',

    currentTime: 0,

    // 播放状态
    playState: "pause",
    time: {
      timeStamp: 0,
      play_t: '00:00:00'
    },
    duration: '00:00:00',
    Duration: 0,     // 总时长
    percent: 0,      // 播放进度
    percentLeft: 0,  // 播放位置
    percentW: 0,

    _stopInterval: false
    
    
  },

  onUnload: function () {
    this.setData({
      _stopInterval: true
    });
  },

  // bindTimeupdate: function (e) {
  //   if (e.detail.duration > 0 && this.isPristineDuration) {
  //     this.setData({
  //       max: e.detail.duration
  //     });
  //     this.isPristineDuration = false;
  //   }
  //   console.log(e, 333333)
  //   this.setData({
  //     time: e
  //   });
  // },



  onLoad: function (options) {
    // this.defInit();
    
    // console.log(options,'1111111111')
    let userId = wx.getStorageSync('userId') + '' || '';
    this.cc_def.options = options;
    this.cc_def.uid = userId;
    let self = this;
    // let ccUser = wx.getStorageSync('ccUser') || {};

    cc.replay.on('live_time_info',  (data) => {
      data && (this.cc_def.start_time = data.startTime||'');
    })

    // 视频位置初始化
    this.setLiveX();
    
    // 获取列表
    this.getCourseList(options);
    
  },

  backInit(opt, rec){
    var self = this;
    let ccUser = wx.getStorageSync('ccUser') || {};
    cc.replay.quit();
    if (/^[0-9]{1,}$/.test(ccUser.ccUserId)) {
      ccUser.ccUserId = ccUser.ccUserId + '·';
    }
    // ccUser.guid = (ccUser.guid+'').toLowerCase();
    
    //登录
    cc.replay.init({
      
      // roomId: "5E77FFFD476C46589C33DC5901307461",
      // recordId: "BF42146910D256A7",
      

      userId: ccUser.ccUserId || "5FEB4AFA25C70F3D",
      roomId: opt.roomid || "",
      recordId: rec||"",
      // viewername: "9051_id",
      // viewertoken: "1a1897c4-5a50-47d1-9bdb-9b9a57552899",
      // groupid: self.data.groupId,
      wx: wx,
      success: (res) => {
        console.log("登录成功回掉", res);
        cc.replay.play();
        this.videoContext = cc.replay.configPlayer(this, wx);
        this.setData({    
          replay_type: 1
        })
        // cc.replay.seek(0);  //初始位置
        this.setPrinSize();
        this.ccBackBind();
      },
      fail: function (res) {
        console.log("登录失败回掉", res);
        // self.hint(res.message);
      }
    });

  },

  // 滚动条宽度
  setPrinSize(){
    let self = this;
    // console.log(111111111111)
    setTimeout(()=>{
      var obj = wx.createSelectorQuery();
      obj.select('#loadingbar').boundingClientRect((rect) => {
        // console.log(rect,555)
        if (rect) {
          self.cc_def.prinWidth = rect.width;
          self.cc_def.prinLeft = rect.left;
        } else {
        }
      }).exec();
      obj.select('#circle-box').boundingClientRect(function (rect) {
        // console.log(rect)
        if (rect) {
          self.cc_def.moveWidth = rect.width;
        }
      }).exec();
    },200)
    
  },

  // 录播播放
  bindPlay(e){
    this.setData({    //播放中
      replay_type: 1,
      playState: "play"
    })
    // this.startInterval();
    cc.replay.listenerplay(e);
  },
  bindPause: function (e) {
    this.setData({
      playState: "pause"
    })
  },
  bindEnded: function (e) {
    this.setData({
      playState: "ended"
    })
    clearInterval(this.cc_def._interval);
    this.cc_def._interval = null;
    this.cc_def.timestamp = {};
    cc.replay.listenerended(e);
  },
  bindWaiting: function (e) {
    cc.replay.waiting(e);
  },
  startInterval: function () {
    var _this = this;
    clearInterval(this.cc_def._interval);
    this.cc_def._interval = null;
    this.cc_def.timestamp = {};
    this.cc_def._interval = setInterval(function () {
      _this.timeupdate();
    }, 999);
  },

  timeupdate(){
    var e = this.cc_def.timestamp||{};
    if (e.detail){
      cc.replay.timeupdate(e);
      this.currentTime = e.detail.currentTime;

      if (!this.cc_def._interval) {
        this.startInterval();
      }
    }
  },

  bindTimeupdate: function (e) {
    if (this.cc_def.progressActive) {    //滚动条可操作
      e = e||{};
      // console.log(e, e.detail.duration, this.data.Duration, this.data.duration,77777777777777)
      this.cc_def.timestamp = e||{};
      e.play_t = ccLiveData.formatSeconds(e.detail.currentTime)||'00:00:00';
      if (!this.data.Duration){
        this.setData({
          Duration: e.detail.duration,
          duration: ccLiveData.formatSeconds(e.detail.duration) || '00:00:00'
        })
      }
      this.setData({
        time: e
      });
    
      var _p = e.detail.currentTime / e.detail.duration;
      var _pw = (this.cc_def.prinWidth - this.cc_def.moveWidth) * _p / this.cc_def.prinWidth;
      // console.log(_p,_pw,5555555555)
      var percentW = (this.cc_def.prinWidth - this.cc_def.moveWidth) * _p + 'px';
      this.setData({
        percent: _p,
        percentLeft: _pw * 1,
        percentW
      })

    }
  },

  // 视频位置初始化
  setLiveX() {
    var systemInfo = wx.getSystemInfoSync();
    var sys_w = systemInfo.windowWidth;
    var x = sys_w * 2 / 3 - 15;
    this.cc_def.systemInfoSize.windowWidth = systemInfo.windowWidth;
    this.cc_def.systemInfoSize.windowHeight = systemInfo.windowHeight;
    this.setData({ x });
  },
  // 获取列表
  getCourseList(opt){
    this.videoContext = cc.replay.configPlayer(this, wx);
    let self = this;
    wx.showLoading({
      title: '加载中'
    })
    ajax({
      url: 'openClassRecord',
      method: 'post',
      loadShow: true,
      data: {
        uid: wx.getStorageSync('userId')||'',
        open_class_id: opt.goodsId||"",
        id: opt.id,
        online: 1       // 标记我上线了
      },
      success: data => {
        data.result = data.result || {};
        data.result.info = data.result.info || {};
        let chapter = data.result.info.chapter||[];
        let forbidden = data.result.forbidden || {};
        let forbiddenList = data.result.forbiddenList || {};    // 禁言列表
        this.cc_def.forbiddens = forbiddenList;
        this.setTalkList();
        this.setData({
          hasForbid: true
        })

        let live_opt = chapter.find( item=>(item.id==opt.id) )||{};
        live_opt.time = data.result.time*1;
        live_opt.end_time = live_opt.end_time.replace(/-/g, '/').split('.')[0];
        live_opt.start_time = live_opt.start_time.replace(/-/g, '/').split('.')[0];
        if (data.result.time - new Date(live_opt.end_time).getTime() / 1000 >= 0 ){  //录播结束了
          live_opt.live_type = 3;
        }
        live_opt.newEnd =  new Date(live_opt.end_time).getTime()/1000;
        live_opt.newStart = new Date(live_opt.start_time).getTime() / 1000;
        this.cc_def.live_opt = live_opt;

        let course_list = ccLiveData.chapterList(chapter, data.result.time, opt, this.data.live_type);
        this.setData({ course_list, title: live_opt.title||'' });
        // 加定时器
        this.cc_def.course_list = ccLiveData.listStateTimer(course_list, this);

        var record = (data.result.chapterInfo || {}).record||{};
        var recid = record.id||"";

        wx.hideLoading();
        if (recid) {  // cc
          this.backInit(opt, recid);
        }else{
          this.setData({
            replay_type: 2
          })
          wx.showToast({
            title: '回放视频上传中,请稍后进入重试',
            icon: 'none'
          }, 2500);
        }
        
      }
    })
  },

  // cc回放事件
  ccBackBind(){
    var self = this;
    // cc.replay.on('live_time_info', function (data) {
    //   console.log(data, 88888888888888888);
    // })

    cc.replay.on('pages_change_sync', function (data) {
      //console.log(data);
    })

    cc.replay.on("chat_msg_sync", function (data) {
      console.log(data, '聊天信息聊天信息聊天信息')

      data = data || [];
      self.cc_def.chart_list = self.cc_def.chart_list.concat(data); //合并聊天信息

    });

    cc.replay.on("pages_change_sync", (data) => {
      if (data) {
        this.cc_def.systemInfoSize.pageHeight = data.height;
        this.cc_def.systemInfoSize.pageWidth = data.width;
      }
    });

    this.setChartList();    // 渲染列表
    
  },

  // 设置cc聊天消息
  setChartList(){
    let self = this;
    clearTimeout(this.cc_def.chart_time);
    this.cc_def.chart_time = setTimeout(()=>{
      if (self.data.talk_list.length < this.cc_def.chart_list.length){   //有新消息
        var data_list = this.cc_def.chart_list.map(item => {
          return ccLiveData.chartMsg(item, this.cc_def.start_time, this.cc_def.forbiddens);
        })
        console.log(data_list,999999999999)
        self.setData({
          talk_list: data_list
        })
        self.setData({
          toChat: "lastChat"
        })
      }
      self.setChartList();
    },1000)
  },

  // 重写讨论列表
  setTalkList() {
    let talk_lists = this.data.talk_list || [];
    // console.log(this.data, talk_lists, 55555555555)
    if (talk_lists.length > 0) {

      talk_lists = talk_lists.map(item => {
        return ccLiveData.setTalkShow(item, cc_def.forbiddens);
      })
      this.setData({
        talk_list: talk_lists
      })
      this.setData({
        toChat: "lastChat"
      });
    }
  },

  

  onHide: function () {
    cc.replay.quit();
    clearInterval(this.cc_def._interval);
    clearTimeout(this.cc_def.touchendDelay);
    ccLiveData.clearListTimer(this.cc_def.course_list);
  },



// ---------------------------------事件绑定--------------------------------------

  proTouchSart(e){
    console.log(e,77777777)
    if (!this.cc_def.progressActive || !this.cc_def.moveWidth || !this.data.replay_type){    //滚动条初始化
      return;
    }
    this.cc_def.progressActive = false;
    const pageX = (e.changedTouches[0] || {})['pageX'];
    this.cc_def.pageX = pageX;

  },

  proTouchEnd(){
    console.log(111111111111111111)
    if (this.cc_def.progressActive || !this.cc_def.moveWidth || !this.data.replay_type) {    //滚动条初始化
      return;
    }
    var self = this;
    clearTimeout(this.cc_def.touchendDelay);
    this.cc_def.touchendDelay = setTimeout( ()=> {
      this.cc_def.progressActive = true;
      var s = parseFloat(self.data.percent) * this.data.Duration;
      console.log(s,999999999);
      cc.replay.seek(s);
      if (this.data.playState == 'play') {
        cc.replay.play();
      }
    }, 1200);
  },

  proTouchMove(e){
    console.log(e, 88888888888888)
    if (this.cc_def.progressActive|| !this.cc_def.moveWidth || !this.data.replay_type) {    //滚动条初始化
      return;
    }
    // clearTimeout(this.cc_def.touchendDelay);
    var getParcent = this._getParcent(e);
    // console.log(getParcent,9999);
    var percentW = (this.cc_def.prinWidth - this.cc_def.moveWidth) * getParcent.percent+'px';
    this.setData({
      percent: getParcent.percent,
      percentLeft: getParcent.percentLeft,
      percentW
    });
    clearTimeout(this.cc_def.touchendDelay);
    this.cc_def.touchendDelay = setTimeout(() => {
      this.proTouchEnd();
    }, 2000);
  },
  _getParcent: function (e) {
    const pageX = (e.changedTouches[0] || {})['pageX'];
    var nowX = pageX - this.cc_def.prinLeft;
    var width = this.cc_def.prinWidth - this.cc_def.moveWidth;
    nowX = nowX > width ? width : nowX;
    var percent = (nowX / width) * 1;
    percent = percent < 0 ? 0 : percent;
    var percentLeft = (nowX / this.cc_def.prinWidth) * 1;
    percentLeft = percentLeft < 0 ? 0 : percentLeft;
    return {
      percent,
      percentLeft,
    };
  },

  // _getParcent: function (e) {
  //   var pageX = e.touches[0].pageX;
  //   var offsetLeft = e.currentTarget.offsetLeft;
  //   var nowX = pageX - offsetLeft;
  //   var width = this.cc_def.prinWidth-this.cc_def.moveWidth;
  //   nowX = nowX > width ? width : nowX;
  //   var percent = (nowX / width) * 1;
  //   percent = percent < 0 ? 0 : percent;
  //   var percentLeft = (nowX / this.cc_def.prinWidth) * 1;
  //   percentLeft = percentLeft < 0 ? 0 : percentLeft;
  //   return {
  //     percent,
  //     percentLeft,
  //   };
  // },

  catchPlay(){
    if (this.data.playState=='play'){
      cc.replay.pause();
    }else{
      cc.replay.play();
    }
  },

  // tab切换
  talkTabSec(e){
    const talk_tab = e.target.dataset.sec||0;
    this.setData({
      talk_tab
    });
  },

  // 文档全屏
  maxDrawing(e){
    if (!this.cc_def.systemInfoSize.pageHeight){
      return;
    }

    let max_drawing = !!e.currentTarget.dataset.max;
    this.setData({
      max_drawing
    })
    this.alignCenter();
  },

  alignCenter: function () {
    var height = this.cc_def.systemInfoSize.windowWidth * this.cc_def.systemInfoSize.pageHeight / this.cc_def.systemInfoSize.pageWidth;
    var top = (this.cc_def.systemInfoSize.windowHeight / 2) - (height / 2);
    // console.log(this.cc_def.systemInfoSize,height,top);
    this.setData({
      drawingBoardHeight: height.toFixed(2) + "px",
      drawingBoardTop: 0
    });
    if (height >= this.cc_def.systemInfoSize.windowHeight) {
      return;
    }
    this.setData({
      drawingBoardTop: top*.8 + "px"
    });
  },

  courseLive(e) {
    const id = e.currentTarget.dataset.id * 1 || 0;
    const opt = this.cc_def.options||{};
    if ( id == opt.id) {
      return;
    }
    cc.live.quit();
    wx.redirectTo({
      url: '../liveAply/liveAply?id=' + id + '&roomid=' + opt.roomid + '&goodsId=' + opt.goodsId
    })
  }








})