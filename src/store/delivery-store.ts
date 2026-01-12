import { create } from 'zustand';
import { LicenseData } from '@/types';

interface DeliveryState {
    currentDelivery: LicenseData | null;
    deliveryList: LicenseData[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentDelivery: (delivery: LicenseData) => void;
    addDelivery: (delivery: LicenseData) => void;
    setDeliveryList: (deliveries: LicenseData[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearDelivery: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
    currentDelivery: null,
    deliveryList: [],
    isLoading: false,
    error: null,

    setCurrentDelivery: (delivery) => set({ currentDelivery: delivery }),

    addDelivery: (delivery) =>
        set((state) => ({
            deliveryList: [delivery, ...state.deliveryList],
        })),

    setDeliveryList: (deliveries) => set({ deliveryList: deliveries }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    clearDelivery: () =>
        set({
            currentDelivery: null,
            deliveryList: [],
            error: null,
        }),
}));
