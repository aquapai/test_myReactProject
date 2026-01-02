const fs = require('fs');
const path = require('path');

// Scans the public/ directory and generates public/sites.json
const publicDir = path.join(__dirname, '..', 'public');
const outFile = path.join(publicDir, 'sites.json');

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function hasIndexHtml(p) {
  return fs.existsSync(path.join(p, 'index.html')) || fs.existsSync(path.join(p, 'index.htm'));
}

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
      continue;
    }

    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      // Replace import ... from './Name' with './Name.tsx' if file exists
      content = content.replace(/from\s+['"]\.\/([^'"]+)['"]/g, (match, importPath) => {
        // If it already has extension, ignore
        if (importPath.endsWith('.tsx') || importPath.endsWith('.ts') || importPath.endsWith('.js')) return match;

        // Check if .tsx exists
        if (fs.existsSync(path.join(dir, `${importPath}.tsx`))) {
          changed = true;
          return `from './${importPath}.tsx'`;
        }
        if (fs.existsSync(path.join(dir, `${importPath}.ts`))) {
          changed = true;
          return `from './${importPath}.ts'`;
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed imports in', fullPath);
      }
    }
  }
}

function buildSites() {
  if (!fs.existsSync(publicDir)) {
    console.error('public directory not found:', publicDir);
    process.exit(1);
  }

  const entries = fs.readdirSync(publicDir, { withFileTypes: true });
  const sites = [];

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const name = ent.name;
    const dirPath = path.join(publicDir, name);
    if (!isDirectory(dirPath)) continue;
    if (!hasIndexHtml(dirPath)) continue;

    // derive display name from folder name
    const displayName = name.replace(/[-_]/g, ' ');
    const url = `/${name}/index.wrapped.html`;

    // choose image: prefer public/<name>/thumbnail.png or favicon.png, otherwise placeholder
    let imageUrl = `/placeholder-site.png`;
    const thumbCandidates = ['thumbnail.png', 'thumbnail.jpg', 'favicon.png', 'favicon.ico'];
    for (const c of thumbCandidates) {
      if (fs.existsSync(path.join(dirPath, c))) {
        imageUrl = `/${name}/${c}`;
        break;
      }
    }

    // Fix imports in .tsx files (add .tsx extension if missing) to allow browser resolution
    try {
      fixImports(dirPath);
    } catch (e) {
      console.warn('Failed to fix imports in', dirPath, e);
    }

    // Create a wrapped index that rewrites root-relative asset paths to folder-relative
    try {
      const indexPath = path.join(dirPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');
        // Replace src="/... or href="/... (root-relative) with relative versions
        html = html.replace(/(href|src)=("|')\//g, `$1=$2./`);

        // Inject Babel standalone for in-browser compilation of TSX/JSX
        // AND Inject API Key for AI features (Exam/Demo only - exposes key)
        if (html.includes('<head>')) {
          const injection = `
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script>
      window.process = {
        env: {
          API_KEY: "AIzaSyDr73mB7NaPI0oIL-xG5mcRM3Clv12hTxQ"
        }
      };
    </script>`;
          html = html.replace('<head>', '<head>\n' + injection);
        }

        // Convert module scripts to text/babel for Babel to process
        // Also add data-presets for react and typescript
        html = html.replace(/<script type="module" src="([^"]+)"/g, '<script type="text/babel" data-type="module" src="$1" data-presets="react,typescript"');

        const wrappedPath = path.join(dirPath, 'index.wrapped.html');
        fs.writeFileSync(wrappedPath, html, 'utf8');
      }
    } catch (e) {
      // ignore wrap errors
    }

    sites.push({
      id: name,
      name: displayName,
      url,
      imageUrl,
      category: '내 사이트'
    });
  }

  fs.writeFileSync(outFile, JSON.stringify(sites, null, 2), 'utf8');
  console.log('Generated', outFile, 'with', sites.length, 'sites');
}

buildSites();
