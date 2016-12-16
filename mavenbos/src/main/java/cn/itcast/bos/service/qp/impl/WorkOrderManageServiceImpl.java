package cn.itcast.bos.service.qp.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.qp.WorkOrderManageDAO;
import cn.itcast.bos.dao.zm.ZhongZhuanInfoDAO;
import cn.itcast.bos.domain.qp.WorkOrderManage;
import cn.itcast.bos.domain.zm.ZhongZhuanInfo;
import cn.itcast.bos.service.qp.WorkOrderManageService;

@Service
@Transactional
public class WorkOrderManageServiceImpl implements WorkOrderManageService {

	// 注入DAO
	@Autowired
	private WorkOrderManageDAO workOrderManageDAO;

	public void saveWorkOrderManage(WorkOrderManage workOrderManage) {
		workOrderManageDAO.save(workOrderManage);
	}

	public Page<WorkOrderManage> findPageData(Pageable pageable, String conditionName, String conditionValue) {
		return workOrderManageDAO.findDataByLucene(pageable, conditionName, conditionValue);
	}

	public Page<WorkOrderManage> findPageData(Pageable pageable) {
		return workOrderManageDAO.findAll(pageable);
	}

	public List<WorkOrderManage> findNoZhongZhuanWorkOrderManages() {
		return workOrderManageDAO.findNoZhongZhuanWorkOrderManages();
	}
	
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private RuntimeService runtimeService;
	
	@Autowired 
	private ZhongZhuanInfoDAO zhongZhuanInfoDAO ;

	public void check(WorkOrderManage workOrderManage) {	
		// 判断系统中是否已经发布了中转流程 （key=zhongzhuan）
		List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery()
				.processDefinitionKey("zhongzhuan").list();
		if(list.isEmpty()){
			throw new RuntimeException("系统还没有部署中转配送流程，无法审核启动！");
		}
		
		// 将工作单 managercheck属性设置 "1" 已经审核
		workOrderManageDAO.updateManagerCheck(workOrderManage.getId());
		
		// 需要创建ZhongZhuanInfo 变量， 关联 WorkOrderManager
		ZhongZhuanInfo zhongZhuanInfo = new ZhongZhuanInfo();
		zhongZhuanInfo.setWorkOrderManage(workOrderManage);
		zhongZhuanInfoDAO.save(zhongZhuanInfo);
		
		// 启动流程，关联变量
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("zhongzhuaninfo", zhongZhuanInfo);
		runtimeService.startProcessInstanceByKey("zhongzhuan",variables);
	}

}
