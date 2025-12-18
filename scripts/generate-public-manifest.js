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
    const url = `/${name}/`;

    // choose image: prefer public/<name>/thumbnail.png or favicon.png, otherwise placeholder
    let imageUrl = `/placeholder-site.png`;
    const thumbCandidates = ['thumbnail.png', 'thumbnail.jpg', 'favicon.png', 'favicon.ico'];
    for (const c of thumbCandidates) {
      if (fs.existsSync(path.join(dirPath, c))) {
        imageUrl = `/${name}/${c}`;
        break;
      }
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
