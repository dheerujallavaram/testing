import { KundaliPlanetDetail, getSiderealMoonLongitude, getSiderealSunLongitude, norm360 } from './astronomyPanchangam';

export type VrataCategory = 'ekadashi' | 'pradosham' | 'chaturthi' | 'pournami' | 'amavasya' | 'shivaratri' | 'festival';

export interface VrataEventItem {
  id: string;
  isoDate: string;
  dayNum: number;
  monthIndex: number; // 0..11
  year: number;
  weekdayTe: string;
  weekdayEn: string;
  category: VrataCategory;
  titleTe: string;
  titleEn: string;
  tithiTe: string;
  tithiEn: string;
  lunarMonthTe: string;
  lunarMonthEn: string;
  significanceTe: string;
  significanceEn: string;
  isMajorFestival: boolean;
}

export interface MonthlyVrataGroup {
  year: number;
  monthIndex: number;
  monthLabelTe: string;
  monthLabelEn: string;
  events: VrataEventItem[];
}

const GREG_MONTHS_TE = [
  'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్',
  'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్',
];

const GREG_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AMANTA_MONTHS_BILINGUAL = [
  { key: 'Chaitra', te: 'చైత్ర మాసం', en: 'Chaitra Masam' },
  { key: 'Vaisakha', te: 'వైశాఖ మాసం', en: 'Vaisakha Masam' },
  { key: 'Jyeshtha', te: 'జ్యేష్ఠ మాసం', en: 'Jyeshtha Masam' },
  { key: 'Ashadha', te: 'ఆషాఢ మాసం', en: 'Ashadha Masam' },
  { key: 'Sravana', te: 'శ్రావణ మాసం', en: 'Shravana Masam' },
  { key: 'Bhadrapada', te: 'భాద్రపద మాసం', en: 'Bhadrapada Masam' },
  { key: 'Aswayuja', te: 'ఆశ్వయుజ మాసం', en: 'Ashwayuja Masam' },
  { key: 'Karthika', te: 'కార్తీక మాసం', en: 'Kartika Masam' },
  { key: 'Margasira', te: 'మార్గశిర మాసం', en: 'Margashira Masam' },
  { key: 'Pushya', te: 'పుష్య మాసం', en: 'Pushya Masam' },
  { key: 'Magha', te: 'మాఘ మాసం', en: 'Magha Masam' },
  { key: 'Phalguna', te: 'ఫాల్గుణ మాసం', en: 'Phalguna Masam' },
];

function getAmantaMonthAtSunrise(sunriseUtc: Date): { key: string; te: string; en: string } {
  const sunLon = getSiderealSunLongitude(sunriseUtc);
  const moonLon = getSiderealMoonLongitude(sunriseUtc);
  const elongation = norm360(moonLon - sunLon);
  const daysSinceNewMoon = elongation / 12.190749;
  const newMoonUtc = new Date(sunriseUtc.getTime() - daysSinceNewMoon * 86400 * 1000);
  const sunAtNewMoon = getSiderealSunLongitude(newMoonUtc);
  const solarSignAtNewMoon = Math.floor(sunAtNewMoon / 30) % 12;
  const amantaMonthIndex = (solarSignAtNewMoon + 1) % 12;
  return AMANTA_MONTHS_BILINGUAL[amantaMonthIndex];
}

