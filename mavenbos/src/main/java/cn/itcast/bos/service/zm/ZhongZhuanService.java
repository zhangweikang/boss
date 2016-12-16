package cn.itcast.bos.service.zm;

import org.activiti.engine.task.Task;

import cn.itcast.bos.domain.zm.InStore;
import cn.itcast.bos.domain.zm.OutStore;
import cn.itcast.bos.domain.zm.ReceiveGoodsInfo;
import cn.itcast.bos.domain.zm.TransferInfo;

public interface ZhongZhuanService {

	// 办理中转环节任务
	void saveTransferInfo(TransferInfo transferInfo, Task task);

	// 入库
	void saveInStoreInfo(InStore inStore, Task task);

	// 出库
	void saveOutStoreInfo(OutStore outStore, Task task);

	// 签收 
	void saveReceiveInfo(ReceiveGoodsInfo receiveGoodsInfo, Task task);

}
