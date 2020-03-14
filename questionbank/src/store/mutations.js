/*
直接同步更新state的多个方法的对象
 */
function number_count(item){
    	let num =0;
    	for(let s=0;s < item.length;s++){
    		if(!item[s].Answer){
    			num++
    		}
    	}
    	return num
  };
// 题目类型排序
const sort_obj = {
    '1': 1,     // 单选
    '2': 2,     // 多选
    '9': 3,     // 判断
    '6': 4,     // 填空
    '3': 5,     // 问答
    '4': 6,     // 上机  留个坑
    '5': 7,     // 项   留个坑
    '7': 8,     // 名词
    '22': 9,    // 计算  留个坑
    '10': 10,   // 案例
    '11': 11    // 论述
}
export default {

    // toarist 提示框控制
    set_toarist_confirm ( state, { status, cb } ) {
        state.app.toarist_confirm = status;     // 显示或者隐藏confirm
        cb && cb(); // 如果有回调调用
    },
    // toarist 考试结束提示框控制
    set_toarist_confirm_td ( state, { status, cb } ) {
        state.app.toarist_confirm_td = status;     // 显示或者隐藏confirm
        cb && cb(); // 如果有回调调用
    },
    // toarist 考试提示框控制
    set_toarist_confirm_ts ( state, { status, cb } ) {
        state.app.toarist_confirm_ts = status;     // 显示或者隐藏confirm
        cb && cb(); // 如果有回调调用
    },
    // toarist 提示框控制
    set_toarist_alert( state, { status, cb } ) {
        state.app.toarist_alert = status;     // 显示或者隐藏alert
        cb && cb(); // 如果有回调调用
    },
    // 更新地址
    reseve_add (state, {d}) {
        state.a = d
    },

    
    
    
    
    
    //考试提交成功
    set_test_submit_sucess (state, { status}) {
        state.test_submit_sucess = status
    },
    //考试试题列表
    setTestData (state, data ){
    	state.new_test_data = data;
    },
}

