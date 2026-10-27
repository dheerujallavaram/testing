import React, { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  Sparkles,
  Compass,
  Landmark,
  Calendar,
  Globe,
  ShieldCheck,
  ChevronRight,
  Search,
} from 'lucide-react';
import {
  ALL_CITIES,
  AP_CITIES,
  TELANGANA_CITIES,
  USA_TELUGU_CITIES,
  CitySEOData,
  findCityBySlug,
} from '../data/citiesData';
import { DayData } from '../types/panchangam';

export type LocalizedPageIntent =
  | 'astrologer-purohit'
  | 'neti-panchangam'
  | 'vivaha-muhurtham';

export interface LocalizedRouteEntry {
  path: string;
  canonicalUrl: string;
  citySlug: string;
  cityName: string;
  cityTeluguName: string;
  state: string;
  regionType: 'AP' | 'Telangana' | 'USA';
  intent: LocalizedPageIntent;
  titleTe: string;
  titleEn: string;
  metaDescription: string;
  templeProximity: TempleProximityInfo;
  priority: number;
  changefreq: 'daily' | 'weekly';
}

export interface TempleProximityInfo {
  templeNameTe: string;
  templeNameEn: string;
  deityTe: string;
  proximitySummaryTe: string;
  proximitySummaryEn: string;
  kshetraSignificanceTe: string;
  latitudeHint: string;
  longitudeHint: string;
}

