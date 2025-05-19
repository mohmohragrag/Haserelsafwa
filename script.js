const STEEL_DENSITY = 7.85; // g/cm³ = 7.85 × 10⁻³ g/mm³

function calculateWeight(fl1_length, fl1_width, fl1_thickness,
                         fl2_length, fl2_width, fl2_thickness,
                         web_length, web_width, web_thickness,
                         count) {
  // حجم الفلانشة 1
  let fl1_volume = fl1_length * fl1_width * fl1_thickness;
  // حجم الفلانشة 2
  let fl2_volume = fl2_length * fl2_width * fl2_thickness;
  // حجم الويب
  let web_volume = web_length * web_width * web_thickness;

  // الحجم الكلي لعنصر واحد
  let total_volume_mm3 = fl1_volume + fl2_volume + web_volume;

  // تحويل الحجم إلى سم³: 1 سم³ = 1000 مم³
  let total_volume_cm3 = total_volume_mm3 / 1000;

  // الوزن = الحجم × الكثافة × العدد
  let weight_kg = (total_volume_cm3 * STEEL_DENSITY * count) / 1000; // نحول من جرام إلى كجم

  return weight_kg;
}

function getValue(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

document.getElementById("calcBtn").addEventListener("click", function () {
  let totalWeight = 0;

  const groups = [
    "main", "mid", "face", "raf", "fly"
  ];

  for (let group of groups) {
    let weight = calculateWeight(
      getValue(`${group}_fl1_length`),
      getValue(`${group}_fl1_width`),
      getValue(`${group}_fl1_thickness`),
      getValue(`${group}_fl2_length`),
      getValue(`${group}_fl2_width`),
      getValue(`${group}_fl2_thickness`),
      getValue(`${group}_web_length`),
      getValue(`${group}_web_width`),
      getValue(`${group}_web_thickness`),
      getValue(`${group}_count`)
    );
    totalWeight += weight;
  }

  // البلتات = 12% زيادة
  let palletsWeight = totalWeight * 0.12;
  let totalWithPallets = totalWeight + palletsWeight;

  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = `
    الوزن الإجمالي بدون البلتات: <strong>${totalWeight.toFixed(2)} كجم</strong><br>
    وزن البلتات (12%): <strong>${palletsWeight.toFixed(2)} كجم</strong><br>
    الوزن الكلي للمشروع: <strong>${totalWithPallets.toFixed(2)} كجم</strong>
  `;
});
