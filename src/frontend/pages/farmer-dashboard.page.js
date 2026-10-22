import { t, getLocale } from '../js/i18n.js';
import { api, post, patch } from '../js/api-client.js';
import { statusBadge } from '../components/status-badge.js';
import { loadingState, emptyState, errorState } from '../components/data-state.js';

const safe = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(getLocale() === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${String(value).slice(0, 10)}T12:00:00`));
}

let availableSchedules = [];

export function farmerDashboard(user) {
  const firstName = safe(user.fullName ? user.fullName.split(' ')[0] : 'Farmer');
  return `
    <div class="page-shell">
      <div class="page-heading">
        <div>
          <p class="eyebrow">${t('farmer')}</p>
          <h1>${t('namaste')}, ${firstName}</h1>
          <p>${t('farmerOverview')}</p>
        </div>
        <div style="display: flex; gap: .6rem; align-items: center; flex-wrap: wrap;">
          ${statusBadge(t('verifiedMobile'))}
          <button class="button primary" data-dash-new-booking>+ ${t('bookNewAppointment')}</button>
        </div>
      </div>

      <!-- Quick Metrics Overview -->
      <section class="metric-grid" data-farmer-metrics>
        <article class="card metric">
          <span>${t('appointments')}</span>
          <strong data-metric-appointments>—</strong>
          <small>${t('manageBookings')}</small>
        </article>
        <article class="card metric">
          <span>${t('activeQueuePass')}</span>
          <strong data-metric-token style="color: var(--forest-800);">—</strong>
          <small data-metric-token-centre>${t('centres')}</small>
        </article>
        <article class="card metric">
          <span>${t('procuredQuantity')}</span>
          <strong data-metric-quantity>—</strong>
          <small>${t('quintals')}</small>
        </article>
        <article class="card metric">
          <span>${t('purchaseValue')}</span>
          <strong data-metric-value style="color: var(--forest-700);">—</strong>
          <small>${t('paymentStatus')}</small>
        </article>
      </section>

      <!-- Active Digital Token Spotlight -->
      <section data-active-token-section style="margin-bottom: 1.5rem;"></section>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Upcoming Appointments -->
        <article class="card" style="grid-column: span 7; padding: 1.4rem;">
          <div class="centre-card-title">
            <div>
              <p class="eyebrow">${t('manageBookings')}</p>
              <h2>${t('manageBookings')}</h2>
            </div>
            <a class="button ghost" href="#/bookings">${t('view')} →</a>
          </div>
          <div data-dash-appointments>${loadingState()}</div>
        </article>

        <!-- Account Profile & Mandi Info -->
        <article class="card status-card" style="grid-column: span 5; padding: 1.4rem;">
          <h2>${t('account')}</h2>
          <ul class="status-list">
            <li><span>${t('fullName')}</span><strong>${safe(user.fullName)}</strong></li>
            <li><span>${t('verifiedMobile')}</span><strong>${safe(user.phone)}</strong></li>
            <li><span>${t('farmerId')}</span><strong>${safe(user.farmerCode || 'F-2026-1048')}</strong></li>
            <li><span>${t('district')}</span><strong>${safe(user.district || 'Karnal')}</strong></li>
            <li><span>${t('village')}</span><strong>${safe(user.village || 'Rampur')}</strong></li>
            <li><span>${t('state')}</span><strong>${safe(user.state || 'Haryana')}</strong></li>
          </ul>
          <div style="margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <p class="eyebrow">${t('quickActions')}</p>
            <div style="display: flex; gap: .5rem; flex-wrap: wrap;">
              <a class="button secondary" style="flex: 1;" href="#/centres">⌖ ${t('findCentre')}</a>
              <a class="button secondary" style="flex: 1;" href="#/queue">≋ ${t('viewQueue')}</a>
            </div>
          </div>
        </article>
      </div>

      <!-- Recent Procurement & Payments -->
      <section class="card" style="margin-top: 1.5rem; padding: 1.4rem;">
        <div class="centre-card-title">
          <div>
            <p class="eyebrow">${t('trackProcurement')}</p>
            <h2>${t('trackProcurement')}</h2>
          </div>
          <a class="button ghost" href="#/bookings">${t('view')} →</a>
        </div>
        <div data-dash-transactions>${loadingState()}</div>
      </section>

      <!-- Notifications -->
      <section class="card" style="margin-top: 1.5rem; padding: 1.4rem;">
        <div class="centre-card-title">
          <div>
            <p class="eyebrow">${t('latestNotifications')}</p>
            <h2>${t('latestNotifications')}</h2>
          </div>
        </div>
        <div data-notifications></div>
      </section>

      <!-- Booking Dialog -->
      <dialog class="app-dialog" data-dash-booking-dialog>
        <form data-dash-booking-form>
          <header>
            <div>
              <p class="eyebrow">${t('newBooking')}</p>
              <h2>${t('chooseSchedule')}</h2>
            </div>
            <button type="button" class="button ghost" data-dash-close-dialog aria-label="Close">×</button>
          </header>
          <label class="field">${t('chooseSchedule')}<select name="scheduleId" required></select></label>
          <label class="field">${t('estimatedQuantity')}<input name="estimatedQuantity" type="number" min="0.1" step="0.1" value="20.0" required><small>${t('quintals')}</small></label>
          <p class="form-error" data-form-error hidden></p>
          <button class="button primary full" type="submit">${t('confirmBooking')}</button>
        </form>
      </dialog>

      <!-- Token Dialog -->
      <dialog class="app-dialog token-dialog" data-dash-token-dialog>
        <div data-token-content></div>
        <button class="button secondary full" data-dash-close-token-dialog>Close</button>
      </dialog>
    </div>
  `;
}

export async function loadFarmerDashboard(user) {
  const metricsAppt = document.querySelector('[data-metric-appointments]');
  const metricsTok = document.querySelector('[data-metric-token]');
  const metricsTokCentre = document.querySelector('[data-metric-token-centre]');
  const metricsQty = document.querySelector('[data-metric-quantity]');
  const metricsVal = document.querySelector('[data-metric-value]');
  const tokenSec = document.querySelector('[data-active-token-section]');
  const apptList = document.querySelector('[data-dash-appointments]');
  const txList = document.querySelector('[data-dash-transactions]');

  try {
    const [appointments, queueTokens, transactions, schedules] = await Promise.all([
      api('/appointments/my').catch(() => []),
      api('/queue/my').catch(() => []),
      api('/transactions/my').catch(() => []),
      api('/schedules').catch(() => [])
    ]);

    availableSchedules = schedules;

    // 1. Update Metrics
    const activeAppts = appointments.filter((a) => a.booking_status === 'confirmed');
    if (metricsAppt) metricsAppt.textContent = activeAppts.length ? `${activeAppts.length} Active` : '0 Active';

    const activeToken = queueTokens.find((q) => ['waiting', 'called', 'in_service'].includes(q.queue_status)) || queueTokens[0];
    if (activeToken) {
      if (metricsTok) metricsTok.textContent = activeToken.token_number;
      if (metricsTokCentre) metricsTokCentre.textContent = activeToken.centre_name;
    } else {
      if (metricsTok) metricsTok.textContent = 'None';
      if (metricsTokCentre) metricsTokCentre.textContent = 'No queue line';
    }

    const totalQty = transactions.reduce((acc, tx) => acc + Number(tx.actual_quantity || 0), 0);
    const totalVal = transactions.reduce((acc, tx) => acc + Number(tx.total_amount || 0), 0);
    if (metricsQty) metricsQty.textContent = totalQty > 0 ? `${totalQty.toFixed(1)} Qtl` : '0 Qtl';
    if (metricsVal) metricsVal.textContent = totalVal > 0 ? `₹${Math.round(totalVal).toLocaleString('en-IN')}` : '₹0';

    // 2. Active Token Pass Spotlight Card
    if (tokenSec) {
      if (activeToken) {
        tokenSec.innerHTML = `
          <div class="card" style="padding: 1.5rem; background: linear-gradient(135deg, #103827, #185239); color: white; border-radius: var(--radius-lg); box-shadow: var(--shadow);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
              <div>
                <p class="eyebrow" style="color: #9cd4b5;">${t('activeQueuePass')}</p>
                <div style="display: flex; align-items: baseline; gap: 1rem;">
                  <span style="font-size: 2.8rem; font-weight: 800; letter-spacing: .05em; color: #fff;">${safe(activeToken.token_number)}</span>
                  ${statusBadge(safe(activeToken.queue_status.replace('_', ' ')))}
                </div>
                <h3 style="margin: .3rem 0; font-size: 1.25rem;">${safe(activeToken.centre_name)}</h3>
                <p style="margin: 0; color: #c4e1d1;">${safe(getLocale() === 'hi' ? activeToken.crop_name_hi : activeToken.crop_name_en)} · ${formatDate(activeToken.queue_date || new Date())}</p>
              </div>
              <div style="text-align: right; min-width: 160px; background: rgba(0,0,0,.22); padding: 1rem 1.2rem; border-radius: var(--radius);">
                <div style="margin-bottom: .6rem;">
                  <span style="font-size: .75rem; color: #b1d4c2; display: block;">${t('farmersAhead')}</span>
                  <strong style="font-size: 1.6rem; color: #ffeb99;">${safe(activeToken.farmers_ahead ?? 0)}</strong>
                </div>
                <div>
                  <span style="font-size: .75rem; color: #b1d4c2; display: block;">${t('estimatedWait')}</span>
                  <strong style="font-size: 1.2rem; color: #fff;" data-token-wait-time>${activeToken.estimated_wait_minutes != null ? `${safe(activeToken.estimated_wait_minutes)} ${t('minutes')}` : t('queuePaused')}</strong>
                </div>
              </div>
            </div>
            <div style="margin-top: 1.2rem; display: flex; gap: .6rem; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,.18); padding-top: 1rem;">
              <button class="button secondary" style="border: 0; background: white;" data-predict-dash-wait="${activeToken.token_id}">🤖 ${t('predictWaitTime')}</button>
              <a class="button ghost" style="color: white; border: 1px solid rgba(255,255,255,.3);" href="#/queue">≋ ${t('viewQueue')} →</a>
              <span style="margin-left: auto; font-size: .8rem; align-self: center; color: #a8d5be;" data-dash-prediction-note></span>
            </div>
          </div>
        `;

        tokenSec.querySelector('[data-predict-dash-wait]')?.addEventListener('click', async () => {
          const noteNode = tokenSec.querySelector('[data-dash-prediction-note]');
          const waitTimeNode = tokenSec.querySelector('[data-token-wait-time]');
          try {
            noteNode.textContent = 'Calling AI model…';
            const pred = await post(`/predictions/waiting/${activeToken.token_id}`, {});
            if (waitTimeNode) waitTimeNode.textContent = `${pred.value} ${t('minutes')}`;
            if (noteNode) noteNode.textContent = `AI Confidence: ${pred.lower_bound}–${pred.upper_bound} mins (${pred.method === 'model' ? t('modelPrediction') : t('fallbackEstimate')})`;
          } catch (e) {
            if (noteNode) noteNode.textContent = e.message;
          }
        });
      } else {
        tokenSec.innerHTML = '';
      }
    }

    // 3. Render Upcoming Appointments
    if (apptList) {
      if (!appointments.length) {
        apptList.innerHTML = `<p style="padding: 1rem 0; color: var(--muted);">${t('emptyBody')}</p><button class="button primary" data-open-inner-book>+ ${t('newBooking')}</button>`;
        apptList.querySelector('[data-open-inner-book]')?.addEventListener('click', openBookingDialog);
      } else {
        apptList.innerHTML = `
          <div class="booking-list" style="margin-top: 1rem;">
            ${appointments.slice(0, 3).map((item) => `
              <div style="padding: .85rem; border: 1px solid var(--border); border-radius: var(--radius); display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                <div>
                  <div style="display: flex; gap: .5rem; align-items: center;">
                    <strong style="font-size: .95rem;">${safe(item.centre_name)}</strong>
                    ${statusBadge(safe(item.booking_status.replace('_', ' ')))}
                  </div>
                  <small style="color: var(--muted); display: block;">${safe(getLocale() === 'hi' ? item.crop_name_hi : item.crop_name_en)} · ${safe(item.estimated_quantity)} ${safe(item.quantity_unit || t('quintals'))} · ${formatDate(item.procurement_date)}</small>
                </div>
                <div style="text-align: right; display: flex; gap: .4rem;">
                  <button class="button secondary" style="min-height: 2.2rem; font-size: .8rem;" data-dash-view-token="${safe(item.appointment_id)}">🎟️ ${t('token')}</button>
                  ${item.booking_status === 'confirmed' ? `<button class="button ghost danger" style="min-height: 2.2rem; font-size: .8rem;" data-dash-cancel="${item.appointment_id}">✕</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `;

        apptList.querySelectorAll('[data-dash-view-token]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const item = appointments.find((a) => String(a.appointment_id) === btn.dataset.dashViewToken);
            if (item) showDashToken(item);
          });
        });

        apptList.querySelectorAll('[data-dash-cancel]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            if (!confirm(t('cancellationReason'))) return;
            try {
              await patch(`/appointments/${btn.dataset.dashCancel}/cancel`, { reason: 'Farmer requested cancellation' });
              window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: t('bookingCancelled') }));
              loadFarmerDashboard(user);
            } catch (e) {
              window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: e.message }));
            }
          });
        });
      }
    }

    // 4. Render Transactions & Payments
    if (txList) {
      if (!transactions.length) {
        txList.innerHTML = `<p style="padding: 1rem 0; color: var(--muted);">${t('emptyBody')}</p>`;
      } else {
        txList.innerHTML = `
          <div class="booking-list" style="margin-top: 1rem;">
            ${transactions.slice(0, 3).map((tx) => `
              <div style="padding: .85rem; border: 1px solid var(--border); border-radius: var(--radius); display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                <div>
                  <div style="display: flex; gap: .5rem; align-items: center;">
                    <strong style="font-size: .95rem;">${safe(tx.centre_name || 'Procurement Centre')}</strong>
                    ${statusBadge(safe(tx.payment_status || tx.transaction_status))}
                  </div>
                  <small style="color: var(--muted); display: block;">${safe(getLocale() === 'hi' ? tx.crop_name_hi : tx.crop_name_en)} · Ref: ${safe(tx.booking_reference || tx.transaction_reference)}</small>
                </div>
                <div style="text-align: right;">
                  <strong style="color: var(--forest-800); font-size: 1rem; display: block;">₹${safe(Number(tx.total_amount).toLocaleString('en-IN'))}</strong>
                  <small style="color: var(--muted);">${safe(tx.actual_quantity)} ${t('quintals')}</small>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    // 5. Wire Booking Dialog
    document.querySelector('[data-dash-new-booking]')?.addEventListener('click', openBookingDialog);
    document.querySelector('[data-dash-close-dialog]')?.addEventListener('click', () => {
      document.querySelector('[data-dash-booking-dialog]')?.close();
    });
    document.querySelector('[data-dash-close-token-dialog]')?.addEventListener('click', () => {
      document.querySelector('[data-dash-token-dialog]')?.close();
    });

    const bookingForm = document.querySelector('[data-dash-booking-form]');
    if (bookingForm) {
      bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        const values = Object.fromEntries(new FormData(bookingForm));
        try {
          await post('/appointments', values);
          bookingForm.closest('dialog')?.close();
          window.dispatchEvent(new CustomEvent('agriprocure:toast', { detail: t('bookingConfirmed') }));
          loadFarmerDashboard(user);
        } catch (err) {
          const errNode = bookingForm.querySelector('[data-form-error]');
          if (errNode) { errNode.textContent = err.message; errNode.hidden = false; }
        } finally {
          submitBtn.disabled = false;
        }
      });
    }

  } catch (error) {
    if (apptList) apptList.innerHTML = errorState(error.message);
  }
}

function openBookingDialog() {
  const dialog = document.querySelector('[data-dash-booking-dialog]');
  if (!dialog) return;
  const select = dialog.querySelector('select[name="scheduleId"]');
  if (select && availableSchedules.length) {
    select.innerHTML = availableSchedules
      .filter((s) => s.remaining_capacity > 0)
      .map((s) => `<option value="${s.schedule_id}">${safe(s.centre_name)} · ${safe(getLocale() === 'hi' ? s.crop_name_hi : s.crop_name_en)} · ${formatDate(s.procurement_date)} ${safe(String(s.start_time).slice(0, 5))} (${s.remaining_capacity} left)</option>`)
      .join('');
  }
  dialog.showModal();
}

function showDashToken(item) {
  const dialog = document.querySelector('[data-dash-token-dialog]');
  if (!dialog) return;
  dialog.querySelector('[data-token-content]').innerHTML = `
    <div class="ticket">
      <p class="eyebrow">${t('token')}</p>
      <strong>${safe(item.token_number || 'W-018')}</strong>
      <h2>${safe(item.centre_name)}</h2>
      <p>${formatDate(item.procurement_date)} · ${safe(String(item.start_time || '09:00').slice(0, 5))}</p>
      <small>${safe(item.booking_reference)}</small>
    </div>
  `;
  dialog.showModal();
}
