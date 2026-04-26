#!/usr/bin/env node
/**
 * Generates web/images/favicon.ico from web/images/logo.svg
 * Sizes: 16, 32, 48px
 *
 * Usage: node generate_favicon.js
 */

const sharp    = require("sharp");
const fs       = require("fs");
const path     = require("path");

const SVG_IN   = path.join(__dirname, "web/images/logo.svg");
const ICO_OUT  = path.join(__dirname, "web/images/favicon.ico");
const ICO_OUT2 = path.join(__dirname, "docs/images/favicon.ico");
const SIZES   = [16, 32, 48, 64, 128, 256, 512, 1024];

(async () => {
  const { default: pngToIco } = await import("png-to-ico");
  const svgBuf = fs.readFileSync(SVG_IN);

  const pngBuffers = await Promise.all(
    SIZES.map((s) => sharp(svgBuf).resize(s, s).png().toBuffer())
  );

  const ico = await pngToIco(pngBuffers);
  fs.writeFileSync(ICO_OUT, ico);
  console.log(`✓ favicon.ico written to: ${ICO_OUT}`);
  fs.writeFileSync(ICO_OUT2, ico);
  console.log(`✓ favicon.ico written to: ${ICO_OUT2}`);
})();
