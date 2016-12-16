package cn.itcast.bos.dao.auth;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import cn.itcast.bos.domain.auth.Role;

public interface RoleDAO extends JpaRepository<Role, String>{

	// @Query(value="from Role r inner join fetch r.users u where u.id = ?")
	/* SQL:  
	 * select r.* 
	 * 	from 
	 * 	auth_role r 
	 * 		inner join user_role u on r.id= u.role_id 
	 * 		and u.user_id = ? 
	 */
	@Query(value="select r.* from auth_role r inner join user_role u on r.id= u.role_id and u.user_id = ? ",nativeQuery=true)
	List<Role> findRolesByUser(String id);

}
