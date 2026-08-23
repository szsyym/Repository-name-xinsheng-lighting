# XINSHERN Lighting Website + Supabase CMS

完整的灯具外贸官网源码，技术栈：Next.js 14、TypeScript、Tailwind CSS、Supabase、GitHub、Vercel。

## 已完成功能

- Kimi 米白＋橙色科技风首页，响应式手机适配
- Home、Products、Product Detail、About、Factory、FAQ、Scenes、News、Contact
- 产品一级/二级分类导航
- 单产品最多 8 个图片或视频
- 产品 Features、Specifications、9 项 Packing Size、Parts List、Product FAQ、YouTube 视频链接
- Supabase 邮箱密码后台登录
- 后台管理 Home / About / Factory 文本及图片视频
- 后台管理首页轮播、客户合影、客户 Logo、场景图片视频、Factory Gallery
- 后台产品、News、询盘管理
- 后台报价数据库和完整 CSV 导出（9 项 Packing Size 不丢失）
- 没有连接 Supabase 时自动显示演示内容，方便先预览

## 本地启动

```bash
npm install
cp .env.example .env.local
npm run dev
```

浏览器打开 `http://localhost:3000`。

后台地址：`http://localhost:3000/admin/login`

完整部署步骤请看 `部署说明-中文.md`。
