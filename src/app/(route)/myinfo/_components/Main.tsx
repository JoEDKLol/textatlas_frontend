import { ButtonCommunitySee, ButtonMessageNext, ButtonMyInfoNext } from "@/app/compontents/design/buttons/Buttons";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { transactionFile } from "@/app/utils/axiosFile";
import { getChangedMongoDBTimestpamp } from "@/app/utils/common";
import imageCompression from "browser-image-compression";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { LuSquarePen } from "react-icons/lu";

interface tabsItf {
  selected : boolean
  style : string
  searchYn : boolean
}

interface tabListItf extends Array<tabsItf>{}

interface communityItf {
  _id:string
  community_seq:number
  userseq:string
  title:string
  contents:string
  hashtags:[]
  likecnt:number
  commentcnt:number
  regdate:string
  userInfoSeeYn:boolean
}

interface communityListItf extends Array<communityItf>{}

interface commentItf {
  _id:string
  comment_seq:number
  community_seq:number
  userseq:string
  subcommentwriteyn:boolean
  subcommentyn:boolean
  communityinfo:communityItf
  comment:string
  likecnt:number
  regdate:string
  subcommentcnt:number
}

interface commentListItf extends Array<commentItf>{}

interface subCommentItf {
  _id:string
  comment_seq:number
  subcomment_seq:number
  community_seq:number
  userseq:string
  communityinfo:communityItf
  comment:string
  likecnt:number
  regdate:string
}

interface subCommentListItf extends Array<subCommentItf>{}

interface likeCommunityItf {
  community_seq:number
  userseq:number
  communityinfo:communityItf
}

interface likeCommunityListItf extends Array<likeCommunityItf>{}


