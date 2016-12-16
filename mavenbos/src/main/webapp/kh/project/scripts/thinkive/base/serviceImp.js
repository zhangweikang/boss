/**
 * 非现场手机开户前端service层调用接口
 * */
define(function(require,exports,module){
	var $ = jQuery = require('jquery');
	var appUtils = require("appUtils"),
	global = require("gconfig").global,
	layerUtils = require("layerUtils"), // 弹出层对象
	mobileService = "project/scripts/thinkive/service/mobileService";
	
	function MobileService(){
		this.serviceMap = {};
	}
	
	/***应用接口......................................................开始*/
	
	/**
	 * 华宝证券ajax请求封装
	 * @param param 加密签名后的参数
	 * @param successCallback 成功回调函数
	 */
	MobileService.prototype.hbAjax = function(param,successCallback)
	{
	    console.log("请求url:"+global.serverToukerUrl+"/com.clientIdSynch.action.ClientIdSynchAction?"+param);
	    $.ajax({
	        type:'post',
	        url:global.serverToukerUrl+"/com.clientIdSynch.action.ClientIdSynchAction?"+param,
	        data:{ts:(new Date()).getTime()},
	        cache:false,
	        dataType:'json',
	        success:function(data, resp, XMLHttpRequest){
	        	console.log("请求出参："+JSON.stringify(data));
	        	successCallback(data);
	        },
	        error:function(){
	            layerUtils.iMsg(-1,"网络异常，请稍后再试！");
	        }
	    });
	};
	
	/**
	 * 钱钱炒股开户ajax请求封装
	 * @param param 加密签名后的参数
	 * @param successCallback 成功回调函数
	 */
	MobileService.prototype.hbQianqianOpenAjax = function(param,successCallback)
	{
	    console.log("请求url:"+global.serverToukerUrl+"/com.clientIdSynch.action.qqStockOpenAccAction?"+param);
	    $.ajax({
	        type:'post',
	        url:global.serverToukerUrl+"/com.clientIdSynch.action.qqStockOpenAccAction?"+param,
	        data:{ts:(new Date()).getTime()},
	        cache:false,
	        dataType:'json',
	        success:function(data, resp, XMLHttpRequest){
	        	console.log("请求出参："+JSON.stringify(data));
	        	successCallback(data);
	        },
	        error:function(){
	            layerUtils.iMsg(-1,"网络异常，请稍后再试！");
	        }
	    });
	};
     
	/**
	 * 短信验证码发送(501520)
	 * @param op_way 访问接口来源标识(0：pc,2：pad,3：手机)
	 * @param mobile_no 手机号码
	 * @param ip 客户IP地址
	 * @param mac 设备mac地址
	 * @param callback 回调函数
	 */
	MobileService.prototype.getSmsCode = function(param,callback,isLastReq,isShowWait,timeOutFunc)
     {
		var service = this.serviceMap[mobileService];
		if(service){
			service.getSmsCode(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.getSmsCode(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
     };
	
     
 	/**
 	 * 登录短信验证码校验(501521)
 	 * @param mobile_no 手机号码
 	 * @param mobile_code 手机验证码
 	 * @param login_flag 登录业务标准
 	 * @param callback 回调函数
 	 */
	MobileService.prototype.checkSmsCode = function(param,callback,isLastReq,isShowWait,timeOutFunc)
      {
		var service = this.serviceMap[mobileService];
		if(service){
			service.checkSmsCode(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.checkSmsCode(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
      };     
     
     
   	/**
   	 * 查询营业部数据(501503)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryBranch = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryBranch(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryBranch(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };     
      
    
   	/**
   	 * 获取数字证书申请责任书协议信息
   	 * @param cert_flag 1中登协议，2自建证书协议,默认中登
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryCertAgreement = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryCertAgreement(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryCertAgreement(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
   	/**
   	 * 获取邮编信息
   	 * @param addr 地址
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryPostid = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryPostid(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryPostid(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    /**
   	 * 流程更改
   	 * @param user_id 用户编号 
   	 * @param uploadimg_flag 1：身份证上次成功
   	 * @param opacctkind_flag 0：新开，1：转户
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryChangeState = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryChangeState(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryChangeState(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    /**
   	 * 查询用户信息
   	 * @param user_id 用户编号 
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryUserInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryUserInfo(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryUserInfo(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
   	/**
   	 * 获取数据字典
   	 * @param enum_type "occupational"为职业,"adapter"为学历,"zqzhlx"为开通证券类型
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryDataDict = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryDataDict(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryDataDict(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    
   	/**
   	 * 开户信息资料提交 (501528)
   	 * @param user_id            客户编号
   	 * @param infocolect_channel 信息来源渠道( 0：pc，2：pad，3：手机)
   	 * @param idtype             证件类别(00 身份证)
   	 * @param idno               身份证号
   	 * @param custname           客户姓名
   	 * @param birthday           生日
   	 * @param idbegindate        证件开始日期
   	 * @param idenddate          证件结束日期
   	 * @param native             证件地址
   	 * @param policeorg          签发机关
   	 * @param usersex            性别(0男，1女)
   	 * @param nationality        国籍(156) 
   	 * @param addr               联系地址 
   	 * @param postid             邮政编码
   	 * @param edu                学历代码
   	 * @param profession_code    职业代码
   	 * @param branchno           营业部代码 
   	 * @param provinceno         省份
   	 * @param cityno             城市
   	 * @param ipaddr             IP地址
   	 * @param macaddr            mac地址
   	 * @param callback           回调函数
   	 */
	MobileService.prototype.submitUserInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.submitUserInfo(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.submitUserInfo(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    
   	/**
   	 * 账户系统存在性查询(501527)
   	 * @param idtype 证件类型
   	 * @param idno   身份证号码
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryUserInfoExistSys = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryUserInfoExistSys(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryUserInfoExistSys(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
   	/**
   	 *  中登查询股东账号是否存在(501553)
   	 * @param user_id 用户ID
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryUserInfoExistCompy = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryUserInfoExistCompy(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryUserInfoExistCompy(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
   	/**
   	 *  转户模拟QQ视频通过同步用户信息专用 (501599)
   	 * @param user_id 用户ID
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.syncQQUserInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.syncQQUserInfo(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.syncQQUserInfo(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
   	/**
   	 *  查询离线视频通过状态查询 (501546)
   	 * @param user_id 用户ID
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryQQOfflineState = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryQQOfflineState(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryQQOfflineState(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
 
   	/**
   	 * 获取数字证书申请责任书协议信息 (501523)
   	 * @param cert_flag 1中登协议，2自建证书协议
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryAgreementTitle = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryAgreementTitle(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryAgreementTitle(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
   
   	/**
   	 * 中登证书获取（501529）
   	 * @param user_id 客户编号
   	 * @param pkcs10  证书申请串(由手机壳子生成)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryCompyCart = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryCompyCart(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryCompyCart(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
  
   	/**
   	 * 自建证书获取，天威（501530）
   	 * @param user_id 客户编号
   	 * @param pkcs10  证书申请串(由手机壳子生成)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryMyselfCart = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryMyselfCart(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryMyselfCart(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
   	/**
   	 *  开户协议列表获取(501531)--证书下载界面
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenAgreement = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryOpenAgreement(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryOpenAgreement(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    /**
   	 * 开立资金账户与客户号(501533)
   	 * @param user_id 客户编号
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenAccount = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryOpenAccount(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryOpenAccount(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
   	/**
   	 * 开立中登账户(501534)
   	 * @param user_id 客户编号
   	 * @param sza_str 深A开通情况
   	 * @param sha_str 沪A开通情况
   	 * @param szfnd_str 深基金开通情况
   	 * @param shfnd_str 沪基金开通情况
   	 * @param opfnd_str 沪基金开通情况
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenCompyAccount = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryOpenCompyAccount(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryOpenCompyAccount(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    
   	/**
   	 * 中登签名批量验签（MD5方式）(501554)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenCheckSign = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryOpenCheckSign(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryOpenCheckSign(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    /**
   	 * 天威签名批量验签（MD5方式）(501555)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenCheckTsign = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryOpenCheckTsign(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryOpenCheckTsign(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    
   	/**
   	 * 查询协议内容 (501524)
   	 * @param protocol_id 协议ID
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryProtocolText = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryProtocolText(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryProtocolText(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    
   	/**
   	 * 设置交易密码和资金密码(501535)
   	 * @param user_id        用户编号
   	 * @param acct_clientid  账户系统客户号
   	 * @param password  密码
   	 * @param pwd_type  密码类型(1:资金密码 2:交易密码)
   	 * @param is_same  资金密码和交易密码是否一致(1:一致 0：不同)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.setAccountPwd = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.setAccountPwd(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.setAccountPwd(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    
   	/**
   	 * 查询存管银行信息列表(501536)
   	 * @param user_id     用户编号
   	 * @param zzbindtype  自助绑定方式(1一步式，2预指定)
   	 * @param zzispwd     自助一步式绑定是否需要密码(1需要，0不需要)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryBankList = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryBankList(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryBankList(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    
   	/**
   	 * 存管银行签约电子协议列表(501537)
   	 * @param user_id     用户编号
   	 * @param bankcode    银行代码
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.queryBankProtocolList = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryBankProtocolList(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryBankProtocolList(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    
   	/**
   	 * 存管银行绑定(501538)
   	 * @param user_id          用户编号
   	 * @param acct_clientid    账户系统客户号
   	 * @param acct_fndacct     账户系统资金账号
   	 * @param bank_code	       银行代码
   	 * @param bank_account     银行账号
   	 * @param bank_pwd         银行密码
   	 * @param acct_clientid    存管绑定方式
   	 * @param op_type          账户系统客户号(自助绑定方式：1一步式，2预指定)
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.bindBank = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.bindBank(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.bindBank(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };   
    
    
   	/**
   	 * 驳回后修改资料 (501561)
   	 * @param user_id     用户编号
   	 * @param fieldname   驳回步骤(zj_pwd资金密码、trade_pwd交易密码、bind_bank三方存管、photo图片、workflowagain重新走流程、opacctkind_flag开户流程业务类型)
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.rejectStep = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.rejectStep(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.rejectStep(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };   
    
  
   	/**
   	 * 查询风险评测题库(501539)
   	 * @param user_id     用户编号
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.queryRiskToc = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryRiskToc(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryRiskToc(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };  
    
    
   	/**
   	 * 获取视频地址 (501562)
   	 * @param user_id     用户编号
   	 * @param sub_id      问卷编号
   	 * @param q_a_args    问卷答题字符串
   	 * @param sub_id      问卷编号
   	 * 
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.queryVideoAddress = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryVideoAddress(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryVideoAddress(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };   
    
    
   	/**
   	 * 提交视频见证预约信息(501545)
   	 * @param user_id     用户编号
   	 * @param qq          QQ号码
   	 * @param deal_date   预约处理日期
   	 * @param deal_time   预约处理时间
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.submitQQApplay = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.submitQQApplay(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.submitQQApplay(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };   
    
    
   	/**
   	 * 获取回访问卷(501541)
   	 * @param user_id     用户编号
   	 * @param qq          QQ号码
   	 * @param sub_id       
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.getVisitSub = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.getVisitSub(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.getVisitSub(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };   
    
    
   	/**
   	 * 提交问卷回访答案(501542)
   	 * @param user_id     用户编号
   	 * @param sub_id      回访问卷编号
   	 * @param q_a_args    问卷答题字符串
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.submitVisitAnswer = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.submitVisitAnswer(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.submitVisitAnswer(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };   
    
   	/**
   	 * 提交风险评测答案(501540)
   	 * @param user_id     用户编号
   	 * @param sub_id      回访问卷编号
   	 * @param q_a_args    问卷答题字符串
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.submitTestAnswer = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.submitTestAnswer(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.submitTestAnswer(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };   
    
    /**
   	 *	查询电子协议列表(501558)
   	 * @param category_englishname 电子协议英文名
   	 * @param category_no 类别编号
   	 * @param econtract_no 协议编号
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryProtocolList = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.queryProtocolList(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.queryProtocolList(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };
    
    /**
   	 *	查询电子协议内容(501559)
   	 * @param econtract_no 电子协议编号
   	 * @param econtract_version 电子协议版本
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getProtocolInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.getProtocolInfo(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.getProtocolInfo(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };
    
    /**
   	 *	移动客户端版本检测 (501560)
   	 * @param terminal_type 客户端类型
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getVersion = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.getVersion(param,callback,isLastReq,isShowWait,timeOutFunc,dataType);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.getVersion(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };
    
    /**
   	 * 获取当前省份、城市（501568）
   	 * @param ip  ip地址
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getProvCity = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.getProvCity(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.getProvCity(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };
    
    /**
   	 * 身份证信息提交 (501569)
   	 * @param user_id            客户编号
   	 * @param infocolect_channel 信息来源渠道( 0：pc，2：pad，3：手机)
   	 * @param idtype             证件类别(00 身份证)
   	 * @param idno               身份证号
   	 * @param custname           客户姓名
   	 * @param birthday           生日
   	 * @param idbegindate        证件开始日期
   	 * @param idenddate          证件结束日期
   	 * @param native             证件地址
   	 * @param policeorg          签发机关
   	 * @param usersex            性别(0男，1女)
   	 * @param nationality        国籍(156) 
   	 * @param addr               联系地址 
   	 * @param postid             邮政编码
   	 * @param edu                学历代码
   	 * @param profession_code    职业代码
   	 * @param branchno           营业部代码 
   	 * @param provinceno         省份
   	 * @param cityno             城市
   	 * @param ipaddr             IP地址
   	 * @param macaddr            mac地址
   	 * @param callback           回调函数
   	 */
	MobileService.prototype.submitPhoto = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.submitPhoto(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.submitPhoto(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    }; 
    
    /**
   	 * 获取rsa加密模块和公钥
   	 * @param param  参数
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getRSAKey = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.getRSAKey(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.getRSAKey(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };
    
    
   /**
   	 * 获取视频见证时间的标识[501500]
   	 * 返回istradetime  为1  就是在这个时间内  0 就不再这个时间内
   	 * @param param  参数
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getIstradetime = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var service = this.serviceMap[mobileService];
		if(service){
			service.getIstradetime(param,callback,isLastReq,isShowWait,timeOutFunc);
		}else{
			var This = this;
			require.async(mobileService,function(module){
				if(module){
					service = module.getInstance();
					This.serviceMap[mobileService] = service;
					service.getIstradetime(param,callback,isLastReq,isShowWait,timeOutFunc);
				}else{
					alert("服务层，js模块类["+mobileService+"]不存在!");
				}
			});
		}
    };
	/***应用接口......................................................结束*/
	
	/**
	 * 释放操作
	 */
    MobileService.prototype.destroy = function(){
		for(var key in this.serviceMap){
			var service = this.serviceMap[key];
			service.destroy();
			delete this.serviceMap[key];
		}
		this.serviceMap = {};                          
	};
	
	function getInstance(){
		return new MobileService();
	}
	
	var service = {
		"getInstance" : getInstance
	};
	
	// 暴露对外的接口
	module.exports = service;
});