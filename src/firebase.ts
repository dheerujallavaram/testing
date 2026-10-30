import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const ADMIN_OWNER_EMAIL = 'dheerujallavaram@gmail.com';

// Validate connection to Firestore on boot per skill requirements
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function isUserSuperAdmin(user: User | null | undefined): boolean {
  if (!user || !user.emailVerified || !user.email) return false;
  return user.email.toLowerCase() === ADMIN_OWNER_EMAIL.toLowerCase();
}

// Defensive string sanitizer & truncator matching firebase-blueprint.json boundaries
function clampString(val: string | undefined | null, minLen: number, maxLen: number, fallback: string): string {
  const trimmed = (val ?? '').trim();
  const base = trimmed.length >= minLen ? trimmed : fallback;
  return base.slice(0, maxLen);
}

function sanitizeId(rawId: string): string {
  const cleaned = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  return cleaned || `id_${Date.now()}`;
}

export interface SiteAnnouncementDoc {
  id: string;
  titleTe: string;
  titleEn: string;
  messageTe: string;
  messageEn: string;
  badgeTe: string;
  ctaLabelTe: string;
  ctaTarget: 'jathakam' | 'panchangam' | 'booking' | 'whatsapp';
  consultationHoursTe: string;
  isActive: boolean;
  authorId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface BookingInquiryDoc {
  id: string;
  referenceCode: string;
  inquiryType: 'pooja' | 'kundali_pdf' | 'muhurtham' | 'consultation';
  serviceName: string;
  devoteeName: string;
  phone: string;
  gotram: string;
  rashi: string;
  nakshatram: string;
  preferredDate: string;
  birthTime: string;
  birthPlace: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  ownerId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface KundaliRecordDoc {
  id: string;
  clientName: string;
  phone: string;
  gotram: string;
  birthDate: string;
  birthTime: string;
  birthCityId: string;
  birthCityLabel: string;
  rashiTe: string;
  nakshatraTe: string;
  lagnaTe: string;
  activeDashaTe: string;
  guruNotes: string;
  pdfDelivered: boolean;
  ownerId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function signInWithGooglePopup(): Promise<User> {
  const res = await signInWithPopup(auth, googleProvider);
  return res.user;
}

export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

export async function upsertLiveSiteAnnouncement(
  input: Omit<SiteAnnouncementDoc, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const docId = 'live_bulletin';
  const docPath = `siteAnnouncements/${docId}`;
  const docRef = doc(db, 'siteAnnouncements', docId);

  const validTargets = ['jathakam', 'panchangam', 'booking', 'whatsapp'] as const;
  const ctaTarget = validTargets.includes(input.ctaTarget) ? input.ctaTarget : 'jathakam';

  const basePayload = {
    titleTe: clampString(input.titleTe, 2, 240, 'నేటి ప్రత్యేక జ్యోతిష్య & ముహూర్త సూచన'),
    titleEn: clampString(input.titleEn, 2, 240, 'Today Special Vedic Astrology Bulletin'),
    messageTe: clampString(
      input.messageTe,
      2,
      1500,
      'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — మీ సంపూర్ణ జన్మ కుండలి 100 పేజీల PDF రిపోర్ట్ మరియు పూజా సంకల్పం కొరకు సంప్రదించండి.'
    ),
    messageEn: clampString(
      input.messageEn,
      2,
      1500,
      'Contact Sri Lakshmi Ganapathi Jyothishalayam for your 100-page Janma Kundali PDF report and Vedic Pooja bookings.'
    ),
    badgeTe: clampString(input.badgeTe, 2, 80, 'గురువుగారి నేటి విశేష సందేశం'),
    ctaLabelTe: clampString(input.ctaLabelTe, 2, 100, 'మీ 100 పేజీల కుండలి PDF పొందండి'),
    ctaTarget,
    consultationHoursTe: clampString(
      input.consultationHoursTe,
      2,
      160,
      'ఉదయం 06:30 AM – 12:30 PM | సాయంత్రం 04:30 PM – 08:30 PM'
    ),
    isActive: Boolean(input.isActive),
  };

  try {
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      await updateDoc(docRef, {
        ...basePayload,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...basePayload,
        authorId: sanitizeId(user.uid),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function createBookingRecordInFirestore(
  input: Omit<BookingInquiryDoc, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const docId = sanitizeId(input.id || `SLG_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`);
  const docPath = `bookings/${docId}`;
  const docRef = doc(db, 'bookings', docId);

  const validTypes = ['pooja', 'kundali_pdf', 'muhurtham', 'consultation'] as const;
  const inquiryType = validTypes.includes(input.inquiryType) ? input.inquiryType : 'pooja';

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'] as const;
  const status =
    isUserSuperAdmin(user) && validStatuses.includes(input.status) ? input.status : 'pending';

  const payload = {
    referenceCode: clampString(input.referenceCode, 4, 40, `SLG-${Math.floor(100000 + Math.random() * 900000)}`),
    inquiryType,
    serviceName: clampString(input.serviceName, 2, 180, 'వైదిక పూజా సంకల్పం / 100 పేజీల కుండలి PDF'),
    devoteeName: clampString(input.devoteeName, 1, 120, 'భక్తుడు'),
    phone: clampString(input.phone, 7, 24, '8977986166'),
    gotram: clampString(input.gotram, 1, 100, 'కాశ్యప గోత్రం'),
    rashi: clampString(input.rashi, 1, 80, 'మేష రాశి'),
    nakshatram: clampString(input.nakshatram, 1, 80, 'అశ్విని'),
    preferredDate: clampString(input.preferredDate, 4, 40, new Date().toISOString().slice(0, 10)),
    birthTime: clampString(input.birthTime, 0, 30, ''),
    birthPlace: clampString(input.birthPlace, 1, 120, 'హైదరాబాద్'),
    notes: clampString(input.notes, 0, 1000, ''),
    status,
    ownerId: sanitizeId(user.uid),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function updateBookingStatusInFirestore(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  notes?: string
): Promise<void> {
  const cleanId = sanitizeId(bookingId);
  const docPath = `bookings/${cleanId}`;
  const docRef = doc(db, 'bookings', cleanId);

  const updates: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };
  if (typeof notes === 'string') {
    updates.notes = clampString(notes, 0, 1000, '');
  }

  try {
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function deleteBookingFromFirestore(bookingId: string): Promise<void> {
  const cleanId = sanitizeId(bookingId);
  const docPath = `bookings/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'bookings', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function createKundaliRecordInFirestore(
  input: Omit<KundaliRecordDoc, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const docId = sanitizeId(`KND_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`);
  const docPath = `kundaliRecords/${docId}`;
  const docRef = doc(db, 'kundaliRecords', docId);

  const payload = {
    clientName: clampString(input.clientName, 1, 120, 'జాతకుడు'),
    phone: clampString(input.phone, 0, 24, ''),
    gotram: clampString(input.gotram, 0, 100, ''),
    birthDate: clampString(input.birthDate, 8, 20, '1994-08-15'),
    birthTime: clampString(input.birthTime, 4, 20, '09:30'),
    birthCityId: clampString(input.birthCityId, 2, 60, 'hyderabad'),
    birthCityLabel: clampString(input.birthCityLabel, 2, 120, 'హైదరాబాద్ (Hyderabad, TS)'),
    rashiTe: clampString(input.rashiTe, 1, 60, 'మేషం'),
    nakshatraTe: clampString(input.nakshatraTe, 1, 80, 'అశ్విని'),
    lagnaTe: clampString(input.lagnaTe, 1, 60, 'మేషం'),
    activeDashaTe: clampString(input.activeDashaTe, 1, 80, 'గురు మహాదశ'),
    guruNotes: clampString(input.guruNotes, 0, 2000, ''),
    pdfDelivered: Boolean(input.pdfDelivered),
    ownerId: sanitizeId(user.uid),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function updateKundaliRecordInFirestore(
  recordId: string,
  updates: Partial<Pick<KundaliRecordDoc, 'guruNotes' | 'pdfDelivered' | 'phone' | 'gotram'>>
): Promise<void> {
  const cleanId = sanitizeId(recordId);
  const docPath = `kundaliRecords/${cleanId}`;
  const docRef = doc(db, 'kundaliRecords', cleanId);

  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (typeof updates.guruNotes === 'string') {
    payload.guruNotes = clampString(updates.guruNotes, 0, 2000, '');
  }
  if (typeof updates.pdfDelivered === 'boolean') {
    payload.pdfDelivered = updates.pdfDelivered;
  }
  if (typeof updates.phone === 'string') {
    payload.phone = clampString(updates.phone, 0, 24, '');
  }
  if (typeof updates.gotram === 'string') {
    payload.gotram = clampString(updates.gotram, 0, 100, '');
  }

  try {
    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function deleteKundaliRecordFromFirestore(recordId: string): Promise<void> {
  const cleanId = sanitizeId(recordId);
  const docPath = `kundaliRecords/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'kundaliRecords', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
