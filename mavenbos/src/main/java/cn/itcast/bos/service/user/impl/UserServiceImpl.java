package cn.itcast.bos.service.user.impl;

import java.util.List;

import org.activiti.engine.IdentityService;
import org.activiti.engine.impl.persistence.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.auth.RoleDAO;
import cn.itcast.bos.dao.user.UserDAO;
import cn.itcast.bos.domain.auth.Role;
import cn.itcast.bos.domain.user.User;
import cn.itcast.bos.service.user.UserService;
import cn.itcast.bos.utils.MD5Utils;

@Service // spring 管理的bean
@Transactional // 事务管理
public class UserServiceImpl implements UserService{
	
	@Autowired // 依赖注入
	private UserDAO userDAO;
	
	public void saveUser(User user) {
		userDAO.save(user);
	}

	public List<User> findAllUsers() {
		return userDAO.findAll();
	}

	public User findByUsername(String username) {
		return userDAO.findByUsername(username);
	}

	public User login(User user) { 
		return userDAO.findByUsernameAndPassword(user.getUsername(), MD5Utils.md5(user.getPassword()));
	}

	public String findPasswordByUsername(String username) {
		return userDAO.findPasswordByUsername(username);
	}

	public void editPassword(User user) {
		userDAO.editPassword(user.getId(), MD5Utils.md5(user.getPassword()));
	}

	@Autowired
	private RoleDAO roleDAO ;
	
	@Autowired
	private IdentityService identityService;
	
	public void saveUser(User user, String[] roleIds) {
		// 保存用户
		user.setPassword(MD5Utils.md5(user.getPassword()));
		userDAO.save(user); 
		
		// 创建Activiti 用户
		org.activiti.engine.identity.User activitiUser = new UserEntity(user.getId());
		activitiUser.setFirstName(user.getUsername());
		activitiUser.setLastName(user.getUsername());
		identityService.saveUser(activitiUser);
		
		// 用户关联角色
		if(roleIds != null){
			for (String roleId : roleIds) {
				// 持久 角色 
				Role role = roleDAO.findOne(roleId);
				// 关联 
				user.getRoles().add(role);
				// 建立activiti 用户和组的关系
				identityService.createMembership(user.getId(), role.getCode());
			}
		}
	}

}
