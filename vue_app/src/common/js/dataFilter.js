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

//去除thml标签
function repalceHtml(str){
	var dd=str.replace(/<\/?.+?>/g,"");
	var dds=dd.replace(/ /g,"");//dds为得到后的内容
	return dds;
}
//  每项数据过滤、
function setFillBacks( item={}, exaSubjectRecords ){
    let { Subject={} } = item;
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
    		subject_answer = repalceHtml((decodeURIComponent(answer_obj.Answer)+'').trim())||''
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
	            			subject_fill = repalceHtml(decodeURIComponent(answerOptionExtended.Answer));
	            		}
	            	})
	            }else{
	                subject_fill = (repalceHtml(decodeURIComponent(answer_obj.Answer))||'');
	            }
	        }
	        
	        Content = decodeURIComponent(Content)||'';
	        return { Content, Prefix, SAnswerOptionId, subject_fill, is_select };
	    })
    }
    return { Description, SubjectId, SubjectCategory, SubjectCategoryName, Options:new_options, subject_answer ,SubjectRecordId, selected};
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
	            if(SubjectCategory==1 || SubjectCategory==9 || SubjectCategory==2 ){   // 是选择类型 
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

    // 排序
//  Subjects.sort((a={}, b={}) =>(a.Subject_Order - b.Subject_Order))
//  Subjects.sort((a={}, b={}) =>(sort_obj[a.Subject.SubjectCategory] - sort_obj[b.Subject.SubjectCategory]))
newSubjects.sort((a={}, b={}) =>( (sort_obj[a.Subject.SubjectCategory]*9000+a.Subject_Order*1) - (sort_obj[b.Subject.SubjectCategory]*9000+b.Subject_Order*1) ))

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
	newSubjects.sort((a={}, b={}) =>( (sort_obj[a.Subject.SubjectCategory]*9000+a.Subject_Order*1) - (sort_obj[b.Subject.SubjectCategory]*9000+b.Subject_Order*1) ))

	
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










// 过滤新的收藏-错题集对象--解析
export const coll_error_AnalysisData = function(obj={}){
	
    let current_swiper = 0;
    let Subjects = obj.result;
    
    let newSubjects = Subjects.filter( subj => {
    	let SubjectCategory = subj.SubjectCategory*1;
    	return ([1,2,3,6,7,9,10,11].indexOf(SubjectCategory) != -1);
    })
    
	
    let new_subjects = newSubjects.map( (item, index) => {
    	
    	
        let { Subject={} } = item, subject_obj = {};
        let { SubjectCategory } = Subject;

        subject_obj = setFillBacks_coll_error_Analysis(item)  //最后一个参数标记是不是选择类型
        return subject_obj;
    })
    return { already_get:true,Subjects:new_subjects, SubjectIdLocation:'', current_swiper };
}

// 过滤新的收藏-错题集选项--解析
function setFillBacks_coll_error_Analysis( item={} ){
    let Subject={} = item;
   	//对单选/复选/判断/填空---进行选项的排序
    if(Subject.SubjectCategory==1 || Subject.SubjectCategory==9 || Subject.SubjectCategory==2 || Subject.SubjectCategory == 6){   // 是选择类型 
    	Subject.SAnswerOption.sort((a={}, b={}) =>( a.Order*1 - b.Order*1 ))
    }
    
    let { Description='', SheetId ,Analysis='',  SAnswerOption=[], SubjectCategory, SubjectId,SubjectRecordAnswer='' ,SheetName,Remark ,Comment=''} = Subject;
	
	//是否收藏的状态 //,selected=false 手动添加的后续后台配置时设置为空即可
	let selected = item.SubjectCollection || false;
	//试题到那个位置 答题卡到那个位置 默认为第一题
	let swiper_number = 0;
	//题目主干描述
    Description = decodeURIComponent(Description)||'';
   	// 答案解析
    Analysis = decodeURIComponent(Analysis)||'';
    // 参考答案
    Remark = decodeURIComponent(Remark)||'';
    //教师评语
    Comment = decodeURIComponent(Comment)||'';
    //几个选项
    let Options  = SAnswerOption;  
    let new_options = [], subject_answer= '', select_str='', answer_str='',Score='';

    if( SubjectCategory == 3 || SubjectCategory == 7 || SubjectCategory == 10 || SubjectCategory == 11 || SubjectCategory == 8){//同一模板
    	//简答题/问答题等问题答案
    	if(SubjectRecordAnswer == null){
    		subject_answer = ''
    	}else{
    		subject_answer = repalceHtml((decodeURIComponent(SubjectRecordAnswer)+'').trim())||''
    	}
		
    	
    }else{
		new_options = Options.map( function(option){		
        	let { Content, Prefix, IsAnser, SAnswerOptionId, SAnswerOptionAnswer,ExtendedAnswer } = option;
	        let subject_fill = '';     //这道题填写的答案
	        let is_select = false;  //标记是否选中
	        let c_type = '';  //标记是否选中

	            if(SubjectCategory==1 || SubjectCategory==9 || SubjectCategory==2 ){   // 是选择类型 
					if(option.SAnswerOptionId == option.SAnswerOptionAnswer){
						is_select = true;
					}
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
	          }else{
	          		if(ExtendedAnswer == null){
	          			subject_fill = '';
	          		}else{
	          			subject_fill = (repalceHtml(decodeURIComponent(ExtendedAnswer))||'');
	          		}
	                
	            }
	        Content = decodeURIComponent(Content)||'';
	        return { Content, Prefix, SAnswerOptionId, IsAnser, subject_fill, is_select,c_type};
	    })
   }
    return {Comment,swiper_number ,Remark ,SheetId, SheetName,Description, Analysis, SubjectId, SubjectCategory, Options:new_options, subject_answer,Comment,Score,select_str,answer_str ,selected};
} 

// 收藏-错题集-解析 =》 答题卡数据
export const  answercardCollectionErrorAnalysis = function(_obj={}){
	let Subjects = _obj.Subjects || [];
	let Subjects_length = _obj.Subjects.length || '0';
	_obj.Subjects_length = Subjects_length;  // 收藏总题数
	let result = _obj;
	
    return result;
}



//答题卡数据过滤----start
export const  FilterType = function(objs={}){
	let _arr_2 = [],
		singleCheck=[],          //单选题
		Check=[],				 //多选题
		singleQuestions=[],		 //问答题
		completion=[],			 //填空题
		judge=[],				 //判断题
		discuss=[],			 	//判断题
		analysis=[],			//解析
		interpretation=[],		//名词解释
		obj={};
		
		obj = objs ||{};
		if(obj !== {}){
	    	_arr_2 = obj.Subjects || obj.SubjectRecords||[];
	    }
	    for(var i=0;i<_arr_2.length;i++){
	    	if(_arr_2[i].SubjectCategory == 1 ){
	    		singleCheck.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 2 ){
	    		Check.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 3 ){
	    		singleQuestions.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 6 ){
	    		completion.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 7 ){
	    		interpretation.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 9 ){
	    		judge.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 10 ){
	    		analysis.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 11 ){
	    		discuss.push(_arr_2[i])
	    	}
	    }
	

	
    return {singleCheck,          //单选题
		Check,				 //多选题
		singleQuestions,		 //问答题
		completion,			 //填空题
		judge,				 //判断题
		discuss,			 //判断题
		analysis,			
		interpretation
    };
}





//考试答题卡数据过滤----start
export const  FilterTypeTest = function(objs={}){
	let _arr_2 = [],
		singleCheck=[],          //单选题
		Check=[],				 //多选题
		singleQuestions=[],		 //问答题
		completion=[],			 //填空题
		judge=[],				 //判断题
		discuss=[],			 	//判断题
		analysis=[],			//解析
		interpretation=[],		//名词解释
		obj={};
		
		obj = objs ||{};
		if(obj !== {}){
	    	_arr_2 = obj._SubjectList || obj.SubjectRecords ||[];
	    }
	    for(var i=0;i<_arr_2.length;i++){
	    	if(_arr_2[i].SubjectCategory == 1 ){
	    		_arr_2[i].SubjectCategoryName = '单选题';
//	    		_arr_2[i].Description = decodeURIComponent(_arr_2[i].Description).replace('<p><br/></p>','');
	    		singleCheck.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 2 ){
	    		_arr_2[i].SubjectCategoryName = '多选题';
//	    		_arr_2[i].Description = decodeURIComponent(_arr_2[i].Description).replace('<p><br/></p>','');
	    		Check.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 3 ){
	    		_arr_2[i].SubjectCategoryName = '问答题';
//	    		_arr_2[i].Description = decodeURIComponent(_arr_2[i].Description).replace('<p><br/></p>','');
	    		singleQuestions.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 6 ){
	    		_arr_2[i].SubjectCategoryName = '填空题';
//	    		_arr_2[i].Description = decodeURIComponent(_arr_2[i].Description).replace('<p><br/></p>','');
	    		completion.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 7 ){
	    		_arr_2[i].SubjectCategoryName = '名词解释';
//	    		_arr_2[i].Description = decodeURIComponent(_arr_2[i].Description).replace('<p><br/></p>','');
	    		interpretation.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 9 ){
	    		_arr_2[i].SubjectCategoryName = '判断题';
//	    		_arr_2[i].Description = decodeURIComponent(_arr_2[i].Description).replace('<p><br/></p>','');
	    		judge.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 10 ){
	    		_arr_2[i].SubjectCategoryName = '案例分析';
//	    		_arr_2[i].Description = decodeURIComponent(_arr_2[i].Description).replace('<p><br/></p>','');
	    		analysis.push(_arr_2[i])
	    	}
	    	if(_arr_2[i].SubjectCategory == 11 ){
	    		_arr_2[i].SubjectCategoryName = '论述题';
//	    		_arr_2[i].Description = decodeURIComponent(_arr_2[i].Description).replace('<p><br/></p>','');
	    		discuss.push(_arr_2[i])
	    	}
	    }
	

	
    return {singleCheck,          //单选题
		Check,				 //多选题
		singleQuestions,		 //问答题
		completion,			 //填空题
		judge,				 //判断题
		discuss,			 //判断题
		analysis,			
		interpretation
    };
}

//答题卡数据过滤----end