/**
 * GradeLibrary
 * Database properti material kayu berdasarkan kelas (grade)
 * Digunakan oleh PanelProperties dan calculator.js
 *
 * Bergantung pada: type/MaterialGradeType.js (harus di-load lebih dulu)
 * Referensi: AS 1720.1 / MGP grading
 */
const GradeLibrary = {
  MGP10: new MaterialGradeType({ name: 'MGP10', E: 10000, E90: 333,  G: 625,  fc: 20, ft: 14, fv: 3.8 }),
  MGP12: new MaterialGradeType({ name: 'MGP12', E: 12700, E90: 423,  G: 794,  fc: 22, ft: 16, fv: 4.2 }),
  MGP15: new MaterialGradeType({ name: 'MGP15', E: 15900, E90: 530,  G: 994,  fc: 25, ft: 20, fv: 4.6 }),
  F17:   new MaterialGradeType({ name: 'F17',   E: 14000, E90: 467,  G: 875,  fc: 45, ft: 30, fv: 5.5 }),
};
