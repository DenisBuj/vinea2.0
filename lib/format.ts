export function money(cents: number): string {
  return "€" + (cents / 100).toFixed(2).replace(".", ",");
}

export function typeLabel(t: string): string {
  switch (t) {
    case "red": return "Red";
    case "white": return "White";
    case "rose": return "Rosé";
    case "sparkling": return "Sparkling";
    case "champagne": return "Champagne";
    case "orange": return "Orange";
    case "dessert": return "Dessert";
    default: return t;
  }
}

export function statusLabel(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function statusColor(s: string): string {
  switch (s) {
    case "pending": return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
    case "paid": return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "processing": return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    case "shipped": return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
    case "delivered": return "bg-green-500/15 text-green-300 border-green-500/30";
    case "cancelled": return "bg-red-500/15 text-red-300 border-red-500/30";
    default: return "bg-white/10 text-white/70 border-white/20";
  }
}
