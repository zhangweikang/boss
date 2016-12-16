package cn.itcast.bos.dao.qp.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.lucene.index.Term;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.WildcardQuery;
import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.util.Version;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.FullTextQuery;
import org.hibernate.search.jpa.impl.FullTextEntityManagerImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.wltea.analyzer.lucene.IKAnalyzer;

import cn.itcast.bos.domain.qp.WorkOrderManage;

// 自定义 Spring Data 实现类 ，不需要 写implements 
// 原理 <jpa:repositories base-package="cn.itcast.bos.dao" /> 被扫描到 ，以Impl结尾的类 
public class WorkOrderManageDAOImpl {
	@PersistenceContext
	// 注入 实体管理器
	private EntityManager entityManager;

	// 调用hibernate search 搜索索引库， 通过索引库 返回id 查询数据库 
	public Page<WorkOrderManage> findDataByLucene(Pageable pageable, String conditionName, String conditionValue) throws Exception{
		// 1、 lucene 的 Query 
		// 根据数据库 词条查询 
		// 第一种情况 ，输入很长内容，分词搜索
		QueryParser queryParser = new QueryParser(Version.LUCENE_31, conditionName, new IKAnalyzer());
		Query query1 = queryParser.parse(conditionValue);
		// 第二种情况，输入 单词一部分 
		Query query2 = new WildcardQuery(new Term(conditionName, "*"+conditionValue+"*"));
		// 将query1 和 query2 合并为一个Query 
		BooleanQuery query = new BooleanQuery();
		query.add(query1, Occur.SHOULD); // or 关系
		query.add(query2, Occur.SHOULD);
		
		// 2、 使用EntityManager 构造 全文检索 FullTextEntityManager
		FullTextEntityManager fullTextEntityManager = new FullTextEntityManagerImpl(entityManager);
		
		// 3、 基于 lucene的Query 构造 全文检索 FullTextQuery 
		FullTextQuery fullTextQuery= fullTextEntityManager.createFullTextQuery(query, WorkOrderManage.class);
		
		// 4、 执行搜索 
		long total = fullTextQuery.getResultSize(); // 搜索索引库 
		fullTextQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
		fullTextQuery.setMaxResults(pageable.getPageSize());
		List<WorkOrderManage> rows = fullTextQuery.getResultList(); // 根据id 查询数据库
		
		return new PageImpl<WorkOrderManage>(rows, pageable, total); 
	}
}
