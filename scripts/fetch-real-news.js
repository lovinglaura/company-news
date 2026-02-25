#!/usr/bin/env node

/**
 * 抓取真实的财经新闻
 * 使用Coze API搜索真实的新闻文章
 */

const { Config, SearchClient } = require('coze-coding-dev-sdk');
const fs = require('fs').promises;
const path = require('path');

// 公司配置 - 使用更精确的财经新闻搜索查询
const COMPANIES = {
  google: {
    name: '谷歌',
    ticker: 'GOOGL',
    queries: [
      'Google 财报 2025 Q4 最新',
      'Alphabet 营收 AI业务 增长',
      '谷歌 股价 最新消息 今天',
      'Google AI产品 发布 新闻'
    ],
    color: 'bg-blue-100 text-blue-800',
    icon: '🔍'
  },
  nvidia: {
    name: '英伟达',
    ticker: 'NVDA',
    queries: [
      'NVIDIA 财报 Q3 2025',
      '英伟达 AI芯片 订单 最新',
      'NVIDIA Blackwell 发布',
      '英伟达 股价 最新消息'
    ],
    color: 'bg-green-100 text-green-800',
    icon: '💻'
  },
  tesla: {
    name: '特斯拉',
    ticker: 'TSLA',
    queries: [
      'Tesla 财报 2025 Q4',
      '特斯拉 自动驾驶 最新进展',
      '马斯克 特斯拉 股价',
      'Tesla Robotaxi 发布'
    ],
    color: 'bg-red-100 text-red-800',
    icon: '🚗'
  },
  tencent: {
    name: '腾讯',
    ticker: '0700.HK',
    queries: [
      '腾讯 财报 2025 Q3',
      '腾讯 游戏 收入 最新',
      '腾讯 AI 业务 进展',
      '腾讯 股价 港股 最新'
    ],
    color: 'bg-purple-100 text-purple-800',
    icon: '🎮'
  },
  maotai: {
    name: '茅台',
    ticker: '600519.SS',
    queries: [
      '贵州茅台 财报 2025',
      '茅台 股价 最新',
      '贵州茅台 白酒 销售',
      '茅台 分红 最新消息'
    ],
    color: 'bg-amber-100 text-amber-800',
    icon: '🍶'
  }
};

// 财经新闻网站白名单
const FINANCE_SITES = [
  'finance.sina.com.cn',
  'www.eastmoney.com',
  'www.36kr.com',
  'www.jiemian.com',
  'www.cs.com.cn',
  'www.stcn.com',
  'www.yicai.com',
  'www.21jingji.com',
  'www.cls.cn',
  'www.nbd.com.cn',
  'www.zhitongcaijing.com',
  'www.caixin.com',
  'www.ce.cn',
  'news.stcn.com',
  'stock.stcn.com'
];

/**
 * 检查是否是财经新闻网站
 */
