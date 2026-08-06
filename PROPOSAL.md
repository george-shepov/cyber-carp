# Cyber Carp MVP — senior product and engineering proposal

## 1. Strongest homepage concept

**See the pass → understand the limits → show us the surface.**

The homepage should sell a visible transformation, not an abstract technology claim. The hero begins with an authentic muted cleaning loop and a restrained promise: **“Restore the surface. Keep the original material.”** The page then answers three customer questions in order:

1. What can this service do for my project?
2. Is it suitable and trustworthy?
3. How do I send enough information to get a useful response?

The prototype intentionally uses media placeholders because fabricated results would damage trust. Den’s first real shoot should replace them before public launch.

## 2. Section-by-section wireframe

| Section | Job | Primary interaction |
| --- | --- | --- |
| Sticky navigation | Keep estimate action visible | Jump links + mobile menu |
| Hero | Demonstrate the process immediately | Get estimate / watch footage |
| Positioning statement | Explain the customer benefit without hype | Suitability link |
| Service categories | Help visitors self-identify | Prefill estimate category |
| Video projects | Provide proof through real work | Filter + modal/video viewer |
| Process | Explain evaluation, test, treatment, inspection | Readable four-step sequence |
| Method comparison | Set accurate expectations | Precision/waste/access/suitability comparison |
| Operator credibility | Establish local accountability | Confirmed facts only |
| Service area | Qualify travel and local intent | ZIP capture in estimate form |
| Estimate + appointment request | Convert qualified interest | Form, uploads, timing preference |
| FAQ | Resolve objections | Native accessible accordion |
| Footer | Contact, legal, secondary navigation | Call/email/privacy links |
| Assistant | Qualify, then hand off | Guided fallback today; AI later |

## 3. Visual and interaction direction

- Dark industrial field plus warm paper sections and acid-lime signal color.
- Editorial serif italic for the “material/restoration” voice; compact uppercase utility labels for technical credibility.
- Thin grid lines, scan lines, and one restrained laser beam create a machine-shop feel without turning the site into cyberpunk.
- Real footage is the visual authority. No stock construction photos, fake testimonials, artificial sparks, or invented before/after results.
- Mobile uses a persistent bottom bar: Get estimate, Call, Ask assistant.
- Motion is optional and respects `prefers-reduced-motion`.

## 4. Recommended technology stack

### Prototype

The included prototype is dependency-free HTML/CSS/JavaScript. This is deliberate: it can be previewed immediately and gives Den something concrete to react to before production infrastructure is chosen.

### Production

- Next.js + TypeScript + Tailwind CSS + accessible shadcn/ui primitives.
- Server-rendered public page; project videos and FAQ content from structured data.
- Next.js route handlers for lead submission, signed uploads, notification dispatch, and the AI proxy. A small FastAPI service is a valid alternative if existing backend conventions make it cheaper to operate.
- PostgreSQL for leads, uploads, projects, appointment requests, conversations, and audit events.
- S3-compatible object storage plus CDN for approved marketing media; private bucket/prefix for customer uploads.
- Playwright for critical mobile flows; Vitest for validation, classification, and parsing.

Avoid microservices until the lead volume or operational requirements justify them.

## 5. Component architecture

```text
AppShell
├── SiteHeader
├── HeroMedia
├── PositioningStatement
├── ServiceGrid
│   └── ServiceCard
├── ProjectGallery
│   ├── ProjectFilters
│   ├── ProjectCard
│   └── ProjectViewer
├── ProcessSteps
├── MethodComparison
├── OperatorProfile
├── ServiceArea
├── LeadIntake
│   ├── ProjectFields
│   ├── MediaUpload
│   └── AppointmentPreferences
├── FAQ
├── ContactFooter
├── MobileActionBar
└── LaserAssistant
```

Keep content objects separate from rendering components. A future admin tool can edit the same project and FAQ records without redesigning the page.

## 6. Lead and appointment workflow

1. Visitor selects a service category or opens the estimate form.
2. Client validates required fields, file count, file type, and file size for immediate feedback.
3. Server validates again, creates a lead, and returns a stable inquiry reference.
4. Browser requests signed upload URLs; originals go to private storage and are linked to the lead.
5. Den receives a concise notification containing project summary, location, timing, and secure media links.
6. Customer receives a confirmation that says “request received,” not “appointment confirmed” or “price quoted.”
7. MVP collects preferred date/time windows. Den manually confirms an onsite estimate, phone consultation, demonstration, or service appointment.
8. Only after hours, travel buffers, blocked dates, and cancellation rules are known should live availability be enabled.

## 7. AI assistant architecture

The assistant is an enhancement around the same lead schema, not a separate funnel.

```text
Chat UI → /api/assistant → provider adapter → structured intake result
                 ↓                         ↓
          rate limit / logs          lead draft + human handoff
```

### Level 1 — launch fallback

Guided buttons and text questions collect removal target, material, dimensions, location, mobility, timing, and contact details. It works with no model provider configured.

### Level 2 — AI-assisted intake

