/**
 * GeoJSON data for African member countries of FSU platform
 * Simplified polygons (5-10 points per country) for efficient map rendering
 */

export interface CountryGeoJSON {
  code: string;
  name: string;
  geojson: GeoJSON.Feature;
}

/**
 * Simplified GeoJSON polygons for African FSU member countries
 * Coordinates are in [longitude, latitude] format
 */
export const AFRICAN_COUNTRIES_GEOJSON: Record<string, CountryGeoJSON> = {
  CI: {
    code: 'CI',
    name: "Côte d'Ivoire",
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-8.6, 4.3], // Southwest
          [-8.3, 5.9],
          [-7.6, 7.5],
          [-6.9, 8.5],
          [-5.9, 9.8],
          [-4.0, 10.7],
          [-3.5, 9.5],
          [-2.8, 8.3],
          [-2.6, 6.9],
          [-3.0, 5.8],
          [-4.0, 5.0],
          [-6.5, 4.2],
          [-8.6, 4.3]
        ]]
      }
    }
  },

  SN: {
    code: 'SN',
    name: 'Sénégal',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-17.5, 14.5], // Northwest
          [-15.5, 16.2],
          [-13.5, 16.5],
          [-12.0, 15.5],
          [-11.5, 14.5],
          [-12.0, 13.5],
          [-13.0, 12.5],
          [-14.5, 12.3],
          [-16.0, 12.5],
          [-17.0, 13.0],
          [-17.5, 14.5]
        ]]
      }
    }
  },

  ML: {
    code: 'ML',
    name: 'Mali',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-12.2, 19.5], // Northwest
          [-10.0, 20.0],
          [-5.5, 20.5],
          [-3.0, 19.8],
          [-1.5, 18.5],
          [-0.5, 16.5],
          [-2.0, 15.0],
          [-3.5, 14.5],
          [-5.5, 14.0],
          [-7.5, 13.5],
          [-9.5, 13.0],
          [-11.5, 13.5],
          [-12.2, 15.0],
          [-12.2, 19.5]
        ]]
      }
    }
  },

  BF: {
    code: 'BF',
    name: 'Burkina Faso',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-5.8, 13.5], // West
          [-4.8, 14.2],
          [-3.5, 14.8],
          [-2.5, 14.0],
          [-2.0, 13.0],
          [-1.5, 12.0],
          [-2.0, 11.0],
          [-2.5, 10.5],
          [-3.5, 10.2],
          [-4.8, 10.5],
          [-5.5, 11.0],
          [-5.8, 12.0],
          [-5.8, 13.5]
        ]]
      }
    }
  },

  NG: {
    code: 'NG',
    name: 'Nigeria',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [2.7, 6.3], // West
          [4.0, 7.0],
          [5.5, 7.5],
          [7.0, 8.0],
          [8.5, 8.5],
          [10.0, 8.0],
          [11.5, 7.5],
          [12.5, 6.5],
          [13.5, 5.5],
          [14.5, 4.5],
          [13.5, 4.0],
          [12.0, 4.5],
          [10.5, 5.0],
          [8.5, 5.5],
          [6.5, 5.5],
          [4.5, 5.5],
          [2.7, 6.3]
        ]]
      }
    }
  },

  GH: {
    code: 'GH',
    name: 'Ghana',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-3.2, 11.0], // West
          [-2.5, 10.5],
          [-1.5, 10.0],
          [-0.5, 9.5],
          [0.2, 8.5],
          [0.8, 7.5],
          [1.0, 6.5],
          [0.5, 5.5],
          [-0.5, 5.0],
          [-1.5, 5.5],
          [-2.0, 6.5],
          [-2.5, 8.0],
          [-3.0, 9.5],
          [-3.2, 11.0]
        ]]
      }
    }
  },

  CM: {
    code: 'CM',
    name: 'Cameroun',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.5, 4.5], // Southwest
          [10.0, 5.0],
          [11.5, 5.5],
          [13.0, 6.0],
          [14.5, 7.0],
          [15.5, 8.5],
          [16.0, 10.0],
          [15.0, 11.5],
          [14.0, 12.0],
          [13.0, 12.5],
          [11.5, 12.0],
          [10.5, 11.5],
          [9.5, 10.5],
          [9.0, 9.0],
          [8.5, 7.5],
          [8.5, 4.5]
        ]]
      }
    }
  },

  CD: {
    code: 'CD',
    name: 'République Démocratique du Congo',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [12.0, -5.0], // Southwest
          [14.0, -4.0],
          [16.0, -3.0],
          [18.0, -2.0],
          [20.0, -1.0],
          [22.0, 0.0],
          [24.0, 1.0],
          [26.0, 2.0],
          [28.0, 3.0],
          [30.0, 4.0],
          [30.5, 5.5],
          [29.0, 6.5],
          [28.0, 7.5],
          [26.5, 8.0],
          [25.0, 8.5],
          [23.5, 8.0],
          [22.0, 7.0],
          [20.5, 6.0],
          [19.0, 5.0],
          [17.5, 4.0],
          [16.0, 2.5],
          [15.0, 1.0],
          [14.0, -1.0],
          [13.0, -3.0],
          [12.0, -5.0]
        ]]
      }
    }
  },

  KE: {
    code: 'KE',
    name: 'Kenya',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [34.0, 5.0], // Northwest
          [35.0, 4.5],
          [36.0, 4.0],
          [37.5, 3.5],
          [39.0, 3.0],
          [40.5, 2.5],
          [41.5, 1.5],
          [41.0, 0.0],
          [40.0, -1.0],
          [39.0, -2.0],
          [38.0, -3.0],
          [37.0, -4.5],
          [35.5, -4.0],
          [34.5, -3.0],
          [34.0, -1.5],
          [33.5, 0.5],
          [33.0, 2.0],
          [33.5, 3.5],
          [34.0, 5.0]
        ]]
      }
    }
  },

  RW: {
    code: 'RW',
    name: 'Rwanda',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [29.0, -1.5], // West
          [29.5, -1.8],
          [30.0, -2.0],
          [30.5, -1.5],
          [30.8, -1.0],
          [30.5, -0.5],
          [30.0, 0.0],
          [29.5, 0.5],
          [29.0, 0.0],
          [28.8, -0.5],
          [28.9, -1.0],
          [29.0, -1.5]
        ]]
      }
    }
  },

  UG: {
    code: 'UG',
    name: 'Ouganda',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [29.5, 3.5], // West
          [30.0, 3.0],
          [31.0, 2.5],
          [32.0, 2.0],
          [33.0, 1.8],
          [34.0, 1.5],
          [34.5, 2.5],
          [35.0, 3.5],
          [34.5, 4.0],
          [33.5, 4.2],
          [32.5, 4.0],
          [31.5, 3.8],
          [30.5, 3.5],
          [29.5, 3.5]
        ]]
      }
    }
  },

  TZ: {
    code: 'TZ',
    name: 'Tanzanie',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [29.5, -1.0], // Northwest
          [31.0, -1.5],
          [32.5, -2.0],
          [34.0, -3.0],
          [35.5, -4.5],
          [37.0, -6.0],
          [38.0, -7.5],
          [39.0, -9.0],
          [39.5, -10.5],
          [38.5, -11.5],
          [37.0, -11.0],
          [35.5, -10.5],
          [34.0, -10.0],
          [32.5, -9.0],
          [31.0, -7.5],
          [30.0, -6.0],
          [29.0, -4.5],
          [28.5, -3.0],
          [29.0, -2.0],
          [29.5, -1.0]
        ]]
      }
    }
  },

  ZA: {
    code: 'ZA',
    name: 'Afrique du Sud',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [16.5, -22.5], // West
          [18.0, -25.0],
          [20.0, -28.0],
          [22.0, -30.5],
          [24.0, -32.5],
          [26.0, -33.5],
          [28.0, -33.0],
          [30.0, -32.0],
          [31.5, -30.0],
          [32.0, -28.0],
          [31.5, -26.0],
          [30.0, -25.0],
          [28.5, -24.0],
          [27.0, -23.0],
          [25.0, -22.5],
          [22.5, -22.0],
          [20.0, -22.5],
          [18.0, -22.0],
          [16.5, -22.5]
        ]]
      }
    }
  },

  MA: {
    code: 'MA',
    name: 'Maroc',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-17.0, 21.5], // Southwest
          [-10.0, 23.0],
          [-6.0, 25.0],
          [-4.0, 28.0],
          [-3.0, 32.0],
          [-4.0, 34.0],
          [-5.5, 35.5],
          [-6.5, 35.0],
          [-8.0, 33.0],
          [-9.0, 30.0],
          [-10.0, 27.0],
          [-12.0, 24.0],
          [-14.5, 22.0],
          [-17.0, 21.5]
        ]]
      }
    }
  },

  TN: {
    code: 'TN',
    name: 'Tunisie',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-8.0, 32.0], // West
          [-7.0, 33.0],
          [-6.0, 34.0],
          [-5.0, 35.5],
          [-4.0, 36.5],
          [-3.0, 37.0],
          [-2.0, 37.5],
          [-1.0, 37.0],
          [0.0, 36.5],
          [1.0, 35.5],
          [2.0, 34.5],
          [3.0, 33.5],
          [4.0, 32.5],
          [5.0, 32.0],
          [6.0, 33.0],
          [7.0, 34.0],
          [8.0, 35.0],
          [9.0, 36.0],
          [10.0, 37.0],
          [10.5, 36.0],
          [10.0, 34.5],
          [9.0, 33.0],
          [7.0, 32.0],
          [5.0, 31.0],
          [2.0, 30.5],
          [-2.0, 30.0],
          [-5.0, 30.5],
          [-8.0, 32.0]
        ]]
      }
    }
  },

  DZ: {
    code: 'DZ',
    name: 'Algérie',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-8.5, 19.0], // Northwest
          [-5.0, 20.0],
          [-2.0, 22.0],
          [0.0, 24.0],
          [2.0, 26.0],
          [4.0, 28.0],
          [5.5, 30.0],
          [6.0, 32.0],
          [7.0, 34.0],
          [8.0, 35.5],
          [9.0, 36.5],
          [10.0, 37.0],
          [11.0, 36.0],
          [11.5, 34.0],
          [11.0, 32.0],
          [10.5, 30.0],
          [10.0, 28.0],
          [9.5, 26.0],
          [9.0, 24.0],
          [8.0, 22.0],
          [6.5, 20.5],
          [5.0, 20.0],
          [3.0, 19.5],
          [0.0, 19.0],
          [-3.0, 19.5],
          [-5.5, 19.0],
          [-8.5, 19.0]
        ]]
      }
    }
  },

  ET: {
    code: 'ET',
    name: 'Éthiopie',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [33.0, 14.5], // Northwest
          [35.0, 14.0],
          [37.0, 13.5],
          [39.0, 12.5],
          [41.0, 11.0],
          [43.0, 9.5],
          [45.0, 8.0],
          [47.0, 7.0],
          [47.5, 5.5],
          [47.0, 4.0],
          [45.5, 3.5],
          [44.0, 3.0],
          [42.0, 4.0],
          [40.0, 5.0],
          [38.0, 5.5],
          [36.5, 6.0],
          [35.0, 6.5],
          [34.0, 7.5],
          [33.0, 9.0],
          [32.5, 10.5],
          [32.0, 12.0],
          [32.5, 13.5],
          [33.0, 14.5]
        ]]
      }
    }
  },

  MZ: {
    code: 'MZ',
    name: 'Mozambique',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [30.0, -10.5], // Northwest
          [32.0, -12.0],
          [34.0, -14.0],
          [35.5, -16.0],
          [37.0, -18.0],
          [38.0, -20.0],
          [39.0, -22.0],
          [40.0, -23.5],
          [40.5, -25.5],
          [40.0, -26.0],
          [38.5, -25.5],
          [37.0, -24.5],
          [35.5, -23.0],
          [34.0, -21.0],
          [33.0, -19.0],
          [32.0, -17.0],
          [31.0, -15.0],
          [30.0, -13.0],
          [29.5, -11.5],
          [30.0, -10.5]
        ]]
      }
    }
  },

  ZM: {
    code: 'ZM',
    name: 'Zambie',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [21.5, -8.0], // West
          [23.0, -9.0],
          [24.5, -10.0],
          [26.0, -11.5],
          [27.5, -13.0],
          [29.0, -14.5],
          [30.0, -16.0],
          [31.0, -17.0],
          [32.0, -17.5],
          [33.0, -18.0],
          [33.0, -16.0],
          [32.5, -14.0],
          [32.0, -12.0],
          [31.0, -10.0],
          [30.0, -8.5],
          [28.5, -8.0],
          [27.0, -8.5],
          [25.0, -8.0],
          [23.0, -8.0],
          [21.5, -8.0]
        ]]
      }
    }
  },

  BJ: {
    code: 'BJ',
    name: 'Bénin',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [1.0, 6.3], // West
          [1.5, 7.0],
          [2.0, 8.0],
          [2.5, 9.0],
          [2.8, 10.0],
          [3.5, 10.5],
          [3.8, 11.0],
          [3.5, 11.5],
          [3.0, 11.8],
          [2.5, 11.5],
          [2.0, 10.5],
          [1.5, 9.0],
          [1.2, 7.5],
          [1.0, 6.3]
        ]]
      }
    }
  },

  TG: {
    code: 'TG',
    name: 'Togo',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-0.2, 6.0], // West
          [0.2, 6.5],
          [0.5, 7.5],
          [0.8, 8.5],
          [1.0, 9.5],
          [1.2, 10.5],
          [1.0, 11.0],
          [0.5, 10.5],
          [0.2, 9.5],
          [0.0, 8.0],
          [-0.2, 6.5],
          [-0.2, 6.0]
        ]]
      }
    }
  },

  NE: {
    code: 'NE',
    name: 'Niger',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [0.2, 13.5], // West
          [2.0, 14.0],
          [4.0, 14.5],
          [6.0, 15.0],
          [8.0, 15.5],
          [10.0, 16.0],
          [12.0, 17.0],
          [13.5, 18.0],
          [15.0, 20.0],
          [15.5, 21.5],
          [15.0, 22.0],
          [13.0, 22.5],
          [11.0, 22.0],
          [9.0, 21.5],
          [7.0, 21.0],
          [5.0, 20.5],
          [3.5, 20.0],
          [2.0, 19.0],
          [1.0, 17.5],
          [0.2, 16.0],
          [0.2, 13.5]
        ]]
      }
    }
  },

  GN: {
    code: 'GN',
    name: 'Guinée',
    geojson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-15.0, 7.5], // Northwest
          [-13.5, 8.5],
          [-12.0, 9.5],
          [-11.0, 10.5],
          [-10.5, 11.5],
          [-10.0, 12.0],
          [-9.5, 11.5],
          [-9.0, 10.5],
          [-9.5, 9.5],
          [-10.0, 8.5],
          [-11.0, 8.0],
          [-12.0, 8.2],
          [-13.0, 8.0],
          [-14.0, 7.8],
          [-15.0, 7.5]
        ]]
      }
    }
  }
};

/**
 * Helper function to get a country's GeoJSON by code
 */
export function getCountryGeoJSON(code: string): CountryGeoJSON | undefined {
  return AFRICAN_COUNTRIES_GEOJSON[code];
}

/**
 * Helper function to get all country codes
 */
export function getCountryCodes(): string[] {
  return Object.keys(AFRICAN_COUNTRIES_GEOJSON);
}

/**
 * Helper function to get all countries
 */
export function getAllCountries(): CountryGeoJSON[] {
  return Object.values(AFRICAN_COUNTRIES_GEOJSON);
}
