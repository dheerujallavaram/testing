import React, { useState } from 'react';
import { Sparkles, Star, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { ALL_RASHIS } from '../data/panchangamData';
import { checkChandrashtamam } from '../utils/panchangaLogic';

interface DailyHoroscopeProps {
  day: DayData;
}

interface RashiMeta {
  id: string;
  teluguName: string;
  englishName: string;
  symbol: string;
  lord: string;
  luckyColor: string;
  baseLuckyNumber: number;
}

const RASHI_META_LIST: RashiMeta[] = [
  { id: 'mesham', teluguName: 'మేషం', englishName: 'Aries', symbol: '♈', lord: 'కుజుడు', luckyColor: 'ఎరుపు (Red)', baseLuckyNumber: 9 },
  { id: 'vrushabham', teluguName: 'వృషభం', englishName: 'Taurus', symbol: '♉', lord: 'శుక్రుడు', luckyColor: 'తెలుపు (White)', baseLuckyNumber: 6 },
  { id: 'mithunam', teluguName: 'మిథునం', englishName: 'Gemini', symbol: '♊', lord: 'బుధుడు', luckyColor: 'ఆకుపచ్చ (Green)', baseLuckyNumber: 5 },
  { id: 'karkatakam', teluguName: 'కర్కాటకం', englishName: 'Cancer', symbol: '♋', lord: 'చంద్రుడు', luckyColor: 'ముత్యపు తెలుపు (Pearl)', baseLuckyNumber: 2 },
  { id: 'simham', teluguName: 'సింహం', englishName: 'Leo', symbol: '♌', lord: 'సూర్యుడు', luckyColor: 'బంగారు పసుపు (Gold)', baseLuckyNumber: 1 },
  { id: 'kanya', teluguName: 'కన్య', englishName: 'Virgo', symbol: '♍', lord: 'బుధుడు', luckyColor: 'లేత ఆకుపచ్చ (Light Green)', baseLuckyNumber: 5 },
  { id: 'tula', teluguName: 'తుల', englishName: 'Libra', symbol: '♎', lord: 'శుక్రుడు', luckyColor: 'గులాబీ / తెలుపు (Cream)', baseLuckyNumber: 6 },
  { id: 'vruschikam', teluguName: 'వృశ్చికం', englishName: 'Scorpio', symbol: '♏', lord: 'కుజుడు', luckyColor: 'కాషాయం / ఎరుపు (Coral)', baseLuckyNumber: 9 },
  { id: 'dhanussu', teluguName: 'ధనుస్సు', englishName: 'Sagittarius', symbol: '♐', lord: 'గురుడు', luckyColor: 'పసుపు (Yellow)', baseLuckyNumber: 3 },
  { id: 'makaram', teluguName: 'మకరం', englishName: 'Capricorn', symbol: '♑', lord: 'శని', luckyColor: 'నీలం (Blue)', baseLuckyNumber: 8 },
  { id: 'kumbham', teluguName: 'కుంభం', englishName: 'Aquarius', symbol: '♒', lord: 'శని', luckyColor: 'లేత నీలం (Sky Blue)', baseLuckyNumber: 4 },
  { id: 'meenam', teluguName: 'మీనం', englishName: 'Pisces', symbol: '♓', lord: 'గురుడు', luckyColor: 'పసుపు / కాషాయం (Saffron)', baseLuckyNumber: 7 },
];

// Gochara house results (1 to 12 from Janma Rashi to Moon's current Rashi)
const GOCHARA_FORTUNES: Record<
  number,
  {
    houseLabel: string;
    status: 'favorable' | 'mixed' | 'caution';
    statusLabel: string;
    summaries: string[];
    remedy: string;
  }
> = {
  1: {
    houseLabel: 'జన్మ చంద్రుడు (1వ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం',
    summaries: [
      'మనస్సు ప్రశాంతంగా ఉంటుంది. తలపెట్టిన పనులు ఉత్సాహంగా పూర్తి చేస్తారు. బంధుమిత్రుల కలయిక ఆనందాన్ని ఇస్తుంది.',
      'ఆత్మవిశ్వాసం పెరుగుతుంది. గౌరవ మర్యాదలు లభిస్తాయి. నూతన వస్తు లాభం మరియు శుభవార్తా శ్రవణం ఉంటుంది.',
    ],
    remedy: 'శివారాధన, అభిషేకం శ్రేయస్కరం',
  },
  2: {
    houseLabel: 'ధన స్థాన చంద్రుడు (2వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'ఆర్థిక వ్యవహారాలలో ఆచితూచి వ్యవహరించాలి. మాటతీరులో సంయమనం పాటించడం వల్ల కుటుంబంలో సామరస్యం నిలుస్తుంది.',
      'రావలసిన ధనం చేతికి అందుతుంది కానీ వృథా ఖర్చులను నియంత్రించాలి. కుటుంబ సభ్యుల సలహాలు మేలు చేస్తాయి.',
    ],
    remedy: 'శ్రీ లక్ష్మీ గణపతి స్మరణ శుభప్రదం',
  },
  3: {
    houseLabel: 'తృతీయ చంద్రుడు (3వ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం',
    summaries: [
      'చేపట్టిన ప్రతి పనిలోనూ విజయం లభిస్తుంది. సోదరులు, మిత్రుల సహకారంతో కీలక వ్యవహారాలు సానుకూలమవుతాయి.',
      'ధైర్య సాహసాలతో ముందడుగు వేస్తారు. ఉద్యోగ, వ్యాపారాలలో ఆశించిన పురోగతి మరియు ధనలాభం కలుగుతుంది.',
    ],
    remedy: 'సుబ్రహ్మణ్య స్వామి స్తోత్ర పారాయణ',
  },
  4: {
    houseLabel: 'చతుర్థ చంద్రుడు (4వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'గృహ సంబంధ పనులలో కొంత శ్రమ అధికంగా ఉండవచ్చు. ప్రయాణాలలో తగిన జాగ్రత్తలు పాటించడం మంచిది.',
      'పనులలో స్వల్ప ఆలస్యం జరిగినప్పటికీ పట్టుదలతో పూర్తి చేస్తారు. మాతృవర్గీయుల ఆరోగ్యం పట్ల శ్రద్ధ వహించండి.',
    ],
    remedy: 'అమ్మవారి కుంకుమార్చన, దుర్గా స్తుతి',
  },
  5: {
    houseLabel: 'పంచమ చంద్రుడు (5వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'సంతాన సంబంధ విషయాలలో ఆలోచనలు పెరుగుతాయి. ఆధ్యాత్మిక కార్యక్రమాలలో పాల్గొనడం వల్ల మనశ్శాంతి లభిస్తుంది.',
      'కీలక నిర్ణయాలు తీసుకునే ముందు పెద్దల సలహా తీసుకోవడం ఉత్తమం. విద్యా, పరిశోధన రంగాల వారికి అనుకూలం.',
    ],
    remedy: 'శ్రీ దత్తాత్రేయ / గురు స్తోత్ర పఠనం',
  },
  6: {
    houseLabel: 'షష్ఠ చంద్రుడు (6వ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం',
    summaries: [
      'ఆరోగ్యం కుదుటపడుతుంది. పోటీలలోనూ, వృత్తి ఉద్యోగాలలోనూ మీ మాటకు విలువ పెరుగుతుంది. రుణ బాధలు తొలగుతాయి.',
      'పెండింగ్‌లో ఉన్న పనులు వేగంగా పూర్తవుతాయి. శత్రువులపై విజయం సాధిస్తారు, ఆర్థిక పరిస్థితి మెరుగుపడుతుంది.',
    ],
    remedy: 'శ్రీ విష్ణు సహస్రనామ శ్రవణం',
  },
  7: {
    houseLabel: 'సప్తమ చంద్రుడు (7వ స్థానం)',
    status: 'favorable',
    statusLabel: 'శుభం',
    summaries: [
      'భాగస్వామ్య వ్యాపారాలు, నూతన ఒప్పందాలకు అనుకూల సమయం. జీవిత భాగస్వామితో ఆనందంగా గడుపుతారు.',
      'సామాజిక గౌరవం పెరుగుతుంది. ప్రయాణాలు లాభసాటిగా సాగుతాయి. శుభకార్య ప్రయత్నాలు ఫలిస్తాయి.',
    ],
    remedy: 'లక్ష్మీ నారాయణుల ఆరాధన',
  },
  8: {
    houseLabel: 'అష్టమ చంద్రుడు (చంద్రాష్టమం)',
    status: 'caution',
    statusLabel: 'చంద్రాష్టమం • జాగ్రత్త',
    summaries: [
      'నేడు చంద్రాష్టమ ప్రభావం ఉన్నందున కొత్త పనులు, కీలక ఆర్థిక నిర్ణయాలు వాయిదా వేయడం శ్రేయస్కరం. ప్రశాంతంగా ఉండండి.',
      'అనవసర వాదనలకు దూరంగా ఉండాలి. ప్రయాణాలలో అప్రమత్తత అవసరం. దైవ ధ్యానం వల్ల ఆటంకాలు తొలగుతాయి.',
    ],
    remedy: 'శివాభిషేకం, చంద్ర శ్లోక పఠనం తప్పనిసరి',
  },
  9: {
    houseLabel: 'నవమ చంద్రుడు (9వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'పుణ్యక్షేత్ర సందర్శన లేదా ధార్మిక కార్యక్రమాల పట్ల ఆసక్తి చూపుతారు. పెద్దల ఆశీస్సులు లభిస్తాయి.',
      'శ్రమకు తగిన ఫలితం లభిస్తుంది. దూర ప్రయాణ సూచనలు ఉన్నాయి. దానధర్మాలు చేయడం వల్ల శుభం కలుగుతుంది.',
    ],
    remedy: 'గురు గ్రహ ఆరాధన, దక్షిణామూర్తి స్తోత్రం',
  },
  10: {
    houseLabel: 'దశమ చంద్రుడు (10వ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం',
    summaries: [
      'ఉద్యోగ, వ్యాపార రంగాలలో ఉన్నత ఫలితాలు సాధిస్తారు. అధికారుల ప్రశంసలు మరియు నూతన బాధ్యతలు లభిస్తాయి.',
      'తలపెట్టిన కార్యాలు నిర్విఘ్నంగా నెరవేరుతాయి. కీర్తి ప్రతిష్ఠలు పెరుగుతాయి, ఆర్థిక లాభాలు చేకూరుతాయి.',
    ],
    remedy: 'శ్రీ వేంకటేశ్వర స్వామి దర్శనం / స్మరణ',
  },
  11: {
    houseLabel: 'ఏకాదశ చంద్రుడు (11వ స్థానం)',
    status: 'favorable',
    statusLabel: 'అత్యంత శుభం',
    summaries: [
      'ఆకస్మిక ధనలాభం, వ్యాపార విస్తరణ మరియు శుభవార్తలు వింటారు. మిత్రుల ద్వారా విశేష ప్రయోజనాలు కలుగుతాయి.',
      'సర్వకార్య విజయం చేకూరుతుంది. కోరుకున్న పనులు సకాలంలో పూర్తవుతాయి. కుటుంబంలో సంతోషకర వాతావరణం ఉంటుంది.',
    ],
    remedy: 'శ్రీ మహా గణపతి ఆరాధన',
  },
  12: {
    houseLabel: 'ద్వాదశ చంద్రుడు (12వ స్థానం)',
    status: 'mixed',
    statusLabel: 'మిశ్రమం',
    summaries: [
      'శుభకార్యాల నిమిత్తం ఖర్చులు పెరిగే అవకాశం ఉంది. విశ్రాంతి మరియు ఆరోగ్యంపై తగిన శ్రద్ధ వహించాలి.',
      'దూర ప్రాంత వ్యవహారాలు అనుకూలిస్తాయి. ఆర్థిక లావాదేవీలలో తొందరపాటు వద్దు. ఆధ్యాత్మిక చింతన మేలు చేస్తుంది.',
    ],
    remedy: 'ఆంజనేయ స్వామి చాలీసా పారాయణ',
  },
};

