/**
 * PanelPropertiesType
 * Menyimpan hasil kalkulasi properti panel CLT secara keseluruhan
 * Dikembalikan oleh PanelProperties.calculate(CLTLayupType)
 */
class PanelPropertiesType {
  /**
   * @param {Object}                    param
   * @param {string}                    param.method               - Nama metode: 'Shear Analogy' | 'Gamma'
   * @param {number}                    param.totalThickness        - Total tebal panel (mm)
   * @param {number}                    param.neutralAxis           - Posisi sumbu netral dari atas (mm)
   * @param {number}                    param.EIeff                 - Kekakuan lentur efektif (N·mm²)
   * @param {number}                    param.EAeff                 - Kekakuan aksial efektif (N)
   * @param {number|null}               param.GAeff                 - Kekakuan geser efektif (N) — null untuk Gamma
   * @param {number}                    param.sectionModulusTop     - Modulus penampang atas (N·mm)
   * @param {number}                    param.sectionModulusBot     - Modulus penampang bawah (N·mm)
   * @param {CLTLayerPropertiesType[]}  param.layerDetails          - Detail properti per layer
   * @param {Array|null}                param.gammaFactors          - Faktor γ per layer 0° (null untuk Shear Analogy)
   */
  constructor({
    method,
    totalThickness,
    neutralAxis,
    EIeff,
    EAeff,
    GAeff,
    sectionModulusTop,
    sectionModulusBot,
    layerDetails,
    gammaFactors,
  }) {
    this.method            = method;
    this.totalThickness    = totalThickness;
    this.neutralAxis       = neutralAxis;
    this.EIeff             = EIeff;
    this.EAeff             = EAeff;
    this.GAeff             = GAeff;
    this.sectionModulusTop = sectionModulusTop;
    this.sectionModulusBot = sectionModulusBot;
    this.layerDetails      = layerDetails;   // CLTLayerPropertiesType[]
    this.gammaFactors      = gammaFactors;
  }
}
