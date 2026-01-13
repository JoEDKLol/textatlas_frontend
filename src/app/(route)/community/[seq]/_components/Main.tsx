'use client';
import Image from "next/legacy/image";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import errorScreenShow from "@/app/store/errorScreen";
import loadingScreenShow from "@/app/store/loadingScreen";
import languageState from "@/app/store/language";
import { useEffect, useState } from "react";
import { transaction } from "@/app/utils/axios";
import QuillEditorScreen from "@/app/compontents/common/quillEditor/QuillEditorScreen";
import { getChangedMongoDBTimestpamp } from "@/app/utils/common";
import { ButtonBaseAddTags, ButtonCommentSave } from "@/app/compontents/design/buttons/Buttons";
import loadingScreenEmptyShow from "@/app/store/loadingScreen_empty";

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

// interface communityListItf extends Array<communityItf>{}

const Main = (props:any) => {
  
  const router = useRouter();
  const languageStateSet = languageState();  
  const screenShow = loadingScreenShow();
  const screenShowEmpty = loadingScreenEmptyShow(); //중앙에 로딩 없는 창
  const errorShow = errorScreenShow();
  const path = usePathname();
  const userStateSet = props.userStateSet;
  const community_seq = path.split("/")[2];

  //게시물정보 상세
  const [community, setCommunity] = useState<communityItf>();

  //댓글쓰기 창 여부
  const [commentWriteYn, setCommentWriteYn] = useState<boolean>(false);

  //댓글쓰기창 style
  const [commentTextAreaStyle, setCommentTextAreaStyle]  = useState(" h-[0px] ");

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
      console.log(retObj.sendObj);
      // setCommunity(retObj.sendObj.resObj);
      setCommunityLike(retObj.sendObj.resObj);
    }
  }

  function commentYn(){
    
    if(commentWriteYn){
      setCommentTextAreaStyle(" h-[0px] ")
    }else{
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


  
  return(
    <>
    <div className="">
      <div className="h-[55px] w-full"></div> {/* 상단 헤더 만큼 아래로 */}
        <div className="w-full ">
        <div className="flex justify-center ">
          <div className="flex flex-col max-w-[700px] w-[95%] justify-center items-center ">
            {/* Deatail */}
            <div className="mt-5 text-start w-full ">
              {/* {(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[0]:""}  */}
              {/* 상단 - 개인 프로필 이미지, 닉네임, 게시물 등록 시간 */} 
              <div className="flex justify-between items-center h-[30px]  " >
                <div className="flex text-xs text-[#4A6D88]">
                  <div className="">
                    <div className="relative left-0 h-[20px] w-[20px]  ">
                      <div className='absolute h-[20px] w-[20px] rounded-full border -z-0 '>

                        {
                          (community?.userinfo.userthumbImg)?
                          <Image
                          src={
                            community?.userinfo.userthumbImg
                          }
                          alt=""
                          layout="fill" 
                          style={{  borderRadius:"100px",}}
                          priority
                          />
                          :
                          <Image
                          src={
                            "/flags/kr.png"
                          }
                          alt=""
                          layout="fill" 
                          style={{  borderRadius:"100px",}}
                          priority
                          />
                        }

                        
                      </div>
                    </div>
                  </div>
                  <div className="ps-[10px] flex items-center">{community?.userinfo.username}</div>
                  <div className="ps-[10px] flex items-center">{getChangedMongoDBTimestpamp(community?.regdate?community.regdate:"")}</div> 
                </div>
                <div></div>
              </div>
              
              {/* 계시글 타이틀 */}
              <div className="w-full mt-5 font-bold text-2xl">
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
                  }
                  
                  <div className="ps-4"><FaRegCommentDots /></div>
                  <div className="ps-2  min-w-[25px] max-w-[50px]">{community?.commentcnt}</div>
                </div>
                <div className="flex justify-center items-center">
                  <ButtonBaseAddTags text={(languageStateSet.main_language_set[13])?languageStateSet.main_language_set[13].text[0]:""}
                  onClick={()=>commentYn()}
                  />
                </div>
              </div>
              {/* 덧글입력 */}
              <div className={commentTextAreaStyle + " flex flex-col overflow-hidden  mt-3 transition-all ease-in-out duration-400    "}>
                <div className="w-full ">
                  <textarea className={ ` mt-1 text-xs w-full rounded-sm border resize-none p-3 overflow-y-auto outline-0 h-[75px]
                border-gray-400 font-normal `}
                  />
                </div>
                <div className="w-full flex justify-end items-start ">
                  <div>
                    <ButtonCommentSave text={"저장"}/>
                  </div>
                  
                </div>
              </div>
              {/* 댓글리스트 */}
              <div className="mt-5 flex flex-col">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Main