'use client';
import Image from "next/legacy/image";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import errorScreenShow from "@/app/store/errorScreen";
import loadingScreenShow from "@/app/store/loadingScreen";
import languageState from "@/app/store/language";
import { useEffect, useRef, useState } from "react";
import { transaction } from "@/app/utils/axios";
import QuillEditorScreen from "@/app/compontents/common/quillEditor/QuillEditorScreen";
import { getChangedMongoDBTimestpamp } from "@/app/utils/common";
import { ButtonBaseAddTags, ButtonCommentNext, ButtonCommentSave, ButtonSubComment } from "@/app/compontents/design/buttons/Buttons";
import loadingScreenEmptyShow from "@/app/store/loadingScreen_empty";
import alertPopupShow from "@/app/store/alertPopup";
import { CiImageOn } from "react-icons/ci";

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

interface communityLikeItf{
  _id:string
  community_seq:number
  userseq:number
  likeyn:boolean
}



interface commentItf {
  _id:string
  comment_seq:number
  community_seq:number
  userseq:string
  userinfo:userInfoItf
  subcommentwriteyn:boolean
  subcommentyn:boolean
  communityinfo:communityItf
  comment:string
  likecnt:number
  regdate:string
  subcommentStyle:string
  subcomment:string
  subcommentList:[subCommentItf]
  subcommentcnt:number
  subCommentListSeeYn:boolean
  subCommentListSeeStyle:string
  subCommentLastSeq:number
  subCommentListFirstSearchYn:boolean
}

interface subCommentItf {
  _id:string
  comment_seq:number
  subcomment_seq:number
  community_seq:number
  userseq:string
  userinfo:userInfoItf
  communityinfo:communityItf
  comment:string
  likecnt:number
  regdate:string
  subcommentStyle:string
  subcomment:string
}

interface commentListItf extends Array<commentItf>{}

