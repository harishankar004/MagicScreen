import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookingState, OccasionType, DurationType, SelectedFoodItem } from '@/types/booking';

interface BookingStoreActions extends BookingState {
  setTheater: (payload: { theaterId: string; theaterName: string; basePrice?: number }) => void;
  setDate: (date: string) => void;
  setSlot: (payload: { slotId: string; slotName: string }) => void;
  setTotalGuests: (guests: number) => void;
  setDuration: (duration: DurationType) => void;
  setOccasion: (occasion: OccasionType, occasionName: string, occasionId?: number | null) => void;
  setCake: (cakeData: string | null | { cakeId: string | null; cakeName: string; cakePrice: number }) => void;
  toggleAddon: (addonId: string) => void;
  setAddonItems: (items: { id: string; name: string; price: number }[]) => void;
  setFoodItem: (item: SelectedFoodItem) => void;
  setCustomerDetails: (details: { customerName: string; customerPhone: string; customerEmail: string }) => void;
  setCouponCode: (code: string) => void;
  setReferralCode: (code: string) => void;
  setGuestCounts: (payload: { extraAdults: number; extraChildren: number }) => void;
  setDecoration: (payload: { decorationId: string; decorationName: string; decorationPrice: number; decorationExtraPersonCharge: number }) => void;
  resetBooking: () => void;
}

const initialState: BookingState = {
  theaterId: null,
  theaterName: null,
  basePrice: 0,
  date: null,
  slotId: null,
  slotName: null,
  duration: 'standard',
  occasion: null,
  occasionId: null,
  totalGuests: 2,
  occasionName: '',
  cakeId: null,
  cakeName: '',
  cakePrice: 0,
  addonIds: [],
  addonItems: [],
  foodItems: [],
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  couponCode: '',
  referralCode: '',
  extraAdults: 0,
  extraChildren: 0,
  guestSurcharge: 0,
  decorationId: null,
  decorationName: '',
  decorationPrice: 0,
  decorationExtraPersonCharge: 0,
};

export const useBookingStore = create<BookingStoreActions>()(
  persist(
    (set) => ({
      ...initialState,
      setTheater: (payload) => set({
        theaterId: payload.theaterId,
        theaterName: payload.theaterName,
        basePrice: payload.basePrice ?? 0,
      }),
      setDate: (date) => set({ date }),
      setSlot: (payload) => set({ slotId: payload.slotId, slotName: payload.slotName }),
      setDuration: (duration) => set({ duration }),
      setOccasion: (occasion, occasionName, occasionId = null) => set({ occasion, occasionName, occasionId }),
      setTotalGuests: (totalGuests) => set({ totalGuests }),
      setGuestCounts: ({ extraAdults, extraChildren }) => {
        const surcharge = extraAdults * 150 + extraChildren * 100;
        set({ extraAdults, extraChildren, guestSurcharge: surcharge });
      },
      setDecoration: (payload) => set({
        decorationId: payload.decorationId,
        decorationName: payload.decorationName,
        decorationPrice: payload.decorationPrice,
        decorationExtraPersonCharge: payload.decorationExtraPersonCharge,
      }),
      setCake: (cakeData) => {
        if (cakeData === null) {
          set({ cakeId: null, cakeName: '', cakePrice: 0 });
        } else if (typeof cakeData === 'object') {
          set({ cakeId: cakeData.cakeId, cakeName: cakeData.cakeName || '', cakePrice: cakeData.cakePrice || 0 });
        } else {
          set({ cakeId: cakeData });
        }
      },
      toggleAddon: (addonId) => set((state) => ({
        addonIds: state.addonIds.includes(addonId)
          ? state.addonIds.filter((id) => id !== addonId)
          : [...state.addonIds, addonId],
      })),
      setAddonItems: (items) => set({ addonItems: items }),
      setFoodItem: (newItem) => set((state) => {
        const existingIndex = state.foodItems.findIndex((f) => f.food_item_id === newItem.food_item_id);
        let updatedFood = [...state.foodItems];
        if (newItem.quantity === 0) {
          updatedFood = updatedFood.filter((f) => f.food_item_id !== newItem.food_item_id);
        } else if (existingIndex > -1) {
          updatedFood[existingIndex] = newItem;
        } else {
          updatedFood.push(newItem);
        }
        return { foodItems: updatedFood };
      }),
      setCustomerDetails: (details) => set({
        customerName: details.customerName,
        customerPhone: details.customerPhone,
        customerEmail: details.customerEmail,
      }),
      setCouponCode: (couponCode) => set({ couponCode }),
      setReferralCode: (referralCode) => set({ referralCode }),
      resetBooking: () => set(initialState),
    }),
    { name: 'booking-storage' }
  )
);