import { create } from 'zustand';

interface alertPopupShowState {
  screenShow: boolean;
  title: string;
  content: string;
  screenShowTrue: () => void;
  screenShowFalse: () => void;
  messageSet :  (title:string, content:string) => void;
}

// 초기 상태 정의
const alertPopupShow = create<alertPopupShowState>((set) => ({
  screenShow : false,
  title: "",
  content: "",
  screenShowTrue: () => {set({ screenShow: true })},
  screenShowFalse: () => {set({ screenShow: false })},
  messageSet: (title:string, content:string ) => {set({ title: title, content:content})},
}));

export default alertPopupShow;