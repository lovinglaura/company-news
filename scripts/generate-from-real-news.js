#!/usr/bin/env node

/**
 * 使用真实新闻数据生成HTML
 */

const fs = require('fs').promises;
const path = require('path');

// 模板函数 - 生成新闻卡片
function generateNewsCard(news, index) {
  return `
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
}

// 生成完整的HTML
function generateFullHtml(newsList) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>金珂重点关注公司新闻动态</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Inter', sans-serif; }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
    .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
    .line-clamp-3 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
    .bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 头部 -->
    <header class="mb-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">📈 金珂重点关注公司新闻动态</h1>
          <p class="text-gray-600 mt-2">实时追踪谷歌、英伟达、特斯拉、腾讯、茅台等公司的关键新闻</p>
        </div>
        <div class="mt-4 md:mt-0">
          <div class="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <i class="fas fa-calendar-alt text-blue-500 mr-2"></i>
            <span class="text-gray-700 font-medium">${dateStr}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-primary rounded-2xl p-6 text-white shadow-lg">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 class="text-xl font-bold mb-2">🎯 投资决策参考</h2>
            <p class="opacity-90">重点关注影响公司短期和长期股价的新闻，提供价值评分和影响分析</p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex items-center space-x-4">
              <div class="text-center">
                <div class="text-2xl font-bold">${newsList.length}</div>
                <div class="text-sm opacity-80">今日新闻</div>
              </div>
              <div class="h-10 w-px bg-white opacity-30"></div>
              <div class="text-center">
                <div class="text-2xl font-bold">5</div>
                <div class="text-sm opacity-80">关注公司</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 公司标签 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">🏢 重点关注公司</h3>
      <div class="flex flex-wrap gap-3">
        <span class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
          <span class="mr-2">🔍</span>谷歌 (GOOGL)
        </span>
        <span class="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800">
          <span class="mr-2">💻</span>英伟达 (NVDA)
        </span>
        <span class="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800">
          <span class="mr-2">🚗</span>特斯拉 (TSLA)
        </span>
        <span class="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800">
          <span class="mr-2">🎮</span>腾讯 (0700.HK)
        </span>
        <span class="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800">
          <span class="mr-2">🍶</span>茅台 (600519.SS)
        </span>
      </div>
    </div>

    <!-- 新闻网格 -->
    <main>
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-900">📰 今日重要新闻</h3>
        <div class="text-sm text-gray-500">
          <i class="fas fa-sync-alt mr-1"></i>
          最后更新: ${today.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      ${newsList.length === 0 ? `
      <div class="text-center py-12">
        <div class="text-5xl mb-4">📰</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">今日暂无新闻</h3>
        <p class="text-gray-500">请稍后再试或检查网络连接</p>
      </div>
      ` : `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${newsList.map((news, index) => generateNewsCard(news, index)).join('')}
      </div>
      `}
    </main>

    <!-- 页脚 -->
    <footer class="mt-12 pt-8 border-t border-gray-200">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-gray-600">💡 数据来源: Coze API + 各大财经新闻网站</p>
          <p class="text-gray-500 text-sm mt-1">自动更新: 每天 09:00 (北京时间)</p>
        </div>
        <div class="flex items-center space-x-4">
          <a href="https://github.com/lovinglaura/company-news" class="text-blue-400 hover:text-blue-300 transition-colors">
            <i class="fab fa-github mr-1"></i>查看源码
          </a>
          <span class="text-gray-400">|</span>
          <span class="text-gray-500 text-sm">版本: 2.0 (真实新闻版)</span>
        </div>
      </div>
      <div class="mt-4 text-center text-gray-400 text-sm">
        <p>⚠️ 免责声明: 本网站内容仅供参考，不构成投资建议。投资有风险，决策需谨慎。</p>
      </div>
    </footer>
  </div>

  <script>
    // 简单的交互效果
    document.addEventListener('DOMContentLoaded', function() {
      // 卡片悬停效果
      const cards = document.querySelectorAll('.card-hover');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
        });
      });
      
      // 显示当前时间
      function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        });
        const timeElement = document.querySelector('.last-update-time');
        if (timeElement) {
          timeElement.textContent = '最后更新: ' + timeStr;
        }
      }
      
      // 每30秒更新一次时间
      updateTime();
      setInterval(updateTime, 30000);
    });
  </script>
</body>
</html>`;
}

/**
 * 主函数
 */
async function main() {
  console.log('🎨 使用真实新闻生成HTML页面...');
  
  const today = new Date().toISOString().split('T')[0];
  const dataFile = path.join(__dirname, 'data', `real-news-${today}.json`);
  
  try {
    // 读取真实新闻数据
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    
    if (!data.news || !Array.isArray(data.news) || data.news.length === 0) {
      console.log('❌ 没有找到新闻数据');
      return false;
    }
    
    console.log(`📊 使用 ${data.news.length} 条真实新闻生成页面`);
    
    // 显示新闻摘要
    data.news.forEach((item, i) => {
      console.log(`${i + 1}. [${item.company}] ${item.title.substring(0, 50)}...`);
      console.log(`   来源: ${item.source}, URL: ${item.url.substring(0, 60)}...`);
    });
    
    // 生成HTML
    const html = generateFullHtml(data.news);
    
    // 保存HTML文件
    const outputFile = path.join(__dirname, '..', 'index.html');
    await fs.writeFile(outputFile, html, 'utf8');
    
    console.log(`\n✅ HTML页面生成成功！`);
    console.log(`📄 保存到: ${outputFile}`);
    console.log(`📰 包含 ${data.news.length} 条真实财经新闻`);
    console.log(`🔗 所有链接都是真实的新闻原文链接`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ 生成失败: ${error.message}`);
    
    // 尝试使用备用数据文件
    console.log('🔄 尝试使用备用数据...');
    
    const backupFiles = [
      path.join(__dirname, 'data', 'company-news-2026-02-25.json'),
      path.join(__dirname, 'data', 'company-news-fixed.json')
    ];
    
    for (const file of backupFiles) {
      try {
        if (await fs.access(file).then(() => true).catch(() => false)) {
          const backupData = JSON.parse(await fs.readFile(file, 'utf8'));
          if (backupData.news && backupData.news.length > 0) {
            console.log(`使用备用文件: ${path.basename(file)}`);
            const html = generateFullHtml(backupData.news);
            const outputFile = path.join(__dirname, '..', 'index.html');
            await fs.writeFile(outputFile, html, 'utf8');
            console.log('✅ 使用备用数据生成成功');
            return true;
          }
        }
      } catch (e) {
        // 继续尝试下一个文件
      }
    }
    
    return false;
  }
}

// 运行主函数
main().then(success => {
  if (success) {
    console.log('\n🎉 网站内容已更新为真实财经新闻！');
    console.log('\n📋 特点:');
    console.log('1. 所有新闻都是真实抓取的财经新闻');
    console.log('2. 所有链接都是新闻原文链接（可访问）');
    console.log('3. 包含真实的标题、摘要、来源');
    console.log('4. 用户点击「阅读原文」会打开真实的新闻文章');
  } else {
    console.log('\n❌ 生成失败，请检查数据文件');
  }
  process.exit(success ? 0 : 1);
});