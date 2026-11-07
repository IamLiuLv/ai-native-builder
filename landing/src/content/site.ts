// Every word on the page outside the story. Filled from BRIEF.md.
// Links are absolute: the site is served under /landing/ next to the book.

export const SITE = {
  name: "成为 AI Native Builder",
  nav: [
    { label: "开始阅读", href: "/book/preface" },
    { label: "大纲", href: "/book/outline" },
    { label: "交个朋友", href: "/friends" },
    { label: "⭐ Star 不迷路", href: "https://github.com/IamLiuLv/ai-native-builder" },
  ],
  hero: {
    eyebrow: "小册 · 1.0 程序员版",
    title: ["一个人 + AI", "从需求到交付的完整闭环"],
    promise: "AI 写得快不稀奇。这本小册讲的是：怎么让它交付的东西，质量过关。",
    primary: { label: "开始阅读", href: "/book/preface" },
    secondary: { label: "先看看书里有什么", href: "#story" },
    /** A real page of the book — the product's own interface. */
    image: `${import.meta.env.BASE_URL}shots/triangle.png`,
    imageDark: `${import.meta.env.BASE_URL}shots/triangle-dark.png`,
    imageAlt: "小册第 6 章《AI Native 交付质量三角模型》的页面",
  },
  story: {
    outlineTitle: "翻一遍这本小册：六个页面，一条主线",
  },
  cta: {
    title: ["此刻，你已经在路上了", "是什么 · 为什么 · 怎么成为"],
    button: { label: "开始阅读", href: "/book/preface" },
    facts: [
      "一个定义：一个人 + AI，构建从需求到交付的完整闭环",
      "一个模型：定义正确 · 验证正确 · 失败可恢复",
      "两个案例：用现成的交付模型一句话做官网；没有模型，从 0 到 1 转了五圈",
    ],
  },
  footer: {
    note: "© 2026 lv.liu · 《成为 AI Native Builder》",
    links: [
      { label: "小册", href: "/book/outline" },
      { label: "CanvasAgents", href: "https://canvasagents.dev" },
    ],
  },
} as const;
