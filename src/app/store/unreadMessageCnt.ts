import { create } from 'zustand';

interface unreadMessageCntState {
  cnt: number;
  unreadMessageCntSet: (value : number) => void;
}

// 초기 상태 정의
const unreadMessageCnt = create<unreadMessageCntState>((set) => ({
  cnt : 0,
  unreadMessageCntSet: (value : number) => {set({ cnt: value })},
}));

export default unreadMessageCnt;