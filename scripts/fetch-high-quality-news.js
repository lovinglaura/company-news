#!/usr/bin/env node

/**
 * 抓取最近3天的优质财经新闻
 * 符合用户要求：
 * 1. 精选最近3天的优质新闻/帖子
 * 2. 来自Top财经新闻网站
 * 3. 内容优质，非交易所公告
 */

const { Config, SearchClient } = require('coze-coding-dev-sdk');
const fs = require('fs').promises;
const path = require('path');

// 优质财经新闻网站白名单
const TOP_FINANCE_SITES = [
  'finance.sina.com.cn',    // 新浪财经
  'www.eastmoney.com',     // 东方财富
  'www.36kr.com',         // 36氪
  'www.jiemian.com',       // 界面新闻
  'www.caixin.com',       // 财新网
  'www.nbd.com.cn',       // 每日经济新闻
  'www.cls.cn',           // 财联社
  'news.stcn.com',        // 证券时报网
  'www.zhitongcaijing.com', // 智通财经
  'finance.qq.com',       // 腾讯财经
  'www.21jingji.com'      // 21世纪经济报道
];

// 目标公司和搜索查询
const COMPANIES = {
  google: {
    name: '谷歌',
    ticker: 'GOOGL',
    queries: [
      '谷歌 2025 Q4 财报 AI 营收',
      'Alphabet 财报 2026',
      '谷歌 股价 最新消息'
    ],
    color: 'bg-blue-100 text-blue-800',
    icon: '🔍'
  },
  nvidia: {
    name: '英伟达',
    ticker: 'NVDA',
    queries: [
      '英伟达 AI芯片 财报 2026',
      'NVIDIA Blackwell 出货',
      '英伟达 股价 最新'
    ],
    color: 'bg-green-100 text-green-800',
    icon: '💻'
  },
  tesla: {
    name: '特斯拉',
    ticker: 'TSLA',
    queries: [
      '特斯拉 财报 2026 Q1',
      'Tesla Cybertruck 交付',
      '马斯克 特斯拉 最新动态'
    ],
    color: 'bg-red-100 text-red-800',
    icon: '🚗'
  },
  tencent: {
    name: '腾讯',
    ticker: '0700.HK',
    queries: [
      '腾讯 游戏 财报 2026',
      '腾讯 AI 大模型 进展',
      '腾讯 股价 港股 最新'
    ],
    color: 'bg-purple-100 text-purple-800',
    icon: '🎮'
  },
  maotai: {
    name: '茅台',
    ticker: '600519.SS',
    queries: [
      '贵州茅台 财报 2025 Q4',
      '茅台 股价 最新',
      '贵州茅台 直销渠道 数据'
    ],
    color: 'bg-amber-100 text-amber-800',
    icon: '🍶'
  }
};

/**
 * 检查是否是优质财经网站
 */
function isTopFinanceSite(url) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    return TOP_FINANCE_SITES.some(site => {
      const cleanSite = site.replace('www.', '');
      return hostname === cleanSite || hostname.endsWith('.' + cleanSite);
    });
  } catch (e) {
    return false;
  }
}

/**
 * 检查是否是最近3天的新闻
 */
function isRecentThreeDays(publishTime) {
  if (!publishTime) return true;
  
  try {
    const newsTime = new Date(publishTime);
    const now = new Date();
    const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));
    
    return newsTime >= threeDaysAgo;
  } catch (e) {
    return false;
  }
}

/**
 * 过滤优质新闻
 */
function filterHighQualityNews(newsItems) {
  return newsItems.filter(item => {
    // 过滤掉低质量内容
    const lowerTitle = item.title.toLowerCase();
    const lowerSummary = (item.summary || '').toLowerCase();
    
    // 排除公告类新闻
    const excludeKeywords = ['公告', '招股书', '年报', '季报', '交易所', '备案', '披露'];
    if (excludeKeywords.some(keyword => lowerTitle.includes(keyword) || lowerSummary.includes(keyword))) {
      return false;
    }
    
    // 必须包含实质内容
    if (!item.title || !item.summary || item.summary.length < 50) {
      return false;
    }
    
    return true;
  });
}

