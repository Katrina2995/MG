import { exec } from 'child_process';

console.log('Starting Eleventy development server...');

// Run Eleventy in serve mode on port 5000
const eleventy = exec('npx @11ty/eleventy --serve --port=5000');

eleventy.stdout.on('data', (data) => {
  console.log(data.toString());
});

eleventy.stderr.on('data', (data) => {
  console.error(data.toString());
});

eleventy.on('exit', (code) => {
  console.log(`Eleventy process exited with code ${code}`);
  process.exit(code);
});
