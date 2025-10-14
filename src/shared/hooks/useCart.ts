import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../stores';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
} from '../stores/cartSlice';
import { Drug } from '../../modules/hospital/types/drug';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);

  const addToCart = useCallback(
    (drug: Drug, quantity: number = 1) => {
      dispatch(addToCartAction({ drug, quantity }));
    },
    [dispatch],
  );

  const removeFromCart = useCallback(
    (drugId: string) => {
      dispatch(removeFromCartAction(drugId));
    },
    [dispatch],
  );

  const updateQuantity = useCallback(
    (drugId: string, quantity: number) => {
      dispatch(updateQuantityAction({ drugId, quantity }));
    },
    [dispatch],
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const increaseQuantity = useCallback(
    (drugId: string) => {
      const item = cart.items.find(item => item.drug.drug_id === drugId);
      if (item) {
        dispatch(updateQuantityAction({ drugId, quantity: item.quantity + 1 }));
      }
    },
    [dispatch, cart.items],
  );

  const decreaseQuantity = useCallback(
    (drugId: string) => {
      const item = cart.items.find(item => item.drug.drug_id === drugId);
      if (item) {
        const newQuantity = item.quantity - 1;
        if (newQuantity > 0) {
          dispatch(updateQuantityAction({ drugId, quantity: newQuantity }));
        } else {
          dispatch(removeFromCartAction(drugId));
        }
      }
    },
    [dispatch, cart.items],
  );

  const getItemQuantity = useCallback(
    (drugId: string): number => {
      const item = cart.items.find(item => item.drug.drug_id === drugId);
      return item?.quantity || 0;
    },
    [cart.items],
  );

  const isInCart = useCallback(
    (drugId: string): boolean => {
      return cart.items.some(item => item.drug.drug_id === drugId);
    },
    [cart.items],
  );

  return {
    // State
    items: cart.items,
    totalAmount: cart.totalAmount,
    totalItems: cart.totalItems,
    isEmpty: cart.items.length === 0,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    increaseQuantity,
    decreaseQuantity,

    // Helpers
    getItemQuantity,
    isInCart,
  };
};
