// The stage: six REAL pages of the book (captured screenshots), each with the passage
// the scene is about highlighted and named. Highlight positions are the measured rects
// from shots.json — not guesses — so they stay on target when the book is re-captured.

import { asset } from "../engine/asset.ts";
import { Arrow, Callout, Drawn, Highlight, Screen } from "../engine/parts.tsx";
import { BOARDS, focus, TIMELINE, VISIBLE, WORLD } from "./script.ts";
import CAPTURED from "./shots.json";

const { beat } = TIMELINE;
const B = BOARDS;

function Page({ page, scene, label }: { page: keyof typeof VISIBLE; scene: number; label: string }) {
  const b = B[page];
  return (
    <Screen
      at={beat(scene, 0.02)}
      x={b.x}
      y={b.y}
      w={b.w}
      h={b.h}
      src={asset(CAPTURED[page].src)}
      srcDark={"srcDark" in CAPTURED[page] ? asset((CAPTURED[page] as { srcDark: string }).srcDark) : undefined}
      alt={`小册页面：${label}`}
      label={label}
    />
  );
}

const PAGE0 = focus("home", "hero");
const PAGE1 = focus("definition", "lead");
const PAGE2 = focus("why", "table");
const PAGE3 = focus("triangle", "figure");
const PAGE4A = focus("withSkill", "prompt");
const PAGE4B = focus("rounds", "figure");

/** A callout pinned to the bottom-right corner of a highlighted element, overlapping its
 *  edge — so it stays inside the camera's frame on a phone as well as on a desktop. */
function pin(r: { x: number; y: number; w: number; h: number }, w: number) {
  return { x: r.x + r.w - w + 24, y: r.y + r.h - 6 };
}

/** Highlight a measured element, padded a little so the box does not touch the text. */
function Mark({ page, k, at }: { page: keyof typeof VISIBLE; k: string; at: number }) {
  const r = focus(page, k);
  return <Highlight at={at} x={r.x - 14} y={r.y - 12} w={r.w + 28} h={r.h + 24} />;
}

function Finale() {
  const b = B.finale;
  const lines = [
    ["是什么", "一个人 + AI，构建从需求到交付的完整闭环"],
    ["为什么", "AI 能跑完一整条流程，人还在按环节用它"],
    ["怎么成为", "定义正确 · 验证正确 · 失败可恢复"],
  ] as const;
  return (
    <Drawn at={beat(5, 0.1)} x={b.x} y={b.y} w={b.w} h={b.h} className="bg-surface border-line flex flex-col justify-center rounded-2xl border px-24 shadow-2xl">
      <p className="text-primary text-[26px] tracking-[0.3em]">小册 · 1.0 程序员版</p>
      <p className="text-ink font-display mt-6 text-[60px] leading-tight font-semibold">
        此刻，你已经在成为
        <br />
        AI Native Builder 的路上了
      </p>
      <ul className="mt-12 space-y-6">
        {lines.map(([k, v]) => (
          <li key={k} className="flex items-baseline gap-8 text-[34px]">
            <span className="text-primary font-display w-40 shrink-0 font-semibold">{k}</span>
            <span className="text-muted">{v}</span>
          </li>
        ))}
      </ul>
    </Drawn>
  );
}

export function World() {
  return (
    <div className="absolute top-0 left-0" style={{ width: WORLD.x + WORLD.w, height: WORLD.y + WORLD.h }}>
      <Page page="home" scene={0} label="首页" />
      <Mark page="home" k="hero" at={beat(0, 0.12)} />
      <Callout at={beat(0, 0.2)} {...pin(PAGE0, 320)} w={320}>
        三个问题：是什么、为什么、怎么成为
      </Callout>

      <Page page="definition" scene={1} label="第 1 章 · 一个定义" />
      <Mark page="definition" k="lead" at={beat(1, 0.3)} />
      <Callout at={beat(1, 0.45)} {...pin(PAGE1, 340)} w={340}>
        AI 负责执行，人负责判断和兜底
      </Callout>

      <Page page="why" scene={2} label="第 5 章 · 必然" />
      <Mark page="why" k="table" at={beat(2, 0.3)} />
      <Callout at={beat(2, 0.45)} {...pin(PAGE2, 380)} w={380}>
        能力到了，用法没跟上：缺口就是这个角色
      </Callout>

      <Page page="triangle" scene={3} label="第 6 章 · 三角模型" />
      <Mark page="triangle" k="figure" at={beat(3, 0.3)} />
      <Callout at={beat(3, 0.45)} {...pin(PAGE3, 340)} w={340}>
        为每个需求，搭一个这样的三角
      </Callout>

      <Page page="withSkill" scene={4} label="第 7 章 · 用现成的交付模型" />
      <Mark page="withSkill" k="prompt" at={beat(4, 0.22)} />
      <Callout at={beat(4, 0.3)} {...pin(PAGE4A, 360)} w={360}>
        有现成的交付模型：一句话，这个官网就做完了
      </Callout>

      <Page page="rounds" scene={4} label="第 8 章 · 从 0 到 1" />
      <Mark page="rounds" k="figure" at={beat(4, 0.6)} />
      <Callout at={beat(4, 0.68)} {...pin(PAGE4B, 360)} w={360}>
        没有模型：从 0 到 1，三角转了五圈
      </Callout>

      <Finale />

      <Arrow at={beat(1, 0.02)} from={[B.home.x + B.home.w + 14, 500]} to={[B.definition.x - 14, 500]} />
      <Arrow at={beat(2, 0.02)} from={[B.definition.x + B.definition.w + 14, 500]} to={[B.why.x - 14, 500]} />
      <Arrow at={beat(3, 0.02)} from={[B.why.x + 640, B.why.y + B.why.h + 14]} to={[B.triangle.x + 640, B.triangle.y - 14]} />
      <Arrow at={beat(4, 0.02)} from={[B.triangle.x - 14, B.triangle.y + 400]} to={[B.withSkill.x + B.withSkill.w + 14, B.withSkill.y + 400]} />
      <Arrow at={beat(4, 0.5)} from={[B.withSkill.x - 14, B.withSkill.y + 400]} to={[B.rounds.x + B.rounds.w + 14, B.rounds.y + 400]} />
      <Arrow at={beat(5, 0.02)} from={[B.rounds.x + 640, B.rounds.y + B.rounds.h + 14]} to={[B.finale.x + 640, B.finale.y - 14]} />
    </div>
  );
}
