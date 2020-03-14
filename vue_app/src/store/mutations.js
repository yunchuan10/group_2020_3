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
    // toarist 提示框控制
    set_toarist_alert( state, { status, cb } ) {
        state.app.toarist_alert = status;     // 显示或者隐藏alert
        cb && cb(); // 如果有回调调用
    },



    // 更新地址
    reseve_add (state, {d}) {
        state.a = d
    },

    //考试-更新数据
    set_reseve_data(state,{dat}){
    	state.reseve_data = dat;

    },
	//考试中提交成功状态管理
	set_submitSuccess(state,dat){
		state.submitSuc = dat
	},

    // 试卷报告
   set_report_data(state,{data}){
        state.report_data = data;
    },

    // 作业解析
    set_test_report_data(state,{data}){
        state.test_report_data = data;
    },





    //考试-答题卡

    set_answercard(state,{dat}){
    	//对请求过来的数据进行重新排序
    	let { _SubjectList=[] } = dat.result;
    	let newSubjects = _SubjectList.filter( subj => {
	    	let subjectCategory = subj.SubjectCategory*1;
	    	return ([1,2,3,6,7,9,10,11].indexOf(subjectCategory) != -1);
	    })
    	newSubjects.sort((a={}, b={}) =>( (sort_obj[a.SubjectCategory]*9000) - (sort_obj[b.SubjectCategory]*9000) ))
    	dat.result._SubjectList = newSubjects;
    	state.answercard_test = dat;
    },
    //考试-答题卡
    set_answercard_test(state,dat){
    	state.set_answercard_test = dat;

    },
	set_testSuccess(state,dat){
		state.set_testSuccess = dat;
	},
    //考试-单选题选择后数据改变
    set_singleCheck(state,data){
    	//获取state中的内容
    	var answercard = state.set_answercard_test.SubjectRecords || [];
    	for(var i=0;i<answercard.length ;i++){
    		if(answercard[i].Subject_Id == data.id ){
    			//添加状态
    			state.set_answercard_test.SubjectRecords[i].state = data.state;
    			//判断是否有值  有则删除 没有则追加
    			if(state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.length == 0){
    				//追加数据
    				state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.push(data.obj);
    			}else if(state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.length == 1){
    				//先清空
    				state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.splice(0,state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.length)
    				//追加元素
    				state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.push(data.obj);
    			}
    		}
    	}
    },

    //考试-多选题选择后数据改变
    set_checkElection(state,options){
    	//获取state中的内容
    	var answercard_checked = state.set_answercard_test.SubjectRecords || [];
    	for(var i=0;i<answercard_checked.length ;i++){
    		if(answercard_checked[i].Subject_Id == options.id ){
    			//添加状态
    			state.set_answercard_test.SubjectRecords[i].state = options.state;
//  			//判断是否有值  有则但不相同 追加
				var flag = true;
        		if(state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.length == 0){
        			flag = true;
        		}else{
        			state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.some((item,index)=>{
        				if(item.SAnswerOption_Id == options._obj.SAnswerOption_Id){
        					state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.splice(index,1)
        					if(state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.length == 0){
        						//添加状态
    							state.set_answercard_test.SubjectRecords[i].state = !options.state;
        					}
        					flag = false;
        				}
        			})
        		}
        		if(flag){
        			state.set_answercard_test.SubjectRecords[i].SubjectRecordSAnswerOptions.push(options._obj);
        		}
    		}

    	}

    },

    //考试-填空题数据改变
    set_comple(state,options){
    	//获取state中的内容
    	var answercard_checked = state.set_answercard_test.SubjectRecords || [];
		for(var i=0;i<answercard_checked.length ;i++){
			//循环遍历 对应题型
    		if(answercard_checked[i].Subject_Id == options.id ){
    			
    			//判断是否有值  有则删除 没有则追加
    			if(state.set_answercard_test.SubjectRecords[i].AnswerOptionExtendeds.length == 0){
    				//追加数据
    				state.set_answercard_test.SubjectRecords[i].AnswerOptionExtendeds = options.comple_Array;
    				for(let z =0; z< options.comple_Array.length;z++){
    					if( options.comple_Array[z].Answer ){
//  						//添加状态
    						state.set_answercard_test.SubjectRecords[i].state = options.state;
    					}
    				}
    			}else if(state.set_answercard_test.SubjectRecords[i].AnswerOptionExtendeds.length !== 0){
    				//判断答题卡显示颜色
    				if(number_count(options.comple_Array) == options.comple_Array.length){
    					state.set_answercard_test.SubjectRecords[i].state = !options.state;
    				}else{
    					state.set_answercard_test.SubjectRecords[i].state = options.state;
    				}
    				//先清空
    				state.set_answercard_test.SubjectRecords[i].AnswerOptionExtendeds = options.comple_Array;
    			}
    		}
    	}
    },
    //统计有内容个数
   

    //考试-问答题--可有多个问题---数据改变
    set_singQue(state,options){
    	//获取state中的内容
    	var answercard_checked = state.set_answercard_test.SubjectRecords || [];
		for(var i=0;i<answercard_checked.length ;i++){
			//循环遍历 对应题型
    		if(answercard_checked[i].Subject_Id == options.id ){
    			//添加状态
    			state.set_answercard_test.SubjectRecords[i].state = options.state;
    			//判断是否有值  有则删除 没有则追加
    			if(state.set_answercard_test.SubjectRecords[i].SubjectRecordAppendixes.length == 0){
    				//追加数据
    				state.set_answercard_test.SubjectRecords[i].SubjectRecordAppendixes = options.comple_Array;
    			}else if(state.set_answercard_test.SubjectRecords[i].SubjectRecordAppendixes.length == 1){
    				//先清空
    				state.set_answercard_test.SubjectRecords[i].SubjectRecordAppendixes.splice(0,state.set_answercard_test.SubjectRecords[i].AnswerOptionExtendeds.length)
    				//追加元素
    				state.set_answercard_test.SubjectRecords[i].SubjectRecordAppendixes = options.comple_Array;
    			}
    		}
    	}

   },

   //新加---2018129
   //考试-简答题--一个问题进行简答陈述---数据改变
    ShortAnwser_Test(state,options){
    	//获取state中的内容
    	var answercard_checked = state.set_answercard_test.SubjectRecords || [];
    	for(var i=0;i<answercard_checked.length ;i++){
    		if(answercard_checked[i].Subject_Id == options.id ){
				//每次该变都会对她进行从新赋值  故不需要进行重复初始化
				state.set_answercard_test.SubjectRecords[i].Answer = options.ShortAnwser_test.Answer;
				if(!options.ShortAnwser_test.Answer){
    				//添加状态
    			    state.set_answercard_test.SubjectRecords[i].state = !options.state;
    			}else{
    				//添加状态
    			    state.set_answercard_test.SubjectRecords[i].state = options.state;
    			}
    	   }
    	}
    },

    //答案报告 ----  答案解析------------》report_result
    report_result(state,{dat}){
    	state.report_results = dat;
    },

    // 新练习
    setNewExercisesData (state, data ){
    	state.new_exercises_data = data;
    },
    // 新练习解析
    setNewExercisesAnalysisData (state, data ){
    	state.new_exercises_analysis = data;
    },
    
   
    setNewExercisesState (state, {name, value} ){
    	state.new_exercises_data[name] = value;
    },

	studentId(state, data ){
    	state.studentId = data;
    },
    //练习-答题区域显示与隐藏
	anserShowAndHidden(state, data ){
    	state.flags = data;
    },
    //练习--答题分析区域显示与隐藏
    anserShowAndHidden_exercise_analysis(state, data ){
    	state.flags_exercise_analysis = data;
    },
    //考试--答题区域显示与隐藏
    anserShowAndHidden_test(state, data ){
    	state.flags_test = data;
    },
    //考试--答题分析区域显示与隐藏
    anserShowAndHidden_test_analysis(state, data ){
    	state.flags_test_analysis = data;
    },
    
    
    
    
    
    
    

    
    //收藏-错题集解切换题目答题卡序号随之切换   动态改变state的数据
    coll_error_number (state, {value}){
    	//切换题目将其他项内的swiper_number
    	for(let i=0;i<state.collection_analysis.Subjects.length;i++){
    		state.collection_analysis.Subjects[i].swiper_number = value-1;
    	}
    },
    //收藏-解析
    setCollectionAnalysisData (state, data ){
    	state.collection_analysis = data;
    },
    // 错题集-解析
    setErrorBookAnalysisData (state, data ){
    	state.collection_analysis = data;
    },
    
    
    

    //错题集解切换题目答题卡序号随之切换   动态改变state的数据
    error_number (state, {value}){
    	//切换题目将其他项内的swiper_number
    	for(let i=0;i<state.error_analysis.Subjects.length;i++){
    		state.error_analysis.Subjects[i].swiper_number = value-1;
    	}
    },
    //错题集-解析
    setErrorAnalysisData (state, data ){
    	state.error_analysis = data;
    },
    // 错题集-解析
    setErrorAnalysisData (state, data ){
    	state.error_analysis = data;
    },
    
    //窗口可视区域发生变化
    set_screenResize(state,dat){
		state.screenResize = dat;
		
	},
	//IOS获取是否弹出软键盘
	set_screenResizeIos(state,dat){
		
		state.screenResizeIos = dat;
		
	},
    
    //特殊字符提示框  special_chart
    setspecial_chart(state,data){
    	state.special_chart = data;
    }
}

