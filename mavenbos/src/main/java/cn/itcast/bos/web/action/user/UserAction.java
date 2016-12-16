package cn.itcast.bos.web.action.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import cn.itcast.bos.domain.user.User;
import cn.itcast.bos.service.user.UserService;
import cn.itcast.bos.utils.MD5Utils;
import cn.itcast.bos.web.action.base.BaseAction;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.interceptor.annotations.InputConfig;

// 继承json-default 使用json类型结果
@SuppressWarnings("serial")
@ParentPackage("basic-bos") 
@Namespace("/")
@Controller
@Scope("prototype")
public class UserAction extends BaseAction<User>{
	
	// 注入Service
	@Autowired
	private UserService userService;
	
	@Action(value="user_login",results={@Result(name="login",location="/login.jsp"),
			@Result(name="success", type="redirect", location="/index.jsp")})
	@InputConfig(resultName="login")
	public String login() {
		// 添加验证码校验 
		// 从请求数据获取验证码 ，获取session验证码 比较
		String checkcode = getParameter("checkcode"); // 用户输入的验证码
		String checkcode_session = (String) getSessionAttribute("key");
		if(StringUtils.isBlank(checkcode_session)||!checkcode_session.equals(checkcode)){
			// 验证码错误 
			this.addFieldError("checkcode", this.getText("checkcodeerror"));
			return LOGIN ;
		}
		
		// 传统登录逻辑
		
		/*User user = userService.login(model);
		if(user == null){
			// 登录失败
			this.addActionError(this.getText("loginfail")); 
			return LOGIN;
		}else{
			// 登录成功
			setSessionAttribute("user", user); 
			return SUCCESS ;
		}*/
		
		
		// shiro 登录逻辑
		Subject subject = SecurityUtils.getSubject(); // 当前登陆用户 
		AuthenticationToken token = 
				new UsernamePasswordToken(model.getUsername(), MD5Utils.md5(model.getPassword()));
		try {
			subject.login(token) ;
			return SUCCESS ;
		} catch (UnknownAccountException e) {
			this.addActionError(this.getText("usernamenotfound"));
			return LOGIN;
		} catch (IncorrectCredentialsException e) {
			this.addActionError(this.getText("passwordinvalid"));
			return LOGIN;
		}
	}
	
	@Action(value="user_logout",results=
		{@Result(name="success",type="redirect",location="/login.jsp")})
	public String logout(){
		// 销毁
		// ServletActionContext.getRequest().getSession().invalidate();
		
		// shiro 退出 
		Subject subject = SecurityUtils.getSubject();
		subject.logout();
		return SUCCESS;
	}
	
	@Action(value="user_editpassword",results={@Result(name="success",type="json")})
	public String editpassword(){
		// model中封装用户id 和 新的密码 password
		User user = (User) getSessionAttribute("user");
		model.setId(user.getId()); 
		
		// 结果 Map
		Map<String, Object> result = new HashMap<String,Object>();
		try {
			// 调用业务层
			userService.editPassword(model);
			result.put("result", true);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("result", false);
		}
		// struts2 json plugin 特点， 默认将值栈顶部对象返回
		ActionContext.getContext().getValueStack().push(result);
		
		return SUCCESS;
	}
	
	// 接收角色id 
	private String[] roleIds ;
	
	public void setRoleIds(String[] roleIds) {
		this.roleIds = roleIds;
	}

	// 添加用户 ，授予角色
	@Action(value="user_save",results={
		@Result(name="success",location="/WEB-INF/pages/admin/userlist.jsp")
	})
	public String save(){
		userService.saveUser(model, roleIds);
		return SUCCESS ;
	}

	
	// 用户 json 列表查询
	@Action("user_ajaxlist")
	public String ajaxlist(){
		List<User> users = userService.findAllUsers();
		ActionContext.getContext().getValueStack().push(users);
		return SUCCESS ;
	}
}


















