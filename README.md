# Vinea 2.0

Luxury wine e-commerce — built for hype, value, and a young audience.
Storefront + admin dashboard, Next.js 15 App Router, Supabase Postgres, deployed to Vercel.

## Quickstart

```bash
npm install
cp .env.example .env.local   # already populated for the demo
npm run dev
```

Open http://localhost:3000.

## Live URLs (after deploy)

- Storefront: assigned by Vercel
- Admin: `/admin` — password `vinea-admin-2026` (configurable via `ADMIN_PASSWORD`)

## Customer flows

- `/` — cinematic hero, marquee of regions, featured roster, three pillar cards (Particulier / Bedrijven / Horeca), service strip, quiz CTA
- `/shop` — grid with type filters, search, sorting (hype / price / vintage)
- `/shop/[slug]` — product detail with tasting notes, food pairings, related wines, add-to-cart, wishlist
- `/quiz` — 6-question sommelier quiz that returns 3 matched bottles
- `/cart` — quantities, free-shipping nudge, summary
- `/checkout` — guest-friendly form with fake test card. Auto-approved.
- `/checkout/success` — order confirmation with tracking link
- `/order` + `/order/[number]` — guest order tracking with status timeline
- `/account/wishlist` — saved bottles (cookie-session based)
- `/particulier`, `/bedrijven`, `/horeca`, `/events`, `/about` — segment pages

## Admin

- `/admin` — dashboard with order count, paid count, revenue, low-stock SKUs, recent orders
- `/admin/orders` — filterable table by status
- `/admin/orders/[id]` — order detail with status dropdown + customer note
- `/admin/orders/[id]/print` — printable packing slip (auto-triggers `window.print()`)
- `/admin/inventory` — every SKU with editable stock; auto-saves on blur, color-coded by stock level

## Database (Supabase)

Project: `vinea2.0`
Tables: `products`, `orders`, `order_items`, `customers`, `wishlists`
Order numbers via `generate_order_number()` SQL function (`VN-YYYY-NNNNN`).
Stock is decremented on `placeOrderAction`.

## Auth

Customer side: no account required. Wishlists are tied to a long-lived `vinea_session` cookie.
Admin side: simple password gate. Cookie `vinea_admin` holds a deterministic token derived from `ADMIN_PASSWORD`.

## Payments

Faked. The checkout form has a disabled card input with `4242 4242 4242 4242`. The order is created with status `paid` and `payment_method = card_test`.

## Deploy

```bash
# Pushed to Vercel — env vars set at the project level:
NEXT_PUBLIC_SUPABASE_URL=https://bbelawsdhsjdayqsagih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_iSlUg8d6T0v4CMfGu_if8g_0HFJM4Fr
ADMIN_PASSWORD=vinea-admin-2026
```
