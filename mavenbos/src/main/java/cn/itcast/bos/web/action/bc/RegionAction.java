package cn.itcast.bos.web.action.bc;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.spec.OAEPParameterSpec;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionContext;

import cn.itcast.bos.domain.bc.Region;
import cn.itcast.bos.service.bc.RegionService;
import cn.itcast.bos.utils.PinYin4jUtils;
import cn.itcast.bos.web.action.base.BaseAction;

// 区域管理
@ParentPackage("basic-bos")
@Namespace("/")
@Controller
@Scope("prototype")
public class RegionAction extends BaseAction<Region>{
	// 接收上传文件 <input type="file" name="upload" />
	private File upload ;
	public void setUpload(File upload) {
		this.upload = upload;
	}
	
	// 注入Service
	@Autowired
	private RegionService regionService;
	
	// 批量导入方法
	@Action(value="region_importData")
	public String importData(){
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			// 文件上传解析导入代码逻辑
			// 1、 打开Excel文件
			HSSFWorkbook workbook = new HSSFWorkbook(new FileInputStream(upload));
			// 2、 找到sheet 
			HSSFSheet sheet = workbook.getSheetAt(0);
			// 3、读取行
			List<Region> regions = new ArrayList<Region>();
			for (Row row : sheet) {
				// 每行数据 对应一个region 区域对象
				if(row.getRowNum()==0){
					// 第一行 ，是标题，跳过
					continue;
				}
				// 读取数据 ， 最后一行，读入一个空行
				if(StringUtils.isNotBlank(row.getCell(0).getStringCellValue())){
					// 跳过无用信息，跳过文件结尾 空行
					Region region = new Region();
					region.setId(row.getCell(0).getStringCellValue());
					region.setProvince(row.getCell(1).getStringCellValue());
					region.setCity(row.getCell(2).getStringCellValue());
					region.setDistrict(row.getCell(3).getStringCellValue());
					region.setPostcode(row.getCell(4).getStringCellValue());
					
					// 生成简码和城市编码
					// 简码首字母 
					String province = row.getCell(1).getStringCellValue();
					province = province.substring(0,province.length()-1);
					String city = row.getCell(2).getStringCellValue();
					city = city.substring(0,city.length()-1);
					String district = row.getCell(3).getStringCellValue();
					district = district.substring(0,district.length()-1);
					
					// 生成简码 
					String[] headArrary = PinYin4jUtils.getHeadByString(province+city+district);
					String shortcode = "" ;
					for (String s : headArrary) {
						shortcode += s ;
					}
					region.setShortcode(shortcode);
					// 城市编码 
					String citycode = PinYin4jUtils.hanziToPinyin(city, "");
					region.setCitycode(citycode);
					
					regions.add(region);
				}
			}
			// 调用业务层，保存
			regionService.saveBatch(regions);
			
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
		}
		// 将返回结果压入值栈
		ActionContext.getContext().getValueStack().push(result);
		return SUCCESS ;
	}
	
	// 分页查询
	@Action(value="region_pagequery")
	public String pageQuery(){
		// 将请求参数 ，封装Pageable 
		Pageable pageable = new PageRequest(page-1,rows);
		// 调用业务层
		Page<Region> page = regionService.findPageData(pageable);
		// 封装easyui 需要格式 
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("total", page.getTotalElements());
		result.put("rows", page.getContent());
		ActionContext.getContext().getValueStack().push(result);
		
		return SUCCESS;
	}
	
	@Action(value="region_ajaxlist")
	public String ajaxlist(){
		// 获取 q参数
		String q = getParameter("q");
		
		// 查询所有区域信息
		List<Region> regions = regionService.findAllRegions(q);
		
		// 压入值栈
		ActionContext.getContext().getValueStack().push(regions); 
		
		return SUCCESS; 
	}
	
}
