package cn.itcast.bos.service.auth;

import java.util.List;

import cn.itcast.bos.domain.auth.Role;
import cn.itcast.bos.domain.user.User;

public interface RoleService {

	// 查询所有角色
	List<Role> findAllRoles();

	// 根据用户查询角色
	List<Role> findRolesByUser(User user);

	// 添加角色，完成角色授权
	void saveRole(Role role, String functionIds);

}
