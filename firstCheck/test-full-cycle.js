import { DailyLearning, HDate } from '@hebcal/core';
import '@hebcal/learning';

const TARGET_CYCLE = 14;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

// יצירת Date בלי בעיית UTC
function createDate(year, month, day) {
    return new Date(year, month - 1, day, 12, 0, 0);
}

// הצגת תאריך מקומי בלבד
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// מעבר ליום הבא
function addDays(date, days = 1) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// קבלת Daf Yomi עבור תאריך
function getDaf(date) {
    const hdate = new HDate(date);

    return DailyLearning.lookup(
        'dafYomi',
        hdate,
        true
    );
}

// ------------------------------------------------------------
// 1. Find the beginning of the target cycle
// ------------------------------------------------------------

console.log('==========================================');
console.log('      FULL DAF YOMI CYCLE TEST');
console.log('==========================================');
console.log();

console.log(`Looking for cycle ${TARGET_CYCLE}...`);
console.log();

// נתחיל מתאריך שאנחנו יודעים שנמצא בתוך מחזור 14
let searchDate = createDate(2026, 10, 4);

// נחפש אחורה עד שנצא ממחזור 14
while (true) {
    const previousDate = addDays(searchDate, -1);
    const event = getDaf(previousDate);

    if (!event || !event.daf || event.daf.cycle !== TARGET_CYCLE) {
        break;
    }

    searchDate = previousDate;
}

const cycleStart = searchDate;

console.log(`Cycle ${TARGET_CYCLE} starts on: ${formatDate(cycleStart)}`);
console.log();

// ------------------------------------------------------------
// 2. Collect the entire cycle
// ------------------------------------------------------------

const records = [];

let currentDate = cycleStart;

while (true) {
    const event = getDaf(currentDate);

    // אין נתונים
    if (!event || !event.daf) {
        console.log(
            `Stopping: no Daf Yomi data on ${formatDate(currentDate)}`
        );
        break;
    }

    // עברנו למחזור הבא
    if (event.daf.cycle !== TARGET_CYCLE) {
        break;
    }

    records.push({
        date: formatDate(currentDate),
        tractate: event.daf.name,
        daf: event.daf.blatt,
        cycle: event.daf.cycle
    });

    currentDate = addDays(currentDate, 1);
}

// ------------------------------------------------------------
// 3. Basic information
// ------------------------------------------------------------

console.log('==========================================');
console.log('BASIC RESULTS');
console.log('==========================================');

console.log(`Total daily records: ${records.length}`);

if (records.length > 0) {
    console.log(`First date: ${records[0].date}`);
    console.log(
        `First Daf: ${records[0].tractate} ${records[0].daf}`
    );

    console.log(`Last date: ${records[records.length - 1].date}`);
    console.log(
        `Last Daf: ${
            records[records.length - 1].tractate
        } ${records[records.length - 1].daf}`
    );
}

console.log();

// ------------------------------------------------------------
// 4. Check cycle number
// ------------------------------------------------------------

console.log('==========================================');
console.log('CHECK 1 - CYCLE NUMBER');
console.log('==========================================');

const wrongCycleRecords = records.filter(
    record => record.cycle !== TARGET_CYCLE
);

if (wrongCycleRecords.length === 0) {
    console.log('PASS: All records belong to cycle', TARGET_CYCLE);
} else {
    console.log(
        'FAIL:',
        wrongCycleRecords.length,
        'records belong to another cycle.'
    );
}

console.log();

// ------------------------------------------------------------
// 5. Check duplicate date records
// ------------------------------------------------------------

console.log('==========================================');
console.log('CHECK 2 - DUPLICATE DATES');
console.log('==========================================');

const dates = records.map(record => record.date);
const uniqueDates = new Set(dates);

if (uniqueDates.size === dates.length) {
    console.log('PASS: No duplicate dates.');
} else {
    console.log(
        'FAIL:',
        dates.length - uniqueDates.size,
        'duplicate dates found.'
    );
}

