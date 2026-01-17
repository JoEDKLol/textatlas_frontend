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
  userInfoSeeYn:boolean
}

interface tagItf {
  tagname:string
}

interface tagSearchYnItf {
  style:string
  tagYn:boolean
}

interface bookListState {
  communityList: communityItf[] ;
  lastSeq:number;
  text:string;
  tagName:tagItf[];
  searchTagList:any;
  tagSearchYn:tagSearchYnItf;
  tagText:string;
  tagSearchYnSet : (obj:any) => void;
  tagTextSet :  (tagText:string) => void;
  textSet :  (text:string) => void;
  lastSeqSet :  (page:number) => void;
  communityListSet: (community:any) => void;
  communityListAdd: (community:any) => void;
  tagNameListSet: (tagName:any) => void;
  searchTagListSet: (tag:any) => void;
  searchTagListAdd: (tag:any) => void;
  searchTagListDelete: (tag:any) => void;
  setUserInfoSeeYn : (index:number, yn:boolean) => void;
}

// 초기 상태 정의
const communityState = create<bookListState>((set) => ({
  communityList : [],
  lastSeq:0,
  text : "",
  tagName:[],
  searchTagList:[],
  tagSearchYn:{style:" h-[110px] ", tagYn:false},
  tagText:"",
  tagSearchYnSet:(obj:any) => {set({tagSearchYn:obj})},
  tagTextSet: (tagText:string) => {set({ tagText: tagText })},
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
  
  setUserInfoSeeYn: (index:number, yn:boolean) => set((state)=>{
    const newArray = [...state.communityList];
    newArray[index] = { ...newArray[index],  userInfoSeeYn:yn};
    return {communityList: newArray};
  }),

}));

export default communityState;