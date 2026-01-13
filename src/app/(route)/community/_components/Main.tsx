import Image from "next/legacy/image";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { transaction } from "@/app/utils/axios";
import loadingScreenShow from "@/app/store/loadingScreen";
import errorScreenShow from "@/app/store/errorScreen";
import { getChangedMongoDBTimestpamp } from "@/app/utils/common";
import communityScrollPositon from "@/app/store/communityScrollPosition";
import { useInView } from 'react-intersection-observer';
import { useRouter } from "next/navigation";
import languageState from "@/app/store/language";
import communityState from "@/app/store/communities";
import { ButtonBaseAddTags } from "@/app/compontents/design/buttons/Buttons";

// interface userInfoItf {
//   userseq:number
//   email:string
//   username:string
//   userimg:string
//   userthumbImg:string
// }

// interface communityItf {
//   _id:string
//   community_seq:number
//   userseq:string
//   title:string
//   contents:string
//   hashtags:[]
//   likecnt:number
//   commentcnt:number
//   userinfo:userInfoItf
//   regdate:string
// }

// interface communityListItf extends Array<communityItf>{}

let searchFrom = false;  

const Main = (props:any) => {
  
  const router = useRouter();
  const languageStateSet = languageState();
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  //커뮤니티글 리스트를 전역에 저장
  const communityStateSet = communityState();
  //스크롤위치를 전역에 저장
  const scrollPositonStateSet = communityScrollPositon();  

  // const [keyword, setKeyword] = useState("");
  // const [lastSeq, setLastSeq] = useState<number>(0);
  // const [communityList, setCommunityList] = useState<communityListItf>([]);

  const [searchAreaClass, setSerchAreaClass] = useState({style:" h-[60px] ", tagYn:false});

  
  const focusTagSearch = useRef<HTMLInputElement>(null);
  
  //화면 실행 여부
  // const [firstSearch, setFirstSearch] = useState<boolean>(false);

  // setWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);

  useEffect(()=>{

    // searchCommunityList();
    if(parseInt(scrollPositonStateSet.scrollY) > 0){
      window.scrollTo(0, parseInt(scrollPositonStateSet.scrollY, 10));
    }
    const handleScroll = () => {
      scrollPositonStateSet.scrollYSet(window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);

    // setFirstSearch(true);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);

    };
  },[])

  //스크롤 하단으로 이동시 조회 처리
  const [ref, inView] = useInView({
    triggerOnce: false, // 한 번만 트리거
  });

  useEffect(() => {
    
    if (inView) {
      if(!searchFrom){
        searchCommunityList();
        searchTagList();
      } 
    }
  }, [inView]);

  
  //게시글 조회
  async function searchCommunityList(){

    const obj = {
      keyword:communityStateSet.text,
      lastSeq:communityStateSet.lastSeq,
      // tagYn:communityStateSet.tagSearchYn.tagYn,
      searchTagList:communityStateSet.searchTagList,
    }

    const retObj = await transaction("post", "community/communitylistsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 

      if(retObj.sendObj.resObj.length > 0){
        // setCommunityList([...communityList,  ...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        communityStateSet.lastSeqSet(retObj.sendObj.resObj[lastArr].community_seq)
        communityStateSet.communityListAdd(retObj.sendObj.resObj);
        
      }
    }
  }

  //검색창에서 조회
  async function searchFormCommunityList(){

    communityStateSet.lastSeqSet(0)
    communityStateSet.communityListSet([]);
    searchFrom = true; //검색창에서 조회

    const obj = {
      keyword:communityStateSet.text,
      lastSeq:0,
      // tagYn:communityStateSet.tagSearchYn.tagYn,
      searchTagList:communityStateSet.searchTagList,
    }

    const retObj = await transaction("post", "community/communitylistsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 

      if(retObj.sendObj.resObj.length > 0){
        // setCommunityList([...communityList,  ...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        communityStateSet.lastSeqSet(retObj.sendObj.resObj[lastArr].community_seq)
        communityStateSet.communityListAdd(retObj.sendObj.resObj);
        
      }

      searchFrom = false;
    }
  }

  //태그 조회 가장 많이 사용된 순
  //화면 시작시 한번 조회
  async function searchTagList(){

    const obj = {
      keyword:communityStateSet.text,
      lastSeq:communityStateSet.lastSeq,
    }

    const retObj = await transaction("get", "community/taglistsearch", obj, "", false, false, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 

      if(retObj.sendObj.resObj.length > 0){
        communityStateSet.tagNameListSet(retObj.sendObj.resObj);
        
      }
    }
  }

  

  function search(){
    // readingsFromSearch();
    searchFormCommunityList()
  }

  function searchTextOnChangeHandler(e:any){
    // setSearchText(e.target.value);
    // setChangedSearchText(true);
    communityStateSet.textSet(e.target.value);
  }

  function searchTextOnKeyDownHandler(e:any){
    if(e.key === 'Enter') {
      // readingsFromSearch();
      searchFormCommunityList();
    }
  }

  function writingPage(){
    router.push('/community/writing');
  }

  function addTagSearch(){
    if(communityStateSet.tagSearchYn.tagYn){
      // setSerchAreaClass({style:" h-[60px] ", tagYn:false});

      communityStateSet.tagSearchYnSet({style:" h-[110px] ", tagYn:false});

    }else{
      // setSerchAreaClass({style:" h-[230px] shadow-md ", tagYn:true});
      communityStateSet.tagSearchYnSet({style:" h-[230px] shadow-md ", tagYn:true});
    }
    
  }
  
  function addTagText(){
    const getHashTagText = communityStateSet.tagText.trim();
    if(!getHashTagText){
      return;
    }

    if(communityStateSet.searchTagList.length > 9){ 
      return;
    }

    //이미 있는 tag 인경우 리턴
    if(communityStateSet.searchTagList.indexOf(getHashTagText) > -1){
      focusTagSearch.current?.focus();
      return;
    }

    communityStateSet.searchTagListAdd(getHashTagText);
    communityStateSet.tagTextSet("");
  }

  function addTag(index:number){

    if(communityStateSet.searchTagList.length > 9){ 
      return;
    }

    const tagName = communityStateSet.tagName[index].tagname;

    //이미 있는 tag 인경우 리턴
    if(communityStateSet.searchTagList.indexOf(tagName) > -1){
      return;
    }
    
    communityStateSet.searchTagListAdd(tagName);
  }

  function deleteTag(index:number){
    communityStateSet.searchTagListDelete(index);
  }

  function searchTagTextOnChangeHandler(e:any){
    // setSearchText(e.target.value);
    // setChangedSearchText(true);
    communityStateSet.tagTextSet(e.target.value);
  }

  function searchTagTextOnKeyDownHandler(e:any){
    if(e.key === 'Enter') {
      addTagText();
    }
  }
  
  function communityDetail(seq:number){
    console.log(seq);
    router.push('/community/' + seq);
  }

  return(
    <>
    <div className="">
      <div className="h-[55px] w-full "></div> {/* 상단 헤더 만큼 아래로 */}
      <div className="w-full  ">
        <div className="flex justify-center ">
          <div className="flex flex-col max-w-[700px] w-[95%] justify-center items-center  ">

            {/* 조회하기 영역 */}
            <div className={communityStateSet.tagSearchYn.style + ` overflow-hidden fixed top-[40px] flex flex-col  justify-start  mt-5  w-full px-10 py-5 bg-white  z-1 transition-all ease-in-out duration-300 `}> 
              <div className="flex justify-center ">
                <div className="flex justify-start items-center h-[30px]   ">
                  <div className="h-full flex justify-center  ">
                    <div className="relative pl-1  text-[#4A6D88] ">
                      <input type="search" name="serch" 
                      // placeholder={(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[0]:""} 
                      className="
                      w-[200px] 2xl:w-[300px] xl:w-[300px] lg:w-[300px] md:w-[300px] sm:w-[300px]
                      border border-[#4A6D88] bg-white h-[30px] px-3 pr-6 rounded text-sm focus:outline-none"
                      onChange={(e)=>searchTextOnChangeHandler(e)}
                      onKeyDown={(e)=>searchTextOnKeyDownHandler(e)}
                      value={communityStateSet.text}
                      />
                      <button className="absolute right-0 top-0 mt-[7px] mr-2 text-[#4A6D88] cursor-pointer
                      transition-transform duration-300 ease-in-out
                      hover:scale-110 transform inline-block
                      "
                      onClick={()=>search()}
                      >
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                        </svg>
                      </button>
                    </div>
                    
                  </div>
                </div>
                <div className="ps-2">
                  <div className=" text-center  flex justify-center ">
                    <button className="border border-[#4A6D88] w-[30px] text-[20px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold  rounded
                    transition-all duration-200 ease-in-out cursor-pointer
                    "
                    onClick={()=>addTagSearch()}
                    >
                      {/* {languageStateSet.main_language_set[1].text[0]} */}
                      {/* {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[6].text[2]:""} */}
                      +
                    </button>
                  </div>
                </div>
                <div className="ps-2"> 
                  {/* 글쓰기 버튼 */}
                  <div className=" text-center  flex justify-center ">
                    <button className="border border-[#4A6D88] w-[80px] text-[14px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold py-1 px-4 rounded
                    transition-all duration-200 ease-in-out cursor-pointer
                    "
                    onClick={()=>writingPage()}
                    >
                      {/* {languageStateSet.main_language_set[1].text[0]} */}
                      {/* {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[6].text[2]:""} */}
                      글쓰기
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center  ">
                <div className=" h-[50px]  mt-2 pb-1 
                  w-[300px] 2xl:w-[650px] xl:w-[650px] lg:w-[650px] md:w-[650px] sm:w-[650px] overflow-y-auto
                  " >

                  {/* {
                    
                  } */}


                  {
                    communityStateSet.searchTagList.map((elem:any, index:number)=>{
                      return(

                       

                        <div key={index + "taglist"} className="inline-block relative h-[20px] bg-[#5f89aa] text-white rounded-[8px] border text-[10px] pt-[2px]  ps-2 pe-5 me-1">
                          {elem}
                          <button className="absolute -top-[1px] right-[6px] font-bold text-[12px] cursor-pointer ms-3 
                          transition-transform duration-300 ease-in-out hover:scale-120 transform "
                          onClick={()=>deleteTag(index)}
                          >x</button>
                        </div>
                        
                      )
                    })
                  }
                </div>
              </div>
              
              {/* add tag 조회 조건 */}
              <div className="flex flex-col items-center mt-3 ">
                <div className=" flex justify-between  
                w-[300px] 2xl:w-[450px] xl:w-[450px] lg:w-[450px] md:w-[450px] sm:w-[450px]
                ">
                  <div className="w-full ">
                    
                    {/* asdf asdf sad sadf sadf sadfsa asdf sadf asdf sd */}
                    {/* <span className="inline-block">abasdfasdfsadf</span> */}
                    <input className="h-full px-2 font-bold w-full   bg-gray-100 text-xs rounded-[10px] placeholder:font-light "
                    // placeholder={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[1]:""} 
                    ref={focusTagSearch}
                    value={communityStateSet.tagText}
                    onChange={(e)=>searchTagTextOnChangeHandler(e)}
                    onKeyDown={(e)=>searchTagTextOnKeyDownHandler(e)}
                    />
                    {/* <span className="absolute right-3 top-[6px] text-xs text-red-500">{`${hashTagsArr.length} / 10`}</span> */}

                  </div>
                  {/* 태그 추가 */}
                  <div className=" ms-2  "> 
                    <ButtonBaseAddTags text={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[3]:""}
                    onClick={()=>addTagText()}
                    />
                  </div>
                </div>

                <div className=" h-[90px]  py-1 
                w-[300px] 2xl:w-[650px] xl:w-[650px] lg:w-[650px] md:w-[650px] sm:w-[650px] overflow-y-auto
                " >
                  {
                    communityStateSet.tagName.map((elem, index)=>{
                      return (
                        <button key={index + "span"} className="inline-block relative h-[20px] bg-[#5f89aa] text-white rounded-[8px] border text-[10px] px-2 pt-[2px] me-1
                        hover:bg-white hover:border hover:border-[#5f89aa] hover:text-[#5f89aa]
                        transition-all duration-200 ease-in-out cursor-pointer
                        "
                        onClick={()=>addTag(index)}
                        >
                        {elem.tagname}
                      </button>
                      )
                    })
                  }
                </div>
                                
              </div>
            </div>
            <div className="mt-30"></div>
            {
              communityStateSet.communityList?.map((elem, index)=>{
                return(
                <div key={index} className="w-full flex flex-col items-center ">
                  <div  className="flex justify-center w-[95%] my-3 max-h-[350px]  ">
                    <div className="flex flex-col w-full h-full rounded-2xl  px-4 py-2 hover:bg-gray-100 cursor-pointer  "
                    onClick={()=>communityDetail(elem.community_seq)}
                    >
                      {/* 상단 - 개인 프로필 이미지, 닉네임, 게시물 등록 시간 */} 
                      <div className="flex justify-between items-center h-[30px]  " >
                        <div className="flex text-xs text-[#4A6D88]">
                          <div className="">
                            <div className="relative left-0 h-[20px] w-[20px]  ">
                              <div className='absolute h-[20px] w-[20px] rounded-full border -z-0 '>

                                {
                                  (elem.userinfo.userthumbImg)?
                                  <Image
                                  src={
                                    elem.userinfo.userthumbImg
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
                          <div className="ps-[10px] flex items-center">{elem.userinfo.username}</div>
                          <div className="ps-[10px] flex items-center">{getChangedMongoDBTimestpamp(elem.regdate)}</div> 
                        </div>
                        <div></div>
                      </div>

                      {/* 제목 */}
                      <div className=" max-h-[120px] line-clamp-2 text-base font-bold break-all mt-2 ">
                        {elem.title}
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: elem.contents }} className=" max-h-[180px] line-clamp-9 text-sm  mt-3 break-words ">
                      </div>
                      {/* 하단 좋아요 */}
                      <div className="flex  text-sm justify-start items-center mt-3 ">
                        <div><IoIosHeartEmpty/></div>
                        <div className="ps-2">{elem.likecnt}</div>
                        <div className="ps-4">
                          <FaRegCommentDots />
                        </div>
                        <div className="ps-2">{elem.commentcnt}</div>
                      </div>
                    </div>
                    
                  </div>
                  <div className="flex justify-start w-full px-7 pb-2">
                    <div>
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
                  {/* 밑줄 */}
                  <div className="my-1 w-full border border-gray-200"></div>
                
                </div>
                )
              })
            }

            {/* 게시물 리스트 */}
            
          </div>
        </div>
      </div>
    </div>
    <div ref={ref}></div>
    </>
  );
};

export default Main