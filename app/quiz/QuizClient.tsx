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
    prompt: "Het is vrijdag, 21u. Wat is de vibe?",
    options: [
      { label: "Huisfeest, grote speakers, borden overal", tags: ["sparkling", "rose", "low_abv"] },
      { label: "Diner bij kaarslicht, traag gesprek", tags: ["red", "premium"] },
      { label: "Rooftop bij zonsondergang met vrienden", tags: ["rose", "white", "sparkling"] },
      { label: "Bank + iets goeds op TV", tags: ["red", "value"] }
    ]
  },
  {
    key: "flavor",
    prompt: "Als je proeft, jaag je op…",
    options: [
      { label: "Helder + krokant + pittig", tags: ["white", "rose", "sparkling"] },
      { label: "Diep + broeierig + complex", tags: ["red", "premium"] },
      { label: "Funky + nieuw + met een verhaal", tags: ["orange", "natural"] },
      { label: "Soepel + makkelijk + voor iedereen", tags: ["red", "rose", "value"] }
    ]
  },
  {
    key: "food",
    prompt: "Vanavond eet je:",
    options: [
      { label: "Pasta, pizza, of iets Italiaans", tags: ["red", "white"] },
      { label: "Sushi, ramen, iets pittigs", tags: ["white", "rose", "sparkling"] },
      { label: "Steak, lam, grote eiwitten", tags: ["red", "premium"] },
      { label: "Snacks, charcuterie, vibes", tags: ["sparkling", "rose", "orange"] }
    ]
  },
  {
    key: "budget",
    prompt: "Budget per fles?",
    options: [
      { label: "Onder €20 — gewoon goed", tags: ["value"] },
      { label: "€20 – €40 — sweet spot", tags: ["mid"] },
      { label: "€40+ — speciale avond", tags: ["premium"] },
      { label: "Maakt niet uit, verras me", tags: [] }
    ]
  },
  {
    key: "adventure",
    prompt: "Hoe avontuurlijk voel je je?",
    options: [
      { label: "Houd het bij wat ik ken", tags: ["red", "white", "value"] },
      { label: "Probeer iets nieuws", tags: ["orange", "natural", "rose"] },
      { label: "Geef mij iets vreemds", tags: ["orange", "natural"] },
      { label: "Klassiek is klassiek met reden", tags: ["champagne", "premium", "red"] }
    ]
  },
  {
    key: "occasion",
    prompt: "Laatste vraag: deze fles is voor…",
    options: [
      { label: "Mij, vanavond", tags: ["value", "white", "red"] },
      { label: "Een date", tags: ["sparkling", "champagne", "rose"] },
      { label: "Vrienden die langskomen", tags: ["rose", "red", "value"] },
      { label: "Een cadeau", tags: ["premium", "champagne"] }
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
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Jouw match</div>
        <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95] text-[var(--color-ink)]">
          Drie voor <span className="font-italic-display text-[var(--color-cta)]">jou</span>.
        </h1>
        <p className="mt-4 text-[var(--color-ink-soft)] max-w-xl">Met de hand gekozen uit de selectie op basis van jouw antwoorden. Skip de small talk, drink iets goeds.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {ranked.map(({ p }, i) => (
            <Link
              key={p.id}
              href={`/shop/${p.slug}`}
              className="group rounded-2xl border border-[var(--color-line)] bg-white overflow-hidden hover:border-[var(--color-accent)]/40 hover:shadow-lg transition shadow-sm"
            >
              <div className="relative aspect-[4/5]">
                {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-[var(--color-cta)] text-white font-medium">
                  <Sparkles size={10} /> #{i + 1} match
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">{typeLabel(p.type)}</div>
                <div className="font-display text-xl mt-1 text-[var(--color-ink)]">{p.name}</div>
                <div className="text-xs text-[var(--color-ink-dim)]">{p.producer} · {p.region}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-xl text-[var(--color-cta)]">{money(p.price_cents)}</span>
                  <span className="text-sm group-hover:text-[var(--color-accent)]">Bekijk →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button onClick={reset} className="mt-10 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">↻ Quiz opnieuw doen</button>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const pct = ((step) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
        <span>Sommelier-quiz</span>
        <span>{step + 1} / {QUESTIONS.length}</span>
      </div>
      <div className="mt-3 h-1 rounded-full bg-[var(--color-line)] overflow-hidden">
        <div className="h-full bg-[var(--color-accent)] transition-all" style={{ width: `${pct}%` }} />
      </div>

      <h1 className="font-display text-4xl md:text-6xl mt-10 leading-[1.05] text-[var(--color-ink)]">{q.prompt}</h1>

      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        {q.options.map((o, idx) => (
          <button
            key={idx}
            onClick={() => choose(o.tags)}
            className="group text-left p-5 rounded-2xl border border-[var(--color-line)] bg-white hover:border-[var(--color-accent)] hover:shadow-md transition flex items-center justify-between gap-4"
          >
            <span className="font-display text-lg text-[var(--color-ink)]">{o.label}</span>
            <ArrowRight size={16} className="text-[var(--color-ink-dim)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
}
