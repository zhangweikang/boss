package cn.itcast.bos.dao.bc;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import cn.itcast.bos.domain.bc.Staff;

public interface StaffDAO extends JpaRepository<Staff, String>{

	// 修改deltag 为 1
	@Modifying
	@Query("update Staff set deltag='1' where id=? ")
	public void updateDelTag(String id);

	// 查询未作废的取派员
	@Query("from Staff where deltag = '0'")
	public List<Staff> findAllNoDelStaffs();

}
