/**
 * MaterialGradeType
 * Menyimpan properti material kayu berdasarkan kelas (grade)
 * Referensi: AS 1720.1 / MGP grading
 */
class MaterialGradeType {
  /**
   * @param {Object} param
   * @param {string} param.name   - Nama grade, contoh: "MGP10"
   * @param {number} param.E      - Modulus elastisitas sejajar serat (MPa)
   * @param {number} param.E90    - Modulus elastisitas tegak lurus serat (MPa)
   * @param {number} param.G      - Modulus geser (MPa)
   * @param {number} param.fc     - Kuat tekan sejajar serat (MPa)
   * @param {number} param.ft     - Kuat tarik sejajar serat (MPa)
   * @param {number} param.fv     - Kuat geser (MPa)
   */
  constructor({ name, E, E90, G, fc, ft, fv }) {
    this.name = name;
    this.E    = E;
    this.E90  = E90 ?? E / 30;
    this.G    = G;
    this.fc   = fc;
    this.ft   = ft;
    this.fv   = fv;
  }
}

/**
 * MATERIAL_GRADES
 * Database semua grade kayu yang tersedia
 * Digunakan untuk mengisi dropdown Grade pada UI
 */
const MATERIAL_GRADES = {
  MGP10: new MaterialGradeType({ name: 'MGP10', E: 10000, E90: 333,  G: 625,  fc: 20, ft: 14, fv: 3.8 }),
  MGP12: new MaterialGradeType({ name: 'MGP12', E: 12700, E90: 423,  G: 794,  fc: 22, ft: 16, fv: 4.2 }),
  MGP15: new MaterialGradeType({ name: 'MGP15', E: 15900, E90: 530,  G: 994,  fc: 25, ft: 20, fv: 4.6 }),
  F17:   new MaterialGradeType({ name: 'F17',   E: 14000, E90: 467,  G: 875,  fc: 45, ft: 30, fv: 5.5 }),
};
