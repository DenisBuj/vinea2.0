"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/supabase";
import { money, typeLabel } from "@/lib/format";
import { ArrowRight, Sparkles } from "lucide-react";

type Q = {
  key: string;
  prompt: string;
  options: { label: string; tags: string[] }[];
};

const QUESTIONS: Q[] = [
  {
    key: "vibe",
    prompt: "It's Friday, 9pm. What's the vibe?",
    options: [
      { label: "House party, big speakers, plates everywhere", tags: ["sparkling", "rose", "low_abv"] },
      { label: "Candlelit dinner, slow conversation", tags: ["red", "premium"] },
      { label: "Rooftop golden hour with friends", tags: ["rose", "white", "sparkling"] },
      { label: "Couch + something good on TV", tags: ["red", "value"] }
    ]
  },
  {
    key: "flavor",
    prompt: "When you taste, you're chasing…",
    options: [
      { label: "Bright + crunchy + zippy", tags: ["white", "rose", "sparkling"] },
      { label: "Deep + brooding + complex", tags: ["red", "premium"] },
      { label: "Funky + new + a story", tags: ["orange", "natural"] },
      { label: "Smooth + easy + crowd-pleasing", tags: ["red", "rose", "value"] }
    ]
  },
  {
    key: "food",
    prompt: "Tonight's food situation:",
    options: [
      { label: "Pasta, pizza, or anything Italian", tags: ["red", "white"] },
      { label: "Sushi, ramen, anything spicy", tags: ["white", "rose", "sparkling"] },
      { label: "Steak, lamb, big proteins", tags: ["red", "premium"] },
      { label: "Snacks, charcuterie, vibes", tags: ["sparkling", "rose", "orange"] }
    ]
  },
  {
    key: "budget",
    prompt: "Budget per bottle?",
    options: [
      { label: "Under €20 — good times", tags: ["value"] },
      { label: "€20 – €40 — sweet spot", tags: ["mid"] },
      { label: "€40+ — special night", tags: ["premium"] },
      { label: "Don't care, surprise me", tags: [] }
    ]
  },
  {
    key: "adventure",
    prompt: "How adventurous are you feeling?",
    options: [
      { label: "Stick to what I know", tags: ["red", "white", "value"] },
      { label: "Try something new", tags: ["orange", "natural", "rose"] },
      { label: "Go off-piste, drop something weird", tags: ["orange", "natural"] },
      { label: "Classic is classic for a reason", tags: ["champagne", "premium", "red"] }
    ]
  },
  {
    key: "occasion",
    prompt: "Final question: this bottle is for…",
    options: [
      { label: "Just me, this evening", tags: ["value", "white", "red"] },
      { label: "A date", tags: ["sparkling", "champagne", "rose"] },
      { label: "Friends coming over", tags: ["rose", "red", "value"] },
      { label: "A gift", tags: ["premium", "champagne"] }
    ]
  }
];

function score(p: Product, tags: string[]): number {
  let s = 0;
  for (const t of tags) {
    if (t === "premium" && p.price_cents >= 4000) s += 3;
    else if (t === "mid" && p.price_cents >= 2000 && p.price_cents < 4000) s += 3;
    else if (t === "value" && p.price_cents < 2000) s += 3;
    else if (t === "low_abv" && p.alcohol_pct != null && p.alcohol_pct < 12) s += 2;
    else if (t === "natural" && (p.type === "orange" || /pet[- ]?nat/i.test(p.name))) s += 4;
    else if (p.type === t) s += 4;
  }
  s += p.hype_score * 0.05;
  return s;
}

export default function QuizClient({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const choose = (newTags: string[]) => {
    const next = [...tags, ...newTags];
    setTags(next);
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const reset = () => { setStep(0); setTags([]); setDone(false); };

  if (done) {
    const ranked = [...products]
      .map(p => ({ p, s: score(p, tags) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3);

    return (
      <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-12 pb-24">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Your match</div>
        <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">
          Three for <span className="font-italic-display text-[var(--color-gold-bright)]">you</span>.
        </h1>
        <p className="mt-4 text-[var(--color-ink-dim)] max-w-xl">Hand-picked from the roster based on your answers. Skip the small talk, drink something good.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {ranked.map(({ p }, i) => (
            <Link
              key={p.id}
              href={`/shop/${p.slug}`}
              className="group rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/50 overflow-hidden hover:border-[var(--color-gold)]/40 transition"
            >
              <div className="relative aspect-[4/5]">
                {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-[var(--color-gold)]/90 text-[var(--color-bg)]">
                  <Sparkles size={10} /> #{i + 1} match
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">{typeLabel(p.type)}</div>
                <div className="font-display text-xl mt-1">{p.name}</div>
                <div className="text-xs text-[var(--color-ink-dim)]">{p.producer} · {p.region}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-xl text-[var(--color-gold-bright)]">{money(p.price_cents)}</span>
                  <span className="text-sm group-hover:text-[var(--color-gold-bright)]">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button onClick={reset} className="mt-10 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-gold-bright)]">↻ Retake the quiz</button>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const pct = ((step) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
        <span>Sommelier quiz</span>
        <span>{step + 1} / {QUESTIONS.length}</span>
      </div>
      <div className="mt-3 h-1 rounded-full bg-[var(--color-line)] overflow-hidden">
        <div className="h-full bg-[var(--color-gold)] transition-all" style={{ width: `${pct}%` }} />
      </div>

      <h1 className="font-display text-4xl md:text-6xl mt-10 leading-[1.05]">{q.prompt}</h1>

      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        {q.options.map((o, idx) => (
          <button
            key={idx}
            onClick={() => choose(o.tags)}
            className="group text-left p-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/30 hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-bg-soft)] transition flex items-center justify-between gap-4"
          >
            <span className="font-display text-lg">{o.label}</span>
            <ArrowRight size={16} className="text-[var(--color-ink-dim)] group-hover:text-[var(--color-gold-bright)] group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
}
