/**
 * 填写个人信息
 */
define("project/scripts/account/personInfo",function(require, exports, module){ 
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
	    service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		global = require("gconfig").global,
		layerUtils = require("layerUtils"),
		utils = require("utils"),
		manId = "",
		womenId = "",
		validatorUtil = require("validatorUtil"),
		idCardModify = false,  // 身份证是否被手工修改
		_pageId = "#account_personInfo";
	/* 私有业务模块的全局变量 end */
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		cleanPageElement();  // 清除页面元素 
		window.calendarCallback = calendarCallback;  // 全局调用日期插件方法
		//  从上传照片页面进入
		if(appUtils.getSStorageInfo("_prePageCode") == "account/uploadPhoto" || appUtils.getSStorageInfo("_prePageCode") == "account/uploadPhotoChange")
		{
			// 根据传入的值，填充页面的数据
			$(_pageId+" .name").val(appUtils.getPageParam("custname"));	  // 客户姓名
			$(_pageId+" .idCardNo").val(appUtils.getPageParam("idno"));	 // 身份证号
			$(_pageId+" .signDepartment").val(appUtils.getPageParam("policeorg"));	// 签发机关
			$(_pageId+" .idCardAddress").val(appUtils.getPageParam("native"));	// 证件地址
            $(_pageId+" .address").val(appUtils.getPageParam("native"));	// 联系地址和证件地址设置相同的
			$(_pageId+" .idBeginDate").val(appUtils.getPageParam("idbegindate"));  //起始期限
			$(_pageId+" .idEndDate").val(appUtils.getPageParam("idenddate"));  //结束期限
			if(appUtils.getPageParam("postid") ==""){
				$(_pageId+" .zipCode").val(200000);  //邮编
			}else{
				$(_pageId+" .zipCode").val(appUtils.getPageParam("postid"));  //邮编
			}
			
		    $(_pageId+" .selectOccupation").html("行政事业单位工人");  //清理职业
		    $(_pageId+" .selectDegree").html("学士");  //清理学历
			if($(_pageId+" .selectOccupation").text() == "行政事业单位工人" &&  $(_pageId+" .selectDegree").text() == "学士"){	
				$(_pageId+" .selectDegree").val(3);  // 学历代码
				$(_pageId+" .selectOccupation").val(4);  // 职业代码
			}
			// 如果是由新开流程跳转到转户流程， 并且有设置过学历和职业，那么初始化页面时,
			// 职业和学历和上次的选择保持不变
			var photosInfo = appUtils.getSStorageInfo("photosInfo");
			if(appUtils.getSStorageInfo("photosInfo") != null)
			{
				photosInfo = JSON.parse(photosInfo);
			}
			// 显示之前所选职业
			if(photosInfo != null && photosInfo.isChangeProcess == "true" && photosInfo.fillInformationInParam.occupation.text != "请选择职业")
			{
				$(_pageId+" .selectOccupation").text(photosInfo.fillInformationInParam.occupation.text);
				$(_pageId+" .selectOccupation").attr("value",photosInfo.fillInformationInParam.occupation.value);
			}
			// 显示之前所选学历
			if(photosInfo != null && photosInfo.isChangeProcess == "true" && photosInfo.fillInformationInParam.degree.text != "请选择学历")
			{
				$(_pageId+" .selectDegree").text(photosInfo.fillInformationInParam.degree.text);
				$(_pageId+" .selectDegree").attr("value",photosInfo.fillInformationInParam.degree.value);
			}
		}
		else
		{
			$(_pageId+" .name").val(appUtils.getSStorageInfo("custname"));	  // 客户姓名
			$(_pageId+" .idCardNo").val(appUtils.getSStorageInfo("idCardNo"));	 // 身份证号
			$(_pageId+" .signDepartment").val(appUtils.getSStorageInfo("policeorg"));	// 签发机关
			$(_pageId+" .idCardAddress").val(appUtils.getSStorageInfo("native"));	// 证件地址
            $(_pageId+" .address").val(appUtils.getSStorageInfo("addr"));	 // 联系地址和证件地址设置相同的
			$(_pageId+" .zipCode").val(appUtils.getSStorageInfo("postid"));  //邮编
			$(_pageId+" .idBeginDate").val(appUtils.getSStorageInfo("idbegindate"));  // 证件开始日期
			$(_pageId+" .idEndDate").val(appUtils.getSStorageInfo("idenddate"));  // 证件结束日期
		}
		queryDataDict();  // 获取职业和学历列表
	}
	
	function bindPageEvent()
	{
		/* 绑定返回 */
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			if(appUtils.getSStorageInfo("openChannel") == "new")//新开户
			{
				pageBack();
			}
			else if(appUtils.getSStorageInfo("openChannel") == "change")//转户
			{
				appUtils.pageBack();
				//appUtils.pageInit("account/personInfo","account/uploadPhotoChange",{});
			}
			
		});
		
		/* 点击页面其他元素隐藏下拉列表 */
		appUtils.bindEvent($(_pageId),function(e){
			// 隐藏下拉列表
			$(_pageId+" .sel_list").slideUp("fast",function(){
				$("body #bodyContent").css("overflow","auto");
			});	
			e.stopPropagation();	// 阻止冒泡
		});
		
		/* 选择职业 */
		appUtils.bindEvent($(_pageId+" .selectOccupation"),function(e){
			$(_pageId+" .job ul li").removeClass("active");
			// 显示选择职业的下拉列表
			$(_pageId+" .sel_list:eq(0)").slideDown("fast",function(){
				$("body #bodyContent").css("overflow","hidden");
			});		
			e.stopPropagation();	// 阻止冒泡
		});
		
		/* 选择学历 */
		appUtils.bindEvent($(_pageId+" .selectDegree"),function(e){
			$(_pageId+" .education ul li").removeClass("active");
			// 显示选择学历的下拉列表
			$(_pageId+" .sel_list:eq(1)").slideDown("fast",function(){
				$("body #bodyContent").css("overflow","hidden");
			});	
			e.stopPropagation(); // 阻止冒泡
		});
		
		/* 限制名字的长度 */
		appUtils.bindEvent($(_pageId+" .name"),function(){
			utils.dealIPhoneMaxLength(this,8);  //处理iphone兼容
		},"input");
		
		/* 限制身份证的长度 */
		appUtils.bindEvent($(_pageId+" .idCardNo"),function(){
			utils.dealIPhoneMaxLength(this,18);  //处理iphone兼容
		},"input");
		
		/* 限制邮编在IOS上的长度 */
