package cn.itcast.bos.service.bc.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.bc.RegionDAO;
import cn.itcast.bos.domain.bc.Region;
import cn.itcast.bos.service.bc.RegionService;

@Service
@Transactional
public class RegionServiceImpl implements RegionService{
	
	// 注入DAO
	@Autowired
	private RegionDAO regionDAO;

	public void saveBatch(List<Region> regions) {
		regionDAO.save(regions);
	}
 
	public Page<Region> findPageData(Pageable pageable) {
		return regionDAO.findAll(pageable);
	}

	public List<Region> findAllRegions(String q) {
		// 判断q 是否存在
		if(StringUtils.isBlank(q)){
			// 没有条件，查询所有
			return regionDAO.findAll();
		}else{
			// 存在查询条件 
			return regionDAO.findRegionByProvinceCityDistrict("%"+q+"%");
		}
	}

}
