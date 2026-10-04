import { DailyLearning, HDate } from '@hebcal/core';
import '@hebcal/learning';

// מחזור דף יומי שאותו אנחנו רוצים לבדוק
const cycle = 14;

// נתחיל מתאריך ידוע בתוך המחזור.
// נלך אחורה/קדימה מספיק זמן כדי לאתר את תחילת המחזור.
const startDate = new Date(2026, 9, 4);
const startHDate = new HDate(startDate);

console.log("Checking Daf Yomi...");
console.log("Starting date:", startDate.toDateString());
console.log();

// בדיקה של הדף בתאריך הנוכחי
const current = DailyLearning.lookup('dafYomi', startHDate, true);

console.log("Current Daf:");
console.log(current);
console.log();

if (!current || !current.daf) {
    throw new Error("Could not find Daf Yomi data.");
}

console.log("Tractate:", current.daf.name);
console.log("Daf:", current.daf.blatt);
console.log("Cycle:", current.daf.cycle);
console.log();

// נבדוק רצף של 20 ימים קדימה
console.log("Next 20 days:");
console.log("--------------------------------");

for (let i = 0; i < 20; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const hdate = new HDate(date);
    const event = DailyLearning.lookup('dafYomi', hdate, true);

    if (event && event.daf) {
        console.log(
            `${i + 1}. ${date.toISOString().slice(0, 10)} → ` +
            `${event.daf.name} ${event.daf.blatt} ` +
            `(cycle ${event.daf.cycle})`
        );
    } else {
        console.log(
            `${i + 1}. ${date.toISOString().slice(0, 10)} → NO DATA`
        );
    }
}