//		appUtils.bindEvent($(_pageId+" .zipCode"),function(){
//			utils.dealIPhoneMaxLength(this,6); //处理iphone兼容
//		},"input");
		
		/* 绑定选择日期的事件 */
		appUtils.bindEvent($(_pageId+" input[date-plugin='true']"),function(e){
			utils.selectDate(this);  // 通过壳子调用系统的日历插件 
		});
		
		/* 绑定下一步 */
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn"),function(){
			if(verifyInfo())  // 校验数据
			{
				submitInfo();  //提交用户信息
			}
		});
	}
	
	/* 处理返回按钮 */
	function pageBack()
	{
		//钱钱炒股直接跳转过来的，在当前页面点击返回则关闭手机开户APP
    	var backpage= appUtils.getPageParam("backUrl");
    	if("business/index" == backpage){
    		if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
				if(navigator.userAgent.indexOf("Android") > 0) {
					require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
				}
				if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
					window.location.href="backClientSide";
				}
			}
    	}
		
		var currentStep = appUtils.getSStorageInfo("currentStep");  
		// 当前完成步骤为：已成功上传身份证 或者 由视频返回到资料提交页，处理返回按钮
		if(appUtils.getSStorageInfo("personInfo") == "exist" || currentStep == "uploadimg")
		{
			appUtils.setSStorageInfo("currentStep","uploadimg");
			appUtils.setSStorageInfo("idInfo","exist");  // 标记用户完成照片上传
			appUtils.pageInit("account/personInfo","account/uploadPhoto",{});
		}else{// 正常开户处理返回按钮
			var message = appUtils.getSStorageInfo("message");
			if(message == '4'){		//如果是已经在投客网上传过身份证
				appUtils.setSStorageInfo("currentStep","uploadimg");
				appUtils.setSStorageInfo("idInfo","");  //
				appUtils.pageInit("account/personInfo","account/phoneNumberVerify",{});
			}else{
				appUtils.pageBack();
			}
		}
	}
	
	function destroy()
	{
		service.destroy();
	}
	
	/*提交开户信息*/
	function submitInfo()
	{
		//绑定三方存管或者三方支付标志     1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	0：未绑定三方存管和三方支付
		var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
		var idno = $(_pageId+" .idCardNo").val().replace(/\s*/g, "");  // 身份证号
		//先进行预处理（清除之前占用了该身份证号的客户的数据信息）
		var khh = appUtils.getSStorageInfo("khh");
		 var paramCert = {
            "step" : "clearUnSubmitUserInfo",
            "user_id" :appUtils.getSStorageInfo("user_id"),
            "idno" : idno
        };
        
        //先提交思迪，判读是否需要删除占用者客户数据信息
    	require("shellPlugin").callShellMethod("toukerServerPlugin",function(paramCert){
            service.hbAjax(paramCert,function(data){
                if(data.errorNo==0){
                	var errorMsg = data.errorMsg;
                	console.log("errorMsg"+errorMsg);
                	if(errorMsg != null && errorMsg != ""){
   	           			layerUtils.iMsg(-1,errorMsg);
   	           			return;
                	}
                	
                	// 开户信息资料提交
					var param = setSubmitDataParam();
					service.submitUserInfo(param,function(data){
						//alert("入参:"+JSON.stringify(param));
						//alert(appUtils.getSStorageInfo("openChannel"));
						var error_no = data.error_no;
						var error_info = data.error_info;
						if(error_no == 0)
						{
							appUtils.setSStorageInfo("idCardNo",$(_pageId+" .idCardNo").val());
							appUtils.setSStorageInfo("custname",$(_pageId+" .name").val());
							//新开，则走新开流程
							if(appUtils.getSStorageInfo("openChannel") == "new")
							{
			                	if(tpbankFlg == '1' || tpbankFlg == '2'){
		                			// 跳转到验证交易密码
		                			console.log("跳转到密码验证页面");
									appUtils.pageInit("account/personInfo","account/pwdVerify",{"backUrl":"account/personInfo"}); 
			                	}else{
			                		appUtils.pageInit("account/personInfo","account/videoNotice",{}); 
			                	}
							                  	
							}
							// 转户，则走转户流程
							else if(appUtils.getSStorageInfo("openChannel") == "change")
							{
								// 转户，模拟视频见证通过，否则下载证书的时候后台  会出现 cert_uid 错误
								var syncQQUserInfoParam = {
									user_id : appUtils.getSStorageInfo("user_id")
								};
								// 模拟视频通过
								service.syncQQUserInfo(syncQQUserInfoParam,function(data){
									var error_no = data.error_no;
									var error_info = data.error_info;
									if(error_no == 0)
									{
										// 跳转到数字证书页面
										appUtils.pageInit("account/personInfo","account/digitalCertificate",{});
									}
									else 
									{
										layerUtils.iLoading(false);
										layerUtils.iAlert(error_info,-1);
									}
								});
							}
						}
						// 转户走了新开，提示走转户
						else if(error_no == -50152819)
						{
							layerUtils.iLoading(false);
							utils.layerTwoButton("系统检测到您已开立证券账户为：【"+error_info+"】，请进行转户流程!","马上转户","退出系统",function(){
								changeState(); // 走转户流程
							},function(){
								require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出系统
							});
						}
						// 新开走了转户，提示走新开流程
						else if(error_no == -50152820)
						{
							appUtils.setSStorageInfo("idCardNo",$(_pageId+" .idCardNo").val());
							appUtils.setSStorageInfo("custname",$(_pageId+" .name").val());
							layerUtils.iLoading(false);
							utils.layerTwoButton("您未开通股东账户，请走新开流程!","立即开户","退出系统",function(){
								newOpen();  //走新开流程
							},function(){
								require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出系统
							});
						}
						// 新开查到单边市场
						else if(error_no == -50152829)
						{
							appUtils.setSStorageInfo("idCardNo",$(_pageId+" .idCardNo").val());
							appUtils.setSStorageInfo("custname",$(_pageId+" .name").val());
							layerUtils.iLoading(false);
							utils.layerTwoButton("系统检测到您已开立证券账户为：【"+error_info+"】","继续开户","马上转户",function(){
								newOpen();  // 走新开流程
							},function(){
								changeState(); // 走转户流程
							});
						}
						else
						{
							layerUtils.iLoading(false);
							layerUtils.iAlert(data.error_info);  // 填写资料失败，弹出提示
						}
					},false);
                }else{
                    layerUtils.iMsg(-1,"系统异常！");
                }
            });
        },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(paramCert)});
	}
	
	
	
	/* 改变流程状态，走转户 */
	function changeState()
	{
		// session中的openChannel改为转户
		appUtils.setSStorageInfo("openChannel","change");
		var newopenParam = {
			user_id : appUtils.getSStorageInfo("user_id"),
			uploadimg_flag:"0", 
			opacctkind_flag:"1"  // 转户
		}
		service.queryChangeState(newopenParam,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == 0)
			{
				// 跳转之前，修改 session 中 photosInfo 的 fillInformationInParam
				var photosInfo = JSON.parse(appUtils.getSStorageInfo("photosInfo"));
				// 设置 photosInfo 的 isChangeProcess 属性，true 是更改流程
				photosInfo.isChangeProcess = true;
				photosInfo.fillInformationInParam.idno = $(_pageId+" .idCardNo").val();
				photosInfo.fillInformationInParam.custname = $(_pageId+" .name").val();
				photosInfo.fillInformationInParam.native = $(_pageId+" .idCardAddress").val();  // 证件地址
				photosInfo.fillInformationInParam.policeorg = $(_pageId+" .signDepartment").val();  // 签发机关
				photosInfo.fillInformationInParam.birthday = $(_pageId+" .idCardNo").attr("birthday");  // 出生日期
				photosInfo.fillInformationInParam.idbegindate = $(_pageId+" .idBeginDate").val();
				photosInfo.fillInformationInParam.idenddate = $(_pageId+" .idEndDate").val();
				photosInfo.fillInformationInParam.postid = $(_pageId+" .zipCode").val();  // 邮政编码
				// 职业
				photosInfo.fillInformationInParam.occupation = {
					"text" : $(_pageId+" .selectOccupation").text(),
					"value" : $(_pageId+" .selectOccupation").attr("value")
				};
				// 学历
				photosInfo.fillInformationInParam.degree = {
					"text" : $(_pageId+" .selectDegree").text(),
					"value" : $(_pageId+" .selectDegree").attr("value")
				};
				// 重新设置  session 中 photosInfo
				appUtils.setSStorageInfo("photosInfo",JSON.stringify(photosInfo));
				// 跳到转户的上传照片页面
				appUtils.pageInit("account/personInfo","account/uploadPhotoChange",{});
			}
			else
			{
				layerUtils.iLoading(false);
				layerUtils.iAlert(data.error_info,-1);
			}
		},false);
	}
	
	/*走新开户*/
	function newOpen()
	{
		// session中的openChannel改为新开
		appUtils.setSStorageInfo("openChannel","new");
		var newopenParam = {
			user_id : appUtils.getSStorageInfo("user_id"),
			uploadimg_flag:"1",  //身份证上传成功
			opacctkind_flag:"0"  //新开户
		}
		service.queryChangeState(newopenParam,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == 0)
			{
				// 再次调用提交用户信息接口, 添加入参submitflag =0
				var param = setSubmitDataParam();
				param.submitflag = "0" ;
				service.submitUserInfo(param,function(data){
					var error_no = data.error_no;
					var error_info = data.error_info;
					if(error_no == 0)
					{
						appUtils.pageInit("account/personInfo","account/videoNotice",{});  // 跳转到视频见证页面 
					}
					else
					{
						layerUtils.iLoading(false);
						layerUtils.iAlert(data.error_info);  
					}
				});
			}
			else
			{
				layerUtils.iLoading(false);
				layerUtils.iAlert(data.error_info,-1);
			}
		},false);
	}
	
	/* 根据身份证号进行判断性别: 倒数第二位数字，偶数为女，基数为男 */
	function checkSexId(idno)
	{
		var value = idno.charAt(idno.length-2); // 身份证倒数第二位数字
		var isnum = value%2; 
		var sexid = "";
		if(isnum == 0) // 偶为 女
		{
			sexid = womenId;
		}
		else // 奇为男
		{
			sexid = manId;
		}
		return sexid;
	}
	
	/* 获取用户信息*/
	function setSubmitDataParam()
	{
		var idno = $(_pageId+" .idCardNo").val().replace(/\s*/g, "");  // 身份证号
		// 判断性别，根据身份证传入男或女，也可以通过身份证号进行判断
		var sexId = checkSexId(idno); // 根据身份证判断性别
		var param = {
			"user_id" : appUtils.getSStorageInfo("user_id"),
			"infocolect_channel" : iBrowser.pc ? 0 : 3, // 信息来源渠道 0：PC  3：手机
			"idtype" : "00", // 证件类别，数据字典中定义的是 00
			"idno" : idno,  // 身份证号
			"ethnicname" : appUtils.getSStorageInfo("ethnicname"), // 民族
			"custname" : $(_pageId+" .name").val(),
			"birthday" : $(_pageId+" .idCardNo").attr("birthday"),  // 身份证修改了，出生日期也要修改
			"idbegindate" : $(_pageId+" .idBeginDate").val(),  // 证件开始日期
			"idenddate" : $(_pageId+" .idEndDate").val(),  // 证件结束日期
			"native" : $(_pageId+" .idCardAddress").val().replace(/\s+/g,""),  // 证件地址
			"policeorg" : $(_pageId+" .signDepartment").val(),  // 签发机关
			"usersex" : sexId,  // 用户性别，男 0 女 1
			"nationality" : "156",  // 屏蔽，待解决  // 国籍地区，必须写 156
			"addr" : $(_pageId+" .address").val().replace(/\s+/g,""),  // 联系地址
			"postid" : $(_pageId+" .zipCode").val(),  // 邮政编码
			"edu" : $(_pageId+" .selectDegree").val(),  // 学历代码
			"recommendno" : $(_pageId+" .input_form .reference").val(),  //推荐人号码
			"profession_code" : $(_pageId+" .selectOccupation").val(),  // 职业代码
			"branchno" : appUtils.getSStorageInfo("branchno"),   // 营业部代码
			"commission" : appUtils.getSStorageInfo("commission"),  // 营业部代码佣金代码
			"provinceno" : "",  // 省份代码, 屏蔽, 待解决 
			"cityno" : "",  // 城市代码
			"ipaddr" : appUtils.getSStorageInfo("ip"),  // ip 地址，在获取 短信验证码 的时候，就已经把 ip 和 mac 保存到 session 里面了
			"macaddr" : appUtils.getSStorageInfo("mac"),  // mac 地址
			"idcardmodify" : idCardModify ? 1 : 0  // 身份证是否被手动修改，被修改传 1 ，否则传 0
		};
		return param;
	}
	
	/* 获取职业、学历、性别列表*/
	function queryDataDict()
	{
		// 获取职业
		var profession_code = appUtils.getSStorageInfo("profession_code");  // 获取session中的职业 
		var occupationalParam = {"enum_type" : "occupational"};
		service.queryDataDict(occupationalParam,function(data){
			var error_no = data.error_no,
			      error_info = data.error_info;
			$(_pageId+" .sel_list:eq(0) ul li").remove();  // 首先清空数据
			if(error_no == "0" && data.results.length != 0)
			{
				var occupational = data.results;
				for(var i=0;i<occupational.length;i++)
				{
					var str = "<li><span class='occupation0"+i+"' value='"+occupational[i].item_value+"'>"+occupational[i].item_name+"</span></li>"
					$(_pageId+" .sel_list:eq(0) ul").append(str);
					if(profession_code != "" && occupational[i].item_value == profession_code)
					{
						$(_pageId+" .selectOccupation").text(occupational[i].item_name);
						$(_pageId+" .selectOccupation").val(occupational[i].item_value);
					}
					BindSelectOccupation(i);	 // 预绑定选择职业的事件
				}
				queryAdapter();  // 再获取学历
			}
			else
			{
				layerUtils.iLoading(false);
				layerUtils.iMsg(-1,error_info);  // 提示错误信息
			}
		},false,true,handleTimeout);
	}
	
	/* 获取学历 */
	function queryAdapter()
	{
		var edu = appUtils.getSStorageInfo("edu");  // 获取session中的学历 
		var adapterParam = {"enum_type" : "adapter"};
		service.queryDataDict(adapterParam,function(data){
			var error_no = data.error_no,
      		      error_info = data.error_info;
			$(_pageId+" .sel_list:eq(1) ul li").remove();  // 首先清空数据
			if(error_no == "0" && data.results.length != 0)
			{
				var adapter = data.results;
				for(var i=0;i<adapter.length;i++)
				{
					var str = "<li><span class='degree0"+i+"' value='"+adapter[i].item_value+"'>"+adapter[i].item_name+"</span></li>"
					$(_pageId+" .sel_list:eq(1) ul").append(str);
					if(edu != "" && adapter[i].item_value == edu)
					{
						$(_pageId+" .selectDegree").text(adapter[i].item_name);
						$(_pageId+" .selectDegree").val(adapter[i].item_value);
					}
					BindSelectDegree(i);  // 预绑定选择学历的事件	
				}
				querySex();  // 获取性别
			}
			else
			{
				layerUtils.iLoading(false);
				layerUtils.iMsg(-1,error_info);  // 提示错误信息
			}
		},false,true,handleTimeout);
	}

	/* 获取性别 */
	function querySex()
	{
		var sexParam = {"enum_type" : "sex"};
		service.queryDataDict(sexParam,function(data){
			var error_no = data.error_no,
	              error_info = data.error_info;
			if(error_no == "0" && data.results.length != 0)
			{
				var sex = data.results;
				var sexvalue = "";
				for(var i = 0; i<sex.length; i++)
				{
					sexvalue = sex[i].item_name;
					if(sexvalue == "男")
					{
						manId = sex[i].item_value;
					}
					if(sexvalue == "女")
					{
						womenId = sex[i].item_value;
					}
				}
			}
			else
			{
				layerUtils.iMsg(-1,error_info);  // 提示错误信息
			}
		},true,true,handleTimeout);
	}
	
	/* 处理请求超时 */
	function handleTimeout()
	{
		layerUtils.iConfirm("请求超时，是否重新加载？",function(){
			queryDataDict();  // 再次获取职业和学历
		});
	}
	
	/* 预绑定选择职业的事件 */
	function BindSelectOccupation(i)
	{
		appUtils.bindEvent($(_pageId+" .sel_list:eq(0) ul .occupation0"+i),function(e){
			$(_pageId+" .selectOccupation").attr("value",$(_pageId+" .occupation0"+i).attr("value"));
			$(this).parent().addClass("active").siblings().removeClass("active");
			var check_val =$(_pageId+" .occupation0"+i).text();
			$(_pageId+" .selectOccupation").text(check_val);
			$(_pageId+" .sel_list:eq(0)").slideUp("fast",function(){
				$("body #bodyContent").css("overflow","auto");
			});	
			e.stopPropagation();	// 阻止冒泡
		});
	}
	
	/*  预绑定选择学历的事件 */
	function BindSelectDegree(i)
	{
		appUtils.bindEvent($(_pageId+" .sel_list:eq(1) ul .degree0"+i),function(e){
			// strong 不能用 val() 方法设置 value ，用的话无效
			$(_pageId+" .selectDegree").attr("value",$(_pageId+" .degree0"+i).attr("value"));
			$(this).parent().addClass("active").siblings().removeClass("active");
			var check_val =$(_pageId+" .degree0"+i).text();
			$(_pageId+" .selectDegree").text(check_val);
			$(_pageId+" .sel_list:eq(1)").slideUp("fast",function(){
				$("body #bodyContent").css("overflow","auto");
			});	
			e.stopPropagation();  // 阻止冒泡
		});
	}
	
	/* 信息提交校验 */
	function verifyInfo()
	{
		var name = $(_pageId+" .user_form .name").val();	//姓名
		var idCardNo = $(_pageId+" .user_form .idCardNo").val();	//身份证
		var signDepartment = $(_pageId+" .user_form .signDepartment").val();  //签发机关
		var idCardAddress = $(_pageId+" .user_form .idCardAddress").val();  //证件地址
		var address = $(_pageId+" .user_form .address").val();  //联系地址
		var idBeginDate = $(_pageId+" .user_form .idBeginDate").val();  //起始期限
		var idEndDate = $(_pageId+" .user_form .idEndDate").val();  //结束期限
		var zipCode = $(_pageId+" .user_form .zipCode").val();  //邮编
		var selectOccupation = $(_pageId+" .input_form .selectOccupation").text();  //职业
		var selectDegree = $(_pageId+" .input_form .selectDegree").text();  //学历
		if(name == "")
		{
			layerUtils.iMsg(-1,"姓名不能为空");
			return false;
		}
		if(idCardNo == "")
		{
			layerUtils.iMsg(-1,"身份证不能为空");
			return false;
		}
		if(signDepartment == "")
		{
			layerUtils.iMsg(-1,"签发机关不能为空");
			return false;
		}
		if(idCardAddress == "")
		{
			layerUtils.iMsg(-1,"证件地址不能为空");
			return false;
		}
		if(address == "")
		{
			layerUtils.iMsg(-1,"联系地址不能为空");
			return false;
		}
		if(idBeginDate == "")
		{
			layerUtils.iMsg(-1,"身份证起始期限不能为空");
			return false;
		}
		if(idEndDate == "")
		{
			layerUtils.iMsg(-1,"身份证结束期限不能为空");
			return false;
		}
		if(zipCode == "")
		{
			layerUtils.iMsg(-1,"邮编不能为空");
			return false;
		}
		if(!require("validatorUtil").isPostalCode(zipCode))
		{
			layerUtils.iMsg(-1,"邮编格式不正确,请重新输入");
			return false;
		}
		if(selectOccupation == "请选择职业")
		{
			layerUtils.iMsg(-1,"职业不能为空");
			return false;
		}
		if(selectDegree == "请选择学历")
		{
			layerUtils.iMsg(-1,"学历不能为空");
			return false;
		}
		// 发送身份证存在性检查之前，前端验证身份证的格式
		if(!validatorUtil.isCardID(idCardNo))
		{
			layerUtils.iMsg(-1,"请输入正确的身份证号码!");
			return false;
		}
		// 对不满 18 周岁进行控制
		if(idCardNo.length == 18)
		{
			var dateStr = idCardNo.substring(6,10)+"/"+idCardNo.substring(10,12)+"/"+idCardNo.substring(12,14),
				  userAge = new Date().getTime() - Date.parse(dateStr);
			userAge = userAge / (365*24*60*60*1000);
			if(parseInt(userAge) <18)
			{
				layerUtils.iAlert("您的年龄未满 18 周岁，不允许开户!",-1);
				return false;
			}
		}
/*2014-07-25 pm 10:32		// 验证有效期的格式
		var dateReg = /^[1-3]\d{3}-(0|1)\d-[0-3]\d$/;
		if(!(dateReg.test(idBeginDate) && validatorUtil.isDate(idBeginDate)))
		{
			layerUtils.iMsg(-1,"有效期的起始时间不符合格式!");
			return false;
		}
		if(!(dateReg.test(idEndDate) && validatorUtil.isDate(idEndDate)))
		{
			layerUtils.iMsg(-1,"有效期的结束时间不符合格式!");
			return false;
		}
		if(new Date(idBeginDate).getTime() - new Date().getTime() >= 0)
		{
			layerUtils.iMsg(-1,"有效期的起始时间不能大于当前日期!");
			return false;
		}
		// 校验身份证期限是否符合格式
		idBeginDate = idBeginDate.replaceAll("-","/");
		idEndDate = idEndDate.replaceAll("-","/");
		if(Date.parse(idBeginDate) >= Date.parse(idEndDate))
		{
			layerUtils.iMsg(-1,"有效期的起始时间必须小于结束时间!");
			return false;
		}*/
		// 页面入参的 身份证号 ，身份证号最多只允许修改五位
		if(appUtils.getPageParam("idno"))
		{
			var pageInIdCardNo = appUtils.getPageParam("idno");
		}
		else
		{
			var pageInIdCardNo = appUtils.getSStorageInfo("idCardNo");
		}
		var countDiffe = 0;  // 计算身份证修改的位数
		for(var i =0 ;i < idCardNo.length;i++)
		{
			var oneIdNo = idCardNo.charAt(i),
				  oneInIdNo =  pageInIdCardNo.charAt(i);
			if(oneIdNo != oneInIdNo)
			{
				countDiffe++;
			}
		}
		// 如果被修改的位数不等于 0 ，countDiffe 为 true
		if(countDiffe != 0)
		{
			idCardModify = true;
		}
		// 未被修改，idCardModify 为 false
		else
		{
			idCardModify = false;
		}
		if(countDiffe > 5)
		{
			utils.layerTwoButton("您好,发现您的证件号码与上传的差异过大，请您确认是否需要更换身份证?","重新上传身份证","重新确认身份证",function(){
				if(appUtils.getSStorageInfo("openChannel") == "new")
				{
					appUtils.pageInit("account/personInfo","account/uploadPhoto",{});
				}
				else if(appUtils.getSStorageInfo("openChannel") == "change")
				{
					appUtils.pageInit("account/personInfo","account/uploadPhotoChange",{});
				}
			},function(){
				return false;
			});
			return false;
		}
		// 设置出生日期
		$(_pageId+" .idCardNo").attr("birthday",idCardNo.substring(6,10)+"-"+idCardNo.substring(10,12)+"-"+idCardNo.substring(12,14));
		return true;
	}
	
	/* 日历的回调函数 */
	function calendarCallback(data)
	{
		// 回调数据中的 data 是字符串，需解析
		if(typeof(data)=="string"){
			data = JSON.parse(data);
		}
		$(_pageId+" #"+data.selector).val(data.date);
	}
	
	/* 清理界面元素*/
	function cleanPageElement()
	{
		$(_pageId+" .selectOccupation").html("请选择职业");  //清理职业
		$(_pageId+" .selectDegree").html("请选择学历");  //清理学历
	}
	
	var personInfo = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"pageBack" : pageBack,
		"destroy" : destroy
	};
	
	module.exports = personInfo;
});