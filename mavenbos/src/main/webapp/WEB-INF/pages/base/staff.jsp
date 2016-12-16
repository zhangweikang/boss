<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
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
	function doAdd(){
		//alert("增加...");
		$('#addStaffWindow').window("open");
	}
	
	function doView(){
		alert("查看...");
	}
	
	function doDelete(){
		// 可以使用 datagrid的方法 
		var rows = $("#grid").datagrid('getSelections');
		if(rows.length == 0){
			// 用户没有选中 
			$.messager.alert('警告','作废取派员前，至少要选中一个取派员','warning');
			return ;
		}
		
		// 将多选的id ，转换字符串 ，","分隔 
		var array = new Array();
		for(var i=0; i<rows.length; i++){
			array.push(rows[i].id);
		}
		var ids = array.join(",");
		
		// 发起Ajax请求， 将ids提交给服务器
		$.post("${pageContext.request.contextPath}/staff_delbatch.action",{"ids":ids},function(data){
			// 提示
			$.messager.alert('信息','作废成功','info');
			
			// 刷新表格 
			$("#grid").datagrid('reload');
			
			// 去掉勾选
			$("#grid").datagrid('uncheckAll');
		});
	}
	
	function doRestore(){
		alert("将取派员还原...");
	}
	//工具栏
	var toolbar = [ {
		id : 'button-view',	
		text : '查询',
		iconCls : 'icon-search',
		handler : doView
	}, {
		id : 'button-add',
		text : '增加',
		iconCls : 'icon-add',
		handler : doAdd
	}, {
		id : 'button-delete',
		text : '作废',
		iconCls : 'icon-cancel',
		handler : doDelete
	},{
		id : 'button-save',
		text : '还原',
		iconCls : 'icon-save',
		handler : doRestore
	}];
	// 定义列
	var columns = [ [ {
		field : 'id',
		checkbox : true,
	},{
		field : 'name',
		title : '姓名',
		width : 120,
		align : 'center'
	}, {
		field : 'telephone',
		title : '手机号',
		width : 120,
		align : 'center'
	}, {
		field : 'haspda',
		title : '是否有PDA',
		width : 120,
		align : 'center',
		formatter : function(data,row, index){
			// data 是返回json中 匹配当前属性 的值  ，在这里是 1 或者 0
			// row 代表整行 数据js对象 
			// index 行号，第几行 
			if(data=="1"){
				// 返回值，就是表格中显示的内容 
				return "有"; 
			}else{
				return "无";
			}
		}
	}, {
		field : 'deltag',
		title : '是否作废',
		width : 120,
		align : 'center',
		formatter : function(data,row, index){
			if(data=="0"){
				return "正常使用"
			}else{
				return "已作废";
			}
		}
	}, {
		field : 'standard',
		title : '取派标准',
		width : 120,
		align : 'center'
	}, {
		field : 'station',
		title : '所谓单位',
		width : 200,
		align : 'center'
	} ] ];
	
	$(function(){
		// 先将body隐藏，再显示，不会出现页面刷新效果
		$("body").css({visibility:"visible"});
		
		// 取派员信息表格
		$('#grid').datagrid( {
			iconCls : 'icon-forward',
			fit : true,
			border : false,
			rownumbers : true,
			striped : true,
			pageList: [2,3,4],
			pagination : true,
			toolbar : toolbar,
			url : "${pageContext.request.contextPath}/staff_pagequery.action",
			idField : 'id',
			columns : columns,
			onDblClickRow : doDblClickRow
		});
		
		// 添加取派员窗口
		$('#addStaffWindow').window({
	        title: '添加取派员',
	        width: 400,
	        modal: true,
	        shadow: true,
	        closed: true,
	        height: 400,
	        resizable:false,
	        onBeforeClose: clearStaffForm
	    });
		
		// 取派员form的save按钮事件
		$("#save").click(function(){
			if($("#staffForm").form('validate')){
				// 所有字段有效 
				$("#staffForm").submit();
			}
		});
	});

	function doDblClickRow(rowIndex,rowData){
		// rowIndex 点击第几行、 rowData 该行数据 
		
		// 弹出修改取派员信息窗口 
		$("#addStaffWindow").window('open');
		
		// form 回显
		$("#staffForm").form('load',rowData);
	}
	
	// 自定义验证规则 
	$.extend($.fn.validatebox.defaults.rules, { 
		// telephone 校验规则名字
		telephone: { 
			// 校验函数 value 当前用户输入的内容， param 传入规则参数 
			validator: function(value,param){ 
				// 手机号 11位数字 
				var regex = /^1[3|4|5|7|8|]\d{9}$/;
				return regex.test(value);
			}, 
			message: '手机号必须为 13、14、15、17、18开头的11位数字' 
		} 
	}); 

	// 清空添加取派员表单 
	function clearStaffForm(){
		// 调用DOM方法 清空表单
		$("#staffForm").get(0).reset();
		
		// 清除 id
		$("input[name='id']").val('');
		
		// jquery easyui 清空
		// $("#staffForm").form('clear');
	}
	
</script>
</head>
<body class="easyui-layout" style="visibility:hidden;">
	<div region="center" border="false">
    	<table id="grid"></table>
	</div>
	<div class="easyui-window" title="对收派员进行添加或者修改" 
		id="addStaffWindow" collapsible="false" minimizable="false" maximizable="false" style="top:20px;left:200px">
		<div region="north" style="height:31px;overflow:hidden;" split="false" border="false" >
			<div class="datagrid-toolbar">
				<a id="save" icon="icon-save" href="javascript:void(0)" class="easyui-linkbutton" plain="true" >保存</a>
			</div>
		</div>
		
		<div region="center" style="overflow:auto;padding:5px;" border="false">
			<form id="staffForm" method="post"
				action="${pageContext.request.contextPath }/staff_save.action" >
				<table class="table-edit" width="80%" align="center">
					<tr class="title">
						<td colspan="2">收派员信息</td>
					</tr>
					<!-- TODO 这里完善收派员添加 table -->
<!-- 					<tr> -->
<!-- 						<td>取派员编号</td> -->
<!-- 						<td><input type="text" name="id"  -->
<!-- 							class="easyui-validatebox" data-options="required:true"/></td> -->
<!-- 					</tr> -->
					<tr>
						<td>姓名</td>
						<td>
						<!-- 隐藏取派员编号 -->
						<input type="hidden" name="id" />
						<input type="text" name="name" 
							class="easyui-validatebox" data-options="required:true,validType:'length[2,6]'"/></td>
					</tr>
					<tr>
						<!-- 输入11位数字 ，自定义规则 -->
						<td>手机</td>
						<td><input type="text" name="telephone" 
							class="easyui-validatebox" data-options="required:true,validType:'telephone'"/></td>
					</tr>
					<tr>
						<td>单位</td>
						<td><input type="text" name="station" /></td>
					</tr>
					<tr>
						<td colspan="2">
						<input type="checkbox" name="haspda" value="1" />
						是否有PDA</td>
					</tr>
					<tr>
						<td>取派标准</td>
						<td>
							<input type="text" name="standard" class="easyui-validatebox" required="true"/>  
						</td>
					</tr>
					</table>
			</form>
		</div>
	</div>
</body>
</html>	