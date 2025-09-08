const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment ? 'https://immoxperts.apeiron-tech.dev' : 'https://immoxperts.apeiron-tech.dev';

export const API_ENDPOINTS = {
  mutations: {
    byStreetAndCommune: `${API_BASE_URL}/api/mutations/mutations/by-street-and-commune`,
    search: `${API_BASE_URL}/api/mutations/search`,
    statistics: `${API_BASE_URL}/api/mutations/statistics`,
  },
};
