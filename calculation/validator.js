/**
 * Validator
 * Memvalidasi CLTLayupType sebelum kalkulasi dilakukan
 *
 * Aturan validasi:
 * - Shear Analogy : 3–9 layer, WAJIB simetris atas ke bawah
 * - Gamma         : HANYA 3 atau 5 layer
 */
class Validator {
  /**
   * @param {CLTLayerType[]} layers
   * @param {string}         method  - 'shear_analogy' | 'gamma'
   * @returns {string[]}             - Array pesan error (kosong = valid)
   */
  static validate(layers, method) {
    const errors = [];
    const n = layers.length;

    if (method === 'shear_analogy') {
      this._validateShearAnalogy(layers, n, errors);
    }

    if (method === 'gamma') {
      this._validateGamma(n, errors);
    }

    return errors;
  }

  // ── Shear Analogy ────────────────────────────────────
  static _validateShearAnalogy(layers, n, errors) {
    // 1. Batas jumlah layer
    if (n < 3 || n > 9) {
      errors.push(
        `Shear Analogy membutuhkan 3–9 layer. Saat ini: ${n} layer.`
      );
      return; // tidak perlu cek simetris kalau jumlah layer salah
    }

    // 2. Wajib simetris dari atas ke bawah
    //    Layer ke-i harus IDENTIK dengan layer ke-(n-1-i)
    //    dalam hal: thickness, orientation, grade
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const top = layers[i];
      const bot = layers[n - 1 - i];

      if (
        top.thickness   !== bot.thickness   ||
        top.orientation !== bot.orientation ||
        top.grade       !== bot.grade
      ) {
        errors.push(
          `Shear Analogy membutuhkan layup SIMETRIS. ` +
          `Layer ${i + 1} (atas) ≠ Layer ${n - i} (bawah). ` +
          `Pastikan tebal, orientasi, dan grade identik.`
        );
        break;
      }
    }
  }

  // ── Gamma ────────────────────────────────────────────
  static _validateGamma(n, errors) {
    // Hanya boleh 3 atau 5 layer
    if (n !== 3 && n !== 5) {
      errors.push(
        `Metode Gamma hanya bisa menggunakan 3 atau 5 layer. Saat ini: ${n} layer.`
      );
    }
  }
}
