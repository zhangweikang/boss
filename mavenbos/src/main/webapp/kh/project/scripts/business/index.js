/**
 * 手机开户3.0
 */
define("project/scripts/business/index",function(require, exports, module){
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        gconfig = require("gconfig"),
        global = gconfig.global,
        shellPlugin = require("shellPlugin"),
        utils = require("utils"),
        _pageId = "#business_index",
      
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
		//已绑定了三方存管的流程跳转
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
        window.getInput = utils.getInput;  // 暴露调用密码键盘给window
        window.onFinish = utils.onFinish;  // 暴露关闭密码键盘给window
        //处理页面返回问题
    	if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
			if(navigator.userAgent.indexOf("Android") > 0) {
				require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
			}
			if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
				window.location.href="backClientSide";
			}
		}
        
        // 自动测速，选择最佳地址
        // 启动时，检查当前客户端的版本号与服务器上最新的是否一致，根据需要更新客户端，只在启动时检查，started 为 true 表示已启动，已启动就不检查
        /*		if(appUtils.getSStorageInfo("started") != "true")
         {
         // 设置 session 中的 started 为 true ，表示已启动
         appUtils.setSStorageInfo("started","true");
         layerUtils.iLoading(true, "正在检查版本...");
         setBestAddress();  // 设置最佳地址
         }*/
        
        
        //非开户时间跳转到开户须知页面弹框提示
	    $.ajax({
	        type:'post',
	        url:global.serverToukerUrl+"/com.business.function.Function10000",
	        data:{ts:(new Date()).getTime()},
	        async: false,	//同步
	        cache:false,
	        dataType:'json',
	        success:function(data, resp, XMLHttpRequest){
	        	if(data.errorNo == 0){	//调用正常
	        		var errorMsg = data.errorMsg;	//0:开户时间     1:非开户时间
	        		if(errorMsg == "1"){	
	        			 appUtils.pageInit("business/index","account/openAccount",{});
	        			 return;
	        		}else{
	        			goProcess();
	        			
	        		}
	        	}
	        }
	    });
	    
	    
	    function goProcess(){
	        require("shellPlugin").callShellMethod("toukerServerPlugin",function(jsonresult){ // 获取移动端参数手机号、userId
	            console.info("jsonresult>>>>"+JSON.stringify(jsonresult));
	            if(jsonresult==null || jsonresult.phonenum==null || jsonresult.phonenum==""){
	            	//证券开户
	            	$(".m0_18_36_18")[0].style.display = 'block';
	            	return ;
	            }
           
           //var jsonresult;
           //jsonresult.phonenum = "15601904887";
           //jsonresult.phonenum = "15000977489";
           //console.log("jsonresult.phonenum="+jsonresult.phonenum);
            
            //设置ip地址  验证交易密码需要ip地址
            var mac = iBrowser.pc ? "02:00:5E:00:00:14" : "",
            ip = iBrowser.pc ? "192.168.1.109" : "";
	        // 只有当不是 pc 时，才调用壳子获取 ip 和 mac
	        if(!iBrowser.pc)
	        {
	            require("shellPlugin").callShellMethod("getIpMacPLugin",function(data){
	                data = data.split("|");
	                mac = data[0];
	                ip = data[1];
	                console.log("mac="+mac+"   ip="+ip);
	                appUtils.setSStorageInfo("ip",ip); // 将 ip 保存到 sessionStorage 里面
	                appUtils.setSStorageInfo("mac",mac); // 将 mac 保存到 sessionStorage 里面
	            },null);
	        }
            
            //钱钱炒股流程
            appUtils.setSStorageInfo("toukerOpenChannel","qianqian_app");// 设置开户的渠道 
	    	appUtils.setSStorageInfo("openChannel","new");//开户
            //从钱钱炒股跳过来的一定是已注册投客用户，这里主要是获取该客户的客户号
            var param = {
                "step" : "isToukerUser",
                "mobileNo" : jsonresult.phonenum
            };
            require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){ // 判断是否投客注册用户
                service.hbAjax(param,function(data){
                	appUtils.setSStorageInfo("mobileNo",jsonresult.phonenum);// 保存手机号码到缓存中
                    //钱钱过来的一定是已经注册过投客网用户    返回有 两种情形：未注册、系统异常  主要是获取客户号
                    if(data.errorNo==0 && data.errorMsg=="1"){
                    	//存储客户号（此时客户可能已经有了客户号）
                    	 var client_id = data.results.dataSet.client_id;
			        	 if(null != client_id){
			        	 	//console.log("client_id:"+client_id);
			        	 	appUtils.setSStorageInfo("khh",client_id);//将客户号号加入到缓存中 
			        	 }else{
		                   	appUtils.setSStorageInfo("khh","");	//清空客户号
			        	 }
                    	
                    	//获取短信验证码验证过程（为了绕开思迪的短信验证，后台只是生产验证码，但不真实的发送短信验证码，因为客户在钱钱已经登录过了）
                        var paramOpen = {
                            "step" : "qqAccess",
                            "channel" : "qianqian_app",
                            "mobileNo" : jsonresult.phonenum
                        };
                        require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){// 获取验证码
                            service.hbQianqianOpenAjax(param,function(data){
                                //{"errorMsg":"343341","errorNo":0,"results":{"dataSet":null}}
                                if(data.errorNo==0 && data.errorMsg.length >0){
                                    checkSmsCode(jsonresult.phonenum,data.errorMsg,client_id); // 思迪校验验证码 
                                }
                            });
                        },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(paramOpen)});
                    }else{  
                    	layerUtils.iMsg(-1,"系统异常，请稍后重试！");
                    }
                });
            },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(param)});
            
        },function(data){},{"command":"getUserInfo"});
	    }
         

    }

    /* 提交验证码校验 */
    function checkSmsCode(phoneNum,smsCode,khh)
    {
        var login_flag = "0";
		appUtils.setSStorageInfo("mobileNo",phoneNum);
		var paramCheck = {
            "mobile_no" : phoneNum,
            "mobile_code" :smsCode,
            "login_flag" : login_flag  // 登录业务标准，新开户0  转户1  理财户2
        };
       
        //思迪校验
        service.checkSmsCode(paramCheck,function(data){
        	console.log("入参:"+JSON.stringify(paramCheck)+"出参:"+JSON.stringify(data));
            var error_no = data.error_no;
            var error_info = data.error_info;
            var result = data.results;
            if(error_no == "0" && result.length != 0)
            {
            	 console.log("思迪调用完成");
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
                // 根据 opacctkind_flag 设置 session 中的 openChannel
                if(opacctkind_flag == 0)
                {
                    appUtils.setSStorageInfo("openChannel","new");
                }
                else
                {
                    if(opacctkind_flag == 2)
                    {
                        appUtils.setSStorageInfo("finance","finance");
                    }
                    appUtils.setSStorageInfo("openChannel","new");
                }
                
                 //华宝客户信息校验、关联
	        	 var param = {
		            "step" : "validateCustInfo",
		            "channel" : "qianqian_app",
		            "mobileNo" : phoneNum,
		            "khh" : khh,
		        };
            	require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){
		            service.hbAjax(param,function(data){
		                if(data.errorNo==0){
		                   var dataSet = data.results.dataSet;
		                   //开通三方存管或者三方支付标志（0：未绑定三方存管和三方支付     1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	）
		                   var tpbankFlg = dataSet.tpbankFlg;	
		                   var tpAddr = dataSet.tpAddr;		
		            	   appUtils.setSStorageInfo("tpbankFlg",tpbankFlg);	
		            	   appUtils.setSStorageInfo("tpAddr",tpAddr);	//重置交易密码地址(投客网或者网厅)
		                   
		                   //顶点保存的客户身份证号
		                   appUtils.setSStorageInfo("idnoDD",dataSet.idnoDD);
		                   //顶点保存的开户营业部
		                   var branchnoDD = dataSet.branch;
		                   //console.log("branchnoDD==="+branchnoDD);
		                   if(null != branchnoDD && "undefined" && branchnoDD && "" != branchnoDD){
		                   		//console.log("branchno222========="+appUtils.getSStorageInfo("branchno"));
                   		   		appUtils.setSStorageInfo("branchno",dataSet.branch);	//营业部
		                   }
		                   
		                   var message = data.errorMsg;	//根据message走不同的流程步骤
		                   appUtils.setSStorageInfo("message",message); 
	                       console.log("phoneCodeVerify-message_____________________________=" + message +"顶点身份证号=" + dataSet.idnoDD);
	                       
	                       if(message == '3'){	//身份证号不一致
	                       		appUtils.pageInit("business/index", "account/uploadPhoto", {"backUrl": "business/index"});
	                       }else if(message == '1' || message == '2'){	//已开出客户号、待审核
                               if(addition(result[0]))
                               {
                                   return false;
                               }
                               //未驳回，则正常走流程
                               else
                               {
                                   //layerUtils.iMsg(-1,"您的手机号已经开户过,请您输入新的手机号！");
                                   //return;
                                   appUtils.pageInit("account/phoneCodeVerify", "account/accountSuccess", {"backUrl": "account/phoneNumberVerify"});
                               }
	                       }else if(message == '4'){	//身份证影像在顶点已经存在
	                       		appUtils.setSStorageInfo("idCardImgExist",true);
	                       		//用顶点的身份证信息，覆盖思迪的信息（已存在客户号）
	                       		appUtils.setSStorageInfo("idCardNo",dataSet.idno);
	                       		appUtils.setSStorageInfo("custname",dataSet.custname);
	                       		appUtils.setSStorageInfo("policeorg",dataSet.policeorg);
	                       		appUtils.setSStorageInfo("native",dataSet.native);
	                       		appUtils.setSStorageInfo("addr",dataSet.native);
	                       		appUtils.setSStorageInfo("idbegindate",dataSet.idbegindate);
	                       		appUtils.setSStorageInfo("idenddate",dataSet.idenddate);
	                       		appUtils.setSStorageInfo("postid",dataSet.postid);
	                       		appUtils.setSStorageInfo("profession_code",dataSet.profession_code);
	                       		appUtils.setSStorageInfo("edu",dataSet.edu);
	                       		appUtils.pageInit("business/index", "account/personInfo", {"backUrl": "business/index"});
	                       }else{	//继续开户流程
		                       	//判断是否驳回，若驳回 则走驳回流程
								if(addition(result[0]))
								{
									return false;
								}
								//未驳回，则正常走流程
								else
								{
									nextStep(result[0], opacctkind_flag,tpbankFlg);
				                }
	                       }
		                }else{
		                    layerUtils.iMsg(-1,"系统异常！");
//		                    $(_pageId+" .fix_bot .ct_btn").removeClass("disable");
		                }
		            });
		        },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(param)});
            }else{
                layerUtils.iMsg(-1,"请输入正确的短信验证码！");
//                $(_pageId+" .fix_bot .ct_btn").removeClass("disable");
            }
        });
    }

    /* 下一步入口 */
    function nextStep(res, opacctkind_flag,tpbankFlg)
    {
    	console.log("继续开户tpbankFlg="+tpbankFlg);
		var pageCode = "";
		var pageCodeTp1 = "";	//已绑定三方存管
		var pageCodeTp2 = "";	//已绑定三方支付
		var currentStep = res["lastcomplete_step"];  //断点：上次走的最后一步
		//var lastStep = res["lastcomplete_step"];
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
				 appUtils.pageInit("account/phoneCodeVerify",pageCodeTp1,{"backUrl": "business/index"});
			}else if(tpbankFlg == '2'){	//绑定了三方支付
				 appUtils.pageInit("account/phoneCodeVerify",pageCodeTp2,{"backUrl": "business/index"});
			}else{ //未绑定三方存管和三方支付
			    appUtils.pageInit("account/phoneCodeVerify",pageCode,{"backUrl": "business/index"});
			}
		}else
		{
			console.log("钱钱炒股走新开户流程>>>>>>>>>>>");
            appUtils.pageInit("business/index", "account/openAccount", {"backUrl": "business/index"});
		}
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
            appUtils.pageInit("business/index","account/backUploadPhoto",photoParam);
            return true;
        }
        // 2.驳回视频见证
        if(videoParam["need_video"]==1)
        {
            appUtils.pageInit("business/index","account/videoNotice",videoParam);
            return true;
        }
        // 3.驳回密码设置
        if(pwdParam["needBusinessPwd"]==1 || pwdParam["needFundPwd"]==1)
        {
            appUtils.pageInit("business/index","account/backSetPwd",pwdParam);
            return true;
        }
        // 4.驳回三方存管
        if(thirdParam["needThirdDeposit"]==1)
        {
            appUtils.pageInit("business/index","account/backThirdDepository",thirdParam);
            return true;
        }
        // 5.驳回开立账户
        if(accountParam["need_account"]==1){
            appUtils.pageInit("business/index","account/backSignProtocol",accountParam);
            return true;
        }
        else
        {
            return false;
        }
    }

    function bindPageEvent(){
        //掌上开户
        appUtils.bindEvent($(_pageId+" #back"),function(){
        if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
				if(navigator.userAgent.indexOf("Android") > 0) {
						require("shellPlugin").callShellMethod("closeAppPlugin",null,null);  // 退出程序
				}
				if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)){
					window.location.href="backClientSide";
				}
			}else{
            appUtils.sendDirect("../m/index.html#!/business/login.html");
            require("shellPlugin").callShellMethod("changeStatusPlugin",null,null,{"flag":false});
			}
        });
        /* 绑定新开账户  */
        appUtils.bindEvent($(_pageId+" .m0_18_36_18 .text"),function(){
            // 设置标识'new',表示新开户,并且存到local
            appUtils.setSStorageInfo("openChannel","new");
            appUtils.pageInit("business/index","account/openAccount","business/index");
        });

        /* 绑定理财账户 */
        /*2014-7-17		appUtils.bindEvent($(_pageId+" .home_nav .open_finance"),function(){
         // 设置标识'new',表示新开户,并且存到local
         appUtils.setSStorageInfo("openChannel","change");
         appUtils.setSStorageInfo("finance","finance");
         appUtils.pageInit("business/index","account/msgVerify",{});
         });*/

        /* 绑定转户 */
        appUtils.bindEvent($(_pageId+" .m0_18 .text"),function(){
            // 设置标识'new',表示新开户,并且存到local
            appUtils.setSStorageInfo("openChannel","change");
            appUtils.pageInit("business/index","account/openAccount",{});
        });

        /* 切换蓝色风格 */
        /*2014-07-17		appUtils.bindEvent($(_pageId+" #blue"),function(){
         $(this).addClass("active").siblings(this).removeClass("active");
         loadCSS("#blue","../m/project/css/style.css");
         });*/

        /*切换黄色风格2014-07-17 */
        /*		appUtils.bindEvent($(_pageId+" #yellow"),function(){
         $(this).addClass("active").siblings(this).removeClass("active");
         loadCSS("#yellow","../m/project/css/style_pingan.css");
         });/*

        /* 切换黑色风格 */
        /*2014-07-17		appUtils.bindEvent($(_pageId+" #black"),function(){
         $(this).addClass("active").siblings(this).removeClass("active");
         });*/
    }

    function destroy(){}
    

    /* 动态加载css */
    function loadCSS(id, fileUrl)
    {
        var cssTag = document.getElementById(id),
            oHead = document.getElementsByTagName('head').item(0),
            ocss= document.createElement("link");
        if(id == "#blue")
        {
            oHead.removeChild(document.getElementById("#yellow"));
        }
        else
        {
            if (cssTag) oHead.removeChild(cssTag);
            ocss.id= id;
            ocss.href = fileUrl;
            ocss.rel = "stylesheet";
            ocss.charset= "uf-8";
            oHead.appendChild(ocss);
        }
    }


    /* 自动测速，选择最佳地址 */
    function setBestAddress()
    {
        // 在启动时，首先选择网速最优的地址,key 测试地址，value 服务地址
//		var addressMap = {
//				"119.145.1.145" : "119.145.1.155:8088",
//				"58.251.38.39" : "58.251.38.52:8088"
//			},
//			bestAddressParam = {
//				"urlArray" : ["119.145.1.145","58.251.38.39"]
//			};
//		shellPlugin.callShellMethod("speedServerPlugin",function(data){
//			// 取映射中的服务地址
//			var serverAddress = addressMap[data.urlArray[0]];
//			// 在壳子里面设置 serverPath 会影响全局，但是浏览器不行，因为浏览器有刷新功能
//			global.serverPath = "http://"+serverAddress+"/servlet/json";
//			global.serverPathTrade = "http://"+serverAddress+"/servlet/trade/json";
//			global.ticketImage = "http://"+serverAddress+"/servlet/Image";
//			queryVersAndAddr();  // 查询服务器上的版本号和下载地址
//		},null,bestAddressParam);

        queryVersAndAddr();  // 查询服务器上的版本号和下载地址
    }

    /* 查询服务器上的版本号和下载地址 */
    function queryVersAndAddr()
    {
        var queryParam = {
            "terminal_type" : gconfig.platform == "1" ? "android" : "ios"
        };
        service.getVersion(queryParam,function(data){
            if(data.error_no == 0)
            {
                layerUtils.iLoading(false);
                // 服务器有数据返回时
                if(data.results.length != 0 && data.results[0].update_url != undefined)
                {
                    execUpdate(data.results);  // 执行更新
                }
            }
            else  // 查询地址失败
            {
                layerUtils.iLoading(false);
                layerUtils.iAlert("版本检查失败，请稍后重试！");
            }
        },true,false);
    }

    // 执行更新
    function execUpdate(results)
    {
        var length = results.length,
            updateParam = {
                "url" : results[0].update_url,  // 更新地址
                "versionLatest" : results[0].version,  // 最新版本号
                // 只有一条记录取 0
                "versionLowest" : results[0].version == results[length-1].version ? "0" : results[length-1].version,
                "firstEnforcement" : results[0].enforcement  // 第一条记录是否是强制更新
            };
        shellPlugin.callShellMethod("updateManagerPlugin",null,function(){
            layerUtils.iAlert("调用版本更新插件失败！");
        },updateParam);
    }

    var index = {
        "init" : init,
        "bindPageEvent" : bindPageEvent,
        "destroy" : destroy
    };

    module.exports = index;
});