(function saveToSession(){
	// 获取 ajax 对象
	var xhr = (function(){
				if (window.XMLHttpRequest)
				{
					// code for IE7+, Firefox, Chrome, Opera, Safari
				  return new XMLHttpRequest();
				}
				else
				{
					// code for IE6, IE5
				  return new ActiveXObject("Microsoft.XMLHTTP");
				}
			})(window);
	/** 
	 * 如果 数据字典 已经请求过，那么再次进入首页将不再请求数据，在这里必须用 短路与 ，否则有可能出现
	 * Cannot read property 'length' of null 
	 * appUtils.getSStorageInfo("dictdata").length != 0 加这个判断是为了避免由于网络或者其他未知
	 * 问题导致的 dictdata 为空时，程序不请求数据
	 */
	if(sessionStorage.getItem("dictdata") != null && sessionStorage.getItem("dictdata").length != 0)
	{
		return;
	}
	// 和服务器建立连接
	xhr.open("post","http://119.145.1.151:8843/servlet/json?funcNo=501501",true);
	// 请求数据成功的回调
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4)
		{
			var data = JSON.parse(xhr.responseText),
				list = data.results;
			var convList = {
				//  学历
				"adapter" : new Array(),
				// 开通证券账户枚举
				"openAccountEnum" : new Array(),
				// 职业
				"occupational" : new Array()
			};
			for(var i=0;i<list.length;i++)
			{
				// 学历
				if(list[i].enum_type == "adapter")
				{
					convList.adapter.push(list[i]);
				}
				// 证券账户枚举
				if(list[i].enum_type == "zqzhlx")
				{
					convList.openAccountEnum.push(list[i]);
				}
				// 职业
				if(list[i].enum_type == "occupational")
				{
					convList.occupational.push(list[i]);
				}
			}
			sessionStorage.setItem("dictdata",JSON.stringify(convList));
		}
	};
	// 发送 ajax 请求
	xhr.send();
})(window);