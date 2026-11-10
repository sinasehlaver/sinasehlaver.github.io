// Demo data for company_ticket. Schema: see job/site/demos/demo.js (validated by scripts/test-demos.mjs).
window.DEMO = {
  "slug": "company_ticket",
  "name": "company_ticket",
  "repo": "https://github.com/sinasehlaver/company_ticket",
  "tagline": "Seat-map ticket sales for the ODTÜ Company musicals: sellers hold and sell seats live from a phone, with roles, per-show reports and backups.",
  "intro": "A volunteer theatre group sells a few thousand seats over two months a year, from several phones at once. This app gives every seller the same live seat map, so a seat can be held, sold or cancelled in seconds without two people selling it twice.",
  "stageTitle": "Spring Musical · fake hall",
  "tryLede": "A small fake hall and a simulated second seller. The real app's interface is Turkish first, with English available; nothing here is sold or saved.",
  "tasks": [
    { "id": "hold", "text": "Hold two seats", "hint": "Click two free (white) seats. They turn blue: they're yours until you sell or release them.", "ok": "Held. Other sellers now see those seats as taken." },
    { "id": "other", "text": "Meet the other seller", "hint": "Every 3 seconds Seller 2 holds or sells a seat. Click an orange seat.", "ok": "The map refreshes every 3 seconds, so everyone sees the same hall." },
    { "id": "sell", "text": "Sell your seats", "hint": "Press Sell in the bar under the map.", "ok": "One step: the seats are sold, logged and counted in the show's report." },
    { "id": "cancel", "text": "Cancel a sale", "hint": "Press \"Cancel a sale\", then click a sold (crimson) seat.", "ok": "Refunded, and the seat is free again. Every cancel is logged per seat." }
  ],
  "finish": "That's a show night: hold, sell, and fix mistakes, from a phone.",
  "howLede": "Express 5 with libsql (a SQLite file locally, Turso in production) and a React client. Deployed on Render's free tier.",
  "how": [
    { "title": "No double sales", "text": "Holds and sales are single conditional updates in the database, so two sellers can never get the same seat, even at the same instant." },
    { "title": "Halls, shows, prices", "text": "Halls with seat maps (or a plain ticket count), events and show days with per-row prices." },
    { "title": "Roles as data", "text": "Superuser, başkan, sales and custom roles, each a set of permissions edited in the app. Every route is checked on the server." },
    { "title": "Reports and logs", "text": "A per-seat log of who held, sold or cancelled, and a per-event report with revenue and CSV export." },
    { "title": "Backups", "text": "Download the database, merge-import a backup, with automatic snapshots before every import and encrypted scheduled backups." },
    { "title": "A guided tour", "text": "First sign-in opens a Turkish tour of every page, plus a practice page with a fake hall where no real tickets are sold." }
  ],
  "shot": { "src": "../../img/project-company-ticket.png", "alt": "The real ticket sales page: three show-day tabs, seat-count cards and a colour-tiered seat map with sold seats in crimson.", "caption": "The real day page, on a throwaway database with fake sales." },
  "endTitle": "Run your own box office",
  "endText": "Needs Node 22.13+. ./start.sh seeds two halls and prints dev passwords; deploying to Render + Turso is documented in the repo."
};
