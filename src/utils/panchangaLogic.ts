import { DayData, LagnaPramanam } from '../types/panchangam';
import { NAKSHATRAS, ALL_RASHIS } from '../data/panchangamData';

export interface TaraResult {
  taraNumber: number;
  taraName: string;
  isFavorable: boolean;
  grade: 'excellent' | 'good' | 'neutral' | 'caution' | 'danger';
  description: string;
}

export const TARA_DEFINITIONS: Record<number, { name: string; isFavorable: boolean; grade: TaraResult['grade']; desc: string }> = {
  1: { name: 'జన్మ తార', isFavorable: false, grade: 'neutral', desc: 'శారీరక శ్రమ, అప్రమత్తత అవసరం. పెద్ద నిర్ణయాలకు మధ్యమం.' },
  2: { name: 'సంపత్ తార', isFavorable: true, grade: 'excellent', desc: 'అత్యంత శుభప్రదం. ధనలాభం, నూతన ప్రాజెక్టులు మరియు కార్యసిద్ధి.' },
  3: { name: 'విపత్ తార', isFavorable: false, grade: 'caution', desc: 'ఆటంకాలు ఎదురయ్యే అవకాశం. ప్రయాణాలలో జాగ్రత్త వహించండి.' },
  4: { name: 'క్షేమ తార', isFavorable: true, grade: 'good', desc: 'శుభ ఫలితాలు, సుఖ శాంతులు, కుటుంబంలో ఆనందం లభిస్తుంది.' },
  5: { name: 'ప్రత్యక్ తార', isFavorable: false, grade: 'caution', desc: 'వ్యతిరేకతలు, అపార్థాలు రావచ్చు. సంయమనం పాటించండి.' },
  6: { name: 'సాధక తార', isFavorable: true, grade: 'excellent', desc: 'కార్య సాధన, ఉద్యోగ వ్యాపారాలలో విజయాలు, నూతన ఒప్పందాలు.' },
  7: { name: 'నైధన తార (వధ)', isFavorable: false, grade: 'danger', desc: 'అత్యంత అశుభం. కొత్త పనులు, శుభ కార్యాలు వాయిదా వేయడం శ్రేయస్కరం.' },
  8: { name: 'మిత్ర తార', isFavorable: true, grade: 'good', desc: 'మిత్రుల సహకారం, సంతోషం, సత్ఫలితాలు చేకూరుతాయి.' },
  9: { name: 'పరమ మిత్ర తార', isFavorable: true, grade: 'excellent', desc: 'పరమ శుభం. ఉన్నత అధికారుల ప్రోత్సాహం, సర్వజన సౌఖ్యం.' },
};

/**
 * Calculates Tara Balam for a devotee's Janma Nakshatra against the Day's Nakshatra
 */
export function calculateTaraBalam(janmaNakshatraIndex: number, dayNakshatraIndex: number): TaraResult {
  // ((Day - Janma + 27) % 9) + 1
  const diff = ((dayNakshatraIndex - janmaNakshatraIndex + 27) % 9) + 1;
  const def = TARA_DEFINITIONS[diff] || TARA_DEFINITIONS[1];

  return {
    taraNumber: diff,
    taraName: def.name,
    isFavorable: def.isFavorable,
    grade: def.grade,
    description: def.desc,
  };
}

/**
 * Extract time in minutes from midnight for a standard 12-hour formatted time (e.g. "09:43 AM", "01:12 PM")
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Finds which Lagna is currently active for the given minute from midnight
 */
