'use strict';

const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');

const addDays = (days) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const today = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();

// Common demo password hashes: bcrypt hash of 'Demo@1234'
const DEMO_PASSWORD_HASH = bcrypt.hashSync('Demo@1234', 10);

function createInitialStore() {
  const users = [
    {
      user_id: 1,
      full_name: 'Narayan Kumawat',
      phone: '9876543210',
      email: 'farmer@agriprocure.org',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'farmer',
      account_status: 'active',
      phone_verified_at: '2026-01-01T00:00:00.000Z',
      failed_login_count: 0,
      locked_until: null,
      last_login_at: nowIso()
    },
    {
      user_id: 2,
      full_name: 'Anita Sharma',
      phone: '9876500001',
      email: 'officer@agriprocure.org',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'officer',
      account_status: 'active',
      phone_verified_at: '2026-01-01T00:00:00.000Z',
      failed_login_count: 0,
      locked_until: null,
      last_login_at: nowIso()
    },
    {
      user_id: 3,
      full_name: 'Vikram Singh',
      phone: '9876500002',
      email: 'admin@agriprocure.org',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'admin',
      account_status: 'active',
      phone_verified_at: '2026-01-01T00:00:00.000Z',
      failed_login_count: 0,
      locked_until: null,
      last_login_at: nowIso()
    }
  ];

  const farmers = [
    {
      farmer_id: 1,
      farmer_code: 'F-2026-1048',
      user_id: 1,
      village: 'Rampur',
      district: 'Karnal',
      state: 'Haryana',
      preferred_language: 'en',
      preferred_centre_id: 1
    }
  ];

  const officerAssignments = [
    { assignment_id: 1, user_id: 2, centre_id: 1, assignment_status: 'active', ended_at: null },
    { assignment_id: 2, user_id: 2, centre_id: 2, assignment_status: 'active', ended_at: null }
  ];

  const crops = [
    { crop_id: 1, crop_code: 'WHE', crop_name_en: 'Wheat', crop_name_hi: 'गेहूं', procurement_season: 'Rabi', minimum_support_price: '2275.00', quantity_unit: 'quintal', is_active: 1 },
    { crop_id: 2, crop_code: 'PAD', crop_name_en: 'Paddy', crop_name_hi: 'धान', procurement_season: 'Kharif', minimum_support_price: '2320.00', quantity_unit: 'quintal', is_active: 1 },
    { crop_id: 3, crop_code: 'MUS', crop_name_en: 'Mustard', crop_name_hi: 'सरसों', procurement_season: 'Rabi', minimum_support_price: '5650.00', quantity_unit: 'quintal', is_active: 1 },
    { crop_id: 4, crop_code: 'BAJ', crop_name_en: 'Bajra', crop_name_hi: 'बाजरा', procurement_season: 'Kharif', minimum_support_price: '2500.00', quantity_unit: 'quintal', is_active: 1 },
    { crop_id: 5, crop_code: 'MAI', crop_name_en: 'Maize', crop_name_hi: 'मक्का', procurement_season: 'Kharif', minimum_support_price: '2090.00', quantity_unit: 'quintal', is_active: 1 }
  ];

  const centres = [
    {
      centre_id: 1,
      centre_code: 'KRL-001',
      centre_name: 'Karnal Grain Mandi',
      address_line: 'GT Road, Sector 12',
      district: 'Karnal',
      state: 'Haryana',
      pincode: '132001',
      latitude: '29.6857',
      longitude: '76.9905',
      opening_time: '08:00:00',
      closing_time: '17:00:00',
      physical_daily_capacity: 100,
      centre_status: 'open',
      crop_ids: '1,2,3',
      available_slots: 42
    },
    {
      centre_id: 2,
      centre_code: 'ASD-002',
      centre_name: 'Assandh Procurement Centre',
      address_line: 'Safidon Road, Assandh',
      district: 'Karnal',
      state: 'Haryana',
      pincode: '132039',
      latitude: '29.5167',
      longitude: '76.6000',
      opening_time: '07:30:00',
      closing_time: '16:00:00',
      physical_daily_capacity: 80,
      centre_status: 'open',
      crop_ids: '1,2',
      available_slots: 28
    },
    {
      centre_id: 3,
      centre_code: 'NLK-003',
      centre_name: 'Nilokheri Farmer Centre',
      address_line: 'Railway Road, Nilokheri',
      district: 'Karnal',
      state: 'Haryana',
      pincode: '132117',
      latitude: '29.8333',
      longitude: '76.9167',
      opening_time: '08:00:00',
      closing_time: '16:30:00',
      physical_daily_capacity: 60,
      centre_status: 'busy',
      crop_ids: '1,3,4',
      available_slots: 14
    },
    {
      centre_id: 4,
      centre_code: 'PNP-004',
      centre_name: 'Panipat Kisan Seva Kendra',
      address_line: 'Sanauli Road, Panipat',
      district: 'Panipat',
      state: 'Haryana',
      pincode: '132103',
      latitude: '29.3909',
      longitude: '76.9635',
      opening_time: '09:00:00',
      closing_time: '17:00:00',
      physical_daily_capacity: 50,
      centre_status: 'closed',
      crop_ids: '1,2,5',
      available_slots: 0
    }
  ];

  const centreCrops = [
    { centre_id: 1, crop_id: 1 }, { centre_id: 1, crop_id: 2 }, { centre_id: 1, crop_id: 3 },
    { centre_id: 2, crop_id: 1 }, { centre_id: 2, crop_id: 2 },
    { centre_id: 3, crop_id: 1 }, { centre_id: 3, crop_id: 3 }, { centre_id: 3, crop_id: 4 },
    { centre_id: 4, crop_id: 1 }, { centre_id: 4, crop_id: 2 }, { centre_id: 4, crop_id: 5 }
  ];

  const schedules = [
    { schedule_id: 1, centre_id: 1, crop_id: 1, procurement_date: today(), start_time: '09:00:00', end_time: '11:00:00', capacity: 30, booked_slots: 18, booked_count: 18, schedule_status: 'published' },
    { schedule_id: 2, centre_id: 1, crop_id: 1, procurement_date: today(), start_time: '11:30:00', end_time: '13:30:00', capacity: 30, booked_slots: 22, booked_count: 22, schedule_status: 'published' },
    { schedule_id: 3, centre_id: 1, crop_id: 2, procurement_date: addDays(1), start_time: '09:00:00', end_time: '11:00:00', capacity: 25, booked_slots: 10, booked_count: 10, schedule_status: 'published' },
    { schedule_id: 4, centre_id: 1, crop_id: 1, procurement_date: addDays(1), start_time: '13:00:00', end_time: '15:00:00', capacity: 30, booked_slots: 15, booked_count: 15, schedule_status: 'published' },
    { schedule_id: 5, centre_id: 2, crop_id: 1, procurement_date: today(), start_time: '08:00:00', end_time: '10:00:00', capacity: 20, booked_slots: 8, booked_count: 8, schedule_status: 'published' },
    { schedule_id: 6, centre_id: 2, crop_id: 2, procurement_date: addDays(2), start_time: '10:00:00', end_time: '12:00:00', capacity: 20, booked_slots: 12, booked_count: 12, schedule_status: 'published' },
    { schedule_id: 7, centre_id: 3, crop_id: 3, procurement_date: addDays(1), start_time: '08:30:00', end_time: '10:30:00', capacity: 20, booked_slots: 14, booked_count: 14, schedule_status: 'published' },
    { schedule_id: 8, centre_id: 1, crop_id: 3, procurement_date: addDays(2), start_time: '09:00:00', end_time: '11:00:00', capacity: 25, booked_slots: 5, booked_count: 5, schedule_status: 'published' }
  ];

  const appointments = [
    {
      appointment_id: 1,
      booking_reference: 'AP-2609-1842',
      farmer_id: 1,
      schedule_id: 1,
      centre_id: 1,
      crop_id: 1,
      estimated_quantity: '22.500',
      booking_status: 'confirmed',
      created_at: nowIso(),
      token_number: 'W-018'
    },
    {
      appointment_id: 2,
      booking_reference: 'AP-2608-0912',
      farmer_id: 1,
      schedule_id: 1,
      centre_id: 1,
      crop_id: 1,
      estimated_quantity: '18.250',
      booking_status: 'completed',
      created_at: '2026-10-20T10:00:00.000Z',
      token_number: 'W-009'
    }
  ];

  const queueTokens = [
    {
      token_id: 101,
      appointment_id: 991,
      centre_id: 1,
      crop_id: 1,
      queue_date: today(),
      token_number: 'W-014',
      queue_status: 'in_service',
      check_in_time: '2026-10-23T08:45:00.000Z',
      service_started_at: '2026-10-23T08:55:00.000Z',
      farmers_ahead: 0,
      estimated_wait_minutes: 0,
      estimate_updated_at: nowIso(),
      farmer_name: 'Baljit Singh',
      updated_at: nowIso()
    },
    {
      token_id: 102,
      appointment_id: 992,
      centre_id: 1,
      crop_id: 1,
      queue_date: today(),
      token_number: 'W-015',
      queue_status: 'called',
      check_in_time: '2026-10-23T08:50:00.000Z',
      service_started_at: null,
      farmers_ahead: 0,
      estimated_wait_minutes: 2,
      estimate_updated_at: nowIso(),
      farmer_name: 'Sukhdev Singh',
      updated_at: nowIso()
    },
    {
      token_id: 103,
      appointment_id: 993,
      centre_id: 1,
      crop_id: 1,
      queue_date: today(),
      token_number: 'W-016',
      queue_status: 'waiting',
      check_in_time: '2026-10-23T08:52:00.000Z',
      service_started_at: null,
      farmers_ahead: 1,
      estimated_wait_minutes: 10,
      estimate_updated_at: nowIso(),
      farmer_name: 'Kuldeep Yadav',
      updated_at: nowIso()
    },
    {
      token_id: 104,
      appointment_id: 994,
      centre_id: 1,
      crop_id: 1,
      queue_date: today(),
      token_number: 'W-017',
      queue_status: 'waiting',
      check_in_time: '2026-10-23T08:55:00.000Z',
      service_started_at: null,
      farmers_ahead: 2,
      estimated_wait_minutes: 18,
      estimate_updated_at: nowIso(),
      farmer_name: 'Dharmendra Malik',
      updated_at: nowIso()
    },
    {
      token_id: 105,
      appointment_id: 1,
      centre_id: 1,
      crop_id: 1,
      queue_date: today(),
      token_number: 'W-018',
      queue_status: 'waiting',
      check_in_time: '2026-10-23T08:58:00.000Z',
      service_started_at: null,
      farmers_ahead: 3,
      estimated_wait_minutes: 24,
      estimate_updated_at: nowIso(),
      farmer_name: 'Narayan Kumawat',
      updated_at: nowIso()
    }
  ];

  const queueControls = [
    {
      control_id: 1,
      centre_id: 1,
      crop_id: 1,
      queue_date: today(),
      queue_state: 'running',
      active_counters: 2,
      average_service_minutes: 8,
      updated_at: nowIso()
    }
  ];

  const transactions = [
    {
      transaction_id: 1,
      appointment_id: 2,
      transaction_reference: 'TX-2608-0912',
      transaction_status: 'payment_completed',
      actual_quantity: '18.250',
      accepted_quantity: '18.250',
      rate: '2275.00',
      deduction_amount: '0.00',
      gross_amount: '41518.75',
      total_amount: '41518.75',
      created_at: '2026-10-20T11:30:00.000Z',
      farmer_name: 'Narayan Kumawat'
    }
  ];

  const paymentRecords = [
    {
      record_id: 1,
      transaction_id: 1,
      payment_status: 'completed',
      amount: '41518.75',
      verification_source: 'PFMS_DIRECT_DBT',
      provider_reference: 'DBT-2026-8849102',
      created_at: '2026-10-20T12:00:00.000Z'
    }
  ];

  const notifications = [
    {
      notification_id: 1,
      user_id: 1,
      title: 'Digital Token W-018 Active',
      message: 'Your token W-018 for Karnal Grain Mandi is active. Current serving token is W-014.',
      type: 'success',
      read_at: null,
      created_at: nowIso()
    },
    {
      notification_id: 2,
      user_id: 1,
      title: 'Arrival Reminder',
      message: 'Please arrive at Gate 2 of Karnal Grain Mandi 20 minutes before your slot.',
      type: 'info',
      read_at: null,
      created_at: nowIso()
    },
    {
      notification_id: 3,
      user_id: 1,
      title: 'Direct Bank Payment Credited',
      message: 'MSP settlement of ₹41,518.75 for 18.25 quintals of Wheat has been credited to your bank account.',
      type: 'success',
      read_at: '2026-10-21T09:00:00.000Z',
      created_at: '2026-10-20T12:00:00.000Z'
    }
  ];

  const predictions = [
    {
      prediction_id: 1,
      centre_id: 1,
      crop_id: 1,
      prediction_type: 'demand',
      target_date: addDays(1),
      prediction_value: '76',
      lower_bound: '68',
      upper_bound: '84',
      method: 'model',
      model_version: 'rf-demand-v1.0.0',
      created_at: nowIso(),
      centre_name: 'Karnal Grain Mandi',
      crop_name_en: 'Wheat'
    },
    {
      prediction_id: 2,
      centre_id: 1,
      crop_id: 1,
      prediction_type: 'waiting_time',
      target_date: today(),
      prediction_value: '22',
      lower_bound: '16',
      upper_bound: '28',
      method: 'model',
      model_version: 'gb-waiting-v1.0.0',
      created_at: nowIso(),
      centre_name: 'Karnal Grain Mandi',
      crop_name_en: 'Wheat'
    }
  ];

  const recommendations = [
    {
      recommendation_id: 1,
      prediction_id: 1,
      centre_id: 1,
      crop_id: 1,
      recommendation_type: 'add_window',
      predicted_demand: '76',
      available_capacity: 55,
      capacity_gap: 21,
      reason: 'Predicted arrivals (76) exceed scheduled capacity (55). Mandi has 45 physical headroom slots.',
      recommendation_status: 'pending',
      created_at: nowIso(),
      centre_name: 'Karnal Grain Mandi',
      crop_name_en: 'Wheat'
    }
  ];

  const auditLogs = [];
  const otpChallenges = [];
  const refreshSessions = [];

  return {
    users,
    farmers,
    officerAssignments,
    crops,
    centres,
    centreCrops,
    schedules,
    appointments,
    queueTokens,
    queueControls,
    transactions,
    paymentRecords,
    notifications,
    predictions,
    recommendations,
    auditLogs,
    otpChallenges,
    refreshSessions,
    autoIncrement: {
      user: 10,
      farmer: 10,
      schedule: 20,
      appointment: 100,
      token: 200,
      transaction: 50,
      payment: 50,
      notification: 50,
      prediction: 20,
      recommendation: 20,
      audit: 500
    }
  };
}

