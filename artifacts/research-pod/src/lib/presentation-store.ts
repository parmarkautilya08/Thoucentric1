import { create } from 'zustand';

interface PresentationStore {
  isExecutiveView: boolean;
  toggleExecutiveView: () => void;
}

export const usePresentationStore = create<PresentationStore>((set) => ({
  isExecutiveView: false,
  toggleExecutiveView: () => set((state) => ({ isExecutiveView: !state.isExecutiveView })),
}));
