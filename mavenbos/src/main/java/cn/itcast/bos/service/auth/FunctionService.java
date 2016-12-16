package cn.itcast.bos.service.auth;

import java.util.List;

import cn.itcast.bos.domain.auth.Function;
import cn.itcast.bos.domain.user.User;

public interface FunctionService {

	// 查询所有权限
	List<Function> findAllFunctions();

	// 添加权限
	void saveFunction(Function function);

	// 根据用户 显示菜单
	List<Function> findFunctionsByUser(User user);

}
