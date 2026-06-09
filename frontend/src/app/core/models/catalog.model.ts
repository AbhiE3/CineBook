// Domain models matching the backend schema. Used from Day 2 onward.

export interface Movie {
  id: number;
  title: string;
  genre: string;
  durationMins: number;
  languages: string; // CSV
  price: number;
  posterUrl: string;
  trailerUrl: string;
  deleted?: boolean;
}

export interface Theater {
  id: number;
  name: string;
  location: string;
  ownerUserId?: number;
}

export interface Show {
  id: number;
  movieId: number;
  theaterId: number;
  showTime: string;
  language: string;
  ticketPrice: number;
  totalSeats: number;
  availableSeats: number;
}

export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface Booking {
  id: number;
  showId: number;
  userId: number;
  seats: string;
  seatsBooked: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  refundAmount: number;
  status: BookingStatus;
  bookingDate: string;
  cancelledAt: string | null;
}
