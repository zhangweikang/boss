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
<!-- ztree -->
<script type="text/javascript" 
	src="${pageContext.request.contextPath }/js/ztree/jquery.ztree.all-3.5.js"></script>
<!-- ztree样式  -->	
<link rel="stylesheet" type="text/css" 
	href="${pageContext.request.contextPath }/js/ztree/zTreeStyle.css" />
	
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
		// 生成ztree 
		// -------------------- 标准json数据 
		// 进行ztree 设置 
		var settings = {};
		
		// 准备json数据 （标准）
		var zNodes = [
		    {name:'搜索引擎公司', children:[
				{name:'百度',icon:'${pageContext.request.contextPath}/js/ztree/img/diy/5.png'} , // 一个对象代表一个节点 ，name属性是必须写的             
				{name:'谷歌',icon:'${pageContext.request.contextPath}/js/ztree/img/diy/6.png'}                    
		   	]},
			{name:'新浪'} ,
			{name:'搜狐', url:'http://www.sohu.com.cn'} 
		] ; 
		
		// 生成ztree 
		$.fn.zTree.init($("#standardZtree"), settings, zNodes);
		
		// -------------------------- 简单json数据 
		// 进行ztree 设置
		var settings2 = {
			data : {
				simpleData: {
					enable :true 
				}
			},
			callback : { // 所有事件
				onClick : function(event, treeId, treeNode, clickFlag){
					// event 事件、treeId 节点id属性， treeNode 节点数据， clickFlag 点击标识 
					if(treeNode.page != undefined){
						// 存在page属性，生成tabs 选项卡
						// 判断 选项卡是否存在，如果存在，切换选项卡 
						if($("#mytabs").tabs('exists',treeNode.name)){
							// 存在 ，切换
							$("#mytabs").tabs('select',treeNode.name);
						}else{
							// 不存在，新加选项卡
							$("#mytabs").tabs('add',{
								title: treeNode.name,
								content: '<div style="width:100%;height:100%;overflow:hidden;">'
									+ '<iframe src="'
									+ treeNode.page
									+ '" scrolling="auto" style="width:100%;height:100%;border:0;" ></iframe></div>',
								closable:true
							});
						}
					}
				}
			}
				
		};
		// 节点数据
		var zNodes2 = [
			{name:'友情链接',id:1, pId:0}, // 0不存在，没有父节点
			{name:'百度',id:11,pId:1,page:'http://www.baidu.com'}, // 父节点是编号1的节点
			{name:'门户站点',id:2, pId:0}
		];
		
		// 生成ztree
		$.fn.zTree.init($("#simpleZtree"), settings2, zNodes2);
		
	});
</script>	
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
			<div title="面板一">
				<!-- 标准json数据ztree -->
				<ul id="standardZtree" class="ztree"></ul>
			</div>
			<div data-options="title:'面板二'"> 
				<!-- 简单json数据 ztree -->
				<ul id="simpleZtree" class="ztree"></ul>
			</div>
			<div data-options="title:'面板三'">选项卡三</div>
		</div>
	</div>
	<div data-options="region:'center'">
		<!-- 选项卡菜单 -->
		<!-- 添加 fit=true 属性，使当前控件 ，占满父容器区域 -->
		<!-- closable 可以使面板可以被关闭 -->
		<div id="mytabs" class="easyui-tabs" data-options="fit:true">
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