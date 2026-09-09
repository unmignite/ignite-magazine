// ============================================================================
// Build the site's logo assets from the supplied artwork
// ============================================================================
//   node brand/build-logo-assets.mjs
//
// Inputs (committed alongside this script, the files as supplied):
//   brand/logo-on-light.png   dark ink on a cream ground
//   brand/logo-on-dark.png    cream ink on a dark brown ground
//
// Outputs (public/, shipped with the site):
//   logo-dark-ink.png    transparent, for the white header
//   logo-light-ink.png   transparent, for the header over the hero and the menu
//   favicon-32.png       the flame on the brand's dark ground
//   favicon-180.png      the same, for phone home screens
//
// Re-run this if the artwork is ever redrawn. Nothing here is hand-tuned to
// pixel positions that only exist in the current files: the bands are found by
// scanning, so a redraw at the same proportions will still work.
// ============================================================================

import { PNG } from 'pngjs'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'public')

const read = (f) => PNG.sync.read(readFileSync(join(HERE, f)))

// --- background removal -----------------------------------------------------
//
// The artwork is flat colour on a flat ground, so alpha is how far a pixel
// moves away from that ground in whichever channel moves most. The colour is
// then un-premultiplied — without that, half-covered edge pixels keep a share
// of the old background and the logo wears a cream halo on a dark header.
//
// `dir` is +1 when the ink is darker than the ground and -1 when it is lighter.
// `div` is the move that counts as fully opaque; it differs between the two
// files because cream-on-brown is a shorter journey than brown-on-cream.
function extract(png, bg, div, dir) {
  const out = { width: png.width, height: png.height, data: Buffer.alloc(png.width * png.height * 4) }
  for (let i = 0; i < png.width * png.height; i++) {
    const r = png.data[i * 4], g = png.data[i * 4 + 1], b = png.data[i * 4 + 2]
    const move = Math.max(dir * (bg[0] - r), dir * (bg[1] - g), dir * (bg[2] - b))
    const a = Math.max(0, Math.min(1, move / div))
    if (a <= 0.004) continue
    const un = (v, m) => Math.max(0, Math.min(255, Math.round((v - (1 - a) * m) / a)))
    out.data[i * 4] = un(r, bg[0])
    out.data[i * 4 + 1] = un(g, bg[1])
    out.data[i * 4 + 2] = un(b, bg[2])
    out.data[i * 4 + 3] = Math.round(a * 255)
  }
  return out
}

const alphaAt = (img, x, y) => img.data[(y * img.width + x) * 4 + 3]

// Rows that contain ink, grouped into bands. The artwork is three of them:
// the flame, the IGNITE wordmark, and the tagline underneath.
function bands(img) {
  const rows = []
  for (let y = 0; y < img.height; y++) {
    let n = 0
    for (let x = 0; x < img.width; x++) if (alphaAt(img, x, y) > 60) n++
    rows.push(n)
  }
  const found = []
  let start = null
  for (let y = 0; y < rows.length; y++) {
    if (rows[y] > 0 && start === null) start = y
    if (rows[y] === 0 && start !== null) { found.push([start, y - 1]); start = null }
  }
  if (start !== null) found.push([start, rows.length - 1])
  return found
}

function boundsOfRows(img, y0, y1) {
  let x0 = Infinity, x1 = -1
  for (let y = y0; y <= y1; y++) {
    for (let x = 0; x < img.width; x++) {
      if (alphaAt(img, x, y) > 60) { if (x < x0) x0 = x; if (x > x1) x1 = x }
    }
  }
  return { x0, x1 }
}

function crop(img, x, y, w, h) {
  const out = new PNG({ width: w, height: h })
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const s = ((y + j) * img.width + (x + i)) * 4
      const d = (j * w + i) * 4
      out.data[d] = img.data[s]
      out.data[d + 1] = img.data[s + 1]
      out.data[d + 2] = img.data[s + 2]
      out.data[d + 3] = img.data[s + 3]
    }
  }
  return out
}

