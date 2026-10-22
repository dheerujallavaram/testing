import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTaraBalam,
  parseTimeToMinutes,
  findActiveLagna,
  checkChandrashtamam,
  generateWhatsAppShareText,
  getTodayAndTomorrowIds,
} from './panchangaLogic';
import { WEEK_DATA } from '../data/panchangamData';
import { translatePanchangamString } from '../context/LanguageContext';

test('parseTimeToMinutes parses 12-hour AM/PM times accurately', () => {
  assert.equal(parseTimeToMinutes('06:34 AM'), 394);
  assert.equal(parseTimeToMinutes('01:12 PM'), 792);
  assert.equal(parseTimeToMinutes('12:00 AM'), 0);
  assert.equal(parseTimeToMinutes('12:30 PM'), 750);
  assert.equal(parseTimeToMinutes('11:59 PM'), 1439);
});

test('calculateTaraBalam produces authentic 9-tara cycle values', () => {
  // Same nakshatra gives Janma Tara (1)
  const same = calculateTaraBalam(12, 12);
  assert.equal(same.taraNumber, 1);
  assert.equal(same.taraName, 'జన్మ తార');

  // Next nakshatra gives Sampat Tara (2)
  const next = calculateTaraBalam(12, 13);
  assert.equal(next.taraNumber, 2);
  assert.equal(next.taraName, 'సంపత్ తార');
  assert.equal(next.isFavorable, true);
  assert.equal(next.grade, 'excellent');

  // 9th nakshatra gives Parama Mitra Tara (9)
  const ninth = calculateTaraBalam(1, 9);
  assert.equal(ninth.taraNumber, 9);
  assert.equal(ninth.taraName, 'పరమ మిత్ర తార');
  assert.equal(ninth.isFavorable, true);

  // Wrap around after 9 taras (e.g., 10th is Janma, 11th is Sampat)
  const tenth = calculateTaraBalam(1, 10);
  assert.equal(tenth.taraNumber, 1);
});

test('findActiveLagna correctly matches day and night lagnas including midnight crossover', () => {
  const oct21 = WEEK_DATA.find((d) => d.id === '2026-10-21')!;
  assert.ok(oct21);

  // 07:00 AM (420 mins) should fall in Thula Lagna (06:13 AM - 08:11 AM)
  const morningLagna = findActiveLagna(oct21.lagnalu, 420);
  assert.ok(morningLagna);
  assert.equal(morningLagna?.lagnam, 'తుల లగ్నం');

  // 11:45 PM (1425 mins) spans midnight (11:32 PM to 01:45 AM) -> Karkataka Lagna
  const nightLagna = findActiveLagna(oct21.lagnalu, 1425);
  assert.ok(nightLagna);
  assert.equal(nightLagna?.lagnam, 'కర్కాటక లగ్నం');

  // 00:30 AM (30 mins) still inside Karkataka Lagna
  const postMidnightLagna = findActiveLagna(oct21.lagnalu, 30);
  assert.ok(postMidnightLagna);
  assert.equal(postMidnightLagna?.lagnam, 'కర్కాటక లగ్నం');
});

test('checkChandrashtamam correctly flags affected zodiac signs', () => {
  const oct21 = WEEK_DATA.find((d) => d.id === '2026-10-21')!;
  // On Oct 21, Moon in Kumbham, Karkataka has Chandrashtamam
  assert.equal(checkChandrashtamam('karkatakam', oct21), true);
  assert.equal(checkChandrashtamam('mesham', oct21), false);

  const dec3 = WEEK_DATA.find((d) => d.id === '2026-12-03')!;
  // On Dec 3, Moon in Kanya, Kumbham has Chandrashtamam
  assert.equal(checkChandrashtamam('kumbham', dec3), true);
  assert.equal(checkChandrashtamam('mesham', dec3), false);
});

test('generateWhatsAppShareText creates Panchangam message with Mesham-Mithunam teaser, website CTA, and no phone number', () => {
  const oct22 = WEEK_DATA.find((d) => d.id === '2026-10-22')!;
  const testUrl = 'https://sreelakshmi-ganapathi-astrology.com/';
  const textWithUrl = generateWhatsAppShareText(oct22, testUrl);

  assert.ok(textWithUrl.includes('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం'));
  assert.ok(textWithUrl.includes('22 అక్టోబర్ 2026'));
  assert.ok(textWithUrl.includes('రాహు కాలం'));

  // Should NOT include Guruji's phone number
  assert.equal(textWithUrl.includes('8977986166'), false);

  // Should include Mesha, Vrushabha, and Mithuna Rashi daily fortune teaser
  assert.ok(textWithUrl.includes('మేష రాశి'));
  assert.ok(textWithUrl.includes('వృషభ రాశి'));
  assert.ok(textWithUrl.includes('మిథున రాశి'));

  // Should include the teaser CTA for remaining rashis and website link
  assert.ok(textWithUrl.includes('మిగతా రాశి ఫలితాలు'));
  assert.ok(textWithUrl.includes(testUrl));
});

test('getTodayAndTomorrowIds resolves 22 Oct as today and 23 Oct as tomorrow when date is Oct 22, 2026', () => {
  const oct22Date = new Date('2026-10-22T08:00:00Z');
  const res = getTodayAndTomorrowIds(WEEK_DATA, oct22Date);
  assert.equal(res.todayId, '2026-10-22');
  assert.equal(res.tomorrowId, '2026-10-23');
  assert.equal(res.todayDay.dateNum, '22');
  assert.equal(res.tomorrowDay.dateNum, '23');
});

test('no consecutive days repeat the same festival specialEvent', () => {
  for (let i = 1; i < WEEK_DATA.length; i++) {
    const prev = WEEK_DATA[i - 1];
    const curr = WEEK_DATA[i];
    if (prev.specialEvent && curr.specialEvent) {
      assert.notEqual(
        prev.specialEvent,
        curr.specialEvent,
        `Duplicate consecutive festival on ${prev.id} and ${curr.id}: ${curr.specialEvent}`
      );
    }
  }
});

test('translatePanchangamString keeps Telugu in te mode and translates Panchangam terminology in en mode', () => {
  const sampleTithi = 'ఏకాదశి (రాత్రి 10:15 PM వరకు)';
  assert.equal(translatePanchangamString(sampleTithi, 'te'), sampleTithi);

  const enTithi = translatePanchangamString(sampleTithi, 'en');
  assert.ok(enTithi.includes('Ekadashi'));
  assert.ok(enTithi.includes('Night'));

  const sampleNakshatra = 'ధనిష్ఠ (మధ్యాహ్నం 02:30 PM వరకు)';
  const enNakshatra = translatePanchangamString(sampleNakshatra, 'en');
  assert.ok(enNakshatra.includes('Dhanishtha'));
  assert.ok(enNakshatra.includes('Afternoon'));
});


