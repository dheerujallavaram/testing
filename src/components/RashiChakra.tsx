import React, { useState, useMemo } from 'react';
import { Star, Info, Activity, BarChart3, Radar } from 'lucide-react';
import { DayData, RashiHouse } from '../types/panchangam';
import { RASHI_CHART_ORDER } from '../data/panchangamData';
import { calculateGocharaStrengths, RashiGocharaStrength } from '../utils/panchangaLogic';
import { RashiGlyph } from './RashiGlyph';
import { useLanguage } from '../context/LanguageContext';

interface RashiChakraProps {
  day: DayData;
}

export const RashiChakra: React.FC<RashiChakraProps> = ({ day }) => {
  const [selectedHouse, setSelectedHouse] = useState<RashiHouse | null>(null);
  const [chartMode, setChartMode] = useState<'radar' | 'bar'>('radar');
  const { language, t, tr } = useLanguage();

  const chandraRashi = RASHI_CHART_ORDER.find((r) =>
    (day.grahaStithi[r.key] || '').includes('చంద్రుడు')
  );

  // Calculate Gochara transit strength for all 12 Rashis (Mesham -> Meenam)
  const gocharaData = useMemo(() => calculateGocharaStrengths(day), [day]);

  const activeRashiKey = selectedHouse?.key || chandraRashi?.key || 'mesham';
  const activeGochara: RashiGocharaStrength =
    gocharaData.find((g) => g.id === activeRashiKey) || gocharaData[0];

  const handleSelectRashiById = (rashiId: string) => {
    const found = RASHI_CHART_ORDER.find((r) => r.key === rashiId) || null;
    if (selectedHouse?.key === rashiId) {
      setSelectedHouse(null);
    } else {
      setSelectedHouse(found);
    }
  };

  // Radar chart SVG geometry (viewBox 0 0 340 340)
  const cx = 170;
  const cy = 170;
  const maxR = 102;
  const labelR = 136;
  const levels = [0.25, 0.5, 0.75, 1];

  const radarPoints = useMemo(() => {
    return gocharaData.map((item, idx) => {
      const angleDeg = idx * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const r = (item.strength / 100) * maxR;
      const vx = cx + r * Math.cos(angleRad);
      const vy = cy + r * Math.sin(angleRad);
      const axisX = cx + maxR * Math.cos(angleRad);
      const axisY = cy + maxR * Math.sin(angleRad);
      const lx = cx + labelR * Math.cos(angleRad);
      const ly = cy + labelR * Math.sin(angleRad);
      return {
        ...item,
        vx,
        vy,
        axisX,
        axisY,
        lx,
        ly,
      };
    });
  }, [gocharaData]);

  const polygonPointsStr = radarPoints.map((p) => `${p.vx.toFixed(1)},${p.vy.toFixed(1)}`).join(' ');

  const getStatusColor = (status: RashiGocharaStrength['status']) => {
    if (status === 'favorable') return '#10b981'; // emerald-500
    if (status === 'caution') return '#ef4444'; // red-500
    return '#f59e0b'; // amber-500
  };

  return (
    <div className="bg-white border border-amber-200/90 shadow-lg p-3.5 sm:p-6 lg:p-8 rounded-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl text-amber-950 flex items-center gap-2 sm:gap-2.5 font-bold font-telugu">
            <Star size={20} className="text-amber-600 shrink-0" />
            <span>{t('రాశి చక్రం — గోచార గ్రహ స్థితి', 'Rashi Chakra — Planetary Transit (Gochara)')}</span>
          </h3>
          <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 font-telugu font-semibold whitespace-nowrap">
            {t('దక్షిణ భారత కుండలి', 'South Indian Kundli')}
          </span>
        </div>

        {/* 4x4 Grid Traditional South Indian Chart - Mobile touch optimized */}
        <div className="w-full max-w-md mx-auto grid grid-cols-4 grid-flow-dense border-2 sm:border-4 border-amber-800/90 rounded-xl overflow-hidden shadow-inner bg-amber-50/50">
          {/* Central 2x2 Hub */}
          <div className="col-start-2 row-start-2 col-span-2 row-span-2 border border-amber-300 bg-gradient-to-br from-amber-100 via-amber-200/70 to-amber-100 text-amber-950 flex flex-col items-center justify-center text-center p-2 sm:p-3 shadow-inner">
            <p className="text-[10px] sm:text-xs font-bold text-amber-900 mb-0.5 font-telugu">
              {t('రాశి చక్రం', 'Rashi Chakra')}
            </p>
            <p className="text-sm sm:text-lg font-extrabold leading-tight text-amber-950 font-telugu">
              {chandraRashi
                ? language === 'en'
                  ? `Moon in ${chandraRashi.english.split(' ')[0]}`
                  : `${chandraRashi.name} చంద్రుడు`
                : t('చంద్ర స్థానం', 'Moon Position')}
            </p>
            <p className="text-[10px] sm:text-xs text-amber-800 mt-0.5 font-telugu font-medium">
              {tr(day.label)} {t('గోచారం', 'Transit')}
            </p>
            <span className="mt-1 text-[9px] sm:text-[10px] text-amber-800/80 font-telugu">
              {t('తాకి వివరాలు చూడండి', 'Tap any house for details')}
            </span>
          </div>

          {/* 12 Outer Houses */}
          {RASHI_CHART_ORDER.map((rashi) => {
            const planets = day.grahaStithi[rashi.key];
            const hasMoon = planets?.includes('చంద్రుడు');
            const hasPlanets = Boolean(planets);
            const isSelected = selectedHouse?.key === rashi.key;
            const houseStrength = gocharaData.find((g) => g.id === rashi.key)?.strength;

            return (
              <button
                key={rashi.key}
                type="button"
                onClick={() => setSelectedHouse(isSelected ? null : rashi)}
                className={`border border-amber-300/80 p-1.5 sm:p-2 min-h-[82px] sm:min-h-[104px] flex flex-col justify-between text-left transition-all cursor-pointer overflow-hidden ${
                  hasMoon
                    ? 'bg-amber-200/90 hover:bg-amber-300/90 ring-1 ring-amber-400'
                    : hasPlanets
                    ? 'bg-amber-100/70 hover:bg-amber-200/70'
                    : 'bg-white hover:bg-amber-50/70'
                } ${isSelected ? 'ring-2 ring-amber-700 shadow-md scale-[1.02] z-10' : ''}`}
                title={`${language === 'en' ? rashi.english : rashi.name} - ${tr(rashi.lord)}`}
              >
                <div className="flex items-center justify-between w-full">
                  <RashiGlyph
                    rashi={rashi.key}
                    size={13}
                    className="text-amber-900/60 shrink-0"
                    strokeWidth={2}
                  />
                  <p className="text-[11px] sm:text-xs font-bold text-amber-950 font-telugu truncate">
                    {language === 'en' ? rashi.english.split(' ')[0] : rashi.name}
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center my-1 px-0.5 w-full">
                  {planets ? (
                    <p className="text-[11px] sm:text-xs font-bold leading-tight text-red-950 font-telugu drop-shadow-2xs break-words line-clamp-2">
                      {tr(planets)}
                    </p>
                  ) : (
                    <span className="text-[10px] text-amber-900/20 select-none font-mono">··</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-amber-900/70 font-telugu truncate w-full pt-0.5 border-t border-amber-200/50">
                  <span className="truncate">{tr(rashi.lord.split(' ')[0])}</span>
                  {houseStrength !== undefined && (
                    <span className="font-mono font-bold text-[9px] text-amber-800 shrink-0">
                      {houseStrength}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected House Details Drawer */}
        {selectedHouse && (
          <div className="mt-4 p-3.5 sm:p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs sm:text-sm font-telugu text-amber-950 flex items-start justify-between gap-3 animate-fade-in">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <RashiGlyph rashi={selectedHouse.key} size={18} className="text-amber-800 shrink-0" />
                  <p className="font-bold text-sm sm:text-base text-amber-900">
                    {language === 'en'
                      ? `${selectedHouse.english} (${selectedHouse.name})`
                      : `${selectedHouse.name} రాశి (${selectedHouse.english})`}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                    activeGochara.status === 'favorable'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : activeGochara.status === 'caution'
                      ? 'bg-red-100 text-red-900 border border-red-300'
                      : 'bg-amber-200/80 text-amber-950 border border-amber-400'
                  }`}
                >
                  <span>{t('గోచార బలం:', 'Gochara Strength:')}</span>
                  <span className="font-mono">{activeGochara.strength}%</span>
                  <span>• {tr(activeGochara.statusLabel)}</span>
                </span>
              </div>
              <p className="text-slate-700">
                {t('అధిపతి:', 'Ruling Planet:')} <strong>{tr(selectedHouse.lord)}</strong> |{' '}
                {t('తత్త్వం:', 'Element:')} {tr(selectedHouse.element)} |{' '}
                {t('చంద్ర స్థానం:', 'Lunar House:')} <strong>{tr(activeGochara.houseLabel)}</strong>
              </p>
              <p className="text-slate-800">
                {t('ప్రస్తుత గోచార గ్రహాలు:', 'Current Transiting Planets:')}{' '}
                <strong>
                  {day.grahaStithi[selectedHouse.key]
                    ? tr(day.grahaStithi[selectedHouse.key]!)
                    : t('గ్రహ సంచారం లేదు (శూన్యం)', 'No transiting planets')}
                </strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHouse(null)}
              className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-md font-sans text-xs cursor-pointer shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Interactive Gochara (Transit) Strength Radar Chart & Bar Graph */}
        <div className="mt-5 pt-4 border-t border-amber-200/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-1.5 font-telugu">
                <Activity size={16} className="text-amber-600 shrink-0" />
                <span>
                  {t(
                    'ద్వాదశ రాశుల గోచార బల చార్ట్ (Gochara Strength)',
                    '12-Rashi Gochara Transit Strength Chart'
                  )}
                </span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 font-telugu">
                {t(
                  'గ్రహ స్థితి & చంద్ర సంచారం ఆధారంగా నేటి 12 రాశుల గోచార బలం (%) — రాశిని తాకి చూడండి',
                  'Interactive transit strength (%) based on planetary & lunar positions — tap any Rashi'
                )}
              </p>
            </div>

            {/* View Toggle: Radar vs Bar Graph */}
            <div className="inline-flex items-center bg-amber-100/80 border border-amber-300 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setChartMode('radar')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-telugu transition-all cursor-pointer ${
                  chartMode === 'radar'
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                <Radar size={12} />
                <span>{t('రాడార్ చార్ట్', 'Radar')}</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('bar')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-telugu transition-all cursor-pointer ${
                  chartMode === 'bar'
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                <BarChart3 size={12} />
                <span>{t('బార్ గ్రాఫ్', 'Graph')}</span>
              </button>
            </div>
          </div>

          {chartMode === 'radar' ? (
            <div className="bg-gradient-to-b from-amber-50/70 to-white border border-amber-200 rounded-xl p-2 sm:p-3 flex flex-col items-center">
              <svg
                viewBox="0 0 340 340"
                className="w-full max-w-[290px] sm:max-w-[320px] h-auto select-none overflow-visible"
                role="img"
                aria-label="12 Rashis Gochara Transit Strength Radar Chart"
              >
                {/* Concentric Web Rings (25%, 50%, 75%, 100%) */}
                {levels.map((lvl) => {
                  const r = maxR * lvl;
                  const ringPts = radarPoints
                    .map((_, idx) => {
                      const angleRad = ((idx * 30 - 90) * Math.PI) / 180;
                      return `${(cx + r * Math.cos(angleRad)).toFixed(1)},${(
                        cy +
                        r * Math.sin(angleRad)
                      ).toFixed(1)}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={lvl}
                      points={ringPts}
                      fill="none"
                      stroke="#fde68a"
                      strokeWidth={lvl === 1 ? 1.5 : 1}
                      strokeDasharray={lvl < 1 ? '3,2' : undefined}
                    />
                  );
                })}

                {/* 12 Radial Spokes */}
                {radarPoints.map((pt) => (
                  <line
                    key={`axis-${pt.id}`}
                    x1={cx}
                    y1={cy}
                    x2={pt.axisX}
                    y2={pt.axisY}
                    stroke="#fcd34d"
                    strokeWidth={1}
                  />
                ))}

                {/* Gochara Strength Polygon */}
                <polygon
                  points={polygonPointsStr}
                  fill="rgba(217, 119, 6, 0.22)"
                  stroke="#b45309"
                  strokeWidth={2.2}
                />

                {/* Selected Rashi Highlight Ray */}
                {radarPoints.map((pt) => {
                  const isActive = activeRashiKey === pt.id;
                  if (!isActive) return null;
                  return (
                    <line
                      key={`active-ray-${pt.id}`}
                      x1={cx}
                      y1={cy}
                      x2={pt.vx}
                      y2={pt.vy}
                      stroke="#78350f"
                      strokeWidth={2.5}
                      strokeDasharray="2,2"
                    />
                  );
                })}

                {/* Interactive Vertex Nodes & Outer Rashi Labels */}
                {radarPoints.map((pt) => {
                  const isActive = activeRashiKey === pt.id;
                  const dotColor = getStatusColor(pt.status);
                  const displayName =
                    language === 'en' ? pt.englishName.slice(0, 3) : pt.teluguName;

                  return (
                    <g
                      key={pt.id}
                      onClick={() => handleSelectRashiById(pt.id)}
                      className="cursor-pointer group"
                    >
                      {/* Vertex pulse ring when selected */}
                      {isActive && (
                        <circle
                          cx={pt.vx}
                          cy={pt.vy}
                          r={8}
                          fill="none"
                          stroke="#78350f"
                          strokeWidth={1.8}
                        />
                      )}

                      {/* Data Vertex Dot */}
                      <circle
                        cx={pt.vx}
                        cy={pt.vy}
                        r={isActive ? 5.5 : 4.2}
                        fill={dotColor}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      >
                        <title>
                          {`${pt.teluguName} (${pt.englishName}): ${pt.strength}% - ${pt.statusLabel}`}
                        </title>
                      </circle>

                      {/* Outer Clickable Label Badge */}
                      <g transform={`translate(${pt.lx}, ${pt.ly})`}>
                        <rect
                          x={-26}
                          y={-13}
                          width={52}
                          height={26}
                          rx={6}
                          fill={isActive ? '#78350f' : '#fffbeb'}
                          stroke={isActive ? '#f59e0b' : '#fde68a'}
                          strokeWidth={isActive ? 1.5 : 1}
                        />
                        <text
                          x={0}
                          y={-2}
                          textAnchor="middle"
                          fill={isActive ? '#ffffff' : '#451a03'}
                          fontSize="9.5"
                          fontWeight="700"
                        >
                          {displayName}
                        </text>
                        <text
                          x={0}
                          y={9}
                          textAnchor="middle"
                          fill={
                            isActive
                              ? '#fde68a'
                              : pt.status === 'favorable'
                              ? '#047857'
                              : pt.status === 'caution'
                              ? '#b91c1c'
                              : '#b45309'
                          }
                          fontSize="8.5"
                          fontWeight="700"
                        >
                          {pt.strength}%{pt.planetCount > 0 ? ' •' : ''}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Center Score Pill */}
                <circle cx={cx} cy={cy} r={20} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1.5} />
                <text
                  x={cx}
                  y={cy - 2}
                  textAnchor="middle"
                  fill="#78350f"
                  fontSize="8.5"
                  fontWeight="700"
                >
                  {language === 'en'
                    ? activeGochara.englishName.slice(0, 3)
                    : activeGochara.teluguName}
                </text>
                <text
                  x={cx}
                  y={cy + 9}
                  textAnchor="middle"
                  fill="#b45309"
                  fontSize="9.5"
                  fontWeight="800"
                >
                  {activeGochara.strength}%
                </text>
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-1 text-[11px] font-telugu text-slate-700">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span>{t('శుభ గోచారం (75%+)', 'Favorable (75%+)')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span>{t('మిశ్రమ ఫలం (50-74%)', 'Moderate (50-74%)')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  <span>{t('చంద్రాష్టమం / జాగ్రత్త', 'Chandrashtamam / Caution')}</span>
                </span>
              </div>
            </div>
          ) : (
            /* Compact Interactive 12-Rashi Horizontal Bar Graph */
            <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-3 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gocharaData.map((item) => {
                  const isActive = activeRashiKey === item.id;
                  const barColor =
                    item.status === 'favorable'
                      ? 'bg-emerald-500'
                      : item.status === 'caution'
                      ? 'bg-red-500'
                      : 'bg-amber-500';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectRashiById(item.id)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-100/90 border-amber-600 shadow-2xs'
                          : 'bg-white border-amber-200/80 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold font-telugu text-amber-950 mb-1">
                        <span className="flex items-center gap-1.5 truncate">
                          <RashiGlyph rashi={item.id} size={12} className="text-amber-800 shrink-0" />
                          <span>{language === 'en' ? item.englishName : item.teluguName}</span>
                        </span>
                        <span className="font-mono text-[11px] text-amber-900">
                          {item.strength}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-300`}
                          style={{ width: `${item.strength}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500 font-telugu">
        <span className="flex items-center gap-1">
          <Info size={13} className="text-amber-600" />
          <span>{t('గోచారం: నిరయణ పద్ధతి', 'Transit: Nirayana Sidereal System')}</span>
        </span>
        <span className="text-[11px] text-amber-900/80 font-medium">
          {t('ఎరుపు: గ్రహ నివాసం', 'Red: Planetary Placement')}
        </span>
      </div>
    </div>
  );
};

