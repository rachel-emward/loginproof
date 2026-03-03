# Security & Compliance (SEC-Oriented)

This document describes technical controls implemented in this application to support a secure, regulated client portal. **SEC compliance is not achieved by code alone**; it requires policies, procedures, audits, and legal review. These measures are intended to support your compliance program.

## Implemented Controls

### Transport & Headers

- **HTTPS**: In production, HTTP requests are redirected to HTTPS (middleware). Ensure your host (e.g. Vercel) serves the app over TLS.
- **HSTS**: `Strict-Transport-Security` is set in production to enforce HTTPS for 1 year and allow preload.
- **Security headers** (via Next.js config and middleware):
  - `X-Frame-Options: DENY` — reduces clickjacking risk.
  - `X-Content-Type-Options: nosniff` — prevents MIME sniffing.
  - `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer leakage.
  - `Content-Security-Policy` — restricts script, style, and connect sources (Supabase allowed for auth/data).
  - `Permissions-Policy` — disables camera, microphone, geolocation.

### Authentication & Session

- **Session timeout**: After **15 minutes** of no user activity (mouse, keyboard, scroll, touch), the user is signed out and redirected to login. Configurable in `app/dashboard/SessionTimeout.tsx` (`IDLE_MINUTES`).
- **Protected routes**: Middleware and server-side checks ensure `/dashboard` and below require an authenticated user; otherwise redirect to `/login`.
- **Auth state**: Supabase handles token storage and refresh; ensure Supabase project uses secure cookie settings in production.

### Error Handling

- **Sanitized auth errors**: Login and signup do not display raw provider messages. `lib/auth-errors.ts` maps errors to generic messages (e.g. "Invalid credentials") to avoid user enumeration and information disclosure.

### Data Access

- **Row Level Security (RLS)**: The `documents` table is intended to be protected by RLS so users only access their own rows (`auth.uid() = user_id`). Keep RLS enabled and policies reviewed.
- **Server-side data**: Document list and user checks are performed on the server; no sensitive data is exposed to the client beyond what is necessary for the UI.

### Environment & Secrets

- **Template**: `.env.example` lists required variable names with placeholders; it is safe to commit. Copy it to `.env.local` and fill in real values only on your machine or in your deployment host.
- **Ignored files**: `.gitignore` excludes `.env`, `.env.local`, and `.env.*.local` so files containing real keys are never committed.
- **Required vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Set these in your host’s environment (e.g. Vercel → Project → Settings → Environment Variables) for production; do not put production keys in the repo or in a committed file.

## Outside the Scope of This Codebase

- **Policies & procedures**: Access control policy, incident response, business continuity, vendor (e.g. Supabase) due diligence.
- **Audits & assessments**: Penetration testing, vulnerability scanning, SOC 2 or equivalent.
- **Legal/regulatory**: Interpretation of SEC rules, filing requirements, and whether this app is in scope for specific regulations.
- **Operational**: Logging and monitoring, backup and retention, DLP, and security training.

## Recommendations

1. **Supabase**: In the Supabase dashboard, confirm auth cookies use `Secure`, `HttpOnly`, and `SameSite` in production, and review auth and RLS settings.
2. **CSP**: The current CSP allows `'unsafe-inline'` and `'unsafe-eval'` for Next.js. Consider moving to nonce-based CSP when feasible.
3. **Logging**: Add server-side audit logging (e.g. login success/failure, document access) to a secure, access-controlled log store for compliance and incident response.
4. **Session length**: Adjust `IDLE_MINUTES` in `SessionTimeout.tsx` to match your policy (e.g. 15 minutes for high-sensitivity portals).

If you have specific SEC or internal security requirements, align these controls with your security team and compliance counsel.
