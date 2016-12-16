package cn.itcast.bos.dao.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cn.itcast.bos.domain.user.User;

// 编写用户操作的DAO
public interface UserDAO extends JpaRepository<User, String>{
	// 第一类： 只要根据 findBy属性名 可以自动查询
	// 这里的username 是 User的属性，对应表中的字段
	public User findByUsername(String username);
	public User findById(String id );
	// 生成 where username=? and password = ?
	public User findByUsernameAndPassword(String username, String password); 
	
	// 第二类
	// @Query(value="select password from User where username =?") // HQL
	@Query(value="select password from t_user where username =?",nativeQuery=true) // SQL 
	public String findPasswordByUsername(String username);
	
	// 第三类 修改单一字段 
	@Modifying // 开启修改操作
	// 命名参数
	@Query("update User set password=:password where id=:id")
	public void editPassword(@Param("id") String id, @Param("password")String password);
	
	
}

