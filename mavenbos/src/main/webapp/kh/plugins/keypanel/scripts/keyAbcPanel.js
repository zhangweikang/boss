define(function (require, exports, module) {
require("../css/keyPanel.css"); //加载所需的css
require("../css/autocomplete.css"); //加载所需的css
var appUtils = require("appUtils"),
keyPanelHtml = "<div class=\"word_table\" id=\"keyPanel_num\" style=\"display:none\">"+
    "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"word_abc_table\">"+
          "<tr class=\"col4\">"+
            "<td><a herf=\"javascript:void(0)\">1</a></td>"+
			"<td><a herf=\"javascript:void(0)\">2</a></td>"+
			"<td><a herf=\"javascript:void(0)\">3</a></td>"+
			"<td><a class=\"del\">&nbsp;</a></td>"+
			
          "</tr>"+
          "<tr class=\"col4\">"+
          "<td><a herf=\"javascript:void(0)\">4</a></td>"+
			"<td><a herf=\"javascript:void(0)\">5</a></td>"+
			"<td><a herf=\"javascript:void(0)\">6</a></td>"+
			"<td><a class=\"space\">&nbsp;</a></td>"+
			
          "</tr>"+
          "<tr class=\"col4\">"+
            "<td><a herf=\"javascript:void(0)\">7</a></td>"+
			"<td><a herf=\"javascript:void(0)\">8</a></td>"+
			"<td><a herf=\"javascript:void(0)\">9</a></td>"+
			"<td><a herf=\"javascript:void(0)\" class=\"btn\">关闭</a></td>"+
          "</tr>"+
          "<tr class=\"col3\">"+
           "<td><a herf=\"javascript:void(0)\" class=\"btn\">abc</a></td>"+
           "<td><a herf=\"javascript:void(0)\">0</a></td>"+
           "<td><a herf=\"javascript:void(0)\">.</a></td>"+
           "<td><a herf=\"javascript:void(0)\" class=\"btn\">确定</a></td>"+
          "</tr>"+
    "</table>"+
"</div>"+

"<div class=\"word_table\" id=\"keyPanel_abc\" style=\"display:none\">"+
"<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"word_abc_table\">"+
  "<tr class=\"col10\">"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">q</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">w</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">e</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">r</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">t</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">y</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">u</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">i</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">o</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">p</a></td>"+
  "</tr>"+
  "<tr class=\"col10\">"+
    "<td>&nbsp;</td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">a</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">s</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">d</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">f</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">g</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">h</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">j</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">k</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">l</a></td>"+
    "<td>&nbsp;</td>"+
  "</tr>"+
  "<tr class=\"col10\">"+
    "<td colspan=\"3\"><a class=\"caps\" id=\"BSWord\">&nbsp;</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">z</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">x</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">c</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">v</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">b</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">n</a></td>"+
    "<td colspan=\"2\"><a herf=\"javascript:void(0)\">m</a></td>"+
    "<td colspan=\"3\"><a class=\"del\">&nbsp;</a></td>"+
  "</tr>"+
  "<tr class=\"col3\">"+
    "<td colspan=\"4\"><a class=\"btn\">123</a></td>"+
    "<td colspan=\"4\"><a class=\"btn\">关闭</a></td>"+
    "<td colspan=\"8\"><a class=\"space\">&nbsp;</a></td>"+
    "<td colspan=\"4\"><a class=\"btn\">确定</a></td></td>"+
  "</tr>"+
"</table>"+
"</div>",
    curKeyPanl = "keyPanel_num",//当前面板
    offsetTop = 0,//当前键盘弹出后input距离顶部上移的距离
    curUi = null,
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
			
			if(cur == "abc")
			{
				$("#keyPanel_abc").css("display","block");
				$("#keyPanel_num").css("display","none");
				keyPanelChange("keyPanel_abc",curUi);
				return false;
			}else if(cur == "123")
			{
				$("#keyPanel_num").css("display","block");
				$("#keyPanel_abc").css("display","none");
				keyPanelChange("keyPanel_num",curUi);
				return false;
			}else if(cur == "关闭")
			{
				closeKeyPanel();
				return false;
			}
			else if(cur == "清空")
			{
				
			}
			else if(cur == "确定")
			{
				closeKeyPanel();
				return false;
			}
	        else if(cur == blank)//回退或者回退
			{
				if(curKey == "space")//空格
				{
					//cur = "空格";
					return false;
				}else if(curKey == "caps")//大小写转换
				{
					ele.className = "caps current";
					$(".col10 a").each(function(e){
						var eles = $(this);
						if(eles != null && eles[0].innerHTML != "&nbsp;")
						{
							eles[0].innerHTML = eles[0].innerHTML.toUpperCase();
						}
					});
					return false;
				}else if(curKey == "caps current")//大小写转换
				{
					ele.className = "caps";
					$(".col10 a").each(function(e){
						var eles = $(this);
						if(eles != null && eles[0].innerHTML != "&nbsp;")
						{
							eles[0].innerHTML = eles[0].innerHTML.toLowerCase();
						}
					});
					return false;
				}	
				else//回退
				{
					cur = "del";
				}	
			}
			if(callback)
			{

				callback(cur);
			}	
			
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
				$(".word_table").remove();
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
		
		if(tabPanel == "keyPanel_abc")
		{
			addKeyPanel("keyPanel_abc");	
		}else
		{
			addKeyPanel("keyPanel_num");
		}
		
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