import { useRef, useMemo, useLayoutEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import Composer from './Composer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

/* ============================================================
   NeuroWatch AI — Brain3D
   A living digital brain, now driven by a real anatomical GLB
   (Lobe_Lobe_0 = cerebrum, Lobe_Cerebllum_1_0 / _2_0 = cerebellum)
   instead of procedurally generated geometry.
   ============================================================ */

/* ---------- CPU noise (kept for original procedural geometry) ---------- */
function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + (b - a) * t; }
function hash3(xi, yi, zi) {
  let h = (xi * 374761393 + yi * 668265263 + zi * 1274126177) | 0;
  h = (h ^ (h >> 13)) * 1274126177 | 0;
  h = (h ^ (h >> 16)) >>> 0;
  return h / 4294967295;
}
function valueNoise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = fade(xf), v = fade(yf), w = fade(zf);
  const c000 = hash3(xi, yi, zi), c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi), c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1), c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1), c111 = hash3(xi + 1, yi + 1, zi + 1);
  const x00 = lerp(c000, c100, u), x10 = lerp(c010, c110, u);
  const x01 = lerp(c001, c101, u), x11 = lerp(c011, c111, u);
  const y0 = lerp(x00, x10, v), y1 = lerp(x01, x11, v);
  return lerp(y0, y1, w);
}
function ridgeFbm(x, y, z, freq, oct) {
  let f = 0, amp = 0.5, fr = freq;
  for (let i = 0; i < oct; i++) {
    const n = valueNoise3(x * fr, y * fr, z * fr);
    f += amp * (1 - Math.abs(2 * n - 1));
    fr *= 2; amp *= 0.5;
  }
  return f;
}
function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* ---------- Original procedural brain geometry (UNMODIFIED, kept intact) ----------
   These are preserved exactly as they were and are no longer invoked by Scene,
   which now renders the GLB instead. Left in place per instruction not to
   modify or optimise them. */
function buildCerebrumGeometry(detail = 40) {
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const rx = 1.0, ry = 0.8, rz = 0.95; // ellipsoid proportions
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const len = v.length();
    const nx = v.x / len, ny = v.y / len, nz = v.z / len;

    const fw = 0.12, fd = 0.22;
    let fissure = fd * Math.exp(-(nx * nx) / (2 * fw * fw));
    fissure *= 1.0 - 0.45 * Math.max(0, -ny);

    const g1 = 0.075 * ridgeFbm(nx, ny, nz, 4.8, 5);
    const g2 = 0.035 * ridgeFbm(nx + 11.3, ny + 4.7, nz + 8.1, 11.0, 4);
    const g3 = 0.014 * ridgeFbm(nx - 3.1, ny + 7.2, nz - 5.5, 22.0, 2);

    let r = 1.0 - fissure + g1 + g2 + g3;

    let lobe = 0;
    lobe += 0.05 * smoothstep(0.45, 0.95, nz);
    lobe += 0.035 * smoothstep(0.55, 0.95, -nz);
    const temp = smoothstep(0.25, 0.7, Math.abs(nx)) *
                 smoothstep(0.05, -0.55, ny) *
                 smoothstep(-0.25, 0.35, nz);
    lobe += 0.06 * temp;
    lobe -= 0.02 * smoothstep(0.4, 0.9, ny) * smoothstep(0.1, -0.5, nz);
    r += lobe;

    const asym = 0.015 * Math.sin(ny * 6.0 + nz * 4.0) * Math.sign(nx);
    r += asym;

    v.x = nx * r * rx;
    v.y = ny * r * ry;
    v.z = nz * r * rz;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function buildCerebellumGeometry(detail = 16) {
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const len = v.length();
    const nx = v.x / len, ny = v.y / len, nz = v.z / len;
    const folds = 0.05 * (1 - Math.abs(2 * (valueNoise3(nx * 30, ny * 6, nz * 6) - 0.5))) * 0.5;
    const r = 1.0 + folds;
    v.x = nx * r * 0.5;
    v.y = ny * r * 0.34;
    v.z = nz * r * 0.7;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/* ---------- Original vertex-index surface sampler (UNMODIFIED, kept intact) ---------- */
function sampleSurfacePoints(geo, count, seed = 1) {
  const pos = geo.attributes.position;
  const nrm = geo.attributes.normal;
  const out = new Array(count);
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  let s = seed * 9176;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967295;
  };
  for (let i = 0; i < count; i++) {
    const idx = (rand() * pos.count) | 0;
    v.fromBufferAttribute(pos, idx);
    n.fromBufferAttribute(nrm, idx);
    const jitter = 0.02 * rand();
    tmp.copy(v).addScaledVector(n, jitter);
    out[i] = { pos: tmp.clone(), normal: n.clone() };
  }
  return out;
}

/* ============================================================
   NEW: GLB integration helpers
   ============================================================ */

/* Center the loaded GLB at its bounding-box centroid and uniformly scale it
   so its largest dimension matches the previous procedural brain's rough
   footprint (~2.1 units), keeping every downstream shader / distance
   constant (fresnel, hot-zone radius, fibre thresholds, camera distance)
   valid without touching them. */
function centerAndNormalizeGLB(sourceScene, targetMaxDimension = 2.1) {
  const clone = sourceScene.clone(true);
  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  clone.position.set(-center.x, -center.y, -center.z);

  const wrapper = new THREE.Group();
  wrapper.name = 'GLBBrainWrapper';
  wrapper.add(clone);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetMaxDimension / maxDim;
  wrapper.scale.setScalar(scale);
  wrapper.updateMatrixWorld(true);

  return wrapper;
}

/* Identify the cerebrum vs. the two cerebellum meshes by name, with a
   vertex-count fallback (largest mesh = cerebrum) in case naming differs
   between exports. */
function classifyGLBMeshes(wrapper) {
  const meshes = [];
  wrapper.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });

  let cerebrumMesh = meshes.find((m) => /lobe/i.test(m.name) && !/cereb/i.test(m.name));
  let cerebellumMeshes = meshes.filter((m) => /cereb/i.test(m.name));

  if (!cerebrumMesh || cerebellumMeshes.length === 0) {
    const sorted = [...meshes].sort(
      (a, b) => b.geometry.attributes.position.count - a.geometry.attributes.position.count
    );
    cerebrumMesh = sorted[0];
    cerebellumMeshes = sorted.slice(1);
  }

  return { meshes, cerebrumMesh, cerebellumMeshes };
}

