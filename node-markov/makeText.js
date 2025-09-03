
/** Command-line tool to generate Markov text. */
const fs = require("fs");
const axios = require("axios");
const { MarkovMachine } = require("./markov");

function usage() {
  console.error("Usage:\n  node makeText.js file <path>\n  node makeText.js url <url>");
  process.exit(1);
}

async function getTextFromFile(path) {
  try {
    return await fs.promises.readFile(path, "utf8");
  } catch (err) {
    console.error(`Error reading file '${path}': ${err.message}`);
    process.exit(1);
  }
}

async function getTextFromUrl(url) {
  try {
    const resp = await axios.get(url);
    return resp.data;
  } catch (err) {
    const msg = err.response ? `${err.message} (status ${err.response.status})` : err.message;
    console.error(`Error fetching URL '${url}': ${msg}`);
    process.exit(1);
  }
}

async function main() {
  const mode = process.argv[2];
  const source = process.argv[3];
  if (!mode || !source) usage();

  let text;
  if (mode === "file") {
    text = await getTextFromFile(source);
  } else if (mode === "url") {
    text = await getTextFromUrl(source);
  } else {
    usage();
    return;
  }

  const mm = new MarkovMachine(text);
  console.log(mm.makeText(100));
}

if (require.main === module) {
  main();
}