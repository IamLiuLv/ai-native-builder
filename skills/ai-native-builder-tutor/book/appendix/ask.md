# 附录 D · 小册答疑 Skill

<p class="lead">ai-native-builder-tutor：把这本小册装进你的 Coding Agent。读的时候有问题，直接问它；它会结合小册原文回答，并告诉你答案在哪一节。</p>

<a href="/downloads/ai-native-builder-tutor.zip" download>⬇ 下载 ai-native-builder-tutor.zip</a> · <a href="https://github.com/IamLiuLv/ai-native-builder/tree/main/skills/ai-native-builder-tutor" target="_blank">在 GitHub 上查看</a>

## 它能做什么

**1. 答疑：每个回答都有出处。**

问它一个问题，它会先去小册里找答案，再用三段回答你：

- **结论**：一两句话说清楚；
- **小册里怎么说**：引用原文的关键句，附上对应小节的链接，比如 [第 6 章 · 第一条边：定义正确](/book/part-3/06-triangle#第一条边-定义正确)，点开就能读上下文；
- **接着读**：下一步该读哪一节，或者留一个小问题让你自己想一想。

小册里没讲到的，它会直接说「小册里没有讲到」，不会编；和你自己的项目强相关、需要真实经验判断的问题，它会把你引到[作者这里](/friends)。

**2. 带读：按你的目标，一课一课地学。**

如果你不只是想查一个答案，而是想真正掌握这套方法，可以让它带你读。它参考了 [mattpocock/skills 的 teach](https://github.com/mattpocock/skills/blob/main/skills/productivity/teach/SKILL.md) 的做法：

- 先问清楚你**为什么**想学（比如「团队用了 AI 但交付没变快」「想一个人做完一个产品」），后面每一课都围绕这个目标；
- 每一课只讲一个点，读完马上做一道题或一个小练习，**靠回忆，而不是重读**来巩固；
- 你学过什么、卡在哪里，都会记在本地的学习记录里，下一次从你「跳一跳够得着」的地方接着讲。

**3. 搭三角：帮你为自己的需求搭一个三角模型。**

把你手上的真实需求描述清楚交给它，它会基于小册里的方法，判断这个需求该用多重的三角、最快的路径是什么；有不清楚的地方先问你，需要小册之外的知识时去查资料补上。最后给你这个需求的验收标准、验证方式和回滚方案。提示词模板见[第 9 章 · 第一条路](/book/part-3/09-two-roads#第一条路-自己摸索-让-ai-辅助你来做)。

## 怎么安装

最省事的方式：把下面这句话贴给你的 Agent（Claude Code、Codex、OpenCode 等），它会按 [install-tutor.md](https://github.com/IamLiuLv/ai-native-builder/blob/main/install-tutor.md) 自己装好：

```text
阅读 https://github.com/IamLiuLv/ai-native-builder/blob/main/install-tutor.md ，按步骤把小册答疑 Skill 安装到我的全局环境。
```

也可以手动安装，以 Claude Code 为例：

```bash
# 方式一：从 GitHub 仓库复制
git clone https://github.com/IamLiuLv/ai-native-builder.git
cp -r ai-native-builder/skills/ai-native-builder-tutor ~/.claude/skills/

# 方式二：从小册网站下载
curl -LO https://iamlv.cn/downloads/ai-native-builder-tutor.zip
unzip ai-native-builder-tutor.zip -d ~/.claude/skills/
```

其他 Agent 如果不支持 Skill 目录，可以把 `SKILL.md` 的内容作为指令交给它，`book/` 目录就是小册的全文。

Skill 里自带一份小册全文，不联网也能回答；给出的链接都指向 [iamlv.cn](https://iamlv.cn) 上对应的小节。

## 怎么用

直接问：

> 用 ai-native-builder-tutor 回答：人人都在用 AI，为什么团队没变快？

> AI 说它做完了，我怎么知道它真的做对了？

> 我只是加一个导出按钮，也要走一遍三角模型吗？

让它带你读：

> 用 ai-native-builder-tutor 带我读这本小册。我是后端，想一个人把一个小产品从需求做到上线。

## 一个例子

> **问**：AI 写的验收标准看起来挺全的，为什么还要人一条条审？
>
> **答**：
>
> **结论**：AI 写的验收标准往往看起来很完整，却会漏掉真实用户最常遇到的场景。它没写，不是因为它笨，而是因为它不在你的场景里。
>
> **小册里怎么说**：第 6 章用「上传头像」举例：AI 会写出「上传成功、格式不对、没登录」这几条，却漏了「手机原图十几 MB」「地铁里上传到一半网断了」。把这些场景补进验收标准，是人的工作。
> 出处：[第 6 章 · 第一条边：定义正确](/book/part-3/06-triangle#第一条边-定义正确)
>
> **接着读**：验收标准写好之后，靠什么证明 AI 做对了？见 [第二条边：验证正确](/book/part-3/06-triangle#第二条边-验证正确)。
> 先想一想：你手上正在做的需求里，有没有一个「AI 不在场景里」的情况？

## 常见问题清单

Skill 里整理了一份读者最常问的问题，每个问题都对应到小册的具体小节，见 Skill 目录下的 `references/faq.md`。比如：

- AI Native Builder 和全栈工程师有什么区别？
- 会用 Claude Code 写代码，算不算 AI Native Builder？
- AI 会不会取代程序员？应届生还有机会吗？
- 小需求也要走全套三角吗？
- 没有现成的交付模型，怎么从 0 到 1 搭？
