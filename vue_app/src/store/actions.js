/*
通过mutation间接异步更新state的多个方法的对象
 */
//引入封装的ajax
import {GetTest,analysis,exercises,testReport,errorBookExercise,collectionExercise, coll_error} from '../api'

// 对练习对象抽取，封装
import {coll_error_AnalysisData, newExercisesData,newExercisesAnalysisData,errorBookData} from '../common/js/dataFilter'


export default {
    set_submitSuccess({commit,state},data){
    	commit('set_submitSuccess',data);
    },


    //异步获取数据 考试数据
    loadingGetTest({commit, state}, {data, cb}) {
    		//--- 传递数据和请求方式  -- 调用接口
    		GetTest({
				data:data,
                type:'get'
			}).then(res => {
				//是否请求成功
				if(res.statusCode == 200){
					commit('set_testSuccess',true);
				}else{
					commit('set_testSuccess',false);
				}
	    		const dat = res;
	    		//通过 commit 向mutations 提交数据 来改变 state状态
	    		commit('set_reseve_data',{dat});
	    		commit('set_answercard',{dat});
	    		// 数据过滤 ---- 过滤成提交的数据结构
	    		let _obj = dat.result;
		    	let result={SubjectRecords:[]};
		    	//暂用 临时的
		    	result.StudentId = '';
		    	result.Is_FirstExam = _obj.Is_FirstExam;
		    	//试卷ID
			    result.Sheet_Id = _obj.SheetId;
			    //试卷名字
			    result.SheetName = _obj.SheetName;
			    //开始时间 暂用
			    result.BeginTime = _obj.StartTime;
			    //结束时间 暂用
			    result.EndTime = _obj.EndTime;
			    
			    //状态
			    result.State = '0';
			    result.SourceId = '00000000-0000-0000-0000-000000000000';
			    result.SourceType='7';
			    result.SourceName='';
			    //产品ID
			    result.ProductHistoryId='4E8FD16C-7681-499A-85A4-5A40BB1D2BF8';
			    result.StudyPlanId='';
			    result.StudyPlanArrangeId='00000000-0000-0000-0000-000000000000';
			    result.CourseHistoryId='00000000-0000-0000-0000-000000000000';
			    result.ChapterId = '00000000-0000-0000-0000-000000000000';
			    //班级ID
			    result.ClassId = '75C95C24-A8D6-441E-8C6D-97945A99DDF8' ;
			    //最后确认时间
			    result.LastReviewTime='2018-11-26 17:55:55.253';
			    result.SubChapterId='00000000-0000-0000-0000-000000000000';
			    let _arr = _obj._SubjectList||[];
			    _arr.forEach( (item={})=>{
			    	//答案集合
			    	result.SubjectRecords.push({
			    		'Subject_Id':item.SubjectId,//题目ID
			    		//题型
			    		'SubjectCategory':item.SubjectCategory,
			    		'Answer':'',//问答题答案
			    		'SubjectRecordSAnswerOptions':[],//选择题&多选题答案
			    		'SubjectRecordAppendixes':[],//选择题&多选题答案
			    		'AnswerOptionExtendeds':[],//填空题答案
			    		'state':false
			    	});
			    })
			    commit('set_answercard_test',result);
			    if(cb){
	                 cb();
	             }
    		})
    },

    //考试解析数据
    loadingGetTest_result({commit, state}, data) {
        //--- 传递数据和请求方式  -- 调用接口
        analysis({
            data:data,
            type:'get'
        }).then(res => {
            const data = res.result;
		    let h  =   Math.floor(data.GetTime/60);
		    let s  =   data.GetTime%60;
		    h    +=    '';
		    s    +=    '';
		    h  =   (h.length==1)?'0'+h:h;
		    s  =   (s.length==1)?'0'+s:s;
    		data.GetTime = h+':'+s;
            commit('set_report_data',{data});
        })
    },

    // 作业解析数据
    loadingGetTestReport_result({commit, state}, data) {
    		//--- 传递数据和请求方式  -- 调用接口
    		testReport({
				data:data,
                type:'get'
			}).then(res => {
				const data = res.Sheet;
				commit('set_test_report_data',{data});

			})
    },

    // 新的获取练习
    getNewExercises({commit, state}, {data, test_obj, cb}) {
    	
    	test_obj = test_obj||{};
        //--- 传递数据和请求方式  -- 调用接口
        exercises({
            data:data,
            type:'get'
        }).then(res => {
            let new_obj = newExercisesData(res, test_obj);
            let new_obj_Analysis = newExercisesAnalysisData(res, test_obj);
            // 保存练习
            commit('setNewExercisesData', new_obj);
            // 解析
            commit('setNewExercisesAnalysisData', new_obj_Analysis);
            
            if(cb){
                cb(new_obj);
            }
        }).catch( err => {
            console.log(err)
        })
    },


  //临时
   studentId({commit, state}, data) {
   	commit('studentId',data);
   },
   //练习-答题区域显示与隐藏
   anserShowAndHidden({commit, state}, data) {
   	commit('anserShowAndHidden',data);
   },
   //练习-答题分析区域显示与隐藏
   anserShowAndHidden_exercise_analysis({commit, state}, data) {
   	commit('anserShowAndHidden_exercise_analysis',data);
   },
   //考试--答题区域显示与隐藏
   anserShowAndHidden_test({commit, state}, data) {
   	commit('anserShowAndHidden_test',data);
   },
   //考试--答题分析区域显示与隐藏
   anserShowAndHidden_test_analysis({commit, state}, data) {
   	commit('anserShowAndHidden_test_analysis',data);
   },
   
   
   
   	
   	
   	
   	
   	
   	
   	

   
   
    // 收藏-错题集解析接口----一个接口即可
    coll_error_Actions({commit, state}, {data, cb}) {
        //--- 传递数据和请求方式  -- 调用接口
        coll_error({
            data:data,
            type:'post'
        }).then(res => {
//      	console.log(res,'new_obj_Analysis')
            let new_obj_Analysis = coll_error_AnalysisData(res);
            // 解析
//          console.log(new_obj_Analysis,'new_obj_Analysis')
            commit('setCollectionAnalysisData', new_obj_Analysis);
            if(cb){
	             cb(res);
	        }
        }).catch( err => {
            console.log(err)
        })
    },
    // 错题集解析接口----一个接口即可
    error_Actions({commit, state}, {data, cb}) {
        //--- 传递数据和请求方式  -- 调用接口
        coll_error({
            data:data,
            type:'post'
        }).then(res => {
            let new_obj_Analysis = coll_error_AnalysisData(res);
            // 解析
//          console.log(new_obj_Analysis,'new_obj_Analysis')
            commit('setErrorAnalysisData', new_obj_Analysis);
            if(cb){
	             cb(res);
	        }
        }).catch( err => {
            console.log(err)
        })
    },
    
    
	//错题集 删除数据时通过此方法最终改变state的值
    errorBookDel({commit, state}, data) {
   	  commit('setErrorBookAnalysisData',data);
    },
    
    //特殊字符提示框  special_chart
    special_charts({commit, state}, data) {
   	  commit('setspecial_chart',data);
    },
}