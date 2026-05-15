export interface CityData {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  timezone: string;
  muslimPopulation: number; // approximate %
}

export const WORLD_CITIES: CityData[] = [
  // Middle East
  { id: "mecca", name: "Mecca", country: "Saudi Arabia", countryCode: "SA", lat: 21.4225, lng: 39.8262, timezone: "Asia/Riyadh", muslimPopulation: 100 },
  { id: "medina", name: "Medina", country: "Saudi Arabia", countryCode: "SA", lat: 24.5247, lng: 39.5692, timezone: "Asia/Riyadh", muslimPopulation: 100 },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", countryCode: "SA", lat: 24.7136, lng: 46.6753, timezone: "Asia/Riyadh", muslimPopulation: 97 },
  { id: "dubai", name: "Dubai", country: "UAE", countryCode: "AE", lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai", muslimPopulation: 76 },
  { id: "abudhabi", name: "Abu Dhabi", country: "UAE", countryCode: "AE", lat: 24.4539, lng: 54.3773, timezone: "Asia/Dubai", muslimPopulation: 76 },
  { id: "baghdad", name: "Baghdad", country: "Iraq", countryCode: "IQ", lat: 33.3152, lng: 44.3661, timezone: "Asia/Baghdad", muslimPopulation: 99 },
  { id: "tehran", name: "Tehran", country: "Iran", countryCode: "IR", lat: 35.6892, lng: 51.3890, timezone: "Asia/Tehran", muslimPopulation: 99 },
  { id: "amman", name: "Amman", country: "Jordan", countryCode: "JO", lat: 31.9454, lng: 35.9284, timezone: "Asia/Amman", muslimPopulation: 97 },
  { id: "kuwait", name: "Kuwait City", country: "Kuwait", countryCode: "KW", lat: 29.3759, lng: 47.9774, timezone: "Asia/Kuwait", muslimPopulation: 74 },
  { id: "doha", name: "Doha", country: "Qatar", countryCode: "QA", lat: 25.2854, lng: 51.5310, timezone: "Asia/Qatar", muslimPopulation: 67 },
  { id: "muscat", name: "Muscat", country: "Oman", countryCode: "OM", lat: 23.5880, lng: 58.3829, timezone: "Asia/Muscat", muslimPopulation: 85 },
  { id: "manama", name: "Manama", country: "Bahrain", countryCode: "BH", lat: 26.2154, lng: 50.5832, timezone: "Asia/Bahrain", muslimPopulation: 73 },
  { id: "beirut", name: "Beirut", country: "Lebanon", countryCode: "LB", lat: 33.8938, lng: 35.5018, timezone: "Asia/Beirut", muslimPopulation: 61 },

  // South Asia
  { id: "karachi", name: "Karachi", country: "Pakistan", countryCode: "PK", lat: 24.8607, lng: 67.0011, timezone: "Asia/Karachi", muslimPopulation: 97 },
  { id: "lahore", name: "Lahore", country: "Pakistan", countryCode: "PK", lat: 31.5204, lng: 74.3587, timezone: "Asia/Karachi", muslimPopulation: 97 },
  { id: "islamabad", name: "Islamabad", country: "Pakistan", countryCode: "PK", lat: 33.7294, lng: 73.0931, timezone: "Asia/Karachi", muslimPopulation: 97 },
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", countryCode: "BD", lat: 23.8103, lng: 90.4125, timezone: "Asia/Dhaka", muslimPopulation: 91 },
  { id: "chittagong", name: "Chittagong", country: "Bangladesh", countryCode: "BD", lat: 22.3569, lng: 91.7832, timezone: "Asia/Dhaka", muslimPopulation: 91 },
  { id: "mumbai", name: "Mumbai", country: "India", countryCode: "IN", lat: 19.0760, lng: 72.8777, timezone: "Asia/Kolkata", muslimPopulation: 14 },
  { id: "delhi", name: "Delhi", country: "India", countryCode: "IN", lat: 28.6139, lng: 77.2090, timezone: "Asia/Kolkata", muslimPopulation: 14 },
  { id: "hyderabad-in", name: "Hyderabad", country: "India", countryCode: "IN", lat: 17.3850, lng: 78.4867, timezone: "Asia/Kolkata", muslimPopulation: 14 },

  // Southeast Asia
  { id: "jakarta", name: "Jakarta", country: "Indonesia", countryCode: "ID", lat: -6.2088, lng: 106.8456, timezone: "Asia/Jakarta", muslimPopulation: 87 },
  { id: "surabaya", name: "Surabaya", country: "Indonesia", countryCode: "ID", lat: -7.2575, lng: 112.7521, timezone: "Asia/Jakarta", muslimPopulation: 87 },
  { id: "kualalumpur", name: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", lat: 3.1390, lng: 101.6869, timezone: "Asia/Kuala_Lumpur", muslimPopulation: 63 },
  { id: "singapore", name: "Singapore", country: "Singapore", countryCode: "SG", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore", muslimPopulation: 15 },
  { id: "manila", name: "Manila", country: "Philippines", countryCode: "PH", lat: 14.5995, lng: 120.9842, timezone: "Asia/Manila", muslimPopulation: 6 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", countryCode: "TH", lat: 13.7563, lng: 100.5018, timezone: "Asia/Bangkok", muslimPopulation: 5 },
  { id: "brunei", name: "Bandar Seri Begawan", country: "Brunei", countryCode: "BN", lat: 4.9031, lng: 114.9398, timezone: "Asia/Brunei", muslimPopulation: 79 },

  // Central Asia & North
  { id: "tashkent", name: "Tashkent", country: "Uzbekistan", countryCode: "UZ", lat: 41.2995, lng: 69.2401, timezone: "Asia/Tashkent", muslimPopulation: 96 },
  { id: "almaty", name: "Almaty", country: "Kazakhstan", countryCode: "KZ", lat: 43.2220, lng: 76.8512, timezone: "Asia/Almaty", muslimPopulation: 72 },
  { id: "astana", name: "Astana", country: "Kazakhstan", countryCode: "KZ", lat: 51.1605, lng: 71.4272, timezone: "Asia/Almaty", muslimPopulation: 70 },
  { id: "shymkent", name: "Shymkent", country: "Kazakhstan", countryCode: "KZ", lat: 42.3417, lng: 69.5906, timezone: "Asia/Almaty", muslimPopulation: 70 },
  { id: "ulaanbaatar", name: "Ulaanbaatar", country: "Mongolia", countryCode: "MN", lat: 47.8864, lng: 106.9057, timezone: "Asia/Ulaanbaatar", muslimPopulation: 5 },

  // Africa
  { id: "cairo", name: "Cairo", country: "Egypt", countryCode: "EG", lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo", muslimPopulation: 90 },
  { id: "lagos", name: "Lagos", country: "Nigeria", countryCode: "NG", lat: 6.5244, lng: 3.3792, timezone: "Africa/Lagos", muslimPopulation: 50 },
  { id: "kano", name: "Kano", country: "Nigeria", countryCode: "NG", lat: 12.0022, lng: 8.5920, timezone: "Africa/Lagos", muslimPopulation: 99 },
  { id: "dakar", name: "Dakar", country: "Senegal", countryCode: "SN", lat: 14.7167, lng: -17.4677, timezone: "Africa/Dakar", muslimPopulation: 95 },
  { id: "nairobi", name: "Nairobi", country: "Kenya", countryCode: "KE", lat: -1.2921, lng: 36.8219, timezone: "Africa/Nairobi", muslimPopulation: 11 },
  { id: "addis", name: "Addis Ababa", country: "Ethiopia", countryCode: "ET", lat: 9.0300, lng: 38.7400, timezone: "Africa/Addis_Ababa", muslimPopulation: 34 },
  { id: "casablanca", name: "Casablanca", country: "Morocco", countryCode: "MA", lat: 33.5731, lng: -7.5898, timezone: "Africa/Casablanca", muslimPopulation: 99 },
  { id: "tripoli", name: "Tripoli", country: "Libya", countryCode: "LY", lat: 32.8872, lng: 13.1913, timezone: "Africa/Tripoli", muslimPopulation: 97 },
  { id: "tunis", name: "Tunis", country: "Tunisia", countryCode: "TN", lat: 36.8065, lng: 10.1815, timezone: "Africa/Tunis", muslimPopulation: 99 },
  { id: "algiers", name: "Algiers", country: "Algeria", countryCode: "DZ", lat: 36.7372, lng: 3.0869, timezone: "Africa/Algiers", muslimPopulation: 99 },
  { id: "khartoum", name: "Khartoum", country: "Sudan", countryCode: "SD", lat: 15.5007, lng: 32.5599, timezone: "Africa/Khartoum", muslimPopulation: 97 },
  { id: "mogadishu", name: "Mogadishu", country: "Somalia", countryCode: "SO", lat: 2.0469, lng: 45.3182, timezone: "Africa/Mogadishu", muslimPopulation: 99 },
  { id: "accra", name: "Accra", country: "Ghana", countryCode: "GH", lat: 5.6037, lng: -0.1870, timezone: "Africa/Accra", muslimPopulation: 18 },

  // Europe & Scandinavia
  { id: "istanbul", name: "Istanbul", country: "Turkey", countryCode: "TR", lat: 41.0082, lng: 28.9784, timezone: "Europe/Istanbul", muslimPopulation: 99 },
  { id: "ankara", name: "Ankara", country: "Turkey", countryCode: "TR", lat: 39.9334, lng: 32.8597, timezone: "Europe/Istanbul", muslimPopulation: 99 },
  { id: "london", name: "London", country: "UK", countryCode: "GB", lat: 51.5074, lng: -0.1278, timezone: "Europe/London", muslimPopulation: 5 },
  { id: "paris", name: "Paris", country: "France", countryCode: "FR", lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris", muslimPopulation: 8 },
  { id: "berlin", name: "Berlin", country: "Germany", countryCode: "DE", lat: 52.5200, lng: 13.4050, timezone: "Europe/Berlin", muslimPopulation: 5 },
  { id: "oslo", name: "Oslo", country: "Norway", countryCode: "NO", lat: 59.9139, lng: 10.7522, timezone: "Europe/Oslo", muslimPopulation: 3 },
  { id: "bergen", name: "Bergen", country: "Norway", countryCode: "NO", lat: 60.3913, lng: 5.3221, timezone: "Europe/Oslo", muslimPopulation: 1 },
  { id: "tromso", name: "Tromsø", country: "Norway", countryCode: "NO", lat: 69.6492, lng: 18.9553, timezone: "Europe/Oslo", muslimPopulation: 1 },
  { id: "stockholm", name: "Stockholm", country: "Sweden", countryCode: "SE", lat: 59.3293, lng: 18.0686, timezone: "Europe/Stockholm", muslimPopulation: 8 },
  { id: "gothenburg", name: "Gothenburg", country: "Sweden", countryCode: "SE", lat: 57.7089, lng: 11.9746, timezone: "Europe/Stockholm", muslimPopulation: 5 },
  { id: "malmo", name: "Malmö", country: "Sweden", countryCode: "SE", lat: 55.6050, lng: 13.0038, timezone: "Europe/Stockholm", muslimPopulation: 20 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", countryCode: "NL", lat: 52.3676, lng: 4.9041, timezone: "Europe/Amsterdam", muslimPopulation: 5 },
  { id: "brussels", name: "Brussels", country: "Belgium", countryCode: "BE", lat: 50.8503, lng: 4.3517, timezone: "Europe/Brussels", muslimPopulation: 7 },
  
  // Russia — Western (Europe/Moscow UTC+3)
  { id: "moscow",        name: "Moscow",           country: "Russia", countryCode: "RU", lat: 55.7558, lng: 37.6176,  timezone: "Europe/Moscow",       muslimPopulation: 10 },
  { id: "st-petersburg", name: "Saint Petersburg", country: "Russia", countryCode: "RU", lat: 59.9343, lng: 30.3351,  timezone: "Europe/Moscow",       muslimPopulation:  5 },
  { id: "nizhny",        name: "Nizhny Novgorod",  country: "Russia", countryCode: "RU", lat: 56.3269, lng: 44.0059,  timezone: "Europe/Moscow",       muslimPopulation:  4 },
  { id: "kazan",         name: "Kazan",            country: "Russia", countryCode: "RU", lat: 55.7887, lng: 49.1221,  timezone: "Europe/Moscow",       muslimPopulation: 50 },
  { id: "samara",        name: "Samara",           country: "Russia", countryCode: "RU", lat: 53.1959, lng: 50.1600,  timezone: "Europe/Samara",       muslimPopulation:  4 },
  { id: "saratov",       name: "Saratov",          country: "Russia", countryCode: "RU", lat: 51.5924, lng: 46.0343,  timezone: "Europe/Saratov",      muslimPopulation:  3 },
  { id: "rostov",        name: "Rostov-on-Don",    country: "Russia", countryCode: "RU", lat: 47.2357, lng: 39.7015,  timezone: "Europe/Moscow",       muslimPopulation:  2 },
  { id: "krasnodar",     name: "Krasnodar",        country: "Russia", countryCode: "RU", lat: 45.0328, lng: 38.9769,  timezone: "Europe/Moscow",       muslimPopulation:  3 },

  // Russia — Caucasus (highest Muslim density)
  { id: "grozny",        name: "Grozny",           country: "Russia", countryCode: "RU", lat: 43.3167, lng: 45.6833,  timezone: "Europe/Moscow",       muslimPopulation: 95 },
  { id: "makhachkala",   name: "Makhachkala",      country: "Russia", countryCode: "RU", lat: 42.9833, lng: 47.5000,  timezone: "Europe/Moscow",       muslimPopulation: 90 },
  { id: "nalchik",       name: "Nalchik",          country: "Russia", countryCode: "RU", lat: 43.4985, lng: 43.6185,  timezone: "Europe/Moscow",       muslimPopulation: 70 },
  { id: "vladikavkaz",   name: "Vladikavkaz",      country: "Russia", countryCode: "RU", lat: 43.0489, lng: 44.6818,  timezone: "Europe/Moscow",       muslimPopulation: 30 },
  { id: "cherkessk",     name: "Cherkessk",        country: "Russia", countryCode: "RU", lat: 44.2267, lng: 42.0500,  timezone: "Europe/Moscow",       muslimPopulation: 55 },
  { id: "magas",         name: "Magas",            country: "Russia", countryCode: "RU", lat: 43.1700, lng: 44.8200,  timezone: "Europe/Moscow",       muslimPopulation: 98 },
  { id: "maykop",        name: "Maykop",           country: "Russia", countryCode: "RU", lat: 44.6076, lng: 40.1014,  timezone: "Europe/Moscow",       muslimPopulation: 25 },

  // Russia — Volga/Urals (UTC+4–5)
  { id: "ufa",           name: "Ufa",              country: "Russia", countryCode: "RU", lat: 54.7352, lng: 55.9587,  timezone: "Asia/Yekaterinburg",  muslimPopulation: 36 },
  { id: "perm",          name: "Perm",             country: "Russia", countryCode: "RU", lat: 58.0105, lng: 56.2502,  timezone: "Asia/Yekaterinburg",  muslimPopulation:  6 },
  { id: "yekaterinburg", name: "Yekaterinburg",    country: "Russia", countryCode: "RU", lat: 56.8389, lng: 60.6057,  timezone: "Asia/Yekaterinburg",  muslimPopulation:  2 },
  { id: "chelyabinsk",   name: "Chelyabinsk",      country: "Russia", countryCode: "RU", lat: 55.1644, lng: 61.4368,  timezone: "Asia/Yekaterinburg",  muslimPopulation:  3 },

  // Russia — Siberia (UTC+5–8)
  { id: "omsk",          name: "Omsk",             country: "Russia", countryCode: "RU", lat: 54.9885, lng: 73.3242,  timezone: "Asia/Omsk",           muslimPopulation:  2 },
  { id: "novosibirsk",   name: "Novosibirsk",      country: "Russia", countryCode: "RU", lat: 55.0084, lng: 82.9357,  timezone: "Asia/Novosibirsk",    muslimPopulation:  1 },
  { id: "tomsk",         name: "Tomsk",            country: "Russia", countryCode: "RU", lat: 56.4977, lng: 84.9744,  timezone: "Asia/Tomsk",          muslimPopulation:  2 },
  { id: "krasnoyarsk",   name: "Krasnoyarsk",      country: "Russia", countryCode: "RU", lat: 56.0105, lng: 92.8777,  timezone: "Asia/Krasnoyarsk",    muslimPopulation:  1 },
  { id: "irkutsk",       name: "Irkutsk",          country: "Russia", countryCode: "RU", lat: 52.2865, lng: 104.3050, timezone: "Asia/Irkutsk",         muslimPopulation:  1 },
  { id: "ulan-ude",      name: "Ulan-Ude",         country: "Russia", countryCode: "RU", lat: 51.8310, lng: 107.6079, timezone: "Asia/Irkutsk",         muslimPopulation:  1 },

  // Russia — Far East (UTC+8–12)
  { id: "yakutsk",       name: "Yakutsk",          country: "Russia", countryCode: "RU", lat: 62.0355, lng: 129.6755, timezone: "Asia/Yakutsk",         muslimPopulation:  1 },
  { id: "vladivostok",   name: "Vladivostok",      country: "Russia", countryCode: "RU", lat: 43.1332, lng: 131.9113, timezone: "Asia/Vladivostok",     muslimPopulation:  1 },
  { id: "khabarovsk",    name: "Khabarovsk",       country: "Russia", countryCode: "RU", lat: 48.4828, lng: 135.0838, timezone: "Asia/Vladivostok",     muslimPopulation:  1 },

  // Australia & New Zealand
  { id: "sydney", name: "Sydney", country: "Australia", countryCode: "AU", lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney", muslimPopulation: 3 },
  { id: "melbourne", name: "Melbourne", country: "Australia", countryCode: "AU", lat: -37.8136, lng: 144.9631, timezone: "Australia/Melbourne", muslimPopulation: 3 },
  { id: "perth", name: "Perth", country: "Australia", countryCode: "AU", lat: -31.9505, lng: 115.8605, timezone: "Australia/Perth", muslimPopulation: 2 },
  { id: "brisbane", name: "Brisbane", country: "Australia", countryCode: "AU", lat: -27.4705, lng: 153.0260, timezone: "Australia/Brisbane", muslimPopulation: 2 },
  { id: "auckland", name: "Auckland", country: "New Zealand", countryCode: "NZ", lat: -36.8485, lng: 174.7633, timezone: "Pacific/Auckland", muslimPopulation: 2 },
  { id: "wellington", name: "Wellington", country: "New Zealand", countryCode: "NZ", lat: -41.2865, lng: 174.7762, timezone: "Pacific/Auckland", muslimPopulation: 2 },
  { id: "christchurch", name: "Christchurch", country: "New Zealand", countryCode: "NZ", lat: -43.5321, lng: 172.6362, timezone: "Pacific/Auckland", muslimPopulation: 1 },

  // Greenland & Arctic
  { id: "nuuk", name: "Nuuk", country: "Greenland", countryCode: "GL", lat: 64.1743, lng: -51.7373, timezone: "America/Nuuk", muslimPopulation: 0.1 },
  { id: "ilulissat", name: "Ilulissat", country: "Greenland", countryCode: "GL", lat: 69.2197, lng: -51.0986, timezone: "America/Nuuk", muslimPopulation: 0.1 },

  // China
  { id: "beijing", name: "Beijing", country: "China", countryCode: "CN", lat: 39.9042, lng: 116.4074, timezone: "Asia/Shanghai", muslimPopulation: 2 },
  { id: "shanghai", name: "Shanghai", country: "China", countryCode: "CN", lat: 31.2304, lng: 121.4737, timezone: "Asia/Shanghai", muslimPopulation: 1 },
  { id: "urumqi", name: "Ürümqi", country: "China", countryCode: "CN", lat: 43.8256, lng: 87.6168, timezone: "Asia/Urumqi", muslimPopulation: 52 },
  { id: "xian", name: "Xi'an", country: "China", countryCode: "CN", lat: 34.3416, lng: 108.9398, timezone: "Asia/Shanghai", muslimPopulation: 10 },
  { id: "guangzhou", name: "Guangzhou", country: "China", countryCode: "CN", lat: 23.1291, lng: 113.2644, timezone: "Asia/Shanghai", muslimPopulation: 2 },

  // Americas
  { id: "newyork", name: "New York", country: "USA", countryCode: "US", lat: 40.7128, lng: -74.0060, timezone: "America/New_York", muslimPopulation: 1 },
  { id: "losangeles", name: "Los Angeles", country: "USA", countryCode: "US", lat: 34.0522, lng: -118.2437, timezone: "America/Los_Angeles", muslimPopulation: 1 },
  { id: "toronto", name: "Toronto", country: "Canada", countryCode: "CA", lat: 43.6532, lng: -79.3832, timezone: "America/Toronto", muslimPopulation: 3 },
  { id: "vancouver", name: "Vancouver", country: "Canada", countryCode: "CA", lat: 49.2827, lng: -123.1207, timezone: "America/Vancouver", muslimPopulation: 3 },
  { id: "montreal", name: "Montreal", country: "Canada", countryCode: "CA", lat: 45.5017, lng: -73.5673, timezone: "America/Toronto", muslimPopulation: 6 },
  { id: "ottawa", name: "Ottawa", country: "Canada", countryCode: "CA", lat: 45.4215, lng: -75.6972, timezone: "America/Toronto", muslimPopulation: 4 },
  { id: "calgary", name: "Calgary", country: "Canada", countryCode: "CA", lat: 51.0447, lng: -114.0719, timezone: "America/Edmonton", muslimPopulation: 5 },
  { id: "saopaulo", name: "São Paulo", country: "Brazil", countryCode: "BR", lat: -23.5505, lng: -46.6333, timezone: "America/Sao_Paulo", muslimPopulation: 0.5 },
  { id: "buenosaires", name: "Buenos Aires", country: "Argentina", countryCode: "AR", lat: -34.6037, lng: -58.3816, timezone: "America/Argentina/Buenos_Aires", muslimPopulation: 2 },
  { id: "santiago", name: "Santiago", country: "Chile", countryCode: "CL", lat: -33.4489, lng: -70.6693, timezone: "America/Santiago", muslimPopulation: 0.1 },

  // Southern Africa
  { id: "capetown", name: "Cape Town", country: "South Africa", countryCode: "ZA", lat: -33.9249, lng: 18.4241, timezone: "Africa/Johannesburg", muslimPopulation: 25 },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", countryCode: "ZA", lat: -26.2041, lng: 28.0473, timezone: "Africa/Johannesburg", muslimPopulation: 3 },
  { id: "durban", name: "Durban", country: "South Africa", countryCode: "ZA", lat: -29.8587, lng: 31.0218, timezone: "Africa/Johannesburg", muslimPopulation: 15 },
];

export function getCityById(id: string): CityData | undefined {
  return WORLD_CITIES.find((c) => c.id === id);
}
