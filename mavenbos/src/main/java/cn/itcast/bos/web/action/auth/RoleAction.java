package cn.itcast.bos.web.action.auth;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionContext;

import cn.itcast.bos.domain.auth.Role;
import cn.itcast.bos.service.auth.RoleService;
import cn.itcast.bos.web.action.base.BaseAction;

// 角色管理 
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class RoleAction extends BaseAction<Role>{
	
	@Autowired
	private RoleService roleService;
	
	// 查询所有角色信息 
	@Action("role_ajaxlist")
	public String ajaxlist(){
		List<Role> roles = roleService.findAllRoles();
		ActionContext.getContext().getValueStack().push(roles);
		return SUCCESS ;
	}
	
	private String functionIds;
	
	public void setFunctionIds(String functionIds) {
		this.functionIds = functionIds;
	}

	// 添加角色
	@Action(value="role_save",results={
		@Result(name="success",location="/WEB-INF/pages/admin/role.jsp")
	})
	public String save(){
		roleService.saveRole(model,functionIds);
		return SUCCESS;
	}
}
