# 公司新闻动态网站 - 自动化更新配置

## 🎯 目标
每天北京时间早上9:00自动更新公司新闻动态网站

## ⚙️ 技术实现
- **平台**: GitHub Actions
- **触发器**: 定时任务 (Cron)
- **运行时间**: 每天UTC 1:00 (北京时间 9:00)
- **部署目标**: GitHub Pages

## 📋 配置详情

### 1. GitHub Actions Workflow
文件位置: `.github/workflows/update.yml`

```yaml
on:
  schedule:
    # 每天北京时间早上9点运行 (UTC 1:00)
    - cron: '0 1 * * *'
  workflow_dispatch: # 允许手动触发
```

### 2. 执行流程
1. **定时触发** → 每天9:00（北京时间）
2. **环境准备** → Node.js 20 + 依赖安装
3. **新闻抓取** → 使用Coze API搜索30条公司新闻
4. **深度分析** → 对每条新闻进行价值评分和股价影响评估
5. **HTML生成** → 生成美观的响应式网页
6. **自动提交** → 如果有新内容，自动提交到GitHub
7. **页面部署** → 自动部署到GitHub Pages

### 3. 覆盖公司
- **谷歌 (Google)** - GOOGL
- **英伟达 (NVIDIA)** - NVDA  
- **特斯拉 (Tesla)** - TSLA
- **腾讯 (Tencent)** - 0700.HK
- **茅台 (Maotai)** - 600519.SS

### 4. 新闻筛选标准
- **高价值新闻**: 价值评分8-10分，股价影响高
- **推荐新闻**: 价值评分6-7分，股价影响中
- **总数量**: 从30条中筛选8-10条最佳新闻

## 🔧 环境要求

### 1. GitHub Secrets配置
必须配置以下secret：
- `COZE_WORKLOAD_IDENTITY_API_KEY` - Coze API密钥

### 2. 手动触发方式
1. 访问GitHub仓库 → Actions标签页
2. 找到"Update Company News" workflow
3. 点击"Run workflow"按钮

## 📊 监控与维护

### 1. 运行状态检查
- **GitHub Actions**: 查看运行历史和状态
- **网站状态**: 访问 https://lovinglaura.github.io/company-news/
- **更新验证**: 检查页面顶部的"更新时间"

### 2. 故障排查
如果自动化更新失败：
1. **检查API密钥** → 确保GitHub Secrets配置正确
2. **查看日志** → GitHub Actions运行日志
3. **手动测试** → 本地运行 `node scripts/fetch-company-news.js`
4. **检查依赖** → 确保package.json依赖正常

### 3. 成功指标
- ✅ GitHub Actions运行成功
- ✅ 网站更新时间变为当天
- ✅ 新闻内容包含当天的重要公司动态
- ✅ 网站可正常访问

## 🚀 快速开始

### 1. 首次设置
```bash
# 确保API密钥已配置为GitHub Secret
# 手动触发一次测试运行
```

### 2. 日常监控
- 每天9:00后检查网站是否更新
- 查看GitHub Actions运行状态
- 验证新闻内容质量

### 3. 紧急处理
如果9:00未自动更新：
1. 手动触发GitHub Actions
2. 检查API密钥有效期
3. 查看网络连接状态

## 📈 预期效果

### 每日产出
- **8-10条** 精选公司新闻
- **深度分析** 每篇新闻的价值和股价影响
- **美观的HTML页面** 响应式设计，支持手机访问
- **自动部署** 到GitHub Pages

### 时间安排
- **9:00** → 自动化任务开始运行
- **9:05** → 新闻抓取完成
- **9:10** → HTML生成完成  
- **9:15** → 自动提交和部署
- **9:20** → 网站更新完成

## 🔗 相关链接

- **网站URL**: https://lovinglaura.github.io/company-news/
- **GitHub仓库**: https://github.com/lovinglaura/company-news
- **GitHub Actions**: https://github.com/lovinglaura/company-news/actions
- **问题反馈**: GitHub Issues

---

**最后更新**: 2026-02-25  
**配置状态**: ✅ 已就绪  
**下次运行**: 明天（2026-02-26）北京时间 9:00