const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment ? 'http://localhost:8080' : 'https://propsight.fr';

// External service URLs and logos for the 10 brands (logo = favicon, same as others)
export const EXTERNAL_URLS = {
  bienici: {
    website: 'https://www.bienici.com/',
    logo: 'https://www.bienici.com/favicon.ico',
  },
  century21: {
    website: 'https://www.century21.fr/',
    logo: 'https://www.century21.fr/favicon.ico',
  },
  figaroimmo: {
    website: 'https://www.figaroimmo.com/',
    logo: 'https://icons.duckduckgo.com/ip3/figaroimmo.com.ico',
  },
  guyhoquet: {
    website: 'https://www.guyhoquet.com/',
    logo: 'https://www.guyhoquet.com/favicon.ico',
  },
  iad: {
    website: 'https://www.iadfrance.fr/',
    logo: 'https://www.iadfrance.fr/favicon.ico',
  },
  leboncoin: {
    website: 'https://www.leboncoin.fr/',
    logo: 'https://www.leboncoin.fr/favicon.ico',
  },
  orpi: {
    website: 'https://www.orpi.com/',
    logo: 'https://www.orpi.com/favicon.ico',
  },
  paruvendu: {
    website: 'https://www.paruvendu.fr/',
    logo: 'https://www.paruvendu.fr/favicon.ico',
  },
  safti: {
    website: 'https://www.safti.fr/',
    logo: 'https://www.safti.fr/favicon.ico',
  },
  seloger: {
    mms: 'https://mms.seloger.com/',
    website: 'https://www.seloger.com/',
    logo: 'https://www.seloger.com/favicon.ico',
  },
  // Legacy / alternate names
  avendrealouer: {
    website: 'https://www.avendrealouer.fr/',
    logo: 'https://www.avendrealouer.fr/favicon.ico',
  },
};

export const API_ENDPOINTS = {
  mutations: {
    byStreetAndCommune: `${API_BASE_URL}/api/mutations/mutations/by-street-and-commune`,
    search: `${API_BASE_URL}/api/mutations/search`,
    statistics: `${API_BASE_URL}/api/mutations/statistics`,
    statsByCity: `${API_BASE_URL}/api/mutations/stats/by-city`,
  },
  location: {
    detectComplete: `${API_BASE_URL}/api/location/detect-complete`,
  },
  louer: {
    search: `${API_BASE_URL}/api/louer/search-with-filters`,
    suggestions: `${API_BASE_URL}/api/louer/suggestions`,
  },
  adresses: {
    suggestions: `${API_BASE_URL}/api/adresses/suggestions`,
    osmPlaces: `${API_BASE_URL}/api/adresses/osm-places`,
    osmReverse: `${API_BASE_URL}/api/adresses/osm-reverse`,
    frenchAddressReverse: `${API_BASE_URL}/api/adresses/french-address-reverse`,
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
  contact: {
    subscribe: `${API_BASE_URL}/api/contact/subscribe`,
  },
  authorities: `${API_BASE_URL}/api/authorities`,
  geatmapTiles: `${API_BASE_URL}/api/tiles/geatmap`,
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