const SPECIFIC_CITY_TEMPLES: Record<string, TempleProximityInfo> = {
  tirupati: {
    templeNameTe: 'తిరుమల శ్రీ వేంకటేశ్వర స్వామి & తిరుచానూరు శ్రీ పద్మావతి అమ్మవారి క్షేత్రం',
    templeNameEn: 'Tirumala Sri Venkateswara Swamy & Tiruchanur Padmavathi Temple',
    deityTe: 'శ్రీ వేంకటేశ్వర స్వామి & అలమేలు మంగమ్మ',
    proximitySummaryTe: 'తిరుమల శేషాచల కొండల పాదాల చెంత, అలిపిరి & తిరుచానూరు దివ్య క్షేత్ర పరిధిలో',
    proximitySummaryEn: 'Located at the sacred foothills of Tirumala Seshachalam Hills & Tiruchanur Kshetram',
    kshetraSignificanceTe: 'శ్రీ వైఖానస మరియు స్మార్త ఆగమ సంప్రదాయాలకు నిలయమైన తిరుపతి క్షేత్ర కాలమానం ప్రకారం శుభ ముహూర్త గణన.',
    latitudeHint: '13.6288° N',
    longitudeHint: '79.4192° E',
  },
  srikalahasti: {
    templeNameTe: 'శ్రీకాళహస్తి రాహు-కేతు క్షేత్రం (శ్రీ జ్ఞానప్రసూనాంబ సమేత శ్రీ కాళహస్తీశ్వర స్వామి)',
    templeNameEn: 'Srikalahasti Rahu-Ketu Kshetram (Sri Kalahasteeswara Swamy Temple)',
    deityTe: 'శ్రీ జ్ఞానప్రసూనాంబ సమేత కాళహస్తీశ్వరుడు (వాయు లింగం)',
    proximitySummaryTe: 'సువర్ణముఖి నదీ తీరాన పంచభూత వాయులింగ క్షేత్ర సాన్నిధ్యంలో',
    proximitySummaryEn: 'Adjacent to the Panchabhoota Vayu Linga Kshetram on the banks of River Swarnamukhi',
    kshetraSignificanceTe: 'రాహు-కేతు సర్పదోష నివారణ, కాలసర్ప దోష శాంతి మరియు నక్షత్ర శాంతులకు అత్యంత ప్రశస్తమైన క్షేత్ర పరిధి.',
    latitudeHint: '13.7498° N',
    longitudeHint: '79.6984° E',
  },
  vijayawada: {
    templeNameTe: 'ఇంద్రకీలాద్రి శ్రీ కనకదుర్గమ్మ అమ్మవారి దేవస్థానం',
    templeNameEn: 'Indrakeeladri Sri Kanaka Durga Temple',
    deityTe: 'శ్రీ కనకదుర్గా దేవి & మల్లేశ్వర స్వామి',
    proximitySummaryTe: 'పవిత్ర కృష్ణా నదీ తీరాన ఇంద్రకీలాద్రి కనకదుర్గమ్మ క్షేత్ర సాన్నిధ్యంలో',
    proximitySummaryEn: 'On the sacred banks of River Krishna near Indrakeeladri Sri Kanaka Durga Kshetram',
    kshetraSignificanceTe: 'కృష్ణా నదీ తీర సూర్యోదయ కాలమానం మరియు చండీ సప్తశతి ఆరాధనకు ప్రసిద్ధి చెందిన ఆధ్యాత్మిక కేంద్రం.',
    latitudeHint: '16.5062° N',
    longitudeHint: '80.6480° E',
  },
  visakhapatnam: {
    templeNameTe: 'సింహాచలం శ్రీ వరాహ లక్ష్మీ నరసింహ స్వామి & శ్రీ కనకమహాలక్ష్మి క్షేత్రం',
    templeNameEn: 'Simhachalam Sri Varaha Lakshmi Narasimha Swamy Temple',
    deityTe: 'శ్రీ వరాహ లక్ష్మీ నరసింహ స్వామి',
    proximitySummaryTe: 'సింహగిరి క్షేత్రం మరియు బురుజుపేట శ్రీ కనకమహాలక్ష్మి అమ్మవారి సన్నిధి పరిధిలో',
    proximitySummaryEn: 'In proximity to Simhachalam Hill Shrine and Burujupeta Sri Kanaka Mahalakshmi Temple',
    kshetraSignificanceTe: 'తూర్పు తీర సూర్యోదయ ప్రమాణాలతో విశాఖపట్నం అక్షాంశ-రేఖాంశాల ఆధారంగా కచ్చితమైన లగ్న ముహూర్త నిర్ణయం.',
    latitudeHint: '17.6868° N',
    longitudeHint: '83.2185° E',
  },
  rajahmundry: {
    templeNameTe: 'గోదావరి పుష్కర ఘాట్ & కోటిలింగాల క్షేత్రం (అన్నవరం - ద్రాక్షారామం పరిధి)',
    templeNameEn: 'Godavari Kotilingala Ghat & Draksharamam / Annavaram Proximity',
    deityTe: 'శ్రీ ఉమా మార్కండేయ స్వామి & సత్యనారాయణ స్వామి',
    proximitySummaryTe: 'పవిత్ర గౌతమీ గోదావరి తీరాన వేద పండిత సంప్రదాయ కేంద్రంలో',
    proximitySummaryEn: 'Along the sacred Gautami Godavari riverbanks in the heartland of Vedic scholarship',
    kshetraSignificanceTe: 'యవనాచార్యుల మతం, ముహూర్త చింతామణి మరియు గోదావరి తీర స్మార్త వైదిక సంప్రదాయాలకు ప్రధాన కేంద్రం.',
    latitudeHint: '17.0005° N',
    longitudeHint: '81.8040° E',
  },
  pithapuram: {
    templeNameTe: 'పాదగయ క్షేత్రం — శ్రీ కుక్కుటేశ్వర స్వామి & శ్రీపాద శ్రీవల్లభ మహాসংస్థానం',
    templeNameEn: 'Pada Gaya Kshetram — Sri Kukkuteswara Swamy & Sripada Srivallabha Anagha Datta Temple',
    deityTe: 'శ్రీ పురుహూతికా దేవి సమేత కుక్కుటేశ్వర స్వామి & శ్రీపాద శ్రీవల్లభులు',
    proximitySummaryTe: 'అష్టాదశ శక్తిపీఠాలలో ఒకటైన శ్రీ పురుహూతికా దేవి మరియు దత్త క్షేత్ర సన్నిధిలో',
    proximitySummaryEn: 'Within the sacred precinct of Ashta Dasha Shakti Peetham Puruhutika Devi & Sripada Srivallabha',
    kshetraSignificanceTe: 'గురు బల వృద్ధి, దత్తాత్రేయ ఆరాధన మరియు పితృ దోష నివారణ సంకల్పాలకు పరమ పవిత్ర క్షేత్రం.',
    latitudeHint: '17.1167° N',
    longitudeHint: '82.2500° E',
  },
  hyderabad: {
    templeNameTe: 'జూబ్లీహిల్స్ శ్రీ పెద్దమ్మ తల్లి, బిర్లా మందిరం & చిలుకూరు బాలాజీ దేవస్థాన పరిధి',
    templeNameEn: 'Jubilee Hills Sri Peddamma Thalli, Birla Mandir & Chilkur Balaji Temple',
    deityTe: 'శ్రీ లక్ష్మీ గణపతి, పెద్దమ్మ తల్లి & వేంకటేశ్వర స్వామి',
    proximitySummaryTe: 'భాగ్యనగరంలోని శ్రీ పెద్దమ్మ తల్లి, బల్కంపేట ఎల్లమ్మ మరియు చిలుకూరు బాలాజీ క్షేత్రాల పరిధిలో',
    proximitySummaryEn: 'Serving Greater Hyderabad across Jubilee Hills Peddamma Temple, Birla Mandir & Chilkur Balaji',
    kshetraSignificanceTe: 'శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం ప్రధాన సంప్రదింపుల కేంద్రం — హైదరాబాద్ స్థానిక సూర్యోదయ ప్రమాణాలతో దృక్సిద్ధాంత పంచాంగ గణన.',
    latitudeHint: '17.3850° N',
    longitudeHint: '78.4867° E',
  },
  warangal: {
    templeNameTe: 'ఓరుగల్లు శ్రీ భద్రకాళీ అమ్మవారి దేవస్థానం & వేయి స్తంభాల గుడి',
    templeNameEn: 'Warangal Sri Bhadrakali Temple & Thousand Pillar Rudreswara Swamy Temple',
    deityTe: 'శ్రీ భద్రకాళీ దేవి & రుద్రేశ్వర స్వామి',
    proximitySummaryTe: 'కాకతీయ ఆరాధ్య దైవమైన శ్రీ భద్రకాళీ అమ్మవారి దివ్య సన్నిధిలో',
    proximitySummaryEn: 'Near the historic Kakatiya shrine of Sri Bhadrakali Ammavaru & Rudreswara Temple',
    kshetraSignificanceTe: 'శ్రీ చండీ హోమం, రుద్ర హోమం మరియు నవగ్రహ శాంతి క్రతువులకు విశేష ఆధ్యాత్మిక ప్రాధాన్యత గల కేంద్రం.',
    latitudeHint: '17.9689° N',
    longitudeHint: '79.5941° E',
  },
  vemulawada: {
    templeNameTe: 'దక్షిణ కాశీ — వేములవాడ శ్రీ రాజరాజేశ్వర స్వామి దేవస్థానం',
    templeNameEn: 'Vemulawada Sri Raja Rajeshwara Swamy Devasthanam (Dakshina Kashi)',
    deityTe: 'శ్రీ రాజరాజేశ్వరీ దేవి సమేత శ్రీ రాజరాజేశ్వర స్వామి',
    proximitySummaryTe: 'దక్షిణ కాశీగా ప్రసిద్ధి చెందిన వేములవాడ రాజన్న ఆలయ సాన్నిధ్యంలో',
    proximitySummaryEn: 'Adjacent to the revered Dakshina Kashi Sri Raja Rajeshwara Swamy Shrine',
    kshetraSignificanceTe: 'గ్రహ దోష నివారణ, ఆయుష్య హోమం మరియు వివాహ శుభ ముహూర్త నిర్ణయాలకు ప్రసిద్ధ క్షేత్రం.',
    latitudeHint: '18.4675° N',
    longitudeHint: '78.8712° E',
  },
  bhongir: {
    templeNameTe: 'యాదాద్రి (యాదగిరిగుట్ట) శ్రీ లక్ష్మీ నరసింహ స్వామి దివ్య క్షేత్రం',
    templeNameEn: 'Yadadri (Yadagirigutta) Sri Lakshmi Narasimha Swamy Temple',
    deityTe: 'శ్రీ జ్వాలా, యోగానంద, గండభేరుండ లక్ష్మీ నరసింహ స్వామి',
    proximitySummaryTe: 'పంచ నారసింహ క్షేత్రమైన యాదాద్రి శ్రీ లక్ష్మీ నరసింహ స్వామి సన్నిధి మార్గంలో',
    proximitySummaryEn: 'Gateway to the Pancha Narasimha Kshetram at Yadadri Sri Lakshmi Narasimha Swamy Temple',
    kshetraSignificanceTe: 'నరసింహ సుదర్శన హోమాలు, గృహప్రవేశ ముహూర్తాలు మరియు సత్యనారాయణ వ్రతాలకు శ్రేష్ఠమైన క్షేత్ర పరిధి.',
    latitudeHint: '17.5117° N',
    longitudeHint: '78.8878° E',
  },
};

/**
 * Resolves authentic nearby temple proximity & coordinates metadata for any city in AP, Telangana, or USA.
 */
