# Prime Path Trucking & Logistics

A complete Next.js website for **Day Cabs, Box Trucks, and Cargo Vans** operating in Texas.

**Connecting Texas. City to City.**

## Start the website

Use Node.js 22 LTS or a compatible newer release. Open a terminal in this folder:

```bash
npm ci
npm run dev
```

Open `http://localhost:4173`. To use another development port, run `npm run dev -- --port 3000`.

For the production build:

```bash
npm run build
npm start
```

This ZIP contains the source code, locked dependencies, locally served fonts, logo, photographs, and videos. No remote image service or video embed is required.

## What is included

- A new navy and blue trucking identity inspired by the angular Prime Path Holdings mark.
- A fleet hero showing all three vehicle classes together, plus a dedicated photograph and service description for each.
- Responsive desktop, tablet, and mobile layouts, with mobile navigation and a keyboard skip link.
- A 12-second silent background video and an 18-second fleet film in an accessible dialog.
- A Texas market explorer for Dallas–Fort Worth, Houston, Austin, and San Antonio, with keyboard navigation and route inquiry shortcuts.
- Dedicated routes, local and regional delivery, and time-sensitive freight content.
- A two-step freight request form with equipment selection, editable shipment details, and explicit delivery status.
- FAQs, a privacy notice, a branded 404, page metadata, and a matching favicon.
- Reduced-motion and data-saving preferences respected for background video. Phones use the still photograph.

## Freight inquiries

The form works immediately in **email-draft mode**. It validates the request, prepares an email addressed to **Rody@primepathholdings.com**, and tells the visitor to open and send the draft. It does not claim that an unsent draft was delivered.

Optional automatic email delivery uses server-only configuration:

| Variable           | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `RESEND_API_KEY`   | Email provider API key                                              |
| `QUOTE_FROM_EMAIL` | Sender address on a verified domain                                 |
| `QUOTE_TO_EMAIL`   | Optional recipient override; otherwise the business contact is used |

Copy `.env.example` to `.env.local` and set these values for automatic delivery. The [Resend email API](https://resend.com/docs/api-reference/emails/send-email) receives the request on the server. Provider acceptance is required before the website displays a sent confirmation. A provider failure offers the prepared email as a fallback.

The endpoint checks equipment and service choices, required contact consent, same-host origin, field types, and payload sizes. It also includes a honeypot and a provider timeout. Provider and hosting rate limits can be configured for a live installation. No live email was sent during the included validation.

## Content and media

The logo and four fleet photographs were created for this concept. The imagery is not documentary evidence of a fleet. The website discloses that the fleet imagery is a brand concept.

The videos are silent motion edits of the included photographs, with slow camera moves and crossfades. They are not recordings of trucks in motion. Regenerate them with `python3 scripts/create-motion.py` if FFmpeg is available; neither Python nor FFmpeg is needed to run the website.

All three vehicle classes appear in the opening copy, fleet section, services, FAQ, and quote form. Copy avoids invented fleet counts, delivery metrics, testimonials, certifications, and revenue claims. Equipment details and availability are confirmed for each inquiry.

The business contact and Dallas–Fort Worth base are centralized in `lib/site.ts`. No unowned trucking domain is used as a canonical URL.

## Edit the project

| File                       | Purpose                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| `app/page.tsx`             | Homepage sections, navigation, market explorer, and video dialog |
| `app/globals.css`          | Typography, colors, responsive layout, and interaction styles    |
| `components/Brand.tsx`     | Shared logo                                                      |
| `components/QuoteForm.tsx` | Two-step freight inquiry flow                                    |
| `lib/fleet.ts`             | Vehicles, services, and Texas markets                            |
| `lib/site.ts`              | Business name, contact details, and slogan                       |
| `app/api/quote/route.ts`   | Validated inquiry endpoint and optional email delivery           |
| `public/media/`            | Logo, WebP photographs, and MP4 videos                           |
| `docs/ASSETS.md`           | Media direction and asset notes                                  |

## Validation

```bash
npm run typecheck
npm test
npm run build
```

The API tests cover draft delivery, proxy origin handling, invalid requests, consent, all three equipment classes, provider acceptance, and provider failure. Provider calls are mocked.

Browser checks cover the desktop, phone, and tablet layouts; equipment shortcuts; required fields; freight and contact step transitions; a completed email draft; Texas market tabs; mobile navigation; and the fleet video dialog. Automated delivery still requires your provider configuration.
