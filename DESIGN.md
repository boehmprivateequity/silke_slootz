# Design: Silke Slootz

Richtung: ruhig, großzügig, ein Gedanke pro Abschnitt. Angelehnt an die Gestaltungsprinzipien
von Apple-Produktseiten (große Schrift, viel Raum, Wechsel von Schwarz und Hell, Bild als Bühne),
mit Silkes eigener Farbwelt. Es werden keine Apple-Schriften, -Symbole oder -Bilder verwendet.

Die Werte stehen als CSS-Variablen in `styles.css`.

## Farbe
| Name | Wert | Rolle |
|---|---|---|
| `--black` | #000000 | Bühne: Startbereich, Berufung, Navigation |
| `--ink` | #1D1B16 | Überschriften und Text auf Hell |
| `--ink-2` | #5F594D | Nebentext auf Hell (mind. 4,5:1) |
| `--paper` | #FFFFFF | heller Abschnitt |
| `--paper-2` | #F8F4E9 | abgesetzter heller Abschnitt, Kacheln |
| `--sun` | #F6C945 | Hauptaktion, Akzent auf Schwarz |
| `--gold-ink` | #7A5B00 | Links und Akzent auf Hell (mind. 4,5:1) |
| `--on-dark` / `--on-dark-2` | #F8F4E9 / #B9B2A2 | Text auf Schwarz |
| `--error` | #B3261E | Fehler im Formular |

Gelb wird nie als Textfarbe auf hellem Grund verwendet.

## Schrift
- Inter (lokal) für alles, Überschriften 600 mit enger Laufweite.
- Cormorant (lokal) nur für Silkes Namenszug und das Zitat.
- Stufen: 14, 17, 21, 28, 40, 56, 80 px (große Stufen fließend per `clamp`). Fließtext 17 px, max. 66 Zeichen.

## Raum und Form
- Raster 8 px. Abschnitte 88 bis 160 px. Inhaltsbreite 1080 px.
- Radien: 28 px Kachel, 14 px Feld, 999 px Schaltfläche.
- Keine Schatten auf Kacheln. Tiefe entsteht durch Farbflächen.

## Bausteine
- Schaltfläche: gefüllt (Sonnengelb, schwarzer Text) für die eine Hauptaktion, sonst Textlink mit Pfeil.
- Kachel: Bild oben, kurzer Satz, Details aufklappbar (`<details>`).
- Trefferflächen mind. 44 px hoch. Fokus: 3 px Rahmen, immer sichtbar.

## Bewegung
Nur `opacity` und `transform`, ruhig, einmalig. Aus bei `prefers-reduced-motion`. Ohne JavaScript ist alles sichtbar.

## Sprachen
Umschalter PT · EN · DE · ES im dunklen Kopfbereich, auch am Handy sichtbar. Deutsch steht in `index.html`, die anderen in `i18n.js`.