/* Total surface area of a mesh (in its own local units) — used only to
   proportionally allocate neuron counts across the three sub-meshes. */
function computeMeshArea(mesh) {
  const geo = mesh.geometry;
  const posAttr = geo.attributes.position;
  const index = geo.index;
  const triCount = index ? index.count / 3 : posAttr.count / 3;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), cross = new THREE.Vector3();
  let total = 0;
  for (let t = 0; t < triCount; t++) {
    const i0 = index ? index.getX(t * 3) : t * 3;
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    a.fromBufferAttribute(posAttr, i0);
    b.fromBufferAttribute(posAttr, i1);
    c.fromBufferAttribute(posAttr, i2);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    cross.crossVectors(ab, ac);
    total += cross.length() * 0.5;
  }
  return total;
}

/* Area-weighted random surface sampling: picks a triangle proportional to
   its area (not a raw random vertex index), then a random barycentric point
   on it. Avoids clustering in the dense/baked-detail regions of the real
   mesh. Returns world-space points (post centering + scaling), matching the
   shape consumed by Neurons / buildFibres / Impulses: { pos, normal }. */
function sampleMeshSurfaceAreaWeighted(mesh, count, seed, region) {
  if (count <= 0) return [];
  const geo = mesh.geometry;
  const posAttr = geo.attributes.position;
  const normAttr = geo.attributes.normal;
  const index = geo.index;
  mesh.updateMatrixWorld(true);
  const matrixWorld = mesh.matrixWorld;
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrixWorld);

  const triCount = index ? index.count / 3 : posAttr.count / 3;
  const cum = new Float64Array(triCount);
  const triIndices = new Uint32Array(triCount * 3);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), cross = new THREE.Vector3();

  let totalArea = 0;
  for (let t = 0; t < triCount; t++) {
    const i0 = index ? index.getX(t * 3) : t * 3;
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    triIndices[t * 3] = i0; triIndices[t * 3 + 1] = i1; triIndices[t * 3 + 2] = i2;
    a.fromBufferAttribute(posAttr, i0);
    b.fromBufferAttribute(posAttr, i1);
    c.fromBufferAttribute(posAttr, i2);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    cross.crossVectors(ab, ac);
    totalArea += cross.length() * 0.5;
    cum[t] = totalArea;
  }

  let s = ((seed * 9176) + 1) >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967295;
  };

  const out = new Array(count);
  const pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3();
  const nA = new THREE.Vector3(), nB = new THREE.Vector3(), nC = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const r = rand() * totalArea;
    let lo = 0, hi = triCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < r) lo = mid + 1; else hi = mid;
    }
    const t = lo;
    const i0 = triIndices[t * 3], i1 = triIndices[t * 3 + 1], i2 = triIndices[t * 3 + 2];
    pA.fromBufferAttribute(posAttr, i0);
    pB.fromBufferAttribute(posAttr, i1);
    pC.fromBufferAttribute(posAttr, i2);
    nA.fromBufferAttribute(normAttr, i0);
    nB.fromBufferAttribute(normAttr, i1);
    nC.fromBufferAttribute(normAttr, i2);

    let u = rand(), v = rand();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v;

    const localPos = new THREE.Vector3(
      pA.x * w + pB.x * u + pC.x * v,
      pA.y * w + pB.y * u + pC.y * v,
      pA.z * w + pB.z * u + pC.z * v
    );
    const localNormal = new THREE.Vector3(
      nA.x * w + nB.x * u + nC.x * v,
      nA.y * w + nB.y * u + nC.y * v,
      nA.z * w + nB.z * u + nC.z * v
    );
    if (localNormal.lengthSq() < 1e-8) localNormal.set(0, 1, 0);
    localNormal.normalize();

    const worldPos = localPos.clone().applyMatrix4(matrixWorld);
    const worldNormal = localNormal.clone().applyMatrix3(normalMatrix).normalize();

    const jitter = 0.01 * rand();
    worldPos.addScaledVector(worldNormal, jitter);

    out[i] = { pos: worldPos, normal: worldNormal, region };
  }
  return out;
}

/* ---------- GLSL noise (for shaders) ---------- */
const GLSL_NOISE = /* glsl */ `
float hash31(vec3 p){
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float vnoise3(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = hash31(i + vec3(0,0,0));
  float n100 = hash31(i + vec3(1,0,0));
  float n010 = hash31(i + vec3(0,1,0));
  float n110 = hash31(i + vec3(1,1,0));
  float n001 = hash31(i + vec3(0,0,1));
  float n101 = hash31(i + vec3(1,0,1));
  float n011 = hash31(i + vec3(0,1,1));
  float n111 = hash31(i + vec3(1,1,1));
  float nx00 = mix(n000, n100, u.x);
  float nx10 = mix(n010, n110, u.x);
  float nx01 = mix(n001, n101, u.x);
  float nx11 = mix(n011, n111, u.x);
  float nxy0 = mix(nx00, nx10, u.y);
  float nxy1 = mix(nx01, nx11, u.y);
  return mix(nxy0, nxy1, u.z);
}
float fbm3(vec3 p){
  float f = 0.0, a = 0.5;
  for(int i = 0; i < 4; i++){
    f += a * vnoise3(p);
    p *= 2.0;
    a *= 0.5;
  }
  return f;
}
`;

