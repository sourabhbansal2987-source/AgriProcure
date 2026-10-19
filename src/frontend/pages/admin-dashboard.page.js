import { t } from '../js/i18n.js';
import { api, post } from '../js/api-client.js';

const safe = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function adminDashboard(user) {
  return `<div class="page-shell"><div class="system-notice">${t('developmentNotice')}</div><div class="page-heading"><div><p class="eyebrow">${t('admin')}</p><h1>${t('namaste')}, ${safe(user.fullName)}</h1><p>${t('adminOverview')}</p></div></div><section class="card manage-panel"><div class="page-heading"><div><p class="eyebrow">${t('officerManagement')}</p><h2>${t('createOfficer')}</h2><p>${t('createOfficerHelp')}</p></div></div><form data-officer-form novalidate><div class="field-grid"><label class="field">${t('officerName')}<input name="fullName" type="text" minlength="2" maxlength="120" placeholder="${t('namePlaceholder')}" autocomplete="name" required><small class="field-error" data-field-error="fullName"></small></label><label class="field">${t('mobile')}<input name="phone" type="tel" inputmode="tel" maxlength="18" placeholder="${t('phonePlaceholder')}" autocomplete="tel" required><small class="field-error" data-field-error="phone"></small></label></div><div class="field-grid"><label class="field">${t('temporaryPassword')}<input name="temporaryPassword" type="password" minlength="10" maxlength="128" placeholder="${t('newPasswordPlaceholder')}" autocomplete="new-password" required><small class="field-error" data-field-error="temporaryPassword"></small></label><label class="field">${t('assignCentres')}<select name="centreIds" multiple size="4" required aria-describedby="centre-help"></select><small id="centre-help">${t('assignCentresHelp')}</small><small class="field-error" data-field-error="centreIds"></small></label></div><p class="form-error" data-form-error hidden></p><p class="form-success" data-form-success hidden></p><button class="button primary" type="submit">${t('createOfficer')}</button></form></section><div class="dashboard-grid"><article class="hero-card"><p class="eyebrow">${t('networkAdmin')}</p><h2>${t('networkAdmin')}</h2><p>${t('networkAdminHelp')}</p><a class="button secondary" href="#/centres">${t('view')}</a></article>${card('⌖', 'centres', 'networkAdminHelp', 'centres')}${card('▥', 'analytics', 'operationalAnalyticsHelp', 'analytics')}${card('✦', 'intelligence', 'aiIntelligenceHelp', 'intelligence')}</div></div>`;
}

function card(icon, title, body, route) {
  return `<article class="card feature-card"><span class="icon-box">${icon}</span><h2>${t(title)}</h2><p>${t(body)}</p><footer><a class="button ghost" href="#/${route}">${t('view')} →</a></footer></article>`;
}

function markField(form, name, message) {
  const field = form.elements.namedItem(name);
  if (field) field.setAttribute('aria-invalid', 'true');
  const node = form.querySelector(`[data-field-error="${name}"]`);
  if (node) node.textContent = message;
}

function clearFeedback(form) {
  form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
  form.querySelectorAll('[data-field-error]').forEach((node) => { node.textContent = ''; });
  form.querySelector('[data-form-error]').hidden = true;
  form.querySelector('[data-form-success]').hidden = true;
}

function validateOfficer(form) {
  const fullName = form.fullName.value.trim();
  const phone = form.phone.value.replace(/\D/g, '');
  const password = form.temporaryPassword.value;
  let valid = true;
  if (fullName.length < 2) { markField(form, 'fullName', t('invalidName')); valid = false; }
  if (!/^\d{10,15}$/.test(phone)) { markField(form, 'phone', t('invalidPhone')); valid = false; }
  if (password.length < 10 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) { markField(form, 'temporaryPassword', t('passwordRules')); valid = false; }
  if (!form.querySelectorAll('[name="centreIds"] option:checked').length) { markField(form, 'centreIds', t('required')); valid = false; }
  return valid;
}

export async function loadAdminDashboard() {
  const form = document.querySelector('[data-officer-form]');
  if (!form) return;
  const centreSelect = form.elements.namedItem('centreIds');
  let availableCentreIds = [];
  try {
    const centres = await api('/centres');
    availableCentreIds = centres.map((centre) => Number(centre.centre_id));
    centreSelect.innerHTML = `<option value="all">${t('allCentres')}</option>` + centres.map((centre) => `<option value="${centre.centre_id}">${safe(centre.centre_name)} — ${safe(centre.district)}</option>`).join('');
    if (!centres.length) {
      centreSelect.innerHTML = `<option disabled>${t('noCentres')}</option>`;
      form.querySelector('button[type="submit"]').disabled = true;
    }
  } catch (error) {
    const node = form.querySelector('[data-form-error]'); node.textContent = error.message; node.hidden = false;
    form.querySelector('button[type="submit"]').disabled = true;
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); clearFeedback(form);
    if (!validateOfficer(form)) {
      const errorNode = form.querySelector('[data-form-error]'); errorNode.textContent = t('fixVisibleFields'); errorNode.hidden = false;
      form.querySelector('[aria-invalid="true"]')?.focus(); return;
    }
    const submit = form.querySelector('button[type="submit"]'); submit.disabled = true;
    const selectedCentres = [...centreSelect.selectedOptions].map((option) => option.value);
    const body = {
      fullName: form.fullName.value.trim(),
      phone: form.phone.value.replace(/\D/g, ''),
      temporaryPassword: form.temporaryPassword.value,
      centreIds: selectedCentres.includes('all') ? availableCentreIds : selectedCentres.map(Number)
    };
    try {
      await post('/auth/admin/officers', body);
      form.reset();
      const successNode = form.querySelector('[data-form-success]'); successNode.textContent = t('officerCreated'); successNode.hidden = false;
    } catch (error) {
      if (Array.isArray(error.details)) error.details.forEach((issue) => markField(form, String(issue.path).split('.')[0], issue.message));
      const errorNode = form.querySelector('[data-form-error]'); errorNode.textContent = error.message; errorNode.hidden = false;
    } finally { submit.disabled = false; }
  });
}
