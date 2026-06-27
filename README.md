# CLT Panel Properties Calculator

Kalkulator web untuk menghitung properti panel **Cross-Laminated Timber (CLT)** berdasarkan data layer kayu. Dibuat dengan vanilla JavaScript + Bootstrap 5, menggunakan pendekatan **Object-Oriented Programming (OOP)**.

---

## Demo

Buka `index.html` langsung di browser — tidak perlu server atau `npm install`.

---

## Fitur

- Pilih metode analisis: **Shear Analogy** atau **Gamma**
- Konfigurasi 3–9 layer (tergantung metode)
- Diagram potongan melintang CLT yang update secara real-time
- Hasil kalkulasi: EIeff, EAeff, GAeff, sumbu netral, modulus penampang
- Validasi otomatis (simetris, jumlah layer, dll)

---

## Metode Analisis

### Shear Analogy
- Jumlah layer: **3 sampai 9**
- Layup **wajib simetris** dari atas ke bawah
  - Layer 1 = Layer terakhir (tebal + orientasi + grade harus sama)
  - Layer 2 = Layer kedua dari bawah, dst

```
✅ VALID (simetris):
  Layer 1: 35mm · MGP10 · 0°
  Layer 2: 35mm · MGP10 · 90°
  Layer 3: 35mm · MGP10 · 0°   ← tengah
  Layer 4: 35mm · MGP10 · 90°  ← sama dengan Layer 2
  Layer 5: 35mm · MGP10 · 0°   ← sama dengan Layer 1

❌ TIDAK VALID (tidak simetris):
  Layer 1: 35mm · MGP10 · 0°
  Layer 2: 35mm · MGP10 · 90°
  Layer 3: 35mm · MGP10 · 0°
  Layer 4: 35mm · MGP10 · 0°   ← BEDA dengan Layer 2!
  Layer 5: 35mm · MGP10 · 90°  ← BEDA dengan Layer 1!
```

### Gamma Method
- Jumlah layer: **hanya 3 atau 5** (tidak boleh selain itu)
- Tidak harus simetris
- Lebih sederhana: layer 90° diabaikan dari perhitungan lentur
- γ = 1.0 untuk sambungan lem (fully composite)

---

## Struktur File

```
calculator-test/
├── index.html                    ← Entry point, load semua script
├── calculator.js                 ← UI controller, render, event handler
├── type/
│   ├── CLTLayerType.js           ← Data satu layer CLT
│   ├── CLTLayupType.js           ← Kombinasi semua layer + metode
│   └── PanelPropertiesType.js    ← Output hasil kalkulasi
├── calculation/
│   ├── GradeLibrary.js           ← Database grade kayu + Validator
│   └── PanelProperties.js        ← Engine kalkulasi (Shear Analogy & Gamma)
├── assets/
│   └── ...                       ← Aset gambar / referensi
└── floor-panel-properties.xlsx   ← File Excel referensi soal
```

---

## Struktur Data (OOP)

### `CLTLayerType`
Menyimpan data **satu layer** CLT.

```js
new CLTLayerType({
  id:          1,       // nomor layer
  thickness:   35,      // tebal (mm)
  grade:       'MGP10', // kelas kayu
  orientation: 0,       // 0° (sejajar) atau 90° (tegak lurus)
  E:           10000,   // MOE sejajar (MPa)
  G:           625,     // modulus geser (MPa)
  fc:          20,      // kuat tekan (MPa)
  ft:          14,      // kuat tarik (MPa)
  fv:          3.8,     // kuat geser (MPa)
})
```

### `CLTLayupType`
Menyimpan **kombinasi semua layer** dan metode analisis.

```js
const layup = new CLTLayupType({
  layers: [layer1, layer2, layer3, layer4, layer5], // CLTLayerType[]
  method: 'shear_analogy', // 'shear_analogy' | 'gamma'
});

layup.totalThickness  // → 175
layup.layerCount      // → 5
layup.isSymmetric()   // → true / false
```

### `PanelPropertiesType`
Menyimpan **output hasil kalkulasi**.

```js
// Field yang tersedia:
{
  method,             // nama metode
  totalThickness,     // total tebal (mm)
  neutralAxis,        // posisi sumbu netral dari atas (mm)
  EIeff,              // kekakuan lentur efektif (N·mm²)
  EAeff,              // kekakuan aksial efektif (N)
  GAeff,              // kekakuan geser efektif (N) — null untuk Gamma
  sectionModulusTop,  // modulus penampang atas (N·mm)
  sectionModulusBot,  // modulus penampang bawah (N·mm)
  layerDetails,       // array detail per layer
  gammaFactors,       // faktor γ per layer 0° — null untuk Shear Analogy
}
```

### Cara Pakai

```js
// 1. Buat layer
const layers = [
  new CLTLayerType({ id:1, thickness:35, grade:'MGP10', orientation:0, ...GradeLibrary.MGP10 }),
  new CLTLayerType({ id:2, thickness:35, grade:'MGP10', orientation:90, ...GradeLibrary.MGP10 }),
  new CLTLayerType({ id:3, thickness:35, grade:'MGP10', orientation:0, ...GradeLibrary.MGP10 }),
];

// 2. Buat layup
const layup = new CLTLayupType({ layers, method: 'gamma' });

// 3. Hitung
const result = PanelProperties.calculate(layup);

// result → PanelPropertiesType
console.log(result.EIeff);  // kekakuan lentur
```

---

## Grade Kayu (Referensi AS 1720)

| Grade  | E (MPa) | G (MPa) | fc (MPa) | ft (MPa) | fv (MPa) |
|--------|---------|---------|----------|----------|----------|
| MGP10  | 10,000  | 625     | 20       | 14       | 3.8      |
| MGP12  | 12,700  | 794     | 22       | 16       | 4.2      |
| MGP15  | 15,900  | 994     | 25       | 20       | 4.6      |
| F17    | 14,000  | 875     | 45       | 30       | 5.5      |

---

## Cara Menjalankan

**Tanpa server (paling mudah):**
```
Double-click index.html → buka di browser
```

**Dengan VS Code Live Server:**
1. Install ekstensi Live Server
2. Klik kanan `index.html` → Open with Live Server

---

## Cara Mengerjakan (untuk kandidat)

1. Fork repo ini
2. Buat branch baru: `assignment-namaAnda`
3. Kerjakan semua requirement
4. Tambahkan [@NurAfianto](https://github.com/NurAfianto) dan [@ikhsan017](https://github.com/ikhsan017) sebagai contributor
5. Buat Pull Request

```bash
git clone https://github.com/CLT-Toolbox/calculator-test.git
cd calculator-test
git checkout -b assignment-namaAnda
# ... kerjakan ...
git add .
git commit -m "feat: implement CLT Panel Properties Calculator"
git push origin assignment-namaAnda
```

---

## Requirement Checklist

- [x] Data structure `CLTLayerType`, `CLTLayupType`, `PanelPropertiesType`
- [x] `PanelProperties.calculate(CLTLayupType)` → return `PanelPropertiesType`
- [x] Tampilan input + output di web
- [x] Shear Analogy: 3–9 layer, wajib simetris
- [x] Gamma: hanya 3 atau 5 layer
- [x] OOP + data structure sesuai ilustrasi
- [x] Diagram layup real-time
- [ ] Fork + branch `assignment-namaAnda`
- [ ] Tambahkan contributor

---

*Referensi: AS 1720.1, Blass & Fellmoser (2004), Eurocode 5 Annex B*
