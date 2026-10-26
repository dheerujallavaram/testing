import React, { useState, useMemo } from 'react';
import { Globe, Copy, Check, Volume2, Square, BookOpen, Sparkles } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';

interface DailySankalpamStotraProps {
  day: DayData;
}

type SankalpamRegion = 'india' | 'usa' | 'uk' | 'australia';

interface RegionSankalpamConfig {
  id: SankalpamRegion;
  labelTe: string;
  labelEn: string;
  deshaKhandaTe: string;
  meruDigbhagaTe: string;
}

const REGION_CONFIGS: RegionSankalpamConfig[] = [
  {
    id: 'india',
    labelTe: 'భారతదేశం (India / AP & TS)',
    labelEn: 'India (AP / Telangana / Bharata Varsha)',
    deshaKhandaTe: 'జంబూద్వీపే, భరతవర్షే, భరతఖండే',
    meruDigbhagaTe: 'మేరోః దక్షిణ దిగ్భాగే, శ్రీశైలస్య ప్రదేశే, కృష్ణా-గోదావరీ మధ్యప్రదేశే (లేదా మీ క్షేత్ర ప్రదేశే)',
  },
  {
    id: 'usa',
    labelTe: 'అమెరికా / కెనడా (USA & Canada NRI)',
    labelEn: 'USA & North America (Krauncha Dweepa)',
    deshaKhandaTe: 'క్రౌంచద్వీపే, రమణకవర్షే, ఐంద్రఖండే',
    meruDigbhagaTe: 'మేరోః పశ్చిమ దిగ్భాగే, ఉత్తర అమెరికా మహాదేశే, రాకీ-అపలేచియన్ పర్వత మధ్యప్రదేశే',
  },
  {
    id: 'uk',
    labelTe: 'యూరప్ / UK (Europe & UK NRI)',
    labelEn: 'UK & Europe (Shaka Dweepa)',
    deshaKhandaTe: 'శాకద్వీపే, హరివర్షే, వాయువ్య ఖండే',
    meruDigbhagaTe: 'మేరోః వాయువ్య దిగ్భాగే, థేమ్స్ నదీ తీర / యూరప్ మహాదేశ ప్రదేశే',
  },
  {
    id: 'australia',
    labelTe: 'ఆస్ట్రేలియా / న్యూజిలాండ్ (Australia NRI)',
    labelEn: 'Australia & NZ (Pushkara Dweepa)',
    deshaKhandaTe: 'పుష్కరద్వీపే, స్వాదుజల సముద్ర వేష్టిత ప్రదేశే',
    meruDigbhagaTe: 'మేరోః ఆగ్నేయ దిగ్భాగే, దక్షిణ మహాదేశే (ఆస్ట్రేలియా ప్రదేశే)',
  },
];

function getSanskritVasaram(label: string): string {
  if (label.includes('ఆది')) return 'భానువాసరే (ఆదివారం)';
  if (label.includes('సోమ')) return 'ఇందువాసరే (సోమవారం)';
  if (label.includes('మంగళ')) return 'భౌమవాసరే (మంగళవారం)';
  if (label.includes('బుధ')) return 'సౌమ్యవాసరే (బుధవారం)';
  if (label.includes('గురు')) return 'గురువాసరే (గురువారం)';
  if (label.includes('శుక్ర')) return 'భృగువాసరే (శుక్రవారం)';
  return 'స్థిరవాసరే (శనివారం)';
}

