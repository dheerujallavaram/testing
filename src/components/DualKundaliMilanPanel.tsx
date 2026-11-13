import React, { useMemo, useRef, useState } from 'react';
import {
  Heart,
  Download,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Scale,
  Clock,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useIsGuruAdmin } from '../utils/useIsGuruAdmin';
import { BIRTH_CITIES } from '../data/birthCitiesData';
import { FamilyBirthProfile, loadFamilyProfiles } from '../utils/familyProfilesVault';
import { computeFullDualKundaliMilan } from '../utils/dualKundaliMilanEngine';
import { exportVariableHeightJathakamPdf } from '../utils/dynamicVariableHeightPdfExporter';

export const DualKundaliMilanPanel: React.FC = () => {
  const { language, t } = useLanguage();
  const { isGuruAdmin } = useIsGuruAdmin();
  const printRef = useRef<HTMLDivElement | null>(null);
  const familyProfiles: FamilyBirthProfile[] = useMemo(() => loadFamilyProfiles(), []);

  const [brideName, setBrideName] = useState('సౌభాగ్యవతి లక్ష్మి (Bride)');
  const [brideDate, setBrideDate] = useState('1998-06-18');
  const [brideTime, setBrideTime] = useState('07:45');
  const [brideCityId, setBrideCityId] = useState('hyderabad');

  const [groomName, setGroomName] = useState('చిరంజీవి రాఘవ (Groom)');
  const [groomDate, setGroomDate] = useState('1996-11-12');
  const [groomTime, setGroomTime] = useState('10:20');
  const [groomCityId, setGroomCityId] = useState('vijayawada');

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const report = useMemo(
    () =>
      computeFullDualKundaliMilan(
        { name: brideName, birthDate: brideDate, birthTime: brideTime, cityId: brideCityId },
        { name: groomName, birthDate: groomDate, birthTime: groomTime, cityId: groomCityId }
      ),
    [brideName, brideDate, brideTime, brideCityId, groomName, groomDate, groomTime, groomCityId]
  );

  const handleLoadVaultPartner = (side: 'bride' | 'groom', profileId: string) => {
    const p = familyProfiles.find((x) => x.id === profileId);
    if (!p) return;
    if (side === 'bride') {
      setBrideName(p.name);
      setBrideDate(p.birthDate);
      setBrideTime(p.birthTime);
      setBrideCityId(p.cityId);
    } else {
      setGroomName(p.name);
      setGroomDate(p.birthDate);
      setGroomTime(p.birthTime);
      setGroomCityId(p.cityId);
    }
  };

  const handleDownloadMarriagePdf = async () => {
    if (!printRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const safeName = `${brideName.replace(/[^a-zA-Z0-9_-]/g, '') || 'Bride'}_${
        groomName.replace(/[^a-zA-Z0-9_-]/g, '') || 'Groom'
      }_Vivaha_Milan.pdf`;
      await exportVariableHeightJathakamPdf(printRef.current, safeName);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 font-telugu">
      {/* Input Forms for Bride & Groom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 no-print">
        {/* Bride Card */}
        <div className="rounded-2xl bg-rose-50/60 border border-rose-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-rose-200 pb-2">
            <h4 className="font-extrabold text-rose-950 text-sm sm:text-base">
              🌸 {t('వధువు జన్మ వివరాలు (Bride Details)', 'Bride Birth Details')}
            </h4>
            {familyProfiles.length > 0 && (
              <select
                aria-label="Load Bride from Vault"
                defaultValue=""
                onChange={(e) => handleLoadVaultPartner('bride', e.target.value)}
                className="text-[11px] font-bold rounded-lg border border-rose-300 bg-white px-2 py-1 text-rose-950"
              >
                <option value="">{t('Vault నుండి లోడ్...', 'From Vault...')}</option>
                {familyProfiles.map((fp) => (
                  <option key={fp.id} value={fp.id}>
                    {fp.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="block space-y-1">
              <span className="font-bold text-slate-700">{t('పేరు (Name)', 'Name')}</span>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 font-bold"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-slate-700">{t('జన్మ తేదీ (DOB)', 'Birth Date')}</span>
              <input
                type="date"
                value={brideDate}
                onChange={(e) => setBrideDate(e.target.value)}
                className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 font-bold"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-slate-700">{t('సమయం (Time)', 'Birth Time')}</span>
              <input
                type="time"
                value={brideTime}
                onChange={(e) => setBrideTime(e.target.value)}
                className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 font-bold"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-slate-700">{t('జన్మ స్థలం (City)', 'Birth City')}</span>
              <select
                value={brideCityId}
                onChange={(e) => setBrideCityId(e.target.value)}
                className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 font-bold"
              >
                {BIRTH_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'en' ? c.labelEn : c.labelTe}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Groom Card */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-2">
            <h4 className="font-extrabold text-amber-950 text-sm sm:text-base">
              🔱 {t('వరుడి జన్మ వివరాలు (Groom Details)', 'Groom Birth Details')}
            </h4>
            {familyProfiles.length > 0 && (
              <select
                aria-label="Load Groom from Vault"
                defaultValue=""
                onChange={(e) => handleLoadVaultPartner('groom', e.target.value)}
                className="text-[11px] font-bold rounded-lg border border-amber-300 bg-white px-2 py-1 text-amber-950"
              >
                <option value="">{t('Vault నుండి లోడ్...', 'From Vault...')}</option>
                {familyProfiles.map((fp) => (
                  <option key={fp.id} value={fp.id}>
                    {fp.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="block space-y-1">
              <span className="font-bold text-slate-700">{t('పేరు (Name)', 'Name')}</span>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 font-bold"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-slate-700">{t('జన్మ తేదీ (DOB)', 'Birth Date')}</span>
              <input
                type="date"
                value={groomDate}
                onChange={(e) => setGroomDate(e.target.value)}
                className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 font-bold"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-slate-700">{t('సమయం (Time)', 'Birth Time')}</span>
              <input
                type="time"
                value={groomTime}
                onChange={(e) => setGroomTime(e.target.value)}
                className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 font-bold"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-slate-700">{t('జన్మ స్థలం (City)', 'Birth City')}</span>
              <select
                value={groomCityId}
                onChange={(e) => setGroomCityId(e.target.value)}
                className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 font-bold"
              >
                {BIRTH_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'en' ? c.labelEn : c.labelTe}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Action Bar: Download Complete Marriage Compatibility PDF (Admin / Studio Only) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#2c0902] via-amber-950 to-[#2c0902] text-white rounded-2xl p-4 border border-amber-500/70 no-print">
        <div className="text-xs sm:text-sm">
          <strong className="text-amber-300 block">
            {t('సంపూర్ణ D1 + నవాంశ D9 + కుజదోష + పాపసామ్య పొంతన సిద్ధం', 'Full D1 + Navamsa D9 + Kuja Dosha + Papasamyam Ready')}
          </strong>
          <span className="text-amber-100/80">
            {isGuruAdmin
              ? t('🔒 అడ్మిన్ / AI Studio: ఈ పూర్తి వివాహ పొంతన రిపోర్టును PDF గా డౌన్‌లోడ్ చేసుకోండి.', '🔒 Admin / Studio: Download printable Telugu/English Marriage Compatibility PDF.')
              : t('ఈ వివాహ పొంతన ఫలితాలను క్రింద పూర్తిగా చదవండి లేదా గురువుగారి సలహా కోసం వాట్సాప్ చేయండి.', 'Read the complete compatibility analysis below or consult Guruji on WhatsApp.')}
          </span>
        </div>
        {isGuruAdmin ? (
          <button
            type="button"
            onClick={handleDownloadMarriagePdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm shadow-md cursor-pointer disabled:opacity-60"
          >
            {isGeneratingPdf ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            <span>
              {isGeneratingPdf
                ? t('PDF తయారవుతోంది...', 'Generating PDF...')
                : t('🔒 వివాహ పొంతన PDF డౌన్‌లోడ్', '🔒 Download Vivaha Milan PDF')}
            </span>
          </button>
        ) : (
          <a
            href={`https://wa.me/918977986166?text=${encodeURIComponent(
              `నమస్కారం శ్రీ ధీరజ్ శర్మ గారు, వధూవరుల (${brideName} & ${groomName}) వివాహ పొంతన మరియు ముహూర్త పరిశీలన కొరకు సంప్రదిస్తున్నాను.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white font-extrabold text-xs sm:text-sm shadow-md"
          >
            <span>💬 {t('వాట్సాప్‌లో గురువుగారిని సంప్రదించండి', 'Consult Guruji on WhatsApp')}</span>
          </a>
        )}
      </div>

      {/* Printable Report Sheet */}
      <div ref={printRef}>
        <div className="page print-page-sheet bg-white rounded-3xl p-5 sm:p-7 border border-amber-300 shadow-sm space-y-6">
          {/* Header Banner */}
          <div className="text-center border-b-2 border-amber-200 pb-4 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800 block">
              {t('శ్రీ లక్ష్మీ గణపతి జ్యోతిషాలయం · సంపూర్ణ వధూవర కుండలి మేళన పత్రిక', 'Sri Lakshmi Ganapathi Jyothishalayam · Complete Dual Kundali Milan')}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950">
              {report.brideName} 💍 {report.groomName}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="px-4 py-1.5 rounded-full bg-amber-950 text-amber-200 font-extrabold text-sm">
                {t('మొత్తం స్కోర్:', 'Overall Match:')} {report.finalCompatibilityPct}%
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs">
                {t('అష్టకూట:', 'Ashta Koota:')} {report.ashtaKootaOutOf36} / 36
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs">
                {t('22 పొంతనలు:', '22 Poruthams:')} {report.porutham22.matchedCount} / 22
              </span>
            </div>
            <p className="text-sm font-extrabold text-emerald-900 pt-1">
              {t(report.finalVerdictTe, report.finalVerdictEn)}
            </p>
          </div>

          {/* Natal D1/D9 Snapshot Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-1.5">
              <strong className="text-sm text-rose-950 block">{report.brideName}</strong>
              <div>
                {t('జన్మ రాశి & నక్షత్రం:', 'Moon Sign & Star:')}{' '}
                <strong>
                  {language === 'en'
                    ? `${report.brideChart.rashi.en} · ${report.brideChart.nakshatraEn} P${report.brideChart.pada}`
                    : `${report.brideChart.rashi.te} · ${report.brideChart.nakshatraName} (${report.brideChart.pada}వ పాదం)`}
                </strong>
              </div>
              <div>
                {t('D1 లగ్నం / D9 నవాంశ:', 'D1 Lagna / D9 Navamsa:')}{' '}
                <strong>
                  {language === 'en'
                    ? `${report.brideChart.lagna.en} / ${report.brideChart.navamshaLagna.en}`
                    : `${report.brideChart.lagna.te} / ${report.brideChart.navamshaLagna.te}`}
                </strong>
              </div>
              <div>
                {t('ప్రస్తుత మహాదశ:', 'Current Mahadasha:')}{' '}
                <strong>{report.brideCurrentDashaTe}</strong>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 space-y-1.5">
              <strong className="text-sm text-amber-950 block">{report.groomName}</strong>
              <div>
                {t('జన్మ రాశి & నక్షత్రం:', 'Moon Sign & Star:')}{' '}
                <strong>
                  {language === 'en'
                    ? `${report.groomChart.rashi.en} · ${report.groomChart.nakshatraEn} P${report.groomChart.pada}`
                    : `${report.groomChart.rashi.te} · ${report.groomChart.nakshatraName} (${report.groomChart.pada}వ పాదం)`}
                </strong>
              </div>
              <div>
                {t('D1 లగ్నం / D9 నవాంశ:', 'D1 Lagna / D9 Navamsa:')}{' '}
                <strong>
                  {language === 'en'
                    ? `${report.groomChart.lagna.en} / ${report.groomChart.navamshaLagna.en}`
                    : `${report.groomChart.lagna.te} / ${report.groomChart.navamshaLagna.te}`}
                </strong>
              </div>
              <div>
                {t('ప్రస్తుత మహాదశ:', 'Current Mahadasha:')}{' '}
                <strong>{report.groomCurrentDashaTe}</strong>
              </div>
            </div>
          </div>

          {/* 4 Deep Vedic Checks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Kuja Dosha */}
            <div className={`rounded-2xl border p-4 space-y-2 ${report.kujaMutualCompatible ? 'border-emerald-300 bg-emerald-50/40' : 'border-rose-300 bg-rose-50/40'}`}>
              <div className="flex items-center gap-1.5 font-extrabold text-sm text-amber-950">
                {report.kujaMutualCompatible ? <CheckCircle2 size={15} className="text-emerald-700" /> : <ShieldAlert size={15} className="text-rose-700" />}
                <span>{t('1. కుజ దోష & భంగ పరిశీలన (Kuja Dosha Check)', '1. Kuja (Mangal) Dosha & Cancellation')}</span>
              </div>
              <div>
                <strong>{t('వధువు:', 'Bride:')}</strong> {t(report.brideKuja.severityTe, report.brideKuja.severityEn)} — {t(report.brideKuja.reasonTe, report.brideKuja.reasonEn)}
              </div>
              <div>
                <strong>{t('వరుడు:', 'Groom:')}</strong> {t(report.groomKuja.severityTe, report.groomKuja.severityEn)} — {t(report.groomKuja.reasonTe, report.groomKuja.reasonEn)}
              </div>
              <p className="font-bold text-amber-950 pt-1 border-t border-amber-200/70">
                {t(report.kujaSummaryTe, report.kujaSummaryEn)}
              </p>
            </div>

            {/* Papasamyam */}
            <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-4 space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-sm text-amber-950">
                <Scale size={15} className="text-amber-700" />
                <span>{t('2. పాపసామ్య బలం (Papasamyam Balance)', '2. Papasamyam Dosha Points')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white border border-amber-200 p-2.5">
                  <div className="text-[11px] text-slate-500">{t('వధువు పాప బిందువులు', 'Bride Papa Pts')}</div>
                  <div className="text-lg font-extrabold font-mono text-amber-950">{report.bridePapasamyam.totalPoints}</div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    {(language === 'en' ? report.bridePapasamyam.breakdownEn : report.bridePapasamyam.breakdownTe).join(' · ')}
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-amber-200 p-2.5">
                  <div className="text-[11px] text-slate-500">{t('వరుడు పాప బిందువులు', 'Groom Papa Pts')}</div>
                  <div className="text-lg font-extrabold font-mono text-amber-950">{report.groomPapasamyam.totalPoints}</div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    {(language === 'en' ? report.groomPapasamyam.breakdownEn : report.groomPapasamyam.breakdownTe).join(' · ')}
                  </div>
                </div>
              </div>
              <p className="font-bold text-amber-900">{t(report.papasamyamVerdictTe, report.papasamyamVerdictEn)}</p>
            </div>

            {/* D9 Navamsa Synastry */}
            <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-4 space-y-1.5">
              <div className="flex items-center justify-between font-extrabold text-sm text-amber-950">
                <span className="flex items-center gap-1.5">
                  <Heart size={15} className="text-rose-600" />
                  <span>{t('3. నవాంశ (D-9) దాంపత్య బలం', '3. Navamsa (D-9) Synastry')}</span>
                </span>
                <span className="font-mono text-emerald-800">{report.d9SynastryScorePct}%</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {t(report.d9SynastrySummaryTe, report.d9SynastrySummaryEn)}
              </p>
            </div>

            {/* Dasha Sandhi */}
            <div className="rounded-2xl border border-amber-200 bg-[#fffdf9] p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 font-extrabold text-sm text-amber-950">
                <Clock size={15} className="text-amber-700" />
                <span>{t('4. దశా సంధి & భవిష్యత్ సమన్వయం', '4. Dasha Sandhi Overlap Check')}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {t(report.dashaSandhiSummaryTe, report.dashaSandhiSummaryEn)}
              </p>
            </div>
          </div>

          {/* Remedies */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 space-y-2 text-xs">
            <div className="font-extrabold text-amber-950 flex items-center gap-1.5 text-sm">
              <Sparkles size={15} className="text-amber-700" />
              <span>{t('శాస్త్రోక్త పరిహారాలు & శుభ సూచనలు (Vedic Remedies)', 'Recommended Vedic Remedies & Guidance')}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-800">
              {(language === 'en' ? report.remediesEn : report.remediesTe).map((rem, idx) => (
                <li key={idx}>{rem}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
