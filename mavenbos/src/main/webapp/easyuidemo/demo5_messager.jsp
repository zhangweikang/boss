<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<!-- jquery -->
<script type="text/javascript" 
	src="${pageContext.request.contextPath }/js/jquery-1.8.3.js"></script>
<!-- jquery easyui  -->
<script type="text/javascript" 
	src="${pageContext.request.contextPath }/js/easyui/jquery.easyui.min.js"></script>
<!-- easyui 国际化 js -->
<script type="text/javascript" 
	src="${pageContext.request.contextPath }/js/easyui/locale/easyui-lang-zh_CN.js"></script>
<!-- 主题 css样式  -->
<link rel="stylesheet" type="text/css" 
	href="${pageContext.request.contextPath }/js/easyui/themes/default/easyui.css" />
<!-- 图标css  -->	
<link rel="stylesheet" type="text/css" 
	href="${pageContext.request.contextPath }/js/easyui/themes/icon.css" />
<script type="text/javascript">
	$(function(){
		// 1、 警告框 
		// $.messager.alert("标题","内容","error");
		
		// 2、确认框
		/*
		$.messager.confirm("问你","想好了吗？",function(r){
			// 用户选择确认 r是 true，选择取消 r是false
			if(r){
				alert("确实想好了！");
			}
		});
		*/
		
		// 3、 输入框
		/*
		$.messager.prompt("问题","你的生日是什么？",function(msg){
			// msg 用户输入的内容
			alert(msg);
		});
		*/
		
		// 4、 弹出窗口
		/*
		$.messager.show({
			title:'大促销',
			msg : '淘宝买电脑不要钱了<br/>详情请猛戳 <a href="http://www.taobao.com">这里</a>',
			timeout: 5000
		});
		*/
		
		// 5、 进度条
		$.messager.progress({
			// 多少毫秒 10%
			interval:1000
		});
		// 3秒后 ，加载完数据 
		window.setTimeout("$.messager.progress('close');",3000);
	});
</script>	
</head>
<body>
	
</body>
</html>