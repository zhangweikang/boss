/**
 * 签署协议
 */
define("project/scripts/account/toukerSignProtocol",function(require, exports, module){
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        _pageId = "#account_toukerSignProtocol";
    /* 私有业务模块的全局变量 end */

    function init()
    {
        //加载样式
        $(_pageId+" .page").height($(window).height());
        $(_pageId+" .mainPage").height($(window).height()-45).css({overflow:"auto"});
    }

    function bindPageEvent()
    {
        /* 绑定返回事件 */
        appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
            appUtils.pageInit("account/toukerSignProtocol","account/phoneToukerRegister",{});
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

    }

    function destroy()
    {
        service.destroy();
    }

    var toukerSignProtocol = {
        "init" : init,
        "bindPageEvent" : bindPageEvent,
        "destroy" : destroy
    };

    module.exports = toukerSignProtocol;
});