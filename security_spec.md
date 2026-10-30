# Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Default-Deny Catch-All**: Any path not explicitly matched is unconditionally denied (`allow read, write: if false;`).
2. **Verified Identity & Bootstrapped Admin**:
   - All authenticated writes require `request.auth != null && request.auth.token.email_verified == true`.
   - `isAdmin()` is true ONLY if the user is signed in, has `request.auth.token.email_verified == true`, and either matches the bootstrapped owner email (`dheerujallavaram@gmail.com`) or exists in `/admins/$(request.auth.uid)`.
3. **Path Variable Hardening (`isValidId`)**:
   - Every single-document operation (`get`, `create`, `update`, `delete`) validates its path ID variable with `id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`.
4. **Strict Schema & Key Whitelisting (`hasAll` + `hasOnly`)**:
   - Every `create` and `update` invokes `isValid[Entity](incoming())` checking exact key sets (`hasAll` and `hasOnly`), field types, string `.size()` bounds, enums, and `ownerId`/`authorId` integrity.
5. **PII Isolation (`/bookings` & `/kundaliRecords`)**:
   - Documents in `/bookings/{bookingId}` and `/kundaliRecords/{recordId}` contain client PII (`phone`, `devoteeName`, `birthDate`).
   - `get` and `list` are strictly restricted to `isAdmin() || (isVerifiedUser() && resource.data.ownerId == request.auth.uid)`. Blanket `isSignedIn()` reads are forbidden.
6. **Temporal Integrity & Immutability**:
   - On `create`: `incoming().createdAt == request.time && incoming().updatedAt == request.time`.
   - On `update`: `incoming().createdAt == existing().createdAt && incoming().updatedAt == request.time`, and `ownerId`/`authorId` are immutable (`incoming().ownerId == existing().ownerId`).
7. **Terminal State Locking**:
   - For `/bookings/{bookingId}`, once `existing().status in ['completed', 'cancelled']`, non-admin users cannot mutate the document (`isAdmin()` override allowed for admin state corrections).

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 (Shadow Field Injection on Booking Create)**:
   `{ ...validBooking, "isSuperAdmin": true }` -> Rejected by `data.keys().hasOnly(...)`.
2. **Payload 2 (Identity Spoofing on Booking Create)**:
   `{ ...validBooking, "ownerId": "victim_uid_999" }` sent by `attacker_uid_111` -> Rejected by `incoming().ownerId == request.auth.uid`.
3. **Payload 3 (Unverified Email Spoofing Admin Access)**:
   Token with `email: "dheerujallavaram@gmail.com"`, `email_verified: false` attempting to create `/siteAnnouncements/live` -> Rejected by `request.auth.token.email_verified == true`.
4. **Payload 4 (PII Blanket Read on `/bookings`)**:
   Authenticated non-admin user `user_b` attempting `get(/bookings/booking_owned_by_user_a)` -> Rejected because `resource.data.ownerId != request.auth.uid` and not `isAdmin()`.
5. **Payload 5 (Unauthorized List Scraping on `/bookings`)**:
   Authenticated non-admin user attempting unconstrained `list(/bookings)` -> Rejected unless `resource.data.ownerId == request.auth.uid` or `isAdmin()`.
6. **Payload 6 (Timestamp Forgery on Create)**:
   `{ ...validBooking, "createdAt": Timestamp.fromMillis(1000000) }` -> Rejected by `incoming().createdAt == request.time`.
7. **Payload 7 (Immutable `createdAt` or `ownerId` Tampering on Update)**:
   Updating `ownerId` or `createdAt` on `/kundaliRecords/{recordId}` -> Rejected by immutability checks and `affectedKeys().hasOnly(...)`.
8. **Payload 8 (Terminal State Re-opening by Non-Admin)**:
   Non-admin owner attempting to update a booking whose `existing().status == 'completed'` -> Rejected by terminal state lock.
9. **Payload 9 (Denial-of-Wallet Oversized String Payload)**:
   `notes` field with 50,000 characters in `/bookings/{bookingId}` -> Rejected by `data.notes.size() <= 1000`.
10. **Payload 10 (ID Poisoning Attack)**:
    Creating a document with path ID containing special characters or >128 chars -> Rejected by `isValidId()`.
11. **Payload 11 (Non-Admin Publishing Site Announcement)**:
    Regular verified user attempting `create` on `/siteAnnouncements/main` -> Rejected by `isAdmin()`.
12. **Payload 12 (Self-Privilege Escalation in `/admins`)**:
    Regular verified user attempting `create` on `/admins/$(request.auth.uid)` -> Rejected because only bootstrapped super-admin can write to `/admins`.
