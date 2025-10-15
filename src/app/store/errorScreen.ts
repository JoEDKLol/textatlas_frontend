import { create } from 'zustand';

interface errorScreenShowState {
  screenShow: boolean;
  message: string;
  screenShowTrue: () => void;
  screenShowFalse: () => void;
  messageSet :  (text:string) => void;
}

// 초기 상태 정의
const errorScreenShow = create<errorScreenShowState>((set) => ({
  screenShow : false,
  message : "",
  screenShowTrue: () => {set({ screenShow: true })},
  screenShowFalse: () => {set({ screenShow: false })},
  messageSet: (text:string) => {set({ message: text })},
}));

export default errorScreenShow;