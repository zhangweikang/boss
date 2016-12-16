/**
* 数字证书
*/
define("project/scripts/account/digitalCertificate",function(require,exports,module){
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
	    service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		global = require("gconfig").global,
		layerUtils = require("layerUtils"),
		_pageId = "#account_digitalCertificate",
		cert_type = "", // tw:天威 zd:中登
		downloadProgressInterval = null;
	/* 私有业务模块的全局变量 end */
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		layerUtils.iLoading(false);  //证书下载页屏蔽系统等待层
		cert_type = appUtils.getSStorageInfo("openChannel") == "new" ? "zd" : "tw"; // tw:天威 zd:中登
		upload_cert();  //下载安装证书
	}
	
	function bindPageEvent()
	{
		appUtils.bindEvent($(_pageId+" .cert_down a"),function(e){
			$(_pageId+" .qa_list").slideDown("fast");
			e.stopPropagation();
		});
		
		appUtils.bindEvent($(_pageId),function(e){
			$(_pageId+" .qa_list").slideUp("fast");
			e.stopPropagation();
		});
	}
	
	function destroy()
	{
		$(_pageId+" .order_succes").show();
		$(_pageId+" .cert_down").hide();
		$(_pageId+" #next_btn a").html("请稍后...");
		$(_pageId+" #next_btn").attr("class","ce_btn");
		service.destroy();
	}
	
	/*下载证书并安装*/		
	function upload_cert()
	{
		// 下载证书，创建10位随机数
		var createKeyRandom = "1";
		for(var i=0; i<9; i++)
		{
			createKeyRandom += parseInt(Math.random()*10)+"";
		}
		// 证书申请串，数据来源于壳子
		var pkcs10 = "",
			  createKeyParam = {
				"rodam" : createKeyRandom,
				"userId" : appUtils.getSStorageInfo("user_id"),
				"key" : "stockDelegateTradeSys"
			  };
		// 调用壳子的方法生成证书申请串
		require("shellPlugin").callShellMethod("createKeyPlugin",function(data){
			pkcs10 = data.pkcs10;
			// 中登证书
			var param = {
				"user_id" : appUtils.getSStorageInfo("user_id"),
				"pkcs10" : pkcs10
			};
			// 新开调用中登证书
			if(appUtils.getSStorageInfo("openChannel") == "new")
			{
				service.queryCompyCart(param,function(data){callcert(data,cert_type)},true,false,handleTimeout);
			}
			else if(appUtils.getSStorageInfo("openChannel") == "change")
			{
				service.queryMyselfCart(param,function(data){callcert(data,cert_type)},true,false,handleTimeout);
			}
		},install_failed,createKeyParam);
	}
	
	/* 处理请求超时 */
	function handleTimeout()
	{
		layerUtils.iConfirm("请求超时，是否重新加载？",function(){
			upload_cert();  // 再次下载证书
		});
	}
	
	/* 安装证书回调方法 */
	function callcert(data,cert_type){
		var error_no = data.error_no;
		var error_info = data.error_info;
		if(error_no == "0" && data.results.length != 0)
		{
			var certParam = {
				// 获取证书的内容
				"content" : data.results[0].p7cert,
				"userId" : appUtils.getSStorageInfo("user_id"),
				"type" : cert_type
			};
			// 壳子读取证书，然后安装证书
			require("shellPlugin").callShellMethod("initZsPlugin",function(data){
				if(data == "OK")
				{
					$(_pageId+" .cert_down .cert_stat").html("安装完成");
					$(_pageId+" .order_succes").hide();
					$(_pageId+" .cert_down").show();
					$(_pageId+" #next_btn").attr("class","ct_btn");
					if(appUtils.getSStorageInfo("openChannel") == "change")
					{
						$(_pageId+" #next_btn a").html("继续转户");  // 转户
					}
					else
					{
						$(_pageId+" #next_btn a").html("继续开户");  // 开户
					}
					// 为按钮绑定事件
					appUtils.bindEvent($(_pageId+" #next_btn a"),function(){
						appUtils.pageInit("account/digitalCertificate","account/signProtocol",{});
					});
				}
				else
				{
					install_failed();
				}
			},install_failed,certParam);
		}
		else
		{
			layerUtils.iLoading(false);
			layerUtils.iAlert(data.error_info,-1);
			install_failed();
		}
	}
	
	/*安装证书失败回调*/
	function install_failed()
	{
		$(_pageId+" #next_btn").attr("class","ct_btn");
		$(_pageId+" #next_btn a").html("手动安装");
		$(_pageId+" .cert_down .cert_stat").html("安装失败");
		$(_pageId+" .order_succes").hide();
		$(_pageId+" .cert_down").show();
		// 为按钮绑定事件
		appUtils.bindEvent($(_pageId+" #next_btn a"),function(){
			destroy();
			init();
		});
	}
	
	var digitalCertificate = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	module.exports = digitalCertificate;
});