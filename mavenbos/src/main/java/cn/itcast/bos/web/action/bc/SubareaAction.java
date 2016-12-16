package cn.itcast.bos.web.action.bc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.ServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionContext;

import cn.itcast.bos.domain.bc.DecidedZone;
import cn.itcast.bos.domain.bc.Region;
import cn.itcast.bos.domain.bc.Subarea;
import cn.itcast.bos.service.bc.SubareaService;
import cn.itcast.bos.utils.FileUtils;
import cn.itcast.bos.web.action.base.BaseAction;

// 分区操作
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class SubareaAction extends BaseAction<Subarea> {
	
	// 注入Service
	private SubareaService subareaService ;
	
	@Autowired
	@Qualifier("subareaService")
	public void setSubareaService(SubareaService subareaService) {
		this.subareaService = subareaService;
	}

	// 保存分区
	@Action(value="subarea_save",results={
			@Result(name="success",location="/WEB-INF/pages/base/subarea.jsp")})
//	@RequiresPermissions("subarea")
	@RequiresRoles("base")
	public String save(){
		subareaService.saveSubarea(model);
		return SUCCESS;
	}
	
	// 分区条件查询
	@Action(value="subarea_pagequery")
	public String pageQuery(){
		// Spring Data 如何实现 QBC查询 
		// 准备 Specification对象（条件 ）、 Pageable对象 （分页）
		Pageable pageable = new PageRequest(page-1, rows);
		Specification<Subarea> specification = subarea2Specification();
		
		// 调用业务层 
		Page<Subarea> page = subareaService.findPageData(specification,pageable);
		
		// 将结果数据转换 json 格式
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("total", page.getTotalElements());
		result.put("rows", page.getContent());
		ActionContext.getContext().getValueStack().push(result); 
		
		return SUCCESS;
	}

	// 将Subarea 数据转换 Spring Data Specification 
	private Specification<Subarea> subarea2Specification() {
		Specification<Subarea> specification = new Specification<Subarea>() {
			// Root 获取对象属性信息 （列信息）
			// CriteriaQuery 创建简单查询 
			// CriteriaBuilder 进行复杂查询条件 
			public Predicate toPredicate(Root<Subarea> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				// 单表条件 （addresskey 关键字、 decidedZone.id 定区编码 ）
				List<Predicate> list = new ArrayList<Predicate>();
				if(StringUtils.isNotBlank(model.getAddresskey())){
					// 关键字查询 
					Predicate p1 = cb.equal(root.get("addresskey").as(String.class), model.getAddresskey());
					list.add(p1);
				}
				if(model.getDecidedZone()!=null && StringUtils.isNotBlank(model.getDecidedZone().getId())){
					// 定区编号查询
					Predicate p2 = cb.equal(root.get("decidedZone").as(DecidedZone.class), model.getDecidedZone());
					list.add(p2);
				}
				// 多表查询 ，表关联 
				if(model.getRegion()!=null){
					Join<Subarea, Region> regionJoin = root.join(root.getModel().getSingularAttribute("region", Region.class), JoinType.LEFT);
					if(StringUtils.isNotBlank(model.getRegion().getProvince())){
						// 按省份查询
						Predicate p3 = cb.like(regionJoin.get("province").as(String.class), "%"+model.getRegion().getProvince()+"%");
						list.add(p3);
					}
					if(StringUtils.isNotBlank(model.getRegion().getCity())){
						// 按城市查询
						Predicate p4 = cb.like(regionJoin.get("city").as(String.class), "%"+model.getRegion().getCity()+"%");
						list.add(p4);
					}
					if(StringUtils.isNotBlank(model.getRegion().getDistrict())){
						// 按区域查询
						Predicate p5 = cb.like(regionJoin.get("district").as(String.class), "%"+model.getRegion().getDistrict()+"%");
						list.add(p5);
					}
				}
				Predicate[] predicates = list.toArray(new Predicate[0]);
				return cb.and(predicates); 
			}
		};
		return specification;
	}
	
	// 导出
	@Action(value="subarea_searchDownload")
	public String download() throws IOException{
		// 将查询条件 转换 Specification对象 
		Specification<Subarea> specification = subarea2Specification();
		// 调用业务层 ，完成查询
		List<Subarea> subareas = subareaService.findBySpecification(specification);
		
		// 使用POI的API 将数据生成Excel
		// 1、 写一个空白Excel文件 
		HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
		// 2、 创建Sheet 工作薄
		HSSFSheet sheet = hssfWorkbook.createSheet("分区数据");
		// 3、 创建行，写单元格
		HSSFRow headRow = sheet.createRow(0); // 标题行
		headRow.createCell(0).setCellValue("分拣编号");
		headRow.createCell(1).setCellValue("区域编号");
		headRow.createCell(2).setCellValue("省");
		headRow.createCell(3).setCellValue("市");
		headRow.createCell(4).setCellValue("区");
		headRow.createCell(5).setCellValue("关键字");
		headRow.createCell(6).setCellValue("位置信息");
		
		for (Subarea subarea : subareas) { // 数据
			// 每个分区，对应一行数据 
			HSSFRow dataRow = sheet.createRow(sheet.getLastRowNum()+1); // 数据行
			dataRow.createCell(0).setCellValue(subarea.getId());
			dataRow.createCell(1).setCellValue(subarea.getRegion().getId());
			dataRow.createCell(2).setCellValue(subarea.getRegion().getProvince());
			dataRow.createCell(3).setCellValue(subarea.getRegion().getCity());
			dataRow.createCell(4).setCellValue(subarea.getRegion().getDistrict());
			dataRow.createCell(5).setCellValue(subarea.getAddresskey());
			dataRow.createCell(6).setCellValue(subarea.getPosition());
		}
		
		// 提供下载
		hssfWorkbook.write(ServletActionContext.getResponse().getOutputStream());
		// 获取MIME类型
		String filename = "分区数据.xls";
		String contentType = ServletActionContext.getServletContext().getMimeType(filename);
		ServletActionContext.getResponse().setContentType(contentType);
		// 解决下载附件名乱码 
		String agent = ServletActionContext.getRequest().getHeader("user-agent"); // 浏览器
		filename = FileUtils.encodeDownloadFilename(filename, agent);
		ServletActionContext.getResponse().setHeader("Content-Disposition", "attachment;filename="+filename);
		
		return NONE ;
	}
	
	// 定区关联 未分配定区的分区列表 json
	@Action(value="subarea_findnoassociations")
	public String findnoassociations(){
		// 调用业务层 ，查询未关联定区的分区
		List<Subarea> subareas = subareaService.findnoassociations();
		// 压入值栈
		ActionContext.getContext().getValueStack().push(subareas); 
		return SUCCESS;
	}
}
