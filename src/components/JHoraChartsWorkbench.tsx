import React, { useMemo, useState } from 'react';
import {
  LayoutGrid,
  Compass,
  Sparkles,
  Disc,
  Grid2X2,
  Eye,
  Info,
} from 'lucide-react';
import { KundaliPlanetDetail } from '../utils/astronomyPanchangam';
import {
  ALL_VARGAS_META,
  ArudhaPadaItem,
  buildVargaChartSnapshot,
  ChartStyleType,
  computeAll12ArudhaPadas,
  computePlanetBhinnashtakavarga,
  computeSpecialLagnasAndGulika,
  RASHI_NAMES_SHORT_EN,
  RASHI_NAMES_SHORT_TE,
  SpecialPointMarker,
  VargaChartSnapshot,
  VargaCode,
} from '../utils/jhoraChartsEngine';
import { useLanguage } from '../context/LanguageContext';

interface JHoraChartsWorkbenchProps {
  nativeName: string;
  birthTime: string;
  planets: KundaliPlanetDetail[];
  savSignBindus: number[]; // length 12 indexed by sign (0..11)
  chartStyle?: ChartStyleType;
  onChartStyleChange?: (style: ChartStyleType) => void;
}

type WorkbenchViewMode = 'single' | 'multi4' | 'sudarshana' | 'ashtakavarga';
type Multi4PresetKey = 'core' | 'wealth' | 'family' | 'spiritual';
type BavPlanetChoice = 'SAV' | 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn';

const MULTI4_PRESETS: Record<
  Multi4PresetKey,
  { labelTe: string; labelEn: string; codes: [VargaCode, VargaCode, VargaCode, VargaCode] }
> = {
  core: {
    labelTe: 'ప్రధాన 4 (D1 + భవ + D9 + D10)',
    labelEn: 'Core 4 (D1 + Bhava + D9 + D10)',
    codes: ['D1', 'BHAVA', 'D9', 'D10'],
  },
  wealth: {
    labelTe: 'సంపద-ఆస్తి (D1 + D2 + D4 + D16)',
    labelEn: 'Wealth & Assets (D1 + D2 + D4 + D16)',
    codes: ['D1', 'D2', 'D4', 'D16'],
  },
  family: {
    labelTe: 'కుటుంబం-సంతానం (D1 + D7 + D9 + D12)',
    labelEn: 'Marriage & Family (D1 + D7 + D9 + D12)',
    codes: ['D1', 'D7', 'D9', 'D12'],
  },
  spiritual: {
    labelTe: 'విద్య-పూర్వకర్మ (D1 + D20 + D24 + D60)',
    labelEn: 'Wisdom & Karma (D1 + D20 + D24 + D60)',
    codes: ['D1', 'D20', 'D24', 'D60'],
  },
};

const BAV_OPTIONS: { id: BavPlanetChoice; labelTe: string; labelEn: string }[] = [
  { id: 'SAV', labelTe: 'సర్వాష్టకవర్గ (337)', labelEn: 'Sarvashtakavarga (337)' },
  { id: 'sun', labelTe: 'సూర్య BAV', labelEn: 'Sun BAV' },
  { id: 'moon', labelTe: 'చంద్ర BAV', labelEn: 'Moon BAV' },
  { id: 'mars', labelTe: 'కుజ BAV', labelEn: 'Mars BAV' },
  { id: 'mercury', labelTe: 'బుధ BAV', labelEn: 'Mercury BAV' },
  { id: 'jupiter', labelTe: 'గురు BAV', labelEn: 'Jupiter BAV' },
  { id: 'venus', labelTe: 'శుక్ర BAV', labelEn: 'Venus BAV' },
  { id: 'saturn', labelTe: 'శని BAV', labelEn: 'Saturn BAV' },
];

// North Indian fixed house geometry (House 1 = Top Diamond, counter-clockwise 1..12)
const NORTH_HOUSES_SVG: {
  house: number;
  pts: string;
  signPos: [number, number];
  textCenter: [number, number];
  maxPerLine: number;
}[] = [
  { house: 1, pts: '100,100 200,0 300,100 200,200', signPos: [200, 178], textCenter: [200, 88], maxPerLine: 3 },
  { house: 2, pts: '0,0 200,0 100,100', signPos: [100, 82], textCenter: [100, 38], maxPerLine: 2 },
  { house: 3, pts: '0,0 100,100 0,200', signPos: [82, 102], textCenter: [38, 102], maxPerLine: 2 },
  { house: 4, pts: '0,200 100,100 200,200 100,300', signPos: [176, 204], textCenter: [95, 198], maxPerLine: 3 },
  { house: 5, pts: '0,200 100,300 0,400', signPos: [82, 304], textCenter: [38, 304], maxPerLine: 2 },
  { house: 6, pts: '0,400 100,300 200,400', signPos: [100, 326], textCenter: [100, 368], maxPerLine: 2 },
  { house: 7, pts: '200,200 300,300 200,400 100,300', signPos: [200, 228], textCenter: [200, 314], maxPerLine: 3 },
  { house: 8, pts: '200,400 300,300 400,400', signPos: [300, 326], textCenter: [300, 368], maxPerLine: 2 },
  { house: 9, pts: '400,200 400,400 300,300', signPos: [318, 304], textCenter: [360, 304], maxPerLine: 2 },
  { house: 10, pts: '200,200 300,100 400,200 300,300', signPos: [224, 204], textCenter: [305, 198], maxPerLine: 3 },
  { house: 11, pts: '400,0 400,200 300,100', signPos: [318, 102], textCenter: [360, 102], maxPerLine: 2 },
  { house: 12, pts: '200,0 400,0 300,100', signPos: [300, 82], textCenter: [300, 38], maxPerLine: 2 },
];

