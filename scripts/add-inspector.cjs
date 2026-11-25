const fs = require('fs');

const appPath = 'src/App.jsx';
let app = fs.readFileSync(appPath, 'utf8');

if (!app.includes("import AssetInspector from './components/AssetInspector.jsx';")) {
  app = app.replace(
    "import ProductPanel from './components/ProductPanel.jsx';",
    "import ProductPanel from './components/ProductPanel.jsx';\nimport AssetInspector from './components/AssetInspector.jsx';"
  );
}

app = app.replace(
  "return h === 'showroom' || h === 'gallery' ? h : 'home';",
  "return h === 'showroom' || h === 'gallery' || h === 'inspector' ? h : 'home';"
);

app = app.replace(
  "{view !== 'gallery' && (",
  "{view !== 'gallery' && view !== 'inspector' && ("
);

app = app.replace(
  "{view === 'gallery' && <Gallery onSelect={setSelId} onList={setGalleryList} />}",
  "{view === 'gallery' && <Gallery onSelect={setSelId} onList={setGalleryList} />}\n      {view === 'inspector' && <AssetInspector />}"
);

fs.writeFileSync(appPath, app);

const headerPath = 'src/components/Header.jsx';
let header = fs.readFileSync(headerPath, 'utf8');

const galleryButton = `          <button type="button" aria-current={view === 'gallery' ? 'page' : undefined} onClick={() => go('gallery')}>
            Gallery
          </button>`;

if (!header.includes("go('inspector')")) {
  if (!header.includes(galleryButton)) {
    throw new Error('Could not find the expected Gallery navigation button. Header.jsx was not changed.');
  }

  header = header.replace(
    galleryButton,
    galleryButton + `
          <button type="button" aria-current={view === 'inspector' ? 'page' : undefined} onClick={() => go('inspector')}>
            Inspector
          </button>`
  );
}

fs.writeFileSync(headerPath, header);
console.log('App.jsx and Header.jsx updated.');
