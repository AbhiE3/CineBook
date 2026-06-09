import { Injectable, signal } from "@angular/core";

const STORAGE_KEY = "cinebook.location";

/**
 * Holds the user's chosen city/area, persisted to localStorage so the
 * navbar picker survives reloads and filters the app on later days.
 */
@Injectable({ providedIn: "root" })
export class LocationService {
  readonly location = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  setLocation(value: string | null): void {
    if (value && value.trim()) {
      localStorage.setItem(STORAGE_KEY, value.trim());
      this.location.set(value.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
      this.location.set(null);
    }
  }
}
