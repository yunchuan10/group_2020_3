// pages/ccLive/ccLive.js

var cc = getApp().globalData.ccsdk;

const { ajax } = require('../../utils/ajax.js')
const { ccLiveData } = require('../../utils/ccLiveData.js');

let cc_def = {
  uid: '',
  options: {},
  // 初次请求
  live_opt: {},
  // 开始倒计时
  live_timer: null,
  video_timer: null,
  // 直播开始时间
  live_start: '',
  // 页面和文档大小
  systemInfoSize:{},

  course_list: [],     // 列表加定时器


  talk_list: [],
  forbiddens: {},     // 禁言集合
  


}


Page({

  data: {
    can_talk: false,    // 是否禁言
    hasForbid: false,   //初始化得到禁言状态
    
    max_drawing: false,
    title: '',

    x: 235,
    y: 15,
    talk_tab: 0,
    playerUrl: '',
    
    course_list: [],

    // 讨论列表
    talk_list: [],
    live_type: -1,    // 0等待直播，1直播中，2直播结束

    toChat: "",

    face_show: false,
    chatMsg: '',
    // 倒计时
    live_t: '',

    drawingBoardHeight: '100%',
    drawingBoardTop: '0px',

    video_set: false,

  },

  onLoad: function (options) {
    console.log(options,'1111111111')
    let userId = wx.getStorageSync('userId') + '' || '';
    cc_def.options = options;
    cc_def.uid = userId;
    let self = this;
    // let ccUser = wx.getStorageSync('ccUser') || {};

    
    // 视频位置初始化
    this.setLiveX();
    // cc
    this.liveInit(options);
    // cc初始化
    this.ccLiveBind(options);
    // 获取列表
    this.getCourseList(options);
    
  },



  liveInit(opt){
    let ccUser = wx.getStorageSync('ccUser') || {};
    cc.live.quit();
    
    if (/^[0-9]{1,}$/.test(ccUser.userName)) {
      ccUser.userName = ccUser.userName + '·';
    }
    ccUser.guid = (ccUser.guid+'').toLowerCase();
    cc.live.init({
      password: 'qwertyu', //liveid
      roomId: opt.roomid||"",
      userId: ccUser.ccUserId||"5FEB4AFA25C70F3D",
      userName: ccUser.userName||'',
      viewercustomua: "w-1_" + cc_def.uid,  //guid
      wx: wx,
      success: (data) => {
        console.log("登录成功回掉", data, 111);
      },
      fail: function (res) {
        console.log("登录失败回掉", res, 222);
      }
    });

  },

  // 视频位置初始化
  setLiveX() {
    var systemInfo = wx.getSystemInfoSync();
    var sys_w = systemInfo.windowWidth;
    var x = sys_w * 2 / 3 - 15;
    cc_def.systemInfoSize.windowWidth = systemInfo.windowWidth;
    cc_def.systemInfoSize.windowHeight = systemInfo.windowHeight;
    this.setData({ x });
  },
  // 获取列表
  getCourseList(opt){
    let self = this;
    wx.showLoading({
      title: '加载中'
    })
    ajax({
      url: 'openClassRecord',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userId')||'',
        open_class_id: opt.goodsId||"",
        id: opt.id,
        online: 1       // 标记我上线了
      },
      success: data => {
        data.result = data.result||{};
        data.result.info = data.result.info||{};
        let chapter = data.result.info.chapter||[];
        let forbidden = data.result.forbidden||{};
        let forbiddenList = data.result.forbiddenList || {};    // 禁言列表
        cc_def.forbiddens = forbiddenList;
        this.setTalkList();   // 重写列表
        this.setData({
          hasForbid: true
        })
        
        if ( forbidden.status!=1 ){   // 不是禁言状态
          this.setData({
            can_talk: true
          })
        }

        let live_opt = chapter.find( item=>(item.id==opt.id) )||{};
        live_opt.time = data.result.time*1;
        live_opt.end_time = live_opt.end_time.replace(/-/g, '/').split('.')[0];
        live_opt.start_time = live_opt.start_time.replace(/-/g, '/').split('.')[0];

        if (data.result.time - new Date(live_opt.end_time).getTime() / 1000 >= 0 ){  //直播结束了
          live_opt.live_type = 3;
        }
        live_opt.newEnd =  new Date(live_opt.end_time).getTime()/1000;
        live_opt.newStart = new Date(live_opt.start_time).getTime() / 1000;
        cc_def.live_opt = live_opt;
        
        let course_list = ccLiveData.chapterList(chapter, data.result.time, opt, this.data.live_type);
        // console.log(course_list, 99999999)
        this.setData({ course_list, title: live_opt.title||'' });

        // 加定时器
        cc_def.course_list = ccLiveData.listStateTimer(course_list, this);        
        

        if (this.data.live_type==-1){  // 还未直播初始化
          // console.log(222222222222, this.data.live_type, cc_def.live_opt.time, cc_def.live_opt.newStart)
          if (cc_def.live_opt.time < cc_def.live_opt.newStart) {  //未开始
            console.log(11111111)
            self.setData({
              live_type: 0
            })
            self.liveTimer(-cc_def.live_opt.time + cc_def.live_opt.newStart); //直播倒计时
          } else if (cc_def.live_opt.time > cc_def.live_opt.newEnd) {  //已经结束
            console.log(222222222222)
            self.setData({
              live_type: 2
            })
          } else {
            console.log(3333333)
            // 在直播时间又没开直播
            self.setData({
              live_type: 0
            })
          }
          cc_def.video_timer = setTimeout(() => {
            var video_set = this.data.video_set || true;
            this.setData({
              video_set: video_set 
            })
          }, 500)
        }

      },
      fail() {
        cc_def.video_timer = setTimeout(() => {
          var video_set = this.data.video_set || true;
          this.setData({
            video_set: video_set 
          })
        }, 500)
      }

    })
  },

  ccLiveBind(){
    
    console.log('ccLiveBindccLiveBindccLiveBindccLiveBind')
    let self = this;
    let chat_log = false;

    //初始化player播放器
    this.ctx = cc.live.configLivePlayer(this, wx);

    //模版信息
    // cc.live.on("template_info", function (data) {
    //   console.log(data, 9797)
    // });

    // 广播
    cc.live.on("custom_message", (data) => {
        data = JSON.parse(data);
        if (typeof data.message == 'string'){
          data.message = JSON.parse(data.message);
        }
        console.log(data, cc_def.uid, '广播')
        if (data.message.type == 4){  //解除禁言
          
          let uid = data.message.studentId || '';
          // console.log(uid, uid == cc_def.uid, 66666666666)
          if(uid==cc_def.uid){  // 解除我的禁言
            this.setData({
              can_talk: true
            })
          }
        } else if (data.message.type == 3){ //禁言
          let uid = data.message.studentId || '';
          let time = data.message.time || 0;
          // console.log(uid, uid == cc_def.uid, 66666666666)
          if (uid == cc_def.uid) {  // 我的禁言
            this.setData({
              can_talk: false
            })
          }
          cc_def.forbiddens[uid] = time;
          this.setTalkList();
        }
    });
    
    // 获取直播开始时间
    cc.live.on("live_time_info",  (data) => {
      console.log(data, '直播开始时间');
      const liveStartTime = data.liveStartTime||'';
      if (liveStartTime){
        cc_def.live_start = liveStartTime;
        this.liveStart();
      }
    });
    
    // 直播开始
    cc.live.on("publish_stream", (data) => {
      console.log('直播开始');
      let opt = cc_def.options;
      // let live_redire = wx.getStorageSync('live_redire')||{};
      // if ( live_redire.roomid == cc_def.options.roomid ){ //当前直播存储过

      // }

      // this.liveStart();
      wx.redirectTo({   // 重新认证解决开始不能播放问题
        url: '../liveAply/liveAply?id=' + opt.id + '&goodsId=' + opt.goodsId
      })
      
    });

    // 直播结束
    cc.live.on("end_stream", (data) => {
      console.log('直播结束');
      self.setData({
        live_type: 2
      })
      cc_def.video_timer = setTimeout(() => {
        this.setData({
          video_set: 2
        })
      }, 200)
    });

    // 是否直播开始 
    cc.live.on("isPublishing_log", (data) => {
      console.log(data,  '是否直播中')
      if( data==1 ){    //直播中
        this.liveStart();
      }else{
        
      }
    });

    // 接收公聊
    cc.live.on("chat_message", (msg)=>{
      let talk_list = this.data.talk_list || [];

      let data_list = [];
      data_list.push(ccLiveData.chartMsg(JSON.parse(msg), cc_def.live_start, cc_def.forbiddens));
      talk_list = [...talk_list, ...data_list];
      this.setData({
        talk_list
      });
      this.setData({
        toChat: "lastChat"
      });
      console.log(talk_list, '接收公聊');
    })

    //历史聊天信息
    cc.live.on("chat_log", (data) => {
      if (!chat_log){
        chat_log = true;
        var data_list = data.map( item=>{
          return ccLiveData.chartMsg(item, cc_def.live_start, cc_def.forbiddens);
        })
        let talk_list = this.data.talk_list||[];
        talk_list = [...talk_list, ...data_list];
        this.setData({
          talk_list: talk_list
        });
        this.setData({
          toChat: "lastChat"
        });
        console.log(talk_list, '历史聊天信息');
      }
    })

    //历史文档页
    cc.live.on("page_change_log", function (data) {
      // console.log(data,3333)
      if ( data ){
        cc_def.systemInfoSize.pageHeight = data.height;
        cc_def.systemInfoSize.pageWidth = data.width;
      }
    });

  },


  // 禁言状态改变后重写讨论列表
  setTalkList(){

    let talk_lists = this.data.talk_list||[];
    console.log(this.data,talk_lists,55555555555)
    if (talk_lists.length>0){

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


  liveStart(){
    this.setData({
      live_type: 1
    })
    cc_def.video_timer = setTimeout(() => {
      this.setData({
        video_set: 2
      })
    }, 200)
  },

  //如果直播推流断网，小程序live-player会自动重联一定次数不再播放，调用replay重新尝试播放
  replay: function (e) {
    if (e.detail.code === -2301 && this.ctx && this.ctx.domId) {
      //重新播放
      this.ctx.play({
        success: function (res) {
          console.log("play success", res);
        },
        fail: function (res) {
          console.log("play fail", res);
        }
      });
    }
  },

  

  onHide: function () {
    cc.live.quit();
    clearTimeout(cc_def.live_timer);
    clearTimeout(cc_def.video_timer);
    ccLiveData.clearListTimer(cc_def.course_list);
  },



// ---------------------------------事件绑定--------------------------------------



  // tab切换
  talkTabSec(e){
    const talk_tab = e.target.dataset.sec||0;
    this.setData({
      talk_tab
    });
  },

  // 发送聊天
  msgSend(){

    if ( !this.data.can_talk ){  //禁言中
      return;
    }

    if (this.data.live_type == 1){
      var chatMsg = this.data.chatMsg.trim();
      if (chatMsg) {    //直播中
          cc.live.sendPublicChatMsg(chatMsg);
        // if ( cc.live.sendPublicChatMsg(chatMsg) ) {
          this.setData({
            chatMsg: ''
          })
        // }
      }else{
        wx.showToast({
          title: '请输入发送内容',
          icon: 'none'
        }, 2000);
      }
    }else{
      wx.showToast({
        title: '请在直播期间发消息',
        icon: 'none'
      }, 2000);
    }
    
  },

  // 表情控制
  faceShow(e){
    if (e.currentTarget.dataset.show == 1){
      this.setData({
        face_show: true
      })
    }else{
      this.setData({
        face_show: false
      })
    }
  },

  // 添加表情
  addEmoj(e){
    const emoj = '[em2_'+ e.target.dataset.emoj +']';
    this.setData({
      chatMsg: this.data.chatMsg+emoj
    })
  },

  //输入聊天信息
  bindChatInput: function (e) {
    var msg = e.detail.value;
    this.setData({
      chatMsg: msg
    });
  },

  // 直播倒计时
  liveTimer(time){
    clearTimeout( cc_def.live_timer );
    let t = ccLiveData.getLiveTime(time);
    this.setData({
      live_t: t
    })
    time--;
    if (time >= 0 && this.data.live_type==0){
      cc_def.live_timer = setTimeout(() => {
        this.liveTimer(time);
      },1000)
    }
  },

  // 文档全屏
  maxDrawing(e){
    let max_drawing = !!e.currentTarget.dataset.max;
    this.setData({
      max_drawing
    })
    this.alignCenter();
  },

  alignCenter: function () {
    var height = cc_def.systemInfoSize.windowWidth * cc_def.systemInfoSize.pageHeight / cc_def.systemInfoSize.pageWidth;
    var top = (cc_def.systemInfoSize.windowHeight / 2) - (height / 2);
    // console.log(cc_def.systemInfoSize,height,top);
    this.setData({
      drawingBoardHeight: height.toFixed(2) + "px",
      drawingBoardTop: 0
    });
    if (height >= cc_def.systemInfoSize.windowHeight) {
      return;
    }
    this.setData({
      drawingBoardTop: top*.8 + "px"
    });
  },

  courseLive(e){
    const id = e.currentTarget.dataset.id*1||0;
    const opt = cc_def.options;
    if(id==opt.id){
      return;
    }
    cc.live.quit();
    wx.redirectTo({
      url: '../liveAply/liveAply?id=' + id + '&roomid=' + opt.roomid + '&goodsId=' + opt.goodsId
    })
  }






})