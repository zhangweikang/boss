/**
 * 视频见证注意事项
 */
define("project/scripts/account/videoNotice",
function(require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
    service = require("serviceImp").getInstance(),
    // 业务层接口，请求数据
    gconfig = require("gconfig"),
    // global = gconfig.global,
    layerUtils = require("layerUtils"),
    needVideo = "",
    istradetime= "",//视频见证时间标识
    _pageId = "#account_videoNotice";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        $(_pageId + " .page").height($(window).height());
        $(_pageId + " .over_scroll").height($(window).height() - 45).css({
            overflow: "auto"
        });
        window.videoSuccess = videoSuccess; // 见证成功
        window.videoFail = videoFail; // 见证中断
        window.videoReject = videoReject; // 见证驳回
        window.qqApplay = qqApplay;
        initPage(); // 初始化页面
        getVedioport(); // 获取营业部视频端口
        get_istradetime();   
    }

    function bindPageEvent() {
        /* 绑定返回 */
        appUtils.bindEvent($(_pageId + " .header .icon_back"),
        function() {
            pageBack();
        });

        /* 重新上传照片 */
        appUtils.bindEvent($(_pageId + " .photo_again"),
        function() {
            var param = {
                user_id: appUtils.getSStorageInfo("user_id"),
                lastcomplete_step: "0",
                opacctkind_flag: ""
            };
            service.queryChangeState(param,
            function(data) {
                var error_no = data.error_no;
                var error_info = data.error_info;
                if (error_no == 0) {
                    appUtils.setSStorageInfo("idInfo", "exist");
                    appUtils.pageInit("account/videoNotice", "account/uploadPhoto", {});
                } else {
                    layerUtils.iLoading(false);
                    layerUtils.iMsg( - 1, error_info);
                }
            });
        });

        /* 重新提交资料 */
        appUtils.bindEvent($(_pageId + " .info_again"),
        function() {
            var Flag = false;
            var currentStep = appUtils.getSStorageInfo("currentStep");
            if (currentStep == "uploadimg" || currentStep == null) {
                Flag = true;
            } else {
                Flag = false;
            }
            var param = {
                user_id: appUtils.getSStorageInfo("user_id"),
                lastcomplete_step: "uploadimg",
                opacctkind_flag: ""
            };
            service.queryChangeState(param,
            function(data) {
                var error_no = data.error_no;
                var error_info = data.error_info;
                if (error_no == 0) {
                    pageBack();
                } else {
                    layerUtils.iLoading(false);
                    layerUtils.iMsg( - 1, error_info);
                }
            },
            Flag);
        });

        /* 申请QQ预约 */
        appUtils.bindEvent($(_pageId + " .c_link"),
        function() {
            appUtils.pageInit("account/videoNotice", "account/orderQq", {});
        });

        /* 在线视频视频见证 */
        appUtils.bindEvent($(_pageId + " .ct_btn:eq(0)"),
        function() {
            if (gconfig.platform == '1') {
                //改变手势状态
                require("shellPlugin").callShellMethod("changeStatusPlugin", null, null, {
                    "flag": true
                });
            }
        
            if (istradetime == "1") {
            	
                // 判断URL是否为空
                var param = {
                    "url":gconfig.global.serverPath+"?",
                    "user_id": appUtils.getSStorageInfo("user_id"),
                    "user_name": appUtils.getSStorageInfo("custname"),
                    "org_id": appUtils.getSStorageInfo("branchno"),
                    "jsessionid": appUtils.getSStorageInfo("jsessionid")
                    // "clientinfo":appUtils.getSStorageInfo("clientinfo")
                };
                require("shellPlugin").callShellMethod("videoWitnessPlugin", null, null, param);
            }
                   

        });

        /* 继续开户 */
        appUtils.bindEvent($(_pageId + " .ct_btn:eq(1)"),
        function() {
            queryQQOfflineState(); // 查询视频通过状态
        });
    }

    function get_istradetime(){
    	    //获取istradetime  为1  就是在这个时间内  0 就不再这个时间内
            service.getIstradetime({},
            function(data) {
                var error_no = data.error_no;
                var error_info = data.error_info;
                var result = data.results;
                if (error_no == 0) {
                    if (result[0].istradetime == "1") {
                         istradetime = result[0].istradetime;
                    }
                    else{
                    	//按钮设置为灰色不可用
                    	$(_pageId + " .ct_btn:eq(0)").addClass("disable");
                    }
                } else {
                    layerUtils.iLoading(false);
                    layerUtils.iMsg( - 1, error_info);
                }
            });
    }
    
    
    
    
    function destroy() {
        // 页面初始化样式重置
        $(_pageId + " .header h3:eq(0)").show();
        $(_pageId + " .header h3:eq(1)").hide();
        $(_pageId + " .error_notice:eq(0)").hide();
        $(_pageId + " .error_notice:eq(1)").hide();
        $(_pageId + " .camera_notice:eq(0)").show();
        $(_pageId + " .camera_notice:eq(1)").hide();
        $(_pageId + " .photo_again").hide();
        $(_pageId + " .info_again").hide();
        $(_pageId + " .c_link").show();
        $(_pageId + " .fix_bot").show();
        $(_pageId + " .fix_bot .ct_btn:eq(0)").show();
        $(_pageId + " .fix_bot .ct_btn:eq(1)").hide();
        service.destroy();
    }

    /* 处理返回按钮 */
    function pageBack() {
    	//钱钱炒股直接跳转过来的，在当前页面点击则关闭手机开户APP
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
    	
    	
    	
    	//绑定三方存管或者三方支付标志     1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	0：未绑定三方存管和三方支付
		var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
        var currentStep = appUtils.getSStorageInfo("currentStep");
         console.log("videoNotices currentStep="+currentStep + " tpbankFlg=" + tpbankFlg);
          // 从短信登陆进入(当前完成步骤为：已校验设置交易密码)，处理返回按钮
        if(tpbankFlg == "1" || tpbankFlg == "2"){
        	if(currentStep == "setpwd"){
	        	appUtils.setSStorageInfo("personInfo", "exist"); // 标记完成资料填写步骤
	            appUtils.pageInit("account/videoNotice", "account/pwdVerify", {});
        	}else{
        		appUtils.pageBack();
        	}
        }else{
        	/**
        	 // 从短信登陆进入(当前完成步骤为：已提交资料)，处理返回按钮
	        if (currentStep == "idconfirm") {
	            appUtils.setSStorageInfo("currentStep", "uploadimg");
	            appUtils.setSStorageInfo("personInfo", "exist"); // 标记完成资料填写步骤
	            appUtils.pageInit("account/videoNotice", "account/personInfo", {});
	        }
	        // 从短信登陆进入，在personInfo提交资料后，处理返回按钮
	        else if (currentStep == "uploadimg") {
	            appUtils.setSStorageInfo("personInfo", "exist"); // 标记完成资料填写步骤
	            appUtils.pageBack();
	        }
	        // 正常开户流程处理返回按钮
	        else {
	            appUtils.pageBack();
	        } **/
	         appUtils.pageBack();
        }
    }

    /* 初始化页面 */
    function initPage() {
        needVideo = appUtils.getPageParam("need_video");
        if (needVideo == 1) {
            $(_pageId + " .main .step_box").hide();
            $(_pageId + " .main .error_notice:eq(0)").show();
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

    /* 查询离线视频通过状态 */
    function queryQQOfflineState() {
        var lookVedioStateParam = {
            "user_id": appUtils.getSStorageInfo("user_id")
        };
        service.queryQQOfflineState(lookVedioStateParam,
        function(data) {
            var error_no = data.error_no;
            var error_info = data.error_info;
            if (error_no == 0 && data.results.length != 0) {
                // 视频通过状态，0：未见证、2：已预约离线见证未完成见证、1：视频见证完成、3：见证失败
                // 未见证不需要做处理
                var witnessFlag = data.results[0].witness_flag;
                if (witnessFlag == 1) {
                    layerUtils.iAlert("您的视频审核已通过，接下来即将为您安装数字证书...", 0,
                    function() {
                        appUtils.pageInit("account/videoNotice", "account/digitalCertificate", {});
                    });
                } else if (witnessFlag == 2) {
                    layerUtils.iAlert("您的预约信息已经提交，我们的客服将尽快联系您！", 0);
                } else if (witnessFlag == 3) {
                    $(_pageId + " .c_link").show();
                    $(_pageId + " .fix_bot .ct_btn:eq(0)").show();
                    $(_pageId + " .fix_bot .ct_btn:eq(1)").hide();
                    layerUtils.iAlert("视频见证失败，请重新申请见证！");
                } else if (witnessFlag == 4) {
                    layerUtils.iAlert("资料审核中，工作人员会尽快给您回复，请耐心等候！");
                }
            } else {
                layerUtils.iAlert(data.error_info);
            }
        });
    }

    /* 见证通过 */
    function videoSuccess() {
        $(_pageId + " .fix_bot .ct_btn:eq(0)").hide();
        $(_pageId + " .fix_bot .ct_btn:eq(1)").show();
        $(_pageId + " .c_link").hide();
        queryQQOfflineState(); // 查询视频通过状态
    }

    /* 见证不通过 */
    function videoFail() {}

    /* 见证被驳回 */
    function videoReject() {
        $(_pageId + " .header h3:eq(0)").hide();
        $(_pageId + " .header h3:eq(1)").show();
        $(_pageId + " .error_notice:eq(0)").hide();
        $(_pageId + " .error_notice:eq(1)").show();
        $(_pageId + " .camera_notice:eq(0)").hide();
        $(_pageId + " .camera_notice:eq(1)").show();
        $(_pageId + " .photo_again").show();
        $(_pageId + " .info_again").show();
        $(_pageId + " .c_link").hide();
        $(_pageId + " .fix_bot").hide();
    }

    /* QQ预约 */
    function qqApplay() {
        appUtils.pageInit("account/videoNotice", "account/orderQq", {});
    }

    var videoNotice = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "pageBack": pageBack,
        "destroy": destroy
    };

    // 暴露对外的接口
    module.exports = videoNotice;
});