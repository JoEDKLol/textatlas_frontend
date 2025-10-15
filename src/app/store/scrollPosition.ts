import { create } from 'zustand';

interface scrollPositonState {
  scrollY: string;
  scrollYSet: (scrollYStr : string) => void;
}

// 초기 상태 정의
const scrollPositon = create<scrollPositonState>((set) => ({
  scrollY : "0",
  scrollYSet: (scrollYStr : string) => {set({ scrollY: scrollYStr })},
}));

export default scrollPositon;