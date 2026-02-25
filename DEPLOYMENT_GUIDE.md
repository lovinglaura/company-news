# 公司新闻网站部署指南

## 🚀 快速部署步骤

### 步骤1：推送代码到GitHub
```bash
# 克隆空仓库
git clone https://github.com/lovinglaura/company-news.git
cd company-news

# 复制项目文件（从 workspace/company-news-clean/ 复制）
cp -r /workspace/projects/workspace/company-news-clean/* .
cp -r /workspace/projects/workspace/company-news-clean/.github .
cp -r /workspace/projects/workspace/company-news-clean/.gitignore .

# 提交并推送
git add .
git commit -m "Initial commit: 金珂重点关注公司新闻动态网站"
git push origin main
```

### 步骤2：启用GitHub Pages
1. 访问仓库：https://github.com/lovinglaura/company-news
2. 点击 **Settings** → **Pages**
3. 在 **Source** 选择：
   - Branch: `main` (或 `master`)
   - Folder: `/ (root)`
4. 点击 **Save**
5. 等待1-2分钟，网站即可访问：
   - https://lovinglaura.github.io/company-news/

### 步骤3：配置GitHub Secrets（可选，用于自动更新）
1. 访问仓库：https://github.com/lovinglaura/company-news
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下Secrets：

#### 必需（用于新闻搜索）：
- **Name**: `COZE_WORKLOAD_IDENTITY_API_KEY`
- **Value**: `ZElIRmpqUlFTRFRiQlZNRFhHVEt0SFMwZFhlSGhIRnE6b2NmSU5IZUVpbWVxcDloNUFVUVdrYTJHajdoRUpadm1BU1o0ZFRRSEFlYmVQY0pOazU4QUlBZmh3ZzZITlo1eA==`

#### 可选（用于更好的自动化）：
- **Name**: `GITHUB_TOKEN`
- **Value**: （GitHub会自动提供）

### 步骤4：测试网站
1. 访问：https://lovinglaura.github.io/company-news/
2. 应该看到公司新闻网站
3. 页面显示"更新时间"和精选新闻

### 步骤5：测试自动化更新
1. 访问仓库：https://github.com/lovinglaura/company-news
2. 点击 **Actions** 标签
3. 找到 "Update Company News" 工作流
4. 点击 **Run workflow** → **Run workflow**
5. 等待运行完成（约1-2分钟）
6. 刷新网站查看更新

## 🔧 功能验证

### 验证1：本地运行测试
```bash
cd company-news
npm install
node generate-company-html.js
```

应该看到：
```
🔨 生成公司新闻动态HTML...
✅ HTML生成成功: index.html
📊 总条数: 10
⏰ 时间: 2026/2/24 11:23:23
```

### 验证2：API连接测试
```bash
node scripts/fetch-company-news.js
```

应该看到新闻抓取过程。

### 验证3：网站功能测试
1. 响应式设计：在不同设备上测试
2. 新闻分类：5家公司分类显示
3. 价值评分：8-10分高价值新闻标识
4. 股价影响：高/中/低影响级别显示

## ⚙️ 自动化配置

### GitHub Actions工作流
- **触发时间**：每天UTC 1:00（北京时间9:00）
- **执行步骤**：
  1. 检查代码
  2. 安装依赖
  3. 抓取新闻
  4. 生成HTML
  5. 提交推送
  6. 部署到GitHub Pages

### 手动触发
如果需要立即更新：
1. 访问仓库 Actions 页面
2. 点击 "Update Company News"
3. 点击 "Run workflow"

## 🐛 故障排除

### 问题1：网站显示404
- 检查GitHub Pages是否启用
- 检查分支和文件夹设置
- 等待1-2分钟缓存更新

### 问题2：自动化更新失败
- 检查GitHub Secrets配置
- 查看Actions运行日志
- 确认API密钥有效

### 问题3：新闻抓取失败
- 检查网络连接
- 验证API密钥权限
- 查看错误日志

### 问题4：HTML生成错误
- 检查数据文件格式
- 验证脚本依赖
- 查看控制台输出

## 📞 支持

如果遇到问题：
1. 查看GitHub Actions运行日志
2. 检查仓库Issues
3. 联系技术支持

## 🎉 部署完成标志

成功部署后：
- ✅ 网站可访问：https://lovinglaura.github.io/company-news/
- ✅ 页面显示最新更新时间
- ✅ 包含5家公司新闻
- ✅ GitHub Actions工作流正常运行
- ✅ 每天9:00自动更新

---

**部署时间**：2026年2月24日  
**项目版本**：v1.0.0  
**维护者**：金珂