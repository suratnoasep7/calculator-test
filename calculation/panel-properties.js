/**
 * PanelProperties
 * Engine kalkulasi properti panel CLT
 * Mendukung dua metode: Shear Analogy dan Gamma
 *
 * Cara pakai:
 *   const result = PanelProperties.calculate(layup); // layup = CLTLayupType
 *   // result → PanelPropertiesType
 *
 * Bergantung pada:
 *   - type/CLTLayerType.js
 *   - type/CLTLayupType.js
 *   - type/CLTLayerPropertiesType.js
 *   - type/PanelPropertiesType.js
 */
class PanelProperties {

  /**
   * Entry point utama
   * @param {CLTLayupType} layup
   * @returns {PanelPropertiesType}
   */
  static calculate(layup) {
    if (layup.method === 'gamma') {
      return this._calcGamma(layup);
    }
    return this._calcShearAnalogy(layup);
  }

  // ═══════════════════════════════════════════════════════════
  // SHEAR ANALOGY
  // Referensi: Blass & Fellmoser (2004), Thiel & Brandner
  // Berlaku: 3–9 layer, layup SIMETRIS
  // ═══════════════════════════════════════════════════════════
  static _calcShearAnalogy(layup) {
    const layers  = layup.layers;
    const b       = 1000; // lebar unit per meter (mm)
    const H       = layup.totalThickness;
    const zi      = this._centroidPositions(layers);

    // Pisahkan layer berdasarkan orientasi
    const parallel = layers.map((l, i) => ({ l, i })).filter(({ l }) => l.orientation === 0);
    const cross    = layers.map((l, i) => ({ l, i })).filter(({ l }) => l.orientation === 90);

    // ── 1. Sumbu netral (dari permukaan atas) ───────────
    let EA_sum = 0, EAz_sum = 0;
    parallel.forEach(({ l, i }) => {
      const EA  = l.E * l.thickness * b;
      EA_sum   += EA;
      EAz_sum  += EA * zi[i];
    });
    const zNA = EA_sum > 0 ? EAz_sum / EA_sum : H / 2;

    // ── 2. EIeff — Kekakuan lentur efektif ──────────────
    let EIeff = 0;
    parallel.forEach(({ l, i }) => {
      const di  = zi[i] - zNA;
      const Ii  = (b * Math.pow(l.thickness, 3)) / 12;
      EIeff    += l.E * (Ii + l.thickness * b * di * di);
    });

    // ── 3. EAeff — Kekakuan aksial efektif ──────────────
    const EAeff = EA_sum;

    // ── 4. GAeff — Kekakuan geser efektif (rolling shear) ─
    let GAeff = 0;
    cross.forEach(({ l }) => { GAeff += l.G * l.thickness * b; });

    // ── 5. Modulus penampang ─────────────────────────────
    const sectionModulusTop = zNA       > 0 ? EIeff / zNA       : 0;
    const sectionModulusBot = (H - zNA) > 0 ? EIeff / (H - zNA) : 0;

    // ── 6. Detail per layer → CLTLayerPropertiesType[] ───
    const layerDetails = layers.map((l, i) => new CLTLayerPropertiesType({
      id:          l.id,
      thickness:   l.thickness,
      grade:       l.grade,
      orientation: l.orientation,
      E:           l.orientation === 0 ? l.E : '—',
      G:           l.G,
      zi:          +zi[i].toFixed(3),
      di:          +(zi[i] - zNA).toFixed(3),
      role:        l.orientation === 0 ? 'Lentur (bending)' : 'Geser rolling',
      gamma:       null,
    }));

    return new PanelPropertiesType({
      method:            'Shear Analogy',
      totalThickness:    H,
      neutralAxis:       +zNA.toFixed(3),
      EIeff:             +EIeff.toFixed(0),
      EAeff:             +EAeff.toFixed(0),
      GAeff:             +GAeff.toFixed(0),
      sectionModulusTop: +sectionModulusTop.toFixed(0),
      sectionModulusBot: +sectionModulusBot.toFixed(0),
      layerDetails,
      gammaFactors:      null,
    });
  }

