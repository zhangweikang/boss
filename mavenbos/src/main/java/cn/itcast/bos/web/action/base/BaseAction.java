package cn.itcast.bos.web.action.base;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

// 复用 Action 代码
public abstract class BaseAction<T> extends ActionSupport implements ModelDriven<T> {

	protected T model;

	public T getModel() {
		return model;
	} 

	public BaseAction() {
		Class<T> modelClass = null; 
		// 对model进行实例化， 通过子类 类声明的泛型
		// UserAction extends BaseAction<User>
		Type superclass = this.getClass().getGenericSuperclass();
		if (superclass instanceof ParameterizedType) {
			// 当前类 具有参数化类型 父类型
			// 转化为参数化类型
			ParameterizedType parameterizedType = (ParameterizedType) superclass;
			// 获取一个泛型参数 Userinfo
			modelClass = (Class<T>) parameterizedType.getActualTypeArguments()[0];
		} else {
			// 当前类 没有参数化类型 父类型
			superclass = this.getClass().getSuperclass().getGenericSuperclass();
			// 转化为参数化类型
			ParameterizedType parameterizedType = (ParameterizedType) superclass;
			// 获取一个泛型参数 Userinfo
			modelClass = (Class<T>) parameterizedType.getActualTypeArguments()[0];
		}

		try {
			model = modelClass.newInstance();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
	}

	// 获取请求参数
	public String getParameter(String name) {
		return ServletActionContext.getRequest().getParameter(name);
	}

	// 获取Session Attribute
	public Object getSessionAttribute(String name) {
		return ServletActionContext.getRequest().getSession().getAttribute(name);
	}

	// 向session保存属性
	public void setSessionAttribute(String name, Object value) {
		ServletActionContext.getRequest().getSession().setAttribute(name, value);
	}

	// 分页请求属性驱动
	protected int page; // 页码
	protected int rows; // 每页 记录数

	public void setPage(int page) {
		this.page = page;
	}

	public void setRows(int rows) {
		this.rows = rows;
	}
}
