/**
 * 预约QQ视频认证成功
 */
define("project/scripts/account/orderSuccess",function(require, exports, module){ 
	/* 私有业务模块的全局变量 begin*/
	var appUtils = require("appUtils"),
           service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		   gconfig = require("gconfig"),global = gconfig.global,
		   layerUtils = require("layerUtils"),
		   _pageId = "#account_orderSuccess";
	/* 私有业务模块的全局变量 end */
	
	function init()
	{	   
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		//设置按钮显示提示文字
		if(appUtils.getSStorageInfo("openChannel") == "change")
		{
			$(_pageId+" .fix_bot .ct_btn a").html("继续转户 >");
		}
		else
		{
			$(_pageId+" .fix_bot .ct_btn a").html("继续开户 >");
		}
		
		$(_pageId+" .qq_order p span:eq(0)").html(appUtils.getPageParam("show_time"));
		$(_pageId+" .qq_order p span:eq(1)").html(appUtils.getPageParam("qqNum"));
	}
	
	function bindPageEvent()
	{
		/*在线视频视频见证*/
		appUtils.bindEvent($(_pageId + " .go_order"), function() {
			var param = {
				"user_id" : appUtils.getSStorageInfo("user_id"),
				"user_name" : appUtils.getSStorageInfo("custname"),
				"org_id" : appUtils.getSStorageInfo("branch_id"),
				"jsessionid" : appUtils.getSStorageInfo("jsessionid"),
				"clientinfo" : appUtils.getSStorageInfo("clientinfo")
			};
			require("shellPlugin").callShellMethod("videoWitnessPlugin", null,function videoError(data) {
						layerUtils.iMsg(-1, data); // 显示错误信息
			}, param);
		});
		
		/*绑定下一步*/
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn"),function(){
			queryQQOfflineState();  // 查询离线视频通过状态
		});
	}
	
	function destroy()
	{
		$(_pageId+" .qq_order p span:eq(0)").html();
		$(_pageId+" .qq_order p span:eq(1)").html();
		service.destroy();
	}
	
	/* 查询离线视频通过状态查询 */
	function queryQQOfflineState()
	{
		var lookVedioStateParam = {
			"user_id" : appUtils.getSStorageInfo("user_id")
		};
		service.queryQQOfflineState(lookVedioStateParam,function(data){
			var error_no = data.error_no;
			var errpr_info = data.error_info;
			if(error_no == 0 && data.results.length != 0)
			{
				// 视频通过状态，0：未见证、2：已预约离线见证未完成见证、1：视频见证完成、3：见证失败
				// 未见证不需要做处理
				var witnessFlag = data.results[0].witness_flag;
				if(witnessFlag==0)
				{
					layerUtils.iAlert("视频见证暂未通过，请等待！",0);
				}
				else if(witnessFlag == 1)
				{
					//跳转到视频认证的下一步
					appUtils.pageInit("account/orderSuccess","account/digitalCertificate",{});
				}
				else if(witnessFlag == 2)
				{
					layerUtils.iAlert("您的预约信息已经提交，我们的客服将尽快联系您！",0);
				}
				else if(witnessFlag == 3)
				{
					layerUtils.iAlert("视频见证失败，请重新预约！",-1);
				}
			}
			else
			{
				layerUtils.iAlert(error_info);
			}
		});
	}
	
	var orderSuccess = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	module.exports = orderSuccess;
});