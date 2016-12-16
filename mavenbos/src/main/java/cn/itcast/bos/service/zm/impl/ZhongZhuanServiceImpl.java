package cn.itcast.bos.service.zm.impl;

import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.zm.InStoreDAO;
import cn.itcast.bos.dao.zm.OutStoreDAO;
import cn.itcast.bos.dao.zm.ReceiveGoodsInfoDAO;
import cn.itcast.bos.dao.zm.TransferInfoDAO;
import cn.itcast.bos.domain.zm.InStore;
import cn.itcast.bos.domain.zm.OutStore;
import cn.itcast.bos.domain.zm.ReceiveGoodsInfo;
import cn.itcast.bos.domain.zm.TransferInfo;
import cn.itcast.bos.domain.zm.ZhongZhuanInfo;
import cn.itcast.bos.service.zm.ZhongZhuanService;

@Service
@Transactional
public class ZhongZhuanServiceImpl implements ZhongZhuanService{
	
	@Autowired
	private TransferInfoDAO transferInfoDAO ;
 
	@Autowired
	private TaskService taskService;
	
	public void saveTransferInfo(TransferInfo transferInfo, Task task) {
		// 1、 保存实体数据 
		transferInfoDAO.save(transferInfo);
		
		// 2、关联流程变量
		ZhongZhuanInfo zhongZhuanInfo = (ZhongZhuanInfo) taskService.getVariable(task.getId(), "zhongzhuaninfo");
		zhongZhuanInfo.getTransferInfos().add(transferInfo);
		zhongZhuanInfo.setArrive(transferInfo.getArrive());
		
		// 设置流程变量 arrive 控制排它网关 走向
		taskService.setVariable(task.getId(), "arrive", Integer.parseInt(transferInfo.getArrive())); 
		
		// 3、 办理任务
		taskService.complete(task.getId());
		
	}
	
	@Autowired
	private InStoreDAO inStoreDAO ;
	@Autowired
	private OutStoreDAO outStoreDAO ;
	@Autowired
	private ReceiveGoodsInfoDAO receiveGoodsInfoDAO;

	public void saveInStoreInfo(InStore inStore, Task task) {
		// 1、 保存实体
		inStoreDAO.save(inStore);
		// 2、关联变量
		ZhongZhuanInfo zhongZhuanInfo = (ZhongZhuanInfo) taskService.getVariable(task.getId(), "zhongzhuaninfo");
		zhongZhuanInfo.setInStore(inStore);
		// 3、 完成任务
		taskService.complete(task.getId());
	}

	public void saveOutStoreInfo(OutStore outStore, Task task) {
		outStoreDAO.save(outStore);
		ZhongZhuanInfo zhongZhuanInfo = (ZhongZhuanInfo) taskService.getVariable(task.getId(), "zhongzhuaninfo");
		zhongZhuanInfo.setOutStore(outStore);
		taskService.complete(task.getId()); 
	}

	public void saveReceiveInfo(ReceiveGoodsInfo receiveGoodsInfo, Task task) {
		receiveGoodsInfoDAO.save(receiveGoodsInfo);
		ZhongZhuanInfo zhongZhuanInfo = (ZhongZhuanInfo) taskService.getVariable(task.getId(), "zhongzhuaninfo");
		zhongZhuanInfo.setReceiveGoodsInfo(receiveGoodsInfo);
		taskService.complete(task.getId());
	}

}
