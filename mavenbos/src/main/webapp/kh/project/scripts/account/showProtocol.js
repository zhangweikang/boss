/**
* 查看协议
*/
define("project/scripts/account/showProtocol",function(require,exports,module){
	var appUtils = require("appUtils"),
		global = require("gconfig").global,
		service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		_pageId = "#account_showProtocol";
	
	function init(){
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		// 清除原有数据
		$(_pageId+" #contenttxt").text("");
		$(_pageId+" .top_title p:eq(0)").text("");
		//设置按钮显示提示文字
		if(appUtils.getSStorageInfo("openChannel") == "change")
		{
			if(appUtils.getSStorageInfo("finance") == "finance")
			{
				$(_pageId+" .fix_bot .ct_btn a").html("继续开户 >");
			}
			else
			{
				$(_pageId+" .fix_bot .ct_btn a").html("继续转户 >");
			}
		}
		else
		{
			$(_pageId+" .fix_bot .ct_btn a").html("继续开户 >");
		}
		var protocol_id = appUtils.getPageParam("protocol_id");
		var param = {
			"econtract_no" : protocol_id,
			"econtract_version":""
		}
		//查询协议内容
		service.getProtocolInfo(param,function(data){
		     //alert("查询协议内容:"+JSON.stringify(data));
			if(error_no = data.error_no)
			{
				$(_pageId+" .top_title p:eq(0)").text(data.results[0].econtract_name);
				$(_pageId+" #contenttxt").append(data.results[0].econtract_content);
			}
			else
			{
				layerUtils.iMsg(-1, data.error_info);
			}
		});
	}
	function bindPageEvent(){
		// 绑定返回
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
			// 记录是否是从三方存管
			appUtils.pageBack();
		});
		
		// 绑定继续开户
		appUtils.bindEvent($(_pageId+" .ct_btn a"),function(){
		   // 记录是否是从三方存管
           appUtils.setSStorageInfo("pageBackThirdNext", "4");
		   appUtils.pageBack();
		});
	}
	function destroy(){
		// 将协议内容置空
		$(_pageId+" #contenttxt").text("");
		$(_pageId+" .top_title p:eq(0)").text("");
		service.destroy();
	}
	
	var showProtocol = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	module.exports = showProtocol;
});