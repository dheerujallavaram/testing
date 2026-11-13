import { DayData } from '../types/panchangam';
import { computeAccurateJanmaKundali } from './astronomyPanchangam';
import { BIRTH_CITIES } from '../data/birthCitiesData';

export interface FamilyBirthProfile {
  id: string;
  name: string;
  relationTe: string;
  relationEn: string;
  birthDate: string;
  birthTime: string;
  cityId: string;
  createdAt: string;
}

export interface FamilyDailyStatus {
  profile: FamilyBirthProfile;
  janmaRashiId: string;
  janmaRashiTe: string;
  janmaRashiEn: string;
  janmaNakshatraTe: string;
  janmaNakshatraEn: string;
  pada: number;
  taraNumber: number; // 1..9
  taraNameTe: string;
  taraNameEn: string;
  isTaraFavorable: boolean;
  chandraHouse: number; // 1..12
  isChandrashtamam: boolean;
  overallStatus: 'favorable' | 'mixed' | 'caution';
  statusBadgeTe: string;
  statusBadgeEn: string;
}

const STORAGE_KEY = 'slgj_family_profiles_v1';

const NAKSHATRA_NAMES_MATCH_ORDER = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష',
  'మఖ', 'పుబ్బ', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనురాధ', 'జ్యేష్ఠ',
  'మూల', 'పూర్వాషాఢ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి',
];

const RASHI_ORDER_LIST = [
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
];

const TARA_NAMES: { num: number; te: string; en: string; favorable: boolean }[] = [
  { num: 1, te: 'జన్మ తార', en: 'Janma Tara', favorable: false },
  { num: 2, te: 'సంపత్ తార', en: 'Sampat Tara', favorable: true },
  { num: 3, te: 'విపత్ తార', en: 'Vipat Tara', favorable: false },
  { num: 4, te: 'క్షేమ తార', en: 'Kshema Tara', favorable: true },
  { num: 5, te: 'ప్రత్యక్ తార', en: 'Pratyak Tara', favorable: false },
  { num: 6, te: 'సాధన తార', en: 'Sadhana Tara', favorable: true },
  { num: 7, te: 'నైధన తార', en: 'Naidhana Tara', favorable: false },
  { num: 8, te: 'మిత్ర తార', en: 'Mitra Tara', favorable: true },
  { num: 9, te: 'పరమ మిత్ర తార', en: 'Parama Mitra Tara', favorable: true },
];

export const FAMILY_RELATIONS = [
  { te: 'స్వీయ జాతకం (Self)', en: 'Self' },
  { te: 'భార్య / భర్త (Spouse)', en: 'Spouse' },
  { te: 'కుమారుడు / కుమార్తె (Child)', en: 'Child' },
  { te: 'తల్లి / తండ్రి (Parent)', en: 'Parent' },
  { te: 'సోదరుడు / సోదరి (Sibling)', en: 'Sibling' },
];

export function loadFamilyProfiles(): FamilyBirthProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.birthDate === 'string'
    );
  } catch {
    return [];
  }
}

export function saveFamilyProfile(input: Omit<FamilyBirthProfile, 'id' | 'createdAt'>): FamilyBirthProfile[] {
  const existing = loadFamilyProfiles();
  // Avoid duplicates by normalized name + birthDate
  const normalizedName = input.name.trim().toLowerCase();
  const existingIdx = existing.findIndex(
    (p) => p.name.trim().toLowerCase() === normalizedName && p.birthDate === input.birthDate
  );

  const entry: FamilyBirthProfile = {
    id: existingIdx >= 0 ? existing[existingIdx].id : `fam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: input.name.trim() || 'కుటుంబ సభ్యులు',
    relationTe: input.relationTe || 'కుటుంబ సభ్యులు',
    relationEn: input.relationEn || 'Family Member',
    birthDate: input.birthDate,
    birthTime: input.birthTime || '09:30',
    cityId: input.cityId || 'hyderabad',
    createdAt: new Date().toISOString(),
  };

  let updated: FamilyBirthProfile[];
  if (existingIdx >= 0) {
    updated = [...existing];
    updated[existingIdx] = entry;
  } else {
    updated = [entry, ...existing].slice(0, 12);
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
  return updated;
}

export function deleteFamilyProfile(id: string): FamilyBirthProfile[] {
  const updated = loadFamilyProfiles().filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
  return updated;
}

export function mergeCloudFamilyProfiles(
  cloudItems: {
    localProfileId: string;
    name: string;
    relationTe: string;
    relationEn: string;
    birthDate: string;
    birthTime: string;
    cityId: string;
  }[]
): FamilyBirthProfile[] {
  const local = loadFamilyProfiles();
  const mergedMap = new Map<string, FamilyBirthProfile>();
  for (const p of local) {
    mergedMap.set(`${p.name.trim().toLowerCase()}|${p.birthDate}`, p);
  }
  for (const c of cloudItems) {
    const key = `${c.name.trim().toLowerCase()}|${c.birthDate}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        id: c.localProfileId,
        name: c.name,
        relationTe: c.relationTe,
        relationEn: c.relationEn,
        birthDate: c.birthDate,
        birthTime: c.birthTime,
        cityId: c.cityId,
        createdAt: new Date().toISOString(),
      });
    }
  }
  const merged = Array.from(mergedMap.values()).slice(0, 12);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {}
  }
  return merged;
}

