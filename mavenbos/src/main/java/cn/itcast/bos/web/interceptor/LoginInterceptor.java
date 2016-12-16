package cn.itcast.bos.web.interceptor;

import org.apache.struts2.ServletActionContext;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.MethodFilterInterceptor;

// 将拦截器交给Spring管理
@Controller("loginInterceptor")
public class LoginInterceptor extends MethodFilterInterceptor{

	@Override
	protected String doIntercept(ActionInvocation invocation) throws Exception {
		// 判断session中是否含有user信息
		if(ServletActionContext.getRequest().getSession().getAttribute("user")==null){
			// 未登录 
			return "login";
		}else{
			// 已经登录
			return invocation.invoke();
		}
	}

}
