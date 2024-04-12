/** @format */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export interface InitState {
  [key: string]: any;
}

const initialState: InitState = { data: [], total: 0 };

export const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    setShoppingCartData: (state, action: PayloadAction<any>) => {
      const { data = [], total = 0 } = action.payload;
      return {
        ...state,
        data,
        total,
      };
    },
  },
});

export const { setShoppingCartData } = shoppingCartSlice.actions;

export const getShoppingCartData = (state: RootState) => state.shoppingCart.data;
export const getTotalPrice = (state: RootState) => state.shoppingCart.total;

export default shoppingCartSlice.reducer;
