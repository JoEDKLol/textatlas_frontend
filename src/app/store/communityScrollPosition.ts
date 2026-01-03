import { create } from 'zustand';

interface communityScrollPositonState {
  scrollY: string;
  scrollYSet: (scrollYStr : string) => void;
}

// 초기 상태 정의
const communityScrollPositon = create<communityScrollPositonState>((set) => ({
  scrollY : "0",
  scrollYSet: (scrollYStr : string) => {set({ scrollY: scrollYStr })},
}));

export default communityScrollPositon;