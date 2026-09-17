/**
 * Orthodox Pascha (Easter) — Meeus/Jones/Butcher for Julian calendar,
 * then +13 days to Gregorian (valid 1900–2099).
 * Ported from eortologio/src/services/orthodoxCalendar.ts
 */

function getOrthodoxPascha(year) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const monthJulian = Math.floor((d + e + 114) / 31);
  const dayJulian = ((d + e + 114) % 31) + 1;

  // +13 days Julian→Gregorian (1900–2099). Use calendar-day add (not ms)
  // so DST transitions cannot shift the civil date.
  const gregorianDate = new Date(year, monthJulian - 1, dayJulian);
  gregorianDate.setDate(gregorianDate.getDate() + 13);
  return gregorianDate;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getMovableFeasts(year) {
  const pascha = getOrthodoxPascha(year);
  return [
    { name: 'Τριώδιο', date: addDays(pascha, -70), daysFromPascha: -70 },
    { name: 'Τσικνοπέμπτη', date: addDays(pascha, -59), daysFromPascha: -59 },
    { name: 'Καθαρά Δευτέρα', date: addDays(pascha, -48), daysFromPascha: -48 },
    { name: 'Κυριακή της Ορθοδοξίας', date: addDays(pascha, -42), daysFromPascha: -42 },
    { name: 'Σάββατο του Λαζάρου', date: addDays(pascha, -8), daysFromPascha: -8 },
    { name: 'Κυριακή των Βαΐων', date: addDays(pascha, -7), daysFromPascha: -7 },
    { name: 'Μεγάλη Παρασκευή', date: addDays(pascha, -2), daysFromPascha: -2 },
    { name: 'Άγιο Πάσχα', date: pascha, daysFromPascha: 0 },
    { name: 'Του Θωμά', date: addDays(pascha, 7), daysFromPascha: 7 },
    { name: 'Ανάληψη', date: addDays(pascha, 39), daysFromPascha: 39 },
    { name: 'Πεντηκοστή', date: addDays(pascha, 49), daysFromPascha: 49 },
    { name: 'Αγίου Πνεύματος', date: addDays(pascha, 50), daysFromPascha: 50 },
    { name: 'Αγίων Πάντων', date: addDays(pascha, 56), daysFromPascha: 56 },
  ];
}

module.exports = {
  getOrthodoxPascha,
  getMovableFeasts,
  addDays,
};
