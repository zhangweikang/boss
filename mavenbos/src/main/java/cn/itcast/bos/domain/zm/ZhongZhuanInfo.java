package cn.itcast.bos.domain.zm;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.activiti.engine.task.Task;
import org.hibernate.annotations.IndexColumn;

import cn.itcast.bos.domain.qp.WorkOrderManage;


/**
 * 中转流程 完整信息
 *
 */
@Entity
@Table(name="zm_zhongzhuaninfo",schema="ceshi")
public class ZhongZhuanInfo {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@Transient
	private Task currentTask; // 当前任务（不存储）
	
	// 这里为什么用List ，因为要保证中转信息顺利
	// 使用Set 建表， 一对多 一方添加 mappedBy 将外键 交给多方维护
	// 使用List 建表， 保证集合元素顺序 ，在表中加入 索引下标字段，添加 IndexColumn注解，不能写mappedBy 
	@OneToMany(targetEntity=TransferInfo.class)
	@JoinColumn(name="zhongzhuaninfo_id")
	@IndexColumn(name="zz_index")
	private List<TransferInfo> transferInfos = new ArrayList<TransferInfo>(); // 多次中转信息
	
	private String arrive; //是否到达
	
	@ManyToOne
	@JoinColumn(name="instore_id")
	private InStore inStore; // 入库信息
	@ManyToOne
	@JoinColumn(name="outstore_id")
	private OutStore outStore; // 出库信息
	@ManyToOne
	@JoinColumn(name="receivegoodsinfo_id")
	private ReceiveGoodsInfo receiveGoodsInfo; // 配送信息
	
	@OneToOne(targetEntity=WorkOrderManage.class)
	@JoinColumn(name="workordermanage_id")
	private WorkOrderManage workOrderManage; //工作单信息
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Task getCurrentTask() {
		return currentTask;
	}
	public void setCurrentTask(Task currentTask) {
		this.currentTask = currentTask;
	}
	public List<TransferInfo> getTransferInfos() {
		return transferInfos;
	}
	public void setTransferInfos(List<TransferInfo> transferInfos) {
		this.transferInfos = transferInfos;
	}
	public String getArrive() {
		return arrive;
	}
	public void setArrive(String arrive) {
		this.arrive = arrive;
	}
	public InStore getInStore() {
		return inStore;
	}
	public void setInStore(InStore inStore) {
		this.inStore = inStore;
	}
	public OutStore getOutStore() {
		return outStore;
	}
	public void setOutStore(OutStore outStore) {
		this.outStore = outStore;
	}
	public ReceiveGoodsInfo getReceiveGoodsInfo() {
		return receiveGoodsInfo;
	}
	public void setReceiveGoodsInfo(ReceiveGoodsInfo receiveGoodsInfo) {
		this.receiveGoodsInfo = receiveGoodsInfo;
	}
	public WorkOrderManage getWorkOrderManage() {
		return workOrderManage;
	}
	public void setWorkOrderManage(WorkOrderManage workOrderManage) {
		this.workOrderManage = workOrderManage;
	}
	@Override
	public String toString() {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("业务流程：中转配送流程 <br/>");
		stringBuilder.append("货物信息：" + workOrderManage.getProduct() + "，目的地："+ workOrderManage.getArrivecity());
		stringBuilder.append(", 数量：" + workOrderManage.getNum() + "<br/>");
		for (TransferInfo transferInfo : transferInfos) {
			stringBuilder.append("[中转环节]:" + transferInfo + "<br/>");
		}
		if(inStore!=null){
			stringBuilder.append("[入库信息]:" + inStore + "<br/>");
		}
		if(outStore!=null){
			stringBuilder.append("[出库信息]:" + outStore + "<br/>");
		}
		if(receiveGoodsInfo!=null){
			stringBuilder.append("[配送签收信息]:" + receiveGoodsInfo + "<br/>");
		}
		return stringBuilder.toString();
	}
	
	
}
