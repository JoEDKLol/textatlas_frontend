import { create } from 'zustand';

interface languageState {
  current_language: string;
  setYn:boolean;
  text_by_language_us:any;
  text_by_language_kr:any; 
  text_by_language_mx:any; 
  main_language_set:any;
  setCurrentLang: (obj:any) => void;
  setLanguage: (obj:any) => void;
  setMainLanguageSet: (obj:any) => void;
  // screenShowTrue: () => void;
  // screenShowFalse: () => void;
}

/*
ex) text_by_language
{
  language:"us"
  text_set:[
    {
      part_name:"home_header_menu1",
      text:"HOME"
    },
    {
      part_name:"home_header_menu2",
      text:"READING MATERIAL"
    },
    {
      part_name:"home_header_menu3",
      text:"MY PROFILE"
    },
  ]
},
{
  language:"kr"
  text_set:[
    {
      part_name:"home_header_menu1",
      text:"홈"
    },
    {
      part_name:"home_header_menu2",
      text:"읽을거리"
    },
    {
      part_name:"home_header_menu3",
      text:"내 프로필 "
    },
  ]
}, 


*/

// 초기 상태 정의
const languageState = create<languageState>((set) => ({
  current_language : "",
  setYn:false,
  text_by_language_us:[{page:"", text:[]}], 
  text_by_language_kr:[{page:"", text:[]}], 
  text_by_language_mx:[{page:"", text:[]}], 
  main_language_set:[{page:"", text:[]}],
  setCurrentLang : (str:string) => {set({current_language:str})},
  setLanguage: (obj:any) => {set({ 
    text_by_language_us:obj.text_by_language_us,
    text_by_language_kr:obj.text_by_language_kr,
    text_by_language_mx:obj.text_by_language_mx,
  })},
  setMainLanguageSet: (arr:[{}]) => {set({ 
    main_language_set:arr,
  })},


  // screenShowTrue: () => {set({ screenShow: true })},
  // screenShowFalse: () => {set({ screenShow: false })},

}));

export default languageState;