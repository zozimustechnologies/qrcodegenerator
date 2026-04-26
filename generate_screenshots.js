#!/usr/bin/env node
/**
 * Generate Chrome Web Store screenshots for the QR Code Generator extension.
 *
 * Requirements: npm install puppeteer sharp
 * Usage:        node generate_screenshots.js
 */

const puppeteer = require("puppeteer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const EXTENSION_DIR = path.join(__dirname, "extension");
const OUT_DIR = path.join(EXTENSION_DIR, "screenshots");
const SIDEPANEL = path.join(EXTENSION_DIR, "sidepanel.html");

const PANEL_WIDTH = 400;
const BG = { r: 59, g: 89, b: 152 }; // #3B5998

// [filename, canvasW, canvasH, withQR]
const SPECS = [
  ["screenshot-440x280.png",  440,  280, false],
  ["screenshot-1280x800.png", 1280, 800, true],
  ["screenshot-1400x560.png", 1400, 560, true],
];

async function capturePanel(page, withQR) {
  await page.setViewport({ width: PANEL_WIDTH, height: 900 });

  // Mock chrome API
  await page.evaluateOnNewDocument(() => {
    window.chrome = { tabs: { create: () => {} }, runtime: {} };
  });

  await page.goto(`file://${SIDEPANEL}`, { waitUntil: "networkidle0" });

  if (withQR) {
    await page.type("#value", "https://example.com");
    await page.evaluate(() =>
      document.getElementById("qrform").dispatchEvent(new Event("submit", { bubbles: true }))
    );
    await page.waitForFunction(
      () => !document.getElementById("qrimage").hasAttribute("hidden")
    );
    await page.waitForFunction(
      () => document.getElementById("qrimage").complete && document.getElementById("qrimage").naturalWidth > 0
    );
    await new Promise((r) => setTimeout(r, 500));
  }

  const contentHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: PANEL_WIDTH, height: Math.max(contentHeight, 300) });

  return page.screenshot({ type: "png" });
}

async function composite(panelBuf, canvasW, canvasH) {
  const PADDING = 40;

  // Get panel dimensions
  const meta = await sharp(panelBuf).metadata();
  let pw = meta.width;
  let ph = meta.height;

  const maxW = canvasW - PADDING;
  const maxH = canvasH - PADDING;

  if (pw > maxW || ph > maxH) {
    const scale = Math.min(maxW / pw, maxH / ph);
    pw = Math.round(pw * scale);
    ph = Math.round(ph * scale);
  }

  // Round corners via mask
  const radius = 14;
  const mask = Buffer.from(
    `<svg><rect x="0" y="0" width="${pw}" height="${ph}" rx="${radius}" ry="${radius}"/></svg>`
  );

  const panel = await sharp(panelBuf)
    .resize(pw, ph)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const x = Math.round((canvasW - pw) / 2);
  const y = Math.round((canvasH - ph) / 2);

  return sharp({
    create: { width: canvasW, height: canvasH, channels: 3, background: BG },
  })
    .composite([{ input: panel, left: x, top: y }])
    .png()
    .toBuffer();
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });

  console.log("Capturing empty state...");
  const pageEmpty = await browser.newPage();
  const emptyBuf = await capturePanel(pageEmpty, false);
  await pageEmpty.close();

  console.log("Capturing QR generated state...");
  const pageQR = await browser.newPage();
  const qrBuf = await capturePanel(pageQR, true);
  await pageQR.close();

  await browser.close();

  for (const [filename, cw, ch, useQR] of SPECS) {
    const buf = await composite(useQR ? qrBuf : emptyBuf, cw, ch);
    fs.writeFileSync(path.join(OUT_DIR, filename), buf);
    console.log(`✓ ${filename}  (${cw}x${ch})`);
  }

  console.log(`\nSaved to: ${OUT_DIR}`);
})();
