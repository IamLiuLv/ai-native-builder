# 成为 AI Native Builder

一本开源的小册，讲怎么让 AI 交付的东西质量过关。

> AI Native Builder：一个人 + AI，用 AI 原生的方式，构建从需求到交付的完整闭环。

- **在线阅读**：[iamlv.cn](https://iamlv.cn)（强烈建议从头读到尾，大约 1 小时）
- **小册官网**：[iamlv.cn/landing](https://iamlv.cn/landing/)
- **交个朋友**：[iamlv.cn/friends](https://iamlv.cn/friends)
- **GitHub**：[github.com/IamLiuLv/ai-native-builder](https://github.com/IamLiuLv/ai-native-builder)，觉得有用的话点个 Star，不迷路

这本小册只回答三个问题：

| 部分 | 回答的问题 |
| --- | --- |
| 第一部分 · 是什么 | AI Native Builder 是什么？「AI 原生」原生在哪里？ |
| 第二部分 · 为什么 | 人人都在用 AI，为什么团队没变快？为什么说成为 AI Native Builder 是必然？ |
| 第三部分 · 怎么成为 | AI Native 交付质量三角模型：定义正确、验证正确、失败可恢复；一个官网的两种做法：用现成的交付模型 vs 从 0 到 1 |

## 配套 Skill

仓库里有两个 Skill，都可以直接交给 Claude Code、Codex、OpenCode 等 Coding Agent 使用。

### 小册答疑：ai-native-builder-tutor

读小册时有问题，直接问它。它会结合小册原文回答，**每个结论都附上 iamlv.cn 上对应小节的链接**；小册没讲到的，如实告诉你，并引导你联系作者。想系统地学，也可以让它一课一课地带你读（带练习、记学习进度）。

最省事的方式：把下面这句话贴给你的 Agent，它会按 [install-tutor.md](install-tutor.md) 自己装好：

```text
阅读 https://github.com/IamLiuLv/ai-native-builder/blob/main/install-tutor.md ，按步骤把小册答疑 Skill 安装到我的全局环境。
```

也可以手动安装：

```bash
# 方式一：克隆这个仓库后复制
git clone https://github.com/IamLiuLv/ai-native-builder.git
cp -r ai-native-builder/skills/ai-native-builder-tutor ~/.claude/skills/

# 方式二：从小册网站下载
curl -LO https://iamlv.cn/downloads/ai-native-builder-tutor.zip
unzip ai-native-builder-tutor.zip -d ~/.claude/skills/
```

然后在 Claude Code 里问：

```text
用 ai-native-builder-tutor 回答：AI 说它做完了，我怎么知道它真的做对了？

用 ai-native-builder-tutor 带我读这本小册。我是后端，想一个人把一个小产品从需求做到上线。
```

读者最常问的问题整理在 [skills/ai-native-builder-tutor/references/faq.md](skills/ai-native-builder-tutor/references/faq.md)。详细介绍见小册[附录 D](https://iamlv.cn/book/appendix/ask)。

### 产品演示官网交付模型：product-demo-site

第 7、8 章的交付模型。给它一个产品链接或代码库，它会研究产品、截取真实界面、起草方案、逐幕验证，做出一个一镜到底的产品演示官网。这本小册的官网就是用它做的。见小册[附录 A](https://iamlv.cn/book/appendix/skill)。

## 部署

推送到 `main` 后，GitHub Actions 会自动构建 `docs/.vitepress/dist`，完整同步到阿里云 OSS 的 `lv-profile` Bucket，并清理旧对象。

首次启用前，需要在仓库 Actions Secrets 中配置 `OSS_ACCESS_KEY_ID` 和 `OSS_ACCESS_KEY_SECRET`。本地部署命令、增量覆盖与完整清理的区别见 [deploy/README.md](deploy/README.md)。

## 协议

[MIT](LICENSE) © 2026 lv.liu
