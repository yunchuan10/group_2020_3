/*
包含多个基于state的getter计算属性的对象
 */

import { newExercisesAnswercard ,answercardExerciseAnalysis , newTestAnswercard,} from '../common/js/dataFilter'

export default {
    
	
	
	
	//考試試卷列表
	answercard_test(state) {
        let _obj = state.new_test_data || {};
        let result = newTestAnswercard(_obj);
        state.new_test_data_submint = newTestAnswercard(_obj);
        return result;
    },
	
	
	
	
	

    
    

}


