// components/agreement/agreementC.js
const { ajax } = require('../../utils/ajax.js')
Component({
  
  data: {
    agreement: [],
    tab: -1,
    real_name: '',
    phone: '',
    id_number: '',
    idReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    subTab: 0,
    errMsg: '',

    isSms: false,
    smsCode: 0,
    smsTimer: null,
    code: '',
    guid: '',
  },
  toastTimer: null,
  attached(e) {
    let uid = wx.getStorageSync('userId') || '';
    // let guid = wx.getStorageSync('guid') || '';
    if (uid ) {
      ajax({
        url: 'getAgreementContent',
        method: 'post',
        data: {
          uid
        },
        success: data => {
          const res = data.result || {};
          const agreement = res.agreement||[];
          agreement.forEach(element => {
            element.sec = true;
            // element.content = element.content.replace(/pt\;/g, /px\;/);
          });
          this.setData({
            agreement,
            tab:0
          })
          
        }
      })
    }
  },

  methods: {
    setSec(e){
      let datas = e.currentTarget.dataset || {};
      let i = datas.i || 0;
      let agreement = this.data.agreement;
      agreement[i].sec = !agreement[i].sec;
      this.setData({
        agreement
      })
    },

    setTab(e) {
      let datas = e.currentTarget.dataset||{};
      let i = datas.i||0;
      let agreement = this.data.agreement;
      if (datas.back){  //返回
        let tab = this.data.tab - 1;
        tab = tab<0? 0:tab;
        this.setData({
          tab
        })
        return;
      }else if (!agreement[i].sec) {
        clearTimeout(this.toastTimer);
        setTimeout(() => {
          wx.showToast({
            title: '请先同意协议',
            icon: "none",
          });
          this.toastTimer = setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
        return;
      }
      let tab = this.data.tab+1;
      this.setData({
        tab
      })
    },

    sunCheck(e){
      if(e){
        let datas = e.currentTarget.dataset || {};
        let name = datas.name;
        let val = e.detail.value;
        this.setData({
          [name]: val
        })
      }

      let real_name, phone, id_number ,code;
      real_name = (this.data.real_name + '').trim();
      phone = (this.data.phone + '').trim();
      id_number = (this.data.id_number + '').trim();
      code = (this.data.code + '').trim();
      let msg = '';
      if (!real_name) {
        msg = '真实姓名不能为空'
      } else if (!phone) {
        msg = '手机号码不能为空'
      } else if (!/^1\d{10}$/.test(phone)) {
        msg = '请输入正确的手机号码'
      } else if (!code) {
        msg = '手机验证码不能为空'
      } else if (!/^\d{6}$/.test(code)) {
        msg = '请输入正确的手机验证码'
      } else if (!id_number) {
        msg = '身份证号不能为空！'
      } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id_number)) {
        msg = '请输入正确的身份证号'
      }
      this.setData({
        errMsg: msg
      })
    },

    // 获取短信验证码
    getSms() {
      let { phone, isSms, smsTimer } = this.data;
      phone = (phone + '').trim();
      if (isSms) {
        return;
      }
      if (!/^1\d{10}$/.test(phone)) {
        if (!phone) {
          setTimeout(() => {
            wx.showToast({
              title: '手机号不能为空' || '操作失败',
              icon: "none",
            });
            this.toastTimer = setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
        } else {
          setTimeout(() => {
            wx.showToast({
              title: '手机号格式错误' || '操作失败',
              icon: "none",
            });
            this.toastTimer = setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
        }
        return;
      }
  
      ajax({
        url: 'app_smscaptcha',
        method: 'post',
        data: {
          smsType: 'signAgree',
          type: 'xcx',
          mobile: phone,
        },
        success: res => {
          if (res.statusCode == 200) {
            if (isSms) {
              return;
            }
            this.setData({
              isSms: true,
              smsCode: 60
            })
            clearInterval(smsTimer);
            smsTimer = setInterval(() => {
              if (this.data.smsCode <= 1) {
                clearInterval(smsTimer);
                this.setData({
                  isSms: false,
                })
                return false;
              }
              this.setData({
                smsCode: this.data.smsCode - 1,
              })
            }, 1000);
            this.setData({
              smsTimer: smsTimer,
              guid: wx.getStorageSync('guid'),
            })
          } else {
            const message = res.message || '网络错误,请稍后重试';
            setTimeout(() => {
              wx.showToast({
                title: message,
                icon: "none",
              });
              this.toastTimer = setTimeout(() => {
                wx.hideToast();
              }, 2000)
            }, 0);
          }

        }

      })




    },
    // 提交数据
    agreeSub(){
      if (this.data.subTab!=1){
        this.sunCheck();
        this.setData({
          subTab: 1
        })
      }
      
      if (this.data.errMsg) {
        return;
      }
      let guid = wx.getStorageSync('guid') || this.data.guid || '';
      let { real_name, phone, id_number, code } = this.data;
      real_name = (real_name + '').trim();
      phone = (phone + '').trim();
      id_number = (id_number + '').trim();
      code = (code + '').trim();
      let type = 'xcx';
      let data = { real_name, phone, id_number, guid, type, code };

      ajax({
        url: 'myAgreement',
        method: 'post',
        data,
        success: res => {
          clearTimeout(this.toastTimer);
          if (res.statusCode == 200) {
            setTimeout(() => {
              wx.showToast({
                title: '操作成功',
                icon: "none",
              });
              this.toastTimer = setTimeout(() => {
                wx.hideToast();
              }, 2000)
            }, 0);
            this.triggerEvent('agevent');
            wx.showTabBar();
            this.setData({
              tab: -1
            })
          } else {
            setTimeout(() => {
              wx.showToast({
                title: res.message || '操作失败',
                icon: "none",
              });
              this.toastTimer = setTimeout(() => {
                wx.hideToast();
              }, 2000)
            }, 0);
          }
        }

      })

    }

  }
})
