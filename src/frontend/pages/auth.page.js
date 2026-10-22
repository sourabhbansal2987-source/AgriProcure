import { t, getLocale } from '../js/i18n.js';

export const LOCATIONS = Object.freeze({
  Rajasthan: {
    Ajmer: ['Pushkar', 'Tabiji'],
    Alwar: ['Neemrana', 'Bhiwadi'],
    Banswara: ['Chhayan'],
    Baran: ['Antah'],
    Barmer: ['Balotra', 'Chohtan'],
    Bharatpur: ['Deeg'],
    Bhilwara: ['Asind', 'Shahpura'],
    Bikaner: ['Deshnoke'],
    Bundi: ['Lakheri'],
    Chittorgarh: ['Kapkan'],
    Churu: ['Ratangarh'],
    Dausa: ['Lalsot'],
    Dholpur: ['Bari'],
    Dungarpur: ['Sagwara'],
    Hanumangarh: ['Pilibanga'],
    Jaipur: ['Bagru', 'Chamu'],
    Jaisalmer: ['Pokhran'],
    Jalore: ['Ahor'],
    Jhalawar: ['Khanpur'],
    Jhunjhunu: ['Mandawa'],
    Jodhpur: ['Bilara', 'Osian'],
    Karauli: ['Hindaun'],
    Kota: ['Sangod'],
    Nagaur: ['Gagrana', 'Kuchaman'],
    Pali: ['Sojat'],
    Pratapgarh: ['Chhoti Sadri'],
    Rajsamand: ['Nathdwara'],
    'Sawai Madhopur': ['Gangapur'],
    Sikar: ['Laxmangarh'],
    Sirohi: ['Abu Road'],
    'Sri Ganganagar': ['Suratgarh'],
    Tonk: ['Newai'],
    Udaipur: ['Salumbar', 'Gogunda']
  },
  Goa: {
    'North Goa': ['Calangute', 'Anjuna', 'Aldona', 'Morjim', 'Candolim', 'Arambol', 'Mandrem', 'Querim', 'Corjuem', 'Moira', 'Assagao', 'Saligao', 'Siolim', 'Tivim', 'Penha de Franca', 'Socorro', 'Salvador do Mundo', 'Reis Magos', 'Pilerne', 'Nerul'],
    'South Goa': ['Colva', 'Benaulim', 'Cavelossim', 'Palolem', 'Agonda', 'Varca', 'Majorda', 'Betalbatim', 'Curtorim', 'Loutolim', 'Nuvem', 'Cansaulim', 'Utorda', 'Arrossim', 'Verna', 'Chinchinim', 'Assolna', 'Velim', 'Cuncolim', 'Canacona']
  },
  Sikkim: {
    Gangtok: ['Lachung', 'Lachen', 'Chungthang', 'Mangan', 'Singtam', 'Rangpo', 'Dikchu'],
    Gyalshing: ['Pelling', 'Yuksom', 'Dentam', 'Varsey', 'Tashiding', 'Rinchenpong', 'Legship'],
    Mangan: ['Kabi', 'Phodong', 'Passingdang', 'Lingthem', 'Gor', 'Tingchim', 'Malabasey'],
    Namchi: ['Ravangla', 'Jorethang', 'Namthang', 'Yangang', 'Temi', 'Melli', 'Sikip'],
    Pakyong: ['Rorathang', 'Rongli', 'Aritar', 'Zuluk', 'Padamchen', 'Pakong'],
    Soreng: ['Chumbong', 'Daramdin', 'Okhrey', 'Sombaria', 'Ribdi', 'Timbur']
  },
  Haryana: {
    Ambala: ['Naraingarh', 'Barara'],
    Bhiwani: ['Tosham', 'Bawani Khera'],
    'Charkhi Dadri': ['Badhra'],
    Faridabad: ['Tigaon', 'Ballabhgarh'],
    Fatehabad: ['Tohana', 'Ratia'],
    Gurugram: ['Sohna', 'Pataudi'],
    Hisar: ['Sisai', 'Hansi'],
    Jhajjar: ['Bahadurgarh', 'Beri'],
    Jind: ['Uchana', 'Narwana'],
    Kaithal: ['Pundri', 'Guhla'],
    Karnal: ['Gharaunda', 'Indri'],
    Kurukshetra: ['Shahbad', 'Pehowa'],
    Mahendragarh: ['Narnaul', 'Kanina'],
    Nuh: ['Ferozepur Jhirka', 'Punhana'],
    Palwal: ['Hodal'],
    Panchkula: ['Pinjore'],
    Panipat: ['Samalkha'],
    Rewari: ['Bawal'],
    Rohtak: ['Meham'],
    Sirsa: ['Rania'],
    Sonipat: ['Gohana'],
    Yamunanagar: ['Chhachhrauli']
  },
  Kerala: {
    Alappuzha: ['Mararikulam', 'Kuttanad', 'Kumarakom'],
    Ernakulam: ['Kalamassery', 'Aluva', 'Angamaly'],
    Idukki: ['Munnar', 'Marayoor', 'Thekkady'],
    Kannur: ['Thalassery', 'Payyanur', 'Cherukunnu'],
    Kasaragod: ['Bekal', 'Kanhangad', 'Cheruvathur'],
    Kollam: ['Ashtamudi', 'Kottarakkara', 'Karunagappally'],
    Kottayam: ['Pala', 'Changanassery', 'Vaikom'],
    Kozhikode: ['Vadakara', 'Koyilandy', 'Beypore'],
    Malappuram: ['Kottakkal', 'Ponnani', 'Tirur'],
    Palakkad: ['Ottapalam', 'Chittur', 'Cherpulassery'],
    Pathanamthitta: ['Aranmula', 'Adoor'],
    Thiruvananthapuram: ['Varkala', 'Kovalam'],
    Thrissur: ['Guruvayur', 'Chalakudy'],
    Wayanad: ['Kalpetta', 'Mananthavady']
  }
});

