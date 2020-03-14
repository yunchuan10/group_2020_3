// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 路由
import router from './router'

// vuex
import store from './store'

// 公共组件
import { commonComp } from './common/js/base'

commonComp();

import fixedInput from './common/js/directive.js'

//时间处理函数
import moment from "moment";
Vue.prototype.$moment = moment;

// 混合
import MyPlugin from './common/js/myPlugin'
//使用自定义插件
Vue.use(MyPlugin)


//Android 5.0版本打开白屏 无白屏出现

import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()



// 解决移动端点击延迟
import FastClick from 'fastclick'
FastClick.prototype.focus = function(targetElement) {
	var length;
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsIOS;
	// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
		//修复BUG ios11.3以上不弹出键盘，这里加上聚焦代码，让其强制聚焦弹出键盘
		targetElement.focus();
	} else {
		targetElement.focus();
	}
}
FastClick.prototype.needsFocus = function(target) {
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		case 'text':
			return true;
		}
	case 'div':
		if(target.contenteditable ){
			switch (target.firstChild){
			case 'p':
				return true;
			}
		}
		
		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
}
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.config.productionTip = false





new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
