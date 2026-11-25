import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ASSETS = [
  { id: 'purple-bed', name: 'Purple Bed', versions: [
    { id: 'original', label: 'Original', file: 'purple-bed-original.glb', size: '17.99 MB', draco: false },
    { id: 'draco', label: 'Draco', file: 'purple-bed.glb', size: '4.03 MB', draco: true },
    { id: 'webp', label: 'Draco + WebP', file: 'purple-bed-webp.glb', size: '0.64 MB', draco: true },
  ]},
  { id: 'storage-bed', name: 'Storage Bed', versions: [
    { id: 'original', label: 'Original', file: 'storage-bed-original.glb', size: '19.86 MB', draco: false },
    { id: 'draco', label: 'Draco', file: 'storage-bed.glb', size: '4.61 MB', draco: true },
    { id: 'webp', label: 'Draco + WebP', file: 'storage-bed-webp.glb', size: '0.97 MB', draco: true },
  ]},
];

export default function AssetInspector() {
  const mountRef = useRef(null);
  const [assetId, setAssetId] = useState('purple-bed');
  const [versionId, setVersionId] = useState('webp');
  const [zUp, setZUp] = useState(true);
  const [status, setStatus] = useState('Preparing viewer...');
  const [error, setError] = useState('');
  const [loadedSize, setLoadedSize] = useState(null);

  const asset = ASSETS.find((item) => item.id === assetId);
  const version = asset.versions.find((item) => item.id === versionId);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    let controls;
    let frame;
    let active = true;
    let currentModel = null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#211d19');

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1000);
    camera.position.set(3.5, 2.6, 4.5);

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      mount.appendChild(renderer.domElement);
    } catch (e) {
      setError('WebGL could not initialise. Try another browser or update your graphics driver.');
      setStatus('Viewer unavailable');
      return;
    }

    scene.add(new THREE.HemisphereLight(0xffe8cc, 0x29221c, 1.8));

    const key = new THREE.DirectionalLight(0xffedda, 3.0);
    key.position.set(4, 7, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xc5d5ff, 1.1);
    fill.position.set(-5, 3, -4);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({ color: '#37302a', roughness: 0.88 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.015;
    scene.add(ground);

    const grid = new THREE.GridHelper(10, 20, 0x8b755c, 0x594b3d);
    grid.position.y = -0.01;
    scene.add(grid);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 0.5;
    controls.maxDistance = 15;
    controls.target.set(0, 0.7, 0);

    const resize = () => {
      if (!active) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    draco.setDecoderConfig({ type: 'wasm' });
    draco.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    setStatus('Loading model...');
    setError('');
    setLoadedSize(version.size);

    const started = performance.now();

    loader.load(
      `/inspector-assets/${version.file}`,
      (gltf) => {
        if (!active) {
          gltf.scene.traverse((o) => {
            if (o.geometry) o.geometry.dispose();
          });
          return;
        }

        currentModel = gltf.scene;
        if (zUp) currentModel.rotation.x = -Math.PI / 2;

        const box = new THREE.Box3().setFromObject(currentModel);
        const center = box.getCenter(new THREE.Vector3());
        currentModel.position.sub(center);

        const centredBox = new THREE.Box3().setFromObject(currentModel);
        currentModel.position.y -= centredBox.min.y;

        scene.add(currentModel);

        const size = new THREE.Box3().setFromObject(currentModel).getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z, 0.1);
        const distance = maxDimension * 2.3;

        camera.position.set(distance, distance * 0.72, distance);
        camera.near = Math.max(maxDimension / 1000, 0.001);
        camera.far = maxDimension * 100;
        camera.updateProjectionMatrix();

        controls.target.set(0, size.y * 0.48, 0);
        controls.update();

        const elapsed = ((performance.now() - started) / 1000).toFixed(2);
        setStatus(`Loaded in ${elapsed}s`);
      },
      (event) => {
        if (active && event.total) {
          setStatus(`Loading ${Math.round(event.loaded / event.total * 100)}%`);
        }
      },
      (err) => {
        if (!active) return;
        console.error('Asset Inspector load error:', err);
        setError(err?.message || 'Could not load this model.');
        setStatus('Loading failed');
      }
    );

    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      draco.dispose();

      if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            const materials = Array.isArray(o.material) ? o.material : [o.material];
            materials.forEach((m) => {
              Object.values(m).forEach((v) => {
                if (v && v.isTexture) v.dispose();
              });
              m.dispose();
            });
          }
        });
      }

      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const materials = Array.isArray(o.material) ? o.material : [o.material];
          materials.forEach((m) => m.dispose());
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [assetId, versionId, zUp]);

  return (
    <main className="asset-inspector">
      <div className="inspector-heading">
        <div>
          <span className="inspector-kicker">DIRWA / DEVELOPMENT TOOL</span>
          <h1>3D Asset Inspector</h1>
          <p>Inspect furniture models and compare optimisation quality.</p>
        </div>
        <span className="inspector-status">{status}</span>
      </div>

      <div className="inspector-layout">
        <section className="inspector-viewer">
          <div className="inspector-viewer-top">
            <span>{asset.name}</span>
            <span>{version.label}</span>
          </div>
          <div className="inspector-canvas" ref={mountRef}>
            {error && <div className="inspector-error">{error}</div>}
          </div>
          <div className="inspector-viewer-bottom">
            <span>Drag to rotate · Scroll to zoom</span>
            <span>{loadedSize}</span>
          </div>
        </section>

        <aside className="inspector-controls">
          <div className="inspector-control-group">
            <label htmlFor="inspector-asset">Furniture model</label>
            <select id="inspector-asset" value={assetId} onChange={(e) => setAssetId(e.target.value)}>
              {ASSETS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>

          <div className="inspector-control-group">
            <label>Compression version</label>
            <div className="inspector-versions">
              {asset.versions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={versionId === item.id ? 'active' : ''}
                  onClick={() => setVersionId(item.id)}
                >
                  <span>{item.label}</span>
                  <strong>{item.size}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="inspector-control-group">
            <label>Model orientation</label>
            <button className="inspector-orientation" type="button" onClick={() => setZUp((v) => !v)}>
              {zUp ? 'Z-up → Y-up (showroom)' : 'Native orientation'}
            </button>
          </div>

          <div className="inspector-file-info">
            <span>Selected file</span>
            <strong>{version.file}</strong>
            <span>Download size</span>
            <strong>{version.size}</strong>
            <span>Draco geometry</span>
            <strong>{version.draco ? 'Enabled' : 'Not used'}</strong>
            <span>Texture format</span>
            <strong>{version.id === 'webp' ? 'WebP' : 'Original'}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
