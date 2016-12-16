package cn.itcast.bos.service.qp.impl;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.itcast.bos.dao.bc.DecidedZoneDAO;
import cn.itcast.bos.dao.bc.RegionDAO;
import cn.itcast.bos.dao.qp.NoticeBillDAO;
import cn.itcast.bos.dao.qp.WorkBillDAO;
import cn.itcast.bos.domain.bc.DecidedZone;
import cn.itcast.bos.domain.bc.Region;
import cn.itcast.bos.domain.bc.Staff;
import cn.itcast.bos.domain.bc.Subarea;
import cn.itcast.bos.domain.qp.NoticeBill;
import cn.itcast.bos.domain.qp.WorkBill;
import cn.itcast.bos.service.qp.NoticeBillService;
import cn.itcast.crm.service.CustomerService;

@Service
@Transactional
public class NoticeBillServiceImpl implements NoticeBillService{

	// 注入DAO
	@Autowired
	private NoticeBillDAO noticeBillDAO ;
	
	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private DecidedZoneDAO decidedZoneDAO;
	
	@Autowired
	private RegionDAO regionDAO; 
	
	@Autowired
	private WorkBillDAO workBillDAO ;
	
	
	
	public void saveNoticeBill(NoticeBill noticeBill) {
		noticeBillDAO.save(noticeBill); // 保存业务通知单 
		// 客户地址
		String address = noticeBill.getPickaddress();
		// 1、 自动分单 ，匹配CRM 地址库方案 
		String decidedZoneId = customerService.findDecidedZoneIdByAddress(address);
		if(decidedZoneId!=null){
			// 自动分单成功
			// 根据定区编号 查询 取派员 
			DecidedZone decidedZone = decidedZoneDAO.findOne(decidedZoneId); 
			// 业务定区必须关联取派员 
			noticeBill.setStaff(decidedZone.getStaff());
			noticeBill.setOrdertype("自动");
			
			// 生成工单
			generateWorkBill(noticeBill, decidedZone.getStaff());
			
			return ;
		}
		
		// 2、 解析用户地址，匹配分区 方案
		int provinceIndex = address.indexOf("省");
		int cityIndex = address.indexOf("市", provinceIndex);
		int districtIndex = address.indexOf("区",cityIndex);
		
		// 直辖市 ，没有省
		String province ;
		String city = address.substring(provinceIndex+1, cityIndex+1 );
		String district = address.substring(cityIndex+1, districtIndex+1);
		if(provinceIndex == -1){
			// 直辖市
			province = city ;
		}else{
			// 非直辖市
			province = address.substring(0,provinceIndex+1);
		}
		// 根据 省市区 ，查询分区 
		Region region = regionDAO.findByProvinceAndCityAndDistrict(province,city,district);
		for (Subarea subarea : region.getSubareas()) {
			// 地址中含有关键字
			if(address.contains(subarea.getAddresskey())){
				// 匹配分区 --- 定区 --- 取派员
				if(subarea.getDecidedZone()!=null){
					Staff staff = subarea.getDecidedZone().getStaff();
					noticeBill.setStaff(staff);
					noticeBill.setOrdertype("自动");
					// 生成工单
					generateWorkBill(noticeBill, staff); 
					return ;
				}
			}
		}
		
		// 3、 人工分单
		noticeBill.setOrdertype("人工");
		
	}


	// 生成工单
	private void generateWorkBill(NoticeBill noticeBill, Staff staff) {
		WorkBill workBill = new WorkBill();
		workBill.setAttachbilltimes(new BigDecimal(0));// 追单次数 
		workBill.setBuildtime(new Date()); // 生成工单时间 
		workBill.setNoticeBill(noticeBill); // 关联通知单
		workBill.setPickstate("新单"); // 状态 
		workBill.setRemark(noticeBill.getRemark()); // 备注
		workBill.setStaff(staff);
		workBill.setType("新");// 工单状态 
		workBillDAO.save(workBill);
	}

}
