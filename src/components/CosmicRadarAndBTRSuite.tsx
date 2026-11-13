import React, { useMemo, useState } from 'react';
import { Compass, Clock, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  BTRCluesInput,
  compute12MonthTransitPower,
  computeLiveCosmicSnapshot,
  runBirthTimeRectificationScan,
} from '../utils/btrAndCosmicRadarEngine';

const RASHI_SHORT_LABELS = [
  { te: 'మేష', en: 'Ari' },
  { te: 'వృష', en: 'Tau' },
  { te: 'మిథు', en: 'Gem' },
  { te: 'కర్కా', en: 'Can' },
  { te: 'సింహ', en: 'Leo' },
  { te: 'కన్య', en: 'Vir' },
  { te: 'తుల', en: 'Lib' },
  { te: 'వృశ్చి', en: 'Sco' },
  { te: 'ధను', en: 'Sag' },
  { te: 'మక', en: 'Cap' },
  { te: 'కుంభ', en: 'Aqu' },
  { te: 'మీన', en: 'Pis' },
];

export const LiveCosmicSkyWheelCard: React.FC<{
  natalLagnaIdx?: number;
  natalMoonIdx?: number;
}> = ({ natalLagnaIdx = 0, natalMoonIdx = 0 }) => {
  const { language, t } = useLanguage();
  const [refreshTick, setRefreshTick] = useState(0);

  const planetsNow = useMemo(() => {
    void refreshTick;
    return computeLiveCosmicSnapshot(new Date());
  }, [refreshTick]);

  const transit12Months = useMemo(
    () => compute12MonthTransitPower(natalMoonIdx),
    [natalMoonIdx]
  );

  // SVG Ring Coordinate Helper (center 160,160)
  const polarToXY = (deg: number, radius: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: 160 + radius * Math.cos(rad),
      y: 160 + radius * Math.sin(rad),
    };
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-300 shadow-sm space-y-5 font-telugu">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
            {t(
              'లైవ్ ఖగోళ గ్రహ సంచార చక్రం · Real-Time Ephemeris Sky Radar',
              'Live Cosmic Transit Sky Radar · Real-Time Sidereal Ephemeris'
            )}
          </span>
          <h4 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2 mt-0.5">
            <Compass size={18} className="text-amber-700" />
            <span>
              {t(
                'ఈ క్షణంలో ఆకాశంలో నవగ్రహాల ఖచ్చితమైన స్థితి & 12-నెలల శక్తి గ్రాఫ్',
                'Live Planetary Positions Now & 12-Month Transit Power'
              )}
            </span>
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setRefreshTick((x) => x + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs cursor-pointer self-start"
        >
          <RefreshCw size={13} />
          <span>{t('అప్‌డేట్', 'Refresh Live')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Circular 12-Sign SVG Cosmic Wheel */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <svg
            viewBox="0 0 320 320"
            className="w-full max-w-[300px] h-auto"
            role="img"
            aria-label="Live Cosmic Zodiac Wheel"
          >
            <circle cx="160" cy="160" r="146" fill="#fffdf8" stroke="#d97706" strokeWidth="2.5" />
            <circle cx="160" cy="160" r="112" fill="#fffaf0" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="52" fill="#451a03" />

            {/* 12 Zodiac Sign Sectors */}
            {Array.from({ length: 12 }).map((_, signIdx) => {
              const startDeg = signIdx * 30;
              const p1 = polarToXY(startDeg, 146);
              const p2 = polarToXY(startDeg, 52);
              const labelPos = polarToXY(startDeg + 15, 130);
              const isNatalMoon = signIdx === natalMoonIdx;
              const isNatalLagna = signIdx === natalLagnaIdx;
              return (
                <g key={signIdx}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill={isNatalMoon || isNatalLagna ? '#9a3412' : '#78350f'}
                  >
                    {language === 'en' ? RASHI_SHORT_LABELS[signIdx].en : RASHI_SHORT_LABELS[signIdx].te}
                    {isNatalLagna ? '★' : isNatalMoon ? '☽' : ''}
                  </text>
                </g>
              );
            })}

            {/* Center Label */}
            <text x="160" y="156" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fde68a">
              {language === 'en' ? 'LIVE SKY' : 'నేటి ఆకాశం'}
            </text>
            <text x="160" y="172" textAnchor="middle" fontSize="9" fill="#fed7aa">
              Lahiri Sidereal
            </text>

            {/* Planet Markers */}
            {planetsNow.map((p, idx) => {
              const radius = idx % 2 === 0 ? 90 : 72;
              const pos = polarToXY(p.longitude, radius);
              return (
                <g key={p.id}>
                  <circle cx={pos.x} cy={pos.y} r="11" fill={p.color} stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x={pos.x}
                    y={pos.y + 3.5}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    {p.shortCode}
                    {p.isRetrograde && p.id !== 'rahu' && p.id !== 'ketu' ? 'R' : ''}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="text-[11px] text-slate-600 text-center mt-1">
            ★ = {t('జన్మ లగ్నం', 'Natal Lagna')} · ☽ = {t('జన్మ రాశి', 'Natal Moon')} · R = {t('వక్రం (Retrograde)', 'Retrograde')}
          </p>
        </div>

        {/* Right: Exact Planetary Ephemeris Table */}
        <div className="lg:col-span-7 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-950 text-amber-100">
                <th className="py-2 px-2.5 rounded-tl-xl">{t('గ్రహం', 'Planet')}</th>
                <th className="py-2 px-2.5">{t('రాశి & డిగ్రీ', 'Sign & Deg')}</th>
                <th className="py-2 px-2.5 rounded-tr-xl">{t('నక్షత్ర పాదం', 'Nakshatra Pada')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {planetsNow.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/60">
                  <td className="py-1.5 px-2.5 font-extrabold text-amber-950">
                    {language === 'en' ? p.nameEn : p.nameTe}{' '}
                    {p.isRetrograde && p.id !== 'rahu' && p.id !== 'ketu' && (
                      <span className="text-rose-700 text-[10px]">(వక్రం R)</span>
                    )}
                  </td>
                  <td className="py-1.5 px-2.5 font-mono font-bold text-slate-800">
                    {language === 'en' ? p.rashiEn : p.rashiTe} {p.degFormatted}
                  </td>
                  <td className="py-1.5 px-2.5 text-slate-700">
                    {language === 'en' ? `${p.nakshatraEn} P${p.pada}` : `${p.nakshatraTe} (${p.pada}వ పాదం)`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 12-Month Transit Power Graph */}
      <div className="pt-3 border-t border-amber-200 space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-700" />
            <span>{t('రాబోయే 12 నెలల గోచార బల గ్రాఫ్ (Monthly Transit Power)', 'Next 12-Month Gochara Transit Power Graph')}</span>
          </h5>
          <span className="text-[11px] font-bold text-slate-600">
            {t(`ఆధారం: ${RASHI_SHORT_LABELS[natalMoonIdx].te} రాశి`, `Ref: ${RASHI_SHORT_LABELS[natalMoonIdx].en} Moon`)}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 items-end pt-2">
          {transit12Months.map((pt, i) => {
            const barColor =
              pt.powerPct >= 80
                ? 'bg-emerald-600'
                : pt.powerPct >= 65
                ? 'bg-amber-500'
                : 'bg-stone-400';
            return (
              <div
                key={i}
                title={language === 'en' ? pt.highlightEn : pt.highlightTe}
                className="flex flex-col items-center gap-1 bg-amber-50/50 border border-amber-100 rounded-xl p-2"
              >
                <span className="text-[10px] font-mono font-extrabold text-amber-950">
                  {pt.powerPct}%
                </span>
                <div className="w-full h-20 bg-amber-100/80 rounded-lg flex items-end overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-md ${barColor} transition-all`}
                    style={{ height: `${pt.powerPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-700 text-center">
                  {language === 'en' ? pt.monthLabelEn : pt.monthLabelTe}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface CosmicRadarAndBTRSuiteProps {
  birthDate: string;
  birthTime: string;
  cityId: string;
  natalLagnaIdx: number;
  natalMoonIdx: number;
  onApplyCorrectedBirthTime: (newTime: string) => void;
}

export const CosmicRadarAndBTRSuite: React.FC<CosmicRadarAndBTRSuiteProps> = ({
  birthDate,
  birthTime,
  cityId,
  natalLagnaIdx,
  natalMoonIdx,
  onApplyCorrectedBirthTime,
}) => {
  const { language, t } = useLanguage();
  const [siblingHint, setSiblingHint] = useState<BTRCluesInput['siblingHint']>('none');
  const [careerHint, setCareerHint] = useState<BTRCluesInput['careerHint']>('tech_finance');
  const [marriageHint, setMarriageHint] = useState<BTRCluesInput['marriageTimingHint']>('normal');
  const [appliedTimeMsg, setAppliedTimeMsg] = useState<string | null>(null);

  const btrReport = useMemo(
    () =>
      runBirthTimeRectificationScan({
        birthDate,
        approxTime: birthTime,
        cityId,
        siblingHint,
        careerHint,
        marriageTimingHint: marriageHint,
      }),
    [birthDate, birthTime, cityId, siblingHint, careerHint, marriageHint]
  );

  const handleApplyTime = (tStr: string) => {
    onApplyCorrectedBirthTime(tStr);
    setAppliedTimeMsg(
      language === 'en'
        ? `Applied verified time ${tStr} to your Janma Kundali!`
        : `సరిచేసిన సమయం ${tStr} మీ జాతకానికి అప్లై చేయబడింది!`
    );
    setTimeout(() => setAppliedTimeMsg(null), 3500);
  };

  return (
    <div className="space-y-6 font-telugu">
      {/* CHAPTER 36: BIRTH TIME RECTIFICATION LAB */}
      <div
        id="chapter-36"
        className="page print-page-sheet bg-white rounded-3xl p-5 sm:p-7 border border-amber-300 shadow-sm space-y-5 scroll-mt-24"
      >
        <div className="border-b-2 border-amber-200 pb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 block">
            {t('అధ్యాయం 36 • కృషి కుండ & తత్వ శోధన ప్రయోగశాల', 'Chapter 36 · Birth Time Rectification (Kunda & Tatwa Lab)')}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2 mt-0.5">
            <Clock size={20} className="text-amber-700" />
            <span>
              {t(
                'జన్మ సమయ శుద్ధి (±30 నిమిషాల లగ్న & నవాంశ ఖచ్చితత్వ పరీక్ష)',
                'Birth Time Rectification (±30 Min Lagna & Navamsa Calibration)'
              )}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'పుట్టిన సమయంలో 5–25 నిమిషాల సందేహం ఉన్నవారు ఈ జీవిత సంఘటనల ఆధారంగా కచ్చితమైన లగ్న & నవాంశ సమయాన్ని నిర్ధారించుకోవచ్చు.',
              'Cross-verify approximate birth time against Kunda Sphuta (81x Moon), Tatwa Shodhana, and life milestones.'
            )}
          </p>
        </div>

        {/* Life Clues Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs no-print">
          <label className="block space-y-1">
            <span className="font-bold text-slate-700">{t('తోబుట్టువుల స్థితి (Siblings)', 'Sibling Clue')}</span>
            <select
              value={siblingHint}
              onChange={(e) => setSiblingHint(e.target.value as BTRCluesInput['siblingHint'])}
              className="w-full rounded-xl border border-amber-300 bg-amber-50/40 px-3 py-2 font-bold"
            >
              <option value="none">{t('ఏకైక సంతానం / సమానం', 'Only Child / Balanced')}</option>
              <option value="younger_more">{t('కనిష్ఠ సోదరులు (Younger)', 'Younger Siblings')}</option>
              <option value="elder_more">{t('జ్యేష్ఠ సోదరులు (Elder)', 'Elder Siblings')}</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-bold text-slate-700">{t('వృత్తి రంగం (Career Domain)', 'Career Nature')}</span>
            <select
              value={careerHint}
              onChange={(e) => setCareerHint(e.target.value as BTRCluesInput['careerHint'])}
              className="w-full rounded-xl border border-amber-300 bg-amber-50/40 px-3 py-2 font-bold"
            >
              <option value="tech_finance">{t('టెక్ / ఫైనాన్స్ / అకౌంట్స్', 'Tech / Finance / Analytical')}</option>
              <option value="govt_leadership">{t('ప్రభుత్వ / మేనేజ్‌మెంట్ / నాయకత్వం', 'Govt / Leadership / Admin')}</option>
              <option value="creative_business">{t('వ్యాపారం / కళలు / మీడియా', 'Business / Creative / Media')}</option>
              <option value="healthcare_service">{t('వైద్యం / సేవ / బోధన', 'Healthcare / Teaching / Service')}</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-bold text-slate-700">{t('వివాహ సమయం (Marriage Timing)', 'Marriage Milestone')}</span>
            <select
              value={marriageHint}
              onChange={(e) => setMarriageHint(e.target.value as BTRCluesInput['marriageTimingHint'])}
              className="w-full rounded-xl border border-amber-300 bg-amber-50/40 px-3 py-2 font-bold"
            >
              <option value="normal">{t('సాధారణ వయసు (24–28 సం.)', 'Normal Age (24–28)')}</option>
              <option value="early">{t('త్వరగా వివాహం (<24 సం.)', 'Early Marriage (<24)')}</option>
              <option value="delayed">{t('ఆలస్య వివాహం (>29 సం.)', 'Delayed Marriage (>29)')}</option>
              <option value="unmarried">{t('ఇంకా వివాహం కాలేదు', 'Not Married Yet')}</option>
            </select>
          </label>
        </div>

        {/* Highlight Banner */}
        <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs sm:text-sm space-y-1">
            <div className="font-extrabold text-amber-950">
              {t('కుండ స్ఫుట సిఫార్సు చేయబడిన సమయం:', 'Kunda-Verified Recommended Time:')}{' '}
              <span className="font-mono text-base text-emerald-800">{btrReport.recommendedTime}</span>
            </div>
            <p className="text-slate-700">{t(btrReport.summaryTe, btrReport.summaryEn)}</p>
          </div>
          <button
            type="button"
            onClick={() => handleApplyTime(btrReport.recommendedTime)}
            className="no-print shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>{t('ఈ సమయం జాతకానికి అప్లై చేయండి →', 'Apply Verified Time →')}</span>
          </button>
        </div>

        {appliedTimeMsg && (
          <div className="text-xs font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-300 rounded-xl px-3.5 py-2">
            ✓ {appliedTimeMsg}
          </div>
        )}

        {/* Candidate Slots Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-950 text-amber-100">
                <th className="py-2 px-3 rounded-tl-xl">{t('సమయం', 'Time')}</th>
                <th className="py-2 px-3">{t('D1 లగ్నం', 'D1 Lagna')}</th>
                <th className="py-2 px-3">{t('D9 నవాంశ', 'D9 Navamsa')}</th>
                <th className="py-2 px-3">{t('తత్వం & కుండ', 'Tatwa & Kunda')}</th>
                <th className="py-2 px-3 rounded-tr-xl">{t('స్కోర్', 'Match %')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {btrReport.candidates
                .filter((c) => Math.abs(c.offsetMins) <= 20 || c.timeStr === btrReport.recommendedTime)
                .map((c) => {
                  const isRec = c.timeStr === btrReport.recommendedTime;
                  return (
                    <tr key={c.timeStr} className={isRec ? 'bg-emerald-50/70 font-bold' : 'hover:bg-amber-50/40'}>
                      <td className="py-2 px-3 font-mono text-amber-950">
                        {c.timeStr} {c.offsetMins === 0 ? '(Input)' : `(${c.offsetMins > 0 ? '+' : ''}${c.offsetMins}m)`}
                      </td>
                      <td className="py-2 px-3">{language === 'en' ? c.d1LagnaEn : c.d1LagnaTe}</td>
                      <td className="py-2 px-3">{language === 'en' ? c.d9NavamshaLagnaEn : c.d9NavamshaLagnaTe}</td>
                      <td className="py-2 px-3 text-[11px] text-slate-700">
                        {language === 'en' ? c.tatwaEn : c.tatwaTe} · {c.kundaAligned ? '✓ కుండ' : '—'}
                      </td>
                      <td className="py-2 px-3 font-mono font-extrabold text-emerald-800">{c.matchScore}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHAPTER 37: LIVE COSMIC SKY WHEEL & 12-MONTH TRANSIT POWER */}
      <div id="chapter-37" className="page print-page-sheet scroll-mt-24">
        <LiveCosmicSkyWheelCard natalLagnaIdx={natalLagnaIdx} natalMoonIdx={natalMoonIdx} />
      </div>
    </div>
  );
};
