const STEEL_DENSITY = 7.85; // كثافة الحديد بالجرام/سم³

// لحفظ الوزن حسب السماكة
const thicknessWeights = {};

// دالة لحساب الوزن لقطعة بناء على الأبعاد والعدد
function calculateWeight(fl1_length, fl1_width, fl1_thickness,
                         fl2_length, fl2_width, fl2_thickness,
                         web_length, web_width, web_thickness,
                         count) {
  // حجم كل جزء (مم³)
  let fl1_volume = fl1_length * fl1_width * fl1_thickness;
  let fl2_volume = fl2_length * fl2_width * fl2_thickness;
  let web_volume = web_length * web_width * web_thickness;

  let total_volume_per_piece = fl1_volume + fl2_volume + web_volume;
  let total_volume = total_volume_per_piece * count;
  let total_volume_cm3 = total_volume / 1000; // تحويل إلى سم³

  let total_weight_grams = total_volume_cm3 * STEEL_DENSITY;
  let total_weight_kg = total_weight_grams / 1000;

  // إضافة الوزن للمجموع حسب سماكة كل جزء
  addThicknessWeight(fl1_thickness, fl1_volume * count);
  addThicknessWeight(fl2_thickness, fl2_volume * count);
  addThicknessWeight(web_thickness, web_volume * count);

  return total_weight_kg;
}

function addThicknessWeight(thickness_mm, volume_mm3) {
  if (!thickness_mm || thickness_mm <= 0) return;
  // حجم إلى سم³
  let volume_cm3 = volume_mm3 / 1000;
  // وزن بالجرام
  let weight_g = volume_cm3 * STEEL_DENSITY;
  let weight_kg = weight_g / 1000;

  // تخزين الوزن لكل سماكة (مم)
  let key = thickness_mm.toFixed(1); // تقريب رقم السماكة لمكان عشري
  if (thicknessWeights[key]) {
    thicknessWeights[key] += weight_kg;
  } else {
    thicknessWeights[key] = weight_kg;
  }
}

function calculatePlatesWeight() {
  // نفترض إدخال عدد الصفوف، كل صف يحتوي على سماكة و طول و عرض و عدد البلتات
  // مثلا HTML يكون فيه عناصر إدخال مثل:
  // plate_thickness_1, plate_length_1, plate_width_1, plate_count_1
  // plate_thickness_2, ...
  // عدد الصفوف ثابت أو ديناميكي حسب التصميم، هنا مثلاً نفترض 3 صفوف بلتات
  let total_plates_weight = 0;

  for (let i = 1; i <= 3; i++) {
    let thickness = Number(document.getElementById(`plate_thickness_${i}`).value);
    let length = Number(document.getElementById(`plate_length_${i}`).value);
    let width = Number(document.getElementById(`plate_width_${i}`).value);
    let count = Number(document.getElementById(`plate_count_${i}`).value);

    if (thickness > 0 && length > 0 && width > 0 && count > 0) {
      let volume = length * width * thickness * count; // مم³
      let volume_cm3 = volume / 1000;
      let weight_g = volume_cm3 * STEEL_DENSITY;
      let weight_kg = weight_g / 1000;
      total_plates_weight += weight_kg;

      // نحسب وزن كل سماكة من البلتات أيضاً
      addThicknessWeight(thickness, length * width * thickness * count);
    }
  }

  return total_plates_weight;
}

function getInputValues(prefix) {
  return {
    fl1_length: Number(document.getElementById(prefix + '_fl1_length').value),
    fl1_width: Number(document.getElementById(prefix + '_fl1_width').value),
    fl1_thickness: Number(document.getElementById(prefix + '_fl1_thickness').value),

    fl2_length: Number(document.getElementById(prefix + '_fl2_length').value),
    fl2_width: Number(document.getElementById(prefix + '_fl2_width').value),
    fl2_thickness: Number(document.getElementById(prefix + '_fl2_thickness').value),

    web_length: Number(document.getElementById(prefix + '_web_length').value),
    web_width: Number(document.getElementById(prefix + '_web_width').value),
    web_thickness: Number(document.getElementById(prefix + '_web_thickness').value),

    count: Number(document.getElementById(prefix + '_count').value)
  };
}

document.getElementById('calcBtn').addEventListener('click', () => {
  // إعادة تهيئة الكائن الخاص بالسماكات
  for (const key in thicknessWeights) delete thicknessWeights[key];

  // جلب البيانات لكل قسم
  const main = getInputValues('main');
  const mid = getInputValues('mid');
  const face = getInputValues('face');
  const raf = getInputValues('raf');
  const fly = getInputValues('fly');

  // حساب الأوزان
  let main_weight = calculateWeight(
    main.fl1_length, main.fl1_width, main.fl1_thickness,
    main.fl2_length, main.fl2_width, main.fl2_thickness,
    main.web_length, main.web_width, main.web_thickness,
    main.count
  );

  let mid_weight = calculateWeight(
    mid.fl1_length, mid.fl1_width, mid.fl1_thickness,
    mid.fl2_length, mid.fl2_width, mid.fl2_thickness,
    mid.web_length, mid.web_width, mid.web_thickness,
    mid.count
  );

  let face_weight = calculateWeight(
    face.fl1_length, face.fl1_width, face.fl1_thickness,
    face.fl2_length, face.fl2_width, face.fl2_thickness,
    face.web_length, face.web_width, face.web_thickness,
    face.count
  );

  let raf_weight = calculateWeight(
    raf.fl1_length, raf.fl1_width, raf.fl1_thickness,
    raf.fl2_length, raf.fl2_width, raf.fl2_thickness,
    raf.web_length, raf.web_width, raf.web_thickness,
    raf.count
  );

  let fly_weight = calculateWeight(
    fly.fl1_length, fly.fl1_width, fly.fl1_thickness,
    fly.fl2_length, fly.fl2_width, fly.fl2_thickness,
    fly.web_length, fly.web_width, fly.web_thickness,
    fly.count
  );

  // حساب وزن البلتات
  let plates_weight = calculatePlatesWeight();

  // المجموع الكلي لكل الأقسام + البلتات
  let total_weight = main_weight + mid_weight + face_weight + raf_weight + fly_weight + plates_weight;

  // عرض النتائج
  let resultsDiv = document.getElementById('results');
  resultsDiv.style.display = 'block';

  // عرض الوزن حسب السماكة
  let thicknessDetails = '<h4>وزن حسب السماكة (بالكيلوجرام):</h4><ul>';
  for (const [thickness, weight] of Object.entries(thicknessWeights)) {
    thicknessDetails += `<li>سماكة ${thickness} مم : ${weight.toFixed(2)} كجم</li>`;
  }
  thicknessDetails += '</ul>';

  resultsDiv.innerHTML =
    `<h3>نتائج حساب الوزن (بالكيلوجرام):</h3>
    <p>وزن العمدان الرئيسية: ${main_weight.toFixed(2)} كجم</p>
    <p>وزن عمدان الوسط: ${mid_weight.toFixed(2)} كجم</p>
    <p>وزن عمدان الوجهة: ${face_weight.toFixed(2)} كجم</p>
    <p>وزن رفاتر العدلة: ${raf_weight.toFixed(2)} كجم</p>
    <p>وزن رفاتر الطيارة: ${fly_weight.toFixed(2)} كجم</p>
    <p>وزن البلتات: ${plates_weight.toFixed(2)} كجم</p>
    <hr/>
    <p><strong>الوزن الكلي للمشروع: ${total_weight.toFixed(2)} كجم</strong></p>
    ${thicknessDetails}`;
});
