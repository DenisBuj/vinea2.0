export function money(cents: number): string {
  return "€" + (cents / 100).toFixed(2).replace(".", ",");
}

export function typeLabel(t: string): string {
  switch (t) {
    case "red": return "Rood";
    case "white": return "Wit";
    case "rose": return "Rosé";
    case "sparkling": return "Bubbels";
    case "champagne": return "Champagne";
    case "orange": return "Oranje";
    case "dessert": return "Dessert";
    default: return t;
  }
}

export function statusLabel(s: string): string {
  switch (s) {
    case "pending": return "In afwachting";
    case "paid": return "Betaald";
    case "processing": return "In voorbereiding";
    case "shipped": return "Verzonden";
    case "delivered": return "Geleverd";
    case "cancelled": return "Geannuleerd";
    default: return s;
  }
}

export function statusColor(s: string): string {
  switch (s) {
    case "pending": return "bg-amber-50 text-amber-800 border-amber-200";
    case "paid": return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "processing": return "bg-blue-50 text-blue-800 border-blue-200";
    case "shipped": return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case "delivered": return "bg-green-50 text-green-800 border-green-300";
    case "cancelled": return "bg-red-50 text-red-800 border-red-200";
    default: return "bg-stone-100 text-stone-700 border-stone-200";
  }
}
