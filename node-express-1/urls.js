// Usage: node urls.js FILENAME
// Reads FILENAME (one URL per line) and writes each page's HTML to a file
// named after the URL's hostname (e.g., http://example.com/foo -> "example.com").
// Errors for a specific URL are printed but do not stop the script.

const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');

async function readLines(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return data.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  } catch (err) {
    console.error(`Error: could not read file '${filename}'.`);
    process.exit(1);
  }
}

// If a same-host filename already exists, append -1, -2, ... to avoid clobbering
async function uniquePath(dir, basename) {
  let candidate = path.join(dir, basename);
  let n = 1;
  while (true) {
    try {
      await fs.access(candidate);
      const ext = path.extname(basename);
      const name = path.basename(basename, ext);
      candidate = path.join(dir, `${name}-${n}${ext}`);
      n += 1;
    } catch {
      return candidate; // doesn't exist
    }
  }
}

async function saveUrl(urlStr, outDir = '.') {
  try {
    const u = new URL(urlStr);
    const filename = await uniquePath(outDir, u.hostname);
    const resp = await axios.get(urlStr, { responseType: 'text', validateStatus: () => true });
    if (resp.status >= 200 && resp.status < 300) {
      await fs.writeFile(filename, resp.data, 'utf8');
      console.log(`Wrote to ${path.basename(filename)}`);
    } else {
      console.error(`Couldn't download ${urlStr} (status ${resp.status})`);
    }
  } catch (err) {
    console.error(`Couldn't download ${urlStr}`);
  }
}

async function main() {
  const filename = process.argv[2];
  if (!filename) {
    console.error('Usage: node urls.js FILENAME');
    process.exit(1);
  }
  const lines = await readLines(filename);
  const jobs = lines.map((u) => saveUrl(u));        
  await Promise.allSettled(jobs);
}

main();