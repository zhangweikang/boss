package cn.itcast.bos.service.bc;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import cn.itcast.bos.domain.bc.Staff;

public interface StaffService {

	// 保存取派员
	public void saveStaff(Staff staff);

	// 分页查询
	public Page<Staff> findPageData(Pageable pageable);

	// 批量作废
	public void delBatch(String[] idArray);

	// 查询未作废的取派员
	public List<Staff> findAllNoDelStaffs();

}
