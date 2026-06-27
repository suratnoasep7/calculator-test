/**
 * CLTLayupType
 * Menyimpan kombinasi semua layer CLT dan metode analisis yang dipilih
 */
class CLTLayupType {
  /**
   * @param {Object}          param
   * @param {CLTLayerType[]}  param.layers  - Array layer dari atas ke bawah
   * @param {string}          param.method  - "shear_analogy" atau "gamma"
   */
  constructor({ layers, method }) {
    this.layers = layers;
    this.method = method;
  }

  /** Total ketebalan panel (mm) */
  get totalThickness() {
    return this.layers.reduce((sum, l) => sum + l.thickness, 0);
  }

  /** Jumlah layer */
  get layerCount() {
    return this.layers.length;
  }

  /**
   * Cek apakah layup simetris dari atas ke bawah.
   * Digunakan untuk validasi metode Shear Analogy.
   * Layer ke-i harus sama (tebal + orientasi + grade) dengan layer ke-(n-1-i)
   * @returns {boolean}
   */
  isSymmetric() {
    const n = this.layers.length;
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const top = this.layers[i];
      const bot = this.layers[n - 1 - i];
      if (
        top.thickness   !== bot.thickness   ||
        top.orientation !== bot.orientation ||
        top.grade       !== bot.grade
      ) {
        return false;
      }
    }
    return true;
  }
}
