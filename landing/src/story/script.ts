// THE STORYBOARD, as data (BRIEF.md §4). The "product" is the book, so its real interface
// is the book's own pages: six real screenshots, captured by `pnpm capture` into
// shots.json together with the measured rects of what each scene zooms into.
//
// The story follows the book's own order: three questions → what → why → how → a real
// example (this very site, two ways) → pull back. Boards snake: home → definition → why on
// the top row, triangle → with-skill → from-zero on the way back, the closing card under
// the last page, so the final pull-back reads as one path.

import { bounds, CAMERA_MOVE, createTimeline, framed, padded, type SceneSpec, type Shot, type WorldRect } from "../engine/timeline.ts";
import CAPTURED from "./shots.json";

export const SCENES = [
  {
    key: "home",
    index: "01",
    chapter: "首页",
    title: "一本小册，回答三个问题",
    hook: "AI 写得很快，交付却总在返工。",
    summary: "小册首页：是什么、为什么、怎么成为。三个问题，一条主线，从头读到尾大约一个小时。",
    weight: 1,
  },
  {
    key: "definition",
    index: "02",
    chapter: "第 1 章",
    title: "先弄清楚：什么是 AI Native Builder",
    hook: "会用 AI 写代码，不等于能把需求交付好。",
    summary: "一个人 + AI，用 AI 原生的方式，构建从需求到交付的完整闭环。AI 负责执行，人负责判断和兜底。",
    weight: 1,
  },
  {
    key: "why",
    index: "03",
    chapter: "第 3 ~ 5 章",
    title: "为什么现在要成为 AI Native Builder",
    hook: "AI 已经能跑完一整条流程，大家还在按环节用它。",
    summary: "一边是 AI 的能力覆盖了完整闭环，一边是团队和个人还在单点提效。两股力量交汇，这个角色成为必然。",
    weight: 1,
  },
  {
    key: "how",
    index: "04",
    chapter: "第 6 章",
    title: "怎么成为：为每个需求搭一个三角模型",
    hook: "AI 是概率模型，没人能保证它百分百做对。",
    summary: "AI Native 交付质量三角模型：定义正确、验证正确、失败可恢复。三条边缺一不可，每转一圈更稳一点。",
    weight: 1.1,
  },
  {
    key: "example",
    index: "05",
    chapter: "第 7、8 章",
    title: "一个真实的例子：你正在看的这个官网",
    hook: "有现成的交付模型，一句话；没有，就从 0 到 1 自己搭。",
    summary: "这个官网用现成的交付模型，一次对话就做完了；而那个交付模型本身，是从 0 到 1、三角模型转了五圈才搭出来的。",
    weight: 1.4,
  },
  {
    key: "finale",
    index: "06",
    chapter: "开始阅读",
    // The full closing line is on the finale card itself; the caption stays within 30 chars.
    title: "此刻，你已经在路上了",
    hook: "成为 AI Native Builder，从下一个需求开始。",
    summary: "镜头拉远，六个页面连成一条路：是什么、为什么、怎么成为。路怎么走，第 9 章给了两条。",
    weight: 1,
  },
] as const satisfies readonly SceneSpec[];

export const TIMELINE = createTimeline(SCENES);
const { beat } = TIMELINE;

export const TRACK_VH = 155 * SCENES.length;

/** Browser chrome above every screenshot (see Screen in engine/parts.tsx). */
export const CHROME = 36;

/** How much of each captured page is shown on stage, in CSS px. */
export const VISIBLE = { home: 1051, definition: 1000, why: 1000, triangle: 1200, withSkill: 1500, rounds: 900 } as const;

type Page = keyof typeof VISIBLE;
const W = 1280;
const GAP = 180;
/** Never show more than was captured (a page can be shorter than its VISIBLE budget). */
const shown = (page: Page) => Math.min(VISIBLE[page], (CAPTURED[page] as { h: number }).h);
const tallest = (...pages: Page[]) => Math.max(...pages.map(shown)) + CHROME;
const ROW2 = tallest("home", "definition", "why") + GAP;
const ROW3 = ROW2 + tallest("triangle", "withSkill", "rounds") + GAP;

export const BOARDS: Record<Page | "finale", WorldRect> = {
  home: { x: 0, y: 0, w: W, h: shown("home") + CHROME },
  definition: { x: 1400, y: 0, w: W, h: shown("definition") + CHROME },
  why: { x: 2800, y: 0, w: W, h: shown("why") + CHROME },
  triangle: { x: 2800, y: ROW2, w: W, h: shown("triangle") + CHROME },
  withSkill: { x: 1400, y: ROW2, w: W, h: shown("withSkill") + CHROME },
  rounds: { x: 0, y: ROW2, w: W, h: shown("rounds") + CHROME },
  finale: { x: 0, y: ROW3, w: W, h: 936 },
};

export const WORLD = bounds(Object.values(BOARDS));

/** A measured element of a captured page, in world coordinates. */
export function focus(page: Page, key: string): WorldRect {
  const shot = CAPTURED[page] as { focus: Record<string, WorldRect> };
  const f = shot.focus[key];
  if (!f) throw new Error(`shots.json: ${page} has no focus "${key}" — re-run pnpm capture`);
  return { x: BOARDS[page].x + f.x, y: BOARDS[page].y + CHROME + f.y, w: f.w, h: f.h };
}

/** A camera rect around a focus element, at least min size so the zoom stays readable. */
function around(rect: WorldRect, minW = 720, minH = 440): WorldRect {
  const w = Math.max(minW, rect.w + 160);
  const h = Math.max(minH, rect.h + 160);
  return { x: rect.x + rect.w / 2 - w / 2, y: rect.y + rect.h / 2 - h / 2, w, h };
}

const B = BOARDS;

export const SHOTS: readonly Shot[] = [
  { at: beat(0, 0), rect: around(focus("home", "hero")) },
  { at: beat(0, 0.35), rect: around(focus("home", "hero")) },
  { at: beat(0, 0.7), rect: framed(B.home) },
  { at: beat(0, 0.98), rect: framed(B.home) },
  { at: beat(1, CAMERA_MOVE), rect: framed(B.definition) },
  { at: beat(1, 0.4), rect: around(focus("definition", "lead")) },
  { at: beat(1, 0.98), rect: around(focus("definition", "lead")) },
  { at: beat(2, CAMERA_MOVE), rect: framed(B.why) },
  { at: beat(2, 0.4), rect: around(focus("why", "table"), 820, 520) },
  { at: beat(2, 0.98), rect: around(focus("why", "table"), 820, 520) },
  { at: beat(3, CAMERA_MOVE), rect: framed(B.triangle) },
  { at: beat(3, 0.4), rect: around(focus("triangle", "figure"), 820, 640) },
  { at: beat(3, 0.98), rect: around(focus("triangle", "figure"), 820, 640) },
  // Scene 5 visits two pages: the one-sentence road, then the from-zero road.
  { at: beat(4, CAMERA_MOVE), rect: framed(B.withSkill) },
  { at: beat(4, 0.3), rect: around(focus("withSkill", "prompt")) },
  { at: beat(4, 0.5), rect: around(focus("withSkill", "prompt")) },
  { at: beat(4, 0.68), rect: around(focus("rounds", "figure")) },
  { at: beat(4, 0.98), rect: around(focus("rounds", "figure")) },
  { at: beat(5, CAMERA_MOVE), rect: framed(B.finale) },
  { at: beat(5, 0.4), rect: framed(B.finale) },
  { at: beat(5, 0.75), rect: padded(WORLD, 80) },
  { at: 1, rect: padded(WORLD, 80) },
];
