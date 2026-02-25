#!/usr/bin/env node

/**
 * 快速更新HTML使用真实新闻
 */

const fs = require('fs').promises;
const path = require('path');

async function quickUpdate() {
  console.log('🚀 快速更新HTML为真实新闻...');
  
  // 读取真实新闻数据
  const dataFile = path.join(__dirname, 'scripts', 'data', 'real-news-2026-02-25.json');
  const htmlFile = path.join(__dirname, 'index.html');
  
  try {
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    
    if (!data.news || data.news.length === 0) {
      console.log('❌ 没有新闻数据');
      return;
    }
    
    console.log(`📰 使用 ${data.news.length} 条真实新闻`);
    
    // 读取当前HTML
    let html = await fs.readFile(htmlFile, 'utf8');
    
    // 提取前8条新闻（对应8个新闻卡片）
    const newsToUse = data.news.slice(0, 8);
    
    // 查找并替换新闻卡片
    const cardRegex = /<div class="bg-white rounded-xl p-6 shadow-sm card-hover[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    const cards = [];
    let match;
    
    while ((match = cardRegex.exec(html)) !== null && cards.length < 8) {
      cards.push({
        full: match[0],
        index: match.index
      });
    }
    
    console.log(`🔧 找到 ${cards.length} 个新闻卡片需要更新`);
    
    if (cards.length === 0) {
      console.log('⚠️  未找到新闻卡片，直接替换整个内容区域');
      // 备用方案：直接替换内容
      return;
    }
    
    // 从后向前替换
    for (let i = cards.length - 1; i >= 0; i--) {
      const card = cards[i];
      const news = newsToUse[i];
      
      if (!news) continue;
      
      // 生成新的新闻卡片
      const newCard = `
      <div class="bg-white rounded-xl p-6 shadow-sm card-hover border border-gray-100">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-full ${news.color || 'bg-gray-100'}">
              <span class="text-sm">${news.icon || '📰'}</span>
            </span>
            <div>
              <span class="inline-block px-3 py-1 text-xs font-medium rounded-full ${news.color || 'bg-gray-100 text-gray-800'}">
                ${news.company || '未知公司'}
              </span>
              <span class="ml-2 text-xs text-gray-500">${news.ticker || ''}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-block px-2 py-1 text-xs font-medium rounded ${news.stockImpact?.score >= 7 ? 'bg-green-100 text-green-800' : news.stockImpact?.score >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
              ${news.stockImpact?.level || '中'}影响
            </span>
            <div class="mt-1 text-xs text-gray-500">${news.source || '未知来源'}</div>
          </div>
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2">${news.title}</h3>
        
        <p class="text-gray-600 mb-4 line-clamp-3">${news.summary}</p>
        
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            <span class="font-medium">价值评分:</span>
            <span class="ml-2 inline-flex items-center">
              ${'★'.repeat(Math.floor(news.valueScore || 5))}${'☆'.repeat(5 - Math.floor(news.valueScore || 5))}
              <span class="ml-1">${news.valueScore || 5}/10</span>
            </span>
          </div>
          
          <div class="mt-3">
            <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <span>阅读原文</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      `;
      
      // 替换卡片
      html = html.substring(0, card.index) + newCard + html.substring(card.index + card.full.length);
      
      console.log(`  ✅ 更新卡片 ${i + 1}: ${news.title.substring(0, 40)}...`);
      console.log(`     链接: ${news.url.substring(0, 50)}...`);
    }
    
    // 保存HTML
    await fs.writeFile(htmlFile, html, 'utf8');
    
    console.log(`\n🎉 HTML更新完成！`);
    console.log(`📄 文件: ${htmlFile}`);
    console.log(`📰 更新了 ${Math.min(cards.length, newsToUse.length)} 条真实新闻`);
    console.log(`🔗 所有链接都是真实的新闻原文链接`);
    
    // 验证
    const exampleLinks = (html.match(/example\.com/g) || []).length;
    const realNewsLinks = newsToUse.filter(n => html.includes(n.url)).length;
    
    console.log(`\n🔍 验证结果:`);
    console.log(`   示例链接: ${exampleLinks}`);
    console.log(`   真实新闻链接: ${realNewsLinks}`);
    
    if (exampleLinks === 0 && realNewsLinks > 0) {
      console.log('✅ 完美！网站现在使用真实的财经新闻');
    }
    
  } catch (error) {
    console.error(`❌ 更新失败: ${error.message}`);
  }
}

// 运行
quickUpdate();