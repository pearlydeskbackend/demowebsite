/**
 * bookingService.ts — mock implementation of the booking data layer.
 *
 * HOW TO GO LIVE:
 *   Replace the bodies of getAvailableSlots() and createBooking() with real
 *   API calls (e.g. NexHealth). The drawer component imports only these two
 *   functions and never needs to change.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;      // "YYYY-MM-DD"
  time: string;      // e.g. "10:30 AM"
  notes: string;
}

export interface BookingResult {
  success: boolean;
  confirmationId: string;
}

// ── Internal helpers ───────────────────────────────────────────────────────

/** FNV-1a–inspired deterministic PRNG — same seed always produces same sequence. */
function seededRng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
    h >>>= 0;
  }
  return () => {
    h ^= h << 13;
    h ^= h >> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 0x100000000;
  };
}

/** All possible clinic time slots (Mon–Sat 9:00 AM – 4:30 PM, 30-min intervals). */
const BASE_SLOTS = [
  "9:00 AM",  "9:30 AM",
  "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM",
  "1:00 PM",  "1:30 PM",
  "2:00 PM",  "2:30 PM",
  "3:00 PM",  "3:30 PM",
  "4:00 PM",  "4:30 PM",
];

function isPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + "T00:00:00") < today;
}

function isSunday(dateStr: string): boolean {
  return new Date(dateStr + "T00:00:00").getDay() === 0;
}

// ── Public API — swap these two functions to go live ───────────────────────

/**
 * Returns available time slots for the given service + date.
 * • Past dates and Sundays always return [] (clinic is closed).
 * • ~10% of valid days are fully booked (demoable empty state).
 * • Remaining days have ~60–75% of slots available, seeded by date+service
 *   so the same combination always shows the same availability.
 */
export async function getAvailableSlots(
  service: string,
  date: string
): Promise<string[]> {
  // Simulate realistic network latency
  await delay(650 + Math.random() * 450);

  if (isPast(date) || isSunday(date)) return [];

  const rng = seededRng(date + service);

  // ~10% chance the whole day is fully booked
  if (rng() < 0.1) return [];

  // Keep each slot independently with ~68% probability
  return BASE_SLOTS.filter(() => rng() > 0.32);
}

/**
 * Submits a booking request and returns a confirmation.
 * Replace this body with a POST to your real booking API.
 */
export async function createBooking(
  details: BookingDetails
): Promise<BookingResult> {
  await delay(1000 + Math.random() * 600);

  const confirmationId =
    "KGD-" + Math.random().toString(36).slice(2, 7).toUpperCase();

  return { success: true, confirmationId };
}

// ── Util ───────────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
