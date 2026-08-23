# Flexible Modern Explorer — Carousel Generator

## Setup (una volta sola)
```bash
npm install puppeteer
```

## Esportare i PNG
```bash
# Tutte le slide
node export-png.js

# File specifico
node export-png.js tokyo-carosello.html

# Solo una slide (utile per test rapidi)
node export-png.js --slide 3
```
I PNG vengono salvati nella cartella `./png/`.

## Aggiungere le foto
Nel file HTML, ogni slide con foto ha un commento che indica dove intervenire.
Cerca `--photo-url` e sostituisci `none` con il path della tua immagine:

```css
/* Prima */
style="--photo-url: none"

/* Dopo */
style="--photo-url: url('foto-plac-centralny.jpg')"
```
Il file immagine deve stare nella stessa cartella dell'HTML.

## Cambiare preset
Modifica le variabili CSS all'inizio del file HTML (blocco `.slide`):

| Variabile     | Preset 01 Cold | Preset 04 Arid | Preset 05 East |
|---------------|----------------|----------------|----------------|
| `--bg`        | #111315        | #0F0C08        | #0A0E14        |
| `--text`      | #F4F4F5        | #F4F0E8        | #E8F0F4        |
| `--accent`    | #52B788        | #C8924A        | #3FA8D4        |
| `--accent2`   | #2D6A4F        | #8A4A1C        | #D43F6A        |

## Creare un nuovo carosello
1. Duplica `carousel.html` e rinominalo (es. `tokyo.html`)
2. Sostituisci tutti i testi
3. Aggiorna le foto
4. Scegli il preset modificando le variabili CSS
5. Esegui: `node export-png.js tokyo.html`
