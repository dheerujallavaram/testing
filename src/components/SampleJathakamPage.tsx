import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  ShieldAlert,
  Calendar,
  Compass,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { computeAccurateJanmaKundali } from '../utils/astronomyPanchangam';
import {
  buildComprehensiveJathakaPdfHtml,
  renderNorthIndianChartSvg,
} from '../utils/jathakamReportPdfGenerator';
import {
  computePlanetaryDignities,
  checkNeechaBhangaRajaYoga,
  detectAllYogasAndDoshas,
  evaluateTripleKujaDosha,
  calculateDynamicMarriageTiming,
  computeVimshottariFullTimeline,
  computeNext12MonthsGochara,
  buildPanchangaBirthProfile,
  generateExecutiveSummary,
} from '../utils/advancedAstrologyReportEngine';

interface SampleJathakamPageProps {
  onNavigateToJathakam?: () => void;
  onOpenBooking?: () => void;
}

export const SampleJathakamPage: React.FC<SampleJathakamPageProps> = ({
  onNavigateToJathakam,
  onOpenBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'faq'>('preview');

  // Sample Profile Data: Srinivasa Rao, 1994-08-15 09:30, Hyderabad
  const sampleName = 'శ్రీనివాస రావు (నమూనా జాతకం / Sample Profile)';
  const sampleBirthDate = '1994-08-15';
  const sampleBirthTime = '09:30';
  const sampleCityName = 'హైదరాబాద్';

  const chartData = computeAccurateJanmaKundali(
    sampleBirthDate,
    sampleBirthTime,
    17.385,
    78.4867
  );
  const lagnaRashiIdx = chartData.planets[0].rashiIdx; // Virgo = 5
  const sunPlanet = chartData.planets.find((p) => p.id === 'sun') || chartData.planets[1];
  const moonPlanet = chartData.planets.find((p) => p.id === 'moon') || chartData.planets[2];

  const dignities = computePlanetaryDignities(chartData.planets, lagnaRashiIdx);
  const neechaBhanga = checkNeechaBhangaRajaYoga(dignities, chartData.planets, lagnaRashiIdx);
  const yogas = detectAllYogasAndDoshas(chartData.planets, lagnaRashiIdx, dignities);
  const tripleKuja = evaluateTripleKujaDosha(chartData.planets, lagnaRashiIdx);
  const marriageTiming = calculateDynamicMarriageTiming(
    sampleBirthDate,
    lagnaRashiIdx,
    moonPlanet.rashiIdx
  );
  const dashaInfo = computeVimshottariFullTimeline(
    moonPlanet.longitude,
    sampleBirthDate,
    sampleBirthTime
  );
  const gochara12m = computeNext12MonthsGochara(moonPlanet.rashiIdx, lagnaRashiIdx);
  const panchangaProfile = buildPanchangaBirthProfile(
    chartData,
    sampleBirthDate,
    sampleBirthTime,
    sampleCityName
  );
  const execSummary = generateExecutiveSummary(
    dignities,
    yogas,
    tripleKuja,
    dashaInfo,
    marriageTiming
  );

  const handlePrintPdf = () => {
    const html = buildComprehensiveJathakaPdfHtml({
      name: 'శ్రీనివాస రావు',
      birthDate: sampleBirthDate,
      birthTime: sampleBirthTime,
      cityName: sampleCityName,
      chartData,
    });

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 400);
    }
  };

  const handleDownloadHtml = () => {
    const html = buildComprehensiveJathakaPdfHtml({
      name: 'శ్రీనివాస రావు',
      birthDate: sampleBirthDate,
      birthTime: sampleBirthTime,
      cityName: sampleCityName,
      chartData,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Srinivasa_Rao_Sample_Telugu_Jathakam_Report.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  // FAQ Schema JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'తెలుగు జాతక నివేదిక PDF లో ఏయే భాగాలు ఉంటాయి?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ఈ బృహత్ జాతక నివేదికలో 1-పేజీ ఎగ్జిక్యూటివ్ సమ్మరీ, ఖగోళ దృక్సిద్ధాంత జన్మ పంచాంగం, D1 రాశి, D9 నవాంశ, D10 దశాంశ, D7 సప్తాంశ వర్గ చక్రాలు, ఉత్తర భారత చక్రం, నవగ్రహ స్ఫుటాలు, గ్రహ బల పట్టిక, నీచభంగ రాజయోగ విశ్లేషణ, త్రివిధ కుజ దోష పరిశీలన (లగ్న, చంద్ర, శుక్ర), వింశోత్తరి మహాదశ-అంతర్దశల క్యాలెండర్, రాబోయే 12 నెలల గోచారం మరియు వైదిక పరిహారాలు ఉంటాయి.',
        },
      },
      {
        '@type': 'Question',
        name: 'సూర్య రాశి (Sun Sign) మరియు జన్మ లగ్నం (Lagna) మధ్య తేడా ఏమిటి?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'జన్మ లగ్నం అనేది మీరు జన్మించిన సమయానికి తూర్పు దిక్కున ఉదయిస్తున్న రాశి. ఇది మీ శారీరక ఆరోగ్యం మరియు భౌతిక వ్యక్తిత్వాన్ని సూచిస్తుంది. సూర్య రాశి అనేది సూర్యుడు సంచరిస్తున్న రాశి (ఆత్మకారకుడు). ఈ నివేదికలో రెండింటినీ వేర్వేరుగా కచ్చితమైన డిగ్రీలతో విశ్లేషించడం జరుగుతుంది.',
        },
      },
      {
        '@type': 'Question',
        name: 'కుజ దోషం కేవలం లగ్నం నుండి చూస్తే సరిపోతుందా?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'సరిపోదు. ప్రామాణిక పరాశర శాస్త్రం ప్రకారం కుజ దోషాన్ని జన్మ లగ్నం, చంద్ర లగ్నం మరియు కళత్రకారక శుక్రుని నుండి త్రివిధంగా పరిశీలించాలి. ఉదాహరణకు లగ్నం నుండి కుజుడు శుభ స్థానంలో ఉన్నప్పటికీ, చంద్రుని నుండి 8వ ఇంట ఉంటే అది అష్టమ కుజ ప్రభావాన్ని చూపుతుంది.',
        },
      },
      {
        '@type': 'Question',
        name: 'నీచ గ్రహం ఉన్నప్పుడు రత్నధారణ చేయవచ్చా?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'గ్రహం నీచంలో లేదా అస్తంగతంలో ఉన్నప్పుడు పండితుని ప్రత్యక్ష సలహా లేకుండా రత్నం ధరించకూడదు. నీచభంగ రాజయోగం ఏర్పడినప్పుడు మాత్రమే శాస్త్రోక్త రత్నం శుభ ఫలితాన్నిస్తుంది. లేనిచో ప్రతికూల ప్రభావాలు ఎదురవుతాయి.',
        },
      },
      {
        '@type': 'Question',
        name: 'నా జనన వివరాల గోప్యత ఎలా రక్షించబడుతుంది?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'మా వెబ్‌సైట్ భారత డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం (DPDP Act 2023) కి అనుగుణంగా పనిచేస్తుంది. మీ వివరాలు ఎట్టి పరిస్థితుల్లోనూ మూడవ పక్షాలకు విక్రయించబడవు మరియు కుండలి గణన అనంతరం వినియోగదారుని అభ్యర్థన మేరకు సర్వర్ నుండి తొలగించబడతాయి.',
        },
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-amber-800/80 mb-4">
        <span>హోమ్</span>
        <ChevronRight size={12} />
        <span>నమూనా జాతక నివేదిక (Sample Jathakam)</span>
      </div>

      {/* Hero Header */}
      <div className="bg-radial from-amber-900 to-amber-950 text-amber-50 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-800/60 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
            <Sparkles size={13} />
            దృక్సిద్ధాంత ప్రామాణిక నమూనా జాతకం (Verified Sample Report)
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 tracking-tight leading-tight mb-3">
            బృహత్ పరాశర సంపూర్ణ జాతక నివేదిక నమూనా
          </h1>
          <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed mb-6">
            శ్రీనివాస రావు గారి నమూనా జనన వివరాలు (1994 ఆగస్టు 15, ఉదయం 09:30, హైదరాబాద్) తో రూపొందించబడిన సమగ్ర పత్రిక. కచ్చితమైన డిగ్రీలు, నీచభంగ రాజయోగం, త్రివిధ కుజ దోషం, వింశోత్తరి మహాదశలతో కూడిన పూర్తి నివేదికను ఇక్కడ వీక్షించండి లేదా PDF గా డౌన్‌లోడ్ చేసుకోండి.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-amber-950 font-bold hover:bg-amber-300 shadow-md transition-all cursor-pointer text-sm"
            >
              <Printer size={16} />
              🖨️ జాతకం PDF డౌన్‌లోడ్ / ప్రింట్ (A4 PDF Download)
            </button>
            {onNavigateToJathakam && (
              <button
                onClick={onNavigateToJathakam}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer text-sm"
              >
                మీ జాతకం ఉచితంగా చూసుకోండి
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-gray-500 hover:text-amber-800'
          }`}
        >
          <BookOpen size={16} />
          నివేదిక సంపూర్ణ సమీక్ష (Report Live Preview)
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'faq'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-gray-500 hover:text-amber-800'
          }`}
        >
          <Compass size={16} />
          జ్యోతిష సందేహాలు &amp; సమాధానాలు (FAQ Schema)
        </button>
      </div>

      {/* TAB CONTENT: PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Top Identity Card */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-amber-950 mb-3 flex items-center gap-2">
              <Compass className="text-amber-700" size={18} />
              నమూనా ప్రొఫైల్ వివరాలు (Profile Summary)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-xs text-amber-800/80 block">పేరు</span>
                <span className="font-extrabold text-amber-950">శ్రీనివాస రావు</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-xs text-amber-800/80 block">పుట్టిన తేదీ &amp; సమయం</span>
                <span className="font-bold text-gray-900">1994-08-15 (09:30 AM)</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-xs text-amber-800/80 block">జన్మ లగ్నం (D1)</span>
                <span className="font-bold text-red-900">కన్య (17° 33' 02")</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-xs text-amber-800/80 block">సూర్య రాశి (Sun Sign)</span>
                <span className="font-bold text-amber-900">కర్కాటకం (28° 19' 58")</span>
              </div>
            </div>
          </div>

          {/* 1-Page Executive Summary Preview */}
          <div className="bg-white border border-amber-300 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                <Award className="text-amber-600" size={20} />
                అధ్యాయం 1 · ఎగ్జిక్యూటివ్ సమ్మరీ (Executive Summary)
              </h3>
              <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                క్రియాశీల దశ: కేతువు - బుధుడు
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-bold text-emerald-900 mb-2">💎 ప్రధాన 5 దివ్య బలాలు (Strengths)</h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-950/90 list-disc list-inside">
                  {execSummary.top5StrengthsTe.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
                <h4 className="font-bold text-rose-900 mb-2">⚠️ జీవితంలో 3 ముఖ్య జాగ్రత్తలు (Cautions)</h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-rose-950/90 list-disc list-inside">
                  {execSummary.top3CautionsTe.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-xs sm:text-sm">
              <p>
                <strong>12 నెలల గోచార సూచన:</strong> {execSummary.next12MonthsOutlookTe}
              </p>
              <p className="mt-1.5">
                <strong>శుభ వివాహ యోగ కాలం:</strong> {marriageTiming.primaryRecommendationTe}
              </p>
            </div>
          </div>

          {/* Planetary Dignities Matrix Preview */}
          <div className="bg-white border border-amber-300 rounded-2xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-amber-950 mb-3 flex items-center gap-2">
              <Compass className="text-amber-600" size={20} />
              అధ్యాయం 2 · గ్రహ స్థానాలు, డిగ్రీలు &amp; బల పట్టిక (Planetary Dignities)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-amber-100/80 text-amber-950 text-left border-b border-amber-300">
                    <th className="p-2.5">గ్రహం</th>
                    <th className="p-2.5">రాశి (D1)</th>
                    <th className="p-2.5">డిగ్రీలు</th>
                    <th className="p-2.5">నక్షత్రం (పాదం)</th>
                    <th className="p-2.5">శాస్త్రోక్త స్థితి (Dignity)</th>
                    <th className="p-2.5">అస్తంగతం / వక్రం</th>
                    <th className="p-2.5 text-center">బలం</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {dignities.map((d) => (
                    <tr key={d.id} className="hover:bg-amber-50/40">
                      <td className="p-2.5 font-bold text-gray-900">{d.nameTe}</td>
                      <td className="p-2.5">{d.rashiTe}</td>
                      <td className="p-2.5">{d.degreeFormatted}</td>
                      <td className="p-2.5">{d.nakshatraTe} ({d.pada})</td>
                      <td className="p-2.5 font-semibold text-amber-900">{d.dignityTe}</td>
                      <td className="p-2.5">
                        {d.isCombust && (
                          <span className="px-2 py-0.5 rounded-sm bg-red-100 text-red-800 text-xs font-bold mr-1">
                            అస్తంగతం ({d.combustDegreeDiff}°)
                          </span>
                        )}
                        {d.isRetrograde && (
                          <span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-xs font-bold mr-1">
                            వక్రం
                          </span>
                        )}
                        {d.isVargottama && (
                          <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-xs font-bold">
                            వర్గోత్తమ
                          </span>
                        )}
                        {!d.isCombust && !d.isRetrograde && !d.isVargottama && '—'}
                      </td>
                      <td className="p-2.5 font-bold text-center text-amber-950">
                        {d.strengthScorePct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Neecha Bhanga & Triple Kuja Dosha */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Neecha Bhanga */}
            <div className="bg-white border border-amber-300 rounded-2xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-amber-950 mb-3 flex items-center gap-2">
                <Sparkles className="text-emerald-600" size={18} />
                నీచభంగ రాజయోగ విశ్లేషణ
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                {neechaBhanga.map((nb) => (
                  <div
                    key={nb.planetId}
                    className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40"
                  >
                    <div className="font-bold text-emerald-950 flex justify-between">
                      <span>{nb.planetTe} ({nb.debilitationRashiTe})</span>
                      <span className="text-emerald-700 font-extrabold">✓ రాజయోగం సిద్ధి</span>
                    </div>
                    <div className="text-xs text-emerald-800 font-semibold mt-1">
                      {nb.cancellationTypeTe}
                    </div>
                    <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                      {nb.explanationTe}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Triple Kuja Dosha */}
            <div className="bg-white border border-amber-300 rounded-2xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-amber-950 mb-3 flex items-center gap-2">
                <ShieldAlert className="text-amber-700" size={18} />
                త్రివిధ కుజ దోష పరిశీలన (Triple Kuja Check)
              </h3>
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between font-bold text-amber-950">
                  <span>ఫలితం:</span>
                  <span className="text-amber-800">{tripleKuja.summaryTitleTe}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white border border-amber-200">
                    <span className="text-gray-500 block">లగ్నం నుండి</span>
                    <span className="font-bold text-emerald-700">10వ ఇల్లు (శుభం)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-rose-200">
                    <span className="text-gray-500 block">చంద్రుని నుండి</span>
                    <span className="font-bold text-rose-700">8వ ఇల్లు (అష్టమ కుజుడు)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-amber-200">
                    <span className="text-gray-500 block">శుక్రుని నుండి</span>
                    <span className="font-bold text-emerald-700">10వ ఇల్లు (శుభం)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed pt-1">
                  చంద్రుని నుండి కుజుడు 8వ ఇంట (మిథునం) ఉన్నందున దాంపత్యంలో పరస్పర అవగాహన ముఖ్యం. గురు దృష్టి వల్ల దోష తీవ్రత గణనీయంగా తగ్గింది.
                </p>
              </div>
            </div>
          </div>

          {/* Gemstone Safety Warning Banner */}
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-xs">
            <h4 className="text-sm sm:text-base font-bold text-red-950 flex items-center gap-2 mb-2">
              <ShieldAlert className="text-red-600" size={18} />
              రత్నధారణ అత్యంత ముఖ్యమైన భద్రతా హెచ్చరిక (Gemstone Safety Advice)
            </h4>
            <p className="text-xs sm:text-sm text-red-900 leading-relaxed">
              రత్నధారణకు ముందు తప్పనిసరిగా పండితుని ప్రత్యక్ష సలహా తీసుకోండి! ముఖ్యంగా ఒక గ్రహం అస్తంగతం (Combust) లేదా నీచ స్థితిలో ఉన్నప్పుడు అపరిశీలనగా రత్నం ధరించడం వల్ల వ్యతిరేక ఫలితాలు ఎదురవుతాయి. మీ జాతకంలో గ్రహ బలాలు సమగ్రంగా లెక్కించబడిన తర్వాతే రత్నం ధరించాలి.
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-white border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-extrabold text-amber-950 mb-4 flex items-center gap-2">
            <FileText className="text-amber-700" size={22} />
            తెలుగు జాతక నివేదిక — తరచూ అడిగే ప్రశ్నలు (FAQ)
          </h2>

          {faqSchema.mainEntity.map((item, idx) => (
            <div
              key={idx}
              className="border border-amber-100 rounded-xl p-4 bg-amber-50/30"
            >
              <h3 className="text-base font-bold text-amber-950 mb-2">
                {idx + 1}. {item.name}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {item.acceptedAnswer.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
