/**
 * 签署协议
 */
define("project/scripts/account/backSignProtocol",function(require, exports, module){ 
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
	    service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		global = require("gconfig").global,
		layerUtils = require("layerUtils"),
		utils = require("utils"),
		Map = require("map"),
		fristMap = null,  //  存放所有相关协议
	    protocolArray = new Array(),  // 存放协议签名值
		isClose = true,  // 用于控制等待层
		countProtocol = 0, // 计算签署成功的数量
		userId = appUtils.getSStorageInfo("user_id"),
	    cert_type = appUtils.getSStorageInfo("openChannel") == "new" ? "zd" : "tw", // tw:天威 zd:中登
	    _pageId = "#account_backSignProtocol";
	/* 私有业务模块的全局变量 end */
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		initPage();  // 初始化页面
		checkCert();  //检测证书是否存在
	}
	
	function bindPageEvent()
	{
		/* 隐藏按钮*/
		appUtils.bindEvent($(_pageId),function(e){
			$(_pageId+" .btn_bot").hide();
		});
		
		/* 绑定签署协议*/
		appUtils.bindEvent($(_pageId+" .rule_check01 .icon_check"),function(){
			$(this).toggleClass("checked"); //  切换勾选样式
		});
		
		/* 继续开户（下一步）*/
		appUtils.bindEvent($(_pageId+" .fix_bot .ct_btn a"),function(){
			getSignProtocl();  // 获取签名值并验签
		});
	}
	
	function destroy()
	{
		service.destroy();
	}
	
	/* 初始化页面 */
	function initPage()
	{
		layerUtils.iLoading(true);  // 开启等待层。。。
		isClose = true;
		if(appUtils.getSStorageInfo("openChannel") == "change")
		{
			if(appUtils.getSStorageInfo("finance") == "finance")
			{
				$(_pageId+" .fix_bot .ct_btn a").html("下一步 >");  // 理财户
			}
			else
			{
				$(_pageId+" .fix_bot .ct_btn a").html("下一步 >");  // 转户
			}
		}
		else
		{
			$(_pageId+" .fix_bot .ct_btn a").html("下一步 >");  // 开户
		}
	}
	
	/* 检测是否安装证书 */
	function checkCert()
	{
		//本页面需要用到证书，如果进入本页面时，证书不存在就下载并安装证书
		var existsParam = {
			"userId" : userId,
			"mediaid" : "certificate",
			"type" : cert_type
		};
		require("shellPlugin").callShellMethod("fileIsExistsPlugin",function(data){
			// 如果未检测到本地有证书，就安装证书
			if(data.mediaId == "")
			{
				utils.installCertificate(getMarket);  // 下载安装证书，并且显示证券账户和协议
			}
			else
			{
		    	getMarket();  // 显示证券账户和协议
			}
		},function(){
			layerUtils.iLoading(false);  // 关闭等待层。。。
		},existsParam);
	}
	
	/* 获取市场列表 */
	function getMarket()
	{
		// 获取开通证券账户枚举
		var allOpenAccountStr = ""; 
		service.queryDataDict({"enum_type" : "zqzhlx"},function(data){
			if(data.error_no == 0 && data.results.length != 0)
			{
				var openAccountEnum = data.results;
				for(var i = 0;i<openAccountEnum.length;i++)
				{
                      if(openAccountEnum[i].item_name == "深A") {
                      allOpenAccountStr += "<li><a href=\"javascript:;\" class=\"icon_radio checked\" id=\"selectAccount0"+i+
                      "\" value=\""+openAccountEnum[i].item_value+"\">"+openAccountEnum[i].item_name+"</a></li>";
                      }else if(openAccountEnum[i].item_name == "沪A"){
                      allOpenAccountStr += "<li><a href=\"javascript:;\" class=\"icon_radio checked\" id=\"selectAccount0"+i+
                      "\" value=\""+openAccountEnum[i].item_value+"\">"+openAccountEnum[i].item_name+"</a></li>";
                      }else{
                      allOpenAccountStr += "<li><a href=\"javascript:;\" class=\"icon_radio\" id=\"selectAccount0"+i+
                      "\" value=\""+openAccountEnum[i].item_value+"\">"+openAccountEnum[i].item_name+"</a></li>";
                      }
				}
				$(_pageId+" .radio_list ul").html(allOpenAccountStr);  // 填充 开通证券账户
				initSelcet();  // 初始化证券账户的选择
			}
			else
			{
				layerUtils.iLoading(false);  // 关闭等待层。。。
				layerUtils.iAlert(data.error_info);
			}
		},false,true,handleTimeout);
	
	
	
	
	/*
		// 获取开通证券账户枚举
		var allOpenAccountStr = ""; 
		service.queryDataDict({"enum_type" : "zqzhlx"},function(data){
			if(data.error_no == 0 && data.results.length != 0)
			{
				var openAccountEnum = data.results;
				for(var i = 0;i<openAccountEnum.length;i++)
				{
					allOpenAccountStr += "<li><a href=\"javascript:;\" class=\"icon_radio\" id=\"selectAccount0"+i+
						"\" value=\""+openAccountEnum[i].item_value+"\">"+openAccountEnum[i].item_name+"</a></li>";
				}
				$(_pageId+" .radio_list ul").html(allOpenAccountStr);  // 填充 开通证券账户
				initSelcet();  // 初始化证券账户的选择
			}
			else
			{
				layerUtils.iLoading(false);  // 关闭等待层。。。
				layerUtils.iAlert(data.error_info);
			}
		},false,true,handleTimeout);
		*/
	}
	
	/* 默认所有的账号都开通 */
	function initSelcet()
	{
		// 删除深B、沪B
		$(_pageId+" .radio_list ul li a[value='2']").parent().remove();  
		$(_pageId+" .radio_list ul li a[value='4']").parent().remove();
		// 账号绑定提醒事件，数据填充完毕才绑定事件
		appUtils.bindEvent($(_pageId+" .radio_list ul li a"),function(e){
			confrimOpenAccount($(this));
			e.stopPropagation();
		});
		// 新开户默认开所有的股东账户
		if(appUtils.getSStorageInfo("openChannel") == "new")
		{
			getAgreement();  // 获取协议
		}
		// 转户需要查询原有的股东账户
		else if(appUtils.getSStorageInfo("openChannel") == "change")
		{
			// 转户删除基金
			//$(_pageId+" .radio_list ul li a[value='5']").parent().remove();  
			//$(_pageId+" .radio_list ul li a[value='6']").parent().remove();
			// 转户选中查询出来的证券账户
			var lookAccountParam = {"user_id" : appUtils.getSStorageInfo("user_id")};
			service.queryUserInfoExistCompy(lookAccountParam,function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				// 调接口成功，选中开过的证券账户
			    if(error_no == 0 && data.result)
				{
					// stkbd 交易板块 0 深A；1 沪A；4 深基金；5  沪基金
					for(var i=0,len=data.results.length;i<len;i++)
					{
						switch(Number(data.results[i].stkbd))
						{
							case 0 :   // 深 A
								$(_pageId+" .radio_list ul li a[value='1']").addClass("checked");
								$(_pageId+" .radio_list ul li a[value='1']").attr("trdacct",data.results[i].trdacct);
								break;
	 						case 1 :   // 沪 A
								$(_pageId+" .radio_list ul li a[value='3']").addClass("checked");
								$(_pageId+" .radio_list ul li a[value='3']").attr("trdacct",data.results[i].trdacct);
								break;
						}
					}
				}
				else
				{
					layerUtils.iLoading(false);  // 关闭等待层。。。
 					$(_pageId+" .radio_list ul li a").addClass("checked");  //接口调用失败，则全选
				}
				getAgreement();  // 获取协议
			},false,true,handleTimeout);
		}
	}
	
	/* 获取协议 */
	function getAgreement()
	{
		// category_no 1.资金开户协议   2.证券账户开户协议
		service.queryProtocolList({"category_no":"1"},function(data){
			if(data.error_no == 0 && data.results.length != 0)
			{
				fristMap = new Map();
				var results = data.results,
					  allProtocols = "";
				var protocolMap = null;
				for(var i=0;i<results.length;i++)
				{
					protocolMap = new Map();
					protocolMap.put("protocolid",results[i].econtract_no);	//协议id
					protocolMap.put("protocolname",results[i].econtract_name);	//协议名
					protocolMap.put("summary",results[i].econtract_md5);	//协议内容MD5,签名摘要信息
					allProtocols += "<li><a href=\"javascript:;\" protocol-id=\""+results[i].econtract_no+"\" id=\"protocol0"+i+"\">《"+
						results[i].econtract_name+"》</a></li>";
					// 预绑定查看协议的事件
					appUtils.preBindEvent($(_pageId+" .rule_list ul"),"#protocol0"+i,function(e){
						appUtils.pageInit("account/signProtocol","account/showProtocol",{"protocol_id" : $(this).attr("protocol-id")});
						e.stopPropagation();
					});
					fristMap.put(i,protocolMap);
				}
				$(_pageId+" .rule_list ul").html(allProtocols);
			}
			else
			{
				layerUtils.iLoading(false);  // 关闭等待层。。。
				layerUtils.iAlert(data.error_info);
			}
		},true,true,handleTimeout);
	}
	
	/* 处理请求超时 */
	function handleTimeout()
	{
		layerUtils.iConfirm("请求超时，是否重新加载？",function(){
			getMarket();  // 再次获取市场代码和协议
		});
	}
	
	/* 提示用户若不开通某账号将影响正常交易 */
	function confrimOpenAccount(obj)
	{
		if($(obj).hasClass("checked"))
		{
			var accountName = $(obj).html();
			$(_pageId+" .btn_bot h5").html("确定取消开立\""+accountName+"\"账户？");
			$(_pageId+" .btn_bot p").html("不开通\""+accountName+"\"账户，将影响您该项正常交易<br>请您慎重选择");
			$(_pageId+" .btn_bot").show()
			// 确定取消
			appUtils.bindEvent($(_pageId+" .btn_box a:eq(0)"),function(e){
				$(obj).removeClass("checked");
				$(_pageId+" .btn_bot").hide();
				e.stopPropagation();
			});
			// 继续开立
			appUtils.bindEvent($(_pageId+" .btn_box a:eq(1)"),function(e){
				$(_pageId+" .btn_bot").hide();
				e.stopPropagation();
			});
		}
		else
		{
			
			if($(obj).text()=="深基金"){
				
				$(_pageId+" .radio_list:eq(0) ul li a[value='5']").addClass("checked");
				//$(_pageId+" .radio_list:eq(0) ul li a[value='6']").removeClass("checked");
				$(_pageId+" .radio_list:eq(0) ul li a[value='1']").removeClass("checked");
				
			}else if($(obj).text()=="沪基金"){
				
			    $(_pageId+" .radio_list:eq(0) ul li a[value='6']").addClass("checked");
				//$(_pageId+" .radio_list:eq(0) ul li a[value='5']").removeClass("checked");
				$(_pageId+" .radio_list:eq(0) ul li a[value='3']").removeClass("checked");
				
			}else if($(obj).text()=="深A"){
				
			    $(_pageId+" .radio_list:eq(0) ul li a[value='1']").addClass("checked");
				$(_pageId+" .radio_list:eq(0) ul li a[value='5']").removeClass("checked");
			}else if($(obj).text()=="沪A"){
				
				$(_pageId+" .radio_list:eq(0) ul li a[value='3']").addClass("checked");
				$(_pageId+" .radio_list:eq(0) ul li a[value='6']").removeClass("checked");
			}else{
				$(obj).addClass("checked");  // 选中当前开通账户
			}	
			
		}
	}
	
	/* 获取签名值 */
	function getSignProtocl()
	{
		var keys = fristMap.keys();  // 协议的数量
		// 检查是否勾选开通的账户
		if(!$(_pageId+" .radio_list a").hasClass("checked")){
			layerUtils.iMsg(-1,"请选择需开通的账户！");
			return false;
		}
		// 检查是否勾选签署协议
		if($(_pageId+" .rule_check01 a").hasClass("checked"))
		{
			layerUtils.iLoading(true);  // 开启等待层。。。
			var oneData  = fristMap.get(keys[countProtocol]); // 取出一个协议
			var protocolid = oneData.get("protocolid"); // 协议ID
			var protocolname = oneData.get("protocolname");  //协议名称
			var summary = oneData.get("summary");  // 协议内容MD5,签名摘要信息
			var signParam = {
				"medid":protocolid,
				"content":summary,
				"userId":userId,
				"type": cert_type
			};
			// 获取协议的数字签名值
			require("shellPlugin").callShellMethod("signPlugin",function(data){
				var protocoldcsign = data.ciphertext;  // 数字签名值
				// 添加值到数组中
				var protocol = {
					"protocol_id" : protocolid,
					"protocol_dcsign" : protocoldcsign,
					"summary" : summary
				};
				protocolArray.push(protocol);
				countProtocol++;
				if(countProtocol < keys.length)  // 通过比较，获取每个协议的签名值
				{
					getSignProtocl();  
				}
				else  // 获取完每个签名值后 进行验签
				{
					startSign();  
				}
			},function(){
				layerUtils.iLoading(false);  // 关闭等待层
				countProtocol = 0;  // 将签署协议的计数器置为 0
			},signParam);
		}
		else
		{
			layerUtils.iMsg(-1,"请阅读并勾选同意签署以上全部协议！");
			return false;
		}
	}
	
	/* 发请求进行协议验签 */
	function startSign()
	{
		countProtocol = 0;  // 将签署协议的计数器置为 0
		var signProtocolParam = {
			"user_id" : userId,
			"jsondata" : JSON.stringify(protocolArray),
			"ipaddr" : appUtils.getSStorageInfo("ip"),
			"macaddr" : appUtils.getSStorageInfo("mac")
		};
		// 新开中登验签
		if(appUtils.getSStorageInfo("openChannel") == "new")
		{
			service.queryOpenCheckSign(signProtocolParam,callSign,false);
		}
		// 转户天威验签
		else if(appUtils.getSStorageInfo("openChannel") == "change")
		{
			service.queryOpenCheckTsign(signProtocolParam,callSign,false);
		}
	}
	
	/* 验签回调函数*/
	function callSign(data)
	{
		// 如果有一个协议签署失败，就将签署结果设为 false
	    if(data.error_no == 0)
		{
			openZjAccountAndClient();	//开立账户系统客户号和资金账户
		}
	    else
	    {
			layerUtils.iLoading(false);  // 关闭等待层。。。
			layerUtils.iAlert(data.error_info,-1);
	    }
	}
	
	/* 开立账户系统客户号和资金账户 */
	function openZjAccountAndClient()
	{
		//开立账户系统客户号和资金账户
		var param = {
			"user_id" : appUtils.getSStorageInfo("user_id")
		};
		service.queryOpenAccount(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == 0)	//调用成功
			{
				// 开立中登账户
				var openStockParam = {
					"user_id" : appUtils.getSStorageInfo("user_id"),
					"sza_str" : "",  // 深A开通情况，不开传空 ，新开 1 ，转户 2
					"sha_str" : "",  //沪A开通情况
					"szfnd_str" : "",  // 深基金开通情况
					"shfnd_str" : "",  // 沪基金开通情况
					"opfnd_str" : ""  // 通用开发试基金
				};
				// 深 A 的开通状况
				if($(_pageId+" .radio_list ul li a[value='1']").hasClass("checked"))
				{
					openStockParam.sza_str = appUtils.getSStorageInfo("openChannel") == "new" ? "1" : "2|";
					if($(_pageId+" .radio_list ul li a[value='1']").attr("trdacct"))
					{
						openStockParam.sza_str += $(_pageId+" .radio_list ul li a[value='1']").attr("trdacct");
					}
				}
				// 沪 A 的开通状况
				if($(_pageId+" .radio_list ul li a[value='3']").hasClass("checked"))
				{
					openStockParam.sha_str = appUtils.getSStorageInfo("openChannel") == "new" ? "1" : "2|";
					if($(_pageId+" .radio_list ul li a[value='3']").attr("trdacct"))
					{
						openStockParam.sha_str += $(_pageId+" .radio_list ul li a[value='3']").attr("trdacct");
					}
				}
				// 新开户才有基金，转户只有 A 股
				if(appUtils.getSStorageInfo("openChannel") == "new"||appUtils.getSStorageInfo("openChannel") == "change")
				{
					// 深基金的开通状况
					if($(_pageId+" .radio_list ul li a[value='5']").hasClass("checked"))
					{
						openStockParam.opfnd_str = "1|98"+",";
					}
					// 沪基金的开通状况
					if($(_pageId+" .radio_list ul li a[value='6']").hasClass("checked"))
					{
						openStockParam.opfnd_str = "1|99";
					}
				}
				//开立中登股东账号
				service.queryOpenCompyAccount(openStockParam,function(data){
					if(data.error_no == 0)
					{
						// 标志驳回已被修改
						var notifyParam = {
							"userid" : appUtils.getSStorageInfo("user_id"),
							"fieldname" : "account"  // 通知开股东卡已补全
						};
						service.rejectStep(notifyParam,function(data){
							if(data.error_no == 0)
							{
								//cleanPageElement();  // 清理页面元素
								appUtils.setSStorageInfo("isBack", "backInfo");  //标志重新提交资料成功
								var pwdParam = appUtils.getSStorageInfo("pwdParam");
								var thirdParam = appUtils.getSStorageInfo("thirdParam");
								if(pwdParam != null)
								{
									pwdParam = JSON.parse(pwdParam);
								}
								if(thirdParam != null)
								{
									thirdParam = JSON.parse(thirdParam);
								}
								// 需要驳回资金或交易密码
								if(pwdParam.needBusinessPwd ==1 || pwdParam.needFundPwd == 1)
								{
									appUtils.pageInit("account/backSignProtocol","account/backSetPwd",pwdParam);  //跳转设置密码页面
								}
								// 需要驳回到三方存管
								else if(thirdParam.needThirdDeposit == 1)  
								{
									appUtils.pageInit("account/backSignProtocol","account/backThirdDepository",thirdParam);  //跳转三方存管
								}
								else
								{
									appUtils.pageInit("account/backSignProtocol","account/accountSuccess",{});
								}
							}
							else 
							{
								layerUtils.iAlert(data.error_info,-1);
							}
						},false);
					}
					else
					{
						layerUtils.iLoading(false);
						layerUtils.iAlert(data.error_info,-1);
					}
				},false);
			}
			else
			{
				layerUtils.iLoading(false);
				layerUtils.iAlert(error_info,-1);
			}
		},false);
	}
	
	/* 清理界面元素 */
	function cleanPageElement()
	{
		$(_pageId+" .radio_list ul li").remove();  // 清理证券账户
		$(_pageId+" .rule_list ul li").remove();  // 清理协议
	}
	
	var backSignProtocol = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	module.exports = backSignProtocol;
});