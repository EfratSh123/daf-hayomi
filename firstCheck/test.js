import { DailyLearning, HDate } from '@hebcal/core';
import '@hebcal/learning';

const date = new Date(2026, 9, 4); // 4 באוקטובר 2026
const hd = new HDate(date);

const result = DailyLearning.lookup('dafYomi', hd, true);

console.log(result);
console.log(result?.render('en'));
