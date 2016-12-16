package cn.itcast.bos.web.action.zm;

import java.util.Date;

import org.activiti.engine.impl.persistence.entity.TaskEntity;
import org.activiti.engine.task.Task;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import cn.itcast.bos.domain.zm.InStore;
import cn.itcast.bos.domain.zm.OutStore;
import cn.itcast.bos.domain.zm.ReceiveGoodsInfo;
import cn.itcast.bos.domain.zm.TransferInfo;
import cn.itcast.bos.service.zm.ZhongZhuanService;
import cn.itcast.bos.web.action.base.BaseAction;

import com.opensymphony.xwork2.ActionSupport;

@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class ZhongZhuanAction extends BaseAction<TaskEntity> {
	// 属性驱动
	private String info; // 办理信息
	private String arrive; // 是否到达

	public void setInfo(String info) {
		this.info = info;
	}

	public void setArrive(String arrive) {
		this.arrive = arrive;
	}

	@Autowired
	private ZhongZhuanService zhongZhuanService;

	// 中转环节任务办理
	@Action(value = "zhongzhuan_saveTransferinfo", results = { @Result(name = "success", type = "redirectAction", params = { "actionName", "task_findpersonaltasks" }) })
	public String saveTransferinfo() {
		// 手动将数据封装实体
		TransferInfo transferInfo = new TransferInfo();
		transferInfo.setInfo(info);
		transferInfo.setArrive(arrive);
		transferInfo.setUpdateTime(new Date());

		// 调用业务层
		zhongZhuanService.saveTransferInfo(transferInfo, model);

		return SUCCESS;
	}

	// 办理入库任务
	@Action(value = "zhongzhuan_instorecomplete", results = {
		@Result(name = "success", type = "redirectAction", 
				params = { "actionName", "task_findpersonaltasks" }) })
	public String saveInStoreinfo() {
		// 手动将数据封装实体
		InStore inStore = new InStore();
		inStore.setInfo(info);
		inStore.setUpdateTime(new Date());

		// 调用业务层
		zhongZhuanService.saveInStoreInfo(inStore, model);

		return SUCCESS;
	}

	// 办理出库任务
	@Action(value = "zhongzhuan_outstorecomplete", results = { 
		@Result(name = "success", type = "redirectAction", 
				params = { "actionName", "task_findpersonaltasks" }) })
	public String saveOutStoreinfo() {
		// 手动将数据封装实体
		OutStore outStore = new OutStore();
		outStore.setInfo(info);
		outStore.setUpdateTime(new Date());

		// 调用业务层
		zhongZhuanService.saveOutStoreInfo(outStore, model);

		return SUCCESS;
	}

	// 办理签收任务
	@Action(value = "zhongzhuan_receiveinfocomplete", results = { 
			@Result(name = "success", type = "redirectAction", 
					params = { "actionName", "task_findpersonaltasks" }) })
	public String saveReceiveinfo() {
		// 手动将数据封装实体
		ReceiveGoodsInfo receiveGoodsInfo = new ReceiveGoodsInfo();
		receiveGoodsInfo.setInfo(info);
		receiveGoodsInfo.setUpdateTime(new Date());

		// 调用业务层
		zhongZhuanService.saveReceiveInfo(receiveGoodsInfo, model);

		return SUCCESS;
	}
}