export function generate12MonthVratasAndFestivals(
  startYear: number,
  startMonthIndex: number, // 0..11
  numMonths = 12
): MonthlyVrataGroup[] {
  const groups: MonthlyVrataGroup[] = [];
  const seenKeys = new Set<string>();

  for (let mOffset = 0; mOffset < numMonths; mOffset++) {
    const absMonth = startMonthIndex + mOffset;
    const year = startYear + Math.floor(absMonth / 12);
    const monthIndex = absMonth % 12;
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const events: VrataEventItem[] = [];

    let prevSunSign = -1;
    let prevTithiIdx = -1;

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      // 06:00 AM IST = 00:30 UTC on the calendar date
      const sunriseUtc = new Date(Date.UTC(year, monthIndex, dayNum, 0, 30, 0));
      const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dow = sunriseUtc.getUTCDay();

      const sunLon = getSiderealSunLongitude(sunriseUtc);
      const moonLon = getSiderealMoonLongitude(sunriseUtc);
      const elong = norm360(moonLon - sunLon);
      const tithiIdx = Math.floor(elong / 12) % 30; // 0=Sukla Padyami .. 14=Pournami .. 29=Amavasya
      const sunSign = Math.floor(sunLon / 30) % 12;
      const monthMeta = getAmantaMonthAtSunrise(sunriseUtc);

      const pushUnique = (
        category: VrataCategory,
        dedupKey: string,
        titleTe: string,
        titleEn: string,
        tithiTe: string,
        tithiEn: string,
        significanceTe: string,
        significanceEn: string,
        isMajorFestival = false
      ) => {
        if (seenKeys.has(dedupKey)) return;
        seenKeys.add(dedupKey);
        events.push({
          id: `${isoDate}-${category}-${dedupKey}`,
          isoDate,
          dayNum,
          monthIndex,
          year,
          weekdayTe: WEEKDAYS_TE[dow],
          weekdayEn: WEEKDAYS_EN[dow],
          category,
          titleTe,
          titleEn,
          tithiTe,
          tithiEn,
          lunarMonthTe: monthMeta.te,
          lunarMonthEn: monthMeta.en,
          significanceTe,
          significanceEn,
          isMajorFestival,
        });
      };

      // Solar Makara Sankranti (Sun enters Sidereal Makara = index 9)
      if (prevSunSign === 8 && sunSign === 9) {
        pushUnique(
          'festival',
          `sankranti-${year}`,
          'మకర సంక్రాంతి (ఉత్తరాయణ పుణ్యకాలం)',
          'Makara Sankranti (Uttarayana Punyakalam)',
          'సూర్య సంక్రమణం',
          'Makara Sankramanam',
          'సూర్య భగవానుడు మకర రాశిలోకి ప్రవేశించే మహా పుణ్యదినం. పితృ తర్పణం, గంగాస్నానం & దానం విశేషం.',
          'Sacred solar ingress into Capricorn heralding Uttarayana Punyakalam.',
          true
        );
      }
      prevSunSign = sunSign;

      // Skip exact duplicate consecutive sunrise tithi except if month transition
      const cycleStamp = `${year}-${monthMeta.key}-${tithiIdx}`;
      if (prevTithiIdx !== tithiIdx) {
        // Major Lunar Telugu Festivals mapped astronomically to Amanta month + Tithi
        if (monthMeta.key === 'Chaitra' && tithiIdx === 0) {
          pushUnique(
            'festival',
            `ugadi-${cycleStamp}`,
            'శ్రీ ఉగాది పండుగ (తెలుగు నూతన సంవత్సరం)',
            'Sri Ugadi (Telugu New Year)',
            'చైత్ర శుక్ల పాడ్యమి',
            'Chaitra Shukla Padyami',
            'పంచాంగ శ్రవణం, ఉగాది పచ్చడి స్వీకారం & నూతన సంవత్సర సంకల్ప దినం.',
            'Telugu New Year celebrated with Panchanga Sravanam & Pachadi.',
            true
          );
        } else if (monthMeta.key === 'Chaitra' && tithiIdx === 8) {
          pushUnique(
            'festival',
            `sriramanavami-${cycleStamp}`,
            'శ్రీరామ నవమి (సీతారామ కళ్యాణం)',
            'Sri Rama Navami',
            'చైత్ర శుక్ల నవమి',
            'Chaitra Shukla Navami',
            'శ్రీ సీతారామ చంద్ర స్వామి జన్మ నక్షత్ర పునరావృత కళ్యాణ మహోత్సవం.',
            'Celebration of Lord Sri Rama’s birth and celestial wedding.',
            true
          );
        } else if (monthMeta.key === 'Sravana' && tithiIdx === 3) {
          pushUnique(
            'festival',
            `nagulachaviti-${cycleStamp}`,
            'నాగ పంచమి / నాగుల చవితి వ్రతం',
            'Naga Chaturthi',
            'శ్రావణ శుక్ల చవితి',
            'Shravana Shukla Chaturthi',
            'సుబ్రహ్మణ్య & నాగదేవతా ఆరాధన ద్వారా కుజ-సర్ప దోష శాంతి.',
            'Naga & Subrahmanya worship for planetary peace and family protection.',
            true
          );
        } else if (monthMeta.key === 'Sravana' && tithiIdx === 14) {
          pushUnique(
            'festival',
            `sravana-pournami-${cycleStamp}`,
            'శ్రావణ పౌర్ణమి / రాఖీ పౌర్ణమి / జంధ్యాల పౌర్ణమి',
            'Shravana Pournami / Raksha Bandhan',
            'శ్రావణ శుక్ల పౌర్ణమి',
            'Shravana Shukla Pournami',
            'ఉపాకర్మ, రక్షా బంధనం మరియు వరలక్ష్మీ సమీప పుణ్య పౌర్ణమి.',
            'Sacred day for Upakarma, Raksha Bandhan, and Vedic Sankalpam.',
            true
          );
        } else if (monthMeta.key === 'Sravana' && tithiIdx === 22) {
          pushUnique(
            'festival',
            `krishnashtami-${cycleStamp}`,
            'శ్రీ కృష్ణాష్టమి (జన్మాష్టమి)',
            'Sri Krishna Janmashtami',
            'శ్రావణ కృష్ణ అష్టమి',
            'Shravana Krishna Ashtami',
            'అర్ధరాత్రి శ్రీ కృష్ణ పరమాత్మ అవతార పుణ్య దినం.',
            'Midnight celebration of Lord Sri Krishna’s divine incarnation.',
            true
          );
        } else if (monthMeta.key === 'Bhadrapada' && tithiIdx === 3) {
          pushUnique(
            'festival',
            `vinayakachavithi-${cycleStamp}`,
            'శ్రీ వినాయక చవితి (గణేశ నవరాత్రి)',
            'Sri Vinayaka Chavithi (Ganesh Chaturthi)',
            'భాద్రపద శుక్ల చవితి',
            'Bhadrapada Shukla Chaturthi',
            'సకల విఘ్న నివారణకు శ్రీ మహాగణపతి షోడశోపచార పూజ.',
            'Grand worship of Lord Maha Ganapathi for obstacle removal & wisdom.',
            true
          );
        } else if (monthMeta.key === 'Aswayuja' && tithiIdx === 9) {
          pushUnique(
            'festival',
            `vijayadashami-${cycleStamp}`,
            'శ్రీ విజయదశమి (దసరా మహోత్సవం)',
            'Vijaya Dashami (Dussehra)',
            'ఆశ్వయుజ శుక్ల దశమి',
            'Ashwayuja Shukla Dashami',
            'శమీ పూజ, అపరాజితా పూజ మరియు సర్వ కార్య విజయానికి పరమ శుభ దినం.',
            'Celebration of triumph, Shami Pooja, and auspicious new beginnings.',
            true
          );
        } else if (monthMeta.key === 'Aswayuja' && tithiIdx === 29) {
          pushUnique(
            'festival',
            `deepavali-${cycleStamp}`,
            'శ్రీ దీపావళి (లక్ష్మీ కుబేర పూజ)',
            'Deepavali (Lakshmi Pooja)',
            'ఆశ్వయుజ బహుళ అమావాస్య',
            'Ashwayuja Krishna Amavasya',
            'కేదారేశ్వర వ్రతం, శ్రీ మహాలక్ష్మీ పూజ & దీపోత్సవ పుణ్యదినం.',
            'Festival of Lights featuring Mahalakshmi Kubera & Kedareshwara Pooja.',
            true
          );
        } else if (monthMeta.key === 'Karthika' && tithiIdx === 10) {
          pushUnique(
            'festival',
            `utthana-ekadashi-${cycleStamp}`,
            'ఉత్థాన ఏకాదశి (క్షీరాబ్ది ద్వాదశి సమీపం)',
            'Utthana Ekadashi (Prabodhini)',
            'కార్తీక శుక్ల ఏకాదశి',
            'Kartika Shukla Ekadashi',
            'శ్రీ మహావిష్ణువు యోగనిద్ర నుండి మేల్కొనే పరమ పవిత్ర ఏకాదశి.',
            'Sacred Kartika Shukla Ekadashi marking Vishnu Prabodhini.',
            true
          );
        } else if (monthMeta.key === 'Karthika' && tithiIdx === 14) {
          pushUnique(
            'festival',
            `kartika-pournami-${cycleStamp}`,
            'కార్తీక పౌర్ణమి (జ్వాలా తోరణం · 365 వత్తుల దీపం)',
            'Kartika Pournami (Deepotsavam)',
            'కార్తీక శుక్ల పౌర్ణమి',
            'Kartika Shukla Pournami',
            'శివకేశవ ప్రీత్యర్థం నదీస్నానం, రుద్రాభిషేకం & 365 వత్తుల దీపారాధన.',
            'Most sacred Kartika full moon for Shiva Rudrabhishekam & 365 wicks lighting.',
            true
          );
        } else if (monthMeta.key === 'Margasira' && tithiIdx === 10) {
          pushUnique(
            'festival',
            `vaikuntha-ekadashi-${cycleStamp}`,
            'శ్రీ వైకుంఠ ఏకాదశి / గీతా జయంతి',
            'Vaikuntha Ekadashi / Gita Jayanti',
            'మార్గశిర శుక్ల ఏకాదశి',
            'Margashira Shukla Ekadashi',
            'ఉత్తర ద్వార దర్శన పుణ్యకాలం మరియు భగవద్గీతా ఉపదేశ దినం.',
            'Sacred Ekadashi for Uttara Dwara Darshanam and Bhagavad Gita Jayanti.',
            true
          );
        } else if (monthMeta.key === 'Magha' && tithiIdx === 28) {
          pushUnique(
            'festival',
            `mahashivaratri-${cycleStamp}`,
            'శ్రీ మహాశివరాత్రి (లింగోద్భవ జాగరణ)',
            'Maha Shivaratri',
            'మాఘ కృష్ణ చతుర్దశి',
            'Magha Krishna Chaturdashi',
            'రాత్రి లింగోద్భవ కాల మహాన్యాస పూర్వక రుద్రాభిషేకం & ఉపవాస జాగరణ.',
            'Greatest night of Lord Shiva for Rudrabhishekam & all-night vigil.',
            true
          );
        } else if (monthMeta.key === 'Phalguna' && tithiIdx === 14) {
          pushUnique(
            'festival',
            `holi-kamadahana-${cycleStamp}`,
            'హోళీ పౌర్ణమి / లక్ష్మీ జయంతి',
            'Holi Pournami / Lakshmi Jayanti',
            'ఫాల్గుణ శుక్ల పౌర్ణమి',
            'Phalguna Shukla Pournami',
            'శ్రీ మహాలక్ష్మి జయంతి మరియు హోలికా పౌర్ణమి శుభ దినం.',
            'Auspicious full moon honoring Goddess Lakshmi and spring renewal.',
            true
          );
        }

        // Standard Monthly Vratas
        if (tithiIdx === 10 || tithiIdx === 25) {
          const isShukla = tithiIdx === 10;
          pushUnique(
            'ekadashi',
            `ekadashi-${cycleStamp}`,
            `${monthMeta.te.replace(' మాసం', '')} ${isShukla ? 'శుక్ల' : 'కృష్ణ'} ఏకాదశి`,
            `${monthMeta.en.replace(' Masam', '')} ${isShukla ? 'Shukla' : 'Krishna'} Ekadashi`,
            isShukla ? 'శుక్ల ఏకాదశి' : 'కృష్ణ ఏకాదశి',
            isShukla ? 'Shukla Ekadashi' : 'Krishna Ekadashi',
            'శ్రీ మహావిష్ణువు ప్రీతి కొరకు ఉపవాసం, విష్ణు సహస్రనామ పారాయణం శ్రేష్ఠం.',
            'Sacred Vishnu fasting day; ideal for Vishnu Sahasranama recitation.',
            false
          );
        } else if (tithiIdx === 12 || tithiIdx === 27) {
          const isShukla = tithiIdx === 12;
          const isShani = dow === 6;
          const isSoma = dow === 1;
          const pradoshaPrefix = isShani ? 'శని ' : isSoma ? 'సోమ ' : '';
          const pradoshaPrefixEn = isShani ? 'Shani ' : isSoma ? 'Soma ' : '';
          pushUnique(
            'pradosham',
            `pradosham-${cycleStamp}`,
            `${pradoshaPrefix}ప్రదోష వ్రతం (${isShukla ? 'శుక్ల' : 'కృష్ణ'} త్రయోదశి)`,
            `${pradoshaPrefixEn}Pradosham (${isShukla ? 'Shukla' : 'Krishna'} Trayodashi)`,
            isShukla ? 'శుక్ల త్రయోదశి' : 'కృష్ణ త్రయోదశి',
            isShukla ? 'Shukla Trayodashi' : 'Krishna Trayodashi',
            'సాయంత్రం ప్రదోష కాలంలో (5:30 PM – 7:00 PM) శివాభిషేకం సర్వ దోష హరం.',
            'Auspicious dusk window for Lord Shiva Abhishekam & Bilva Archana.',
            false
          );
        } else if (tithiIdx === 18) {
          pushUnique(
            'chaturthi',
            `sankashti-${cycleStamp}`,
            `సంకష్టహర చతుర్థి (${monthMeta.te.replace(' మాసం', '')})`,
            `Sankashtahara Chaturthi (${monthMeta.en.replace(' Masam', '')})`,
            'కృష్ణ చవితి',
            'Krishna Chaturthi',
            'సాయంత్రం చంద్రోదయ దర్శనంతో శ్రీ సంకటనాశన గణపతి పూజ విఘ్న నివారకం.',
            'Worship Lord Ganesha before evening moonrise to dissolve life hurdles.',
            false
          );
        } else if (tithiIdx === 14) {
          pushUnique(
            'pournami',
            `pournami-${cycleStamp}`,
            `${monthMeta.te.replace(' మాసం', '')} పౌర్ణమి (సత్యనారాయణ వ్రతం)`,
            `${monthMeta.en.replace(' Masam', '')} Pournami`,
            'శుక్ల పౌర్ణమి',
            'Shukla Pournami',
            'శ్రీ సత్యనారాయణ స్వామి వ్రతం, లలితా సహస్రనామ కుంకుమార్చనలకు పరమ శుభం.',
            'Full moon ideal for Satyanarayana Vratham & Sri Lalita Sahasranama.',
            false
          );
        } else if (tithiIdx === 28) {
          pushUnique(
            'shivaratri',
            `masashivaratri-${cycleStamp}`,
            `మాస శివరాత్రి (${monthMeta.te.replace(' మాసం', '')})`,
            `Masa Shivaratri (${monthMeta.en.replace(' Masam', '')})`,
            'కృష్ణ చతుర్దశి',
            'Krishna Chaturdashi',
            'రాత్రి నిశీధ కాలంలో రుద్రాభిషేకం & ఓం నమః శివాయ జపం మనశ్శాంతినిస్తుంది.',
            'Monthly sacred night of Shiva worship for spiritual clarity and strength.',
            false
          );
        } else if (tithiIdx === 29) {
          const isSomavati = dow === 1;
          pushUnique(
            'amavasya',
            `amavasya-${cycleStamp}`,
            `${isSomavati ? 'సోమవతి ' : ''}${monthMeta.te.replace(' మాసం', '')} అమావాస్య`,
            `${isSomavati ? 'Somavati ' : ''}${monthMeta.en.replace(' Masam', '')} Amavasya`,
            'కృష్ణ అమావాస్య',
            'Krishna Amavasya',
            'పితృ దేవతలకు తిల తర్పణం, బ్రాహ్మణ భోజనం & ఆలయ ప్రదక్షిణకు శ్రేష్ఠ దినం.',
            'Sacred day for Pitru Tarpana, ancestors prayers, and charitable giving.',
            false
          );
        }
      }
      prevTithiIdx = tithiIdx;
    }

    groups.push({
      year,
      monthIndex,
      monthLabelTe: `${GREG_MONTHS_TE[monthIndex]} ${year}`,
      monthLabelEn: `${GREG_MONTHS_EN[monthIndex]} ${year}`,
      events,
    });
  }

  return groups;
}

