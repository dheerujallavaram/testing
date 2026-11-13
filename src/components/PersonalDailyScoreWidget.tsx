import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Sparkles, Star, ShieldCheck, UserCheck } from 'lucide-react';
import { DayData } from '../types/panchangam';
import { useLanguage } from '../context/LanguageContext';
import { RASHI_META_LIST } from '../utils/panchangaLogic';
import { computeAccurateJanmaKundali } from '../utils/astronomyPanchangam';
import { BIRTH_CITIES } from '../data/birthCitiesData';
import { FamilyBirthProfile, loadFamilyProfiles } from '../utils/familyProfilesVault';
import {
  computePersonalDailyHoroscopeScore,
  TWENTY_SEVEN_STARS_EN,
  TWENTY_SEVEN_STARS_TE,
} from '../utils/expandedAstrologyCalculators';

interface PersonalDailyScoreWidgetProps {
  day: DayData;
}

const PREF_KEY = 'slgj_personal_daily_pref_v1';

export const PersonalDailyScoreWidget: React.FC<PersonalDailyScoreWidgetProps> = ({ day }) => {
  const { language, t } = useLanguage();
  const [profiles, setProfiles] = useState<FamilyBirthProfile[]>(() => loadFamilyProfiles());
  const [selectedProfileId, setSelectedProfileId] = useState<string>('custom');

  const [natalNakIdx, setNatalNakIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PREF_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.nak === 'number') return parsed.nak;
      }
    } catch {
      // ignore storage failure
    }
    return 3; // Rohini default
  });

  const [natalRashiIdx, setNatalRashiIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PREF_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.rashi === 'number') return parsed.rashi;
      }
    } catch {
      // ignore
    }
    return 1; // Vrushabham default
  });

  useEffect(() => {
    const syncHandler = () => setProfiles(loadFamilyProfiles());
    window.addEventListener('slgj-family-vault-updated', syncHandler);
    return () => window.removeEventListener('slgj-family-vault-updated', syncHandler);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify({ nak: natalNakIdx, rashi: natalRashiIdx }));
    } catch {
      // ignore
    }
  }, [natalNakIdx, natalRashiIdx]);

  const handleSelectProfile = (profId: string) => {
    setSelectedProfileId(profId);
    if (profId === 'custom') return;
    const found = profiles.find((p) => p.id === profId);
    if (!found) return;
    const city = BIRTH_CITIES.find((c) => c.id === found.cityId) || BIRTH_CITIES[0];
    const astro = computeAccurateJanmaKundali(
      found.birthDate,
      found.birthTime,
      city.lat,
      city.lon,
      city.tz
    );
    const moon = astro.planets.find((p) => p.id === 'moon') || astro.planets[2];
    if (moon) {
      setNatalNakIdx(moon.nakshatraIdx);
      setNatalRashiIdx(moon.rashiIdx);
    }
  };

  const report = useMemo(
    () => computePersonalDailyHoroscopeScore(day, natalNakIdx, natalRashiIdx),
    [day, natalNakIdx, natalRashiIdx]
  );

  const scoreToneClass =
    report.statusTier === 'excellent'
      ? 'text-emerald-800'
      : report.statusTier === 'good'
      ? 'text-amber-900'
      : 'text-rose-800';

  const cardToneClass =
    report.statusTier === 'excellent'
      ? 'border-emerald-300 bg-emerald-50/35'
      : report.statusTier === 'good'
      ? 'border-amber-300 bg-[#fffdf7]'
      : 'border-rose-300 bg-rose-50/35';

  return (
    <section
      aria-label="Personal Daily Horoscope Luck Score"
      className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-2xs space-y-4"
    >
      {/* Top Row: Title + Saved Family Profile / Nakshatra Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-amber-200 pb-3.5">
        <div>
          <span className="text-xs font-bold text-amber-800 block">
            {t(
              'వ్యక్తిగత దిన ఫలితం · తారాబలం & చంద్రబల ఆధారిత స్కోర్',
              'Personal Daily Horoscope · Tarabalam & Chandrabalam Score'
            )}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-amber-950 flex items-center gap-1.5 mt-0.5">
            <Sparkles size={17} className="text-amber-700 shrink-0" />
            <span>
              {t(
                `నేటి (${day.label}) మీ వ్యక్తిగత లక్కీ స్కోర్ & శుభ సమయం`,
                `Your Personal Luck Score & Best Hours Today`
              )}
            </span>
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {profiles.length > 0 && (
            <select
              aria-label={t('సేవ్ చేసిన జాతకం ఎంచుకోండి', 'Select Saved Family Profile')}
              value={selectedProfileId}
              onChange={(e) => handleSelectProfile(e.target.value)}
              className="rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 font-bold text-amber-950 cursor-pointer"
            >
              <option value="custom">
                {t('నక్షత్రం ద్వారా ఎంచుకోండి', 'Custom Star & Rashi')}
              </option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  👤 {p.name} ({p.relationEn.split(' ')[0]})
                </option>
              ))}
            </select>
          )}

          <select
            aria-label={t('జన్మ నక్షత్రం', 'Birth Nakshatra')}
            value={natalNakIdx}
            onChange={(e) => {
              setSelectedProfileId('custom');
              setNatalNakIdx(Number(e.target.value));
            }}
            className="rounded-xl border border-amber-300 bg-white px-2.5 py-1.5 font-bold text-slate-900 cursor-pointer"
          >
            {TWENTY_SEVEN_STARS_TE.map((starTe, idx) => (
              <option key={idx} value={idx}>
                ★ {language === 'en' ? TWENTY_SEVEN_STARS_EN[idx] : `${starTe} (${TWENTY_SEVEN_STARS_EN[idx]})`}
              </option>
            ))}
          </select>

          <select
            aria-label={t('జన్మ రాశి', 'Moon Sign')}
            value={natalRashiIdx}
            onChange={(e) => {
              setSelectedProfileId('custom');
              setNatalRashiIdx(Number(e.target.value));
            }}
            className="rounded-xl border border-amber-300 bg-white px-2.5 py-1.5 font-bold text-slate-900 cursor-pointer"
          >
            {RASHI_META_LIST.map((r, idx) => (
              <option key={r.id} value={idx}>
                ☽ {language === 'en' ? r.englishName : r.teluguName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Score & Insights Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Left Score Card */}
        <div
          className={`md:col-span-4 rounded-2xl border p-4 flex flex-col justify-between gap-2 ${cardToneClass}`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>{t('నేటి అనుకూలత', 'Today Alignment')}</span>
            <span className="inline-flex items-center gap-1">
              <UserCheck size={13} className="text-amber-700" />
              {language === 'en' ? TWENTY_SEVEN_STARS_EN[natalNakIdx] : TWENTY_SEVEN_STARS_TE[natalNakIdx]}
            </span>
          </div>

          <div className="py-1">
            <div className={`text-4xl font-mono tabular-nums font-extrabold ${scoreToneClass}`}>
              {report.scorePercent}%
            </div>
            <div className={`text-xs sm:text-sm font-extrabold mt-0.5 ${scoreToneClass}`}>
              {t(report.statusTe, report.statusEn)}
            </div>
          </div>

          <div className="text-[11px] text-slate-700 pt-2 border-t border-amber-200/80 space-y-0.5">
            <div>
              <strong>{t('తారాబలం:', 'Tarabalam:')}</strong> {t(report.taraInfoTe, report.taraInfoEn)}
            </div>
            <div>
              <strong>{t('చంద్రబలం:', 'Chandrabalam:')}</strong>{' '}
              {t(report.chandraStatusTe, report.chandraStatusEn)}
            </div>
          </div>
        </div>

        {/* Right Advice Grid */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3.5 space-y-1">
            <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-700" />
              <span>{t('నేటి శుభ సమయం (Lucky Hours)', 'Peak Lucky Hours Today')}</span>
            </div>
            <p className="font-mono font-bold text-emerald-900">
              {t(report.luckyHoursTe, report.luckyHoursEn)}
            </p>
            <p className="text-slate-600 pt-1">
              {t(
                `నేటి పంచాంగ చంద్రుడు: ${report.todayMoonSignTe} · నక్షత్రం: ${report.todayNakshatraTe}`,
                `Today Moon: ${report.todayMoonSignTe} · Star: ${report.todayNakshatraTe}`
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3.5 space-y-1">
            <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
              <Star size={14} className="text-amber-700" />
              <span>{t('నేడు ఏమి చేయాలి? (Best Actions)', 'Recommended Focus Today')}</span>
            </div>
            <p className="text-slate-800 leading-relaxed">{t(report.doAdviceTe, report.doAdviceEn)}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3.5 space-y-1">
            <div className="font-extrabold text-rose-900 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-rose-700" />
              <span>{t('జాగ్రత్త సమయం (Avoid Window)', 'Caution Window')}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{t(report.avoidAdviceTe, report.avoidAdviceEn)}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-3.5 space-y-1">
            <div className="font-extrabold text-amber-950">
              {t('నేటి వ్యక్తిగత మంత్రం (Daily Remedy)', 'Daily Protective Mantra')}
            </div>
            <p className="text-amber-900 font-bold leading-relaxed">{report.mantraTe}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
