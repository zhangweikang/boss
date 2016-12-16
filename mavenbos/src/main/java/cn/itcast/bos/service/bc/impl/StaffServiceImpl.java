package cn.itcast.bos.service.bc.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.bc.StaffDAO;
import cn.itcast.bos.domain.bc.Staff;
import cn.itcast.bos.service.bc.StaffService;

@Service
@Transactional
public class StaffServiceImpl implements StaffService {
	
	@Autowired
	private StaffDAO staffDAO ;

	public void saveStaff(Staff staff) {
		staffDAO.save(staff);
	}

	public Page<Staff> findPageData(Pageable pageable) {
		return staffDAO.findAll(pageable); 
	}

	public void delBatch(String[] idArray) {
		for (String id : idArray) {
			staffDAO.updateDelTag(id);
		}
	}

	public List<Staff> findAllNoDelStaffs() {
		return staffDAO.findAllNoDelStaffs();
	}

}
