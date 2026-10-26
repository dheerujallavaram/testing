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

export const VastuChakraGuide: React.FC = () => {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>('ishanyam');

  const selectedDir = ASHTA_DIKPALA_DIRECTIONS.find((d) => d.id === selectedId) || ASHTA_DIKPALA_DIRECTIONS[0];

  return (
    <div className="space-y-8 font-telugu">
      <div className="bg-amber-50/70 rounded-2xl p-5 sm:p-6 border border-amber-200/90">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
          <Compass size={22} className="text-amber-700" />
          <span>
            {t(
              'అష్ట దిక్పాలక గృహ వాస్తు చక్రం & గదుల నియమాలు (Vastu Shastra Guide)',
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
