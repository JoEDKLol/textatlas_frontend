import { create } from 'zustand';

interface loadingScreenShowState {
  screenShow: boolean;
  screenShowTrue: () => void;
  screenShowFalse: () => void;
}

// 초기 상태 정의
const loadingScreenShow = create<loadingScreenShowState>((set) => ({
  screenShow : false,
  screenShowTrue: () => {set({ screenShow: true })},
  screenShowFalse: () => {set({ screenShow: false })},
}));

export default loadingScreenShow;