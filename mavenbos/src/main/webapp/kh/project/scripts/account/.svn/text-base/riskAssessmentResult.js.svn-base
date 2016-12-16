/**
* 风险测评结果
*/
define("project/scripts/account/riskAssessmentResult",function(require,exports,module){
	var appUtils = require("appUtils"),
		global = require("gconfig").global,
		_pageId = "#account_riskAssessmentResult";
	
	function init()
	{
		//加载样式
		$(_pageId).height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		//设置按钮显示提示文字
		if(appUtils.getSStorageInfo("openChannel") == "change")
		{
			if(appUtils.getSStorageInfo("finance") == "finance")
			{
				$(_pageId+" .fix_bot .ct_btn a").html("下一步");  // 理财户
			}
			else
			{
				$(_pageId+" .fix_bot .ct_btn a").html("下一步");  // 转户
			}
		}
		else
		{
			$(_pageId+" .fix_bot .ct_btn a").html("下一步");  // 新开户
		}
		
		// 只有从 riskAssessment 跳转过来时，才设置页面的填充数据
		if(appUtils.getSStorageInfo("_prePageCode") == "account/riskAssessment")
		{
			var remark  = appUtils.getPageParam("remark");  //风险等级
			var riskdesc = appUtils.getPageParam("riskdesc"); //风险等级描述
			var showStr = riskdesc;
			// 清空原有内容
			$(_pageId+" div[class='test_level']").text("");
			$(_pageId+" div[class='test_level']").append(showStr);
		}
	}
	
	function bindPageEvent()
	{
		/* 绑定返回事件 
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			appUtils.pageInit("account/riskAssessmentResult","account/riskAssessment",{});
		});*/
		
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
			appUtils.pageBack();
		});
		
		// 重新测评绑定事件
		appUtils.bindEvent($(_pageId+" .ct_btn02"),function(){
			appUtils.pageInit("account/riskAssessmentResult","account/riskAssessment",{});
		});
		
		/**
		 * 9.1
		 * 风险测评结果页面进入问卷回访页面
		 */
		appUtils.bindEvent($(_pageId+" .ct_btn"),function(){
			if(global.needConfirm)
			{
				appUtils.pageInit("account/riskAssessmentResult","account/openConfirm",{});
			}
			else
			{
				appUtils.pageInit("account/riskAssessmentResult","account/accountResult",{});
			}
		});
	}
	
	function destroy(){}
	
	var riskAssessmentResult = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	module.exports = riskAssessmentResult;
});