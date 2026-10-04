// Cycles 1-7 ran 2702 days (Shekalim had 13 blatt); cycle 8+ runs 2711 days
// (Shekalim expanded to 22 blatt) -- see @hebcal/learning's dafYomiBase.
const NEW_CYCLE_FIRST = 8;
const NEW_CYCLE_LENGTH = 2711;
const OLD_CYCLE_LENGTH = 2702;

function daysBetween(a, b) {
    return (new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24);
}

export function validateEntries(entries) {
    const errors = [];
    const warnings = [];

    if (!Array.isArray(entries) || entries.length === 0) {
        errors.push('No entries to validate.');
        return { valid: false, errors, warnings };
    }

    const cycles = new Set(entries.map((e) => e.cycle));
    if (cycles.size !== 1) {
        errors.push(`Expected a single cycle, found: ${[...cycles].join(', ')}`);
    }

    const dates = entries.map((e) => e.gregorianDate);
    const uniqueDates = new Set(dates);
    if (uniqueDates.size !== dates.length) {
        errors.push(`Found ${dates.length - uniqueDates.size} duplicate date(s).`);
    }

    for (let i = 1; i < entries.length; i++) {
        const gap = daysBetween(entries[i - 1].gregorianDate, entries[i].gregorianDate);
        if (gap !== 1) {
            errors.push(
                `Date gap between ${entries[i - 1].gregorianDate} and ${entries[i].gregorianDate} (${gap} day(s)).`
            );
        }
    }

    const dafKeys = entries.map((e) => `${e.tractate}-${e.daf}`);
    const uniqueDafKeys = new Set(dafKeys);
    if (uniqueDafKeys.size !== dafKeys.length) {
        errors.push(`Found ${dafKeys.length - uniqueDafKeys.size} duplicate daf(s).`);
    }

    // Sanity check only -- @hebcal/learning's own output is the source of
    // truth. A mismatch is reported, never corrected toward this number.
    const cycle = entries[0].cycle;
    const expectedLength = cycle >= NEW_CYCLE_FIRST ? NEW_CYCLE_LENGTH : OLD_CYCLE_LENGTH;
    if (entries.length !== expectedLength) {
        warnings.push(
            `Cycle ${cycle} has ${entries.length} entries; expected ${expectedLength} as a sanity check.`
        );
    }

    return { valid: errors.length === 0, errors, warnings };
}
