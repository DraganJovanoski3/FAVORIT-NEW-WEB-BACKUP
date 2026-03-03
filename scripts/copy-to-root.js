/**
 * After ng build, the Angular app lives in dist/public_html/browser/.
 * This script copies its contents to dist/public_html/ so the app is served at root (base href /).
 * Run after copying .htaccess and PHP files.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const browserDir = path.join(root, 'dist', 'public_html', 'browser');
const destDir = path.join(root, 'dist', 'public_html');

if (!fs.existsSync(browserDir)) {
  console.warn('scripts/copy-to-root.js: dist/public_html/browser not found, skipping.');
  process.exit(0);
}

function copyRecursiveSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((el) => {
    const fromPath = path.join(from, el);
    const toPath = path.join(to, el);
    if (fs.statSync(fromPath).isDirectory()) {
      copyRecursiveSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

copyRecursiveSync(browserDir, destDir);
console.log('Copied browser/ contents to document root.');

function removeBrowserDir() {
  if (!fs.existsSync(browserDir)) return;
  try {
    fs.rmSync(browserDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    console.log('Removed browser/ folder.');
  } catch (err) {
    if (err.code === 'EBUSY' || err.code === 'EPERM') {
      console.warn('Could not remove browser/ (file in use). Delete dist/public_html/browser manually if needed.');
    } else {
      throw err;
    }
  }
}

removeBrowserDir();
