define("project/scripts/account/pwdVerify",function(require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
    service = require("serviceImp").getInstance(),
    gconfig = require("gconfig"),
    layerUtils = require("layerUtils"),
    utils = require("utils"),
    needVideo = "",
    istradetime= "",//视频见证时间标识
    _pageId = "#account_pwdVerify";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        $(_pageId + " .page").height($(window).height());
        $(_pageId + " .over_scroll").height($(window).height() - 45).css({
            overflow: "auto" });
        getVedioport(); // 获取营业部视频端口
        
        //动态显示交易密码找回的地址
        var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
        var tpAddr = appUtils.getSStorageInfo("tpAddr"); //找回交易密码地址
        console.log("tpbankFlg="+tpbankFlg + " tpAddr="+tpAddr);
  /**      if(tpbankFlg == "1"){	//三方存管页面交易密码验证	**/
        	$(_pageId + " .tpbank1").show();
        	$(_pageId + " .tpbank2").hide();
        	$(_pageId + " .tp1a").html(tpAddr);
     /**      }else if(tpbankFlg == "2"){	//三方支付页面交易密码验证
        	$(_pageId + " .tpbank1").hide();
        	$(_pageId + " .tpbank2").show();
       		$(_pageId + " .tp2a").attr("href",tpAddr);
        }**/
    }

    function bindPageEvent() {
    	/* 绑定返回事件 */
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			  pageBack();
		});
		
		
    	/* 绑定退出按钮*/
		appUtils.bindEvent($(_pageId+" .header .icon_close"),function(){
			utils.layerTwoButton("退出系统？","确认","取消",function(){
				if(navigator.userAgent.indexOf("Android") > 0) {
						require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
				}
				if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
					window.location.href="backClientSide";
				}
			},
			function(){return false;});
		});
		
    	/* 下一步(继续开户) */
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn") ,function(){
			var password=$(_pageId+" .password").val();
		    if(password.length == 0)
			{
				layerUtils.iMsg(-1,"请输入交易密码！");
				return;
			}
		    if(password.length < 6)
			{
				layerUtils.iMsg(-1,"请您输入6位的交易密码！");
				return;
			}
			
			var khh =  appUtils.getSStorageInfo("khh");
			var ip = appUtils.getSStorageInfo("ip");
			var param = {
				"step" : "validatePwd",
				"ip":ip,
				"khh" : khh,
				"password":password
			};
			//验证交易密码是否正确
			require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){
				service.hbAjax(param,function(data){
			        if(data.errorNo==0){
			        	//将密码存入思迪数据库
			        	postPassword();
			        }else{
			       		layerUtils.iMsg(-1,"交易密码错误！");
			       		$(_pageId+" .password").val("");	//清空密码控件
			        }
			     });
			},function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(param)});
		});
    }
    
    
    /**
	 * 提交交易密码，资金密码 两次单独请求
	 * 第一次提交设置交易密码 若失败 直接返回；若成功则锁定交易密码设置
	 * 第二次提交设置资金密码 若失败 程序停止，交易密码设置锁定；
	 * pwd_type 1:资金密码 2:交易密码
	 */
	function postPassword(){
		service.getRSAKey({}, function(data) {
			if( data.error_no==0)	//请求获取rsa公钥成功
			{
				//密码采用rsa加密
				var results = data.results[0];
				var modulus = results.modulus;
				var publicExponent =  results.publicExponent;
				var endecryptUtils = require("endecryptUtils");
				
				var tpassword = endecryptUtils.rsaEncrypt(modulus, publicExponent, $(_pageId+"  .password").val());  //交易密码
				var fpassword = endecryptUtils.rsaEncrypt(modulus, publicExponent, $(_pageId+"  .password").val());  //资金密码
				var userid = appUtils.getSStorageInfo("user_id");

				//var is_same = $(_pageId+" .mt15 .icon_check:eq(0)").hasClass("checked") ? 1 : 0;  // 判断资金密码和交易密码是否一致
				var tradePasswordParam = {"user_id":userid,"acct_clientid":"","password":tpassword,"pwd_type":"2","is_same":1};
				var fundPasswordParam  = {"user_id":userid,"acct_clientid":"","password":fpassword,"pwd_type":"1","is_same":1};
				service.setAccountPwd(tradePasswordParam, function(data){
					var errorNo   = data.error_no;
					var errorInfo = data.error_info;
					if(errorNo==0)	//交易密码设置成功，锁定交易密码设置框
					{
						//第二次调用接口，提交资金密码
						service.setAccountPwd(fundPasswordParam, function(data){
							if( data.error_no==0)	//交易密码设置成功，锁定交易密码设置框
							{
								appUtils.pageInit("account/pwdVerify","account/videoNotice",{});
							}
							else
							{
								layerUtils.iLoading(false);
								layerUtils.iAlert(data.error_info);
							}
						},false);
					}
					else
					{
						layerUtils.iLoading(false);
						layerUtils.iAlert(errorInfo);
						return false;
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

    
    
    
    function destroy() {
        service.destroy();
    }

    /* 处理返回按钮 */
    function pageBack() {
        var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
        var currentStep = appUtils.getSStorageInfo("currentStep");
         console.log("pwdVerrify currentStep="+currentStep + " tpbankFlg=" + tpbankFlg);
        // 从短信登陆进入(当前完成步骤为：已提交资料)，处理返回按钮
         console.log("pwdVerify currentStep="+currentStep);
         if(tpbankFlg == "1" || tpbankFlg == "2"){
         	if(currentStep == "idconfirm"){
         		appUtils.setSStorageInfo("personInfo", "exist"); // 标记完成资料填写步骤
	            appUtils.pageInit("account/pwdVerify", "account/personInfo", {});
         	}else if(currentStep == "setpwd"){
         	//	appUtils.setSStorageInfo("currentStep", "uploadimg");
	            appUtils.setSStorageInfo("personInfo", "exist"); // 标记完成资料填写步骤
	            appUtils.pageInit("account/pwdVerify", "account/personInfo", {});
         	}else{
         		appUtils.pageBack();
         	}
         }else{
         	  // 正常开户流程处理返回按钮
         	   appUtils.pageBack();
         }
    }


    /* 获取营业部视频端口 */
    function getVedioport() {
        // 获取营业部视频端口
        var param = {
            "branchno": appUtils.getSStorageInfo("branchno"),
            "userid": appUtils.getSStorageInfo("user_id")
        };
        service.queryVideoAddress(param,
        function(data) {
            if (data.error_no == "0" && data.results.length != 0) {
                appUtils.setSStorageInfo("branch_id", data.results[0].branch_id);
                appUtils.setSStorageInfo("branch_url", data.results[0].url);
                // 如果是从短信验证码页面跳转过来的，从 session 中取 QQ 号并填充
                if (appUtils.getSStorageInfo("_prePageCode") == "account/msgVerify") {
                    queryQQOfflineState(); // 查询视频通过状态
                }
            } else {
                layerUtils.iMsg( - 1, "获取视频服务器IP端口异常"); // 提示错误信息
            }
        },
        true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？",
        function() {
            getVedioport(); // 再次获取视频端口
        });
    }

    var pwdVerify = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "pageBack": pageBack,
        "destroy": destroy
    };

    // 暴露对外的接口
    module.exports = pwdVerify;
});