import { t, getLocale } from '../js/i18n.js';
import { api, post, patch } from '../js/api-client.js';
import { statusBadge } from '../components/status-badge.js';
import { loadingState, emptyState, errorState } from '../components/data-state.js';

const safe = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const today = () => new Date().toISOString().slice(0, 10);

let currentCentres = [];
let selectedCentreId = null;

export function officerDashboard(user) {
  return `
    <div class="page-shell">
      <div class="page-heading">
        <div>
          <p class="eyebrow">${t('officer')}</p>
          <h1>${t('namaste')}, ${safe(user.fullName)}</h1>
          <p>${t('officerOverview')}</p>
        </div>
        <div style="display: flex; gap: .7rem; align-items: center; flex-wrap: wrap;">
          <label style="font-size: .8rem; font-weight: 700; color: var(--muted);">${t('centres')}:</label>
          <select data-officer-centre-select style="padding: .4rem .8rem; border-radius: .5rem; border: 1px solid var(--border); font-weight: 700; background: white;"></select>
          <button class="button primary" data-open-quick-schedule>+ ${t('manageSchedule')}</button>
        </div>
      </div>

      <!-- Center Status Bar -->
      <section class="card" style="margin-bottom: 1.5rem; padding: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div>
            <span style="font-size: .75rem; color: var(--muted); display: block;">${t('mandiStatus')}</span>
            <strong data-centre-status-text style="font-size: 1.2rem;">—</strong>
          </div>
          <div data-centre-badge></div>
        </div>
        <div style="display: flex; gap: .5rem;">
          <button class="button secondary" data-set-mandi-status="open">🟢 ${t('centreOpen')}</button>
          <button class="button secondary" data-set-mandi-status="busy">🟡 ${t('centreBusy')}</button>
          <button class="button secondary" data-set-mandi-status="closed">🔴 ${t('centreClosed')}</button>
        </div>
      </section>

      <!-- Real-time Queue Counters -->
      <section class="metric-grid" style="margin-bottom: 1.5rem;">
        <article class="card metric">
          <span>${t('servingToken')}</span>
          <strong data-dash-serving style="color: var(--forest-800); font-size: 2rem;">—</strong>
          <small>${t('startService')}</small>
        </article>
        <article class="card metric">
          <span>${t('nextInQueue')}</span>
          <strong data-dash-next style="font-size: 2rem;">—</strong>
          <small>${t('callNext')}</small>
        </article>
        <article class="card metric">
          <span>${t('waitingCount')}</span>
          <strong data-dash-waiting style="color: var(--amber-dark, #b58105); font-size: 2rem;">—</strong>
          <small>${t('farmersAhead')}</small>
        </article>
        <article class="card metric">
          <span>${t('activeCounters')}</span>
          <strong data-dash-counters style="font-size: 2rem;">2 Active</strong>
          <small>${t('operatingHours')}</small>
        </article>
      </section>

      <!-- Queue Control Actions -->
      <section class="card" style="margin-bottom: 1.5rem; padding: 1.2rem; background: var(--sage-50); border: 1px solid var(--border);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="margin: 0 0 .2rem;">${t('followQueue')}</h3>
            <p style="margin: 0; font-size: .85rem; color: var(--muted);">${t('followQueueHelp')}</p>
          </div>
          <div style="display: flex; gap: .6rem; flex-wrap: wrap;">
            <button class="button primary" data-dash-call-next>📢 ${t('callNextToken')}</button>
            <button class="button secondary" data-dash-pause-queue="paused">⏸️ ${t('pauseMandiQueue')}</button>
            <button class="button secondary" data-dash-resume-queue="running">▶️ ${t('resumeMandiQueue')}</button>
            <a class="button ghost" href="#/queue">${t('viewQueue')} →</a>
          </div>
        </div>
      </section>

      <!-- Today's Queue Roster -->
      <section class="card" style="padding: 1.4rem; margin-bottom: 1.5rem;">
        <div class="centre-card-title">
          <div>
            <p class="eyebrow">${t('queue')}</p>
            <h2>${t('queue')}</h2>
          </div>
          <span style="font-size: .8rem; color: var(--muted);" data-queue-last-updated></span>
        </div>
        <div data-dash-queue-roster>${loadingState()}</div>
      </section>

      <!-- Quick Schedule Publisher Dialog -->
      <dialog class="app-dialog" data-quick-schedule-dialog>
        <form data-quick-schedule-form>
          <header>
            <div>
              <p class="eyebrow">${t('manageSchedule')}</p>
              <h2>${t('manageSchedule')}</h2>
            </div>
            <button type="button" class="button ghost" data-close-schedule-dialog aria-label="Close">×</button>
          </header>
          <div class="field-grid">
            <label class="field">${t('supportedCrops')}
              <select name="cropId" required>
                <option value="1">Wheat (गेहूं)</option>
                <option value="2">Paddy (धान)</option>
                <option value="3">Mustard (सरसों)</option>
              </select>
            </label>
            <label class="field">${t('capacity')}
              <input name="capacity" type="number" min="5" max="200" value="30" required>
            </label>
          </div>
          <div class="field-grid">
            <label class="field">${t('procurementDate')}
              <input name="procurementDate" type="date" value="${today()}" required>
            </label>
            <label class="field">${t('operatingHours')}
              <input name="startTime" type="time" value="09:00" required>
            </label>
          </div>
          <input type="hidden" name="endTime" value="17:00">
          <input type="hidden" name="scheduleStatus" value="published">
          <p class="form-error" data-form-error hidden></p>
          <button class="button primary full" type="submit">${t('publish')}</button>
        </form>
      </dialog>

      <!-- Rapid Inspection Dialog -->
      <dialog class="app-dialog" data-rapid-inspect-dialog>
        <form data-rapid-inspect-form>
          <header>
            <div>
              <p class="eyebrow">${t('rapidInspection')}</p>
              <h2>${t('recordInspection')}</h2>
            </div>
            <button type="button" class="button ghost" data-close-inspect-dialog aria-label="Close">×</button>
          </header>
          <input type="hidden" name="appointmentId">
          <label class="field">${t('actualQuantity')} (${t('quintals')})
            <input name="actualQuantity" type="number" step="0.01" min="0.1" value="22.50" required>
          </label>
          <label class="field">${t('inspectionDecision')}
            <select name="result" required>
              <option value="accepted">Accepted (स्वीकृत - ग्रेड A)</option>
              <option value="on_hold">On Hold (समीक्षाधीन)</option>
              <option value="rejected">Rejected (अस्वीकृत)</option>
            </select>
          </label>
          <label class="field">${t('decisionReason')}
            <input name="notes" placeholder="Quality checks passed; moisture 11.2%">
          </label>
          <button class="button primary full" type="submit">${t('recordInspection')}</button>
        </form>
      </dialog>
    </div>
  `;
}

