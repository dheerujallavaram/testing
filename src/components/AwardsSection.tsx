import React, { useState } from 'react';
import { Award, Calendar, MapPin, ExternalLink, X, ZoomIn, Sparkles, CheckCircle2 } from 'lucide-react';

export interface AwardItem {
  id: string;
  title: string;
  englishTitle: string;
  category: 'certificate' | 'felicitation' | 'yagnam';
  image: string;
  date: string;
  venue: string;
  presentedBy: string;
  description: string;
  highlights: string[];
}

export const AWARDS_DATA: AwardItem[] = [
  {
    id: 'suvarna-kankanam-stage-presentation',
    title: 'సువర్ణ కంకణ పురస్కార వేదిక సత్కారం (విజయవాడ)',
    englishTitle: 'Suvarna Kankanam Stage Presentation at Vijayawada',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6307643032115201101_y_2acdb7f1.jpg',
    date: '23 మార్చి 2025',
    venue: 'హోటల్ గోల్డెన్ వే, విజయవాడ, ఆంధ్రప్రదేశ్',
    presentedBy: 'విశ్వజ్యోతి జ్యోతిష విజ్ఞాన సంస్థ (రిజి. 150/2021)',
    description: '15వ వేద జ్యోతిష సదస్సులో విశ్వజ్యోతి జ్యోతిష విజ్ఞాన సంస్థ ప్రముఖుల సమక్షంలో శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారికి వేదికపై సువర్ణ కంకణం, జ్ఞాపిక మరియు ప్రశంసా పత్రాన్ని బహూకరించిన శుభ తరుణం.',
    highlights: ['విజయవాడ రాష్ట్ర స్థాయి సదస్సు', 'సువర్ణ కంకణ పురస్కార వేదిక', 'జ్యోతిష పీఠ పండితుల సమక్షం'],
  },
  {
    id: 'suvarna-kankanam-certificate',
    title: 'శ్రీ క్రోధి నామ ఉగాది సువర్ణ కంకణ పురస్కారం - 2025',
    englishTitle: 'Suvarna Kankanam Ugadi Puraskaram 2025',
    category: 'certificate',
    image: '/assets/aistudio/photo_6307643032115201102_y_d0599c03.jpg',
    date: '23 మార్చి 2025',
    venue: 'విజయవాడ, ఆంధ్రప్రదేశ్',
    presentedBy: 'విశ్వజ్యోతి జ్యోతిష విజ్ఞాన సంస్థ (రిజి. 150/2021)',
    description: 'శ్రీ క్రోధి నామ సంవత్సర ఉగాది జ్యోతిష పురస్కారాలలో భాగంగా జ్యోతిష విజ్ఞాన పీఠం ఆధ్వర్యంలో శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారికి అత్యంత అరుదైన "సువర్ణ కంకణం" మరియు ప్రశంసా పత్రాన్ని ప్రదానం చేశారు.',
    highlights: ['ప్రతిష్టాత్మక సువర్ణ కంకణ గౌరవం', 'విశ్వజ్యోతి జ్యోతిష విజ్ఞాన సంస్థ పురస్కారం', 'రాష్ట్ర స్థాయి వేద సత్కారం'],
  },
  {
    id: 'global-prestigious-award',
    title: 'గ్లోబల్ ప్రెస్టీజియస్ అవార్డు (Global Prestigious Award)',
    englishTitle: 'Global Prestigious Award 2024',
    category: 'certificate',
    image: '/assets/aistudio/photo_6303093205754826524_y_b83c00d0.jpg',
    date: '03 నవంబర్ 2024',
    venue: 'సుదర్శన్ కన్వెన్షన్, హైదరాబాద్',
    presentedBy: 'గ్లోబల్ అచీవర్స్ ఫౌండేషన్ & ప్రెస్టీజ్ కౌన్సిల్',
    description: 'జ్యోతిష శాస్త్ర రంగంలో అందించిన నిరంతర సేవలు, వేలాది కుటుంబాలకు చూపిన సరైన ధార్మిక మార్గదర్శకత్వానికి గుర్తింపుగా గురువుగారికి గ్లోబల్ ప్రెస్టీజియస్ అవార్డు లభించింది.',
    highlights: ['అంతర్జాతీయ స్థాయి గుర్తింపు', 'ప్రశంసా పత్రం & మెమొంటో', 'సమాజ హిత జ్యోతిష సేవలు'],
  },
  {
    id: 'mahati-shiromani-turban',
    title: 'మహతి ఆడిటోరియంలో స్వర్ణ తలపాగా & శాలువా సత్కారం',
    englishTitle: 'Tirupati Mahati Stage Felicitation with Golden Turban',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6303093205754826523_y_8cc9215d.jpg',
    date: '11 డిసెంబర్ 2024',
    venue: 'మహతి ఆడిటోరియం, తిరుపతి',
    presentedBy: 'తితిదే & తిరుపతి పండిత పరిషత్',
    description: 'గురువుగారు స్వర్ణ తలపాగా (పేఠా), పట్టు శాలువా మరియు జ్యోతిష శిరోమణి పురస్కార పత్రాన్ని అందుకుంటున్న చారిత్రాత్మక ఘట్టం.',
    highlights: ['స్వర్ణ కిరీట సమాన తలపాగా గౌరవం', 'మహతి వేదికపై మహా సత్కారం'],
  },
  {
    id: 'suvarna-kankanam-stage',
    title: 'సువర్ణ కంకణ బంధన వేడుక (వేదిక ప్రత్యక్ష దృశ్యం)',
    englishTitle: 'Suvarna Kankanam Stage Presentation',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6303093205754826519_y_ae839518.jpg',
    date: '23 మార్చి 2025',
    venue: 'విజయవాడ',
    presentedBy: 'జ్యోతిష పీఠాధిపతులు & శాస్త్రవేత్తలు',
    description: 'గురువుగారి హస్తానికి పండిత ప్రముఖులు సువర్ణ కంకణాన్ని ధరింపజేసి వేదోక్త ఆశీస్సులను ప్రసాదిస్తున్న అపురూప వేదిక దృశ్యం.',
    highlights: ['స్వర్ణ కంకణ అలంకరణ', 'వేద మంత్రోచ్ఛారణతో సత్కారం'],
  },
  {
    id: 'suvarna-kankanam-garland',
    title: 'బహుళ శాలువాలు & పూలమాలలతో ఘన సత్కారం',
    englishTitle: 'Grand Felicitation with Shawls & Garlands',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6307643032115201097_y_200d4a17.jpg',
    date: '23 మార్చి 2025',
    venue: 'విజయవాడ సభా ప్రాంగణం',
    presentedBy: 'సభాధ్యక్షులు మరియు ప్రముఖ అతిథులు',
    description: 'సభాప్రాంగణంలో గురువుగారిని పట్టు శాలువాలు, పూలమాలలు మరియు స్వర్ణ జ్ఞాపికతో ఘనంగా సత్కరించిన వేళ.',
    highlights: ['పట్టు శాలువా సత్కారం', 'సభా ప్రముఖుల ప్రశంసలు'],
  },
  {
    id: 'mahati-speech-podium',
    title: 'మహతి వేదికపై గురువుగారి జ్యోతిష సిద్దాంత ప్రసంగం',
    englishTitle: 'Keynote Address at Mahati Auditorium',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6303093205754826522_y_524d966b.jpg',
    date: '11 డిసెంబర్ 2024',
    venue: 'మహతి కళాక్షేత్రం, తిరుపతి',
    presentedBy: 'సదస్సు ప్రతినిధులు',
    description: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు మహతి ఆడిటోరియంలో వేలాది పండితులు మరియు జ్యోతిష జిజ్ఞాసువుల సమక్షంలో మైకులో కీలక సిద్ధాంత ప్రసంగం చేసిన సందర్భం.',
    highlights: ['సిద్ధాంత ప్రసంగం', 'పండిత సభ ప్రశంసలు'],
  },
  {
    id: 'mahati-stage-group',
    title: 'తిరుపతి వేదికపై ప్రముఖ ఆహ్వానితుల సమక్షంలో సన్మానం',
    englishTitle: 'Dignitaries Honoring Guruji on Stage',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6303093205754826525_y_032eca2b.jpg',
    date: '11 డిసెంబర్ 2024',
    venue: 'తిరుపతి',
    presentedBy: 'విశిష్ట అతిథులు',
    description: 'సభా ప్రముఖులు మరియు వేద పెద్దలు గురువుగారిని మెమొంటోతో సత్కరిస్తున్న దృశ్యం.',
    highlights: ['అతిథుల సమక్షంలో పురస్కారం'],
  },
  {
    id: 'award-memento-pose',
    title: 'పురస్కార స్వర్ణ జ్ఞాపికతో శ్రీ సాయి ధీరజ్ శర్మ గారు',
    englishTitle: 'Guruji with Award Memento & Stole',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6303093205754826518_y_fd1b7ea4.jpg',
    date: 'నవంబర్ 2024',
    venue: 'హైదరాబాద్',
    presentedBy: 'పురస్కార సమితి',
    description: 'స్వర్ణ జ్ఞాపిక మరియు శాలువా ధరించి పురస్కార స్వీకరణానంతరం గురువుగారి శుభప్రదమైన చిత్రం.',
    highlights: ['స్వర్ణ ట్రోఫీ స్వీకరణ'],
  },
  {
    id: 'sacred-yagnam-homam',
    title: 'ప్రత్యక్ష మహా యజ్ఞం & చండీ హోమ క్రతువు నిర్వహణ',
    englishTitle: 'Sacred Maha Homam & Yagnam Ritual',
    category: 'yagnam',
    image: '/assets/aistudio/photo_6303093205754826520_y_3bb29960.jpg',
    date: 'నిరంతర వైదిక సేవ',
    venue: 'పవిత్ర యాగశాల',
    presentedBy: 'శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే స్వయంగా',
    description: 'ప్రజ్వలిస్తున్న పవిత్ర అగ్నిహోత్రంలో నెయ్యి సమర్పిస్తూ వేద మంత్రోచ్ఛారణతో లోక కళ్యాణార్థం, భక్తుల సంకల్ప సిద్ధి కోసం హోమం చేస్తున్న అపురూప దృశ్యం.',
    highlights: ['పవిత్ర అగ్నిహోత్ర క్రతువు', 'శాస్త్రోక్త మంత్రోచ్ఛారణ', 'సంకల్ప సిద్ధి హోమం'],
  },
  {
    id: 'vedic-portrait-peetham',
    title: 'సంప్రదాయ పీఠ వస్త్రాలలో గురువుగారు',
    englishTitle: 'Traditional Peetham Portrait',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6316590677353413998_y_10819dd7.jpg',
    date: 'వైదిక సంప్రదాయం',
    venue: 'హైదరాబాద్',
    presentedBy: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం',
    description: 'గురువుగారు వైదిక పీఠ ఆసనంలో భక్తులకు మార్గదర్శనం చేస్తూ ప్రసన్న వదనంతో దర్శనమిస్తున్న రూపం.',
    highlights: ['పీఠాసన ముద్ర', 'వైదిక తేజస్సు'],
  },
  {
    id: 'vedic-white-silk',
    title: 'సాంప్రదాయ శ్వేత వస్త్రధారణలో శ్రీ సాయి ధీరజ్ శర్మ గారు',
    englishTitle: 'Vedic Purity & Scholar Attire',
    category: 'felicitation',
    image: '/assets/aistudio/photo_6120628851693437047_x_00980624.jpg',
    date: 'పూజా కార్యక్రమం',
    venue: 'పసుమాముల, హయత్‌నగర్',
    presentedBy: 'వైదిక పరిషత్',
    description: 'నిర్మలమైన శ్వేత పట్టు పంచె మరియు ఉత్తరీయంతో వైదిక సంస్కృతికి ప్రతీకగా కొలువుదీరిన గురువుగారు.',
    highlights: ['స్మార్త వైదిక వస్త్రధారణ', 'పూజా సంకల్పం'],
  },
];

