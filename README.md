SafeDine – Allergy-Friendly Contactless Restaurant Ordering

SafeDine is a modern contactless dining solution designed for restaurants and customers who want safer, faster, and more personalized dining experiences.
Built with React, TypeScript, Vite, Supabase, and Tailwind CSS, SafeDine lets customers filter menus by allergens and dietary needs, order directly from the table, and track their meals in real time.

Features

Authentication and guest access – Email/password or instant guest ordering

Table and location selection – Choose restaurant and table, validated in real time

Dynamic menu filtering – Only see safe dishes for your dietary/allergen profile

Shopping cart – Persistent cart with add/remove/update

Real-time order tracking – From pending to preparing to ready

Reviews and ratings – Rate food, service, and atmosphere

Loyalty program – Earn points for orders and reviews, unlock tiered rewards

Modern UI/UX – Mobile-first, responsive, dark/light themes, animations

Security – Supabase Row Level Security (RLS), GDPR-compliant data handling

Tech Stack

Frontend

React 18 + TypeScript

Vite (fast builds, hot reloads)

Tailwind CSS + shadcn/ui

React Query (data fetching and caching)

Backend

Supabase (PostgreSQL, Authentication, Real-time APIs)

RLS policies for user data isolation

Deployment

GitHub (source control)

Vercel (frontend hosting)

Supabase Cloud (database and authentication)

Project Structure
src/
├── components/        # UI & shared components
├── pages/             # Route-based pages
├── hooks/             # Custom React hooks
├── contexts/          # Auth, Theme, Session providers
├── integrations/      # Supabase client & external APIs
└── lib/               # Utilities & helpers
public/                # Icons, manifest, SEO images

Getting Started

1- Clone the repository:

git clone https://github.com/m2-berezin/safedine-app.git
cd safedine-app


2- Install dependencies:

npm install


3- Configure environment variables in .env:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


4- Run locally:

npm run dev


Then visit http://localhost:5173.

Database Schema Highlights

locations / restaurants / dining_tables – manage multi-location restaurants and tables

menus / menu_categories / menu_items – hierarchical dynamic menu system

orders – JSONB order storage with status tracking

reviews – restaurant review system with ratings

loyalty_profiles / loyalty_rewards / loyalty_transactions – gamified loyalty system

User Flows

Guest User:
Select table → browse safe menu → add to cart → place order → track status

Registered User:
Sign in → dining session → personalized menus → earn loyalty points → review → redeem rewards

Security

Row Level Security (RLS) on all user-related tables

Authenticated vs guest access controls

Input validation with Zod

GDPR-compliant consent handling

Business Value

Safer, contactless dining for post-COVID adaptation

Reduces staff workload with digital ordering

Loyalty and gamification increase customer retention

Scalable across multiple restaurants and locations

Customer insights through reviews and analytics

Author

Developed by Maxim Berezin (@m2-berezin)
Email: maxim2.berezin@live.uwe.ac.uk