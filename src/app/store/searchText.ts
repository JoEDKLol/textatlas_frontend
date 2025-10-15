import { create } from 'zustand';

interface searchTextStateInF {
  text: string;
  firstSearchYn: boolean
  currentPage:number
  textSet :  (text:string) => void;
  firstSearchYnSet :  (searchYn:boolean) => void;
  currentPagePageSet :  (page:number) => void;
}

// 초기 상태 정의
const searchTextState = create<searchTextStateInF>((set) => ({

  text : "",
  firstSearchYn : false,
  currentPage:0,
  textSet: (search:string) => {set({ text: search })},
  firstSearchYnSet: (searchYn:boolean) => {set({ firstSearchYn: searchYn })},
  currentPagePageSet: (page:number) => {set({ currentPage: page })},
}));

export default searchTextState;