export const AwardsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'certificate' | 'felicitation' | 'yagnam'>('all');
  const [selectedAward, setSelectedAward] = useState<AwardItem | null>(null);

  const filteredAwards = AWARDS_DATA.filter((award) => {
    if (activeCategory === 'all') return true;
    return award.category === activeCategory;
  });

  return (
    <div className="space-y-10 font-telugu pb-12">
      {/* 1. Grand Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-500/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/80 border border-amber-500/60 text-amber-300 text-xs sm:text-sm font-semibold">
            <Award size={16} className="text-amber-400" />
            <span>ప్రతిష్టాత్మక గౌరవాలు & బిరుదులు</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            శ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారు పొందిన సత్కారాలు
          </h1>

          <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed max-w-3xl">
            జ్యోతిష, వాస్తు, వైదిక శాస్త్రాలలో విశిష్ట పాండిత్యానికి గాను తిరుపతి తితిదే మహతి ఆడిటోరియం, విజయవాడ విశ్వజ్యోతి జ్యోతిష విజ్ఞాన పీఠం మరియు ప్రముఖ సభల నుండి లభించిన బిరుదులు, సువర్ణ కంకణాలు & ప్రశంసా పత్రాలు.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm">
            <span className="bg-amber-900/90 border border-amber-600/70 px-3.5 py-1.5 rounded-xl text-amber-200 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>జ్యోతిష శిరోమణి (తిరుపతి TTD)</span>
            </span>
            <span className="bg-amber-900/90 border border-amber-600/70 px-3.5 py-1.5 rounded-xl text-amber-200 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-amber-400" />
              <span>సువర్ణ కంకణ పురస్కారం (2025)</span>
            </span>
            <span className="bg-amber-900/90 border border-amber-600/70 px-3.5 py-1.5 rounded-xl text-amber-200 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-amber-400" />
              <span>గ్లోబల్ ప్రెస్టీజియస్ అవార్డు</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-amber-200/90 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-amber-800 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            అన్నీ ({AWARDS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('certificate')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === 'certificate'
                ? 'bg-amber-800 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            బిరుదు & ప్రశంసా పత్రాలు ({AWARDS_DATA.filter((a) => a.category === 'certificate').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('felicitation')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === 'felicitation'
                ? 'bg-amber-800 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            వేదిక సత్కారాలు & శాలువాలు ({AWARDS_DATA.filter((a) => a.category === 'felicitation').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('yagnam')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === 'yagnam'
                ? 'bg-amber-800 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            ప్రత్యక్ష హోమ క్రతువులు ({AWARDS_DATA.filter((a) => a.category === 'yagnam').length})
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden md:block px-2">
          చిత్రంపై క్లిక్ చేసి స్పష్టంగా వీక్షించవచ్చు
        </span>
      </div>

      {/* 3. Awards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAwards.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl border border-amber-200/90 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Image Container with Hover Overlay & Lightbox Trigger */}
            <div
              className="relative aspect-4/3 overflow-hidden bg-amber-950/10 cursor-pointer"
              onClick={() => setSelectedAward(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              {/* Category Pill */}
              <div className="absolute top-3 left-3 bg-amber-900/90 backdrop-blur-xs text-amber-200 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/60 shadow-sm">
                {item.category === 'certificate' ? 'ప్రామాణిక పత్రం' : item.category === 'yagnam' ? 'యజ్ఞ క్రతువు' : 'వేదిక సత్కారం'}
              </div>

              {/* Zoom Trigger Button */}
              <div className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full shadow-lg transition-transform group-hover:scale-110 flex items-center gap-1 text-xs font-semibold px-3">
                <ZoomIn size={14} className="text-amber-700" />
                <span>జూమ్ చేయండి</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-amber-950 group-hover:text-amber-800 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Metadata: Venue & Date */}
              <div className="pt-3 border-t border-amber-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                  <MapPin size={14} className="text-amber-700 shrink-0" />
                  <span className="truncate">{item.venue}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar size={13} className="text-amber-600 shrink-0" />
                  <span>{item.date}</span>
                </div>
              </div>

              {/* View Full Certificate Button */}
              <button
                type="button"
                onClick={() => setSelectedAward(item)}
                className="w-full mt-2 py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>పూర్తి వివరాలు & చిత్రం చూడండి</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Lightbox Modal for Detailed High-Res Inspection */}
      {selectedAward && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-amber-400 relative">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-amber-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-800">
              <div className="flex items-center gap-2.5">
                <Award size={22} className="text-amber-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {selectedAward.title}
                  </h3>
                  <span className="text-xs text-amber-300">{selectedAward.venue}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAward(null)}
                className="p-2 rounded-full bg-amber-900 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5">
              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[60vh] border border-slate-800">
                <img
                  src={selectedAward.image}
                  alt={selectedAward.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </div>

              {/* Description & Metadata */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                    <MapPin size={16} className="text-amber-700" />
                    <span>{selectedAward.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar size={15} className="text-amber-700" />
                    <span>{selectedAward.date}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-telugu">
                  {selectedAward.description}
                </p>

                {selectedAward.presentedBy && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm">
                    <strong className="text-amber-950 font-bold block mb-1">ప్రదాత / నిర్వాహకులు:</strong>
                    <span className="text-slate-700">{selectedAward.presentedBy}</span>
                  </div>
                )}

                {/* Highlights tags */}
                {selectedAward.highlights && selectedAward.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedAward.highlights.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-amber-100/80 text-amber-900 rounded-full font-medium"
                      >
                        <Sparkles size={12} className="text-amber-600" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedAward(null)}
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                మూసివేయండి (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
