# OSS 自动部署

`pnpm build` 会先生成落地页，再生成完整的 VitePress 站点。部署产物目录是：

```text
docs/.vitepress/dist
```

## GitHub Actions

[`.github/workflows/deploy-oss.yml`](../.github/workflows/deploy-oss.yml) 会在以下场景运行：

- 推送到 `main`（包括合并 PR 后）
- 在 Actions 页面手动触发 `workflow_dispatch`

CI 上传成功后会清理 Bucket 根目录中本次构建不再存在的对象，让线上内容与 `docs/.vitepress/dist` 保持一致。

首次使用前，在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 中添加：

- `OSS_ACCESS_KEY_ID`
- `OSS_ACCESS_KEY_SECRET`

Bucket、地域和 Clarity 项目 ID 已写在仓库配置里，不需要额外设置。建议使用只拥有 `lv-profile` Bucket 读写权限的 RAM 用户，不要使用主账号 AccessKey。

## 本地部署

```bash
OSS_REGION=oss-cn-beijing \
OSS_BUCKET=lv-profile \
OSS_ACCESS_KEY_ID=... \
OSS_ACCESS_KEY_SECRET=... \
pnpm deploy:oss
```

默认行为与原 `deploy.js` 一致：逐个上传并覆盖同名对象，不删除 Bucket 里的其他文件。需要让 Bucket 根目录与构建产物完全一致时，可以加 `--delete`：

```bash
pnpm deploy:oss -- --delete
```

该参数会在上传成功后删除本次构建不再存在的旧对象，执行前务必确认该 Bucket 根目录只托管这个站点。

构建完成后，`deploy/create-clean-url-aliases.mjs` 会为 `/book/outline` 这类 clean URL 生成不带 `.html` 后缀的 HTML 别名。OSS 静态托管本身不会自动把扩展名省略的路径映射到 `.html` 文件；缺少这一步时，站内跳转正常，但直接刷新章节页会返回 404。

`docs/.vitepress/dist/index.html` 和 `docs/.vitepress/dist/landing/index.html` 都应包含 Clarity 项目 ID `za8e2uieao`。CI 会在上传前检查这两处，检查不通过时不会发布。
