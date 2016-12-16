/**
 * 选择营业部
 */
define("project/scripts/account/selDepartment",function(require, exports, module){ 
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
		   service = require("serviceImp").getInstance(),  //业务层接口，请求数据
	       global = require("gconfig").global,
	       layerUtils = require("layerUtils"),
	       shellPlugin = require("shellPlugin"),
	       provinceList = "",  //省份
		   cityList = "",  //城市
		   branchList = "",  //营业部
		   commissionList = "",  //佣金套餐
		   localPro = "",  // 本地省份
		   localCity = "",  // 本地城市
		   localBranch = "",  // 本地营业部
		   branchParam={ "branchno" : "", 
		                "commission" : ""},  //营业部编号
		   hasbranch = true,  // 判断定位的城市是否拥有营业部
		   _pageId = "#account_selDepartment";
	/* 私有业务模块的全局变量 end */
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		initPage();  // 初始化页面
		
		//查询客户是否与经纪人关联了，如果默认选择经纪人的营业部，否则默认显示自贸区营业部
		initBranch();
	}
	
	//初始化显示营业部
	function initBranch(){
		var mobileNo=appUtils.getSStorageInfo("mobileNo");
		var param  = "step=getBranchInfo&mobileNo="+mobileNo;
	    $.ajax({
	        type:'post',
	        url:global.serverToukerUrl+"/com.business.function.Function10001?"+param,
	        data:{ts:(new Date()).getTime()},
	        async: false,	//同步
	        cache:false,
	        dataType:'json',
	        success:function(data, resp, XMLHttpRequest){
	        	if(data.errorNo == 0){	//调用正常
	        		var branchNo = data.results.dataSet.branchNo;	
	        		var branchName = data.results.dataSet.branchName;	
	        		//console.log("branchNo="+branchNo+" branchName="+branchName);
	        		branchParam.branchno = branchNo;
					$(_pageId+" .sel_branch").html(branchName);
	        	}
	        }
	    });
	}
	
	function bindPageEvent()
	{
	   /* 绑定返回事件 */
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			appUtils.setSStorageInfo("backmsg", 1);
			var backUrl= appUtils.getPageParam("backUrl");
			if(backUrl){
				appUtils.pageInit("account/selDepartment",appUtils.getPageParam("backUrl"),{"backUrl":appUtils.getPageParam("backUrl")});
			}else if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
				if(navigator.userAgent.indexOf("Android") > 0) {
					require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
				}
				if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
					window.location.href="backClientSide";
				}
			}else{
				appUtils.pageInit("account/selDepartment","account/phoneNumberVerify",{});
			}
		});
		
		/* 点击页面其他元素隐藏下拉列表 */
		appUtils.bindEvent($(_pageId),function(e){
			$(_pageId+" .sel_list").slideUp("fast");	// 隐藏下拉列表
			e.stopPropagation();	// 阻止冒泡
		});
		
		/* 绑定选择省份 
		appUtils.bindEvent($(_pageId+" .mobile_form .sel_province"),function(e){
			$(_pageId+" .city").hide();  //隐藏城市列表
			$(_pageId+" .branch").hide();  //隐藏营业部列表
			$(_pageId+" .commission").hide();  //隐藏佣金列表
			$(_pageId+" .province ul li").removeClass("active");
			$(_pageId+" .province").slideToggle("fast");	 // 显示选择省份的下拉列表
			e.stopPropagation();	// 阻止冒泡
		});*/
		
		/* 绑定选择城市 
		appUtils.bindEvent($(_pageId+" .mobile_form .sel_city"),function(e){
			$(_pageId+" .province").hide();  //隐藏省份列表
			$(_pageId+" .branch").hide();  //隐藏营业部列表
			$(_pageId+" .commission").hide();  //隐藏佣金列表
			$(_pageId+" .city ul li").removeClass("active");
			$(_pageId+" .city").slideToggle("fast");	// 显示选择城市的下拉列表
			e.stopPropagation();	// 阻止冒泡
		});*/
		
		/* 绑定选择营业部 */
		appUtils.bindEvent($(_pageId+" .mobile_form .sel_branch"),function(e){
			$(_pageId+" .province").hide();  //隐藏省份列表
			$(_pageId+" .city").hide();  //隐藏城市列表
			$(_pageId+" .commission").hide();  //隐藏佣金列表
			$(_pageId+" .branch ul li").removeClass("active");
			$(_pageId+" .branch").slideToggle("fast");	// 显示选择营业厅的下拉列表
			e.stopPropagation();	// 阻止冒泡
		});
		/* 绑定选择佣金套餐 */
		appUtils.bindEvent($(_pageId+" .mobile_form .sel_commission"),function(e){
			$(_pageId+" .province").hide();  //隐藏省份列表
			$(_pageId+" .city").hide();  //隐藏城市列表
			$(_pageId+" .branch").hide();  //隐藏营业部列表
			$(_pageId+" .commission ul li").removeClass("active");
			$(_pageId+" .commission").slideToggle("fast");	// 显示选择营业厅的下拉列表
			e.stopPropagation();	// 阻止冒泡
		});
		
		/* 绑定下一步 */
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn"),function(){
			
			var province_name =$(_pageId+" .mobile_form .sel_province").text();
			var city_name =$(_pageId+" .mobile_form .sel_city").text();
			var branch_name = $(_pageId+" .mobile_form .sel_branch").text();
			//alert("下一步:"+branchParam.commission +",77,"+branchParam.branchno);
			appUtils.setSStorageInfo("branchno",branchParam.branchno);  // 营业部id保存在session
			appUtils.setSStorageInfo("commission",branchParam.commission);  // 佣金保存在session
			/*if(province_name == "请选择省份")
			{
				layerUtils.iMsg(-1,"请先选择开户省份部");
				return false;
			}
			if(city_name == "请选择城市")
			{
				layerUtils.iMsg(-1,"请先选择开户城市");
				return false;
			}*/
			if(branch_name == "请选择营业部")
			{
				layerUtils.iMsg(-1,"请选择开户营业部");
				return false;
			}
			
			//向后台发送服务营业部
			sendServiceBranch();
			
			//判断新开户还是转户
			if(appUtils.getSStorageInfo("openChannel") == "new")
			{
				appUtils.pageInit("account/selDepartment","account/uploadPhoto",branchParam);
				appUtils.clearSStorage("idInfo");  // 清除完成身份证上传步骤标记
			}
			else
			{
				appUtils.pageInit("account/selDepartment","account/uploadPhotoChange",branchParam);
			}
		});
	}
	
	//记录客户的服务营业部
	function sendServiceBranch(){
		var mobileNo=appUtils.getSStorageInfo("mobileNo");
		var branchNo = branchParam.branchno;
		var param  = "step=bindServiceBranch&mobileNo="+mobileNo+"&branchno="+branchNo;
	    $.ajax({
	        type:'post',
	        url:global.serverToukerUrl+"/com.business.function.Function10001?"+param,
	        data:{ts:(new Date()).getTime()},
	        cache:false,
	        dataType:'json',
	        success:function(data, resp, XMLHttpRequest){
	        	if(data.errorNo == 0){	//调用正常
	        		console.log("服务营业部设置成功");
	        	}
	        }
	    });
	}
	
	function destroy()
	{
		service.destroy();
	}
	
	/* 初始化页面 */
	function initPage()
	{
		cleanPageElement(); // 清理页面元素值
		var Commission = appUtils.getSStorageInfo("commission");  // 用户已选佣金id
		var Commission_name = appUtils.getSStorageInfo("commissionname");  // 用户已选佣金值
		var Branch_no = appUtils.getSStorageInfo("branchno"); // 用户已选营业部id
		var Branch_name = appUtils.getSStorageInfo("branchname");  // 用户已选营业部名称
		var Province_name = appUtils.getSStorageInfo("provincename");  // 用户已选省份
		var City_name = appUtils.getSStorageInfo("cityname");  // 用户已选城市
		
		//  用户如果已选择了营业部，就不需要定位
		if(Province_name && City_name && Branch_name && Branch_no)
		{
			hasbranch = true;
			localPro = Province_name;
			localCity = City_name;
			localBranch = Branch_name;
			branchParam.branchno = Branch_no;
			$(_pageId+" .sel_province").html(Province_name);
			$(_pageId+" .sel_city").html(City_name);
			$(_pageId+" .sel_branch").html(Branch_name);
			if(Commission)
			{
				//alert(Commission);
				branchParam.commission = Commission;
				$(_pageId+" .sel_commission").html(Commission_name);
			}
			getBranch();  // 获取营业部List
		}
		else
		{
			//getPosition();  // 进行地理定位
			getBranch();  // 获取营业部List
		}
	}
	
	/* 定位本地地址
	function getPosition()
	{
		var positionSign = "";
		layerUtils.iAlert("正在定位中，请稍后....", -1, function(){
			layerUtils.iLayerClose();
			positionSign = "1";
			if(positionSign == "1"){
				getBranch();  // 获取营业部List
			}
		},"取消");
		// 获取ip地址
		shellPlugin.callShellMethod("getIpMacPLugin",function(data){
			var ip = data.split("|")[1];
			// 获取定位省份和城市
			service.getProvCity({"ip":ip}, function(data){
				layerUtils.iLayerClose();  // 关闭定位提示
				if(positionSign == ""){
					positionSign = "2";
				}
				if(positionSign == "2"){
					if(data.error_no == 0 && data.results.length !=0 )
					{
						hasbranch = false;  
						localPro = data.results[0].province;		
						localCity = data.results[0].city;		
						$(_pageId+" .sel_province").text(localPro);	  
						$(_pageId+" .sel_city").text(localCity);	 	
					}
					else
					{
						hasbranch = true;  
						layerUtils.iMsg(-1,"定位附近营业部失败，请您手动选择", 5);
					}
					getBranch();  // 获取营业部List
				}
			},false,false);
		});	
	} */
	
	/* 获取营业部List */
	function getBranch()
	{
		service.queryBranch({},function(data){
			//alert("获取营业部List"+JSON.stringify(data));
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no=="0" && data.dsName)
			{
				//provinceList = data.provinceList; //省份集合
			   // cityList = data.cityList;	//城市集合
			    branchList = data.branchList;	//营业部集合
			    commissionList = data.commissionList;	//佣金集合
				var //plen = provinceList.length,
				     // clen = cityList.length,
				      blen = branchList.length,
					  colen = commissionList.length;
				var pro_str = "", provinceno = "", provincename = "";
				/*// 遍历省份集合
				for(var i=0; i<plen; i++)
				{
					provinceno = provinceList[i].provinceno; // 省份id
					provincename = provinceList[i].provincename;  // 省份名称
					pro_str += "<li pid='"+provinceno+"'><span>"+provincename+"</span></li>";
					if(localPro != "")  // 若定位省份存在，进行填充
					{
						// 填充定位省份下的所有城市
						if(provincename == localPro)
						{
							var city_str = "", pid = "", cityno = "", cityname = "";
							for(var j=0; j<clen; j++)
							{
								pid = cityList[j].provincenno;
							    cityno = cityList[j].cityno;
							    cityname = cityList[j].cityname;
								if(pid == provinceno) 
								{
									city_str += "<li cid='"+cityno+"'><span>"+cityname+"</span></li>";
								}
							}
							$(_pageId+" .city ul").html(city_str);  // 填充城市下拉框
							bindCity();  //点击城市
						}
					}
				}
				$(_pageId+" .province ul").html(pro_str);  // 填充省份下拉框
				bindProvince();  //点击省份*/
				
				// 存在localCity则遍历所有城市集合
/*				if(localCity != "")
				{*/
/*					for(var i=0; i<clen; i++)
					{
						var cityno = cityList[i].cityno; // 城市id
						var cityname = cityList[i].cityname;  // 城市名称
*/						// 填充定位城市下的所有营业部名称
						if(blen != "")
						{
							//hasbranch = true;  // 定位的城市拥有营业部
							var branch_str = "", cno = "", branchcode = "", branchname = "";
							for(var j=0; j<blen; j++)
							{
								cno = branchList[j].cityno;
						        branchcode = branchList[j].branchcode,
						        branchname = branchList[j].branchname;
/*								if(cno == cityno)  
								{*/
									if(branchcode != "9999"){//剔除总部
									branch_str+= "<li bid='"+branchcode+"'><span>"+branchname+"</span></li>";
									}
//								}
							}
							$(_pageId+" .branch ul").html(branch_str);  // 填充对应城市的营业部
							bindBranch();  //点击营业部
						}
/*					}
					if(!hasbranch)  // 定位的城市没有相关营业部
					{
						layerUtils.iMsg(-1,"您当前所处城市无相关营业部，请手动选择", 4);
				  }
				 }*/
				
	/*			// 存在localBranch则遍历所有营业部集合
				if(localBranch != "")
				{
					for(var i=0; i<blen; i++)
					{
						var branchcode = branchList[i].branchcode;
						var branchname = branchList[i].branchname;
						// 填充该营业部下的所有佣金套餐
						if(branchname == localBranch)
						{
							var commission_str = "", bno = "", commission = "", sortno = "";
							for(var j=0; j<colen; j++)
							{
								bno = commissionList[j].branchcode;
						        sortno = commissionList[j].sortno,
						        commission = commissionList[j].commission;
								if(bno == branchcode)  
								{
									alert("222");
									commission_str+= "<li yid='"+sortno+"'><span>"+commission+"</span></li>";
								}
							}
							$(_pageId+" .commission ul").html(commission_str);  // 填充对应城市的营业部
							bindCommission();  //点击营业部
						}
					}
				}*/
			}
			else
			{
				layerUtils.iMsg(-1,"营业部获取失败");  //提示错误信息
			}
		},true,true,handleTimeout);
	}
	
	/* 处理请求超时 */
	function handleTimeout()
	{
		layerUtils.iConfirm("请求超时，是否重新加载？",function(){
			getBranch();  // 再次获取营业部
		});
	}
	
	/* 选中省份事件处理 
	function bindProvince()
	{
		appUtils.bindEvent($(_pageId+" .province ul li"),function(e){
			var pid = $(this).attr("pid");
			$(this).addClass("active").siblings().removeClass("active");
			var provincename = $(this).text();  //当前选中省份的值
			var sel_pname = $(_pageId+" .sel_province").text();  //上一次选中省份的值
			$(_pageId+" .sel_province").text(provincename);	  //将选中值赋给选择框
			appUtils.setSStorageInfo("provincename",provincename);
			$(_pageId+" .province").slideUp("fast");	//隐藏下拉框
			 //再次点击相同省份,下级菜单不改变，否则重置
			if(provincename != sel_pname)   
			{
				$(_pageId+" .sel_city").text("请选择城市");
				$(_pageId+" .sel_branch").text("请选择营业部");
				$(_pageId+" .sel_commission").text("请选择佣金套餐");
				$(_pageId+" .branch ul").html("");
				$(_pageId+" .commission ul").html("");
			}
			var provincenno = "";  //省份ID
			var city_str = "";
			//选中省份立即填充相应城市
			for(var i=0; i<cityList.length; i++)
			{
				provincenno = cityList[i].provincenno;
				cityno = cityList[i].cityno;
				cityname = cityList[i].cityname;
				if(pid == provincenno)  //填充当前省份下的城市列表
				{
					city_str+= "<li cid='"+cityno+"'><span>"+cityname+"</span></li>";
				}
			}
			$(_pageId+" .city ul").html(city_str);  //填充城市下拉框
			e.stopPropagation();	// 阻止冒泡
			bindCity();  //点击城市
		});
	}*/
	
	/* 选中城市事件绑定
	function bindCity()
	{
		appUtils.bindEvent($(_pageId+" .city ul li"),function(e){
			var cid = $(this).attr("cid");
			$(this).addClass("active").siblings().removeClass("active");
			var cityname = $(this).text();  //当前选择城市的值
			var sel_cname = $(_pageId+" .sel_city").text();  //上次选择城市的值
			$(_pageId+" .sel_city").text(cityname);	  //选中值赋给选择框
			appUtils.setSStorageInfo("cityname",cityname);
			$(_pageId+" .city").slideUp("fast");	//隐藏下拉框
			//再次点击相同城市,下级菜单不改变，否则重置
			if(sel_cname != cityname)	 
			{
				$(_pageId+" .sel_branch").text("请选择营业部");
				$(_pageId+" .sel_commission").text("请选择佣金套餐");
				$(_pageId+" .commission ul").html("");
			}
			//选中城市立即填充相应营业部
			var cityno = "";  //城市ID
			var branch_str = "";
			for(var i=0; i<branchList.length; i++)
			{
				cityno = branchList[i].cityno;
				branchcode = branchList[i].branchcode;
				branchname = branchList[i].branchname;
				if(cid == cityno)  //填充当前城市下的营业部列表
				{
					branch_str+= "<li bid='"+branchcode+"'><span>"+branchname+"</span></li>";
				}
			}
			$(_pageId+" .branch ul").html(branch_str);  //填充营业部下拉框
			e.stopPropagation();	// 阻止冒泡
			bindBranch();  //点击营业部
		});
	} */
	
	/* 选中营业部事件绑定*/
	function bindBranch()
	{
		appUtils.bindEvent($(_pageId+" .branch ul li"),function(e){
			var bid = $(this).attr("bid");
			$(this).addClass("active").siblings().removeClass("active");
			branchParam.branchno = bid;
			var branchname = $(this).text();  //当前选中营业部的值
			var sel_bname = $(_pageId+" .sel_branch").text();  //上一次选中营业部的值
			$(_pageId+" .sel_branch").attr("branchcode",bid);	
			$(_pageId+" .sel_branch").text(branchname);	  //选中值赋给选择框
			appUtils.setSStorageInfo("branchname",branchname);
			$(_pageId+" .branch").slideUp("fast");	//隐藏下拉框
			//再次点击相同城市,下级菜单不改变，否则重置
/*			if(sel_bname != branchname)	 
			{
				$(_pageId+" .sel_commission").text("请选择佣金套餐");
			}*/
			// 选中营业部立即填充对应的佣金套餐 
			var branchcode = "";  //营业部ID
			var commission_str = "";
			for(var i=0; i<commissionList.length; i++)
			{
				branchcode =commissionList[i].branchcode;
				commission =commissionList[i].commission;
				sortno =commissionList[i].sortno;
				if(bid == branchcode)
				{
					branchParam.commission =commission;
					//alert(commission);
					commission_str+= "<li yid='"+sortno+"'><span>"+commission+"</span></li>";
				}
			}
			$(_pageId+" .sel_commission").text(branchParam.commission);
			$(_pageId+" .commission ul").html(commission_str);  //填充佣金套餐下拉框
			e.stopPropagation();	// 阻止冒泡
			bindCommission();  //点击佣金套餐
		});	
	}
	
	/* 选中佣金事件绑定*/
	function bindCommission()
	{
		appUtils.bindEvent($(_pageId+" .commission ul li"),function(e){
			var yid = $(this).attr("yid");
			$(this).addClass("active").siblings().removeClass("active");
			branchParam.commission = yid;
			var commissionname = $(this).text();  //当前选中的佣金值
			$(_pageId+" .sel_commission").attr("commissionname",yid);	 
			$(_pageId+" .sel_commission").text(commissionname);	  //选中值赋给选择框
			appUtils.setSStorageInfo("commissionname",commissionname);
			$(_pageId+" .commission").slideUp("fast");	//隐藏下拉框
			e.stopPropagation();	// 阻止冒泡
		});	
	}
	
	/* 清理界面元素 */
	function cleanPageElement()
	{
		hasbranch = false;
       // $(_pageId+" .header .icon_back").hide(); //隐藏返回按钮
		$(_pageId+" .sel_province").text("请选择省份");
		$(_pageId+" .sel_city").text("请选择城市");
		$(_pageId+" .sel_branch").text("请选择营业部");
		$(_pageId+" .sel_commssion").text("请选择佣金套餐");
	}
	
	/*方法暴露*/
	var selDepartment = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	/*暴露对外的接口*/
	module.exports = selDepartment;
});