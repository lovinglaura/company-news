#!/usr/bin/env node

/**
 * 本地测试服务器
 * 用于预览公司新闻网站
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 8766;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const INDEX_FILE = path.join(__dirname, '..', 'index.html');

async function serveFile(filePath, res) {
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    }[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(500);
      res.end('Server error');
    }
  }
}

const server = http.createServer(async (req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // 处理根路径
  if (req.url === '/' || req.url === '/index.html') {
    await serveFile(INDEX_FILE, res);
    return;
  }
  
  // 处理其他静态文件
  const filePath = path.join(PUBLIC_DIR, req.url);
  await serveFile(filePath, res);
});

server.listen(PORT, () => {
  console.log(`🚀 公司新闻网站本地服务器已启动`);
  console.log(`📡 地址: http://localhost:${PORT}`);
  console.log(`⏰ 时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`📁 主文件: ${INDEX_FILE}`);
  console.log(`📁 静态目录: ${PUBLIC_DIR}`);
  console.log('');
  console.log('📋 使用说明:');
  console.log('1. 访问 http://localhost:8766 查看网站');
  console.log('2. 按 Ctrl+C 停止服务器');
  console.log('');
  console.log('🔧 相关命令:');
  console.log('  npm start      - 启动本地服务器');
  console.log('  npm run fetch  - 抓取新闻数据');
  console.log('  npm run generate - 生成HTML页面');
  console.log('  npm run update - 抓取并生成（完整更新）');
});