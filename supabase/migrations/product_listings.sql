-- Create a table for product listings
create table if not exists public.product_listings (
  id uuid default uuid_generate_v4() primary key,
  farmer_id uuid,
  title text not null,
  description text,
  category text not null,
  quantity numeric not null,
  unit text not null,
  price_per_unit numeric not null,
  location text not null,
  availability_date date not null,
  status text default 'available' check (status in ('available', 'sold', 'expired')),
  images text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.product_listings enable row level security;

-- Create policies
create policy "Listings are viewable by everyone."
  on public.product_listings for select
  using ( true );

create policy "Farmers can create their own listings."
  on public.product_listings for insert
  with check ( auth.uid() = farmer_id );

create policy "Farmers can update their own listings."
  on public.product_listings for update
  using ( auth.uid() = farmer_id );

create policy "Farmers can delete their own listings."
  on public.product_listings for delete
  using ( auth.uid() = farmer_id );

-- First, drop the existing foreign key constraint
ALTER TABLE public.product_listings 
DROP CONSTRAINT IF EXISTS product_listings_farmer_id_fkey;

-- Then add the new foreign key constraint referencing profiles
ALTER TABLE public.product_listings
ADD CONSTRAINT product_listings_farmer_id_fkey 
FOREIGN KEY (farmer_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