const Main = (props:any) => {
  
  const router = useRouter();
  const alertPopup = alertPopupShow();
  const languageStateSet = languageState();  
  const screenShow = loadingScreenShow();
  const screenShowEmpty = loadingScreenEmptyShow(); //중앙에 로딩 없는 창
  const errorShow = errorScreenShow();
  const path = usePathname();
  const userStateSet = props.userStateSet;
  const community_seq = path.split("/")[2];

  const focusComment = useRef<HTMLTextAreaElement>(null);
  const focusCommentList = useRef<null[] | HTMLTextAreaElement[]>([]);

  //게시물정보 상세
  const [community, setCommunity] = useState<communityItf>();

  //댓글쓰기 창 여부
  const [commentWriteYn, setCommentWriteYn] = useState<boolean>(false);

  //댓글쓰기창 style
  const [commentTextAreaStyle, setCommentTextAreaStyle]  = useState(" h-[0px] ");
  
  //댓글내용
  const [commentContent, setCommentContent] = useState("");

  //댓글조회 마지막 seq
  const [lastCommentSeq, setLastCommentSeq] = useState(0);

  //댓글조회 마지막 subseq
  const [lastSubCommentSeq, setSubLastCommentSeq] = useState(0);

  //댓글리스트
  const [commentList, setCommentList] = useState<commentListItf>([]);

  //커뮤니티 좋아요 여부
  const [communityLike, setCommunityLike] = useState<communityLikeItf>(
    {
      _id:"",
      community_seq:0,
      userseq:0,
      likeyn:false
    }
  );
  
  useEffect(() => {
    // console.log(userStateSet);
    searchCommunityDetail();
    commentSearch();
  }, []);

  useEffect(() => {
    // console.log(userStateSet);
    if(userStateSet.id){
      likeClickByUser();
    }
  }, [userStateSet]);


  async function searchCommunityDetail(){

    const obj = {
      community_seq:community_seq,
    }

    const retObj = await transaction("get", "community/communitydetailsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setCommunity(retObj.sendObj.resObj);
    }
  }

  //사용자가 로그인 되어있는 경우 좋아 클릭 조회한다.
  async function likeClickByUser(){

    const obj = {
      community_seq:community_seq,
      userseq:userStateSet.userseq
    }

    const retObj = await transaction("get", "community/communitylikebyuser", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      if(retObj.sendObj.resObj){
        setCommunityLike(retObj.sendObj.resObj);
      }
    }
  }

  function commentYn(){

    if(!userStateSet.id){
      alertPopup.screenShowTrue();
      alertPopup.messageSet("로그인!", "로그인이 필요 합니다.");
      return;
    } 
    
    if(commentWriteYn){
      setCommentTextAreaStyle(" h-[0px] ")
    }else{
      focusComment.current?.focus();
      setCommentTextAreaStyle(" h-[120px] ");
    }

    setCommentWriteYn(!commentWriteYn);

  }

  //좋아요 업데이트 처리
  async function likeClickHandler(){

    let likeyn;
    if(communityLike.likeyn){
      likeyn=false;
    }else{
      likeyn=true;
    }

    const obj = {
      community_id:community?._id,
      community_seq:community_seq,
      userseq:userStateSet.userseq,
      likeyn:likeyn,
      email:userStateSet.email
    }

    const retObj = await transaction("post", "community/communitylikeupdate", obj, "", false, true, screenShowEmpty, errorShow);
    if(retObj.sendObj.success === "y"){ 
      setCommunityLike({...communityLike, likeyn:retObj.sendObj.resObj.likeyn});
      setCommunity({...community as any,likecnt:retObj.sendObj.resObj.likecnt})
    }
  }

  //댓글 글자 수 체크
  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < commentContent.length; i++) {
      const currentByte = commentContent.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 400){
        setCommentContent(commentContent.substring(0, i));
        break;
      }
    }
  },[commentContent]);

  //댓글저장
  async function commentSave(){

    if(!commentContent){
      focusComment.current?.focus();
      return;
    }

    const obj = {
      community_seq:community_seq,
      userseq:userStateSet.userseq,
      userinfo:userStateSet.id,
      communityinfo:community?._id,
      email:userStateSet.email,
      comment:commentContent,
    }
    
    const retObj = await transaction("post", "community/commentsave", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){

      const obj = retObj.sendObj.resObj.newCommentObj;
      obj.subcommentStyle = " h-[0px] "
      obj.subCommentListSeeStyle = " h-[0px] ";
      obj.subcommentList = [];

      commentList.unshift(obj);
      setCommunity({...community as any,commentcnt:retObj.sendObj.resObj.commentcnt});
      setCommentTextAreaStyle(" h-[0px] ");
      setCommentWriteYn(false);
      setCommentContent("");
      setCommentList([...commentList]);
      // setLastCommentSeq(obj.seq);
    }
  }

  function commentOnChangeHandler(e:any){
    setCommentContent(e.target.value);
  }

  //댓글조회
  async function commentSearch(){ 

    setCommentList([]);
    
    const obj = {
      community_seq:community_seq,
      lastCommentSeq:0,
    }
    
    const retObj = await transaction("get", "community/commentsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      
      if(retObj.sendObj.resObj.length > 0){
        const lastArr = retObj.sendObj.resObj.length-1;

        for(let i=0; i<retObj.sendObj.resObj.length; i++){
          retObj.sendObj.resObj[i].subcommentStyle = " h-[0px] "
          retObj.sendObj.resObj[i].subCommentListSeeStyle = " h-[0px] ";
          retObj.sendObj.resObj[i].subcommentList = [];
          
        }
        setCommentList(retObj.sendObj.resObj);
        setLastCommentSeq(retObj.sendObj.resObj[lastArr].comment_seq);

        // setSubLastCommentSeq
        if(retObj.sendObj.resObj[lastArr].subcommentyn){
          setSubLastCommentSeq(retObj.sendObj.resObj[lastArr].subcomment_seq);
        }
      }

    }
  }

  //댓글다음조회
  async function commentNextSearch(){ 

    const obj = {
      community_seq:community_seq,
      lastCommentSeq:lastCommentSeq,
      subcomment_seq:lastSubCommentSeq
    }
    
    const retObj = await transaction("get", "community/commentsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      
      if(retObj.sendObj.resObj.length > 0){
        const lastArr = retObj.sendObj.resObj.length-1;

        for(let i=0; i<retObj.sendObj.resObj.length; i++){
          retObj.sendObj.resObj[i].subcommentStyle = " h-[0px] ";
          retObj.sendObj.resObj[i].subCommentListSeeStyle = " h-[0px] ";
          
        }

        setCommentList([...commentList, ...retObj.sendObj.resObj]);
        setLastCommentSeq(retObj.sendObj.resObj[lastArr].comment_seq);
        // if(retObj.sendObj.resObj[lastArr].subcommentyn){
        //   setSubLastCommentSeq(retObj.sendObj.resObj[lastArr].subcomment_seq);
        // }
      }

    }
  }

  

  function subCommentYn(index:number){

    if(!userStateSet.id){
      alertPopup.screenShowTrue();
      alertPopup.messageSet("로그인!", "로그인이 필요 합니다.");
      return;
    } 

    // console.log(commentList[index].subcommentyn);
    if(commentList[index].subcommentwriteyn){
      commentList[index].subcommentwriteyn = false;
      commentList[index].subcommentStyle = " h-[0px] "
    }else{
      commentList[index].subcommentwriteyn = true;
      commentList[index].subcommentStyle = " h-[120px] "
      focusCommentList.current[index]?.focus();
    }

    setCommentList([...commentList]);
    // subCommentListSee(index);

  }

  async function subCommentSave(index:number){
    
    const obj = {
      community_seq:community_seq,
      comment_seq:commentList[index].comment_seq,
      userseq:userStateSet.userseq,
      userinfo:userStateSet.id,
      communityinfo:community?._id,
      email:userStateSet.email,
      comment:commentList[index].subcomment,
    }

    
    
    const retObj = await transaction("post", "community/subcommentsave", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // setCommentList({...community as any,commentcnt:retObj.sendObj.resObj.commentcnt});
      const obj = retObj.sendObj.resObj.newCommentObj;
      obj.subcommentwriteyn = false;
      obj.subcommentStyle = " h-[0px] ";
      commentList[index].subcommentwriteyn = false;
      commentList[index].subcommentStyle = " h-[0px] ";
      commentList[index].subcomment = "";
      
      // const comment_seq = commentList[index].comment_seq;
      // let lastAddSeq=0; 
      // for(let i=0; i<commentList.length; i++){
      //   if(commentList[i].comment_seq === comment_seq){
      //     lastAddSeq = i;
      //   }
      // }

      if(commentList[index].subcommentList.length as any > 0){
        commentList[index].subcommentList.unshift(obj);
      } 

      
      commentList[index].subcommentcnt = retObj.sendObj.resObj.subcommentcnt;
      setCommentList([...commentList]);
      // setLastCommentSeq(obj.seq);
      // }
      



      // obj.subcommentStyle = " h-[0px] "
      // commentList.unshift(obj);
      // setCommentTextAreaStyle(" h-[0px] ");
      // setCommentWriteYn(false);
      // setCommentContent("");
    }
  }

  function subCommentOnChangeHandler(e:any, index:number){
    commentList[index].subcomment = e.target.value;
    setCommentList([...commentList]);
  }

  async function subCommentListSee(index:number){

    if(commentList[index].subCommentListSeeYn){
      commentList[index].subCommentListSeeYn = false;
      commentList[index].subCommentListSeeStyle = " h-[0px] "
    }else{
      commentList[index].subCommentListSeeYn = true;
      

      if(!commentList[index].subCommentListFirstSearchYn){
        
        //최초조회
        const obj = {
          community_seq:community_seq,
          lastSubCommentSeq:commentList[index].subCommentLastSeq,
          comment_seq:commentList[index].comment_seq
        }
        

        const retObj = await transaction("get", "community/subcommentsearch", obj, "", false, true, screenShow, errorShow);
        if(retObj.sendObj.success === "y"){ 
          
          if(retObj.sendObj.resObj.length > 0){

            const lastArr = retObj.sendObj.resObj.length-1;
            commentList[index].subCommentLastSeq = retObj.sendObj.resObj[lastArr].subcomment_seq
            commentList[index].subcommentList = [...commentList[index].subcommentList as any, ...retObj.sendObj.resObj] as any;
            commentList[index].subCommentListFirstSearchYn = true;
            setCommentList([...commentList, ...retObj.sendObj.resObj]);   
            commentList[index].subCommentListSeeStyle = " "         
          }else{
            commentList[index].subCommentListSeeStyle = " h-[0px] "
            commentList[index].subCommentListSeeYn = false;
            setCommentList([...commentList, ...retObj.sendObj.resObj]);
          }

        }
      }else{
        commentList[index].subCommentListSeeStyle = " "
      }
    }

    setCommentList([...commentList]);
  }

  //댓글더보기 조회
  async function subCommentListSearchNext(index:number){

    const obj = {
      community_seq:community_seq,
      lastSubCommentSeq:commentList[index].subCommentLastSeq,
      comment_seq:commentList[index].comment_seq
    }
    
    const retObj = await transaction("get", "community/subcommentsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      
      if(retObj.sendObj.resObj.length > 0){

        const lastArr = retObj.sendObj.resObj.length-1;
        commentList[index].subCommentLastSeq = retObj.sendObj.resObj[lastArr].subcomment_seq
        commentList[index].subcommentList = [...commentList[index].subcommentList as any, ...retObj.sendObj.resObj] as any;
        commentList[index].subCommentListFirstSearchYn = true;
        setCommentList([...commentList, ...retObj.sendObj.resObj]);        
      }
    }
  }


  
  return(
    <>
    <div className="">
      <div className="h-[75px] w-full"></div> {/* 상단 헤더 만큼 아래로 */}
        <div className="w-full ">
        <div className="flex justify-center ">
          <div className="flex flex-col max-w-[700px] w-[95%] justify-center items-center ">
            {/* Deatail */}
            <div className="mt-5 text-start w-full ">
              {/* {(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[0]:""}  */}
              {/* 상단 - 개인 프로필 이미지, 닉네임, 게시물 등록 시간 */} 
              <div className="flex justify-between items-center h-[30px]   " >
                <div className="flex text-xs text-[#4A6D88]">
                  <div className="">
                    <div className="relative left-0 h-[25px] w-[25px]  ">
                      <div className='absolute h-[25px] w-[25px] rounded-sm border -z-0 '>

                        {
                          (community?.userinfo.userthumbImg)?
                          <Image
                          src={
                            community?.userinfo.userthumbImg
                          }
                          alt=""
                          layout="fill" 
                          style={{  borderRadius:"10px",}}
                          priority
                          />
                          :
                          <div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                        }

                        
                      </div>
                    </div>
                  </div>
                  <div className="ps-[10px] flex items-center">
                    {/* {community?.userinfo.username} */}
                    {
                      (community?.userinfo.username)?community?.userinfo.username:(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[8]:""
                    }
                  </div>
                  <div className="ps-[10px] flex items-center">{getChangedMongoDBTimestpamp(community?.regdate?community.regdate:"")}</div> 
                </div>
                <div></div>
              </div>
              
              {/* 계시글 타이틀 */}
              <div className="w-full font-bold text-2xl">
                {community?.title}
              </div>
              <div className="w-full mt-5 ">
                {
                  (community?.contents)?
                  <QuillEditorScreen bgColor={"#ffffff"} 
                  content={community?.contents} 
                  readOnly={true} styleType="style3"  />
                  :""
                }
                
              </div>
              <div className=" max-h-[90px]  py-1  overflow-y-auto
                " >
                  {
                    community?.hashtags.map((elem, index)=>{
                      return (
                        <div key={index + "hashTag"} className=" inline-block pt-[2px] items-center  bg-white text-[#4A6D88]
                          border-[#4A6D88] font-bold
                          rounded-[8px] border text-[10px] px-3
                          me-1">
                          {elem}
                        </div>
                      )
                    })
                  }
                </div>
              <div className="flex  justify-between  mt-3 ">
                <div className="flex  text-sm justify-start items-center  ">
                  {
                    (community)?
                      (userStateSet.id)?
                      <div className="flex justify-center items-center cursor-pointer"
                      onClick={()=>likeClickHandler()}
                      >
                        {
                          (communityLike?.likeyn)?<div className=" text-red-500 "><IoMdHeart/></div>
                          :<div className=" "><IoIosHeartEmpty/></div>
                        }
                        
                        <div className="ps-2  min-w-[25px] max-w-[50px]">{community?.likecnt}</div>
                      </div>:
                      <div className="flex justify-center items-center ">
                        <div className=" "><IoIosHeartEmpty/></div>
                        <div className="ps-2  min-w-[25px] max-w-[50px]">{community?.likecnt}</div>
                      </div>
                    :<></>
                  }


                    {/* {
                      (userStateSet.id)?
                      <div className="flex justify-center items-center cursor-pointer"
                      onClick={()=>likeClickHandler()}
                      >
                        {
                          (communityLike?.likeyn)?<div className=" text-red-500 "><IoMdHeart/></div>
                          :<div className=" "><IoIosHeartEmpty/></div>
                        }
                        
                        <div className="ps-2  min-w-[25px] max-w-[50px]">{community?.likecnt}</div>
                      </div>:
                      <div className="flex justify-center items-center ">
                        <div className=" "><IoIosHeartEmpty/></div>
                        <div className="ps-2  min-w-[25px] max-w-[50px]">{community?.likecnt}</div>
                      </div>
                    } */}
                  {
                    (community)?
                    <>
                      <div className="ps-4"><FaRegCommentDots /></div>
                      <div className="ps-2  min-w-[25px] max-w-[50px]">{community?.commentcnt}</div>
                    </>
                    :<></>
                  }
                  
                </div>
                {
                  (community)?
                  <div className="flex justify-center items-center">
                    <ButtonBaseAddTags text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[0]:""}
                    onClick={()=>commentYn()}
                    />
                  </div>:<></>
                }
                
              </div>
              {/* 댓글입력 로그인이 필요 함 */} 
              <div className={commentTextAreaStyle + " flex flex-col overflow-hidden  mt-3 transition-all ease-in-out duration-400    "}>
                <div className="w-full ">
                  <textarea className={ ` mt-1 text-xs w-full rounded-sm border resize-none p-3 overflow-y-auto outline-0 h-[75px]
                border-gray-400 font-normal `}
                  value={commentContent}
                  onChange={(e)=>commentOnChangeHandler(e)}
                  ref={focusComment}
                  />
                </div>
                <div className="w-full flex justify-end items-start ">
                  {
                    (userStateSet.id)?
                    <div>
                      <ButtonCommentSave text={"저장"}
                      onClick={()=>commentSave()}
                      />
                    </div>
                    :""
                  }
                  
                  
                </div>
              </div>
              {/* 댓글리스트 */}
              <div className="mt-3 flex flex-col ">
                {
                  commentList.map((elem, index)=>{
                    return(
                      <div key={index+"comment"}
                      className="flex flex-col  "
                      >
                        {
                          (elem.subcommentyn)?
                          <></>
                          :<div className="flex justify-between items-center h-[30px]   " >
                            <div className="flex text-xs text-[#4A6D88]">
                              <div className="">
                                <div className="relative left-0 h-[25px] w-[25px]  ">
                                  <div className='absolute h-[25px] w-[25px] rounded-sm border -z-0 '>

                                    {
                                      (elem.userinfo?.userthumbImg)?
                                      <Image
                                      src={
                                        elem.userinfo.userthumbImg
                                      }
                                      alt=""
                                      layout="fill" 
                                      style={{  borderRadius:"10px",}}
                                      priority
                                      />
                                      :
                                      <div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                                    }

                                    
                                  </div>
                                </div>
                              </div>
                              <div className="ps-[10px] flex items-center">
                                {/* {elem.userinfo?.username} */}
                                {
                                  (elem.userinfo.username)?elem.userinfo.username:(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[8]:""
                                }
                              </div>
                              <div className="ps-[10px] flex items-center">{getChangedMongoDBTimestpamp(elem.regdate?elem.regdate:"")}</div> 
                            </div>
                            <div></div>
                          </div>
                        }
                        


                        

                        {
                          (elem.subcommentyn)?
                          <div>
                            <div className="w-full flex justify-end items-start">
                              <div className="w-[4%] h-[75px] flex flex-col">
                                <div className="h-[100%] border-l border-b border-gray-400" ></div>
                              </div>
                              <div className="flex flex-col w-[95%]">
                                <div className="">
                                  <div className="flex justify-between items-center h-[30px]   " >
                                    <div className="flex text-xs text-[#4A6D88]">
                                      <div className="">
                                        <div className="relative left-0 h-[25px] w-[25px]  ">
                                          <div className='absolute h-[25px] w-[25px] rounded-sm border -z-0 '>

                                            {
                                              (elem.userinfo?.userthumbImg)?
                                              <Image
                                              src={
                                                elem.userinfo.userthumbImg
                                              }
                                              alt=""
                                              layout="fill" 
                                              style={{  borderRadius:"10px",}}
                                              priority
                                              />
                                              :
                                              <div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                                            }

                                            
                                          </div>
                                        </div>
                                      </div>
                                      <div className="ps-[10px] flex items-center">
                                        {/* {elem.userinfo?.username} */}
                                        {
                                          (elem.userinfo.username)?elem.userinfo.username:(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[8]:""
                                        }
                                      </div>
                                      <div className="ps-[10px] flex items-center">{getChangedMongoDBTimestpamp(elem.regdate?elem.regdate:"")}</div> 
                                    </div>
                                    <div></div>
                                  </div>
                                </div>
                                <div className="w-full my-1 min-h-[75px] max-h-[90px] p-3 text-xs overflow-y-auto rounded-lg bg-[#f1f1f1]">{elem.comment}</div>
                              </div>
                            </div>
                          </div>
                          
                          
                          :<div className="my-1 min-h-[75px] max-h-[90px] p-3 text-xs overflow-y-auto rounded-lg bg-[#dbe9f1]">{elem.comment}</div>
                        }

                        <div className="flex justify-between">
                          <div className="flex  text-sm justify-start items-center  ">
                            <div className="ps-1"><FaRegCommentDots /></div>
                            <div className="ps-2  min-w-[25px] max-w-[50px]">{elem.subcommentcnt}</div>
                          </div>
                          <div className="mt-1 flex justify-center items-start ">
                            <div className="flex justify-center items-center pe-2">
                              <ButtonSubComment text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[2]:""}
                              onClick={()=>subCommentListSee(index)}
                              />
                            </div>
                            <div className="flex justify-center items-center">
                              <ButtonSubComment text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[1]:""}
                              onClick={()=>subCommentYn(index)}
                              />
                            </div>
                            
                          </div>
                        </div>
                        <div className={elem.subcommentStyle + " flex flex-col overflow-hidden  mt-2 transition-all ease-in-out duration-400  "}>
                          <div className="w-full flex justify-end items-start">
                            <div className="w-[4%] h-[75px] flex flex-col">
                              <div className="h-[50%] border-l border-b border-gray-400" ></div>
                            </div>
                            <textarea className={ ` text-xs w-[95%] rounded-lg border resize-none p-3 overflow-y-auto outline-0 h-[75px]
                          border-gray-400 font-normal `}
                            value={elem.subcomment}
                            ref={(element) => {focusCommentList.current[index] = element;}}
                            onChange={(e)=>subCommentOnChangeHandler(e, index)}
                            />
                          </div>
                          <div className="w-full flex justify-end items-start mt-1  ">

                            {
                              (userStateSet.id)?
                              <div>
                                <ButtonCommentSave text={"저장"}
                                onClick={()=>subCommentSave(index)}
                                />
                              </div>
                              :""
                            }


                            
                            
                          </div>
                        </div>
                      
                        <div className={elem.subCommentListSeeStyle + ` flex flex-col overflow-hidden  mt-2 transition-all ease-in-out duration-400`}>

                          <div className="flex flex-col mt-1 rounded-lg py-3 ps-5 pe-3 items-end bg-[#f1f1f1] ">
                          {
                            elem.subcommentList?.map((elemSub, index)=>{
                              return(
                                <div key={index+"subcommentList"} className="flex flex-col w-full ">
                                  <div className="flex justify-between items-center h-[30px]   " >
                                    <div className="flex text-xs text-[#4A6D88]">
                                      <div className="">
                                        <div className="relative left-0 h-[25px] w-[25px]  ">
                                          <div className='absolute h-[25px] w-[25px] rounded-sm border -z-0 '>

                                            {
                                              (elemSub.userinfo?.userthumbImg)?
                                              <Image
                                              src={
                                                elemSub.userinfo.userthumbImg
                                              }
                                              alt=""
                                              layout="fill" 
                                              style={{  borderRadius:"10px",}}
                                              priority
                                              />
                                              :
                                              <div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                                            }

                                            
                                          </div>
                                        </div>
                                      </div>
                                      <div className="ps-[10px] flex items-center">
                                        {/* {elemSub.userinfo?.username} */}
                                        {
                                          (elemSub.userinfo.username)?elemSub.userinfo.username:(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[8]:""
                                        }
                                      </div>
                                      <div className="ps-[10px] flex items-center">{getChangedMongoDBTimestpamp(elemSub.regdate?elemSub.regdate:"")}</div> 
                                    </div>
                                    <div></div>
                                  </div>
                                  <div  className="max-h-[90px] p-3 text-xs overflow-y-auto bg-[#d8d8d8]
                                  w-full min-h-[75px] mb-3 mt-1 rounded-lg ">
                                    {elemSub.comment}
                                  </div>
                                </div>
                              )
                            })
                          }
                          </div>
                          <div className="w-full flex justify-end pt-2">
                            <ButtonSubComment text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[3]:""}
                              onClick={()=>subCommentListSearchNext(index)}
                              />
                          </div>
                        </div>

                      </div>
                    )
                  })
                }
              </div>
              {/* 댓글더보기 조회 */}
              {
                (community)?
                <div className="my-5 flex justify-start items-center"
                >
                  <ButtonCommentNext text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[4]:""}
                  onClick={()=>commentNextSearch()}
                  />
                </div>:<></>
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