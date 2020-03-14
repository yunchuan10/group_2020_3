/*
    包含n个接口请求函数的模块,函数的返回值: promise对象
 */

import ajax from './ajax'


// 测试api 考试接口
export const GetTest = ( obj ) => ajax(
	{
		url:'/exam?SheetId=' + obj.data.id+'&UserId='+ obj.data.UserId,
		type:obj.type
	}
)

// 测试api 考试提交接口
export const Getsubmit = ( obj ) => ajax(
	{
		url:'/exam',
		type:obj.type,
		data:obj.data
	}
)

// 提交练习答题卡
export const subHomework = ( obj ) => ajax(
	{
        url:'/homework',
        data:obj.data,
		type:obj.type
	}
)


// 测试api 练习接口
export const exercises = ( obj ) => ajax(
	{
		url:'/homework?id=' + obj.data.id + "&UserId=" + obj.data.UserId,
		type:obj.type
	}
)


// 测试api //试卷答题解析  暂时先用斜杠 后期改动
export const analysis = ( obj ) => ajax(
	{
		url:'/exam/result?SheetId=' + obj.data.SheetId + '&ExamId='+ obj.data.ExamId,
		type:obj.type
	}
)




// 测试api //作业答题解析
export const testReport = ( obj ) => ajax(
	{
		url:'/homework?SheetId=' + obj.data.Sheet_Id + '&studentId='+ obj.data.StudentId
	}
)

// 测试api //作业答题解析--列表
export const testReportList = ( obj ) => ajax(
	{
		url:'/homeWork?ExamId=' + obj.data.ExamId 
	}
)













//临时的  //收藏--错题本--题目列表接口
export const coll_error = ( obj ) => ajax(
	{
		url:'/SubjectCollectionInfo',
		type:obj.type,
		data:obj.data
	}
)

// 测试api //收藏与否--错题本删除与否
export const collectionOrAndNo = ( obj ) => ajax(
	{
		url:'/SubjectCollection',
        data:obj.data,
		type:obj.type
	}
)


















