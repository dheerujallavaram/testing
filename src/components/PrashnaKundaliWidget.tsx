import React, { useMemo, useState } from 'react';
import { Compass, Sparkles, Clock, MessageCircle, Shuffle, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  PRASHNA_TOPICS,
  PrashnaTopicId,
  computeInstantPrashna,
} from '../utils/kpAndPrashnaEngine';

interface PrashnaKundaliWidgetProps {
  onOpenBooking?: (serviceName?: string) => void;
}

export const PrashnaKundaliWidget: React.FC<PrashnaKundaliWidgetProps> = ({ onOpenBooking }) => {
  const { t, language } = useLanguage();
  const [horaryNumber, setHoraryNumber] = useState<number>(108);
  const [inputValue, setInputValue] = useState<string>('108');
  const [selectedTopic, setSelectedTopic] = useState<PrashnaTopicId>('career');
  const [calcSeed, setCalcSeed] = useState<number>(0);

  const result = useMemo(
    () => computeInstantPrashna(horaryNumber, selectedTopic),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [horaryNumber, selectedTopic, calcSeed]
  );

  const handleNumberChange = (val: string) => {
    setInputValue(val);
    const parsed = parseInt(val, 10);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.max(1, Math.min(249, parsed));
      setHoraryNumber(clamped);
    }
  };

  const handleIntuitivePick = () => {
    const picked = Math.floor(Math.random() * 249) + 1;
    setHoraryNumber(picked);
    setInputValue(String(picked));
    setCalcSeed((s) => s + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(inputValue, 10);
    const clamped = Number.isNaN(parsed) ? 108 : Math.max(1, Math.min(249, parsed));
    setHoraryNumber(clamped);
    setInputValue(String(clamped));
    setCalcSeed((s) => s + 1);
  };

  const whatsappPrashnaUrl = `https://wa.me/918977986166?text=${encodeURIComponent(
    `నమస్కారం బ్రహ్మశ్రీ ధీరజ్ శర్మ గారు, తక్షణ KP ప్రశ్న కుండలి ఫలితం:\nప్రశ్న సంఖ్య: ${result.horaryNumber} (${result.prashnaLagnaTe})\nఅంశం: ${result.topic.labelTe}\nసబ్‌లార్డ్: ${result.lagnaSubLordTe} | చంద్ర స్థితి: ${result.moonRashiTe} (${result.moonHouseFromPrashna}వ భావం)\nదీనిపై లోతైన వ్యక్తిగత ప్రశ్న పరిశీలన కోసం సంప్రదిస్తున్నాను.`
  )}`;

  const isGood = result.verdictLevel === 'auspicious';
  const isRemedy = result.verdictLevel === 'remedy';

  return (
    <section
      id="prashna-kundali-tool"
      className="bg-white rounded-3xl border-2 border-amber-300 shadow-lg p-5 sm:p-8 space-y-6 font-telugu scroll-mt-24 no-print"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-5">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-900">
            <Compass size={14} className="text-amber-700" />
            <span>
              {t(
                'KP హోరరీ ప్రశ్న శాస్త్రం · 1 నుండి 249 సబ్‌లార్డ్ గణితం',
                'KP Horary Prashna Shastra · 1–249 Sub-Lord Engine'
              )}
            </span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 leading-tight">
            {t(
              'తక్షణ ప్రశ్న కుండలి (పుట్టిన వివరాలు లేకున్నా సమాధానం)',
              'Instant Horary Prashna Kundali (Live Question Predictor)'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {t(
              'జన్మ సమయం లేనివారు లేదా ఏదైనా తక్షణ పని (ఉద్యోగం, వివాహం, వీసా, ఆస్తి) పై మనస్సులో సంకల్పించి 1 నుండి 249 మధ్య ఒక సంఖ్యను ఎంచుకోండి. ప్రస్తుత నిరయన గ్రహ స్థితితో KP సబ్‌లార్డ్ ఫలితం తక్షణమే లెక్కించబడుతుంది.',
              'Pick an intuitive number between 1 and 249 while focusing sincerely on your question. Evaluated dynamically against live sidereal planetary transits and KP Sub-Lord rules.'
            )}
          </p>
        </div>
        <div className="text-right shrink-0 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 self-start lg:self-auto">
          <span className="text-[11px] font-bold text-amber-800 block">
            {t('ప్రస్తుత ప్రశ్న సమయం (IST)', 'Live Sidereal Moment (IST)')}
          </span>
          <strong className="text-sm font-mono font-extrabold text-amber-950">
            {result.timestampDisplay}
          </strong>
        </div>
      </div>

      {/* Input Controls */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
        <div className="lg:col-span-5">
          <label htmlFor="prashna-topic" className="block text-xs font-extrabold text-amber-950 mb-1.5">
            {t('1. మీ ప్రశ్న అంశాన్ని ఎంచుకోండి:', '1. Choose Question Focus:')}
          </label>
          <select
            id="prashna-topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value as PrashnaTopicId)}
            className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-600 focus:outline-none cursor-pointer"
          >
            {PRASHNA_TOPICS.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {language === 'en' ? topic.labelEn : topic.labelTe}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-4">
          <label htmlFor="prashna-number" className="block text-xs font-extrabold text-amber-950 mb-1.5">
            {t('2. దైవ సంకల్ప సంఖ్య (1 నుండి 249):', '2. Horary Number (1 to 249):')}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="prashna-number"
              type="number"
              min={1}
              max={249}
              value={inputValue}
              onChange={(e) => handleNumberChange(e.target.value)}
              className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-mono font-extrabold text-amber-950 focus:border-amber-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleIntuitivePick}
              title={t('దైవ సంకల్ప సంఖ్య ఎంపిక', 'Pick Intuitive Number')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <Shuffle size={14} />
              <span>{t('మనఃసంకల్పం', 'Intuitive')}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3c1104] hover:bg-[#521807] text-amber-100 font-extrabold text-sm shadow-sm whitespace-nowrap cursor-pointer transition-colors"
          >
            <Sparkles size={16} className="text-amber-300 shrink-0" />
            <span>{t('ప్రశ్న ఫలితం చూడండి', 'Reveal Prashna Verdict')}</span>
          </button>
        </div>
      </form>

      {/* Result Card */}
      <div
        className={`rounded-2xl border-2 p-5 sm:p-6 space-y-4 ${
          isGood
            ? 'bg-emerald-50/70 border-emerald-300'
            : isRemedy
            ? 'bg-rose-50/60 border-rose-300'
            : 'bg-amber-50/70 border-amber-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-3.5">
          <div className="flex items-center gap-2.5">
            {isGood ? (
              <CheckCircle2 size={22} className="text-emerald-700 shrink-0" />
            ) : isRemedy ? (
              <ShieldAlert size={22} className="text-rose-700 shrink-0" />
            ) : (
              <AlertTriangle size={22} className="text-amber-700 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold text-slate-600 block">
                {t(`ప్రశ్న #${result.horaryNumber} · అంశం: ${result.topic.labelTe}`, `Horary #${result.horaryNumber} · Focus: ${result.topic.labelEn}`)}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-amber-950">
                {t(result.verdictBadgeTe, result.verdictBadgeEn)}
              </h3>
            </div>
          </div>

          <div className="bg-white/95 border border-amber-300 rounded-xl px-4 py-2 text-center shrink-0">
            <span className="text-[10.5px] font-bold text-slate-600 block">
              {t('ప్రశ్న విజయ బలం', 'Prashna Strength')}
            </span>
            <strong className="text-lg font-mono font-extrabold text-amber-950">{result.score}%</strong>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/90 rounded-xl p-3 border border-amber-200">
            <span className="text-[11px] font-bold text-slate-500 block">
              {t('ప్రశ్న లగ్నం (#249)', 'Prashna Lagna')}
            </span>
            <strong className="text-sm font-extrabold text-amber-950 block mt-0.5">
              {language === 'en' ? result.prashnaLagnaEn : result.prashnaLagnaTe}{' '}
              <span className="font-mono text-xs text-slate-600">{result.lagnaDms}</span>
            </strong>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-amber-200">
            <span className="text-[11px] font-bold text-slate-500 block">
              {t('లగ్న స్టార్ & సబ్‌లార్డ్', 'Star & Sub Lord')}
            </span>
            <strong className="text-sm font-extrabold text-emerald-900 block mt-0.5">
              {language === 'en'
                ? `${result.lagnaSubLordEn} (Sub)`
                : `${result.lagnaStarLordTe} · ${result.lagnaSubLordTe} (Sub)`}
            </strong>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-amber-200">
            <span className="text-[11px] font-bold text-slate-500 block">
              {t('ప్రస్తుత గోచార చంద్రుడు', 'Live Transit Moon')}
            </span>
            <strong className="text-sm font-extrabold text-amber-950 block mt-0.5">
              {language === 'en'
                ? `${result.moonRashiEn} (${result.moonNakshatraEn})`
                : `${result.moonRashiTe} · ${result.moonNakshatraTe}`}
            </strong>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-amber-200">
            <span className="text-[11px] font-bold text-slate-500 block">
              {t('భావ స్థితి (చంద్ర / సబ్ / కారక)', 'House Link (Moon/Sub/Karaka)')}
            </span>
            <strong className="text-sm font-mono font-extrabold text-amber-950 block mt-0.5">
              H{result.moonHouseFromPrashna} · H{result.subLordHouseFromPrashna} · H{result.karakaHouseFromPrashna}
            </strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white/95 border border-amber-200 rounded-xl p-4">
          {t(result.summaryTe, result.summaryEn)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-white/90 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <Clock size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 block">{t('ఫలించే కాల అంచనా:', 'Indicative Timing Window:')}</strong>
              <span className="text-slate-700">{t(result.timingTe, result.timingEn)}</span>
            </div>
          </div>

          <div className="bg-white/90 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <Sparkles size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 block">{t('ప్రశ్న శాంతి పరిహారం:', 'Recommended Prashna Remedy:')}</strong>
              <span className="text-slate-700">{t(result.remedyTe, result.remedyEn)}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-600">
            {t(
              'గమనిక: క్లిష్టమైన కోర్టు, వివాహ & వృత్తి నిర్ణయాలకు జన్మ కుండలితో పాటు గురుముఖతః ప్రశ్న పరిశీలన శ్రేష్ఠం.',
              'For major life decisions, combine Horary Prashna with full Janma Kundali scrutiny.'
            )}
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={whatsappPrashnaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-colors"
            >
              <MessageCircle size={14} />
              <span>{t('గురువుగారితో ప్రశ్న సంప్రదింపు', 'Consult Guruji on WhatsApp')}</span>
            </a>
            {onOpenBooking && (
              <button
                type="button"
                onClick={() => onOpenBooking(`KP ప్రశ్న కుండలి పరిశీలన (#${result.horaryNumber} - ${result.topic.labelTe})`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                <span>{t('వ్యక్తిగత ప్రశ్న & పరిహార బుకింగ్', 'Book Prashna Consultation')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
