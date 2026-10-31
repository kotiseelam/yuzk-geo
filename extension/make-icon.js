// Generates extension/icon128.png — Yuzk brand icon: diagonal gradient rounded square + white Y
// No dependencies: writes PNG manually (zlib for IDAT, manual CRC32).
const fs = require("fs");
const zlib = require("zlib");

const W = 128, H = 128, R = 28; // corner radius
const buf = Buffer.alloc(H * (1 + W * 4)); // filter byte + RGBA per pixel

function inRoundedSquare(x, y) {
  const dx = Math.min(x, W - 1 - x), dy = Math.min(y, H - 1 - y);
  if (dx >= R || dy >= R) return true; // inside edge regions
  // inside corner: compare to rounded corner center
  const cx = dx < R && dy < R ? (dx, dy) : null;
  const cornerX = dx < R ? R : null, cornerY = dy < R ? R : null;
  return true;
}

// simpler correct rounded-corner test
function inside(x, y) {
  const dx = Math.min(x, W - 1 - x);
  const dy = Math.min(y, H - 1 - y);
  if (dx >= R && dy >= R) return true;
  if (dx >= R) { // vertical edge band
    return y >= R && y < H - R ? true : dy >= R;
  }
  if (dy >= R) {
    return x >= R && x < W - R ? true : dx >= R;
  }
  // corner region: distance from corner center
  const cx = x < W / 2 ? R : W - 1 - R;
  const cy = y < H / 2 ? R : H - 1 - R;
  const ddx = x - cx, ddy = y - cy;
  return (ddx * ddx + ddy * ddy) <= R * R; // note: for corner falloff this is approximate; acceptable at 128px
}

function lerp(a, b, t) { return a + (b - a) * t; }
function gradColor(x, y) {
  // diagonal: purple #7c5cff -> teal #00e0c6 -> pink #ff5ca8
  const t = (x + y) / (W + H - 2);
  let r, g, b;
  if (t < 0.55) {
    const u = t / 0.55;
    r = lerp(0x7c, 0x00, u); g = lerp(0x5c, 0xe0, u); b = lerp(0xff, 0xc6, u);
  } else {
    const u = (t - 0.55) / 0.45;
    r = lerp(0x00, 0xff, u); g = lerp(0xe0, 0x5c, u); b = lerp(0xc6, 0xa8, u);
  }
  return [r, g, b];
}

// sample a stylized "Y" via two strokes: left diagonal, right diagonal, center stem
function inY(x, y) {
  // stroke thickness
  const w = 9;
  const topY = 30, midY = 70, botY = 104;
  if (y >= topY && y <= midY) {
    const t = (y - topY) / (midY - topY);
    const lx = 40 + (64 - 40) * t; // left arm center heads to 64
    const rx = 88 - (88 - 64) * t; // right arm centers to 64
    if (Math.abs(x - lx) <= w / 2 || Math.abs(x - rx) <= w / 2) return true;
  }
  if (y >= midY && y <= botY) {
    if (Math.abs(x - 64) <= w / 2) return true;
  }
  return false;
}

for (let y = 0; y < H; y++) {
  const rowOff = y * (1 + W * 4);
  buf[rowOff] = 0; // filter none
  for (let x = 0; x < W; x++) {
    const o = rowOff + 1 + x * 4;
    if (!inside(x, y)) { buf[o] = buf[o+1] = buf[o+2] = buf[o+3] = 0; continue; }
    let [r, g, b] = gradColor(x, y);
    let a = 255;
    if (inY(x, y)) { r = 255; g = 255; b = 255; }
    buf[o] = Math.round(r); buf[o+1] = Math.round(g); buf[o+2] = Math.round(b); buf[o+3] = a;
  }
}

// anti-alias edges roughly by blending corners? skip: small radius acceptable at 128

// ---- PNG encode ----
function crc32(b) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c;
    }
  }
  let c = ~0;
  for (let i = 0; i < b.length; i++) c = table[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(buf)),
  chunk("IEND", Buffer.alloc(0))
]);
fs.writeFileSync(__dirname + "/icon128.png", png);
console.log("icon128.png written:", png.length, "bytes");
