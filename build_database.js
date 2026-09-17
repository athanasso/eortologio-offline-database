/**
 * build_database.js
 *
 * Generates a full yearly Greek nameday / giortes calendar using the same
 * calculation logic as the Eortologio mobile app (Orthodox Pascha + fixed JSON).
 *
 * Output (gitignored dist/):
 *   - eortologio-YYYY-minified.json
 *   - eortologio-YYYY.json
 *   - release_notes.md
 *   - tag.txt
 *
 * Year selection (first match wins):
 *   1. CLI:        node build_database.js 2027
 *   2. Env:        EORTOLOGIO_YEAR=2027
 *   3. Default:    current calendar year (UTC)
 */

const fs = require('fs/promises');
const path = require('path');
const { getOrthodoxPascha, getMovableFeasts } = require('./lib/orthodoxCalendar');
const { getYearNameDays, getMovingFeastsForYear, formatIsoDate } = require('./lib/localNameDays');

const DIST_DIR = path.join(__dirname, 'dist');

function resolveYear() {
  const fromArg = process.argv[2];
  if (fromArg && /^\d{4}$/.test(fromArg)) return Number(fromArg);
  if (process.env.EORTOLOGIO_YEAR && /^\d{4}$/.test(process.env.EORTOLOGIO_YEAR)) {
    return Number(process.env.EORTOLOGIO_YEAR);
  }
  return new Date().getUTCFullYear();
}

function toIsoFromDate(date) {
  return formatIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

async function buildDatabase() {
  const year = resolveYear();
  if (year < 1900 || year > 2099) {
    console.error(`Year ${year} is outside the supported Pascha range (1900–2099).`);
    process.exit(1);
  }

  const currentRepo = process.env.GITHUB_REPOSITORY || 'athanasso/eortologio-offline-database';
  const tag = String(year);

  console.log(`Building Eortologio calendar for ${year}...`);

  await fs.mkdir(DIST_DIR, { recursive: true });

  const pascha = getOrthodoxPascha(year);
  const movableFeasts = getMovableFeasts(year).map((f) => ({
    name: f.name,
    date: toIsoFromDate(f.date),
    daysFromPascha: f.daysFromPascha,
  }));
  const movingNamedays = getMovingFeastsForYear(year).map((m) => ({
    date: formatIsoDate(year, m.month, m.day),
    day: m.day,
    month: m.month,
    names: m.names,
    feastName: m.feastName,
    isHoliday: Boolean(m.isHoliday),
  }));

  const yearEntries = getYearNameDays(year);
  const data = yearEntries.map((entry) => ({
    date: formatIsoDate(year, entry.month, entry.day),
    day: entry.day,
    month: entry.month,
    celebrating_names: entry.celebrating_names,
    saints: entry.saints,
    holidays: entry.other_info,
  }));

  const daysWithNames = data.filter((d) => d.celebrating_names.length > 0).length;
  const daysWithHolidays = data.filter((d) => d.holidays.length > 0).length;
  const uniqueNames = new Set(data.flatMap((d) => d.celebrating_names)).size;

  const resultObj = {
    $schema: `https://raw.githubusercontent.com/${currentRepo}/main/schemas/eortologio-year.schema.json`,
    license: 'ODbL-1.0',
    repository: `https://github.com/${currentRepo}`,
    year,
    pascha: toIsoFromDate(pascha),
    lastUpdate: Math.floor(Date.now() / 1000),
    movableFeasts,
    movingNamedays,
    data,
  };

  const minifiedName = `eortologio-${year}-minified.json`;
  const fullName = `eortologio-${year}.json`;
  const minifiedPath = path.join(DIST_DIR, minifiedName);
  const fullPath = path.join(DIST_DIR, fullName);
  const notesPath = path.join(DIST_DIR, 'release_notes.md');
  const tagPath = path.join(DIST_DIR, 'tag.txt');
  const assetsListPath = path.join(DIST_DIR, 'assets.txt');

  console.log('Writing minified JSON...');
  await fs.writeFile(minifiedPath, JSON.stringify(resultObj), 'utf8');

  console.log('Writing formatted JSON...');
  await fs.writeFile(fullPath, JSON.stringify(resultObj, null, 2), 'utf8');

  const releaseNotes = [
    `## Release ${tag}`,
    '',
    `Automated yearly build of the **Eortologio** Greek nameday / giortes calendar for **${year}**.`,
    '',
    'Computed with the same local logic as the Eortologio app (Orthodox Pascha via Meeus/Jones/Butcher + fixed namedays / holidays datasets).',
    '',
    '### Calendar Statistics',
    `- **Year**: \`${year}\``,
    `- **Orthodox Pascha**: \`${toIsoFromDate(pascha)}\``,
    `- **Days in year**: \`${data.length}\``,
    `- **Days with celebrating names**: \`${daysWithNames}\``,
    `- **Days with holidays**: \`${daysWithHolidays}\``,
    `- **Unique celebrating names**: \`${uniqueNames}\``,
    `- **Movable nameday rules applied**: \`${movingNamedays.length}\``,
    '',
    '### Assets',
    `- \`${minifiedName}\` — Compact JSON for apps and services.`,
    `- \`${fullName}\` — Pretty-printed JSON.`,
    '',
  ].join('\n');

  await fs.writeFile(notesPath, releaseNotes, 'utf8');
  await fs.writeFile(tagPath, tag, 'utf8');
  await fs.writeFile(assetsListPath, `${minifiedName}\n${fullName}\n`, 'utf8');

  console.log(`Done! Generated ${data.length} days for release ${tag}.`);
  console.log(`Pascha ${year}: ${toIsoFromDate(pascha)}`);
}

buildDatabase().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
