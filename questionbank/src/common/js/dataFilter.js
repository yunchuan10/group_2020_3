// 题目类型排序
export const sort_obj = {
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


//  每项数据过滤、
function setFillBacks( item={}, exaSubjectRecords ){
    let { Subject={} ,Subject_Score} = item;
    let { Description='', SAnswerGroup={}, SubjectCategory, SubjectId, SubjectCategoryName} = Subject;
	
	
	//是否收藏的状态 //,selected=false 手动添加的后续后台配置时设置为空即可
	let selected = item.SubjectCollection || false;
	
    Description = decodeURIComponent(Description)||'';
    let answer_obj = {};
    if(exaSubjectRecords){
        answer_obj = exaSubjectRecords.find( function(exaSubjectRecord){
            return (exaSubjectRecord.Subject_Id == SubjectId);
        });
        answer_obj = answer_obj||{};
        answer_obj.SubjectRecordSAnswerOptions = answer_obj.SubjectRecordSAnswerOptions||[];
    }
    
    let SubjectRecordId = answer_obj.SubjectRecordId||'';
	
    let { Options } = SAnswerGroup;  //几个选项
    let new_options = [], subject_answer= '';
    if( SubjectCategory == 3 || SubjectCategory == 7 || SubjectCategory == 10 || SubjectCategory == 11 || SubjectCategory == 8){//同一模板
    	if(answer_obj.Answer){
    		subject_answer = (decodeURIComponent(answer_obj.Answer)+'').trim()||''
    	}
    }else{
		new_options = Options.map( function(option){
        	let { Content, Prefix, SAnswerOptionId } = option;
	        let subject_fill = '';     //这道题填写的答案
	        let is_select = false;  //标记是否选中
	        if(exaSubjectRecords){
	            if(SubjectCategory==1 || SubjectCategory==9 || SubjectCategory==2 ){   // 是选择类型 
	                is_select = (answer_obj.SubjectRecordSAnswerOptions.some( option_slect => (option_slect.SAnswerOption_Id == SAnswerOptionId ) ));
	            }else if(SubjectCategory==6){//填空类型
	            	answer_obj.SAnswerOptionExtendeds.forEach( answerOptionExtended =>{
	            		if(answerOptionExtended.SAnswerOption_Id==SAnswerOptionId){
	            			subject_fill = decodeURIComponent(answerOptionExtended.Answer);
	            		}
	            	})
	            }else{
	                subject_fill = decodeURIComponent(answer_obj.Answer)||'';
	            }
	        }
	        
	        Content = decodeURIComponent(Content)||'';
	        return { Content, Prefix, SAnswerOptionId, subject_fill, is_select };
	    })
    }
    return { Description, Subject_Score,SubjectId, SubjectCategory, SubjectCategoryName, Options:new_options, subject_answer ,SubjectRecordId, selected, Subject_Score};
}

// 作业解析
function setFillBacks_Analysis( item={}, exaSubjectRecords ){
    let { Subject={},Subject_Score} = item;
    let { Description='', Analysis='', Remark='', SAnswerGroup={}, SubjectCategory, SubjectId, SubjectCategoryName} = Subject;
	
	
	//是否收藏的状态 //,selected=false 手动添加的后续后台配置时设置为空即可
	let selected = item.SubjectCollection || false;
	
	
    Description = decodeURIComponent(Description)||'';

   	// 答案解析
    Analysis = decodeURIComponent(Analysis)||'';
    // 参考答案
    Remark = decodeURIComponent(Remark)||'';
    // 此题分数
    let answer_obj = {};
    if(exaSubjectRecords){
        answer_obj = exaSubjectRecords.find( function(exaSubjectRecord){
            return (exaSubjectRecord.Subject_Id == SubjectId);
        });
        answer_obj = answer_obj||{};
        answer_obj.SubjectRecordSAnswerOptions = answer_obj.SubjectRecordSAnswerOptions||[];
    }
    let { Options } = SAnswerGroup;  //几个选项
    let new_options = [], subject_answer= '', select_str='', answer_str='',Comment='',Score='';
        //试题分数   
    	Score = answer_obj.Score || '0';
    	//老师评语
    	if(answer_obj.Comment){
    		Comment = answer_obj.Comment || ''
    	}	
    if( SubjectCategory == 3 || SubjectCategory == 7 || SubjectCategory == 10 || SubjectCategory == 11 || SubjectCategory == 8){//同一模板
    	if(answer_obj.Answer){
    		subject_answer = (answer_obj.Answer+'').trim()||''
    	}
    }else{
		new_options = Options.map( function(option){		
        	let { Content, Prefix, IsAnser, SAnswerOptionId } = option;
	        let subject_fill = '';     //这道题填写的答案
	        let is_select = false;  //标记是否选中
	        let c_type = '';  //标记是否选中
	        if(exaSubjectRecords){
	            if(SubjectCategory==1 || SubjectCategory==9 ){   // 是选择类型 
	                is_select = (answer_obj.SubjectRecordSAnswerOptions.some( option_slect => (option_slect.SAnswerOption_Id == SAnswerOptionId ) ));
					if(is_select){  // 我选择的
						c_type = 'select_red';   // 正确没选
						if(IsAnser){
							 c_type = 'select_green';     //正确选了	
						}
					}else{  // 我未选择
						c_type = 'select_default';     // 错误未选
						if(IsAnser){
							 c_type = 'select_border_green';     //正确未选	
						}
					}
					// 我选择的答案
	                if(is_select){
	                	select_str+=Prefix;
	                }
	                // 正确答案
	                if( IsAnser ){
	                	answer_str+=Prefix;
	                }
	            }else if(SubjectCategory==2 ){
	            	is_select = (answer_obj.SubjectRecordSAnswerOptions.some( option_slect => (option_slect.SAnswerOption_Id == SAnswerOptionId ) ));
					if(is_select){  // 我选择的
						c_type = 'select_red_check';   // 正确没选
						if(IsAnser){
							 c_type = 'select_green_check';     //正确选了	
						}
					}else{  // 我未选择
						c_type = 'select_default_check';     // 错误未选
						if(IsAnser){
							 c_type = 'select_border_green_check';     //正确未选	
						}
					}
					// 我选择的答案
	                if(is_select){
	                	select_str+=Prefix;
	                }
	                // 正确答案
	                if( IsAnser ){
	                	answer_str+=Prefix;
	                }
	            }else if(SubjectCategory==6){//填空类型
	            	answer_obj.SAnswerOptionExtendeds.forEach( answerOptionExtended =>{
	            		if(answerOptionExtended.SAnswerOption_Id==SAnswerOptionId){
	            			subject_fill = answerOptionExtended.Answer;
	            		}
	            	})
	            }else{
	                subject_fill = (answer_obj.Answer||'');
	            }
	        }
	        Content = decodeURIComponent(Content)||'';
	        return { Content, Prefix, SAnswerOptionId, IsAnser, subject_fill, is_select,c_type};
	    })
    }
    return { Description, Analysis, Remark, SubjectId, SubjectCategory,Subject_Score, SubjectCategoryName, Options:new_options, subject_answer,Comment,Score,select_str,answer_str ,selected};
} 


// 拼接答题卡数据
function cardSubjectRecords(obj){
    let res = {
        'Subject_Id':obj.SubjectId,         //题目ID
        'Answer': (obj.subject_answer+'').trim()||'',                         //问答题答案
        'SubjectCategory':obj.SubjectCategory,
        'SubjectRecordSAnswerOptions':[],   //选择题&多选题答案
        'SubjectRecordAppendixes':[],       //附件暂时不用
        'AnswerOptionExtendeds':[],         //填空题答案
        'SubjectRecordId': obj.SubjectRecordId,//当前题目Id
//      'selected':false       ---------------????????????????? 后续在接口获取题目列表中获取
    }


    if( obj.SubjectCategory == 1  || obj.SubjectCategory == 9 || obj.SubjectCategory == 2){     //单选 多选 判断
        obj.Options.forEach( ( item={} )=>{
            if(item.is_select){
                res.SubjectRecordSAnswerOptions.push({
                    'SAnswerOption_Id': item.SAnswerOptionId
                })
            }
        })
    }else if( obj.SubjectCategory == 6 ){   // 填空
        obj.Options.forEach( ( item={} )=>{
            if( item.subject_fill && item.subject_fill.trim() ){
                res.AnswerOptionExtendeds.push({
                    "Answer": item.subject_fill.trim(),
                    "SAnswerOptionId": item.SAnswerOptionId
                })
            }
        })
    }
    return res;

}




// 过滤新的练习对象
export const newExercisesData = function(obj={}, test_obj={Sheet:{}}){
    test_obj.Sheet = test_obj.Sheet||{};
    let Examinations = test_obj.Sheet.Examinations||[];
    let SubjectIdLocation = test_obj.Sheet.SubjectIdLocation||'';
    Examinations = Examinations[0]||{};
    let exaSubjectRecords = Examinations.SubjectRecords||null;

    let Sheet = obj.Sheet||{};

    let State = 0;
    let current_swiper = 0;
    let { PassScore, BeginTime, SheetId, SheetName, SheetType, TotalScore, Subjects=[] } = Sheet;
    BeginTime = (BeginTime+''||'').replace('T',' ');

    let newSubjects = Subjects.filter( subj => {
    	let subjectCategory = subj.Subject.SubjectCategory*1;
    	return ([1,2,3,6,7,9,10,11].indexOf(subjectCategory) != -1);
    })

	newSubjects.map( (item, index) => {
		if(item.SubjectCategory == 1){
			item.Subject_Sorts = 1
		}else if(item.SubjectCategory == 2){
			item.Subject_Sorts = 2
		}else if(item.SubjectCategory == 9){
			item.Subject_Sorts = 3
		}else if(item.SubjectCategory == 6){
			item.Subject_Sorts = 4
		}else if(item.SubjectCategory == 3){
			item.Subject_Sorts = 5
		}else if(item.SubjectCategory == 7){
			item.Subject_Sorts = 6
		}else if(item.SubjectCategory == 10){
			item.Subject_Sorts = 7
		}else if(item.SubjectCategory == 11){
			item.Subject_Sorts = 8
		}
	})
    // 排序
	newSubjects.sort((a={}, b={}) =>( (sort_obj[a.Subject.SubjectCategory]*9000+a.Subject_Sorts*1) - (sort_obj[b.Subject.SubjectCategory]*9000+b.Subject_Sorts*1) ))

    let new_subjects = newSubjects.map( (item, index) => {
        let { Subject={} } = item, subject_obj = {};
        let { SubjectCategory } = Subject;

        if( SubjectIdLocation == item.Subject.SubjectId ){
            current_swiper = index;
        }
        
        subject_obj = setFillBacks(item, exaSubjectRecords)  //最后一个参数标记是不是选择类型
        return subject_obj;
    })

 
    return { already_get: true, BeginTime, PassScore, SheetId, SheetName, SheetType, TotalScore, Subjects:new_subjects, State, SubjectIdLocation:'', current_swiper };

}

// 过滤新的练习对象--解析
export const newExercisesAnalysisData = function(obj={}, test_obj={Sheet:{}}){
	
    test_obj.Sheet = test_obj.Sheet||{};

    let Examinations = test_obj.Sheet.Examinations||[];
    let SubjectIdLocation = test_obj.Sheet.SubjectIdLocation||'';
    Examinations = Examinations[0]||{};
    let exaSubjectRecords = Examinations.SubjectRecords||null;
    
    
    let Sheet = test_obj.Sheet||{};
    let State = 0;
    let current_swiper = 0;
    let { PassScore, SheetId, SheetName, SheetType, TotalScore, Subjects=[] } = Sheet;
 
    let newSubjects = Subjects.filter( subj => {
    	let subjectCategory = subj.Subject.SubjectCategory*1;
    	return ([1,2,3,6,7,9,10,11].indexOf(subjectCategory) != -1);
    })
    
    newSubjects.map( (item, index) => {
		if(item.SubjectCategory == 1){
			item.Subject_Sorts = 1
		}else if(item.SubjectCategory == 2){
			item.Subject_Sorts = 2
		}else if(item.SubjectCategory == 9){
			item.Subject_Sorts = 3
		}else if(item.SubjectCategory == 6){
			item.Subject_Sorts = 4
		}else if(item.SubjectCategory == 3){
			item.Subject_Sorts = 5
		}else if(item.SubjectCategory == 7){
			item.Subject_Sorts = 6
		}else if(item.SubjectCategory == 10){
			item.Subject_Sorts = 7
		}else if(item.SubjectCategory == 11){
			item.Subject_Sorts = 8
		}
	})
    
    
	newSubjects.sort((a={}, b={}) =>( (sort_obj[a.Subject.SubjectCategory]*9000+a.Subject_Sorts*1) - (sort_obj[b.Subject.SubjectCategory]*9000+b.Subject_Sorts*1) ))

	
    let new_subjects = newSubjects.map( (item, index) => {
    	
    	
        let { Subject={} } = item, subject_obj = {};
        let { SubjectCategory } = Subject;

        if( SubjectIdLocation == item.Subject.SubjectId ){
            current_swiper = index;
        }
        subject_obj = setFillBacks_Analysis(item, exaSubjectRecords)  //最后一个参数标记是不是选择类型
        return subject_obj;
    })
    return { already_get: true, PassScore, SheetId, SheetName, SheetType, TotalScore, Subjects:new_subjects, State, SubjectIdLocation:'', current_swiper };
}


// 新练习 =》 答题卡数据
export const newExercisesAnswercard = function(_obj={}){
    let { SheetId, SheetName, BeginTime='', Subjects, State, SubjectIdLocation } = _obj;
    let result={ SubjectRecords:[], Sheet_Id:SheetId, SheetName, State, BeginTime, SubjectIdLocation };
    //f4d10bd1-8fcc-11e8-9cca-00163e0f085f
    result.StudentId = '';
    //开始时间 暂用
    result.BeginTime = '2018-11-26 00:00:00';
    //结束时间 暂用
    result.EndTime = '';
    //最后确认时间
	result.LastReviewTime='';
    // app传过来
    result.SourceId = '370202e7-bf27-4131-8af6-b2e8ba2b7308';
    result.SourceType='7';
    result.SourceName='';
    //产品ID （可为空）
    result.ProductHistoryId='38666dd9-9fe2-4efe-a1c3-e673447ad384';
    result.StudyPlanId='';
    result.StudyPlanArrangeId='8d32ab2e-896d-477b-81b0-b906f4977805';
    result.CourseHistoryId='015f354b-4747-41a3-92f5-e229824c3f2f';
    result.ChapterId = 'c08bd224-fb5c-40f4-bc7b-24b63f76463c';
    //班级ID （可为空）
    result.ClassId = 'c426bef3-47ac-4204-af7d-4e3840710ac5' ;
    Subjects.forEach( (item={})=>{
        let obj = cardSubjectRecords(item);
        //答案集合
        result.SubjectRecords.push(obj);
    })
    return result;
}

// 新练习--解析 =》 答题卡数据

export const  answercardExerciseAnalysis = function(_obj={}){
	let Subjects = _obj.Subjects || [];
	let Subjects_length = _obj.Subjects.length || '0';
	_obj.Subjects_length = Subjects_length;  // 作业总题数
	let result = _obj;
    return result;
}

















//考试列表
export const newTestData = function(obj={}, test_obj={Sheet:{}}){
    test_obj.Sheet = test_obj.Sheet||{};
	let Examinations = test_obj.Sheet.Examinations||[];
    let SubjectIdLocation = test_obj.Sheet.SubjectIdLocation||'';
    Examinations = Examinations[0]||{};
    let exaSubjectRecords = Examinations.SubjectRecords||null;
    let Sheet = obj.result||{};
    let State = 0;
    let current_swiper = 0;
    let { 
    	SheetId,
    	PassScore,
    	Is_FirstExam,
    	StartTime,
    	EndTime,
    	SheetName, 
    	SheetType, 
    	TotalScore,
    	NowTime,
    	Timing,
    	_SubjectList=[] 
    } = Sheet;
    
    let BeginTime = (StartTime+''||'').replace('T',' ');
    let EndTimes = (EndTime+''||'').replace('T',' ');
    let NowTimes = (NowTime+''||'').replace('T',' ');
//	let EndTime = (EndTime+''||'').replace('T',' ');
	let Sheet_Id = SheetId;
	
    let newSubjects = _SubjectList.filter( subj => {
    	let subjectCategory = subj.SubjectCategory*1;
    	return ([1,2,3,6,7,9,10,11].indexOf(subjectCategory) != -1);
    })
	//排序自定义字段
	
	newSubjects.map( (item, index) => {
		if(item.SubjectCategory == 1){
			item.Subject_Sorts = 1
		}else if(item.SubjectCategory == 2){
			item.Subject_Sorts = 2
		}else if(item.SubjectCategory == 9){
			item.Subject_Sorts = 3
		}else if(item.SubjectCategory == 6){
			item.Subject_Sorts = 4
		}else if(item.SubjectCategory == 3){
			item.Subject_Sorts = 5
		}else if(item.SubjectCategory == 7){
			item.Subject_Sorts = 6
		}else if(item.SubjectCategory == 10){
			item.Subject_Sorts = 7
		}else if(item.SubjectCategory == 11){
			item.Subject_Sorts = 8
		}
	})
    // 排序
	newSubjects.sort((a={}, b={}) =>( (sort_obj[a.SubjectCategory]*9000+a.Subject_Sorts*1) - (sort_obj[b.SubjectCategory]*9000+b.Subject_Sorts*1) ))
	let subject_obj = {};
    let new_subjects = newSubjects.map( (item, index) => {
		if( SubjectIdLocation == item.SubjectId ){
            current_swiper = index;
        }
        subject_obj = setFillTestBacks(item,exaSubjectRecords)  //最后一个参数标记是不是选择类型
        return subject_obj;
    })
    return { already_get: true, Timing,Is_FirstExam,BeginTime,NowTimes,EndTimes,Sheet_Id, PassScore, SheetId, SheetName, SheetType, TotalScore, Subjects:new_subjects, State, SubjectIdLocation:'', current_swiper };

}

//  考试试题每项数据过滤、
function setFillTestBacks( item={}, exaSubjectRecords ){
	
//	return;
    let { Subject={}} = item;
    let { Description='', _SAnswerOptionList=[],SubjectCategory, SubjectId, SubjectName,Score} = item;
	
	
	//是否收藏的状态 //,selected=false 手动添加的后续后台配置时设置为空即可
	let selected = item.SubjectCollection || false;
	
    Description = decodeURIComponent(Description)||'';
    let answer_obj = {};
    if(exaSubjectRecords){
        answer_obj = exaSubjectRecords.find( function(exaSubjectRecord){
            return (exaSubjectRecord.Subject_Id == SubjectId);
        });
        answer_obj = answer_obj||{};
        answer_obj.SubjectRecordSAnswerOptions = answer_obj.SubjectRecordSAnswerOptions||[];
    }
    
    let SubjectRecordId = answer_obj.SubjectRecordId||'';
	
//  let { Options } = _SAnswerOptionList;  //几个选项
    let new_options = [], subject_answer= '';
    if( SubjectCategory == 3 || SubjectCategory == 7 || SubjectCategory == 10 || SubjectCategory == 11 || SubjectCategory == 8){//同一模板
    	if(answer_obj.Answer){
    		subject_answer = (decodeURIComponent(answer_obj.Answer)+'').trim()||''
    	}
    }else{
		new_options = _SAnswerOptionList.map( function(option){
        	let { Content, Prefix, SAnswerOptionId } = option;
	        let subject_fill = '';     //这道题填写的答案
	        let is_select = false;  //标记是否选中
	        if(exaSubjectRecords){
	            if(SubjectCategory==1 || SubjectCategory==9 || SubjectCategory==2 ){   // 是选择类型 
	                is_select = (answer_obj.SubjectRecordSAnswerOptions.some( option_slect => (option_slect.SAnswerOption_Id == SAnswerOptionId ) ));
	            }else if(SubjectCategory==6){//填空类型
	            	answer_obj.SAnswerOptionExtendeds.forEach( answerOptionExtended =>{
	            		if(answerOptionExtended.SAnswerOption_Id==SAnswerOptionId){
	            			subject_fill = decodeURIComponent(answerOptionExtended.Answer);
	            		}
	            	})
	            }else{
	                subject_fill = decodeURIComponent(answer_obj.Answer)||'';
	            }
	        }
	        
	        Content = decodeURIComponent(Content)||'';
	        return { Content, Prefix, SAnswerOptionId, subject_fill, is_select };
	    })
    }
    return { Description,SubjectId, SubjectCategory, Options:new_options, subject_answer ,SubjectRecordId, selected,Score};
}


// 新练考试=》 答题卡数据
export const newTestAnswercard = function(_obj={}){
    let { SheetId, SheetName, BeginTime='', Subjects, State, SubjectIdLocation,EndTimes,NowTimes ,Timing,Is_FirstExam} = _obj;
    let result={ SubjectRecords:[], Sheet_Id:SheetId, SheetName, State, SubjectIdLocation };
    //f4d10bd1-8fcc-11e8-9cca-00163e0f085f
    result.StudentId = '';
    //结束时间 暂用
    result.EndTime = EndTimes || '';
    result.NowTime = NowTimes || '';
    result.BeginTime = BeginTime || '';
    result.Timing = Timing;
    result.Is_FirstExam = Is_FirstExam;
    //最后确认时间
	result.LastReviewTime='';
    // app传过来
    result.SourceId = '370202e7-bf27-4131-8af6-b2e8ba2b7308';
    result.SourceType='7';
    result.SourceName='';
    //产品ID （可为空）
    result.ProductHistoryId='38666dd9-9fe2-4efe-a1c3-e673447ad384';
    result.StudyPlanId='';
    result.StudyPlanArrangeId='8d32ab2e-896d-477b-81b0-b906f4977805';
    result.CourseHistoryId='015f354b-4747-41a3-92f5-e229824c3f2f';
    result.ChapterId = 'c08bd224-fb5c-40f4-bc7b-24b63f76463c';
    //班级ID （可为空）
    result.ClassId = 'c426bef3-47ac-4204-af7d-4e3840710ac5' ;
    Subjects.forEach( (item={})=>{
        let obj = cardSubjectRecords(item);
        //答案集合
        result.SubjectRecords.push(obj);
    })
    return result;
}









