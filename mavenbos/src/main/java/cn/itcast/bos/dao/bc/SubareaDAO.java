package cn.itcast.bos.dao.bc;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import cn.itcast.bos.domain.bc.DecidedZone;
import cn.itcast.bos.domain.bc.Subarea;

public interface SubareaDAO 
	extends JpaRepository<Subarea, String>, JpaSpecificationExecutor<Subarea>{

	// 查询为分配定区的分区
	@Query("from Subarea where decidedZone is null")
	public List<Subarea> findnoassociations();

	// 分区关联定区
	@Modifying
	@Query("update Subarea set decidedZone=?1 where id = ?2")
	public void associationDecidedZone(DecidedZone decidedZone, String subareaId);

}
