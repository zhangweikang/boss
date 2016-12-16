package cn.itcast.bos.web.action.workflow;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.GraphicInfo;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionContext;

import cn.itcast.bos.web.action.base.BaseAction;

// 流程实例管理
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class ProcessInstanceAction extends BaseAction<ExecutionEntity> {
	
	@Autowired
	private RuntimeService runtimeService ;

	// 查看所有正在运行的流程实例
	@Action(value="processinstance_list", results={
		@Result(name="success",location="/WEB-INF/pages/workflow/processinstance.jsp")
	})
	public String list(){
		// 查询所有正在运行流程实例列表
		List<ProcessInstance> prInstances = runtimeService.createProcessInstanceQuery().list();
		// 查询实例对应流程变量
		Map<ProcessInstance, Map<String,Object>> map = new HashMap<ProcessInstance, Map<String,Object>>();
		for (ProcessInstance processInstance : prInstances) {
//			ExecutionEntity entity=  (ExecutionEntity) processInstance;
//			System.out.println(entity.getCurrentActivityName());
			
			Map<String, Object> variables = runtimeService.getVariables(processInstance.getId());
			map.put(processInstance, variables);
		}
		// 将数据map 传递给页面显示
		ActionContext.getContext().getValueStack().push(map);
		return SUCCESS;
	}
	
	@Autowired
	private RepositoryService repositoryService;
	
	// 查看实例流程图
	@Action(value="processinstance_viewpng",results={
		@Result(name="success",location="/WEB-INF/pages/workflow/viewpng.jsp")
	})
	public String viewpng(){
		// 根据流程实例编号，查询流程定义编号 
		ProcessInstance processInstance = 
					runtimeService.createProcessInstanceQuery()
					.processInstanceId(model.getId()).singleResult();
		String processDefinitionId = processInstance.getProcessDefinitionId();
		
		// 当前任务节点
		String key = processInstance.getActivityId();
		
		// 根据流程实例编号，查询活动节点坐标 
		BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);
		GraphicInfo graphicInfo = bpmnModel.getGraphicInfo(key);
		
		// 将查询定义编号和 活动坐标 传递给jsp
		ActionContext.getContext().getValueStack().set("pdId", processDefinitionId);
		ActionContext.getContext().getValueStack().set("graphicInfo", graphicInfo);
		
		return SUCCESS;
	}
}
