package cn.itcast.bos.web.action.workflow;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.TaskService;
import org.activiti.engine.impl.persistence.entity.TaskEntity;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.apache.commons.lang3.StringUtils;
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

import cn.itcast.bos.domain.user.User;
import cn.itcast.bos.domain.zm.ZhongZhuanInfo;
import cn.itcast.bos.web.action.base.BaseAction;

// 任务操作
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class TaskAction extends BaseAction<TaskEntity> {

	@Autowired
	private TaskService taskService;

	// 组任务查询
	@Action(value = "task_findgrouptasks", results = { @Result(name = "success", location = "/WEB-INF/pages/workflow/grouptask.jsp") })
	public String findGroupTasks() {
		// 从shiro中获取登录用户id
		Subject subject = SecurityUtils.getSubject();
		User user = (User) subject.getPrincipal();
		// 查询组任务
		TaskQuery taskQuery = taskService.createTaskQuery();
		taskQuery.taskCandidateUser(user.getId());
		List<Task> list = taskQuery.list();
		// 通过任务列表查询，任务的变量
		Map<Task, Map<String, Object>> map = new HashMap<Task, Map<String, Object>>();
		for (Task task : list) {
			Map<String, Object> variables = taskService.getVariables(task.getId());
			map.put(task, variables);
		}
		// 通过值栈传值
		ActionContext.getContext().getValueStack().push(map);

		return SUCCESS;
	}

	// 拾取 ，签收任务
	@Action(value = "task_takeTask", results = { @Result(name = "success", type = "redirectAction", params = { "actionName", "task_findgrouptasks" }) })
	public String take() {
		// 签收任务
		Subject subject = SecurityUtils.getSubject();
		User user = (User) subject.getPrincipal();
		// taskService.setAssignee(model.getId(), user.getId());
		taskService.claim(model.getId(), user.getId());

		return SUCCESS;
	}

	// 个人任务列表查询
	@Action(value = "task_findpersonaltasks", results = { 
		@Result(name = "success", location = "/WEB-INF/pages/workflow/personaltask.jsp") 
	})
	public String task_findpersonaltasks() {
		// 从shiro中获取登录用户id
		Subject subject = SecurityUtils.getSubject();
		User user = (User) subject.getPrincipal();
		// 查询个人任务
		TaskQuery taskQuery = taskService.createTaskQuery();
		taskQuery.taskAssignee(user.getId());
		List<Task> list = taskQuery.list();
		// 通过任务列表查询，任务的变量
		Map<Task, Map<String, Object>> map = new HashMap<Task, Map<String, Object>>();
		for (Task task : list) {
			Map<String, Object> variables = taskService.getVariables(task.getId());
			map.put(task, variables);
		}
		// 通过值栈传值
		ActionContext.getContext().getValueStack().push(map);
		
		return SUCCESS;
	}
	
	// 跳转到办理任务的页面
	@Action(value="task_completeTask", results={
		@Result(name="success",location="/${taskurl}")
	})
	public String completeTask(){
		// 查询任务 
		Task task = taskService.createTaskQuery().taskId(model.getId()).singleResult();
		String formKey = task.getFormKey();
		if(StringUtils.isBlank(formKey)){
			throw new RuntimeException("没有指定任务节点的办理页面！");
		}
		ActionContext.getContext().getValueStack().set("taskurl", formKey);
		// 向页面通常传递两个对象 
		ActionContext.getContext().getValueStack().set("task", task);  
		ActionContext.getContext().getValueStack().set("variables", taskService.getVariables(task.getId()));
		return SUCCESS; 
		
	}

}
