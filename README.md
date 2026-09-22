# Prime Path Trucking & Logistics

A complete Next.js App Router website for **Prime Path Trucking & Logistics**.

**Connecting Texas. City to City**

## Run locally

Use Node.js 22 LTS (or a compatible newer release).

```bash
npm ci
npm run dev
```

The development server uses port 4173. To choose another port, run `npm run dev -- --port 3000`.

```bash
npm run typecheck
npm test
npm run build
npm start
```

## GitHub → Vercel

Commit the contents of this folder to your GitHub repository, then import that repository into Vercel. Select the **Next.js** framework preset, keep the project root at this folder, and use `npm run build`. No static export or custom server is needed. The quote endpoint runs as a server route.

This package has not been pushed to a remote repository or deployed. Account connections were not available during this build. See the [official Next.js on Vercel documentation](https://vercel.com/docs/frameworks/full-stack/nextjs) for repository import and deployment settings.

## Freight inquiries

The form validates shipment and contact details on the client and server. Without email credentials, it prepares an email draft addressed to the existing business contact. It explicitly tells the visitor that the inquiry has **not** been sent yet. The visitor can open the draft or copy the details.

For automatic delivery, configure these server-only environment variables in Vercel:

| Variable           | Purpose                                                               |
| ------------------ | --------------------------------------------------------------------- |
| `RESEND_API_KEY`   | API key for the email provider                                        |
| `QUOTE_FROM_EMAIL` | A sender on your verified email domain                                |
| `QUOTE_TO_EMAIL`   | Optional recipient override; defaults to the contact in `lib/site.ts` |

The endpoint sends through the [Resend email API](https://resend.com/docs/api-reference/emails/send-email). It confirms success only after provider acceptance and offers an email fallback on failure. The included tests mock the provider; no real email was sent during validation. Configure provider and hosting abuse controls appropriate to the live site's traffic before enabling automated delivery.

## Included experience

- Responsive desktop, tablet, and mobile layouts.
- Custom navy-and-blue visual identity and typography served locally.
- Three branded day-cab concept photographs, optimized as WebP.
- A 12-second silent hero loop and a 19-second silent fleet film.
- Texas market explorer with keyboard-accessible tabs and lane-specific inquiry shortcuts.
- Dedicated trucking, regional truckload, and power-only service panels.
- Service-to-form selection, required-field validation, contact consent, a honeypot, field limits, and same-host origin checks.
- Expandable FAQs, native accessible film dialog, mobile navigation, privacy page, and branded 404.
- Reduced-motion and data-saving preferences respected for background video.
- Page metadata, custom favicon, and standard response security headers.

## Media and content

The logo is the supplied route-crest design. Fleet images are AI-generated brand concepts, and the footer discloses that. The MP4s are edited motion sequences from those still images, using slow camera moves and crossfades. They are not recordings of an operating fleet. All media is included locally; the site has no stock-photo dependency or external video embed.

Regenerate the motion pieces with `python3 scripts/create-motion.py` if FFmpeg is installed. The generated MP4s are already included, so FFmpeg and Python are **not** required to run or deploy the website.

The copy avoids invented fleet counts, revenue, testimonials, certifications, and delivery metrics. Services and Texas markets are presented for inquiry, with availability confirmed for each request.

The existing contact details are centralized in `lib/site.ts`. A trucking-specific domain or email can replace them there when available. No unowned domain has been inserted as a canonical URL.

## Main files

| File                     | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `app/page.tsx`           | Homepage, map, navigation, film, and inquiry interactions |
| `app/globals.css`        | Design system and responsive layouts                      |
| `app/api/quote/route.ts` | Validated freight inquiry endpoint                        |
| `lib/site.ts`            | Business name, tagline, and contact details               |
| `public/media/`          | Logo, photographs, and MP4s                               |
| `tests/quote.test.ts`    | Delivery, validation, reverse-proxy, and error-path tests |
| `.env.example`           | Optional automatic email configuration                    |

## Validation status

TypeScript and the optimized production build passed. The freight endpoint is covered by automated tests, including the no-credentials draft flow, origin handling behind a proxy, required contact consent, oversized payloads, provider acceptance, and provider failure. Media durations and encoding were checked with FFprobe.

The supervised preview started successfully, but the remote browser connection stalled. Desktop/mobile visual inspection and end-to-end browser interaction checks remain unverified. Review those layouts in your Vercel preview before assigning the production domain. Live email delivery also remains unverified until the email provider is configured.
