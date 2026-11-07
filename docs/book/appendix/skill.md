# 附录 A · 产品演示官网交付模型

<p class="lead">product-demo-site：做「产品演示官网」这类需求的交付模型。它以 Skill 的形式提供，可以直接交给 Coding Agent 使用。</p>

<a href="/downloads/product-demo-site.zip" download>⬇ 下载 product-demo-site.zip</a>

## 它能做什么

给你的产品做一个「产品演示官网」，核心是**一镜到底地演示产品真实的界面**：

- 首屏一句承诺，下面是产品的一张真实截图；
- 往下滚，镜头在产品的真实界面之间移动、推近、标注，分几幕演示产品如何解决访客认得出的痛点；
- 最后拉远看全貌，收束到一个按钮。

配色和字体来自你的产品，不是某个参考网站。

实际效果见这本小册的[官网](/landing/index.html)，它就是用这个交付模型做的。

## 它怎么工作

它按 AI Native 交付质量三角模型组织，有两道人工闸门：

```text
① 定义正确 ──► 人工闸门 A ──► ② 实现 ──► ③ 验证正确 ──► 人工闸门 B ──► ④ 上线 + 失败可恢复
   BRIEF.md       审 brief        模板        test/verify/看图     按 AC 验收        可回滚 · 回流新 AC
```

| 阶段 | Agent 做什么 | 你做什么 |
| --- | --- | --- |
| 定义正确 | 自己研究产品：截取真实界面、读出品牌配色，起草 BRIEF.md | 审一遍：承诺对不对、场景是不是最想讲的 |
| 实现 | 复制模板，只改文案、分镜数据、画板内容 | — |
| 验证正确 | `pnpm test` / `pnpm build` / `pnpm verify`，再逐张看截图、修问题 | 在真实设备上按验收标准验收 |
| 上线 | 按回滚和抽检清单上线 | 决定是否发布 |

## 目录结构

```text
product-demo-site/
├── SKILL.md                       # 入口：工作流、硬规则、何时不用
├── references/
│   ├── brief-template.md          # 定义正确：brief 模板
│   ├── story-model.md             # 分镜模型：场景、节拍、镜头、画板
│   ├── visual-rules.md            # 视觉规则（每条都附原因）
│   ├── verification.md            # 验证正确：自动检查 + 看图清单 + 人工验收
│   └── launch-and-recover.md      # 失败可恢复：上线、回滚、经验回流
└── template/                      # React + Vite + Tailwind v4 + motion
    ├── src/engine/                # 引擎：时间轴、镜头、零件、舞台、静态版（一般不改）
    ├── scripts/capture.mjs        # 研究产品：真实截图 + 品牌配色 + 元素位置
    ├── src/story/                 # 你的分镜：script.ts / World.tsx / shots.json
    ├── src/content/site.ts        # 首屏、收尾、页脚文案
    └── e2e/verify.mjs             # 自动验收：逐幕截图 + 断言
```

## 怎么安装

解压到 Coding Agent 能读取 Skill 的目录。以 Claude Code 为例：

```bash
# 全局可用
unzip product-demo-site.zip -d ~/.claude/skills/

# 或者只在某个项目里用
unzip product-demo-site.zip -d <你的项目>/.claude/skills/
```

其他 Agent（Codex、OpenCode 等）可以把 `SKILL.md` 的内容作为指令交给它，`template/` 目录直接复制使用。

## 怎么用

对 Agent 说：

> 用 product-demo-site 给我的产品做一个演示官网：https://your-product.com

只有代码库也可以：

> 用 product-demo-site 给这个项目做一个演示官网，代码在 ~/code/my-app。

Agent 会自己去研究产品，起草一份 BRIEF.md 给你审。**在你确认之前，它不会写分镜代码。**

模板的运行环境：Node.js 20 以上，pnpm。`pnpm verify` 需要本机安装 Chrome，没有的话会改用 Playwright 自带的 Chromium（需要先执行 `npx playwright install chromium`）。

## 更多

- 这个交付模型是怎么来的：[第 8 章 · 没有交付模型，从 0 到 1](/book/part-3/08-case-from-zero)
- 用它做小册官网的实录：[第 7 章 · 用现成的交付模型做官网](/book/part-3/07-case-with-skill)
