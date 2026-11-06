const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('avian_api_url');
    if (saved) return saved;
    if (window.location.port === '8000' || !window.location.port) {
      return window.location.origin;
    }
  }
  return 'http://localhost:8000';
};

export const api = {
  getBaseUrl,

  async checkHealth() {
    try {
      const res = await fetch(`${getBaseUrl()}/api/health`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Health check failed:', err);
      return { status: 'offline', error: err.message };
    }
  },

  // ─── IMAGE IDENTIFICATION ───
  async identifyBird(file, apiKey = '') {
    const key = apiKey || (typeof window !== 'undefined' ? localStorage.getItem('avian_gemini_api_key') || '' : '');
    const formData = new FormData();
    formData.append('file', file);
    if (key) {
      formData.append('api_key', key);
    }

    const headers = {};
    if (key) {
      headers['X-API-Key'] = key;
    }

    const res = await fetch(`${getBaseUrl()}/api/identify/image`, {
      method: 'POST',
      body: formData,
      headers: headers
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const rawMsg = typeof errorData.detail === 'string'
        ? errorData.detail
        : (errorData.detail?.error || errorData.error || `Server error ${res.status}`);
      const error = new Error(rawMsg);
      error.isNotBird = errorData.is_bird === false ||
        rawMsg.toLowerCase().includes('no bird') ||
        rawMsg.toLowerCase().includes('invalid image') ||
        rawMsg.toLowerCase().includes('not a bird');
      error.detectedObject = errorData.detected_object || errorData.detected;
      throw error;
    }

    return await res.json();
  },

  async predictBird(file, apiKey = '') {
    return this.identifyBird(file, apiKey);
  },

  // ─── AUDIO IDENTIFICATION ───
  async identifyAudio(file, apiKey = '') {
    const key = apiKey || (typeof window !== 'undefined' ? localStorage.getItem('avian_gemini_api_key') || '' : '');
    const formData = new FormData();
    formData.append('file', file);
    if (key) {
      formData.append('api_key', key);
    }

    const headers = {};
    if (key) {
      headers['X-API-Key'] = key;
    }

    const res = await fetch(`${getBaseUrl()}/api/identify/audio`, {
      method: 'POST',
      body: formData,
      headers: headers
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const rawMsg = typeof errorData.detail === 'string'
        ? errorData.detail
        : (errorData.detail?.error || errorData.error || `Server error ${res.status}`);
      const error = new Error(rawMsg);
      error.isNotBirdSound = rawMsg.toLowerCase().includes('no bird sound') ||
        rawMsg.toLowerCase().includes('invalid audio') ||
        rawMsg.toLowerCase().includes('silent');
      throw error;
    }

    return await res.json();
  },

  // ─── SPECIES & BIRDS ENCYCLOPEDIA ───
  async getSpecies(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.family && params.family !== 'all') query.append('family', params.family);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.letter && params.letter !== 'all') query.append('letter', params.letter);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);

    const res = await fetch(`${getBaseUrl()}/api/birds?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch species list');
    return await res.json();
  },

  async getSpeciesDetails(speciesId) {
    const res = await fetch(`${getBaseUrl()}/api/birds/${encodeURIComponent(speciesId)}`);
    if (!res.ok) throw new Error('Species details not found');
    return await res.json();
  },

  // ─── IDENTIFICATION HISTORY ───
  async getHistory(params = {}) {
    const query = new URLSearchParams();
    if (params.input_type && params.input_type !== 'all') query.append('input_type', params.input_type);
    if (params.detection_status && params.detection_status !== 'all') query.append('detection_status', params.detection_status);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);

    const res = await fetch(`${getBaseUrl()}/api/history?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return await res.json();
  },

  async deleteHistoryItem(id) {
    const res = await fetch(`${getBaseUrl()}/api/history/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete history record');
    return await res.json();
  },

  async clearHistory() {
    const res = await fetch(`${getBaseUrl()}/api/history`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear history');
    return await res.json();
  },

  // ─── ADMIN METRICS & THRESHOLDS ───
  async getAdminMetrics() {
    const res = await fetch(`${getBaseUrl()}/api/admin/metrics`);
    if (!res.ok) throw new Error('Failed to fetch admin metrics');
    return await res.json();
  },

  async getStats() {
    return this.getAdminMetrics();
  },

  async getAdminThresholds() {
    const res = await fetch(`${getBaseUrl()}/api/admin/thresholds`);
    if (!res.ok) throw new Error('Failed to fetch thresholds');
    return await res.json();
  },

  async updateAdminThresholds(payload) {
    const res = await fetch(`${getBaseUrl()}/api/admin/thresholds`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update thresholds');
    return await res.json();
  },

  async getSampleImages() {
    try {
      const res = await fetch(`${getBaseUrl()}/api/sample-images`);
      if (!res.ok) return { samples: [] };
      return await res.json();
    } catch {
      return { samples: [] };
    }
  },

  // ─── AUTHENTICATION ───
  async register(name, email, password) {
    const res = await fetch(`${getBaseUrl()}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Registration failed');
    if (data.token) localStorage.setItem('avian_auth_token', data.token);
    if (data.user) localStorage.setItem('avian_user_profile', JSON.stringify(data.user));
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    if (data.token) localStorage.setItem('avian_auth_token', data.token);
    if (data.user) localStorage.setItem('avian_user_profile', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('avian_auth_token');
    localStorage.removeItem('avian_user_profile');
  },

  getStoredUser() {
    try {
      const u = localStorage.getItem('avian_user_profile');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  async getApiKeyStatus() {
    try {
      const res = await fetch(`${getBaseUrl()}/api/settings/api-key`);
      if (!res.ok) return { has_key: false, masked_key: '' };
      return await res.json();
    } catch {
      return { has_key: false, masked_key: '' };
    }
  },

  async saveApiKey(apiKey) {
    if (typeof window !== 'undefined') {
      if (apiKey) {
        localStorage.setItem('avian_gemini_api_key', apiKey.trim());
      } else {
        localStorage.removeItem('avian_gemini_api_key');
      }
    }
    try {
      const res = await fetch(`${getBaseUrl()}/api/settings/api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey || '' })
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
