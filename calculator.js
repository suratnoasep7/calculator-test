/**
 * calculator.js
 * ─────────────────────────────────────────────────────────
 * CLT Panel Properties Calculator — Main UI Controller
 * Menggunakan Bootstrap 5 + vanilla JS
 * ─────────────────────────────────────────────────────────
 */

// ══════════════════════════════════════════════════════════
// APP STATE
// ══════════════════════════════════════════════════════════
const AppState = {
  method: 'shear_analogy',
  layers: [],
};

// ══════════════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  buildLayout();
  fillGradeTable();
  initLayers(5);
  renderAll();
});

// ══════════════════════════════════════════════════════════
// LAYER STATE MANAGEMENT
// ══════════════════════════════════════════════════════════
function initLayers(n, keepExisting = false) {
  if (!keepExisting) {
    AppState.layers = Array.from({ length: n }, (_, i) => ({
      thickness: 35,
      grade: 'MGP10',
      orientation: i % 2 === 0 ? 0 : 90,
    }));
    return;
  }
  while (AppState.layers.length < n) {
    const i = AppState.layers.length;
    AppState.layers.push({
      thickness: 35,
      grade: AppState.layers[0]?.grade || 'MGP10',
      orientation: i % 2 === 0 ? 0 : 90,
    });
  }
  AppState.layers = AppState.layers.slice(0, n);
}

