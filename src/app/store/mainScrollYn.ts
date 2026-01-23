import { create } from 'zustand';

interface mainScrollYnState {
  yn: boolean;
  mainScrollYnSet: (value : boolean) => void;
}

// 초기 상태 정의
const mainScrollYn = create<mainScrollYnState>((set) => ({
  yn : false,
  mainScrollYnSet: (value : boolean) => {set({ yn: value })},
}));

export default mainScrollYn;