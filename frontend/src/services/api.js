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

  async predictBird(file, apiKey = '') {
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

    const res = await fetch(`${getBaseUrl()}/api/predict`, {
      method: 'POST',
      body: formData,
      headers: headers
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.detail || `Server error ${res.status}`);
      error.isNotBird = errorData.is_bird === false;
      error.detectedObject = errorData.detected_object;
      throw error;
    }

    return await res.json();
  },

  async getSpecies(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.family && params.family !== 'all') query.append('family', params.family);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.letter && params.letter !== 'all') query.append('letter', params.letter);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);

    const res = await fetch(`${getBaseUrl()}/api/species?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch species list');
    return await res.json();
  },

  async getSpeciesDetails(speciesId) {
    const res = await fetch(`${getBaseUrl()}/api/species/${encodeURIComponent(speciesId)}`);
    if (!res.ok) throw new Error('Species details not found');
    return await res.json();
  },

  async getHistory(limit = 50, offset = 0) {
    const res = await fetch(`${getBaseUrl()}/api/history?limit=${limit}&offset=${offset}`);
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

  async getStats() {
    try {
      const res = await fetch(`${getBaseUrl()}/api/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch {
      return {
        total_classifications: 0,
        avg_confidence: 0,
        most_identified: 'None',
        supported_species_count: 100,
        taxonomic_families: 28,
        threatened_species: 12,
        model_name: 'MobileNetV2'
      };
    }
  },

  async getSampleImages() {
    try {
      const res = await fetch(`${getBaseUrl()}/api/sample-images`);
      if (!res.ok) throw new Error('Failed to fetch samples');
      return await res.json();
    } catch {
      return { samples: [] };
    }
  }
};
