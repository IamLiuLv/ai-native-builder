import { defineConfig } from "vitepress";

const SITE_URL = "https://iamlv.cn";
const SITE_TITLE = "成为 AI Native Builder";
const SITE_DESCRIPTION = "一个人 + AI，用 AI 原生的方式，构建从需求到交付的完整闭环。";
const SOCIAL_IMAGE = `${SITE_URL}/images/landing-v2-triangle.png`;

function cleanUrlFor(relativePath) {
  const route = relativePath
    .replace(/(^|\/)index\.md$/, "$1")
    .replace(/\.md$/, "");
  return route ? `/${route}` : "/";
}

// 侧边栏即全书目录。章节编号写进 text 里，读者在任何一页都能看到自己在全书的哪个位置。
const sidebar = [
  {
    text: "开始",
    items: [
      { text: "全书大纲", link: "/book/outline" },
      { text: "前言 · 为什么 AI 总在返工", link: "/book/preface" },
    ],
  },
  {
    text: "第一部分 · 什么是 AI Native Builder",
    items: [
      { text: "01 一个定义", link: "/book/part-1/01-definition" },
      { text: "02 AI 原生：从按角色分工到按需求闭环", link: "/book/part-1/02-ai-native" },
    ],
  },
  {
    text: "第二部分 · 为什么要成为",
    items: [
      { text: "03 背景：AI 从做一个角色到跑一条流水线", link: "/book/part-2/03-background" },
      { text: "04 困境：单点提效不等于整体提效", link: "/book/part-2/04-dilemma" },
      { text: "05 必然：两股力量的交汇", link: "/book/part-2/05-inevitable" },
    ],
  },
  {
    text: "第三部分 · 怎么成为",
    items: [
      { text: "06 AI Native 交付质量三角模型", link: "/book/part-3/06-triangle" },
      { text: "07 案例（上）：用现成的交付模型", link: "/book/part-3/07-case-with-skill" },
      { text: "08 案例（下）：没有交付模型，从 0 到 1", link: "/book/part-3/08-case-from-zero" },
      { text: "09 两条路", link: "/book/part-3/09-two-roads" },
    ],
  },
  {
    text: "附录",
    items: [
      { text: "A 产品演示官网交付模型", link: "/book/appendix/skill" },
      { text: "B 术语表", link: "/book/appendix/glossary" },
      { text: "C 数据来源", link: "/book/appendix/sources" },
      { text: "D 小册答疑 Skill", link: "/book/appendix/ask" },
    ],
  },
];

export default defineConfig({
  lang: "zh-CN",
  title: "成为 AI Native Builder",
  description: "一个人 + AI，用 AI 原生的方式，构建从需求到交付的完整闭环。",
  cleanUrls: true,
  sitemap: {
    hostname: SITE_URL,
    transformItems(items) {
      return [
        ...items.filter((item) => !item.url.replace(/^\//, "").startsWith("public/")),
        {
          url: "/landing/",
          changefreq: "monthly",
          priority: 0.8,
        },
      ];
    },
  },
  // /landing/ 是小册官网，/rounds/ 是第 8 章每一圈的历史官网，/downloads/ 是交付模型压缩包：都是静态产物，不是 Markdown 页面。
  ignoreDeadLinks: [/^\/landing\//, /^\/downloads\//, /^\/rounds\//],
  lastUpdated: false,
  // 默认浅色（纸张），读者可以切换到深色。
  appearance: true,
  transformHead({ pageData }) {
    if (pageData.isNotFound) return [];

    const canonical = `${SITE_URL}${cleanUrlFor(pageData.relativePath)}`;
    const title = pageData.title || SITE_TITLE;
    const description = pageData.description || SITE_DESCRIPTION;
    return [
      ["link", { rel: "canonical", href: canonical }],
      ["meta", { property: "og:type", content: pageData.relativePath === "index.md" ? "website" : "article" }],
      ["meta", { property: "og:locale", content: "zh_CN" }],
      ["meta", { property: "og:site_name", content: SITE_TITLE }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: canonical }],
      ["meta", { property: "og:image", content: SOCIAL_IMAGE }],
      ["meta", { property: "og:image:width", content: "1440" }],
      ["meta", { property: "og:image:height", content: "900" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: SOCIAL_IMAGE }],
    ];
  },
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["meta", { name: "theme-color", content: "#fbf8f1" }],
    [
      "script",
      { type: "text/javascript" },
      `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "za8e2uieao");`,
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "官网", link: "/landing/", target: "_self" },
      { text: "开始阅读", link: "/book/preface" },
      { text: "大纲", link: "/book/outline" },
      { text: "交个朋友", link: "/friends" },
      { text: "⭐ Star 不迷路", link: "https://github.com/IamLiuLv/ai-native-builder" },
    ],
    sidebar: { "/book/": sidebar },
    outline: { level: [2, 3], label: "本章目录" },
    docFooter: { prev: "上一章", next: "下一章" },
    darkModeSwitchLabel: "外观",
    sidebarMenuLabel: "目录",
    returnToTopLabel: "回到顶部",
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "搜索", buttonAriaLabel: "搜索" },
          modal: {
            noResultsText: "没有找到相关内容",
            resetButtonTitle: "清除",
            footer: { selectText: "选择", navigateText: "切换", closeText: "关闭" },
          },
        },
      },
    },
    footer: {
      message: "《成为 AI Native Builder》1.0 · 程序员版",
      copyright: "© 2026 lv.liu",
    },
  },
});
