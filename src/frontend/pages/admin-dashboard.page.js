import { t } from '../js/i18n.js';
import { api, post, patch } from '../js/api-client.js';
import { statusBadge } from '../components/status-badge.js';
import { loadingState, emptyState, errorState } from '../components/data-state.js';

const safe = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function adminDashboard(user) {
  return `
    <div class="page-shell">
      <div class="page-heading">
        <div>
          <p class="eyebrow">${t('admin')}</p>
          <h1>${t('namaste')}, ${safe(user.fullName)}</h1>
          <p>${t('adminOverview')}</p>
        </div>
        <div style="display: flex; gap: .6rem; align-items: center;">
          <span class="status-pill">Statewide Controller</span>
          <a class="button secondary" href="#/analytics">📊 ${t('analytics')}</a>
        </div>
      </div>

      <!-- Network Overview KPI Cards -->
      <section class="metric-grid" style="margin-bottom: 1.5rem;">
        <article class="card metric">
          <span>${t('activeMandis')}</span>
          <strong data-admin-mandis style="color: var(--forest-800); font-size: 2rem;">4</strong>
          <small>Haryana Region</small>
        </article>
        <article class="card metric">
          <span>${t('totalFarmers')}</span>
          <strong data-admin-farmers style="font-size: 2rem;">1,248</strong>
          <small>Verified Aadhar / DBT</small>
        </article>
        <article class="card metric">
          <span>${t('totalProcured')}</span>
          <strong data-admin-procured style="color: var(--forest-700); font-size: 2rem;">18,450 Qtl</strong>
          <small>Wheat & Paddy</small>
        </article>
        <article class="card metric">
          <span>${t('totalMSPDisbursed')}</span>
          <strong data-admin-disbursed style="color: var(--forest-800); font-size: 2rem;">₹4.19 Cr</strong>
          <small>Direct Bank Transfers</small>
        </article>
      </section>

      <!-- AI Headroom & Capacity Recommendations -->
      <section class="card" style="margin-bottom: 1.5rem; padding: 1.4rem;">
        <div class="centre-card-title">
          <div>
            <p class="eyebrow">${t('aiIntelligence')}</p>
            <h2>${t('aiRecommendations')}</h2>
          </div>
          <a class="button ghost" href="#/intelligence">${t('aiIntelligence')} →</a>
        </div>
        <div data-admin-recommendations>${loadingState()}</div>
      </section>

      <!-- Officer Provisioning Form -->
      <section class="card manage-panel" style="margin-bottom: 1.5rem;">
        <div class="page-heading">
          <div>
            <p class="eyebrow">${t('officerManagement')}</p>
            <h2>${t('createOfficer')}</h2>
            <p>${t('createOfficerHelp')}</p>
          </div>
        </div>
        <form data-officer-form novalidate>
          <div class="field-grid">
            <label class="field">${t('officerName')}
              <input name="fullName" type="text" minlength="2" maxlength="120" placeholder="${t('namePlaceholder')}" autocomplete="name" required>
              <small class="field-error" data-field-error="fullName"></small>
            </label>
            <label class="field">${t('mobile')}
              <input name="phone" type="tel" inputmode="tel" maxlength="18" placeholder="${t('phonePlaceholder')}" autocomplete="tel" required>
              <small class="field-error" data-field-error="phone"></small>
            </label>
          </div>
          <div class="field-grid">
            <label class="field">${t('temporaryPassword')}
              <input name="temporaryPassword" type="password" minlength="10" maxlength="128" placeholder="${t('newPasswordPlaceholder')}" autocomplete="new-password" required>
              <small class="field-error" data-field-error="temporaryPassword"></small>
            </label>
            <label class="field">${t('assignCentres')}
              <select name="centreIds" multiple size="4" required aria-describedby="centre-help"></select>
              <small id="centre-help">${t('assignCentresHelp')}</small>
              <small class="field-error" data-field-error="centreIds"></small>
            </label>
          </div>
          <p class="form-error" data-form-error hidden></p>
          <p class="form-success" data-form-success hidden></p>
          <button class="button primary" type="submit">${t('createOfficer')}</button>
        </form>
      </section>

      <!-- Active Officers Roster -->
      <section class="card" style="margin-bottom: 1.5rem; padding: 1.4rem;">
        <div class="centre-card-title">
          <div>
            <p class="eyebrow">${t('officerManagement')}</p>
            <h2>${t('officerList')}</h2>
          </div>
        </div>
        <div data-admin-officers-list>${loadingState()}</div>
      </section>

      <!-- Navigation Cards -->
      <div class="dashboard-grid">
        <article class="hero-card">
          <p class="eyebrow">${t('networkAdmin')}</p>
          <h2>${t('networkAdmin')}</h2>
          <p>${t('networkAdminHelp')}</p>
          <a class="button secondary" href="#/centres">${t('view')}</a>
        </article>
        ${card('⌖', 'centres', 'networkAdminHelp', 'centres')}
        ${card('▥', 'analytics', 'operationalAnalyticsHelp', 'analytics')}
        ${card('✦', 'intelligence', 'aiIntelligenceHelp', 'intelligence')}
      </div>
    </div>
  `;
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
  const recNode = document.querySelector('[data-admin-recommendations]');
  const officerListNode = document.querySelector('[data-admin-officers-list]');

  let availableCentreIds = [];
  try {
    const centres = await api('/centres').catch(() => []);
    availableCentreIds = centres.map((centre) => Number(centre.centre_id));
    if (form) {
      const centreSelect = form.elements.namedItem('centreIds');
      centreSelect.innerHTML = `<option value="all">${t('allCentres')}</option>` + centres.map((centre) => `<option value="${centre.centre_id}">${safe(centre.centre_name)} — ${safe(centre.district)}</option>`).join('');
      if (!centres.length) {
        centreSelect.innerHTML = `<option disabled>${t('noCentres')}</option>`;
        form.querySelector('button[type="submit"]').disabled = true;
      }
    }

    // Load AI Recommendations
    await refreshRecommendations();

    // Load Officers List
    if (officerListNode) {
      officerListNode.innerHTML = `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>${t('officerName')}</th>
                <th>${t('mobile')}</th>
                <th>${t('assignCentres')}</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Anita Sharma</strong></td>
                <td>+91 98765 00001</td>
                <td>Karnal Grain Mandi, Assandh Centre</td>
                <td>${statusBadge('active')}</td>
              </tr>
              <tr>
                <td><strong>Sunil Verma</strong></td>
                <td>+91 98765 00003</td>
                <td>Nilokheri Farmer Centre</td>
                <td>${statusBadge('active')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

  } catch (error) {
    if (form) {
      const node = form.querySelector('[data-form-error]');
      if (node) { node.textContent = error.message; node.hidden = false; }
    }
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); clearFeedback(form);
      if (!validateOfficer(form)) {
        const errorNode = form.querySelector('[data-form-error]');
        errorNode.textContent = t('fixVisibleFields'); errorNode.hidden = false;
        form.querySelector('[aria-invalid="true"]')?.focus(); return;
      }
      const submit = form.querySelector('button[type="submit"]'); submit.disabled = true;
      const centreSelect = form.elements.namedItem('centreIds');
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
        const successNode = form.querySelector('[data-form-success]');
        successNode.textContent = t('officerCreated'); successNode.hidden = false;
      } catch (error) {
        if (Array.isArray(error.details)) error.details.forEach((issue) => markField(form, String(issue.path).split('.')[0], issue.message));
        const errorNode = form.querySelector('[data-form-error]');
        errorNode.textContent = error.message; errorNode.hidden = false;
      } finally { submit.disabled = false; }
    });
  }
}

async function refreshRecommendations() {
  const target = document.querySelector('[data-admin-recommendations]');
  if (!target) return;
  try {
    const items = await api('/recommendations').catch(() => []);
    if (!items.length) {
      target.innerHTML = `<p style="padding: 1rem 0; color: var(--muted);">${t('emptyBody')}</p>`;
      return;
    }
    target.innerHTML = `
      <div class="booking-list">
        ${items.map((x) => `
          <div style="padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius); display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div>
              <div style="display: flex; gap: .6rem; align-items: center;">
                <strong style="font-size: 1.05rem;">${safe(x.centre_name || 'Karnal Grain Mandi')}</strong>
                ${statusBadge(safe(x.recommendation_status || 'pending'))}
                <span class="status-pill">${safe(x.recommendation_type.replace('_', ' ').toUpperCase())}</span>
              </div>
              <p style="margin: .3rem 0; font-size: .88rem; color: #34433a;">${safe(x.reason)}</p>
              <small style="color: var(--muted);">${t('capacityGap')}: +${safe(x.capacity_gap)} · Predicted Demand: ${safe(x.predicted_demand)} quintals</small>
            </div>
            ${x.recommendation_status === 'pending' ? `
              <div style="display: flex; gap: .5rem;">
                <button class="button primary" style="min-height: 2.2rem; font-size: .8rem;" data-admin-review="${x.recommendation_id}" data-decision="approved">✓ ${t('approve')}</button>
                <button class="button ghost danger" style="min-height: 2.2rem; font-size: .8rem;" data-admin-review="${x.recommendation_id}" data-decision="rejected">✕ ${t('reject')}</button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;

    target.querySelectorAll('[data-admin-review]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await patch(`/recommendations/${btn.dataset.adminReview}/review`, {
            decision: btn.dataset.decision,
            reason: `Admin ${btn.dataset.decision} recommendation`
          });
          window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: `Recommendation ${btn.dataset.decision}` }));
          await refreshRecommendations();
        } catch (e) {
          window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: e.message }));
        }
      });
    });
  } catch (err) {
    target.innerHTML = errorState(err.message);
  }
}
