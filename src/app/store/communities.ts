import { create } from 'zustand';



interface userInfoItf {
  userseq:number
  email:string
  username:string
  userimg:string
  userthumbImg:string
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
}

interface tagItf {
  tagname:string
}

interface bookListState {
  communityList: communityItf[] ;
  lastSeq:number;
  text:string;
  tagName:tagItf[];
  searchTagList:any;
  textSet :  (text:string) => void;
  lastSeqSet :  (page:number) => void;
  communityListSet: (community:any) => void;
  communityListAdd: (community:any) => void;
  tagNameListSet: (tagName:any) => void;
  searchTagListSet: (tag:any) => void;
  searchTagListAdd: (tag:any) => void;
  searchTagListDelete: (tag:any) => void;
}

// 초기 상태 정의
const communityState = create<bookListState>((set) => ({
  communityList : [],
  lastSeq:0,
  text : "",
  tagName:[],
  searchTagList:[],
  textSet: (search:string) => {set({ text: search })},
  lastSeqSet: (page:number) => {set({ lastSeq: page })},
  communityListSet: (community: communityItf[]) => set({communityList: community}),
  communityListAdd: (prevState: communityItf[]) => set((state)=>({
    ...state,
    communityList : [...state.communityList, ...prevState]
  })),
  tagNameListSet: (community: []) => set({tagName: community}),

  searchTagListSet: (tag: []) => set({searchTagList: tag}),
  searchTagListAdd: (prevState) => set((state)=>({
    searchTagList : [...state.searchTagList, prevState]
  })),
  searchTagListDelete: (index:number) => set((state)=>{
    const newArray = [...state.searchTagList];
    newArray.splice(index, 1); // splice로 직접 삽입
    return {searchTagList: newArray};
  }),

}));

export default communityState;