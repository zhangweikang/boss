/**
 * 手机号码验证
*/
define("project/scripts/account/msgVerify",function(require,exports,module){
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
		_pageId = "#account_msgVerify",
		psw_id = "", key = 1, flag = false,
		steps = ["uploadimg","idconfirm","witness",
		        	 "certintall","capitalacct",
		         	 "stkacct","setpwd","tpbank",
		       	     "risksurvey","visitsurvey","success"
  	    ],
		stepMap = {"uploadimg":"account/uploadPhoto","idconfirm":"account/personInfo","witness":"account/videoNotice",
	               		   "certintall":"account/digitalCertificate","capitalacct":"account/signProtocol","stkacct":"account/signProtocol",
	               		   "setpwd":"account/setPwd","tpbank":"account/thirdDepository",
	              		   "risksurvey":"account/riskAssessment","visitsurvey":"account/openConfirm","success":"account/accountResult"
	    },
		stepMap0 = {"uploadimg":"account/uploadPhotoChange","witness":"account/digitalCertificate"};
	/* 私有业务模块的全局变量 end */	
	
	function init()
	{		
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		/*发送验证码后自动互调该方法*/
		window.getCode = getCode;
		var elements = _pageId +" .phoneNum";
		utils.getPhoneNo(elements); // 自动获取手机号，并填充
		backmsg = appUtils.getSStorageInfo("backmsg");//获取选择营业部标识
		if(backmsg == 1){
			$(_pageId+" .getmsg").show();  // 显示按钮
			$(_pageId+" .cert_notice").hide();  // 隐藏验证码已发出提示
			$(_pageId+" .time").hide();  // 隐藏倒计时
			$(_pageId+" .phoneNum").val(appUtils.getSStorageInfo("mobileNo"));  //清除手机号
			$(_pageId+" .mobileCode").val(appUtils.getSStorageInfo("mobileCode"));  // 清除验证码
		}
	}
	
	function bindPageEvent(){
		/* 绑定返回事件 */
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			//appUtils.pageBack();
			appUtils.pageInit("account/msgVerify","account/openAccount",{});
		});
		
		/* 绑定退出按钮*/
		appUtils.bindEvent($(_pageId+" .header .icon_close"),function(){
			utils.layerTwoButton("退出系统？","确认","取消",function(){
				require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
			},
			function(){return false;});
		});
		
		/* 限制手机号在IOS上的长度 */
		appUtils.bindEvent($(_pageId+" .phoneNum"),function(){
			utils.dealIPhoneMaxLength(this,11); //处理iphone兼容
		},"input");
		
		/* 绑定获取短信验证码事件 */
		appUtils.bindEvent($(_pageId+" .getmsg"),function(){
			var phoneNum =  $(_pageId+" .phoneNum").val();
			// 首先验证手机号
			if(validatorUtil.isMobile(phoneNum))
			{
				getSmsCode(phoneNum);  //获取验证码
			}
			else
			{
				// 手机号没通过前端校验，弹出提示，并终止发送验证码的过程
				var times = phoneNum.length - 11;
				if(phoneNum.length > 11)
				{
					layerUtils.iMsg(-1,"您多输入&nbsp;"+times+"&nbsp;位电话号码，请重新输入！");
				}
				else if(phoneNum.length < 11)
				{
					layerUtils.iMsg(-1,"您少输入&nbsp;"+Math.abs(times)+"&nbsp;位电话号码，请重新输入！");
				}
				return;
			}
		});
		
		/* 下一步(继续开户) */
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn") ,function(){
		    if($(_pageId+" .phoneNum").val().length == 0)
			{
				layerUtils.iMsg(-1,"请输入手机号！");
				return;
			}
			if(isNaN($(_pageId+" .phoneNum").val())){
				layerUtils.iMsg(-1,"请输入正确的手机号！");
				return;
			}
		    if($(_pageId+" .phoneNum").val().length < 11)
			{
				layerUtils.iMsg(-1,"请您输入11位的手机号！");
				return;
			}
			if($(_pageId+" .mobileCode").val().length == 0)
			{
				layerUtils.iMsg(-1,"请输入验证码！");
				return;
			}
			if(isNaN($(_pageId+" .mobileCode").val())){
				layerUtils.iMsg(-1,"请输入正确的验证码！");
				return;
			}
			appUtils.setSStorageInfo("mobileCode",$(_pageId+" .mobileCode").val());
			checkSmsCode();  //验证码校验
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
			$(_pageId+" .mobileCode").val("");  // 清除验证码
		}
		service.destroy();
	}
	
	/* 壳子获取验证码自动填充 */
	function getCode(data)
	{
		if(data)
		{
			$(_pageId+" .mobileCode").val(data);
		}	
	}
	
	/* 获取验证码 */
	function getSmsCode(phoneNum)
	{
		//alert("手机号:"+phoneNum);
		var mac = iBrowser.pc ? "02:00:5E:00:00:14" : "",
			  ip = iBrowser.pc ? "192.168.1.109" : "";
		// 只有当不是 pc 时，才调用壳子获取 ip 和 mac
		if(!iBrowser.pc)
		{
			require("shellPlugin").callShellMethod("getIpMacPLugin",function(data){
				data = data.split("|");
				mac = data[0];
				ip = data[1];
				appUtils.setSStorageInfo("ip",ip); // 将 ip 保存到 sessionStorage 里面
				appUtils.setSStorageInfo("mac",mac); // 将 mac 保存到 sessionStorage 里面
				sendmsg(phoneNum,mac,ip); // 发送验证码
			},null);
		}
		else
		{
			sendmsg(phoneNum,mac,ip); // 发送验证码
		}
	}
	
	/* 发送验证码 */
	function sendmsg(phoneNum,mac,ip)
	{
		var param = {
			// 访问接口来源标识，访问来源(默认PC) 0：pc， 2：pad， 3：手机 
			"op_way" : iBrowser.pc ? 0 : 3,
			"mobile_no" : phoneNum,
			"ip" : ip, 
			"mac" : mac
		};
		//请求获取验证码接口
		service.getSmsCode(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			var result = data.results;
			if(error_no == "0")
			{
		        //后台如果返回ip地址，则本地存储用户ip地址
			    if(result[0] && result[0].ip)
			    {
				    appUtils.setSStorageInfo("ip",result[0].ip);
			    }
				// 计时器
				var sumTime = 120;
				//处理获取验证码时发生的动作
				var handleCount = function(){
					// 获取验证码之后按钮隐藏
					$(_pageId+" .getmsg").hide();
					// 显示倒计时
					$(_pageId+" .time").show();
					$(_pageId+" .cert_notice").show();
					$(_pageId+" .time").text(sumTime--+"秒后重发");
				};
				handleCount();
				startCountDown = window.setInterval(function(){
				handleCount();
				}, 1000);
				// 120 秒之后清除计时器
			    var clearCountDown = setTimeout(function(){
					// 显示按钮
					$(_pageId+" .getmsg").show();
					// 隐藏倒计时
					$(_pageId+" .time").hide();
					$(_pageId+" .cert_notice").hide();
					$(_pageId+" .time").text(120);
					window.clearInterval(startCountDown);
				},121000);
				 //发送完验证码后，通过判断输入手机号是否一致，否则重新发送验证码
				 var c_phoneNum =phoneNum;
				 appUtils.bindEvent($(_pageId+" .phoneNum"),function(){
					c_phoneNum =$(_pageId+" .phoneNum").val();
				 	if(validatorUtil.isMobile(phoneNum)&&validatorUtil.isMobile(c_phoneNum))
				 	{
				 		//用户两次输入的手机号不同，重新获取验证码
				 		if(c_phoneNum!=phoneNum)
				 		{
				 			clearInterval(startCountDown);   //清除定时器
				 			clearTimeout(clearCountDown);
							$(_pageId+" .getmsg").show();  // 显示按钮
							$(_pageId+" .time").hide();  // 隐藏倒计时
				 		}
				 	}
				 },"input");
				 // 调用读取短信验证码插件
				 require("shellPlugin").callShellMethod("sMSReceiverPlugin",null,null,null);
			}
			else
			{
				layerUtils.iAlert(error_info,-1);
				return false;
			}
		});
	}
		
	
	/* 提交验证码校验 */
	function checkSmsCode()
	{
		var login_flag = appUtils.getSStorageInfo("openChannel") == "new" ? "0" : "1";
		if(appUtils.getSStorageInfo("finance") == "finance")
		{
			login_flag = "2";   // 理财户传2
		}
		var param = {	
			"mobile_no" : $(_pageId+" .phoneNum").val(),
			"mobile_code" : $(_pageId+" .mobileCode").val(),
			"login_flag" : login_flag  // 登录业务标准，新开户0  转户1  理财户2
		};	
		/*调用验证码校验接口*/
		service.checkSmsCode(param,function(data){
			//alert("入参:"+JSON.stringify(param)+"出参:"+JSON.stringify(data));
			var error_no = data.error_no;
			var error_info = data.error_info;
			var result = data.results;
			if(error_no == "0" && result.length != 0)
			{
				// user_id保存到session
				if(result[0].user_id)
				{
					appUtils.setSStorageInfo("user_id",result[0].user_id);  
				}
				// 身份证号保存到session
				if(result[0].idno)
				{
					appUtils.setSStorageInfo("idCardNo",result[0].idno);
				}
				//手机号保存到session
				if(result[0].mobileno)
				{
					appUtils.setSStorageInfo("mobileNo",result[0].mobileno);
				}
				// 将客户姓名保存到 session 中
				if(result[0].custname)
				{
					appUtils.setSStorageInfo("custname",result[0].custname);
				}
				// 签发机关保存到session 
				if(result[0].policeorg)
				{
					appUtils.setSStorageInfo("policeorg",result[0].policeorg);
				}
				// 证件地址保存到session 
				if(result[0].native)
				{
					appUtils.setSStorageInfo("native",result[0].native);
				}
				// 联系地址保存到session 
				if(result[0].addr)
				{
					appUtils.setSStorageInfo("addr",result[0].addr);
				}
				// 起始期限保存到session 
				if(result[0].idbegindate)
				{
					
					appUtils.setSStorageInfo("idbegindate",result[0].idbegindate);
				}
				// 结束期限保存到session 
				if(result[0].idenddate)
				{
					
					appUtils.setSStorageInfo("idenddate",result[0].idenddate);
				}
				// 邮编保存到session 
				if(result[0].postid)
				{
					appUtils.setSStorageInfo("postid",result[0].postid);
				}
				// 职业保存到session 
				if(result[0].profession_code)
				{
					appUtils.setSStorageInfo("profession_code",result[0].profession_code);
				}
				// 学历保存到session 
				if(result[0].edu)
				{
					appUtils.setSStorageInfo("edu",result[0].edu);
				}
				// 将 clientinfo 保存到 session 中，用于解决壳子上传照片的权限问题
				if(result[0].clientinfo)
				{
					appUtils.setSStorageInfo("clientinfo",result[0].clientinfo);
				}
				// 将 jsessionid 保存到 session 中，用于解决壳子上传照片的权限问题
				if(result[0].jsessionid)
				{
					appUtils.setSStorageInfo("jsessionid",result[0].jsessionid);
				}
				// 将佣金id保存到session
				if(result[0].commission)
				{
					appUtils.setSStorageInfo("commission",result[0].commission);
				}
				// 将佣金值保存到session
				if(result[0].commissionname)
				{
					appUtils.setSStorageInfo("commissionname",result[0].commissionname);
				}
				// 将营业部Id保存到session
				if(result[0].branchno)
				{
					appUtils.setSStorageInfo("branchno",result[0].branchno);
				}
				// 将营业部名称保存到session
				if(result[0].branchname)
				{
					appUtils.setSStorageInfo("branchname",result[0].branchname);
				}
				// 将省份保存到session
				if(result[0].provincename)
				{
					appUtils.setSStorageInfo("provincename",result[0].provincename);
				}
				// 将城市保存到session
				if(result[0].cityname)
				{
					appUtils.setSStorageInfo("cityname",result[0].cityname);
				}
				appUtils.setSStorageInfo("shaselect",result[0].shaselect);  // 是否选择沪A
				appUtils.setSStorageInfo("szaselect",result[0].szaselect);  // 是否选择深A
				appUtils.setSStorageInfo("hacnselect",result[0].shaselect);  // 是否选择沪开放式基金
				appUtils.setSStorageInfo("zacnselect",result[0].szaselect);  // 是否选择深开放式基金
				var  opacctkind_flag = result[0].opacctkind_flag;  // 开户通道的标识，0 新开户，1 转户 , 2 理财户
				// 根据 opacctkind_flag 设置 session 中的 openChannel
				if(opacctkind_flag == 0)
				{
					appUtils.setSStorageInfo("openChannel","new");
				}
				else 
				{
					if(opacctkind_flag == 2)
					{
						appUtils.setSStorageInfo("finance","finance");
					}
					appUtils.setSStorageInfo("openChannel","change");
				}
				//判断是否驳回，若驳回 则走驳回流程
				if(addition(result[0]))
				{
					return false;
				}
				//未驳回，则正常走流程
				else
				{
					// 在这个修改代码，添加业务流程
					//var url="http://api-wwwtest.touker.com/financeData.queryEntites.open";
					//var param=
					//appUtils.invokeServer(url,param,function(data){});
					
					//3.$.ajax拼接url的异步请求
					ajax_test(); // 已测试成功
					nextStep(result[0], opacctkind_flag);
				}
			}
			else
			{
				layerUtils.iMsg(-1,"您尚未通过手机号码验证，请先提交验证码！");
			}
		});
	}
	
	function ajax_test()
	{
		// function singe(){}
		var yz=$.ajax({  
					     type:'post',
					     url:"https://api-wwwtest.touker.com/financeData.queryEntites.open?qJson={'entityName':'Jyr','returnFieldNames':['id','theDate','theStringDate','weekEnd'],'maxResults':'1','firstResult':'0','restriction':{'fieldName':'theDate','op':'le','value':'2015-04-08 14:34:39','includeFrom':'false','includeTo':'false'},'orders':{'theDate':'true'},'maps':{},'withCountStar':'true'}",  
					     data:{},  
					     cache:false,  
					     dataType:'json',  
					     success:function(data){  
					        layerUtils.iMsg(-1,"成功"+JSON.stringify(data));
					     }, 
					     error:function(){
					     	layerUtils.iMsg(-1,"失败"+JSON.stringify(data));
					     }  
					});
	}
	/* 处理驳回补全资料的情况 */
	function addition(res)
	{
		//驳回情况：身份证正面、反面、大头像、交易密码、资金密码、三方存管、转户驳回到视频见证
		var photoParam = {"needFront" : res.need_photo_front != undefined ? res.need_photo_front : "0",
									   "needBack" : res.need_photo_back != undefined ? res.need_photo_back : "0",
									   "needNohat" : res.need_photo_nohat != undefined ? res.need_photo_nohat : "0"
		};
		var pwdParam = {"needBusinessPwd" : res.need_business_password != undefined ? res.need_business_password : "0",
		                            "needFundPwd" : res.need_fund_password != undefined ? res.need_fund_password : "0"
		};
		var accountParam = {"need_account" : res.need_account != undefined ? res.need_account : "0"};
		var videoParam = {"need_video" : res.need_video != undefined ? res.need_video : "0"};
		var thirdParam ={"needThirdDeposit" : res.need_third_deposit != undefined ? res.need_third_deposit : "0"};
		appUtils.setSStorageInfo("videoParam",JSON.stringify(videoParam));
		appUtils.setSStorageInfo("pwdParam", JSON.stringify(pwdParam));
		appUtils.setSStorageInfo("thirdParam", JSON.stringify(thirdParam));
		appUtils.setSStorageInfo("accountParam", JSON.stringify(accountParam));
		// 1.补全照片
		if(photoParam["needFront"]==1 || photoParam["needBack"]==1 || photoParam["needNohat"]==1)
		{
			appUtils.pageInit("account/msgVerify","account/backUploadPhoto",photoParam);
			return true;
		}
		// 2.驳回视频见证
		if(videoParam["need_video"]==1)
		{
			appUtils.pageInit("account/msgVerify","account/videoNotice",videoParam);
			return true;
		}
		// 3.驳回密码设置
		if(pwdParam["needBusinessPwd"]==1 || pwdParam["needFundPwd"]==1)
		{
			appUtils.pageInit("account/msgVerify","account/backSetPwd",pwdParam);
			return true;
		}
		// 4.驳回三方存管
		if(thirdParam["needThirdDeposit"]==1)
		{
			appUtils.pageInit("account/msgVerify","account/backThirdDepository",thirdParam);
			return true;
		}
		// 5.驳回开立账户
		if(accountParam["need_account"]==1){
			appUtils.pageInit("account/msgVerify","account/backSignProtocol",accountParam);
			return true;
		}
		else
		{
			return false;
		}
	}
	
	/* 下一步入口 */
	function nextStep(res, opacctkind_flag)
	{
		var pageCode = "";
		var currentStep = res["lastcomplete_step"];  //断点：上次走的最后一步
		appUtils.setSStorageInfo("currentStep",currentStep);
		if(currentStep && currentStep.length > 0)
		{
			var index = steps.indexOf(currentStep);
			if(index < (steps.length-1))
			{
				currentStep = steps[index + 1];
			}
			if(opacctkind_flag == "0")
			{
				pageCode = stepMap[currentStep];
			}
			else
			{
				pageCode = stepMap0[currentStep];
				if(!(pageCode && pageCode.length > 0))
				{
					pageCode = stepMap[currentStep];
				}
			}
		}
		if(pageCode && pageCode.length > 0)
		{
			// 如果是直接跳转到 视频认证 页面，将 QQ 保存到 session 中
			if(pageCode == "account/videoNotice")
			{
				appUtils.setSStorageInfo("qq",res.im_code);
			}
		    if(pageCode=="account/accountResult"){
			    layerUtils.iMsg(-1,"您的手机号已经开户过,请您输入新的手机号！");
				return;
			}
			else{
			    appUtils.pageInit("account/msgVerify",pageCode,{});
			}
		}
		else
		{
			appUtils.pageInit("account/msgVerify","account/selDepartment",{});
		}
	}
	
	var msgVerify = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	//暴露接口
	module.exports = msgVerify;
});