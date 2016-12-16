package cn.itcast.bos.service.user;

import java.util.List;

import cn.itcast.bos.domain.user.User;

public interface UserService {
	// 添加新用户
	public void saveUser(User user);
	
	// 查询所有用户
	public List<User> findAllUsers();
	
	// 根据用户名查询
	public User findByUsername(String username);
	
	// 登录
	public User login(User user);
	
	// 查询密码
	public String findPasswordByUsername(String username);

	// 修改密码
	public void editPassword(User user);

	// 添加用户，完成授予角色
	public void saveUser(User user, String[] roleIds);

}
