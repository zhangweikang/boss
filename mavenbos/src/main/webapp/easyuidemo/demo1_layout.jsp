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
</head>
<!-- 对整个body应用layout布局  -->
<body class="easyui-layout">
	<!-- 为每个div设置宽高，属于 easyui 布局中哪个区域 -->
	<!-- 通过region属性指定区域位置  -->
	<!-- 每个区域，可以通过title属性，设置标题 -->
	<div style="height: 100px" region="north" title="XXX公司物流核心管理系统">北部</div>
	<div style="width: 200px" data-options="region:'west',title:'系统菜单'">
		<!-- 折叠菜单 -->
		<!-- 添加 fit=true 属性，使当前控件 ，占满父容器区域 -->
		<div class="easyui-accordion" data-options="fit:true">
			<!-- 每个选项卡，就是一个子div  -->
			<!-- 每个选项卡，必须提供 title属性 -->
			<div title="面板一">选项卡一</div>
			<div data-options="title:'面板二'">选项卡二</div>
			<div data-options="title:'面板三'">选项卡三</div>
		</div>
	</div>
	<div data-options="region:'center'">
		<!-- 选项卡菜单 -->
		<!-- 添加 fit=true 属性，使当前控件 ，占满父容器区域 -->
		<!-- closable 可以使面板可以被关闭 -->
		<div class="easyui-tabs" data-options="fit:true">
			<!-- 每个选项卡，就是一个子div  -->
			<!-- 每个选项卡，必须提供 title属性 -->
			<div title="面板一">选项卡一</div>
			<div data-options="title:'面板二',closable:true">选项卡二</div>
			<div data-options="title:'面板三'">选项卡三</div>
		</div>
	</div>
	<div style="width: 80px" data-options="region:'east'">东部</div>
	<div style="height: 60px" data-options="region:'south'">南部</div>
</body>
</html>