  // ═══════════════════════════════════════════════════════════
  // GAMMA METHOD
  // Referensi: Eurocode 5 Annex B
  // Berlaku: HANYA 3 atau 5 layer
  // ═══════════════════════════════════════════════════════════
  static _calcGamma(layup) {
    const layers  = layup.layers;
    const b       = 1000;
    const H       = layup.totalThickness;
    const zi      = this._centroidPositions(layers);

    // Hanya layer sejajar (0°) yang berkontribusi pada lentur
    const parallel   = layers.map((l, i) => ({ l, i })).filter(({ l }) => l.orientation === 0);

    // γ = 1.0 untuk sambungan lem (fully composite — tidak ada slip)
    const gammaValues = parallel.map(() => 1.0);

    // ── 1. Sumbu netral efektif ──────────────────────────
    let EA_sum = 0, EAz_sum = 0;
    parallel.forEach(({ l, i }, idx) => {
      const gi  = gammaValues[idx];
      const EA  = gi * l.E * l.thickness * b;
      EA_sum   += EA;
      EAz_sum  += EA * zi[i];
    });
    const zNA = EA_sum > 0 ? EAz_sum / EA_sum : H / 2;

    // ── 2. EIeff dengan faktor gamma ─────────────────────
    let EIeff = 0;
    parallel.forEach(({ l, i }, idx) => {
      const gi  = gammaValues[idx];
      const di  = zi[i] - zNA;
      const Ii  = (b * Math.pow(l.thickness, 3)) / 12;
      EIeff    += l.E * (Ii + gi * l.thickness * b * di * di);
    });

    // ── 3. EAeff ─────────────────────────────────────────
    const EAeff = EA_sum;

    // ── 4. Modulus penampang ─────────────────────────────
    const sectionModulusTop = zNA       > 0 ? EIeff / zNA       : 0;
    const sectionModulusBot = (H - zNA) > 0 ? EIeff / (H - zNA) : 0;

    // ── 5. Detail per layer → CLTLayerPropertiesType[] ───
    const layerDetails = layers.map((l, i) => {
      const pIdx = parallel.findIndex(p => p.i === i);
      return new CLTLayerPropertiesType({
        id:          l.id,
        thickness:   l.thickness,
        grade:       l.grade,
        orientation: l.orientation,
        E:           l.orientation === 0 ? l.E : '—',
        G:           l.G,
        zi:          +zi[i].toFixed(3),
        di:          +(zi[i] - zNA).toFixed(3),
        role:        l.orientation === 0 ? 'Lentur (bending)' : 'Tegak lurus (diabaikan)',
        gamma:       pIdx >= 0 ? gammaValues[pIdx].toFixed(3) : null,
      });
    });

    // ── 6. Gamma factors summary ──────────────────────────
    const gammaFactors = parallel.map(({ l }, idx) => ({
      layerId: l.id,
      gamma:   gammaValues[idx].toFixed(3),
    }));

    return new PanelPropertiesType({
      method:            'Gamma',
      totalThickness:    H,
      neutralAxis:       +zNA.toFixed(3),
      EIeff:             +EIeff.toFixed(0),
      EAeff:             +EAeff.toFixed(0),
      GAeff:             null,
      sectionModulusTop: +sectionModulusTop.toFixed(0),
      sectionModulusBot: +sectionModulusBot.toFixed(0),
      layerDetails,
      gammaFactors,
    });
  }

  // ═══════════════════════════════════════════════════════════
  // HELPER: posisi centroid tiap layer dari permukaan atas
  // ═══════════════════════════════════════════════════════════
  static _centroidPositions(layers) {
    let cum = 0;
    return layers.map(l => {
      const zi  = cum + l.thickness / 2;
      cum       += l.thickness;
      return zi;
    });
  }
}
