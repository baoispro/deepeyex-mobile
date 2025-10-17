import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Drug } from '../../modules/hospital/types/drug';
import { CartItem } from '../../modules/hospital/types/cart';

type CartState = {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
};

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const discountedPrice =
      item.drug.price * (1 - item.drug.discount_percent / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ drug: Drug; quantity: number }>,
    ) => {
      const { drug, quantity } = action.payload;
      const existingItem = state.items.find(
        item => item.drug.drug_id === drug.drug_id,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ drug, quantity });
      }

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.drug.drug_id !== action.payload,
      );
      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ drugId: string; quantity: number }>,
    ) => {
      const { drugId, quantity } = action.payload;
      const item = state.items.find(item => item.drug.drug_id === drugId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            item => item.drug.drug_id !== drugId,
          );
        }
      }
      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },
    clearCart: state => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
