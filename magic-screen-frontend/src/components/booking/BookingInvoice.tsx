'use client';

import React from 'react';
import {
  ReceiptText,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
} from 'lucide-react';

import { useBookingStore } from '@/hooks/useBooking';

type InvoiceAddon = {
  id?: string;
  name: string;
  price: number;
};

type InvoiceFood = {
  id?: string;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  decorationPrice?: number;
  decorationName?: string;

  guestSurcharge?: number;

  cakePrice?: number;
  cakeName?: string;

  addonItems?: InvoiceAddon[];

  foodItems?: InvoiceFood[];

  continueLabel?: string;

  continueDisabled?: boolean;

  onContinue?: () => void;

  onBack?: () => void;

  showBack?: boolean;

  children?: React.ReactNode;
};

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function BookingInvoice({
  decorationPrice,
  decorationName,

  guestSurcharge,

  cakePrice,
  cakeName,

  addonItems,
  foodItems,

  continueLabel = 'Continue',

  continueDisabled = false,

  onContinue,
  onBack,

  showBack = true,

  children,
}: Props) {
  const store = useBookingStore() as any;

  const resolvedDecorationPrice =
    decorationPrice !== undefined
      ? decorationPrice
      : Number(store.decorationPrice || 0);

  const resolvedDecorationName =
    decorationName !== undefined
      ? decorationName
      : store.decorationName || '';

  const resolvedGuestSurcharge =
    guestSurcharge !== undefined
      ? guestSurcharge
      : Number(store.guestSurcharge || 0);

  const resolvedCakePrice =
    cakePrice !== undefined
      ? cakePrice
      : Number(store.cakePrice || 0);

  const resolvedCakeName =
    cakeName !== undefined ? cakeName : store.cakeName || '';

  const resolvedAddons =
    addonItems !== undefined
      ? addonItems
      : (store.addonItems || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price || 0),
        }));

  const resolvedFood =
    foodItems !== undefined
      ? foodItems
      : (store.foodItems || []).map((item: any) => ({
          id: String(item.food_item_id),
          name: item.food_item?.name || 'Food Item',
          price: Number(item.unit_price || 0),
          quantity: Number(item.quantity || 0),
        }));

  const basePrice = Number(store.basePrice || 0);

  const addonTotal = resolvedAddons.reduce(
    (sum: number, item: InvoiceAddon) => sum + Number(item.price || 0),
    0
  );

  const foodTotal = resolvedFood.reduce(
    (sum: number, item: InvoiceFood) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const grandTotal =
    basePrice +
    resolvedDecorationPrice +
    resolvedGuestSurcharge +
    resolvedCakePrice +
    addonTotal +
    foodTotal;

  const advance = Math.ceil(grandTotal * 0.5);
  const balance = grandTotal - advance;

  const Rows = () => (
    <>
      <div className="invoice-row">
        <span>Private Theater</span>
        <strong>{money(basePrice)}</strong>
      </div>

      {resolvedDecorationPrice > 0 && (
        <div className="invoice-row">
          <span>
            {resolvedDecorationName
              ? `Decoration · ${resolvedDecorationName}`
              : 'Decoration'}
          </span>

          <strong>{money(resolvedDecorationPrice)}</strong>
        </div>
      )}

      {resolvedGuestSurcharge > 0 && (
        <div className="invoice-row">
          <span>Extra Guests</span>
          <strong>{money(resolvedGuestSurcharge)}</strong>
        </div>
      )}

      {resolvedCakePrice > 0 && (
        <div className="invoice-row">
          <span>
            {resolvedCakeName ? `Cake · ${resolvedCakeName}` : 'Cake'}
          </span>

          <strong>{money(resolvedCakePrice)}</strong>
        </div>
      )}

      {resolvedAddons.map((item: InvoiceAddon, index: number) => (
        <div
          className="invoice-row"
          key={item.id || `${item.name}-${index}`}
        >
          <span>{item.name}</span>
          <strong>{money(item.price)}</strong>
        </div>
      ))}

      {resolvedFood.map((item: InvoiceFood, index: number) => (
        <div
          className="invoice-row"
          key={item.id || `${item.name}-${index}`}
        >
          <span>
            {item.name}
            <small> × {item.quantity}</small>
          </span>

          <strong>{money(item.price * item.quantity)}</strong>
        </div>
      ))}
    </>
  );

  return (
    <>
      <aside className="booking-invoice">
        <div className="invoice-card">
          <div className="invoice-title-row">
            <div className="invoice-icon">
              <ReceiptText size={19} />
            </div>

            <div>
              <p className="invoice-kicker">LIVE BOOKING TOTAL</p>
              <h3>Price Details</h3>
            </div>
          </div>

          <div className="invoice-booking-meta">
            {store.theaterName && (
              <div>
                <span>Theater</span>
                <strong>{store.theaterName}</strong>
              </div>
            )}

            {store.date && (
              <div>
                <span>Date</span>
                <strong>{store.date}</strong>
              </div>
            )}

            {store.slotName && (
              <div>
                <span>Slot</span>
                <strong>{store.slotName}</strong>
              </div>
            )}
          </div>

          <div className="invoice-lines">
            <Rows />
          </div>

          <div className="invoice-total-box">
            <div>
              <span>Grand Total</span>
              <strong>{money(grandTotal)}</strong>
            </div>

            <div className="advance-row">
              <span>Pay now · 50%</span>
              <strong>{money(advance)}</strong>
            </div>

            <div className="balance-row">
              <span>Balance at venue</span>
              <strong>{money(balance)}</strong>
            </div>
          </div>

          <div className="invoice-security">
            <ShieldCheck size={15} />

            <span>
              Your slot gets confirmed after the advance payment.
            </span>
          </div>

          {children}

          {(onContinue || onBack) && (
            <div className="invoice-actions">
              {showBack && onBack && (
                <button
                  type="button"
                  className="invoice-back"
                  onClick={onBack}
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              {onContinue && (
                <button
                  type="button"
                  className="invoice-continue"
                  disabled={continueDisabled}
                  onClick={onContinue}
                >
                  <span>{continueLabel}</span>
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      <div className="mobile-invoice">
        <details>
          <summary>
            <div>
              <small>Total</small>
              <strong>{money(grandTotal)}</strong>
            </div>

            <div className="mobile-invoice-pay">
              <span>Pay now {money(advance)}</span>
              <ChevronUp size={15} />
            </div>
          </summary>

          <div className="mobile-invoice-content">
            <Rows />

            <div className="mobile-total-row">
              <span>Grand Total</span>
              <strong>{money(grandTotal)}</strong>
            </div>

            <div className="mobile-total-row gold">
              <span>50% Advance</span>
              <strong>{money(advance)}</strong>
            </div>

            {(onContinue || onBack) && (
              <div className="invoice-actions">
                {showBack && onBack && (
                  <button
                    type="button"
                    className="invoice-back"
                    onClick={onBack}
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}

                {onContinue && (
                  <button
                    type="button"
                    className="invoice-continue"
                    disabled={continueDisabled}
                    onClick={onContinue}
                  >
                    {continueLabel}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </details>
      </div>
    </>
  );
}