function getAyanamAndRuthuvu(masam: string): { ayanam: string; ruthuvu: string } {
  if (masam.includes('చైత్ర') || masam.includes('వైశాఖ')) {
    return { ayanam: 'ఉత్తరాయణే', ruthuvu: 'వసంత ఋతౌ' };
  }
  if (masam.includes('జ్యేష్ఠ') || masam.includes('ఆషాఢ')) {
    return { ayanam: 'ఉత్తరాయణే / దక్షిణాయనే', ruthuvu: 'గ్రీష్మ ఋతౌ' };
  }
  if (masam.includes('శ్రావణ') || masam.includes('భాద్రపద')) {
    return { ayanam: 'దక్షిణాయనే', ruthuvu: 'వర్ష ఋతౌ' };
  }
  if (masam.includes('ఆశ్వయుజ') || masam.includes('కార్తీక')) {
    return { ayanam: 'దక్షిణాయనే', ruthuvu: 'శరద్ ఋతౌ' };
  }
  if (masam.includes('మార్గశిర') || masam.includes('పుష్య')) {
    return { ayanam: 'దక్షిణాయనే / ఉత్తరాయణే', ruthuvu: 'హేమంత ఋతౌ' };
  }
  return { ayanam: 'ఉత్తరాయణే', ruthuvu: 'శిశిర ఋతౌ' };
}

interface WeekdayStotra {
  titleTe: string;
  titleEn: string;
  deityTe: string;
  shlokasTe: string[];
  phalashrutiTe: string;
}

