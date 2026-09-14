'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/useBooking';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import { Pizza, Coffee, IceCream, Soup, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

const BOOKING_STEPS = ['Decoration', 'Date & Slot', 'Occasion', 'Cake', 'Add-Ons', 'Food', 'Details', 'Summary'];

// Emoji map based on food name keywords
function getFoodEmoji(name: string, category: string): string {
  const n = name.toLowerCase();
  if (n.includes('popcorn'))                          return '🍿';
  if (n.includes('nacho'))                            return '🌮';
  if (n.includes('burger'))                           return '🍔';
  if (n.includes('spring roll') || n.includes('roll'))return '🥢';
  if (n.includes('fries') || n.includes('french'))   return '🍟';
  if (n.includes('paneer tikka') || n.includes('tikka')) return '🍢';
  if (n.includes('sandwich'))                         return '🥪';
  if (n.includes('pizza'))                            return '🍕';
  if (n.includes('cold coffee') || n.includes('coffee')) return '☕';
  if (n.includes('mojito'))                           return '🍹';
  if (n.includes('lassi') || n.includes('mango lassi')) return '🥛';
  if (n.includes('lime') || n.includes('soda'))       return '🥤';
  if (n.includes('chai') || n.includes('tea'))        return '🍵';
  if (n.includes('milk shake') || n.includes('shake'))return '🥤';
  if (n.includes('juice') || n.includes('watermelon'))return '🍉';
  if (n.includes('biryani'))                          return '🍛';
  if (n.includes('paneer butter') || n.includes('roti')) return '🫓';
  if (n.includes('pasta'))                            return '🍝';
  if (n.includes('fried rice') || n.includes('manchurian')) return '🍜';
  if (n.includes('brownie'))                          return '🍫';
  if (n.includes('gulab jamun') || n.includes('gulab')) return '🍮';
  if (n.includes('kulfi') || n.includes('ice cream')) return '🍦';
  if (n.includes('mousse') || n.includes('chocolate mousse')) return '🍰';
  if (category === 'Desserts')  return '🍮';
  if (category === 'Beverages') return '🥤';
  if (category === 'Meals')     return '🍱';
  return '🍿';
}

const MOCK_FOOD_CATALOG = [
  { id: 'FOOD-01', name: 'Premium Cheese Popcorn',         price: 180, category: 'Snacks',    desc: 'Jumbo tub salted popcorn tossed in warm cheddar seasoning.' },
  { id: 'FOOD-02', name: 'Loaded Veggie Nachos',           price: 220, category: 'Snacks',    desc: 'Crisp tortilla chips topped with molten cheese salsa and jalapenos.' },
  { id: 'FOOD-03', name: 'Classic Paneer Burger',          price: 190, category: 'Snacks',    desc: 'Crispy paneer patty paired with secret spice mayo.' },
  { id: 'FOOD-04', name: 'Veg Spring Rolls (6 pcs)',       price: 160, category: 'Snacks',    desc: 'Golden crispy spring rolls filled with spiced vegetables.' },
  { id: 'FOOD-05', name: 'Masala French Fries',            price: 130, category: 'Snacks',    desc: 'Thick-cut fries tossed in our house masala blend.' },
  { id: 'FOOD-06', name: 'Paneer Tikka Skewers',           price: 249, category: 'Snacks',    desc: 'Smoky grilled paneer tikka with mint chutney.' },
  { id: 'FOOD-07', name: 'Veg Club Sandwich',              price: 175, category: 'Snacks',    desc: 'Triple-layered toasted sandwich with cheese, veggies and mayo.' },
  { id: 'FOOD-08', name: 'Cheese Corn Pizza Slice',        price: 149, category: 'Snacks',    desc: 'Individual pizza slice loaded with sweet corn and mozzarella.' },
  { id: 'FOOD-09', name: 'Cold Coffee Fusion',             price: 140, category: 'Beverages', desc: 'Creamy cold brew blend topped with dark chocolate drizzle.' },
  { id: 'FOOD-10', name: 'Virgin Mint Mojito',             price: 130, category: 'Beverages', desc: 'Refreshing muddled mint leaves with lime and sparkling fizz.' },
  { id: 'FOOD-11', name: 'Mango Lassi',                    price: 120, category: 'Beverages', desc: 'Rich Alphonso mango blended with thick yoghurt and cardamom.' },
  { id: 'FOOD-12', name: 'Fresh Lime Soda',                price: 80,  category: 'Beverages', desc: 'Chilled sparkling water with fresh lime.' },
  { id: 'FOOD-13', name: 'Masala Chai',                    price: 70,  category: 'Beverages', desc: 'Authentic Indian spiced tea brewed with ginger and cardamom.' },
  { id: 'FOOD-14', name: 'Rose Milk Shake',                price: 150, category: 'Beverages', desc: 'Chilled rose-flavoured milk shake with basil seeds.' },
  { id: 'FOOD-15', name: 'Watermelon Juice',               price: 100, category: 'Beverages', desc: 'Fresh seasonal watermelon blended with a hint of black salt.' },
  { id: 'FOOD-16', name: 'Veg Biryani Box',                price: 280, category: 'Meals',     desc: 'Aromatic basmati biryani with seasonal vegetables, raita and papad.' },
  { id: 'FOOD-17', name: 'Paneer Butter Masala + Roti',    price: 320, category: 'Meals',     desc: 'Rich creamy paneer curry served with 3 soft butter rotis.' },
  { id: 'FOOD-18', name: 'Pasta Arrabbiata',               price: 260, category: 'Meals',     desc: 'Penne pasta in spicy tomato arrabbiata sauce with garlic bread.' },
  { id: 'FOOD-19', name: 'Veg Fried Rice + Manchurian',    price: 290, category: 'Meals',     desc: 'Indo-Chinese classic — wok-tossed fried rice with gobi manchurian.' },
  { id: 'FOOD-20', name: 'Sizzling Chocolate Brownie',     price: 240, category: 'Desserts',  desc: 'Fudgy hot brownie paired with vanilla bean gelato.' },
  { id: 'FOOD-21', name: 'Gulab Jamun (4 pcs)',            price: 120, category: 'Desserts',  desc: 'Soft milk-solid dumplings soaked in rose-cardamom sugar syrup.' },
  { id: 'FOOD-22', name: 'Mango Kulfi',                    price: 110, category: 'Desserts',  desc: 'Traditional dense mango ice cream on a stick with pistachio.' },
  { id: 'FOOD-23', name: 'Chocolate Mousse Cup',           price: 160, category: 'Desserts',  desc: 'Silky Belgian chocolate mousse topped with chocolate shavings.' },
];

type Category = 'All' | 'Snacks' | 'Beverages' | 'Meals' | 'Desserts';

export default function FoodSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = params.id as string;
  const store = useBookingStore() as any;

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const q: Record<string, number> = {};
    (store.foodItems || []).forEach((item: any) => { q[item.food_item_id] = item.quantity; });
    return q;
  });
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const { data: rawFood, isLoading: isFoodLoading } = useQuery({
    queryKey: ['foodMenu'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/food/items');
        return res.data && res.data.data && res.data.data.length > 0 ? res.data.data : MOCK_FOOD_CATALOG;
      } catch {
        return MOCK_FOOD_CATALOG;
      }
    },
  });

  const formattedFood = (rawFood || MOCK_FOOD_CATALOG).map((item: any) => ({
    id: item.food_id || item.id || item._id,
    name: item.food_name || item.name,
    price: Number(item.price || item.food_price || 0),
    category: item.category || 'Snacks',
    desc: item.desc || item.description || '',
    imageUrl: item.imageUrl || item.image_url || '',
  }));

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  const CATEGORIES: Category[] = ['All', 'Snacks', 'Beverages', 'Meals', 'Desserts'];
  const filteredFood = formattedFood.filter((item: any) => activeCategory === 'All' || item.category === activeCategory);

  const selectedFoodSummary = formattedFood
    .filter((item: any) => quantities[item.id] > 0)
    .map((item: any) => ({ id: item.id, name: item.name, price: item.price, quantity: quantities[item.id] }));

  const foodTotal = selectedFoodSummary.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  // Always read from store
  const basePrice       = store.basePrice       || 0;
  const guestSurcharge  = store.guestSurcharge  || 0;
  const decorationPrice = store.decorationPrice || 0;
  const cakePrice       = store.cakePrice       || 0;
  const addonTotal      = (store.addonItems || []).reduce((sum: number, a: any) => sum + a.price, 0);
  const runningTotal    = basePrice + guestSurcharge + decorationPrice + cakePrice + addonTotal + foodTotal;

  const handleBack = () => router.push(`/theater/${theaterId}/addons`);

  const handleContinue = () => {
    // Clear existing food items then set new ones
    (store.foodItems || []).forEach((existing: any) => {
      store.setFoodItem({ food_item_id: existing.food_item_id, food_item: existing.food_item, quantity: 0, unit_price: existing.unit_price });
    });
    selectedFoodSummary.forEach((item: any) => {
      store.setFoodItem({
        food_item_id: item.id,
        food_item: { id: item.id, name: item.name, price: item.price, is_veg: true },
        quantity: item.quantity,
        unit_price: item.price,
      });
    });
    router.push(`/theater/${theaterId}/details`);
  };

  return (
    <main className="booking-page min-h-screen bg-[#0D0D0D] text-white pb-12">
      <BookingStepIndicator steps={BOOKING_STEPS} currentStep={6} />

      <div className="booking-container max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="page-heading border-b border-white/5 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
              In-Theater Gourmet Catering
            </h1>
            <p className="text-[#888] text-sm mt-1">Premium food and beverages served directly inside your suite.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                  activeCategory === cat ? 'bg-[#D4A017] text-black border-[#D4A017]' : 'bg-[#1A1A1A] border-white/5 text-[#888] hover:text-white'
                }`}>
                {cat === 'Snacks'    && <Pizza   size={12} className="inline mr-1.5 mb-0.5" />}
                {cat === 'Beverages' && <Coffee  size={12} className="inline mr-1.5 mb-0.5" />}
                {cat === 'Meals'     && <Soup    size={12} className="inline mr-1.5 mb-0.5" />}
                {cat === 'Desserts'  && <IceCream size={12} className="inline mr-1.5 mb-0.5" />}
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-[9px] opacity-60">
                    ({formattedFood.filter((i: any) => i.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {isFoodLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(n => <div key={n} className="h-24 bg-[#1A1A1A] rounded-xl animate-pulse border border-white/5" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredFood.map((item: any) => {
                const qty = quantities[item.id] || 0;
                const emoji = getFoodEmoji(item.name, item.category);
                return (
                  <div key={item.id}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all bg-[#1A1A1A] ${qty > 0 ? 'border-[#D4A017]/40' : 'border-white/5'}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#0D0D0D] border border-white/5 flex items-center justify-center text-2xl shrink-0">
                          {emoji}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded bg-[#0D0D0D] font-medium text-[#888] border border-white/5">{item.category}</span>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        </div>
                        <p className="text-xs text-[#888] leading-relaxed mt-0.5 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-3 shrink-0">
                      <span className="text-sm font-mono font-bold text-white">₹{item.price}</span>
                      <div className="flex items-center bg-[#0D0D0D] border border-white/10 rounded-xl p-1">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} disabled={qty === 0}
                          className={`p-2 rounded-lg transition-colors ${qty > 0 ? 'text-[#D4A017] hover:bg-white/5' : 'text-[#333] cursor-not-allowed'}`}>
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-white">{qty}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 rounded-lg text-[#D4A017] hover:bg-white/5 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Invoice Sidebar */}
        <div>
          <div className="invoice-card p-6 rounded-2xl border border-white/10 bg-[#1A1A1A] sticky top-6 space-y-5">
            <h3 className="text-lg font-bold tracking-wide border-b border-white/5 pb-3">Reservation Invoice Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#888]"><span>Base Screen Fee:</span><span className="text-white font-mono">₹{basePrice}</span></div>
              {decorationPrice > 0 && <div className="flex justify-between text-[#888]"><span>Decoration ({store.decorationName}):</span><span className="text-[#D4A017] font-mono">+₹{decorationPrice}</span></div>}
              {guestSurcharge > 0  && <div className="flex justify-between text-[#888]"><span>Guest Surcharge:</span><span className="text-[#D4A017] font-mono">+₹{guestSurcharge}</span></div>}
              {cakePrice > 0       && <div className="flex justify-between text-[#888]"><span>Cake:</span><span className="text-white font-mono">₹{cakePrice}</span></div>}
              {addonTotal > 0      && <div className="flex justify-between text-[#888]"><span>Add-Ons:</span><span className="text-white font-mono">₹{addonTotal}</span></div>}
              {selectedFoodSummary.length > 0 && (
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <span className="text-xs text-[#555] font-bold uppercase tracking-wider block">Food Orders:</span>
                  {selectedFoodSummary.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-xs pl-2 text-[#888]">
                      <span className="truncate max-w-[160px] text-[#bbb]">{item.name} <span className="text-[#555]">x{item.quantity}</span></span>
                      <span className="font-mono">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-[#0D0D0D] p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-xs text-[#888] font-bold uppercase tracking-wider">Running Total:</span>
              <span className="text-xl font-mono font-black text-[#D4A017]">₹{runningTotal}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={handleBack}
                className="px-4 py-4 bg-[#0D0D0D] border border-white/10 hover:bg-white/5 transition-all rounded-2xl text-[#888] hover:text-white flex items-center justify-center">
                <ArrowLeft size={18} />
              </button>
              <button type="button" onClick={handleContinue}
                className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-[#D4A017] text-black font-bold text-sm rounded-2xl hover:bg-[#D4A017]/90 transition-all">
                {selectedFoodSummary.length > 0 ? 'Confirm Menu' : 'Skip Menu'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}