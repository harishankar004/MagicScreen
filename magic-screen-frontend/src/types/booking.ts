export type OccasionType = 'birthday' | 'anniversary' | 'proposal' | 'date' | 'match_screening' | 'other';
export type DurationType = 'standard' | 'extended';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  is_veg: boolean;
  image_url?: string;
}

export interface SelectedFoodItem {
  food_item_id: string;
  food_item: FoodItem;
  quantity: number;
  unit_price: number;
}

export interface BookingState {
  theaterId: string | null;
  theaterName: string | null;
  basePrice: number;
  date: string | null;
  slotId: string | null;
  slotName: string | null;
  duration: DurationType;
  occasion: OccasionType | null;
  occasionId: number | null;
  totalGuests: number;
  occasionName: string;
  cakeId: string | null;
  cakeName: string;
  cakePrice: number;
  addonIds: string[];
  addonItems: { id: string; name: string; price: number }[];
  foodItems: SelectedFoodItem[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  couponCode: string;
  referralCode: string;
  extraAdults: number;
  extraChildren: number;
  guestSurcharge: number;
  decorationId: string | null;
  decorationName: string;
  decorationPrice: number;
  decorationExtraPersonCharge: number;
}