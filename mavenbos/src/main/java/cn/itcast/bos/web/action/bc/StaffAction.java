package cn.itcast.bos.web.action.bc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionContext;

import cn.itcast.bos.domain.bc.Staff;
import cn.itcast.bos.service.bc.StaffService;
import cn.itcast.bos.web.action.base.BaseAction;

// 取派员管理
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class StaffAction extends BaseAction<Staff>{
	
	@Autowired
	private StaffService staffService ;
	
	@Action(value="staff_save",results={
			@Result(name="success",location="/WEB-INF/pages/base/staff.jsp")})
	public String save(){
		staffService.saveStaff(model);
		return SUCCESS;
	}
	
	@Action(value="staff_pagequery",results={
			@Result(name="success",type="json")
	})
	public String pageQuery(){
		// 将分页请求参数，封装 Pageable
		Pageable pageable = new PageRequest(page-1, rows);
		// 调用业务层
		Page<Staff> pageData = staffService.findPageData(pageable);
		
		// 借助Map集合 ，转换为 easyui需要的格式
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("total", pageData.getTotalElements());
		result.put("rows", pageData.getContent());
		
		// struts2 json 插件原理，默认将值栈顶部对象 转换json返回 
		ActionContext.getContext().getValueStack().push(result);
		
		return SUCCESS;
	}
	
	// 作废功能
	@Action(value="staff_delbatch")
	public String delbatch(){
		// 获取页面提交 ids 字符串
		String ids = getParameter("ids");
		
		// 获取到每个id
		String[] idArray = ids.split(",");
		
		// 调用业务层，修改
		staffService.delBatch(idArray);
		
		return NONE;
	}
	
	// 查询取派员json列表
	@Action(value="staff_ajaxlist")
	public String ajaxlist(){
		// 隐含查询条件，查询未作废的取派员 
		List<Staff> staffs = staffService.findAllNoDelStaffs();
		
		// 将结果放入栈顶
		ActionContext.getContext().getValueStack().push(staffs); 
		
		return SUCCESS;
	}
	
	
}
