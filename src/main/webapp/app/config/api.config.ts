const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment ? 'http://localhost:8080' : 'https://immoxperts.apeiron-tech.dev';

// External service URLs
export const EXTERNAL_URLS = {
  seloger: {
    mms: 'https://mms.seloger.com/',
    website: 'https://www.seloger.com/',
  },
  avendrealouer: {
    website: 'https://www.avendrealouer.fr/',
  },
  figaroimmo: {
    website: 'https://www.figaroimmo.com/',
  },
};

export const API_ENDPOINTS = {
  mutations: {
    byStreetAndCommune: `${API_BASE_URL}/api/mutations/mutations/by-street-and-commune`,
    search: `${API_BASE_URL}/api/mutations/search`,
    statistics: `${API_BASE_URL}/api/mutations/statistics`,
    statsByCity: `${API_BASE_URL}/api/mutations/stats/by-city`,
  },
  louer: {
    search: `${API_BASE_URL}/api/louer/search-with-filters`,
    suggestions: `${API_BASE_URL}/api/louer/suggestions`,
  },
  adresses: {
    suggestions: `${API_BASE_URL}/api/adresses/suggestions`,
  },
  management: {
    health: `${API_BASE_URL}/management/health`,
    metrics: `${API_BASE_URL}/management/jhimetrics`,
    threaddump: `${API_BASE_URL}/management/threaddump`,
    loggers: `${API_BASE_URL}/management/loggers`,
    configprops: `${API_BASE_URL}/management/configprops`,
    env: `${API_BASE_URL}/management/env`,
    info: `${API_BASE_URL}/management/info`,
  },
  account: {
    account: `${API_BASE_URL}/api/account`,
    activate: `${API_BASE_URL}/api/activate`,
  },
  authorities: `${API_BASE_URL}/api/authorities`,
  entities: {
    mutations: `${API_BASE_URL}/api/mutations`,
    lots: `${API_BASE_URL}/api/lots`,
    locals: `${API_BASE_URL}/api/locals`,
    dispositionParcelles: `${API_BASE_URL}/api/disposition-parcelles`,
    adresses: `${API_BASE_URL}/api/adresses`,
    adresseLocals: `${API_BASE_URL}/api/adresse-locals`,
    adresseDispoparcs: `${API_BASE_URL}/api/adresse-dispoparcs`,
  },
};
