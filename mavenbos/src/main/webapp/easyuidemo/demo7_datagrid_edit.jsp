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
		var index ; 
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
					width:200,
					editor : {
						// 编辑框类型 
						type:'validatebox', //文本校验框
						options: {
							required: true
						}
					}
				},
				{
					title:'价格',
					field:'price'
				}
			]],
			// 在endEdit 时被调用 
			onAfterEdit : function(rowIndex, rowData, changes){
				alert('编辑完成！！！！');
			},
			// 工具栏 
			toolbar: [
				{
					id:'add', // 属性id
					text:'添加', // 显示按钮上文本
					iconCls:'icon-add', // 图标
					handler: function(){ // 点击后的事件函数
						$("#grid").datagrid('insertRow',{
							index : 0, // 第一行 
							row : {
								id: '100',
								name: '联想笔记本',
								price: 5999
							}
						});
					}
				},
				{
					id:'edit', // 属性id
					text:'编辑选中行', // 显示按钮上文本
					iconCls:'icon-edit', // 图标
					handler: function(){ // 点击后的事件函数
						// 将选中这行，打开编辑状态 
						var row = $("#grid").datagrid('getSelected');
						if(row != null){
							index = $("#grid").datagrid('getRowIndex',row); // 行号
							$("#grid").datagrid('beginEdit',index); // 打开编辑状态
						}
					}
				},
				{
					id:'save', // 属性id
					text:'结束编辑', // 显示按钮上文本
					iconCls:'icon-save', // 图标
					handler: function(){ // 点击后的事件函数
						// 结束编辑
						$("#grid").datagrid('endEdit',index);
					}
				},
				{
					id:'cancel', // 属性id
					text:'取消编辑', // 显示按钮上文本
					iconCls:'icon-cancel', // 图标
					handler: function(){ // 点击后的事件函数
						// 结束编辑
						$("#grid").datagrid('cancelEdit',index);
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
</body>
</html>