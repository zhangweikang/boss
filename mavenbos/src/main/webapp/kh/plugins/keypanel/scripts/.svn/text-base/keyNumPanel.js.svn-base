define(function (require, exports, module) {
require("../css/keyPanel.css"); //加载所需的css
var appUtils = require("appUtils"),
layerUtils = require("layerUtils"),
keyPanelHtml = "<div class=\"word_table\" id=\"keyPanel_num_a\" style=\"display:none\">"+
	    "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"word_abc_table\">"+
	          "<tr class=\"col4\">"+
	            "<td colspan=\"4\"><a herf=\"javascript:void(0)\">1</a></td>"+
				"<td colspan=\"4\"><a herf=\"javascript:void(0)\">2</a></td>"+
				"<td colspan=\"4\"><a herf=\"javascript:void(0)\">3</a></td>"+
	          "</tr>"+
	          "<tr class=\"col4\">"+
	            "<td colspan=\"4\"><a herf=\"javascript:void(0)\">4</a></td>"+
				"<td colspan=\"4\"><a herf=\"javascript:void(0)\">5</a></td>"+
				"<td colspan=\"4\"><a herf=\"javascript:void(0)\">6</a></td>"+
	          "</tr>"+
	          "<tr class=\"col4\">"+
	            "<td colspan=\"4\"><a herf=\"javascript:void(0)\">7</a></td>"+
				"<td colspan=\"4\"><a herf=\"javascript:void(0)\">8</a></td>"+
				"<td colspan=\"4\"><a herf=\"javascript:void(0)\">9</a></td>"+
	          "</tr>"+
	          "<tr class=\"col3\">"+
	            "<td colspan=\"3\"><a class=\"hide\">&nbsp;</a></td>"+
	            "<td colspan=\"3\"><a herf=\"javascript:void(0)\">.</a></td>"+
				"<td colspan=\"3\"><a herf=\"javascript:void(0)\">0</a></td>"+
				"<td colspan=\"3\" ><a class=\"del\">&nbsp;</a></td>"+
	          "</tr>"+
	    "</table>"+
	"</div>",
    curKeyPanl = "keyPanel_num_a",//当前面板
    offsetTop = 0,//当前键盘弹出后input距离顶部上移的距离
    curUi = null,//当前元素的父元素，用于计算input距离顶部的高度
    callback = null;//回调


	/**
	 * 键盘初始化
	 * callback
	 * curUi 当前激活的div键盘
	 */
	function init_keyPanel(_callback,_curUi)
	{
		callback = _callback;
		curUi = _curUi;
		keyPanelChange(curKeyPanl,curUi);
		
		if(require("gconfig").platform == 1){
			require("shellPlugin").callShellMethod("hideMenuPlugin",function(){},function(){},{"visible":"false"});
		}
	}
	
	
	/**
	 * 键盘添加监听
	 **/
	function addKeyPanel(ui)
	{
		appUtils.bindEvent($("#"+ui+" a"),function(e){
	        var evt = e|| window.event;
	        evt.stopPropagation ?evt.stopPropagation() : (evt.cancelBubble=true);
			//增加样式
			var ele = e.srcElement?e.srcElement:e.target;
			curKey = ele.className;
			var blank = "&nbsp;";
			var cur = ele.innerHTML;
	      if(cur == blank)//回退或者回退
			{
				if(curKey == "hide")//关闭键盘
				{
					closeKeyPanel();
					return false;
				}	
				else if(curKey == "del")//回退
				{
					cur = "del";
				}	
			}
			if(callback)
			{
				callback(cur);
			}	
			
		},"touchstart");
		appUtils.bindEvent($("#"+ui+" p"),function(e){
	        var evt = e|| window.event;
	        evt.stopPropagation ?evt.stopPropagation() : (evt.cancelBubble=true);
			closeKeyPanel();
		},"touchstart");
	}
	/**
	 * 关闭输入法
	 * 
	 **/
	function closeKeyPanel()
	{
		if($("#"+curKeyPanl).length > 0)
		{
			$("#"+curKeyPanl).slideUp("fast",function(e){
				$(this).remove();
			});
		}
		if(curUi)
		{
			if(curUi.parents(".main").length >0)
			{	
				curUi.parents(".main").css("margin-top","0px");
			}else if(curUi.parents(".pop_confirm").length >0)
			{
				var marinTop = curUi.parents(".pop_confirm").css("margin-top");
				marinTop = Number(marinTop.slice(0, -2));
				curUi.parents(".pop_confirm").css("margin-top", (marinTop + offsetTop) + "px");
			}	
		}	
		
		if(require("gconfig").platform == 1){
			require("shellPlugin").callShellMethod("hideMenuPlugin",function(){},function(){},{"visible":"true"});
		}
	}
	
	/**
	 * 切换输入法
	 **/
	function keyPanelChange(tabPanel,curUi)
	{
		var word_table = $("#"+tabPanel);
		if(word_table.length <= 0)
		{
			$("body").append(keyPanelHtml);
		}
		addKeyPanel("keyPanel_num_a");
		$("#"+tabPanel).slideDown("fast");
		$("#"+tabPanel).css("display","block").siblings(".word_table").css("display","none");
		setTimeout(function(){
			var keyBoardHeight = $("#"+tabPanel).height();//键盘的高度
			var keyBoardScrllTop = (curUi.offset().top+curUi.height()+20);//键盘距离顶部的高度
			var windowHeight = $(window).height();
			if((keyBoardScrllTop+keyBoardHeight) > windowHeight )
			{
				offsetTop = (keyBoardScrllTop+keyBoardHeight)  - windowHeight;
				if(curUi)
				{
					if(curUi.parents(".main").length >0)
					{	
						curUi.parents(".main").css("margin-top",-offsetTop+"px");
					}else if(curUi.parents(".pop_confirm").length >0)
					{
						var marinTop = curUi.parents(".pop_confirm").css("margin-top");
						marinTop = Number(marinTop.slice(0, -2));
						curUi.parents(".pop_confirm").css("margin-top",marinTop - offsetTop+"px");
					}	
				}	
			}		
		}, 200);

		
	}
	
		
	var keyPanel = {
		"init_keyPanel" : init_keyPanel,
		"closeKeyPanel" :closeKeyPanel
	};

	//暴露对外的接口
	module.exports = keyPanel;	
});