/* ---------- Tissue shader material (UNMODIFIED) ---------- */
function createTissueMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSeizure: { value: 0 },
      uFocal: { value: new THREE.Vector3() },
      uFocalRadius: { value: 0.9 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uSeizure;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying float vCortex;
      varying float vRidge;
      ${GLSL_NOISE}
      void main(){
        vec3 pos = position;
        vec3 n = normalize(normal);
        float breath = 0.010 * sin(uTime * 0.6 + pos.y * 3.0 + pos.x * 2.0);
        breath += 0.007 * sin(uTime * 1.1 + pos.z * 4.0 + pos.y * 1.5);
        breath += 0.018 * uSeizure * sin(uTime * 7.0 + pos.x * 9.0 + pos.y * 7.0 + pos.z * 5.0);
        pos += n * breath;

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = normalize(mat3(modelMatrix) * n);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        vCortex = fbm3(pos * 7.0 + uTime * 0.08);
        vRidge = 1.0 - abs(2.0 * vnoise3(pos * 14.0 + uTime * 0.05) - 1.0);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uSeizure;
      uniform vec3 uFocal;
      uniform float uFocalRadius;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying float vCortex;
      varying float vRidge;
      ${GLSL_NOISE}
      void main(){
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        float ndv = max(dot(N, V), 0.0);
        float fres = pow(1.0 - ndv, 2.2);

        vec3 sulcus = vec3(0.008, 0.018, 0.12);
        vec3 midCortex = vec3(0.04, 0.06, 0.38);
        vec3 gyrus = vec3(0.08, 0.22, 0.72);
        vec3 body = mix(sulcus, midCortex, vCortex * 0.6);
        body = mix(body, gyrus, vRidge * 0.7);

        float energy = fbm3(vWorldPos * 2.2 + vec3(0.0, 0.0, uTime * 0.22));
        energy = smoothstep(0.52, 0.88, energy);
        vec3 energyCol = mix(vec3(0.12, 0.45, 1.0), vec3(0.45, 0.25, 1.0), energy);
        body += energyCol * energy * 0.28;

        vec3 col = body;

        float sss = pow(max(dot(-N, V), 0.0), 2.8);
        col += vec3(0.28, 0.12, 0.55) * sss * 0.9;

        vec3 L = normalize(vec3(0.3, 0.7, 0.5));
        vec3 H = normalize(L + V);
        float spec = pow(max(dot(N, H), 0.0), 35.0);
        col += vec3(0.55, 0.75, 1.0) * spec * 0.7;

        vec3 rimHealthy = mix(vec3(0.15, 0.70, 1.0), vec3(0.50, 0.30, 1.0), 0.4);
        vec3 rimSeizure = mix(vec3(0.95, 0.60, 1.0), vec3(1.0, 0.35, 0.85), 0.5);
        vec3 rim = mix(rimHealthy, rimSeizure, uSeizure);
        col += rim * pow(fres, 1.4) * (0.8 + 0.3 * sin(uTime * 0.6));

        float dCenter = distance(vWorldPos, vec3(0.0, 0.0, 0.08));
        float hotzone = smoothstep(0.72, 0.0, dCenter);
        col += mix(vec3(0.55, 0.25, 0.05), vec3(0.9, 0.55, 0.05), hotzone) * hotzone * 1.4;
        col += vec3(1.0, 0.85, 0.4) * pow(hotzone, 3.0) * 1.8;

        float d = distance(vWorldPos, uFocal);
        float focal = smoothstep(uFocalRadius, 0.0, d) * uSeizure;
        col += vec3(0.6, 0.85, 1.0) * focal * 2.2;
        col += vec3(1.0, 0.9, 1.0) * pow(focal, 2.0) * 1.6;

        col = mix(col, col * vec3(1.4, 1.2, 1.6) + vec3(0.10, 0.05, 0.22), uSeizure * 0.55);

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    transparent: false,
  });
}

/* ---------- Shared brain state (mutable, passed by ref) ---------- */
function createBrainState() {
  return {
    time: 0,
    seizure: 0,
    phase: 'healthy',
    focal: new THREE.Vector3(0.4, 0.2, 0.3),
    focalRadius: 0.9,
  };
}

/* ---------- Seizure cycle controller ----------
   Only change from the original: onset focal points now prefer
   state.corticalFocalPool (cerebrum-only samples) when available,
   falling back to the full pool otherwise. Everything else unmodified. */
