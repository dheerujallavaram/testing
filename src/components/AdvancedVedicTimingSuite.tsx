import React, { useMemo, useState } from 'react';
import { CalendarClock, Layers, Sparkles, Sun, Compass } from 'lucide-react';
import { KundaliPlanetDetail } from '../utils/astronomyPanchangam';
import { useLanguage } from '../context/LanguageContext';
import {
  computeAshtottariAndYoginiDashas,
  computePratyantardashaAndDoubleTransit,
  computeTajikaVarshaphal,
} from '../utils/expandedAstrologyCalculators';
import {
  buildVargaChartSnapshot,
  ChartStyleType,
  computeAll12ArudhaPadas,
  computeSpecialLagnasAndGulika,
  RASHI_NAMES_SHORT_EN,
  RASHI_NAMES_SHORT_TE,
  VargaCode,
} from '../utils/jhoraChartsEngine';

interface AdvancedVedicTimingSuiteProps {
  nativeName: string;
  birthDate: string;
  birthTime: string;
  planets: KundaliPlanetDetail[];
  balanceFraction: number;
  selectedChartStyle: ChartStyleType;
}

const SOUTH_CELLS: { signIdx: number; row: number; col: number }[] = [
  { signIdx: 11, row: 1, col: 1 },
  { signIdx: 0, row: 1, col: 2 },
  { signIdx: 1, row: 1, col: 3 },
  { signIdx: 2, row: 1, col: 4 },
  { signIdx: 3, row: 2, col: 4 },
  { signIdx: 4, row: 3, col: 4 },
  { signIdx: 5, row: 4, col: 4 },
  { signIdx: 6, row: 4, col: 3 },
  { signIdx: 7, row: 4, col: 2 },
  { signIdx: 8, row: 4, col: 1 },
  { signIdx: 9, row: 3, col: 1 },
  { signIdx: 10, row: 2, col: 1 },
];

const NORTH_HOUSES_PRINT: { house: number; pts: string; signPos: [number, number]; textCenter: [number, number] }[] = [
  { house: 1, pts: '100,100 200,0 300,100 200,200', signPos: [200, 178], textCenter: [200, 90] },
  { house: 2, pts: '0,0 200,0 100,100', signPos: [100, 82], textCenter: [100, 38] },
  { house: 3, pts: '0,0 100,100 0,200', signPos: [82, 102], textCenter: [38, 102] },
  { house: 4, pts: '0,200 100,100 200,200 100,300', signPos: [176, 204], textCenter: [95, 198] },
  { house: 5, pts: '0,200 100,300 0,400', signPos: [82, 304], textCenter: [38, 304] },
  { house: 6, pts: '0,400 100,300 200,400', signPos: [100, 326], textCenter: [100, 368] },
  { house: 7, pts: '200,200 300,300 200,400 100,300', signPos: [200, 228], textCenter: [200, 314] },
  { house: 8, pts: '200,400 300,300 400,400', signPos: [300, 326], textCenter: [300, 368] },
  { house: 9, pts: '400,200 400,400 300,300', signPos: [318, 304], textCenter: [360, 304] },
  { house: 10, pts: '200,200 300,100 400,200 300,300', signPos: [224, 204], textCenter: [305, 198] },
  { house: 11, pts: '400,0 400,200 300,100', signPos: [318, 102], textCenter: [360, 102] },
  { house: 12, pts: '200,0 400,0 300,100', signPos: [300, 82], textCenter: [300, 38] },
];

