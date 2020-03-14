//index.js
//获取应用实例
const app = getApp();
const { ajax } = require('../../utils/ajax.js');
const { base64src } = require('../../utils/base64src.js');
Page({
  data: {
    userId: '', // 用户id
    goodsId: '', // 课程id
    courseData: {},  // 总课程详情
    courseInfo:{}, // 课程详情
    courseRecommend: [], // 为您推荐
    teacherInfo: {}, // 老师列表
    chapter:[], // 公开课列表
    showShare: false, // 底部分享弹出框
    base64ImgUrl: '', // 分享小程序二维码
    userPhone: '', // 缓存-用户手机号
    filePathImg: '', // 课程详情临时存储地址
    fileAvatarUrl: '', // 头像
    nickName:'', // 微信昵称

    fileCodeImg:'../../img/course/code-img.png', // 图片底部说明
    liveState:'0', // 课程是否直播中
    scrollLeft:'0', // 直播中的课程详情
    lookBackState: '2', // 是否全部直播结束。2直播全部结束
    chapterIndex:'', // 课程章节是否有直播中课程
    userInfo: {}, // 用户信息
    // 手机号板顶弹出框
    phoneState: true, // 验证手机号验证码弹出框
    // 生成图片
    hidden: true,    
    // 授权绑定手机号
    phoneCodeState: false, // 验证码和友情提示切换
    sendmsg: true,
    getmsg: "发送",
    inputPhone: '', // 输入框手机号码
    // 点击章节数据
    chapterParameter: {},
  },

/**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let goodsId = '';
    if (options.scene) {
      goodsId = decodeURIComponent(options.scene);
    } else {
      goodsId = options.courderId
    }
    this.setData({
      goodsId: goodsId,
    })
  },

  // 页面隐藏/切入后台时触发，清除定时器和图片文件
  onHide() {
    let chapter = this.data.chapter;
    chapter.map((item, index) => {
      clearTimeout(item.time_id);
    });
    const fsm = wx.getFileSystemManager();
    // 删除二维码
    if (this.data.base64ImgUrl) {
      fsm.unlink({
        filePath: this.data.base64ImgUrl,
        success: res => {
          console.log(res);
        },
        fail: res => {
          console.log(res);
        },
      });
    }
    // 删除头像
    if (this.data.fileAvatarUrl) {
      fsm.unlink({
        filePath: this.data.fileAvatarUrl,
        success: res => {
          console.log(res);
        },
        fail: res => {
          console.log(res);
        },
      });
    }
  },
  // 页面卸载时触发,清除定时器和图片文件
  onUnload() {
    let chapter = this.data.chapter;
    chapter.map((item, index) => {
      clearTimeout(item.time_id);
    });
    const fsm = wx.getFileSystemManager();
    // 删除二维码
    if (this.data.base64ImgUrl){
      fsm.unlink({
        filePath: this.data.base64ImgUrl,
        success: res => {
          console.log(res);
        },
        fail: res => {
          console.log(res);
        },
      });
    }
    // 删除头像
    if (this.data.fileAvatarUrl){
      fsm.unlink({
        filePath: this.data.fileAvatarUrl,
        success: res => {
          console.log(res);
        },
        fail: res => {
          console.log(res);
        },
      });
    }
  },

// 开始画图
createdCode: function(res){
  let that = this;
  const detail = this.data.courseInfo; // 课程信息
  const ctx = wx.createCanvasContext('shareImg');
  let name = detail.title.toString().substring(0,25);     //绘图的标题
  let pichName = that.data.nickName || '';  //用户昵称
  // 背景颜色
  ctx.setFillStyle('#fff');
  ctx.fillRect(0, 0, 713, 880);
  /* 课程标题 */
  ctx.setTextAlign('left');                      //  位置
  ctx.setFillStyle('#000');                      //  颜色
  ctx.setFontSize(40);                           //  字号
  // ctx.fillText(name,40, 430);                 //  内容
  const nameWidth = ctx.measureText(name).width;
  // 标题换行
  that.wordsWrap(ctx, name, nameWidth, 550, 40, 430, 60); 
  /* 昵称 */
  ctx.setTextAlign('left');                      //  位置
  ctx.setFillStyle('#111');                      //  颜色
  ctx.setFontSize(32);                           //  字号
  ctx.fillText(pichName, 145, 610);       
  // 课程推荐
  ctx.setFontSize(27);  
  ctx.setFillStyle('#333')
  ctx.fillText('这是一门很棒的课程', 40, 685); 
  ctx.fillText('想推荐给你', 40, 725); 
  // 长按识别二维码查看课程详情
  ctx.drawImage(res[0], 0, 0, 613, 343); // 课程详情图片
  ctx.drawImage(that.data.fileCodeImg, 40, 820,515,20);
  // 渲染图片
  ctx.drawImage(res[2], 370, 545, 200, 200); // 推广二维码
  // 头像
  // ctx.drawImage(res[1], 40, 570, 60, 60);  // 微信头像
  // ctx.restore()
  // ctx.draw()
  // 圆形头像
  ctx.save();
  ctx.beginPath();
  ctx.arc(80, 600, 40, 0, 2 * Math.PI)
  ctx.stroke();
  ctx.setStrokeStyle('#ffffff')
  ctx.clip();
  ctx.setFillStyle('#ffffff');
  ctx.fill()
  ctx.drawImage(res[1], 30, 548, 100, 100);  // 微信头像
  ctx.restore();
  ctx.draw();
},

/**
 * 生成分享图
*/
share: function () {
  let that = this;
  let courseInfo = that.data.courseInfo;
  wx.showLoading({
    title: '图片生成中...'
  })
  // 底部分享弹出框隐藏
  that.setData({
    showShare: false,
  })
  // 课程图片临时存储
  let promise1 = new Promise(function (resolve, reject) {
    wx.downloadFile({
      url: 'https:' + courseInfo.big_img,
      success: res => {
        if (res.statusCode === 200) {
          that.setData({
            filePathImg: res.tempFilePath //将下载下来的地址给data中的变量变量
          });
          resolve(res.tempFilePath);
        }
      }, fail: res => {
        console.log(res);
      }
    });
  });

  /* 图片获取成功才执行后续代码 */
  Promise.all(
    [promise1, that.getUserAvatar(), that.getWxCode()]
  ).then(res => {
    // 画布
    that.createdCode(res);
    // 将生成的canvas图片，转为真实图片
    setTimeout(()=>{
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 613,
        height: 880,
        destWidth: 613,
        destHeight: 880,
        canvasId: 'shareImg',
        success: function (res) {
          that.setData({
            prurl: res.tempFilePath,
            hidden: false,
          })
         wx.hideLoading();
        },
        fail: function (res) {
          console.log(res)
        }
    })
    }, 100)
  })

  },

  //文字换行处理
  // canvas 标题超出换行处理
  wordsWrap(ctx, name, nameWidth, maxWidth, startX, srartY, wordsHight) {
    let lineWidth = 0;
    let lastSubStrIndex = 0;
    for (let i = 0; i < name.length; i++) {
      lineWidth += ctx.measureText(name[i]).width;
      if (lineWidth > maxWidth) {
        ctx.fillText(name.substring(lastSubStrIndex, i), startX, srartY);
        srartY += wordsHight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == name.length - 1) {
        ctx.fillText(name.substring(lastSubStrIndex, i + 1), startX, srartY);
      }
    }
  },

  /**
   * 保存到相册
  */
  save: function () {
    let that = this;
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showToast({
          title: '图片已保存到相册',
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          that.setData({
            hidden: true
          })
        }, 1500);
      }
    })
  },
  
  onShow: function () {
    wx.showLoading({
      title: '加载中'
    })

    // 右上角转发
    wx.showShareMenu({
      withShareTicket: true,
    })
    let nickName = '';
    if (app.globalData.userInfo && app.globalData.userInfo.nickName){
      nickName = app.globalData.userInfo.nickName
    }
    this.setData({
      userId: wx.getStorageSync('userId'),
      openId: wx.getStorageSync('openid'),
      userPhone: wx.getStorageSync('userPhone'),
      userInfo: app.globalData.userInfo,
      lookBackState: '2',
      nickName: nickName,
    })
    // 获取公开课详情
    this.getOpenClassInfo();
  },

  // 获取公开课详情
  getOpenClassInfo: function(){
    let that = this;
    // 获取课程详情
    ajax({
      url: 'openClassInfo',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userId'),
        id: this.data.goodsId,
      },
      success: data => {
        if (data.statusCode == '200') {
          let res = data.result || {};
          // ccUser
          let ccUser = wx.getStorageSync('ccUser');  
          // ccUser
          wx.setStorage({
            key: 'ccUser',
            data: {
              ccUserId: res.CCUserId,
              userName: this.data.nickName,
              guid: ccUser.guid,
            },
          })
          // 图文介绍 去除img里面style属性  
          if (res.info.introduce.length > 0) {
            let newContent = res.info.introduce.replace(/<img[^>]*>/gi, function (match, capture) {
              var match = match.replace(/style\s{0,}=\s{0,}(\"|\')([^(\"|\')]*)(\"|\')/gi, 'class="course-about-img"');
              return match;
            });
            res.info.introduce = newContent
          }
          let chapter = res.info.chapter;
          // 直播开始和直播结束转化为时间戳
          chapter.map((item, index) => {
            let chapter_state = '';
            let t;
            item.start_stampTime = Math.round(new Date(item.start_time.replace(/-/g, "/")) / 1000).toString(); // 开始时间戳
            item.end_stampTime = Math.round(new Date(item.end_time.replace(/-/g, "/")) / 1000).toString(); // 结束时间戳
            // 0是未开始，1是直播中，2是直播结束
            // 当前时间小于结束时间 大于开始时间，直播中
            if ((item.start_stampTime < res.time || item.start_stampTime == res.time) && (res.time < item.end_stampTime || res.time == item.end_stampTime)) {
              chapter_state = '1';
              // 直播时间结束之后执行一遍
              if ((item.end_stampTime - res.time) < 3600) {
                t = setTimeout(function(){
                  that.getOpenClassInfo();
                }, (item.end_stampTime - res.time + 2) * 1000);
              }
              this.setData({
                liveState: '1',
                scrollLeft: index * 230,  // 距离左侧的距离        
                lookBackState: '0',
              })
            }
            // 当前时间大于结束时间  == 回看
            if (res.time > item.end_stampTime) {
              chapter_state = '2';
              this.setData({      
                lookBackState: '2',
                liveState: '',
              })
            }
            // 当前时间小于开始时间  == 未开始
            if (res.time < item.start_stampTime) {
              let chapterTime = item.start_stampTime - res.time;
              chapter_state = '0';
              // 在1小时才加入计时器
              if (chapterTime < 3600){
                t = setTimeout(function () {
                  that.getOpenClassInfo();
                }, chapterTime * 1000);
              }
              this.setData({
                lookBackState: '0',
              })
            }
      
            item.time_id = t;
            item.chapter_state = chapter_state;
           
          });
          this.setData({
            courseData: res,
            courseInfo: res.info, // 课程详情
            chapter: chapter || [], // 课程章节
            teacherInfo: res.info.teacher_info || {}, // 老师详情
            courseRecommend: res.recommend, // 相关推荐
            userId: wx.getStorageSync('userId'),
            userPhone: wx.getStorageSync('userPhone'),
          })
          // 隐藏渲染
          wx.hideLoading();
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


  // 验证码和友情提示切换
  bindPhoneCodeState: function(e){
    this.setData({
      phoneCodeState: !e.currentTarget.dataset.state
    }) 
  },

  // 立即预约+开课通知
  appointmentFormSubmit:function(e){
    this.addOpenClassBooking();
    this.getFormId(e.detail.formId); // 开发环境formid不正确
  },

  // 获取微信小程序的formId
  getFormId: function (formId){
    ajax({
      url: 'wxFormId',
      method: 'post',
      data: {
        "uid": wx.getStorageSync('userId'),
        "formId": formId,
      },
      success: data =>{
        if (data.statusCode != '200'){
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

  // 获取微信头像数据流
  getUserAvatar: function () {
    let that = this;
    let userAvatar = new Promise(function (resolve, reject) {
      ajax({
        url: 'getUserAvatar',
        method: 'post',
        data: {
          openId: wx.getStorageSync('openid'),
        },
        success: data => {
          console.log(data.result)
          if (data.statusCode == '200') {
            if (data.result){
              let base64 = 'data:image/png;base64,' + data.result;
              base64src(base64, 'tmp_base64srcimg');
              setTimeout(() => {
                wx.getImageInfo({
                  src: wx.env.USER_DATA_PATH + '/tmp_base64srcimg.png' + "",
                  success: res => {
                    that.setData({
                      fileAvatarUrl: res.path //将下载下来的地址给data中的变量变量
                    });
                    resolve(res.path);  // 头像数据
                  }, fail: res => {
                    console.log(res);
                  }
                });
              }, 200);
            }else{
              let wximg = '../../img/course/default-wximg.png';  // 微信默认头像
              that.setData({
                fileAvatarUrl: wximg //将下载下来的地址给data中的变量变量
              });
              resolve(wximg);
            } 
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
        },
        loadShow: true,
    })

   });
   return userAvatar;
  },

  // 获取微信小程序的二维码
  getWxCode: function () {
    let that = this;
    let wxCode = new Promise(function (resolve, reject) {
      ajax({
        url: 'getQrCode',
        method: 'post',
        data: {
          "scene":  that.data.goodsId,
          "page": "pages/openCourse/openCourse",
          "width": "200",
        },
        success: data => { 
          if (data.statusCode == '200') {
            let base64 = 'data:image/png;base64,' + data.result;
            // 图片写入文件
            base64src(base64,'tmp_base64src');
              setTimeout(() => {
                wx.getImageInfo({
                  src: wx.env.USER_DATA_PATH + '/tmp_base64src.png' + "",
                  success: res => {
                    that.setData({
                      base64ImgUrl: res.path //将下载下来的地址给data中的变量变量
                    });
                    resolve(res.path);  // 二维码
                  }, fail: res => {
                    console.log(res);
                  }
                });
              }, 200);
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
        },
        loadShow: true,
      })
    });
    return wxCode;
  },

  // 立即预约
  addOpenClassBooking:function(index){
    ajax({
      url: 'openClassBooking',
      method: 'post',
      data: {
        "uid": wx.getStorageSync('userId'),
        "id": this.data.goodsId,
        "status": 1
      },
      success: data => {
        if (data.statusCode == '200') {
          let courseData = this.data.courseData;
          courseData.book = true;
          this.setData({
            courseData: courseData
          })
          if(index != 1){
            wx.showModal({
              title: '预约成功',
              content: '小程序服务通知将会在开课前24小时和5分钟推送开课提醒',
              showCancel: false,
              confirmText: '我知道了',
              confirmColor: '#3CC51E',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } 
              }
            })
          }
        }else{
          if (index != 1){
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
      }
    })
  },

  // 获取用户微信手机号
  getPhoneNumber(e) {
    let data = e.detail;
    let parameter = e.currentTarget.dataset;
    wx.checkSession({  // 检测登录态是否过期
      success:()=> {
        if (data.encryptedData && data.iv && app.globalData.openid) {
          ajax({
            url: 'getPhone',
            method: 'post',
            data: {
              encryptedData: data.encryptedData,
              iv: data.iv,
              openId: app.globalData.openid,
            },
            success: data => {
              if (data.statusCode == '200') {
                
                wx.setStorageSync('userPhone', data.result.mobile+'') // 存储手机号
                if (data.result.is_new == '0'){ // 0 是老用户，1是新用户
                  wx.setStorageSync('userId', data.result.uid)
                  this.setData({
                    userPhone: data.result.mobile,
                    inputPhone: data.result.mobile,  // 发送短信的手机号
                    userId: data.result.uid
                  })
                  let ccUser = wx.getStorageSync('ccUser');
                  // ccUser
                  wx.setStorage({
                    key: 'ccUser',
                    data: {
                      ccUserId: ccUser.ccUserId,
                      userName: this.data.nickName,
                      guid: data.result.guid,
                    },
                  })
                  if (parameter.id) {
                    this.bindCourseAuditions(parameter);
                    // 课程章节
                  } else {
                    this.liveBroadcastPublic(parameter);
                  }

                }else{ 
                  // 新用户（注册)
                  this.setData({
                    chapterParameter: parameter,
                    userPhone: data.result.mobile,
                    inputPhone: data.result.mobile,  // 发送短信的手机号
                    phoneState: false, // 新用户重新发送验证码绑定
                  })

                }  
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
        }
      },
      fail() {
        setTimeout(() => {
          wx.showToast({
            title: '请重新登录授权',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
      }
    })
  },
 
  // 已登录，底部按钮，立即预约，立即播放，已预约
  liveBroadcastJump: function (e){
    let parameter = e.currentTarget.dataset;
    // 课程章节
    if (parameter.id){
      this.bindCourseAuditions(parameter);
      // 课程章节
    }else{
      this.liveBroadcastPublic(parameter);
    }
  },

  // 课程章节 --- 公开课播放（公共）
  bindCourseAuditions: function (data) {
    let unstartedTime = (data.startstamptime - data.time) * 1000;
    // 直播中，回看，未开始前24小时
    if (data.id && data.ccroomid && data.chapterstate != '0' || (data.chapterstate == '0' && 86400000 > unstartedTime)) {
      // 章节id + 课程id
      wx.navigateTo({
        url: '../liveAply/liveAply?id=' + data.id + '&goodsId=' + this.data.goodsId
      })
    } else {
      wx.showToast({
        title: '公开课尚未开始,敬请期待',
        icon: "none",
      });
    }
  },

  // 底部按钮三种条判断（公共）
  liveBroadcastPublic: function (parameter) {
    let chapter = this.data.chapter;
    // 直播全部结束（跳转第一个）
    if (parameter.lookbackstate == '2') {
      if (chapter[0] && chapter[0].chapter_state == '2') {
        // 章节id + 课程id
        wx.navigateTo({
          url: '../liveAply/liveAply?id=' + chapter[0].id + '&goodsId=' + this.data.goodsId
        })
      }
    }
    // 跳转当前直播课程
    if (parameter.livestate == '1') {
      this.addOpenClassBooking(1);  // 立即预约
      chapter.map((item, index) => {
        if (item.chapter_state == 1) {
          // 章节id + 课程id
          wx.navigateTo({
            url: '../liveAply/liveAply?id=' + item.id + '&goodsId=' + this.data.goodsId
          })
          return;
        }
      });
    }
    if (parameter.book == false && parameter.livestate != '1' && parameter.lookbackstate != '2') {
      this.addOpenClassBooking();  // 立即预约
    }
  },


  // 获取输入的手机号
  getPhone: function (e) {
    let inputPhone = e.detail.value;
    this.setData({
      inputPhone: inputPhone
    });
  },

  // 获取短信验证码 倒计时
  sendmessg: function(){
    let that = this;
    let inputPhone = that.data.inputPhone +'';
    if (inputPhone.length != 11 || isNaN(inputPhone)) {
      wx.showToast({
        title: '请输入有效的手机号码',  
        icon: "none"
      })
      return;
    }
    let time = 60  // 倒计时时间
    // 发送手机号
    that.bindSendSms(inputPhone);
      var inter = setInterval(function () {
        that.setData({
          getmsg: '( '+ time +'s )',
          sendmsg: false,
        })
        time--
        if (time < 0) {
          // timer = 1
          clearInterval(inter)
          that.setData({
            sendmsg: true,
            getmsg: "重新发送",
          })
        }
      }, 1000)
  },

  // 发送手机验证码
  bindSendSms: function (inputPhone){
    ajax({
      url: 'wxSendSms',
      method: 'post',
      data: {
        type: 'xcx',
        mobile: inputPhone,
      },
      success: data => {
        if (data.statusCode!= '200'){
          setTimeout(() => {
            wx.showToast({
              title: '短信发送失败',
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

  // 表单提交验证手机号和验证码
  formSubmit(e){
    let phone = e.detail.value.phone;
    let code = e.detail.value.code;
    if (phone.length != 11 || isNaN(phone)){
      setTimeout(() => {
        wx.showToast({
          title: '请输入有效的手机号码',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
      return;
    }
    if (code.length != 6 || isNaN(code)) {
      setTimeout(() => {
        wx.showToast({
          title: '请输入正确的验证码',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
      return;
    }  
    ajax({
      url: 'checkSms',
      method: 'post',
      data: {
        type: 'xcx',
        mobile: phone,
        code: code,
      },
      success: data => {
        if (data.statusCode =='200'){
          // 添加新用户
           this.addUser(phone);
        }else{
          setTimeout(() => {
            wx.showToast({
              title: data.message.msg,
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

  // 添加用户信息
  addUser: function (phone){
    ajax({
      url: 'addUser',
      method: 'post',
        data: {
          openId: wx.getStorageSync('openid'),
          mobile: phone,
        },
        success: data => {
          wx.setStorageSync('userPhone', data.result.mobile)
          wx.setStorageSync('userId', data.result.uid)
          let ccUser = wx.getStorageSync('ccUser');
          // ccUser
          wx.setStorage({
            key: 'ccUser',
            data: {
              ccUserId: ccUser.ccUserId,
              userName: this.data.nickName,
              guid: data.result.guid,
            },
          })
          this.setData({
            phoneState: true,  // 隐藏手机弹出框
            userPhone: data.result.mobile,
            userId: data.result.uid,
          })
          // 公开课链接跳转
          let parameter = this.data.chapterParameter
          // 公开课判断用户的点击状态
          // 课程章节
          if (parameter.id) {
            this.bindCourseAuditions(parameter);
            // 课程章节
          } else {
            this.liveBroadcastPublic(parameter);
          }

        }
      })
  },
  

  // 是否显示底部弹出分享
  bindShowShare: function(){
    this.setData({
      showShare: !this.data.showShare,
    })
  },



})