import { create } from 'zustand';
import { BookingResponse } from '@/types';

interface BookingState {
    currentBooking: BookingResponse | null;
    bookingList: BookingResponse[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentBooking: (booking: BookingResponse) => void;
    addBooking: (booking: BookingResponse) => void;
    setBookingList: (bookings: BookingResponse[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    currentBooking: null,
    bookingList: [],
    isLoading: false,
    error: null,

    setCurrentBooking: (booking) => set({ currentBooking: booking }),

    addBooking: (booking) =>
        set((state) => ({
            bookingList: [booking, ...state.bookingList],
        })),

    setBookingList: (bookings) => set({ bookingList: bookings }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    clearBooking: () =>
        set({
            currentBooking: null,
            bookingList: [],
            error: null,
        }),
}));
