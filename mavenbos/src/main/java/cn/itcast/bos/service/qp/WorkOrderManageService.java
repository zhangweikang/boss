package cn.itcast.bos.service.qp;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import cn.itcast.bos.domain.qp.WorkOrderManage;


public interface WorkOrderManageService {

	// 保存工作单信息
	public void saveWorkOrderManage(WorkOrderManage workOrderManage);

	// 查询索引库
	public Page<WorkOrderManage> findPageData(Pageable pageable, String conditionName, String conditionValue);

	// 查询数据库
	public Page<WorkOrderManage> findPageData(Pageable pageable);

	// 查询未进行中转的工作单
	public List<WorkOrderManage> findNoZhongZhuanWorkOrderManages();

	// 审核工作单，开启中转配送流程
	public void check(WorkOrderManage model);

}