export function getCityTempleProximity(city: CitySEOData): TempleProximityInfo {
  if (SPECIFIC_CITY_TEMPLES[city.slug]) {
    return SPECIFIC_CITY_TEMPLES[city.slug];
  }

  const slug = city.slug;
  const stateLower = city.state.toLowerCase();

  // USA Telugu Diaspora Temple Mapping by US State
  if (city.regionType === 'USA') {
    if (stateLower.includes('texas')) {
      return {
        templeNameTe: 'ఫ్రిస్కో శ్రీ కార్యసిద్ధి హనుమాన్ మందిరం & DFW హిందూ దేవాలయం (ఇర్వింగ్)',
        templeNameEn: 'Karya Siddhi Hanuman Temple (Frisco) & DFW Hindu Temple (Irving, TX)',
        deityTe: 'శ్రీ కార్యసిద్ధి ఆంజనేయ స్వామి & శ్రీ వేంకటేశ్వర స్వామి',
        proximitySummaryTe: `${city.name} (${city.stateTelugu}) లోని DFW హిందూ దేవాలయం మరియు కార్యసిద్ధి హనుమాన్ మందిర పరిధిలోని తెలుగు NRI కుటుంబాల కొరకు`,
        proximitySummaryEn: `Serving Telugu NRI families near Karya Siddhi Hanuman Temple & DFW Hindu Temple in ${city.name}, ${city.state}`,
        kshetraSignificanceTe: `అమెరికా CST కాలమానం (క్రౌంచద్వీపే, రమణక వర్షే) ప్రకారం ${city.name} సూర్యోదయ ప్రమాణాలతో నిత్య పంచాంగం, గృహప్రవేశ & సత్యనారాయణ వ్రత ముహూర్త నిర్ణయం.`,
        latitudeHint: '32.7767° N (CST)',
        longitudeHint: '96.7970° W',
      };
    }
    if (stateLower.includes('new jersey') || stateLower.includes('new york')) {
      return {
        templeNameTe: 'బ్రిడ్జ్‌వాటర్ శ్రీ వేంకటేశ్వర స్వామి దేవాలయం & ఫ్లషింగ్ మహావల్లభ గణపతి మందిరం',
        templeNameEn: 'Sri Venkateswara Temple (Bridgewater, NJ) & Hindu Temple Society of North America',
        deityTe: 'శ్రీ బాలాజీ & శ్రీ మహావల్లభ గణపతి',
        proximitySummaryTe: `${city.name} (${city.stateTelugu}) సమీపంలోని బ్రిడ్జ్‌వాటర్ బాలాజీ మరియు గణపతి దేవాలయ పరిధిలోని ప్రవాస తెలుగు భక్తుల కొరకు`,
        proximitySummaryEn: `Serving Telugu families near Sri Venkateswara Temple Bridgewater & NY/NJ Hindu Temples in ${city.name}`,
        kshetraSignificanceTe: `అమెరికా EST కాలమానం (క్రౌంచద్వీపే) ప్రకారం ${city.name} స్థానిక అక్షాంశ-రేఖాంశాలతో శుభ ముహూర్తాలు మరియు లైవ్ ఆన్‌లైన్ హోమాలు.`,
        latitudeHint: '40.5940° N (EST)',
        longitudeHint: '74.6049° W',
      };
    }
    if (stateLower.includes('california')) {
      return {
        templeNameTe: 'లివర్‌మూర్ శివ-విష్ణు దేవాలయం & సన్నీవేల్ హిందూ మందిరం (Bay Area)',
        templeNameEn: 'Shiva-Vishnu Temple (Livermore, CA) & Sunnyvale Hindu Temple',
        deityTe: 'శ్రీ శివ-విష్ణు & శ్రీ వేంకటేశ్వర స్వామి',
        proximitySummaryTe: `సిలికాన్ వ్యాలీ / ${city.name} లోని లివర్‌మూర్ శివ-విష్ణు మరియు సన్నీవేల్ దేవాలయ పరిధిలోని తెలుగు కుటుంబాల కొరకు`,
        proximitySummaryEn: `Serving Bay Area Telugu families near Livermore Shiva-Vishnu Temple & Sunnyvale Hindu Temple in ${city.name}`,
        kshetraSignificanceTe: `అమెరికా PST కాలమానం ప్రకారం ${city.name} స్థానిక సూర్యోదయ లగ్న ప్రమాణాలతో వివాహ, గృహప్రవేశ మరియు నామకరణ ముహూర్తాలు.`,
        latitudeHint: '37.3382° N (PST)',
        longitudeHint: '121.8863° W',
      };
    }
    if (stateLower.includes('georgia')) {
      return {
        templeNameTe: 'అట్లాంటా హిందూ దేవాలయం (Riverdale) & కమ్మింగ్ శ్రీ శివ దుర్గా మందిరం',
        templeNameEn: 'Hindu Temple of Atlanta (Riverdale, GA) & Sri Maha Lakshmi Temple',
        deityTe: 'శ్రీ వేంకటేశ్వర స్వామి & శ్రీ రామలింగేశ్వర స్వామి',
        proximitySummaryTe: `${city.name} (${city.stateTelugu}) లోని అట్లాంటా బాలాజీ దేవాలయ పరిధిలోని తెలుగు NRI భక్తుల కొరకు`,
        proximitySummaryEn: `Serving Georgia Telugu NRI families near Hindu Temple of Atlanta in ${city.name}`,
        kshetraSignificanceTe: `EST కాలమానంలో ${city.name} భక్తులకు అనుకూలమైన సమయాలలో ఆన్‌లైన్ జాతక విశ్లేషణ మరియు వైదిక పూజా సంకల్పం.`,
        latitudeHint: '33.7490° N (EST)',
        longitudeHint: '84.3880° W',
      };
    }
    if (stateLower.includes('illinois')) {
      return {
        templeNameTe: 'అరోరా శ్రీ వేంకటేశ్వర స్వామి దేవాలయం & లెమాంట్ రామ మందిరం (Chicago)',
        templeNameEn: 'Sri Venkateswara Swami Temple (Aurora, IL) & Hindu Temple of Greater Chicago (Lemont)',
        deityTe: 'శ్రీ వేంకటేశ్వర స్వామి & శ్రీ సీతారామచంద్ర స్వామి',
        proximitySummaryTe: `${city.name} సమీపంలోని అరోరా బాలాజీ మరియు లెమాంట్ హిందూ దేవాలయ పరిధిలోని తెలుగు భక్తుల కొరకు`,
        proximitySummaryEn: `Serving Greater Chicago Telugu families near Aurora Balaji & Lemont Hindu Temple in ${city.name}`,
        kshetraSignificanceTe: `CST కాలమానంలో ${city.name} అక్షాంశ-రేఖాంశాల ప్రకారం కచ్చితమైన పంచాంగం మరియు శుభ ముహూర్త నిర్ణయం.`,
        latitudeHint: '41.7606° N (CST)',
        longitudeHint: '88.3201° W',
      };
    }
    return {
      templeNameTe: `${city.name} (${city.stateTelugu}) స్థానిక శ్రీ వేంకటేశ్వర & గణపతి హిందూ దేవాలయ పరిధి`,
      templeNameEn: `${city.name} (${city.state}) Local Sri Venkateswara & Hindu Temple Cultural Hub`,
      deityTe: 'శ్రీ లక్ష్మీ గణపతి & శ్రీ వేంకటేశ్వర స్వామి',
      proximitySummaryTe: `అమెరికాలోని ${city.name}, ${city.state} స్థానిక హిందూ దేవాలయ పరిధిలోని ప్రవాస తెలుగు కుటుంబాల కొరకు`,
      proximitySummaryEn: `Serving Telugu diaspora families near local Hindu temples in ${city.name}, ${city.state} (${city.timezone || 'US'})`,
      kshetraSignificanceTe: `క్రౌంచద్వీపే, రమణక వర్షే సంకల్ప విధానంతో ${city.name} (${city.timezone || 'US'} Timezone) సూర్యోదయ ప్రమాణాలకు అనుగుణంగా పూజలు మరియు ముహూర్త నిర్ణయం.`,
      latitudeHint: `USA (${city.timezone || 'EST/CST/PST'})`,
      longitudeHint: 'North America Krounchadweepa',
    };
  }

  // Andhra Pradesh regional temple proximity mapping
  if (city.regionType === 'AP') {
    if (['guntur', 'mangalagiri', 'amaravati', 'tenali', 'narasaraopet', 'chilakaluripet', 'sattenapalle', 'bapatla', 'chirala'].includes(slug)) {
      return {
        templeNameTe: 'మంగళగిరి శ్రీ పానకాల లక్ష్మీ నరసింహ స్వామి, అమరావతి అమరేశ్వర & కోటప్పకొండ త్రికూటేశ్వర క్షేత్ర పరిధి',
        templeNameEn: 'Mangalagiri Panakala Narasimha Swamy, Amaravati Amareswara & Kotappakonda Temple Belt',
        deityTe: 'శ్రీ లక్ష్మీ నరసింహ స్వామి & అమరలింగేశ్వర స్వామి',
        proximitySummaryTe: `${city.teluguName} సమీపంలోని కృష్ణా తీర మంగళగిరి, అమరావతి మరియు కోటప్పకొండ దివ్య క్షేత్రాల సాన్నిధ్యంలో`,
        proximitySummaryEn: `Located in the sacred Krishna delta temple belt near Mangalagiri, Amaravati & Indrakeeladri from ${city.name}`,
        kshetraSignificanceTe: `${city.teluguName} అక్షాంశ-రేఖాంశాలు మరియు సూర్యోదయ ప్రమాణాలతో దృక్సిద్ధాంత పంచాంగం, వివాహ & గృహప్రవేశ శుభ ముహూర్తాలు.`,
        latitudeHint: '16.3067° N',
        longitudeHint: '80.4365° E',
      };
    }
    if (['kurnool', 'nandyal', 'adoni', 'yemmiganur', 'nandikotkur', 'atmakur-kurnool', 'allagadda', 'banaganapalle', 'dhone', 'markapur'].includes(slug)) {
      return {
        templeNameTe: 'శ్రీశైల మల్లికార్జున జ్యోతిర్లింగ క్షేత్రం, అహోబిలం నవనారసింహ & మహానంది క్షేత్ర పరిధి',
        templeNameEn: 'Srisailam Mallikarjuna Jyotirlinga, Ahobilam & Mahanandi Sacred Kshetra Belt',
        deityTe: 'శ్రీ భ్రమరాంబ మల్లికార్జున స్వామి & శ్రీ లక్ష్మీ నరసింహ స్వామి',
        proximitySummaryTe: `${city.teluguName} సమీపంలోని శ్రీశైలం, మహానంది, యాగంటి మరియు అహోబిలం దివ్య క్షేత్రాల పరిధిలో`,
        proximitySummaryEn: `Situated within the sacred Rayalaseema spiritual belt near Srisailam, Mahanandi & Ahobilam around ${city.name}`,
        kshetraSignificanceTe: `రుద్రాభిషేకం, చండీ హోమం, నవగ్రహ శాంతి మరియు ${city.teluguName} స్థానిక సూర్యోదయ ప్రమాణాలతో శుభ ముహూర్త నిర్ణయం.`,
        latitudeHint: '15.8281° N',
        longitudeHint: '78.0373° E',
      };
    }
    if (['kakinada', 'samalkot', 'peddapuram', 'ramachandrapuram', 'mandapeta', 'amalapuram', 'ravulapalem', 'tuni', 'kovvur'].includes(slug)) {
      return {
        templeNameTe: 'అన్నవరం శ్రీ వీర వేంకట సత్యనారాయణ స్వామి, ద్రాక్షారామ భీమేశ్వర & సామర్లకోట కుమారారామ క్షేత్ర పరిధి',
        templeNameEn: 'Annavaram Satyanarayana Swamy, Draksharamam & Kumararama Pancharama Temple Belt',
        deityTe: 'శ్రీ వీర వేంకట సత్యనారాయణ స్వామి & శ్రీ భీమేశ్వర స్వామి',
        proximitySummaryTe: `తూర్పు గోదావరి & కోనసీమలోని అన్నవరం, ద్రాక్షారామం, అయినవిల్లి విఘ్నేశ్వర క్షేత్ర పరిధిలో (${city.teluguName})`,
        proximitySummaryEn: `In the sacred Godavari & Konaseema temple belt near Annavaram, Draksharamam & Ainavilli around ${city.name}`,
        kshetraSignificanceTe: `వేద శాస్త్ర సంప్రదాయాలకు నిలయమైన గోదావరి తీర ప్రమాణాలతో ${city.teluguName} భక్తులకు జాతక విశ్లేషణ మరియు హోమ సేవలు.`,
        latitudeHint: '16.9891° N',
        longitudeHint: '82.2475° E',
      };
    }
    if (['eluru', 'bhimavaram', 'palakollu', 'tanuku', 'narsapur', 'tadepalligudem', 'jangareddygudem', 'nidadavole', 'gudivada', 'machilipatnam'].includes(slug)) {
      return {
        templeNameTe: 'ద్వారకా తిరుమల (చిన్న తిరుపతి), భీమవరం సోమారామం & పాలకొల్లు క్షీరారామ క్షేత్ర పరిధి',
        templeNameEn: 'Dwaraka Tirumala Venkateswara Swamy, Bhimavaram Somaramam & Palakollu Ksheerarama Belt',
        deityTe: 'శ్రీ వేంకటేశ్వర స్వామి, మావుళ్లమ్మ అమ్మవారు & సోమేశ్వర స్వామి',
        proximitySummaryTe: `${city.teluguName} సమీపంలోని ద్వారకా తిరుమల మరియు పంచారామ క్షేత్రాల పవిత్ర పరిధిలో`,
        proximitySummaryEn: `Located near Dwaraka Tirumala (Chinna Tirupati) and Pancharama Shiva shrines around ${city.name}`,
        kshetraSignificanceTe: `${city.teluguName} స్థానిక అక్షాంశ-రేఖాంశాల ఆధారంగా వివాహ పొంతన, గృహప్రవేశం మరియు దోష నివారణ పూజలు.`,
        latitudeHint: '16.7107° N',
        longitudeHint: '81.0952° E',
      };
    }
    if (['srikakulam', 'vizianagaram', 'bobbili', 'parvathipuram', 'rajam', 'palasa', 'tekkali', 'amadalavalasa', 'narasannapeta'].includes(slug)) {
      return {
        templeNameTe: 'అరసవల్లి శ్రీ సూర్యనారాయణ స్వామి, శ్రీకూర్మం & రామతీర్థం దివ్య క్షేత్ర పరిధి',
        templeNameEn: 'Arasavalli Suryanarayana Swamy, Srikurmam & Vizianagaram Pydithalli Temple Belt',
        deityTe: 'శ్రీ సూర్యనారాయణ స్వామి & శ్రీ కూర్మనాథ స్వామి',
        proximitySummaryTe: `ఉత్తరాంధ్రలోని అరసవల్లి సూర్య దేవాలయం, శ్రీకూర్మం మరియు పైడితల్లి అమ్మవారి క్షేత్ర పరిధిలో (${city.teluguName})`,
        proximitySummaryEn: `Within the Uttarandhra sacred belt of Arasavalli Sun Temple & Srikurmam near ${city.name}`,
        kshetraSignificanceTe: `ఆరోగ్య కారకుడైన సూర్య భగవానుని క్షేత్ర కాలమానంతో ${city.teluguName} భక్తులకు నవగ్రహ శాంతి మరియు జాతక పరిశీలన.`,
        latitudeHint: '18.2949° N',
        longitudeHint: '83.8938° E',
      };
    }
    return {
      templeNameTe: `${city.teluguName} శ్రీ వేంకటేశ్వర, శివాలయ & శక్తి క్షేత్ర సన్నిధి (${city.stateTelugu})`,
      templeNameEn: `${city.name} Sri Venkateswara & Ancient Vedic Temple Precinct (${city.state})`,
      deityTe: 'శ్రీ లక్ష్మీ గణపతి, శ్రీ వేంకటేశ్వర స్వామి & రాజరాజేశ్వరీ దేవి',
      proximitySummaryTe: `${city.teluguName} (${city.name}) మరియు పరిసర పుణ్యక్షేత్రాల ఆధ్యాత్మిక పరిధిలో`,
      proximitySummaryEn: `Serving devotees across ${city.name} and surrounding ancient temples in ${city.state}`,
      kshetraSignificanceTe: `${city.teluguName} స్థానిక సూర్యోదయ-సూర్యాస్తమయ ప్రమాణాల ఆధారంగా దృక్సిద్ధాంత పంచాంగం, శుభ ముహూర్తాలు మరియు వైదిక హోమాలు.`,
      latitudeHint: '15.9129° N (IST)',
      longitudeHint: '79.7400° E',
    };
  }

  // Telangana regional temple proximity mapping
  if (['karimnagar', 'jagtial', 'dharmapuri', 'koratla', 'metpally', 'sircilla', 'peddapalli', 'ramagundam', 'godavarikhani', 'mancherial', 'huzurabad'].includes(slug)) {
    return {
      templeNameTe: 'వేములవాడ శ్రీ రాజరాజేశ్వర స్వామి, ధర్మపురి లక్ష్మీ నరసింహ & కొండగట్టు ఆంజనేయ స్వామి క్షేత్ర పరిధి',
      templeNameEn: 'Vemulawada Raja Rajeshwara, Dharmapuri Narasimha & Kondagattu Anjaneya Swamy Belt',
      deityTe: 'శ్రీ రాజరాజేశ్వర స్వామి, లక్ష్మీ నరసింహ స్వామి & ఆంజనేయ స్వామి',
      proximitySummaryTe: `గోదావరి తీర ధర్మపురి, కాళేశ్వరం మరియు వేములవాడ దివ్య క్షేత్రాల పరిధిలో (${city.teluguName})`,
      proximitySummaryEn: `Located in the sacred Godavari belt near Vemulawada, Dharmapuri & Kondagattu around ${city.name}`,
      kshetraSignificanceTe: `${city.teluguName} స్థానిక సూర్యోదయ ప్రమాణాలతో నిత్య పంచాంగం, వివాహ ముహూర్తాలు మరియు చండీ-గణపతి హోమాలు.`,
      latitudeHint: '18.4386° N',
      longitudeHint: '79.1288° E',
    };
  }
  if (['khammam', 'kothagudem', 'palwancha', 'suryapet', 'miryalaguda', 'nalgonda'].includes(slug)) {
    return {
      templeNameTe: 'భద్రాచలం శ్రీ సీతారామచంద్ర స్వామి & మట్టపల్లి శ్రీ లక్ష్మీ నరసింహ స్వామి క్షేత్ర పరిధి',
      templeNameEn: 'Bhadrachalam Sri Sita Ramachandra Swamy & Mattapalli Narasimha Swamy Temple Belt',
      deityTe: 'శ్రీ సీతారామచంద్ర స్వామి & లక్ష్మీ నరసింహ స్వామి',
      proximitySummaryTe: `${city.teluguName} సమీపంలోని భద్రాద్రి రామాలయం మరియు కృష్ణా-గోదావరి పుణ్యక్షేత్రాల పరిధిలో`,
      proximitySummaryEn: `Near the sacred Bhadrachalam Sri Rama Kshetram and Mattapalli Narasimha shrine around ${city.name}`,
      kshetraSignificanceTe: `${city.teluguName} అక్షాంశ-రేఖాంశాల ప్రకారం దోషరహితమైన లగ్న ముహూర్తాలు మరియు సంపూర్ణ జాతక పరిశీలన.`,
      latitudeHint: '17.2473° N',
      longitudeHint: '80.1514° E',
    };
  }
  if (['nizamabad', 'armoor', 'bodhan', 'kamareddy', 'adilabad', 'nirmal', 'bhainsa', 'banswada'].includes(slug)) {
    return {
      templeNameTe: 'బాసర శ్రీ జ్ఞాన సరస్వతి అమ్మవారి క్షేత్రం & ఆర్మూర్ నవనాథ సిద్ధేశ్వర ఆలయ పరిధి',
      templeNameEn: 'Basara Sri Gnana Saraswati Temple & Armoor Navanath Siddheswara Shrine Belt',
      deityTe: 'శ్రీ జ్ఞాన సరస్వతీ దేవి & సిద్ధేశ్వర స్వామి',
      proximitySummaryTe: `గోదావరి తీర బాసర సరస్వతి క్షేత్రం మరియు ${city.teluguName} పురాతన ఆలయాల సాన్నిధ్యంలో`,
      proximitySummaryEn: `Within the sacred Godavari basin near Basara Sri Gnana Saraswati Temple & ${city.name}`,
      kshetraSignificanceTe: `అక్షరాభ్యాసం, ఉపనయనం, వివాహ ముహూర్తాలు మరియు జాతక పరిశీలనకు ${city.teluguName} స్థానిక కాలమాన గణన.`,
      latitudeHint: '18.6725° N',
      longitudeHint: '78.0941° E',
    };
  }

  return {
    templeNameTe: `${city.teluguName} సమీపంలోని యాదాద్రి శ్రీ లక్ష్మీ నరసింహ స్వామి & భాగ్యనగర దివ్య క్షేత్రాల పరిధి`,
    templeNameEn: `${city.name} Proximity to Yadadri Sri Lakshmi Narasimha Swamy & Greater Hyderabad Temples`,
    deityTe: 'శ్రీ లక్ష్మీ గణపతి & శ్రీ లక్ష్మీ నరసింహ స్వామి',
    proximitySummaryTe: `${city.teluguName} (${city.name}, ${city.stateTelugu}) మరియు పరిసర పురాతన దేవాలయాల పరిధిలో`,
    proximitySummaryEn: `Serving devotees in ${city.name} (${city.state}) and nearby sacred Telangana Vedic shrines`,
    kshetraSignificanceTe: `${city.teluguName} స్థానిక సూర్యోదయ ప్రమాణాలు మరియు దృక్సిద్ధాంత పంచాంగ గణనలతో శుభ ముహూర్త నిర్ణయం.`,
    latitudeHint: '17.3850° N (IST)',
    longitudeHint: '78.4867° E',
  };
}

