# Eortologio Offline Database

[![Automated Yearly Build](https://github.com/athanasso/eortologio-offline-database/actions/workflows/update-giortes.yml/badge.svg)](https://github.com/athanasso/eortologio-offline-database/actions/workflows/update-giortes.yml)
[![Latest Release](https://img.shields.io/github/v/release/athanasso/eortologio-offline-database?label=latest%20release&color=blue)](https://github.com/athanasso/eortologio-offline-database/releases/latest)

Automated yearly Greek **nameday / giortes** calendars, computed with the same local logic as the [Eortologio](https://github.com/athanasso) mobile app (Orthodox Pascha + fixed namedays / holidays).

Large JSON artifacts are **not committed** to git. They are published as **GitHub Release** assets (one release tag per year, e.g. `2026`), same pattern as [anime-offline-database](https://github.com/athanasso/anime-offline-database).

---

## Download Dataset

Always available from the **[Latest GitHub Release](https://github.com/athanasso/eortologio-offline-database/releases/latest)**:

| File | Format | Description |
|---|---|---|
| **`eortologio-YYYY-minified.json`** | Minified JSON | Compact JSON for apps and services. |
| **`eortologio-YYYY.json`** | Indented JSON | Human-readable JSON. |

Example (replace `YYYY` / use `latest`):

```text
https://github.com/athanasso/eortologio-offline-database/releases/latest/download/eortologio-2026-minified.json
```

---

## How it Works

1. **Orthodox Pascha** is calculated with Meeus/Jones/Butcher (Julian) + 13 days → Gregorian (1900–2099).
2. **Movable namedays** (Χλόη, Θεόδωροι, Πάσχα names, Γιώργος transfer, Αγίων Πάντων, Προπάτορες, …) use the same offsets as the app.
3. **Fixed namedays** and **saints / holidays** come from `data/fixed_namedays.json` and `data/holidays_and_feasts.json`.
4. **Yearly GitHub Action** runs every 1 January (and on manual `workflow_dispatch`) → builds `dist/` → creates/updates a release tagged `YYYY`.

---

## Schema & Sample Day

```json
{
  "date": "2026-04-12",
  "day": 12,
  "month": 4,
  "celebrating_names": ["Αναστάσιος", "Τάσος", "Λάμπρος"],
  "saints": ["Άγιο Πάσχα (Η Ανάσταση του Κυρίου)"],
  "holidays": ["Κυριακή του Πάσχα (Επίσημη Αργία)"]
}
```

Top-level fields also include `year`, `pascha`, `movableFeasts`, `movingNamedays`, and `lastUpdate`. See [`schemas/eortologio-year.schema.json`](schemas/eortologio-year.schema.json).

---

## Building Locally

```bash
# Clone
git clone https://github.com/athanasso/eortologio-offline-database.git
cd eortologio-offline-database

# Current year
node build_database.js

# Specific year
node build_database.js 2027
# or
EORTOLOGIO_YEAR=2027 node build_database.js
```

Artifacts land in `dist/` (gitignored).

---

## Manual Workflow Run

In GitHub → **Actions** → **Yearly Giortes Update** → **Run workflow**, optionally set `year` (e.g. `2027`).

---

## License

Dataset license: **ODbL-1.0**. Calculation logic ported from the Eortologio app for offline yearly publication.
