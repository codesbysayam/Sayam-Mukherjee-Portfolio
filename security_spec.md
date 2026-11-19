# Security Specification & TDD Invariants — Sayam Mukherjee Portfolio

## Owner & Administrative Identity
- Canonical Admin Email: `wrickbusiness@gmail.com` (requires `email_verified == true` in Firebase Auth ID Token).
- Unauthenticated or non-admin requests MUST NEVER read PII (`contact_messages`, `subscribers`, `analytics_events`, `admins`) or unapproved `testimonials`.

## Critical Invariants (Eight Pillars)
1. **Default Deny**: Root `match /{document=**} { allow read, write: if false; }`.
2. **Public Projection Only**: `GET /api/portfolio-data` projects strictly public portfolio fields (`projects`, `blogs`, `certifications`, `skills`, `experience`, `achievements`, `learningDashboard`, `stats`, `socials`, approved `testimonials`) and NEVER includes `messages`, `subscribers`, `visitors`, or raw attachments.
3. **Server-Side Admin Authorization**: All `/api/admin/*`, `POST /api/portfolio-data/update`, and `POST/PATCH/DELETE /api/certificates` routes require `Authorization: Bearer <Firebase ID Token>` verified via `firebase-admin/auth` (`verifyIdToken`) with `email_verified === true` and lowercase email matching `SERVER_CONFIG.adminEmail` (`wrickbusiness@gmail.com`).
4. **Zero Client-Trusted Auth / No Simulated OTP**: No `otpSimulated`, no `mock_jwt_node_*`, no client boolean auth flags. Admin authentication uses Firebase Google Sign-In (`signInWithPopup` + `onAuthStateChanged` + real Firebase ID Token).
5. **Bounded Document Validation & Ownership**:
   - All Firestore document IDs match `isValidId(id)` (`^[a-zA-Z0-9_-]{3,80}$`).
   - All strings enforce `.size()` bounds; all lists enforce `.size() <= MAX`.
   - Public `create` on `testimonials` enforces `approved == false`, bounded name/role/content, and server timestamp `createdAt == request.time`.
   - Public `create` on `contact_messages` enforces `status == 'unread'`, email validation, attachment size/type metadata bounds (no multi-megabyte inline blobs), and `createdAt == request.time`.
   - Public `create` on `subscribers` enforces valid email format, hashed deterministic document ID, and `createdAt == request.time`.
   - Public `create` on `analytics_events` rejects fake seed generation; enforces valid `device` (`Desktop`, `Mobile`, `Tablet`) and bounded `durationSec`.
6. **Field Mutability Protection**: Updates on `testimonials` or `contact_messages` restrict changed fields via `request.resource.data.diff(resource.data).affectedKeys().hasOnly(...)` and preserve immutable fields like `createdAt`.
7. **Temporal Integrity**: Creation timestamps require `request.time`.

## Dirty Dozen Verification Cases (Automated Tests)
- Unauthenticated `GET /api/admin/messages` -> `401 Unauthorized`
- Unauthenticated `GET /api/admin/subscribers` -> `401 Unauthorized`
- Unauthenticated `GET /api/admin/analytics` -> `401 Unauthorized`
- Unauthenticated `POST /api/admin/messages/action` -> `401 Unauthorized`
- Unauthenticated `POST /api/admin/testimonials/action` -> `401 Unauthorized`
- Unauthenticated `POST /api/portfolio-data/update` -> `401 Unauthorized`
- Unauthenticated `POST /api/certificates` -> `401 Unauthorized`
- Unauthenticated `PATCH /api/certificates/:id` -> `401 Unauthorized`
- Unauthenticated `DELETE /api/certificates/:id` -> `401 Unauthorized`
- Non-admin verified token (`other@example.com`) -> `403 Forbidden`
- Unverified admin email token (`email_verified: false`) -> `403 Forbidden`
- `GET /api/portfolio-data` excludes `messages`, `subscribers`, `visitors`, `otpSimulated`, `"Nathan Drake"`
- `POST /api/contact` rejects honeypot, rejects oversized attachment >2MB, validates email, persists submission & returns honest `deliveryStatus`
- `POST /api/newsletter/subscribe` prevents silent duplicates, persists subscriber, and returns honest status
