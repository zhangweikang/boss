package cn.itcast.bos.service.bc;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import cn.itcast.bos.domain.bc.DecidedZone;

// 定区
public interface DecidedZoneService {

	// 添加定区
	public void saveDecidedZone(DecidedZone decidedZone, String[] subareaIdArray);

	// 条件分页
	public Page<DecidedZone> findPageData(Specification<DecidedZone> specification, Pageable pageable);

}