export const AdvancedVedicTimingSuite: React.FC<AdvancedVedicTimingSuiteProps> = ({
  nativeName,
  birthDate,
  birthTime,
  planets,
  balanceFraction,
  selectedChartStyle,
}) => {
  const { language, t } = useLanguage();
  const lagnaIdx = planets[0]?.rashiIdx ?? 0;
  const moonPlanet = planets.find((p) => p.id === 'moon') || planets[2];
  const moonLon = moonPlanet?.longitude ?? 220;
  const moonNakIdx = moonPlanet?.nakshatraIdx ?? 0;

  // 1. Pratyantardasha & Double Transit
  const pratyBundle = useMemo(
    () => computePratyantardashaAndDoubleTransit(moonLon, birthDate, birthTime, lagnaIdx),
    [moonLon, birthDate, birthTime, lagnaIdx]
  );

  const [selectedMahaIdx, setSelectedMahaIdx] = useState<number>(() =>
    Math.max(0, pratyBundle.mahadashas.findIndex((m) => m.isCurrent))
  );
  const [selectedAntarIdx, setSelectedAntarIdx] = useState<number>(() => {
    const m = pratyBundle.currentMahadasha;
    return Math.max(0, m.antardashas.findIndex((a) => a.isCurrent));
  });

  const activeMaha = pratyBundle.mahadashas[selectedMahaIdx] || pratyBundle.currentMahadasha;
  const activeAntar = activeMaha.antardashas[selectedAntarIdx] || activeMaha.antardashas[0];

  // 2. Tajika Varshaphal (Default current year 2026)
  const [varshaYear, setVarshaYear] = useState<number>(new Date().getFullYear());
  const varshaphal = useMemo(
    () => computeTajikaVarshaphal(planets, lagnaIdx, birthDate, varshaYear),
    [planets, lagnaIdx, birthDate, varshaYear]
  );

  // 3. Ashtottari & Yogini Dashas
  const multiDashas = useMemo(
    () => computeAshtottariAndYoginiDashas(moonNakIdx, balanceFraction, birthDate),
    [moonNakIdx, balanceFraction, birthDate]
  );
  const [altDashaTab, setAltDashaTab] = useState<'ashtottari' | 'yogini'>('ashtottari');

  // 4. Divisional Charts Print Snapshots (D10 Dasamsha & Bhava Chalit in user's chosen chartStyle!)
  const printSnapshots = useMemo(() => {
    const arudhas = computeAll12ArudhaPadas(planets, lagnaIdx);
    const specials = computeSpecialLagnasAndGulika(planets, birthTime);
    const codes: VargaCode[] = ['D10', 'BHAVA'];
    return codes.map((c) => buildVargaChartSnapshot(planets, c, arudhas, specials));
  }, [planets, lagnaIdx, birthTime]);

  const renderCompactPrintableVarga = (snap: ReturnType<typeof buildVargaChartSnapshot>) => {
    if (selectedChartStyle === 'north') {
      return (
        <svg viewBox="0 0 400 400" className="w-full max-w-[300px] mx-auto bg-white border border-amber-600 rounded-lg">
          <rect x="0" y="0" width="400" height="400" fill="#fffdf8" stroke="#9a3412" strokeWidth="2" />
          <line x1="0" y1="0" x2="400" y2="400" stroke="#b45309" strokeWidth="1.2" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="#b45309" strokeWidth="1.2" />
          <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#b45309" strokeWidth="1.4" />
          {NORTH_HOUSES_PRINT.map((hg) => {
            const signIdx = (snap.lagnaSignIdx + hg.house - 1) % 12;
            const list = snap.signPlanets[signIdx] || [];
            const txt = [
              ...(hg.house === 1 ? [language === 'en' ? 'Asc' : 'లగ్నం'] : []),
              ...list.map((p) => (language === 'en' ? p.shortEn : p.shortTe)),
            ];
            return (
              <g key={hg.house}>
                <text x={hg.signPos[0]} y={hg.signPos[1]} textAnchor="middle" fontSize="11" className="fill-amber-900 font-mono font-bold">
                  {signIdx + 1}
                </text>
                <text x={hg.textCenter[0]} y={hg.textCenter[1]} textAnchor="middle" fontSize="11" className="fill-slate-900 font-bold">
                  {txt.slice(0, 3).join(' ')}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    // South / Default clean print grid
    return (
      <div className="w-full max-w-[320px] min-h-[240px] mx-auto grid grid-cols-4 grid-rows-4 border-2 border-amber-700/80 rounded-lg overflow-hidden bg-white">
        {SOUTH_CELLS.map((cell) => {
          const isLagna = cell.signIdx === snap.lagnaSignIdx;
          const houseNum = ((cell.signIdx - snap.lagnaSignIdx + 12) % 12) + 1;
          const list = snap.signPlanets[cell.signIdx] || [];
          return (
            <div
              key={cell.signIdx}
              style={{ gridRow: cell.row, gridColumn: cell.col }}
              className={`border border-amber-300 p-1.5 flex flex-col justify-between text-[10px] ${
                isLagna ? 'bg-amber-50' : 'bg-white'
              }`}
            >
              <div className="flex justify-between text-[9px] font-bold text-amber-900">
                <span>{language === 'en' ? RASHI_NAMES_SHORT_EN[cell.signIdx] : RASHI_NAMES_SHORT_TE[cell.signIdx]}</span>
                <span className="font-mono text-slate-500">{houseNum}</span>
              </div>
              <div className="font-bold text-slate-900 leading-tight">
                {isLagna && <span className="text-red-800 mr-1">{language === 'en' ? 'Asc' : 'లగ్న'}</span>}
                {list.map((p) => (language === 'en' ? p.shortEn : p.shortTe)).join(' ')}
              </div>
            </div>
          );
        })}
        <div
          style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
          className="border border-amber-300 bg-amber-50/40 flex flex-col items-center justify-center text-center p-2"
        >
          <strong className="text-xs text-amber-950">{language === 'en' ? snap.meta.titleEn : snap.meta.titleTe}</strong>
          <span className="text-[9.5px] text-slate-600 mt-0.5">{language === 'en' ? snap.meta.domainEn : snap.meta.domainTe}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* =====================================================================
          CHAPTER 33: 3-LEVEL PRATYANTARDASHA + GURU-SHANI DOUBLE TRANSIT DATES
          ===================================================================== */}
      <div
        id="chapter-33"
        className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 scroll-mt-24 print-page-break page print-page-sheet"
      >
        <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-300 space-y-1">
          <div className="text-xs font-bold text-amber-900">
            {t(
              'అధ్యాయం 33 · త్రి-స్థాయి వింశోత్తరి ప్రత్యంతర దశ & గురు–శని డబుల్ ట్రాన్సిట్ తేదీలు',
              'Chapter 33 · Mahadasha-Antardasha-Pratyantardasha & Guru-Shani Double Transit'
            )}
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold text-amber-950">
            {t(
              `${nativeName} గారి ప్రత్యంతర దశలు & శుభ సంఘటనల ఖచ్చితమైన తేదీలు`,
              `${nativeName}'s Sub-Sub Periods (Pratyantardasha) & Event Date Windows`
            )}
          </h4>
          <p className="text-xs text-slate-700 font-mono tabular-nums">
            {t(
              `ప్రస్తుత సజీవ దశ: ${pratyBundle.currentMahadasha.lordTe} మహాదశ → ${pratyBundle.currentAntardasha.lordTe} అంతర్దశ → ${pratyBundle.currentPratyantardasha.lordTe} ప్రత్యంతరం (${pratyBundle.currentPratyantardasha.startDate} నుండి ${pratyBundle.currentPratyantardasha.endDate})`,
              `Live Running: ${pratyBundle.currentMahadasha.lordEn} MD -> ${pratyBundle.currentAntardasha.lordEn} AD -> ${pratyBundle.currentPratyantardasha.lordEn} PD (${pratyBundle.currentPratyantardasha.startDate} to ${pratyBundle.currentPratyantardasha.endDate})`
            )}
          </p>
        </div>

        {/* Double Transit Event Windows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pratyBundle.doubleTransitWindows.map((ev) => (
            <div key={ev.eventKey} className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3.5 space-y-1.5 text-xs">
              <div className="flex items-start justify-between gap-2 border-b border-amber-100 pb-1.5">
                <strong className="text-amber-950 font-extrabold">{t(ev.titleTe, ev.titleEn)}</strong>
                <span className="font-mono tabular-nums font-extrabold text-emerald-800 shrink-0">
                  {ev.confidencePercent}%
                </span>
              </div>
              <div className="font-mono font-extrabold text-red-800 text-xs">
                {t('శుభ సమయం:', 'Peak Window:')} {t(ev.windowLabelTe, ev.windowLabelEn)}
              </div>
              <p className="text-slate-700 leading-relaxed">{t(ev.basisTe, ev.basisEn)}</p>
              <p className="text-emerald-900 font-semibold">{t(ev.actionTipTe, ev.actionTipEn)}</p>
            </div>
          ))}
        </div>

        {/* Interactive Mahadasha -> Antardasha -> Pratyantardasha Explorer */}
        <div className="rounded-2xl border border-amber-200 bg-[#fffdf7] p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2.5 no-print">
            <strong className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
              <CalendarClock size={16} className="text-amber-700" />
              <span>{t('ప్రత్యంతర దశ (రోజువారీ/నెలవారీ తేదీల) పరిశీలన:', 'Inspect Any Pratyantardasha Dates:')}</span>
            </strong>
            <div className="flex flex-wrap gap-2 text-xs">
              <select
                aria-label="Select Mahadasha"
                value={selectedMahaIdx}
                onChange={(e) => {
                  setSelectedMahaIdx(Number(e.target.value));
                  setSelectedAntarIdx(0);
                }}
                className="rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 font-bold text-amber-950 cursor-pointer"
              >
                {pratyBundle.mahadashas.map((m, idx) => (
                  <option key={m.lordId} value={idx}>
                    {language === 'en' ? `${m.lordEn} MD` : `${m.lordTe} మహాదశ`} ({m.startDate.slice(0, 4)}–{m.endDate.slice(0, 4)})
                    {m.isCurrent ? ' ★' : ''}
                  </option>
                ))}
              </select>

              <select
                aria-label="Select Antardasha"
                value={selectedAntarIdx}
                onChange={(e) => setSelectedAntarIdx(Number(e.target.value))}
                className="rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 font-bold text-slate-900 cursor-pointer"
              >
                {activeMaha.antardashas.map((a, idx) => (
                  <option key={a.lordId} value={idx}>
                    {language === 'en' ? `${a.lordEn} AD` : `${a.lordTe} అంతర్దశ`} ({a.startDate} → {a.endDate})
                    {a.isCurrent ? ' ★' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-amber-50 text-amber-950 border-b border-amber-200">
                  <th className="py-1.5 px-2.5 font-extrabold">{t('ప్రత్యంతర దశ', 'Pratyantardasha')}</th>
                  <th className="py-1.5 px-2 font-extrabold">{t('రోజులు', 'Days')}</th>
                  <th className="py-1.5 px-2.5 font-extrabold">{t('ప్రారంభ తేదీ', 'Start Date')}</th>
                  <th className="py-1.5 px-2.5 font-extrabold">{t('ముగింపు తేదీ', 'End Date')}</th>
                  <th className="py-1.5 px-2.5 font-extrabold">{t('సూక్ష్మ ఫలితం', 'Focus Theme')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {activeAntar.pratyantaras.map((pd) => (
                  <tr
                    key={pd.lordId}
                    className={pd.isCurrent ? 'bg-amber-100/75 font-bold' : 'odd:bg-white even:bg-amber-50/20'}
                  >
                    <td className="py-1.5 px-2.5 font-extrabold text-amber-950 whitespace-nowrap">
                      {activeMaha.lordTe.slice(0, 3)}-{activeAntar.lordTe.slice(0, 3)}-{language === 'en' ? pd.lordEn : pd.lordTe}
                      {pd.isCurrent ? <span className="ml-1 text-emerald-800">★ {t('నేడు', 'Now')}</span> : null}
                    </td>
                    <td className="py-1.5 px-2 font-mono tabular-nums text-slate-700">{pd.days}d</td>
                    <td className="py-1.5 px-2.5 font-mono tabular-nums text-slate-800 whitespace-nowrap">{pd.startDate}</td>
                    <td className="py-1.5 px-2.5 font-mono tabular-nums text-slate-800 whitespace-nowrap">{pd.endDate}</td>
                    <td className="py-1.5 px-2.5 text-slate-700">{t(pd.effectTe, pd.effectEn)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CHAPTER 34: ANNUAL TAJIKA VARSHAPHAL (SOLAR RETURN) & 365-DAY MUDDA DASHA
          ===================================================================== */}
      <div
        id="chapter-34"
        className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-4 scroll-mt-24 print-page-break page print-page-sheet"
      >
        <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-900">
              {t(
                'అధ్యాయం 34 · వార్షిక తాజిక వర్షఫల్ (Solar Return), ముంథా & 365-రోజుల ముద్దా దశ',
                'Chapter 34 · Annual Tajika Varshaphal (Solar Return), Muntha & Mudda Dasha'
              )}
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-1.5">
              <Sun size={18} className="text-amber-700" />
              <span>
                {t(
                  `${varshaphal.targetYear}వ పుట్టినరోజు వార్షిక వర్షఫల్ (${varshaphal.birthdayRangeLabel})`,
                  `Solar Return Year ${varshaphal.targetYear} (${varshaphal.birthdayRangeLabel})`
                )}
              </span>
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs no-print">
            <label htmlFor="varsha-year-select" className="font-bold text-amber-950">
              {t('సంవత్సరం:', 'Year:')}
            </label>
            <select
              id="varsha-year-select"
              value={varshaYear}
              onChange={(e) => setVarshaYear(Number(e.target.value))}
              className="rounded-xl border border-amber-300 bg-white px-3 py-1.5 font-mono font-extrabold text-amber-950 cursor-pointer"
            >
              {[2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Muntha & Varsheshwara Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3">
            <span className="text-slate-500 block font-bold">{t('ముంథా రాశి & భావం', 'Muntha Sign & House')}</span>
            <strong className="text-sm text-amber-950 font-extrabold block mt-0.5">
              {language === 'en' ? varshaphal.munthaRashiEn : varshaphal.munthaRashiTe} · H{varshaphal.munthaHouseFromVarshaLagna}
            </strong>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3">
            <span className="text-slate-500 block font-bold">{t('వర్ష లగ్నం', 'Varsha Lagna')}</span>
            <strong className="text-sm text-amber-950 font-extrabold block mt-0.5">
              {language === 'en' ? varshaphal.varshaLagnaEn : varshaphal.varshaLagnaTe}
            </strong>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3">
            <span className="text-slate-500 block font-bold">{t('వర్షేశ్వరుడు (Year Lord)', 'Varsheshwara')}</span>
            <strong className="text-sm text-red-800 font-extrabold block mt-0.5">
              {language === 'en' ? varshaphal.varsheshwaraEn : varshaphal.varsheshwaraTe}
            </strong>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3">
            <span className="text-slate-500 block font-bold">{t('వార్షిక శుభ బలం', 'Annual Score')}</span>
            <strong className="text-sm font-mono tabular-nums text-emerald-800 font-extrabold block mt-0.5">
              {varshaphal.annualScore}% ({t(`${varshaphal.ageInYear} ఏట`, `Age ${varshaphal.ageInYear}`)})
            </strong>
          </div>
        </div>

        <p className="text-xs text-slate-800 leading-relaxed bg-[#fffdf7] border border-amber-200 rounded-2xl p-3.5">
          {t(varshaphal.munthaVerdictTe, varshaphal.munthaVerdictEn)}
        </p>

        {/* 9-Planet Mudda Dasha Table */}
        <div className="overflow-x-auto border border-amber-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-50 text-amber-950 border-b border-amber-200">
                <th className="py-2 px-3 font-extrabold">{t('ముద్దా దశాధిపతి', 'Mudda Dasha Lord')}</th>
                <th className="py-2 px-2 font-extrabold">{t('రోజులు', 'Days')}</th>
                <th className="py-2 px-2.5 font-extrabold">{t('వ్యవధి (Date Range)', 'Date Range')}</th>
                <th className="py-2 px-3 font-extrabold">{t('వార్షిక ఫలితం', 'Annual Effect')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {varshaphal.muddaDashas.map((md) => (
                <tr key={md.lordId} className={md.isCurrent ? 'bg-amber-100/75 font-bold' : 'odd:bg-white even:bg-amber-50/20'}>
                  <td className="py-1.5 px-3 font-extrabold text-amber-950 whitespace-nowrap">
                    {language === 'en' ? md.lordEn : md.lordTe}
                    {md.isCurrent ? <span className="ml-1 text-emerald-800">★</span> : null}
                  </td>
                  <td className="py-1.5 px-2 font-mono tabular-nums text-slate-700">{md.days}d</td>
                  <td className="py-1.5 px-2.5 font-mono tabular-nums text-slate-800 whitespace-nowrap">
                    {md.startDate} → {md.endDate}
                  </td>
                  <td className="py-1.5 px-3 text-slate-700">{t(md.verdictTe, md.verdictEn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          CHAPTER 35: MULTI-DASHA (ASHTOTTARI 108-YR & YOGINI 36-YR) + PRINTABLE JHORA PLATES
          ===================================================================== */}
      <div
        id="chapter-35"
        className="bg-white rounded-3xl p-4 sm:p-6 print:p-3 border-2 border-amber-300 shadow-2xs space-y-5 scroll-mt-24 print-page-break page print-page-sheet"
      >
        <div className="bg-amber-50/90 rounded-2xl p-4 sm:p-5 print:p-2.5 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-amber-900">
              {t(
                'అధ్యాయం 35 · అష్టోత్తరి (108 సం॥) & యోగిని (36 సం॥) దశలు + అదనపు వర్గ చక్రాల ముద్రణ',
                'Chapter 35 · Ashtottari (108-Yr) & Yogini (36-Yr) Dashas + Divisional Plates'
              )}
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-1.5 mt-0.5">
              <Layers size={18} className="text-amber-700" />
              <span>{t('అష్టోత్తరి · యోగిని దశా పద్ధతులు & D10/భవ చక్రం', 'Multi-Dasha Verification & D10/Bhava Charts')}</span>
            </h4>
          </div>

          <div className="flex items-center gap-1 p-1 bg-amber-100 rounded-xl border border-amber-300 no-print">
            <button
              type="button"
              onClick={() => setAltDashaTab('ashtottari')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                altDashaTab === 'ashtottari' ? 'bg-amber-900 text-amber-50' : 'text-amber-950'
              }`}
            >
              {t('అష్టోత్తరి (108 సం॥)', 'Ashtottari (108 Yrs)')}
            </button>
            <button
              type="button"
              onClick={() => setAltDashaTab('yogini')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                altDashaTab === 'yogini' ? 'bg-amber-900 text-amber-50' : 'text-amber-950'
              }`}
            >
              {t('యోగిని (36 సం॥)', 'Yogini (36 Yrs)')}
            </button>
          </div>
        </div>

        {/* Active Highlight Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3.5 space-y-1">
            <span className="font-bold text-amber-800 block">{t('ప్రస్తుత అష్టోత్తరి దశ:', 'Active Ashtottari Dasha:')}</span>
            <strong className="text-sm font-extrabold text-amber-950">
              {language === 'en' ? multiDashas.activeAshtottari.lordEn : multiDashas.activeAshtottari.lordTe}{' '}
              ({multiDashas.activeAshtottari.startYear}–{multiDashas.activeAshtottari.endYear})
            </strong>
            <p className="text-slate-700">{t(multiDashas.activeAshtottari.themeTe, multiDashas.activeAshtottari.themeEn)}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3.5 space-y-1">
            <span className="font-bold text-amber-800 block">{t('ప్రస్తుత యోగిని దశ:', 'Active Yogini Dasha:')}</span>
            <strong className="text-sm font-extrabold text-emerald-900">
              {language === 'en' ? multiDashas.activeYogini.lordEn : multiDashas.activeYogini.lordTe}{' '}
              ({multiDashas.activeYogini.startYear}–{multiDashas.activeYogini.endYear})
            </strong>
            <p className="text-slate-700">{t(multiDashas.activeYogini.themeTe, multiDashas.activeYogini.themeEn)}</p>
          </div>
        </div>

        {/* Selected Dasha Sequence Table */}
        <div className="overflow-x-auto border border-amber-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-50 text-amber-950 border-b border-amber-200">
                <th className="py-2 px-3 font-extrabold">
                  {altDashaTab === 'ashtottari' ? t('అష్టోత్తరి దశ', 'Ashtottari Lord') : t('యోగిని దశ', 'Yogini Dasha')}
                </th>
                <th className="py-2 px-2.5 font-extrabold">{t('సంవత్సరాలు', 'Years')}</th>
                <th className="py-2 px-2.5 font-extrabold">{t('కాలం', 'Period')}</th>
                <th className="py-2 px-3 font-extrabold">{t('ప్రధాన ఫలితం', 'Core Theme')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {(altDashaTab === 'ashtottari' ? multiDashas.ashtottariList : multiDashas.yoginiList).map((row, idx) => (
                <tr key={idx} className={row.isCurrent ? 'bg-amber-100/75 font-bold' : 'odd:bg-white even:bg-amber-50/20'}>
                  <td className="py-1.5 px-3 font-extrabold text-amber-950 whitespace-nowrap">
                    {language === 'en' ? row.lordEn : row.lordTe}
                    {row.isCurrent ? <span className="ml-1 text-emerald-800">★ {t('ప్రస్తుతం', 'Now')}</span> : null}
                  </td>
                  <td className="py-1.5 px-2.5 font-mono tabular-nums">{row.years} {t('సం॥', 'yrs')}</td>
                  <td className="py-1.5 px-2.5 font-mono tabular-nums whitespace-nowrap">{row.startYear}–{row.endYear}</td>
                  <td className="py-1.5 px-3 text-slate-700">{t(row.themeTe, row.themeEn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Printable JHora Divisional Charts Plate (D10 Dasamsha & Bhava Chalit synced with chosen South/North style!) */}
        <div className="pt-2 space-y-3 border-t border-amber-200">
          <div className="flex items-center justify-between text-xs">
            <strong className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
              <Compass size={15} className="text-amber-700" />
              <span>
                {t(
                  `ముద్రణ/PDF వర్గ చక్రాల అనుబంధం (D10 దశాంశ & భవ చలిత · ${selectedChartStyle === 'north' ? 'ఉత్తర డైమండ్' : 'దక్షిణ భారత'} శైలి)`,
                  `Printable Divisional Charts (D10 Career & Bhava Chalit · ${selectedChartStyle.toUpperCase()} Style)`
                )}
              </span>
            </strong>
            <span className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
              <Sparkles size={12} />
              {t('PDF ఎగుమతిలో చేర్చబడింది', 'Included in PDF Export')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {printSnapshots.map((snap) => (
              <div key={snap.meta.code} className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3 space-y-2">
                <div className="text-center text-xs font-extrabold text-amber-950">
                  {language === 'en' ? snap.meta.titleEn : snap.meta.titleTe}
                </div>
                {renderCompactPrintableVarga(snap)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
