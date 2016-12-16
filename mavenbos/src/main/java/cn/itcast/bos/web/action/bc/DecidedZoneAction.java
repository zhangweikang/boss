package cn.itcast.bos.web.action.bc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionContext;

import cn.itcast.bos.domain.bc.DecidedZone;
import cn.itcast.bos.domain.bc.Staff;
import cn.itcast.bos.service.bc.DecidedZoneService;
import cn.itcast.bos.web.action.base.BaseAction;
import cn.itcast.crm.domain.Customer;
import cn.itcast.crm.service.CustomerService;

// 定区管理
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class DecidedZoneAction extends BaseAction<DecidedZone> {
	// 属性驱动
	private String[] subareaId;

	public void setSubareaId(String[] subareaId) {
		this.subareaId = subareaId;
	}

	// 注入Service
	@Autowired
	private DecidedZoneService decidedZoneService;

	// 添加定区
	@Action(value = "decidedzone_save", results = { @Result(name = "success", location = "/WEB-INF/pages/base/decidedzone.jsp") })
	public String save() {
		decidedZoneService.saveDecidedZone(model, subareaId);
		return SUCCESS;
	}

	private String association;

	public void setAssociation(String association) {
		this.association = association;
	}

	// 条件分页查询
	@Action(value = "decidedzone_pagequery")
	public String pageQuery() {
		// 分页
		Pageable pageable = new PageRequest(page - 1, rows);
		// 条件
		Specification<DecidedZone> specification = new Specification<DecidedZone>() {
			public Predicate toPredicate(Root<DecidedZone> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				// 空集合，代表无条件
				List<Predicate> predicates = new ArrayList<Predicate>();
				// 添加条件
				if (StringUtils.isNotBlank(model.getId())) {
					// 根据定区编号查询
					Predicate p1 = cb.equal(root.get("id").as(String.class), model.getId());
					predicates.add(p1);
				}
				if (model.getStaff() != null) {
					// 多表关联
					Join<DecidedZone, Staff> staffJoin = root.join(root.getModel().getSingularAttribute("staff", Staff.class), JoinType.LEFT);
					if (StringUtils.isNotBlank(model.getStaff().getStation())) {
						// 根据取派员的单位查询
						Predicate p2 = cb.like(staffJoin.get("station").as(String.class), "%" + model.getStaff().getStation() + "%");
						predicates.add(p2);
					}
				}
				if (StringUtils.isNotBlank(association)) {
					// 是否关联分区查询
					if (association.equals("1")) {
						// 关联分区的定区
						Predicate p3 = cb.isNotEmpty(root.get("subareas").as(Set.class));
						predicates.add(p3);
					} else if (association.equals("0")) {
						// 没有关联分区的定区
						Predicate p3 = cb.isEmpty(root.get("subareas").as(Set.class));
						predicates.add(p3);
					}
				}
				return cb.and(predicates.toArray(new Predicate[0]));
			}
		};
		// 调用业务层
		Page<DecidedZone> page = decidedZoneService.findPageData(specification, pageable);
		// 转换指定格式
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("total", page.getTotalElements());
		result.put("rows", page.getContent());
		ActionContext.getContext().getValueStack().push(result);

		return SUCCESS;
	}

	@Autowired
	private CustomerService customerService;

	// 未关联客户列表
	@Action(value = "decidedzone_findnNoAssociationCustomers")
	public String findnNoAssociationCustomers() {
		List<Customer> customers = customerService.findNoAssociationCustomers();
		ActionContext.getContext().getValueStack().push(customers);
		return SUCCESS;
	}

	// 已经关联客户列表
	@Action(value = "decidedzone_findnHasAssociationCustomers")
	public String findnHasAssociationCustomers() {
		List<Customer> customers = customerService.findHasAssociationCustomers(model.getId());
		ActionContext.getContext().getValueStack().push(customers);
		return SUCCESS;
	}
	
	private Integer[] customerIds;
	
	public void setCustomerIds(Integer[] customerIds) {
		this.customerIds = customerIds;
	} 

	// 定区关联客户
	@Action(value="decidedzone_assigncustomerstodecidedzone",results={
		@Result(name="success",location="/WEB-INF/pages/base/decidedzone.jsp")
	})
	public String assigncustomerstodecidedzone(){
		customerService.assignCustomersToDecidedzone(customerIds, model.getId());
		return SUCCESS ;
	}
}


