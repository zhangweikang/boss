/**
 * 上传身份证照片
 */
define("project/scripts/account/uploadPhoto",function(require, exports, module){ 
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
		   service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		   layerUtils = require("layerUtils"),
		   gconfig = require("gconfig"),
		   global = gconfig.global,
		   serverPath = global.serverPath,
		   _pageId = "#account_uploadPhoto",
		   // 填写资料的页面入参，属性由 imgState 方法赋值
			fillInformationInParam = {
				"idno" : "",	// 身份证号
				"custname" : "",	// 客户姓名
				"ethnicname" : "",	// 民族
				"native" : "",		// 证件地址
				"policeorg" : "",	// 签发机关
				"birthday" : "",	// 出生日期
				"idbegindate" : "",	// 证件开始日期
				"idenddate" : "",	// 证件结束日期
				"gender" : "",	// 用户性别
				"imgPath" : "",  // 图片的显示地址
				"imgId" : "", // 图片 id 
				"branchno": "", //营业部Id
				"commission":"",  //佣金套餐
				"postid" : ""  //邮编
			};
	/* 私有业务模块的全局变量 end */
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		window.imgState = imgState;  // 照片上传完成后自动调用该方法
		cleanPageElement();  // 清理页面元素
		var branchno =  appUtils.getPageParam("branchno");
		var commission =  appUtils.getPageParam("commission");
		// 设置营业部Id
		if(branchno)
		{
			fillInformationInParam.branchno = branchno;
			//alert("00:"+fillInformationInParam.branchno);
		}
		else
		{
			fillInformationInParam.branchno = appUtils.getSStorageInfo("branchno");
			//alert("11:"+fillInformationInParam.branchno);
		}
		// 设置佣金套餐
		if(commission)
		{
			fillInformationInParam.commission = commission;
			//alert("22:"+fillInformationInParam.commission);
		}
		else
		{
			fillInformationInParam.commission = appUtils.getSStorageInfo("commission");
			//alert("33:"+fillInformationInParam.commission);
		}
		$(_pageId+" .icon_check").addClass("checked");  // 默认选中签署协议
		queryCertAgreement();  // 获取中登证书协议
	}
	
	function bindPageEvent()
	{
		/* 点击页面隐藏按钮 */
		appUtils.bindEvent($(_pageId),function(){
			// 将按钮的自定义属性  last-media-id 设为 当前的 media-id
			$(_pageId+" .upload_btn li").attr("last-media-id",$(_pageId+" .upload_btn li:eq(0)").attr("media-id"));
			// 将按钮的自定义属性 media-id 设为 null
			$(_pageId+" .upload_btn li").attr("media-id","null");
			// 隐藏照片上传按钮
			$(_pageId+" .upload_btn").slideUp("fast");
			$(_pageId+" .upload_box").removeClass("active");
		});
		
		/* 绑定返回 */
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			/**
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
	    	**/
	    	
	    	//钱钱炒股在上传身份页面返回   关闭证券开户  回到钱钱炒股
	    	if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
				if(navigator.userAgent.indexOf("Android") > 0) {
					require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
				}
				if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
					window.location.href="backClientSide";
				}
			}else{	//证券开户
				var khh =appUtils.getSStorageInfo("khh");//如果客户号不为空，则一定已经选择了营业部，这里不能再让客户返回到选择营业部页面重新选择
				if(null != khh && khh != ''){
					appUtils.pageInit("account/uploadPhoto","account/phoneCodeVerify",{});
				}else{
					pageBack();
				}
			}
	    	
			
		});
		
		/* 绑定上传正面身份证照 */
		appUtils.bindEvent($(_pageId+" .upload_main .positive"),function(e){
			if(gconfig.platform == '1'){
				//改变手势状态
				require("shellPlugin").callShellMethod("changeStatusPlugin",null,null,{"flag":true});
			}
			
			$(_pageId+" .upload_main .negative").removeClass("active");
			var isActive = $(this).hasClass("active");
			switchCss($(_pageId+" .upload_main .positive"), isActive, 4);
			$(_pageId+" .upload_btn h5").html("上传身份证正面");
			e.stopPropagation();  // 阻止冒泡
		});
		
		/* 绑定上传反面身份证照 */
		appUtils.bindEvent($(_pageId+" .upload_main .negative"),function(e){
			if(gconfig.platform == '1'){
				//改变手势状态
				require("shellPlugin").callShellMethod("changeStatusPlugin",null,null,{"flag":true});
			}
			$(_pageId+" .upload_main .positive").removeClass("active");
			var isActive = $(this).hasClass("active");
			switchCss($(_pageId+" .upload_main .negative"), isActive , 5);
			$(_pageId+" .upload_btn h5").html("上传身份证反面");
			e.stopPropagation();  // 阻止冒泡
		});
		
		/* 点击相册 */
		appUtils.bindEvent($(_pageId+" .upload_btn li:eq(0)"),function(e){
			// 相册上传的参数
			var phoneConfig = {
				"funcNo" : $(this).attr("media-id") == "3" ? "501526" : "501525",	
				"uuid" : "index",
				"r" : Math.random(),
				"user_id" : appUtils.getSStorageInfo("user_id"),
				"phototype" : $(this).attr("media-id") == "3" ? "人像正面" : "身份证",	// 影像名称
				"action" : "phone",	// 照片来源类别，phone 相册，pai 相机
				"img_type" : $(this).attr("media-id"),
				"key" : "index",	// key 和 uuid 只需要写一个
				"url" : global.serverPath,
				"clientinfo" : appUtils.getSStorageInfo("clientinfo"),	 // 从 session 中将 clientinfo 取出
				"jsessionid" : appUtils.getSStorageInfo("jsessionid") // 从 session 中将 jsessionid 取出
			};
			if(gconfig.platform == 3)
			{
				layerUtils.iLoading(true);
			}
			require("shellPlugin").callShellMethod("carmeraPlugin",null,null,phoneConfig);
			// 隐藏照片上传按钮
			$(_pageId+" .upload_btn").slideUp("fast");
			$(_pageId+" .upload_box").removeClass("active");
			// 将按钮的自定义属性  last-media-id 设为 当前的 media-id
			$(_pageId+" .upload_btn li").attr("last-media-id",$(_pageId+" .upload_btn li:eq(0)").attr("media-id"));
			// 将按钮的自定义属性 media-id 设为 null
			$(_pageId+" .upload_btn li").attr("media-id","null");
			e.stopPropagation();  // 阻止冒泡
		});
		
		/* 点击拍照 */
		appUtils.bindEvent($(_pageId+" .upload_btn li:eq(1)"),function(e){
			// 相机上传的参数
			var paiConfig = {
				"funcNo" : $(this).attr("media-id") == "3" ? "501526" : "501525",	
				"uuid" : "index",
				"r" : Math.random(),
				"user_id" : appUtils.getSStorageInfo("user_id"),
				"phototype" : $(this).attr("media-id") == "3" ? "人像正面" : "身份证",	// 影像名称
				"action" : "pai",	// 照片来源类别，phone 相册，pai 相机
				"img_type" : $(this).attr("media-id"),
				"key" : "index",	// key 和 uuid 只需要写一个
				"url" : global.serverPath,
				"clientinfo" : appUtils.getSStorageInfo("clientinfo"), 	// 从 session 中将 clientinfo 取出
				"jsessionid" : appUtils.getSStorageInfo("jsessionid")	// 从 session 中将 jsessionid 取出
			};
			if(gconfig.platform == 3)
			{
				layerUtils.iLoading(true);
			}
			require("shellPlugin").callShellMethod("carmeraPlugin",null,null,paiConfig);
			// 隐藏照片上传按钮
			$(_pageId+" .upload_btn").slideUp("fast");
			$(_pageId+" .upload_box").removeClass("active");
			// 将按钮的自定义属性  last-media-id 设为 当前的 media-id
			$(_pageId+" .upload_btn li").attr("last-media-id",$(_pageId+" .upload_btn li:eq(0)").attr("media-id"));
			// 将按钮的自定义属性 media-id 设为 null
			$(_pageId+" .upload_btn li").attr("media-id","null");
			e.stopPropagation();  // 阻止冒泡
		});
		
		/* 绑定同意签署协议 */
		appUtils.bindEvent($(_pageId+" .upload_main .icon_check"),function(){
			$(this).toggleClass("checked");
		});
		
		/* 绑定下一步 */
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn"),function(){
			if(validatePhoto())
			{
				submitPhoto();  // 提交照片
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
    	
		// 短信登陆，返回至身份证上传，处理返回按钮
		if(appUtils.getSStorageInfo("idInfo") == "exist")
		{
			appUtils.pageInit("account/uploadPhoto","account/selDepartment",{});
		}
		// 正常开户处理返回按钮
		else
		{
			appUtils.pageBack();
		}
	}
	
	function destroy()
	{
		service.destroy();
	}
	
	/* 处理点击上传身份证正面、反面效果 */
	function switchCss(ele,isActive,media)
	{
		if(isActive)
		{
			$(_pageId+" .upload_btn").slideUp("fast");
			$(_pageId+" .upload_btn li").attr("media-id","null");
		}
		else
		{
			$(_pageId+" .upload_btn").slideDown("fast");
			$(_pageId+" .upload_btn li").attr("media-id",media);
		}
		$(ele).toggleClass("active");
	}
	
	/* 清理界面元素
	 * 不能写在 destroy 方法里面，写在 destroy 里面，查看协议的时候，界面的元素也会被清理掉
	 */
	function cleanPageElement(){
		// 取消勾选协议
		$(_pageId+" .rule_check .icon_check").removeClass("checked");
		// 设置 uploaded 属性为 false
		$(_pageId+" .upload_box").attr("uploaded",false);
		// 恢复照片 li 的内容
		$(_pageId+" .positive").text("");
		$(_pageId+" .negative").text("");
		$(_pageId+" .positive").append("<dd class='icon01'><h5>正 面</h5><p>点击上传身份证</p></dd>");
		$(_pageId+" .negative").append("<dd class='icon02'><h5>背 面</h5><p>点击上传身份证</p></dd>");
	}
	
	/* 验证图片的完整性 */
	function validatePhoto()
	{
		$(_pageId+" .upload_btn").hide();  // 隐藏照片按钮
		var ischecked = $(_pageId+" .upload_main .icon_check").hasClass("checked"); 
		if($(_pageId+" .positive img").length == 0)
		{
			layerUtils.iMsg(-1,"请先上传正面照！");
			return false;
		}
		if($(_pageId+" .negative img").length == 0)
		{
			layerUtils.iMsg(-1,"请先上传反面照！");
			return false;
		}
		if(!ischecked)  // 检查是否勾选签署协议
		{
			layerUtils.iMsg(-1,"请先签署协议！");
			return false;
		}
		if(fillInformationInParam.idno == "")
		{
			layerUtils.iMsg(-1,"身份证正面不清晰，请重新上传");
			return false;
		}
		if(fillInformationInParam.custname == "")
		{
			layerUtils.iMsg(-1,"身份证正面不清晰，请重新上传");
			return false;
		}
		if(fillInformationInParam.birthday == "")
		{
			layerUtils.iMsg(-1,"身份证正面不清晰，请重新上传");
			return false;
		}
		if(fillInformationInParam.native == "")
		{
			layerUtils.iMsg(-1,"身份证正面不清晰，请重新上传");
			return false;
		}
		if(fillInformationInParam.idbegindate == "")
		{
			layerUtils.iMsg(-1,"身份证反面不清晰，请重新上传");
			return false;
		}
		if(fillInformationInParam.idenddate == "")
		{
			layerUtils.iMsg(-1,"身份证反面不清晰，请重新上传");
			return false;
		}
		if(fillInformationInParam.policeorg == "")
		{
			layerUtils.iMsg(-1,"身份证反面不清晰，请重新上传");
			return false;
		}
		return true;
	}
	
	/**
	 * 照片上传完成后，会自动调用 imgState 方法，但是该方法只能写在 m/index.html
	 * 或者暴露给 window ，否则无法调用
	 * 已在 init 中暴露给 window 
	 */ 
	function imgState(mediaId, data)
	{
		if(gconfig.platform == 3)
		{
			layerUtils.iLoading(false);
			data = unescape(data);
		}
		data = JSON.parse(data);  // 返回的是 json 串
		var base64Str = (data.base64).replace(/[\n\r]*/g,"");
		if(data.error_no != 0)
		{
			layerUtils.iAlert(data.error_info);
			return false;
		}
		// 身份证正面信息
		if($(_pageId+" .upload_btn li:eq(0)").attr("last-media-id") == 4)
		{
			var idnoOCR = data.results[0].idno;
			var idnoDD =  appUtils.getSStorageInfo("idnoDD");	//顶点系统记录的身份证号
			console.log("uploadPhoto idnoDD="+idnoDD + "*idnoOCR="+idnoOCR+"*");
			console.log("idnoOCR != idnoDD:"+idnoOCR != idnoDD);
		
			if(idnoDD != null && idnoDD != '' && idnoOCR != idnoDD){
				layerUtils.iMsg(-1,"您上传的身份证与注册投客网关联身份证不一致，请重新上传！");
				return;
			}
			fillInformationInParam.idno = idnoOCR;  // 身份证号
			fillInformationInParam.idno = data.results[0].idno;  // 身份证号
			fillInformationInParam.custname = data.results[0].custname;  // 客户姓名
			fillInformationInParam.native = data.results[0].native;  // 证件地址
			fillInformationInParam.addr = data.results[0].native;  // 联系地址默认为证件地址
			fillInformationInParam.ethnicname = data.results[0].ethnicname;  // 民族
			appUtils.setSStorageInfo("ethnicname",data.results[0].ethnicname);
			fillInformationInParam.birthday = data.results[0].birthday;  // 出生日期
			fillInformationInParam.gender = data.results[0].usersex;  // 用户性别
		}
		// 身份证反面信息
		if($(_pageId+" .upload_btn li:eq(0)").attr("last-media-id") == 5)
		{
			fillInformationInParam.policeorg = data.results[0].policeorg;  // 签发机关
			fillInformationInParam.idbegindate = data.results[0].idbegindate;  // 证件开始日期
			fillInformationInParam.idenddate = data.results[0].idenddate;  // 证件结束日期
		}
		var maxheight = $(_pageId+" .upload_box").height()+"px";
		$(_pageId+" .upload_box").css("height",maxheight);  // 设置回显照片区域高度不变
		switch(Number($(_pageId+" .upload_btn li:eq(0)").attr("last-media-id")))
		{
			// 正面照
			case 4 : 
				if(fillInformationInParam.idno.length == 0)
				{
					layerUtils.iAlert("身份证号码识别失败，需重新拍摄，请注意拍摄的角度和光线！",-1);
					$(_pageId+" .positive").text("");  // 先将  li 置空
					$(_pageId+" .positive").attr("uploaded","false");  // 标识图片未上传
					$(_pageId+" .positive").append("<dd><p>点击上传身份证</p><h5>正 面</h5></dd>");
					return false;
				}
				else if(fillInformationInParam.gender.length == 0)
				{
					layerUtils.iAlert("性别识别失败，需重新拍摄，请注意拍摄的角度和光线！",-1);
					$(_pageId+" .positive").text("");  // 先将  li 置空
					$(_pageId+" .positive").attr("uploaded","false");  // 标识图片未上传
					$(_pageId+" .positive").append("<dd><p>点击上传身份证</p><h5>正 面</h5></dd>");
					return false;
				}
				$(_pageId+" .positive").text("");  // 先将  li 置空
				$(_pageId+" .positive").attr("uploaded","true");  // 标识图片已经上传
				$(_pageId+" .positive").append("<dd><img src=\""+base64Str+"\"/></dd>");  // 回显图片
				break;
			// 反面照
			case 5 : 
				if(fillInformationInParam.idbegindate.length == 0)
				{
					layerUtils.iAlert("身份证的有效期限识别失败，需重新拍摄，请注意拍摄的角度和光线！",-1);
					$(_pageId+" .negative").text("");  // 先将  li 置空
					$(_pageId+" .negative").attr("uploaded","false");  // 标识图片未上传
					$(_pageId+" .negative").append("<dd><p>点击上传身份证</p><h5>反 面</h5></dd>");
					return false;
				}
				else if(fillInformationInParam.idenddate.length == 0)
				{
					layerUtils.iAlert("身份证的有效期限识别失败，需重新拍摄，请注意拍摄的角度和光线！",-1);
					$(_pageId+" .negative").text("");  // 先将  li 置空
					$(_pageId+" .negative").attr("uploaded","false");  // 标识图片未上传
					$(_pageId+" .negative").append("<dd><p>点击上传身份证</p><h5>反 面</h5></dd>");
					return false;
				}
				$(_pageId+" .negative").text("");  // 先将  li 置空
				$(_pageId+" .negative").attr("uploaded","true");  // 标识图片已上传
				$(_pageId+" .negative").append("<dd><img src=\""+base64Str+"\"/></dd>");  // 回显图片
				break;
		}
		$(_pageId+" .upload_box img").css("max-height",maxheight);  //设置图片展示大小
	}
	
	/*获取数字证书协议*/
	function queryCertAgreement()
	{
		//中登证书协议：certprotcl 自建证书协议：zjcertprotcl
		var getDigitalParam = {"category_englishname" : "certprotcl"};
		service.queryProtocolList(getDigitalParam,function(data){
		//	alert("获取数字证书协议"+JSON.stringify(data));
			$(_pageId+" #icon_Check").html("已阅读并同意");
			var error_no = data.error_no,
		          error_info = data.error_info;
			if(error_no == 0 && data.results)
			{
				// 《中登个人数字证书申请责任书》
				if(data.results[0] != undefined)
				{
					$(_pageId+" #icon_Check").append("<a href=\"javascript:void(0)\" id=\"protocol00\">《"+data.results[0].econtract_name+"》</a>");
				}
				// 《电子签名约定书》
				if(data.results[1] != undefined)
				{
					$(_pageId+" #icon_Check").append("<a href=\"javascript:void(0)\" id=\"protocol01\">《"+data.results[1].econtract_name+"》</a>");
				}
				// 预绑定查看协议的事件
				appUtils.preBindEvent($(_pageId+" #icon_Check"),"#protocol00",function(e){
					e.stopPropagation();  // 阻止冒泡
					appUtils.pageInit("account/uploadPhoto","account/showDigitalProtocol",{"protocolId" : data.results[0].econtract_no});
				});
				// 预绑定查看协议的事件
				appUtils.preBindEvent($(_pageId+" #icon_Check"),"#protocol01",function(e){
					e.stopPropagation();  // 阻止冒泡
					appUtils.pageInit("account/uploadPhoto","account/showDigitalProtocol",{"protocolId" : data.results[1].econtract_no});
				});
			}
			else
			{
				layerUtils.iAlert(data.error_info);
			}
		},true,true,handleTimeout);
	}
	
	/* 处理请求超时 */
	function handleTimeout()
	{
		layerUtils.iConfirm("请求超时，是否重新加载？",function(){
			queryCertAgreement();  // 再次获取中登协议
		});
	}
	
	/* 提交照片 */
	function submitPhoto()
	{
		// 提交照片
		fillInformationInParam.user_id = appUtils.getSStorageInfo("user_id");
		fillInformationInParam.infocolect_channel = iBrowser.pc ? 0 : 3,  //信息来源渠道 0：PC  3：手机
		fillInformationInParam.idtype = "00";
		fillInformationInParam.idcardmodify = "0";
		fillInformationInParam.nationality = "156";
		fillInformationInParam.edu = "";
		fillInformationInParam.profession_code = "";
		fillInformationInParam.recommendno = "";
		fillInformationInParam.ipaddr = appUtils.getSStorageInfo("ip");
		fillInformationInParam.macaddr = appUtils.getSStorageInfo("mac");
		//alert("入参"+JSON.stringify(fillInformationInParam));
		service.submitPhoto(fillInformationInParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no ==0)
			{
				// 获取邮编
				var postnumParam = {"addr" : fillInformationInParam.native};
				service.queryPostid(postnumParam,function(data){
					var error_no = data.error_no;
					var postnum = "";  //邮编号码
					if(error_no == 0 && data.results.length != 0)
					{
						postnum = data.results[0].post;
						fillInformationInParam.postid = postnum;
					}
					/**
					 * 在切换页面之前，将图片的 base64 编码和图片识别数据保存到 session 中
					 * 转户走新开户流程时，在提交资料的时候跳转到照片上传页面，此时用户不需要上传正面照和反面照，只需补全人脸正像
					 */
					var photosInfo = {
						// 正面照 photo4，反面照 photo5
						"photo4" : "",
						"photo5" : "",
						// 填写资料的页面入参
						"fillInformationInParam" : fillInformationInParam,
						// 设置 photosInfo 的 isChangeProcess 属性，true 是更改流程，初始值为 false
						"isChangeProcess" : false
					};
					photosInfo.photo4 = $(_pageId+" .positive img").attr("src");
					photosInfo.photo5 = $(_pageId+" .negative img").attr("src");
					// 将数据保存到 session 中
					appUtils.setSStorageInfo("photosInfo",JSON.stringify(photosInfo));
					appUtils.pageInit("account/uploadPhoto","account/personInfo",fillInformationInParam);
					appUtils.clearSStorage("personInfo");  // 清除资料提交步骤标记
					appUtils.clearSStorage("currentStep");  // 清除用户步骤记录
				},false);
			}
			else
			{
				layerUtils.iLoading(false);
				layerUtils.iAlert(data.error_info,-1);
			}
		},false);
	}
	
	var uploadPhoto = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"pageBack" : pageBack,
		"destroy" : destroy
	};
	
	/* 暴露对外的接口 */
	module.exports = uploadPhoto;
});