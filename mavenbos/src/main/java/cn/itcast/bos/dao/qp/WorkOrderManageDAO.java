package cn.itcast.bos.dao.qp;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import cn.itcast.bos.domain.qp.WorkOrderManage;

public interface WorkOrderManageDAO extends JpaRepository<WorkOrderManage, String>{
	
	// 查询索引库
	@Query
	public Page<WorkOrderManage> findDataByLucene(Pageable pageable, String conditionName, String conditionValue);

	// 查询未进行中转工作单
	@Query("from WorkOrderManage where managercheck is null")
	// @Query("from WorkOrderManage where zhongZhuanInfo is null")
	public List<WorkOrderManage> findNoZhongZhuanWorkOrderManages();

	@Query("update WorkOrderManage set managercheck='1' where id =?")
	@Modifying
	public void updateManagerCheck(String id);
} 