export function findActiveLagna(lagnalu: LagnaPramanam[], currentMinutes: number): LagnaPramanam | null {
  for (const item of lagnalu) {
    const times = item.samayam.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/gi);
    if (times && times.length >= 2) {
      let startM = parseTimeToMinutes(times[0]);
      let endM = parseTimeToMinutes(times[1]);

      if (startM !== null && endM !== null) {
        // If endM is smaller than startM, it spans midnight (e.g. 10:56 PM to 01:03 AM)
        if (endM < startM) {
          if (currentMinutes >= startM || currentMinutes < endM) {
            return item;
          }
        } else {
          if (currentMinutes >= startM && currentMinutes < endM) {
            return item;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Checks if a given Rashi has Chandrashtamam on a specific day
 */
export function checkChandrashtamam(rashiId: string, day: DayData): boolean {
  const dayChandraText = day.chandra.chandrashtamam || '';
  const rashi = ALL_RASHIS.find((r) => r.id === rashiId);
  if (!rashi) return false;

  const rashiNameTelugu = rashi.name.split(' ')[0]; // e.g. "కుంభం", "మేషం"
  const stem = rashiNameTelugu.replace(/ం$/, ''); // e.g. "కుంభ", "మేష"

  return dayChandraText.includes(rashiNameTelugu) || dayChandraText.includes(stem);
}

/**
 * Formats a clean WhatsApp share message
 */
export function generateWhatsAppShareText(day: DayData): string {
  return [
    `🕉️ *శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — నేటి పంచాంగం* 🕉️`,
    `📅 *తేదీ & వారం:* ${day.teediVaram}`,
    `✨ *సంవత్సరం:* ${day.panchanga.samvatsaram}`,
    `🌙 *మాసం & పక్షం:* ${day.panchanga.masam}`,
    `🔱 *తిథి:* ${day.panchanga.tithi}`,
    `⭐ *నక్షత్రం:* ${day.panchanga.nakshatram}`,
    `☀️ *యోగం:* ${day.panchanga.yogam} | *కరణం:* ${day.panchanga.karanam}`,
    ``,
    `🟢 *శుభ ముహూర్తం (అభిజిత్):* ${day.shubha.abhijit}`,
    `🔴 *రాహు కాలం:* ${day.ashubha.rahukalam}`,
    `⚠️ *దుర్ముహూర్తం:* ${day.ashubha.durmuhurtham}`,
    `⛔ *వర్జ్యం:* ${day.ashubha.varjyam}`,
    ``,
    `🌟 *నేటి విశేషం:* ${day.phalitham}`,
    ``,
    `పూర్తి పంచాంగం & రాశి ఫలితాల కోసం శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం సందర్శించండి.`,
    `సర్వేజనా సుఖినోభవంతు 🙏`,
  ].join('\n');
}

/**
 * Calculates correct Ayana and Rutu dynamically based on Masam
 * Ashwayuja, Kartika -> Sharad Rutuvu (శరద్ ఋతువు)
 * Margashira, Pushya -> Hemanta Rutuvu (హేమంత ఋతువు)
 */
export function getAyanaAndRutu(masamStr: string): { ayanam: string; rutuvu: string; rutuDesc: string } {
  const ayanam = 'దక్షిణాయనం';
  let rutuvu = 'శరద్ ఋతువు';
  let rutuDesc = 'శరదృతువు - దసరా, దీపావళి దీపకాంతుల పవిత్ర కాలం';

  if (masamStr.includes('ఆశ్వయుజ') || masamStr.includes('కార్తీక')) {
    rutuvu = 'శరద్ ఋతువు';
    rutuDesc = 'శరదృతువు - నిర్మల ఆకాశం, ఆధ్యాత్మిక సాధన కాలం';
  } else if (masamStr.includes('మార్గశిర') || masamStr.includes('పుష్య')) {
    rutuvu = 'హేమంత ఋతువు';
    rutuDesc = 'హేమంత ఋతువు - చలి కాలం, ధనుర్మాస పూజలు';
  } else if (masamStr.includes('మాఘ') || masamStr.includes('ఫాల్గుణ')) {
    rutuvu = 'శిశిర ఋతువు';
    rutuDesc = 'శిశిర ఋతువు - శివరాత్రి పర్వదిన సమయం';
  } else if (masamStr.includes('చైత్ర') || masamStr.includes('వైశాఖ')) {
    rutuvu = 'వసంత ఋతువు';
    rutuDesc = 'వసంత ఋతువు - నవ వసంతం, ఉగాది కాలం';
  } else if (masamStr.includes('జ్యేష్ఠ') || masamStr.includes('ఆషాఢ')) {
    rutuvu = 'గ్రీష్మ ఋతువు';
    rutuDesc = 'గ్రీష్మ ఋతువు - అధిక ఉష్ణోగ్రత సమయం';
  } else if (masamStr.includes('శ్రావణ') || masamStr.includes('భాద్రపద')) {
    rutuvu = 'వర్ష ఋతువు';
    rutuDesc = 'వర్ష ఋతువు - పవిత్ర వ్రతాలు, పూజల కాలం';
  }

  return { ayanam, rutuvu, rutuDesc };
}

/**
 * Formats a single copy-pasteable summary
 */
export function generateClipboardText(day: DayData): string {
  return generateWhatsAppShareText(day);
}

