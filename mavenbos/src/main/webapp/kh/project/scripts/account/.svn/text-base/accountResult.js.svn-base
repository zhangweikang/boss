/**
 * 开|转|理财户结果
 */
define("project/scripts/account/accountResult",function(require,exports,module){
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
		  gconfig = require("gconfig"),
		  layerUtils = require("layerUtils"),
		  global = gconfig.global,
		  service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		  _pageId = "#account_accountResult";
	/* 私有业务模块的全局变量 end */
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		initPage();
	}
	
	function bindPageEvent()
	{
			
		//确定
	    appUtils.bindEvent($(_pageId + " #quede"),
            function() {
            	if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
					if(navigator.userAgent.indexOf("Android") > 0) {
						require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
					}
					if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
						window.location.href="backClientSide";
					}
				}else{
					appUtils.sendDirect("../m/index.html#!/business/login.html");
				}
            });
		/* 分享拿ipad 
		appUtils.bindEvent($(_pageId+" .share_btn"),function(){
			require("shellPlugin").callShellMethod("sharePlugin",null,null,["立即分享有惊喜，iPad等你拿","手机自助开户或转户，分享有惊喜，iPad等你拿！","测试分享结果，显示即分享成功！"]);
		});*/

	}
	
	function destroy()
	{
		$(_pageId+" order_succes p:eq(3)").html("");
		$(_pageId+" #gdzh").html("");
		appUtils.clearSStorage();  // 清空所有的session
	}
	
    /* 初始化页面 */	
	function initPage()
	{
	    layerUtils.iLoading(false);
		if(appUtils.getSStorageInfo("openChannel") == "change")
		{
			// 理财户
			if(appUtils.getSStorageInfo("finance") == "finance")  
			{
				$(_pageId+" .header h3").html("开户结果");
				$(_pageId+" .order_succes h5:eq(0)").text("开户申请成功！");
				$(_pageId+" .order_succes p:eq(0)").html("您的开户申请我们已经收到并正在受理中。");
				$(_pageId+" .order_succes dl:eq(1)").hide();
				$(_pageId+" .order_succes dl:eq(2)").hide();
			}
			// 转户
			else 
			{
				$(_pageId+" .header h3").html("转户结果");
				$(_pageId+" .order_succes h5:eq(0)").text("转户申请成功！");
				$(_pageId+" .order_succes p:eq(0)").html("您的转户申请我们已经收到并正在受理中。");
				$(_pageId+" .order_succes dl:eq(3)").hide();
				$(_pageId+" .order_succes dl:eq(4)").hide();
			}
		}
		// 新开户
		else  
		{
			$(_pageId+" .header h3").html("开户结果");
			$(_pageId+" .order_succes h5:eq(0)").text("开户申请成功！");
			$(_pageId+" .order_succes p:eq(0)").html("您的开户申请我们已经收到并正在受理中。");
		}
		// 驳回后重新提交
		if(appUtils.getSStorageInfo("isBack") == "backInfo")
		{
			$(_pageId+" .header h3").html("开户进度");
			$(_pageId+" .order_succes h5:eq(0)").text("重新提交资料成功！");
		}
		$(_pageId+" .order_succes p:eq(0)").hide();  
		$(_pageId+" .order_succes p:eq(1)").hide();
		queryAccount(); // 查询用户信息
	}
	
	/* 查询用户信息 */
	function queryAccount()
	{
		var param = {"user_id" : appUtils.getSStorageInfo("user_id")};
		service.queryUserInfo(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == 0)
			{
				var res = data.results[0];
				appUtils.setSStorageInfo("fund_account",res.fund_account);  // 资金账号
				appUtils.setSStorageInfo("shfund_select",res.shfund_select);  // 沪基金状态
				appUtils.setSStorageInfo("szfund_select",res.szfund_select); // 深基金状态 
				appUtils.setSStorageInfo("szaselect",res.szaselect); // 深A状态
				appUtils.setSStorageInfo("shaselect",res.shaselect); // 沪A状态
				appUtils.setSStorageInfo("szaaccount",res.szaaccount); // 深A账号
				appUtils.setSStorageInfo("shaaccount",res.shaaccount); // 沪A账号
				appUtils.setSStorageInfo("szfund_account",res.szfund_account); // 深基金账号
				appUtils.setSStorageInfo("shfund_account",res.shfund_account); //沪基金账号
				showOpenAccount();  // 显示开户结果
			}
			else
			{
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/* 显示新开户结果 */
	function showOpenAccount()
	{
		layerUtils.iLoading(false);
		// 从 session 中取资金账号和股东账号
		var shaselect = appUtils.getSStorageInfo("shaselect"),  // 是否选择沪A
			  szaselect = appUtils.getSStorageInfo("szaselect"),  // 是否选择深A
			  shfund_select = appUtils.getSStorageInfo("shfund_select"),  // 是否选择沪基金
			  szfund_select = appUtils.getSStorageInfo("szfund_select"),  // 是否选择深基金
		      fund_account = appUtils.getSStorageInfo("fund_account"),  // 资金账号
			  shaaccount = appUtils.getSStorageInfo("shaaccount"), // 沪A股东账户
			  szaaccount = appUtils.getSStorageInfo("szaaccount"),  // 深A股东账户
			  shfund_account = appUtils.getSStorageInfo("shfund_account"),  // 沪基金账户
			  szfund_account = appUtils.getSStorageInfo("szfund_account"); // 深基金账户
		// 判断资金账户是否开出
		if(fund_account != null)
		{
			//设置按钮显示提示文字
			if(appUtils.getSStorageInfo("openChannel") == "change")
			{
				if(appUtils.getSStorageInfo("finance") == "finance")
				{
					$(_pageId+" .order_succes h5:eq(0)").text("恭喜开户成功！");
				}
				else
				{
					$(_pageId+" .order_succes h5:eq(0)").text("恭喜转户成功！");
				}
			}
			else
			{
				$(_pageId+" .order_succes h5:eq(0)").text("恭喜开户成功！");
			}
			$(_pageId+" .order_succes p:eq(0)").hide();
			$(_pageId+" .order_succes p:eq(1)").hide();
			// 显示资金账户、股东账号的信息
			$(_pageId+" #zjzh").html("<a href='javascript:void(0)' class='copy'>复制账号</a>&nbsp;"+fund_account);
		}
		else
		{
			$(_pageId+" .order_succes p:eq(0)").show();
			$(_pageId+" .order_succes p:eq(1)").show();
			$(_pageId+" #zjzh").html("&nbsp;办理中...");
		}
		// 未开通深A
		if(szaselect == null)
		{
			$(_pageId+" .order_info dl:eq(1) dd").html("&nbsp;未申请");
			$(_pageId+" .order_info dl:eq(1)").hide();
		}
		// 未开通沪A
		if(shaselect == null)
		{
			$(_pageId+" .order_info dl:eq(2) dd").html("&nbsp;未申请");
			$(_pageId+" .order_info dl:eq(2)").hide();
		}
		// 未开通深开放式基金
		if(szfund_select == null)
		{
			$(_pageId+" .order_info dl:eq(3) dd").html("&nbsp;未申请");
			$(_pageId+" .order_info dl:eq(3)").hide();
		}
		// 未开通沪开放式基金
		if(shfund_select == null)
		{
			$(_pageId+" .order_info dl:eq(4) dd").html("&nbsp;未申请");
			$(_pageId+" .order_info dl:eq(4)").hide();
		}
		// 开通了深A
		if(szaselect != null)
		{
			// 深A已经开出账号
			if(szaaccount != null)
			{
				$(_pageId+" .order_succes p:eq(0)").hide();
				$(_pageId+" .order_succes p:eq(1)").hide();
				$(_pageId+" .order_info dl:eq(1) dd").html("&nbsp;"+szaaccount);
			}
			else
			{
				$(_pageId+" .order_succes p:eq(0)").show();
				$(_pageId+" .order_succes p:eq(1)").show();
				$(_pageId+" .order_info dl:eq(1) dd").html("&nbsp;办理中...");
			}
		}
		// 开通了沪A
		if(shaselect != null)
		{
			// 沪A已经开出账号
			if(shaaccount != null)
			{
				$(_pageId+" .order_info dl:eq(2) dd").html("&nbsp;"+shaaccount);
				$(_pageId+" .order_succes p:eq(0)").hide();
				$(_pageId+" .order_succes p:eq(1)").hide();
			}
			else
			{
				$(_pageId+" .order_succes p:eq(0)").show();
				$(_pageId+" .order_succes p:eq(1)").show();
				$(_pageId+" .order_info dl:eq(2) dd").html("&nbsp;办理中...");
			}
		}
		// 开通了深开放式基金
		if(szfund_select != null)
		{
			// 深开放式基金已经开出账号
			if(szfund_account != null)
			{
				$(_pageId+" .order_succes p:eq(0)").hide();
				$(_pageId+" .order_succes p:eq(1)").hide();
				$(_pageId+" .order_info dl:eq(3) dd").html("&nbsp;"+szfund_account);
			}
			else
			{
				$(_pageId+" .order_succes p:eq(0)").show();
				$(_pageId+" .order_succes p:eq(1)").show();
				$(_pageId+" .order_info dl:eq(3) dd").html("&nbsp;办理中...");
			}
		}
		// 开通了沪开放式基金
		if(shfund_select != null)
		{
			// 沪开放式基金已经开出账号
			if(shfund_account != null)
			{
				$(_pageId+" .order_succes p:eq(0)").hide();
				$(_pageId+" .order_succes p:eq(1)").hide();
				$(_pageId+" .order_info dl:eq(4) dd").html("&nbsp;"+shfund_account);
			}
			else
			{
				$(_pageId+" .order_succes p:eq(0)").show();
				$(_pageId+" .order_succes p:eq(1)").show();
				$(_pageId+" .order_info dl:eq(4) dd").html("&nbsp;办理中...");
			}
		}
		// 如果开出了上海账号，显示提示信息
		if(($(_pageId+" .order_info").html()).indexOf("沪") != -1)
		{
			$(_pageId+" .order_succes p:eq(3)").html("注意：请登录交易系统进行上海账户的指定交易：点击\"买入\"，输入证券代码\"799999\"，价格\"1\"，股数\"1\"。");
		}
		$(_pageId+" .order_succes .mt15").show();
	}
	
	var accountResult = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	module.exports = accountResult;
});