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
<!-- JS编写数据表格 -->
<script type="text/javascript">
	$(function(){
		// 数据表格
		$("#grid").datagrid({
			url: 'data.json', // 加载远程数据
			rownumbers: true, // 行号显示
			pagination :true, // 分页工具条
			// 表头信息
			columns: [[
				{
					title:'编号',
					field:'id',
					checkbox :true
				},
				{
					title:'名称',
					field:'name',
					width:200
				},
				{
					title:'价格',
					field:'price'
				}
			]],
			// 工具栏 
			toolbar: [
				{
					id:'add', // 属性id
					text:'添加', // 显示按钮上文本
					iconCls:'icon-add', // 图标
					handler: function(){ // 点击后的事件函数
						alert("添加数据");
					}
				}
			] 
		});
	});

</script>	
</head>
<body>
	<h1>使用JS编写数据表格</h1>
	<table id="grid"></table>
	<table class="easyui-datagrid" 
		data-options="url:'data.json',rownumbers:true,pagination:true,toolbar:'#menu'">
		<thead>
			<tr>
				<th data-options="field:'id',checkbox:true">编号</th>
				<th data-options="field:'name',width:200">名称</th>
				<th data-options="field:'price'">价格</th>
			</tr>
		</thead>
	</table>
	
	<div id="menu">
		<a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-add'">添加</a>
		<!-- plain:true 嵌入表格上， iconCls 设置图标样式 -->
		<a href="javascript:void(0)" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">修改</a>
		<a href="javascript:void(0)" >删除</a>
	</div>
</body>
</html>