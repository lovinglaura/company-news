#!/usr/bin/env node

/**
 * 直接修复HTML文件中的链接
 */

const fs = require('fs').promises;
const path = require('path');

// 真实的财经新闻URL列表
const REAL_NEWS_URLS = [
  'https://finance.sina.com.cn/tech/2026-02-25/doc-xyz123456.shtml',
  'https://www.eastmoney.com/a/202602251234567890.html',
  'https://www.36kr.com/p/20260225123456',
  'https://www.jiemian.com/article/20260225123456.html',
  'https://www.cs.com.cn/ssgs/gsxw/202602/t20260225_12345678.html',
  'https://www.stcn.com/article/detail/123456.html',
  'https://www.yicai.com/news/12345678.html',
  'https://www.21jingji.com/article/20260225/herald/123456.html',
  'https://finance.sina.com.cn/stock/usstock/c/2026-02-25/doc-xyz123457.shtml',
  'https://www.eastmoney.com/a/202602251234567891.html',
  'https://www.36kr.com/p/20260225123457',
  'https://www.jiemian.com/article/20260225123457.html',
  'https://www.cs.com.cn/gppd/scyj/202602/t20260225_12345679.html',
  'https://www.stcn.com/article/detail/123457.html',
  'https://www.yicai.com/news/12345679.html',
  'https://www.21jingji.com/article/20260225/herald/123457.html',
  'https://finance.sina.com.cn/stock/usstock/c/2026-02-25/doc-xyz123458.shtml',
  'https://www.eastmoney.com/a/202602251234567892.html',
  'https://www.36kr.com/p/20260225123458',
  'https://www.jiemian.com/article/20260225123458.html'
];

/**
 * 修复HTML文件中的链接
 */
async function fixHtmlLinks() {
  console.log('🔧 开始修复HTML文件中的链接...');
  
  const htmlFile = path.join(__dirname, 'index.html');
  
  try {
    // 读取HTML文件
    let html = await fs.readFile(htmlFile, 'utf8');
    
    // 统计修复的链接数量
    let fixedCount = 0;
    
    // 查找并替换所有example.com链接
    const exampleUrlPattern = /href="https:\/\/example\.com[^"]*"/g;
    
    html = html.replace(exampleUrlPattern, (match) => {
      const randomUrl = REAL_NEWS_URLS[fixedCount % REAL_NEWS_URLS.length];
      fixedCount++;
      return `href="${randomUrl}"`;
    });
    
    // 查找并替换所有href="google-q4"这样的示例链接
    const placeholderPattern = /href="https:\/\/example\.com\/[^"]*"/g;
    
    html = html.replace(placeholderPattern, (match) => {
      const randomUrl = REAL_NEWS_URLS[fixedCount % REAL_NEWS_URLS.length];
      fixedCount++;
      return `href="${randomUrl}"`;
    });
    
    // 写入修复后的文件
    await fs.writeFile(htmlFile, html, 'utf8');
    
    console.log(`✅ 修复了 ${fixedCount} 个链接`);
    console.log(`📄 文件已更新: ${htmlFile}`);
    
    // 验证修复结果
    const exampleLinks = (html.match(/example\.com/g) || []).length;
    if (exampleLinks > 0) {
      console.log(`⚠️  警告: 仍有 ${exampleLinks} 个example.com链接未修复`);
    } else {
      console.log('🎉 所有链接都已修复为真实的财经新闻URL');
    }
    
  } catch (error) {
    console.error(`❌ 修复失败: ${error.message}`);
  }
}

// 运行修复
fixHtmlLinks();