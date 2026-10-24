import React, { useState, useMemo } from 'react';
import { Heart, Sparkles, CheckCircle2, AlertCircle, Shield, Users, ArrowRight } from 'lucide-react';
import { RASHI_CHART_ORDER } from '../data/panchangamData';
import { useLanguage } from '../context/LanguageContext';

export interface RashiCompatibilityProps {
  defaultBrideRashi?: string;
  defaultGroomRashi?: string;
  onConsultGuruji?: (brideRashi: string, groomRashi: string, score: number) => void;
}

interface KootaBreakdown {
  nameTelugu: string;
  nameEnglish: string;
  maxPoints: number;
  scoredPoints: number;
  descriptionTelugu: string;
  descriptionEnglish: string;
}

const RASHI_METADATA: Record<
  string,
  {
    index: number;
    varna: number; // 1..4
    vashya: string;
    taraGroup: number;
    yoni: string;
    grahaLord: string;
    gana: 'Deva' | 'Manushya' | 'Rakshasa';
    nadi: 'Adi' | 'Madhya' | 'Antya';
    element: 'Fire' | 'Earth' | 'Air' | 'Water';
  }
> = {
  mesham: { index: 1, varna: 3, vashya: 'Chatushpada', taraGroup: 1, yoni: 'Ashwa', grahaLord: 'Kuja', gana: 'Deva', nadi: 'Adi', element: 'Fire' },
  vrushabham: { index: 2, varna: 2, vashya: 'Chatushpada', taraGroup: 2, yoni: 'Gaja', grahaLord: 'Shukra', gana: 'Manushya', nadi: 'Madhya', element: 'Earth' },
  mithunam: { index: 3, varna: 1, vashya: 'Dwipada', taraGroup: 3, yoni: 'Mesha', grahaLord: 'Budha', gana: 'Manushya', nadi: 'Antya', element: 'Air' },
  karkatakam: { index: 4, varna: 4, vashya: 'Jalachara', taraGroup: 1, yoni: 'Sarpa', grahaLord: 'Chandra', gana: 'Deva', nadi: 'Adi', element: 'Water' },
  simham: { index: 5, varna: 3, vashya: 'Vanachara', taraGroup: 2, yoni: 'Mushika', grahaLord: 'Surya', gana: 'Rakshasa', nadi: 'Madhya', element: 'Fire' },
  kanya: { index: 6, varna: 2, vashya: 'Dwipada', taraGroup: 3, yoni: 'Gau', grahaLord: 'Budha', gana: 'Manushya', nadi: 'Antya', element: 'Earth' },
  tula: { index: 7, varna: 1, vashya: 'Dwipada', taraGroup: 1, yoni: 'Mahisha', grahaLord: 'Shukra', gana: 'Deva', nadi: 'Adi', element: 'Air' },
  vruschikam: { index: 8, varna: 4, vashya: 'Keeta', taraGroup: 2, yoni: 'Vyaghra', grahaLord: 'Kuja', gana: 'Rakshasa', nadi: 'Madhya', element: 'Water' },
  dhanussu: { index: 9, varna: 3, vashya: 'Dwipada', taraGroup: 3, yoni: 'Mriga', grahaLord: 'Guru', gana: 'Deva', nadi: 'Antya', element: 'Fire' },
  makaram: { index: 10, varna: 2, vashya: 'Jalachara', taraGroup: 1, yoni: 'Vanara', grahaLord: 'Shani', gana: 'Rakshasa', nadi: 'Adi', element: 'Earth' },
  kumbham: { index: 11, varna: 1, vashya: 'Dwipada', taraGroup: 2, yoni: 'Nakula', grahaLord: 'Shani', gana: 'Deva', nadi: 'Madhya', element: 'Air' },
  meenam: { index: 12, varna: 4, vashya: 'Jalachara', taraGroup: 3, yoni: 'Simha', grahaLord: 'Guru', gana: 'Deva', nadi: 'Antya', element: 'Water' },
};

const FRIENDLY_LORDS: Record<string, string[]> = {
  Surya: ['Chandra', 'Kuja', 'Guru'],
  Chandra: ['Surya', 'Budha', 'Guru'],
  Kuja: ['Surya', 'Chandra', 'Guru'],
  Budha: ['Surya', 'Shukra', 'Shani'],
  Guru: ['Surya', 'Chandra', 'Kuja'],
  Shukra: ['Budha', 'Shani'],
  Shani: ['Budha', 'Shukra'],
};