/**
 * Programmatically generates 510+ static route paths and metadata entries from the city database
 * (104 AP cities + 101 Telangana cities + 53 USA Telugu cities = 258 cities × 2 primary SEO intents = 516 routes,
 * plus top 50 Vivaha/Jathakam city routes = 566 localized landing pages).
 */
export function generateLocalizedStaticRoutes(activeDay?: DayData): LocalizedRouteEntry[] {
  const baseUrl = 'https://www.telugujyothisham.com';
  const dayLabel = activeDay?.teediVaram || 'నేటి పంచాంగం';
  const tithiLabel = activeDay?.panchanga.tithi.split('-')[0]?.trim() || 'శుభ తిథి';
  const nakshatraLabel = activeDay?.panchanga.nakshatram.split('-')[0]?.trim() || 'శుభ నక్షత్రం';

  const routes: LocalizedRouteEntry[] = [];

  for (const city of ALL_CITIES) {
    const templeProximity = getCityTempleProximity(city);
    const isUSA = city.regionType === 'USA';

    // Route Set 1: Best Telugu Astrologer & Vedic Purohit in [City] (258 routes)
    const astrologerPath = `/telugu-astrologer-in-${city.slug}`;
    routes.push({
      path: astrologerPath,
      canonicalUrl: `${baseUrl}${astrologerPath}`,
      citySlug: city.slug,
      cityName: city.name,
      cityTeluguName: city.teluguName,
      state: city.state,
      regionType: city.regionType,
      intent: 'astrologer-purohit',
      titleTe: `${city.teluguName} (${city.name}) లో ప్రముఖ తెలుగు జ్యోతిష్యులు & పురోహితులు | Telugu Jyothisham — శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం`,
      titleEn: `Best Telugu Astrologer in ${city.name}, ${city.state} (${city.teluguName}) | Telugu Jyothisham & Panchangam`,
      metaDescription: `${city.teluguName} (${city.name}, ${city.state}) భక్తుల కొరకు ${templeProximity.templeNameTe} పరిధిలో బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారిచే జాతక పరిశీలన (Telugu Jathakam), వివాహ & గృహప్రవేశ ముహూర్తాలు, నేటి పంచాంగం (${dayLabel}: ${tithiLabel}, ${nakshatraLabel}) మరియు వైదిక హోమ సేవలు.`,
      templeProximity,
      priority: isUSA ? 0.85 : 0.9,
      changefreq: 'daily',
    });

    // Route Set 2: Localized Neti Panchangam & Muhurtham Timings in [City] (258 routes)
    const panchangamPath = `/neti-panchangam-in-${city.slug}`;
    routes.push({
      path: panchangamPath,
      canonicalUrl: `${baseUrl}${panchangamPath}`,
      citySlug: city.slug,
      cityName: city.name,
      cityTeluguName: city.teluguName,
      state: city.state,
      regionType: city.regionType,
      intent: 'neti-panchangam',
      titleTe: `నేటి పంచాంగం ${city.teluguName} (${dayLabel}) | Neti Panchangam in ${city.name} - తిథి: ${tithiLabel}, నక్షత్రం: ${nakshatraLabel}`,
      titleEn: `Neti Panchangam in ${city.name} (${city.teluguName}) | Today Telugu Panchangam, Rahu Kalam & Shubha Muhurtham`,
      metaDescription: `${city.teluguName} (${city.name}) స్థానిక సూర్యోదయ ప్రమాణాలతో ${dayLabel} నేటి పంచాంగం (Neti Panchangam): తిథి ${tithiLabel}, నక్షత్రం ${nakshatraLabel}, రాహుకాలం, అమృత ఘడియలు, గౌరీ పంచాంగం & ${templeProximity.templeNameTe} సంకల్ప కాలమానం.`,
      templeProximity,
      priority: 0.85,
      changefreq: 'daily',
    });
  }

  // Route Set 3: Top 50 Cities Localized Jathakam & Vivaha Pontana Landing Pages (+50 routes => 566 total)
  const topCitiesForJathakam = [
    ...AP_CITIES.slice(0, 20),
    ...TELANGANA_CITIES.slice(0, 15),
    ...USA_TELUGU_CITIES.slice(0, 15),
  ];

  for (const city of topCitiesForJathakam) {
    const templeProximity = getCityTempleProximity(city);
    const jathakamPath = `/vivaha-pontana-jatakam-in-${city.slug}`;
    routes.push({
      path: jathakamPath,
      canonicalUrl: `${baseUrl}${jathakamPath}`,
      citySlug: city.slug,
      cityName: city.name,
      cityTeluguName: city.teluguName,
      state: city.state,
      regionType: city.regionType,
      intent: 'vivaha-muhurtham',
      titleTe: `${city.teluguName} (${city.name}) వివాహ పొంతన, జన్మ కుండలి & శుభ ముహూర్తాలు | బృహత్ జాతక గ్రంథం & భృగు చక్ర పద్ధతి`,
      titleEn: `Telugu Jathakam, 36 Guna Marriage Matching & Wedding Muhurtham in ${city.name} (${city.teluguName})`,
      metaDescription: `${city.teluguName} (${city.name}) లో బృహత్ జాతక గ్రంథం, భృగు చక్ర పద్ధతి & ముహూర్త చింతామణి ఆధారంగా 36 గుణాల వివాహ పొంతన, జన్మ కుండలి విశ్లేషణ మరియు ${templeProximity.templeNameTe} సాన్నిధ్యంలో శుభ ముహూర్త నిర్ణయం.`,
      templeProximity,
      priority: 0.8,
      changefreq: 'weekly',
    });
  }

  return routes;
}

