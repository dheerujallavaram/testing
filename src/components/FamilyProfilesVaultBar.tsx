import React, { useEffect, useMemo, useState } from 'react';
import { Users, BookmarkPlus, Trash2, AlertTriangle, CheckCircle2, Sparkles, Cloud, LogOut } from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useLanguage } from '../context/LanguageContext';
import { DayData } from '../types/panchangam';
import { WEEK_DATA } from '../data/panchangamData';
import { getTodayAndTomorrowIds } from '../utils/panchangaLogic';
import {
  FAMILY_RELATIONS,
  FamilyBirthProfile,
  computeFamilyDailyStatuses,
  deleteFamilyProfile,
  loadFamilyProfiles,
  mergeCloudFamilyProfiles,
  saveFamilyProfile,
} from '../utils/familyProfilesVault';
import {
  auth,
  deleteFamilyVaultProfileFromFirestore,
  signInWithGooglePopup,
  signOutAdmin,
  subscribeUserFamilyVault,
  upsertFamilyVaultProfileInFirestore,
} from '../firebase';

interface FamilyProfilesVaultBarProps {
  currentName: string;
  currentBirthDate: string;
  currentBirthTime: string;
  currentCityId: string;
  onLoadProfile: (profile: FamilyBirthProfile, janmaRashiId?: string) => void;
  day?: DayData;
  compactMode?: boolean;
}