function SeizureController({ state, mode }) {
  const cycle = useRef({ phase: 'healthy', t: 0, focal: new THREE.Vector3(0.4, 0.2, 0.3) });
  return useFrame((root, dt) => {
    const c = cycle.current;
    c.t += dt;
    if (mode.current === 'on') {
      state.seizure = Math.min(1, state.seizure + dt * 1.5);
      state.phase = 'spread';
    } else if (mode.current === 'off') {
      state.seizure = Math.max(0, state.seizure - dt * 0.8);
      state.phase = 'healthy';
    } else {
      if (c.phase === 'healthy') {
        state.seizure = Math.max(0, state.seizure - dt * 0.6);
        state.phase = 'healthy';
        if (c.t > 15) {
          c.phase = 'onset'; c.t = 0;
          const pool = state.corticalFocalPool && state.corticalFocalPool.length
            ? state.corticalFocalPool
            : state.focalPool;
          if (pool && pool.length) {
            const p = pool[(Math.random() * pool.length) | 0];
            c.focal.copy(p);
          }
        }
      } else if (c.phase === 'onset') {
        state.seizure = Math.min(1, state.seizure + dt * 1.3);
        state.phase = 'onset';
        if (c.t > 1.1) { c.phase = 'spread'; c.t = 0; }
      } else if (c.phase === 'spread') {
        state.seizure = 0.82 + 0.18 * Math.sin(c.t * 3.5);
        state.phase = 'spread';
        if (c.t > 4.8) { c.phase = 'recovery'; c.t = 0; }
      } else if (c.phase === 'recovery') {
        state.seizure = Math.max(0, state.seizure - dt * 0.42);
        state.phase = 'recovery';
        if (c.t > 3.6) { c.phase = 'healthy'; c.t = 0; }
      }
    }
    state.focal.copy(c.focal);
    state.time = root.clock.elapsedTime;
  });
}

/* ---------- Original procedural tissue mesh (UNMODIFIED, kept intact, unused by Scene) ---------- */
function BrainTissue({ state }) {
  const cerebrum = useMemo(() => buildCerebrumGeometry(40), []);
  const cerebellum = useMemo(() => buildCerebellumGeometry(16), []);
  const mat = useMemo(() => createTissueMaterial(), []);
  useFrame(() => {
    mat.uniforms.uTime.value = state.time;
    mat.uniforms.uSeizure.value = state.seizure;
    mat.uniforms.uFocal.value.copy(state.focal);
  });
  return (
    <group>
      <mesh geometry={cerebrum} material={mat} />
      <mesh geometry={cerebellum} material={mat} position={[0, -0.62, -0.32]} />
    </group>
  );
}

/* ---------- NEW: GLB-driven tissue mesh ----------
   Drives the same createTissueMaterial() shader instance (shared across all
   three meshes, exactly like the original two-mesh setup) against the
   normalized GLB geometry instead of procedural geometry. */
function GLBBrainTissue({ state, wrapper, sharedMaterial }) {
  useFrame(() => {
    sharedMaterial.uniforms.uTime.value = state.time;
    sharedMaterial.uniforms.uSeizure.value = state.seizure;
    sharedMaterial.uniforms.uFocal.value.copy(state.focal);
  });
  return <primitive object={wrapper} />;
}

/* ---------- Neurons (instanced glowing billboards) — UNMODIFIED ---------- */
const NEURON_COUNT = 2600;
function Neurons({ state, samples }) {
  const mesh = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.InstancedMesh(geo, undefined, NEURON_COUNT);
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;

    const aPhase = new Float32Array(NEURON_COUNT);
    const aFreq = new Float32Array(NEURON_COUNT);
    const aBase = new Float32Array(NEURON_COUNT);
    const aColor = new Float32Array(NEURON_COUNT * 3);
    const m = new THREE.Matrix4();
    const col = new THREE.Color();
    const palette = [
      new THREE.Color(0.25, 0.85, 1.0),
      new THREE.Color(0.35, 0.55, 1.0),
      new THREE.Color(0.55, 0.40, 1.0),
      new THREE.Color(0.85, 0.95, 1.0),
    ];
    for (let i = 0; i < NEURON_COUNT; i++) {
      const s = samples[i];
      m.makeTranslation(s.pos.x, s.pos.y, s.pos.z);
      mesh.setMatrixAt(i, m);
      aPhase[i] = Math.random() * Math.PI * 2;
      aFreq[i] = 0.6 + Math.random() * 2.4;
      aBase[i] = 0.5 + Math.random() * 0.7;
      const p = palette[(Math.random() * palette.length) | 0];
      col.copy(p).offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
      aColor[i * 3] = col.r; aColor[i * 3 + 1] = col.g; aColor[i * 3 + 2] = col.b;
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(aPhase, 1));
    mesh.geometry.setAttribute('aFreq', new THREE.InstancedBufferAttribute(aFreq, 1));
    mesh.geometry.setAttribute('aBase', new THREE.InstancedBufferAttribute(aBase, 1));
    mesh.geometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(aColor, 3));
    mesh.geometry.setAttribute('aPos', new THREE.InstancedBufferAttribute(
      Float32Array.from(samples.flatMap(s => [s.pos.x, s.pos.y, s.pos.z])), 3
    ));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSeizure: { value: 0 },
        uFocal: { value: new THREE.Vector3() },
        uFocalRadius: { value: 0.9 },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uSeizure;
        uniform vec3 uFocal;
        uniform float uFocalRadius;
        attribute float aPhase;
        attribute float aFreq;
        attribute float aBase;
        attribute vec3 aColor;
        attribute vec3 aPos;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vIntensity;
        void main(){
          vec3 center = (instanceMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;
          vec3 worldCenter = (modelMatrix * vec4(center, 1.0)).xyz;
          float distToFocal = distance(worldCenter, uFocal);
          float sync = smoothstep(uFocalRadius, 0.0, distToFocal) * uSeizure;

          float indivPulse = 0.5 + 0.5 * sin(uTime * aFreq + aPhase);
          float syncPulse = 0.5 + 0.5 * sin(uTime * 4.0);
          float pulse = mix(indivPulse, syncPulse, sync);
          float spike = pow(0.5 + 0.5 * sin(uTime * aFreq * 2.3 + aPhase * 1.7), 10.0);
          float intensity = aBase * (0.25 + 0.75 * pulse) + 0.9 * spike;
          intensity *= (1.0 + uSeizure * 1.1 + sync * 1.6);
          vIntensity = intensity;

          vec3 baseCol = aColor;
          vec3 col = mix(baseCol, vec3(1.0, 0.7, 1.0), uSeizure * 0.5);
          col = mix(col, vec3(1.0), sync * 0.6);
          vColor = col;

          float size = 0.018 * (0.45 + intensity * 0.9);
          vec4 viewPos = viewMatrix * modelMatrix * vec4(center, 1.0);
          viewPos.xy += position.xy * size;
          vUv = position.xy;
          gl_Position = projectionMatrix * viewPos;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vIntensity;
        void main(){
          float d = length(vUv) * 2.0;
          float glow = smoothstep(1.0, 0.0, d);
          glow = pow(glow, 1.8);
          float core = smoothstep(0.35, 0.0, d);
          vec3 col = vColor * glow * vIntensity + vec3(1.0) * core * vIntensity * 0.9;
          float alpha = glow * vIntensity;
          if(alpha < 0.01) discard;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    mesh.material = material;
    return mesh;
  }, [samples]);

  useFrame(() => {
    const m = mesh.material;
    m.uniforms.uTime.value = state.time;
    m.uniforms.uSeizure.value = state.seizure;
    m.uniforms.uFocal.value.copy(state.focal);
  });

  return <primitive object={mesh} />;
}