The server calls the configured model provider. The model returns a strict schema: `category`, `material`, `contaminant`, `dimensions`, `location`, `timeline`, `customer_type`, `contact`, `missing_questions`, and `handoff_requested`. The UI can then populate the same estimate form.

### Level 3 — business integration

After operator-approved tools exist, the assistant may create a lead draft, read allowed availability, prepare follow-up notes, or request human contact. It must never operate a laser, guarantee compatibility, create a confirmed appointment without an actual calendar result, or provide binding pricing.

## 8. Video delivery strategy

- Shoot 16:9, 9:16, close-up, and wide footage for each object.
- Produce a short compressed hero loop, optimized gallery derivatives, poster frames, captions/transcripts when speech is present, and MP4 fallback.
- Store source footage outside the application repository.
- Put approved public derivatives behind object storage/CDN; use lazy loading and load gallery video only on user intent.
- Use `poster` images to prevent layout shift and make the page useful on slow connections.
- Keep the first viewport useful if video fails: poster/fallback content, headline, and estimate CTA remain visible.

## 9. Data model

```text
Lead(id, created_at, status, source, name, email, phone,
     preferred_contact_method, customer_type, zip_or_location,
     service_category, material, removal_target, dimensions,
     description, timing, access, consent_at, assigned_to)

Upload(id, lead_id, file_name, mime_type, file_size, storage_key,
       media_type, visibility, checksum, created_at, delete_at)

AppointmentRequest(id, lead_id, appointment_type, preferred_start,
       preferred_end, timezone, location, status, notes, created_at)

ProjectVideo(id, slug, title, category, description, material,
       removed_material, dimensions, duration, location, before_image,
       video_url, result_image, result_video_url, published, display_order)

Conversation(id, lead_id, session_id, provider, model, started_at,
       ended_at, human_handoff_requested, structured_summary)

AuditEvent(id, actor, action, entity_type, entity_id, created_at, metadata)
```

## 10. Security and privacy controls

- Keep AI, database, mail, calendar, and storage secrets server-side only.
- Use signed, short-lived upload URLs; restrict MIME types, extensions, size, count, and storage prefixes.
- Run malware-aware processing where practical; never make original customer uploads public by default.
- Rate-limit form and chat endpoints; add Turnstile or equivalent spam defense.
- Sanitize text and filenames; treat all customer text as untrusted data and never as system instructions.
- Do not allow the model to execute arbitrary tools or read unrelated records.
- Use HTTPS, secure cookies, CSRF protection where applicable, and least-privilege service credentials.
- Retain only what is needed; publish an upload deletion/retention policy.
- Keep analytics event properties coarse: never attach images, raw uploads, full form submissions, or full chat transcripts.
- Provide contact consent, privacy policy, service-request terms, suitability disclaimer, and non-binding estimate language.

## 11. Implementation phases

### Phase 1 — content-ready prototype

Approve visual direction, replace placeholders with real business facts, capture launch footage, and test the page on mobile.

### Phase 2 — functional MVP

Implement production lead persistence, private uploads, notifications, request-based appointment intake, SEO metadata, analytics, monitoring, and deployment.

### Phase 3 — assistant

Add provider adapter, structured extraction, lead handoff, rate limiting, error fallback, and a human-contact route.

### Phase 4 — business platform

Admin project publishing, lead pipeline, live calendar, reminders, follow-ups, estimate/deposit support, case-study pages, local SEO pages, and commercial workflows.

## 12. Risks and concrete improvements

| Risk or weak point | Improvement |
| --- | --- |
| “Video-first” can become a performance problem | One short hero loop, poster-first gallery, lazy loading, CDN derivatives |
| The brief contains many future features | Lock launch to one page, lead capture, private uploads, manual scheduling |
| Equipment investment can be mistaken for proof of competence | Show training/equipment only as verified facts; publish real demonstrations |
| Laser claims can create safety or expectation risk | Use substrate/coating-specific qualification language and test-area review |
| AI can hallucinate suitability or pricing | Structured output, server proxy, no binding quotes, human escalation |
| Real customer uploads create privacy and abuse risk | Private storage, signed URLs, retention policy, rate limits, malware-aware workflow |
| Service radius and hours are not confirmed | Use placeholders now; collect ZIP and confirm policy before live scheduling |
| The existing paid site may be hard to replace immediately | Deploy preview first; keep the current site online until acceptance |
| A generic FAQ can become legal filler | Use only questions Den can answer accurately; review terms before launch |

## 13. Definition of done for this prototype

- Single-page responsive homepage exists and runs without a build step.
- Primary actions work: estimate anchor, category prefill, gallery filters, project dialog, mobile menu, assistant fallback.
- Lead form validates required fields and communicates the production integration boundary.
- File selection displays the intended five-file/25 MB-per-file rules and rejects violations client-side.
- No testimonial, credential, insurance, price, or customer result is fabricated.
- Explicit placeholders identify the facts and media Den must confirm.
- README, content checklist, architecture, workflow, security, and deployment direction are included.
