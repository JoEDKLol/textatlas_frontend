import { create } from 'zustand';




interface userState {
  id: string;
  email:string;
  userseq : number
  username : string
  userimg : string
  userthumbImg : string
  role : string
  joinlevel : number
  learninglevel : number
  interestcategories : []
  interestDetails : []
  agree : object
  firstLogin : boolean
  socialLogin : boolean
  preferred_trans_lang : string
  userSet: (obj:any) => void;
  preferredTransLangSet: (obj:string) => void;
}

// 초기 상태 정의
const userState = create<userState>((set) => ({
  id : "",
  email : "",
  userseq : 0,
  username : "",
  userimg : "",
  userthumbImg : "",
  role : "",
  joinlevel : 0, 
  learninglevel : 0,
  interestcategories : [], 
  interestDetails : [],
  agree : {"all":false, "개인회원약관":false, "개인정보수집":false, "마케팅정보수집":false}, 
  firstLogin : false, 
  socialLogin : false, 
  preferred_trans_lang : "",
  userSet: (obj:any) => {set({ 
    id:obj.id, email:obj.email, userseq:obj.userseq, username:obj.username, 
    userimg:obj.userimg, userthumbImg : obj.userthumbImg, role:obj.role, 
    joinlevel:obj.joinlevel, learninglevel:obj.learninglevel, 
    interestcategories:obj.interestcategories, 
    interestDetails:obj.interestDetails,
    agree:obj.agree, 
    firstLogin:obj.firstLogin, 
    socialLogin:obj.socialLogin, 
    preferred_trans_lang:obj.preferred_trans_lang,
     })},
  preferredTransLangSet : (lang:string) => {set({preferred_trans_lang:lang})}

}));

export default userState;