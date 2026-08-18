# N5Deal Marketplace Prototype

Working marketplace prototype for M&A opportunities and financial assets. It covers the three requested roles: Buyer, Seller and Platform Manager.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma data model for PostgreSQL
- Prisma-backed API route for shared PostgreSQL persistence
- Browser persistence fallback for the live demo experience
- Local smart matching logic for AI-style deal recommendations
- Persistent in-app chat threads for buyer/seller communication
- URL-addressable screens for listings, asset details and chats

## Launch

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app syncs marketplace data through `/api/marketplace` when PostgreSQL is running. It also writes to `localStorage` as a fallback, so published assets, chat messages, buyer profile updates and manager moderation actions survive refresh even without a local database.

The selected role and user are also persisted. Main screens use real App Router routes: `/assets`, `/assets/[id]`, `/chats`, `/chats/[id]`, `/profile` and `/signup`.

## PostgreSQL

The PostgreSQL model is defined in `prisma/schema.prisma`. To run a local database:

```bash
cp .env.example .env
docker compose up -d
npm run db:generate
npm run db:push
npm run db:seed
```

`.env.example` already contains the local Docker database URL:

```env
DATABASE_URL="postgresql://n5deal:n5deal@localhost:5432/n5deal_marketplace?schema=public"
```

The Docker service uses the same credentials and database name, so after `docker compose up -d` Prisma can connect without any extra setup.

The app uses the same `MarketplaceState` shape in the UI and API layer. On first API read, an empty database is seeded automatically; `npm run db:seed` is available for a manual reset.

## Product Scope

Buyer:
- create a self-service buyer account at `/signup`
- maintain an active buyer identity via role switcher
- create and maintain a buyer profile at `/profile`
- describe investment and acquisition interests
- browse and search assets
- filter by sector and region
- open asset detail pages
- open a chat with sellers
- see smart fit score based on sector, region and ticket size

Seller:
- create a self-service seller account at `/signup`
- publish an asset
- browse own assets and open an asset detail page
- edit own published assets
- browse/search buyers
- review buyer mandate details
- open a chat with buyers
- view own published asset count

Platform Manager:
- create buyer and seller accounts
- view buyers and sellers
- view marketplace assets
- search participants
- suspend, reactivate or remove participants
- open separate compliance chats with participants

## Key Decisions

- **Next.js only, no separate Node.js backend:** Next.js already provides the UI and backend boundary through server components, route handlers and server actions. A separate backend would add operational overhead for this assignment without improving the evaluated flows.
- **Prisma/PostgreSQL model:** The schema separates participants, buyer profiles, assets, chat threads and chat messages. This keeps the marketplace extensible for future compliance, messaging and deal-room features.
- **Database-backed persistence with fallback:** The primary persistence path is a Next.js API route backed by Prisma/PostgreSQL. `localStorage` remains as a graceful fallback so the prototype is still reviewable when PostgreSQL is not running.
- **App Router structure:** The app is split into route-level pages and focused marketplace components rather than one large screen component.
- **Role switcher instead of auth:** Authentication was intentionally simplified so reviewers can inspect all flows quickly.
- **Chat instead of one-way contact:** Buyer/seller communication is represented as persistent chat threads backed by the Prisma data model. Platform Manager does not see private buyer/seller deal chats; managers can create separate compliance threads with participants. Realtime delivery is intentionally simulated in the prototype; a production version would add Socket.IO/ws in a separate Node service, or managed realtime such as Supabase Realtime/Pusher.
- **Smart matching:** A transparent scoring function ranks assets by buyer mandate overlap. This demonstrates AI/product thinking without depending on an external AI API key.

## Assumptions

- Asset prices are represented as EUR millions.
- A participant can be suspended or removed by a manager, but records stay visible for auditability.
- Suspended participants cannot publish, edit, or send chat messages; removed participants are hidden from regular buyer/seller flows.
- Opening a buyer/seller conversation creates a lightweight chat thread.
- The prototype prioritizes marketplace discovery, publishing and moderation over account security.

## AI Tools Used

AI assistance was used to accelerate product scoping, UI implementation, data modeling and README drafting. Final scope, trade-offs and validation were reviewed manually.

## With More Time

- Add authentication and role-based authorization.
- Add tests for filtering, matching and moderation flows.
- Add multilingual UI support.
- Add richer compliance rules and moderation audit history.
- Deploy with managed PostgreSQL, for example Neon or Supabase, plus Vercel.