function field(name, label, type = 'text', attributes = '', placeholder = '') { return `<label class="field">${label}<input name="${name}" type="${type}" ${attributes} placeholder="${placeholder}" required><small class="field-error" data-field-error="${name}"></small></label>`; }
function option(value, label = value) { return `<option value="${value}">${label}</option>`; }
function locationFields() {
  return `<div class="field-grid"><label class="field">${t('state')}<select name="state" data-state required><option value="" selected disabled>${t('selectState')}</option>${Object.keys(LOCATIONS).map((value) => option(value)).join('')}</select><small class="field-error" data-field-error="state"></small></label><label class="field">${t('district')}<select name="district" data-district required disabled><option value="" selected>${t('selectDistrict')}</option></select><small class="field-error" data-field-error="district"></small></label></div><div class="field-grid"><label class="field">${t('village')}<select name="village" data-village required disabled><option value="" selected>${t('selectVillage')}</option></select><small class="field-error" data-field-error="village"></small></label><label class="field">${t('preferredLanguage')}<select name="preferredLanguage"><option value="en" ${getLocale() === 'en' ? 'selected' : ''}>${t('english')}</option><option value="hi" ${getLocale() === 'hi' ? 'selected' : ''}>${t('hindi')}</option></select></label></div>`;
}

export function wireLocationSelects(root = document) {
  const state=root.querySelector('[data-state]'),district=root.querySelector('[data-district]'),village=root.querySelector('[data-village]');if(!state||!district||!village)return;
  state.addEventListener('change',()=>{district.disabled=false;district.innerHTML=`<option value="" selected disabled>${t('selectDistrict')}</option>${Object.keys(LOCATIONS[state.value]||{}).map(value=>option(value)).join('')}`;village.disabled=true;village.innerHTML=`<option value="" selected>${t('selectVillage')}</option>`;});
  district.addEventListener('change',()=>{village.disabled=false;village.innerHTML=`<option value="" selected disabled>${t('selectVillage')}</option>${(LOCATIONS[state.value]?.[district.value]||[]).map(value=>option(value)).join('')}`;});
}

export function authPage(mode = 'login', challengeId = '') {
  const isLogin = mode === 'login';
  const isOtp = mode === 'otp';
  let form;
  if (isOtp) {
    form = `<form data-auth-form="otp" novalidate><input type="hidden" name="challengeId" value="${challengeId}">${field('otp', t('otpCode'), 'text', 'inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code"', t('otpPlaceholder'))}<p class="auth-footnote">${t('otpHelp')}</p><p class="form-error" data-form-error hidden></p><button class="button primary full" type="submit">${t('verifyOtp')}</button></form>`;
  } else if (isLogin) {
    const demoButtons = `<div class="demo-access-card" style="margin-bottom: 1.25rem; padding: 1rem; background: var(--sage-50); border: 1px solid var(--border); border-radius: var(--radius);"><p class="eyebrow" style="margin-bottom: .4rem;">${t('quickDemoLogin')}</p><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: .45rem;"><button type="button" class="button secondary" style="padding: .45rem .25rem; font-size: .75rem; text-align: center;" data-demo-role="farmer">🌾 ${t('demoFarmer')}</button><button type="button" class="button secondary" style="padding: .45rem .25rem; font-size: .75rem; text-align: center;" data-demo-role="officer">🏢 ${t('demoOfficer')}</button><button type="button" class="button secondary" style="padding: .45rem .25rem; font-size: .75rem; text-align: center;" data-demo-role="admin">🛡️ ${t('demoAdmin')}</button></div></div>`;
    form = `${demoButtons}<form data-auth-form="login" novalidate>${field('phone', t('loginIdentifier'), 'tel', 'maxlength="64" autocomplete="username"', t('loginIdentifierPlaceholder'))}${field('password', t('password'), 'password', 'autocomplete="current-password"', t('passwordPlaceholder'))}<p class="form-error" data-form-error hidden></p><button class="button primary full" type="submit">${t('signIn')}</button></form>`;
  } else {
    form = `<form data-auth-form="register" novalidate>${field('fullName', t('fullName'), 'text', 'maxlength="120" autocomplete="name"', t('namePlaceholder'))}${field('phone', t('mobile'), 'tel', 'inputmode="tel" maxlength="18" autocomplete="tel"', t('phonePlaceholder'))}${field('password', t('password'), 'password', 'minlength="10" autocomplete="new-password"', t('newPasswordPlaceholder'))}${locationFields()}<p class="form-error" data-form-error hidden></p><button class="button primary full" type="submit">${t('requestOtp')}</button></form>`;
  }
  return `<main class="auth-layout"><section class="auth-visual"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true"></span><span>${t('brand')}</span></a><div class="auth-message"><p class="eyebrow">${t('brand')}</p><h1>${isLogin ? t('welcome') : t('createAccount')}</h1><p>${isLogin ? t('signInHelp') : t('registerHelp')}</p></div></section><section class="auth-form-shell"><button class="button ghost language-switch" data-language>${t('language')}</button><div class="auth-panel"><header><p class="eyebrow">${t('brand')}</p><h1>${isOtp ? t('verifyOtp') : isLogin ? t('signIn') : t('register')}</h1></header>${!isOtp ? `<div class="auth-tabs" role="tablist"><button type="button" data-auth-mode="login" aria-selected="${isLogin}">${t('signIn')}</button><button type="button" data-auth-mode="register" aria-selected="${!isLogin}">${t('register')}</button></div>` : ''}${form}<p class="auth-footnote">${t('securityNote')}</p></div></section></main>`;
}
