/**
 * 三方存管
 */
define("project/scripts/account/thirdDepository",function(require, exports, module){ 
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
		global = require("gconfig").global,
		gconfig = require("gconfig"),
		service = require("serviceImp").getInstance(),  // 业务层接口，请求数据
		layerUtils = require("layerUtils"),
		utils = require("utils"),
		validatorUtil = require("validatorUtil"),
		zzispwd = 1,  // zzispwd	密码方式，1 需要，0 不需要
		iscard = 1,  // iscard	是否需要银行卡，1 需要，0 不需要
	    keyTelPanel = require("keyTelPanel"),
		protocol = null,  // 协议保存
		cert_type = appUtils.getSStorageInfo("openChannel") == "new" ? "zd" : "tw", // tw:天威 zd:中登
		_pageId = "#account_thirdDepository";
	/* 私有业务模块的全局变量 end */
	
	function init()
	{
		//修改钱钱炒股或者证券开户部分提示信息内容样式
		var openChannel = global.openChannel;
		if(openChannel == "1"){
			$(_pageId+" .user_form p").css("color","#4883F6");
			$(_pageId+" .l_link").css("color","#4883F6");
		}
		
		//加载样式
		$(_pageId+" .input_custom").click(function(){$(this).addClass("active")});
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		appUtils.setSStorageInfo("bankListBackUrl","thirdDepository");
		initPage();  // 初始化页面并检测证书是否存在
		
		
	}
	
	function bindPageEvent(){
		/* 绑定返回事件 */
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
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
			appUtils.setSStorageInfo("backThirdDepository", 3);
			appUtils.pageBack();
		});
		
		/* 签署银行相关协议  */
		appUtils.bindEvent($(_pageId+" .rule_check01 a"),function(){
			$(this).toggleClass("checked"); 
		});
				
		/* 选择银行绑定下拉框按钮事件  */
		appUtils.bindEvent($(_pageId+" #selectBank"),function(e){
			//跳转银行卡列表页面
			appUtils.pageInit("account/backThirdDepository", "account/bankList", {});
		});

		/* 选择银行卡绑定选择某银行事件 */
		appUtils.bindEvent($(_pageId+" #input_text_bankcard"),function(e){
			    validateSelectBank(); // 验证是否选择银行卡
				//监听整个界面
				keyTelPanel.closeKeyPanel();
				$(".input_custom").removeClass("active"); // 移除输入框的焦点
				var evt = e || window.event;
				evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = true);
		});
		
	    /* 点击页面关闭键盘 */
		appUtils.bindEvent($(_pageId),function(e){
			//监听整个界面
			keyTelPanel.closeKeyPanel();
			$(".input_custom").removeClass("active"); // 移除输入框的焦点
			utils.closeBigNoTips();
			e.stopPropagation();
		});
		
		/*银行卡号输入*/
	    appUtils.bindEvent($(_pageId+" #input_text_bankcard"),function(e){
				var loginPassword_keyboard = $(this);
				if(loginPassword_keyboard.find("em").text() == "请输入银行卡号"){
					loginPassword_keyboard.find("em").html("");//清空
				}
				
				$(_pageId+" .input_custom").removeClass("active"); // 移除输入框的焦点
				$(_pageId+" #input_text_bankcard .input_custom").addClass("active");
			    loginPassword_keyboard.find("em").css({color:"#9F9F9F"});  // 添加输入框的焦点
				//loginPassword_keyboard.addClass("active").find("em").css({color:"#9F9F9F"});  // 添加输入框的焦点
				keyTelPanel.init_keyPanel(function(value){
					var curValue = loginPassword_keyboard.find("em").html();  // 账号的值
					if(value == "del")
					{
						loginPassword_keyboard.find("em").html(curValue.slice(0, -1));
					}
					else
					{
						if(curValue.length < 19)
						{
							loginPassword_keyboard.find("em").html(curValue + value);
						}
						else
						{
							layerUtils.iMsg(-1, "银行卡号最多 19 位!");
						}
					}
					utils.dealIPhoneMaxLength($(_pageId+" #input_text_bankcard"),19); // 处理iphone兼容
					var openChannel = global.openChannel;
					var color = "#C50436";	//证券开户
					if(openChannel == "1"){	//钱钱炒股
						color= "#4883F6";
					}
						
					utils.showBigNo($(_pageId+"	#input_text_bankcard_keyboard"),2,color);  // 调用放大镜插件
				}, loginPassword_keyboard);
			e.stopPropagation();
		});

		/* 银行密码输入框 */
		appUtils.bindEvent($(_pageId+" #input_text_bankcardPwd"),function(e){
			    validateSelectBank();  // 验证是否选择银行卡
			    utils.dealIPhoneMaxLength(this,6); // 处理iphone兼容
				var loginPassword_keyboard = $(this);
				loginPassword_keyboard.find("em").html("");  // 清空密码
				loginPassword_keyboard.attr("data-password","");  // 清空密码值
				$(_pageId+" .input_custom").removeClass("active");    // 移除输入框的焦点
				$(_pageId+" #input_text_bankcardPwd .input_custom").addClass("active");
			    loginPassword_keyboard.find("em").css({color:"#9F9F9F"});  // 添加输入框的焦点
				//loginPassword_keyboard.addClass("active").find("em").css({color:"#9F9F9F"});  // 添加输入框的焦点
				keyTelPanel.init_keyPanel(function(value){
					var curEchoText = loginPassword_keyboard.find("em").html();  // 密码回显文本
				    var curPwd = loginPassword_keyboard.attr("data-password") || "";  // 密码值
					if(value == "del")
					{
						loginPassword_keyboard.find("em").html(curEchoText.slice(0, -1));
						loginPassword_keyboard.attr("data-password", curPwd.slice(0, -1));
					}
					else
					{
						if(curPwd.length < 6)
						{
							loginPassword_keyboard.attr("data-password", curPwd + value);  // 设置密码值
							loginPassword_keyboard.find("em").html(curEchoText + "*");
						}
						else
						{
							layerUtils.iMsg(-1, "交易密码最多 6位!");
						}
					}
				}, loginPassword_keyboard);
			e.stopPropagation();  // 阻止冒泡
		});
		
		/* 开通三方存管按钮绑定事件 */
		appUtils.bindEvent($(_pageId+" .ct_btn"),function(){
			signProtocol();  // 提交验签，并且提交三方存管信息
		});
	}
	
	function destroy()
	{
	   if(appUtils.getSStorageInfo("backThirdDepository") ==3 || appUtils.getSStorageInfo("pagebackthird") == 3 || appUtils.getSStorageInfo("pageBackThirdNext") == 4 || appUtils.setSStorageInfo("backSetPwd") == "againSetpwd"){
           return false
		}
		service.destroy();
	}
	
	/* 初始化页面 */
	function initPage()
	{
		layerUtils.iLoading(true);  // 开启等待层。。。
		// 本页面需要用到证书，如果进入本页面时，证书不存在就下载并安装证书
		var existsParam = {
			"userId" : appUtils.getSStorageInfo("user_id"),
			"mediaid" : "certificate",
			"type" : cert_type
		};
		require("shellPlugin").callShellMethod("fileIsExistsPlugin",function(data){
			// 如果未检测到本地有证书，就安装证书
			if(data.mediaId == "")
			{
				utils.installCertificate(null);  // 下载安装证书，并且加载银行列表
			}
			layerUtils.iLoading(false);
		},function(){
			// 关闭等待层。。。
			layerUtils.iLoading(false);
		},existsParam);

		//加载银行详情
		bankInfo();
	}

	function bankInfo() {
		//获取sessionStorage中的银行Code
		var bankCode = appUtils.getSStorageInfo("bankCode");
		var queryParam = {"bindtype": "", "ispwd": "", "step": "bankInfo", "bankCode": bankCode};
		if (bankCode == null) {
			return;
		}
		console.log("进入获取银行信息-----bankCode="+bankCode);
		service.queryBankList(queryParam, function (data) {
			var errorNo = data.error_no;
			var errorInfo = data.error_info;
			console.log("获取银行信息结果-----data="+data);
			if (errorNo == 0 && data.results.length != 0) {
				var bankInfo = data.results[0],
						banckName = bankInfo.bankname,
						bankcode = bankInfo.bankcode,
						signInfo = bankInfo.sign_info,  // 提示信息
						zzbindtype = bankInfo.zzbindtype;  // 绑定方式
				zzispwd = bankInfo.zzispwd;  // 密码方式
				iscard = bankInfo.iscard;  // 是否需要银行卡号
				$(_pageId + " #selectBank").text(banckName);
				$(_pageId + " .protocolshow").show();
				addBankItem(banckName, bankcode, zzbindtype, signInfo);
				e.stopPropagation();
			}
			else {
				layerUtils.iAlert(errorInfo, -1);
			}
		}, true, true, handleTimeout);
	}

	/* 处理请求超时 */
	function handleTimeout() {
		layerUtils.iConfirm("请求超时，是否重新加载？", function () {
			bankInfo();  // 再次获取银行列表
		});
	}
	/* 为选择银行列表添加选中银行数据 */
	function addBankItem(banckName,id,zzbindtype,signInfo)
	{
		// 显示银行的签约信息
		if(signInfo != "" && signInfo != undefined)
		{
			$(_pageId+" #signInfo").html("温馨提示: "+signInfo);
		}
		else 
		{
			$(_pageId+" #signInfo").html(""); 
		}
//		$(_pageId+" #input_text_bankcard").find("em").html(""); // 清空银行卡号值
//		$(_pageId+" #input_text_bankcardPwd").find("em").html("");// 清空银行卡密码
		$(_pageId+" #input_text_bankcardPwd").attr("data-password","");  // 清空密码值
		$(_pageId+" #selectBank").html(banckName);  // 赋值银行卡名称
		$(_pageId+" #selectBank").attr("bankcode",id);
		$(_pageId+" #selectBank").attr("zzbindtype",zzbindtype);
		getDepositoryAgreement(id);  // 获取银行协议内容
		if(zzbindtype == 1)   // 判断一步式
		{
			if(zzispwd == 0)  // 不需要输入密码
			{
				$(_pageId+" #input_text_bankcardPwd").parent().hide();  // 隐藏银行密码输入框
			}
			else   // 需要输入密码
			{
				$(_pageId+" #input_text_bankcardPwd").parent().show();  // 显示银行密码输入框
			}
			$(_pageId+" .user_form .input_form:eq(1)").show();  // 显示银行卡、密码输入框
			$(_pageId+" #bindInfo").hide();  // 隐藏预指定提示信息
		}
		if(zzbindtype == 2)  // 判断预指定(二步式)
		{
			if(iscard == 1)  // 需要银行卡
			{
				$(_pageId+" .user_form .input_form:eq(1)").show();  // 显示银行卡
				$(_pageId+" .user_form .input_form:eq(1) .input_text:eq(1)").hide();  // 隐藏密码
			}
			else // 不需要银行卡
			{
				$(_pageId+" .user_form .input_form:eq(1)").hide();  // 隐藏银行卡、密码输入框
				//modify by xujianhua at 20151027	如果是预指定不需要银行卡号，需要清理银行卡号文本框的值
				$(_pageId+" #input_text_bankcard_keyboard").find("em").html("");  // 清空银行卡号值
			}
			$(_pageId+" #bindInfo").show();  // 显示预指定提示信息
		}
	 switch (banckName) {
	     case "农业银行":
	          $(_pageId + " #tips0").hide();
	          $(_pageId + " #tips1").hide();
	          $(_pageId + " #tips2").hide();
	          $(_pageId + " #tips3").hide();
	          $(_pageId + " #tips4").hide();
	          $(_pageId + " #tips5").hide();
	          $(_pageId + " #tips6").hide();
	          $(_pageId + " #tips7").hide();
	          $(_pageId + " #tips8").hide();
	          $(_pageId + " #tips9").hide();
	          $(_pageId + " #bindInfo").hide();
          break;
	     case "上海银行":
	          $(_pageId + " #tips0").hide();
	          $(_pageId + " #tips1").hide();
	          $(_pageId + " #tips2").hide();
	          $(_pageId + " #tips3").hide();
	          $(_pageId + " #tips4").hide();
	          $(_pageId + " #tips5").hide();
	          $(_pageId + " #tips6").hide();
	          $(_pageId + " #tips7").hide();
	          $(_pageId + " #tips8").hide();
	          $(_pageId + " #tips9").hide();
	          $(_pageId + " #bindInfo").hide();
	          break;
	     case "光大银行":
	          $(_pageId + " #tips0").hide();
	          $(_pageId + " #tips1").hide();
	          $(_pageId + " #tips2").hide();
	          $(_pageId + " #tips3").hide();
	          $(_pageId + " #tips4").hide();
	          $(_pageId + " #tips5").hide();
	          $(_pageId + " #tips6").hide();
	          $(_pageId + " #tips7").hide();
	          $(_pageId + " #tips8").hide();
	          $(_pageId + " #tips9").hide();
	          $(_pageId + " #bindInfo").hide();
	          break;
	     case "浦发银行":
	          $(_pageId + " #tips0").hide();
	          $(_pageId + " #tips1").hide();
	          $(_pageId + " #tips2").show();
	          $(_pageId + " #tips3").hide();
	          $(_pageId + " #tips4").hide();
	          $(_pageId + " #tips5").hide();
	          $(_pageId + " #tips6").hide();
	          $(_pageId + " #tips7").hide();
	          $(_pageId + " #tips8").hide();
	          $(_pageId + " #tips9").hide();
	          $(_pageId + " #bindInfo").hide();
	          break;
        case "兴业银行":
            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").show();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").hide();
            $(_pageId + " #tips4").hide();
            $(_pageId + " #tips5").hide();
            $(_pageId + " #tips6").hide();
            $(_pageId + " #tips7").hide();
            $(_pageId + " #tips8").hide();
            $(_pageId + " #tips9").hide();
            $(_pageId + " #bindInfo").hide();
            break;
        case "中信银行":
            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").show();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").hide();
            $(_pageId + " #tips4").hide();
            $(_pageId + " #tips5").hide();
            $(_pageId + " #tips6").hide();
            $(_pageId + " #tips7").hide();
            $(_pageId + " #tips8").hide();
            $(_pageId + " #tips9").hide();
            $(_pageId + " #bindInfo").hide();
            break;
        case "工商银行":

            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").hide();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").show();
            $(_pageId + " #tips4").hide();
            $(_pageId + " #tips5").hide();
            $(_pageId + " #tips6").hide();
            $(_pageId + " #tips7").hide();
            $(_pageId + " #tips8").hide();
            $(_pageId + " #tips9").hide();
            $(_pageId + " #bindInfo").hide();
            break;
        case "广发银行":
            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").hide();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").hide();
            $(_pageId + " #tips4").show();
            $(_pageId + " #tips5").hide();
            $(_pageId + " #tips6").hide();
            $(_pageId + " #tips7").hide();
            $(_pageId + " #tips8").hide();
            $(_pageId + " #tips9").hide();
            $(_pageId + " #bindInfo").hide();
            break;
        case "建设银行":
            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").show();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").hide();
            $(_pageId + " #tips4").hide();
            $(_pageId + " #tips5").hide();
            $(_pageId + " #tips6").hide();
            $(_pageId + " #tips7").hide();
            $(_pageId + " #tips8").hide();
            $(_pageId + " #tips9").hide();
            $(_pageId + " #bindInfo").hide();
            break;
        case "招商银行":
            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").hide();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").hide();
            $(_pageId + " #tips4").hide();
            $(_pageId + " #tips5").hide();
            $(_pageId + " #tips6").show();
            $(_pageId + " #tips7").hide();
            $(_pageId + " #tips8").hide();
            $(_pageId + " #tips9").hide();
            $(_pageId + " #bindInfo").hide();
            break;
        case "交通银行": 
            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").hide();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").hide();
            $(_pageId + " #tips4").hide();
            $(_pageId + " #tips5").hide();
            $(_pageId + " #tips6").hide();
            $(_pageId + " #tips7").show();
            $(_pageId + " #tips8").hide();
            $(_pageId + " #tips9").hide();
            $(_pageId + " #bindInfo").hide();
            break;
        case "中国银行":
            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").hide();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").hide();
            $(_pageId + " #tips4").hide();
            $(_pageId + " #tips5").hide();
            $(_pageId + " #tips6").hide();
            $(_pageId + " #tips7").hide();
            $(_pageId + " #tips8").show();
            $(_pageId + " #tips9").hide();
            $(_pageId + " #bindInfo").hide();
            break;
        case "平安银行":
            $(_pageId + " #tips0").show();
            $(_pageId + " #tips1").hide();
            $(_pageId + " #tips2").hide();
            $(_pageId + " #tips3").hide();
            $(_pageId + " #tips4").hide();
            $(_pageId + "  #tips5").hide();
            $(_pageId + " #tips6").hide();
            $(_pageId + " #tips7").hide();
            $(_pageId + " #tips8").hide();
            $(_pageId + " #tips9").show();
            $(_pageId + " #bindInfo").hide();
            break;
        case "邮政储蓄银行":
            $(_pageId + " #tips0").hide();
	        $(_pageId + " #tips1").hide();
	        $(_pageId + " #tips2").hide();
	        $(_pageId + " #tips3").hide();
	        $(_pageId + " #tips4").hide();
	        $(_pageId + " #tips5").hide();
	        $(_pageId + " #tips6").hide();
	        $(_pageId + " #tips7").hide();
	        $(_pageId + " #tips8").hide();
	        $(_pageId + " #tips9").hide();
	        $(_pageId + " #bindInfo").hide();
	        break;
	 }
	}
	
	/* 签署协议 */
	function signProtocol()
	{
		if(!validateSelectBank())  // 验证是否选择银行
		{
			return false;
		}
		
		if(iscard == "" && !validateBankCorrect()){
			
			return false;
		}
		
		if(iscard == 1 && !validateBankCorrect())  // 验证银行卡号
		{
			
			 return false;
		}
		if(iscard == "" && zzispwd == 1){
			
			if(!validateBankPwd()){
			   return false;	
			}
		}
		if(iscard == 1 && zzispwd == 1 )  // 验证是否需要密码
		{
			if(!validateBankPwd()){
			 return false;	
			}
		   
		}
		if(!validateDepositProtocolSelect())  // 验证是否勾选协议
		{
			return false;
		}
		// 进行协议签署
		var protocolArray = new Array(),  // 协议数组
			userid = appUtils.getSStorageInfo("user_id"),
			ipaddr  = appUtils.getSStorageInfo("ip"),
			macaddr = appUtils.getSStorageInfo("mac"),
			protocolid = protocol.econtract_no,
			protocolname = protocol.econtract_name,
			summary = protocol.econtract_md5,  // 协议内容MD5,签名摘要信息
			signParam = {
				"medid":protocolid,
				"content":summary,
				"userId":userid,
				"type": cert_type
			};
		layerUtils.iLoading(true);  // 开启等待层......
		// 获取协议的数字签名值
		require("shellPlugin").callShellMethod("signPlugin",function(data){
			var protocoldcsign = data.ciphertext;  // 数字签名值
			var protocolParam = {
				"protocol_id" : protocolid,
				"protocol_dcsign" : protocoldcsign,
				"summary" : summary
			};
			protocolArray.push(protocolParam);   // 添加值到数组中
			// 签署协议
			var signProtocolParam = {
				"user_id" : userid,
				"jsondata" : JSON.stringify(protocolArray),
				"ipaddr" : ipaddr,
				"macaddr" : macaddr
			};
			// 新开中登验签
			if(appUtils.getSStorageInfo("openChannel") == "new")
			{
				service.queryOpenCheckSign(signProtocolParam,callSign,false);
			}
			// 转户天威验签
			else if(appUtils.getSStorageInfo("openChannel") == "change")
			{
				service.queryOpenCheckTsign(signProtocolParam,callSign,false);
			}
		},function(){ layerUtils.iLoading(false); },signParam);
	}
	
	
	/* 验签回调函数*/
	function callSign(data)
	{
		// 如果有一个协议签署失败，就将签署结果设为 false
	    if(data.error_no == 0)
		{
			postThirdDepositoryData();	//开立账户系统客户号和资金账户
		}
	    else
	    {
			layerUtils.iLoading(false);  // 关闭等待层。。。
			layerUtils.iAlert(data.error_info,-1);
	    }
	}
	
	/* 提交三方存管银行数据 */
	function postThirdDepositoryData()
	{	
		service.getRSAKey({}, function(data) {
			if( data.error_no==0)	//请求获取rsa公钥成功
			{
				//密码采用rsa加密
				var results = data.results[0];
				var modulus = results.modulus;
				var publicExponent =  results.publicExponent;
				var endecryptUtils = require("endecryptUtils");
				
				var bankpwd = endecryptUtils.rsaEncrypt(modulus, publicExponent, $(_pageId+" #input_text_bankcardPwd").attr("data-password"));
				var userid = appUtils.getSStorageInfo("user_id");
				var bankcode= $(_pageId+" #selectBank").attr("bankcode");
				var bankaccount = "";//银行卡号
			    if($(_pageId+" #input_text_bankcard").find("em").text() == "请输入银行卡号"){
			    	 bankaccount= "";
			    }else{
			    	 bankaccount = $(_pageId+" #input_text_bankcard").find("em").text();//银行卡号
			    }
				var thirdDepositParam = {
					"user_id":userid,
					"acct_clientid":"",
					"acct_fndacct":"",
					"bank_code":bankcode,
					"bank_account":bankaccount,
					"bank_pwd":bankpwd,
					"op_type":$(_pageId+" #selectBank").attr("zzbindtype")
				};
				// 调用service绑定存管银行
				service.bindBank(thirdDepositParam,function(data){
					//alert("银行入参:"+JSON.stringify(thirdDepositParam)+",出参:"+JSON.stringfiy(data));
					var errorNo = data.error_no;
					var errorInfo = data.error_info;
					if(errorNo==0)	 // 调用成功,跳转到风险测评页面
					{
						appUtils.pageInit("account/thirdDepository","account/riskAssessment",{});
					}
					else
					{
						layerUtils.iLoading(false);
						layerUtils.iAlert(errorInfo,-1);
					}
				},false);
			}
			else
			{
				layerUtils.iLoading(false);
				layerUtils.iAlert(data.error_info);
			}
		}, false);
	}
	
	/* 验证是否选择银行  */
	function validateSelectBank()
	{
		var obj = $(_pageId+" #selectBank");
		var value = obj.html();
		if(validatorUtil.isEmpty(value)||value=="请选择银行")
		{
			layerUtils.iMsg(-1,"请选择银行");
			return false;
		}
		return true;
	}
	
	/* 检验银行卡填写是否正确 */
	function validateBankCorrect()
	{
	    var bankcard = $(_pageId+" #input_text_bankcard").find("em").html();
		if(bankcard == "")  // 验证通过的情况
		{
			layerUtils.iMsg(-1,"银行卡号不能为空！");
			return false;
		}
		if(!validatorUtil.isBankCode(bankcard))
		{
			layerUtils.iMsg(-1,"银行卡号格式有误，请重新输入！");
			return false;
		}
		return true;
	}
	
	/* 验证银行密码 */
	function validateBankPwd()
	{
      // 验证不通过
        var cardPwd = $(_pageId+" #input_text_bankcardPwd").attr("data-password");
        if(cardPwd.length == 0){
        	layerUtils.iMsg(-1,"您输入的银行密码为空，请重新输入!");
			return false;
        }
        if(cardPwd.length != 6){
            layerUtils.iMsg(-1,"请输入6位银行密码，请重新输入!");
			return false;
        }
       if (!validatorUtil.isNumeric(cardPwd)) {
            layerUtils.iMsg( - 1, "您输入银行密码有误，请重新输入！");
            return false;
        }
        return true;
	}
	
	/* 检测勾选阅读协议 */
	function validateDepositProtocolSelect()
	{
		if(!$(_pageId+" .icon_check").hasClass("checked"))
		{
			layerUtils.iMsg(-1,"请阅读并勾选三方存管协议!");
			return false;
		}
		return true;
	}
	
	/* 获取存管银行签约电子协议列表 */
	function getDepositoryAgreement(bankcode)
	{
		$(_pageId+" #protocolName").html("");  // 清空协议
		// 调用service查询存管银行协议
		var param = {"econtract_no" : bankcode};
		service.queryProtocolList(param,function(data){
			$(_pageId+" #protocolName").html("");
			if(data.error_no == 0)
			{
				if(data.results&&data.results.length>=1)
				{
					protocol = data.results[0];
					$(_pageId+" #protocolName").html("《"+protocol.econtract_name+"》");
					$(_pageId+" #protocolName").attr("protocolId",protocol.econtract_no);
					$(_pageId+" #protocolName").attr("protocolMd5",protocol.econtract_md5);
					// 预绑定查看银行协议内容的事件
					appUtils.preBindEvent($(_pageId+" #protocolName").parent(),"#protocolName",function(){
						appUtils.setSStorageInfo("pagebackthird", "3");
						appUtils.pageInit("account/thirdDepository","account/showProtocol",{"protocol_id":$(_pageId+" #protocolName").attr("protocolId")});
					});
				}
			}
			else
			{
				layerUtils.iAlert(data.error_info,-1);
			}
		});
	}
	
	var thirdDepository = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = thirdDepository;
});