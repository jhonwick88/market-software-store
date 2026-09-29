const PLATFORM_URL = process.env.LICENSE_PLATFORM_URL || 'http://localhost:8080';
const TIMEOUT = parseInt(process.env.LICENSE_PLATFORM_TIMEOUT || '5000', 10);

async function requestPlatform(endpoint, options = {}) {
  const url = `${PLATFORM_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    clearTimeout(timeoutId);
    return { ok: false, status: 500, error: err.name === 'AbortError' ? 'Connection timeout' : err.message };
  }
}

/**
 * Check if Go License Server is reachable
 */
async function checkHealth() {
  const res = await requestPlatform('/api/v1/health', { method: 'GET' });
  return {
    online: res.ok,
    status: res.status,
    data: res.data || res.error
  };
}

/**
 * Activate a license key on Go License Platform
 * Calls: POST /api/v1/license/activate
 */
async function activateOnPlatform({ license_key, machine_fingerprint, app_version, hostname, platform }) {
  const payload = {
    license_key: (license_key || '').trim(),
    machine_fingerprint: (machine_fingerprint || '').trim(),
    app_version: app_version || '1.0.0',
    hostname: hostname || 'Client-PC',
    platform: platform || 'windows'
  };

  const res = await requestPlatform('/api/v1/license/activate', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    return { success: true, data: res.data };
  }
  return {
    success: false,
    statusCode: res.status,
    errorCode: res.data?.error_code || 'PLATFORM_ERROR',
    message: res.data?.message || res.data?.error || res.error
  };
}

/**
 * Validate license on Go License Platform
 * Calls: POST /api/v1/license/validate
 */
async function validateOnPlatform({ license_key, machine_fingerprint, token }) {
  const payload = {
    license_key: (license_key || '').trim(),
    machine_fingerprint: machine_fingerprint || '',
    token: token || ''
  };

  const res = await requestPlatform('/api/v1/license/validate', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return { success: res.ok, data: res.data, error: res.error };
}

/**
 * Request trial on Go Platform
 * Calls: POST /api/v1/license/trial
 */
async function requestTrialOnPlatform(payload) {
  const res = await requestPlatform('/api/v1/license/trial', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return { success: res.ok, data: res.data, error: res.error };
}

/**
 * Reset HWID (Unbind) on Go Platform
 * Calls: POST /api/v1/admin/licenses/:id/unbind
 */
async function unbindOnPlatform(licenseId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await requestPlatform(`/api/v1/admin/licenses/${licenseId}/unbind`, {
    method: 'POST',
    headers
  });
  return { success: res.ok, data: res.data, error: res.error };
}

/**
 * Suspend license on Go Platform
 * Calls: POST /api/v1/admin/licenses/:id/suspend
 */
async function suspendOnPlatform(licenseId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await requestPlatform(`/api/v1/admin/licenses/${licenseId}/suspend`, {
    method: 'POST',
    headers
  });
  return { success: res.ok, data: res.data, error: res.error };
}

/**
 * Resume license on Go Platform
 * Calls: POST /api/v1/admin/licenses/:id/resume
 */
async function resumeOnPlatform(licenseId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await requestPlatform(`/api/v1/admin/licenses/${licenseId}/resume`, {
    method: 'POST',
    headers
  });
  return { success: res.ok, data: res.data, error: res.error };
}

module.exports = {
  checkHealth,
  activateOnPlatform,
  validateOnPlatform,
  requestTrialOnPlatform,
  unbindOnPlatform,
  suspendOnPlatform,
  resumeOnPlatform,
  PLATFORM_URL
};
