/**
 * CLTLayerType
 * Menyimpan data satu lapisan (layer) pada CLT
 */
class CLTLayerType {
  /**
   * @param {Object} param
   * @param {number} param.id           - Nomor layer (mulai dari 1)
   * @param {number} param.thickness    - Ketebalan layer (mm)
   * @param {string} param.grade        - Kelas kayu, contoh: "MGP10"
   * @param {number} param.orientation  - Orientasi serat: 0 (sejajar) atau 90 (tegak lurus)
   * @param {number} param.E            - Modulus elastisitas sejajar (MPa)
   * @param {number} param.E90          - Modulus elastisitas tegak lurus (MPa)
   * @param {number} param.G            - Modulus geser (MPa)
   * @param {number} param.fc           - Kuat tekan (MPa)
   * @param {number} param.ft           - Kuat tarik (MPa)
   * @param {number} param.fv           - Kuat geser (MPa)
   */
  constructor({ id, thickness, grade, orientation, E, E90, G, fc, ft, fv }) {
    this.id          = id;
    this.thickness   = thickness;
    this.grade       = grade;
    this.orientation = orientation; // 0° atau 90°
    this.E           = E;
    this.E90         = E90 ?? E / 30;
    this.G           = G;
    this.fc          = fc;
    this.ft          = ft;
    this.fv          = fv;
  }
}