function isFinanceSite(url, siteName) {
  if (!url) return false;
  
  const urlLower = url.toLowerCase();
  const siteLower = (siteName || '').toLowerCase();
  
  // 检查URL是否包含财经网站域名
  for (const site of FINANCE_SITES) {
    if (urlLower.includes(site) || siteLower.includes(site.replace('www.', '').replace('.com.cn', ''))) {
      return true;
    }
  }
  
  // 检查常见非财经网站（排除）
  const nonFinanceSites = [
    'baike', '百科', 'wikipedia', '微信', 'weixin',
    '360doc', 'doc-view', '查询网', 'ip1138'
  ];
  
  for (const site of nonFinanceSites) {
    if (urlLower.includes(site) || siteLower.includes(site)) {
      return false;
    }
  }
  
  // 如果URL包含news、finance、stock、财经等关键词，认为是财经相关
  const financeKeywords = ['news', 'finance', 'stock', '财经', '经济', '证券', '股市', '股价'];
  for (const keyword of financeKeywords) {
    if (urlLower.includes(keyword) || siteLower.includes(keyword)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 搜索公司新闻
 */
async function searchCompanyNews(companyKey, companyConfig) {
  console.log(`\n📡 搜索 ${companyConfig.name} (${companyConfig.ticker}) 新闻...`);
  
  const config = new Config();
  const client = new SearchClient(config);
  
  const allResults = [];
  
  // 尝试多个查询词
  for (const query of companyConfig.queries.slice(0, 2)) { // 只尝试前2个查询
    console.log(`  搜索: "${query}"`);
    
    try {
      const result = await client.advancedSearch(query, {
        searchType: 'web',
        count: 3, // 每个查询取3条
        timeRange: '7d',
        needSummary: true,
        needContent: false
      });
      
      if (result.web_items && result.web_items.length > 0) {
        // 过滤出财经新闻
        const financeNews = result.web_items.filter(item => 
          item.url && isFinanceSite(item.url, item.site_name)
        );
        
        console.log(`    找到 ${financeNews.length} 条财经新闻`);
        
        // 转换为标准格式
        const formattedNews = financeNews.map((item, index) => ({
          id: `${companyKey}-${Date.now()}-${index}`,
          title: item.title || '无标题',
          summary: item.snippet || item.summary || '无摘要',
          url: item.url,
          source: item.site_name || '未知来源',
          publishTime: item.publish_time || new Date().toISOString(),
          company: companyConfig.name,
          ticker: companyConfig.ticker,
          color: companyConfig.color,
          icon: companyConfig.icon,
          valueScore: 7, // 默认评分
          stockImpact: {
            score: 6,
            level: '中',
            description: '可能对股价有中等影响'
          }
        }));
        
        allResults.push(...formattedNews);
        
        // 显示找到的新闻
        formattedNews.forEach((news, i) => {
          console.log(`    ${i + 1}. ${news.title.substring(0, 40)}...`);
          console.log(`       来源: ${news.source}, URL: ${news.url.substring(0, 50)}...`);
        });
        
      } else {
        console.log(`    未找到相关新闻`);
      }
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`    ❌ 搜索失败: ${error.message}`);
    }
  }
  
  return allResults.slice(0, 4); // 每个公司最多4条
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始抓取真实的财经新闻...');
  console.log('=' .repeat(50));
  
  const allNews = [];
  const today = new Date().toISOString().split('T')[0];
  
  // 抓取每个公司的新闻
  for (const [companyKey, companyConfig] of Object.entries(COMPANIES)) {
    const news = await searchCompanyNews(companyKey, companyConfig);
    allNews.push(...news);
    
    if (news.length > 0) {
      console.log(`✅ 成功获取 ${companyConfig.name} 的 ${news.length} 条新闻`);
    } else {
      console.log(`⚠️  未找到 ${companyConfig.name} 的财经新闻`);
    }
  }
  
  console.log(`\n📊 总计: 找到 ${allNews.length} 条财经新闻`);
  
  if (allNews.length === 0) {
    console.log('❌ 未找到任何财经新闻，使用备选方案');
    return false;
  }
  
  // 保存结果
  const outputDir = path.join(__dirname, 'data');
  await fs.mkdir(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, `real-news-${today}.json`);
  const result = {
    date: new Date().toISOString(),
    total: allNews.length,
    companies: Object.keys(COMPANIES),
    news: allNews
  };
  
  await fs.writeFile(outputFile, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\n✅ 保存到: ${outputFile}`);
  
  // 显示结果摘要
  console.log('\n📰 新闻摘要:');
  allNews.forEach((item, i) => {
    console.log(`\n${i + 1}. [${item.company}] ${item.title.substring(0, 50)}...`);
    console.log(`   来源: ${item.source}`);
    console.log(`   URL: ${item.url.substring(0, 60)}...`);
  });
  
  return true;
}

// 运行主函数
main().catch(error => {
  console.error('❌ 抓取失败:', error.message);
  process.exit(1);
});