const Main = (props:any) => {
  const router = useRouter();
  const userStateSet = props.userStateSet;
  const languageStateSet = languageState();  

  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  const [userimg, setUserimg] = useState<string>(userStateSet.userimg);
  const [userthumbImg, setUserthumbImg] = useState<string>(userStateSet.userthumbImg);

  const [usernameYn, setUsernameYn] = useState<boolean>(false);
  const [userIntroYn, setUserIntroYn] = useState<boolean>(false);

  const [usernameStyle, setUsernameStyle] = useState<string>(" bg-gray-50 ");
  const [userIntroStyle, setUserIntroStyle] = useState<string>(" bg-gray-50 ");

  const [username, setUsername] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");

  const focusUserName = useRef<HTMLInputElement>(null);
  const focusUserIntro = useRef<HTMLTextAreaElement>(null);
  
  const [tabList, setTabList] = useState<tabListItf>(
    [
      {selected:true, style:" text-white bg-[#4A6D88] ", searchYn:false},
      {selected:false, style:" text-[#4A6D88] bg-white ", searchYn:false},
      {selected:false, style:" text-[#4A6D88] bg-white ", searchYn:false},
      {selected:false, style:" text-[#4A6D88] bg-white ", searchYn:false}
    ]
  );

  const [currentTab, setCurrentTab] = useState<number>(0);

  //커뮤니티조회
  const [communityList, setCommunityList] = useState<communityListItf>([]);
  //커뮤니티조회 마지막 번호
  const [communityLastSeq, setCommunityLastSeq] = useState<number>(0);

  //댓글
  const [commentList, setCommentList] = useState<commentListItf>([]);
  //댓글 마지막 번호
  const [commentLastSeq, setCommentLastSeq] = useState<number>(0);

  //대댓글
  const [subCommentList, setSubCommentList] = useState<subCommentListItf>([]);
  //대댓글 마지막 번호
  const [subCommentLastSeq, setSubCommentLastSeq] = useState<number>(0);

  //좋아요 클릭한 커뮤니티글
  const [likeCommunityList, setLikeCommunityList] = useState<likeCommunityListItf>([]);
  //대댓글 마지막 번호
  const [likeCommunityListLastSeq, setLikeCommunityListLastSeq] = useState<number>(0);

  useEffect(()=>{
    // console.log(userStateSet);
    // 
    if(userStateSet.username){
      setUsername(userStateSet.username);
    }

    if(userStateSet.introduction){
      setIntroduction(userStateSet.introduction);
    }
  },[userStateSet]);

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < username.length; i++) {
      const currentByte = username.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 40){
        setUsername(username.substring(0, i));
        break;
      }
    }
  },[username]);

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < introduction.length; i++) {
      const currentByte = introduction.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 400){
        setIntroduction(introduction.substring(0, i));
        break;
      }
    }
  },[introduction]);


  useEffect(()=>{
    if(userStateSet.id){
      searchCommunityList();
    }
  },[]);


  async function userFileUploadHandler(e:any){
    try {
      const file = e.target.files[0]; 
      if(!file) return;

      if(userimg){
        userDeleteImg();
      }

      const options = {
        maxSizeMB: 0.2, // 이미지 최대 용량
        // maxWidthOrHeight: 1920, // 최대 넓이(혹은 높이)
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const imgUploadRes = await transactionFile("community/fileUploadS3", compressedFile, {}, "", false, true, screenShow, errorShow);
      
 
      if(imgUploadRes.sendObj.success === 'y'){
        e.target.value = '';
        setUserimg(imgUploadRes.sendObj.resObj.img_url);
        setUserthumbImg(imgUploadRes.sendObj.resObj.thumbImg_url);
      }else{
        errorShow.screenShowTrue();
        errorShow.messageSet(imgUploadRes.sendObj.resObj.errMassage);
      }
    } catch (error) {
      //console.log(error)
    }
  }

  async function save(){
    const obj = {
      userseq:userStateSet.userseq,
      email:userStateSet.email,
      userimg:userimg,
      userthumbImg:userthumbImg,
      username:username,
      introduction:introduction,
    }
    
    const retObj = await transactionAuth("post", "user/userupdate", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === 'y'){

      userStateSet.usernameSet(username);
      userStateSet.userimgSet(userimg);
      userStateSet.userthumbImgSet(userthumbImg);
      userStateSet.introductionSet(introduction);
      setUsernameYn(false);
      setUserIntroYn(false);
    }
  }

  async function userDeleteImg(){
    // console.log(userimg);
    // console.log("uploads"+userimg.split("uploads")[1]);
    const obj = {
      // userseq:userStateSet.userseq,
      // email:userStateSet.email,
      file_key:"uploads"+userimg.split("uploads")[1],
    }
    
    const retObj = await transactionAuth("post", "community/fileDeleteS3", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === 'y'){
      setUserimg("");
      setUserthumbImg("");
    }
  }

  useEffect(()=>{
    if(usernameYn){
      focusUserName.current?.focus();
      setUsernameStyle("  ")
    }else{
      setUsernameStyle(" bg-gray-50 ");
    }
  },[usernameYn]);

  useEffect(()=>{
    if(userIntroYn){
      focusUserIntro.current?.focus();
      setUserIntroStyle(" ");
    }else{ 
      setUserIntroStyle(" bg-gray-50 ");
    }
  },[userIntroYn]);

  function onClickName(){
    setUsernameYn(!usernameYn);
  }

  function onClickIntroduce(){
    setUserIntroYn(!userIntroYn);
  }

  function onchangeHandlerUsername(e:any){
    setUsername(e.target.value);
  }

  function onchangeHandlerUserIntro(e:any){
    setIntroduction(e.target.value);
  }

  function clickTab(index:number){

    //초기화
    tabList[0].selected = false;
    tabList[0].style = " text-[#4A6D88] bg-white "
    tabList[1].selected = false;
    tabList[1].style = " text-[#4A6D88] bg-white "
    tabList[2].selected = false;
    tabList[2].style = " text-[#4A6D88] bg-white "
    tabList[3].selected = false;
    tabList[3].style = " text-[#4A6D88] bg-white "

    tabList[index].selected = true;
    tabList[index].style = " text-white bg-[#4A6D88] "
    setTabList([...tabList]);
    setCurrentTab(index);

    if(index === 0){
      searchCommunityList();
    }else if(index === 1){
      searchCommentList();
    }else if(index === 2){
      searchSubCommentList();
    }else if(index === 3){
      searchLikeCommunityList();
    }
  }

  //사용자가 작성한 커뮤니티 글리스트 조회
  async function searchCommunityList(){
    setCommunityList([]);
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:0,
    }

    const retObj = await transactionAuth("post", "community/communitylistsearchbyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        // setCommunityList([...communityList,  ...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        setCommunityLastSeq(retObj.sendObj.resObj[lastArr].community_seq);
        setCommunityList(retObj.sendObj.resObj);
        // communityStateSet.communityListAdd(retObj.sendObj.resObj);
        
      }
    }
  }

  //사용자가 작성한 커뮤니티 글리스트 다음 조회
  async function searchCommunityListNext(){

    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:communityLastSeq,
    }

    const retObj = await transactionAuth("post", "community/communitylistsearchbyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        // setCommunityList([...communityList,  ...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        setCommunityLastSeq(retObj.sendObj.resObj[lastArr].community_seq);
        setCommunityList([...communityList , ...retObj.sendObj.resObj]);
        // communityStateSet.communityListAdd(retObj.sendObj.resObj);
        
      }
    }
  }

  //사용자가 작성한 댓글 리스트 조회
  async function searchCommentList(){
    setCommentList([]);
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:0,
    }

    const retObj = await transactionAuth("post", "community/commentlistsearchbyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        const lastArr = retObj.sendObj.resObj.length-1;
        setCommentLastSeq(retObj.sendObj.resObj[lastArr].comment_seq);
        setCommentList(retObj.sendObj.resObj);
      }
    }
  }

  //사용자가 작성한 댓글 리스트 다음 조회
  async function searchCommentListNext(){
    
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:commentLastSeq,
    }

    const retObj = await transactionAuth("post", "community/commentlistsearchbyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        const lastArr = retObj.sendObj.resObj.length-1;
        setCommentLastSeq(retObj.sendObj.resObj[lastArr].comment_seq);
        setCommentList([ ...commentList , ...retObj.sendObj.resObj]);
      }
    }
  }

  //사용자가 작성한 대댓글 리스트 조회
  async function searchSubCommentList(){
    setSubCommentList([]);
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:0,
    }

    const retObj = await transactionAuth("post", "community/subcommentlistsearchbyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        const lastArr = retObj.sendObj.resObj.length-1;
        setSubCommentLastSeq(retObj.sendObj.resObj[lastArr].subcomment_seq);
        setSubCommentList(retObj.sendObj.resObj);
      }
    }
  }

  //사용자가 작성한 댓댓글 리스트 다음 조회
  async function searchSubCommentListNext(){

    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:subCommentLastSeq,
    }

    const retObj = await transactionAuth("post", "community/subcommentlistsearchbyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        const lastArr = retObj.sendObj.resObj.length-1;
        setSubCommentLastSeq(retObj.sendObj.resObj[lastArr].subcomment_seq);
        setSubCommentList([ ...subCommentList , ...retObj.sendObj.resObj]);
      }
    }
  }

  //사용자가 좋아요 누른 커뮤니티글 조회
  async function searchLikeCommunityList(){
    setLikeCommunityList([]);
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:0,
    }

    const retObj = await transactionAuth("post", "community/likecommunitylistsearchbyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        const lastArr = retObj.sendObj.resObj.length-1;
        setLikeCommunityListLastSeq(retObj.sendObj.resObj[lastArr].community_seq);
        setLikeCommunityList(retObj.sendObj.resObj);
      }
    }
  }

  //사용자가 좋아요 누른 커뮤니티글 다음 조회 
  async function searchLikeCommunityListNext(){

    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:likeCommunityListLastSeq,
    }

    const retObj = await transactionAuth("post", "community/likecommunitylistsearchbyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        const lastArr = retObj.sendObj.resObj.length-1;
        setLikeCommunityListLastSeq(retObj.sendObj.resObj[lastArr].community_seq);
        setLikeCommunityList([ ...likeCommunityList , ...retObj.sendObj.resObj]);
      }
    }
  }

  // 커뮤니티 상세 보러가기
  function communityDetail(community_seq:number){
    router.push('/community/' + community_seq);
  }



  return(
    <>
    <div className="">
      <div className="h-[55px] w-full "></div> {/* 상단 헤더 만큼 아래로 */}
      <div className="w-full  ">
        <div className="flex justify-center ">


          {/* 상단영역 이름, 소개, 이미지 */}
          <div className="flex flex-col mt-10 w-[95%] max-w-[800px] p-5 rounded-lg shadow-lg border border-gray-300 ">
            
            <div className="w-full flex justify-start items-center ">
              <div className="flex flex-col h-[200px]
              2xl:h-[220px]  xl:h-[220px]  lg:h-[220px]  md:h-[220px]  sm:h-[200px]
              ">
                <div className="w-[160px] h-[160px] flex justify-center items-center 
                2xl:w-[180px]  xl:w-[180px]  lg:w-[180px]  md:w-[180px]  sm:w-[160px] 
                2xl:h-[180px]  xl:h-[180px]  lg:h-[180px]  md:h-[180px]  sm:h-[160px]
                ">
                  <div className="relative w-full h-full rounded-lg ">
                    <div className='absolute  w-[160px] h-[160px] rounded-lg -z-0 border border-gray-300 
                    2xl:w-[180px]  xl:w-[180px]  lg:w-[180px]  md:w-[180px]  sm:w-[160px] 
                    2xl:h-[180px]  xl:h-[180px]  lg:h-[180px]  md:h-[180px]  sm:h-[160px]
                    '>

                      {
                        (userimg)?
                        <Image
                        src={
                          userimg
                        }
                        alt=""
                        layout="fill" 
                        style={{  borderRadius:"7px",}}
                        priority
                        />
                        :
                        <div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                      }
                    </div>
                  </div>
                </div>
                <div className="w-[160px] 
                2xl:w-[180px]  xl:w-[180px]  lg:w-[180px]  md:w-[180px]  sm:w-[160px] 
                flex justify-center items-center ">
                  <div className="flex justify-end items-center w-full text-center mt-2">
                    <label className="
                    text-xs border px-2  rounded-2xl w-[70px]
                  bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold 
                    transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[1px]" 
                    htmlFor="file_input">
                      {(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[2]:""} 
                    </label>
                    <input className=" text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
                    hidden
                    " id="file_input" type="file"
                    accept="image/*" 
                    onChange={(e)=>userFileUploadHandler(e)}
                    />
                  </div>
                  <div className="flex justify-start items-center w-full text-center mt-2 ps-2">
                    <button className="text-xs border px-2  rounded-2xl w-[70px]
                    bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold 
                    transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[1px]
                    "
                    onClick={()=>userDeleteImg()}
                    >{(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[3]:""}</button>
                  </div>
                </div>
              </div>



              <div className=" ps-3 flex flex-col flex-1 text-xs
              2xl:text-sm  xl:text-sm  lg:text-sm  md:text-sm  sm:text-xs px-1 
              
              ">
                <div className="mb-1 text-[#4A6D88] font-bold flex justify-between items-end">
                  
                  <div>{(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[0]:""}</div>
                  <div className="text-[15px] cursor-pointer 
                  transition-transform duration-300 ease-in-out hover:scale-110
                  "
                  onClick={()=>onClickName()}
                  ><LuSquarePen /></div>
                  
                </div>
                <div className="">
                  <input className={usernameStyle + ` w-full border px-2 py-1 rounded-lg border-[#4A6D88] text-[#4A6D88] focus:outline-none` }
                  disabled={!usernameYn}
                  ref={focusUserName}
                  value={username}
                  onChange={(e)=>onchangeHandlerUsername(e)}
                  ></input>
                </div>
                <div className="pt-2 mb-1 text-[#4A6D88] font-bold flex justify-between items-end">
                  <div>{(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[1]:""}</div>
                  <div className="text-[15px] cursor-pointer 
                  transition-transform duration-300 ease-in-out hover:scale-110
                  "
                  onClick={()=>onClickIntroduce()}
                  ><LuSquarePen /></div>
                </div>
                <div className=" ">
                  <textarea className={ userIntroStyle + ` h-[80px] w-full border px-2 py-2 rounded-lg border-[#4A6D88] text-[#4A6D88] 
                  focus:outline-none resize-none p-3 overflow-y-auto
                  2xl:h-[100px]  xl:h-[100px]  lg:h-[100px]  md:h-[100px]  sm:h-[80px]
                   
                  `}
                  ref={focusUserIntro}
                  disabled={!userIntroYn}
                  value={introduction}
                  onChange={(e)=>onchangeHandlerUserIntro(e)}
                  ></textarea>
                </div>
                <div className="w-full flex justify-end">
                  <button className="text-xs border px-2  rounded-2xl w-[80px]
                  bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold 
                  transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[1px]
                  "
                  onClick={()=>save()}
                  >{(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[4]:""}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 본인이 작성한 커뮤니티 및 댓글 대댓글 등의 정보 */}
        {/* 본인이 작성한 커뮤니티글 */}
        {/* 좋아요 남긴 커뮤니티글 리스트 */}
        {/* 본인이 작성한 댓글 */}
        {/* 본인이 작성한 대댓글 */}
        <div className="flex justify-center items-start w-full mb-10 ">
          <div className="flex flex-col mt-5 w-[95%] max-w-[800px] p-5 rounded-lg shadow-lg border border-gray-300 ">
            {/* 탭메뉴 */}
            <div className=" w-full flex justify-start items-center border-b border-[#4A6D88]">
              <div className={tabList[0].style + ` border-t border-l border-r pt-2 px-2 pb-1 rounded-t-lg border-[#4A6D88]  cursor-pointer 
              transition-transform duration-300 ease-in-out hover:scale-105  transform text-xs font-bold`}
              onClick={()=>clickTab(0)}
              >
                {(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[5]:""}
                
                
              </div>
              <div className={tabList[1].style + ` border-t border-l border-r pt-2 px-2 pb-1 rounded-t-lg border-[#4A6D88] text-[#4A6D88] cursor-pointer 
              transition-transform duration-300 ease-in-out hover:scale-105 transform text-xs font-bold`}
              onClick={()=>clickTab(1)}
              >
                {(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[6]:""}
              </div>
              <div className={tabList[2].style + ` border-t border-l border-r pt-2 px-2 pb-1 rounded-t-lg border-[#4A6D88] text-[#4A6D88] cursor-pointer 
              transition-transform duration-300 ease-in-out hover:scale-105 transform text-xs font-bold`}
              onClick={()=>clickTab(2)}
              >
                {(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[7]:""}
              </div>
              <div className={tabList[3].style + ` border-t border-l border-r pt-2 px-2 pb-1 rounded-t-lg border-[#4A6D88] text-[#4A6D88] cursor-pointer 
              transition-transform duration-300 ease-in-out hover:scale-105 transform text-xs font-bold`}
              onClick={()=>clickTab(3)}
              >
                {(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[8]:""}
              </div>
              
            </div>
            <div className="w-full flex justify-center ">
              {
                (currentTab === 0)? //사용자가 작성한 커뮤니티
                <div className="w-full pt-2 h-[600px] ">
                  <div className="w-full h-[550px] overflow-y-auto">
                  {
                    communityList.map((elem, index)=>{
                      return(
                        <div key={index+"community"} className="w-[98%] border rounded-lg border-gray-400 mb-3  ">
                          <div className=" w-full flex flex-col justify-start items-center p-2 ">
                            <div className="w-full flex justify-between items-center text-[10px] my-1 ">
                              <div className="">{getChangedMongoDBTimestpamp(elem.regdate)}</div>
                              <div className=" pe-1 ">
                                <ButtonCommunitySee text={(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[7]:""}
                                onClick={
                                ()=>communityDetail(elem.community_seq)
                                }
                                />
                              </div>
                            </div> 
                            <div className="w-full max-h-[50px] line-clamp-2 text-sm font-bold break-all mt-1   "
                            >
                              {elem.title}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: elem.contents }} 
                            className="w-full text-xs  mt-1 break-words overflow-y-auto border rounded-lg h-[110px] p-2 border-gray-300">
                            </div>
                            <div className="w-full pt-1 flex items-start">
                            {/* 하단 좋아요 */}
                              <div className="flex text-sm justify-start items-center  mb-1"
                              // onClick={()=>communityDetail(elem.community_seq)}
                              >
                                <div><IoIosHeartEmpty/></div>
                                <div className="ps-2">{elem.likecnt}</div>
                                <div className="ps-4">
                                  <FaRegCommentDots />
                                </div>
                                <div className="ps-2">{elem.commentcnt}</div>
                              </div>
                            </div>
                            <div className="flex justify-start w-full  ">
                              <div className=" ">
                              {
                                elem.hashtags.map((elem2, index2)=>{
                                  return(
                                    <div key={index2 + "hashTag"} className=" inline-block pt-[2px] items-center h-[20px] bg-white text-[#4A6D88]
                                      border-[#4A6D88] font-bold
                                      rounded-[8px] border text-[10px] px-3
                                      me-1">
                                      {elem2}
                                    </div>
                                  )
                                })
                              }                              
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                  
                  </div>
                  <div className="w-full flex justify-end pt-3 mt-1  ">
                    <div className="">
                      <ButtonMyInfoNext text={
                        (languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[0]:""
                      }
                      onClick={()=>searchCommunityListNext()}
                      />
                    </div>
                  </div>
                </div>
                :(currentTab === 1)?
                <div className="w-full pt-2 h-[600px] ">
                  <div className="w-full h-[550px] overflow-y-auto">
                  {
                    commentList.map((elem, index)=>{
                      return(
                      <div key={index+"comment"} className="w-[98%] border rounded-lg border-gray-400 mb-3  ">
                        <div className=" w-full flex flex-col justify-start items-center p-2 ">
                          <div className="w-full flex justify-between items-center text-[10px] my-1 ">
                            <div className="">{getChangedMongoDBTimestpamp(elem.regdate)}</div>
                            <div className=" pe-1 ">
                              <ButtonCommunitySee text={(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[7]:""}
                              onClick={
                              ()=>communityDetail(elem.community_seq)
                              }
                              />
                            </div>
                          </div> 
                          <div className="w-full text-xs  mt-1 break-words overflow-y-auto border rounded-lg h-[80px] p-2 border-gray-300">
                            {elem.comment}
                          </div>
                          <div className="w-full pt-1 flex items-start">
                          {/* 하단 좋아요 */}
                            <div className="flex text-sm justify-start items-center  mb-1"
                            // onClick={()=>communityDetail(elem.community_seq)}
                            >
                              <div className="ps-1">
                                <FaRegCommentDots />
                              </div>
                              <div className="ps-2">{elem.subcommentcnt}</div>
                            </div>
                          </div>
                          
                          
                        </div>
                        
                      </div>
                      )
                    })
                  }
                  </div>
                  <div className="w-full flex justify-end pt-3 mt-1  ">
                    <div className="">
                      <ButtonMyInfoNext text={
                        (languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[0]:""
                      }
                      onClick={()=>searchCommentListNext()}
                      />
                    </div>
                  </div>
                </div>
                :(currentTab === 2)?
                <div className="w-full pt-2 h-[600px] ">
                  <div className="w-full h-[550px] overflow-y-auto">
                  {
                    subCommentList.map((elem, index)=>{
                      return(
                      <div key={index+"comment"} className="w-[98%] border rounded-lg border-gray-400 mb-3  ">
                        <div className=" w-full flex flex-col justify-start items-center p-2 ">
                          <div className="w-full flex justify-between items-center text-[10px] my-1 ">
                            <div className="">{getChangedMongoDBTimestpamp(elem.regdate)}</div>
                            <div className=" pe-1 ">
                              <ButtonCommunitySee text={(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[7]:""}
                              onClick={
                              ()=>communityDetail(elem.community_seq)
                              }
                              />
                            </div>
                          </div> 
                          <div className="w-full text-xs  mt-1 break-words overflow-y-auto border rounded-lg h-[75px] p-2 border-gray-300">
                            {elem.comment}
                          </div>
                        </div> 
                        
                      </div>
                      )
                    })
                  }
                  </div>
                  <div className="w-full flex justify-end pt-3 mt-1  ">
                    <div className="">
                      <ButtonMyInfoNext text={
                        (languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[0]:""
                      }
                      onClick={()=>searchSubCommentListNext()}
                      />
                    </div>
                  </div>
                </div>
                :(currentTab === 3)?
                <div className="w-full pt-2 h-[600px] ">
                  <div className="w-full h-[550px] overflow-y-auto">
                  {
                    likeCommunityList.map((elem, index)=>{
                      return(
                        <div key={index+"community"} className="w-[98%] border rounded-lg border-gray-400 mb-3  ">
                          <div className=" w-full flex flex-col justify-start items-center p-2 ">
                            <div className="w-full flex justify-between items-center text-[10px] my-1 ">
                              <div className="">{getChangedMongoDBTimestpamp(elem.communityinfo.regdate)}</div>
                              <div className=" pe-1 ">
                                <ButtonCommunitySee text={(languageStateSet.main_language_set[15])?languageStateSet.main_language_set[15].text[7]:""}
                                onClick={
                                ()=>communityDetail(elem.community_seq)
                                }
                                />
                              </div>
                            </div> 
                            <div className="w-full max-h-[50px] line-clamp-2 text-sm font-bold break-all mt-1   "
                            >
                              {elem.communityinfo.title}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: elem.communityinfo.contents }} 
                            className="w-full text-xs  mt-1 break-words overflow-y-auto border rounded-lg h-[110px] p-2 border-gray-300">
                            </div>
                            <div className="w-full pt-1 flex items-start">
                            {/* 하단 좋아요 */}
                              <div className="flex text-sm justify-start items-center  mb-1"
                              // onClick={()=>communityDetail(elem.community_seq)}
                              >
                                <div><IoIosHeartEmpty/></div>
                                <div className="ps-2">{elem.communityinfo.likecnt}</div>
                                <div className="ps-4">
                                  <FaRegCommentDots />
                                </div>
                                <div className="ps-2">{elem.communityinfo.commentcnt}</div>
                              </div>
                            </div>
                            <div className="flex justify-start w-full  ">
                              <div className=" ">
                              {
                                elem.communityinfo.hashtags.map((elem2, index2)=>{
                                  return(
                                    <div key={index2 + "hashTag"} className=" inline-block pt-[2px] items-center h-[20px] bg-white text-[#4A6D88]
                                      border-[#4A6D88] font-bold
                                      rounded-[8px] border text-[10px] px-3
                                      me-1">
                                      {elem2}
                                    </div>
                                  )
                                })
                              }
                              </div>
                            </div>                            
                          </div>
                        </div>
                      )
                    })
                  }
                  
                  </div>
                  <div className="w-full flex justify-end pt-3 mt-1  ">
                    <div className="">
                      <ButtonMyInfoNext text={
                        (languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[0]:""
                      }
                      onClick={()=>searchLikeCommunityListNext()}
                      />
                    </div>
                  </div>
                </div>
                :<></>
              }
            </div>


          </div>
        </div>
      </div>
    </div>  
    </>
  );
};

export default Main