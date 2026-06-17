# Campus Grounds

A campus cafe's order counter, rebuilt as a system.

Three small, well-known data structures run the whole thing: a
**priority queue** decides whose ticket gets made next, a
**breadth-first search** finds the nearest free table, and
**Dijkstra's algorithm** finds the shortest hallway to deliver coffee
to a department, lab, or faculty lounge.

This started as a C++ backend with no frontend (see
[`legacy-cpp-backend/`](./legacy-cpp-backend)). This repo is a
full rewrite: the same three algorithms reimplemented in TypeScript,
behind a from-scratch UI, as a single Next.js app you can run locally
or deploy to Vercel in a couple of minutes.

## How it works

**Order & Queue.** Every ticket carries a priority (1 = faculty/
department delivery, 2 = standard, 3 = no rush) and a timestamp.
A binary min-heap keyed on `(priority, timestamp)` means the next
ticket pulled off the queue is always the most urgent one, and ties
are broken first-come-first-served. See [`lib/orderQueue.ts`](./lib/orderQueue.ts)
and the underlying [`lib/minHeap.ts`](./lib/minHeap.ts).

**Find a Seat.** The floor is a 6x8 grid of walls, aisles, and
tables. Pressing "find me a seat" runs a BFS outward from the door,
one ring of distance at a time — so whichever free table the search
reaches first is provably the closest one. See
[`lib/seating.ts`](./lib/seating.ts).

**Department Delivery.** The building — corridors, staircases, and
thirteen named blocks/labs/lounges — is modeled as a weighted
undirected graph. Dijkstra's algorithm (with the same min-heap used
by the order queue) finds the shortest walk from the cafe to any
destination. See [`lib/delivery.ts`](./lib/delivery.ts).

All three live behind a small REST API under `app/api/`, kept
in-memory in a module-level singleton (see [`lib/store.ts`](./lib/store.ts))
— intentionally simple for a portfolio deploy. Swapping that for a
real database wouldn't touch the algorithms or the API routes at all,
just `lib/store.ts`.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · lucide-react

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Deploy

This is a standard Next.js app, so it deploys to
[Vercel](https://vercel.com/new) with no configuration: push the repo
to GitHub, import it on Vercel, and ship. (`next build` / `next start`
both work out of the box if you'd rather self-host.)

## Project layout

```
app/                 routes (pages + API handlers)
  page.tsx              landing page
  counter/page.tsx       the interactive app (order / seats / delivery)
  api/                   REST endpoints backing the three systems
components/          UI components
lib/                 the actual data structures + business logic
legacy-cpp-backend/  the original C++17 server this project grew out of
```

## Note on the in-memory store

State lives in server memory, which is fine for a single warm
instance (great for a demo, a recruiter clicking around, or local
dev) but won't survive a cold start or scale across multiple
serverless instances. For a production deployment, `lib/store.ts` is
the one file you'd change — point it at Redis/Postgres and the rest
of the app, including every API route, stays exactly the same.
