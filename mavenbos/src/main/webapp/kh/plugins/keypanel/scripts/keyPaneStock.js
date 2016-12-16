define(function (require, exports, module) {
require("../css/keyPanel.css"); //加载所需的css
var appUtils = require("appUtils"),
    keyPanelHtml = "<div class=\"word_table\" id=\"keyPanel_num\" style=\"display:none\">"+
	    "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">"+
	      "<tr>"+
	       "<td width=\"25%\">"+
	        	"<div class=\"word_code_num\"><a herf=\"javascript:void(0)\"><span>600</span></a><a herf=\"javascript:void(0)\"><span>601</span></a><a herf=\"javascript:void(0)\"><span>000</span></a><a herf=\"javascript:void(0)\"><span>002</span></a><a herf=\"javascript:void(0)\"><span>300</span></a></div></td>"+
	       "<td width=\"75%\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"word_num_table\">"+
	          "<tr class=\"col4\">"+
	            "<td><a herf=\"javascript:void(0)\">1</a></td>"+
				"<td><a herf=\"javascript:void(0)\">2</a></td>"+
				"<td><a herf=\"javascript:void(0)\">3</a></td>"+
				
	          "</tr>"+
	          "<tr class=\"col4\">"+
	            "<td><a herf=\"javascript:void(0)\">4</a></td>"+
				"<td><a herf=\"javascript:void(0)\">5</a></td>"+
				"<td><a herf=\"javascript:void(0)\">6</a></td>"+
				
	          "</tr>"+
	          "<tr class=\"col4\">"+
	            "<td><a herf=\"javascript:void(0)\">7</a></td>"+
				"<td><a herf=\"javascript:void(0)\">8</a></td>"+
				"<td><a herf=\"javascript:void(0)\">9</a></td>"+
	          "</tr>"+
	          "<tr class=\"col3\">"+
	          	"<td><a class=\"hide\">&nbsp;</a></td>"+
				"<td><a herf=\"javascript:void(0)\">0</a></td>"+
				"<td><a class=\"del\">&nbsp;</a></td>"+
	          "</tr>"+
	        "</table></td>"+
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
	       "<td colspan=\"4\"><a class=\"hide\">&nbsp;</a></td>"+
	        "<td colspan=\"4\"><a class=\"btn\">123</a></td>"+
	        "<td colspan=\"8\"><a class=\"space\">&nbsp;</a></td>"+
	        "<td colspan=\"4\"><a class=\"btn\">搜索</a></td></td>"+
	      "</tr>"+
	    "</table>"+
	"</div>",
    curKeyPanl = "keyPanel_num",//当前面板
    closeKeyboardCallback = null,//关闭键盘回调函数
    callback = null;//回调


	/**
	 * 键盘初始化
	 * callback
	 * type设置默认的键盘，num是数字键，abc是英文键盘，默认是数字键盘
	 */
	function init_keyPanel(_callback,type,_closeKeyboardCallback)
	{
//		console.log(type);
		callback = _callback;
		closeKeyboardCallback = _closeKeyboardCallback;
/*		var word_table = $('.word_table');
		if(word_table.length > 0)
		{
			return false;
		}*/
		 var curKeyPanl = "keyPanel_num";
		 if(type && type== "num")
		 {
			 curKeyPanl="keyPanel_num";
		 }
		 else 
		 {
			 curKeyPanl="keyPanel_abc";
		 }
		 
		keyPanelChange(curKeyPanl);
		
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
			if(cur == "ABC")
			{
				$("#keyPanel_abc").css("display","block");
				$("#keyPanel_num").css("display","none");
				return false;
			}else if(cur == "123")
			{
				$("#keyPanel_num").css("display","block");
				$("#keyPanel_abc").css("display","none");
				return false;
			}
			else if(cur == "清空")
			{
				cur = "clear";
			}
			else if(cur == "搜索")
			{
				cur = "search";
			}
	        else if(cur == blank)//回退或者回退
			{
				if(curKey == "space")//空格
				{
					cur = "";
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
				}else if(curKey == "hide")
				{
					cur = "";
					closeKeyPanel();
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
		if($(".word_table").length > 0)
		{
			$(".word_table").slideUp("fast",function(e){
				$(this).remove();
			});
		}
		if(closeKeyboardCallback)
		{
			closeKeyboardCallback();
		}	
		
		if(require("gconfig").platform == 1){
			require("shellPlugin").callShellMethod("hideMenuPlugin",function(){},function(){},{"visible":"true"});
		}
	}
	
	/**
	 * 切换输入法
	 **/
	function keyPanelChange(tabPanel)
	{
		var word_table = $('.word_table');
		if(word_table.length <= 0)
		{
			$("body").append(keyPanelHtml);
		}
		addKeyPanel("keyPanel_abc");
		addKeyPanel("keyPanel_num");
		$(".word_table").slideDown("fast");
		$("#"+tabPanel).css("display","block").siblings(".word_table").css("display","none");
	}
	
		
	var keyPanel = {
		"init_keyPanel" : init_keyPanel,
		"closeKeyPanel" :closeKeyPanel
	};

	//暴露对外的接口
	module.exports = keyPanel;	
});