export async function loadOfficerDashboard(user) {
  const centreSelect = document.querySelector('[data-officer-centre-select]');
  const rosterNode = document.querySelector('[data-dash-queue-roster]');

  try {
    currentCentres = await api('/centres');
    if (!currentCentres.length) {
      if (rosterNode) rosterNode.innerHTML = emptyState();
      return;
    }

    if (centreSelect) {
      centreSelect.innerHTML = currentCentres.map((c) => `<option value="${c.centre_id}">${safe(c.centre_name)}</option>`).join('');
      selectedCentreId = currentCentres[0].centre_id;
      centreSelect.addEventListener('change', () => {
        selectedCentreId = Number(centreSelect.value);
        refreshMandiOverview();
      });
    }

    // Wire Mandi Status buttons
    document.querySelectorAll('[data-set-mandi-status]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const nextStatus = btn.dataset.setMandiStatus;
        try {
          await patch(`/centres/${selectedCentreId}/status`, { status: nextStatus, reason: 'Officer operational change' });
          window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: `Mandi status updated to ${nextStatus}` }));
          refreshMandiOverview();
        } catch (e) {
          window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: e.message }));
        }
      });
    });

    // Wire Call Next Token
    document.querySelector('[data-dash-call-next]')?.addEventListener('click', async () => {
      try {
        await post('/queue/next', { centreId: selectedCentreId, date: today() });
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: t('callNextToken') }));
        refreshMandiOverview();
      } catch (e) {
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: e.message }));
      }
    });

    // Wire Pause / Resume Queue
    document.querySelector('[data-dash-pause-queue]')?.addEventListener('click', async () => {
      try {
        await api('/queue/control', {
          method: 'PUT',
          body: JSON.stringify({ centreId: selectedCentreId, date: today(), state: 'paused', activeCounters: 1, reason: 'Break' })
        });
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: t('queuePaused') }));
        refreshMandiOverview();
      } catch (e) {
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: e.message }));
      }
    });

    document.querySelector('[data-dash-resume-queue]')?.addEventListener('click', async () => {
      try {
        await api('/queue/control', {
          method: 'PUT',
          body: JSON.stringify({ centreId: selectedCentreId, date: today(), state: 'running', activeCounters: 2 })
        });
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: t('resumeQueue') }));
        refreshMandiOverview();
      } catch (e) {
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: e.message }));
      }
    });

    // Wire Schedule Publisher Modal
    document.querySelector('[data-open-quick-schedule]')?.addEventListener('click', () => {
      document.querySelector('[data-quick-schedule-dialog]')?.showModal();
    });
    document.querySelector('[data-close-schedule-dialog]')?.addEventListener('click', () => {
      document.querySelector('[data-quick-schedule-dialog]')?.close();
    });
    document.querySelector('[data-quick-schedule-form]')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const values = Object.fromEntries(new FormData(form));
      values.centreId = selectedCentreId;
      try {
        await post('/schedules', values);
        form.closest('dialog')?.close();
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: t('scheduleSaved') }));
      } catch (err) {
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: err.message }));
      }
    });

    // Wire Inspection Form
    document.querySelector('[data-close-inspect-dialog]')?.addEventListener('click', () => {
      document.querySelector('[data-rapid-inspect-dialog]')?.close();
    });
    document.querySelector('[data-rapid-inspect-form]')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const values = Object.fromEntries(new FormData(form));
      try {
        await post('/transactions/inspections', values);
        form.closest('dialog')?.close();
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: 'Inspection recorded & procurement voucher created!' }));
        refreshMandiOverview();
      } catch (err) {
        window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: err.message }));
      }
    });

    await refreshMandiOverview();

  } catch (error) {
    if (rosterNode) rosterNode.innerHTML = errorState(error.message);
  }
}

