import { create } from "zustand";

interface DevBannerState {
    isVisible: boolean;
    close: () => void;
}

export const useDevBannerStore = create<DevBannerState>((set) => ({
    isVisible: true,
    close: () => set((state) => ({ isVisible: !state })),
}));
