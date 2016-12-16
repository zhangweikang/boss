package cn.itcast.bos.domain.bc;

// Generated 2015-3-7 10:34:14 by Hibernate Tools 3.2.2.GA

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.struts2.json.annotations.JSON;
import org.hibernate.annotations.GenericGenerator;

/**
 * Subarea generated by hbm2java
 */
@Entity
@Table(name = "BC_SUBAREA", schema = "ceshi")
public class Subarea implements java.io.Serializable {

	private String id;
	private DecidedZone decidedZone;
	private Region region;
	private String addresskey;
	private String startnum;
	private String endnum;
	private Character single;
	private String position;
	
	@Transient
	public String getSubareaId(){
		return id ;
	}

	public Subarea() {
	}

	public Subarea(DecidedZone decidedZone, Region region, String addresskey, String startnum, String endnum, Character single, String position) {
		this.decidedZone = decidedZone;
		this.region = region;
		this.addresskey = addresskey;
		this.startnum = startnum;
		this.endnum = endnum;
		this.single = single;
		this.position = position;
	}

	@Id
	@Column(name = "ID", unique = true, nullable = false, length = 32)
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "DECIDEDZONE_ID")
	@JSON(serialize=false)
	public DecidedZone getDecidedZone() {
		return this.decidedZone;
	}

	public void setDecidedZone(DecidedZone decidedZone) {
		this.decidedZone = decidedZone;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "REGION_ID")
	public Region getRegion() {
		return this.region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

	@Column(name = "ADDRESSKEY", length = 100)
	public String getAddresskey() {
		return this.addresskey;
	}

	public void setAddresskey(String addresskey) {
		this.addresskey = addresskey;
	}

	@Column(name = "STARTNUM", length = 30)
	public String getStartnum() {
		return this.startnum;
	}

	public void setStartnum(String startnum) {
		this.startnum = startnum;
	}

	@Column(name = "ENDNUM", length = 30)
	public String getEndnum() {
		return this.endnum;
	}

	public void setEndnum(String endnum) {
		this.endnum = endnum;
	}

	@Column(name = "SINGLE", length = 1)
	public Character getSingle() {
		return this.single;
	}

	public void setSingle(Character single) {
		this.single = single;
	}

	@Column(name = "POSITION")
	public String getPosition() {
		return this.position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

}
