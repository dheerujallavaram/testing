import React, { useState } from 'react';
import { Compass, Home, CheckCircle2, AlertTriangle, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VastuDirectionInfo {
  id: string;
  directionTe: string;
  directionEn: string;
  dikpalakaTe: string;
  planetTe: string;
  elementTe: string;
  idealRoomsTe: string;
  idealRoomsEn: string;
  avoidTe: string;
  remedyTe: string;
}

const ASHTA_DIKPALA_DIRECTIONS: VastuDirectionInfo[] = [
  {
    id: 'ishanyam',
    directionTe: 'ఈశాన్యం (North-East)',
    directionEn: 'North-East (Ishanyam)',
    dikpalakaTe: 'ఈశానుడు (పరమశివుడు)',
    planetTe: 'గురుడు (Jupiter)',
    elementTe: 'జల తత్వం (Water)',
    idealRoomsTe: 'పూజా గది, బోరు బావి / సంపు (నీటి నిల్వ), వరండా, ఖాళీ స్థలం, తులసి కోట',
    idealRoomsEn: 'Pooja Room, Underground Water Sump/Borewell, Open Verandah',
    avoidTe: 'ఈశాన్యంలో బరువైన నిర్మాణాలు, మెట్లు, సెప్టిక్ ట్యాంక్, వంటగది లేదా టాయిలెట్ అసలు ఉండరాదు.',
    remedyTe: 'ఈశాన్యం ఎప్పుడూ శుభ్రంగా, పల్లంగా ఉంచాలి; స్ఫటిక శివలింగం లేదా రాగి కలశం స్థాపించడం శుభప్రదం.',
  },
  {
    id: 'east',
    directionTe: 'తూర్పు (East)',
    directionEn: 'East (Purva)',
    dikpalakaTe: 'దేవేంద్రుడు (Indra)',
    planetTe: 'సూర్యుడు (Sun)',
    elementTe: 'అగ్ని / వాయు మిశ్రమం',
    idealRoomsTe: 'ప్రధాన సింహద్వారం, హాల్ (Living Room), పిల్లల చదువుకునే గది, బాల్కనీ',
    idealRoomsEn: 'Main Entrance, Living Room, Study Room, Wide Windows',
    avoidTe: 'తూర్పు భాగంలో ఎత్తైన గోడలు, చెత్త నిల్వలు, సూర్యరశ్మికి ఆటంకాలు ఉండరాదు.',
    remedyTe: 'ఉదయపు సూర్యకిరణాలు ఇంట్లోకి ప్రవేశించేలా కిటికీలు ఉంచాలి; సింహద్వారంపై రాగి సూర్య యంత్రం శుభం.',
  },
  {
    id: 'agneyam',
    directionTe: 'ఆగ్నేయం (South-East)',
    directionEn: 'South-East (Agneyam)',
    dikpalakaTe: 'అగ్ని దేవుడు (Agni)',
    planetTe: 'శుక్రుడు (Venus)',
    elementTe: 'అగ్ని తత్వం (Fire)',
    idealRoomsTe: 'వంట గది (తూర్పు వైపు తిరిగి వంట చేయడం ఉత్తమం), ఎలక్ట్రికల్ మీటర్, ఇన్వర్టర్',
    idealRoomsEn: 'Kitchen (facing East while cooking), Electrical Generator/Inverter',
    avoidTe: 'ఆగ్నేయంలో బోరు బావి, నీటి సంపు లేదా పడక గది ఉండరాదు.',
    remedyTe: 'వంటగదిలో ఆగ్నేయ మూల ఎర్రటి లేదా కాషాయ రంగు బల్బు వెలిగించడం, అన్నపూర్ణాదేవి పటం ఉంచడం శ్రేష్ఠం.',
  },
  {
    id: 'south',
    directionTe: 'దక్షిణం (South)',
    directionEn: 'South (Dakshina)',
    dikpalakaTe: 'యమధర్మరాజు (Yama)',
    planetTe: 'కుజుడు (Mars)',
    elementTe: 'పృథ్వీ తత్వం (Earth)',
    idealRoomsTe: 'స్టోర్ రూమ్, భోజనశాల (Dining), మెట్లు, రెండవ పడక గది (తల దక్షిణం వైపు పెట్టి నిద్రించాలి)',
    idealRoomsEn: 'Store Room, Dining Area, Staircase, Secondary Bedroom',
    avoidTe: 'దక్షిణం వైపు పల్లంగా ఉండటం లేదా పెద్ద ఖాళీ స్థలం వదిలి ఉత్తరం మూసివేయడం దోషం.',
    remedyTe: 'దక్షిణ గోడలు ఎత్తుగా, మందంగా ఉండాలి; పంచముఖి ఆంజనేయ స్వామి చిత్రపటం దక్షిణ దృష్టి దోషాలను తొలగిస్తుంది.',
  },
  {
    id: 'nairuthi',
    directionTe: 'నైరుతి (South-West)',
    directionEn: 'South-West (Nairuthi)',
    dikpalakaTe: 'నిరృతి (Nirriti)',
    planetTe: 'రాహువు / కేతువు',
    elementTe: 'పృథ్వీ తత్వం (Heavy Earth)',
    idealRoomsTe: 'ఇంటి యజమాని పడక గది (Master Bedroom), బీరువా/లాకర్ (ఉత్తరం వైపు తెరుచుకునేలా), ఓవర్‌హెడ్ వాటర్ ట్యాంక్',
    idealRoomsEn: 'Master Bedroom for Head of Family, Cash Locker (facing North), Overhead Tank',
    avoidTe: 'నైరుతిలో గొయ్యి, బోరు బావి, అండర్‌గ్రౌండ్ సంపు లేదా నైరుతి వీధి పోటు ఉండరాదు.',
    remedyTe: 'నైరుతి మూల ఎప్పుడూ ఇతర దిక్కుల కంటే ఎత్తుగా, బరువుగా ఉండాలి; రాహు-కేతు వాస్తు శాంతి చేయించాలి.',
  },
  {
    id: 'west',
    directionTe: 'పడమర (West)',
    directionEn: 'West (Paschima)',
    dikpalakaTe: 'వరుణ దేవుడు (Varuna)',
    planetTe: 'శని భగవానుడు (Saturn)',
    elementTe: 'జల / వాయు తత్వం',
    idealRoomsTe: 'పిల్లల పడక గది, డైనింగ్ రూమ్, స్టడీ రూమ్, మెట్లు',
    idealRoomsEn: 'Children Bedroom, Dining Room, Study Room, Staircase',
    avoidTe: 'పడమర కంటే తూర్పు ఎత్తుగా ఉండరాదు.',
    remedyTe: 'శనివారం తిల తైల దీపారాధన, పడమర భాగంలో క్రమశిక్షణతో వస్తువులను అమర్చుకోవడం శుభం.',
  },
  {
    id: 'vayuvyam',
    directionTe: 'వాయువ్యం (North-West)',
    directionEn: 'North-West (Vayuvyam)',
    dikpalakaTe: 'వాయు దేవుడు (Vayu)',
    planetTe: 'చంద్రుడు (Moon)',
    elementTe: 'వాయు తత్వం (Air)',
    idealRoomsTe: 'అతిథుల గది (Guest Room), ధాన్యం నిల్వ, వాహన పార్కింగ్ (Garage), బాత్‌రూమ్ / సెప్టిక్ ట్యాంక్',
    idealRoomsEn: 'Guest Room, Car Parking, Septic Tank, Washroom',
    avoidTe: 'వాయువ్యంలో ఇంటి యజమాని పడక గది లేదా ధన లాకర్ ఉంచరాదు.',
    remedyTe: 'గాలి, వెలుతురు ధారాళంగా ప్రసరించేలా చూడాలి; దుర్గాదేవి ఆరాధన వలన మనశ్శాంతి కలుగుతుంది.',
  },
  {
    id: 'north',
    directionTe: 'ఉత్తరం (North)',
    directionEn: 'North (Uttara)',
    dikpalakaTe: 'కుబేరుడు (Kubera)',
    planetTe: 'బుధుడు (Mercury)',
    elementTe: 'జల తత్వం',
    idealRoomsTe: 'సింహద్వారం, లివింగ్ రూమ్, ట్రెజరీ / ఆఫీస్ గది, బాల్కనీ, ఖాళీ స్థలం',
    idealRoomsEn: 'Main Door, Living Room, Home Office, Treasury, Open Space',
    avoidTe: 'ఉత్తరం వైపు మెట్లు, బరువైన స్టోర్ రూమ్ లేదా ఎత్తైన అడ్డంకులు ఉండరాదు.',
    remedyTe: 'ఉత్తర దిశలో లక్ష్మీ కుబేర యంత్రం లేదా తులసి/మనీ ప్లాంట్ ఉంచడం వలన వ్యాపార, ధన వృద్ధి కలుగుతుంది.',
  },
  {
    id: 'brahma',
    directionTe: 'బ్రహ్మస్థానం (Center of House)',
    directionEn: 'Brahmasthanam (Center)',
    dikpalakaTe: 'చతుర్ముఖ బ్రహ్మ దేవుడు',
    planetTe: 'బృహస్పతి / ఆకాశం',
    elementTe: 'ఆకాశ తత్వం (Space)',
    idealRoomsTe: 'ఇంటి మధ్య భాగం (హాలు) ఎప్పుడూ ఖాళీగా, వెలుతురుతో ఉండాలి',
    idealRoomsEn: 'Central Courtyard / Open Living Hall with Natural Light',
    avoidTe: 'ఇంటి నడిమధ్యలో పిల్లర్ (స్తంభం), మెట్లు, బీరువా లేదా టాయిలెట్ అసలు ఉండరాదు.',
    remedyTe: 'బ్రహ్మస్థానం పరిశుభ్రంగా ఉంచి, ప్రతి శుక్రవారం పసుపు, గోమూత్రంతో శుద్ధి చేయడం సర్వశుభకరం.',
  },
];

// 3x3 Compass layout mapping to ASHTA_DIKPALA_DIRECTIONS ids
const COMPASS_GRID_IDS = [
  ['vayuvyam', 'north', 'ishanyam'],
  ['west', 'brahma', 'east'],
  ['nairuthi', 'south', 'agneyam'],
];

interface HouseFacingVastuInfo {
  id: 'east-facing' | 'north-facing' | 'west-facing' | 'south-facing';
  titleTe: string;
  titleEn: string;
  badgeTe: string;
  rulerTe: string;
  suitedRashisTe: string;
  simhadwaramRuleTe: string;
  prosperityBenefitsTe: string;
  doshaPrecautionTe: string;
  remedyTe: string;
}

const HOUSE_FACING_VASTU_DB: HouseFacingVastuInfo[] = [
  {
    id: 'east-facing',
    titleTe: '🌅 తూర్పు ముఖద్వారం (East Facing House)',
    titleEn: 'East Facing House (Purva Simhadwaram)',
    badgeTe: 'అత్యుత్తమ సూర్య తేజస్సు & ఆరోగ్య యోగం',
    rulerTe: 'సూర్య భగవానుడు & దేవేంద్రుడు',
    suitedRashisTe: 'మేషం, సింహం, ధనుస్సు, కర్కాటకం, వృశ్చికం, మీనం (మరియు సర్వ రాశులకు శుభప్రదం)',
    simhadwaramRuleTe:
      'తూర్పు గోడకు ఈశాన్యం వైపు (తూర్పు-ఈశాన్యం ఉచ్చ స్థానం) ప్రధాన సింహద్వారం ఉండాలి. ఆగ్నేయం వైపు ప్రధాన ద్వారం పెట్టరాదు.',
    prosperityBenefitsTe:
      'ప్రభుత్వ ఉద్యోగాలు, రాజకీయ పదవులు, సంతాన వృద్ధి, సంపూర్ణ ఆరోగ్యం మరియు సమాజంలో గౌరవ మర్యాదలు పెరుగుతాయి.',
    doshaPrecautionTe:
      'తూర్పు వైపు మెట్లు, సెప్టిక్ ట్యాంక్, ఎత్తైన చెట్లు లేదా అడ్డంకులు ఉండకూడదు. తూర్పు కంటే పడమర ఎత్తుగా ఉండాలి.',
    remedyTe:
      'సింహద్వారం పైన రాగి సూర్య యంత్రం / లక్ష్మీ గణపతి పటం ఉంచి, తూర్పు-ఈశాన్యంలో తులసి కోట లేదా నీటి సంపు ఏర్పాటు చేయాలి.',
  },
  {
    id: 'north-facing',
    titleTe: '🧭 ఉత్తర ముఖద్వారం (North Facing House)',
    titleEn: 'North Facing House (Kubera Simhadwaram)',
    badgeTe: 'కుబేర ధన యోగం & వ్యాపార అభివృద్ధి',
    rulerTe: 'కుబేరుడు & బుధ గ్రహం',
    suitedRashisTe: 'వృషభం, మిథునం, కన్య, తుల, మకరం, కుంభం (వ్యాపార, ఐటీ & ఆర్థిక రంగాల వారికి విశేషం)',
    simhadwaramRuleTe:
      'ఉత్తర గోడకు ఈశాన్యం వైపు (ఉత్తర-ఈశాన్యం ఉచ్చ స్థానం) సింహద్వారం ఉండాలి. వాయువ్యం చివర ప్రధాన ద్వారం ఉండరాదు.',
    prosperityBenefitsTe:
      'అఖండ ధన ప్రవాహం, వ్యాపార విస్తరణ, షేర్ మార్కెట్ & బ్యాంకింగ్ రంగాలలో విజయం, ఆర్థిక స్థిరత్వం లభిస్తాయి.',
    doshaPrecautionTe:
      'ఉత్తరం వైపు ఎత్తుగా ఉండటం, ఉత్తరంలో బరువైన స్టోర్ రూమ్ లేదా చెత్త ఉంచడం వల్ల కుబేర అనుగ్రహం తగ్గుతుంది.',
    remedyTe:
      'ఉత్తర దిశలో శ్రీ లక్ష్మీ కుబేర యంత్రం స్థాపించి, బీరువా తలుపు ఉత్తరం వైపు తెరుచుకునేలా నైరుతి గదిలో అమర్చాలి.',
  },
  {
    id: 'west-facing',
    titleTe: '🌇 పశ్చిమ (పడమర) ముఖద్వారం (West Facing House)',
    titleEn: 'West Facing House (Paschima Simhadwaram)',
    badgeTe: 'స్థిర ఆస్తులు & శని-వరుణ అనుగ్రహం',
    rulerTe: 'వరుణ దేవుడు & శని భగవానుడు',
    suitedRashisTe: 'వృషభం, మిథునం, తుల, మకరం, కుంభం (న్యాయ, రియల్ ఎస్టేట్, ఇంజనీరింగ్ & వ్యాపారస్తులకు)',
    simhadwaramRuleTe:
      'పడమర గోడకు వాయువ్యం వైపు (పశ్చిమ-వాయువ్యం ఉచ్చ స్థానం) సింహద్వారం పెట్టాలి. పశ్చిమ-నైరుతిలో ద్వారం అసలు ఉండరాదు.',
    prosperityBenefitsTe:
      'స్థిరాస్తుల వృద్ధి, విదేశీ యోగం, సమాజంలో స్థిరమైన పేరు ప్రతిష్ఠలు మరియు భాగస్వామ్య వ్యాపారాలలో లాభాలు కలుగుతాయి.',
    doshaPrecautionTe:
      'పడమర వైపు అండర్‌గ్రౌండ్ సంపు లేదా బోరు బావి తవ్వకూడదు (నీటి సంపు ఈశాన్యంలోనే ఉండాలి).',
    remedyTe:
      'పడమర సింహద్వారానికి పసుపు-కుంకుమ స్వస్తిక్ చిహ్నం వేసి, శనివారం ఆంజనేయ స్వామి / వేంకటేశ్వర ఆరాధన చేయాలి.',
  },
  {
    id: 'south-facing',
    titleTe: '🔥 దక్షిణ ముఖద్వారం (South Facing House)',
    titleEn: 'South Facing House (Dakshina Simhadwaram)',
    badgeTe: 'ఉచ్చ స్థానంలో పెడితే అఖండ ఐశ్వర్యం',
    rulerTe: 'కుజ గ్రహం (Mars) & యమధర్మరాజు',
    suitedRashisTe: 'మేషం, వృశ్చికం, సింహం, మకరం (పోలీస్, వైద్య, రియల్ ఎస్టేట్, బంగారం & ఆహార వ్యాపారాలకు)',
    simhadwaramRuleTe:
      'దక్షిణ గోడకు ఆగ్నేయం వైపు (దక్షిణ-ఆగ్నేయం ఉచ్చ స్థానం / 4వ పదం) మాత్రమే సింహద్వారం ఉండాలి. దక్షిణ-నైరుతిలో ద్వారం ఉండరాదు.',
    prosperityBenefitsTe:
      'సరైన ఉచ్చ స్థానంలో దక్షిణ సింహద్వారం ఉంటే ధైర్య సాహసాలు, భూ-గృహ లాభాలు, శత్రు జయం మరియు అంచెలంచెలుగా ఐశ్వర్యం పెరుగుతాయి.',
    doshaPrecautionTe:
      'దక్షిణం వైపు బోరు బావి, గొయ్యి, లేదా దక్షిణ-నైరుతి వీధి పోటు అసలు ఉండకూడదు. దక్షిణం కంటే ఉత్తరం పల్లంగా ఉండాలి.',
    remedyTe:
      'దక్షిణ సింహద్వారం పైన పంచముఖి ఆంజనేయ స్వామి చిత్రపటం / మత్స్య యంత్రం ఉంచి, సుబ్రహ్మణ్య స్వామి ఆరాధన చేయాలి.',
  },
];

export const VastuChakraGuide: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>('ishanyam');
  const [selectedFacingId, setSelectedFacingId] =
    useState<HouseFacingVastuInfo['id']>('east-facing');

  const selectedDir =
    ASHTA_DIKPALA_DIRECTIONS.find((d) => d.id === selectedId) || ASHTA_DIKPALA_DIRECTIONS[0];
  const selectedFacing =
    HOUSE_FACING_VASTU_DB.find((f) => f.id === selectedFacingId) || HOUSE_FACING_VASTU_DB[0];

  return (
    <div id="gruha-vastu-checker" className="space-y-8 font-telugu scroll-mt-24">
      {/* ============================================================== */}
      {/* PART 1: INTERACTIVE HOUSE FACING (SIMHADWARAM) VASTU CHECKER   */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-br from-amber-950 via-[#3b1506] to-amber-900 text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-500/60 shadow-lg space-y-5">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Home size={15} className="text-amber-400" />
            <span>
              {t(
                'ఇంటి ముఖద్వార వాస్తు చెకర్ • House Facing Simhadwaram Vastu Checker',
                'Interactive House Facing Vastu Checker'
              )}
            </span>
          </span>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white">
            {t(
              'మీ ఇంటి ముఖద్వారం (తూర్పు / ఉత్తరం / పశ్చిమం / దక్షిణం) వాస్తు ఫలితాలు',
              'Check Your House Facing Vastu Rules (East, North, West & South)'
            )}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-3xl">
            {t(
              'మీ ఇల్లు లేదా ప్లాట్ ఏ దిశకు అభిముఖంగా ఉందో క్రింద ఎంచుకొని, సింహద్వార ఉచ్చ స్థానం, అనుకూల రాశులు మరియు వాస్తు నియమాలను వెంటనే తెలుసుకోండి:',
              'Select your home or plot facing direction below to view auspicious Simhadwaram placement, suited Rashis, and Vastu remedies:'
            )}
          </p>
        </div>

        {/* 4 Facing Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {HOUSE_FACING_VASTU_DB.map((facing) => {
            const isActive = facing.id === selectedFacingId;
            return (
              <button
                key={facing.id}
                type="button"
                onClick={() => setSelectedFacingId(facing.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 border-white font-extrabold shadow-md scale-[1.02]'
                    : 'bg-amber-900/60 hover:bg-amber-900 text-amber-100 border-amber-600/60 font-bold'
                }`}
              >
                <span className="text-xs sm:text-sm block leading-snug">
                  {language === 'te' ? facing.titleTe : facing.titleEn}
                </span>
                <span
                  className={`text-[10px] block mt-1 ${
                    isActive ? 'text-amber-900 font-bold' : 'text-amber-300/90'
                  }`}
                >
                  {facing.badgeTe}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Facing Detail Card */}
        <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 border border-amber-300 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
            <div>
              <h4 className="text-lg sm:text-2xl font-extrabold text-amber-950">
                {language === 'te' ? selectedFacing.titleTe : selectedFacing.titleEn}
              </h4>
              <p className="text-xs text-amber-900 font-semibold mt-0.5">
                <strong>👑 అధిపతి:</strong> {selectedFacing.rulerTe} &nbsp;|&nbsp;{' '}
                <strong>🌟 అనుకూల రాశులు:</strong> {selectedFacing.suitedRashisTe}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold self-start sm:self-center shrink-0">
              {selectedFacing.badgeTe}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1">
              <strong className="text-emerald-950 font-bold block">
                🚪 సింహద్వార ఉచ్చ స్థాన నియమం:
              </strong>
              <p className="text-slate-800 leading-relaxed">{selectedFacing.simhadwaramRuleTe}</p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
              <strong className="text-amber-950 font-bold block">
                ✨ కలిగే శుభ ఫలితాలు & ఐశ్వర్య యోగం:
              </strong>
              <p className="text-slate-800 leading-relaxed">
                {selectedFacing.prosperityBenefitsTe}
              </p>
            </div>

            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-1">
              <strong className="text-rose-950 font-bold block">
                ⚠️ తీసుకోవలసిన వాస్తు జాగ్రత్తలు:
              </strong>
              <p className="text-slate-800 leading-relaxed">{selectedFacing.doshaPrecautionTe}</p>
            </div>

            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-1">
              <strong className="text-sky-950 font-bold block">
                🪔 వాస్తు శాంతి & దోష నివారణ పరిహారం:
              </strong>
              <p className="text-slate-800 leading-relaxed">{selectedFacing.remedyTe}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100">
            <span className="text-xs text-slate-600 font-medium">
              📐 కొత్త ఇంటి ప్లాన్, ఫ్లాట్ కొనుగోలు లేదా శంకుస్థాపన / గృహప్రవేశ ముహూర్తం కోసం:
            </span>
            <a
              href={`https://wa.me/918977986166?text=${encodeURIComponent(
                `నమస్కారం బ్రహ్మశ్రీ ధీరజ్ శర్మ సిద్ధాంతి గారు, మా "${selectedFacing.titleTe}" ఇంటి వాస్తు పరిశీలన మరియు గృహప్రవేశ ముహూర్తం కోసం సంప్రదిస్తున్నాను.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs"
            >
              <MessageCircle size={16} />
              <span>
                {t('వాస్తు పరిశీలన కోసం WhatsApp చేయండి', 'Consult Guruji for Vastu on WhatsApp')}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PART 2: 8-DIRECTION ASHTA DIKPALA VASTU MANDALA COMPASS        */}
      {/* ============================================================== */}
      <div className="bg-amber-50/70 rounded-2xl p-5 sm:p-6 border border-amber-200/90">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
          <Compass size={22} className="text-amber-700" />
          <span>
            {t(
              'అష్ట దిక్పాలక గృహ వాస్తు చక్రం & 8 దిక్కుల గదుల నియమాలు (Vastu Compass)',
              'Interactive 8-Direction Ashta Dikpala Gruha Vastu Compass'
            )}
          </span>
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          {t(
            'ఈశాన్యం, ఆగ్నేయం, నైరుతి, వాయువ్యం మరియు నాలుగు ప్రధాన దిక్కులలో ఏ గది ఎక్కడ ఉండాలో క్రింది వాస్తు చక్రంలో ఏదైనా దిశను నొక్కి చూడండి.',
            'Click any direction in the 3x3 Vastu Mandala below to inspect its presiding Dikpalaka, ideal rooms, doshas to avoid, and remedies.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive 3x3 Vastu Mandala Grid */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-amber-200 shadow-2xs">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-amber-900 mb-3">
            ⬆️ {t('ఉత్తరం (North) పైభాగం', 'North at Top')}
          </div>

          <div className="grid grid-cols-3 gap-2 aspect-square">
            {COMPASS_GRID_IDS.flat().map((dirId) => {
              const info = ASHTA_DIKPALA_DIRECTIONS.find((d) => d.id === dirId)!;
              const isSelected = dirId === selectedId;
              const isCorner = ['ishanyam', 'agneyam', 'nairuthi', 'vayuvyam'].includes(dirId);
              const isCenter = dirId === 'brahma';

              return (
                <button
                  key={dirId}
                  type="button"
                  onClick={() => setSelectedId(dirId)}
                  className={`rounded-2xl p-2.5 flex flex-col items-center justify-center text-center border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-900 text-white border-amber-950 ring-2 ring-amber-400 shadow-md'
                      : isCenter
                      ? 'bg-amber-100/90 text-amber-950 border-amber-400 hover:bg-amber-200/70'
                      : isCorner
                      ? 'bg-amber-50/80 text-slate-900 border-amber-200 hover:bg-amber-100'
                      : 'bg-white text-slate-900 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <strong className="text-xs sm:text-sm font-bold leading-tight">
                    {info.directionTe.split(' (')[0]}
                  </strong>
                  <span
                    className={`text-[10px] mt-1 ${
                      isSelected ? 'text-amber-200' : 'text-slate-500'
                    }`}
                  >
                    {info.dikpalakaTe.split(' (')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Vastu Analysis for Selected Direction */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-2xs space-y-5">
          <div className="border-b border-amber-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              {selectedDir.elementTe} · {t('గ్రహాధిపతి:', 'Ruling Planet:')} {selectedDir.planetTe}
            </span>
            <h4 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1">
              {t(selectedDir.directionTe, selectedDir.directionEn)}
            </h4>
            <p className="text-sm text-amber-900 font-semibold mt-0.5">
              {t('దిక్పాలకుడు:', 'Presiding Guardian:')} {selectedDir.dikpalakaTe}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 mb-1">
                <CheckCircle2 size={17} />
                <span>{t('ఉండవలసిన గదులు / నిర్మాణాలు (Ideal Placement):', 'Ideal Rooms & Structures:')}</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                {t(selectedDir.idealRoomsTe, selectedDir.idealRoomsEn)}
              </p>
            </div>

            <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-900 mb-1">
                <AlertTriangle size={17} />
                <span>{t('నివారించవలసిన వాస్తు దోషాలు (What to Avoid):', 'Vastu Doshas to Avoid:')}</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                {selectedDir.avoidTe}
              </p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-950 mb-1">
                <Home size={17} className="text-amber-700" />
                <span>{t('వాస్తు శాంతి & పరిహార సూచన (Vedic Vastu Remedy):', 'Vastu Shanti Remedy:')}</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                {selectedDir.remedyTe}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`https://wa.me/918977986166?text=${encodeURIComponent(
                `నమస్కారం బ్రహ్మశ్రీ ధీరజ్ శర్మ సిద్ధాంతి గారు, మా ఇంటి / ప్లాట్ (${selectedDir.directionTe}) వాస్తు పరిశీలన మరియు గృహప్రవేశ ముహూర్తం కోసం సంప్రదిస్తున్నాను.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-900 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <MessageCircle size={17} />
              <span>
                {t(
                  'మీ ఇంటి ప్లాన్ / వాస్తు సందేహాల కోసం ధీరజ్ శర్మ గారిని సంప్రదించండి',
                  'Consult Sri Dheeraj Sharma for Personalized Home Vastu Analysis'
                )}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

