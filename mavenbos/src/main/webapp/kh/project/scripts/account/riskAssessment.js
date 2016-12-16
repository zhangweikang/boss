/**
* 风险测评
*/
define("project/scripts/account/riskAssessment",function(require,exports,module){
	/* 私有业务模块的全局变量 begin */
	var appUtils = require("appUtils"),
		  service = require("serviceImp").getInstance(),  //业务层接口，请求数据
		  global = require("gconfig").global,
		  layerUtils = require("layerUtils"),
		  Map = require("map"),
		  fristMap = "",
		  _pageId = "#account_riskAssessment";
	/* 私有业务模块的全局变量 end */
	
	function init()
	{
		//加载样式
		$(_pageId+" .page").height($(window).height());
		$(_pageId+" .over_scroll").height($(window).height()-45).css({overflow:"auto"});
		fristMap = new Map();
		getRiskAssessQuestions();  // 获取问卷答题
	}
	
	function bindPageEvent()
	{
		/* 绑定返回事件 */
		appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
			
			//钱钱炒股直接跳转过来的，在当前页面点击返回则关闭手机开户APP
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
	    	
			var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
			if(tpbankFlg == '1'){
				appUtils.setSStorageInfo("backsignp","signprotocol");
				appUtils.pageInit("account/riskAssessment","account/signProtocol",{});
			}else if(tpbankFlg == '2'){
				appUtils.pageInit("account/riskAssessment","account/thirdDepository",{});
			}else{
				appUtils.pageBack();
			}
		});
		
		/* 提交答题  */
		appUtils.preBindEvent($(document),_pageId+" .ct_btn",function(){
			var keys = fristMap.keys();
			postRiskAssessmentData(keys);  // 提交答题
		});
	}
	
	function destroy()
	{
		service.destroy();
	}
	
	/* 获取风险测评题库 */
	function getRiskAssessQuestions()
	{
		// 查询风险评测
		var userid = appUtils.getSStorageInfo("user_id");
		var queryTestParam = {"user_id":userid};
		service.queryRiskToc(queryTestParam,function(data){
			var errorNo = data.error_no;
			var errorInfo = data.error_info;
			if(errorNo==0 && data.results.length != 0)  // 调用成功,跳转到风险测评页面
			{
				var results = data.results;
				var questionHtml = "";
				$(_pageId+" .test_main").html("");
				for(var i =0; i<results.length; i++)  // 先遍历
				{
					var oneEle = results[i];
					var queid = oneEle.que_id;  // que_id	题目编号
					var type = oneEle.type;  // type	问题类型（0：单选，1：多选）
					var qname = oneEle.q_name;  // q_name	题目描述
					var str = type+"-"+queid+"-"+qname;
					var secondMap = null;
					if(!fristMap.containsKey(str))  // 若map中没有对应的问题号，则存入问题号
					{
						secondMap = new Map();
						secondMap.put(oneEle.ans_id,oneEle);
						fristMap.put(str, secondMap);	  // fristMap每一个Key对应一个问题
					}
					else
					{
						fristMap.get(str).put(oneEle.ans_id,oneEle); 
					}
				}
				var keys = fristMap.keys();
				for(var j=0; j<keys.length; j++)
				{
					var oneData  = fristMap.get(keys[j]); // 取出一个问题
					questionHtml += createRiskAccessElement(oneData,keys[j],j+1);
				}
				$(_pageId+" .test_main").html(questionHtml);
				// 当题目过多，则设置下一步按钮悬浮底部
				if($(document.body).height()<$(_pageId).height())
				{
					$(_pageId+" .fix_bot").css("position","fixed");
				}
				else
				{
					$(_pageId+" .fix_bot").css("position","absolute");
				}
				// 为选择按钮添加事件
				appUtils.bindEvent($(_pageId+" .test_main .icon_radio"),function(){
					var quetype = $(this).attr("que-type");	 // 问题类型0：单选，1：多选
					var queid   = $(this).attr("id");
					if(quetype == 1)
					{
						$(this).toggleClass("checked");
					}
					else
					{
						if($(this).hasClass("checked"))
						{
							$(this).parent().parent().prev("h5").css("color","red");  // 未选择答案，则将该题标记为红色
							$(this).removeClass("checked");
						}
						else
						{
							$(_pageId+" .test_main #"+queid).removeClass("checked");
							$(this).parent().parent().prev("h5").css("color","#666666");	// 题目红色标记恢复黑色
							$(this).addClass("checked");
						}
					}
				});
				setDefaultAnswer();  // 设置默认的答案，默认是最低风险承受能力
			}
			else
			{
				layerUtils.iMsg("-1",errorInfo);
			}
		},true,true,handleTimeout);
	}
	
	/* 处理请求超时 */
	function handleTimeout()
	{
		layerUtils.iConfirm("请求超时，是否重新加载？",function(){
			getRiskAssessQuestions();  // 再次风险测评题目
		});
	}
	
	/* 设置问题的默认答案 */
	function setDefaultAnswer()
	{
		var questionList = $(_pageId+" .test_main .input_list");  // 获取所有问题的集合
		// 处理每一个问题
		questionList.each(function(){
			var markArray = new Array();
			for(var i=0;i<$(this).children("p").length;i++)
			{
				markArray.push(Number($(this).children("p").eq(i).children("a").attr("ans-mark")));
			}
			markArray.sort();  // js 的 sort 方法是在原数组的基础上进行排序
			$(this).children("p").children("a[ans-mark='"+markArray[1]+"']").addClass("checked");
		});
	}
	
	/**
	 * 创建一个问题项目
	 * @param oneData 一个问题结果集
	 * @param key 结构type+"-"+queid+"-"+qname;
	 */
	function createRiskAccessElement(oneData,key,index)
	{
		var type  = key.split("-")[0];
		var queid = key.split("-")[1];
		var qname = key.split("-")[2];
		var oneDatakeys = oneData.keys();
		var itemHtml = "";
		var itemHead = "";
		var itemElem = "";
		var str = "(多选)";
		// 问题标号
		var bgNum ="A";
		for(var i =0; i<oneDatakeys.length; i++)  // 先遍历确定有多少题
		{
			var oneElem = oneData.get(oneDatakeys[i]);
			var mark  = oneElem.mark;  // 答案分值
			var aname = oneElem.a_name;  // 答案描述
			var ansid = oneElem.ans_id;
			if(type==0) str ="(单选)";
			bgNum = changQuestionBgNum(i);
			itemElem += "<p><a href=\"javascript:void(0);\" class=\"icon_radio\" que-type =\""+type+"\" ans-id=\""+ansid+"\" ans-mark=\""+mark+"\" id =\""+queid+"\">"+bgNum+". "+aname+"</a></p>";
		}
		itemHead = "<h5>"+index+". "+qname+str+"</h5>";
		itemHtml = "<div class=\"test_box\">"+itemHead+"<div class=\"input_list\" id=\""+(index+"-"+queid)+"\">"+itemElem+"</div></div>";
		return itemHtml;
	}
	
	/* 提交风险评测答案 */
	function postRiskAssessmentData(keys)
	{
		var oneRiskAssessData ="";	// 格式如：1_2_7|2_7_3|  问题ID_答案ID_答案分值
		var countNoChoice = 0; // 没有选择问题数量
		var numNoChoice  ="";  // 没有选择问题题号
		var array = new Map();
		for(var j=0; j<keys.length; j++)
		{
			var index = j+1;
			var queid = keys[j].split("-")[1];
			var isChoice = false;
			$(_pageId+" .test_main #"+queid).each(function (){
				if($(this).hasClass("checked"))
				{
					isChoice = true;
					var ansid = $(this).attr("ans-id");
					var mark  = $(this).attr("ans-mark");
					oneRiskAssessData +=(queid+"_"+ansid+"_"+mark+"|");
				}
			});
			if(!isChoice)  // 没有选中 则记录未提交的题目编号
			{
				countNoChoice++;
				numNoChoice +=index+"、";
			}
		}
		if(countNoChoice>0)//您的答题尚未完成
		{
			numNoChoice=numNoChoice.substring(0,numNoChoice.length-1); // 去掉最后一个逗号
			layerUtils.iAlert("您的答题尚未完成，未完成题目编号："+numNoChoice);
			return false;
		}
		var userid = appUtils.getSStorageInfo("user_id");
		var submitTestParam ={
			"user_id":userid,
			"sub_id":"1",
			"q_a_args":oneRiskAssessData
		};
		// 提交风险评测答案
		service.submitTestAnswer(submitTestParam,function(data){
			var errorNo = data.error_no;
			var errorInfo = data.error_info;
			if(errorNo==0 && data.results.length != 0)	//调用成功,跳转到风险测评页面
			{
				var remark = data.results[0].remark;
				var riskdesc = data.results[0].riskdesc;
				appUtils.pageInit("account/riskAssessment","account/riskAssessmentResult",{"remark":remark,"riskdesc":riskdesc});
			}
			else
			{
				layerUtils.iMsg("-1",errorInfo);
			}
		});
	}
	
	/* 改变问题答案 */
	function changQuestionBgNum(num)
	{
		var bgNum ="A";
		switch(num)
		{
			case 0: bgNum = "A"; break;
			case 1: bgNum = "B"; break;
			case 2: bgNum = "C"; break;
			case 3: bgNum = "D"; break;
			case 4: bgNum = "E"; break;
			case 5: bgNum = "F"; break;
			case 6: bgNum = "G"; break;
			default: bgNum ="其它";
		}
		return bgNum;
	}

	var riskAssessment = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	module.exports = riskAssessment;
});