// =========================================================================
// LAGNA-BASED RATNA (GEMSTONE), RUDRAKSHA & POOJA REMEDY ADVISOR
// =========================================================================
export interface RatnaGuidance {
  primaryGemTe: string;
  primaryGemEn: string;
  upaRatnaTe: string;
  upaRatnaEn: string;
  weightCaratsTe: string;
  metalAndFingerTe: string;
  metalAndFingerEn: string;
  auspiciousDayAndTimeTe: string;
  auspiciousDayAndTimeEn: string;
  mantraTe: string;
  bhagyaGemTe: string;
  bhagyaGemEn: string;
  avoidGemsTe: string;
  avoidGemsEn: string;
  rudrakshaTitleTe: string;
  rudrakshaTitleEn: string;
  rudrakshaBenefitTe: string;
  rudrakshaBenefitEn: string;
  recommendedPoojaTe: string;
  recommendedPoojaEn: string;
  poojaReasonTe: string;
  poojaReasonEn: string;
}

interface LagnaGemProfile {
  primaryTe: string;
  primaryEn: string;
  upaTe: string;
  upaEn: string;
  metalTe: string;
  metalEn: string;
  dayTe: string;
  dayEn: string;
  mantra: string;
  bhagyaTe: string;
  bhagyaEn: string;
  avoidTe: string;
  avoidEn: string;
  rudrakshaTe: string;
  rudrakshaEn: string;
  rudrakshaNoteTe: string;
  rudrakshaNoteEn: string;
}

