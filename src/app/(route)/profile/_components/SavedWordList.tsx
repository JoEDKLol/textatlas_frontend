'use client';

import languageState from "@/app/store/language";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import errorScreenShow from "@/app/store/errorScreen";
import loadingScreenShow from "@/app/store/loadingScreen";
import { IoIosRadioButtonOn, IoMdRadioButtonOff } from "react-icons/io";
import { ButtonHisBookListNext, ButtonTranslator } from "@/app/compontents/design/buttons/Buttons";
import { FaRegStar, FaStar } from "react-icons/fa";

import { getDateContraction2 } from "@/app/utils/common";
import BookInfo from "@/app/compontents/modals/BookInfo";
import { BiSolidUpArrow } from "react-icons/bi";


interface imagesItf {
  medium_cover:string
  cover:string
}

interface wordinfoItf {
  meaningKR:string
  reworkmeaningKR:string
  reworkynKR:boolean
  meaningES:string
  reworkmeaningES:string 
  reworkynES:string
}

interface wordItf {
  _id:string
  book_seq:number
  book_title:string
  images:[imagesItf]
  importance:number
  learningdt:string
  page:number
  sentence:string
  sentenceindex:number
  word:string
  wordinfo:wordinfoItf
  translatedsentenceES:string
  translatedsentenceKR:string
  translatorSee:boolean
}

interface wordListItf extends Array<wordItf>{}

