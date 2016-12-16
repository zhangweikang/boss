package cn.itcast.bos.web.action.qp;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import cn.itcast.bos.domain.qp.NoticeBill;
import cn.itcast.bos.domain.user.User;
import cn.itcast.bos.service.qp.NoticeBillService;
import cn.itcast.bos.web.action.base.BaseAction;

// 业务通知单操作
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class NoticeBillAction extends BaseAction<NoticeBill> {
	
	// 注入Service
	@Autowired
	private NoticeBillService noticeBillService ;
	
	// 新单
	@Action(value="noticebill_save",results={
		@Result(name="success",location="/WEB-INF/pages/qupai/noticebill_add.jsp")
	})
	public String save(){
		// 为业务通知单 关联受理人
		User user = (User) getSessionAttribute("user");
		model.setUser(user);
		
		// 调用业务层，添加通知单
		noticeBillService.saveNoticeBill(model);
		
		return SUCCESS ;
	}
}
