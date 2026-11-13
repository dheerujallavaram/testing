import React from 'react';
import { CalendarRange, Compass, ShieldAlert, Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import { DeepVedicPredictionsBundle } from '../utils/deepVedicPredictionsEngine';
import { useLanguage } from '../context/LanguageContext';

interface DeepVedicPredictionsChaptersProps {
  nativeName: string;
  deepPredictions: DeepVedicPredictionsBundle;
}

export const DeepVedicPredictionsChapters: React.FC<DeepVedicPredictionsChaptersProps> = ({
  nativeName,
  deepPredictions,
}) => {
  const { language, t } = useLanguage();
  const {
    charaDashaList,
    activeCharaDasha,
    shadbalaRows,
    strongestShadbalaPlanetTe,
    fiveYearTransits,
    sadeSati,
    practicalVerdicts,
    d60Deity,
  } = deepPredictions;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* =====================================================================
          CHAPTER 30: JAIMINI CHARA DASHA + SHADBALA 6-FOLD STRENGTH
          ===================================================================== */}
      <div
        id="chapter-30"
        className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 scroll-mt-24 print-page-break page print-page-sheet"
      >
        <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-300 space-y-1">
          <div className="text-xs font-bold text-amber-900">
            {t(
              'అధ్యాయం 30 · జైమిని చర దశ & షడ్బల విశ్లేషణ (6-Fold Planetary Strength)',
              'Chapter 30 · Jaimini Chara Dasha & Shadbala 6-Fold Strength'
            )}
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold text-amber-950">
            {t(
              `${nativeName} గారి జైమిని రాశి దశలు మరియు గ్రహ షడ్బల పట్టిక`,
              `${nativeName}'s Jaimini Chara Dasha & Shadbala Rupas Breakdown`
            )}
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            {t(
              `వింశోత్తరితో పాటు మహర్షి జైమిని ఉపదేశ సూత్రాల (జైమిని చర దశ) ద్వారా ప్రస్తుత ప్రధాన దశ: "${activeCharaDasha.rashiTe}" (${activeCharaDasha.startYear}–${activeCharaDasha.endYear}). షడ్బలంలో అత్యంత శక్తివంతమైన గ్రహం: ${strongestShadbalaPlanetTe}.`,
              `Alongside Vimshottari, Maharshi Jaimini Upadesha Sutras (Chara Dasha) currently run "${activeCharaDasha.rashiEn}" (${activeCharaDasha.startYear}–${activeCharaDasha.endYear}).`
            )}
          </p>
        </div>

        {/* Active Chara Dasha Spotlight */}
        <div className="p-3.5 rounded-2xl bg-[#fffdf7] border border-amber-300 space-y-1.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
              <Compass size={15} className="text-amber-700" />
              <span>
                {t(
                  `ప్రస్తుత చర దశ: ${activeCharaDasha.rashiTe} (${activeCharaDasha.startYear}–${activeCharaDasha.endYear})`,
                  `Active Chara Dasha: ${activeCharaDasha.rashiEn} (${activeCharaDasha.startYear}–${activeCharaDasha.endYear})`
                )}
              </span>
            </strong>
            <span className="font-bold text-emerald-800">
              {t(activeCharaDasha.karakaHighlightTe, activeCharaDasha.karakaHighlightEn)}
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {t(activeCharaDasha.predictionTe, activeCharaDasha.predictionEn)}
          </p>
        </div>

        {/* 12-Sign Chara Dasha Sequence Table */}
        <div className="overflow-x-auto border border-amber-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-50 text-amber-950 border-b border-amber-200">
                <th className="py-2 px-3 font-extrabold">{t('దశ రాశి', 'Sign Dasha')}</th>
                <th className="py-2 px-2.5 font-extrabold">{t('కాలం (సం॥)', 'Years')}</th>
                <th className="py-2 px-2.5 font-extrabold">{t('వ్యవధి', 'Period')}</th>
                <th className="py-2 px-3 font-extrabold">{t('ప్రధాన కారకత్వం & ఫలితం', 'Key Karaka & Prediction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {charaDashaList.map((cd, idx) => (
                <tr
                  key={idx}
                  className={cd.isCurrent ? 'bg-amber-100/65 font-semibold' : 'odd:bg-white even:bg-amber-50/20'}
                >
                  <td className="py-2 px-3 font-extrabold text-amber-950 whitespace-nowrap">
                    {language === 'en' ? cd.rashiEn : cd.rashiTe}
                    {cd.isCurrent ? (
                      <span className="ml-1.5 text-[10px] font-extrabold text-emerald-800">
                        · {t('ప్రస్తుతం', 'Active')}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 px-2.5 font-mono tabular-nums font-bold text-slate-800">
                    {cd.years} {t('సం॥', 'yrs')}
                  </td>
                  <td className="py-2 px-2.5 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {cd.startYear}–{cd.endYear}
                  </td>
                  <td className="py-2 px-3 text-slate-700">
                    <span className="font-bold text-amber-900">
                      {t(cd.karakaHighlightTe, cd.karakaHighlightEn)}
                    </span>
                    {' — '}
                    {t(cd.predictionTe, cd.predictionEn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shadbala 6-Fold Strength Table */}
        <div className="space-y-2 pt-2">
          <h5 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
            <BarChart2 size={16} className="text-amber-700" />
            <span>
              {t(
                'సప్తగ్రహ షడ్బల ప్రమాణ పట్టిక (Shadbala Rupas vs Parashara Minimum)',
                '7-Planet Shadbala Strength Table (Rupas vs Minimum Required)'
              )}
            </span>
          </h5>
          <div className="overflow-x-auto border border-amber-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-amber-50 text-amber-950 border-b border-amber-200">
                  <th className="py-2 px-3 font-extrabold">{t('గ్రహం', 'Planet')}</th>
                  <th className="py-2 px-2.5 font-extrabold">{t('పొందిన బలం (Rupas)', 'Actual Rupas')}</th>
                  <th className="py-2 px-2.5 font-extrabold">{t('కనీస అవసరం', 'Required')}</th>
                  <th className="py-2 px-2.5 font-extrabold">{t('బల శాతం', 'Strength %')}</th>
                  <th className="py-2 px-3 font-extrabold">{t('ప్రధాన బలాధారం & స్థితి', 'Peak Factor & Verdict')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 font-mono tabular-nums">
                {shadbalaRows.map((row) => (
                  <tr key={row.id} className="odd:bg-white even:bg-amber-50/20">
                    <td className="py-2 px-3 font-sans font-extrabold text-amber-950">
                      {language === 'en' ? row.nameEn.split(' ')[0] : row.nameTe}
                    </td>
                    <td className="py-2 px-2.5 font-bold text-slate-900">{row.totalRupas.toFixed(2)}</td>
                    <td className="py-2 px-2.5 text-slate-600">{row.requiredRupas.toFixed(2)}</td>
                    <td className="py-2 px-2.5">
                      <span className={row.isStrong ? 'font-extrabold text-emerald-800' : 'font-bold text-amber-800'}>
                        {row.ratioPercent}%
                      </span>
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-700">
                      <strong>{t(row.statusTe, row.statusEn)}</strong> · {t(row.strongestFactorTe, row.strongestFactorEn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CHAPTER 31: 2026–2030 5-YEAR TRANSIT FORECAST & SADE SATI TRACKER
          ===================================================================== */}
      <div
        id="chapter-31"
        className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 scroll-mt-24 print-page-break page print-page-sheet"
      >
        <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-300 space-y-1">
          <div className="text-xs font-bold text-amber-900">
            {t(
              'అధ్యాయం 31 · 2026–2030 ఐదేళ్ల శని-గురు గోచార ఫలితాలు & ఏలినాటి శని స్థితి',
              'Chapter 31 · 5-Year Saturn & Jupiter Transit Forecast (2026–2030) & Sade Sati'
            )}
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold text-amber-950">
            {t(
              'రాబోయే 5 సంవత్సరాల భవిష్యత్ ప్రణాళిక & గోచార మార్గదర్శి',
              '5-Year Annual Transit Forecast & Sade Sati Tracker'
            )}
          </h4>
        </div>

        {/* Sade Sati / Ashtama Shani Highlight Box */}
        <div
          className={`rounded-2xl p-4 border text-xs space-y-1.5 ${
            sadeSati.isActiveNow
              ? 'bg-amber-50/80 border-amber-400 text-amber-950'
              : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="text-sm font-extrabold flex items-center gap-1.5">
              <ShieldAlert size={16} />
              <span>{t(sadeSati.phaseTe, sadeSati.phaseEn)}</span>
            </strong>
            <span className="font-bold">
              {t(sadeSati.nextCycleHintTe, sadeSati.nextCycleHintEn)}
            </span>
          </div>
          <p className="leading-relaxed text-slate-800">
            {t(sadeSati.guidanceTe, sadeSati.guidanceEn)}
          </p>
        </div>

        {/* 5-Year Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {fiveYearTransits.map((fy) => (
            <div
              key={fy.year}
              className="border border-amber-200 bg-[#fffdf8] rounded-2xl p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <span className="font-mono tabular-nums text-base font-extrabold text-amber-950 flex items-center gap-1.5">
                  <CalendarRange size={15} className="text-amber-700" />
                  <span>{fy.year}</span>
                </span>
                <span
                  className={`font-bold ${
                    fy.overallScore >= 80
                      ? 'text-emerald-800'
                      : fy.overallScore >= 68
                      ? 'text-amber-900'
                      : 'text-rose-800'
                  }`}
                >
                  {t(fy.verdictBadgeTe, fy.verdictBadgeEn)} · {fy.overallScore}%
                </span>
              </div>

              <div className="text-[11px] font-bold text-slate-600">
                {t(
                  `గురుడు: ${fy.guruSignTe} (${fy.guruHouseFromMoon}వ ఇల్లు) · శని: ${fy.shaniSignTe} (${fy.shaniHouseFromMoon}వ ఇల్లు)`,
                  `Jupiter H${fy.guruHouseFromMoon} · Saturn H${fy.shaniHouseFromMoon} from Moon`
                )}
              </div>

              <p className="text-slate-800 leading-relaxed">
                <strong>{t('వృత్తి & ధనం:', 'Career & Wealth:')}</strong>{' '}
                {t(fy.careerWealthTe, fy.careerWealthEn)}
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>{t('కుటుంబం & ఆరోగ్యం:', 'Family & Health:')}</strong>{' '}
                {t(fy.familyHealthTe, fy.familyHealthEn)}
              </p>
              <p className="text-amber-900 font-semibold pt-1 border-t border-amber-100">
                {t('పరిహారం:', 'Remedy:')} {t(fy.remedyTipTe, fy.remedyTipEn)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          CHAPTER 32: 6 PRACTICAL LIFE VERDICTS & D60 PAST-LIFE KARMA DEITY
          ===================================================================== */}
      <div
        id="chapter-32"
        className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 scroll-mt-24 print-page-break page print-page-sheet"
      >
        <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-300 space-y-1">
          <div className="text-xs font-bold text-amber-900">
            {t(
              'అధ్యాయం 32 · జీవిత ప్రధాన నిర్ణయాలు (D1+D4+D7+D10+D60 షష్ట్యంశ కర్మ ఫలితాలు)',
              'Chapter 32 · 6 Life Verdicts (Govt Job, Foreign PR, Home, Equities & D60 Karma)'
            )}
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold text-amber-950">
            {t(
              'ప్రభుత్వ ఉద్యోగం, విదేశీ యానం, సొంత ఇల్లు, పెట్టుబడులు & D60 పూర్వజన్మ దేవతా తీర్పు',
              'Career Path, Overseas PR, Real Estate, Wealth & D60 Past-Life Deity Verdict'
            )}
          </h4>
        </div>

        {/* D60 Deity Banner */}
        <div className="rounded-2xl border border-amber-300 bg-[#fffdf7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-amber-800 block">
              {t(
                `లగ్న D60 షష్ట్యంశ భాగం #${d60Deity.index}/60 · ${d60Deity.natureTe}`,
                `Lagna D60 Part #${d60Deity.index}/60 · ${d60Deity.natureEn}`
              )}
            </span>
            <h5 className="text-base font-extrabold text-amber-950 flex items-center gap-1.5">
              <Sparkles size={15} className="text-amber-700" />
              <span>
                {t(`షష్ట్యంశ దేవత: ${d60Deity.nameTe} (${d60Deity.nameEn})`, `Shashtiamsa Deity: ${d60Deity.nameEn}`)}
              </span>
            </h5>
            <p className="text-slate-700 leading-relaxed">
              {t(d60Deity.karmicMessageTe, d60Deity.karmicMessageEn)}
            </p>
          </div>
        </div>

        {/* 6 Verdict Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {practicalVerdicts.map((pv) => (
            <div
              key={pv.topicKey}
              className="border border-amber-200 rounded-2xl p-4 bg-[#fffdf9] space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2 border-b border-amber-200/80 pb-2">
                <h5 className="font-extrabold text-amber-950 text-sm leading-snug">
                  {t(pv.titleTe, pv.titleEn)}
                </h5>
                <span className="font-mono tabular-nums font-extrabold text-emerald-800 shrink-0">
                  {pv.scorePercent}%
                </span>
              </div>

              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-amber-700 shrink-0" />
                <span>{t(pv.ratingLabelTe, pv.ratingLabelEn)}</span>
              </div>

              <div className="text-[11px] text-slate-600 font-medium">
                {t(pv.astrologicalBasisTe, pv.astrologicalBasisEn)}
              </div>

              <p className="text-slate-800 leading-relaxed">
                {t(pv.verdictTe, pv.verdictEn)}
              </p>

              <div className="pt-1 border-t border-amber-100 text-[11px] font-bold text-emerald-900">
                {t('అనుకూల కాలం:', 'Peak Timing:')} {t(pv.bestWindowTe, pv.bestWindowEn)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
