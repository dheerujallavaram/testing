import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, ShieldAlert, CheckCircle2, Info, Calendar, ArrowRight } from 'lucide-react';
import {
  RASHI_LIST,
  RashiSlug,
  computeGocharaForRashi,
  findRashiBySlug,
} from '../utils/gocharaEngine';
import gocharaAuthorContent from '../data/gocharaAuthorContent.json';
import { useLanguage } from '../context/LanguageContext';

export interface GocharaPhalaluViewProps {
  initialPathname?: string;
  onNavigateGocharaRoute?: (path: string) => void;
  onNavigateToolRoute?: (path: string) => void;
}

export const GocharaPhalaluView: React.FC<GocharaPhalaluViewProps> = ({
  initialPathname,
  onNavigateGocharaRoute,
  onNavigateToolRoute,
}) => {
  const { t } = useLanguage();

  const resolveInitialRashi = (pathStr?: string): RashiSlug => {
    const clean = (
      pathStr ||
      (typeof window !== 'undefined' ? window.location.pathname : '/gochara-phalalu')
    )
      .toLowerCase()
      .replace(/\/+$/, '');
    const m = clean.match(
      /^\/gochara-phalalu\/(mesham|vrushabham|mithunam|karkatakam|simham|kanya|tula|vruschikam|dhanussu|makaram|kumbham|meenam)$/
    );
    if (m) return m[1] as RashiSlug;
    return 'mesham';
  };

  const [selectedRashi, setSelectedRashi] = useState<RashiSlug>(() =>
    resolveInitialRashi(initialPathname)
  );

  useEffect(() => {
    if (initialPathname) {
      setSelectedRashi(resolveInitialRashi(initialPathname));
    }
  }, [initialPathname]);

  const report = computeGocharaForRashi(selectedRashi);

  const handleRashiSelect = (slug: RashiSlug, updateUrl = false) => {
    setSelectedRashi(slug);
    if (updateUrl && onNavigateGocharaRoute) {
      onNavigateGocharaRoute(`/gochara-phalalu/${slug}`);
    }
  };

  return (
    <div id="gochara-phalalu-section" className="space-y-8 font-telugu">
      {/* Sub-navigation for Gochara Routes */}
      <nav
        aria-label="Gochara Phalalu Navigation"
        className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          {[
            { path: '/gochara-phalalu', labelTe: 'గోచార ఫలాలు (Hub)' },
            { path: '/gochara-phalalu/shani', labelTe: 'శని గోచారం' },
            { path: '/gochara-phalalu/guru', labelTe: 'గురు గోచారం' },
            { path: '/gochara-phalalu/rahu-ketu', labelTe: 'రాహు కేతు గోచారం' },
            { path: '/yelinati-shani', labelTe: 'ఏలినాటి శని ఫలాలు' },
          ].map((item) => {
            const currentPath =
              typeof window !== 'undefined'
                ? window.location.pathname.replace(/\/+$/, '')
                : initialPathname || '/gochara-phalalu';
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  if (onNavigateGocharaRoute) {
                    e.preventDefault();
                    onNavigateGocharaRoute(item.path);
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all ${
                  isActive
                    ? 'bg-amber-900 text-amber-100 border-amber-900 shadow-2xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
                }`}
              >
                {item.labelTe}
              </a>
            );
          })}
        </div>
        <span className="text-xs font-mono text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300">
          Calculation: Drik Siddhanta, NASA JPL DE440 Ephemeris, location Hyderabad, timezone IST ({report.computedAtIstIso})
        </span>
      </nav>

      {/* Janma Rashi Selector */}
      <section
        aria-label="Select Janma Rashi for Gochara Phalalu"
        className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-400 shadow-md space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Compass size={14} className="text-amber-700" />
              <span>{t('చంద్ర రాశి ఆధారిత గ్రహ గోచార గణన • Moon-Sign Transit Calculator', 'Moon-Sign Transit Calculator')}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 mt-1">
              మీ జన్మ రాశిని ఎంచుకోండి ({report.rashi.nameTe} – {report.rashi.nameEn})
            </h2>
          </div>
          <div className="text-xs font-bold text-amber-900 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-300">
            రాశ్యాధిపతి: <strong className="text-amber-950">{report.rashi.lordTe}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {RASHI_LIST.map((r) => {
            const isSelected = r.slug === selectedRashi;
            return (
              <a
                key={r.slug}
                href={`/gochara-phalalu/${r.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleRashiSelect(r.slug, true);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-900 to-[#3b0a11] text-white border-amber-600 shadow-md'
                    : 'bg-amber-50/60 hover:bg-amber-100/80 text-amber-950 border-amber-200'
                }`}
              >
                <span className="text-[11px] opacity-80 block font-mono">రాశి #{r.index}</span>
                <strong className="text-sm sm:text-base font-extrabold block">{r.nameTe}</strong>
                <span className="text-[11px] opacity-85 block truncate">{r.nameEn.split(' ')[0]}</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Major Transit Highlights: Saturn, Jupiter, Rahu, Ketu */}
      <section
        aria-label="Major Planetary Transits from Selected Moon Sign"
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {[
          {
            titleTe: 'శని గోచారం (Saturn Transit)',
            planet: report.saturn,
            extraBadge: report.sadeSatiStatusTe,
          },
          {
            titleTe: 'గురు గోచారం (Jupiter Transit)',
            planet: report.jupiter,
            extraBadge: [2, 5, 7, 9, 11].includes(report.jupiter.houseFromMoon)
              ? 'శుభ గురు బలం ఉన్నది (Auspicious Guru Balam)'
              : `గురువు ${report.jupiter.houseFromMoon}వ స్థానంలో సంచారం`,
          },
          {
            titleTe: 'రాహు గోచారం (Rahu Transit)',
            planet: report.rahu,
            extraBadge: `రాహువు ${report.rahu.houseFromMoon}వ స్థానంలో సంచారం`,
          },
          {
            titleTe: 'కేతు గోచారం (Ketu Transit)',
            planet: report.ketu,
            extraBadge: `కేతువు ${report.ketu.houseFromMoon}వ స్థానంలో సంచారం`,
          },
        ].map(({ titleTe, planet, extraBadge }) => {
          const isGood = planet.guidance.status === 'auspicious';
          const isModerate = planet.guidance.status === 'moderate';
          return (
            <article
              key={planet.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-amber-100 pb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-amber-950">{titleTe}</h3>
                  <p className="text-xs sm:text-sm text-amber-900 font-bold mt-0.5">
                    ప్రస్తుత సంచారం: <span className="text-orange-900">{planet.rashiNameTe}</span> ({planet.degreeInRashi}, {planet.nakshatraTe} - {planet.pada}వ పాదం)
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                    isGood
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : isModerate
                        ? 'bg-amber-100 text-amber-950 border-amber-400'
                        : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  జన్మ రాశి నుండి {planet.houseFromMoon}వ స్థానం
                </span>
              </div>

              <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200 space-y-1.5">
                <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-700" />
                  <span>{planet.guidance.phaseTe} • {extraBadge}</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">{planet.guidance.summaryTe}</p>
                <p className="text-xs font-mono text-amber-800/90 bg-white/80 px-2.5 py-1 rounded border border-amber-200">
                  Author Interpretation Slot: {planet.guidance.placeholder} (బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి స్వీయ వివరణ స్థానం)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-rose-50/70 rounded-2xl p-3.5 border border-rose-200">
                  <strong className="text-rose-950 font-bold flex items-center gap-1.5 mb-1">
                    <ShieldAlert size={14} className="text-rose-700 shrink-0" />
                    <span>జాగ్రత్త వహించవలసినవి (What to be careful about):</span>
                  </strong>
                  <p className="text-slate-800 leading-relaxed">{planet.guidance.carefulTe}</p>
                </div>
                <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200">
                  <strong className="text-emerald-950 font-bold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                    <span>ఆచరించవలసినవి (What to do / Remedies):</span>
                  </strong>
                  <p className="text-slate-800 leading-relaxed">{planet.guidance.doTe}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Complete 9-Planet Gochara Table */}
      <section
        aria-label="All 9 Navagraha Current Transit Positions"
        className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-2xl font-extrabold text-amber-950">
            నవగ్రహాల ప్రస్తుత గోచార స్థితి పట్టిక ({report.rashi.nameTe} నుండి భావ గణన)
          </h2>
          <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
            <Calendar size={14} />
            <span>Asia/Kolkata (IST) – {report.computedAtIstIso}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-100 text-amber-950 font-bold">
                <th className="p-3 border border-amber-200">గ్రహం (Planet)</th>
                <th className="p-3 border border-amber-200">ప్రస్తుత గోచార రాశి (Transit Sign)</th>
                <th className="p-3 border border-amber-200">డిగ్రీలు &amp; నక్షత్ర పాదం</th>
                <th className="p-3 border border-amber-200">{report.rashi.nameTe} నుండి స్థానం</th>
                <th className="p-3 border border-amber-200">గోచార స్థితి (Transit Nature)</th>
              </tr>
            </thead>
            <tbody>
              {report.planets.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/70">
                  <td className="p-3 border border-amber-200 font-extrabold text-amber-950">
                    {p.nameTe}
                  </td>
                  <td className="p-3 border border-amber-200 font-semibold text-slate-900">
                    {p.rashiNameTe} ({p.rashiNameEn.split(' ')[0]})
                  </td>
                  <td className="p-3 border border-amber-200 font-mono text-slate-700">
                    {p.degreeInRashi} • {p.nakshatraTe} ({p.pada}వ పాదం)
                  </td>
                  <td className="p-3 border border-amber-200 font-bold text-amber-900">
                    {p.houseFromMoon}వ స్థానం ({p.houseFromMoon}th House)
                  </td>
                  <td className="p-3 border border-amber-200">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.isAuspiciousFromMoon
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-950 border border-amber-300'
                      }`}
                    >
                      {p.isAuspiciousFromMoon ? 'శుభ గోచారం (Favorable)' : 'మిశ్రమ / సంయమన కాలం (Balanced)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Standard Responsible Disclaimer */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300 flex items-start gap-2.5 text-xs sm:text-sm text-amber-950">
          <Info size={18} className="text-amber-800 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>{gocharaAuthorContent.metadata.disclaimerTe}</strong> ({gocharaAuthorContent.metadata.disclaimerEn})
          </p>
        </div>
      </section>

      {/* Descriptive Telugu Anchor Links to Core Pages */}
      <section
        aria-label="Related Telugu Astrology Tools"
        className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-300 shadow-2xs"
      >
        <h3 className="text-base sm:text-lg font-extrabold text-amber-950 mb-3">
          సంబంధిత వైదిక గణన సాధనాలు (Related Vedic Calculators)
        </h3>
        <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
          {[
            { href: '/', label: 'తెలుగు జ్యోతిషం – నేటి పంచాంగం (Home)' },
            { href: '/panchangam', label: 'నేటి పంచాంగం (Today Panchangam)' },
            { href: '/janma-kundali', label: 'జన్మ కుండలి తెలుగులో' },
            { href: '/vivaha-pontana', label: 'వివాహ పొంతన (36 గుణాలు)' },
            { href: '/dosha-pariharalu', label: 'ఏలినాటి శని & దోష పరిహారాలు' },
            { href: '/tarabalam-chandrabalam', label: 'తారాబలం క్యాలిక్యులేటర్' },
          ].map((lnk) => (
            <a
              key={lnk.href}
              href={lnk.href}
              onClick={(e) => {
                if (onNavigateToolRoute) {
                  e.preventDefault();
                  onNavigateToolRoute(lnk.href);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold"
            >
              <span>{lnk.label}</span>
              <ArrowRight size={13} className="text-amber-700" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
