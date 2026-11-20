import React, { useState, useEffect, useMemo } from 'react';
import { Download, RefreshCw, Compass, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import {
  computeLivePanchangamSheet,
  SheetKundaliHouse,
} from '../utils/livePanchangamSheetEngine';
import { downloadRoyalPanchangamKundaliCard } from '../utils/panchangamImageGenerator';

export interface RoyalPanchangamKundaliSheetProps {
  day: DayData;
  cityTe?: string;
  cityEn?: string;
  lat?: number;
  lon?: number;
}

const GURU_PORTRAIT_URL = '/assets/aistudio/photo_6303093205754826517_y_d79034b3.jpg';

export const RoyalPanchangamKundaliSheet: React.FC<RoyalPanchangamKundaliSheetProps> = ({
  day,
  cityTe = 'హైదరాబాద్',
  cityEn = 'Hyderabad',
  lat = 17.385,
  lon = 78.4867,
}) => {
  const { language, t, tr } = useLanguage();
  const [nowTick, setNowTick] = useState<number>(() => Date.now());
  const [selectedRashiIdx, setSelectedRashiIdx] = useState<number | null>(null);
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false);
  const [downloadingKind, setDownloadingKind] = useState<'story' | 'post' | null>(null);

  // Refresh live Lagna / Kundali clock every 60 seconds
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  const snap = useMemo(
    () =>
      computeLivePanchangamSheet(day, {
        referenceDateUtc: new Date(nowTick),
        cityTe,
        cityEn,
        lat,
        lon,
      }),
    [day, nowTick, cityTe, cityEn, lat, lon]
  );

  const selectedHouse: SheetKundaliHouse | null = useMemo(() => {
    if (selectedRashiIdx === null) return null;
    return snap.houses.find((h) => h.rashiIdx === selectedRashiIdx) || null;
  }, [snap.houses, selectedRashiIdx]);

  const handleDownload = async (aspect: 'story_9_16' | 'feed_4_5') => {
    if (downloadingKind) return;
    setDownloadingKind(aspect === 'story_9_16' ? 'story' : 'post');
    try {
      await downloadRoyalPanchangamKundaliCard(day, aspect, { cityTe, cityEn, lat, lon });
    } finally {
      setDownloadingKind(null);
    }
  };

  const timelineItems = [
    {
      labelTe: 'సంవత్సరం',
      labelEn: 'Samvatsaram',
      val: language === 'en' ? tr(snap.samvatsaramShortTe) : snap.samvatsaramShortTe,
    },
    {
      labelTe: 'అయనం',
      labelEn: 'Ayanam',
      val: language === 'en' ? snap.ayanamEn : snap.ayanamTe,
    },
    {
      labelTe: 'ఋతువు',
      labelEn: 'Rutu',
      val: language === 'en' ? snap.rutuvuEn : snap.rutuvuTe,
    },
    {
      labelTe: 'మాసం',
      labelEn: 'Masam',
      val: language === 'en' ? tr(snap.masamEn) : snap.masamTe,
    },
    {
      labelTe: 'పక్షం',
      labelEn: 'Paksham',
      val: language === 'en' ? snap.pakshamEn : snap.pakshamTe,
    },
    {
      labelTe: 'వారం',
      labelEn: 'Day',
      val: language === 'en' ? snap.weekdayEn : snap.weekdayTe,
    },
  ];

  const angaRows = [
    {
      labelTe: 'తిథి',
      labelEn: 'Tithi',
      value: language === 'en' ? tr(snap.tithiNameTe) : snap.tithiNameTe,
      end: language === 'en' ? tr(snap.tithiEndTe) : snap.tithiEndTe,
      dotColor: '#9A3412',
    },
    {
      labelTe: 'నక్షత్రం',
      labelEn: 'Nakshatram',
      value: language === 'en' ? tr(snap.nakshatraNameTe) : snap.nakshatraNameTe,
      end: language === 'en' ? tr(snap.nakshatraEndTe) : snap.nakshatraEndTe,
      dotColor: '#6B21A8',
    },
    {
      labelTe: 'యోగం',
      labelEn: 'Yogam',
      value: language === 'en' ? tr(snap.yogamNameTe) : snap.yogamNameTe,
      end: language === 'en' ? tr(snap.yogamEndTe) : snap.yogamEndTe,
      dotColor: '#047857',
    },
    {
      labelTe: 'కరణం',
      labelEn: 'Karanam',
      value: language === 'en' ? tr(snap.karanamNameTe) : snap.karanamNameTe,
      end: language === 'en' ? tr(snap.karanamEndTe) : snap.karanamEndTe,
      dotColor: '#9D174D',
    },
  ];

  const shubhaTimings = [
    { labelTe: 'సూర్యోదయం', labelEn: 'Sunrise', val: snap.sunriseTe },
    { labelTe: 'సూర్యాస్తమయం', labelEn: 'Sunset', val: snap.sunsetTe },
    { labelTe: 'అభిజిత్ ముహూర్తం', labelEn: 'Abhijit Muhurtham', val: snap.abhijitTe },
    { labelTe: 'అమృత కాలం', labelEn: 'Amrutha Kalam', val: snap.amruthaTe },
    { labelTe: 'బ్రహ్మ ముహూర్తం', labelEn: 'Brahma Muhurtham', val: snap.brahmaMuhurthamTe },
  ];

  const ashubhaTimings = [
    { labelTe: 'రాహుకాలం', labelEn: 'Rahu Kalam', val: snap.rahukalamTe },
    { labelTe: 'యమగండం', labelEn: 'Yamagandam', val: snap.yamagandamTe },
    { labelTe: 'గుళిక కాలం', labelEn: 'Gulika Kalam', val: snap.gulikaTe },
    { labelTe: 'దుర్ముహూర్తం', labelEn: 'Durmuhurtham', val: snap.durmuhurthamTe },
    { labelTe: 'వర్జ్యం', labelEn: 'Varjyam', val: snap.varjyamTe },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden bg-[#FAF5EA] border border-[#D4A64A] shadow-lg font-telugu text-stone-900"
      aria-label={t('నేటి పంచాంగం మరియు లైవ్ గ్రహస్థితి కుండలి పత్రిక', 'Daily Telugu Panchangam & Live Planetary Kundali Sheet')}
    >
      {/* 1. ROYAL TEMPLE HEADER BAND */}
      <div className="bg-gradient-to-r from-[#5A1408] via-[#3C0A05] to-[#260503] text-[#FFFDF7] px-4 sm:px-6 py-3.5 border-b-2 border-[#D4A64A] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#C99634] via-[#F7DC88] to-[#A6741D] shrink-0">
            {avatarFailed ? (
              <div className="w-full h-full rounded-full bg-[#3B0805] flex items-center justify-center text-[#FDE68A] font-bold text-lg">
                ఓం
              </div>
            ) : (
              <img
                src={GURU_PORTRAIT_URL}
                alt="బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు"
                width={56}
                height={56}
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="w-full h-full rounded-full object-cover object-top block"
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-xl font-bold tracking-tight text-white truncate">
              {t('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం', 'Sri Lakshmi Ganapathi Jyothishalayam')}
            </div>
            <div className="text-xs sm:text-sm text-[#F5D68A] truncate">
              {t(
                'బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు · హైదరాబాద్',
                'Brahmasri Jallavaram Sai Dheeraj Sharma · Hyderabad'
              )}
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-sm sm:text-base font-bold text-[#FDE68A]">
            {t('నేటి పంచాంగం', 'Daily Panchangam')}
          </div>
          <div className="text-xs text-[#E8C984] font-mono tabular-nums flex items-center sm:justify-end gap-1.5">
            <span>{t('గ్రహస్థితి', 'Live Kundali')}</span>
            <span aria-hidden="true">·</span>
            <span>{snap.liveTime12Hr}</span>
            <button
              type="button"
              onClick={() => setNowTick(Date.now())}
              aria-label={t('లైవ్ సమయం రిఫ్రెష్ చేయండి', 'Refresh live planetary chart time')}
              title={t('లైవ్ గ్రహస్థితి సమయం రిఫ్రెష్', 'Refresh live chart')}
              className="p-1 rounded hover:bg-white/10 text-[#FDE68A] transition-colors cursor-pointer"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN ASYMMETRIC BROADSHEET BODY */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* LEFT VERTICAL CALENDAR SPINE (Deep Temple Maroon-Indigo — Unique Brand Signature) */}
          <aside className="lg:col-span-4 rounded-xl bg-gradient-to-b from-[#3B0A0C] via-[#270A16] to-[#1A0918] text-white border border-[#C99634]/70 p-4 sm:p-5 flex flex-col justify-between gap-4">
            <div className="text-center border-b border-[#D4A64A]/30 pb-4">
              <div className="text-5xl sm:text-6xl font-bold tracking-tight text-white tabular-nums leading-none">
                {snap.dayNumber}
              </div>
              <div className="text-lg sm:text-xl font-bold text-[#F5C451] mt-1.5">
                {language === 'en' ? snap.monthYearEn : snap.monthYearTe}
              </div>
              <div className="text-xs sm:text-sm text-[#E2D4C5] mt-1">
                {language === 'en'
                  ? `${snap.weekdayEn} · ${snap.cityEn}`
                  : `${snap.weekdayTe} · ${snap.cityTe}`}
              </div>
            </div>

            {/* Golden Bead Calendar Spine */}
            <ol className="relative pl-5 space-y-3 my-auto">
              <span
                aria-hidden="true"
                className="absolute left-[7px] top-2 bottom-2 w-px bg-[#D9A441]/55"
              />
              {timelineItems.map((item) => (
                <li key={item.labelEn} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-[#F5C451] ring-2 ring-[#2C0A14]"
                  />
                  <div className="text-[11px] sm:text-xs text-[#DFC39B] leading-tight">
                    {language === 'en' ? item.labelEn : item.labelTe}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white leading-snug">
                    {item.val}
                  </div>
                </li>
              ))}
            </ol>

            {/* Bottom Temple Seal */}
            <div className="rounded-lg bg-white/[0.06] border border-[#D4A64A]/40 px-3 py-3 text-center">
              <div className="text-xs font-bold text-[#FDE68A]">
                {t('దృక్సిద్ధాంత లాహిరి గణితం', 'Drik Siddhanta · Lahiri')}
              </div>
              <div className="text-[11px] text-[#D9C5AD] mt-0.5 tabular-nums">
                {t(`చంద్రుడు: ${snap.chandraRashiTe} · లగ్నం: ${snap.lagnaRashiTe}`, `Moon: ${snap.chandraRashiEn} · Lagna: ${snap.lagnaRashiEn}`)}
              </div>
            </div>
          </aside>

          {/* RIGHT STACK: 4-ANGA PANCHANGA LEDGER + LIVE 4x4 SOUTH INDIAN KUNDALI */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* 4-Anga Ledger (Clean Hairlines, Zero Pill Clutter, Zero Thick Left Bars) */}
            <div className="rounded-xl bg-white border border-[#DFC89B] divide-y divide-[#F0E6D2]">
              {angaRows.map((row) => (
                <div
                  key={row.labelEn}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: row.dotColor }}
                    />
                    <div className="min-w-0">
                      <span
                        className="text-xs font-bold block leading-tight"
                        style={{ color: row.dotColor }}
                      >
                        {language === 'en' ? row.labelEn : row.labelTe}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-stone-900 leading-snug block">
                        {row.value}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-700 tabular-nums sm:text-right pl-4 sm:pl-0 shrink-0">
                    {row.end}
                  </div>
                </div>
              ))}
            </div>

            {/* Live 4x4 South Indian Kundali (గ్రహస్థితి) */}
            <div className="rounded-xl bg-white border border-[#DFC89B] p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#F0E6D2]">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#5A1408]">
                  <Compass size={16} className="text-[#9A3412] shrink-0" />
                  <span>
                    {t(
                      `దక్షిణ భారత కుండలి (గ్రహస్థితి) · ${snap.liveTimeLabel}`,
                      `South Indian Kundali (Planetary Positions) · ${snap.liveTimeLabel}`
                    )}
                  </span>
                </div>
                <span className="text-xs text-stone-600">
                  {t('రాశిపై నొక్కి గ్రహాల డిగ్రీలు చూడండి', 'Tap any house for planet degrees')}
                </span>
              </div>

              {/* 4x4 Traditional South Indian Grid */}
              <div className="grid grid-cols-4 border border-[#C99634] rounded-lg overflow-hidden bg-[#FFFDFA]">
                {/* 12 Outer Rashi Cells positioned strictly via gridRow/gridCol */}
                {snap.houses.map((house) => {
                  const isSelected = selectedRashiIdx === house.rashiIdx;
                  return (
                    <button
                      key={house.rashiIdx}
                      type="button"
                      onClick={() =>
                        setSelectedRashiIdx(isSelected ? null : house.rashiIdx)
                      }
                      style={{
                        gridRow: house.gridRow + 1,
                        gridColumn: house.gridCol + 1,
                      }}
                      className={`min-h-[78px] sm:min-h-[88px] p-1.5 sm:p-2 border border-[#DFC285] flex flex-col justify-between text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9A3412] ${
                        isSelected
                          ? 'bg-[#FCE8BC]'
                          : house.isChandraRashi
                            ? 'bg-[#FFF7E2] hover:bg-[#FCEEC9]'
                            : house.isLagnaRashi
                              ? 'bg-[#FEF4F2] hover:bg-[#FCE7E3]'
                              : 'bg-[#FFFDFA] hover:bg-[#FAF4E8]'
                      }`}
                    >
                      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 leading-tight">
                        {house.planets.map((p) => (
                          <span
                            key={p.id}
                            className="text-sm sm:text-base font-extrabold tracking-tight"
                            style={{ color: p.color }}
                            title={`${p.fullTe} (${p.fullEn}) ${p.degreeInSign.toFixed(1)}°${p.isRetrograde ? ' Retrograde' : ''}`}
                          >
                            {language === 'en' ? p.shortEn : p.shortTe}
                            {p.isRetrograde && (
                              <sup className="text-[9px] font-bold ml-0.5">R</sup>
                            )}
                          </span>
                        ))}
                      </div>
                      <span
                        className={`text-[10px] sm:text-[11px] font-semibold text-right block leading-none mt-1 ${
                          house.isChandraRashi ? 'text-[#854D0E]' : 'text-stone-500'
                        }`}
                      >
                        {language === 'en' ? house.rashiEn : house.rashiTe}
                      </span>
                    </button>
                  );
                })}

                {/* Center 2x2 Sanctuary Hub */}
                <div
                  style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }}
                  className="bg-gradient-to-br from-[#FDF5E2] to-[#F6E6C0] border border-[#C99634] flex flex-col items-center justify-center text-center p-2 sm:p-3"
                >
                  <div className="text-base sm:text-xl font-bold text-[#7C2D12]">
                    {t('కుండలి', 'Kundali')}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-700 mt-0.5 tabular-nums">
                    {snap.dayNumber} {language === 'en' ? snap.monthYearEn : snap.monthYearTe}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#9A3412] mt-0.5 tabular-nums">
                    {snap.liveTimeLabel} IST
                  </div>
                  <div className="text-[11px] text-stone-700 mt-1">
                    {t(`లగ్నం: ${snap.lagnaRashiTe}`, `Asc: ${snap.lagnaRashiEn}`)}
                  </div>
                </div>
              </div>

              {/* Interactive Selected House Planet Degrees Strip */}
              <div className="mt-2.5 pt-2 border-t border-[#F0E6D2] text-xs text-stone-700 flex flex-wrap items-center justify-between gap-2 min-h-[24px]">
                {selectedHouse ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <strong className="text-[#5A1408]">
                      {language === 'en' ? selectedHouse.rashiEn : selectedHouse.rashiTe}:
                    </strong>
                    {selectedHouse.planets.length > 0 ? (
                      selectedHouse.planets.map((p) => (
                        <span key={p.id} className="tabular-nums font-medium">
                          <strong style={{ color: p.color }}>
                            {language === 'en' ? p.fullEn : p.fullTe}
                          </strong>{' '}
                          {p.degreeInSign.toFixed(1)}°
                          {p.isRetrograde ? t(' (వక్రం)', ' (Retrograde)') : ''}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-500">
                        {t('ఈ రాశిలో ప్రస్తుతం గ్రహాలు లేవు', 'No planets currently transiting this sign')}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-stone-600">
                    {t(
                      'సూ=సూర్యుడు · చం=చంద్రుడు · కు=కుజుడు · బు=బుధుడు · గు=గురుడు · శు=శుక్రుడు · శ=శని · రా=రాహు · కే=కేతు · ల=లగ్నం · R=వక్రం',
                      'Asc=Lagna · Su=Sun · Mo=Moon · Ma=Mars · Me=Mercury · Ju=Jupiter · Ve=Venus · Sa=Saturn · Ra=Rahu · Ke=Ketu · R=Retrograde'
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM SPLIT: SHUBHA SAMAYALU (LEFT) vs ASHUBHA SAMAYALU (RIGHT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shubha Samayalu */}
          <div className="rounded-xl bg-[#EFF8F3] border border-[#96D0B0] p-4">
            <h3 className="text-sm sm:text-base font-bold text-[#065F46] flex items-center gap-2 pb-2.5 mb-2.5 border-b border-[#B7E1C8]">
              <CheckCircle2 size={16} className="text-[#007a52] shrink-0" />
              <span>{t('శుభ సమయాలు (Auspicious Timings)', 'Auspicious Timings (Shubha)')}</span>
            </h3>
            <dl className="divide-y divide-[#D6EFE0] text-xs sm:text-sm">
              {shubhaTimings.map((item) => (
                <div
                  key={item.labelEn}
                  className="py-2 flex items-baseline justify-between gap-3"
                >
                  <dt className="font-bold text-[#065F46] shrink-0">
                    {language === 'en' ? item.labelEn : item.labelTe}
                  </dt>
                  <dd className="font-bold text-stone-900 text-right tabular-nums">
                    {language === 'en' ? tr(item.val) : item.val}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Ashubha Samayalu */}
          <div className="rounded-xl bg-[#FDF2F2] border border-[#EBB0B0] p-4">
            <h3 className="text-sm sm:text-base font-bold text-[#991B1B] flex items-center gap-2 pb-2.5 mb-2.5 border-b border-[#F3C9C9]">
              <AlertTriangle size={16} className="text-[#B91C1C] shrink-0" />
              <span>{t('అశుభ సమయాలు (Caution Timings)', 'Caution Timings (Ashubha)')}</span>
            </h3>
            <dl className="divide-y divide-[#F6DADA] text-xs sm:text-sm">
              {ashubhaTimings.map((item) => (
                <div
                  key={item.labelEn}
                  className="py-2 flex items-baseline justify-between gap-3"
                >
                  <dt className="font-bold text-[#991B1B] shrink-0">
                    {language === 'en' ? item.labelEn : item.labelTe}
                  </dt>
                  <dd className="font-bold text-stone-900 text-right tabular-nums">
                    {language === 'en' ? tr(item.val) : item.val}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 4. DEVOTIONAL FOOTER STRIP + 1-CLICK HD DOWNLOAD CONTROLS */}
        <div className="rounded-xl bg-[#F2E9D8] border border-[#D8BE8C] px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-xs sm:text-sm font-bold text-[#4A180B]">
            {language === 'en' ? snap.deityFooterEn : snap.deityFooterTe}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={downloadingKind !== null}
              onClick={() => handleDownload('story_9_16')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-[#007a52] hover:bg-[#006644] disabled:opacity-60 text-white font-bold text-xs whitespace-nowrap transition-colors cursor-pointer"
            >
              {downloadingKind === 'story' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span>{t('HD Story కార్డ్ (9:16)', 'Download Story Card (9:16)')}</span>
            </button>

            <button
              type="button"
              disabled={downloadingKind !== null}
              onClick={() => handleDownload('feed_4_5')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-[#3E0B05] hover:bg-[#5A1408] disabled:opacity-60 text-[#FDE68A] border border-[#C99634] font-bold text-xs whitespace-nowrap transition-colors cursor-pointer"
            >
              {downloadingKind === 'post' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span>{t('FB / Insta పోస్ట్ (4:5)', 'Download Feed Card (4:5)')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
