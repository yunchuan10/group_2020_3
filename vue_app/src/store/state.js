/*
状态对象
 */
export default {

    // 公共模块
    app: {
        toarist_confirm: false,
        toarist_alert: false,
    },
	//窗口是否发生变化
	screenResize:false,
	screenResizeIos:false,
    //考试
    reseve_data:{
    	result:{},
    },
    //考试是否成功、
    testSuccess:-2,
    // 试卷报告
    report_data:{

    },

    // 作业解析
    test_report_data:{

    },

    //答题卡对象
    answercard_test:{

    },
    //答题卡对象
    set_answercard_test:{},
  	//解析--试卷报告
  	report_results:{},

	//考试提交成功
	submitSuc:false,



    //练习-exercise
    reseve_data_exercise:{
    	Sheet: {},
    },
    //练习-答题卡对象
    answercard_exercise:{},
    //练习-答题卡对象
    set_answercard_exercise:{},




    // 新的练习对象
    new_exercises_data: { Subjects:[], already_get: false, State:0,SubjectIdLocation:'', current_swiper:0 },
    
    //练习答题卡提交对象
    new_exercises_data_submint: { Subjects:[], already_get: false, State:0,SubjectIdLocation:'', current_swiper:0 },
    // 新的练习对象--解析
    new_exercises_analysis: { Subjects:[], already_get: false, State:0,SubjectIdLocation:'', current_swiper:0 },
    
    
    
 //
  studentId: '' ,
  //练习中的变量答题区域显示与隐藏
  flags: true,
  //练习答案分析中的变量答题区域显示与隐藏
  flags_exercise_analysis: true,
  //考试中的变量答题区域显示与隐藏
  flags_test: true,
  //考试答案分析中的变量答题区域显示与隐藏
  flags_test_analysis: true,
  
  
  
  
  

  
  
  
  //收藏-错题集--解析
  collection_analysis: { Subjects:[], already_get: false, State:0,SubjectIdLocation:'', current_swiper:0 },
  // 收藏--错题集对象
  collection_data: { Subjects:[], already_get: false, State:0,SubjectIdLocation:'', current_swiper:0 },
  
  //错题集部分数据
  error_analysis: { Subjects:[], already_get: false, State:0,SubjectIdLocation:'', current_swiper:0 },
  
  
  
  //控制提示框特殊字符弹框
  special_chart:false
}