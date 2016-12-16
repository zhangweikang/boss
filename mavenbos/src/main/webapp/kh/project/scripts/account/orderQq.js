/**
 * 预约QQ视频认证
 */
define("project/scripts/account/orderQq",function(require, exports, module){ 
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
	       service = require("serviceImp").getInstance(),  //业务层接口，请求数据
	       validatorUtil = require("validatorUtil"),
	       layerUtils = require("layerUtils"),
	       gconfig = require("gconfig"),
	       global = gconfig.global,
		   _pageId = "#account_orderQq";
	/* 私有业务模块的全局变量 end*/
	
	function init(){
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
	}
	
	function bindPageEvent()
	{
		/*绑定返回*/
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			appUtils.pageBack();
		});
		
		/*绑定选择框*/
		appUtils.bindEvent($(_pageId+" .input_list p a"),function(){
			$(this).toggleClass("checked");			
		});
		
		/*绑定下一步*/
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn"),function(){
			//验证QQ号码是否填写
			var qqNum = $(_pageId+" .user_form .t1").val();
			var deal_time = "";
			var show_time = "[";
			$(_pageId+" .input_list p .checked").each(function(){
				deal_time += $(this).attr("deal_time")+"|"
				show_time += $(this).html()+","
			});
			deal_time = deal_time.substring(0,deal_time.length-1);
			show_time = show_time.substring(0,show_time.length-1)+"]";
			if(validatorUtil.isQq(qqNum)&&validatorUtil.isNotEmpty(deal_time))
			{
				//提交后台QQ预约
				submitQQApplay(qqNum,deal_time,show_time);
			}
			else if(validatorUtil.isEmpty(deal_time))
			{
				layerUtils.iMsg(-1,"请选择预约时间");
			}
			else if(validatorUtil.isEmpty(qqNum))
			{
				layerUtils.iMsg(-1,"请输入QQ号码");
			}
			else
			{
				layerUtils.iMsg(-1,"请输入正确的QQ号码");
			}
		});
	}
	
	function destroy()
	{
		$(_pageId+" .user_form .t1" ).val("");
		service.destroy();
	}
	
	/*提交后台QQ预约*/
	function submitQQApplay(qqNum,deal_time,show_time)
	{
		var param = {
			"user_id":appUtils.getSStorageInfo("user_id"),
			"qq":qqNum,
			"deal_date":new Date().format("yyyy-MM-dd"),
			"deal_time":deal_time
		}
		service.submitQQApplay(param,function(data){
			var error_no = data.error_no;
			var errpr_info = data.error_info;
			//预约成功
			if(data.error_no == "0")
			{
				appUtils.pageInit("account/orderQq","account/orderSuccess",{"show_time":show_time,"qqNum":qqNum});
			}
			else
			{
				layerUtils.iAlert("视频见证预约失败，请重新预约！",-1);
				layerUtils.iLoading(false);
			}
		});
	}
	
	var orderQq = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = orderQq;
});