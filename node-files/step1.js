// Print the contents of a file (error-first callback style)

const fs = require('fs');

function cat(path) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
      process.exit(1);
    }
    console.log(data);
  });
}

// CLI
const path = process.argv[2];
if (!path) {
  console.error('Usage: node step1.js <file>');
  process.exit(1);
}
cat(path);