const LAGNA_RATNA_MAP: Record<number, LagnaGemProfile> = {
  0: {
    primaryTe: 'పగడం (Red Coral — మేష లగ్నాధిపతి కుజ రత్నం)',
    primaryEn: 'Red Coral (Moonga — Aries Lagna Lord Mars)',
    upaTe: 'కెంపు ఉపా-రత్నం / రాగి ఉంగరం',
    upaEn: 'Red Carnelian / Copper Band',
    metalTe: 'బంగారం లేదా రాగి · కుడి చేతి ఉంగరపు వేలు',
    metalEn: 'Gold or Copper · Right Ring Finger',
    dayTe: 'మంగళవారం ఉదయం 6:00–7:00 AM (కుజ హోర)',
    dayEn: 'Tuesday Sunrise (Mars Hora)',
    mantra: 'ఓం అం అంగారకాయ నమః (108 సార్లు)',
    bhagyaTe: 'కనకపుష్యరాగం (Yellow Sapphire — భాగ్య గురు రత్నం)',
    bhagyaEn: 'Yellow Sapphire (9th Lord Jupiter)',
    avoidTe: 'నీలం (Blue Sapphire), పచ్చ (Emerald — 3/6వ అధిపతి)',
    avoidEn: 'Blue Sapphire & Emerald (6th/11th Trika influence)',
    rudrakshaTe: '3 ముఖాల రుద్రాక్ష + 5 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '3 Mukhi + 5 Mukhi Rudraksha',
    rudrakshaNoteTe: 'కుజ తేజస్సును స్థిరపరచి ధైర్య, ఆరోగ్య & గురు అనుగ్రహాన్ని పెంచుతుంది.',
    rudrakshaNoteEn: 'Balances Mars energy, builds courage, vitality, and Jupiter wisdom.',
  },
  1: {
    primaryTe: 'వజ్రం / ఒపల్ (Diamond or White Opal — శుక్ర రత్నం)',
    primaryEn: 'Diamond or White Opal (Taurus Lagna Lord Venus)',
    upaTe: 'స్ఫటిక మణి / తెలుపు జిర్కాన్',
    upaEn: 'White Zircon / Clear Quartz',
    metalTe: 'వెండి లేదా ప్లాటినం · మధ్య వేలు / చిటికెన వేలు',
    metalEn: 'Silver or Platinum · Middle / Little Finger',
    dayTe: 'శుక్రవారం ఉదయం 6:00–7:00 AM (శుక్ర హోర)',
    dayEn: 'Friday Sunrise (Venus Hora)',
    mantra: 'ఓం శుం శుక్రాయ నమః (108 సార్లు)',
    bhagyaTe: 'నీలం (Blue Sapphire — యోగకారక 9/10వ అధిపతి శని)',
    bhagyaEn: 'Blue Sapphire (Yogakaraka 9th & 10th Lord Saturn)',
    avoidTe: 'కనకపుష్యరాగం (Yellow Sapphire — 8/11వ అధిపతి)',
    avoidEn: 'Yellow Sapphire (8th/11th Lord Jupiter)',
    rudrakshaTe: '6 ముఖాల రుద్రాక్ష + 7 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '6 Mukhi + 7 Mukhi Rudraksha',
    rudrakshaNoteTe: 'మహాలక్ష్మీ కటాక్షం, ఆర్థిక వృద్ధి మరియు వాక్ శుద్ధిని ప్రసాదిస్తుంది.',
    rudrakshaNoteEn: 'Attracts Mahalakshmi grace, career stability, and refined speech.',
  },
  2: {
    primaryTe: 'పచ్చ (Natural Emerald — మిథున లగ్నాధిపతి బుధ రత్నం)',
    primaryEn: 'Natural Emerald (Panna — Gemini Lagna Lord Mercury)',
    upaTe: 'పెరిడాట్ (Peridot) లేదా ఆకుపచ్చ ఒనిక్స్',
    upaEn: 'Peridot or Green Tourmaline',
    metalTe: 'బంగారం లేదా పంచలోహం · చిటికెన వేలు (Little Finger)',
    metalEn: 'Gold · Right Little Finger',
    dayTe: 'బుధవారం ఉదయం (బుధ హోర)',
    dayEn: 'Wednesday Sunrise (Mercury Hora)',
    mantra: 'ఓం బుం బుధాయ నమః (108 సార్లు)',
    bhagyaTe: 'నీలం / వజ్రం (9వ అధిపతి శని / 5వ అధిపతి శుక్ర రత్నం)',
    bhagyaEn: 'Diamond / Opal (5th Lord Venus) or Amethyst',
    avoidTe: 'పగడం (Red Coral — 6/11వ అధిపతి), ముత్యం (Pearl)',
    avoidEn: 'Red Coral (6th/11th Lord Mars) & Pearl',
    rudrakshaTe: '4 ముఖాల రుద్రాక్ష + 10 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '4 Mukhi + 10 Mukhi Rudraksha',
    rudrakshaNoteTe: 'బుద్ధి కుశలత, వ్యాపార నిర్ణయ శక్తి & విద్యా విజయాలను అందిస్తుంది.',
    rudrakshaNoteEn: 'Sharpens intellect, communication, and business insight.',
  },
  3: {
    primaryTe: 'సహజ ముత్యం (Natural Pearl — కర్కాటక లగ్నాధిపతి చంద్ర రత్నం)',
    primaryEn: 'Natural Pearl (Moti — Cancer Lagna Lord Moon)',
    upaTe: 'మూన్‌స్టోన్ (Moonstone)',
    upaEn: 'White Moonstone',
    metalTe: 'స్వచ్ఛమైన వెండి (Silver) · చిటికెన వేలు',
    metalEn: 'Pure Silver · Right Little Finger',
    dayTe: 'సోమవారం ఉదయం (చంద్ర హోర)',
    dayEn: 'Monday Sunrise (Moon Hora)',
    mantra: 'ఓం సోం సోమాయ నమః (108 సార్లు)',
    bhagyaTe: 'పగడం (Red Coral — యోగకారక 5/10వ అధిపతి కుజుడు)',
    bhagyaEn: 'Red Coral (Yogakaraka 5th/10th Lord Mars) or Yellow Sapphire',
    avoidTe: 'నీలం (Blue Sapphire — 7/8వ శని), వజ్రం (Diamond)',
    avoidEn: 'Blue Sapphire (7th/8th Saturn) & Diamond',
    rudrakshaTe: '2 ముఖాల రుద్రాక్ష + గౌరీ శంకర రుద్రాక్ష',
    rudrakshaEn: '2 Mukhi + Gauri Shankar Rudraksha',
    rudrakshaNoteTe: 'మనశ్శాంతి, మాతృ సౌఖ్యం మరియు దాంపత్య అనురాగాన్ని పెంపొందిస్తుంది.',
    rudrakshaNoteEn: 'Calms emotions, nurtures family peace, and deepens intuition.',
  },
  4: {
    primaryTe: 'మాణిక్యం (Natural Ruby — సింహ లగ్నాధిపతి సూర్య రత్నం)',
    primaryEn: 'Natural Ruby (Manikya — Leo Lagna Lord Sun)',
    upaTe: 'రెడ్ గార్నెట్ / సన్‌స్టోన్',
    upaEn: 'Red Garnet / Sunstone',
    metalTe: 'బంగారం (Gold) · ఉంగరపు వేలు (Ring Finger)',
    metalEn: 'Gold · Right Ring Finger',
    dayTe: 'ఆదివారం ఉదయం సూర్యోదయ సమయం',
    dayEn: 'Sunday Morning (Sun Hora)',
    mantra: 'ఓం ఘృణిః సూర్యాయ నమః (108 సార్లు)',
    bhagyaTe: 'పగడం (Red Coral — యోగకారక 4/9వ అధిపతి కుజుడు)',
    bhagyaEn: 'Red Coral (Yogakaraka 4th & 9th Lord Mars)',
    avoidTe: 'నీలం (Blue Sapphire — 6/7వ శని), గోమేధికం',
    avoidEn: 'Blue Sapphire (6th/7th Saturn) & Gomedha',
    rudrakshaTe: '1 ముఖి లేదా 12 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '1 Mukhi or 12 Mukhi Rudraksha',
    rudrakshaNoteTe: 'రాజకీయ, పరిపాలనా గౌరవం మరియు ఆత్మవిశ్వాసాన్ని ఇస్తుంది.',
    rudrakshaNoteEn: 'Radiates leadership authority, health, and Sun protection.',
  },
  5: {
    primaryTe: 'పచ్చ (Emerald — కన్య లగ్నాధిపతి బుధ రత్నం)',
    primaryEn: 'Emerald (Panna — Virgo Lagna Lord Mercury)',
    upaTe: 'ఆకుపచ్చ పెరిడాట్',
    upaEn: 'Green Peridot',
    metalTe: 'బంగారం · చిటికెన వేలు',
    metalEn: 'Gold · Little Finger',
    dayTe: 'బుధవారం ఉదయం (బుధ హోర)',
    dayEn: 'Wednesday Morning (Mercury Hora)',
    mantra: 'ఓం బుం బుధాయ నమః (108 సార్లు)',
    bhagyaTe: 'వజ్రం / ఒపల్ (భాగ్య 9వ & ధన 2వ అధిపతి శుక్ర రత్నం)',
    bhagyaEn: 'Diamond / Opal (2nd & 9th Lord Venus)',
    avoidTe: 'పగడం (Red Coral — 3/8వ అధిపతి), మాణిక్యం (Ruby — 12వ అధిపతి)',
    avoidEn: 'Red Coral (3rd/8th Mars) & Ruby (12th Lord)',
    rudrakshaTe: '4 ముఖాల రుద్రాక్ష + 6 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '4 Mukhi + 6 Mukhi Rudraksha',
    rudrakshaNoteTe: 'విశ్లేషణాత్మక మేధస్సు, వృత్తి స్థిరత్వం & సంపదను వృద్ధి చేస్తుంది.',
    rudrakshaNoteEn: 'Enhances analytical precision, steady wealth, and harmony.',
  },
  6: {
    primaryTe: 'వజ్రం / ఒపల్ (Diamond or Opal — తులా లగ్నాధిపతి శుక్ర రత్నం)',
    primaryEn: 'Diamond / Opal (Libra Lagna Lord Venus)',
    upaTe: 'తెల్ల జిర్కాన్ / స్ఫటికం',
    upaEn: 'White Zircon / Clear Quartz',
    metalTe: 'వెండి / ప్లాటినం · మధ్య వేలు',
    metalEn: 'Silver / Platinum · Middle Finger',
    dayTe: 'శుక్రవారం ఉదయం (శుక్ర హోర)',
    dayEn: 'Friday Sunrise (Venus Hora)',
    mantra: 'ఓం శుం శుక్రాయ నమః (108 సార్లు)',
    bhagyaTe: 'నీలం (Blue Sapphire — యోగకారక 4/5వ అధిపతి) లేదా పచ్చ (9వ బుధుడు)',
    bhagyaEn: 'Blue Sapphire (Yogakaraka Saturn) or Emerald (9th Lord Mercury)',
    avoidTe: 'కనకపుష్యరాగం (3/6వ గురుడు), పగడం (మారక 2/7)',
    avoidEn: 'Yellow Sapphire (3rd/6th Jupiter) & Red Coral',
    rudrakshaTe: '6 ముఖాల రుద్రాక్ష + 7 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '6 Mukhi + 7 Mukhi Rudraksha',
    rudrakshaNoteTe: 'భాగస్వామ్య విజయం, కళాభివృద్ధి & సంతోషకర జీవనాన్ని ఇస్తుంది.',
    rudrakshaNoteEn: 'Strengthens partnerships, charisma, and financial ease.',
  },
  7: {
    primaryTe: 'పగడం (Red Coral — వృశ్చిక లగ్నాధిపతి కుజ రత్నం)',
    primaryEn: 'Red Coral (Scorpio Lagna Lord Mars)',
    upaTe: 'కార్నేలియన్ / తామ్ర ధాతువు',
    upaEn: 'Red Carnelian / Copper',
    metalTe: 'బంగారం లేదా రాగి · ఉంగరపు వేలు',
    metalEn: 'Gold or Copper · Ring Finger',
    dayTe: 'మంగళవారం ఉదయం (కుజ హోర)',
    dayEn: 'Tuesday Sunrise (Mars Hora)',
    mantra: 'ఓం అం అంగారకాయ నమః (108 సార్లు)',
    bhagyaTe: 'సహజ ముత్యం (9వ భాగ్య అధిపతి చంద్రుడు) & కనకపుష్యరాగం (5వ గురుడు)',
    bhagyaEn: 'Pearl (9th Lord Moon) & Yellow Sapphire (5th Lord Jupiter)',
    avoidTe: 'వజ్రం (7/12వ శుక్రుడు), పచ్చ (8/11వ బుధుడు)',
    avoidEn: 'Diamond (7th/12th Venus) & Emerald (8th/11th Mercury)',
    rudrakshaTe: '3 ముఖాల రుద్రాక్ష + 2 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '3 Mukhi + 2 Mukhi Rudraksha',
    rudrakshaNoteTe: 'ఆంతరిక శక్తి, భూలాభం మరియు దీర్ఘాయుష్షును పెంపొందిస్తుంది.',
    rudrakshaNoteEn: 'Channels fierce focus into resilience, property gains, and peace.',
  },
  8: {
    primaryTe: 'కనకపుష్యరాగం (Yellow Sapphire — ధనుర్ లగ్నాధిపతి గురు రత్నం)',
    primaryEn: 'Yellow Sapphire (Pukhraj — Sagittarius Lagna Lord Jupiter)',
    upaTe: 'సిట్రైన్ (Citrine) / సునేలా',
    upaEn: 'Natural Citrine / Yellow Topaz',
    metalTe: 'బంగారం · చూపుడు వేలు (Index Finger)',
    metalEn: 'Gold · Right Index Finger',
    dayTe: 'గురువారం ఉదయం (గురు హోర)',
    dayEn: 'Thursday Sunrise (Jupiter Hora)',
    mantra: 'ఓం బృం బృహస్పతయే నమః (108 సార్లు)',
    bhagyaTe: 'మాణిక్యం (9వ భాగ్య సూర్యుడు) & పగడం (5వ పంచమాధిపతి కుజుడు)',
    bhagyaEn: 'Ruby (9th Lord Sun) & Red Coral (5th Lord Mars)',
    avoidTe: 'వజ్రం (6/11వ శుక్రుడు), నీలం (2/3వ శని జాగ్రత్తతో)',
    avoidEn: 'Diamond (6th/11th Venus)',
    rudrakshaTe: '5 ముఖాల రుద్రాక్ష + 1 ముఖి రుద్రాక్ష',
    rudrakshaEn: '5 Mukhi + 1 Mukhi Rudraksha',
    rudrakshaNoteTe: 'ధార్మిక జ్ఞానం, సంతాన వృద్ధి మరియు సమాజ గౌరవాన్ని ప్రసాదిస్తుంది.',
    rudrakshaNoteEn: 'Blesses dharmic wisdom, higher recognition, and progeny bliss.',
  },
  9: {
    primaryTe: 'నీలం లేదా ఇంద్రనీల ఉపా-రత్నం (Amethyst / Tested Blue Sapphire)',
    primaryEn: 'Blue Sapphire (tested) or Amethyst (Capricorn Lagna Lord Saturn)',
    upaTe: 'జామునియా (Amethyst) లేదా లాపిస్ లాజులి',
    upaEn: 'Natural Amethyst or Lapis Lazuli',
    metalTe: 'వెండి లేదా పంచధాతువు · మధ్య వేలు (Middle Finger)',
    metalEn: 'Silver / Panchadhatu · Middle Finger',
    dayTe: 'శనివారం సాయంత్రం / శని హోర',
    dayEn: 'Saturday (Saturn Hora)',
    mantra: 'ఓం శం శనైశ్చరాయ నమః (108 సార్లు)',
    bhagyaTe: 'వజ్రం / ఒపల్ (యోగకారక 5/10వ శుక్రుడు) & పచ్చ (9వ బుధుడు)',
    bhagyaEn: 'Opal/Diamond (Yogakaraka 5th/10th Venus) & Emerald (9th Mercury)',
    avoidTe: 'మాణిక్యం (8వ సూర్యుడు), కనకపుష్యరాగం (3/12వ గురుడు)',
    avoidEn: 'Ruby (8th Lord Sun) & Yellow Sapphire (3rd/12th)',
    rudrakshaTe: '7 ముఖాల రుద్రాక్ష + 14 ముఖాల / 8 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '7 Mukhi + 8 Mukhi Rudraksha',
    rudrakshaNoteTe: 'కర్మ ఫల స్థిరత్వం, వృత్తి ఉన్నతి & శని బాధల నివారణ చేస్తుంది.',
    rudrakshaNoteEn: 'Grounds Saturn discipline, eases obstacles, and brings enduring wealth.',
  },
  10: {
    primaryTe: 'జామునియా / Tested నీలం (Amethyst or Blue Sapphire — కుంభ లగ్నం)',
    primaryEn: 'Amethyst or Tested Blue Sapphire (Aquarius Lagna Lord Saturn)',
    upaTe: 'లాపిస్ లాజులి / ఐయోలైట్ (Iolite)',
    upaEn: 'Iolite / Blue Spinel',
    metalTe: 'వెండి · మధ్య వేలు (Middle Finger)',
    metalEn: 'Silver · Middle Finger',
    dayTe: 'శనివారం (శని హోర)',
    dayEn: 'Saturday (Saturn Hora)',
    mantra: 'ఓం శం శనైశ్చరాయ నమః (108 సార్లు)',
    bhagyaTe: 'వజ్రం / ఒపల్ (యోగకారక 4/9వ శుక్రుడు) & పచ్చ (5వ బుధుడు)',
    bhagyaEn: 'Diamond / Opal (Yogakaraka Venus) & Emerald (5th Mercury)',
    avoidTe: 'ముత్యం (6వ చంద్రుడు), పగడం / మాణిక్యం జాగ్రత్తగా',
    avoidEn: 'Pearl (6th Lord Moon)',
    rudrakshaTe: '7 ముఖాల రుద్రాక్ష + 7/11 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '7 Mukhi + 11 Mukhi Rudraksha',
    rudrakshaNoteTe: 'నాయకత్వ ప్రతిభ, ఆకస్మిక వృత్తి లాభం & ఆరోగ్య రక్షణ కలిగిస్తుంది.',
    rudrakshaNoteEn: 'Supports innovation, leadership resilience, and Saturn grace.',
  },
  11: {
    primaryTe: 'కనకపుష్యరాగం (Yellow Sapphire — మీన లగ్నాధిపతి గురు రత్నం)',
    primaryEn: 'Yellow Sapphire (Pukhraj — Pisces Lagna Lord Jupiter)',
    upaTe: 'సహజ సిట్రైన్ (Citrine)',
    upaEn: 'Natural Citrine',
    metalTe: 'బంగారం · చూపుడు వేలు (Index Finger)',
    metalEn: 'Gold · Right Index Finger',
    dayTe: 'గురువారం ఉదయం (గురు హోర)',
    dayEn: 'Thursday Sunrise (Jupiter Hora)',
    mantra: 'ఓం బృం బృహస్పతయే నమః (108 సార్లు)',
    bhagyaTe: 'సహజ ముత్యం (5వ పంచమాధిపతి చంద్రుడు) & పగడం (9వ భాగ్యాధిపతి కుజుడు)',
    bhagyaEn: 'Pearl (5th Lord Moon) & Red Coral (9th Lord Mars)',
    avoidTe: 'వజ్రం (3/8వ శుక్రుడు), నీలం (11/12వ శని)',
    avoidEn: 'Diamond (3rd/8th Venus) & Blue Sapphire',
    rudrakshaTe: '5 ముఖాల రుద్రాక్ష + 2 ముఖాల రుద్రాక్ష',
    rudrakshaEn: '5 Mukhi + 2 Mukhi Rudraksha',
    rudrakshaNoteTe: 'దైవ కృప, అపార సంతాన & విద్యా వృద్ధిని అందిస్తుంది.',
    rudrakshaNoteEn: 'Elevates spiritual intuition, wisdom, and peaceful family growth.',
  },
};

