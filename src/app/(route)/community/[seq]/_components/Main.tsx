'use client';
import Image from "next/legacy/image";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { FaRegCommentDots, FaRegSave } from "react-icons/fa";
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
import { LuSquarePen } from "react-icons/lu";
import { transactionAuth } from "@/app/utils/axiosAuth";
import communityState from "@/app/store/communities";
import Message from "@/app/compontents/modals/Message";

interface userInfoItf {
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
  commentupdateYn:boolean
  commentStyle:string
  userInfoSeeYn:boolean
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
  subcommentupdateYn:boolean
  subcommentUpdateStyle:string
  userInfoSeeYn:boolean
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
  const communityStateSet = communityState();

  const focusComment = useRef<HTMLTextAreaElement>(null);
  const focusCommentList = useRef<null[] | HTMLTextAreaElement[]>([]);
  const focusCommentUpdate = useRef<null[] | HTMLTextAreaElement[]>([]);
  const focusSubCommentUpdate = useRef<null[] | HTMLTextAreaElement[]>([]);

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

  //메시지보내기창
  const [showMessagePortal, setShowMessagePortal] = useState(false);
  const [messageUserInfo, setMessageUserInfo] = useState<userInfoItf>();

  function setShowMessage(yn:boolean){
    setShowMessagePortal(yn);
  }

  function openMessagePopup( yn:boolean){

    if(!userStateSet.id){
      alertPopup.screenShowTrue();
      alertPopup.messageSet("로그인!", "로그인이 필요 합니다.");
      return;
    }

    setShowMessagePortal(yn);
    setMessageUserInfo(community?.userinfo);
  }

  function setUserInfoSeeYn(yn:boolean){
    if(community){
      setCommunity({...community,userInfoSeeYn:yn });
    }
  }

  

  //댓글 사용자 클릭시

  function commentOpenMessagePopup(index:number, yn:boolean){

    if(!userStateSet.id){
      alertPopup.screenShowTrue();
      alertPopup.messageSet("로그인!", "로그인이 필요 합니다.");
      return;
    }

    

    setShowMessagePortal(yn);
    setMessageUserInfo(commentList[index]?.userinfo);
  }

  function setCommentUserInfoSeeYn(index:number, yn:boolean){
    
    commentList[index].userInfoSeeYn = yn;
    setCommentList([...commentList]);
  }

  //대댓글 사용자 클릭시
  function subCommentOpenMessagePopup(commentIndex:number, subCommentIndex:number, yn:boolean){

    if(!userStateSet.id){
      alertPopup.screenShowTrue();
      alertPopup.messageSet("로그인!", "로그인이 필요 합니다.");
      return;
    }

    

    setShowMessagePortal(yn);
    setMessageUserInfo(commentList[commentIndex].subcommentList[subCommentIndex].userinfo);
  }

  function setSubCommentUserInfoSeeYn(commentIndex:number, subCommentIndex:number, yn:boolean){
    // commentList[index].subcommentList
    commentList[commentIndex].subcommentList[subCommentIndex].userInfoSeeYn = yn;
    setCommentList([...commentList]);
  }

  
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
      setCommentTextAreaStyle(" h-[130px] ");
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

