# XINSHERN Lighting Website + AI/SEO CMS V3

完整的灯具外贸官网源码，技术栈：Next.js 14、TypeScript、Tailwind CSS、Supabase、GitHub、Vercel。

## 已完成功能

- Kimi 米白＋橙色科技风首页，响应式手机适配
- Home、Products、Product Detail、About、Factory、FAQ、独立 Scenes、News、Contact
- 后台可新增产品一级分类，不限制原有 8 个分类
- 单产品最多 8 个图片或视频
- 产品详情采用“左侧图库＋右侧 Features/询盘/视频＋参数表＋Packing/Package/Q&A”布局
- 产品 Features、Specifications、9 项 Packing Size、Parts List、Product FAQ、YouTube 视频链接
- Supabase 邮箱密码后台登录
- 后台管理 Home / About / Factory 文本及图片视频
- 首页支持 2–3 张大背景轮播图
- 后台独立管理并发布客户合影、合作客户 Logo
- 后台管理首页轮播、场景图片视频、Factory Gallery
- 后台产品、News、询盘管理
- 后台报价数据库和带格式、公式、合并标题、筛选的 Excel 导出（9 项 Packing Size 不丢失）
- 后台可编辑 Solutions、Knowledge Base、全局 FAQ、案例、SEO、AI Summary 和企业实体
- 自动生成 Product / Organization / FAQ / Breadcrumb 结构化数据、Sitemap、Robots、Canonical、Open Graph 和 llms.txt
- 后台上传 Catalog PDF，首页画册按钮自动更新
- 没有连接 Supabase 时自动显示演示内容，方便先预览

## 本地启动

```bash
npm install
cp .env.example .env.local
npm run dev
```

浏览器打开 `http://localhost:3000`。

后台地址：`http://localhost:3000/admin/login`

完整部署步骤请看 `部署说明-V3.md`。

## 已部署旧版本的更新方法

先在 Supabase SQL Editor 运行一次 `supabase/update-v3.sql`，再将新版代码提交到 GitHub。Vercel 会自动重新部署。
