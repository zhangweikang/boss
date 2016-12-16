package cn.itcast.bos.service.auth.impl;

import java.util.List;

import org.activiti.engine.IdentityService;
import org.activiti.engine.identity.Group;
import org.activiti.engine.impl.persistence.entity.GroupEntity;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.auth.FunctionDAO;
import cn.itcast.bos.dao.auth.RoleDAO;
import cn.itcast.bos.domain.auth.Function;
import cn.itcast.bos.domain.auth.Role;
import cn.itcast.bos.domain.user.User;
import cn.itcast.bos.service.auth.RoleService;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {
	
	@Autowired
	private RoleDAO roleDAO ;

	@Autowired
	private FunctionDAO functionDAO;
	
	public List<Role> findAllRoles() {
		return roleDAO.findAll();
	}

	public List<Role> findRolesByUser(User user) {
		return roleDAO.findRolesByUser(user.getId());
	}

	@Autowired
	private IdentityService identityService;
	
	public void saveRole(Role role, String functionIds) {
		// 保存角色
		roleDAO.save(role);
		
		// 角色授予权限 
		if(StringUtils.isNotBlank(functionIds)){
			for (String functionId : functionIds.split(",")) {
				// 持久Function
				Function function = functionDAO.findOne(functionId);
				
				// 角色关联权限
				role.getFunctions().add(function);
			}
		}
		
		// 创建Activiti的组信息
		Group group = new GroupEntity(role.getCode());
		group.setName(role.getName());
		identityService.saveGroup(group);
	}

}