function findMoonRashiIndex(day: DayData): number {
  // 1. Check grahaStithi for చంద్రుడు
  for (let i = 0; i < RASHI_META_LIST.length; i++) {
    const key = RASHI_META_LIST[i].id;
    const planets = day.grahaStithi?.[key] || '';
    if (planets.includes('చంద్రుడు')) {
      return i;
    }
  }
  // 2. Fallback: check day.chandra.sancharam text
  const sancharam = day.chandra?.sancharam || '';
  for (let i = 0; i < RASHI_META_LIST.length; i++) {
    const stem = RASHI_META_LIST[i].teluguName.replace(/ం$/, '');
    if (sancharam.includes(stem)) {
      return i;
    }
  }
  return 0;
}

export const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ day }) => {
  const [filter, setFilter] = useState<'all' | 'favorable' | 'mixed' | 'caution'>('all');

  const moonRashiIdx = findMoonRashiIndex(day);
  const moonRashiName = RASHI_META_LIST[moonRashiIdx]?.teluguName || 'మేషం';

  // Deterministic day seed from isoDate so summaries vary nicely across dates
  const daySeed = day.isoDate
    .split('-')
    .reduce((acc, part) => acc + parseInt(part, 10), 0);

  const rashiCards = RASHI_META_LIST.map((rashi, idx) => {
    const isChandrashtamam = checkChandrashtamam(rashi.id, day);
    const gocharaHouse = isChandrashtamam
      ? 8
      : ((moonRashiIdx - idx + 12) % 12) + 1;

    const fortune = GOCHARA_FORTUNES[gocharaHouse] || GOCHARA_FORTUNES[1];
    const summaryIdx = (daySeed + idx) % fortune.summaries.length;
    const summaryText = fortune.summaries[summaryIdx];
    const luckyNum = ((rashi.baseLuckyNumber + daySeed) % 9) + 1;

    return {
      ...rashi,
      gocharaHouse,
      houseLabel: fortune.houseLabel,
      status: isChandrashtamam ? ('caution' as const) : fortune.status,
      statusLabel: isChandrashtamam ? 'చంద్రాష్టమం • జాగ్రత్త' : fortune.statusLabel,
      summary: summaryText,
      remedy: fortune.remedy,
      luckyNumber: luckyNum,
    };
  });

  const filteredCards = rashiCards.filter((card) =>
    filter === 'all' ? true : card.status === filter
  );

  return (
    <section
      id="dina-phalam"
      className="bg-white border border-amber-300 shadow-md rounded-2xl p-6 sm:p-8 scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-800 font-display bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
              Daily Horoscope • దిన ఫలం
            </span>
            <span className="text-xs font-telugu font-semibold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              చంద్ర సంచారం: {moonRashiName} రాశి
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 font-telugu flex items-center gap-2.5 mt-2">
            <Sparkles className="text-amber-600 shrink-0" size={26} />
            <span>దిన ఫలం (ద్వాదశ రాశి ఫలితాలు)</span>
          </h2>
          <p className="text-sm text-slate-600 font-telugu mt-1">
            {day.teediVaram} — నేటి గ్రహ స్థితి మరియు గోచార చంద్ర బలం ఆధారంగా ద్వాదశ రాశుల సంక్షిప్త దిన ఫలితాలు
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-telugu font-bold transition-all cursor-pointer border ${
              filter === 'all'
                ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-xs'
                : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            అన్ని రాశులు (12)
          </button>
          <button
            type="button"
            onClick={() => setFilter('favorable')}
            className={`px-3 py-1.5 rounded-xl text-xs font-telugu font-bold transition-all cursor-pointer border ${
              filter === 'favorable'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            శుభ ఫలితాలు
          </button>
          <button
            type="button"
            onClick={() => setFilter('mixed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-telugu font-bold transition-all cursor-pointer border ${
              filter === 'mixed'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            మిశ్రమ ఫలితాలు
          </button>
          <button
            type="button"
            onClick={() => setFilter('caution')}
            className={`px-3 py-1.5 rounded-xl text-xs font-telugu font-bold transition-all cursor-pointer border ${
              filter === 'caution'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            చంద్రాష్టమం / జాగ్రత్త
          </button>
        </div>
      </div>

      {/* 12 Rashis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((rashi) => {
          const isFav = rashi.status === 'favorable';
          const isCaution = rashi.status === 'caution';

          return (
            <div
              key={rashi.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                isFav
                  ? 'bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 border-emerald-200/90'
                  : isCaution
                  ? 'bg-gradient-to-br from-rose-50/60 via-white to-amber-50/30 border-rose-300'
                  : 'bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 border-amber-200'
              }`}
            >
              <div>
                {/* Card Top Row: Rashi Identity & Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 border ${
                        isFav
                          ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300'
                          : isCaution
                          ? 'bg-rose-100/80 text-rose-900 border-rose-300'
                          : 'bg-amber-100/80 text-amber-900 border-amber-300'
                      }`}
                    >
                      {rashi.symbol}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-950 font-telugu leading-tight">
                        {rashi.teluguName}{' '}
                        <span className="text-xs font-normal text-slate-500 font-sans">
                          ({rashi.englishName})
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 font-telugu">
                        అధిపతి: <strong className="text-amber-900">{rashi.lord}</strong> • {rashi.houseLabel}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-telugu font-bold shrink-0 border ${
                      isFav
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : isCaution
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {isFav && <CheckCircle2 size={12} className="text-emerald-700" />}
                    {isCaution && <AlertTriangle size={12} className="text-rose-700" />}
                    {!isFav && !isCaution && <Info size={12} className="text-amber-700" />}
                    {rashi.statusLabel}
                  </span>
                </div>

                {/* Daily Fortune Summary */}
                <p className="text-sm text-slate-800 font-telugu leading-relaxed mb-3">
                  {rashi.summary}
                </p>
              </div>

              {/* Footer Meta: Remedy & Lucky Indicators */}
              <div className="pt-2.5 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs font-telugu text-slate-700">
                <span className="flex items-center gap-1 text-amber-950 font-medium">
                  <Star size={12} className="text-amber-600 shrink-0" />
                  <span>పరిహారం: <strong>{rashi.remedy}</strong></span>
                </span>
                <span className="text-slate-600 bg-amber-50/90 px-2 py-0.5 rounded border border-amber-200/80">
                  సంఖ్య: <strong>{rashi.luckyNumber}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