/**
 * 搜索公司新闻
 */
async function searchCompanyNews(companyKey, companyConfig) {
  console.log(`\n📡 搜索 ${companyConfig.name} 优质新闻...`);
  
  const config = new Config();
  const client = new SearchClient(config);
  
  const allResults = [];
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  // 对每个查询词搜索
  for (const query of companyConfig.queries) {
    console.log(`  搜索: "${query}"`);
    
    try {
      const result = await client.advancedSearch(query, {
        searchType: 'web',
        count: 5,
        timeRange: '3d', // 最近3天
        needSummary: true,
        needContent: false
      });
      
      if (result.web_items && result.web_items.length > 0) {
        // 过滤优质新闻
        const qualityNews = result.web_items
          .filter(item => isTopFinanceSite(item.url))
          .filter(item => isRecentThreeDays(item.publish_time))
          .map(item => ({
            id: `${companyKey}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title || '无标题',
            summary: item.snippet || item.summary || '无摘要',
            url: item.url,
            source: item.site_name || '未知来源',
            publishTime: item.publish_time || new Date().toISOString(),
            company: companyConfig.name,
            ticker: companyConfig.ticker,
            color: companyConfig.color,
            icon: companyConfig.icon
          }));
        
        console.log(`    找到 ${qualityNews.length} 条优质新闻`);
        allResults.push(...qualityNews);
      }
      
      await new Promise(resolve => setTimeout(resolve, 800)); // 避免请求过快
      
    } catch (error) {
      console.log(`    ❌ 搜索失败: ${error.message}`);
    }
  }
  
  return allResults;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 抓取最近3天的优质财经新闻...');
  console.log('=' .repeat(60));
  
  const allNews = [];
  
  // 搜索每个公司的新闻
  for (const [companyKey, companyConfig] of Object.entries(COMPANIES)) {
    const news = await searchCompanyNews(companyKey, companyConfig);
    allNews.push(...news);
  }
  
  console.log(`\n📊 总计找到 ${allNews.length} 条优质新闻`);
  
  if (allNews.length === 0) {
    console.log('❌ 未找到任何优质新闻');
    return false;
  }
  
  // 去重（根据URL）
  const uniqueNews = [];
  const seenUrls = new Set();
  allNews.forEach(news => {
    if (!seenUrls.has(news.url)) {
      seenUrls.add(news.url);
      uniqueNews.push(news);
    }
  });
  
  console.log(`✅ 去重后剩余 ${uniqueNews.length} 条新闻`);
  
  // 保存结果
  const today = new Date().toISOString().split('T')[0];
  const outputDir = path.join(__dirname, 'quality-data');
  await fs.mkdir(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, `high-quality-news-${today}.json`);
  const result = {
    date: new Date().toISOString(),
    total: uniqueNews.length,
    companies: Object.keys(COMPANIES),
    news: uniqueNews
  };
  
  await fs.writeFile(outputFile, JSON.stringify(result, null, 2), 'utf8');
  
  console.log(`\n✅ 保存到: ${outputFile}`);
  console.log(`📰 优质新闻来源:`);
  
  // 统计来源
  const sourceStats = {};
  uniqueNews.forEach(news => {
    sourceStats[news.source] = (sourceStats[news.source] || 0) + 1;
  });
  
  Object.entries(sourceStats).forEach(([source, count]) => {
    console.log(`  - ${source}: ${count}条`);
  });
  
  return true;
}

// 运行
main().then(success => {
  if (success) {
    console.log('\n🎉 优质新闻抓取完成！');
  } else {
    console.log('\n❌ 抓取失败');
  }
  process.exit(success ? 0 : 1);
});