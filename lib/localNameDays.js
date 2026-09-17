/**
 * Local namedays / giortes engine.
 * Ported from eortologio/src/services/localNameDays.ts
 */

const path = require('path');
const { getOrthodoxPascha, addDays } = require('./orthodoxCalendar');

const fixedNamedays = require(path.join(__dirname, '..', 'data', 'fixed_namedays.json'));
const holidaysAndFeasts = require(path.join(__dirname, '..', 'data', 'holidays_and_feasts.json'));

function getMovingFeastsForYear(year) {
  const pascha = getOrthodoxPascha(year);
  const results = [];

  // 1. Χλόη (First Sunday on or after Feb 13)
  const chloeDate = new Date(year, 1, 13);
  const chloeDayOfWeek = chloeDate.getDay();
  if (chloeDayOfWeek !== 0) {
    chloeDate.setDate(chloeDate.getDate() + (7 - chloeDayOfWeek));
  }
  results.push({
    day: chloeDate.getDate(),
    month: chloeDate.getMonth() + 1,
    names: ['Χλόη'],
    feastName: 'Αγίας Χλόης',
  });

  // 2. Αγίων Θεοδώρων (-43)
  const theodoreDate = addDays(pascha, -43);
  results.push({
    day: theodoreDate.getDate(),
    month: theodoreDate.getMonth() + 1,
    names: ['Θόδωρος', 'Θεοδώρα', 'Δώρα', 'Θοδώρα', 'Δωρούλα', 'Ντόρα', 'Θεόδωρος', 'Θοδωρής'],
    feastName: 'Αγίων Θεοδώρων',
  });

  // 3. Κυριακή της Ορθοδοξίας (-42)
  const orthodoxyDate = addDays(pascha, -42);
  results.push({
    day: orthodoxyDate.getDate(),
    month: orthodoxyDate.getMonth() + 1,
    names: [
      'Λέανδρος', 'Μάριος', 'Λωξάνδρα', 'Λωξάντρα', 'Ρωξάνη', 'Ρωξάνα',
      'Ορθοδόξης', 'Δόξης', 'Δοξάκης', 'Ορθοδοξία', 'Δόξα', 'Ορθούλα', 'Άξιος', 'Άξια',
    ],
    feastName: 'Κυριακή της Ορθοδοξίας',
  });

  // 4. Αγίου Γρηγορίου του Παλαμά (-35)
  const grigorisDate = addDays(pascha, -35);
  results.push({
    day: grigorisDate.getDate(),
    month: grigorisDate.getMonth() + 1,
    names: ['Γρηγόρης', 'Γρηγόριος', 'Γόλης', 'Γρηγορία'],
    feastName: 'Αγίου Γρηγορίου του Παλαμά',
  });

  // 5. Σάββατο του Λαζάρου (-8)
  const lazarusDate = addDays(pascha, -8);
  results.push({
    day: lazarusDate.getDate(),
    month: lazarusDate.getMonth() + 1,
    names: ['Λάζαρος', 'Λάζος'],
    feastName: 'Σάββατο του Λαζάρου',
  });

  // 6. Κυριακή των Βαΐων (-7)
  const palmSundayDate = addDays(pascha, -7);
  results.push({
    day: palmSundayDate.getDate(),
    month: palmSundayDate.getMonth() + 1,
    names: ['Βάιος', 'Βάια', 'Βάγια', 'Βαία', 'Δάφνης', 'Δάφνη'],
    feastName: 'Κυριακή των Βαΐων',
  });

  // 7. Μεγάλη Δευτέρα (-6)
  const pagkalosDate = addDays(pascha, -6);
  results.push({
    day: pagkalosDate.getDate(),
    month: pagkalosDate.getMonth() + 1,
    names: ['Πάγκαλος'],
    feastName: 'Μεγάλη Δευτέρα (Ιωσήφ του Παγκάλου)',
  });

  // 8. Μεγάλη Πέμπτη (-3)
  const alitheiaDate = addDays(pascha, -3);
  results.push({
    day: alitheiaDate.getDate(),
    month: alitheiaDate.getMonth() + 1,
    names: ['Αλήθεια'],
    feastName: 'Μεγάλη Πέμπτη',
  });

  // 9. Πάσχα (0)
  results.push({
    day: pascha.getDate(),
    month: pascha.getMonth() + 1,
    names: [
      'Αναστάσιος', 'Τάσος', 'Αναστάσης', 'Ανέστης', 'Τασούλα', 'Αναστασία',
      'Νατάσα', 'Νατάσσα', 'Τασία', 'Σία', 'Τατία', 'Τάσα', 'Τέσα',
      'Πασχάλης', 'Πασχαλίνα', 'Λίνα', 'Λάμπρος', 'Λαμπρινή', 'Λαμπρίνα',
      'Στασινός', 'Στασινή', 'Στασία', 'Στάσα', 'Στασίνα',
    ],
    feastName: 'Άγιο Πάσχα (Η Ανάσταση του Κυρίου)',
    isHoliday: true,
  });

  // 10. Δευτέρα του Πάσχα (+1)
  const easterMonday = addDays(pascha, 1);
  results.push({
    day: easterMonday.getDate(),
    month: easterMonday.getMonth() + 1,
    names: ['Ζωρζέττα', 'Ζέτα', 'Ζέττα', 'Τζίνα'],
    feastName: 'Δευτέρα της Διακαινησίμου',
  });

  // 11. Αγίου Γεωργίου (23 Apr, or Easter Monday if Pascha >= 23 Apr)
  const paschaMonth = pascha.getMonth() + 1;
  const paschaDay = pascha.getDate();
  const isPaschaAfterApril23 = paschaMonth > 4 || (paschaMonth === 4 && paschaDay >= 23);
  const georgeDate = isPaschaAfterApril23 ? easterMonday : new Date(year, 3, 23);
  results.push({
    day: georgeDate.getDate(),
    month: georgeDate.getMonth() + 1,
    names: [
      'Γεώργιος', 'Γεωργής', 'Γιώργος', 'Γιώργης', 'Γκόγκος', 'Γιωργίτσης',
      'Γιωργάκης', 'Γεωργία', 'Γιωργία', 'Γεωργούλα', 'Τζωρτζίνα',
      'Γεωργιάννα', 'Γιωργίτσα', 'Γίτσα', 'Γωγώ',
    ],
    feastName: 'Αγίου Γεωργίου του Μεγαλομάρτυρος',
  });

  // 12. Λαμπροτρίτη (+2)
  const easterTuesday = addDays(pascha, 2);
  results.push({
    day: easterTuesday.getDate(),
    month: easterTuesday.getMonth() + 1,
    names: [
      'Λαμπροτρίτη', 'Ραφαήλ', 'Ραφαήλος', 'Ραφαέλος', 'Ραφαέλα', 'Ραφαέλλα',
      'Ραφαήλα', 'Ραφαηλία', 'Νικόλαος', 'Νικόλας', 'Νίκος', 'Νικολός',
      'Νικολής', 'Νικολάκης', 'Νικολέττα', 'Νικολούδα', 'Νικολίτσα',
      'Νικολίνα', 'Νικολέτα', 'Νικόλ', 'Ειρήνη', 'Ρένα', 'Ρήνα', 'Ρηνιώ',
      'Ρηνούλα', 'Ειρήνα', 'Ειρήνγκω', 'Ρένια',
    ],
    feastName: 'Αγίων Ραφαήλ, Νικολάου και Ειρήνης',
  });

  // 13. Αγίου Μάρκου (25 Apr, or Easter Tuesday if Pascha >= 23 Apr)
  const markDate = isPaschaAfterApril23 ? easterTuesday : new Date(year, 3, 25);
  results.push({
    day: markDate.getDate(),
    month: markDate.getMonth() + 1,
    names: ['Μάρκος', 'Μαρκούλης', 'Μαρκία', 'Μαρκούλα'],
    feastName: 'Αγίου Μάρκου του Αποστόλου',
  });

  // 14. Αγίου Θεοχάρους (+3)
  const theocharisDate = addDays(pascha, 3);
  results.push({
    day: theocharisDate.getDate(),
    month: theocharisDate.getMonth() + 1,
    names: ['Θεοχάρης', 'Θεοχαρούλα', 'Χαρούλα'],
    feastName: 'Αγίου Θεοχάρους',
  });

  // 15. Ζωοδόχου Πηγής (+5)
  const zoodochosDate = addDays(pascha, 5);
  results.push({
    day: zoodochosDate.getDate(),
    month: zoodochosDate.getMonth() + 1,
    names: [
      'Ζώης', 'Ζήσης', 'Ζήσιμος', 'Ζωή', 'Ζησούλα', 'Ζωΐτσα', 'Ζωζώ',
      'Πολυζώης', 'Πηγή', 'Κρήνη', 'Κρηνιώ',
    ],
    feastName: 'Ζωοδόχου Πηγής',
  });

  // 16. Κυριακή του Θωμά (+7)
  const thomasDate = addDays(pascha, 7);
  results.push({
    day: thomasDate.getDate(),
    month: thomasDate.getMonth() + 1,
    names: ['Θωμάς', 'Θωμαή', 'Τόμας'],
    feastName: 'Κυριακή του Θωμά',
  });

  // 17. Κυριακή των Μυροφόρων (+14)
  const myroforesDate = addDays(pascha, 14);
  results.push({
    day: myroforesDate.getDate(),
    month: myroforesDate.getMonth() + 1,
    names: ['Μυροφόρα'],
    feastName: 'Κυριακή των Μυροφόρων',
  });

  // 18. Κυριακή του Παραλύτου (+21)
  const paralytouDate = addDays(pascha, 21);
  results.push({
    day: paralytouDate.getDate(),
    month: paralytouDate.getMonth() + 1,
    names: ['Βηθεσδά'],
    feastName: 'Κυριακή του Παραλύτου',
  });

  // 19. Ανάληψη (+39)
  const analipsiDate = addDays(pascha, 39);
  results.push({
    day: analipsiDate.getDate(),
    month: analipsiDate.getMonth() + 1,
    names: ['Νεφέλη'],
    feastName: 'Η Ανάληψη του Κυρίου',
  });

  // 20. Αγίου Πνεύματος (+50)
  const holySpiritDate = addDays(pascha, 50);
  results.push({
    day: holySpiritDate.getDate(),
    month: holySpiritDate.getMonth() + 1,
    names: ['Τριάδα', 'Τριάς', 'Κορίνος', 'Κόρη', 'Κορίνα', 'Κορέννα'],
    feastName: 'Αγίου Πνεύματος',
    isHoliday: true,
  });

  // 21. Αγίων Πάντων (+56)
  const allSaintsDate = addDays(pascha, 56);
  results.push({
    day: allSaintsDate.getDate(),
    month: allSaintsDate.getMonth() + 1,
    names: [
      'Αγαμέμνων', 'Αγαμέμνονας', 'Αγησίλαος', 'Αγόρω', 'Αγορίτσα', 'Αίολος',
      'Άλκηστις', 'Αλκμήνη', 'Ανδρομέδα', 'Αντιόπη', 'Αριστομένης', 'Αρθούρος',
      'Βελισάριος', 'Βενέτιος', 'Βενετία', 'Βενιζέλος', 'Βιολέτα', 'Βρασίδας',
      'Διαγόρας', 'Δίκαιος', 'Εβελίνα', 'Έκτορας', 'Ελβίρα', 'Εριφύλη',
      'Ερρίκος', 'Ερωτόκριτος', 'Ευαγόρας', 'Ευριπίδης', 'Ευρυδίκη', 'Φαίδων',
      'Φαίδωνας', 'Φειδίας', 'Φραγκίσκος', 'Φρατζέσκα', 'Γιασεμή', 'Γιασμίνα',
      'Γιολάντα', 'Γλαύκος', 'Ηλέκτρα', 'Ιοκάστη', 'Ισαβέλα', 'Καλομοίρα',
      'Καλυψώ', 'Κανέλος', 'Κανέλα', 'Κασσάνδρα', 'Κίμων', 'Κίμωνας', 'Κίρκη',
      'Κλάρα', 'Κλεάνθης', 'Κλεάνθη', 'Κλέαρχος', 'Κλεομένης', 'Κομνηνός',
      'Κρίτων', 'Κυβέλη', 'Λαέρτης', 'Λογοθέτης', 'Λυκούργος', 'Λύσανδρος',
      'Μανταλένα', 'Μάνθος', 'Μίνωας', 'Μιράντα', 'Μιρέλα', 'Μυρτώ', 'Ναυσικά',
      'Νεοκλής', 'Νεοπτόλεμος', 'Νιόβη', 'Οφηλία', 'Ορφέας', 'Όθων', 'Όθωνας',
      'Παγώνα', 'Πανωραία', 'Περίανδρος', 'Πραξιτέλης', 'Πυθαγόρας', 'Ροδοθέα',
      'Τερέζα', 'Τερψιθέα', 'Θέλξη', 'Θρασύβουλος', 'Θράσος', 'Τιμολέων',
      'Άγις', 'Αίσωπος', 'Αλβέρτος', 'Αλκίνοος', 'Αμφιτρίτη', 'Αναξίμανδρος',
      'Ανδροκλής', 'Αρετή', 'Αρετούσα', 'Εριέττα', 'Έρρικα', 'Γοργίας',
      'Ήρα', 'Ηρώ', 'Ιόλη', 'Ιπποκράτης', 'Κάρολος', 'Μαλβίνα', 'Μέλισσα',
      'Ναπολέων', 'Ναπολέωντας', 'Σεμίνα',
    ],
    feastName: 'Κυριακή Αγίων Πάντων',
  });

  // 22. Κυριακή των Προπατόρων (Sunday between Dec 11 and Dec 17)
  const ancestorsDate = new Date(year, 11, 11);
  const ancestorsDayOfWeek = ancestorsDate.getDay();
  if (ancestorsDayOfWeek !== 0) {
    ancestorsDate.setDate(ancestorsDate.getDate() + (7 - ancestorsDayOfWeek));
  }
  results.push({
    day: ancestorsDate.getDate(),
    month: ancestorsDate.getMonth() + 1,
    names: [
      'Ααρών', 'Αδάμ', 'Εύα', 'Δεβόρα', 'Δεβώρα', 'Δεββώρα', 'Ντέμπορα',
      'Ντέπυ', 'Εσθήρ', 'Μελχισεδέχ', 'Μελχής', 'Νώε', 'Ραχήλ', 'Ρεβέκκα',
      'Μπέκυ', 'Ρούμπεν', 'Ρουμπίνη', 'Ρουμπίνι', 'Ρουμπίνα', 'Ισαάκ',
      'Αβραάμ', 'Αβραμία', 'Αδαμάντιος', 'Αδάμος', 'Αδάμης', 'Αδάμας',
      'Διαμαντής', 'Αδαμαντία', 'Αμάντα', 'Άντα', 'Διαμαντούλα', 'Διαμάντω',
      'Δαβίδ', 'Δαυίδ', 'Δαν', 'Δανάη', 'Σάρα', 'Σάρρα', 'Ιώβ', 'Ιωβία', 'Ιώβη',
    ],
    feastName: 'Κυριακή των Προπατόρων',
  });

  return results;
}

function getHolidaysForDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const pascha = getOrthodoxPascha(year);

  const holidays = [];
  const saints = [];

  const key = `${day}/${month}`;
  const fixedEntry = holidaysAndFeasts.fixed[key];
  if (fixedEntry) {
    if (fixedEntry.holidays) holidays.push(...fixedEntry.holidays);
    if (fixedEntry.saints) saints.push(...fixedEntry.saints);
  }

  const diffDays = Math.round((date.getTime() - pascha.getTime()) / (1000 * 60 * 60 * 24));
  const matchingMovable = holidaysAndFeasts.movable.filter((m) => m.toEaster === diffDays);
  for (const m of matchingMovable) {
    if (m.holidays) holidays.push(...m.holidays);
    if (m.saints) saints.push(...m.saints);
  }

  if (month === 5 && date.getDay() === 0 && day >= 8 && day <= 14) {
    holidays.push('Ημέρα της Μητέρας (2η Κυριακή Μαΐου)');
  }

  if (month === 6 && date.getDay() === 0 && day >= 15 && day <= 21) {
    holidays.push('Ημέρα του Πατέρα (3η Κυριακή Ιουνίου)');
  }

  const paschaMonth = pascha.getMonth() + 1;
  const paschaDay = pascha.getDate();
  const isPaschaAfterApril23 = paschaMonth > 4 || (paschaMonth === 4 && paschaDay >= 23);
  if (isPaschaAfterApril23) {
    if (month === 4 && day === 23) {
      const idx = saints.findIndex((s) => s.includes('Γεωργίου'));
      if (idx !== -1) saints.splice(idx, 1);
    }
    if (diffDays === 1) {
      saints.push('Αγίου Γεωργίου του Μεγαλομάρτυρος (Μετατεθείσα)');
    }
  }

  return {
    holidays: Array.from(new Set(holidays)),
    saints: Array.from(new Set(saints)),
  };
}

function getLocalNameDaysForDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const key = `${day}/${month}`;
  const fixedNames = fixedNamedays[key]?.names || [];

  const movingFeasts = getMovingFeastsForYear(year);
  const matchingMoving = movingFeasts.filter((m) => m.day === day && m.month === month);

  const movingNames = [];
  const movingSaints = [];
  const movingHolidays = [];

  for (const item of matchingMoving) {
    movingNames.push(...item.names);
    if (item.feastName) movingSaints.push(item.feastName);
    if (item.isHoliday) movingHolidays.push(item.feastName);
  }

  const { holidays, saints } = getHolidaysForDate(date);

  const allNames = Array.from(new Set([...fixedNames, ...movingNames]));
  const allHolidays = Array.from(new Set([...holidays, ...movingHolidays]));
  const allSaints = Array.from(new Set([...saints, ...movingSaints]));

  if (allSaints.length === 0 && allNames.length > 0) {
    allSaints.push(`Εορτή: ${allNames.slice(0, 3).join(', ')}`);
  }

  return {
    day,
    month,
    celebrating_names: allNames,
    saints: allSaints,
    other_info: allHolidays,
    names_with_other_dates: [],
  };
}

function getYearNameDays(year) {
  const entries = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      entries.push(getLocalNameDaysForDate(new Date(year, month - 1, day)));
    }
  }
  return entries;
}

function formatIsoDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

module.exports = {
  getMovingFeastsForYear,
  getHolidaysForDate,
  getLocalNameDaysForDate,
  getYearNameDays,
  formatIsoDate,
};
