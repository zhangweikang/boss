package cn.itcast.bos.dao.auth;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import cn.itcast.bos.domain.auth.Function;

public interface FunctionDAO extends JpaRepository<Function, String>{

	@Query("from Function where generatemenu='1' order by zindex")
	List<Function> findAdminMenu();

	@Query(nativeQuery=true, value="select f.* from auth_function f inner join role_function rf on f.id=rf.function_id inner join user_role ur on rf.role_id= ur.role_id where ur.user_id=? and f.generatemenu='1' order by f.zindex")
	List<Function> findUserMenu(String id);

}