export function computeRatnaRudrakshaAndRemedyAdvisor(
  lagnaIdx: number,
  planets: KundaliPlanetDetail[],
  hasKujaDosha: boolean
): RatnaGuidance {
  const safeLagna = ((lagnaIdx % 12) + 12) % 12;
  const base = LAGNA_RATNA_MAP[safeLagna];

  const moonPlanet = planets.find((p) => p.id === 'moon');
  const rahuPlanet = planets.find((p) => p.id === 'rahu');
  const saturnPlanet = planets.find((p) => p.id === 'saturn');
  const sunPlanet = planets.find((p) => p.id === 'sun');

  const moonInScorpio = moonPlanet?.rashiIdx === 7;
  const rahuIn1or7 = rahuPlanet
    ? [1, 7, 8].includes(((rahuPlanet.rashiIdx - safeLagna + 12) % 12) + 1)
    : false;
  const saturnIn1or8 = saturnPlanet
    ? [1, 4, 8, 12].includes(((saturnPlanet.rashiIdx - safeLagna + 12) % 12) + 1)
    : false;

  let recommendedPoojaTe = 'శ్రీ లక్ష్మీ గణపతి హోమం & నవగ్రహ శాంతి';
  let recommendedPoojaEn = 'Sri Lakshmi Ganapathi Homam & Navagraha Shanthi';
  let poojaReasonTe =
    'లగ్నాధిపతి మరియు భాగ్య స్థానాధిపతుల బలాన్ని పెంచి ఆర్థిక, కుటుంబ శుభ ఫలితాలను త్వరితగతిన పొందుటకు.';
  let poojaReasonEn =
    'Strengthens your Lagna & 9th Bhagya lord energy to accelerate financial and family harmony.';

  if (hasKujaDosha && moonInScorpio) {
    recommendedPoojaTe = 'కుజ శాంతి సహిత శ్రీ సుదర్శన / రుద్రాభిషేకం';
    recommendedPoojaEn = 'Sri Rudrabhishekam & Kuja Dosha Shanthi Homam';
    poojaReasonTe =
      'కుజ దోష ప్రభావాన్ని తగ్గించి మనోబలాన్ని పెంచుతూ శీఘ్ర వివాహ & దాంపత్య సౌఖ్యాన్ని ప్రసాదిస్తుంది.';
    poojaReasonEn =
      'Neutralizes Kuja Dosha pressure, calms Moon strength, and unlocks marriage harmony.';
  } else if (rahuIn1or7) {
    recommendedPoojaTe = 'శ్రీ చండీ హోమం / రాహు-కేతు సర్ప శాంతి';
    recommendedPoojaEn = 'Sri Chandi Homam / Rahu-Ketu Shanthi';
    poojaReasonTe =
      '1, 7 లేదా 8వ భావాలలో ఉన్న రాహు-కేతు ఆటంకాలను తొలగించి ఆకస్మిక అభివృద్ధిని అందిస్తుంది.';
    poojaReasonEn =
      'Clears Rahu-Ketu axis obstacles in 1st/7th/8th houses and restores auspicious momentum.';
  } else if (saturnIn1or8 || sunPlanet?.rashiIdx === 6) {
    recommendedPoojaTe = 'మృత్యుంజయ హోమం & ఏకవార రుద్రాభిషేకం';
    recommendedPoojaEn = 'Maha Mrityunjaya Homam & Ekavara Rudrabhishekam';
    poojaReasonTe =
      'శని సంచార / రవి బలహీన ప్రభావాలను తగ్గించి దీర్ఘాయుష్షు, ఆరోగ్యం & వృత్తి స్థిరత్వాన్ని కలిగిస్తుంది.';
    poojaReasonEn =
      'Eases Saturn/Sun pressure, safeguards health, and builds enduring career stability.';
  }

  return {
    primaryGemTe: base.primaryTe,
    primaryGemEn: base.primaryEn,
    upaRatnaTe: base.upaTe,
    upaRatnaEn: base.upaEn,
    weightCaratsTe: '3.25 నుండి 5.25 క్యారెట్లు / రత్తీలు (బరువు ప్రకారం గురు సూచనతో)',
    metalAndFingerTe: base.metalTe,
    metalAndFingerEn: base.metalEn,
    auspiciousDayAndTimeTe: base.dayTe,
    auspiciousDayAndTimeEn: base.dayEn,
    mantraTe: base.mantra,
    bhagyaGemTe: base.bhagyaTe,
    bhagyaGemEn: base.bhagyaEn,
    avoidGemsTe: base.avoidTe,
    avoidGemsEn: base.avoidEn,
    rudrakshaTitleTe: base.rudrakshaTe,
    rudrakshaTitleEn: base.rudrakshaEn,
    rudrakshaBenefitTe: base.rudrakshaNoteTe,
    rudrakshaBenefitEn: base.rudrakshaNoteEn,
    recommendedPoojaTe,
    recommendedPoojaEn,
    poojaReasonTe,
    poojaReasonEn,
  };
}