let store = createInitialStore();

function executeMemoryQuery(sql, values = []) {
  const norm = sql.trim().replace(/\s+/g, ' ');

  // 1. Health check
  if (norm.startsWith('SELECT 1 AS healthy') || norm === 'SELECT 1' || norm.startsWith('SELECT 1 AS')) {
    return [[{ healthy: 1 }]];
  }

  // 2. Users & Authentication
  if (norm.includes('FROM users u LEFT JOIN farmers f ON f.user_id = u.user_id')) {
    if (norm.includes('WHERE u.user_id = ?')) {
      const userId = Number(values[0]);
      const user = store.users.find((u) => u.user_id === userId);
      if (!user) return [[]];
      const farmer = store.farmers.find((f) => f.user_id === user.user_id) || {};
      return [[{ ...user, ...farmer }]];
    }

    const val = String(values[0] || '').trim();
    const digits = val.replace(/\D/g, '');
    let user = store.users.find((u) => u.phone === val || (digits.length >= 10 && u.phone === digits) || u.email?.toLowerCase() === val.toLowerCase() || u.role?.toLowerCase() === val.toLowerCase());
    let farmer;
    if (!user) {
      farmer = store.farmers.find((f) => f.farmer_code?.toLowerCase() === val.toLowerCase());
      if (farmer) user = store.users.find((u) => u.user_id === farmer.user_id);
    } else {
      farmer = store.farmers.find((f) => f.user_id === user.user_id);
    }
    if (!user) return [[]];
    return [[{ ...user, ...(farmer || {}) }]];
  }

  if (norm.includes('INSERT INTO users')) {
    const id = ++store.autoIncrement.user;
    const [fullName, phone, passwordHash, role = 'farmer', accountStatus = 'active'] = values;
    const newUser = {
      user_id: id,
      full_name: fullName,
      phone: String(phone).replace(/\D/g, ''),
      password_hash: passwordHash,
      role,
      account_status: accountStatus,
      phone_verified_at: accountStatus === 'active' ? nowIso() : null,
      failed_login_count: 0,
      locked_until: null,
      last_login_at: null
    };
    store.users.push(newUser);
    return [{ insertId: id, affectedRows: 1 }];
  }

  if (norm.includes('INSERT INTO farmers')) {
    const id = ++store.autoIncrement.farmer;
    const [farmerCode, userId, village, district, state, preferredLanguage] = values;
    const newFarmer = {
      farmer_id: id,
      farmer_code: farmerCode,
      user_id: Number(userId),
      village,
      district,
      state,
      preferred_language: preferredLanguage || 'en',
      preferred_centre_id: null
    };
    store.farmers.push(newFarmer);
    return [{ insertId: id, affectedRows: 1 }];
  }

  if (norm.includes('INSERT INTO otp_challenges')) {
    const [challengeId, phone, purpose, otpHash, providerName, maxAttempts, expiresAt] = values;
    store.otpChallenges.push({
      challenge_id: challengeId,
      phone: String(phone).replace(/\D/g, ''),
      purpose,
      otp_hash: otpHash,
      provider_name: providerName,
      delivery_status: 'submitted',
      attempts_used: 0,
      maximum_attempts: maxAttempts || 5,
      expires_at: expiresAt,
      consumed_at: null
    });
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('UPDATE otp_challenges SET provider_name = ?')) {
    const [provName, provMsgId, deliveryStatus, failedReason, challengeId] = values;
    const challenge = store.otpChallenges.find((c) => c.challenge_id === challengeId);
    if (challenge) {
      challenge.provider_name = provName;
      challenge.provider_message_id = provMsgId;
      challenge.delivery_status = deliveryStatus;
      challenge.failed_reason = failedReason;
    }
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('FROM otp_challenges WHERE challenge_id = ?')) {
    const challengeId = values[0];
    const item = store.otpChallenges.find((c) => c.challenge_id === challengeId);
    return [item ? [item] : []];
  }

  if (norm.includes('UPDATE otp_challenges SET attempts_used = attempts_used + 1')) {
    const challengeId = values[0];
    const item = store.otpChallenges.find((c) => c.challenge_id === challengeId);
    if (item) item.attempts_used += 1;
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('UPDATE otp_challenges SET consumed_at =')) {
    const challengeId = values[0];
    const item = store.otpChallenges.find((c) => c.challenge_id === challengeId);
    if (item) item.consumed_at = nowIso();
    return [{ affectedRows: 1 }];
  }

  if (norm.includes("UPDATE users SET account_status = 'active'")) {
    const phone = String(values[0]).replace(/\D/g, '');
    const user = store.users.find((u) => u.phone === phone);
    if (user) {
      user.account_status = 'active';
      user.phone_verified_at = nowIso();
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  if (norm.includes('UPDATE users SET last_login_at =')) {
    const userId = Number(values[0]);
    const user = store.users.find((u) => u.user_id === userId);
    if (user) {
      user.last_login_at = nowIso();
      user.failed_login_count = 0;
      user.locked_until = null;
    }
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('UPDATE users SET failed_login_count =')) {
    const [shouldLock, userId] = values;
    const user = store.users.find((u) => u.user_id === Number(userId));
    if (user) {
      user.failed_login_count += 1;
      if (shouldLock) user.locked_until = new Date(Date.now() + 15 * 60000).toISOString();
    }
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('INSERT INTO auth_refresh_sessions')) {
    const [sessionId, userId, tokenHash, userAgent, ipAddress, expiresAt] = values;
    store.refreshSessions.push({
      session_id: sessionId,
      user_id: Number(userId),
      token_hash: tokenHash,
      user_agent: userAgent,
      ip_address: ipAddress,
      expires_at: expiresAt,
      revoked_at: null
    });
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('FROM auth_refresh_sessions s JOIN users u ON u.user_id = s.user_id WHERE s.token_hash = ?')) {
    const tokenHash = values[0];
    const session = store.refreshSessions.find((s) => s.token_hash === tokenHash);
    if (!session) return [[]];
    const user = store.users.find((u) => u.user_id === session.user_id) || {};
    return [[{ ...session, role: user.role, account_status: user.account_status }]];
  }

  if (norm.includes('UPDATE auth_refresh_sessions SET revoked_at =')) {
    const sessionId = values[0];
    const s = store.refreshSessions.find((x) => x.session_id === sessionId);
    if (s) s.revoked_at = nowIso();
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('UPDATE users SET full_name = ? WHERE user_id = ?')) {
    const [name, userId] = values;
    const u = store.users.find((x) => x.user_id === Number(userId));
    if (u) u.full_name = name;
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('UPDATE farmers SET village = ?')) {
    const [village, district, state, lang, centreId, userId] = values;
    const f = store.farmers.find((x) => x.user_id === Number(userId));
    if (f) {
      f.village = village;
      f.district = district;
      f.state = state;
      f.preferred_language = lang;
      f.preferred_centre_id = centreId;
    }
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('INSERT INTO officer_assignments')) {
    const [userId, centreId] = values;
    store.officerAssignments.push({
      assignment_id: store.officerAssignments.length + 1,
      user_id: Number(userId),
      centre_id: Number(centreId),
      assignment_status: 'active',
      ended_at: null
    });
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('FROM officer_assignments WHERE user_id = ?')) {
    const userId = Number(values[0]);
    const assignments = store.officerAssignments.filter((a) => a.user_id === userId && a.assignment_status === 'active');
    return [assignments.map((a) => a.centre_id)];
  }

  // 3. Crops
  if (norm.includes('FROM crops') && norm.includes('SELECT crop_id')) {
    return [store.crops.filter((c) => c.is_active === 1)];
  }

  // 4. Centres
  if (norm.includes('FROM procurement_centres c')) {
    let rows = store.centres.map((c) => {
      const activeSchedules = store.schedules.filter((s) => s.centre_id === c.centre_id && s.schedule_status === 'published');
      const available_slots = activeSchedules.reduce((acc, s) => acc + (s.capacity - s.booked_slots), 0);
      return { ...c, available_slots };
    });

    if (norm.includes("c.centre_status <> 'closed'")) {
      // keep unless officer or admin view
    }

    if (values[0]) {
      const cropId = String(values[0]);
      rows = rows.filter((c) => String(c.crop_ids).split(',').includes(cropId));
    }
    return [rows];
  }

  if (norm.includes('FROM procurement_centres WHERE centre_id = ?')) {
    const centreId = Number(values[0]);
    const centre = store.centres.find((c) => c.centre_id === centreId);
    return [centre ? [centre] : []];
  }

  if (norm.includes('UPDATE procurement_centres SET centre_status = ?')) {
    const [status, centreId] = values;
    const c = store.centres.find((x) => x.centre_id === Number(centreId));
    if (c) c.centre_status = status;
    return [{ affectedRows: 1 }];
  }

  // 5. Schedules
  if (norm.includes('FROM procurement_schedules s') && norm.includes('JOIN procurement_centres c')) {
    let rows = store.schedules.map((s) => {
      const centre = store.centres.find((c) => c.centre_id === s.centre_id) || {};
      const crop = store.crops.find((cr) => cr.crop_id === s.crop_id) || {};
      return {
        ...s,
        centre_name: centre.centre_name,
        crop_name_en: crop.crop_name_en,
        crop_name_hi: crop.crop_name_hi,
        remaining_capacity: s.capacity - s.booked_slots,
        available_slots: s.capacity - s.booked_slots
      };
    });
    return [rows];
  }

  if (norm.includes('FROM procurement_schedules s WHERE s.schedule_id = ?')) {
    const id = Number(values[0]);
    const s = store.schedules.find((x) => x.schedule_id === id);
    if (!s) return [[]];
    const centre = store.centres.find((c) => c.centre_id === s.centre_id) || {};
    const crop = store.crops.find((cr) => cr.crop_id === s.crop_id) || {};
    return [[{
      ...s,
      centre_name: centre.centre_name,
      centre_status: centre.centre_status,
      crop_name_en: crop.crop_name_en,
      crop_name_hi: crop.crop_name_hi,
      crop_code: crop.crop_code,
      centre_code: centre.centre_code
    }]];
  }

  if (norm.includes('INSERT INTO procurement_schedules')) {
    const id = ++store.autoIncrement.schedule;
    const [centreId, cropId, date, start, end, capacity, status = 'published'] = values;
    const newSch = {
      schedule_id: id,
      centre_id: Number(centreId),
      crop_id: Number(cropId),
      procurement_date: date,
      start_time: start,
      end_time: end,
      capacity: Number(capacity),
      booked_slots: 0,
      booked_count: 0,
      schedule_status: status
    };
    store.schedules.push(newSch);
    return [{ insertId: id, affectedRows: 1 }];
  }

  if (norm.includes('UPDATE procurement_schedules SET booked_slots = booked_slots + 1') ||
      norm.includes('UPDATE procurement_schedules SET booked_count = booked_count + 1')) {
    const id = Number(values[0]);
    const s = store.schedules.find((x) => x.schedule_id === id);
    if (s && s.booked_slots < s.capacity) {
      s.booked_slots += 1;
      s.booked_count += 1;
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  if (norm.includes('UPDATE procurement_schedules SET booked_slots = booked_slots - 1') ||
      norm.includes('UPDATE procurement_schedules SET booked_count = booked_count - 1')) {
    const id = Number(values[0]);
    const s = store.schedules.find((x) => x.schedule_id === id);
    if (s && s.booked_slots > 0) {
      s.booked_slots -= 1;
      s.booked_count -= 1;
    }
    return [{ affectedRows: 1 }];
  }

  // 6. Appointments
  if (norm.includes('FROM farmers WHERE user_id = ? LIMIT 1')) {
    const userId = Number(values[0]);
    const f = store.farmers.find((x) => x.user_id === userId);
    return [f ? [f] : []];
  }

  if (norm.includes('FROM appointments a') && norm.includes('WHERE a.farmer_id = ?')) {
    const farmerId = Number(values[0]);
    const apps = store.appointments.filter((a) => a.farmer_id === farmerId).map((a) => {
      const centre = store.centres.find((c) => c.centre_id === a.centre_id) || {};
      const crop = store.crops.find((cr) => cr.crop_id === a.crop_id) || {};
      const schedule = store.schedules.find((s) => s.schedule_id === a.schedule_id) || {};
      return {
        ...a,
        centre_name: centre.centre_name,
        crop_name_en: crop.crop_name_en,
        crop_name_hi: crop.crop_name_hi,
        procurement_date: schedule.procurement_date || today(),
        start_time: schedule.start_time || '09:00:00',
        end_time: schedule.end_time || '11:00:00',
        quantity_unit: crop.quantity_unit || 'quintal'
      };
    });
    return [apps];
  }

  if (norm.includes('FROM appointments WHERE farmer_id = ? AND schedule_id = ?')) {
    const [farmerId, scheduleId] = values;
    const existing = store.appointments.find((a) => a.farmer_id === Number(farmerId) && a.schedule_id === Number(scheduleId) && a.booking_status !== 'cancelled');
    return [existing ? [existing] : []];
  }

  if (norm.includes('FROM appointments WHERE appointment_id = ?')) {
    const id = Number(values[0]);
    const a = store.appointments.find((x) => x.appointment_id === id);
    return [a ? [a] : []];
  }

  if (norm.includes('INSERT INTO appointments')) {
    const id = ++store.autoIncrement.appointment;
    const [ref, farmerId, scheduleId, centreId, cropId, quantity, status = 'confirmed'] = values;
    const newApp = {
      appointment_id: id,
      booking_reference: ref,
      farmer_id: Number(farmerId),
      schedule_id: Number(scheduleId),
      centre_id: Number(centreId),
      crop_id: Number(cropId),
      estimated_quantity: String(quantity),
      booking_status: status,
      created_at: nowIso(),
      token_number: `W-${String(id).padStart(3, '0')}`
    };
    store.appointments.push(newApp);
    return [{ insertId: id, affectedRows: 1 }];
  }

  if (norm.includes("UPDATE appointments SET booking_status = 'cancelled'")) {
    const id = Number(values[2]);
    const a = store.appointments.find((x) => x.appointment_id === id);
    if (a) a.booking_status = 'cancelled';
    const tok = store.queueTokens.find((t) => t.appointment_id === id);
    if (tok) tok.queue_status = 'cancelled';
    return [{ affectedRows: 1 }];
  }

  if (norm.includes('UPDATE appointments SET schedule_id = ?')) {
    const [schId, qty, id] = values;
    const a = store.appointments.find((x) => x.appointment_id === Number(id));
    if (a) {
      a.schedule_id = Number(schId);
      a.estimated_quantity = String(qty);
    }
    return [{ affectedRows: 1 }];
  }

  // 7. Queue
  if (norm.includes('INSERT INTO queue_tokens')) {
    const id = ++store.autoIncrement.token;
    const [appointmentId, centreId, cropId, date, tokenNum, priorityRank = 1] = values;
    store.queueTokens.push({
      token_id: id,
      appointment_id: Number(appointmentId),
      centre_id: Number(centreId),
      crop_id: Number(cropId),
      queue_date: date,
      token_number: tokenNum,
      queue_status: 'waiting',
      check_in_time: nowIso(),
      service_started_at: null,
      farmers_ahead: store.queueTokens.filter((t) => t.centre_id === Number(centreId) && t.queue_status === 'waiting').length,
      estimated_wait_minutes: 15,
      estimate_updated_at: nowIso(),
      updated_at: nowIso()
    });
    return [{ insertId: id, affectedRows: 1 }];
  }

  if (norm.includes('FROM queue_tokens qt') && norm.includes('WHERE f.farmer_id = ?')) {
    const farmerId = Number(values[0]);
    const farmerApps = store.appointments.filter((a) => a.farmer_id === farmerId).map((a) => a.appointment_id);
    const tokens = store.queueTokens.filter((t) => farmerApps.includes(t.appointment_id) && t.queue_status !== 'cancelled').map((t) => {
      const centre = store.centres.find((c) => c.centre_id === t.centre_id) || {};
      const crop = store.crops.find((cr) => cr.crop_id === t.crop_id) || {};
      return {
        ...t,
        centre_name: centre.centre_name,
        crop_name_en: crop.crop_name_en,
        crop_name_hi: crop.crop_name_hi
      };
    });
    return [tokens];
  }

  if (norm.includes('FROM queue_tokens qt') && norm.includes('WHERE qt.centre_id = ?')) {
    const centreId = Number(values[0]);
    const tokens = store.queueTokens.filter((t) => t.centre_id === centreId).map((t) => {
      const app = store.appointments.find((a) => a.appointment_id === t.appointment_id) || {};
      const farmer = store.farmers.find((f) => f.farmer_id === app.farmer_id) || {};
      const user = store.users.find((u) => u.user_id === farmer.user_id) || {};
      return {
        ...t,
        farmer_name: t.farmer_name || user.full_name || 'Farmer',
        booking_reference: app.booking_reference
      };
    });
    return [tokens];
  }

  if (norm.includes('FROM queue_tokens WHERE token_id = ?') || norm.includes('WHERE qt.token_id = ?')) {
    const id = Number(values[0]);
    const t = store.queueTokens.find((x) => x.token_id === id);
    if (!t) return [[]];
    const app = store.appointments.find((a) => a.appointment_id === t.appointment_id) || {};
    const centre = store.centres.find((c) => c.centre_id === t.centre_id) || {};
    const crop = store.crops.find((cr) => cr.crop_id === t.crop_id) || {};
    return [[{
      ...t,
      appointment_id: app.appointment_id,
      booking_status: app.booking_status || 'confirmed',
      centre_name: centre.centre_name,
      crop_name_en: crop.crop_name_en,
      crop_name_hi: crop.crop_name_hi,
      farmer_user_id: 1
    }]];
  }

  if (norm.includes('SELECT qt.token_id FROM queue_tokens qt')) {
    const centreId = Number(values[0]);
    const waiting = store.queueTokens.filter((t) => t.centre_id === centreId && t.queue_status === 'waiting');
    return [waiting.slice(0, 1).map((t) => ({ token_id: t.token_id }))];
  }

  if (norm.includes('UPDATE queue_tokens SET queue_status =')) {
    const status = values[0];
    const tokenId = Number(values[2] || values[1]);
    const t = store.queueTokens.find((x) => x.token_id === tokenId);
    if (t) {
      t.queue_status = status;
      t.updated_at = nowIso();
      if (status === 'in_service') t.service_started_at = nowIso();
      if (status === 'called') t.called_at = nowIso();
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  if (norm.includes('centre_queue_controls') || norm.includes('queue_controls')) {
    const centreId = Number(values[0] || 1);
    let ctrl = store.queueControls.find((c) => c.centre_id === centreId);
    if (!ctrl) {
      ctrl = {
        centre_id: centreId,
        queue_date: today(),
        queue_state: 'running',
        active_counters: 2,
        average_service_minutes: 8
      };
      store.queueControls.push(ctrl);
    }
    return [[ctrl]];
  }

  if (norm.includes('INSERT INTO centre_queue_controls') || norm.includes('INSERT INTO queue_controls') || norm.includes('INSERT INTO queue_events')) {
    return [{ affectedRows: 1 }];
  }

  // 8. Transactions
  if (norm.includes('FROM procurement_transactions pt') && norm.includes('WHERE f.user_id = ?')) {
    const userId = Number(values[0]);
    const farmer = store.farmers.find((f) => f.user_id === userId);
    if (!farmer) return [[]];
    const farmerApps = store.appointments.filter((a) => a.farmer_id === farmer.farmer_id).map((a) => a.appointment_id);
    const txs = store.transactions.filter((tx) => farmerApps.includes(tx.appointment_id)).map((tx) => {
      const app = store.appointments.find((a) => a.appointment_id === tx.appointment_id) || {};
      const centre = store.centres.find((c) => c.centre_id === app.centre_id) || {};
      const crop = store.crops.find((cr) => cr.crop_id === app.crop_id) || {};
      const payment = store.paymentRecords.find((p) => p.transaction_id === tx.transaction_id) || {};
      return {
        ...tx,
        booking_reference: app.booking_reference,
        centre_name: centre.centre_name,
        crop_name_en: crop.crop_name_en,
        crop_name_hi: crop.crop_name_hi,
        payment_status: payment.payment_status || 'completed'
      };
    });
    return [txs];
  }

  if (norm.includes('FROM procurement_transactions pt') && norm.includes('WHERE s.centre_id = ?')) {
    return [store.transactions];
  }

  if (norm.includes('INSERT INTO procurement_transactions')) {
    const id = ++store.autoIncrement.transaction;
    const [appointmentId, status = 'accepted', qty, notes] = values;
    store.transactions.push({
      transaction_id: id,
      appointment_id: Number(appointmentId),
      transaction_reference: `TX-${Date.now().toString().slice(-8)}`,
      transaction_status: status,
      actual_quantity: String(qty),
      accepted_quantity: String(qty),
      rate: '2275.00',
      total_amount: String(Number(qty) * 2275),
      created_at: nowIso()
    });
    return [{ insertId: id, affectedRows: 1 }];
  }

  if (norm.includes('INSERT INTO payment_records')) {
    const id = ++store.autoIncrement.payment;
    const [txId, status, amount, source, ref] = values;
    store.paymentRecords.push({
      record_id: id,
      transaction_id: Number(txId),
      payment_status: status,
      amount: String(amount),
      verification_source: source,
      provider_reference: ref,
      created_at: nowIso()
    });
    return [{ insertId: id, affectedRows: 1 }];
  }

  // 9. Analytics
  if (norm.includes('FROM procurement_schedules s') && norm.includes('SUM(q.appointments)')) {
    const series = [];
    for (let i = 29; i >= 0; i--) {
      const d = addDays(-i);
      series.push({
        metric_date: d,
        centre_id: 1,
        centre_name: 'Karnal Grain Mandi',
        crop_id: 1,
        crop_name_en: 'Wheat',
        capacity: 60,
        appointments: 14 + (i % 6),
        check_ins: 13 + (i % 5),
        completed: 12 + (i % 5),
        no_shows: 1,
        average_wait_minutes: 12.5,
        procured_quantity: (28.5 + (i % 10)).toFixed(2),
        purchase_value: ((28.5 + (i % 10)) * 2275).toFixed(2)
      });
    }
    return [series];
  }

  // 10. Notifications
  if (norm.includes('FROM notification_logs WHERE user_id = ?')) {
    const userId = Number(values[0]);
    const items = store.notifications.filter((n) => n.user_id === userId);
    return [items];
  }

  if (norm.includes('INSERT INTO notification_logs')) {
    const id = ++store.autoIncrement.notification;
    const [userId, title, message, type = 'info'] = values;
    store.notifications.unshift({
      notification_id: id,
      user_id: Number(userId),
      title,
      message,
      type,
      read_at: null,
      created_at: nowIso()
    });
    return [{ insertId: id, affectedRows: 1 }];
  }

  // 11. Predictions & Recommendations
  if (norm.includes('FROM ai_prediction_logs')) {
    return [store.predictions];
  }

  if (norm.includes('INSERT INTO ai_prediction_logs')) {
    const id = ++store.autoIncrement.prediction;
    const [centreId, cropId, type, date, val, low, high, method, ver] = values;
    const newPred = {
      prediction_id: id,
      centre_id: Number(centreId),
      crop_id: Number(cropId),
      prediction_type: type,
      target_date: date,
      prediction_value: String(val),
      lower_bound: String(low),
      upper_bound: String(high),
      method,
      model_version: ver,
      created_at: nowIso(),
      centre_name: 'Karnal Grain Mandi',
      crop_name_en: 'Wheat'
    };
    store.predictions.unshift(newPred);
    return [{ insertId: id, affectedRows: 1 }];
  }

  if (norm.includes('FROM ai_capacity_recommendations')) {
    return [store.recommendations];
  }

  if (norm.includes('INSERT INTO ai_capacity_recommendations')) {
    const id = ++store.autoIncrement.recommendation;
    const [predId, centreId, cropId, type, demand, cap, gap, reason] = values;
    const newRec = {
      recommendation_id: id,
      prediction_id: Number(predId),
      centre_id: Number(centreId),
      crop_id: Number(cropId),
      recommendation_type: type,
      predicted_demand: String(demand),
      available_capacity: Number(cap),
      capacity_gap: Number(gap),
      reason,
      recommendation_status: 'pending',
      created_at: nowIso(),
      centre_name: 'Karnal Grain Mandi',
      crop_name_en: 'Wheat'
    };
    store.recommendations.unshift(newRec);
    return [{ insertId: id, affectedRows: 1 }];
  }

  if (norm.includes('UPDATE ai_capacity_recommendations SET recommendation_status = ?')) {
    const [status, recId] = values;
    const r = store.recommendations.find((x) => x.recommendation_id === Number(recId));
    if (r) r.recommendation_status = status;
    return [{ affectedRows: 1 }];
  }

  // 12. Audit Logs
  if (norm.includes('INSERT INTO audit_logs')) {
    const id = ++store.autoIncrement.audit;
    store.auditLogs.unshift({
      log_id: id,
      timestamp: nowIso(),
      metadata: values
    });
    return [{ insertId: id, affectedRows: 1 }];
  }

  // Default fallback for any unhandled queries
  return [[], []];
}

class MemoryConnection {
  async execute(sql, values) {
    return executeMemoryQuery(sql, values);
  }
  async query(sql, values) {
    return executeMemoryQuery(sql, values);
  }
  async beginTransaction() {}
  async commit() {}
  async rollback() {}
  release() {}
}

const memoryConnection = new MemoryConnection();

class MemoryPool {
  async execute(sql, values) {
    return executeMemoryQuery(sql, values);
  }
  async query(sql, values) {
    return executeMemoryQuery(sql, values);
  }
  async getConnection() {
    return memoryConnection;
  }
  async end() {}
}

const memoryPool = new MemoryPool();

function getMemoryStore() {
  return store;
}

function resetMemoryStore() {
  store = createInitialStore();
}

module.exports = {
  memoryPool,
  memoryConnection,
  getMemoryStore,
  resetMemoryStore,
  executeMemoryQuery
};