const WEEKDAY_STOTRAS: Record<string, WeekdayStotra> = {
  ఆదివారం: {
    titleTe: 'ఆదివారం నిత్య పారాయణ — శ్రీ సూర్య స్తోత్రం & ఆదిత్య హృదయం',
    titleEn: 'Sunday Sacred Chants — Sri Surya Stotram & Aditya Hrudayam',
    deityTe: 'శ్రీ సూర్య నారాయణ స్వామి',
    shlokasTe: [
      'జపాకుసుమ సంకాశం కాశ్యపేయం మహాద్యుతిమ్ | తమోఽరిం సర్వపాపఘ్నం ప్రణతోఽస్మి దివాకరమ్ ||',
      'ఆదిత్యాయ చ సోమాయ మంగళాయ బుధాయ చ | గురు శుక్ర శనిభ్యశ్చ రాహవే కేతవే నమః ||',
      'నమః సవిత్రే జగదేక చక్షుషే జగత్ప్రసూతి స్థితి నాశ హేతవే | త్రయీమయాయ త్రిగుణాత్మ ధారిణే విరించి నారాయణ శంకరాత్మనే ||',
    ],
    phalashrutiTe: 'ఆదివారం ఉదయాన్నే ఈ సూర్య శ్లోకాలను 11 సార్లు పఠించడం వలన సంపూర్ణ ఆరోగ్యం, తేజస్సు, ఉద్యోగంలో ఉన్నతి కలుగుతాయి.',
  },
  సోమవారం: {
    titleTe: 'సోమవారం నిత్య పారాయణ — శ్రీ శివ పంచాక్షరీ & బిల్వాష్టక శ్లోకాలు',
    titleEn: 'Monday Sacred Chants — Sri Shiva Panchakshari & Bilvashtakam',
    deityTe: 'శ్రీ సాంబ सदाశివ స్వామి',
    shlokasTe: [
      'త్ర్యంబకం యజామహే సుగంధిం పుష్టివర్ధనమ్ | ఉర్వారుకమివ బంధనాన్మృత్యోర్ముక్షీయ మాఽమృతాత్ ||',
      'త్రిదళం త్రిగుణాకారం త్రినేత్రం చ త్రియాయుధమ్ | త్రిజన్మ పాపసంహారం ఏకబిల్వం శివార్పణమ్ ||',
      'నాగేంద్రహారాయ త్రిలోచనాయ భస్మాంగరాగాయ మహేశ్వరాయ | నిత్యాయ శుద్ధాయ దిగంబరాయ తస్మై నకారాయ నమః శివాయ ||',
    ],
    phalashrutiTe: 'సోమవారం శివ పంచాక్షరీ స్తోత్రం పఠించడం వలన మనశ్శాంతి, చంద్ర గ్రహ దోష నివారణ మరియు కుటుంబ సౌఖ్యం లభిస్తాయి.',
  },
  మంగళవారం: {
    titleTe: 'మంగళవారం నిత్య పారాయణ — శ్రీ సుబ్రహ్మణ్య & ఆంజనేయ స్తోత్రం',
    titleEn: 'Tuesday Sacred Chants — Sri Subrahmanya & Hanuman Stotram',
    deityTe: 'శ్రీ సుబ్రహ్మణ్య స్వామి & శ్రీ ఆంజనేయ స్వామి',
    shlokasTe: [
      'షడాననం కుంకుమ రక్తవర్ణం మహామతిం దివ్య మయూర వాహనమ్ | రుద్రస్య సూనుం సురসৈన్య నాథం గుహం సదాఽహం శరణం ప్రపద్యే ||',
      'మనోజవం మారుత తుల్యవేగం జితేంద్రియం బుద్ధిమతాం వరిష్ఠమ్ | వాతాత్మజం వానరయూథ ముఖ్యం శ్రీరామదూతం శిరసా నమామి ||',
      'ధరణీ గర్భ సంభూతం విద్యుత్కాంతి సమప్రభమ్ | కుమారం శక్తిహస్తం తం మంగళం ప్రణమామ్యహమ్ ||',
    ],
    phalashrutiTe: 'మంగళవారం ఈ శ్లోకాలను పఠించడం వలన కుజ దోష నివారణ, రుణ విముక్తి, భూ లాభం మరియు శత్రు జయం కలుగుతాయి.',
  },
  బుధవారం: {
    titleTe: 'బుధవారం నిత్య పారాయణ — శ్రీ మహావిష్ణు & విఘ్నేశ్వర స్తోత్రం',
    titleEn: 'Wednesday Sacred Chants — Sri Maha Vishnu & Ganapathi Stotram',
    deityTe: 'శ్రీ లక్ష్మీ నారాయణ స్వామి & శ్రీ మహా గణపతి',
    shlokasTe: [
      'శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజమ్ | ప్రసన్నవదనం ధ్యాయేత్ సర్వ విఘ్నోపశాంతయే ||',
      'శాంతాకారం భుజగశయనం పద్మనాభం సురేశం విశ్వాధారం గగనసదృశం మేఘవర్ణం శుభాంగమ్ | లక్ష్మీకాంతం కమలనయనం యోగిహృద్ధ్యానగమ్యం వందే విష్ణుం భవభయహరం సర్వలోకైకనాథమ్ ||',
      'ప్రియంగు కలికాశ్యామం రూపేణాప్రతిమం బుధమ్ | సౌమ్యం సౌమ్యగుణోపేతం తం బుధం ప్రణమామ్యహమ్ ||',
    ],
    phalashrutiTe: 'బుధవారం ఈ శ్లోక పారాయణ వలన విద్యాభివృద్ధి, వ్యాపార లాభం మరియు బుద్ధి కుశలత సిద్ధిస్తాయి.',
  },
  గురువారం: {
    titleTe: 'గురువారం నిత్య పారాయణ — శ్రీ దక్షిణామూర్తి & గురు స్తోత్రం',
    titleEn: 'Thursday Sacred Chants — Sri Dakshinamurthy & Guru Stotram',
    deityTe: 'శ్రీ దక్షిణామూర్తి & దేవగురు బృహస్పతి',
    shlokasTe: [
      'గురుర్బ్రహ్మ గురుర్విష్ణుః గురుర్దేవో మహేశ్వరః | గురుః సాక్షాత్ పరబ్రహ్మ తస్మై శ్రీ గురవే నమః ||',
      'గురవే సర్వలోకానాం భిషజే భవరోగిణామ్ | నిధయే సర్వవిద్యానాం దక్షిణామూర్తయే నమః ||',
      'దేవానాం చ ఋషీణాం చ గురుం కాంచన సన్నిభమ్ | బుద్ధిభూతం త్రిలోకేశం తం నమామి బృహస్పతిమ్ ||',
    ],
    phalashrutiTe: 'గురువారం దక్షిణామూర్తి శ్లోక పారాయణ వలన గురు బలం పెరిగి, సంతాన ప్రాప్తి, వివాహ యోగం మరియు గౌరవ మర్యాదలు కలుగుతాయి.',
  },
  శుక్రవారం: {
    titleTe: 'శుక్రవారం నిత్య పారాయణ — శ్రీ మహాలక్ష్మ్యష్టకం & కనకధారా శ్లోకాలు',
    titleEn: 'Friday Sacred Chants — Sri Mahalakshmi Ashtakam & Kanakadhara',
    deityTe: 'శ్రీ అష్టలక్ష్మీ అమ్మవారు',
    shlokasTe: [
      'నమస్తేఽస్తు మహామాయే శ్రీపీఠే సురపూజితే | శంఖ చక్ర గదా హస్తే మహాలక్ష్మి నమోఽస్తు తే ||',
      'సర్వజ్ఞే సర్వవరదే సర్వదుష్ట భయంకరి | సర్వదుఃఖ హరే దేవి మహాలక్ష్మి నమోఽస్తు తే ||',
      'సిద్ధి బుద్ధి ప్రదే దేవి భుక్తి ముక్తి ప్రదాయిని | మంత్రమూర్తే సదా దేవి మహాలక్ష్మి నమోఽస్తు తే ||',
    ],
    phalashrutiTe: 'శుక్రవారం మహాలక్ష్మి శ్లోకాలను పఠించడం వలన గృహంలో అఖండ ఐశ్వర్యం, సౌభాగ్యం మరియు ధన సమృద్ధి కలుగుతాయి.',
  },
  శనివారం: {
    titleTe: 'శనివారం నిత్య పారాయణ — శ్రీ వేంకటేశ్వర & శని శాంతి స్తోత్రం',
    titleEn: 'Saturday Sacred Chants — Sri Venkateswara & Shani Shanti Stotram',
    deityTe: 'శ్రీ వేంకటేశ్వర స్వామి & శనీశ్వరుడు',
    shlokasTe: [
      'శ్రియః కాంతాయ కల్యాణ నిధయే నిధయేఽర్థినామ్ | శ్రీ వేంకట నివాసాయ శ్రీనివాసాయ మంగళమ్ ||',
      'నీలాంజన సమాభాసం రవిపుత్రం యమాగ్రజమ్ | ఛాయా మార్తాండ సంభూతం తం నమామి శనైశ్చరమ్ ||',
      'కోణస్థః పింగళో బభ్రుః కృష్ణో రౌద్రోఽంతకో యమః | సౌరిః శనైశ్చరో మందః పిప్పలాదేన సంస్తుతః ||',
    ],
    phalashrutiTe: 'శనివారం ఈ శ్లోకాలు పఠించడం వలన ఏలినాటి శని, అష్టమ శని బాధలు తొలగి శ్రీ వేంకటేశ్వర స్వామి అనుగ్రహం లభిస్తుంది.',
  },
};

