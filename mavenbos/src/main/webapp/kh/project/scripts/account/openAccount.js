/**
 * 新开户(转户)须知
 */
define("project/scripts/account/openAccount",function(require, exports, module){ 
	// 私有业务模块的全局变量 begin
	var appUtils = require("appUtils"),
		global = require("gconfig").global,
		layerUtils = require("layerUtils"), // 弹出层对象
		_pageId = "#account_openAccount";
	// 私有业务模块的全局变量 end
	
	function init(){
		//新开户标志
		appUtils.setSStorageInfo("openChannel","new");
		
		//检查是否是非开户时间
		checkIfTradeTime();
		
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		if(appUtils.getSStorageInfo("openChannel")=="change"){
			$(_pageId+" .header h3").html("转户须知");
			$(_pageId+" .ness_box h5").html("转户前的准备：");
			$(_pageId+" .step_box h5").html("三步即可转户：");
		}else{
			$(_pageId+" .header h3").html("开户须知");
			$(_pageId+" .ness_box h5").html("开户前的准备：");
			$(_pageId+" .step_box h5").html("三步即可开户：");
		}
		
		//钱钱炒股App保留上方返回按钮
		if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){
			$(_pageId+" .icon_back").show();
		}
			
	}
	
	
	 //检查是否是非开户时间
	function checkIfTradeTime(){
	  $.ajax({
	        type:'post',
	        url:global.serverToukerUrl+"/com.business.function.Function10000",
	        data:{ts:(new Date()).getTime()},
	        cache:false,
	        dataType:'json',
	        success:function(data, resp, XMLHttpRequest){
	        	$(_pageId+" .fix_bot .ct_btn .next").show(); 	//显示 我知道了  按钮
	        	if(data.errorNo == 0){	//调用正常
	        		var errorMsg = data.errorMsg;	//0:开户时间     1:非开户时间
	        		if(errorMsg == "1"){		//非开户时间
	        			$(_pageId+" .sjkh-vacation").show();	//展示非交易时间弹框
	        			
	        			//如果是证券开户过来的，由于ios无法退出，灰显处理
	        			var toukerOpenChannel = appUtils.getSStorageInfo("toukerOpenChannel");
	        			if(toukerOpenChannel == null ||toukerOpenChannel == "null"){
							if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
								//切换样式、移除绑定事件
								$(_pageId+" .fix_bot .ct_btn .exit").css("background","#9F9F9F").unbind();
							}
						}
	        		}
	        	}
	        },
	        error:function(){
	        	$(_pageId+" .fix_bot .ct_btn .next").show(); 	//显示 我知道了  按钮
	        }
	    });
	}
	
	function bindPageEvent(){
		
		// ***需要处理钱钱上应该有超链接的
		//绑定返回首页处理     20160324该页面返回链接已经废弃,该函数不会调用  
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
				if(navigator.userAgent.indexOf("Android") > 0) {
					require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
				}
				if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
					window.location.href="backClientSide";
				}
			}else{
				appUtils.pageInit("account/openAccount","business/index",{});
			}
		});
		
		
		//绑定下一步(我知道了)
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn .next"),function(){
			if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){
				appUtils.pageInit("account/openAccount","account/selDepartment");
			}else{
				appUtils.pageInit("account/openAccount","account/phoneNumberVerify");
			}
		});
		
		// 多执行一次，看效果
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		
		//非交易时间弹框关闭
		appUtils.bindEvent($(_pageId+" .close"),function(e){
			$(_pageId+" .sjkh-vacation").hide();	//隐藏弹框
			$(_pageId+" .fix_bot .ct_btn .next").hide(); 	//隐藏  我知道了  按钮
			$(_pageId+" .fix_bot .ct_btn .exit").show(); 	//展示  下次再来  按钮
		});
		
		/* 绑定下次再来 退出*/
	    appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn .exit"),function(){
			if(navigator.userAgent.indexOf("Android") > 0) {
				require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
			}
			
			//**单独证券开户的无法关闭APP
			//暂时ios无法退出（钱钱跳转过来可以返回到钱钱，但单独证券开户的无法关闭）
			if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
				window.location.href="backClientSide";
			}
	    });
	}
	
	function destroy(){
	}
	// 对外暴露的模块方法 end
	
	var openAccount = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = openAccount;
});