import { DailyLearning, HDate } from '@hebcal/core';
import '@hebcal/learning';

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Noon avoids a date shifting to the previous/next day under DST changes.
function noon(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
}

function lookupDaf(date) {
    const hdate = new HDate(date);
    return DailyLearning.lookup('dafYomi', hdate, true);
}

export function findCycleStart(fromDate) {
    const anchor = lookupDaf(fromDate);

    if (!anchor || !anchor.daf) {
        throw new Error(`No Daf Yomi data for ${formatDate(fromDate)}`);
    }

    const cycle = anchor.daf.cycle;
    let cycleStart = noon(fromDate);

    while (true) {
        const previousDate = addDays(cycleStart, -1);
        const previousEvent = lookupDaf(previousDate);

        if (!previousEvent || !previousEvent.daf || previousEvent.daf.cycle !== cycle) {
            break;
        }

        cycleStart = previousDate;
    }

    return { cycleStart, cycle };
}

export function collectCycle(cycleStart, cycle) {
    const entries = [];
    let currentDate = noon(cycleStart);

    while (true) {
        const event = lookupDaf(currentDate);

        if (!event || !event.daf || event.daf.cycle !== cycle) {
            break;
        }

        const hdate = new HDate(currentDate);

        entries.push({
            gregorianDate: formatDate(currentDate),
            hebrewDate: hdate.toString(),
            cycle: event.daf.cycle,
            tractate: event.daf.name,
            daf: event.daf.blatt,
            display: event.renderBrief('en'),
        });

        currentDate = addDays(currentDate, 1);
    }

    return entries;
}

export function generateCycle(fromDate = new Date()) {
    const { cycleStart, cycle } = findCycleStart(fromDate);
    const entries = collectCycle(cycleStart, cycle);
    return { cycle, entries };
}