export const DailySankalpamStotra: React.FC<DailySankalpamStotraProps> = ({ day }) => {
  const { t, tr } = useLanguage();
  const [region, setRegion] = useState<SankalpamRegion>('india');
  const [gotram, setGotram] = useState<string>('');
  const [devoteeName, setDevoteeName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const selectedRegion = REGION_CONFIGS.find((r) => r.id === region) || REGION_CONFIGS[0];
  const { ayanam, ruthuvu } = useMemo(() => getAyanamAndRuthuvu(day.panchanga.masam), [day.panchanga.masam]);
  const vasaram = useMemo(() => getSanskritVasaram(day.label), [day.label]);

  const cleanTithi = day.panchanga.tithi.split('-')[0]?.trim() || day.panchanga.tithi;
  const cleanNakshatra = day.panchanga.nakshatram.split('-')[0]?.trim() || day.panchanga.nakshatram;

  const fullSankalpamText = useMemo(() => {
    const gotraText = gotram.trim() ? `${gotram.trim()} గోత్రోద్భవస్య` : '(మీ గోత్రం) గోత్రోద్భవస్య';
    const nameText = devoteeName.trim() ? `${devoteeName.trim()} నామధేయస్య` : '(మీ పేరు) నామధేయస్య';

    return [
      `ఓం మమ ఉపాత్త దురితక్షయ ద్వారా శ్రీ పరమేశ్వర ముద్దిశ్య శ్రీ పరమేశ్వర ప్రీత్యర్థం, శుభే శోభనే ముహూర్తే, శ్రీ మహావిష్ణోరాజ్ఞయా ప్రవర్తమానస్య అద్య బ్రహ్మణః ద్వితీయ పరార్థే, శ్వేతవరాహ కల్పే, వైవస్వత మన్వంతరే, కలియుగే, ప్రథమపాదే,`,
      `${selectedRegion.deshaKhandaTe}, ${selectedRegion.meruDigbhagaTe}, స్వగృహే (శోభన గృహే), సమస్త దేవతా బ్రాహ్మణ హరిహర గురుచరణ సన్నిధౌ,`,
      `అస్మిన్ వర్తమాన వ్యవహారిక చాంద్రమానేన ${day.panchanga.samvatsaram} సంవత్సరే, ${ayanam}, ${ruthuvu}, ${day.panchanga.masam}, ${cleanTithi} శుభ తిథౌ, ${vasaram} శుభ వాసరే, ${cleanNakshatra} శుభ నక్షత్రే, ${day.panchanga.yogam} శుభ యోగే, ${day.panchanga.karanam} శుభ కరణే, ఏవం గుణ విశేషణ విశిష్టాయాం శుభ తిథౌ,`,
      `శ్రీమాన్ ${gotraText}, ${nameText}, ధర్మపత్నీ సమేతస్య, సకుటుంబస్య, క్షేమ, స్థైర్య, ధైర్య, విజయ, అభయ, ఆయురారోగ్య, ఐశ్వర్యాభివృధ్యర్థం, సమస్త పాపక్షయార్థం, ఇష్టకామ్యార్థ ఫలసిధ్యర్థం, అద్య నిత్య పూజాం కరిష్యే ||`,
    ].join('\n\n');
  }, [selectedRegion, day, ayanam, ruthuvu, vasaram, cleanTithi, cleanNakshatra, gotram, devoteeName]);

  const handleCopySankalpam = async () => {
    try {
      await navigator.clipboard.writeText(fullSankalpamText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleSpeakSankalpam = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(fullSankalpamText.replace(/\n+/g, ' '));
    u.lang = 'te-IN';
    u.rate = 0.88;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stotra = WEEKDAY_STOTRAS[day.label] || WEEKDAY_STOTRAS['సోమవారం'];

  return (
    <div className="space-y-8 font-telugu">
      {/* SECTION 1: AUTOMATED DAILY POOJA SANKALPAM GENERATOR */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm">
        <div className="border-b border-amber-100 pb-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
              {t('నిత్య పూజా సంకల్పం • India & Global NRI Vedic Sankalpam', 'Automated Daily Vedic Pooja Sankalpam')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">
              {tr(day.label)} {t('పూజా సంకల్పం (నేటి తిథి, నక్షత్రంతో)', 'Pooja Sankalpam (Auto-Updated for Today)')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t(
                'ఇంట్లో నిత్య పూజ లేదా వ్రతం చేసుకునేటప్పుడు చదువుకోవడానికి ఈ రోజు తిథి, వార, నక్షత్రాలతో సిద్ధం చేసిన సంకల్పం.',
                'Read aloud this authentic Telugu Sankalpam during your daily home pooja, automatically populated with today’s Tithi and Nakshatra.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <button
              type="button"
              onClick={handleSpeakSankalpam}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSpeaking ? <Square size={15} /> : <Volume2 size={15} />}
              <span>{isSpeaking ? t('ఆడియో ఆపండి', 'Stop Audio') : t('సంకల్పం వినండి (Audio)', 'Listen Sankalpam')}</span>
            </button>

            <button
              type="button"
              onClick={handleCopySankalpam}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? <Check size={15} className="text-emerald-700" /> : <Copy size={15} />}
              <span>{copied ? t('కాపీ చేయబడింది!', 'Copied!') : t('సంకల్పం కాపీ చేయండి', 'Copy Text')}</span>
            </button>
          </div>
        </div>

        {/* Region Tabs + Optional Gotram/Name Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <Globe size={14} />
              <span>{t('మీరు పూజ చేస్తున్న దేశం / ప్రాంతం ఎంచుకోండి (Select Your Country):', 'Select Your Location for Dweepa/Varsha/Khanda:')}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {REGION_CONFIGS.map((cfg) => (
                <button
                  key={cfg.id}
                  type="button"
                  onClick={() => setRegion(cfg.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    region === cfg.id
                      ? 'bg-amber-900 text-white border-amber-900 shadow-2xs'
                      : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {t(cfg.labelTe, cfg.labelEn)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="sankalpam-gotram" className="block text-xs font-bold text-slate-700 mb-1">
                {t('మీ గోత్రం (Optional - సంకల్పంలో జత చేయడానికి):', 'Your Gotram (Optional):')}
              </label>
              <input
                id="sankalpam-gotram"
                type="text"
                value={gotram}
                onChange={(e) => setGotram(e.target.value)}
                placeholder={t('ఉదా: భారద్వాజ / కాశ్యప / హరితస', 'e.g. Bharadwaja / Kashyapa')}
                className="w-full rounded-xl border border-amber-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="sankalpam-name" className="block text-xs font-bold text-slate-700 mb-1">
                {t('మీ పేరు (Optional - సంకల్పంలో జత చేయడానికి):', 'Your Name (Optional):')}
              </label>
              <input
                id="sankalpam-name"
                type="text"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                placeholder={t('ఉదా: శ్రీనివాస శర్మ / రామ్మోహన్ రావు', 'e.g. Srinivas Rao')}
                className="w-full rounded-xl border border-amber-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Rendered Sacred Parchment Sankalpam Text */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-amber-900 border-b border-amber-200/80 pb-3">
            <span className="font-bold">{day.teediVaram}</span>
            <span>·</span>
            <span>{day.panchanga.samvatsaram}</span>
            <span>·</span>
            <span>{ayanam}</span>
            <span>·</span>
            <span>{ruthuvu}</span>
            <span>·</span>
            <span>{day.panchanga.masam}</span>
          </div>

          <div className="text-base sm:text-lg leading-loose text-amber-950 font-semibold whitespace-pre-line">
            {fullSankalpamText}
          </div>
        </div>
      </section>

      {/* SECTION 2: DAILY WEEKDAY STOTRA PARAYANAM */}
      <section className="bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/60 shadow-lg">
        <div className="border-b border-amber-800 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5 mb-1">
            <BookOpen size={14} />
            <span>{t('నిత్య పారాయణ శ్లోకాలు • Daily Sacred Stotra', 'Daily Sacred Stotra Parayanam')}</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            {t(stotra.titleTe, stotra.titleEn)}
          </h3>
          <p className="text-sm text-amber-200 mt-1">
            {t('ఆరాధ్య దైవం:', 'Presiding Deity:')} <strong>{stotra.deityTe}</strong>
          </p>
        </div>

        <div className="space-y-4">
          {stotra.shlokasTe.map((shloka, idx) => (
            <div
              key={idx}
              className="bg-amber-950/80 border border-amber-700/70 rounded-2xl p-5 text-base sm:text-lg leading-relaxed text-amber-100 font-semibold"
            >
              <span className="text-xs font-mono text-amber-400 block mb-1">
                శ్లోకం 0{idx + 1}
              </span>
              {shloka}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-amber-800/80 flex items-start gap-2.5 text-sm text-amber-200">
          <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>{t('ఫలశ్రుతి:', 'Spiritual Benefit:')}</strong> {stotra.phalashrutiTe}
          </p>
        </div>
      </section>
    </div>
  );
};