function resolveDayMoonIndices(day: DayData): { moonNakIdx1: number; moonRashiIdx0: number } {
  const nakStr = day.panchanga?.nakshatram || '';
  const foundNakIdx = NAKSHATRA_NAMES_MATCH_ORDER.findIndex((n) => nakStr.includes(n));
  const moonNakIdx1 = foundNakIdx >= 0 ? foundNakIdx + 1 : 1;

  const chandraStr = day.chandra?.sancharam || '';
  const foundRashiIdx = RASHI_ORDER_LIST.findIndex((r) => chandraStr.includes(r));
  const moonRashiIdx0 = foundRashiIdx >= 0 ? foundRashiIdx : 0;
  return { moonNakIdx1, moonRashiIdx0 };
}

export function computeFamilyDailyStatuses(
  profiles: FamilyBirthProfile[],
  day: DayData
): FamilyDailyStatus[] {
  const { moonNakIdx1, moonRashiIdx0 } = resolveDayMoonIndices(day);

  return profiles.map((profile) => {
    const city = BIRTH_CITIES.find((c) => c.id === profile.cityId) || BIRTH_CITIES[0];
    const chart = computeAccurateJanmaKundali(
      profile.birthDate,
      profile.birthTime,
      city.lat,
      city.lon,
      city.tz
    );

    const diffNak = ((moonNakIdx1 - chart.nakshatraIdx + 27) % 27);
    const taraIndex0 = diffNak % 9;
    const tara = TARA_NAMES[taraIndex0];

    const birthRashiIdx0 = chart.planets[2]?.rashiIdx ?? 0;
    const chandraHouse = ((moonRashiIdx0 - birthRashiIdx0 + 12) % 12) + 1;
    const isChandrashtamam = chandraHouse === 8;

    const chandraGood = [1, 3, 6, 7, 10, 11].includes(chandraHouse);
    let overallStatus: 'favorable' | 'mixed' | 'caution' = 'mixed';
    if (isChandrashtamam || (!tara.favorable && !chandraGood)) {
      overallStatus = 'caution';
    } else if (tara.favorable && chandraGood) {
      overallStatus = 'favorable';
    } else if (tara.favorable) {
      overallStatus = 'favorable';
    }

    const statusBadgeTe = isChandrashtamam
      ? 'చంద్రాష్టమం — జాగ్రత్త'
      : overallStatus === 'favorable'
      ? 'నేడు శుభదినం ✓'
      : overallStatus === 'caution'
      ? 'సాధారణ జాగ్రత్త'
      : 'మిశ్రమ బలం';

    const statusBadgeEn = isChandrashtamam
      ? 'Chandrashtamam — Caution'
      : overallStatus === 'favorable'
      ? 'Favorable Today ✓'
      : overallStatus === 'caution'
      ? 'Be Mindful'
      : 'Balanced';

    return {
      profile,
      janmaRashiId: chart.rashi.id,
      janmaRashiTe: chart.rashi.te,
      janmaRashiEn: chart.rashi.en,
      janmaNakshatraTe: chart.nakshatraName,
      janmaNakshatraEn: chart.nakshatraEn,
      pada: chart.pada,
      taraNumber: tara.num,
      taraNameTe: tara.te,
      taraNameEn: tara.en,
      isTaraFavorable: tara.favorable,
      chandraHouse,
      isChandrashtamam,
      overallStatus,
      statusBadgeTe,
      statusBadgeEn,
    };
  });
}
