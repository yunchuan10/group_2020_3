
export const ccLiveData = {
    live_data: {
        msg_before: /^\#([0-9a-zA-Z]){4}[\u4e00-\u9fa5]{1}\:\s/,        // 检测班主任信息
        face_befor: 'https://newapi.dongfangshangxue.com/static/dist/images/common/cc-face/'
    },

    formatSeconds: function (value) {
      value = value||0;
      var secondTime = parseInt(value);// 秒
      var minuteTime = 0;// 分
      var hourTime = 0;// 小时
      if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result = "" + secondTime;
      result = result < 10 ? "0" + result : result;
      secondTime = secondTime < 10 ? "0" + secondTime : secondTime;

      if (minuteTime > 0) {
        minuteTime = minuteTime < 10 ? "0" + minuteTime : minuteTime;
        result = "" + minuteTime + ":" + result;
      } else {
        minuteTime = "00";
        result = "" + minuteTime + ":" + result;
      }

      if (hourTime >= 0) {
        hourTime = hourTime < 10 ? "0" + hourTime : hourTime;
        result = "" + hourTime + ":" + result;
      }
      return result;
    },

    getLocationParameter: function(origin_str) {
        // 获取浏览器参数
        var url = origin_str ? origin_str : location.search; //获取url中"?"符后的字串
        var theRequest = {};
        if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
        }
        return theRequest;
    },

    chartMsg( _msg, s, forbiddens) {
        // console.log(_msg,88888)      
        _msg = _msg || {};

        var getRoleStr = "", 
        isShow = 1,
        talk_time = 0,
        txt = _msg.msg || _msg.content || "",
        userid = _msg.userid || _msg.userId || "",
        username = _msg.username || _msg.userName || "",
        usercustommark = "",
        userrole = _msg.userrole || _msg.userRole || "student",
        nowTime = (_msg.time + "" || "").trim(),
        msg_live_id = "";
        userid = userid + '';
        // userid = userid.split("_")[0];
        
        userid = userid.replace('*','');
        userid = (userid + "").toLowerCase() || "";

        if ( nowTime.indexOf(':') == -1 ){    //获取消息时间
          var dds = Date.parse( s.replace(/-/g, '/').split('.')[0] );
          talk_time = (new Date(dds)).getTime()/1000 + (nowTime-1);   //时间戳
        }else{
          var dds = s.split(' ')[0] + ' ' + nowTime;
          dds = Date.parse(dds.replace(/-/g, '/').split('.')[0]);
          talk_time = (new Date(dds)).getTime()/1000-1;   //时间戳
        }
      
        //  得到的消息标记
        usercustommark = (_msg.usercustommark || _msg.userCustomMark || "").trim();
        if (usercustommark.indexOf("?") == -1) {
            usercustommark = "?" + usercustommark;
        }
        var mark_obj = this.getLocationParameter(usercustommark) || {};
        msg_live_id = (mark_obj.live_id || "").toLowerCase() || "";

        // 获取用户类型，学生/老师
        if (userrole == "student") {
            // 学生状态需要判断要不要显示
            var _mua = mark_obj.mua.split("_")[0] || "";
            _mua = _mua.split("-")[1] || "";
            if (_mua == 2) {
                // username = (decodeURI(decodeURI(mark_obj.full_name)+'').trim() || '班主任');
                // 1学生， 2班主任
                getRoleStr = "班主任";
                var txts = txt.match(ccLiveData.live_data.msg_before) || [];
                txts = txts[0] || "";
                txts = txts.split("班")[0] || "";
                txts = txts.substr(1) || "";
                txt = txt.replace(ccLiveData.live_data.msg_before, "");
            } else {


              if (forbiddens[userid] && (forbiddens[userid] * 1 - talk_time > 0)) {  // 禁言之前的消息
                isShow = 0;
              }

                // // 学生， 禁言的不显示
                // var is_talk_show = chat.isTalkShow(nowTime, userid);
                // if (!is_talk_show) {
                //     return;
                // }
                // if (userid != live_user_data.guid.toLowerCase()) {
                    //不是自己的消息 替换手机号
                    txt = txt.replace(ccLiveData.live_data.phone_reg, "***");
                // }
            }
        } else if (userrole == "publisher") {
            getRoleStr = "讲师";
            username = username || "讲师";
        } else if (userrole == "teacher") {
            getRoleStr = "助教";
            username = username || "助教老师";
        }

        var time_li = this.timeShow(nowTime, s) || '';
        //表情符号
        txt = this.msgToFace(txt);

        return {
            getRoleStr,
            txt,
            userid,
            username,
            usercustommark,
            userrole,
            msg_live_id,
            time_li,
            talk_time,
            isShow
        };

    },

    setTalkShow(_msg, forbiddens){
      let {
         getRoleStr,txt,userid,username,usercustommark,userrole,msg_live_id,time_li,talk_time,isShow
      } = _msg;

      if ( !getRoleStr ){    //学生发的消息
        if (forbiddens[userid] && (forbiddens[userid] * 1 - talk_time > 0)) {  // 禁言之前的消息
          isShow = 0;
        }
      }
      return { 
        getRoleStr, txt, userid, username, usercustommark, userrole, msg_live_id, time_li, talk_time, isShow 
      };

    },

    // 检测消息有表情吗
    msgToFace: function(msg) {
        var em_reg = /\[em2\_([0-9]+)\]/g,
        imgs = msg.match(em_reg) || [];
        imgs.forEach(function(item) {
            var old_i = item;
            var _name = old_i.replace('[', '').replace(']', '');
            var _i = _name.split('_')[1]*1;
            if(_i < 21) {
                _i = _i<10? '0'+_i : ''+_i;
                _i = ccLiveData.live_data.face_befor + _i + '.png';
                _i = '<img src="' + _i + '" style="width:20px;height:20px;margin:0 3px;"/>';
                msg = msg.replace(old_i, _i);
            }
        })
        return msg;
    },

    // 控制是否显示时间
    timeShow: function(nowTime,s) {
      
        var time_html = '';
        nowTime = nowTime+''||'';

        var liveStartTime = s||'';
        if( liveStartTime.indexOf('T')!= -1 ){       // 开始时间
            liveStartTime = liveStartTime.split('T')[1]||'';
        }else if( liveStartTime.indexOf(' ')!= -1 ){
            liveStartTime = liveStartTime.split(' ')[1]||'';
        }

        // 聊天时间
        if( nowTime && liveStartTime){
            var strat_ts = liveStartTime.split(':'), now_t = '';
            if( nowTime.indexOf(':')!= -1 ){
                time_html = nowTime;
            }else{
                var live_s_t = strat_ts[0]*60*60 + strat_ts[1]*60 + strat_ts[2]*1;
                now_t = live_s_t + (nowTime*1);
                var _h = Math.floor(now_t/3600);
                var _m = Math.floor( (now_t-_h*60*60)/60);
                var _s = Math.floor( (now_t-_h*60*60-_m*60)/1 );
                _h = _h<10 ? ('0'+_h) : _h;
                _m = _m<10 ? ('0'+_m) : _m;
                _s = _s<10 ? ('0'+_s) : _s;
                time_html = (_h+':'+_m+':'+_s);
            }
        }
        return time_html;
    },


    // 课程列表数据过滤
    chapterList(chapter,now,opt,live_type){
        let course_list = chapter.map(item=>{
            item.end_time = item.end_time.replace(/-/g, '/').split('.')[0];
            item.start_time = item.start_time.replace(/-/g, '/').split('.')[0];
            const live_start = new Date(item.start_time).getTime()/1000;
            const live_end = new Date(item.end_time).getTime()/1000;
            now = now*1;
            let i_class = '';
            if ( now < live_start ){
                i_class = 'wait';
            } else if (now < live_end){
                i_class = 'line';
                if(opt.id==item.id){      //当前播放中
                    i_class = 'sec';
                }
            }
            if(opt.id==item.id && live_type==1){      //当前播放中
                i_class = 'sec';
            }

            if(opt.id==item.id){      //当前视频
                i_class += '  list_sec';
            }

            // console.log(i_class, 'i_classi_classi_classi_classi_class')

            let start_time = item.start_time;
            let end_time = item.end_time;
            start_time = start_time.split(' ');
            let munit = start_time[1].split(':');
            munit = munit[0] + ':' + munit[1];
            let day = start_time[0].split('/');
            day = day[1]+'月'+day[2]+'日';
            let munit_t = end_time.split(' ')[1].split(':');
            munit += '-'+munit_t[0] + ':' + munit_t[1];

            item.munit = munit;
            item.day = day;
            // console.log(i_class, 'i_classi_classi_classi_classi_class')
            item.i_class = i_class;

            item.live_start = live_start;
            item.live_end = live_end;
            item.now = now;

            return item;
        });
        return course_list;
    },

    listStateTimer(list, self){
        list = list||[];
        list = list.map( (item, i)=>{
            let { now, live_start, live_end, i_class } = item;

            if ( now < live_start ){
                let t = (live_start-now)*1000;
                item.timer = setTimeout( ()=>{      // 到了直播开始时间切换状态
                    if( i_class.indexOf('list_sec')!=-1 ){       // 是当前的吗？
                        i_class = 'sec'+' list_sec';
                    }else{
                        i_class = 'line';
                    }
                    var course_list = self.data.course_list||[];
                    course_list[i]['i_class'] = i_class;
                    self.setData({
                        course_list
                    })
                }, t );
            } else if (now < live_end){
                let t = (live_end-now)*1000;
                item.timer = setTimeout( ()=>{      // 到了录播开始时间切换状态
                    if( i_class.indexOf('list_sec')!=-1 ){       // 是当前的吗？
                        i_class = ''+' list_sec';
                    }else{
                        i_class = '';
                    }
                    var course_list = self.data.course_list||[];
                    course_list[i]['i_class'] = i_class;
                    self.setData({
                        course_list
                    })
                }, t )
            }
            return item;
        });

        return list;

    },

    clearListTimer(list){
        list.forEach( (item, index)=>{
            clearTimeout(item.timer);
        });
    },


    // 直播倒计时
    getLiveTime(now_t){
        now_t = now_t||0;
        now_t = now_t < 0 ? 0 : now_t;
        let _h = Math.floor(now_t/3600);
        let _m = Math.floor( (now_t-_h*60*60)/60);
        let _s = Math.floor( (now_t-_h*60*60-_m*60)/1 );
        _h = _h<10 ? ('0'+_h) : _h;
        _m = _m<10 ? ('0'+_m) : _m;
        _s = _s<10 ? ('0'+_s) : _s;

        let t = (_h+':'+_m+':'+_s);
        return t;

    }




};