console.log();

// ------------------------------------------------------------
// 6. Check duplicate dapim
// ------------------------------------------------------------

console.log('==========================================');
console.log('CHECK 3 - DUPLICATE DAPIM');
console.log('==========================================');

const dafKeys = records.map(
    record => `${record.tractate}-${record.daf}`
);

const uniqueDafKeys = new Set(dafKeys);

if (uniqueDafKeys.size === dafKeys.length) {
    console.log('PASS: No duplicate dapim.');
} else {
    console.log(
        'FAIL:',
        dafKeys.length - uniqueDafKeys.size,
        'duplicate dapim found.'
    );
}

console.log();

// ------------------------------------------------------------
// 7. Check consecutive dates
// ------------------------------------------------------------

console.log('==========================================');
console.log('CHECK 4 - CONSECUTIVE DATES');
console.log('==========================================');

let dateErrors = 0;

for (let i = 1; i < records.length; i++) {
    const previous = new Date(records[i - 1].date);
    const current = new Date(records[i].date);

    const difference =
        (current - previous) / (1000 * 60 * 60 * 24);

    if (difference !== 1) {
        console.log(
            `Date gap between ${records[i - 1].date} and ${records[i].date}`
        );

        dateErrors++;
    }
}

if (dateErrors === 0) {
    console.log('PASS: All dates are consecutive.');
} else {
    console.log(
        'FAIL:',
        dateErrors,
        'date gaps found.'
    );
}

console.log();

// ------------------------------------------------------------
// 8. Show tractate changes
// ------------------------------------------------------------

console.log('==========================================');
console.log('TRACTATE CHANGES');
console.log('==========================================');

let previousTractate = null;
let tractateChanges = 0;

for (const record of records) {
    if (
        previousTractate !== null &&
        record.tractate !== previousTractate
    ) {
        tractateChanges++;

        console.log(
            `${previousTractate} -> ${record.tractate} ` +
            `on ${record.date} (Daf ${record.daf})`
        );
    }

    previousTractate = record.tractate;
}

console.log();
console.log(`Total tractate changes: ${tractateChanges}`);
console.log();

// ------------------------------------------------------------
// 9. Count dapim by tractate
// ------------------------------------------------------------

console.log('==========================================');
console.log('DAPIM BY TRACTATE');
console.log('==========================================');

const tractateCounts = new Map();

for (const record of records) {
    const currentCount =
        tractateCounts.get(record.tractate) || 0;

    tractateCounts.set(
        record.tractate,
        currentCount + 1
    );
}

for (const [tractate, count] of tractateCounts) {
    console.log(
        `${tractate}: ${count}`
    );
}

console.log();

// ------------------------------------------------------------
// 10. Expected Daf Yomi total
// ------------------------------------------------------------

console.log('==========================================');
console.log('CHECK 5 - EXPECTED TOTAL');
console.log('==========================================');

const EXPECTED_DAFIM = 2711;

console.log(
    `Hebcal returned: ${records.length}`
);

console.log(
    `Expected Daf Yomi cycle size: ${EXPECTED_DAFIM}`
);

if (records.length === EXPECTED_DAFIM) {
    console.log('PASS: Total number of dapim matches 2711.');
} else {
    console.log(
        'WARNING: Number does not match 2711.'
    );
}

console.log();

// ------------------------------------------------------------
// 11. Final summary
// ------------------------------------------------------------

console.log('==========================================');
console.log('FINAL SUMMARY');
console.log('==========================================');

console.log(`Cycle: ${TARGET_CYCLE}`);
console.log(`Start: ${records[0]?.date}`);
console.log(`End: ${records[records.length - 1]?.date}`);
console.log(`Records: ${records.length}`);
console.log(`Unique dates: ${uniqueDates.size}`);
console.log(`Unique dapim: ${uniqueDafKeys.size}`);
console.log(`Tractates: ${tractateCounts.size}`);
console.log();

console.log('Test completed.');