/* ---------- Neural fibres (static network) + path data — UNMODIFIED ---------- */
const FIBRE_COUNT = 240;
function buildFibres(neuronPositions) {
  const fibres = [];
  const cell = 0.35;
  const grid = new Map();
  const key = (x, y, z) => `${(x / cell) | 0}_${(y / cell) | 0}_${(z / cell) | 0}`;
  neuronPositions.forEach((p, i) => {
    const k = key(p.x, p.y, p.z);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(i);
  });
  const neighbours = (p, out) => {
    out.length = 0;
    const cx = (p.x / cell) | 0, cy = (p.y / cell) | 0, cz = (p.z / cell) | 0;
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const arr = grid.get(`${cx + dx}_${cy + dy}_${cz + dz}`);
          if (arr) for (const i of arr) out.push(i);
        }
  };
  const nb = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), mid = new THREE.Vector3(), ctrl = new THREE.Vector3(), n = new THREE.Vector3(), p = new THREE.Vector3();
  const M = 22;
  for (let f = 0; f < FIBRE_COUNT; f++) {
    const i = (Math.random() * neuronPositions.length) | 0;
    a.copy(neuronPositions[i]);
    neighbours(a, nb);
    if (nb.length < 2) { f--; continue; }
    let j = -1, tries = 0;
    while (tries++ < 8) {
      const cand = nb[(Math.random() * nb.length) | 0];
      if (cand === i) continue;
      b.copy(neuronPositions[cand]);
      const d = a.distanceTo(b);
      if (d > 0.15 && d < 0.8) { j = cand; break; }
    }
    if (j < 0) { f--; continue; }
    mid.copy(a).add(b).multiplyScalar(0.5);
    n.copy(mid).normalize();
    ctrl.copy(mid).addScaledVector(n, 0.08 + Math.random() * 0.06);
    const pts = [];
    for (let s = 0; s <= M; s++) {
      const t = s / M;
      const u = 1 - t;
      p.set(
        u * u * a.x + 2 * u * t * ctrl.x + t * t * b.x,
        u * u * a.y + 2 * u * t * ctrl.y + t * t * b.y,
        u * u * a.z + 2 * u * t * ctrl.z + t * t * b.z
      );
      pts.push(p.clone());
    }
    fibres.push(pts);
  }
  const segCount = fibres.reduce((s, ff) => s + (ff.length - 1), 0);
  const positions = new Float32Array(segCount * 2 * 3);
  const colors = new Float32Array(segCount * 2 * 3);
  let vi = 0;
  for (const ff of fibres) {
    for (let s = 0; s < ff.length - 1; s++) {
      positions[vi * 3] = ff[s].x; positions[vi * 3 + 1] = ff[s].y; positions[vi * 3 + 2] = ff[s].z;
      colors[vi * 3] = 0.15; colors[vi * 3 + 1] = 0.35; colors[vi * 3 + 2] = 0.75;
      vi++;
      positions[vi * 3] = ff[s + 1].x; positions[vi * 3 + 1] = ff[s + 1].y; positions[vi * 3 + 2] = ff[s + 1].z;
      colors[vi * 3] = 0.15; colors[vi * 3 + 1] = 0.35; colors[vi * 3 + 2] = 0.75;
      vi++;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(geo, mat);
  return { lines, fibres };
}

function Fibres({ state, fibresRef }) {
  const { lines } = fibresRef.current;
  useFrame(() => {
    lines.material.opacity = 0.28 + 0.18 * state.seizure + 0.06 * Math.sin(state.time * 0.7);
  });
  return <primitive object={lines} />;
}

/* ---------- Electrical impulses (the hero) — UNMODIFIED ---------- */
const MAX_IMPULSES = 180;
const TRAIL_LEN = 20;

function Impulses({ state, fibresRef }) {
  const { fibres } = fibresRef.current;

  const objects = useMemo(() => {
    const headGeo = new THREE.BufferGeometry();
    const headPos = new Float32Array(MAX_IMPULSES * 3);
    const headSize = new Float32Array(MAX_IMPULSES);
    const headColor = new Float32Array(MAX_IMPULSES * 3);
    const headAlpha = new Float32Array(MAX_IMPULSES);
    headGeo.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
    headGeo.setAttribute('aSize', new THREE.BufferAttribute(headSize, 1));
    headGeo.setAttribute('aColor', new THREE.BufferAttribute(headColor, 3));
    headGeo.setAttribute('aAlpha', new THREE.BufferAttribute(headAlpha, 1));
    const headMat = new THREE.ShaderMaterial({
      uniforms: { uPixel: { value: 1 } },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aAlpha;
        varying vec3 vColor;
        varying float vAlpha;
        void main(){
          vColor = aColor;
          vAlpha = aAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (320.0 / max(-mv.z, 0.1));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float glow = smoothstep(0.5, 0.0, d);
          glow = pow(glow, 1.5);
          float core = smoothstep(0.16, 0.0, d);
          vec3 col = vColor * glow + vec3(1.0) * core;
          gl_FragColor = vec4(col, glow * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const heads = new THREE.Points(headGeo, headMat);
    heads.frustumCulled = false;

    const segPerImpulse = TRAIL_LEN - 1;
    const totalSeg = MAX_IMPULSES * segPerImpulse;
    const trailPos = new Float32Array(totalSeg * 2 * 3);
    const trailCol = new Float32Array(totalSeg * 2 * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
    const trailMat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        attribute vec3 color;
        varying vec3 vColor;
        void main(){
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        void main(){
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    const trails = new THREE.LineSegments(trailGeo, trailMat);
    trails.frustumCulled = false;

    const pool = [];
    for (let i = 0; i < MAX_IMPULSES; i++) {
      pool.push({
        active: false,
        fibre: 0,
        t: 0,
        speed: 0.1,
        intensity: 1,
        life: 0,
        maxLife: 4,
        seed: Math.random(),
        trail: new Float32Array(TRAIL_LEN * 3),
        head: 0,
        headPos: new THREE.Vector3(),
      });
      pool[i].trail.fill(0);
    }
    return { heads, trails, headGeo, trailGeo, pool, headPos, headSize, headColor, headAlpha, trailPos, trailCol };
  }, [fibres]);

  const scratch = useMemo(() => ({
    p: new THREE.Vector3(),
    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
    headCol: new THREE.Color(),
    tailCol: new THREE.Color(),
    seizureCol: new THREE.Color(0.85, 0.25, 0.95),
  }), []);

  const fibreStarts = useMemo(() => fibres.map(f => f[0]), [fibres]);
  const nearestFibre = (pt) => {
    let best = 0, bd = Infinity;
    for (let i = 0; i < fibreStarts.length; i++) {
      const d = fibreStarts[i].distanceToSquared(pt);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  };

  const sampleFibre = (fibre, t, out) => {
    const M = fibre.length - 1;
    const idx = t * M;
    let i0 = Math.floor(idx);
    if (i0 < 0) i0 = 0;
    if (i0 >= M) i0 = M - 1;
    const frac = idx - i0;
    const a = fibre[i0], b = fibre[i0 + 1];
    out.x = a.x + (b.x - a.x) * frac;
    out.y = a.y + (b.y - a.y) * frac;
    out.z = a.z + (b.z - a.z) * frac;
    return out;
  };

  const spawnTimer = useRef(0);

  useFrame((root, dt) => {
    const seizure = state.seizure;
    const time = state.time;
    const { heads, headGeo, trailGeo, pool, headPos, headSize, headColor, headAlpha, trailPos, trailCol } = objects;

    const targetActive = Math.floor(55 + seizure * 110);
    spawnTimer.current -= dt;
    const cadence = 0.05 - seizure * 0.038;
    if (spawnTimer.current <= 0) {
      spawnTimer.current = Math.max(0.008, cadence);
      const burst = 1 + ((Math.random() * 2) | 0);
      for (let k = 0; k < burst; k++) {
        let active = 0;
        for (let i = 0; i < MAX_IMPULSES; i++) if (pool[i].active) active++;
        if (active >= targetActive) break;
        let idx = -1;
        for (let i = 0; i < MAX_IMPULSES; i++) {
          if (!pool[i].active) { idx = i; break; }
        }
        if (idx < 0) break;
        const imp = pool[idx];
        imp.active = true;
        if (seizure > 0.4 && Math.random() < 0.6) {
          imp.fibre = nearestFibre(state.focal);
        } else {
          imp.fibre = (Math.random() * fibres.length) | 0;
        }
        imp.t = 0;
        imp.speed = (0.08 + Math.random() * 0.12) * (1 + seizure * 1.6);
        imp.intensity = 0.7 + Math.random() * 0.5;
        imp.maxLife = 2.5 + Math.random() * 3.5;
        imp.life = 0;
        imp.seed = Math.random();
        sampleFibre(fibres[imp.fibre], 0, imp.headPos);
        for (let s = 0; s < TRAIL_LEN; s++) {
          imp.trail[s * 3] = imp.headPos.x;
          imp.trail[s * 3 + 1] = imp.headPos.y;
          imp.trail[s * 3 + 2] = imp.headPos.z;
        }
        imp.head = 0;
      }
    }

    for (let i = 0; i < MAX_IMPULSES; i++) {
      const imp = pool[i];
      if (!imp.active) {
        headSize[i] = 0;
        headAlpha[i] = 0;
        continue;
      }
      imp.life += dt;
      imp.t += imp.speed * dt;
      if (imp.t >= 1) {
        const endPt = fibres[imp.fibre][fibres[imp.fibre].length - 1];
        if (Math.random() < 0.55 + seizure * 0.3) {
          imp.fibre = nearestFibre(endPt);
          imp.t = 0;
          imp.speed *= 0.9 + Math.random() * 0.4;
          if (Math.random() < 0.25 + seizure * 0.35) {
            for (let j = 0; j < MAX_IMPULSES; j++) {
              if (!pool[j].active) {
                const sib = pool[j];
                sib.active = true;
                sib.fibre = nearestFibre(endPt);
                sib.t = 0;
                sib.speed = imp.speed * (0.8 + Math.random() * 0.5);
                sib.intensity = imp.intensity * 0.9;
                sib.maxLife = imp.maxLife;
                sib.life = 0;
                sib.seed = Math.random();
                sampleFibre(fibres[sib.fibre], 0, sib.headPos);
                for (let s = 0; s < TRAIL_LEN; s++) {
                  sib.trail[s * 3] = sib.headPos.x;
                  sib.trail[s * 3 + 1] = sib.headPos.y;
                  sib.trail[s * 3 + 2] = sib.headPos.z;
                }
                sib.head = 0;
                break;
              }
            }
          }
        } else {
          imp.active = false;
          headSize[i] = 0;
          headAlpha[i] = 0;
          continue;
        }
      }
      const lifeFade = imp.life > imp.maxLife - 0.6 ? Math.max(0, (imp.maxLife - imp.life) / 0.6) : 1;
      if (imp.life > imp.maxLife) {
        imp.active = false;
        headSize[i] = 0;
        headAlpha[i] = 0;
        continue;
      }

      sampleFibre(fibres[imp.fibre], imp.t, imp.headPos);
      imp.head = (imp.head + 1) % TRAIL_LEN;
      imp.trail[imp.head * 3] = imp.headPos.x;
      imp.trail[imp.head * 3 + 1] = imp.headPos.y;
      imp.trail[imp.head * 3 + 2] = imp.headPos.z;

      headPos[i * 3] = imp.headPos.x;
      headPos[i * 3 + 1] = imp.headPos.y;
      headPos[i * 3 + 2] = imp.headPos.z;
      headSize[i] = (0.07 + seizure * 0.06) * imp.intensity * lifeFade;
      headAlpha[i] = lifeFade;

      const h = scratch.headCol.setRGB(
        0.95 + seizure * 0.05,
        1.0 - seizure * 0.2,
        1.0
      );
      headColor[i * 3] = h.r;
      headColor[i * 3 + 1] = h.g;
      headColor[i * 3 + 2] = h.b;

      const segPerImpulse = TRAIL_LEN - 1;
      const base = i * segPerImpulse * 2;
      const oldest = (imp.head + 1) % TRAIL_LEN;
      scratch.tailCol.setRGB(0.25, 0.45, 1.0);
      scratch.tailCol.lerp(scratch.seizureCol, seizure);
      for (let s = 0; s < segPerImpulse; s++) {
        const ai = (oldest + s) % TRAIL_LEN;
        const bi = (oldest + s + 1) % TRAIL_LEN;
        const segBase = (base + s * 2) * 3;
        trailPos[segBase] = imp.trail[ai * 3];
        trailPos[segBase + 1] = imp.trail[ai * 3 + 1];
        trailPos[segBase + 2] = imp.trail[ai * 3 + 2];
        trailPos[segBase + 3] = imp.trail[bi * 3];
        trailPos[segBase + 4] = imp.trail[bi * 3 + 1];
        trailPos[segBase + 5] = imp.trail[bi * 3 + 2];
        const f = s / (segPerImpulse - 1);
        const fade = Math.pow(f, 1.3) * imp.intensity * lifeFade;
        const r = scratch.tailCol.r + (1.0 - scratch.tailCol.r) * fade;
        const g = scratch.tailCol.g + (1.0 - scratch.tailCol.g) * fade;
        const b = scratch.tailCol.b + (1.0 - scratch.tailCol.b) * fade;
        const bright = fade * (0.9 + seizure * 0.6);
        trailCol[segBase] = r * bright;
        trailCol[segBase + 1] = g * bright;
        trailCol[segBase + 2] = b * bright;
        trailCol[segBase + 3] = r * bright;
        trailCol[segBase + 4] = g * bright;
        trailCol[segBase + 5] = b * bright;
      }
    }

    headGeo.attributes.position.needsUpdate = true;
    headGeo.attributes.aSize.needsUpdate = true;
    headGeo.attributes.aColor.needsUpdate = true;
    headGeo.attributes.aAlpha.needsUpdate = true;
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;
  });

  return (
    <group>
      <primitive object={objects.trails} />
      <primitive object={objects.heads} />
    </group>
  );
}

/* ---------- Faint background starfield — UNMODIFIED ---------- */
function Starfield() {
  const points = useMemo(() => {
    const N = 700;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 12 + Math.random() * 8;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(0.4, 0.55, 0.9),
      size: 0.04,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geo, mat);
  }, []);
  useFrame((_, dt) => { points.rotation.y += dt * 0.01; });
  return <primitive object={points} />;
}

/* ---------- Cinematic camera rig — MODIFIED to accept offset ---------- */
function CameraRig({ brainOffsetY = 0 }) {
  useFrame((root) => {
    const t = root.clock.elapsedTime;
    const angle = t * 0.07;
    const cam = root.camera;
    cam.position.x = Math.sin(angle) * 3.3;
    cam.position.z = Math.cos(angle) * 3.3;
    cam.position.y = 0.25 + Math.sin(t * 0.28) * 0.18;
    cam.lookAt(0, -0.05 + brainOffsetY, 0);
  });
  return null;
}

/* ---------- Scene contents (now GLB-driven) — MODIFIED to accept offset and group brain ---------- */
function Scene({ state, mode, glbUrl, brainOffsetY = 0 }) {
  const fibresRef = useRef(null);
  const gltf = useLoader(GLTFLoader, glbUrl);
  const sharedMaterial = useMemo(() => createTissueMaterial(), []);

  const { wrapper, cerebrumMesh, cerebellumMeshes } = useMemo(() => {
    const wrapper = centerAndNormalizeGLB(gltf.scene, 2.1);
    const { meshes, cerebrumMesh, cerebellumMeshes } = classifyGLBMeshes(wrapper);
    meshes.forEach((m) => {
      m.material = sharedMaterial;
      m.frustumCulled = false;
      m.castShadow = false;
      m.receiveShadow = false;
    });
    return { wrapper, cerebrumMesh, cerebellumMeshes };
  }, [gltf, sharedMaterial]);

  const samples = useMemo(() => {
    const allMeshes = [cerebrumMesh, ...cerebellumMeshes].filter(Boolean);
    if (allMeshes.length === 0) return [];
    const areas = allMeshes.map((m) => computeMeshArea(m));
    const totalArea = areas.reduce((a, b) => a + b, 0) || 1;
    const counts = areas.map((a) => Math.floor((a / totalArea) * NEURON_COUNT));
    const allocated = counts.reduce((a, b) => a + b, 0);
    counts[counts.length - 1] += NEURON_COUNT - allocated;

    let combined = [];
    allMeshes.forEach((mesh, i) => {
      const region = mesh === cerebrumMesh ? 'cerebrum' : 'cerebellum';
      const pts = sampleMeshSurfaceAreaWeighted(mesh, counts[i], i * 7919 + 11, region);
      combined = combined.concat(pts);
    });
    return combined;
  }, [cerebrumMesh, cerebellumMeshes]);

  const neuronPositions = useMemo(() => samples.map((s) => s.pos.clone()), [samples]);
  const corticalPositions = useMemo(
    () => samples.filter((s) => s.region === 'cerebrum').map((s) => s.pos),
    [samples]
  );

  useMemo(() => {
    fibresRef.current = buildFibres(neuronPositions);
  }, [neuronPositions]);

  useLayoutEffect(() => {
    state.focalPool = neuronPositions;
    state.corticalFocalPool = corticalPositions.length ? corticalPositions : neuronPositions;
  }, [neuronPositions, corticalPositions, state]);

  return (
    <>
      <SeizureController state={state} mode={mode} />
      <CameraRig brainOffsetY={brainOffsetY} />
      <ambientLight intensity={0.2} />
      <group position={[0, brainOffsetY, 0]}>
        <GLBBrainTissue state={state} wrapper={wrapper} sharedMaterial={sharedMaterial} />
        <Neurons state={state} samples={samples} />
        <Fibres state={state} fibresRef={fibresRef} />
        <Impulses state={state} fibresRef={fibresRef} />
      </group>
      <Starfield />
    </>
  );
}

/* ---------- Main exported component — MODIFIED with mode prop and layout ---------- */
export default function Brain3D({ 
  seizureMode = 'auto', 
  glbUrl = '/models/brain.glb',
  mode = 'hero' // 'hero' | 'widget'
}) {
  const state = useRef(null);
  if (!state.current) state.current = createBrainState();
  const seizureModeRef = useRef(seizureMode);
  seizureModeRef.current = seizureMode;

  // Layout configuration for different modes
  const layout = {
  hero: {
    brainOffsetY: 0,
    badgeTop: '5%',
  },
  widget: {
    brainOffsetY: -0.9,        // move brain further down (previously -0.25)
    badgeTop: '2%',            // keep badge slightly lower for visual balance
  },
};

  const currentLayout = layout[mode] || layout.hero;

  const badgeRef = useRef(null);
  useLayoutEffect(() => {
    let raf;
    const tick = () => {
      if (badgeRef.current && state.current) {
        const s = state.current;
        const phase = s.phase;
        let text, color;
        if (s.seizure > 0.15 && (phase === 'onset' || phase === 'spread')) {
          text = 'SEIZURE ACTIVITY';
          color = 'rgba(255,120,200,0.9)';
        } else if (phase === 'recovery') {
          text = 'POST-ICTAL RECOVERY';
          color = 'rgba(160,200,255,0.85)';
        } else {
          text = 'HEALTHY ACTIVITY';
          color = 'rgba(120,230,255,0.9)';
        }
        badgeRef.current.textContent = text;
        badgeRef.current.style.color = color;
        badgeRef.current.style.borderColor = color;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'transparent',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.25, 3.3], fov: 45, near: 0.1, far: 100 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <Scene 
            state={state.current} 
            mode={seizureModeRef} 
            glbUrl={glbUrl}
            brainOffsetY={currentLayout.brainOffsetY}
          />
        </Suspense>

        <Composer
          bloomOptions={{ intensity: 0.9, luminanceThreshold: 0.15, luminanceSmoothing: 0.4, mipmapBlur: true }}
          vignetteOptions={{ eskil: false, offset: 0.25, darkness: 0.65 }}
        />
      </Canvas>

      <div
        ref={badgeRef}
        style={{
          position: 'absolute',
          top: currentLayout.badgeTop,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '12px',
          letterSpacing: '0.28em',
          padding: '7px 18px',
          border: '1px solid rgba(120,230,255,0.5)',
          borderRadius: '999px',
          background: 'rgba(8,12,32,0.45)',
          backdropFilter: 'blur(6px)',
          color: 'rgba(120,230,255,0.9)',
          textShadow: '0 0 12px currentColor',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        //HEALTHY ACTIVITY
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontWeight: 600,
          fontSize: 'clamp(20px, 3.4vw, 38px)',
          letterSpacing: '0.06em',
          color: 'rgba(225,235,255,0.95)',
          textShadow: '0 0 24px rgba(80,160,255,0.45)',
        }}>
        </div>
        <div style={{
          marginTop: '6px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 'clamp(9px, 1.1vw, 12px)',
          letterSpacing: '0.32em',
          color: 'rgba(150,180,230,0.7)',
        }}>
        </div>
      </div>
    </div>
  );
}