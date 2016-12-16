<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>工作单快速录入</title>
<!-- 导入jquery核心类库 -->
<script type="text/javascript"
	src="${pageContext.request.contextPath }/js/jquery-1.8.3.js"></script>
<!-- 导入easyui类库 -->
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath }/js/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath }/js/easyui/themes/icon.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath }/js/easyui/ext/portal.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath }/css/default.css">	
<script type="text/javascript"
	src="${pageContext.request.contextPath }/js/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/js/easyui/ext/jquery.portal.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/js/easyui/ext/jquery.cookie.js"></script>
<script
	src="${pageContext.request.contextPath }/js/easyui/locale/easyui-lang-zh_CN.js"
	type="text/javascript"></script>
<script type="text/javascript">
	// 全局变量， 存放当前正在编辑行 index 
	var editIndex ;
	
	function doAdd(){
		// 判断当前是否 正在编辑 
		if(editIndex != undefined){
			// 正在编辑 
			$("#grid").datagrid('endEdit',editIndex);// 结束编辑 、
			// 重置index 代码 在 onAfterEdit 中 
		}
		// 判断当前是否正在编辑 
		if(editIndex==undefined){
			//当前没有正在编辑 
			// 插入一个空白行 
			$("#grid").datagrid('insertRow',{
				index : 0,
				row : {}
			});
			// 开启编辑状态 
			$("#grid").datagrid('beginEdit',0);
			// 记录当前编辑的行号 
			editIndex = 0;
		}
	}
	
	function doSave(){
		$("#grid").datagrid('endEdit',editIndex );
	}
	
	function doCancel(){
		if(editIndex!=undefined){
			$("#grid").datagrid('cancelEdit',editIndex);
			if($('#grid').datagrid('getRows')[editIndex].id == undefined){
				$("#grid").datagrid('deleteRow',editIndex);
			}
			editIndex = undefined;
		}
	}
	
	//工具栏
	var toolbar = [ {
		id : 'button-add',	
		text : '新增一行',
		iconCls : 'icon-edit',
		handler : doAdd
	}, {
		id : 'button-cancel',
		text : '取消编辑',
		iconCls : 'icon-cancel',
		handler : doCancel
	}, {
		id : 'button-save',
		text : '保存',
		iconCls : 'icon-save',
		handler : doSave
	}];
	// 定义列
	var columns = [ [ {
		field : 'id',
		title : '工作单号',
		width : 120,
		align : 'center',
		editor :{
			type : 'validatebox',
			options : {
				required: true
			}
		}
	}, {
		field : 'arrivecity',
		title : '到达地',
		width : 120,
		align : 'center',
		editor :{
			type : 'validatebox',
			options : {
				required: true
			}
		}
	},{
		field : 'product',
		title : '产品',
		width : 120,
		align : 'center',
		editor :{
			type : 'validatebox',
			options : {
				required: true
			}
		}
	}, {
		field : 'num',
		title : '件数',
		width : 120,
		align : 'center',
		editor :{
			type : 'numberbox',
			options : {
				required: true
			}
		}
	}, {
		field : 'weight',
		title : '重量',
		width : 120,
		align : 'center',
		editor :{
			type : 'validatebox',
			options : {
				required: true
			}
		}
	}, {
		field : 'floadreqr',
		title : '配载要求',
		width : 220,
		align : 'center',
		editor :{
			type : 'validatebox',
			options : {
				required: true
			}
		}
	}] ];
	
	$(function(){
		// 先将body隐藏，再显示，不会出现页面刷新效果
		$("body").css({visibility:"visible"});
		
		// 工作单数据表格
		$('#grid').datagrid( {
			iconCls : 'icon-forward',
			fit : true,
			border : true,
			rownumbers : true,
			striped : true,
			pageList: [30,50,100],
			pagination : true,
			toolbar : toolbar,
			url :  "${pageContext.request.contextPath}/workordermanage_pagequery.action",
			idField : 'id',
			columns : columns,
			onDblClickRow : doDblClickRow,
			// endEdit 触发函数 
			onAfterEdit : function(rowIndex, rowData, changes){
				// 发起Ajax请求，将编辑好的数据，发给服务器, 执行save操作 
				$.post("${pageContext.request.contextPath}/workOrderManage_save.action", 
						rowData, function(data){
					$.messager.alert('信息','保存成功','info');
				});
				
				// 重置正在编辑行 索引 
				editIndex = undefined;
			}
		});
	});

	function doDblClickRow(rowIndex, rowData){
		alert("双击表格数据...");
		console.info(rowIndex);
		$('#grid').datagrid('beginEdit',rowIndex);
		editIndex = rowIndex;
	}
	
	// 执行搜索
	function doSearch(value,name){
		// value 输入搜索内容
		// name 选择下拉项 name属性 
		
		// 与datagrid 结合
		$("#grid").datagrid('load', {
			conditionName: name, 
			conditionValue: value
		});
	}
</script>
</head>
<body class="easyui-layout" style="visibility:hidden;">
	<!-- 北部 区域 提供 搜索框 -->
	<div data-options="region:'north'">
		<input class="easyui-searchbox" data-options="menu:'#mm',prompt:'请输入您的搜索内容',searcher:doSearch"/>
		<div id="mm">
			<!-- 每个下拉项提供 name属性  -->
			<div data-options="name:'arrivecity'">按到达地搜索</div>
			<div data-options="name:'product'">按货物搜索</div>
		</div>
	</div>
	<div region="center" border="false">
    	<table id="grid"></table>
	</div>
</body>
</html>