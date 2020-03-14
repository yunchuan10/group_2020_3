/*
包含多个基于state的getter计算属性的对象
 */

export default {
	//获取练习问题列表
    // reseve_list_exercises (state) {
    // 	let _arr = [];
	//     _arr = state.reseve_data_exercise.Sheet.Subjects||[];
	// 	return _arr;
    // },
	//获取用户信息
	checkLogin(state){
		let checkLogin = state.checkLogin||{};
		return checkLogin;
	},
	collectLists(state){
		let collectLists = state.collectLists||[];
		return collectLists;
	},
	orderLists(state){
		let orderLists = state.orderLists||[];
		return orderLists
	},
	agreeParameteData(state){
		let agreeParameteData = state.agreeParameteData||{};
		return agreeParameteData
	}
	


}


