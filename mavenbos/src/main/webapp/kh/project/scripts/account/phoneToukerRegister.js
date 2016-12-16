/**
 * 手机号码验证
 */
define("project/scripts/account/phoneToukerRegister",function(require,exports,module){
    /* 私有业务模块的全局变量 begin */
    var $ = jQuery = require('jquery');
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        global = require("gconfig").global,
        gconfig = require("gconfig"),
        layerUtils = require("layerUtils"), // 弹出层对象
        utils = require("utils"),
        validatorUtil = require("validatorUtil"),
        startCountDown = null,
        startLoadCountDown = null,
        backmsg="",
        sumTime_unregistered_key="sumTimeUnregistered",
        _pageId = "#account_phoneToukerRegister",
        phoneNum =  "",
        psw_id = "", key = 1, flag = false;
        
         //新开户基本流程跳转
        steps = ["uploadimg","idconfirm","witness",
		        	 "certintall","capitalacct",
		         	 "stkacct","setpwd","tpbank",
		       	     "risksurvey","visitsurvey","success"
  	    ],
		stepMap = {"uploadimg":"account/uploadPhoto","idconfirm":"account/personInfo","witness":"account/videoNotice",
	               		   "certintall":"account/digitalCertificate","capitalacct":"account/signProtocol","stkacct":"account/signProtocol",
	               		   "setpwd":"account/setPwd","tpbank":"account/thirdDepository",
	              		   "risksurvey":"account/riskAssessment","visitsurvey":"account/openConfirm","success":"account/accountSuccess"
	    },
		stepMap0 = {"uploadimg":"account/uploadPhotoChange","witness":"account/digitalCertificate"},
		
		//add by xujianhua at 20151230
		//已绑定了三方村官的流程跳转
		 stepsTp1 = ["uploadimg","idconfirm","setpwd","witness",
		        	 "certintall","capitalacct","stkacct",
		        	 "risksurvey","visitsurvey","success"
  	    ],
		stepMapTp1 = {"uploadimg":"account/uploadPhoto","idconfirm":"account/personInfo","setpwd":"account/personInfo","witness":"account/videoNotice",
	               		   "certintall":"account/digitalCertificate","capitalacct":"account/signProtocol","stkacct":"account/signProtocol",
	              		   "risksurvey":"account/riskAssessment","visitsurvey":"account/openConfirm","success":"account/accountSuccess"
		},
		
		//已绑定了三方支付的流程跳转
		stepsTp2 = ["uploadimg","idconfirm","setpwd","witness",
		        	 "certintall","capitalacct","stkacct","tpbank",
		        	 "risksurvey","visitsurvey","success"
  	    ],
		stepMapTp2 = {"uploadimg":"account/uploadPhoto","idconfirm":"account/personInfo","setpwd":"account/personInfo","witness":"account/videoNotice",
	               		   "certintall":"account/digitalCertificate","capitalacct":"account/signProtocol","stkacct":"account/signProtocol",
	              		   "tpbank":"account/thirdDepository", "risksurvey":"account/riskAssessment","visitsurvey":"account/openConfirm",
	              		   "success":"account/accountSuccess"
		};

    /* 私有业务模块的全局变量 end */
    function init()
    {
        //加载样式
        $(_pageId+" .page").height($(window).height());
        $(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
        /*发送验证码后自动互调该方法*/
        window.getCode = getCode;
        $(_pageId+" .loginPass").val("");  //清除登录密码
        phoneNum =  appUtils.getSStorageInfo("mobileNo");
        var backpage= appUtils.getPageParam("backUrl");
        console.log("backpage="+backpage +" phoneNum:"+phoneNum);
        if(backpage=="account/phoneToukerRegister"){
            $(_pageId+" .getmsg").show();  // 显示按钮
            $(_pageId+" .cert_notice").hide();  // 隐藏验证码已发出提示
            $(_pageId+" .time").hide();  // 隐藏倒计时
        }
        $(_pageId+" .mobileCode").val("请输入验证码").css({color:"#E3E3E3"});  // 清除验证码
        var sumTime_unregistered=appUtils.getSStorageInfo(phoneNum+"start");
        var shengms=parseInt((122*1000-(new Date().getTime()-sumTime_unregistered))/1000);
        console.log(" sumTime_unregistered>>>>>>>>>>>:"+sumTime_unregistered+" shengms>>>"+shengms);
        if(sumTime_unregistered==null || shengms<=0){
            sendSmsCode(); // 进入页面就开始发送验证码
        }else{
            $(_pageId+" .sendPhoneTip").html("短信已发送至 "+phoneNum);
            console.log("剩余秒数》》》》》》》"+shengms);
            startLoadHandleCount(shengms);
        }
        /* 下一步(继续开户) */
        appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn") ,function(){
            nextClick();
        });
    }

    function bindPageEvent(){
        /* 绑定返回事件 */
        appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
            //appUtils.pageBack();
            appUtils.pageInit("account/phoneToukerRegister","account/phoneNumberVerify",{"backUrl":"account/phoneNumberVerify"});
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

        // 预绑定查看协议的事件
        appUtils.bindEvent($(_pageId+" .icon_check:eq(0)"),function(){
            if($(_pageId+" .icon_check:eq(0)").hasClass("checked")){
                $(this).removeClass("checked");
            }else{
                $(this).addClass("checked");
            }
        });

        // 预绑定查看协议的事件
        appUtils.bindEvent($(_pageId+" .protocol"),function(){
            appUtils.pageInit("account/phoneToukerRegister","account/toukerSignProtocol",{});
        });

        /* 绑定获取短信验证码事件 */
        appUtils.bindEvent($(_pageId+" .getmsg"),function(){
            sendSmsCode();
        });

    }

    function nextClick()
    {
        if($(_pageId+" .mobileCode").val().length == 0)
        {
            layerUtils.iMsg(-1,"请输入验证码！");
            return;
        }
        if(isNaN($(_pageId+" .mobileCode").val())){
            layerUtils.iMsg(-1,"请输入正确的验证码！");
            return;
        }
        if($(_pageId+" .loginPass").val().length == 0)
        {
            layerUtils.iMsg(-1,"请设置登录密码！");
            return;
        }
        if($(_pageId+" .loginPass").val().trim().length < 6){
            layerUtils.iMsg(-1,"登录密码由6-20位英文、数字组成！");
            return;
        }
        if(!($(_pageId+" .icon_check:eq(0)").hasClass("checked"))){
            layerUtils.iMsg(-1,"请阅读并接受投客网用户协议！");
            return;
        }
        checkSmsCode();  //验证码校验
    }

    function sendSmsCode()
    {
        // 首先验证手机号
        if(validatorUtil.isMobile(phoneNum))
        {
            getSmsCode(phoneNum);  //获取验证码
        }
        else
        {
            // 手机号没通过前端校验，弹出提示，并终止发送验证码的过程
            var times = phoneNum.length - 11;
            if(phoneNum.length > 11)
            {
                layerUtils.iMsg(-1,"您多输入&nbsp;"+times+"&nbsp;位电话号码，请重新输入！");
            }
            else if(phoneNum.length < 11)
            {
                layerUtils.iMsg(-1,"您少输入&nbsp;"+Math.abs(times)+"&nbsp;位电话号码，请重新输入！");
            }
            return;
        }
    }

    /* 提交验证码校验 */
    function checkSmsCode()
    {
        appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn") ,function(){
            return false;
        });
        
        console.log("进入 checkSmsCode>>>>>>>>>");
        var login_flag = appUtils.getSStorageInfo("openChannel") == "new" ? "0" : "1";
        if(appUtils.getSStorageInfo("finance") == "finance")
        {
            login_flag = "2";   // 理财户传2
        }
        var paramCheck = {
            "mobile_no" : phoneNum,
            "mobile_code" : $(_pageId+" .mobileCode").val(),
            "login_flag" : login_flag  // 登录业务标准，新开户0  转户1  理财户2
        };
        //思迪校验验证码
        service.checkSmsCode(paramCheck,function(data){
            console.log("SD请求出参："+JSON.stringify(data));
            var error_no = data.error_no;
            var error_info = data.error_info;
            var result = data.results;
            if(error_no == "0" && result.length != 0)
            {
                // user_id保存到session
                if(result[0].user_id)
                {
                    appUtils.setSStorageInfo("user_id",result[0].user_id);
                }
                // 身份证号保存到session
                if(result[0].idno)
                {
                    appUtils.setSStorageInfo("idCardNo",result[0].idno);
                }
                //手机号保存到session
                if(result[0].mobileno)
                {
                    appUtils.setSStorageInfo("mobileNo",result[0].mobileno);
                }
                // 将客户姓名保存到 session 中
                if(result[0].custname)
                {
                    appUtils.setSStorageInfo("custname",result[0].custname);
                }
                // 签发机关保存到session
                if(result[0].policeorg)
                {
                    appUtils.setSStorageInfo("policeorg",result[0].policeorg);
                }
                // 证件地址保存到session
                if(result[0].native)
                {
                    appUtils.setSStorageInfo("native",result[0].native);
                }
                // 联系地址保存到session
                if(result[0].addr)
                {
                    appUtils.setSStorageInfo("addr",result[0].addr);
                }
                // 起始期限保存到session
                if(result[0].idbegindate)
                {
                    appUtils.setSStorageInfo("idbegindate",result[0].idbegindate);
                }
                // 结束期限保存到session
                if(result[0].idenddate)
                {
                    appUtils.setSStorageInfo("idenddate",result[0].idenddate);
                }
                // 邮编保存到session
                if(result[0].postid)
                {
                    appUtils.setSStorageInfo("postid",result[0].postid);
                }
                // 职业保存到session
                if(result[0].profession_code)
                {
                    appUtils.setSStorageInfo("profession_code",result[0].profession_code);
                }
                // 学历保存到session
                if(result[0].edu)
                {
                    appUtils.setSStorageInfo("edu",result[0].edu);
                }
                // 将 clientinfo 保存到 session 中，用于解决壳子上传照片的权限问题
                if(result[0].clientinfo)
                {
                    appUtils.setSStorageInfo("clientinfo",result[0].clientinfo);
                }
                // 将 jsessionid 保存到 session 中，用于解决壳子上传照片的权限问题
                if(result[0].jsessionid)
                {
                    appUtils.setSStorageInfo("jsessionid",result[0].jsessionid);
                }
                // 将佣金id保存到session
                if(result[0].commission)
                {
                    appUtils.setSStorageInfo("commission",result[0].commission);
                }
                // 将佣金值保存到session
                if(result[0].commissionname)
                {
                    appUtils.setSStorageInfo("commissionname",result[0].commissionname);
                }
                // 将营业部Id保存到session
                if(result[0].branchno)
                {
                    appUtils.setSStorageInfo("branchno",result[0].branchno);
                }
                // 将营业部名称保存到session
                if(result[0].branchname)
                {
                    appUtils.setSStorageInfo("branchname",result[0].branchname);
                }
                // 将省份保存到session
                if(result[0].provincename)
                {
                    appUtils.setSStorageInfo("provincename",result[0].provincename);
                }
                // 将城市保存到session
                if(result[0].cityname)
                {
                    appUtils.setSStorageInfo("cityname",result[0].cityname);
                }
                appUtils.setSStorageInfo("shaselect",result[0].shaselect);  // 是否选择沪A
                appUtils.setSStorageInfo("szaselect",result[0].szaselect);  // 是否选择深A
                appUtils.setSStorageInfo("hacnselect",result[0].shaselect);  // 是否选择沪开放式基金
                appUtils.setSStorageInfo("zacnselect",result[0].szaselect);  // 是否选择深开放式基金
                
                var  opacctkind_flag = result[0].opacctkind_flag;  // 开户通道的标识，0 新开户，1 转户 , 2 理财户
                appUtils.setSStorageInfo("openChannel","new");
                var param = {
                    "step" : "verifyRegister",
                    "mobileNo" : phoneNum,
                    "smsCode" : $(_pageId+" .mobileCode").val(),
                    "loginPass" : $(_pageId+" .loginPass").val(),
                    "channel" : "openStock_app",
                    "login_flag" : login_flag,  // 登录业务标准，新开户0  转户1  理财户2
                    "op_source" : 3,// Android 或 Iphone
                    "op_way" : iBrowser.pc ? 0 : 3// 访问接口来源标识，访问来源(默认PC) 0：pc， 2：pad， 3：手机
                };
                require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){
                    service.hbAjax(param,function(data){
                        if(data.errorNo==0){  //注册成功
                        	//验证是否在思迪开户
                        	validateCustInfo(result[0]);
                        	
                            //appUtils.pageInit("account/phoneToukerRegister","account/selDepartment",{"backUrl":"account/phoneNumberVerify"});
                        }else{
                            appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn") ,function(){
                                nextClick();
                            });
                            layerUtils.iMsg(-1,data.errorMsg);
                            return;
                        }
                    });
                },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(param)});
            }
            else
            {
                appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn") ,function(){
                    nextClick();
                });
                layerUtils.iMsg(-1,"请输入正确的短信验证码！");
                return;
            }
        });
    }



    /* 壳子获取验证码自动填充 */
    function getCode(data)
    {
        if(data)
        {
            $(_pageId+" .mobileCode").val(data);
        }
    }

    /* 获取验证码 */
    function getSmsCode(phoneNum)
    {
        //alert("手机号:"+phoneNum);
        var mac = iBrowser.pc ? "02:00:5E:00:00:14" : "",
            ip = iBrowser.pc ? "192.168.1.109" : "";
        // 只有当不是 pc 时，才调用壳子获取 ip 和 mac
        if(!iBrowser.pc)
        {
            require("shellPlugin").callShellMethod("getIpMacPLugin",function(data){
                data = data.split("|");
                mac = data[0];
                ip = data[1];
                appUtils.setSStorageInfo("ip",ip); // 将 ip 保存到 sessionStorage 里面
                appUtils.setSStorageInfo("mac",mac); // 将 mac 保存到 sessionStorage 里面
                sendmsg(phoneNum,mac,ip); // 发送验证码
            },null);
        }
        else
        {
            sendmsg(phoneNum,mac,ip); // 发送验证码
        }
    }
    /* 发送验证码 */
    function sendmsg(phoneNum,mac,ip)
    {
        var param = {
            "step" : "getSmsCode",
            "mobileNo" : phoneNum,
            "op_way" : iBrowser.pc ? 0 : 3,// 访问接口来源标识，访问来源(默认PC) 0：pc， 2：pad， 3：手机
            "ip" : ip,
            "mac" : mac
        };
        require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){
            service.hbAjax(param,function(data){
                if(data.errorNo==0){
                    // 提示验证码已发送到手机号
                    $(_pageId+" .sendPhoneTip").html("短信已发送至 "+phoneNum);
                    //后台如果返回ip地址，则本地存储用户ip地址
                    appUtils.setSStorageInfo("ip",ip);
                    appUtils.setSStorageInfo(phoneNum+"start",new Date().getTime());
                    // 计时器
                    startHandleCount(120);
                    // 调用读取短信验证码插件
                    require("shellPlugin").callShellMethod("sMSReceiverPlugin",null,null,null);
                }else{
                    layerUtils.iMsg(-1,data.errorMsg);
                }
            });
        },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(param)});
    }
    
	/**
	 * 通过计时器来处理验证码倒计时
	 * @param sumTime 计时器
	 */
	function startLoadHandleCount(sumTime){
	    var temp_sumTime=sumTime;
	    // 计时器
	    //处理获取验证码时发生的动作
	    var handleCount = function(){
	        // 获取验证码之后按钮隐藏
	        $(_pageId+" .getmsg").hide();
	        // 显示倒计时
	        $(_pageId+" .time").show();
	        $(_pageId+" .cert_notice").show();
	        $(_pageId+" .time").text(sumTime--+"秒后重发");
	        appUtils.setSStorageInfo(phoneNum,sumTime);
	        if(sumTime<=0 && phoneNum==appUtils.getSStorageInfo("mobileNo")){
	            // 显示按钮
	            $(_pageId+" .getmsg").show();
	            // 隐藏倒计时
	            $(_pageId+" .time").hide();
	            $(_pageId+" .cert_notice").hide();
	            $(_pageId+" .time").text(temp_sumTime);
	            console.log("startLoadHandleCount close>>>>>>>>>>>>>>>>*******");
	            window.clearInterval(startLoadCountDown);
	            if(startCountDown != null)
		        {
		            window.clearInterval(startCountDown);
		        }
	        }
	    };
	    handleCount();
	    startLoadCountDown = window.setInterval(function(){
	        handleCount();
	    }, 1000);
	}

    /**
     * 通过计时器来处理验证码倒计时
     * @param sumTime 计时器
     */
    function startHandleCount(sumTime){
        var temp_sumTime=sumTime;
        // 计时器
        //处理获取验证码时发生的动作
        var handleCount = function(){
            // 获取验证码之后按钮隐藏
            $(_pageId+" .getmsg").hide();
            // 显示倒计时
            $(_pageId+" .time").show();
            $(_pageId+" .cert_notice").show();
            $(_pageId+" .time").text(sumTime--+"秒后重发");
            appUtils.setSStorageInfo(phoneNum,sumTime);
            if(sumTime<=0 && phoneNum==appUtils.getSStorageInfo("mobileNo")){
                // 显示按钮
                $(_pageId+" .getmsg").show();
                // 隐藏倒计时
                $(_pageId+" .time").hide();
                $(_pageId+" .cert_notice").hide();
                $(_pageId+" .time").text(temp_sumTime);
                window.clearInterval(startCountDown);
                console.log("startHandleCount close>>>>>>>>>>>>>>>>*******");
                if(startLoadCountDown != null)
		        {
		            window.clearInterval(startLoadCountDown);
		        }
            }
        };
        handleCount();
        startCountDown = window.setInterval(function(){
            handleCount();
        }, 1000);
    }
    
    
    //验证客户信息
    function validateCustInfo(result){
    	phoneNum =  appUtils.getSStorageInfo("mobileNo");
    	var khh = appUtils.getSStorageInfo("khh");
	     //华宝客户信息校验、关联
         var param = {
	            "step" : "validateCustInfo",
	            "channel" : "stock_app",
	            "mobileNo" : phoneNum,
	            "khh" : khh,
	        };
        	require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){
	            service.hbAjax(param,function(data){
	                if(data.errorNo==0){
	                	//身份证影像默认不存在
                       	appUtils.setSStorageInfo("idCardImgExist",true);
	                	
	                   var tpbankFlg = data.results.dataSet.tpbankFlg;	//开通三方存管或者三方支付标志（0：未绑定三方存管和三方支付     1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	）
	                   var tpAddr = data.results.dataSet.tpAddr;	//开通三方存管或者三方支付标志（0：未绑定三方存管和三方支付     1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	）
	            	   appUtils.setSStorageInfo("tpbankFlg",tpbankFlg);	
	            	   appUtils.setSStorageInfo("tpAddr",tpAddr);	
	                  
	                   var message = data.errorMsg;
	                   
	                   appUtils.setSStorageInfo("idnoDD",data.results.dataSet.idnoDD);
	                   appUtils.setSStorageInfo("message",message); 
	                   //顶点保存的开户营业部
	                   var branchnoDD = data.results.dataSet.branch;
	                   if(null != branchnoDD && "undefined" != branchnoDD && "" != branchnoDD){
	                   		appUtils.setSStorageInfo("branchno",data.results.dataSet.branch);	//营业部
	                   }
	                   
                       if(message == '3'){	//身份证号不一致
                       		appUtils.pageInit("account/phoneToukerRegister", "account/uploadPhoto", {"backUrl": "account/phoneNumberVerify"});
                       }else if(message == '1' || message == '2'){	//已开出客户号、待审核
                       		layerUtils.iMsg(-1,"您的手机号已经开户过,请您输入新的手机号！");
//	                       	$(_pageId+" .fix_bot .ct_btn").removeClass("disable");
							appUtils.pageInit("account/phoneToukerRegister", "account/phoneNumberVerify");
							return;
                       }else if(message == '4'){
                       		//用顶点的身份证信息，覆盖思迪的信息（已存在客户号）
                       		appUtils.setSStorageInfo("idCardNo",data.results.dataSet.idno);
                       		appUtils.setSStorageInfo("custname",data.results.dataSet.custname);
                       		appUtils.setSStorageInfo("policeorg",data.results.dataSet.policeorg);
                       		appUtils.setSStorageInfo("native",data.results.dataSet.native);
                       		appUtils.setSStorageInfo("addr",data.results.dataSet.native);
                       		appUtils.setSStorageInfo("idbegindate",data.results.dataSet.idbegindate);
                       		appUtils.setSStorageInfo("idenddate",data.results.dataSet.idenddate);
                       		appUtils.setSStorageInfo("postid",data.results.dataSet.postid);
                       		appUtils.setSStorageInfo("profession_code",data.results.dataSet.profession_code);
                       		appUtils.setSStorageInfo("edu",data.results.dataSet.edu);
                       	
                       		appUtils.pageInit("account/phoneToukerRegister", "account/personInfo", {"backUrl": "account/phoneNumberVerify"});
                       }else{	//继续开户流程
	                       	//判断是否驳回，若驳回 则走驳回流程
							if(addition(result))
							{
								return false;
							}
							//未驳回，则正常走流程
							else
							{
								nextStep(result, result.opacctkind_flag,tpbankFlg);
			                }
                       }
	                }else{
	                    layerUtils.iMsg(-1,"系统异常！");
//		                    $(_pageId+" .fix_bot .ct_btn").removeClass("disable");
	                }
	            });
	        },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(param)});
    }
    
    
    /* 处理驳回补全资料的情况 */
    function addition(res)
    {
        //驳回情况：身份证正面、反面、大头像、交易密码、资金密码、三方存管、转户驳回到视频见证
        var photoParam = {"needFront" : res.need_photo_front != undefined ? res.need_photo_front : "0",
            "needBack" : res.need_photo_back != undefined ? res.need_photo_back : "0",
            "needNohat" : res.need_photo_nohat != undefined ? res.need_photo_nohat : "0"
        };
        var pwdParam = {"needBusinessPwd" : res.need_business_password != undefined ? res.need_business_password : "0",
            "needFundPwd" : res.need_fund_password != undefined ? res.need_fund_password : "0"
        };
        var accountParam = {"need_account" : res.need_account != undefined ? res.need_account : "0"};
        var videoParam = {"need_video" : res.need_video != undefined ? res.need_video : "0"};
        var thirdParam ={"needThirdDeposit" : res.need_third_deposit != undefined ? res.need_third_deposit : "0"};
        appUtils.setSStorageInfo("videoParam",JSON.stringify(videoParam));
        appUtils.setSStorageInfo("pwdParam", JSON.stringify(pwdParam));
        appUtils.setSStorageInfo("thirdParam", JSON.stringify(thirdParam));
        appUtils.setSStorageInfo("accountParam", JSON.stringify(accountParam));
        // 1.补全照片
        if(photoParam["needFront"]==1 || photoParam["needBack"]==1 || photoParam["needNohat"]==1)
        {
            appUtils.pageInit("account/phoneToukerRegister","account/backUploadPhoto",photoParam);
            return true;
        }
        // 2.驳回视频见证
        if(videoParam["need_video"]==1)
        {
            appUtils.pageInit("account/phoneToukerRegister","account/videoNotice",videoParam);
            return true;
        }
        // 3.驳回密码设置
        if(pwdParam["needBusinessPwd"]==1 || pwdParam["needFundPwd"]==1)
        {
            appUtils.pageInit("account/phoneToukerRegister","account/backSetPwd",pwdParam);
            return true;
        }
        // 4.驳回三方存管
        if(thirdParam["needThirdDeposit"]==1)
        {
            appUtils.pageInit("account/phoneToukerRegister","account/backThirdDepository",thirdParam);
            return true;
        }
        // 5.驳回开立账户
        if(accountParam["need_account"]==1){
            appUtils.pageInit("account/phoneToukerRegister","account/backSignProtocol",accountParam);
            return true;
        }
        else
        {
            return false;
        }
    }
    
    
    /* 下一步入口 */
	function nextStep(res, opacctkind_flag,tpbankFlg)
	{
		console.log("继续开户tpbankFlg="+tpbankFlg);
		var pageCode = "";
		var pageCodeTp1 = "";	//已绑定三方存管
		var pageCodeTp2 = "";	//已绑定三方支付
		var currentStep = res["lastcomplete_step"];  //断点：上次走的最后一步
		appUtils.setSStorageInfo("currentStep",currentStep);
		if(currentStep && currentStep.length > 0){
			var index;
			if(tpbankFlg == "1"){
				index = stepsTp1.indexOf(currentStep);
				if(index < (stepsTp1.length-1)){
					currentStep = stepsTp1[index + 1];
				}
			}else if(tpbankFlg == "2"){
				index = stepsTp2.indexOf(currentStep);
				if(index < (stepsTp2.length-1)){
					currentStep = stepsTp2[index + 1];
				}
			}else{
				index = steps.indexOf(currentStep);
				if(index < (steps.length-1)){
					currentStep = steps[index + 1];
				}
			}
			
			//新开户
			if(opacctkind_flag == "0")
			{
				pageCode = stepMap[currentStep];
				pageCodeTp1 = stepMapTp1[currentStep];
				pageCodeTp2 = stepMapTp2[currentStep];
			}
			else{
				pageCode = stepMap0[currentStep];
				if(!(pageCode && pageCode.length > 0))
				{
					pageCode = stepMap[currentStep];
				}
			}
			
		}
		if(pageCode && pageCode.length > 0)
		{
			// 如果是直接跳转到 视频认证 页面，将 QQ 保存到 session 中
			if(pageCode == "account/videoNotice")
			{
				appUtils.setSStorageInfo("qq",res.im_code);
			}
			//开通三方存管或者三方支付标志（1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	0：未绑定三方存管和三方支付）
			console.log("继续开户tpbankFlg="+tpbankFlg+" currentStep=" + currentStep +" pageCode=" + pageCode + " pageCodeTp1=" + pageCodeTp1 + " pageCodeTp2=" + pageCodeTp2);
			if(tpbankFlg == '1'){	//绑定了三方存管
				 appUtils.pageInit("account/phoneToukerRegister",pageCodeTp1,{});
			}else if(tpbankFlg == '2'){	//绑定了三方支付
				 appUtils.pageInit("account/phoneToukerRegister",pageCodeTp2,{});
			}else{ //未绑定三方存管和三方支付
			    appUtils.pageInit("account/phoneToukerRegister",pageCode,{});
			}
		}else
		{
			appUtils.pageInit("account/phoneToukerRegister", "account/selDepartment", {"backUrl": "account/phoneNumberVerify"});
		}
	}
    
    
    function destroy()
    {
        // 清除计时器
        if(startCountDown != null)
        {
            window.clearInterval(startCountDown);
        }
        if(startLoadCountDown != null)
        {
            window.clearInterval(startLoadCountDown);
        }
        if(backmsg == 1){
            $(_pageId+" .getmsg").show();  // 显示按钮
            $(_pageId+" .cert_notice").hide();  // 隐藏验证码已发出提示
            $(_pageId+" .time").hide();  // 隐藏倒计时
        }else{
            $(_pageId+" .getmsg").show();  // 显示按钮
            $(_pageId+" .cert_notice").hide();  // 隐藏验证码已发出提示
            $(_pageId+" .time").hide();  // 隐藏倒计时
            $(_pageId+" .pic_code").val("");  //清除手机号
            $(_pageId+" .mobileCode").val("");  // 清除验证码
        }
        $(_pageId+" .sendPhoneTip").html("");
        service.destroy();
    }

    var phoneToukerRegister = {
        "init" : init,
        "bindPageEvent" : bindPageEvent,
        "destroy" : destroy
    };

    //暴露接口
    module.exports = phoneToukerRegister;
});