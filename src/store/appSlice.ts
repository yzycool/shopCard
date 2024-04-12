/** @format */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export interface InitState {
  [key: string]: any;
}

const initialState: InitState = { loginUser: 'admin' };

// TODO 此处为云网参数设计- 基础班忽略不计
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<any>) => {
      const { loginUser } = action.payload;
      return {
        ...state,
        loginUser,
      };
    },
  },
});

export const { setAppState } = appSlice.actions;

export const getUser = (state: RootState) => state.app.loginUser;

export default appSlice.reducer;
