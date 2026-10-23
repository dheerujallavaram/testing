export interface LagnaPramanam {
  lagnam: string;
  samayam: string;
}

export interface DayPanchanga {
  samvatsaram: string;
  masam: string;
  tithi: string;
  nakshatram: string;
  yogam: string;
  karanam: string;
}

export interface ShubhaSamayalu {
  amrutha: string;
  abhijit: string;
}

export interface AshubhaSamayalu {
  rahukalam: string;
  yamagandam: string;
  durmuhurtham: string;
  varjyam: string;
}

export interface ChandraBalam {
  sancharam: string;
  chandrashtamam: string;
  navataraBalam: string;
}

export interface DayData {
  id: string;
  label: string;
  dateNum: string;
  teediVaram: string;
  isoDate: string; // e.g. "2026-10-21"
  monthName?: string; // e.g. "అక్టోబర్", "నవంబర్", "డిసెంబర్"
  panchanga: DayPanchanga;
  lagnalu: LagnaPramanam[];
  grahaStithi: Record<string, string>;
  shubha: ShubhaSamayalu;
  ashubha: AshubhaSamayalu;
  chandra: ChandraBalam;
  phalitham: string;
  deity: string;
  luckyColor: string;
  specialEvent?: string;
}

export interface RashiHouse {
  key: string;
  name: string;
  english: string;
  lord: string;
  symbol: string;
  element: string;
}

export interface NakshatraInfo {
  index: number;
  telugu: string;
  english: string;
  rashi: string;
  lord: string;
}

export interface PoojaService {
  id: string;
  name: string;
  teluguName: string;
  description: string;
  duration: string;
  benefits: string;
  category: 'homam' | 'abhishekam' | 'pooja' | 'muhurtham' | 'vratham';
  recommendedDays: string;
  englishDescription?: string;
  englishDuration?: string;
  englishBenefits?: string;
  englishRecommendedDays?: string;
}

export interface BookingSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gotram: string;
  rashi: string;
  nakshatram: string;
  poojaId: string;
  poojaName: string;
  date: string;
  location: 'temple' | 'home' | 'online';
  sankalpamNote?: string;
  createdAt: string;
}
