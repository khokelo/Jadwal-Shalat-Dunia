import { create } from "zustand";
import { PrayerName, PRAYER_CONFIG } from "@/lib/prayer-times";

interface UserLocation {
  lat: number;
  lng: number;
  cityName: string;
  timezone: string;
}

interface PrayerState {
  // User location
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation) => void;

  // Current prayer
  currentPrayer: PrayerName | null;
  setCurrentPrayer: (prayer: PrayerName | null) => void;

  // Countdown to next prayer
  nextPrayerName: PrayerName | null;
  nextPrayerCountdown: string;
  setNextPrayer: (name: PrayerName | null, countdown: string) => void;

  // Selected city for dashboard
  selectedCityId: string;
  setSelectedCityId: (id: string) => void;

  // UI
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const usePrayerStore = create<PrayerState>((set) => ({
  userLocation: null,
  setUserLocation: (loc) => set({ userLocation: loc }),

  currentPrayer: null,
  setCurrentPrayer: (prayer) => set({ currentPrayer: prayer }),

  nextPrayerName: null,
  nextPrayerCountdown: "00:00:00",
  setNextPrayer: (name, countdown) => set({ nextPrayerName: name, nextPrayerCountdown: countdown }),

  selectedCityId: "mecca",
  setSelectedCityId: (id) => set({ selectedCityId: id }),

  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));

export { PRAYER_CONFIG };
