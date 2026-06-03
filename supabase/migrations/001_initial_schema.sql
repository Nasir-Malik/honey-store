-- Beekeepers
create table beekeepers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null,
  story text not null default '',
  photo_url text,
  created_at timestamptz not null default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  origin_region text not null,
  beekeeper_id uuid references beekeepers(id) on delete set null,
  price_pkr numeric(10,2) not null,
  price_usd numeric(10,2) not null,
  stock_qty integer not null default 0,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index on products(slug);
create index on products(is_active);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  items jsonb not null,
  total_pkr numeric(10,2) not null,
  payment_method text not null check (payment_method in ('stripe', 'jazzcash', 'easypaisa', 'cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  fulfillment_status text not null default 'pending' check (fulfillment_status in ('pending', 'packed', 'shipped', 'delivered', 'cancelled')),
  address jsonb not null,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create index on orders(customer_id);
create index on orders(fulfillment_status);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  body text not null default '',
  created_at timestamptz not null default now()
);

create index on reviews(product_id);

-- RLS
alter table products enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;
alter table beekeepers enable row level security;

-- Public read access for products and beekeepers
create policy "public can read active products" on products for select using (is_active = true);
create policy "public can read beekeepers" on beekeepers for select using (true);
create policy "public can read reviews" on reviews for select using (true);

-- Authenticated users can create orders
create policy "authenticated can create orders" on orders for insert with check (auth.uid() = customer_id or customer_id is null);
create policy "customers can view own orders" on orders for select using (auth.uid() = customer_id);

-- Authenticated users can create reviews
create policy "authenticated can create reviews" on reviews for insert with check (auth.uid() = customer_id);

-- Seed data
insert into beekeepers (name, region, story) values
  ('Haji Abdul Karim', 'Sindh', 'Three generations of beekeeping along the banks of the Indus. Abdul Karim''s Sidr honey is harvested once a year from wild jujube trees in the Thar desert.'),
  ('Muhammad Aslam', 'Punjab', 'A pioneer of Acacia honey farming in the Chenab riverbed forests, Muhammad Aslam has been keeping bees for over 30 years.'),
  ('Khan Bahadur', 'KPK', 'Nestled in the foothills of the Hindu Kush, Khan Bahadur''s bees feed on wild beri and multiflora blossoms — producing a honey unlike any other.'),
  ('Ghulam Nabi', 'Gilgit-Baltistan', 'At 2,800 metres above sea level, Ghulam Nabi''s hives produce a rare wild mountain honey from pristine alpine meadows.');

insert into products (name, slug, description, origin_region, beekeeper_id, price_pkr, price_usd, stock_qty, images) values
  ('Sidr Honey', 'sidr-honey', 'Harvested from the nectar of jujube (Sidr) trees in the Thar desert of Sindh. Dark, rich, and intensely aromatic — considered the finest honey in Pakistan.', 'Sindh', (select id from beekeepers where name = 'Haji Abdul Karim'), 3500, 12.50, 50, '{}'),
  ('Acacia Honey', 'acacia-honey', 'Light and delicate with a floral sweetness, this honey is collected from the white Acacia blossoms along the Chenab riverbanks of Punjab.', 'Punjab', (select id from beekeepers where name = 'Muhammad Aslam'), 2200, 8.00, 80, '{}'),
  ('Beri Honey', 'beri-honey', 'Collected from beri (wild plum) blossoms in the KPK foothills. Amber-coloured with a gentle fruity finish and high antibacterial properties.', 'KPK', (select id from beekeepers where name = 'Khan Bahadur'), 2800, 10.00, 60, '{}'),
  ('Wild Mountain Honey', 'wild-mountain-honey', 'Rare honey from alpine meadows at 2,800m in Gilgit-Baltistan. A complex flavour profile with hints of wildflower and pine — strictly limited harvest.', 'Gilgit-Baltistan', (select id from beekeepers where name = 'Ghulam Nabi'), 4500, 16.00, 30, '{}');
