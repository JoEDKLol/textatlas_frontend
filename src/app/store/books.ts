import { create } from 'zustand';



interface imagesItf {
  medium_cover:string
  cover:string
}

interface bookItf {
  _id:string
  book_seq:number
  book_id:number
  title:string
  book_title:string
  images:[imagesItf]
  readYn:string
}

interface bookListState {
  bookList: bookItf[] ;
  bookListSet: (restaurant:any) => void;
  bookListAdd: (restaurant:any) => void;
}

// 초기 상태 정의
const bookState = create<bookListState>((set) => ({
  bookList : [],
  bookListSet: (book: bookItf[]) => set({bookList: book}),
  bookListAdd: (prevState: bookItf[]) => set((state)=>({
    ...state,
    bookList : [...state.bookList, ...prevState]
  }))

}));

export default bookState;