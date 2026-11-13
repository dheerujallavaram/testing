import React, { useMemo, useState } from 'react';
import { Calendar, Clock, Sparkles, MessageCircle, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RASHI_META_LIST } from '../utils/panchangaLogic';
import { FamilyBirthProfile, loadFamilyProfiles } from '../utils/familyProfilesVault';
import { computeAccurateJanmaKundali } from '../utils/astronomyPanchangam';
import { BIRTH_CITIES } from '../data/birthCitiesData';
import {
  TWENTY_SEVEN_STARS_EN,
  TWENTY_SEVEN_STARS_TE,
} from '../utils/expandedAstrologyCalculators';
import {
  MUHURTHAM_EVENT_OPTIONS,
  MuhurthamEventType,
  scanNext90DaysPersonalMuhurthams,
} from '../utils/personalMuhurthamScanner';

export const PersonalMuhurthamFinderPanel: React.FC = () => {
  const { language, t } = useLanguage();
  const familyProfiles: FamilyBirthProfile[] = useMemo(() => loadFamilyProfiles(), []);

  const [eventType, setEventType] = useState<MuhurthamEventType>('gruhapravesam');
  const [userNakIdx, setUserNakIdx] = useState<number>(3); // Rohini
  const [userRashiIdx, setUserRashiIdx] = useState<number>(1); // Vrushabham

  const handleLoadVault = (profId: string) => {
    const found = familyProfiles.find((p) => p.id === profId);
    if (!found) return;
    const city = BIRTH_CITIES.find((c) => c.id === found.cityId) || BIRTH_CITIES[0];
    const astro = computeAccurateJanmaKundali(found.birthDate, found.birthTime, city.lat, city.lon, city.tz);
    const moon = astro.planets[2];
    if (moon) {
      setUserNakIdx(moon.nakshatraIdx);
      setUserRashiIdx(moon.rashiIdx);
    }
  };

  const slots = useMemo(
    () => scanNext90DaysPersonalMuhurthams(eventType, userNakIdx, userRashiIdx),
    [eventType, userNakIdx, userRashiIdx]
  );

  const selectedEventObj = MUHURTHAM_EVENT_OPTIONS.find((e) => e.id === eventType) || MUHURTHAM_EVENT_OPTIONS[0];

  return (
    <section
      aria-label="Personal 90-Day Muhurtham Finder"
      className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-sm space-y-5 font-telugu"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block">
            {t(
              'వ్యక్తిగత 90-రోజుల శుభ ముహూర్త స్కానర్ • Drik-Siddhanta 90-Day Scanner',
              'Personal 90-Day Auspicious Muhurtham Finder'
            )}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2 mt-0.5">
            <Calendar size={20} className="text-amber-700 shrink-0" />
            <span>
              {t(
                'మీ జన్మ నక్షత్రానికి తారాబలం + చంద్రబలం ఉన్న టాప్-10 శుభ ముహూర్తాలు',
                'Top 10 Personal Shubha Muhurthams in Next 90 Days'
              )}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'అమావాస్య, రిక్త తిథులు, చంద్రాష్టమం మరియు రాహుకాలం వడపోసి శుభ లగ్నంతో ఉన్న తేదీలు.',
              'Automatically filters out Amavasya, Riktha Tithis, Chandrashtamam, and Rahu Kalam overlaps.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {familyProfiles.length > 0 && (
            <select
              aria-label={t('కుటుంబ ప్రొఫైల్', 'Load Family Profile')}
              defaultValue=""
              onChange={(e) => handleLoadVault(e.target.value)}
              className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 font-bold text-amber-950 cursor-pointer"
            >
              <option value="">{t('Family Vault నుండి లోడ్...', 'Load from Vault...')}</option>
              {familyProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  👤 {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <label className="block space-y-1">
          <span className="font-bold text-slate-700">{t('శుభ కార్యం (Ceremony Type)', 'Select Ceremony')}</span>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value as MuhurthamEventType)}
            className="w-full rounded-xl border border-amber-300 bg-amber-50/40 px-3 py-2.5 font-bold text-amber-950 cursor-pointer"
          >
            {MUHURTHAM_EVENT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {language === 'en' ? opt.labelEn : opt.labelTe}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="font-bold text-slate-700">{t('మీ జన్మ నక్షత్రం (Birth Star)', 'Your Janma Nakshatra')}</span>
          <select
            value={userNakIdx}
            onChange={(e) => setUserNakIdx(Number(e.target.value))}
            className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2.5 font-bold text-slate-900 cursor-pointer"
          >
            {TWENTY_SEVEN_STARS_TE.map((starTe, idx) => (
              <option key={idx} value={idx}>
                {language === 'en' ? TWENTY_SEVEN_STARS_EN[idx] : `${starTe} (${TWENTY_SEVEN_STARS_EN[idx]})`}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="font-bold text-slate-700">{t('మీ జన్మ రాశి (Moon Sign)', 'Your Moon Sign')}</span>
          <select
            value={userRashiIdx}
            onChange={(e) => setUserRashiIdx(Number(e.target.value))}
            className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2.5 font-bold text-slate-900 cursor-pointer"
          >
            {RASHI_META_LIST.map((r, idx) => (
              <option key={r.id} value={idx}>
                {language === 'en' ? r.englishName : r.teluguName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Results Grid */}
      {slots.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-950 font-bold">
          {t(
            'ఈ నక్షత్రానికి రాబోయే 90 రోజుల్లో అత్యుత్తమ ముహూర్తాలు తక్కువగా ఉన్నాయి. గురువుగారిని సంప్రదించి ప్రత్యేకించి ముహూర్త శోధన చేయించుకోండి.',
            'Very few high-score dates match all filters in the next 90 days; please consult Guruji for custom Lagna rectification.'
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {slots.map((slot, idx) => {
            const waText = encodeURIComponent(
              `నమస్కారం శ్రీ సాయి ధీరజ్ శర్మ గారు, ${selectedEventObj.labelTe} కోసం ${slot.isoDate} (${slot.weekdayTe}, ${slot.tithiTe}, ${slot.nakshatraTe}) తేదీ ${slot.shubhaLagnaNameTe} (${slot.shubhaLagnaWindow}) శుభ ముహూర్తాన్ని నిర్ధారించగలరు.`
            );
            return (
              <div
                key={slot.isoDate}
                className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-4 flex flex-col justify-between gap-2.5 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-amber-800">
                      #{idx + 1} · {slot.displayDateEn} ({t(slot.weekdayTe, slot.weekdayEn)})
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-amber-950 mt-0.5">
                      {t(slot.tithiTe, slot.tithiEn)} · {t(slot.nakshatraTe, slot.nakshatraEn)}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs font-mono shrink-0">
                    {slot.score}%
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Clock size={13} className="text-emerald-700 shrink-0" />
                    <span>
                      {t('శుభ లగ్నం:', 'Best Lagna:')} {slot.shubhaLagnaNameTe} ({slot.shubhaLagnaWindow})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Star size={12} className="text-amber-600 shrink-0" />
                    <span>{t(slot.reasonTe, slot.reasonEn)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles size={12} />
                    {t(slot.taraNameTe, slot.taraNameEn)}
                  </span>
                  <a
                    href={`https://wa.me/918977986166?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    <MessageCircle size={12} />
                    <span>{t('ముహూర్తం నిర్ధారించుకోండి', 'Confirm with Guruji')}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
