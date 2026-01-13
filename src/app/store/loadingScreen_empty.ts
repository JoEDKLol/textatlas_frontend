import { create } from 'zustand';

interface loadingScreenEmptyShowState {
  screenShow: boolean;
  screenShowTrue: () => void;
  screenShowFalse: () => void;
}

// 초기 상태 정의
const loadingScreenEmptyShow = create<loadingScreenEmptyShowState>((set) => ({
  screenShow : false,
  screenShowTrue: () => {set({ screenShow: true })},
  screenShowFalse: () => {set({ screenShow: false })},
}));

export default loadingScreenEmptyShow;