// South Indian 4x4 outer cell coordinates indexed by sign (0=Mesha..11=Meena)
const SOUTH_SIGN_CELLS: { signIdx: number; row: number; col: number }[] = [
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

// East Indian / Bengali fixed sign positions in 3x3 cross SVG (400x400)
const EAST_SIGN_POLYGONS: { signIdx: number; pts: string; cx: number; cy: number; labelPos: [number, number] }[] = [
  { signIdx: 0, pts: '133,0 267,0 267,133 133,133', cx: 200, cy: 66, labelPos: [200, 20] }, // Mesha top center
  { signIdx: 1, pts: '0,0 133,0 133,133', cx: 88, cy: 48, labelPos: [104, 18] }, // Vrishabha top-left upper
  { signIdx: 2, pts: '0,0 133,133 0,133', cx: 44, cy: 92, labelPos: [20, 122] }, // Mithuna top-left lower
  { signIdx: 3, pts: '0,133 133,133 133,267 0,267', cx: 66, cy: 200, labelPos: [22, 152] }, // Karkataka mid-left
  { signIdx: 4, pts: '0,267 133,267 0,400', cx: 44, cy: 312, labelPos: [20, 286] }, // Simha bottom-left upper
  { signIdx: 5, pts: '133,267 133,400 0,400', cx: 88, cy: 356, labelPos: [104, 388] }, // Kanya bottom-left lower
  { signIdx: 6, pts: '133,267 267,267 267,400 133,400', cx: 200, cy: 334, labelPos: [200, 386] }, // Tula bottom-center
  { signIdx: 7, pts: '267,267 400,400 267,400', cx: 312, cy: 356, labelPos: [296, 388] }, // Vrischika bottom-right lower
  { signIdx: 8, pts: '267,267 400,267 400,400', cx: 356, cy: 312, labelPos: [380, 286] }, // Dhanussu bottom-right upper
  { signIdx: 9, pts: '267,133 400,133 400,267 267,267', cx: 334, cy: 200, labelPos: [378, 152] }, // Makara mid-right
  { signIdx: 10, pts: '400,0 400,133 267,133', cx: 356, cy: 92, labelPos: [380, 122] }, // Kumbha top-right lower
  { signIdx: 11, pts: '267,0 400,0 267,133', cx: 312, cy: 48, labelPos: [296, 18] }, // Meena top-right upper
];

export const JHoraChartsWorkbench: React.FC<JHoraChartsWorkbenchProps> = ({
  nativeName,
  birthTime,
  planets,
  savSignBindus,
  chartStyle: controlledChartStyle,
  onChartStyleChange,
}) => {
  const { language, t } = useLanguage();
  const [internalChartStyle, setInternalChartStyle] = useState<ChartStyleType>('south');
  const chartStyle = controlledChartStyle ?? internalChartStyle;
  const setChartStyle = (next: ChartStyleType) => {
    setInternalChartStyle(next);
    if (onChartStyleChange) onChartStyleChange(next);
  };
  const [viewMode, setViewMode] = useState<WorkbenchViewMode>('single');
  const [selectedVarga, setSelectedVarga] = useState<VargaCode>('D1');
  const [multi4Preset, setMulti4Preset] = useState<Multi4PresetKey>('core');
  const [bavChoice, setBavChoice] = useState<BavPlanetChoice>('SAV');
  const [selectedSignIdx, setSelectedSignIdx] = useState<number | null>(null);

  // Overlays matching JHora toggles
  const [showDegrees, setShowDegrees] = useState<boolean>(true);
  const [showDignityTags, setShowDignityTags] = useState<boolean>(true);
  const [showArudhas, setShowArudhas] = useState<boolean>(true);
  const [showSpecialPoints, setShowSpecialPoints] = useState<boolean>(false);

  const lagnaIdx = planets[0]?.rashiIdx ?? 0;
  const moonSignIdx = (planets.find((p) => p.id === 'moon') || planets[2])?.rashiIdx ?? 0;
  const sunSignIdx = (planets.find((p) => p.id === 'sun') || planets[1])?.rashiIdx ?? 0;

  const arudhaPadas: ArudhaPadaItem[] = useMemo(
    () => computeAll12ArudhaPadas(planets, lagnaIdx),
    [planets, lagnaIdx]
  );

  const specialPoints: SpecialPointMarker[] = useMemo(
    () => computeSpecialLagnasAndGulika(planets, birthTime),
    [planets, birthTime]
  );

  const singleSnapshot = useMemo(
    () => buildVargaChartSnapshot(planets, selectedVarga, arudhaPadas, specialPoints),
    [planets, selectedVarga, arudhaPadas, specialPoints]
  );

  const multi4Snapshots = useMemo(
    () =>
      MULTI4_PRESETS[multi4Preset].codes.map((code) =>
        buildVargaChartSnapshot(planets, code, arudhaPadas, specialPoints)
      ),
    [planets, multi4Preset, arudhaPadas, specialPoints]
  );

  const activeBindusBySign = useMemo(() => {
    if (bavChoice === 'SAV') {
      return {
        signBindus: savSignBindus,
        totalBindus: savSignBindus.reduce((a, b) => a + b, 0),
        thresholdGood: 30,
        thresholdLow: 25,
      };
    }
    const bav = computePlanetBhinnashtakavarga(planets, bavChoice);
    return {
      signBindus: bav.signBindus,
      totalBindus: bav.totalBindus,
      thresholdGood: 5,
      thresholdLow: 3,
    };
  }, [bavChoice, planets, savSignBindus]);

  const formatPlanetItem = (
    p: VargaChartSnapshot['signPlanets'][number][number],
    vargaCode: VargaCode
  ) => {
    const base = language === 'en' ? p.shortEn : p.shortTe;
    const retroMark = p.isRetro ? (language === 'en' ? '(R)' : '(వ)') : '';
    const degMark = showDegrees && vargaCode === 'D1' ? ` ${p.degStr}` : '';
    const digTag =
      showDignityTags && p.dignityTagTe
        ? `[${language === 'en' ? p.dignityTagEn : p.dignityTagTe}]`
        : '';
    return `${base}${retroMark}${degMark}${digTag}`;
  };

  // Generic Reusable Chart Box Renderer (South, North, East) for both Full and Compact 4-Pane
  const renderChartByStyle = (
    snap: VargaChartSnapshot,
    options: { compact?: boolean; binduOverlay?: number[] } = {}
  ) => {
    const { compact = false, binduOverlay } = options;

    if (chartStyle === 'north') {
      // North Indian Diamond SVG (Fixed Houses H1..H12)
      return (
        <div className={`w-full ${compact ? 'max-w-[300px]' : 'max-w-[440px]'} mx-auto`}>
          <svg
            viewBox="0 0 400 400"
            className="w-full h-auto bg-[#fffdf8] border-2 border-amber-700/80 rounded-xl shadow-2xs select-none"
            role="img"
            aria-label={`${snap.meta.titleEn} North Indian Diamond Chart`}
          >
            {/* Outer & Diagonal Lines */}
            <rect x="0" y="0" width="400" height="400" fill="#fffdf8" stroke="#9a3412" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="400" y2="400" stroke="#b45309" strokeWidth="1.4" />
            <line x1="400" y1="0" x2="0" y2="400" stroke="#b45309" strokeWidth="1.4" />
            <polygon
              points="200,0 400,200 200,400 0,200"
              fill="none"
              stroke="#b45309"
              strokeWidth="1.6"
            />

            {NORTH_HOUSES_SVG.map((hGeom) => {
              const signIdx = (snap.lagnaSignIdx + hGeom.house - 1) % 12;
              const isSelected = selectedSignIdx === signIdx;
              const cellPlanets = snap.signPlanets[signIdx] || [];
              const cellArudhas = showArudhas ? snap.signArudhas[signIdx] || [] : [];
              const cellSpecials = showSpecialPoints ? snap.signSpecials[signIdx] || [] : [];
              const binduVal = binduOverlay ? binduOverlay[signIdx] : null;

              const lines: string[] = [];
              if (hGeom.house === 1) {
                lines.push(language === 'en' ? '★ Asc' : '★ లగ్నం');
              }
              const items = cellPlanets.map((pl) => formatPlanetItem(pl, snap.meta.code));
              for (let i = 0; i < items.length; i += hGeom.maxPerLine) {
                lines.push(items.slice(i, i + hGeom.maxPerLine).join(' '));
              }
              if (cellArudhas.length > 0) lines.push(cellArudhas.join(' '));
              if (cellSpecials.length > 0) lines.push(cellSpecials.join(' '));

              const lineHeight = compact ? 13 : 14.5;
              const startY = hGeom.textCenter[1] - ((lines.length - 1) * lineHeight) / 2;

              let polyFill = 'transparent';
              if (isSelected) polyFill = 'rgba(251, 191, 36, 0.22)';
              else if (binduVal !== null) {
                const goodThresh = bavChoice === 'SAV' ? 30 : 5;
                const lowThresh = bavChoice === 'SAV' ? 25 : 3;
                polyFill =
                  binduVal >= goodThresh
                    ? 'rgba(16, 185, 129, 0.14)'
                    : binduVal < lowThresh
                    ? 'rgba(244, 63, 94, 0.12)'
                    : 'rgba(245, 158, 11, 0.06)';
              } else if (hGeom.house === 1) {
                polyFill = 'rgba(254, 243, 199, 0.45)';
              }

              return (
                <g
                  key={hGeom.house}
                  onClick={() => setSelectedSignIdx(signIdx)}
                  className="cursor-pointer"
                >
                  <polygon points={hGeom.pts} fill={polyFill} />
                  {/* Sign Number (1..12) */}
                  <text
                    x={hGeom.signPos[0]}
                    y={hGeom.signPos[1]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-amber-900/80 font-mono font-bold"
                    fontSize={compact ? 11 : 12}
                  >
                    {signIdx + 1}
                  </text>

                  {/* Bindu Score when Ashtakavarga mode active */}
                  {binduVal !== null ? (
                    <text
                      x={hGeom.textCenter[0]}
                      y={hGeom.textCenter[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={compact ? 18 : 22}
                      className="fill-slate-900 font-mono font-extrabold"
                    >
                      {binduVal}
                    </text>
                  ) : (
                    lines.map((ln, idx) => (
                      <text
                        key={idx}
                        x={hGeom.textCenter[0]}
                        y={startY + idx * lineHeight}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={compact ? 10 : 11}
                        className={
                          ln.startsWith('★')
                            ? 'fill-red-800 font-extrabold'
                            : 'fill-slate-900 font-bold'
                        }
                      >
                        {ln}
                      </text>
                    ))
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (chartStyle === 'east') {
      // East Indian / Bengali SVG
      return (
        <div className={`w-full ${compact ? 'max-w-[300px]' : 'max-w-[440px]'} mx-auto`}>
          <svg
            viewBox="0 0 400 400"
            className="w-full h-auto bg-[#fffdf8] border-2 border-amber-700/80 rounded-xl shadow-2xs select-none"
            role="img"
            aria-label={`${snap.meta.titleEn} East Indian Chart`}
          >
            <rect x="0" y="0" width="400" height="400" fill="#fffdf8" stroke="#9a3412" strokeWidth="2.5" />
            <line x1="133" y1="0" x2="133" y2="400" stroke="#b45309" strokeWidth="1.5" />
            <line x1="267" y1="0" x2="267" y2="400" stroke="#b45309" strokeWidth="1.5" />
            <line x1="0" y1="133" x2="400" y2="133" stroke="#b45309" strokeWidth="1.5" />
            <line x1="0" y1="267" x2="400" y2="267" stroke="#b45309" strokeWidth="1.5" />
            {/* 4 Diagonal Corner Splits */}
            <line x1="0" y1="0" x2="133" y2="133" stroke="#b45309" strokeWidth="1.4" />
            <line x1="400" y1="0" x2="267" y2="133" stroke="#b45309" strokeWidth="1.4" />
            <line x1="0" y1="400" x2="133" y2="267" stroke="#b45309" strokeWidth="1.4" />
            <line x1="400" y1="400" x2="267" y2="267" stroke="#b45309" strokeWidth="1.4" />

            {/* Center Label */}
            <rect x="134" y="134" width="132" height="132" fill="#fffbeb" />
            <text x="200" y="190" textAnchor="middle" fontSize="13" className="fill-amber-950 font-extrabold">
              {snap.meta.code}
            </text>
            <text x="200" y="210" textAnchor="middle" fontSize="10.5" className="fill-amber-800 font-bold">
              {language === 'en'
                ? RASHI_NAMES_SHORT_EN[snap.lagnaSignIdx]
                : RASHI_NAMES_SHORT_TE[snap.lagnaSignIdx]}{' '}
              {language === 'en' ? 'Lagna' : 'లగ్నం'}
            </text>

            {EAST_SIGN_POLYGONS.map((cell) => {
              const isLagna = cell.signIdx === snap.lagnaSignIdx;
              const isSelected = selectedSignIdx === cell.signIdx;
              const houseNum = ((cell.signIdx - snap.lagnaSignIdx + 12) % 12) + 1;
              const cellPlanets = snap.signPlanets[cell.signIdx] || [];
              const binduVal = binduOverlay ? binduOverlay[cell.signIdx] : null;

              const items = cellPlanets.map((pl) => formatPlanetItem(pl, snap.meta.code));
              const lines: string[] = [];
              if (isLagna) lines.push(language === 'en' ? '★Asc' : '★ల');
              for (let i = 0; i < items.length; i += 2) {
                lines.push(items.slice(i, i + 2).join(' '));
              }
              const lineH = compact ? 12 : 13.5;
              const startY = cell.cy - ((lines.length - 1) * lineH) / 2;

              return (
                <g
                  key={cell.signIdx}
                  onClick={() => setSelectedSignIdx(cell.signIdx)}
                  className="cursor-pointer"
                >
                  <polygon
                    points={cell.pts}
                    fill={
                      isSelected
                        ? 'rgba(251, 191, 36, 0.24)'
                        : isLagna
                        ? 'rgba(254, 243, 199, 0.5)'
                        : 'transparent'
                    }
                  />
                  <text
                    x={cell.labelPos[0]}
                    y={cell.labelPos[1]}
                    textAnchor="middle"
                    fontSize={compact ? 8.5 : 9.5}
                    className="fill-amber-900/75 font-mono font-bold"
                  >
                    H{houseNum}
                  </text>
                  {binduVal !== null ? (
                    <text
                      x={cell.cx}
                      y={cell.cy + 4}
                      textAnchor="middle"
                      fontSize={compact ? 17 : 20}
                      className="fill-slate-900 font-mono font-extrabold"
                    >
                      {binduVal}
                    </text>
                  ) : (
                    lines.map((ln, idx) => (
                      <text
                        key={idx}
                        x={cell.cx}
                        y={startY + idx * lineH}
                        textAnchor="middle"
                        fontSize={compact ? 9.5 : 10.5}
                        className={
                          ln.startsWith('★') ? 'fill-red-800 font-extrabold' : 'fill-slate-900 font-bold'
                        }
                      >
                        {ln}
                      </text>
                    ))
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    // Default: South Indian 4x4 Zodiac Fixed Chart
    return (
      <div
        className={`w-full ${
          compact ? 'max-w-[330px] min-h-[250px]' : 'max-w-[490px] min-h-[340px]'
        } mx-auto grid grid-cols-4 grid-rows-4 border-2 border-amber-700/80 rounded-xl overflow-hidden bg-[#fffdf9] shadow-2xs`}
      >
        {SOUTH_SIGN_CELLS.map((cell) => {
          const isLagna = cell.signIdx === snap.lagnaSignIdx;
          const isSelected = selectedSignIdx === cell.signIdx;
          const houseNum = ((cell.signIdx - snap.lagnaSignIdx + 12) % 12) + 1;
          const cellPlanets = snap.signPlanets[cell.signIdx] || [];
          const cellArudhas = showArudhas ? snap.signArudhas[cell.signIdx] || [] : [];
          const cellSpecials = showSpecialPoints ? snap.signSpecials[cell.signIdx] || [] : [];
          const binduVal = binduOverlay ? binduOverlay[cell.signIdx] : null;

          let bgClass = 'bg-white hover:bg-amber-50/60';
          if (isSelected) bgClass = 'bg-amber-100/80 ring-2 ring-inset ring-amber-600';
          else if (binduVal !== null) {
            const goodThresh = bavChoice === 'SAV' ? 30 : 5;
            const lowThresh = bavChoice === 'SAV' ? 25 : 3;
            bgClass =
              binduVal >= goodThresh
                ? 'bg-emerald-50/80'
                : binduVal < lowThresh
                ? 'bg-rose-50/70'
                : 'bg-amber-50/40';
          } else if (isLagna) {
            bgClass = 'bg-amber-50/90';
          }

          return (
            <button
              key={cell.signIdx}
              type="button"
              onClick={() => setSelectedSignIdx(cell.signIdx)}
              style={{ gridRow: cell.row, gridColumn: cell.col }}
              className={`relative border border-amber-300/90 ${
                compact ? 'p-1.5 min-h-[62px]' : 'p-2 min-h-[84px]'
              } text-left flex flex-col justify-between transition-colors cursor-pointer ${bgClass}`}
            >
              {/* Diagonal Lagna slash mark like classic JHora */}
              {isLagna && (
                <svg
                  className="absolute top-0 left-0 w-4 h-4 pointer-events-none"
                  viewBox="0 0 16 16"
                >
                  <line x1="0" y1="12" x2="12" y2="0" stroke="#991b1b" strokeWidth="1.6" />
                  <line x1="0" y1="16" x2="16" y2="0" stroke="#991b1b" strokeWidth="1.2" />
                </svg>
              )}

              <div className="flex items-center justify-between gap-1 text-[10px] leading-none">
                <span className="font-bold text-amber-900/90 truncate pl-1.5">
                  {language === 'en'
                    ? RASHI_NAMES_SHORT_EN[cell.signIdx]
                    : RASHI_NAMES_SHORT_TE[cell.signIdx]}
                </span>
                <span className="font-mono tabular-nums text-[9.5px] font-bold text-slate-500">
                  {houseNum}
                </span>
              </div>

              {binduVal !== null ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span
                    className={`font-mono tabular-nums font-extrabold ${
                      compact ? 'text-lg' : 'text-2xl'
                    } text-slate-900`}
                  >
                    {binduVal}
                  </span>
                  <span className="text-[9px] text-slate-600">
                    {t('బిందువులు', 'Bindus')}
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 content-start mt-1">
                  {isLagna && (
                    <span
                      className={`${
                        compact ? 'text-[9.5px]' : 'text-[10.5px]'
                      } font-extrabold text-red-800`}
                    >
                      {language === 'en' ? 'Asc' : 'లగ్న'}
                    </span>
                  )}
                  {cellPlanets.map((pl) => (
                    <span
                      key={pl.id}
                      className={`${
                        compact ? 'text-[9.5px]' : 'text-[11px]'
                      } font-bold ${
                        pl.dignityTagEn === 'Ex'
                          ? 'text-emerald-800'
                          : pl.dignityTagEn === 'Deb'
                          ? 'text-rose-700'
                          : 'text-slate-900'
                      }`}
                    >
                      {formatPlanetItem(pl, snap.meta.code)}
                    </span>
                  ))}
                  {cellArudhas.length > 0 && (
                    <span className="text-[9px] font-mono font-bold text-indigo-800">
                      {cellArudhas.join(',')}
                    </span>
                  )}
                  {cellSpecials.length > 0 && (
                    <span className="text-[9px] font-mono font-bold text-amber-800">
                      {cellSpecials.join(',')}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* Central 2x2 Reference Sanctum */}
        <div
          style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
          className="border border-amber-300 bg-amber-50/45 p-2 flex flex-col items-center justify-center text-center"
        >
          <span className={`${compact ? 'text-xs' : 'text-sm'} font-extrabold text-amber-950`}>
            {language === 'en' ? snap.meta.titleEn : snap.meta.titleTe}
          </span>
          <span className="text-[10px] font-medium text-slate-600 mt-0.5 line-clamp-2">
            {language === 'en' ? snap.meta.domainEn : snap.meta.domainTe}
          </span>
          {!compact && (
            <span className="text-[10px] text-amber-900 font-bold mt-1.5">
              {nativeName} ·{' '}
              {language === 'en'
                ? RASHI_NAMES_SHORT_EN[snap.lagnaSignIdx]
                : RASHI_NAMES_SHORT_TE[snap.lagnaSignIdx]}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Sudarshana Chakra 3-Concentric Ring Renderer
  const renderSudarshanaChakra = () => {
    const d1Snap = buildVargaChartSnapshot(planets, 'D1', arudhaPadas, specialPoints);
    const cx = 230;
    const cy = 230;
    const rings = [
      { labelTe: 'సూర్య', labelEn: 'Surya', baseSign: sunSignIdx, rInner: 158, rOuter: 215, fill: '#fffbeb' },
      { labelTe: 'చంద్ర', labelEn: 'Chandra', baseSign: moonSignIdx, rInner: 102, rOuter: 158, fill: '#f8fafc' },
      { labelTe: 'లగ్న', labelEn: 'Lagna', baseSign: lagnaIdx, rInner: 48, rOuter: 102, fill: '#fef3c7' },
    ];

    const polarToCartesian = (r: number, angleDeg: number) => {
      const rad = ((angleDeg - 90) * Math.PI) / 180;
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
      };
    };

    return (
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <div className="w-full max-w-[460px]">
          <svg
            viewBox="0 0 460 460"
            className="w-full h-auto bg-white rounded-full border border-amber-300 shadow-2xs"
            role="img"
            aria-label="Sudarshana Chakra Concentric Horoscope"
          >
            {rings.map((ring, rIdx) => (
              <g key={rIdx}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={ring.rOuter}
                  fill={ring.fill}
                  stroke="#b45309"
                  strokeWidth="1.4"
                />
              </g>
            ))}
            <circle cx={cx} cy={cy} r={48} fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" className="fill-amber-200 font-bold">
              {t('సుదర్శన', 'Sudarshana')}
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9.5" className="fill-amber-100">
              {t('లగ్న·చంద్ర·సూర్య', 'Lagna·Moon·Sun')}
            </text>

            {/* 12 Radial Sectors starting top-center (house 1 at top 345°..15°) */}
            {Array.from({ length: 12 }, (_, houseZero) => {
              const startAngle = houseZero * 30 - 15;
              const midAngle = houseZero * 30;
              const p1 = polarToCartesian(48, startAngle);
              const p2 = polarToCartesian(215, startAngle);

              return (
                <g key={houseZero}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#b45309"
                    strokeWidth="1"
                    strokeOpacity="0.55"
                  />
                  {rings.map((ring, rIdx) => {
                    const signIdx = (ring.baseSign + houseZero) % 12;
                    const midR = (ring.rInner + ring.rOuter) / 2;
                    const pos = polarToCartesian(midR, midAngle);
                    const pList = d1Snap.signPlanets[signIdx] || [];
                    const pText = pList
                      .map((p) => (language === 'en' ? p.shortEn : p.shortTe))
                      .slice(0, 3)
                      .join(' ');
                    const signShort = language === 'en' ? RASHI_NAMES_SHORT_EN[signIdx] : RASHI_NAMES_SHORT_TE[signIdx];

                    return (
                      <g key={rIdx}>
                        <text
                          x={pos.x}
                          y={pos.y - 5}
                          textAnchor="middle"
                          fontSize="8.5"
                          className="fill-amber-900/80 font-bold"
                        >
                          {houseZero + 1}·{signShort}
                        </text>
                        {pText && (
                          <text
                            x={pos.x}
                            y={pos.y + 7}
                            textAnchor="middle"
                            fontSize="9"
                            className="fill-slate-900 font-extrabold"
                          >
                            {pText}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="max-w-sm space-y-3 text-xs text-slate-700">
          <h4 className="text-sm font-extrabold text-amber-950">
            {t('సుదర్శన చక్ర విశ్లేషణ (పరాశర త్రి-చక్ర పద్ధతి)', 'Sudarshana Chakra (3-Reference Analysis)')}
          </h4>
          <p className="leading-relaxed">
            {t(
              'జగన్నాథ హోరాలో విశేషంగా వాడే ఈ చక్రం లోపలి నుండి బయటకు: 1) జన్మ లగ్నం (శరీరం), 2) చంద్ర లగ్నం (మనస్సు), 3) సూర్య లగ్నం (ఆత్మ/కీర్తి) ఒకే అక్షంలో ఎలా అనుసంధానమయ్యాయో చూపుతుంది.',
              'Aligns Ascendant (inner ring), Moon (middle ring), and Sun (outer ring) simultaneously across all 12 houses for timing events.'
            )}
          </p>
          <div className="space-y-1.5 pt-2 border-t border-amber-200">
            <div>
              <strong className="text-amber-950">{t('లోపలి వలయం (లగ్నం):', 'Inner Ring (Lagna):')}</strong>{' '}
              {language === 'en' ? RASHI_NAMES_SHORT_EN[lagnaIdx] : RASHI_NAMES_SHORT_TE[lagnaIdx]}
            </div>
            <div>
              <strong className="text-amber-950">{t('మధ్య వలయం (చంద్ర):', 'Middle Ring (Chandra):')}</strong>{' '}
              {language === 'en' ? RASHI_NAMES_SHORT_EN[moonSignIdx] : RASHI_NAMES_SHORT_TE[moonSignIdx]}
            </div>
            <div>
              <strong className="text-amber-950">{t('బయటి వలయం (సూర్య):', 'Outer Ring (Surya):')}</strong>{' '}
              {language === 'en' ? RASHI_NAMES_SHORT_EN[sunSignIdx] : RASHI_NAMES_SHORT_TE[sunSignIdx]}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      aria-label="Jagannatha Hora Pro Multi-Chart Workbench"
      className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-2xs space-y-5 no-print"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-amber-200 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-800 tracking-wide block">
            {t(
              'జగన్నాథ హోరా ప్రో విశ్లేషణ శాల · షోడశవర్గ చక్రాలు (D1–D60)',
              'Professional Divisional Charts Workbench · Shodashavarga (D1–D60)'
            )}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-amber-950 mt-0.5 flex items-center gap-2">
            <Compass size={20} className="text-amber-700 shrink-0" />
            <span>
              {t(
                'దక్షిణ · ఉత్తర · తూర్పు భారత చక్రాలు, షోడశవర్గ & సుదర్శన చక్రం',
                'South / North / East Indian Charts, D1–D60 & Sudarshana Chakra'
              )}
            </span>
          </h3>
        </div>

        {/* Chart Style Segmented Switch */}
        <div className="flex items-center gap-1 p-1 bg-amber-100/80 rounded-xl border border-amber-300/80 self-start lg:self-auto">
          {(
            [
              { id: 'south', te: 'దక్షిణ భారత', en: 'South Indian' },
              { id: 'north', te: 'ఉత్తర డైమండ్', en: 'North Indian' },
              { id: 'east', te: 'తూర్పు భారత', en: 'East Indian' },
            ] as { id: ChartStyleType; te: string; en: string }[]
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setChartStyle(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                chartStyle === st.id
                  ? 'bg-[#451a03] text-amber-100 shadow-2xs'
                  : 'text-amber-950 hover:bg-amber-200/70'
              }`}
            >
              {t(st.te, st.en)}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              viewMode === 'single'
                ? 'bg-amber-900 text-amber-50'
                : 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <LayoutGrid size={14} />
            <span>{t('D1–D60 & భవ చలిత', 'D1–D60 & Bhava Chalit')}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('multi4')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              viewMode === 'multi4'
                ? 'bg-amber-900 text-amber-50'
                : 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Grid2X2 size={14} />
            <span>{t('ఒకేసారి 4 చక్రాలు (Multi-View)', '4-Chart Multi-View')}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('sudarshana')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              viewMode === 'sudarshana'
                ? 'bg-amber-900 text-amber-50'
                : 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Disc size={14} />
            <span>{t('సుదర్శన చక్రం (3-Ring)', 'Sudarshana Chakra')}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('ashtakavarga')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              viewMode === 'ashtakavarga'
                ? 'bg-amber-900 text-amber-50'
                : 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Sparkles size={14} />
            <span>{t('అష్టకవర్గ బిందు చక్రం', 'Ashtakavarga Grid')}</span>
          </button>
        </div>

        {/* Overlay Filters */}
        {(viewMode === 'single' || viewMode === 'multi4') && (
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-700">
            <span className="inline-flex items-center gap-1 text-amber-900">
              <Eye size={13} />
              {t('చూపు:', 'Overlays:')}
            </span>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showDegrees}
                onChange={(e) => setShowDegrees(e.target.checked)}
                className="accent-amber-800"
              />
              <span>{t('డిగ్రీలు', 'Deg')}</span>
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showDignityTags}
                onChange={(e) => setShowDignityTags(e.target.checked)}
                className="accent-amber-800"
              />
              <span>{t('ఉచ్చ/నీచ', 'Ex/Deb')}</span>
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showArudhas}
                onChange={(e) => setShowArudhas(e.target.checked)}
                className="accent-amber-800"
              />
              <span>{t('ఆరూఢ (AL/UL)', 'Arudha (AL/UL)')}</span>
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showSpecialPoints}
                onChange={(e) => setShowSpecialPoints(e.target.checked)}
                className="accent-amber-800"
              />
              <span>{t('గుళిక/హోర (Gk/HL)', 'Gulika/HL')}</span>
            </label>
          </div>
        )}
      </div>

      {/* MODE 1: SINGLE FOCUS DIVISIONAL CHART (ALL 17 VARGAS) */}
      {viewMode === 'single' && (
        <div className="space-y-4">
          {/* Quick Selector Pills for D1..D60 + BHAVA */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {ALL_VARGAS_META.map((v) => (
              <button
                key={v.code}
                type="button"
                onClick={() => {
                  setSelectedVarga(v.code);
                  setSelectedSignIdx(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  selectedVarga === v.code
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-amber-50/80 text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {language === 'en' ? v.code : v.shortLabel}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7">
              {renderChartByStyle(singleSnapshot)}
            </div>

            <div className="lg:col-span-5 space-y-3 bg-[#fffdf8] border border-amber-200 rounded-2xl p-4">
              <div className="border-b border-amber-200 pb-2">
                <span className="text-[11px] font-bold text-amber-800 block">
                  {singleSnapshot.meta.code} · {t('వర్గ విశ్లేషణ', 'Divisional Scope')}
                </span>
                <h4 className="text-base font-extrabold text-amber-950">
                  {language === 'en' ? singleSnapshot.meta.titleEn : singleSnapshot.meta.titleTe}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {language === 'en' ? singleSnapshot.meta.domainEn : singleSnapshot.meta.domainTe}
                </p>
              </div>

              {/* Divisional Ascendant & Planet Placements Summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-amber-100">
                  <span className="font-bold text-amber-950">{t('వర్గ లగ్నం:', 'Chart Lagna:')}</span>
                  <span className="font-extrabold text-red-800">
                    {language === 'en'
                      ? RASHI_NAMES_SHORT_EN[singleSnapshot.lagnaSignIdx]
                      : RASHI_NAMES_SHORT_TE[singleSnapshot.lagnaSignIdx]}
                  </span>
                </div>
                {planets
                  .filter((p) => p.id !== 'lagna')
                  .map((p) => {
                    // Find sign in snapshot
                    let foundSign = 0;
                    let badgeInfo: ChartStyleType | null = null;
                    void badgeInfo;
                    for (let s = 0; s < 12; s++) {
                      if ((singleSnapshot.signPlanets[s] || []).some((x) => x.id === p.id)) {
                        foundSign = s;
                        break;
                      }
                    }
                    const houseNum = ((foundSign - singleSnapshot.lagnaSignIdx + 12) % 12) + 1;
                    const matchObj = singleSnapshot.signPlanets[foundSign]?.find((x) => x.id === p.id);

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between py-1 border-b border-amber-100/70 last:border-b-0"
                      >
                        <span className="font-bold text-slate-900">
                          {language === 'en' ? p.nameEn.split(' ')[0] : p.nameTe}
                          {matchObj?.isVargottama ? (
                            <span className="ml-1 text-[10px] font-bold text-emerald-700">
                              [{t('వర్గోత్తమ', 'Vg')}]
                            </span>
                          ) : null}
                        </span>
                        <span className="font-mono tabular-nums text-slate-700">
                          {language === 'en'
                            ? RASHI_NAMES_SHORT_EN[foundSign]
                            : RASHI_NAMES_SHORT_TE[foundSign]}{' '}
                          · {t(`${houseNum}వ భావం`, `H${houseNum}`)}
                          {matchObj?.dignityTagTe ? (
                            <strong className="ml-1 text-amber-900">
                              ({language === 'en' ? matchObj.dignityTagEn : matchObj.dignityTagTe})
                            </strong>
                          ) : null}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Selected House Interactive Inspector */}
              {selectedSignIdx !== null && (
                <div className="mt-2 pt-2.5 border-t border-amber-300 text-xs text-amber-950 space-y-1">
                  <div className="font-extrabold flex items-center gap-1">
                    <Info size={13} />
                    <span>
                      {language === 'en'
                        ? RASHI_NAMES_SHORT_EN[selectedSignIdx]
                        : RASHI_NAMES_SHORT_TE[selectedSignIdx]}{' '}
                      ({t(
                        `${((selectedSignIdx - singleSnapshot.lagnaSignIdx + 12) % 12) + 1}వ భావం`,
                        `House ${((selectedSignIdx - singleSnapshot.lagnaSignIdx + 12) % 12) + 1}`
                      )})
                    </span>
                  </div>
                  <div className="text-slate-700">
                    {t('ఉన్న గ్రహాలు:', 'Planets:')}{' '}
                    {(singleSnapshot.signPlanets[selectedSignIdx] || []).length > 0
                      ? singleSnapshot.signPlanets[selectedSignIdx]
                          .map((x) => (language === 'en' ? x.nameEn : x.nameTe))
                          .join(', ')
                      : t('ఖాళీ స్థానం', 'None')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 4-CHART MULTI-PANE (JHora Style 2x2) */}
      {viewMode === 'multi4' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(MULTI4_PRESETS) as Multi4PresetKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMulti4Preset(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  multi4Preset === key
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-50 text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {t(MULTI4_PRESETS[key].labelTe, MULTI4_PRESETS[key].labelEn)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multi4Snapshots.map((snap) => (
              <div
                key={snap.meta.code}
                className="bg-[#fffdf8] border border-amber-200 rounded-2xl p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-xs border-b border-amber-200/80 pb-1.5">
                  <strong className="text-amber-950 font-extrabold">
                    {language === 'en' ? snap.meta.titleEn : snap.meta.titleTe}
                  </strong>
                  <span className="text-[11px] text-slate-600 truncate max-w-[55%]">
                    {language === 'en' ? snap.meta.domainEn : snap.meta.domainTe}
                  </span>
                </div>
                {renderChartByStyle(snap, { compact: true })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: SUDARSHANA CHAKRA */}
      {viewMode === 'sudarshana' && renderSudarshanaChakra()}

      {/* MODE 4: ASHTAKAVARGA HEATMAP GRID */}
      {viewMode === 'ashtakavarga' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {BAV_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBavChoice(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  bavChoice === opt.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-amber-50 text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {t(opt.labelTe, opt.labelEn)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-7">
              {renderChartByStyle(singleSnapshot, {
                binduOverlay: activeBindusBySign.signBindus,
              })}
            </div>
            <div className="lg:col-span-5 bg-[#fffdf8] border border-amber-200 rounded-2xl p-4 space-y-2.5 text-xs">
              <h4 className="text-sm font-extrabold text-amber-950">
                {t('బిందు బల మార్గదర్శి', 'Ashtakavarga Strength Guide')} ·{' '}
                <span className="font-mono tabular-nums text-emerald-800">
                  {t(`మొత్తం: ${activeBindusBySign.totalBindus}`, `Total: ${activeBindusBySign.totalBindus}`)}
                </span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {bavChoice === 'SAV'
                  ? t(
                      'సర్వాష్టకవర్గలో 30+ బిందువులు ఉన్న రాశులు అత్యంత బలమైనవి (ఆకుపచ్చ); 25 లోపు ఉన్న స్థానాల్లో జాగ్రత్త & పరిహారాలు శ్రేష్టం.',
                      'Houses with 30+ Bindus in SAV yield strong prosperity and protection; < 25 Bindus suggest mindful effort.'
                    )
                  : t(
                      'భిన్నాష్టకవర్గలో 5–8 బిందువులు ఉన్న స్థానాల్లో ఆ గ్రహం గోచారం చేసినప్పుడు అత్యుత్తమ శుభ ఫలితాలను ఇస్తుంది.',
                      'Transits through signs holding 5–8 Bindus in Bhinnashtakavarga produce peak favorable results.'
                    )}
              </p>
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-amber-200 font-mono tabular-nums">
                {activeBindusBySign.signBindus.map((b, sIdx) => {
                  const h = ((sIdx - lagnaIdx + 12) % 12) + 1;
                  return (
                    <div
                      key={sIdx}
                      className={`p-1.5 rounded-lg border text-center ${
                        b >= activeBindusBySign.thresholdGood
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : b < activeBindusBySign.thresholdLow
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-white border-amber-200 text-slate-800'
                      }`}
                    >
                      <span className="block text-[10px] font-sans font-bold text-slate-600">
                        H{h} · {language === 'en' ? RASHI_NAMES_SHORT_EN[sIdx] : RASHI_NAMES_SHORT_TE[sIdx]}
                      </span>
                      <strong className="text-sm">{b}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
