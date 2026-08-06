# Cyber Carp laser restoration — MVP prototype

A fast, mobile-first, video-first single-page prototype for Cyber Carp Laser Restoration. It is intentionally dependency-free so Den can review the experience immediately and it can be hosted as a static preview before the production lead, upload, scheduling, and AI services are connected.

## Experience concept

**See the pass → understand the limits → show us the surface.** The first viewport treats laser cleaning as a visible process rather than a generic handyman promise. The homepage then moves from service categories to authentic project evidence, explains suitability in plain language, establishes operator credibility without inventing credentials, and ends with a photo-friendly project inquiry.

## Run locally

```bash
cd cyber-carp-mvp
python3 -m http.server 4173
```

Open `http://localhost:4173`.

The form and assistant are functional demo interactions only. They deliberately show the production integration point instead of pretending that a lead was delivered.

## MVP file structure

```text
cyber-carp-mvp/
├── index.html       # semantic homepage and structured content
├── styles.css       # responsive visual system
├── app.js           # menu, filters, dialog, demo form, fallback assistant
├── README.md
└── .env.example     # production integration contract
```

## Recommended production stack

- Next.js + TypeScript + Tailwind/shadcn for the production version, with server-rendered public content and reusable sections.
- PostgreSQL for leads, project videos, appointment requests, conversations, and audit events.
- S3-compatible private storage for customer uploads; public optimized media bucket/CDN for approved marketing videos.
- Next.js route handlers or a small FastAPI service for lead submission, signed uploads, notifications, rate limiting, and the future AI proxy.
- Request-based scheduling first. Add live availability only after Den confirms hours, travel buffers, appointment types, and service radius.
- Playwright for mobile end-to-end checks; Vitest or equivalent for validation and lead classification.

## Production integration contract

1. Replace the hero and project placeholders with authenticated footage from Den’s shoot.
2. Connect the form to `POST /api/leads`.
3. Request signed upload URLs from `POST /api/uploads/presign`; upload originals privately, validate MIME/type/size server-side, and attach upload IDs to the lead.
4. Notify Den and send a confirmation containing the generated inquiry reference.
5. Add `POST /api/appointment-requests`; start with preferred date/time windows and manual confirmation.
6. Keep the assistant as a guided fallback by default. Later, proxy model calls server-side and convert chat answers into the same lead schema.

## Required launch placeholders

`[DEN FULL NAME]`, `[PHONE NUMBER]`, `[BUSINESS EMAIL]`, `[SERVICE RADIUS]`, `[TRAINING PROVIDER]`, `[EQUIPMENT MODEL]`, `[POWER RATING]`, `[INSURANCE STATUS]`, `[HOURS]`, social links, legal business name, privacy policy, service terms, and the real video/poster assets.

## Important assignment corrections

- Do not launch with the phrase “zero damage,” “dust-free,” “risk-free,” or a universal material claim.
- Do not publish the approximately $20,000 equipment/training investment as if it proves certification or insurance.
- Do not make live scheduling a launch blocker. A request workflow is safer until availability and travel rules are real.
- Do not store full chat transcripts or uploaded media in analytics events.
- Do not use an AI chat as the only contact path; the page remains useful with chat disabled.
