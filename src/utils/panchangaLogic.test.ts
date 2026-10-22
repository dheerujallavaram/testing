import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTaraBalam,
  parseTimeToMinutes,
  findActiveLagna,
  checkChandrashtamam,
  generateWhatsAppShareText,
} from './panchangaLogic';
import { WEEK_DATA } from '../data/panchangamData';

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

test('generateWhatsAppShareText creates complete formatted message', () => {
  const oct21 = WEEK_DATA.find((d) => d.id === '2026-10-21')!;
  const text = generateWhatsAppShareText(oct21);
  assert.ok(text.includes('శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం'));
  assert.ok(text.includes('21 అక్టోబర్ 2026'));
  assert.ok(text.includes('దశమి'));
  assert.ok(text.includes('ధనిష్ఠ'));
  assert.ok(text.includes('రాహు కాలం'));
});
