'use client';
import { ButtonHomeTranslator, ButtonSubComment } from "@/app/compontents/design/buttons/Buttons";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transaction } from "@/app/utils/axios";
import { getChangedMongoDBTimestpamp } from "@/app/utils/common";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosRadioButtonOn, IoMdRadioButtonOff } from "react-icons/io";

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

interface bookListItf extends Array<bookItf>{}

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

interface communityListItf extends Array<communityItf>{}

interface wordinfoItf {
  meaningKR:string
  reworkmeaningKR:string
  reworkynKR:boolean
  meaningES:string
  reworkmeaningES:string 
  reworkynES:string
}

//hotword
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

interface hotwordListItf extends Array<hotWordItf>{}

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

interface hotSentenceListItf extends Array<hotSentenceItf>{}

const Main = (props:any) => {

  const router = useRouter();
  const languageStateSet = languageState();
  
  
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  const [newBookList, setNewBookList] = useState<bookListItf>([]);
  
  //최신커뮤니티조회
  const [communityList, setCommunityList] = useState<communityListItf>([]);

  //hotword 리스트
  const [hotWordList, setHotWordList] = useState<hotwordListItf>([]);

  //hotsentence 리스트
  const [hotSentenceList, setHotSentenceList] = useState<hotSentenceListItf>([]);
  
  
  useEffect(()=>{
    firstReadingsTotalSearch();
  },[]);

  

  //최초조회
  async function firstReadingsTotalSearch(){

    

    const obj = {
      currentPage:1,
    }

    
    // 10개까지 보여줌
    const retObj = await transaction("get", "book/homebooksearch", obj, "", false, true, screenShow, errorShow);
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){
      console.log(retObj.sendObj.resObj);
      setNewBookList(retObj.sendObj.resObj.books);
      setCommunityList(retObj.sendObj.resObj.communities);
      setHotWordList(retObj.sendObj.resObj.hotwords);
      setHotSentenceList(retObj.sendObj.resObj.hotsentences);
       
      
    }   
  }

  //읽을거리 페이지 이동
  function bookReadingPage(){
    router.push('/readings/');
  }

  //읽을거리 페이지 상세 이동
  function bookDetailPage(seq:number){
    router.push('/readings/' + seq);
  }

  //커뮤니티 페이지 이동
  function communityPage(){
    router.push('/community/');
  }

  //커뮤니티 페이지 상세 이동
  function communityDetailPage(seq:number){
    router.push('/community/' + seq);
  }

  const [flipped, setFlipped] = useState(false);

  function clickWordCard(index:number){
    
    

    if(hotWordList[index].showYn){
      hotWordList[index].showYn = false;
    }else{
      hotWordList[index].showYn = true;
    }

    setHotWordList([...hotWordList]);

  }
  
  function translator(index:number){
    if(hotSentenceList[index].translatorYn){
      hotSentenceList[index].translatorYn = false;
    }else{
      hotSentenceList[index].translatorYn = true;
    }

    setHotSentenceList([...hotSentenceList]);
  }

  function changeTranslatorLang(index:number, lang:string){
    hotSentenceList[index].currentLang = lang;
    setHotSentenceList([...hotSentenceList]);

  }

  return(
    <>
      <div className="h-[55px] w-full"> {/* 상단 헤더 만큼 아래로 */}</div>
      <div className="flex flex-col items-center  w-full py-10  ">
        <div className="flex flex-col w-[300px]   mb-5  2xl:w-[1160px]  xl:w-[1160px]  lg:w-[1010px]  md:w-[730px]  sm:w-[580px]  ">
          <div className="mb-[7px]  flex justify-between items-center w-full ">
            <div className="text-2xl font-bold text-[#4A6D88]">
              <button className="">최신 업데이트 작품</button>
            </div>
            <div className="flex text-lg font-bold text-[#4A6D88] pe-1 ">
              <button className="items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>bookReadingPage()}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="border-b border-[#acb1b6]"></div>
        </div>
        {/* 최신 업데이트 작품 */}
        <div className="w-[300px] flex flex-wrap justify-start   2xl:w-[1160px]  xl:w-[1160px]  lg:w-[1010px]  md:w-[730px]  sm:w-[580px]  ">
          {
            newBookList.map((elem, index)=>{
              return(
                <div key={index + elem._id} className=" w-[120px] h-[210px] shadow-md shadow-[#4A6D88] rounded-b-md cursor-pointer m-3
                transition-transform duration-300 ease-in-out
                hover:scale-105 transform
                "
                onClick={()=>bookDetailPage(elem.book_seq)}
                >
                  <div className="">
                    <div className="relative left-0 -z-20 w-[100%] ">
                      <div className='absolute w-full h-[160px]  '>  
                        <Image
                          src={
                            (elem.images[0].cover)?elem.images[0].cover:elem.images[0].medium_cover
                          }
                          alt=""
                          quality={50} 
                          layout="fill" 
                          sizes="100vw"
                          priority
                          />
                      </div>
                    </div>
                  </div>
                  <div className="mt-[160px] p-1 h-[50px] flex justify-center items-center
                  ">
                    <p className=" line-clamp-2 text-center font-bold text-[10px]">
                      {elem.book_title}
                    </p>
                  </div> 
                  <div className="h-[30px] flex justify-end items-center pe-2 text-xs ">
                    {
                      (elem.readYn === "I")?
                      <p className="border rounded-lg px-1 py-0.5 
                      text-white
                      bg-[#3f9c90]
                      ">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[1]:""}</p>
                      :(elem.readYn === "F")?
                      <p className="border rounded-lg px-1 py-0.5 
                      text-white
                      bg-[#4A6D88]
                      ">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[2]:""}</p> 
                      :""
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        {/* 좋아요 많은 순서 */}
        
        {/* 최신 커뮤니트 글 예정 */}
        <div className="mt-10 flex flex-col w-[300px]   mb-5  2xl:w-[1160px]  xl:w-[1160px]  lg:w-[1010px]  md:w-[730px]  sm:w-[580px]  ">
          <div className="mb-[7px]  flex justify-between items-center w-full ">
            <div className="text-2xl font-bold text-[#4A6D88]">
              <button className="">최신 커뮤니티 글</button>
            </div>
            <div className="flex text-lg font-bold text-[#4A6D88] pe-1 ">
              <button className="items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>communityPage()}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="border-b border-[#acb1b6]"></div>
        </div>
        <div className="w-[300px] flex flex-wrap justify-start   2xl:w-[1160px]  xl:w-[1160px]  lg:w-[1010px]  md:w-[730px]  sm:w-[580px]   ">

          {
            communityList.map((elem, index)=>{
              return (
                <div key={index+"community"} className="w-[100%]  p-2
                2xl:w-1/3  xl:w-1/3  lg:w-1/3  md:w-1/2  sm:w-[580px] cursor-pointer ">
                  <div className="h-[200px] bg-gray-100 rounded-lg flex flex-col p-3 justify-start
                  transition-transform duration-300 ease-in-out
                  hover:scale-105 transform
                  ">
                    <div className="w-full text-[15px] font-bold  h-[32px] truncate ">{elem.title}</div>
                    <div className=" h-[130px]  line-clamp-9 text-[13px] break-words cursor-pointer  "
                    onClick={()=>communityDetailPage(elem.community_seq)}
                    >
                      {elem.contents.replace(/<[^>]*>?/gm, '')}
                    </div>
                    <div className=" pt-1 flex justify-start ">
                      <div className="ps-1 text-[10px] font-bold">
                        {
                          (elem.userinfo.username)?elem.userinfo.username:(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[8]:""
                          // elem.userinfo.username
                         }
                      </div>
                      <div className="ps-[10px] flex items-center text-[10px] ">{getChangedMongoDBTimestpamp(elem.regdate)}</div> 
                    </div>
                  </div>
                </div>
              )
            })
          }


        </div>
        
        {/* 좋아요 많이 받은 커뮤니트 글 */}
        <div className="mt-10 flex flex-col w-[300px]   mb-5  2xl:w-[1160px]  xl:w-[1160px]  lg:w-[1010px]  md:w-[730px]  sm:w-[580px]  ">
          <div className="mb-[7px]  flex justify-between items-center w-full ">
            <div className="text-2xl font-bold text-[#4A6D88]">
              <button className="">많이 찾은 단어</button>
            </div>
            <div className="flex text-lg font-bold text-[#4A6D88] pe-1 ">
              <button className="items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              // onClick={()=>communityPage()}
              >
                {/* <FaPlus /> */}
              </button>
            </div>
          </div>
          <div className="border-b border-[#acb1b6]"></div>
        </div>
        <div className="w-[300px] flex flex-wrap justify-start   2xl:w-[1160px]  xl:w-[1160px]  lg:w-[1010px]  md:w-[730px]  sm:w-[580px]  ">
          {
            hotWordList.map((elem, index)=>{
              return(
              <div key={index+"hotword"} className="w-[100%]  p-2  2xl:w-1/6  xl:w-1/6  lg:w-1/6  md:w-1/3  sm:w-1/2  ">
                {/* <div className="border text-[14pxs] font-bold w-full h-[120px] flex justify-center items-center rounded-lg">
                  {elem.word}
                </div> */}
                <div className=" text-[14px] font-bold w-full h-[120px] flex justify-center items-center rounded-lg cursor-pointer
                  transition-transform duration-300 ease-in-out hover:scale-105 transform
                ">
                   <div
                    // onClick={() => setFlipped(!flipped)}
                    onClick={() => clickWordCard(index)}
                    
                    style={{
                      width: "100%",
                      height: "120px",
                      perspective: "1000px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        textAlign: "center",
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        transform: elem.showYn ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      {/* 앞면 */}
                      <div className="break-all

                      "
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#7A99A8", // 차분한 연회색
                          color: "white",           // 사이트 메인 컬러 활용
                          borderRadius: "10px",
                        }}
                      >
                        {elem.word}
                      </div>
                      {/* 뒷면 */}
                      <div className=""
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          backgroundColor: "#f5f7fa", // 톤 다운된 짙은 청색
                          color: "#4A6D88",
                          borderRadius: "10px",
                          transform: "rotateY(180deg)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                          boxSizing: "border-box",
                        }}
                      >
                        <div className=" w-full h-[120px] flex flex-col justify-start text-[12px] font-normal">
                          <div className="h-1/2  flex justify-center items-center  ">
                            {elem.wordinfo.meaningKR}
                          </div>
                          <div className="border-t mx-1 border-gray-300"></div>
                          <div className="h-1/2  flex justify-center items-center">
                            {elem.wordinfo.meaningES}
                          </div>
                        </div>
                        {/*  */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )
            })
          }
        </div>
        {/* 번역 및 저장을 많이 한 단어 및 문장 */}
        <div className="mt-10 flex flex-col w-[300px]   mb-5  2xl:w-[1160px]  xl:w-[1160px]  lg:w-[1010px]  md:w-[730px]  sm:w-[580px]  ">
          <div className="mb-[7px]  flex justify-between items-center w-full ">
            <div className="text-2xl font-bold text-[#4A6D88]">
              <button className="">많이 찾은 문장</button>

            </div>
            <div className="flex text-lg font-bold text-[#4A6D88] pe-1 ">
              <button className="items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              // onClick={()=>communityPage()}
              >
                {/* <FaPlus /> */}
              </button>
            </div>
          </div>
          <div className="border-b border-[#acb1b6]"></div>
        </div>
        <div className="w-[300px] flex flex-wrap justify-start   2xl:w-[1160px]  xl:w-[1160px]  lg:w-[1010px]  md:w-[730px]  sm:w-[580px]  ">
            {
              hotSentenceList.map((elem, index)=>{
                return(
                <div key={index+"hotsentence"} className="flex flex-col w-[100%] ">
                  <div className=" flex justify-start items-end font-bold ">
                    <div>{elem.book_title}</div>
                    {/* <div className="ms-5">번역보기(kr)</div>
                    <div className="ms-2">번역보기(Es)</div> */}
                    
                  </div>
                  <div className=" rounded-lg py-2 text-sm ">
                    {elem.sentence}
                  </div>

                  <div className="w-full flex justify-center text-xs mt-2 ">
                    {/* <button className="rounded-md bg-[#4A6D88] text-white  font-normal px-2 py-0.5 bg">번역보기</button> */}
                    <ButtonHomeTranslator text={"번역보기"}
                    onClick={()=>translator(index)}
                    />
                  </div>
                  
                  {
                    (elem.translatorYn)?
                    <div className="text-xs mt-3 flex flex-col  ">
                      <div className="flex justify-start mb-2">
                        {
                          (elem.currentLang === "es")?
                            <div className="w-full flex justify-start ">
                              <div className="flex items-center cursor-pointer
                              "
                              onClick={()=>changeTranslatorLang(index, "kr")}
                              ><IoMdRadioButtonOff />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[1]:""}
                              </div>
                              <div className="flex items-center cursor-pointer ms-3
                              "
                              onClick={()=>changeTranslatorLang(index, "es")}
                              ><IoIosRadioButtonOn />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[2]:""}</div> 
                            </div>
                          :(elem.currentLang === "kr")?
                            <div className="w-full flex justify-start ">
                              <div className="flex items-center cursor-pointer
                              
                              "
                              onClick={()=>changeTranslatorLang(index, "kr")}
                              ><IoIosRadioButtonOn />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[1]:""}
                              </div>
                              <div className="flex items-center cursor-pointer ms-3
                              
                              "
                              onClick={()=>changeTranslatorLang(index, "es")}
                              ><IoMdRadioButtonOff />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[2]:""}</div> 
                            </div>
                          :
                            <div className="w-full flex justify-start ">
                              <div className="flex items-center cursor-pointer
                              
                              "
                              onClick={()=>changeTranslatorLang(index, "kr")}
                              ><IoIosRadioButtonOn />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[1]:""}
                              </div>
                              <div className="flex items-center cursor-pointer ms-3
                              
                              "
                              onClick={()=>changeTranslatorLang(index, "es")}
                              ><IoMdRadioButtonOff />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[2]:""}</div> 
                            </div>
                          
                        }   
                      </div>
                      {
                        (elem.currentLang === "es")?
                        <div className="py-2 px-2 bg-gray-200 rounded-lg">
                          {elem.translatedsentenceES}
                        </div>
                        :(elem.currentLang === "kr")?
                        <div className="py-2 px-2 bg-gray-200 rounded-lg">
                          {elem.translatedsentenceKR}
                        </div>
                        :<div className="py-2 px-2 bg-gray-200 rounded-lg">
                          {elem.translatedsentenceKR}
                        </div>
                      }   
                    </div>:
                    <></>    
                  }
                  

                  <div className="w-full border-b border-gray-300 my-5"></div>
                </div>
                )
              })
            }
          
          </div>

        <div className="my-10"></div>
      </div>
    </>
  );
};

export default Main