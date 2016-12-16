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
		$(":button").click(function(){
			$("#mywindow").window('open');
		});
	});
</script>	
</head>
<body>
	<!-- title 窗口标题，closed初始化关闭，modal 遮罩效果  -->
	<div id="mywindow" class="easyui-window" style="width: 150px;height: 80px" 
		data-options="title:'测试窗口',closed:true,modal:true">ABCDEFG</div>
		
	<input type="button" value="弹出窗口" />
</body>
</html>