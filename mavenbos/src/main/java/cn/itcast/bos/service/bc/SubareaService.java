/**
 * 
 */
package cn.itcast.bos.service.bc;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import cn.itcast.bos.domain.bc.Subarea;

/**
 * @author Administrator
 *
 */
public interface SubareaService {

	// 保存分区
	public void saveSubarea(Subarea subarea);

	// 条件分页查询
	public Page<Subarea> findPageData(Specification<Subarea> specification, Pageable pageable);

	// 条件查询
	public List<Subarea> findBySpecification(Specification<Subarea> specification);

	// 为关联定区的分区列表
	public List<Subarea> findnoassociations();

}
