/*
包含多个基于state的getter计算属性的对象
 */

import { newExercisesAnswercard ,answercardExerciseAnalysis,answercardCollectionErrorAnalysis} from '../common/js/dataFilter'

export default {
	//获取练习问题列表
    reseve_list_exercises (state) {
    	let _arr = [];
	    _arr = state.reseve_data_exercise.Sheet.Subjects||[];
		return _arr;
    },
    //获取考试问题列表
    reseve_list_result (state) {
    	let _arr = [];
	    _arr = state.reseve_data.result._SubjectList||[];
		return _arr;
    },
    //答题卡考试列表
	reseve_obj (state) {
    	let _obj = state.set_answercard_test || {};
	    return _obj;
    },
    //答题卡练习列表
	reseve_obj_exercises (state) {
    	let _obj = state.set_answercard_exercise || {};
	    return _obj;
    },
    //解析结果列表
	reseve_obj_result(state) {
    	let _obj = state.report_results.result || {};

	    return _obj;
    },


    // 练习题 =>  练习答题卡
    answercard_new_exercise(state) {
        let _obj = state.new_exercises_data || {};
        let result = newExercisesAnswercard(_obj);
        state.new_exercises_data_submint = newExercisesAnswercard(_obj);
        return result;
    },
    
    
    // 练习题-解析 =>  练习答题卡
    answercard_new_exercise_analysis(state) {

        let _obj = state.new_exercises_analysis || {};
        let result = answercardExerciseAnalysis(_obj);
        return result;
    },

	
	
	
	
	
	
	
	

    
    // 收藏=>  收藏/错题本答题卡
    answercard_collection_error_analysis(state) {
        let _obj = state.collection_analysis || {};
        let result = answercardCollectionErrorAnalysis(_obj);
        return result;
    },
    // 错题本=>  收藏/错题本答题卡
    answercard_error_analysis(state) {
        let _obj = state.error_analysis || {};
        let result = answercardCollectionErrorAnalysis(_obj);
        return result;
    },
    // 窗口大小发生改变
    set_screenResize(state) {
        let _obj = state.screenResize || false;
        return _obj;
    },
    // ios软键盘是否升起
    set_screenResizeIos(state) {
        let _obj = state.screenResizeIos || false;
        return _obj;
    },
    
    
    set_special_chart(state){
    	let _obj = state.special_chart || false;
    	return _obj;
    }
    

}


