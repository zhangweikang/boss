package cn.itcast.bos.service.bc.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.bc.SubareaDAO;
import cn.itcast.bos.domain.bc.Subarea;
import cn.itcast.bos.service.bc.SubareaService;

@Service("subareaService")
@Transactional
public class SubareaServiceImpl implements SubareaService{
	
	// 注入DAO
	@Autowired
	private SubareaDAO subareaDAO ;

	public void saveSubarea(Subarea subarea) {
		subareaDAO.save(subarea);
	}

	public Page<Subarea> findPageData(Specification<Subarea> specification, 
				Pageable pageable) {
		return subareaDAO.findAll(specification,pageable); 
	} 

	public List<Subarea> findBySpecification(Specification<Subarea> specification) {
		return subareaDAO.findAll(specification);
	}

	public List<Subarea> findnoassociations() {
		return subareaDAO.findnoassociations();
	}

}