// ══════════════════════════════════════════════════════════
// BUILD HTML LAYOUT
// ══════════════════════════════════════════════════════════
function buildLayout() {
  document.querySelector('.container-fluid').innerHTML = `

    <!-- HEADER -->
    <header class="clt-header">
      <div class="clt-header-inner">
        <div class="clt-logo">
          <div class="clt-woodmark">
            <span style="height:28px"></span>
            <span style="height:20px;background:#C8783A"></span>
            <span style="height:24px;background:#F5C842"></span>
            <span style="height:18px;background:#C8783A"></span>
            <span style="height:28px"></span>
          </div>
          <div>
            <div class="clt-logo-title">CLT Panel Properties</div>
            <div class="clt-logo-sub">Cross-Laminated Timber · AS 1720</div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <span class="clt-badge">SHEAR ANALOGY</span>
          <span class="clt-badge">GAMMA METHOD</span>
        </div>
      </div>
    </header>

    <!-- BODY: 2 column grid -->
    <div class="clt-body">

      <!-- ── LEFT: INPUT PANEL ── -->
      <aside class="clt-sidebar">

        <!-- 1. Metode -->
        <div class="clt-section">
          <div class="clt-eyebrow">Metode Analisis</div>
          <div class="clt-method-row">
            <div class="clt-mtab active" id="btn-shear" onclick="selectMethod('shear_analogy')">
              <div class="clt-mtab-name">Shear Analogy</div>
              <div class="clt-mtab-desc">3–9 layer · wajib simetris</div>
            </div>
            <div class="clt-mtab" id="btn-gamma" onclick="selectMethod('gamma')">
              <div class="clt-mtab-name">Gamma</div>
              <div class="clt-mtab-desc">Hanya 3 atau 5 layer</div>
            </div>
          </div>
        </div>

        <!-- 2. Jumlah Layer -->
        <div class="clt-section">
          <div class="clt-eyebrow">Jumlah Layer</div>
          <div class="clt-lc-row" id="lc-row"></div>
          <div class="clt-lc-note" id="lc-note"></div>
        </div>

        <!-- 3. Konfigurasi Layer -->
        <div class="clt-section">
          <div class="clt-eyebrow">Konfigurasi Layer</div>
          <table class="clt-layer-table w-100">
            <thead>
              <tr>
                <th style="width:34px">#</th>
                <th>Orientasi</th>
                <th style="width:80px">Tebal mm</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody id="layer-tbody"></tbody>
          </table>
        </div>

        <!-- 4. Grade Referensi -->
        <div class="clt-section">
          <details class="clt-grade-details">
            <summary>Referensi Grade Kayu</summary>
            <table class="clt-grade-table w-100 mt-2">
              <thead>
                <tr><th>Grade</th><th>E MPa</th><th>G MPa</th><th>fc</th><th>ft</th><th>fv</th></tr>
              </thead>
              <tbody id="grade-tbody"></tbody>
            </table>
          </details>
        </div>

        <!-- Error -->
        <div class="clt-section" id="err-wrap" style="display:none">
          <div class="clt-error-box" id="err-box">
            <div class="clt-error-title">⚠ Validasi Gagal</div>
            <div id="err-list"></div>
          </div>
        </div>

        <!-- Tombol Hitung -->
        <div class="clt-section">
          <button class="clt-calc-btn w-100" onclick="runCalc()">
            ▶ &nbsp;Hitung Properti Panel
          </button>
        </div>

      </aside>

      <!-- ── RIGHT: OUTPUT PANEL ── -->
      <main class="clt-main">

        <!-- Diagram -->
        <div class="clt-diagram-zone">
          <div class="clt-eyebrow mb-3">Diagram Potongan Melintang CLT</div>
          <div class="clt-diagram-card">
            <svg id="dsvg" style="display:block;width:100%"></svg>
            <div class="clt-dpills" id="dpills"></div>
          </div>
        </div>

        <!-- Hasil -->
        <div class="clt-results-zone" id="results-zone">
          <div class="clt-empty" id="res-empty">
            <div class="clt-empty-icon">🪵</div>
            <div class="clt-empty-text">Isi data layer lalu klik <strong>Hitung</strong> untuk melihat properti panel</div>
          </div>
          <div id="res-content" style="display:none"></div>
        </div>

      </main>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════
// RENDER ALL
// ══════════════════════════════════════════════════════════
function renderAll() {
  renderMethodTabs();
  renderLayerCountBtns();
  renderLayerRows();
  renderDiagram();
}

// ══════════════════════════════════════════════════════════
// METHOD TABS
// ══════════════════════════════════════════════════════════
function renderMethodTabs() {
  document.getElementById('btn-shear').classList.toggle('active', AppState.method === 'shear_analogy');
  document.getElementById('btn-gamma').classList.toggle('active', AppState.method === 'gamma');
}

function selectMethod(m) {
  AppState.method = m;
  if (m === 'gamma') {
    const n = AppState.layers.length;
    if (n !== 3 && n !== 5) initLayers(n <= 4 ? 3 : 5);
  }
  clearErr();
  hideRes();
  renderAll();
}

// ══════════════════════════════════════════════════════════
// LAYER COUNT BUTTONS
// ══════════════════════════════════════════════════════════
function renderLayerCountBtns() {
  const isGamma = AppState.method === 'gamma';
  const opts = isGamma ? [3, 5] : [3, 4, 5, 6, 7, 8, 9];
  const note = isGamma
    ? '⚠ Gamma: hanya 3 atau 5 layer yang diizinkan.'
    : '⚠ Shear Analogy: layup wajib simetris — layer 1 harus sama dengan layer terakhir, dst.';

  document.getElementById('lc-row').innerHTML = opts
    .map(n => `<button class="clt-lc-btn ${AppState.layers.length === n ? 'active' : ''}"
        onclick="changeLayerCount(${n})">${n}</button>`)
    .join('');
  document.getElementById('lc-note').textContent = note;
}

function changeLayerCount(n) {
  initLayers(n, true);
  clearErr();
  hideRes();
  renderAll();
}

// ══════════════════════════════════════════════════════════
// LAYER ROWS
// ══════════════════════════════════════════════════════════
function renderLayerRows() {
  const grades = Object.keys(GradeLibrary);
  document.getElementById('layer-tbody').innerHTML = AppState.layers.map((l, i) => `
    <tr class="clt-layer-row">
      <td><div class="clt-lbadge">${i + 1}</div></td>
      <td>
        <select class="form-select form-select-sm clt-select"
          onchange="updateLayer(${i}, 'orientation', +this.value)">
          <option value="0"  ${l.orientation === 0  ? 'selected' : ''}>0°  →</option>
          <option value="90" ${l.orientation === 90 ? 'selected' : ''}>90° ↑</option>
        </select>
      </td>
      <td>
        <input type="number" min="10" max="300"
          class="form-control form-control-sm clt-input"
          value="${l.thickness}"
          onchange="updateLayer(${i}, 'thickness', +this.value)"
          style="width:68px">
      </td>
      <td>
        <select class="form-select form-select-sm clt-select"
          onchange="updateLayer(${i}, 'grade', this.value)">
          ${grades.map(g => `<option ${l.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

function updateLayer(i, field, val) {
  AppState.layers[i][field] = val;
  renderDiagram();
  hideRes();
}

// ══════════════════════════════════════════════════════════
// GRADE TABLE
// ══════════════════════════════════════════════════════════
function fillGradeTable() {
  // Called after buildLayout, so re-check DOM
  const el = document.getElementById('grade-tbody');
  if (!el) return;
  el.innerHTML = Object.entries(GradeLibrary).map(([g, v]) => `
    <tr>
      <td class="fw-bold" style="color:#A85E28">${g}</td>
      <td>${v.E}</td><td>${v.G}</td>
      <td>${v.fc}</td><td>${v.ft}</td><td>${v.fv}</td>
    </tr>
  `).join('');
}

// ══════════════════════════════════════════════════════════
// SVG DIAGRAM
// ══════════════════════════════════════════════════════════
const WOODS = [
  { base: '#C8783A', grain: '#D4904A', dark: '#8B4A1A' },
  { base: '#8DAF7A', grain: '#A0C08A', dark: '#4A6F3A' },
  { base: '#B8924A', grain: '#CAA45A', dark: '#785218' },
  { base: '#7A9FAF', grain: '#9AB8C8', dark: '#3A5F6F' },
  { base: '#C4A060', grain: '#D4B070', dark: '#846020' },
];

function renderDiagram() {
  const layers = AppState.layers;
  const total  = layers.reduce((s, l) => s + l.thickness, 0);
  const svgEl  = document.getElementById('dsvg');
  if (!svgEl) return;

  const W  = Math.max(300, svgEl.parentElement.clientWidth - 40);
  const pL = 52, pR = 52, pT = 12, pB = 8;
  const dW = W - pL - pR;
  const dH = 180;
  const H  = dH + pT + pB;

  svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svgEl.setAttribute('height', H);

  // Tick marks
  let cum = 0;
  const ticks = [{ v: 0, y: pT }];
  layers.forEach(l => {
    cum += l.thickness;
    ticks.push({ v: cum, y: pT + (cum / total) * dH });
  });
  const tickSVG = ticks.map(t => `
    <line x1="${pL - 7}" y1="${t.y}" x2="${pL}" y2="${t.y}" stroke="#C8B89A" stroke-width="1"/>
    <text x="${pL - 10}" y="${t.y + 3.5}" text-anchor="end" font-size="9"
      fill="#9B8260" font-family="IBM Plex Mono,monospace">${t.v}</text>
  `).join('');

  // Layer rects
  cum = 0;
  const layerSVG = layers.map((l, i) => {
    const y  = pT + (cum / total) * dH;
    const h  = (l.thickness / total) * dH;
    cum     += l.thickness;
    const w  = WOODS[i % WOODS.length];
    const isP = l.orientation === 0;
    const gid = `g${i}`;

    const grad = isP
      ? `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%"   stop-color="${w.grain}" stop-opacity="0.35"/>
           <stop offset="50%"  stop-color="${w.base}"/>
           <stop offset="100%" stop-color="${w.dark}"  stop-opacity="0.5"/>
         </linearGradient>`
      : `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0%"   stop-color="${w.dark}"  stop-opacity="0.4"/>
           <stop offset="50%"  stop-color="${w.base}"/>
           <stop offset="100%" stop-color="${w.dark}"  stop-opacity="0.4"/>
         </linearGradient>`;

    const grainN = isP ? Math.max(2, Math.floor(h / 8)) : Math.max(3, Math.floor(dW / 20));
    const grainLines = isP
      ? Array.from({ length: grainN }, (_, j) => {
          const gy = y + (j + 0.5) * (h / grainN);
          return `<path d="M ${pL+6} ${gy} Q ${pL+dW*0.5} ${gy-2} ${pL+dW-6} ${gy}"
            fill="none" stroke="${w.grain}" stroke-width="0.7" opacity="0.5"/>`;
        }).join('')
      : Array.from({ length: grainN }, (_, j) => {
          const gx = pL + (j + 0.5) * (dW / grainN);
          return `<line x1="${gx}" y1="${y+3}" x2="${gx}" y2="${y+h-3}"
            stroke="${w.grain}" stroke-width="0.8" opacity="0.45"/>`;
        }).join('');

    const arrowClr = isP ? '#FFF0D8' : '#D0F4F0';
    const arrow = isP
      ? `<line x1="${pL+dW*0.58}" y1="${y+h/2}" x2="${pL+dW*0.76}" y2="${y+h/2}"
           stroke="${arrowClr}" stroke-width="1.5"/>
         <polygon points="${pL+dW*0.76},${y+h/2-3.5} ${pL+dW*0.76+7},${y+h/2} ${pL+dW*0.76},${y+h/2+3.5}"
           fill="${arrowClr}"/>`
      : `<line x1="${pL+dW*0.68}" y1="${y+h/2+6}" x2="${pL+dW*0.68}" y2="${y+h/2-6}"
           stroke="${arrowClr}" stroke-width="1.5"/>
         <polygon points="${pL+dW*0.68-3.5},${y+h/2-6} ${pL+dW*0.68},${y+h/2-13} ${pL+dW*0.68+3.5},${y+h/2-6}"
           fill="${arrowClr}"/>`;

    const lblClr = isP ? '#FFE8B0' : '#C0EDE8';
    return `
      <defs>${grad}</defs>
      <rect x="${pL}" y="${y}" width="${dW}" height="${h}" fill="url(#${gid})"/>
      ${grainLines}
      <rect x="${pL}" y="${y}" width="${dW}" height="${h}" fill="none"
        stroke="rgba(0,0,0,0.18)" stroke-width="0.5"/>
      ${arrow}
      <text x="${pL+14}" y="${y+h/2+4}" font-size="10" font-weight="500"
        fill="${lblClr}" font-family="IBM Plex Mono,monospace" opacity="0.95">
        L${i + 1} · ${l.orientation}° · ${l.thickness}mm · ${l.grade}
      </text>
    `;
  }).join('');

  // Brace
  const bx = pL + dW + 10;
  const brace = `
    <line x1="${bx}" y1="${pT}" x2="${bx}" y2="${pT+dH}" stroke="#C8B89A" stroke-width="1.2"/>
    <line x1="${bx-4}" y1="${pT}" x2="${bx+4}" y2="${pT}" stroke="#C8B89A" stroke-width="1.2"/>
    <line x1="${bx-4}" y1="${pT+dH}" x2="${bx+4}" y2="${pT+dH}" stroke="#C8B89A" stroke-width="1.2"/>
    <text x="${bx+18}" y="${pT+dH/2+3}" font-size="9" fill="#6B5630"
      font-family="IBM Plex Mono,monospace" text-anchor="middle"
      transform="rotate(90,${bx+18},${pT+dH/2+3})">${total} mm</text>
  `;

  svgEl.innerHTML = `
    <rect x="${pL}" y="${pT}" width="${dW}" height="${dH}" fill="#221508" rx="2"/>
    ${layerSVG}
    <line x1="${pL}" y1="${pT}"    x2="${pL+dW}" y2="${pT}"    stroke="#22C55E" stroke-width="2.5"/>
    <line x1="${pL}" y1="${pT+dH}" x2="${pL+dW}" y2="${pT+dH}" stroke="#22C55E" stroke-width="2.5"/>
    <line x1="${pL}" y1="${pT}"    x2="${pL}"    y2="${pT+dH}" stroke="#6B5630" stroke-width="1"/>
    ${tickSVG}
    ${brace}
  `;

  // Pills
  document.getElementById('dpills').innerHTML = layers.map((l, i) =>
    `<span class="clt-dpill clt-dpill-${l.orientation}">L${i + 1}: ${l.orientation}° · ${l.thickness}mm</span>`
  ).join('');
}

// ══════════════════════════════════════════════════════════
// RUN CALCULATION
// ══════════════════════════════════════════════════════════
function runCalc() {
  clearErr();

  const layerObjs = AppState.layers.map((l, i) => {
    // GradeLibrary berisi instance MaterialGradeType
    // Ambil propertinya secara eksplisit agar CLTLayerType dapat semua field
    const grade = GradeLibrary[l.grade] || GradeLibrary['MGP10'];
    return new CLTLayerType({
      id:          i + 1,
      thickness:   l.thickness,
      grade:       l.grade,
      orientation: l.orientation,
      E:           grade.E,
      E90:         grade.E90,
      G:           grade.G,
      fc:          grade.fc,
      ft:          grade.ft,
      fv:          grade.fv,
    });
  });

  const errors = Validator.validate(layerObjs, AppState.method);
  if (errors.length) {
    showErr(errors);
    return;
  }

  const layup  = new CLTLayupType({ layers: layerObjs, method: AppState.method });
  const result = PanelProperties.calculate(layup);
  renderResults(result);
}

// ══════════════════════════════════════════════════════════
// RENDER RESULTS
// ══════════════════════════════════════════════════════════
function renderResults(r) {
  const isGamma = r.method === 'Gamma';

  const summaryRows = [
    { label: 'Total Ketebalan Panel',        value: r.totalThickness,          unit: 'mm',      primary: true  },
    { label: 'Sumbu Netral (dari atas)',      value: fmt2(r.neutralAxis),       unit: 'mm'                      },
    { label: 'Kekakuan Lentur EIeff',         value: sciN(r.EIeff),             unit: 'N·mm²',   primary: true  },
    { label: 'EIeff per lebar (1 m)',         value: sciN(r.EIeff),             unit: 'N·mm²/mm'                },
    { label: 'Kekakuan Aksial EAeff',         value: sciN(r.EAeff),             unit: 'N'                       },
    ...(r.GAeff != null
      ? [{ label: 'Kekakuan Geser GAeff', value: sciN(r.GAeff), unit: 'N' }]
      : []),
    { label: 'Modulus Penampang Atas (W)',    value: sciN(r.sectionModulusTop), unit: 'N·mm'                    },
    { label: 'Modulus Penampang Bawah (W)',   value: sciN(r.sectionModulusBot), unit: 'N·mm'                    },
  ];

  const cardHtml = `
    <div class="clt-stat-grid mb-4">
      ${summaryRows.map(c => `
        <div class="clt-stat-card ${c.primary ? 'primary' : ''}">
          <div class="clt-stat-label">${c.label}</div>
          <div class="clt-stat-value">${typeof c.value === 'number' ? c.value.toLocaleString('id-ID') : c.value}</div>
          <div class="clt-stat-unit">${c.unit}</div>
        </div>
      `).join('')}
    </div>
  `;

  const gammaHtml = isGamma && r.gammaFactors ? `
    <div class="mb-4">
      <div class="clt-section-title">Faktor Gamma (γ) — Layer 0°</div>
      <div class="d-flex flex-wrap gap-2 mb-2">
        ${r.gammaFactors.map(g => `
          <div class="clt-gpill">
            <div class="clt-gpill-lbl">Layer ${g.layerId}</div>
            <div class="clt-gpill-val">γ = ${g.gamma}</div>
          </div>`).join('')}
      </div>
      <div class="clt-note">γ = 1.0 → sambungan lem sempurna (fully composite)</div>
    </div>
  ` : '';

  const gammaColH = isGamma ? '<th>γ</th>' : '';
  const detailHtml = `
    <div class="clt-section-title mb-2">Detail Per Layer</div>
    <div class="table-responsive">
      <table class="table table-sm clt-detail-table">
        <thead>
          <tr>
            <th>#</th><th>Orient.</th><th>Tebal</th><th>Grade</th>
            <th>E MPa</th><th>zi mm</th><th>di mm</th>
            ${gammaColH}<th>Peran</th>
          </tr>
        </thead>
        <tbody>
          ${r.layerDetails.map((l, i) => `
            <tr>
              <td><div class="clt-lbadge">${l.id}</div></td>
              <td>${l.orientation}°</td>
              <td class="mono">${l.thickness}</td>
              <td><span class="clt-grade-chip">${l.grade}</span></td>
              <td class="mono">${l.E}</td>
              <td class="mono">${l.zi}</td>
              <td class="mono">${l.di}</td>
              ${isGamma ? `<td class="mono clt-gv">${l.gamma ?? '—'}</td>` : ''}
              <td class="${l.role.includes('Lentur') ? 'clt-role-b' : 'clt-role-c'}">${l.role}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('res-empty').style.display   = 'none';
  const rc = document.getElementById('res-content');
  rc.style.display = 'block';
  rc.innerHTML = `
    <div class="clt-method-tag mb-4">
      <span class="clt-method-dot"></span> Metode: ${r.method}
    </div>
    ${cardHtml}
    ${gammaHtml}
    ${detailHtml}
  `;
  rc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════
function hideRes() {
  document.getElementById('res-empty').style.display  = 'flex';
  document.getElementById('res-content').style.display = 'none';
}
function showErr(errs) {
  document.getElementById('err-wrap').style.display = 'block';
  document.getElementById('err-list').innerHTML = errs
    .map(e => `<div class="clt-err-item">• ${e}</div>`).join('');
}
function clearErr() {
  document.getElementById('err-wrap').style.display = 'none';
  document.getElementById('err-list').innerHTML = '';
}
function sciN(v) {
  if (typeof v !== 'number') return v;
  if (v >= 1e9) return (v / 1e9).toFixed(3) + ' ×10⁹';
  if (v >= 1e6) return (v / 1e6).toFixed(3) + ' ×10⁶';
  if (v >= 1e3) return (v / 1e3).toFixed(1) + ' ×10³';
  return v.toFixed(0);
}
function fmt2(v) { return typeof v === 'number' ? v.toFixed(2) : v; }

window.addEventListener('resize', renderDiagram);

// ══════════════════════════════════════════════════════════
// STYLES (injected at runtime — no extra CSS file needed)
// ══════════════════════════════════════════════════════════
function injectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif;
      background: #F5F0E8;
      background-image:
        linear-gradient(rgba(13,115,119,.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,115,119,.06) 1px, transparent 1px);
      background-size: 24px 24px;
      margin: 0;
    }
    .mono { font-family: 'IBM Plex Mono', monospace; }

    /* ── HEADER ── */
    .clt-header {
      background: #1C1408;
      position: sticky; top: 0; z-index: 200;
      box-shadow: 0 2px 16px rgba(0,0,0,.3);
    }
    .clt-header-inner {
      max-width: 100%;
      padding: 0 28px;
      height: 60px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .clt-logo        { display: flex; align-items: center; gap: 14px; }
    .clt-woodmark    { display: flex; gap: 3px; align-items: flex-end; }
    .clt-woodmark span {
      display: block; width: 8px; border-radius: 2px 2px 0 0;
      background: #D4820A;
    }
    .clt-logo-title  { font-family: 'DM Serif Display', serif; font-size: 20px; color: #F5F0E8; }
    .clt-logo-sub    { font-size: 10px; color: #6B5630; font-family: 'IBM Plex Mono', monospace; }
    .clt-badge {
      font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 600;
      letter-spacing: .1em; padding: 4px 10px; border-radius: 4px;
      border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.4);
    }

    /* ── LAYOUT ── */
    .clt-body {
      display: grid;
      grid-template-columns: 390px 1fr;
      min-height: calc(100vh - 60px);
    }

    /* ── SIDEBAR ── */
    .clt-sidebar {
      background: #fff;
      border-right: 2px solid #E3DBCB;
      display: flex; flex-direction: column;
      box-shadow: 2px 0 12px rgba(0,0,0,.05);
      overflow-y: auto;
    }
    .clt-section {
      padding: 18px 22px;
      border-bottom: 1px solid #EDE7D9;
    }
    .clt-eyebrow {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px; font-weight: 600;
      letter-spacing: .14em; text-transform: uppercase;
      color: #9B8260; margin-bottom: 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .clt-eyebrow::after {
      content: ''; flex: 1; height: 1px; background: #EDE7D9;
    }

    /* Method tabs */
    .clt-method-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .clt-mtab {
      padding: 12px 14px; border-radius: 8px;
      border: 1.5px solid #E3DBCB;
      background: #F5F0E8; cursor: pointer;
      transition: all .18s;
      border-left: 3px solid transparent;
    }
    .clt-mtab:hover { border-color: #0D7377; background: #E8F7F7; }
    .clt-mtab.active {
      border-color: #0D7377;
      border-left-color: #0D7377;
      background: #E8F7F7;
    }
    .clt-mtab-name {
      font-weight: 700; font-size: 13px; color: #1C1408; margin-bottom: 3px;
    }
    .clt-mtab.active .clt-mtab-name { color: #0D7377; }
    .clt-mtab-desc { font-size: 10px; color: #9B8260; line-height: 1.4; }

    /* Layer count */
    .clt-lc-row  { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
    .clt-lc-btn  {
      width: 38px; height: 38px; border-radius: 8px;
      border: 1.5px solid #E3DBCB; background: #F5F0E8;
      color: #6B5630; font-family: 'IBM Plex Mono', monospace;
      font-weight: 600; font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .15s;
    }
    .clt-lc-btn:hover { border-color: #0D7377; color: #0D7377; }
    .clt-lc-btn.active {
      background: #0D7377; border-color: #0D7377; color: #fff;
      box-shadow: 0 2px 8px rgba(13,115,119,.3);
    }
    .clt-lc-note {
      font-size: 10px; color: #9B8260; line-height: 1.5;
      padding: 6px 10px; background: #F5F0E8;
      border-radius: 6px; border-left: 2px solid #D4820A;
    }

    /* Layer table */
    .clt-layer-table { border-collapse: collapse; }
    .clt-layer-table thead th {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px; font-weight: 600; letter-spacing: .1em;
      text-transform: uppercase; color: #9B8260;
      padding: 0 8px 8px; text-align: left;
      border-bottom: 1px solid #EDE7D9;
    }
    .clt-layer-row { transition: background .1s; }
    .clt-layer-row:hover { background: #F5F0E8; }
    .clt-layer-row td {
      padding: 4px 8px; border-bottom: 1px solid #EDE7D9;
      vertical-align: middle;
    }
    .clt-lbadge {
      width: 26px; height: 26px; border-radius: 6px;
      background: #1C1408; color: #D4820A;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px; font-weight: 600;
      display: flex; align-items: center; justify-content: center;
    }
    .clt-select, .clt-input {
      font-family: 'IBM Plex Mono', monospace !important;
      font-size: 11px !important;
      background: #F5F0E8 !important;
      border-color: #E3DBCB !important;
      color: #1C1408 !important;
    }
    .clt-select:focus, .clt-input:focus {
      border-color: #0D7377 !important;
      box-shadow: 0 0 0 2px rgba(13,115,119,.15) !important;
    }

    /* Grade ref */
    .clt-grade-details {
      background: #F5F0E8; border: 1px solid #E3DBCB;
      border-radius: 8px; overflow: hidden;
    }
    .clt-grade-details summary {
      padding: 9px 14px; cursor: pointer; list-style: none;
      font-size: 11px; font-weight: 600; color: #6B5630;
      display: flex; align-items: center; justify-content: space-between;
      font-family: 'IBM Plex Mono', monospace;
    }
    .clt-grade-table { border-collapse: collapse; }
    .clt-grade-table th, .clt-grade-table td {
      padding: 4px 12px; font-size: 10px;
      border-top: 1px solid #EDE7D9;
      font-family: 'IBM Plex Mono', monospace; text-align: left;
    }
    .clt-grade-table th { color: #9B8260; font-weight: 600; }
    .clt-grade-table td { color: #3D2E14; }

    /* Error */
    .clt-error-box {
      background: #FEF0F0; border: 1px solid #FECACA;
      border-left: 3px solid #B83232; border-radius: 8px; padding: 12px 14px;
    }
    .clt-error-title { font-size: 12px; font-weight: 700; color: #B83232; margin-bottom: 5px; }
    .clt-err-item    { font-size: 11px; color: #7F1D1D; line-height: 1.7; }

    /* Calc button */
    .clt-calc-btn {
      padding: 13px; background: #0D7377; color: #fff;
      border: none; border-radius: 10px;
      font-weight: 700; font-size: 13px; letter-spacing: .05em;
      cursor: pointer; font-family: 'Inter', sans-serif;
      transition: all .2s;
      box-shadow: 0 4px 14px rgba(13,115,119,.25);
    }
    .clt-calc-btn:hover {
      background: #14A8AD; transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(13,115,119,.35);
    }
    .clt-calc-btn:active { transform: none; }

    /* ── MAIN ── */
    .clt-main { display: flex; flex-direction: column; }

    /* Diagram */
    .clt-diagram-zone {
      padding: 22px 26px 18px;
      border-bottom: 2px solid #E3DBCB;
    }
    .clt-diagram-card {
      background: #fff; border: 1px solid #E3DBCB;
      border-radius: 12px; padding: 18px;
      box-shadow: 0 2px 10px rgba(0,0,0,.05);
    }
    .clt-dpills {
      display: flex; gap: 6px; flex-wrap: wrap;
      justify-content: center; margin-top: 10px;
    }
    .clt-dpill {
      padding: 3px 10px; border-radius: 20px;
      font-size: 10px; font-family: 'IBM Plex Mono', monospace; font-weight: 600;
    }
    .clt-dpill-0  { background: rgba(200,120,58,.12); color: #A85E28; border: 1px solid rgba(200,120,58,.3); }
    .clt-dpill-90 { background: rgba(13,115,119,.1);  color: #0D7377; border: 1px solid rgba(13,115,119,.25); }

    /* Results */
    .clt-results-zone { flex: 1; padding: 22px 26px; overflow-y: auto; }
    .clt-empty {
      height: 200px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 10px; color: #9B8260; text-align: center;
    }
    .clt-empty-icon { font-size: 52px; opacity: .25; }
    .clt-empty-text { font-size: 13px; max-width: 220px; line-height: 1.6; }

    /* Result method tag */
    .clt-method-tag {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
      color: #0D7377; padding: 6px 14px;
      background: #E8F7F7; border: 1px solid rgba(13,115,119,.2);
      border-radius: 6px;
    }
    .clt-method-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #0D7377;
    }

    /* Stat cards */
    .clt-stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
      gap: 10px;
    }
    .clt-stat-card {
      background: #fff; border: 1px solid #E3DBCB;
      border-radius: 10px; padding: 14px 16px;
      transition: border-color .15s, box-shadow .15s;
    }
    .clt-stat-card:hover {
      border-color: #0D7377;
      box-shadow: 0 4px 14px rgba(13,115,119,.1);
    }
    .clt-stat-card.primary {
      border-color: #0D7377; background: #E8F7F7;
    }
    .clt-stat-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px; font-weight: 600;
      text-transform: uppercase; letter-spacing: .1em;
      color: #9B8260; margin-bottom: 7px;
    }
    .clt-stat-card.primary .clt-stat-label { color: #0D7377; }
    .clt-stat-value {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 20px; font-weight: 600; color: #1C1408; line-height: 1;
    }
    .clt-stat-card.primary .clt-stat-value { color: #0D7377; }
    .clt-stat-unit {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px; color: #9B8260; margin-top: 4px;
    }

    /* Gamma */
    .clt-gpill {
      background: #fff; border: 1px solid #E3DBCB;
      border-radius: 8px; padding: 10px 16px; text-align: center; min-width: 90px;
    }
    .clt-gpill-lbl { font-size: 9px; color: #9B8260; font-family: 'IBM Plex Mono', monospace; margin-bottom: 2px; }
    .clt-gpill-val { font-size: 17px; font-weight: 600; color: #0D7377; font-family: 'IBM Plex Mono', monospace; }
    .clt-note      { font-size: 10px; color: #9B8260; font-family: 'IBM Plex Mono', monospace; }

    /* Detail table */
    .clt-section-title {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px; font-weight: 600;
      text-transform: uppercase; letter-spacing: .1em; color: #6B5630;
      padding-bottom: 8px; border-bottom: 1px solid #EDE7D9;
    }
    .clt-detail-table { font-size: 12px; font-family: 'IBM Plex Mono', monospace; }
    .clt-detail-table thead th {
      font-size: 9px; font-weight: 600; text-transform: uppercase;
      letter-spacing: .08em; color: #9B8260;
      background: #F5F0E8; border-bottom: 1px solid #EDE7D9 !important;
      border-top: none !important;
    }
    .clt-detail-table tbody td {
      color: #3D2E14; border-color: #EDE7D9 !important;
      vertical-align: middle;
    }
    .clt-detail-table tbody tr:hover td { background: #F5F0E8; }
    .clt-grade-chip {
      display: inline-block; padding: 2px 8px; border-radius: 4px;
      background: rgba(200,120,58,.12); color: #A85E28;
      font-size: 10px; font-weight: 600;
    }
    .clt-role-b { color: #0D7377 !important; font-weight: 600; }
    .clt-role-c { color: #C8B89A !important; }
    .clt-gv     { color: #D4820A !important; font-weight: 600; }

    @media (max-width: 860px) {
      .clt-body { grid-template-columns: 1fr; }
      .clt-sidebar { border-right: none; border-bottom: 2px solid #E3DBCB; }
    }
  `;
  document.head.appendChild(s);
}