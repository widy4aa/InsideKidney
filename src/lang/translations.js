/* ═══════════════════════════════════════════════════════════════
   InsideKidney — Language Translations (EN / TH)
   ═══════════════════════════════════════════════════════════════ */

export const TRANSLATIONS = {
  en: {
    // ── Nav ──────────────────────────────────────────────────────
    nav_home:        'Home',
    nav_explorer:    '3D Explorer',
    nav_quiz:        'Quiz',

    // ── Index: Hero ───────────────────────────────────────────────
    badge:           'Medical Holographic Interface',
    hero_title:      'InsideKidney',
    hero_subtitle:   'Explore kidney anatomy, blood filtration, nephron physiology, and urine formation through an interactive 3D learning experience.',
    btn_open_3d:     'Open 3D Explorer',
    btn_open_ar:     'Open AR View',
    btn_quiz:        'Take the Quiz',

    // ── Index: Overview Strip ──────────────────────────────────────
    strip_3d_title:  '3D Model',
    strip_3d_desc:   'Rotate, inspect, and focus on kidney structures.',
    strip_ar_title:  'AR View',
    strip_ar_desc:   'Place the model over your camera view and move your phone to inspect the angle.',
    strip_label_title: 'Guided Labels',
    strip_label_desc: 'Understand vessels, cortex, medulla, pelvis, and ureter.',
    strip_quiz_title: 'Knowledge Check',
    strip_quiz_desc:  'Practice with editable quiz data from JSON.',

    // ── Index: Content Section ──────────────────────────────────────
    section_eyebrow:   'What you will learn',
    section_h2:        'Kidney anatomy made easier to inspect',
    section_desc:      'The landing page now gives students a quick map of the topic before they enter the 3D explorer.',

    card_blood_title: 'Blood Inflow',
    card_blood_desc:  'Follow how renal arteries bring blood into the kidney before filtration begins.',
    card_filter_title: 'Filtration',
    card_filter_desc:  'Connect the 3D anatomy with nephron function, glomerular filtration, and reabsorption.',
    card_urine_title:  'Urine Pathway',
    card_urine_desc:   'Trace fluid movement from collecting ducts toward the renal pelvis and ureter.',
    card_focus_title:  'Focused Review',
    card_focus_desc:   'Use the quiz after exploration to check whether key anatomy terms are understood.',

    // ── Index: Learning Steps ───────────────────────────────────────
    steps_eyebrow:  'Suggested flow',
    steps_h2:       'Learn in three steps',
    step1_title:    'Preview the structure',
    step1_desc:     'Start from the major kidney parts so the model feels familiar before rotating it.',
    step2_title:    'Explore the model',
    step2_desc:     'Open the 3D explorer, inspect labels, and focus on structures one by one.',
    step3_title:    'Test understanding',
    step3_desc:     'Finish with the quiz. Questions can be updated anytime through <code>quiz.json</code>.',

    // ── Index: CTA Band ─────────────────────────────────────────────
    cta_eyebrow:    'Ready to explore',
    cta_h2:         'Start with the 3D kidney model',
    cta_desc:       'Use the visual explorer first, then return to the quiz for review.',
    cta_btn:        'Launch Explorer',
    cta_ar_btn:     'Launch AR View',

    // ── Index: Flipbook & Share Buttons ─────────────────────────
    btn_flipbook:   'Read Flipbook',
    btn_share:      'Share',

    // ── Share Modal ─────────────────────────────────────────
    share_modal_title:    'Share InsideKidney',
    share_modal_subtitle: 'Scan QR or copy link below',
    share_qr_label:       'Scan to open on another device',
    share_or:             'or',
    share_copy_btn:       'Copy Link',
    share_copied:         '\u2713 Link copied!',

    // ── Flipbook Modal ───────────────────────────────────────
    flipbook_title:          'Flipbook',
    flipbook_subtitle:       'InsideKidney \u2014 PDF Material',
    flipbook_download_title: 'Download PDF',
    flipbook_loading:        'Loading flipbook...',
    flipbook_error:          'Flipbook failed to load.',
    flipbook_open_pdf:       'Open PDF',
    flipbook_prev:           'Previous page',
    flipbook_next:           'Next page',

    // ── Viewer: Sidebar / Controls ──────────────────────────────────
    sidebar_anatomy: 'Anatomy',
    ctrl_title:      'Visualization Controls',
    ctrl_blood:      'Show Artery & Vein',
    ctrl_urine:      'Show Urinary Collecting System',
    ctrl_labels:     'Show Labels',
    ar_title:        'AR Camera Mode',
    btn_ar_start:    'Start AR Camera',
    btn_ar_stop:     'Stop AR Camera',
    ar_starting:     'Starting camera...',
    ar_front:        'Front',
    ar_top:          'Top',
    ar_side:         'Side',
    ar_scale:        'Model Scale',
    ar_opacity:      'Model Opacity',
    ar_help:         'Uses your device camera as the 3D background. Best on HTTPS or localhost.',
    ar_camera_error: 'Camera access failed. Allow camera permission and open this page through HTTPS or localhost.',
    ar_camera_unsupported: 'This browser does not support camera access.',
    ar_launch_hint: 'Tap Start AR Camera. Camera and motion permission require HTTPS on phones.',
    ar_requires_https: 'Phone browsers only allow camera access on HTTPS. Deploy this page or open it through an HTTPS local tunnel.',
    ar_motion_active: 'AR camera is active. Move your phone to change the viewing angle around the model.',
    ar_motion_unavailable: 'Camera is active, but motion permission is unavailable. Use Front, Top, or Side angle buttons.',
    filter_title:    'Filter Objects',
    model_pos_title: 'Model Positions',
    model_select_ph: '-- Select Model --',
    btn_reset:       'Reset',
    btn_log_all:     'Log All',
    label_mgr_title: 'Label Manager',
    edit_mode_text:  'Edit Mode (Drag Labels)',
    label_select_ph: '-- Select Label to Edit --',
    label_name_ph:   'Label Name',
    label_visible:   'Is Visible',
    btn_add_new:     'Add New',
    btn_delete:      'Delete',
    btn_save_conf:   '💾 Save to conf.json',
    btn_reset_cam:   'Reset Camera',
    btn_screenshot:  'Capture Screenshot',
    search_ph:       'Search anatomy...',
    loading_text:    'Initializing Medical Interface...',
    loading_models:  'Loading Anatomical Models...',
    read_more:       'Read More',
    read_less:       'Read Less',

    // ── Quiz Page ───────────────────────────────────────────────────
    quiz_title:      'Kidney Anatomy & Function Quiz',
    quiz_loading:    'Loading question...',
    quiz_complete:   'Quiz Complete!',
    quiz_score_pre:  'You scored',
    quiz_score_of:   'out of',
    quiz_retry:      'Try Again',
    quiz_progress:   'Question', // "Question X / Y"
    quiz_of:         '/',
  },

  th: {
    // ── Nav ──────────────────────────────────────────────────────
    nav_home:        'หน้าหลัก',
    nav_explorer:    '3D Explorer',
    nav_quiz:        'แบบทดสอบ',

    // ── Index: Hero ───────────────────────────────────────────────
    badge:           'ระบบโฮโลแกรมทางการแพทย์',
    hero_title:      'InsideKidney',
    hero_subtitle:   'สำรวจกายวิภาคของไต การกรองเลือด สรีรวิทยาของเนฟรอน และการสร้างปัสสาวะ ผ่านประสบการณ์การเรียนรู้แบบ 3D เชิงโต้ตอบ',
    btn_open_3d:     'เปิด 3D Explorer',
    btn_open_ar:     'เปิด AR View',
    btn_quiz:        'ทำแบบทดสอบ',

    // ── Index: Overview Strip ──────────────────────────────────────
    strip_3d_title:  '3D โมเดล',
    strip_3d_desc:   'หมุน ตรวจสอบ และโฟกัสโครงสร้างของไตได้อย่างละเอียด',
    strip_ar_title:  'AR View',
    strip_ar_desc:   'วางโมเดลบนภาพจากกล้อง แล้วขยับโทรศัพท์เพื่อดูมุมของโมเดล',
    strip_label_title: 'ป้ายกำกับแบบนำทาง',
    strip_label_desc: 'ทำความเข้าใจหลอดเลือด คอร์เทกซ์ เมดัลลา เพลวิส และท่อไต',
    strip_quiz_title: 'ทบทวนความรู้',
    strip_quiz_desc:  'ฝึกทำแบบทดสอบที่แก้ไขได้จากไฟล์ JSON',

    // ── Index: Content Section ──────────────────────────────────────
    section_eyebrow:   'สิ่งที่คุณจะได้เรียนรู้',
    section_h2:        'กายวิภาคของไตที่เข้าใจง่ายกว่าเดิม',
    section_desc:      'หน้าหลักนี้ช่วยให้นักเรียนเห็นภาพรวมของหัวข้อก่อนเข้าสู่โปรแกรมสำรวจ 3D',

    card_blood_title: 'การไหลเข้าของเลือด',
    card_blood_desc:  'ติดตามการที่หลอดเลือดแดงรีนัลนำเลือดเข้าสู่ไตก่อนเริ่มการกรอง',
    card_filter_title: 'การกรอง',
    card_filter_desc:  'เชื่อมโยงกายวิภาค 3D กับการทำงานของเนฟรอน การกรองของโกลเมอรูลัส และการดูดซึมกลับ',
    card_urine_title:  'เส้นทางปัสสาวะ',
    card_urine_desc:   'ติดตามการเคลื่อนที่ของของเหลวจากท่อรวมไปยังเพลวิสของไตและท่อไต',
    card_focus_title:  'การทบทวนเฉพาะจุด',
    card_focus_desc:   'ใช้แบบทดสอบหลังการสำรวจเพื่อตรวจสอบว่าเข้าใจคำศัพท์กายวิภาคหลักหรือไม่',

    // ── Index: Learning Steps ───────────────────────────────────────
    steps_eyebrow:  'แนะนำขั้นตอน',
    steps_h2:       'เรียนรู้ใน 3 ขั้นตอน',
    step1_title:    'ดูภาพรวมโครงสร้าง',
    step1_desc:     'เริ่มต้นจากส่วนหลักของไตเพื่อให้คุ้นเคยก่อนที่จะหมุนดูโมเดล',
    step2_title:    'สำรวจโมเดล',
    step2_desc:     'เปิด 3D Explorer ตรวจสอบป้ายกำกับ และโฟกัสทีละโครงสร้าง',
    step3_title:    'ทดสอบความเข้าใจ',
    step3_desc:     'ทำแบบทดสอบเพื่อสรุปบทเรียน สามารถอัปเดตคำถามผ่าน <code>quiz.json</code> ได้ทุกเมื่อ',

    // ── Index: CTA Band ─────────────────────────────────────────────
    cta_eyebrow:    'พร้อมสำรวจแล้ว',
    cta_h2:         'เริ่มต้นด้วยโมเดลไต 3D',
    cta_desc:       'ใช้ตัวสำรวจภาพก่อน แล้วกลับมาทำแบบทดสอบเพื่อทบทวน',
    cta_btn:        'เปิด Explorer',
    cta_ar_btn:     'เปิด AR View',

    // ── Index: Flipbook & Share Buttons ─────────────────────────
    btn_flipbook:   'อ่าน Flipbook',
    btn_share:      'แชร์',

    // ── Share Modal ─────────────────────────────────────────
    share_modal_title:    'แชร์ InsideKidney',
    share_modal_subtitle: 'สแกน QR หรือคัดลอกลิงก์ด้านล่าง',
    share_qr_label:       'สแกนเพื่อเปิดบนอุปกรณ์อื่น',
    share_or:             'หรือ',
    share_copy_btn:       'คัดลอกลิงก์',
    share_copied:         '\u2713 คัดลอกลิงก์แล้ว!',

    // ── Flipbook Modal ───────────────────────────────────────
    flipbook_title:          'Flipbook',
    flipbook_subtitle:       'InsideKidney \u2014 เอกสาร PDF',
    flipbook_download_title: 'ดาวน์โหลด PDF',
    flipbook_loading:        'กำลังโหลด Flipbook...',
    flipbook_error:          'โหลด Flipbook ไม่สำเร็จ',
    flipbook_open_pdf:       'เปิด PDF',
    flipbook_prev:           'หน้าก่อนหน้า',
    flipbook_next:           'หน้าถัดไป',

    // ── Viewer: Sidebar / Controls ──────────────────────────────────
    sidebar_anatomy: 'กายวิภาค',
    ctrl_title:      'การควบคุมการแสดงผล',
    ctrl_blood:      'แสดงหลอดเลือดแดงและดำ',
    ctrl_urine:      'แสดงระบบรวบรวมปัสสาวะ',
    ctrl_labels:     'แสดงป้ายกำกับ',
    ar_title:        'โหมดกล้อง AR',
    btn_ar_start:    'เริ่มกล้อง AR',
    btn_ar_stop:     'หยุดกล้อง AR',
    ar_starting:     'กำลังเปิดกล้อง...',
    ar_front:        'ด้านหน้า',
    ar_top:          'ด้านบน',
    ar_side:         'ด้านข้าง',
    ar_scale:        'ขนาดโมเดล',
    ar_opacity:      'ความทึบโมเดล',
    ar_help:         'ใช้กล้องของอุปกรณ์เป็นพื้นหลัง 3D เหมาะที่สุดบน HTTPS หรือ localhost',
    ar_camera_error: 'เปิดกล้องไม่สำเร็จ โปรดอนุญาตกล้องและเปิดผ่าน HTTPS หรือ localhost',
    ar_camera_unsupported: 'เบราว์เซอร์นี้ไม่รองรับการเข้าถึงกล้อง',
    ar_launch_hint: 'แตะเริ่มกล้อง AR การอนุญาตกล้องและการเคลื่อนไหวบนมือถือจำเป็นต้องใช้ HTTPS',
    ar_requires_https: 'เบราว์เซอร์มือถืออนุญาตกล้องเฉพาะบน HTTPS โปรด deploy หน้านี้หรือเปิดผ่าน HTTPS local tunnel',
    ar_motion_active: 'กล้อง AR ทำงานแล้ว ขยับโทรศัพท์เพื่อเปลี่ยนมุมมองรอบโมเดล',
    ar_motion_unavailable: 'กล้องทำงานแล้ว แต่ไม่มีสิทธิ์ motion ให้ใช้ปุ่มมุม Front, Top หรือ Side',
    filter_title:    'กรองวัตถุ',
    model_pos_title: 'ตำแหน่งโมเดล',
    model_select_ph: '-- เลือกโมเดล --',
    btn_reset:       'รีเซ็ต',
    btn_log_all:     'บันทึกทั้งหมด',
    label_mgr_title: 'จัดการป้ายกำกับ',
    edit_mode_text:  'โหมดแก้ไข (ลากป้ายกำกับ)',
    label_select_ph: '-- เลือกป้ายกำกับที่ต้องการแก้ไข --',
    label_name_ph:   'ชื่อป้ายกำกับ',
    label_visible:   'มองเห็น',
    btn_add_new:     'เพิ่มใหม่',
    btn_delete:      'ลบ',
    btn_save_conf:   '💾 บันทึกเป็น conf.json',
    btn_reset_cam:   'รีเซ็ตกล้อง',
    btn_screenshot:  'จับภาพหน้าจอ',
    search_ph:       'ค้นหากายวิภาค...',
    loading_text:    'กำลังเริ่มต้นระบบทางการแพทย์...',
    loading_models:  'กำลังโหลดโมเดลกายวิภาค...',
    read_more:       'อ่านเพิ่มเติม',
    read_less:       'แสดงน้อยลง',

    // ── Quiz Page ───────────────────────────────────────────────────
    quiz_title:      'แบบทดสอบกายวิภาคและการทำงานของไต',
    quiz_loading:    'กำลังโหลดคำถาม...',
    quiz_complete:   'ทำแบบทดสอบเสร็จแล้ว!',
    quiz_score_pre:  'คุณได้คะแนน',
    quiz_score_of:   'จาก',
    quiz_retry:      'ลองใหม่อีกครั้ง',
    quiz_progress:   'คำถาม',
    quiz_of:         '/',
  }
};

// ─── Language state ───────────────────────────────────────────────
const STORAGE_KEY = 'ik_lang';

export function getCurrentLang() {
  return localStorage.getItem(STORAGE_KEY) || 'en';
}

export function setCurrentLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function t(key, lang = getCurrentLang()) {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS['en'][key] ?? key;
}

// ─── Apply translations to the DOM via data-i18n attributes ───────
// Usage: <span data-i18n="nav_home"></span>
//        <input data-i18n-ph="search_ph" />   (placeholder)
export function applyTranslations(lang = getCurrentLang()) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key, lang);
    el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    el.placeholder = t(key, lang);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    el.title = t(key, lang);
  });
}
