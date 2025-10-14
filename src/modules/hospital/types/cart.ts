import { Drug } from './drug';

export type CartItem = {
  drug: Drug;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
};