// Bilinear, over premultiplied colour so transparent pixels don't bleed their
// (meaningless) RGB into the edges of the flame as it is enlarged.
function resize(img, w, h) {
  const out = new PNG({ width: w, height: h })
  for (let j = 0; j < h; j++) {
    const sy = Math.min(img.height - 1, (j + 0.5) * img.height / h - 0.5)
    const y0 = Math.max(0, Math.floor(sy)), y1 = Math.min(img.height - 1, y0 + 1), fy = sy - y0
    for (let i = 0; i < w; i++) {
      const sx = Math.min(img.width - 1, (i + 0.5) * img.width / w - 0.5)
      const x0 = Math.max(0, Math.floor(sx)), x1 = Math.min(img.width - 1, x0 + 1), fx = sx - x0
      let r = 0, g = 0, b = 0, a = 0
      for (const [px, wx] of [[x0, 1 - fx], [x1, fx]]) {
        for (const [py, wy] of [[y0, 1 - fy], [y1, fy]]) {
          const s = (py * img.width + px) * 4, k = wx * wy, al = img.data[s + 3] / 255
          r += img.data[s] * al * k; g += img.data[s + 1] * al * k; b += img.data[s + 2] * al * k
          a += al * k
        }
      }
      const d = (j * w + i) * 4
      out.data[d] = a > 0 ? Math.round(r / a) : 0
      out.data[d + 1] = a > 0 ? Math.round(g / a) : 0
      out.data[d + 2] = a > 0 ? Math.round(b / a) : 0
      out.data[d + 3] = Math.round(a * 255)
    }
  }
  return out
}

function tile(flame, size, ground) {
  const out = new PNG({ width: size, height: size })
  for (let i = 0; i < size * size; i++) {
    out.data[i * 4] = ground[0]; out.data[i * 4 + 1] = ground[1]
    out.data[i * 4 + 2] = ground[2]; out.data[i * 4 + 3] = 255
  }
  const h = Math.round(size * 0.66)
  const w = Math.round(h * (flame.width / flame.height))
  const s = resize(flame, w, h)
  const ox = Math.round((size - w) / 2), oy = Math.round((size - h) / 2)
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const src = (j * w + i) * 4, a = s.data[src + 3] / 255
      if (!a) continue
      const d = ((oy + j) * size + (ox + i)) * 4
      for (let c = 0; c < 3; c++) {
        out.data[d + c] = Math.round(s.data[src + c] * a + out.data[d + c] * (1 - a))
      }
    }
  }
  return out
}

const save = (name, png) => {
  writeFileSync(join(OUT, name), PNG.sync.write(png))
  console.log(`  ${name.padEnd(20)} ${png.width}x${png.height}`)
}

// --- run --------------------------------------------------------------------

console.log('Reading artwork…')
const sources = [
  { file: 'logo-on-light.png', bg: [255, 250, 243], div: 200, dir: 1, out: 'logo-dark-ink.png' },
  { file: 'logo-on-dark.png', bg: [51, 44, 42], div: 150, dir: -1, out: 'logo-light-ink.png' },
]

let flameSource = null
const boxes = []

for (const s of sources) {
  const img = extract(read(s.file), s.bg, s.div, s.dir)
  const b = bands(img)
  if (b.length < 2) throw new Error(`${s.file}: expected a flame band and a wordmark band, found ${b.length}`)
  // Everything except the last band, which is the tagline. At header size the
  // tagline would be four pixels tall, so the lockup here is flame + wordmark.
  const top = b[0][0], bottom = b[b.length - 2][1]
  const { x0, x1 } = boundsOfRows(img, top, bottom)
  boxes.push({ img, top, bottom, x0, x1, out: s.out })
  if (s.file === 'logo-on-dark.png') flameSource = { img, band: b[0] }
}

// One crop box for both, so the two variants are interchangeable in the markup.
const PAD = 3
const box = {
  x: Math.min(...boxes.map((b) => b.x0)) - PAD,
  y: Math.min(...boxes.map((b) => b.top)) - PAD,
}
box.w = Math.max(...boxes.map((b) => b.x1)) + PAD - box.x + 1
box.h = Math.max(...boxes.map((b) => b.bottom)) + PAD - box.y + 1
console.log(`Wordmark box: ${box.w}x${box.h} at ${box.x},${box.y}`)

console.log('Writing:')
for (const b of boxes) save(b.out, crop(b.img, box.x, box.y, box.w, box.h))

// Favicon: the flame alone. A 500px lockup cannot be a 16px icon, and the
// flame is the part of the mark that still reads at that size.
const fb = flameSource.band
const fx = boundsOfRows(flameSource.img, fb[0], fb[1])
const flame = crop(flameSource.img, fx.x0 - 1, fb[0] - 1, fx.x1 - fx.x0 + 3, fb[1] - fb[0] + 3)
console.log(`Flame: ${flame.width}x${flame.height}`)
for (const size of [32, 180]) save(`favicon-${size}.png`, tile(flame, size, [51, 44, 42]))

console.log('Done.')
