package cn.itcast.bos.service.auth.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.auth.FunctionDAO;
import cn.itcast.bos.domain.auth.Function;
import cn.itcast.bos.domain.user.User;
import cn.itcast.bos.service.auth.FunctionService;

@Service
@Transactional
public class FunctionServiceImpl implements FunctionService {
	
	@Autowired
	private FunctionDAO functionDAO ;
	
	public List<Function> findAllFunctions() {
		return functionDAO.findAll();
	}

	public void saveFunction(Function function) {
		// 页面没有选中父功能，生成关联父function对象，id是 "" 
		if(function.getFunction()!=null && StringUtils.isBlank(function.getFunction().getId())){
			// 页面没有选择父功能点 ，不需要关联外键
			function.setFunction(null);
		}
		functionDAO.save(function);
	}

	@Cacheable(value="menucache",key="#user.id")
	public List<Function> findFunctionsByUser(User user) {
		// admin 需要看到所有菜单
		// 其它用户 看到自己具有权限的菜单 
		// 隐藏条件 generatemenu='1' ， order by zindex 
		if(user.getUsername().equals("admin")){
			// 管理员
			return functionDAO.findAdminMenu();
		}else{
			// 普通用户
			return functionDAO.findUserMenu(user.getId()); 
		}
	}

}
