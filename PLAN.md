# Honey Store — Online Shop for Pakistani Locally-Sourced Honey

## Context

The goal is to build a branded e-commerce store for selling locally acquired honey in Pakistan. Customers are local Pakistani buyers (delivery within Pakistan) and the Pakistani diaspora (gifting/ordering for family back home). The store needs to feel authentic and trustworthy, handle local payment methods (JazzCash, Easypaisa, COD), and support international card payments via Stripe for diaspora customers.

---

## Business Concept

**Brand angle:** Pakistan produces world-class honeys that are largely unknown globally — Sidr (Sindh), Acacia (Punjab), Beri/Berry (KPK), and wild mountain honey (Gilgit-Baltistan). The store positions itself around *provenance* and *purity*: every jar is traced to a region and beekeeper. This builds trust and justifies premium pricing.

**Product lineup:**
- Single-origin varieties (Sidr, Acacia, Beri, Wild Mountain)
- Gift boxes (curated sets — ideal for diaspora gifting)
- Subscription boxes (monthly delivery, recurring revenue)

**Key differentiators:**
- Beekeeper origin stories on each product page
- "Raw & unfiltered" certification badge
- WhatsApp order support (hugely popular in Pakistan)
- Cash on Delivery option (essential for local market)

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL) — products, orders, customers
- **Auth:** Supabase Auth (customer accounts + admin)
- **Payments:**
  - Stripe — international cards (diaspora)
  - JazzCash / Easypaisa — local Pakistan payments
  - COD — cash on delivery flag on order
- **Images:** Cloudinary (product + beekeeper photos)
- **Cart state:** Zustand
- **Deployment:** Vercel

---

## Pages & Features

### Customer-facing
| Page | Description |
|---|---|
| `/` | Hero with brand story, featured products, trust badges |
| `/shop` | Product grid, filter by honey type / region |
| `/shop/[slug]` | Product detail: origin map, beekeeper story, health benefits, reviews |
| `/gift-boxes` | Curated gift set builder |
| `/cart` | Cart with quantity controls |
| `/checkout` | Address, payment method selection, order summary |
| `/orders/[id]` | Order confirmation + tracking status |
| `/about` | Brand story, sourcing process, beekeeper partners |
| `/blog` | Health benefits, recipes, honey guides (SEO traffic) |

### Admin (simple dashboard at `/admin`)
- Product management (add/edit/archive)
- Order management (status updates: pending → packed → shipped → delivered)
- Customer list

---

## Data Models (Supabase)

```
products: id, name, slug, description, origin_region, beekeeper_id, price_pkr, price_usd, stock_qty, images[], is_active
beekeepers: id, name, region, story, photo_url
orders: id, customer_id, items (jsonb), total_pkr, payment_method, payment_status, fulfillment_status, address (jsonb), created_at
customers: id, email, phone, name, addresses[]
reviews: id, product_id, customer_id, rating, body, created_at
```

---

## Payment Flow

1. **Local (JazzCash/Easypaisa):** Redirect to payment gateway → webhook confirms → order marked paid
2. **International (Stripe):** Stripe Checkout session → webhook confirms → order marked paid
3. **COD:** Order created immediately with `payment_status: pending` — marked paid on delivery by admin

---

## Project Location

Create the project at: `c:\Users\nasir\dev\projects\honey-store\`

After scaffolding, copy this plan file into the project as `honey-store\PLAN.md` for future reference.

---

## Implementation Phases

### Phase 1 — Scaffold & Core Store
- `npx create-next-app honey-store` with TypeScript + Tailwind, inside `c:\Users\nasir\dev\projects\`
- Supabase project setup, schema migrations
- Product catalog pages (`/shop`, `/shop/[slug]`)
- Cloudinary image integration

### Phase 2 — Cart & Checkout
- Zustand cart store
- Checkout page with address form
- Stripe integration (international)
- COD option

### Phase 3 — Local Payments
- JazzCash API integration
- Easypaisa API integration
- Payment webhook handlers

### Phase 4 — Admin Dashboard
- Auth-gated `/admin` routes
- Product CRUD
- Order status management

### Phase 5 — Polish
- WhatsApp click-to-order button (floating button → pre-filled message)
- Blog (MDX or Supabase-backed)
- SEO metadata, Open Graph images
- Mobile-responsive QA

---

## Verification

- Spin up local dev server (`npm run dev`) and walk through full purchase flow
- Test Stripe checkout with test card `4242 4242 4242 4242`
- Test COD order creation end-to-end
- Verify admin can update order status and it reflects on order page
- Check mobile layout on Chrome DevTools at 375px (iPhone SE)

---

## Go Live Checklist

### 1. Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL Editor, paste and run `supabase/migrations/001_initial_schema.sql`
3. Copy **Project URL** and **anon public key** from Settings → API
4. Copy **service_role key** (keep this secret — server-side only)
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

### 2. Stripe
1. Create an account at [stripe.com](https://stripe.com)
2. From the Dashboard → Developers → API keys, copy the publishable and secret keys
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```
4. Set up a webhook: Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Event: `checkout.session.completed`
   - Copy the signing secret into `.env.local`:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```

### 3. WhatsApp Number
Already set in `.env.local.example`:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=61450363273
```
Update if the number changes. Format: country code + number, no `+` or spaces.

### 4. Run Locally
```bash
cp .env.local.example .env.local
# fill in real values, then:
npm run dev
```
Visit `http://localhost:3000`. Products load from Supabase once the migration is run and env vars are set.

### 5. Deploy to Vercel
```bash
npm i -g vercel
vercel
```
- Add all `.env.local` variables in Vercel Dashboard → Project → Settings → Environment Variables
- Update `NEXT_PUBLIC_SITE_URL` to your production domain
- Re-run the Stripe webhook setup pointing to the production URL
