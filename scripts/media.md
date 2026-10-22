# Media Generation Commands

This document records the commands used to generate media assets for BroFix (`ticket 05`).

## 1. Teaser Video & Poster

### Video Encoding
Encode H.264 at max 720p on long side keeping aspect ratio, preset slow, CRF 24 (file size <= 5 MB), yuv420p, AAC 96k audio, faststart enabled:
```bash
ffmpeg -y -i "C:/Users/tzaru/Documents/BroFix/references/founders material/סרטון טיזר קצר.mp4" \
  -vf "scale='if(gt(iw,ih),720,-2)':'if(gt(iw,ih),-2,720)'" \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p \
  -c:a aac -b:a 96k -movflags +faststart \
  "static/assets/media/teaser.mp4"
```

### Poster Frame
Extract a representative frame at ~1.5s as WebP (quality 80):
```bash
ffmpeg -y -ss 00:00:01.5 -i "static/assets/media/teaser.mp4" \
  -frames:v 1 -c:v libwebp -quality 80 \
  "static/assets/media/teaser-poster.webp"
```

### Video Metadata JSON
Extract dimensions, duration, and file size via ffprobe and save to `static/assets/media/teaser.json`:
```bash
node -e "
const { execSync } = require('node:child_process');
const { statSync, writeFileSync } = require('node:fs');
const probe = JSON.parse(execSync('ffprobe -v error -select_streams v:0 -show_entries stream=width,height:format=duration -of json static/assets/media/teaser.mp4', { encoding: 'utf8' }));
const stats = statSync('static/assets/media/teaser.mp4');
const data = {
  width: probe.streams[0].width,
  height: probe.streams[0].height,
  durationSeconds: Math.round(parseFloat(probe.format.duration) * 100) / 100,
  bytes: stats.size
};
writeFileSync('static/assets/media/teaser.json', JSON.stringify(data, null, 2) + '\n');
"
```

## 2. OpenGraph Share Images (1200x630)

Generate self-contained SVG templates with embedded Rubik fonts, BroFix wordmark, wrench mark, headlines, and domain, then render to 1200x630 PNG via headless Edge:
```bash
node scripts/og/generate.mjs
```
The generator creates:
- `scripts/og/og-he.svg` -> `static/assets/og/og-he.png`
- `scripts/og/og-en.svg` -> `static/assets/og/og-en.png`
