import { create } from 'zustand';

const useAppStore = create((set) => ({
  profileData: {
    nickname: 'Trader_Anon',
    picture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5mynRnO05PMYjJd4c9pATpp_CQNpzcuGCuynRG5rI2sR6fjElHLEmsj0uuq1_37kGszQW6Lm7Nx73hl71PgeFxr9oOyn14HpIVZkkfbHiEskuSrePFACjwxxNoJdO8xjTP0jpBN1bTi4K6IpZangC3HOfa0rNiJmVinhzBTn0HsixddoBCOCgjXN3d0SNJkz4EKnodR6fkkh14DscesLHVZ0wRgeEQKOqoC8cABi8GQ95kMVMGB4UgCFztlOQANyh7SsvMYkWoNA',
    xHandle: ''
  },
  setProfileData: (data) => set({ profileData: data }),
  
  activeMarket: {
    realId: 1,
    title: 'Will AI Agent Protocol v2 launch on GIWA before Q4?',
    confidence: '98%',
    impliedPrice: 0.78,
    closesIn: '04H 22M 11S',
    vol: '0.0020 GIWA',
    openInterest: '0.0020 GIWA',
    drift: 'LIVE',
    yesPrice: 0.78,
    noPrice: 0.22
  },
  setActiveMarket: (market) => set({ activeMarket: market }),

  customMarkets: (() => {
    try {
      const saved = localStorage.getItem('aira_custom_markets');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  })(),
  addCustomMarket: (market) => set((state) => {
    const updated = [market, ...state.customMarkets.filter(m => m.title !== market.title)];
    try {
      localStorage.setItem('aira_custom_markets', JSON.stringify(updated));
    } catch (e) {
      console.warn('[LocalStorage Save Error]:', e);
    }
    return { customMarkets: updated };
  }),

  toast: null,
  showToast: (title, message, type = 'info', hash = null) => {
    set({ toast: { title, message, type, hash, id: Date.now() } });
    setTimeout(() => {
      set((state) => state.toast?.id === state.toast?.id ? { toast: null } : state);
    }, 8000);
  },
  hideToast: () => set({ toast: null })
}));

export default useAppStore;
