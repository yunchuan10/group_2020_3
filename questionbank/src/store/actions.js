/*
通过mutation间接异步更新state的多个方法的对象
 */
//引入封装的ajax
import {GetTest,analysis,exercises,testReport,errorBookExercise,collectionExercise, coll_error} from '../api'

// 对练习对象抽取，封装
import {newExercisesData,newExercisesAnalysisData,newTestData} from '../common/js/dataFilter'


export default {
    

    


	//获的考试试题列表 getNewTest
	getNewTest({commit, state}, {data, test_obj, cb}) {
    	test_obj = test_obj||{};
        //--- 传递数据和请求方式  -- 调用接口
        GetTest({
            data:data,
            type:'get'
        }).then(res => {
            let new_obj = newTestData(res, test_obj);
//          let new_obj_Analysis = newExercisesAnalysisData(res, test_obj);
            // 保存考试
            commit('setTestData', new_obj);
            // 解析
//          commit('setNewExercisesAnalysisData', new_obj_Analysis);
            
            if(cb){
                cb(new_obj);
            }
        }).catch( err => {
            console.log(err)
        })
    },

   
   
   	
   	
   	
   	
   	
   	
   	

   
   
    
}