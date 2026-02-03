import { create } from 'zustand';

interface homeScrollPositionScrollPositonState {
  scrollY: string;
  scrollYSet: (scrollYStr : string) => void;
}

// 초기 상태 정의
const homeScrollPositon = create<homeScrollPositionScrollPositonState>((set) => ({
  scrollY : "0",
  scrollYSet: (scrollYStr : string) => {set({ scrollY: scrollYStr })},
}));

export default homeScrollPositon; 