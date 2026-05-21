import { create } from 'zustand';
import { StoreState } from '../types';

export const useStore = create<StoreState>((set) => ({
  walletAddress: null,
  theme: 'system',
  setWalletAddress: (address) => set({ walletAddress: address }),
  setTheme: (theme) => set({ theme }),
}));
