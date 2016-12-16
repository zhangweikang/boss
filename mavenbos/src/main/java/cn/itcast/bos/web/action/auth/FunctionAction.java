package cn.itcast.bos.web.action.auth;

import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionContext;

import cn.itcast.bos.domain.auth.Function;
import cn.itcast.bos.domain.user.User;
import cn.itcast.bos.service.auth.FunctionService;
import cn.itcast.bos.web.action.base.BaseAction;

@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class FunctionAction extends BaseAction<Function>{
	
	@Autowired
	private FunctionService functionService ;
	
	@Action("function_ajaxlist")
	// 列表 json 查询
	public String ajaxlist(){
		List<Function> functions = functionService.findAllFunctions();
		ActionContext.getContext().getValueStack().push(functions);
 		return SUCCESS ;
	}
	
	@Action(value="function_save",results={
		@Result(name="success",location="/WEB-INF/pages/admin/function.jsp")
	})
	public String save(){ 
		// 调用业务层，完成保存
		functionService.saveFunction(model);
		return SUCCESS ;
	}

	// 显示菜单
	@Action("function_showmenu")
	public String showmenu(){
		// 根据当前用户，获取权限信息
		Subject subject = SecurityUtils.getSubject();
		User user = (User) subject.getPrincipal();
		// 查询菜单 
		List<Function> functions = functionService.findFunctionsByUser(user);
		ActionContext.getContext().getValueStack().push(functions); 
		
		return SUCCESS ;
	}
}