/**
 * Resolves any of the 500+ localized static route paths (`/telugu-astrologer-in-*`, `/neti-panchangam-in-*`,
 * `/today-panchangam-in-*`, `/vivaha-pontana-jatakam-in-*`) back to its `CitySEOData` and `LocalizedPageIntent`.
 */
export function resolveLocalizedCityRoute(pathname: string): {
  city: CitySEOData;
  intent: LocalizedPageIntent;
  templeProximity: TempleProximityInfo;
} | null {
  if (!pathname) return null;
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';

  const prefixes: Array<{ prefix: string; intent: LocalizedPageIntent }> = [
    { prefix: '/telugu-astrologer-in-', intent: 'astrologer-purohit' },
    { prefix: '/neti-panchangam-in-', intent: 'neti-panchangam' },
    { prefix: '/telugu-panchangam-in-', intent: 'neti-panchangam' },
    { prefix: '/vivaha-pontana-jatakam-in-', intent: 'vivaha-muhurtham' },
  ];

  for (const { prefix, intent } of prefixes) {
    if (clean.startsWith(prefix)) {
      const slug = clean.slice(prefix.length);
      const city = findCityBySlug(slug);
      if (city) {
        return {
          city,
          intent,
          templeProximity: getCityTempleProximity(city),
        };
      }
    }
  }

  return null;
}