    const retObj = await transactionAuth("post", "community/communitylikeupdate", obj, "", false, true, screenShowEmpty, errorShow);
    if(retObj.sendObj.success === "y"){ 
      setCommunityLike({...communityLike, likeyn:retObj.sendObj.resObj.likeyn});
      setCommunity({...community as any,likecnt:retObj.sendObj.resObj.likecnt});
      const communityIndex = communityStateSet.communityList.findIndex((elem) => elem.community_seq === parseInt(community_seq));
      communityStateSet.communityLikeCntChange(communityIndex, retObj.sendObj.resObj);
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
    
    const retObj = await transactionAuth("post", "community/commentsave", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){

      const obj = retObj.sendObj.resObj.newCommentObj;

      obj.subcommentStyle = " h-[0px] "
      obj.subCommentListSeeStyle = " h-[0px] ";
      obj.commentStyle = " bg-[#dbe9f1] ";
      obj.subcommentList = [];
      obj.userinfo = {};
      obj.userinfo.userseq = userStateSet.userseq;
      obj.userinfo.email = userStateSet.email;
      obj.userinfo.username = userStateSet.username;
      obj.userinfo.userimg = userStateSet.userimg;
      obj.userinfo.userthumbImg = userStateSet.userthumbImg;

      if(commentList.length === 0){ //최초 등록시 리스트가 0인경우 마지막 seq 를 세팅해준다. 세팅을 안하면 조회가 없는 경우에는 댓글더보기 조회시 조회가 됨.
        // console.log("여기 아님???" + obj.comment_seq);
        setLastCommentSeq(obj.comment_seq);
      }


      commentList.unshift(obj);
      setCommunity({...community as any,commentcnt:retObj.sendObj.resObj.commentcnt});
      setCommentTextAreaStyle(" h-[0px] ");
      setCommentWriteYn(false);
      setCommentContent("");
      setCommentList([...commentList]);

      

      const communityIndex = communityStateSet.communityList.findIndex((elem) => elem.community_seq === parseInt(community_seq));
      communityStateSet.communityCommentCntChange(communityIndex, retObj.sendObj.resObj);
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
          retObj.sendObj.resObj[i].commentStyle = " bg-[#dbe9f1] ";
          
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
          retObj.sendObj.resObj[i].subcommentList = [];
          retObj.sendObj.resObj[i].commentStyle = " bg-[#dbe9f1] ";
          
        }

        setCommentList([...commentList, ...retObj.sendObj.resObj]);
        setLastCommentSeq(retObj.sendObj.resObj[lastArr].comment_seq);
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

    
    
    const retObj = await transactionAuth("post", "community/subcommentsave", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      // setCommentList({...community as any,commentcnt:retObj.sendObj.resObj.commentcnt});
      const obj = retObj.sendObj.resObj.newCommentObj;
      obj.subcommentwriteyn = false;
      obj.subcommentStyle = " h-[0px] ";
      obj.userinfo = {};
      obj.userinfo.userseq = userStateSet.userseq;
      obj.userinfo.email = userStateSet.email;
      obj.userinfo.username = userStateSet.username;
      obj.userinfo.userimg = userStateSet.userimg;
      obj.userinfo.userthumbImg = userStateSet.userthumbImg;
      obj.subcommentupdateYn = false;
      obj.subcommentUpdateStyle = " bg-[#dddddd] ";

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

      // commentList[index].subcommentList[0].subcommentupdateYn = false;
      // commentList[index].subcommentList[0].subcommentUpdateStyle = " bg-[#dddddd] ";
      
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
    let totalByte = 0;
    for(let i =0; i < commentList[index].subcomment.length; i++) {
      const currentByte = commentList[index].subcomment.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 400){
        console.log("400");
        commentList[index].subcomment = commentList[index].subcomment.substring(0, i);
        // setCommentContent(commentContent.substring(0, i));
        setCommentList([...commentList]);
        break;
      }
    }
    // commentList[index].subcomment = e.target.value;
    // setCommentList([...commentList]);
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

            for(let i=0; i<retObj.sendObj.resObj.length; i++){
              retObj.sendObj.resObj[i].subcommentupdateYn = false;
              retObj.sendObj.resObj[i].subcommentUpdateStyle = " bg-[#dddddd] ";
            }

            commentList[index].subCommentLastSeq = retObj.sendObj.resObj[lastArr].subcomment_seq
            commentList[index].subcommentList = [...commentList[index].subcommentList as any, ...retObj.sendObj.resObj] as any;
            commentList[index].subCommentListFirstSearchYn = true;
            setCommentList([...commentList, ...retObj.sendObj.resObj]);   
            commentList[index].subCommentListSeeStyle = " ";
            // subcommentupdateYn = false;
            // commentList[index].subcommentList[index2].subcommentUpdateStyle = " bg-[#dddddd] ";

                 
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

        for(let i=0; i<retObj.sendObj.resObj.length; i++){
          retObj.sendObj.resObj[i].subcommentupdateYn = false;
          retObj.sendObj.resObj[i].subcommentUpdateStyle = " bg-[#dddddd] ";
        }
        
        const lastArr = retObj.sendObj.resObj.length-1;
        commentList[index].subCommentLastSeq = retObj.sendObj.resObj[lastArr].subcomment_seq
        commentList[index].subcommentList = [...commentList[index].subcommentList as any, ...retObj.sendObj.resObj] as any;
        commentList[index].subCommentListFirstSearchYn = true;
        setCommentList([...commentList]);        
      }
    }
  }

  function communityUpdatePage(){
    router.push('/community/' + community_seq + '/update');
  }

  function commentUpdateOnChangeHandler(e:any, index:any){
    commentList[index].comment = e.target.value;
    setCommentList([...commentList]);
  }

  const [commentUpdateIndex, setCommentUpdateIndex] = useState<number>(-1);

  useEffect(()=>{
    if(commentUpdateIndex > -1){
      focusCommentUpdate.current[commentUpdateIndex+10000]?.focus();
      commentList[commentUpdateIndex].comment.length
      setTimeout(() => {
        const len = focusCommentUpdate.current[commentUpdateIndex+10000]?.value.length;
        focusCommentUpdate.current[commentUpdateIndex+10000]?.setSelectionRange(len?len:0, len?len:0);
      }, 0); // 0ms 타이머는 다음 이벤트 루프에서 실행되도록 합니다
    }
    
    
  },[commentUpdateIndex])

  function fn_commentUpdateYn(index:any){


    if(commentList[index].commentupdateYn){
      commentList[index].commentupdateYn = false;
      commentList[index].commentStyle = " bg-[#dbe9f1] ";
      setCommentUpdateIndex(-1);
    }else{
      commentList[index].commentupdateYn = true;
      commentList[index].commentStyle = " border border-gray-200 ";
      setCommentUpdateIndex(index);
    }

    setCommentList([...commentList]);
    
  }

  async function fn_commentUpdate(index:number){
    
    const obj = {
      community_seq:community_seq,
      comment_seq:commentList[index].comment_seq,
      email:userStateSet.email,
      comment:commentList[index].comment,
    }

    const retObj = await transactionAuth("post", "community/commentupdate", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      
      commentList[index].commentupdateYn = false;
      commentList[index].commentStyle = " bg-[#dbe9f1] ";
      setCommentUpdateIndex(-1);
      setCommentList([...commentList]);
    }
  }

  const [subCommentUpdateIndex, setSubCommentUpdateIndex] = useState<number>(-1);

  useEffect(()=>{
    if(subCommentUpdateIndex > -1){
      focusSubCommentUpdate.current[subCommentUpdateIndex+20000]?.focus();
      setTimeout(() => {
        const len = focusSubCommentUpdate.current[subCommentUpdateIndex+20000]?.value.length;
        focusSubCommentUpdate.current[subCommentUpdateIndex+20000]?.setSelectionRange(len?len:0, len?len:0);
      }, 0); // 0ms 타이머는 다음 이벤트 루프에서 실행되도록 합니다
    }
    
    
  },[subCommentUpdateIndex])

  function fn_subCommentUpdateYn(index:number, index2:number){
    // commentList[index].subcommentList[index].subcommentupdateYn
    const subcommentupdateYn = commentList[index].subcommentList[index2].subcommentupdateYn;
    if(subcommentupdateYn){
      commentList[index].subcommentList[index2].subcommentupdateYn = false;
      commentList[index].subcommentList[index2].subcommentUpdateStyle = " bg-[#dddddd] ";
      setSubCommentUpdateIndex(-1);
    }else{
      commentList[index].subcommentList[index2].subcommentupdateYn = true;
      commentList[index].subcommentList[index2].subcommentUpdateStyle = " bg-white border border-gray-200 ";
      setSubCommentUpdateIndex(index2);
    }

     setCommentList([...commentList]);
  }

  function subcommentUpdateOnChangeHandler(e:any, index:number, index2:number){
    commentList[index].subcommentList[index2].comment = e.target.value;
    setCommentList([...commentList]);
  }

  async function fn_subcommentUpdate(index:number, index2:number){
    
    const obj = {
      subcomment_seq:commentList[index].subcommentList[index2].subcomment_seq,
      comment_seq:commentList[index].subcommentList[index2].comment_seq,
      community_seq:commentList[index].subcommentList[index2].community_seq,
      email:userStateSet.email,
      comment:commentList[index].subcommentList[index2].comment,
    }

    // console.log(obj);

    const retObj = await transactionAuth("post", "community/subcommentupdate", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      
      commentList[index].subcommentList[index2].subcommentupdateYn = false;
      commentList[index].subcommentList[index2].subcommentUpdateStyle = " bg-[#dddddd] ";
      setSubCommentUpdateIndex(-1);
      setCommentList([...commentList]);
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
                <div className="flex text-xs text-[#4A6D88] cursor-pointer"
                onMouseEnter={() => setUserInfoSeeYn(true)}
                onMouseLeave={() => setUserInfoSeeYn(false)}>
                  <div className="">
                    <div className="relative left-0 h-[25px] w-[25px] z-1 ">

                      {/* 개인 프로필 */}
                      {
                        (community?.userInfoSeeYn)?
                        <div>
                          <div className=" absolute top-[20px] z-0 pt-2 ">
                            <div className="w-[300px] max-h-[200px] bg-white rounded-lg shadow-sm flex flex-col p-3 border border-[#CFD8DC]">
                              <div className="flex justify-between h-[70px] items-start ">

                                <div className=" absolute h-[60px] w-[60px] rounded-sm  -z-0 border ">
                                {
                                  (community?.userinfo.userthumbImg)?
                                  <Image
                                  src={
                                    community?.userinfo.userthumbImg
                                  }
                                  alt=""
                                  layout="fill" 
                                  style={{  borderRadius:"5px",}}
                                  priority
                                  />
                                  :<div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                                }
                                </div>
                                <div className=" ps-16 flex flex-1 ">
                                  <div className="h-[60px] flex items-center text-md text-[#5f89aa] font-bold ps-1">
                                    {
                                      (community?.userinfo.username)?community?.userinfo.username:"미지정"
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="flex pt-1 text-xs  max-h-[70px] text-[#5f89aa] overflow-y-auto ">
                                {community?.userinfo.introduction}
                              </div>
                              {/* <div>레벨</div> */}
                              {/* <div>친구추가</div> */}
                              {
                                (community?.userinfo.userseq !== userStateSet.userseq)?
                                <div className="flex justify-end  w-full pt-2">
                                  <div className="w-[100px]"
                                  onClick={()=>openMessagePopup(true)}
                                  ><ButtonCommentSave text={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[9]:""}/></div>
                                </div>:""
                              }
                              
                            </div>
                          </div>
                        </div>
                        
                        :<></>
                      }

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
              
              {/* 게시글 타이틀 */}
              <div className=" max-h-[120px] line-clamp-5 text-2xl font-bold break-all mt-2 cursor-pointer ">
                {community?.title}
              </div>
              <div className="w-full mt-2 ">
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
                  <div className="flex justify-center items-center ">
                    <div> 
                      <ButtonBaseAddTags text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[0]:""}
                      onClick={()=>commentYn()}
                      />
                    </div>
                    {/* 커뮤니티글 수정 */}
                    {
                      (userStateSet.userseq === community.userinfo.userseq)?
                      <div className="ms-1"> 
                        <ButtonBaseAddTags text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[5]:""}
                        onClick={()=>communityUpdatePage()}
                        />
                      </div>
                      :""
                    }
                    
                  </div>
                  :<></>
                }
                
              </div>
              {/* 댓글입력 로그인이 필요 함 */} 
              <div className={commentTextAreaStyle + " flex flex-col overflow-hidden  mt-3 transition-all ease-in-out duration-400    "}>
                <div className="w-full ">
                  <textarea className={ ` mt-1 text-xs w-full rounded-sm border resize-none p-3 overflow-y-auto outline-0 h-[90px] max-h-[120px]
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
                      <ButtonCommentSave text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[8]:""}
                      onClick={()=>commentSave()}
                      />
                    </div>
                    :""
                  }
                </div>
              </div>
              
              <div className="border border-b my-3 border-gray-200"></div>

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
                            <div className="flex text-xs text-[#4A6D88]"
                            onMouseEnter={() => setCommentUserInfoSeeYn(index, true)}
                            onMouseLeave={() => setCommentUserInfoSeeYn(index, false)}>
                              
                              <div className="">
                                <div className="relative left-0 h-[25px] w-[25px] z-1 "
                                >
                                  {/* 개인 프로필 */}
                                  {
                                    (elem.userInfoSeeYn)?
                                    <div>
                                      <div className=" absolute top-[20px] z-0 pt-2 ">
                                        <div className="w-[300px] max-h-[200px] bg-white rounded-lg shadow-sm flex flex-col p-3 border border-[#CFD8DC]">
                                          <div className="flex justify-between h-[40px] items-start  ">

                                            <div className=" absolute h-[40px] w-[40px] rounded-sm  -z-0 border ">
                                            {
                                              (elem.userinfo.userthumbImg)?
                                              <Image
                                              src={
                                                elem.userinfo.userthumbImg
                                              }
                                              alt=""
                                              layout="fill" 
                                              style={{  borderRadius:"5px",}}
                                              priority
                                              />
                                              :<div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                                            }
                                            </div>
                                            <div className=" ps-16 flex flex-1 ">
                                              <div className="h-[40px] flex items-center text-md text-[#5f89aa] font-bold ps-1">
                                                {
                                                  (elem.userinfo.username)?elem.userinfo.username:"미지정"
                                                }
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex pt-1 text-xs  max-h-[50px] text-[#5f89aa] overflow-y-auto ">
                                            {elem.userinfo.introduction}
                                          </div>
                                          {/* <div>레벨</div> */}
                                          {/* <div>친구추가</div> */}
                                          {
                                            (elem.userinfo.userseq !== userStateSet.userseq)?
                                            <div className="flex justify-end  w-full pt-2">
                                              <div className="w-[100px]"
                                              onClick={()=>commentOpenMessagePopup(index, true)}
                                              ><ButtonCommentSave text={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[9]:""}/></div>
                                            </div>:""
                                          }
                                          
                                        </div>
                                      </div>
                                    </div>
                                    
                                    :<></>
                                  }


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
                                {
                                  (elem.userinfo.username)?elem.userinfo.username:(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[8]:""
                                }
                              </div>
                              <div className="ps-[10px] flex items-center">{getChangedMongoDBTimestpamp(elem.regdate?elem.regdate:"")}</div> 
                            </div>
                            <div className="w-full flex flex-1 justify-end">
                              <div >
                              {/* 댓글수정 */}
                              {
                                (userStateSet.userseq === elem.userinfo.userseq)?
                                <div className="flex justify-center pt-3 pe-1   " 
                                >
                                  {
                                    (elem.commentupdateYn)?
                                    <div className="text-[20px] cursor-pointer text-[#4A6D88]  me-1
                                    transition-transform duration-300 ease-in-out hover:scale-110
                                    "
                                    onClick={()=>fn_commentUpdate(index)}
                                    >
                                      <FaRegSave />
                                    </div>
                                    :""
                                  }
                                  <div className="text-[20px] cursor-pointer text-[#4A6D88] 
                                  transition-transform duration-300 ease-in-out hover:scale-110
                                  "
                                  onClick={()=>fn_commentUpdateYn(index)}
                                  ><LuSquarePen /></div>
                                  
                                  
                                </div>:""
                              }
                              </div>
                            </div>
                          </div>
                        }
                        


                        

                        {
                          (elem.subcommentyn)?
                          <div>
                            
                          </div>
                          
                          
                          :
                          <div className="">
                            {/* {elem.comment} */}
                            <textarea className={elem.commentStyle + ` my-1 h-[90px] max-h-[120px] p-3 text-xs overflow-y-auto rounded-lg  w-full
                            focus:outline-none resize-none ` 
                            }
                            value={elem.comment}
                            disabled={!elem.commentupdateYn}
                            onChange={(e)=>commentUpdateOnChangeHandler(e, index)}
                            ref={(element) => {focusCommentUpdate.current[index+10000] = element;}}
                            // onFocus={this.value = value}
                            />
                          </div>
                        }

                        <div className="flex justify-between">
                          <div className="flex  text-sm justify-start items-center  ">
                            <div className="ps-1"><FaRegCommentDots /></div>
                            <div className="ps-2  min-w-[25px] max-w-[50px]">{elem.subcommentcnt}</div>
                          </div>
                          <div className="mt-1 flex justify-center items-start ">
                            <div className="flex justify-center items-center pe-1">
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
                        <div className={elem.subcommentStyle + " flex flex-col overflow-hidden  mt-3 transition-all ease-in-out duration-400  "}>
                          <div className="w-full flex justify-end items-start">
                            <div className="w-[4%] h-[75px] flex flex-col">
                              <div className="h-[50%] border-l border-b border-gray-400" ></div>
                            </div>
                            <textarea className={ ` text-xs w-[95%] rounded-lg border resize-none p-3 overflow-y-auto outline-0 h-[90px] max-h-[120px]
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
                                <ButtonCommentSave text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[8]:""}
                                onClick={()=>subCommentSave(index)}
                                />
                              </div>
                              :""
                            }


                            
                            
                          </div>
                        </div>
                      
                        <div className={elem.subCommentListSeeStyle + ` flex flex-col overflow-hidden  mt-2 transition-all ease-in-out duration-400  `}>

                          <div className="flex flex-col mt-1 items-end  ">
                            
                          {
                            elem.subcommentList?.map((elemSub, index2)=>{
                              return(
                                <div key={index2+"subcommentList"} className="flex justify-between w-full  ">
                                  <div className="w-[30px] h-[80px] flex justify-center items-center border-l border-b border-[#4A6D88]"></div>
                                  <div className="flex flex-col w-full ">
                                    <div className="flex justify-between items-center h-[30px]   " >
                                      <div className="flex text-xs text-[#4A6D88]"
                                      onMouseEnter={() => setSubCommentUserInfoSeeYn(index, index2, true)}
                                      onMouseLeave={() => setSubCommentUserInfoSeeYn(index, index2, false)}
                                      >
                                      
                                        <div className="">
                                          <div className="relative left-0 h-[25px] w-[25px]  ">

                                            {/* 개인 프로필 */}
                                            {
                                              (elemSub.userInfoSeeYn)?
                                              <div>
                                                <div className=" absolute top-[20px] z-0 pt-2 ">
                                                  <div className="w-[300px] max-h-[200px] bg-white rounded-lg shadow-sm flex flex-col p-3 border border-[#CFD8DC]">
                                                    <div className="flex justify-between h-[40px] items-start  ">

                                                      <div className=" absolute h-[40px] w-[40px] rounded-sm  -z-0 border ">
                                                      {
                                                        (elemSub.userinfo.userthumbImg)?
                                                        <Image
                                                        src={
                                                          elemSub.userinfo.userthumbImg
                                                        }
                                                        alt=""
                                                        layout="fill" 
                                                        style={{  borderRadius:"5px",}}
                                                        priority
                                                        />
                                                        :<div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                                                      }
                                                      </div>
                                                      <div className=" ps-16 flex flex-1 ">
                                                        <div className="h-[40px] flex items-center text-md text-[#5f89aa] font-bold ps-1">
                                                          {
                                                            (elemSub.userinfo.username)?elemSub.userinfo.username:"미지정"
                                                          }
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="flex pt-1 text-xs  max-h-[40px] text-[#5f89aa] overflow-y-auto ">
                                                      {elemSub.userinfo.introduction}
                                                    </div>
                                                    {/* <div>레벨</div> */}
                                                    {/* <div>친구추가</div> */}
                                                    {
                                                      (elemSub.userinfo.userseq !== userStateSet.userseq)?
                                                      <div className="flex justify-end  w-full pt-2">
                                                        <div className="w-[100px]"
                                                        onClick={()=>subCommentOpenMessagePopup(index, index2, true)}
                                                        ><ButtonCommentSave text={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[9]:""}/></div>
                                                      </div>:""
                                                    }
                                                    
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              :<></>
                                            }

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
                                      <div className="w-full flex flex-1 justify-end ">
                                      <div >
                                      {/* 대댓글수정 */}
                                      {
                                        (userStateSet.userseq === elemSub.userinfo.userseq)?
                                        <div className="flex justify-center pt-3 pe-1   " 
                                        >
                                          {
                                            (elemSub.subcommentupdateYn)?
                                            <div className="text-[20px] cursor-pointer text-[#4A6D88]  me-1
                                            transition-transform duration-300 ease-in-out hover:scale-110
                                            "
                                            onClick={()=>fn_subcommentUpdate(index, index2)}
                                            >
                                              <FaRegSave />
                                            </div>
                                            :""
                                          }

                                          {/* <ButtonSubComment text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[6]:""}
                                          onClick={()=>fn_commentUpdateYn(index)}
                                          /> */}
                                          <div className="text-[20px] cursor-pointer text-[#4A6D88] 
                                          transition-transform duration-300 ease-in-out hover:scale-110
                                          "
                                          onClick={()=>fn_subCommentUpdateYn(index, index2)}
                                          ><LuSquarePen /></div>
                                          
                                          
                                        </div>:""
                                      }
                                      </div>
                                    </div>
                                    </div>
                                    <div  className="w-full mb-1 mt-1 ">
                                      {/* {elemSub.comment} */}
                                      <textarea className={elemSub.subcommentUpdateStyle + ` my-1 h-[90px] max-h-[120px] p-3 text-xs overflow-y-auto rounded-lg  w-full
                                      focus:outline-none resize-none  ` 
                                      }
                                      value={elemSub.comment}
                                      disabled={!elemSub.subcommentupdateYn}
                                      onChange={(e)=>subcommentUpdateOnChangeHandler(e, index, index2)}
                                      ref={(element) => {focusSubCommentUpdate.current[index2+20000] = element;}}
                                      // onFocus={this.value = value}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          }
                          </div>
                          <div className="w-full flex justify-end mb-2">
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
              {/* <div className="border border-b my-1 border-gray-200"></div> */}
              {/* 댓글더보기 조회 */}
              {
                (community)?
                <div className="my-10 flex justify-start items-center"
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
    <Message show={showMessagePortal} setShowMessage={setShowMessage} messageUserInfo={messageUserInfo} userStateSet={userStateSet} />
    </>
  );
};

export default Main