export const FamilyProfilesVaultBar: React.FC<FamilyProfilesVaultBarProps> = ({
  currentName,
  currentBirthDate,
  currentBirthTime,
  currentCityId,
  onLoadProfile,
  day,
  compactMode = false,
}) => {
  const { t, language } = useLanguage();
  const [profiles, setProfiles] = useState<FamilyBirthProfile[]>(() => loadFamilyProfiles());
  const [selectedRelationIdx, setSelectedRelationIdx] = useState<number>(0);
  const [justSavedMsg, setJustSavedMsg] = useState<string | null>(null);
  const [cloudUser, setCloudUser] = useState<User | null>(() => auth.currentUser);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  useEffect(() => {
    const syncHandler = () => setProfiles(loadFamilyProfiles());
    window.addEventListener('slgj-family-vault-updated', syncHandler);
    return () => window.removeEventListener('slgj-family-vault-updated', syncHandler);
  }, []);

  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setCloudUser(u);
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }
      if (u && u.emailVerified) {
        unsubFirestore = subscribeUserFamilyVault(u.uid, (cloudItems) => {
          const merged = mergeCloudFamilyProfiles(cloudItems);
          setProfiles(merged);
          window.dispatchEvent(new Event('slgj-family-vault-updated'));
        });
      }
    });
    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  const referenceDay = useMemo(() => {
    if (day) return day;
    const { todayId } = getTodayAndTomorrowIds(WEEK_DATA);
    return WEEK_DATA.find((d) => d.isoDate === todayId) || WEEK_DATA[0];
  }, [day]);

  const dailyStatuses = useMemo(
    () => computeFamilyDailyStatuses(profiles, referenceDay),
    [profiles, referenceDay]
  );

  const handleCloudSignInAndSync = async () => {
    setIsSyncingCloud(true);
    try {
      const user = await signInWithGooglePopup();
      if (user && user.emailVerified) {
        const currentLocal = loadFamilyProfiles();
        for (const p of currentLocal) {
          await upsertFamilyVaultProfileInFirestore({
            localProfileId: p.id,
            name: p.name,
            relationTe: p.relationTe,
            relationEn: p.relationEn,
            birthDate: p.birthDate,
            birthTime: p.birthTime,
            cityId: p.cityId,
          });
        }
        setJustSavedMsg(
          language === 'en'
            ? `Synced ${currentLocal.length} profiles to Google Cloud!`
            : `మీ ${currentLocal.length} కుటుంబ జాతకాలు Google Cloud కి సింక్ అయ్యాయి!`
        );
        setTimeout(() => setJustSavedMsg(null), 3500);
      }
    } catch {
      // ignore popup close
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleSaveCurrent = () => {
    const rel = FAMILY_RELATIONS[selectedRelationIdx] || FAMILY_RELATIONS[0];
    const updated = saveFamilyProfile({
      name: currentName,
      relationTe: rel.te,
      relationEn: rel.en,
      birthDate: currentBirthDate,
      birthTime: currentBirthTime,
      cityId: currentCityId,
    });
    setProfiles(updated);
    window.dispatchEvent(new Event('slgj-family-vault-updated'));
    const savedEntry = updated.find(
      (p) => p.name.trim().toLowerCase() === currentName.trim().toLowerCase() && p.birthDate === currentBirthDate
    );
    if (cloudUser && cloudUser.emailVerified && savedEntry) {
      void upsertFamilyVaultProfileInFirestore({
        localProfileId: savedEntry.id,
        name: savedEntry.name,
        relationTe: savedEntry.relationTe,
        relationEn: savedEntry.relationEn,
        birthDate: savedEntry.birthDate,
        birthTime: savedEntry.birthTime,
        cityId: savedEntry.cityId,
      });
    }
    setJustSavedMsg(
      language === 'en'
        ? `Saved "${currentName}" to Family Vault`
        : `"${currentName}" గారి జాతకం కుటుంబ ఖాతాలో సేవ్ చేయబడింది`
    );
    setTimeout(() => setJustSavedMsg(null), 3000);
  };

  const handleDelete = (id: string) => {
    const updated = deleteFamilyProfile(id);
    setProfiles(updated);
    window.dispatchEvent(new Event('slgj-family-vault-updated'));
    if (cloudUser && cloudUser.emailVerified) {
      void deleteFamilyVaultProfileFromFirestore(id);
    }
  };

  if (compactMode && dailyStatuses.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white/95 border border-amber-300 p-4 space-y-3 shadow-2xs no-print">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-amber-800 shrink-0" />
          <div>
            <h3 className="text-sm font-extrabold text-amber-950">
              {t(
                'నా కుటుంబ జాతకాలు & నేటి తారాబలం (Family Horoscope Vault)',
                'My Family Kundali Vault & Today’s Tarabalam'
              )}
            </h3>
            <p className="text-[11px] text-slate-600">
              {t(
                'మీ కుటుంబ సభ్యుల జన్మ వివరాలను మీ బ్రౌజర్‌లో భద్రపరచి, ప్రతి రోజు ఎవరికి శుభ తారాబలం లేదా చంద్రాష్టమం ఉందో ఒకే చోట చూడండి.',
                'Save family birth profiles locally in your browser for 1-click Kundali switching and live daily Tarabalam / Chandrashtamam alerts.'
              )}
            </p>
          </div>
        </div>

        {!compactMode && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              aria-label={t('కుటుంబ సంబంధం', 'Family Relation')}
              value={selectedRelationIdx}
              onChange={(e) => setSelectedRelationIdx(Number(e.target.value))}
              className="rounded-xl border border-amber-300 bg-amber-50/70 px-2.5 py-2 text-xs font-bold text-amber-950 focus:outline-none cursor-pointer"
            >
              {FAMILY_RELATIONS.map((r, i) => (
                <option key={r.en} value={i}>
                  {language === 'en' ? r.en : r.te}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleSaveCurrent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <BookmarkPlus size={14} />
              <span>{t('కుటుంబ ఖాతాలో సేవ్ చేయండి', 'Save to Family Vault')}</span>
            </button>
            {cloudUser ? (
              <button
                type="button"
                onClick={() => void signOutAdmin()}
                title={cloudUser.email || 'Cloud Sync Active'}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                <Cloud size={14} className="text-emerald-700" />
                <span>{t('క్లౌడ్ సింక్ ఆన్ ✓', 'Cloud Synced ✓')}</span>
                <LogOut size={12} className="text-slate-500" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSyncingCloud}
                onClick={handleCloudSignInAndSync}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors disabled:opacity-60"
              >
                <Cloud size={14} className="text-amber-800" />
                <span>{isSyncingCloud ? t('సింక్ అవుతోంది...', 'Syncing...') : t('Google క్లౌడ్ సింక్', 'Google Cloud Sync')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {justSavedMsg && (
        <div className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>{justSavedMsg}</span>
        </div>
      )}

      {dailyStatuses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {dailyStatuses.map((item) => {
            const isCaution = item.isChandrashtamam || item.overallStatus === 'caution';
            const isGood = item.overallStatus === 'favorable' && !item.isChandrashtamam;
            return (
              <div
                key={item.profile.id}
                className={`rounded-xl border p-3 flex flex-col justify-between gap-2 ${
                  isCaution
                    ? 'bg-rose-50/70 border-rose-300'
                    : isGood
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs sm:text-sm font-extrabold text-amber-950 truncate">
                        {item.profile.name}
                      </strong>
                      <span className="text-[10px] font-bold text-slate-600 shrink-0">
                        ({language === 'en' ? item.profile.relationEn : item.profile.relationTe.split(' (')[0]})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 mt-0.5">
                      {language === 'en'
                        ? `${item.janmaRashiEn} · ${item.janmaNakshatraEn} P${item.pada}`
                        : `${item.janmaRashiTe} · ${item.janmaNakshatraTe} (${item.pada}వ పాదం)`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.profile.id)}
                    aria-label={t('తొలగించు', 'Delete profile')}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-100 cursor-pointer transition-colors shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] pt-1.5 border-t border-amber-200/70">
                  <span
                    className={`inline-flex items-center gap-1 font-extrabold ${
                      isCaution ? 'text-rose-900' : isGood ? 'text-emerald-900' : 'text-amber-900'
                    }`}
                  >
                    {isCaution ? (
                      <AlertTriangle size={12} />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    <span>
                      {language === 'en'
                        ? `${item.taraNameEn} · Chandra H${item.chandraHouse}`
                        : `${item.taraNameTe} · చంద్రుడు ${item.chandraHouse}వ స్థానం`}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onLoadProfile(item.profile, item.janmaRashiId)}
                    className="text-[11px] font-extrabold text-amber-950 underline hover:text-orange-700 cursor-pointer whitespace-nowrap"
                  >
                    {compactMode ? t('రాశి చూడు →', 'View Sign →') : t('జాతకం లోడ్ →', 'Load Chart →')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
