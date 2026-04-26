#!/usr/bin/env node
/**
 * Generates web/images/logo.svg
 * - Decorative QR code (no encoded value) — just the iconic visual structure
 * - Brand blue background, white modules, clean & simple
 *
 * Usage: node generate_logo.js
 */

const fs   = require("fs");
const path = require("path");

const OUT      = path.join(__dirname, "web/images/logo.svg");
const SIZE     = 512;
const PAD      = 72;
const QR_AREA  = SIZE - PAD * 2;  // 368px
const BG       = "#3B5998";
const MOD_COL  = "#ffffff";
const CORNER_R = 80;

// Decorative 21×21 QR-style grid (1 = white module, 0 = empty)
// Based on the standard QR v1 structure: 3 finder patterns, timing, quiet zone data
const GRID = [
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
  [1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1],
  [0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,0],
  [1,0,1,1,0,0,1,0,1,1,0,0,1,1,0,1,0,1,1,0,1],
  [0,1,0,0,1,1,0,1,0,0,1,1,0,0,1,0,1,0,0,1,0],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,1,1,0,1,0],
  [1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,1,0,0,1,0,1],
  [1,0,0,0,0,0,1,0,1,1,0,1,0,1,0,1,1,0,0,1,0],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,0,1,0],
  [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,1,0,1,1,0,1,1,0],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
];

const count = GRID.length;
const pitch = QR_AREA / count;
const modSize = +(pitch * 0.72).toFixed(2);
const modR = +(modSize * 0.25).toFixed(2);

// Finder pattern regions to skip from module rendering (rows/cols 0-6 TL, 0-6 TR, 14-20 BL)
function isFinder(r, c) {
  return (r <= 6 && c <= 6) ||           // top-left
         (r <= 6 && c >= 14) ||           // top-right
         (r >= 14 && c <= 6);             // bottom-left
}

// Pixel position for a module (top-left corner of module)
function mp(i) {
  return +(PAD + i * pitch + (pitch - modSize) / 2).toFixed(2);
}

// Solid finder: outer 7×7 filled square, blue 5×5 hole, white 3×3 center
function finderSVG(startR, startC) {
  const outerX = +(PAD + startC * pitch + (pitch - modSize) / 2).toFixed(2);
  const outerY = +(PAD + startR * pitch + (pitch - modSize) / 2).toFixed(2);
  const outerW = +(6 * pitch + modSize).toFixed(2);
  const fr = 4;

  // Inner blank: cols 1-5, rows 1-5
  const innerX = +(PAD + (startC + 1) * pitch + (pitch - modSize) / 2).toFixed(2);
  const innerY = +(PAD + (startR + 1) * pitch + (pitch - modSize) / 2).toFixed(2);
  const innerW = +(4 * pitch + modSize).toFixed(2);

  // Center: cols 2-4, rows 2-4
  const centerX = +(PAD + (startC + 2) * pitch + (pitch - modSize) / 2).toFixed(2);
  const centerY = +(PAD + (startR + 2) * pitch + (pitch - modSize) / 2).toFixed(2);
  const centerW = +(2 * pitch + modSize).toFixed(2);

  return `  <rect x="${outerX}"  y="${outerY}"  width="${outerW}"  height="${outerW}"  rx="${fr}" fill="#fff"/>
  <rect x="${innerX}"  y="${innerY}"  width="${innerW}"  height="${innerW}"  rx="${fr - 1}" fill="${BG}"/>
  <rect x="${centerX}" y="${centerY}" width="${centerW}" height="${centerW}" rx="3" fill="#fff"/>`;
}

let rects = "";
for (let r = 0; r < count; r++) {
  for (let c = 0; c < count; c++) {
    if (isFinder(r, c)) continue;  // skip finder regions
    if (GRID[r][c]) {
      const x = mp(c);
      const y = mp(r);
      rects += `  <rect x="${x}" y="${y}" width="${modSize}" height="${modSize}" rx="${modR}" fill="${MOD_COL}"/>\n`;
    }
  }
}

// Build the 3 solid finders
const finders = [
  finderSVG(0, 0),   // top-left
  finderSVG(0, 14),  // top-right
  finderSVG(14, 0),  // bottom-left
].join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${SIZE}" height="${SIZE}" rx="${CORNER_R}" fill="${BG}"/>

  <!-- QR modules -->
  <g filter="url(#shadow)">
${rects}
${finders}
  </g>

  <!-- Outline around QR area -->
  <rect x="${PAD - 44}" y="${PAD - 44}" width="${QR_AREA + 88}" height="${QR_AREA + 88}" rx="${CORNER_R}"
        fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
</svg>`;

fs.writeFileSync(OUT, svg);
console.log(`✓ Logo written to: ${OUT}`);
