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

// Recursively find all .ts/.tsx files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

// Bundle all local files into one script content
function bundleFiles(dir) {
  const files = getAllFiles(dir);

  // Sort files: components first, then App, then index
  // Heuristic: 
  // 1. Files in subdirectories (likely components/utils)
  // 2. App.tsx
  // 3. index.tsx
  files.sort((a, b) => {
    const aBase = path.basename(a);
    const bBase = path.basename(b);
    const aIsRoot = path.dirname(a) === dir;
    const bIsRoot = path.dirname(b) === dir;

    if (!aIsRoot && bIsRoot) return -1;
    if (aIsRoot && !bIsRoot) return 1;

    if (aBase === 'App.tsx' || aBase === 'App.ts') return -1; // App before index
    if (bBase === 'App.tsx' || bBase === 'App.ts') return 1;

    if (aBase.startsWith('index.')) return 1; // index always last
    if (bBase.startsWith('index.')) return -1;

    return a.localeCompare(b);
  });

  let bundle = '';

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // STRIP LOCAL IMPORTS: import ... from './...'
    // Regex matches: import [anything] from ['. or "]./[anything][' or "]
    content = content.replace(/import\s+.*?from\s+['"]\..*?['"];?/g, '');

    // STRIP EXPORTS: export default, export const -> const
    content = content.replace(/export\s+default\s+/g, '');
    content = content.replace(/export\s+const\s+/g, 'const ');
    content = content.replace(/export\s+function\s+/g, 'function ');
    content = content.replace(/export\s+class\s+/g, 'class ');

    bundle += `\n/* --- Bundled from ${path.basename(file)} --- */\n`;
    bundle += content;
    bundle += '\n';
  }

  return bundle;
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

    // choose image
    let imageUrl = `/placeholder-site.png`;
    const thumbCandidates = ['thumbnail.png', 'thumbnail.jpg', 'favicon.png', 'favicon.ico'];
    for (const c of thumbCandidates) {
      if (fs.existsSync(path.join(dirPath, c))) {
        imageUrl = `/${name}/${c}`;
        break;
      }
    }

    try {
      const indexPath = path.join(dirPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');

        // Fix asset paths
        html = html.replace(/(href|src)=("|')\//g, `$1=$2./`);

        // Remove existing scripts to avoid conflicts
        html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/gi, '');
        html = html.replace(/<script.*?src=["'].*?["'].*?>\s*<\/script>/gi, ''); // remove external scripts
        html = html.replace(/<script type="module">[\s\S]*?<\/script>/gi, ''); // remove module blocks

        // Generate Bundle
        const bundledCode = bundleFiles(dirPath);

        const injection = `
     <!-- Injected by Generator -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script>
      window.process = { env: { API_KEY: "AIzaSyDr73mB7NaPI0oIL-xG5mcRM3Clv12hTxQ" } };
    </script>
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@18.2.0",
          "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
          "lucide-react": "https://esm.sh/lucide-react@0.263.1",
          "@google/genai": "https://esm.sh/@google/genai@0.1.1",
          "recharts": "https://esm.sh/recharts@2.12.0"
        }
      }
    </script>
    <script type="text/babel" data-type="module" data-presets="react,typescript">
      ${bundledCode}
    </script>
    <script>
      window.addEventListener('load', function() {
        if (window.Babel) {
          window.Babel.transformScriptTags();
        }
      });
    </script>
    `;

        if (html.includes('</body>')) {
          html = html.replace('</body>', injection + '\n</body>');
        } else {
          html += injection;
        }

        const wrappedPath = path.join(dirPath, 'index.wrapped.html');
        fs.writeFileSync(wrappedPath, html, 'utf8');
      }
    } catch (e) {
      console.error('Error generating wrapped html for', name, e);
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
