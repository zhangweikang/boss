<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<!-- 流程图 -->
	<img src="${pageContext.request.contextPath }/processdefinition_viewpng.action?id=${pdId}" 
		style="position: absolute;top: 1px;left: 1px"/>
	<!-- 标记框 -->
	<div style="border-color: red;border-style:solid;border-width:thin;
		width: ${graphicInfo.width}px;height: ${graphicInfo.height}px;
		position: absolute; left: ${graphicInfo.x}px; top: ${graphicInfo.y}px;"></div>
</body>
</html>