export interface SEOContentManagerProps {
  city: CitySEOData;
  currentDay?: DayData;
  intent?: LocalizedPageIntent;
  onSelectCityRoute?: (citySlug: string, routePath?: string) => void;
  onNavigatePanchangam?: () => void;
  onOpenBooking?: (serviceName?: string) => void;
}

/**
 * SEOContentManager Component
 * Content template component that dynamically injects local metadata, city names, local coordinates,
 * and temple proximity references for 500+ localized landing pages (AP, Telangana, USA).
 */
export const SEOContentManager: React.FC<SEOContentManagerProps> = ({
  city,
  currentDay,
  intent = 'astrologer-purohit',
  onSelectCityRoute,
  onNavigatePanchangam,
  onOpenBooking,
}) => {
  const [activeRegionFilter, setActiveRegionFilter] = useState<'AP' | 'Telangana' | 'USA'>(
    city.regionType
  );
  const [searchQuery, setSearchQuery] = useState('');

  const templeProximity = useMemo(() => getCityTempleProximity(city), [city]);
  const allLocalizedRoutes = useMemo(
    () => generateLocalizedStaticRoutes(currentDay),
    [currentDay]
  );

  const currentRouteEntry = useMemo(() => {
    return (
      allLocalizedRoutes.find(
        (r) => r.citySlug === city.slug && r.intent === intent
      ) || allLocalizedRoutes.find((r) => r.citySlug === city.slug)
    );
  }, [allLocalizedRoutes, city.slug, intent]);

  // Dynamically inject local metadata + Temple Proximity Place & WebApplication Schema
  useEffect(() => {
    if (!currentRouteEntry || typeof document === 'undefined') return;

    document.title = currentRouteEntry.titleTe;

    const setMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', currentRouteEntry.metaDescription);
    setMeta('meta[name="article:description"]', 'name', 'article:description', currentRouteEntry.metaDescription);
    setMeta('meta[property="og:title"]', 'property', 'og:title', currentRouteEntry.titleTe);
    setMeta('meta[property="og:description"]', 'property', 'og:description', currentRouteEntry.metaDescription);
    setMeta('meta[property="og:url"]', 'property', 'og:url', currentRouteEntry.canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', currentRouteEntry.titleTe);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', currentRouteEntry.metaDescription);
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', currentRouteEntry.canonicalUrl);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalEl) {
      canonicalEl.setAttribute('href', currentRouteEntry.canonicalUrl);
    }

    const schemaScriptId = 'seo-content-manager-local-schema';
    let scriptEl = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaScriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const cleanTithi = currentDay?.panchanga.tithi || 'శుభ తిథి';
    const cleanNakshatra = currentDay?.panchanga.nakshatram || 'శుభ నక్షత్రం';

    const localSchemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': `${currentRouteEntry.canonicalUrl}#webapp`,
          name: `Neti Panchangam & Telugu Jyothisham in ${city.name} (${city.teluguName})`,
          url: currentRouteEntry.canonicalUrl,
          applicationCategory: 'LifestyleApplication',
          applicationSubCategory: 'Vedic Astrology, Daily Panchangam & Muhurtham Calculator',
          operatingSystem: 'All',
          browserRequirements: 'Requires HTML5 / JavaScript',
          inLanguage: ['te', 'en'],
          isAccessibleForFree: true,
          description: currentRouteEntry.metaDescription,
          featureList: [
            `${city.name} (${city.teluguName}) Neti Panchangam & Sunrise/Sunset Timings`,
            `Temple Proximity Sankalpam: ${templeProximity.templeNameEn}`,
            'Free Telugu Janma Kundali & Brihat Jataka Predictions',
            '36-Point Ashtakoota Vivaha Pontana',
            'Gowri Panchangam, Hora Chakram & Tarabalam Calculator',
          ],
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: city.country === 'USA' ? 'USD' : 'INR',
            availability: 'https://schema.org/InStock',
          },
          areaServed: {
            '@type': 'City',
            name: city.name,
            containedInPlace: {
              '@type': 'AdministrativeArea',
              name: city.state,
            },
          },
        },
        {
          '@type': 'Place',
          '@id': `${currentRouteEntry.canonicalUrl}#temple-proximity`,
          name: `${city.name} (${city.teluguName}) — ${templeProximity.templeNameEn}`,
          description: `${templeProximity.proximitySummaryTe}. ${templeProximity.kshetraSignificanceTe}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: city.name,
            addressRegion: city.state,
            addressCountry: city.country === 'USA' ? 'US' : 'IN',
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${currentRouteEntry.canonicalUrl}#local-panchangam-faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: `${city.teluguName} (${city.name}) లో నేటి పంచాంగం (Neti Panchangam) తిథి మరియు నక్షత్రం ఏమిటి?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${city.teluguName} (${city.name}) స్థానిక కాలమానం ప్రకారం ${currentDay?.teediVaram || 'ఈ రోజు'} తిథి: ${cleanTithi}, నక్షత్రం: ${cleanNakshatra}, రాహుకాలం: ${currentDay?.ashubha.rahukalam || 'స్థానిక కాలమానం'}, అమృత ఘడియలు: ${currentDay?.shubha.amrutha || 'శుభ సమయం'}.`,
              },
            },
            {
              '@type': 'Question',
              name: `${city.teluguName} భక్తులకు ఏ పుణ్యక్షేత్ర సాన్నిధ్యం మరియు సంకల్ప ప్రమాణం వర్తిస్తుంది?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${city.teluguName} (${city.name}) భక్తులకు ${templeProximity.templeNameTe} సాన్నిధ్యంలో (${templeProximity.latitudeHint}, ${templeProximity.longitudeHint}) ${templeProximity.kshetraSignificanceTe}`,
              },
            },
          ],
        },
      ],
    };

    scriptEl.textContent = JSON.stringify(localSchemaGraph);

    return () => {
      const existing = document.getElementById(schemaScriptId);
      if (existing) existing.remove();
    };
  }, [currentRouteEntry, city, templeProximity, currentDay]);

  const filteredRoutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allLocalizedRoutes
      .filter((r) => r.regionType === activeRegionFilter && r.intent === 'astrologer-purohit')
      .filter(
        (r) =>
          !q ||
          r.cityName.toLowerCase().includes(q) ||
          r.cityTeluguName.includes(q) ||
          r.state.toLowerCase().includes(q)
      );
  }, [allLocalizedRoutes, activeRegionFilter, searchQuery]);

  return (
    <section
      aria-label={`${city.name} Temple Proximity & Localized Panchangam Context`}
      className="mt-10 space-y-8"
    >
      {/* 1. Temple Proximity & Sacred Kshetra Sannidhi Card */}
      <div className="bg-gradient-to-br from-amber-950 via-[#2d1206] to-stone-900 text-amber-50 rounded-2xl p-6 sm:p-8 border-2 border-amber-500/60 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-700/60 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
              <Landmark size={20} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-amber-300 font-bold block">
                స్థానిక పుణ్యక్షేత్ర సాన్నిధ్యం &amp; దేశకాల సంకల్ప ప్రమాణం • Temple Proximity &amp; Local Coordinates
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-white leading-snug">
                {city.teluguName} ({city.name}) — {templeProximity.templeNameTe}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-amber-900/70 border border-amber-600/50 px-3 py-1.5 rounded-lg text-amber-200">
            <Compass size={14} className="text-amber-400" />
            <span>
              {templeProximity.latitudeHint} · {templeProximity.longitudeHint}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3 text-sm sm:text-base text-amber-100/95 leading-relaxed">
            <p>
              <strong className="text-amber-300 font-bold">క్షేత్ర సాన్నిధ్యం:</strong>{' '}
              {templeProximity.proximitySummaryTe}. ఆరాధ్య దైవం:{' '}
              <strong className="text-white">{templeProximity.deityTe}</strong>.
            </p>
            <p>
              <strong className="text-amber-300 font-bold">
                ముహూర్త చింతామణి &amp; స్థానిక లగ్న ప్రమాణం:
              </strong>{' '}
              {templeProximity.kshetraSignificanceTe} యవనాచార్యుల మతం, బృహత్ జాతక గ్రంథం మరియు భృగు చక్ర పద్ధతి ఆధారంగా{' '}
              <strong>{city.teluguName} ({city.name})</strong> లోని భక్తులకు కచ్చితమైన జన్మ కుండలి మరియు శుభ ముహూర్త నిర్ణయం చేయబడుతుంది.
            </p>
            <p className="text-xs text-amber-300/90 font-sans">
              {templeProximity.proximitySummaryEn} — {templeProximity.templeNameEn}.
            </p>
          </div>

          {/* Live Daily Panchangam Snapshot for this City */}
          {currentDay && (
            <div className="bg-amber-900/40 border border-amber-500/40 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-amber-700/50 pb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{city.teluguName} నేటి పంచాంగం</span>
                </span>
                <span className="text-[11px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded font-semibold">
                  {currentDay.teediVaram}
                </span>
              </div>
              <ul className="text-xs space-y-1.5 text-amber-100">
                <li>
                  <span className="text-amber-300 font-semibold">తిథి:</span> {currentDay.panchanga.tithi}
                </li>
                <li>
                  <span className="text-amber-300 font-semibold">నక్షత్రం:</span>{' '}
                  {currentDay.panchanga.nakshatram}
                </li>
                <li>
                  <span className="text-amber-300 font-semibold">రాహుకాలం:</span>{' '}
                  {currentDay.ashubha.rahukalam}
                </li>
                <li>
                  <span className="text-amber-300 font-semibold">అమృత ఘడియలు:</span>{' '}
                  {currentDay.shubha.amrutha}
                </li>
              </ul>
              <div className="pt-2 flex flex-wrap gap-2">
                {onNavigatePanchangam && (
                  <button
                    type="button"
                    onClick={onNavigatePanchangam}
                    className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-amber-950 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    సంపూర్ణ నేటి పంచాంగం &rarr;
                  </button>
                )}
                {onOpenBooking && (
                  <button
                    type="button"
                    onClick={() => onOpenBooking(`${city.name} Muhurtham & Jathakam Consultation`)}
                    className="text-xs font-bold bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-500/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    ముహూర్త సంప్రదింపు
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3 Localized Intent Links for the Current City */}
        <div className="mt-5 pt-4 border-t border-amber-800/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-amber-300 font-bold flex items-center gap-1">
            <Sparkles size={13} />
            <span>{city.teluguName} ప్రత్యేక పేజీలు:</span>
          </span>
          <a
            href={`/telugu-astrologer-in-${city.slug}`}
            onClick={(e) => {
              if (onSelectCityRoute) {
                e.preventDefault();
                onSelectCityRoute(city.slug, `/telugu-astrologer-in-${city.slug}`);
              }
            }}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              intent === 'astrologer-purohit'
                ? 'bg-amber-500 text-amber-950 border-amber-400 font-bold'
                : 'bg-amber-900/50 text-amber-200 border-amber-700 hover:bg-amber-800'
            }`}
          >
            {city.teluguName} జ్యోతిష &amp; పురోహిత సేవలు
          </a>
          <a
            href={`/neti-panchangam-in-${city.slug}`}
            onClick={(e) => {
              if (onSelectCityRoute) {
                e.preventDefault();
                onSelectCityRoute(city.slug, `/neti-panchangam-in-${city.slug}`);
              }
            }}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              intent === 'neti-panchangam'
                ? 'bg-amber-500 text-amber-950 border-amber-400 font-bold'
                : 'bg-amber-900/50 text-amber-200 border-amber-700 hover:bg-amber-800'
            }`}
          >
            {city.teluguName} నేటి పంచాంగం &amp; రాహుకాలం
          </a>
          <a
            href={`/vivaha-pontana-jatakam-in-${city.slug}`}
            onClick={(e) => {
              if (onSelectCityRoute) {
                e.preventDefault();
                onSelectCityRoute(city.slug, `/vivaha-pontana-jatakam-in-${city.slug}`);
              }
            }}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              intent === 'vivaha-muhurtham'
                ? 'bg-amber-500 text-amber-950 border-amber-400 font-bold'
                : 'bg-amber-900/50 text-amber-200 border-amber-700 hover:bg-amber-800'
            }`}
          >
            {city.teluguName} వివాహ పొంతన &amp; జన్మ కుండలి
          </a>
        </div>
      </div>

      {/* 2. Programmatic 500+ Localized City Directory Navigator */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4 mb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Globe size={14} className="text-amber-700" />
              <span>
                {allLocalizedRoutes.length}+ ప్రాంతీయ జ్యోతిష &amp; పంచాంగ కేంద్రాలు (AP, Telangana &amp; USA)
              </span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-amber-950 mt-0.5">
              ఇతర నగరాల తెలుగు పంచాంగం &amp; జ్యోతిష సేవల కేంద్రాలు
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['AP', 'Telangana', 'USA'] as const).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegionFilter(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeRegionFilter === region
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {region === 'AP'
                  ? `ఆంధ్రప్రదేశ్ (${AP_CITIES.length})`
                  : region === 'Telangana'
                  ? `తెలంగాణ (${TELANGANA_CITIES.length})`
                  : `USA NRI (${USA_TELUGU_CITIES.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* City Filter Input */}
        <div className="relative mb-4 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="నగరం పేరు వెతకండి (ఉదా: Vijayawada, Warangal, Dallas)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-amber-200 bg-amber-50/40 focus:outline-none focus:border-amber-500 text-stone-800"
          />
        </div>

        {/* Programmatic Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
          {filteredRoutes.map((entry) => {
            const isCurrent = entry.citySlug === city.slug;
            return (
              <a
                key={entry.path}
                href={entry.path}
                onClick={(e) => {
                  if (onSelectCityRoute) {
                    e.preventDefault();
                    onSelectCityRoute(entry.citySlug, entry.path);
                  }
                }}
                className={`flex items-center justify-between gap-1.5 px-3 py-2 rounded-lg text-xs border transition-all ${
                  isCurrent
                    ? 'bg-amber-900 text-white border-amber-800 font-bold'
                    : 'bg-amber-50/50 hover:bg-amber-100/80 text-stone-800 border-amber-200/70'
                }`}
              >
                <span className="truncate">
                  <MapPin size={11} className="inline mr-1 text-amber-600" />
                  {entry.cityTeluguName} ({entry.cityName})
                </span>
                <ChevronRight size={12} className="shrink-0 opacity-60" />
              </a>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-amber-700" />
            <span>
              మొత్తం {allLocalizedRoutes.length} స్థానిక పేజీలు (ఆంధ్రప్రదేశ్, తెలంగాణ &amp; అమెరికా తెలుగు కేంద్రాల సమగ్ర అనుసంధానం)
            </span>
          </span>
          <span>దృక్సిద్ధాంత పంచాంగం · శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం</span>
        </div>
      </div>
    </section>
  );
};
