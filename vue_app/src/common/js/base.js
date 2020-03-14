
import Vue from 'vue'

// 公共头部
import header from '../../components/header.vue'
// 中间部分显示标题
import contentTitle from '../../components/contentTitle.vue'
// 公共加载动画
import loading from '../../components/Loading.vue'
// 上下题切换
import courseCheck from '../../components/course_check.vue'

// 题不存在时的提示
import Nodata from '../../components/Nodata.vue'
// confirm 弹框
import confirmT from '../../components/toarist/confirm_t.vue'

// confirm 弹框
import alertT from '../../components/toarist/alert_t.vue'






// 添加公共组件
export const commonComp = () => {
    Vue.component("v-header", header);
    Vue.component("v-loading", loading);
    Vue.component("v-nodata", Nodata);
    Vue.component("v-content", contentTitle);
    Vue.component("v-course-check", courseCheck);
    Vue.component("v-confirm", confirmT);
    Vue.component("v-alert", alertT);
    //单选
//   Vue.component("v-SingleElection", SingleElection);
}




