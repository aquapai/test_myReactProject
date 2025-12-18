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

    // Create a wrapped index that rewrites root-relative asset paths to folder-relative
    try {
      const indexPath = path.join(dirPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');
        // Replace src="/... or href="/... (root-relative) with relative versions
        html = html.replace(/(href|src)=("|')\//g, `$1=$2./`);
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
