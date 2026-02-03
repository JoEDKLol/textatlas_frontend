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

interface userInfoItf {
  _id:string
  userseq:number
  email:string
  username:string
  userimg:string
  userthumbImg:string
  introduction:string
}

interface communityItf {
  _id:string
  community_seq:number
  userseq:string
  title:string
  contents:string
  hashtags:[]
  likecnt:number
  commentcnt:number
  userinfo:userInfoItf
  regdate:string
  userInfoSeeYn:boolean

}

interface wordinfoItf {
  meaningKR:string
  reworkmeaningKR:string
  reworkynKR:boolean
  meaningES:string
  reworkmeaningES:string 
  reworkynES:string
}

interface hotWordItf {
  _id:string
  seq:number
  regdt:string
  word:string
  count:number
  wordinfo:wordinfoItf
  saveyn:boolean
  styel:string
  showYn:boolean
}


interface imagesItf {
  medium_cover:string
  cover:string
}

interface hotSentenceItf {
  _id:string
  seq:number
  regdt:string
  book_seq:number
  page:number
  sentenceindex:number
  count:number
  sentence:string
  translatedsentenceKR:string
  translatedsentenceES:string
  saveyn:boolean
  book_title:string
  images:imagesItf
  currentLang:string
  translatorYn:boolean
}




interface bookListState {
  bookList: bookItf[] ;
  bookListSet: (restaurant:any) => void;
  communityList: communityItf[] ;
  communityListSet: (community:any) => void;
  hotWordList : hotWordItf[];
  hotWordListSet: (hotword:any) => void;
  hotSentenceList : hotSentenceItf[];
  hotSentenceListSet: (hotSentenceList:any) => void;
  searchYn : boolean
  searchYnSet : (searchYn:any) => void;
  setHotWordShowYn : (index:number, yn:boolean) => void;
  setCurrentLang : (index:number, yn:string) => void;
  setTranslatorYn : (index:number, yn:boolean) => void;

}

// 초기 상태 정의
const homeState = create<bookListState>((set) => ({
  bookList : [],
  bookListSet: (book: bookItf[]) => set({bookList: book}),

  // 커뮤니티
  communityList : [],
  communityListSet: (community: communityItf[]) => set({communityList: community}),

  //Hotword
  hotWordList : [],
  hotWordListSet: (hotword: hotWordItf[]) => set({hotWordList: hotword}),
  showYn : false,
  setHotWordShowYn: (index:number, yn:boolean) => set((state)=>{
    const newArray = [...state.hotWordList];
    newArray[index] = { ...newArray[index],  showYn:yn};
    return {hotWordList: newArray};
  }),


  //HotSentence
  hotSentenceList : [],
  hotSentenceListSet: (hotSentence: hotSentenceItf[]) => set({hotSentenceList: hotSentence}),
  currentLang : "",
  setCurrentLang: (index:number, lang:string) => set((state)=>{
    const newArray = [...state.hotSentenceList];
    newArray[index] = { ...newArray[index],  currentLang:lang};
    return {hotSentenceList: newArray};
  }),
  translatorYn : false,
  setTranslatorYn: (index:number, yn:boolean) => set((state)=>{
    const newArray = [...state.hotSentenceList];
    newArray[index] = { ...newArray[index],  translatorYn:yn};
    return {hotSentenceList: newArray};
  }),


  searchYn : false,
  searchYnSet: (yn: boolean) => set({searchYn: yn}),

}));

export default homeState;