const SavedWordList = (props:any) => {
  const router = useRouter();
  const userStateSet = props.userStateSet;
  const currentTab = props.currentTab;

  const languageStateSet = languageState();  

  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  //검색text
  const [searchText, setSearchText] = useState<string>("");

  //조회된 단어 배열
  const [wordList, setWordList] = useState<wordListItf>([]);

  //저장된 단어 리스트 페이지
  const [selectedBookWordPage, setSelectedBookWordPage] = useState<number>(0);

  //order type , 1~5 까지의 점수(별) order 순서 0:적용안함, 1:내림차순 2:오름차순
  const [orderType, setOrderType] = useState<number>(0); 

  //다음 조회 버튼 활성화 정렬순서 변경되면 다음조회 버튼 비활성화 처리한다.
  //DB조회시 정렬이 순서 변경되면 결과값이 변경되기 때문.
  const [nextButtonYn, setNextButtonYn] = useState<boolean>(false); 

  //조회된 결과 order type
  const [resultOrderType, setResultOrderType] = useState<number>(0);
  
  function searchTextOnChangeHandler(e:any){
    setSearchText(e.target.value);
  }

  //책정보 팝업
  const [showBookInfoPortal, setShowBookInfoPortal] = useState(false);

  //책정보
  const [bookInfoInPortal, setBookInfoInPortal] = useState<wordItf>();

  //검색창
  function searchTextOnKeyDownHandler(e:any){
    if(e.key === 'Enter') {
      // readingsFromSearch();
      searchForm();
    }
  }

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < searchText.length; i++) {
      const currentByte = searchText.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 40){
        setSearchText(searchText.substring(0, i));
        break;
      }
    }
  },[searchText]);

  useEffect(()=>{

    if(currentTab === 2){
      searchWord();
    }
    

  },[currentTab]);


  //검색창 조회 저장한 단어 조회
  async function searchForm(){ 
    // console.log(userStateSet);
    setSelectedBookWordPage(0);
    setWordList([]);
    setNextButtonYn(false);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1,
      keyword:searchText,
      orderType:orderType,
    }

    const retObj = await transactionAuth("get", "history/savedwordsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setResultOrderType(orderType);
      setWordList(retObj.sendObj.resObj);
      setSelectedBookWordPage(1);
    }
  }

  //최초조회
  async function searchWord(){ 
    // console.log(userStateSet);
    setSelectedBookWordPage(0);
    setWordList([]);
    setNextButtonYn(false);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1, 
      orderType:orderType,
    }

    const retObj = await transactionAuth("get", "history/savedwordsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setResultOrderType(orderType);
      setWordList(retObj.sendObj.resObj);
      setSelectedBookWordPage(1);
    }
  }

  //저장한 단어 리스트 다음 조회
  async function nextSelectedBookWord() {

    const obj = {
      userseq:userStateSet.userseq,
      currentPage:selectedBookWordPage+1,
      keyword:searchText,
      orderType:orderType,
    }

    const retObj = await transactionAuth("get", "history/savedwordsearch", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        setResultOrderType(orderType);
        setWordList([...wordList ,...retObj.sendObj.resObj]);
        setSelectedBookWordPage(selectedBookWordPage+1);
      }
      
      
    }   
    
  }

  async function changeTranslatorLang(lang:string){

    const obj = {
      userseq:userStateSet.userseq,
      email:userStateSet.email,
      preferred_trans_lang:lang

    }
    const retObj = await transactionAuth("post", "user/usertranslatorupdate", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      userStateSet.preferredTransLangSet(lang);
    }
  }

  async function seeTranslatorSentenceInWord(id:string){

    const wordIndex = wordList.findIndex((elem) => elem._id === id);
    
    
    
    if(wordIndex > -1){

      const obj = {
        book_seq:wordList[wordIndex].book_seq,
        userseq:userStateSet.userseq,
        page:wordList[wordIndex].page,
        sentenceindex:wordList[wordIndex].sentenceindex
      }


      const retObj = await transactionAuth("get", "history/translatesentenceword", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        // console.log(retObj);

        wordList[wordIndex].translatedsentenceKR = retObj.sendObj.resObj.translatedsentenceKR;
        wordList[wordIndex].translatedsentenceES = retObj.sendObj.resObj.translatedsentenceES;
        wordList[wordIndex].translatorSee = true;
        setWordList([...wordList]);

        

      }
    }
  }

  //별표시 클릭
  const [idleYn, setIdleYn] = useState<boolean>(false);

  async function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //단어
  async function clickStar(id:string, importance:number){
    if(idleYn){
      return;
    }

    const wordIndex = wordList.findIndex((elem) => elem._id === id);

    // console.log(wordList[wordIndex]);

    if(importance === 1 && wordList[wordIndex].importance === 1){
      importance = 0;
    }else{
      if(wordList[wordIndex].importance === importance){
        return;
      }
    }


    setIdleYn(true);
    await sleep(300);


    const obj = {
      _id:id,
      importance:importance,
      email : userStateSet.email,
    }

    const retObj = await transactionAuth("post", "history/wordimportance", obj, "", false, false, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(importance);
      wordList[wordIndex].importance = importance;
      

      
      setWordList([...wordList]);

      setIdleYn(false);
    }
  }

  function bookInfo(id:string){
    
    const wordIndex = wordList.findIndex((elem) => elem._id === id);
    
    if(wordIndex > -1){
      // setBookInfoInPortal();
      // console.log(wordList[wordIndex]);
      setBookInfoInPortal(wordList[wordIndex]);
      setShowBookInfoPortal(!showBookInfoPortal);
    }
    

  }

  function setShowBookInfo(yn:boolean){
    setShowBookInfoPortal(yn);
  }

  function orderClick(){

    // let copyWordList = [...wordList];
    let changeOrderType;
    if(orderType === 0){
      wordList.sort((a, b) => b.importance - a.importance);
      setOrderType(1);
      changeOrderType=1;
    }else if(orderType === 1){
      wordList.sort((a, b) => a.importance - b.importance);
      setOrderType(2);
      changeOrderType=2;
    }else{
      setOrderType(0);
      wordList.sort((a, b) => parseInt(b.learningdt) - parseInt(a.learningdt));
      changeOrderType=0;
    }

    if(resultOrderType === changeOrderType){
      setNextButtonYn(false);
    }else{
      setNextButtonYn(true);
    }

    
    
    
  }

  

  return(
    <div className="w-full">
      <div className="flex flex-col w-full items-center ">
        {/* 조회하기 영역 */}
        <div className="flex  justify-center items-center mt-5 w-full  px-5  flex-col   "> 
          <div className="flex flex-1 justify-start items-center h-[30px] mt-3 ">
            <div className="h-full flex justify-center  ">
              <div className="relative pl-1  text-[#4A6D88] ">
                <input type="search" name="serch" placeholder={(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[0]:""} className="
                w-[250px] 2xl:w-[300px] xl:w-[300px] lg:w-[300px] md:w-[300px] sm:w-[250px]
                border border-[#4A6D88] bg-white h-[30px] px-3 pr-6 rounded text-sm focus:outline-none"
                onChange={(e)=>searchTextOnChangeHandler(e)}
                onKeyDown={(e)=>searchTextOnKeyDownHandler(e)}
                value={searchText}
                />
                <button className="absolute right-0 top-0 mt-[7px] mr-2 text-[#4A6D88] cursor-pointer
                transition-transform duration-300 ease-in-out
                hover:scale-110 transform inline-block
                "
                onClick={(e)=>searchForm()}
                >
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                  </svg>
                </button>
              </div>
              <div className=" justify-center items-center ms-2  ">
                <p className="border mt-[2px] p-1 rounded cursor-pointer"
                onClick={()=>orderClick()}
                >
                  {
                    (orderType === 0)?<FaRegStar style={{color:"gray"}}/>
                    :(orderType === 1)?<FaStar style={{color:"#F6AA46"}}/>
                    :(orderType === 2)?<FaRegStar style={{color:"#F6AA46"}}/>:""

                  }
                  
                  
                </p>
              </div>
              
              <></>
            </div>
          </div>
        </div>
      </div>

        
      <div className="w-full flex justify-center">
        <div className="w-full 2xl:w-[800px]  xl:w-[800px]  lg:w-[800px]  md:w-[600px]  sm:w-full px-1 mt-8 ">
          <div className="flex flex-row text-xs ">
          {
            (userStateSet.preferred_trans_lang === "kr")?
            <>
              <p className="flex flex-row items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>changeTranslatorLang("kr")}
              ><IoIosRadioButtonOn />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[1]:""}</p>
              <p className="flex flex-row items-center cursor-pointer ms-3
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>changeTranslatorLang("es")}
              ><IoMdRadioButtonOff />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[2]:""}</p>
            </>
            :<>
              <p className="flex flex-row items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>changeTranslatorLang("kr")}
              ><IoMdRadioButtonOff />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[1]:""}</p>
              <p className="flex flex-row items-center cursor-pointer ms-3
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>changeTranslatorLang("es")}
              ><IoIosRadioButtonOn />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[2]:""}</p> 
            </>
          }
          </div>

          <div className=" pt-8  "> {/* 저장한 단어 리스트 */}
            {
            wordList.map((elem, index)=>{
              return(
                <div key={index} className=" w-full text-xs ">
                  <div className="flex justify-start items-center">
                    <div className="font-bold">{elem.word}</div>
                    <div className="ps-3">
                    {
                      (elem.importance === 1)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 2)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 3)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 4)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 5)}><FaRegStar/></span>
                      </p>
                      :
                      (elem.importance === 2)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 2)}><FaStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 3)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 4)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 5)}><FaRegStar/></span>
                      </p>
                      :
                      (elem.importance === 3)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 2)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 3)}><FaStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 4)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 5)}><FaRegStar/></span>
                      </p>:
                      (elem.importance === 4)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 2)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 3)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 4)}><FaStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 5)}><FaRegStar/></span>
                      </p>:
                      (elem.importance === 5)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 2)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 3)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 4)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 5)}><FaStar/></span>
                      </p>:
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 1)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 2)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 3)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 4)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStar(elem._id, 5)}><FaRegStar/></span>
                      </p>
                    }
                    </div>
                    <div className="flex justify-center items-center px-2 pt-[2px]">

                      <ButtonTranslator /* 책정보 */
                      text={ 
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[15]:""
                      }
                      onClick={()=>bookInfo(elem._id)}
                      />

                    </div>
                    <div className="flex justify-end items-center flex-1  w-full font-light ">{getDateContraction2(elem.learningdt)}
                      &nbsp;
                      {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[12]:""} {/* 저장 */}
                    </div>
                  </div>
                  <div className="mt-2 max-h-[100px] overflow-y-auto">
                  {
                    (userStateSet.preferred_trans_lang === "kr")?
                    <>
                      {
                        (elem.wordinfo.reworkynKR)?
                        <div dangerouslySetInnerHTML={{ __html: elem.wordinfo.reworkmeaningKR }}></div>
                        :elem.wordinfo.meaningKR
                      }
                    </>
                    :
                    <>
                      {
                        (elem.wordinfo.reworkynES)?
                        <div dangerouslySetInnerHTML={{ __html: elem.wordinfo.reworkmeaningES }}></div>
                        :elem.wordinfo.meaningES
                      }
                    </>
                  }
                  </div>
                  <div className="mt-8 flex justify-start ">
                    <div className="font-bold ">
                      {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[13]:""} {/* 저장된 단어가 포함된 문장 */}
                    </div>
                    <div className="ms-3"
                    
                    >
                    {
                      (elem.translatorSee)?
                      <ButtonTranslator /* 번역보기 */
                      disabledText={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[14]:""
                      }
                      disabled={true}
                      
                      />
                      :

                      <ButtonTranslator /* 번역보기 */
                      text={ 
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[14]:""
                      }
                      onClick={()=>seeTranslatorSentenceInWord(elem._id)}
                      />
                    }
                      

                    </div>
                  </div>
                  
                  <div className=" mt-2 max-h-[100px] overflow-y-auto p-1  ">
                    {elem.sentence}
                  </div>
                  {
                    (elem.translatorSee)?
                    <div className=" mt-2 max-h-[100px] overflow-y-auto bg-gray-200 rounded-md p-1 ">
                      {
                        (userStateSet.preferred_trans_lang === "kr")?
                        elem.translatedsentenceKR:elem.translatedsentenceES
                      }

                    </div>:""
                  }
                  
                  <hr className="my-4"></hr>
                </div>
              )
            })
          }
        </div>
        {
          (wordList.length > 0)?
          <div className="flex justify-end text-xs mt-5">
            <p>
              <ButtonHisBookListNext /* 다음 정렬이 바뀌는 경우 조회가 안되도록 처리 해야 한다. */
                text={
                (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                }
                disabled={nextButtonYn}
                disabledText={
                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                }
              onClick={()=>nextSelectedBookWord()}  
              />
            </p>
          </div>
          :""
        }
        

        </div>
      </div>
      

    <BookInfo show={showBookInfoPortal} setShowBookInfo={setShowBookInfo} bookInfoInPortal={bookInfoInPortal} />
    </div>
  );
};

export default SavedWordList