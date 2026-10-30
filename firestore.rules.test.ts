/**
 * Firestore Security Rules Verification Suite (Dirty Dozen Payloads)
 * Verifies that all 12 adversarial payloads in security_spec.md return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TEST_CASES: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Booking Create',
    collection: '/bookings/booking_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: { isSuperAdmin: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Identity Spoofing on Booking Create',
    collection: '/bookings/booking_2',
    operation: 'create',
    auth: { uid: 'attacker_1', email: 'attacker@example.com', email_verified: true },
    payload: { ownerId: 'victim_999' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified Email Spoofing Admin Access',
    collection: '/siteAnnouncements/main',
    operation: 'create',
    auth: { uid: 'spoof_admin', email: 'dheerujallavaram@gmail.com', email_verified: false },
    payload: { titleTe: 'Spoofed' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'PII Blanket Read on Bookings by Non-Owner',
    collection: '/bookings/booking_user_a',
    operation: 'get',
    auth: { uid: 'user_b', email: 'userb@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Unauthorized List Scraping on Bookings',
    collection: '/bookings',
    operation: 'list',
    auth: { uid: 'user_b', email: 'userb@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Timestamp Forgery on Create',
    collection: '/bookings/booking_6',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: { createdAt: '1970-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Immutable ownerId Tampering on Update',
    collection: '/kundaliRecords/rec_1',
    operation: 'update',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: { ownerId: 'another_user' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Terminal State Re-opening by Non-Admin',
    collection: '/bookings/completed_booking',
    operation: 'update',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: { status: 'pending' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Denial-of-Wallet Oversized String Payload',
    collection: '/bookings/booking_9',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    payload: { notes: 'x'.repeat(5000) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'ID Poisoning Attack with Invalid Characters',
    collection: '/bookings/invalid$id!@#',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Non-Admin Publishing Site Announcement',
    collection: '/siteAnnouncements/live',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Self-Privilege Escalation in Admins Collection',
    collection: '/admins/user_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user1@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
];
