/**
 * CLTLayerPropertiesType
 * Menyimpan hasil kalkulasi properti untuk SATU layer CLT
 * Digunakan sebagai bagian dari output PanelPropertiesType
 */
class CLTLayerPropertiesType {
  /**
   * @param {Object} param
   * @param {number} param.id           - Nomor layer
   * @param {number} param.thickness    - Ketebalan layer (mm)
   * @param {string} param.grade        - Grade kayu
   * @param {number} param.orientation  - Orientasi: 0° atau 90°
   * @param {number|string} param.E     - MOE (MPa) — '—' jika layer 90°
   * @param {number} param.G            - Modulus geser (MPa)
   * @param {number} param.zi           - Posisi centroid dari atas panel (mm)
   * @param {number} param.di           - Jarak dari sumbu netral (mm)
   * @param {string} param.role         - Peran layer: 'Lentur (bending)' atau 'Geser rolling'
   * @param {string|null} param.gamma   - Faktor gamma γ (hanya Gamma method, null untuk Shear Analogy)
   */
  constructor({ id, thickness, grade, orientation, E, G, zi, di, role, gamma = null }) {
    this.id          = id;
    this.thickness   = thickness;
    this.grade       = grade;
    this.orientation = orientation;
    this.E           = E;
    this.G           = G;
    this.zi          = zi;
    this.di          = di;
    this.role        = role;
    this.gamma       = gamma;
  }
}
