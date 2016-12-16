package cn.itcast.bos.web.action.qp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
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

import bsh.StringUtil;
import cn.itcast.bos.domain.qp.WorkOrderManage;
import cn.itcast.bos.service.qp.WorkOrderManageService;
import cn.itcast.bos.web.action.base.BaseAction;

@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class WorkOrderManageAction extends BaseAction<WorkOrderManage>{
	
	//注入Service
	@Autowired
	private WorkOrderManageService workOrderManageService ;
	
	
	@Action(value="workOrderManage_save")
	public String save(){
		workOrderManageService.saveWorkOrderManage(model);
		return NONE ;
	}
	
	// 基于索引 搜索
	@Action(value="workordermanage_pagequery")
	public String pageQuery(){
		Page<WorkOrderManage> pageData = null;
		Pageable pageable = new PageRequest(page-1, rows);
		// 判断是否有查询条件 
		if(StringUtils.isNotBlank(conditionName) && StringUtils.isNotBlank(conditionValue)){
			// 有查询条件  , 查询 索引库 ， 由索引返回 id 数据库 
			pageData = workOrderManageService.findPageData(pageable,conditionName,conditionValue);
		}else{
			// 无条件 ，直接查询数据库 
			pageData = workOrderManageService.findPageData(pageable);
		}
		
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("total", pageData.getTotalElements());
		result.put("rows", pageData.getContent());
		ActionContext.getContext().getValueStack().push(result);
		
		return SUCCESS ;
	}
	
	// 属性接收 查询参数
	private String conditionName; 
	private String conditionValue ;


	public void setConditionName(String conditionName) {
		this.conditionName = conditionName;
	}

	public void setConditionValue(String conditionValue) {
		this.conditionValue = conditionValue;
	}
	
	// 工作单审核 ，列表查询
	@Action(value="workordermanage_list", results={
		@Result(name="success",location="/WEB-INF/pages/zhongzhuan/check.jsp")
	})
	public String list(){
		List<WorkOrderManage> workOrderManages= workOrderManageService.findNoZhongZhuanWorkOrderManages();
		ActionContext.getContext().getValueStack().push(workOrderManages);
		return SUCCESS; 
	}
	
	// 工作单审核，中转流程启动
	@Action(value="workordermanage_check",results={
		@Result(name="success",type="redirectAction",params={"actionName","workordermanage_list"})
	})
	public String check(){
		workOrderManageService.check(model);
		return SUCCESS;
	}
	
}
