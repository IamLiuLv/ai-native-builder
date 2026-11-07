# 安装《成为 AI Native Builder》小册答疑 Skill

> 这份文件是写给 Coding Agent（Claude Code、Codex、OpenCode 等）看的安装说明。
> 读者只需要对自己的 Agent 说：「阅读 https://github.com/IamLiuLv/ai-native-builder/blob/main/install-tutor.md ，按步骤把小册答疑 Skill 安装到我的全局环境。」

你是一个 Coding Agent。请按下面的步骤，把 `ai-native-builder-tutor` 这个 Skill 安装到用户的**全局** Skill 目录，让用户在任何项目里都能用它来学习《成为 AI Native Builder》这本小册。

## 1. 确定全局 Skill 目录

按你自己是哪个 Agent 来选：

| Agent | 全局 Skill 目录 |
| --- | --- |
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.codex/skills/` |
| 其他支持 Skill 目录的 Agent | 你自己文档里规定的全局 Skill 目录 |

如果你不支持 Skill 目录，跳到第 5 步。

## 2. 下载并解压

从 GitHub 仓库下载（推荐），Skill 在仓库的 `skills/ai-native-builder-tutor/` 目录下：

```bash
SKILLS_DIR="$HOME/.claude/skills"   # 按第 1 步换成你的目录
TMP_DIR="$(mktemp -d)"
curl -fsSL https://github.com/IamLiuLv/ai-native-builder/archive/refs/heads/main.tar.gz -o "$TMP_DIR/repo.tar.gz"
tar -xzf "$TMP_DIR/repo.tar.gz" -C "$TMP_DIR"
mv "$TMP_DIR"/ai-native-builder-main/skills/ai-native-builder-tutor "$TMP_DIR/"
```

GitHub 访问不了时，改用小册网站的压缩包：

```bash
curl -fsSL https://iamlv.cn/downloads/ai-native-builder-tutor.zip -o "$TMP_DIR/tutor.zip"
unzip -q "$TMP_DIR/tutor.zip" -d "$TMP_DIR"
```

两种方式都应该在 `$TMP_DIR` 下得到一个 `ai-native-builder-tutor/` 目录，里面有 `SKILL.md`、`references/` 和 `book/`。如果不是这个结构，停下来告诉用户，不要继续。

## 3. 安装（已经装过就是更新）

```bash
mkdir -p "$SKILLS_DIR"
# 已经装过：先备份旧版本，再替换
if [ -d "$SKILLS_DIR/ai-native-builder-tutor" ]; then
  mv "$SKILLS_DIR/ai-native-builder-tutor" "$SKILLS_DIR/ai-native-builder-tutor.bak.$(date +%Y%m%d%H%M%S)"
fi
mv "$TMP_DIR/ai-native-builder-tutor" "$SKILLS_DIR/"
rm -rf "$TMP_DIR"
```

只动 `ai-native-builder-tutor` 这一个目录，不要改用户的其他 Skill 或配置文件。

## 4. 检查

```bash
test -f "$SKILLS_DIR/ai-native-builder-tutor/SKILL.md" && ls "$SKILLS_DIR/ai-native-builder-tutor"
```

能看到 `SKILL.md`、`references`、`book`，就装好了。

## 5. 不支持 Skill 目录时

把 Skill 下载到 `~/ai-native-builder-tutor/`（步骤同上，目录换掉），然后告诉用户：以后想问小册的问题时，先让你读一遍 `~/ai-native-builder-tutor/SKILL.md`，再按里面的规则回答。

## 6. 告诉用户怎么用

安装完成后，用一小段话告诉用户：

- 装到了哪个目录；如果有备份的旧版本，备份在哪；
- 可能需要重启 Agent 或新开一个会话，Skill 才会生效；
- 两种用法：

```text
用 ai-native-builder-tutor 回答：AI 说它做完了，我怎么知道它真的做对了？

用 ai-native-builder-tutor 带我读这本小册。我是后端，想一个人把一个小产品从需求做到上线。
```

- 小册在线阅读：https://iamlv.cn ；Skill 答不了的问题，可以在 https://iamlv.cn/friends 找到作者。