async function refreshMandiOverview() {
  if (!selectedCentreId) return;

  const centre = currentCentres.find((c) => c.centre_id === selectedCentreId) || currentCentres[0];
  const statusText = document.querySelector('[data-centre-status-text]');
  const badgeNode = document.querySelector('[data-centre-badge]');
  const servingNode = document.querySelector('[data-dash-serving]');
  const nextNode = document.querySelector('[data-dash-next]');
  const waitingNode = document.querySelector('[data-dash-waiting]');
  const rosterNode = document.querySelector('[data-dash-queue-roster]');

  if (statusText) statusText.textContent = `${centre.centre_name} (${centre.centre_status.toUpperCase()})`;
  if (badgeNode) badgeNode.innerHTML = statusBadge(centre.centre_status);

  try {
    const queueData = await api(`/queue?centreId=${selectedCentreId}&date=${today()}`).catch(() => ({ tokens: [] }));
    const tokens = queueData.tokens || [];

    const inService = tokens.find((t) => t.queue_status === 'in_service' || t.queue_status === 'called');
    const waitingTokens = tokens.filter((t) => t.queue_status === 'waiting');

    if (servingNode) servingNode.textContent = inService ? inService.token_number : '—';
    if (nextNode) nextNode.textContent = waitingTokens[0] ? waitingTokens[0].token_number : '—';
    if (waitingNode) waitingNode.textContent = waitingTokens.length ? `${waitingTokens.length} Waiting` : '0';

    if (rosterNode) {
      if (!tokens.length) {
        rosterNode.innerHTML = `<p style="padding: 1rem 0; color: var(--muted);">${t('emptyBody')}</p>`;
      } else {
        rosterNode.innerHTML = `
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>${t('token')}</th>
                  <th>${t('farmer')}</th>
                  <th>${t('appointmentStatus')}</th>
                  <th>Time</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${tokens.map((tok) => `
                  <tr>
                    <td><strong>${safe(tok.token_number)}</strong></td>
                    <td>${safe(tok.farmer_name || 'Farmer')}</td>
                    <td>${statusBadge(safe(tok.queue_status.replace('_', ' ')))}</td>
                    <td>${tok.updated_at ? new Date(tok.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td style="text-align: right;">
                      ${tok.queue_status === 'called' ? `<button class="button secondary" style="min-height: 2rem; font-size: .75rem;" data-officer-transition="${tok.token_id}" data-target-status="in_service">${t('startService')}</button>` : ''}
                      ${tok.queue_status === 'in_service' ? `<button class="button primary" style="min-height: 2rem; font-size: .75rem;" data-officer-inspect="${tok.appointment_id}">⚖️ ${t('recordInspection')}</button>` : ''}
                      ${['in_service', 'called'].includes(tok.queue_status) ? `<button class="button secondary" style="min-height: 2rem; font-size: .75rem;" data-officer-transition="${tok.token_id}" data-target-status="completed">✓ ${t('complete')}</button>` : ''}
                      ${tok.queue_status === 'called' ? `<button class="button ghost danger" style="min-height: 2rem; font-size: .75rem;" data-officer-transition="${tok.token_id}" data-target-status="no_show">${t('noShow')}</button>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

        rosterNode.querySelectorAll('[data-officer-transition]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            try {
              await patch(`/queue/tokens/${btn.dataset.officerTransition}`, { status: btn.dataset.targetStatus });
              window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: 'Token updated.' }));
              refreshMandiOverview();
            } catch (e) {
              window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: e.message }));
            }
          });
        });

        rosterNode.querySelectorAll('[data-officer-inspect]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const dialog = document.querySelector('[data-rapid-inspect-dialog]');
            if (dialog) {
              dialog.querySelector('input[name="appointmentId"]').value = btn.dataset.officerInspect;
              dialog.showModal();
            }
          });
        });
      }
    }
  } catch (err) {
    if (rosterNode) rosterNode.innerHTML = errorState(err.message);
  }
}
