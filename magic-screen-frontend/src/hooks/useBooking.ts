import { useBookingStore } from '@/store/bookingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';

export { useBookingStore };

interface BookingTotalParams {
  theaterData: { base_price: number };
  couponDiscount: number;
}

export function useBookingTotal({ theaterData, couponDiscount }: BookingTotalParams) {
  const store = useBookingStore() as any;

  const basePrice = store.basePrice || theaterData?.base_price || 0;
  const cakePrice = store.cakePrice || 0;
  const addonTotal = (store.addonItems || []).reduce((sum: number, item: any) => sum + item.price, 0);
  const foodTotal = (store.foodItems || []).reduce((sum: number, item: any) => sum + (item.unit_price * item.quantity), 0);
  const guestSurcharge = store.guestSurcharge || 0;
  const decorationPrice = store.decorationPrice || 0;
  const total = Math.max(0, basePrice + cakePrice + addonTotal + foodTotal + guestSurcharge + decorationPrice - couponDiscount);
  const advancePaid = Math.ceil(total * 0.5);

  return {
    basePrice,
    cakePrice,
    addonTotal,
    foodTotal,
    guestSurcharge,
    decorationPrice,
    discount: couponDiscount,
    total,
    advancePaid,
    balanceDue: Math.max(0, total - advancePaid),
  };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useCreateBooking() {
  const router = useRouter();
  const store = useBookingStore() as any;

  const mutation = useMutation<any, any, any>({
    mutationFn: (bookingData: any) =>
      apiClient.post('/api/bookings/initiate', bookingData).then(res => res.data),

    onSuccess: async (data) => {
      const bookingId: number = data?.id ?? data?.data?.id;
      if (!bookingId) {
        alert('Booking creation failed — no booking ID returned. Please try again.');
        return;
      }

      try {
        // Calculate correct grand total including ALL items from store
        const basePrice      = store.basePrice || 0;
        const cakePrice      = store.cakePrice || 0;
        const addonTotal     = (store.addonItems  || []).reduce((sum: number, item: any) => sum + item.price, 0);
        const foodTotal      = (store.foodItems   || []).reduce((sum: number, item: any) => sum + (item.unit_price * item.quantity), 0);
        const guestSurcharge = store.guestSurcharge || 0;
        const decorationPrice = store.decorationPrice || 0;
        const grandTotal     = basePrice + cakePrice + addonTotal + foodTotal + guestSurcharge + decorationPrice;
        const advanceAmount  = Math.ceil(grandTotal * 0.5);

        // Patch booking with correct frontend grand total
        await apiClient.patch(`/api/bookings/${bookingId}/total`, { grandTotal });

        // Create Razorpay order (backend will use grandTotal to compute 50%)
        const orderRes = await apiClient.post(`/api/payment/create-order/${bookingId}`);
        const { razorpayOrderId, keyId, customerName, customerEmail, customerPhone } = orderRes.data;

        // Load Razorpay SDK dynamically
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          alert('Payment gateway failed to load. Check your internet connection and try again.');
          return;
        }

        const options = {
          key:         keyId,
          amount:      Math.round(advanceAmount * 100), // paise — 50% only
          currency:    'INR',
          name:        'The Magic Screen',
          description: `50% Advance — ${data.trackingCode || 'Booking'}`,
          order_id:    razorpayOrderId,
          prefill:     { name: customerName, email: customerEmail, contact: customerPhone },
          theme:       { color: '#D4A017' },
          notes: {
            booking_id:    String(bookingId),
            tracking_code: data.trackingCode || '',
            grand_total:   String(grandTotal),
            advance_amount: String(advanceAmount),
            balance_due:   String(grandTotal - advanceAmount),
          },
          handler: async (response: any) => {
            try {
              const verifyRes = await apiClient.post(`/api/payment/verify/${bookingId}`, {
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              if (verifyRes.data.status === 'CONFIRMED') {
                store.resetBooking();
                router.push(`/booking-success?code=${verifyRes.data.trackingCode}`);
              }
            } catch (err: any) {
              alert(
                'Payment received but verification failed. Contact us with:\n' +
                'Booking ID: ' + bookingId + '\n' +
                'Payment ID: ' + response.razorpay_payment_id
              );
            }
          },
          modal: {
            ondismiss: () => {
              // Do nothing — slot is still held for 10 min, user can retry
            }
          },
        };

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          alert(
            'Payment failed: ' + (response.error?.description || 'Unknown error') +
            '\n\nYour slot is still held for 10 minutes — click Pay again to retry.'
          );
        });
        rzp.open();

      } catch (err: any) {
        const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Unknown error';
        alert('Something went wrong during payment setup: ' + msg);
      }
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Unknown error';
      alert('Booking failed: ' + msg);
    },
  });

  return mutation;
}

export function useMyBookings() {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await apiClient.get('/api/bookings/history');
      return res.data.data;
    }
  });
}