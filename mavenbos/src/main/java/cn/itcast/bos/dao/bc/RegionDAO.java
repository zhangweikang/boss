package cn.itcast.bos.dao.bc;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import cn.itcast.bos.domain.bc.Region;

public interface RegionDAO extends JpaRepository<Region, String>{

	// 根据省市区查询
	@Query(value="from Region where province like ?1 or city like ?1 or district like ?1")
	public List<Region> findRegionByProvinceCityDistrict(String q);

	// 省市区 查询
	public Region findByProvinceAndCityAndDistrict(String province, String city, String district);

}
