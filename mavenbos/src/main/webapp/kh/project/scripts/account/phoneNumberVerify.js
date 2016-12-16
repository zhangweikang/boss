/**
 * 手机号码验证
*/
define("project/scripts/account/phoneNumberVerify",function(require,exports,module){
	/* 私有业务模块的全局变量 begin */
	var $ = jQuery = require('jquery');
	var appUtils = require("appUtils"),
		service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		global = require("gconfig").global,
        gconfig = require("gconfig"),
		layerUtils = require("layerUtils"), // 弹出层对象
		utils = require("utils"),
		validatorUtil = require("validatorUtil"),
		startCountDown = null,
		backmsg="",
		_pageId = "#account_phoneNumberVerify",
		psw_id = "", key = 1, flag = false;
	/* 私有业务模块的全局变量 end */	
	
	function init()
	{	
		console.log("sumTimeRegistered"+appUtils.getSStorageInfo("mobileNo")+"sumTime_unregistered_key get:"+appUtils.getSStorageInfo("sumTimeRegistered"+appUtils.getSStorageInfo("mobileNo")));	
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		var elements = _pageId +" .phoneNum";
		var backpage= appUtils.getPageParam("backUrl");
		console.log("backpage="+backpage);
		if(backpage=="account/phoneNumberVerify"){
			$(_pageId+" .getmsg").show();  // 显示按钮
			$(_pageId+" .cert_notice").hide();  // 隐藏验证码已发出提示
			$(_pageId+" .time").hide();  // 隐藏倒计时
			if(appUtils.getSStorageInfo("mobileNo")==""){
				$(_pageId+" .phoneNum").css({color:"#E3E3E3"}).val("请输入手机号码");
			}else{
				$(_pageId+" .phoneNum").css({color:"#2F2F2F"}).val(appUtils.getSStorageInfo("mobileNo"));
			}
		}
	}
	
	function bindPageEvent(){
		/* 绑定返回事件 */
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			appUtils.pageInit("account/phoneNumberVerify","account/openAccount",{});
		});
		
		/* 绑定退出按钮*/
		appUtils.bindEvent($(_pageId+" .header .icon_close"),function(){
			utils.layerTwoButton("退出系统？","确认","取消",function(){
				if(navigator.userAgent.indexOf("Android") > 0) {
						require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
				}
				if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
					window.location.href="backClientSide";
				}
			},
			function(){return false;});
		});
		
		/* 限制手机号在IOS上的长度 */
		appUtils.bindEvent($(_pageId+" .phoneNum"),function(){
			utils.dealIPhoneMaxLength(this,11); //处理iphone兼容
		},"input");
		
		
		/* 下一步(继续开户) */
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn") ,function(){
		appUtils.setSStorageInfo("tpbankFlg","0");		//新注册三方存管和三方支付没有
	    appUtils.setSStorageInfo("idnoDD","");			//顶点身份证号为空
	   	appUtils.setSStorageInfo("branchno","");		//营业部为空
   		
			var mobileNo=$(_pageId+" .phoneNum").val();
		    if(mobileNo.length == 0)
			{
				layerUtils.iMsg(-1,"请输入手机号！");
				return;
			}
			if(isNaN(mobileNo)){
				layerUtils.iMsg(-1,"请输入正确数字格式的手机号！");
				return;
			}
		    if(mobileNo.length < 11)
			{
				layerUtils.iMsg(-1,"请您输入11位的手机号！");
				return;
			}
			var telReg = !!mobileNo.match(/^(1\d{10})$/);
			//如果手机号码不能通过验证
			if(telReg == false){
			 	layerUtils.iMsg(-1,"请输入正确格式的手机号！");
				return;
			}
			
			var param = {
				"step" : "isToukerUser",
				"mobileNo" : mobileNo
			};
			
			require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){
				/*service.hbAjax(param,function(data){
				     	appUtils.setSStorageInfo("mobileNo",mobileNo);// 保存手机号码到缓存中 
				     	// 已在投客网注册用户	{"errorMsg":"1","errorNo":0,"results":{"dataSet":{"message":"1","client_id":"010000061670"}}}
				        if(data.errorNo==0 && data.errorMsg=="1"){
				        	 var client_id = data.results.dataSet.client_id;
				        	 if(client_id != null){
				        	 	appUtils.setSStorageInfo("khh",client_id);//将客户号号加入到缓存中 
				        	 }else{
			                   		appUtils.setSStorageInfo("khh","");	//清空客户号
				        	 }
				        	appUtils.pageInit("account/phoneNumberVerify","account/phoneCodeVerify");
				        }else if(data.errorNo==0 && data.errorMsg=="0"){ // 没有在投客网注册用户  走注册流程
				       		appUtils.pageInit("account/phoneNumberVerify","account/phoneToukerRegister");
				        }else{
				        	 layerUtils.iMsg(-1,"系统异常，请稍后重试！");
				        }
			     });*/
				
				$.post(appToolsUrl+"touker/isToukerUser",utils.getParamJson(param),function(data){
					if(data.status == "001012"){
			        	 var client_id = data.status.customerId;
			        	 if(client_id != null){
			        	 	appUtils.setSStorageInfo("khh",client_id);//将客户号号加入到缓存中 
			        	 }else{
		                   		appUtils.setSStorageInfo("khh","");	//清空客户号
			        	 }
			        	appUtils.pageInit("account/phoneNumberVerify","account/phoneCodeVerify");
			        }else if(data.status == "001011"){ // 没有在投客网注册用户  走注册流程
			       		appUtils.pageInit("account/phoneNumberVerify","account/phoneToukerRegister");
			        }else{
			        	 layerUtils.iMsg(-1,"系统异常，请稍后重试！");
			        }
				});
			},function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(param)});
		});
	}
		
	function destroy()
	{
		// 清除计时器
		if(startCountDown != null)
		{
			window.clearInterval(startCountDown);
		}
		if(backmsg == 1){
			$(_pageId+" .getmsg").show();  // 显示按钮
			$(_pageId+" .cert_notice").hide();  // 隐藏验证码已发出提示
			$(_pageId+" .time").hide();  // 隐藏倒计时
		}else{
			$(_pageId+" .getmsg").show();  // 显示按钮
			$(_pageId+" .cert_notice").hide();  // 隐藏验证码已发出提示
			$(_pageId+" .time").hide();  // 隐藏倒计时
			$(_pageId+" .phoneNum").val("");  //清除手机号
			$(_pageId+" .pic_code").val("");  //清除手机号
		}
		service.destroy();
	}
	
	var phoneNumberVerify = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	//暴露接口
	module.exports = phoneNumberVerify;
});