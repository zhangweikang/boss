/**
 * 设置证书密码
 */
define("project/scripts/account/setPwdCertificate",function(require, exports, module){ 
	// 私有业务模块的全局变量 begin
	var appUtils = require("appUtils"),
		global = require("gconfig").global,
		layerUtils = require("layerUtils"),
		validatorUtil = require("validatorUtil"),
		_pageId = "#account_setPwdCertificate";
	// 私有业务模块的全局变量 end
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
	}
	
	function bindPageEvent()
	{
		//显示关于数字证书的说明
		appUtils.bindEvent($(_pageId+" .cert_code p a"),function(e){
			$(_pageId+" .fix_info").slideDown("fast");
			e.stopPropagation();
		});
		
		//隐藏关于数字证书的说明
		appUtils.bindEvent($(_pageId),function(e){
			$(_pageId+" .fix_info").slideUp("fast");
		});
		
		/* 绑定下一步 */
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn"),function(){
			postData();
		});
	}
	/***
	 * 提交用户数据到下一步
	 */
	function postData(){
		var pwd1 = $(_pageId+" .cert_code input:eq(0)").val(),
			  pwd2 = $(_pageId+" .cert_code input:eq(1)").val();
		if(validatorUtil.isEmpty(pwd1)||pwd1.length<6)
		{
			layerUtils.iAlert("证书密码不能为空，且长度大于等于六位");
			return false;
		}
		else if(pwd1!=pwd2)
		{
			layerUtils.iAlert("确认密码与证书密码不一致");
			return false;
		}
		appUtils.pageInit("account/setPwdCertificate","account/digitalCertificate",
				{"certificatePwd":$(_pageId+" .cert_code input:eq(0)").val()});
	}
	function destroy()
	{
		//清除密码
		$(_pageId+" .cert_code input").val("");
	}
	// 对外暴露的模块方法 end
	
	var showDigitalProtocol = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = showDigitalProtocol;
});