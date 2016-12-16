package cn.itcast.bos.service.bc.impl;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import cn.itcast.bos.dao.bc.DecidedZoneDAO;
import cn.itcast.bos.dao.bc.SubareaDAO;
import cn.itcast.bos.domain.bc.DecidedZone;
import cn.itcast.bos.service.bc.DecidedZoneService;

@Service
@Transactional
public class DecidedZoneServiceImpl implements DecidedZoneService{
	
	// 注入DAO
	@Autowired
	private DecidedZoneDAO decidedZoneDAO ;
	@Autowired
	private SubareaDAO subareaDAO;

	public void saveDecidedZone(DecidedZone decidedZone, String[] subareaIdArray) {
		// 保存定区
		decidedZoneDAO.save(decidedZone);
		// 分区 关联 定区 
		if(subareaIdArray!=null){
			for (String subareaId : subareaIdArray) {
				subareaDAO.associationDecidedZone(decidedZone, subareaId);
			}
		}
	}
 
	public Page<DecidedZone> findPageData(Specification<DecidedZone> specification, Pageable pageable) {
		return decidedZoneDAO.findAll(specification, pageable);
	}

}
