package cn.itcast.bos.service.bc;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import cn.itcast.bos.domain.bc.Region;

public interface RegionService {

	// 批量保存区域
	public void saveBatch(List<Region> regions);

	// 分页查询
	public Page<Region> findPageData(Pageable pageable);

	// 查询满足条件的所有区域 
	public List<Region> findAllRegions(String q);

}