export function calculateAshtakootaGunaMilan(brideKey: string, groomKey: string): {
  totalScore: number;
  maxTotal: number;
  kootas: KootaBreakdown[];
  verdictTelugu: string;
  verdictEnglish: string;
  recommendationTelugu: string;
  recommendationEnglish: string;
  status: 'excellent' | 'good' | 'moderate' | 'caution';
} {
  const b = RASHI_METADATA[brideKey] || RASHI_METADATA.mesham;
  const g = RASHI_METADATA[groomKey] || RASHI_METADATA.vrushabham;

  // 1. Varna Koota (1 point)
  const varnaScore = g.varna >= b.varna ? 1 : 0.5;

  // 2. Vashya Koota (2 points)
  const vashyaScore = b.vashya === g.vashya ? 2 : b.element === g.element ? 1.5 : 1;

  // 3. Tara Koota (3 points)
  const diff = ((g.index - b.index + 12) % 12) + 1;
  const taraScore = [1, 2, 4, 6, 8, 9, 11].includes(diff) ? 3 : 1.5;

  // 4. Yoni Koota (4 points)
  const yoniScore = b.yoni === g.yoni ? 4 : b.element === g.element ? 3 : 2;

  // 5. Graha Maitri Koota (5 points)
  let maitriScore = 2.5;
  if (b.grahaLord === g.grahaLord) {
    maitriScore = 5;
  } else if (
    FRIENDLY_LORDS[b.grahaLord]?.includes(g.grahaLord) &&
    FRIENDLY_LORDS[g.grahaLord]?.includes(b.grahaLord)
  ) {
    maitriScore = 5;
  } else if (
    FRIENDLY_LORDS[b.grahaLord]?.includes(g.grahaLord) ||
    FRIENDLY_LORDS[g.grahaLord]?.includes(b.grahaLord)
  ) {
    maitriScore = 4;
  } else {
    maitriScore = 1;
  }

  // 6. Gana Koota (6 points)
  let ganaScore = 3;
  if (b.gana === g.gana) {
    ganaScore = 6;
  } else if (
    (b.gana === 'Deva' && g.gana === 'Manushya') ||
    (b.gana === 'Manushya' && g.gana === 'Deva')
  ) {
    ganaScore = 5;
  } else {
    ganaScore = 1;
  }

  // 7. Bhakoot / Rashi Koota (7 points)
  // Avoid 2/12 (Dwidwadasha) and 6/8 (Shadashtaka)
  let bhakootScore = 7;
  if (diff === 2 || diff === 12) {
    bhakootScore = 2;
  } else if (diff === 6 || diff === 8) {
    bhakootScore = 0;
  }

  // 8. Nadi Koota (8 points)
  const nadiScore = b.nadi !== g.nadi ? 8 : b.index === g.index ? 4 : 0;

  const kootas: KootaBreakdown[] = [
    {
      nameTelugu: 'వర్ణ కూటమి',
      nameEnglish: 'Varna (Spiritual & Work Nature)',
      maxPoints: 1,
      scoredPoints: varnaScore,
      descriptionTelugu: 'ఇరువురి కర్మ స్వభావం మరియు ఆధ్యాత్మిక అవగాహన',
      descriptionEnglish: 'Mutual work ethic and spiritual compatibility',
    },
    {
      nameTelugu: 'వశ్య కూటమి',
      nameEnglish: 'Vashya (Mutual Attraction)',
      maxPoints: 2,
      scoredPoints: vashyaScore,
      descriptionTelugu: 'దంపతుల మధ్య అనురాగం మరియు ఆకర్షణ బలం',
      descriptionEnglish: 'Mutual affection and magnetic harmony',
    },
    {
      nameTelugu: 'తారా కూటమి',
      nameEnglish: 'Tara (Destiny & Longevity)',
      maxPoints: 3,
      scoredPoints: taraScore,
      descriptionTelugu: 'ఆయుర్దాయం, అదృష్టం మరియు శుభ ఫలితాల స్థితి',
      descriptionEnglish: 'Health, fortune, and auspicious destiny alignment',
    },
    {
      nameTelugu: 'యోని కూటమి',
      nameEnglish: 'Yoni (Intimacy & Temperament)',
      maxPoints: 4,
      scoredPoints: yoniScore,
      descriptionTelugu: 'శారీరక, మానసిక స్వభావ పొంతన',
      descriptionEnglish: 'Natural temperament and biological harmony',
    },
    {
      nameTelugu: 'గ్రహ మైత్రి',
      nameEnglish: 'Graha Maitri (Planetary Friendship)',
      maxPoints: 5,
      scoredPoints: maitriScore,
      descriptionTelugu: 'రాశ్యాధిపతుల మధ్య మిత్రత్వం మరియు మానసిక ఐక్యత',
      descriptionEnglish: 'Psychological harmony between Rashi ruling lords',
    },
    {
      nameTelugu: 'గణ కూటమి',
      nameEnglish: 'Gana (Core Disposition)',
      maxPoints: 6,
      scoredPoints: ganaScore,
      descriptionTelugu: 'దేవ, మనుష్య, రాక్షస గణ స్వభావాల పొంతన',
      descriptionEnglish: 'Alignment of core life values and behavior',
    },
    {
      nameTelugu: 'భకూట (రాశి కూటమి)',
      nameEnglish: 'Bhakoot (Family & Prosperity)',
      maxPoints: 7,
      scoredPoints: bhakootScore,
      descriptionTelugu: 'కుటుంబ వృద్ధి, ఆర్థిక పురోగతి మరియు అన్యోన్యత',
      descriptionEnglish: 'Financial growth, family welfare, and emotional bond',
    },
    {
      nameTelugu: 'నాడీ కూటమి',
      nameEnglish: 'Nadi (Vital Energy & Progeny)',
      maxPoints: 8,
      scoredPoints: nadiScore,
      descriptionTelugu: 'ఆరోగ్యం, జీవశక్తి మరియు సంతాన సౌభాగ్యం',
      descriptionEnglish: 'Genetic vitality, health, and progeny blessing',
    },
  ];

  const totalScore = kootas.reduce((acc, k) => acc + k.scoredPoints, 0);

  let status: 'excellent' | 'good' | 'moderate' | 'caution' = 'good';
  let verdictTelugu = '';
  let verdictEnglish = '';
  let recommendationTelugu = '';
  let recommendationEnglish = '';

  if (totalScore >= 26) {
    status = 'excellent';
    verdictTelugu = 'ఉత్తమ వివాహ పొంతన ( శ్రేష్ఠమైన గుణ మిలనం )';
    verdictEnglish = 'Excellent Compatibility (Uttama Guna Milan)';
    recommendationTelugu = 'ఈ రెండు రాశుల మధ్య గ్రహ మైత్రి మరియు అష్టకూట బలం చాలా శ్రేష్ఠంగా ఉంది. వివాహానికి మరియు భాగస్వామ్యానికి అత్యంత అనుకూలం.';
    recommendationEnglish = 'Strong planetary friendship and Ashtakoota harmony. Highly auspicious for marriage and long-term partnership.';
  } else if (totalScore >= 18) {
    status = 'good';
    verdictTelugu = 'శుభ పొంతన ( మధ్యమ / అనుకూల గుణ మిలనం )';
    verdictEnglish = 'Good Compatibility (Auspicious Match)';
    recommendationTelugu = 'శాస్త్రోక్తంగా 18 గుణాల కంటే ఎక్కువ వచ్చినందున వివాహానికి అనుకూలం. నక్షత్ర పాద భేదాలను కూడా పరిశీలించి ముహూర్తం నిర్ణయించవచ్చు.';
    recommendationEnglish = 'Scores above the classical 18-point threshold. Suitable for marriage after verifying exact Nakshatra Padas.';
  } else if (totalScore >= 14) {
    status = 'moderate';
    verdictTelugu = 'సాధారణ పొంతన ( గ్రహ శాంతి / పాద పరిశీలన అవసరం )';
    verdictEnglish = 'Moderate Match (Requires Nakshatra & Lagna Verification)';
    recommendationTelugu = 'రాశి పొంతన సాధారణంగా ఉంది. వ్యక్తిగత జన్మ కుండలిలోని లగ్నం, సప్తమ స్థానం మరియు గురు బలం పరిశీలించి నిర్ణయం తీసుకోవాలి.';
    recommendationEnglish = 'Average Rashi match. Full individual birth chart (Lagna, 7th house, and Jupiter strength) should be examined by Guruji.';
  } else {
    status = 'caution';
    verdictTelugu = 'తక్కువ గుణ బలం ( జ్యోతిష పరిహార పరిశీలన తప్పనిసరి )';
    verdictEnglish = 'Low Guna Score (Detailed Shastric Consultation Required)';
    recommendationTelugu = 'అష్టకూటములలో నాడీ లేదా భకూట దోష ప్రభావం కనిపిస్తోంది. శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే సంపూర్ణ జాతక పరిశీలన చేయించగలరు.';
    recommendationEnglish = 'Indicates Bhakoot or Nadi dosha tendencies. Please consult Sri Jallavaram Sai Dheeraj Sharma for remedies and chart analysis.';
  }

  return {
    totalScore,
    maxTotal: 36,
    kootas,
    verdictTelugu,
    verdictEnglish,
    recommendationTelugu,
    recommendationEnglish,
    status,
  };
}

