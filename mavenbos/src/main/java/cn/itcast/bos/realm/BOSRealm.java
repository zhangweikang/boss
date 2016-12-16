package cn.itcast.bos.realm;

import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;

import cn.itcast.bos.domain.auth.Function;
import cn.itcast.bos.domain.auth.Role;
import cn.itcast.bos.domain.user.User;
import cn.itcast.bos.service.auth.FunctionService;
import cn.itcast.bos.service.auth.RoleService;
import cn.itcast.bos.service.user.UserService;

/**
 * 实现认证和授权功能 
 * @author Administrator
 *
 */
public class BOSRealm extends AuthorizingRealm{
	
	@Autowired
	private RoleService roleService ;
	
	@Autowired
	private FunctionService functionService ;

	@Override
	// 授权方法，获取用户权限信息
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		System.out.println("授权.....");
		// 根据当前登陆用户，查询 用户对应角色 
		Subject subject = SecurityUtils.getSubject();
		User user = (User) subject.getPrincipal();// 返回保存在Subject中数据 ，认证返回第一个参数
		
		// admin 用户具有所有角色和所有权限 能力
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo(); // 没有权限和角色
		if(user.getUsername().equals("admin")){
			// 管理员 
			List<Role> roles = roleService.findAllRoles();
			for (Role role : roles) {
				authorizationInfo.addRole(role.getCode());
			}
			List<Function> functions = functionService.findAllFunctions();
			for (Function function : functions) {
				authorizationInfo.addStringPermission(function.getCode());
			}
		}else{
			// 不是管理员
			List<Role> roles = roleService.findRolesByUser(user);
			for (Role role : roles) {
				authorizationInfo.addRole(role.getCode());
				for (Function function : role.getFunctions()) {
					authorizationInfo.addStringPermission(function.getCode());
				}
			}
		}
		// 调用角色Service 
		return authorizationInfo;
	}
	
	@Autowired
	private UserService userService ;

	@Override
	// 认证方法， 获取用户密码信息
	// 返回 null 代表用户名 不存在
	// 返回 密码信息
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		System.out.println("认证.....");
		// 根据用户名 查询 密码 
		UsernamePasswordToken usernamePasswordToken = (UsernamePasswordToken) token;
		String username = usernamePasswordToken.getUsername();
		
		// 调用Service 根据用户名 查询用户 
		User user = userService.findByUsername(username);
		if(user == null){
			// 用户名不存在
			return null ;
		}else{
			// 用户存在 ，返回密码 
			// 第一个参数  保存在session中数据 
			// 第二个参数 密码信息 
			// 第三个参数 Realm被spring管理 名称 
			return new SimpleAuthenticationInfo(user, user.getPassword(), super.getName());
		}
		
	}

}
