package cn.itcast.crm.service;

import java.util.List;

import javax.jws.WebMethod;
import javax.jws.WebService;

import cn.itcast.crm.domain.Customer;

@WebService
public interface CustomerService {
	// 查询未关联定区的客户
	@WebMethod
	public List<Customer> findNoAssociationCustomers();
	// 查询定区已经关联客户信息
	@WebMethod
	public List<Customer> findHasAssociationCustomers(String decidedZoneId);
	// 将客户关联到定区
	@WebMethod
	public void assignCustomersToDecidedzone(Integer[] customerIds, String decidedZoneId);

	@WebMethod
	public String findDecidedZoneIdByAddress(String address);
}