export const RashiCompatibilityTool: React.FC<RashiCompatibilityProps> = ({
  defaultBrideRashi = 'mesham',
  defaultGroomRashi = 'vrushabham',
  onConsultGuruji,
}) => {
  const { language, t } = useLanguage();
  const [brideRashi, setBrideRashi] = useState<string>(defaultBrideRashi);
  const [groomRashi, setGroomRashi] = useState<string>(defaultGroomRashi);

  const result = useMemo(
    () => calculateAshtakootaGunaMilan(brideRashi, groomRashi),
    [brideRashi, groomRashi]
  );

  const brideObj = RASHI_CHART_ORDER.find((r) => r.key === brideRashi) || RASHI_CHART_ORDER[0];
  const groomObj = RASHI_CHART_ORDER.find((r) => r.key === groomRashi) || RASHI_CHART_ORDER[1];

  const statusBadgeColors = {
    excellent: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    good: 'bg-amber-100 text-amber-900 border-amber-300',
    moderate: 'bg-orange-100 text-orange-900 border-orange-300',
    caution: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 font-telugu">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <Heart size={13} className="text-rose-600 fill-rose-600" />
            <span>{t('అష్టకూట గుణ మిలనం • Vedic Guna Milan', 'Ashtakoota Guna Milan (36 Points)')}</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1.5">
            {t('వధూవరుల రాశి పొంతన & వివాహ గుణ గణన', 'Rashi Compatibility & Marriage Guna Calculator')}
          </h3>
        </div>
      </div>

      {/* Two Rashi Selectors */}
      <div className="grid sm:grid-cols-2 gap-6 bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80">
        {/* Input 1: Bride / Partner 1 */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-amber-950">
            {t('వధువు రాశి (Bride / Partner 1 Rashi)', 'Bride / Partner 1 Rashi')}
          </label>
          <select
            value={brideRashi}
            onChange={(e) => setBrideRashi(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {RASHI_CHART_ORDER.map((r) => (
              <option key={r.key} value={r.key}>
                {r.symbol} {language === 'te' ? `${r.name} (${r.english})` : `${r.english} (${r.name})`}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-600">
            {t('రాశ్యాధిపతి:', 'Ruling Lord:')} <strong>{brideObj.lord}</strong> · {t('తత్వం:', 'Element:')} <strong>{brideObj.element}</strong>
          </p>
        </div>

        {/* Input 2: Groom / Partner 2 */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-amber-950">
            {t('వరుడి రాశి (Groom / Partner 2 Rashi)', 'Groom / Partner 2 Rashi')}
          </label>
          <select
            value={groomRashi}
            onChange={(e) => setGroomRashi(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {RASHI_CHART_ORDER.map((r) => (
              <option key={r.key} value={r.key}>
                {r.symbol} {language === 'te' ? `${r.name} (${r.english})` : `${r.english} (${r.name})`}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-600">
            {t('రాశ్యాధిపతి:', 'Ruling Lord:')} <strong>{groomObj.lord}</strong> · {t('తత్వం:', 'Element:')} <strong>{groomObj.element}</strong>
          </p>
        </div>
      </div>

      {/* Score Summary Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-amber-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-600/50">
        <div className="space-y-2 text-center md:text-left">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${statusBadgeColors[result.status]}`}>
            {language === 'te' ? result.verdictTelugu : result.verdictEnglish}
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-amber-100">
            {brideObj.name} + {groomObj.name}
          </h4>
          <p className="text-xs sm:text-sm text-amber-200/90 max-w-xl leading-relaxed">
            {language === 'te' ? result.recommendationTelugu : result.recommendationEnglish}
          </p>
        </div>

        <div className="bg-amber-950/90 border-2 border-amber-400 rounded-2xl px-6 py-4 text-center shrink-0">
          <span className="text-xs text-amber-300 uppercase tracking-wider block">
            {t('మొత్తం గుణములు', 'Total Guna Score')}
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">
            {result.totalScore} <span className="text-lg text-amber-100">/ {result.maxTotal}</span>
          </span>
        </div>
      </div>

      {/* 8 Kootas Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {result.kootas.map((koota) => (
          <div
            key={koota.nameEnglish}
            className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-amber-950">
                  {language === 'te' ? koota.nameTelugu : koota.nameEnglish.split(' (')[0]}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {koota.scoredPoints} / {koota.maxPoints}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {language === 'te' ? koota.descriptionTelugu : koota.descriptionEnglish}
              </p>
            </div>
          </div>
        ))}
      </div>

      {onConsultGuruji && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onConsultGuruji(brideObj.name, groomObj.name, result.totalScore)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <span>{t('పూర్తి జాతక పొంతన కోసం సంప్రదించండి', 'Consult Guruji for Full Horoscope Match')}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
