package cn.itcast.bos.web.action.workflow;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipInputStream;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.repository.DeploymentBuilder;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import com.opensymphony.xwork2.ActionContext;

import cn.itcast.bos.web.action.base.BaseAction;

// 流程定义管理 
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class ProcessDefinitionAction extends BaseAction<ProcessDefinitionEntity>{
	// 接收上传 流程描述文件 
	private File deploy ;
	private String deployFileName;

	public void setDeploy(File deploy) {
		this.deploy = deploy;
	}
	
	public void setDeployFileName(String deployFileName) {
		this.deployFileName = deployFileName;
	}

	// 注入 Activiti 流程定义管理Service
	@Autowired
	private RepositoryService repositoryService;
	
	// 发布新流程
	/*
	 * <result name="success" type="redirectAction">
	 * 		<param name="actionName">processdefinition_list</param>
	 * </result>
	 * 
	 */
	@Action(value="processdefinition_deploy", results={
		@Result(name="success",type="redirectAction",params={"actionName","processdefinition_list"})
	})
	public String deployProcessDefinition() throws IOException{
		// 发布新流程定义
		if(deploy == null){
			throw new RuntimeException("发布流程定义，选择xml文件 或者 zip文件 ");
		}
		// 判断上传是xml 还是 zip
		DeploymentBuilder deployment = repositoryService.createDeployment();
		if(deployFileName.endsWith("bpmn")){
			// 上传是一个流程定义文件 
			deployment.addInputStream(deployFileName, new FileInputStream(deploy));
		}else if(deployFileName.endsWith("zip")){
			// 上传是一个压缩包
			deployment.addZipInputStream(new ZipInputStream(new FileInputStream(deploy)));
		}
		deployment.deploy();
		
		return SUCCESS ;
	}
	
	
	// 流程定义列表查询 
	@Action(value="processdefinition_list", results={
		@Result(name="success", 
				location="/WEB-INF/pages/workflow/processdefinition_list.jsp")
	})
	public String list(){
		// 查询流程定义
		ProcessDefinitionQuery processDefinitionQuery = repositoryService.createProcessDefinitionQuery();
		List<ProcessDefinition> list = processDefinitionQuery.latestVersion().list();
		
		// 通过值栈传递到页面 
		ActionContext.getContext().getValueStack().push(list); 
		
		return SUCCESS ;
	}
	
	private InputStream in ;
	
	// 查看流程定义图
	@Action(value="processdefinition_viewpng", results={
		@Result(name="success",type="stream",params ={"contentType","image/png"})
	})
	public String viewpng(){
		// 页面提交流程定义编号，封装model
		in = repositoryService.getProcessDiagram(model.getId());
		// 方法一 ：将图片流程内容 复制 response的OutputStream 
		// 方法二： 使用struts2 提供 stream的 Result 
		return SUCCESS;
	}

	// 返回输入流 
	public InputStream getInputStream(){
		return in ;
	}
}
