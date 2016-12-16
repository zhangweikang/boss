/**
 * 驳回影像上传
 */
define("project/scripts/account/backUploadPhoto",function(require, exports, module){ 
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
		   service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		   layerUtils = require("layerUtils"),
		   gconfig = require("gconfig"),
		   global = gconfig.global,
		   serverPath = global.serverPath,
		   _pageId = "#account_backUploadPhoto",
		   font = "",
	       back = "",
		   nohat = "";
	/* 私有业务模块的全局变量 end */	
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		window.imgState = imgState;  //上传完照片自动调用该方法
		initPage();  // 初始化页面
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
		
		/* 绑定上传正面身份证照 */
		appUtils.bindEvent($(_pageId+" .upload_main .positive"),function(e){
		    if(gconfig.platform == '1'){
				//改变手势状态
				require("shellPlugin").callShellMethod("changeStatusPlugin",null,null,{"flag":true});
			}
			$(_pageId+" .upload_main .negative").removeClass("active");
			$(_pageId+" .upload_main .headpic").removeClass("active");
			var isActive = $(this).hasClass("active");
			switchCss($(_pageId+" .upload_main .positive"), isActive, 4);
			$(_pageId+" .upload_btn h5").html("上传身份证正面");
			e.stopPropagation();
		});
		
		/* 绑定上传反面身份证照 */
		appUtils.bindEvent($(_pageId+" .upload_main .negative"),function(e){
		    if(gconfig.platform == '1'){
				//改变手势状态
				require("shellPlugin").callShellMethod("changeStatusPlugin",null,null,{"flag":true});
			}
			$(_pageId+" .upload_main .positive").removeClass("active");
			$(_pageId+" .upload_main .headpic").removeClass("active");
			var isActive = $(this).hasClass("active");
			switchCss($(_pageId+" .upload_main .negative"), isActive , 5);
			$(_pageId+" .upload_btn h5").html("上传身份证反面");
			e.stopPropagation();
		});
		
		/*人像正面 */
		appUtils.bindEvent($(_pageId+" .upload_main .headpic"),function(e){
			if(gconfig.platform == '1'){
				//改变手势状态
				require("shellPlugin").callShellMethod("changeStatusPlugin",null,null,{"flag":true});
			}
			$(_pageId+" .upload_main .positive").removeClass("active");
			$(_pageId+" .upload_main .negative").removeClass("active");
			var isActive = $(this).hasClass("active");
			switchCss($(_pageId+" .upload_main .headpic"), isActive , 3);
			$(_pageId+" .upload_btn h5").html("上传大头像");
			e.stopPropagation();
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
				"clientinfo" : appUtils.getSStorageInfo("clientinfo"),	// 从 session 中将 clientinfo 取出
				"jsessionid" : appUtils.getSStorageInfo("jsessionid")	// 从 session 中将 jsessionid 取出
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
			e.stopPropagation();
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
				"clientinfo" : appUtils.getSStorageInfo("clientinfo"),	// 从 session 中将 clientinfo 取出
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
			e.stopPropagation();
		});
		
		/* 绑定下一步 */
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn"),function(){
			$(_pageId+" .upload_btn").hide();  // 隐藏照片按钮
			nextStep();  //下一步确认
		});
	}
	
	function destroy()
	{
		service.destroy();
	}
	
	/* 初始化页面 */
	function initPage()
	{
		// 给补全信息赋值
	    front = appUtils.getPageParam("needFront");
		back = appUtils.getPageParam("needBack");
	    nohat = appUtils.getPageParam("needNohat");
		// 只补全正面照
		if(front==1 && back !=1 && nohat !=1)
		{
			$(_pageId+" .upload_main .positive").show();  //显示上传身份证正面
			$(_pageId+" .upload_main h5:eq(0)").html("补充身份证正面影像");
		}
		// 只补全反面照
		if(front !=1 && back ==1 && nohat !=1)
		{
			$(_pageId+" .upload_main .negative").show();  //显示上传身份证反面
			$(_pageId+" .upload_main h5:eq(0)").html("补充身份证反面影像");
		}
		// 只补全大头像
		if(front !=1 && back !=1 && nohat ==1)
		{
			$(_pageId+" .upload_main .headpic").show();  //显示上传大头像
			$(_pageId+" .upload_main h5:eq(0)").html("补充大头像");
		}
		// 补全正面和反面
		if(front==1 && back ==1 && nohat !=1)
		{
			$(_pageId+" .upload_main .positive").show();  //显示上传身份证正面
			$(_pageId+" .upload_main .negative").show();  //显示上传身份证反面
			$(_pageId+" .upload_main h5:eq(0)").html("补充身份证正、反面影像");
		}
		// 补全正面和大头像
		if(front==1 && back !=1 && nohat ==1)
		{
			$(_pageId+" .upload_main .positive").show();  //显示上传身份证正面
			$(_pageId+" .upload_main .headpic").show();  //显示上传大头像
			$(_pageId+" .upload_main h5:eq(0)").html("补充身份证正面影像和大头像");
		}
		// 补全反面和大头像
		if(front !=1 && back ==1 && nohat ==1)
		{
			$(_pageId+" .upload_main .negative").show();  //显示上传身份证反面
			$(_pageId+" .upload_main .headpic").show();  //显示上传大头像
			$(_pageId+" .upload_main h5:eq(0)").html("补充身份证反面影像和大头像");
		}
		// 三张全部补全
		if(front==1 && back ==1 && nohat ==1)
		{
			$(_pageId+" .upload_main .positive").show();  //显示上传身份证正面
			$(_pageId+" .upload_main .negative").show();  //显示上传身份证反面
			$(_pageId+" .upload_main .headpic").show();  //显示上传大头像
			$(_pageId+" .upload_main h5:eq(0)").html("补充以下相关影像");
		}
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
	
	/* 供图片上传成功后调用 */
	function imgState(mediaId,data)
	{
		if(gconfig.platform == 3)
		{
			layerUtils.iLoading(false);
			data = unescape(data);
		}
		// 返回的是 json 串
		data = JSON.parse(data);
		var base64Str = (data.base64).replace(/[\n\r]*/g,"");
		if(data.error_no != 0)
		{
			layerUtils.iAlert(data.error_info);
			return false;
		}
		var maxheight = $(_pageId+" .upload_box").height()+"px";
		$(_pageId+" .upload_box").css("height",maxheight);  //设置回显照片区域高度不变
		switch(Number($(_pageId+" .upload_btn li:eq(0)").attr("last-media-id")))
		{
			// 大头像
			case 3 : 
				// 先将  li 置空
				$(_pageId+" .headpic").text("");
				// 显示照片
				$(_pageId+" .headpic").append("<dd><img src=\""+base64Str+"\"/></dd>");
				break;
			// 正面照
			case 4 : 
				if(data.results[0].idno.length == 0)
				{
					layerUtils.iAlert("身份证号码识别失败，需重新拍摄，请注意拍摄的角度和光线！",-1);
					// 先将  li 置空
					$(_pageId+" .positive").text("");
					// 设置 uploaded 属性，标识图片是否已经上传
					$(_pageId+" .positive").attr("uploaded","false");
					// 显示上传照片
					$(_pageId+" .positive").append("<dd><p>点击上传身份证</p><h5>正 面</h5></dd>");
					return;
				}
				else if(data.results[0].usersex.length == 0)
				{
					layerUtils.iAlert("性别识别失败，需重新拍摄，请注意拍摄的角度和光线！",-1);
					// 先将  li 置空
					$(_pageId+" .positive").text("");
					// 设置 uploaded 属性，标识图片是否已经上传
					$(_pageId+" .positive").attr("uploaded","false");
					// 显示上传照片
					$(_pageId+" .positive").append("<dd><p>点击上传身份证</p><h5>正 面</h5></dd>");
					return;
				}
				// 先将  li 置空
				$(_pageId+" .positive").text("");
				// 设置 uploaded 属性，标识图片是否是否已经上传
				$(_pageId+" .positive").attr("uploaded","true");
				// 显示照片
				$(_pageId+" .positive").append("<dd><img src=\""+base64Str+"\"/></dd>");
				break;
			// 反面照
			case 5 : 
				if(data.results[0].idbegindate.length == 0)
				{
					layerUtils.iAlert("身份证的有效期限识别失败，需重新拍摄，请注意拍摄的角度和光线！",-1);
					// 先将  li 置空
					$(_pageId+" .negative").text("");
					// 设置 uploaded 属性，标识图片是否是否已经上传
					$(_pageId+" .negative").attr("uploaded","false");
					// 显示上传照片
					$(_pageId+" .negative").append("<dd><p>点击上传身份证</p><h5>反 面</h5></dd>");
					return;
				}
				else if(data.results[0].idenddate.length == 0)
				{
					layerUtils.iAlert("身份证的有效期限识别失败，需重新拍摄，请注意拍摄的角度和光线！",-1);
					// 先将  li 置空
					$(_pageId+" .negative").text("");
					// 设置 uploaded 属性，标识图片是否已经上传
					$(_pageId+" .negative").attr("uploaded","false");
					// 显示上传照片
					$(_pageId+" .negative").append("<dd><p>点击上传身份证</p><h5>反 面</h5></dd>");
					return;
				}
				// 先将  li 置空
				$(_pageId+" .negative").text("");
				// 设置 uploaded 属性，标识图片是否已经上传
				$(_pageId+" .negative").attr("uploaded","true");
				// 显示照片
				$(_pageId+" .negative").append("<dd><img src=\""+base64Str+"\"/></dd>");
				break;
		}
		//设置图片展示大小
		$(_pageId+" .upload_box img").css("max-height",maxheight);
	}
	
	/* 确认下一步 */
	function nextStep()
	{
		// 只补全正面照
		if(front==1 && back !=1 && nohat !=1)
		{
			if($(_pageId+" .positive img").length == 0)
			{
				layerUtils.iMsg(-1,"请先上传正面照！");
				return false;
			}
		}
		// 只补全反面照
		if(front !=1 && back ==1 && nohat !=1)
		{
			if($(_pageId+" .negative img").length == 0)
			{
				layerUtils.iMsg(-1,"请先上传反面照！");
				return false;
			}
		}
		// 只补全大头像
		if(front !=1 && back !=1 && nohat ==1)
		{
			if($(_pageId+" .headpic img").length == 0)
			{
				layerUtils.iMsg(-1,"请先上传人像正面！");
				return false;
			}
		}
		// 补全正面和反面
		if(front==1 && back ==1 && nohat !=1)
		{
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
		}
		// 补全正面和大头像
		if(front==1 && back !=1 && nohat ==1)
		{
			if($(_pageId+" .positive img").length == 0)
			{
				layerUtils.iMsg(-1,"请先上传正面照！");
				return false;
			}
			if($(_pageId+" .headpic img").length == 0)
			{
				layerUtils.iMsg(-1,"请先上传人像正面！");
				return false;
			}
		}
		// 补全反面和大头像
		if(front !=1 && back ==1 && nohat ==1)
		{
			if($(_pageId+" .negative img").length == 0)
			{
				layerUtils.iMsg(-1,"请先上传反面照！");
				return false;
			}
			if($(_pageId+" .headpic img").length == 0)
			{
				layerUtils.iMsg(-1,"请先上传人像正面！");
				return false;
			}
		}
		// 三张全部补全
		if(front==1 && back ==1 && nohat ==1)
		{
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
			if($(_pageId+" .headpic img").length == 0)
			{
				layerUtils.iMsg(-1,"请先上传人像正面！");
				return false;
			}
		}
		//调用提交补全资料接口
		var notifyParam = {
			"userid" : appUtils.getSStorageInfo("user_id"),
			"fieldname" : "photo"  // 通知图片已补全
		};
		service.rejectStep(notifyParam,function(data){
			if(data.error_no == 0)
			{
				appUtils.setSStorageInfo("isBack", "backInfo");  //标志重新提交资料成功
				var videoParam = appUtils.getSStorageInfo("videoParam");
				var accountParam = appUtils.getSStorageInfo("accountParam");
				var pwdParam = appUtils.getSStorageInfo("pwdParam");
				var thirdParam = appUtils.getSStorageInfo("thirdParam");
				videoParam = JSON.parse(videoParam);
				accountParam = JSON.parse(accountParam);
				pwdParam = JSON.parse(pwdParam);
				thirdParam = JSON.parse(thirdParam);
				// 需要继续驳回到视频
				if(videoParam.need_video == 1)
				{
					appUtils.pageInit("account/backUploadPhoto","account/videoNotice",videoParam);
				}
				// 需要继续驳回到开股东卡
				else if(accountParam.need_account == 1)
				{
					appUtils.pageInit("account/backUploadPhoto","account/backSignProtocol",accountParam);
				}
				// 需要驳回资金或交易密码
				else if(pwdParam.needBusinessPwd ==1 || pwdParam.needFundPwd == 1)
				{
					appUtils.pageInit("account/backUploadPhoto","account/backSetPwd",pwdParam);  //跳转设置密码页面
				}
				// 需要驳回到三方存管
				else if(thirdParam.needThirdDeposit == 1)  
				{
					appUtils.pageInit("account/backUploadPhoto","account/backThirdDepository",thirdParam);  //返回结果页
				}
				else
				{
					appUtils.pageInit("account/backUploadPhoto","account/accountSuccess",{});
				}
			}
		});
	}
	
	var backUploadPhoto = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = backUploadPhoto;
});