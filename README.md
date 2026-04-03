# Catala

Druckbare Katalanisch-Deutsch Vokabelblätter im A4-Format. Vokabellisten werden per LLM generiert und als saubere, druckfertige Seiten dargestellt.

## Voraussetzungen

- Node.js >= 18
- npm

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffnet die App unter `http://localhost:5173`. Die Seite zeigt ein A4-Blatt mit der gewählten Vokabelkategorie. Über den lila Button rechts lässt sich zwischen Kategorien wechseln.

## Drucken

Über den Browser drucken (`Strg+P` / `Cmd+P`). Das Menü wird beim Druck automatisch ausgeblendet -- es erscheint nur das Vokabelblatt der aktuell gewählten Kategorie.

## Vokabeln generieren

Neue Kategorien werden per LLM erzeugt. Dafür müssen die Umgebungsvariablen `LITELLM_API_KEY` und `LITELLM_MODEL` gesetzt sein (z.B. in einer `.env`-Datei).

```bash
npm run vocab -- "Küche"
```

Die generierte JSON-Datei landet in `data/vocabulary/` und wird automatisch in der App verfügbar.

## Projektstruktur

```
src/
  App.tsx              Hauptkomponente (A4-Layout, Kategorieauswahl)
  App.css              Styling und Print-Regeln
  components/
    Nomen.tsx           Nomen-Darstellung (Singular/Plural)
    Verb.tsx            Verb-Darstellung (Konjugationstabelle)
data/
  generate_vocabulary.ts   LLM-gestützte Vokabelgenerierung
  vocabulary/              JSON-Dateien pro Kategorie
```

## Build

```bash
npm run build
```

Die statische Ausgabe liegt in `dist/`.
