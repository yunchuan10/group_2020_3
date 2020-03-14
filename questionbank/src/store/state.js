/*
状态对象
 */
export default {

    // 公共模块
    app: {
        toarist_confirm: false,
        toarist_confirm_ts:true,
        toarist_confirm_td:false,
        toarist_alert: false,
        
    },
	




    //考试成功
    test_submit_sucess:false,
    //考试列表
    new_test_data: { Subjects:[], already_get: false, State:0,SubjectIdLocation:'', current_swiper:0 },
    //考试提交列表
    new_test_data_submint: { Subjects:[], already_get: false, State:0,SubjectIdLocation:'', current_swiper:0 },

}