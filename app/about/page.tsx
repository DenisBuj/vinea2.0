export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-24">
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">About</div>
      <h1 className="font-display text-5xl md:text-6xl mt-2">Why Vinea exists</h1>
      <div className="mt-8 space-y-5 text-[var(--color-ink-dim)] leading-relaxed">
        <p>Wine should mean something. The roster you'll find here isn't built to be exhaustive — it's built to be honest. Every producer is someone we've visited, eaten with, argued with about acidity.</p>
        <p>Belgium is small. That's an advantage. We can stock fewer bottles, know them deeper, and tell you exactly what to drink with what.</p>
        <p>We started Vinea because the wine world should feel less like a museum and more like a great house party with smart friends. Open the bottle, share what you know, ask what you don't.</p>
      </div>
    </div>
  );
}
