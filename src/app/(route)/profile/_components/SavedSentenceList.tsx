import { ButtonHisBookListNext, ButtonTranslator } from "@/app/compontents/design/buttons/Buttons";
import BookInfo from "@/app/compontents/modals/BookInfo";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { getDateContraction2 } from "@/app/utils/common";
import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoIosRadioButtonOn, IoMdRadioButtonOff } from "react-icons/io";

interface imagesItf {
  medium_cover:string
  cover:string
}

interface sentenceItf {
  _id:string
  book_seq:number
  book_title:string
  images:[imagesItf]
  importance:number
  learningdt:string
  page:number
  sentence:string
  sentenceindex:number
  translatedsentenceES:string
  translatedsentenceKR:string
  translatorSee:boolean
}

interface sentenceListItf extends Array<sentenceItf>{}


const SavedSentenceList = (props:any) => {

  const userStateSet = props.userStateSet;
  const currentTab = props.currentTab;

  const languageStateSet = languageState();  

  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  //검색text
  const [searchText, setSearchText] = useState<string>("");

  //다음 조회 버튼 활성화 정렬순서 변경되면 다음조회 버튼 비활성화 처리한다.
  //DB조회시 정렬이 순서 변경되면 결과값이 변경되기 때문.
  const [nextButtonYn, setNextButtonYn] = useState<boolean>(false); 

  //order type , 1~5 까지의 점수(별) order 순서 0:적용안함, 1:내림차순 2:오름차순
  const [orderType, setOrderType] = useState<number>(0); 

  //조회된 결과 order type
  const [resultOrderType, setResultOrderType] = useState<number>(0);

  //문장
  const [sentenceList, setSentenceList] = useState<sentenceListItf>([]);

  //저장된 문장 리스트 페이지
  const [selectedBookSentencePage, setSelectedBookSentencePage] = useState<number>(0);

  //책정보 팝업
  const [showBookInfoPortal, setShowBookInfoPortal] = useState(false);

  //책정보
  const [bookInfoInPortal, setBookInfoInPortal] = useState<sentenceItf>();


  function searchTextOnChangeHandler(e:any){
    setSearchText(e.target.value);
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
    
    if(currentTab === 3){
      searchWord();
    }
    

  },[currentTab]);

  //최초조회 저장한 문장 리스트
  async function searchWord(){ 
    // console.log(userStateSet);
    setSelectedBookSentencePage(0);
    setSentenceList([]);
    setNextButtonYn(false);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1, 
      orderType:orderType,
    }

    const retObj = await transactionAuth("get", "history/savedsentencesearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      setResultOrderType(orderType);
      setSentenceList(retObj.sendObj.resObj);
      setSelectedBookSentencePage(1);
    }
  }

  //저장한 문장 리스트 다음 조회
  async function nextSelectedBookWord() {

    const obj = {
      userseq:userStateSet.userseq,
      currentPage:selectedBookSentencePage+1,
      keyword:searchText,
      orderType:orderType,
    }

    const retObj = await transactionAuth("get", "history/savedsentencesearch", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        setResultOrderType(orderType);
        setSentenceList([...sentenceList ,...retObj.sendObj.resObj]);
        setSelectedBookSentencePage(selectedBookSentencePage+1);
      }
      
      
    }   
    
  }


  //검색창
  function searchTextOnKeyDownHandler(e:any){
    if(e.key === 'Enter') {
      searchForm();
    }
  }

  //검색창 조회 저장한 단어 조회
  async function searchForm(){ 
    // console.log(userStateSet);
    setSelectedBookSentencePage(0);
    setSentenceList([]);
    setNextButtonYn(false);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1,
      keyword:searchText,
      orderType:orderType,
    }
    const retObj = await transactionAuth("get", "history/savedsentencesearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      setResultOrderType(orderType);
      setSentenceList(retObj.sendObj.resObj);
      setSelectedBookSentencePage(1);
    }
  }

  function orderClick(){

    // let copyWordList = [...sentenceList];
    let changeOrderType;
    if(orderType === 0){
      sentenceList.sort((a, b) => b.importance - a.importance);
      setOrderType(1);
      changeOrderType=1;
    }else if(orderType === 1){
      sentenceList.sort((a, b) => a.importance - b.importance);
      setOrderType(2);
      changeOrderType=2;
    }else{
      setOrderType(0);
      sentenceList.sort((a, b) => parseInt(b.learningdt) - parseInt(a.learningdt));
      changeOrderType=0;
    }

    if(resultOrderType === changeOrderType){
      setNextButtonYn(false);
    }else{
      setNextButtonYn(true);
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

  //별표시 클릭시 딜레이 시간 줌
  async function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [idleYnS, setIdleYnS] = useState<boolean>(false);

  async function clickStarSentence(id:string, importance:number){
    if(idleYnS){
      return;
    }

    const sentenceIndex = sentenceList.findIndex((elem) => elem._id === id);

    if(importance === 1 && sentenceList[sentenceIndex].importance === 1){
      importance = 0;
    }else{
      if(sentenceList[sentenceIndex].importance === importance){
        return;
      }
    }


    setIdleYnS(true);
    await sleep(300);


    const obj = {
      _id:id,
      importance:importance,
      email : userStateSet.email,
    }

    // console.log(obj);

    const retObj = await transactionAuth("post", "history/sentenceimportance", obj, "", false, false, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      console.log(retObj.sendObj);
      sentenceList[sentenceIndex].importance = importance;
      setSentenceList([...sentenceList]);

      setIdleYnS(false);
    }
  }

  async function seeTranslatorSentenceInSentence(id:string){

    const sentenceIndex = sentenceList.findIndex((elem) => elem._id === id);

    if(sentenceIndex > -1){

      sentenceList[sentenceIndex].translatorSee = true;
      setSentenceList([...sentenceList])
    }
  }

  function bookInfo(id:string){
    
    const wordIndex = sentenceList.findIndex((elem) => elem._id === id);
    
    if(wordIndex > -1){
      // setBookInfoInPortal();
      // console.log(wordList[wordIndex]);
      setBookInfoInPortal(sentenceList[wordIndex]);
      setShowBookInfoPortal(!showBookInfoPortal);
    }
    

  }

  function setShowBookInfo(yn:boolean){
    setShowBookInfoPortal(yn);
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

          <div className=" pt-8"> {/* 저장한 문장 리스트 */} 
          {
            sentenceList.map((elem, index)=>{
              return(
                <div key={index} className=" w-full text-xs ">
                  <div className="flex justify-start items-center">
                    <div className="font-bold">{index+1}.</div>
                    <div className="ps-3 flex ">
                    {
                      (elem.importance === 1)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 2)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 3)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 4)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 5)}><FaRegStar/></span>
                      </p>
                      :
                      (elem.importance === 2)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 2)}><FaStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 3)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 4)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 5)}><FaRegStar/></span>
                      </p>
                      :
                      (elem.importance === 3)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 2)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 3)}><FaStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 4)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 5)}><FaRegStar/></span>
                      </p>:
                      (elem.importance === 4)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 2)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 3)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 4)}><FaStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 5)}><FaRegStar/></span>
                      </p>:
                      (elem.importance === 5)?
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 1)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 2)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 3)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 4)}><FaStar/></span>
                        <span className="text-[#F6AA46] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 5)}><FaStar/></span>
                      </p>:
                      <p className="flex justify-center  mt-[2px]">
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 1)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 2)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 3)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 4)}><FaRegStar/></span>
                        <span className="text-[#BFBFBF] mx-0.5 cursor-pointer" onClick={()=>clickStarSentence(elem._id, 5)}><FaRegStar/></span>
                      </p>
                    }
                    </div>
                    <div className="ps-3 flex items-center mt-1 w-full">

                      <div className=" "
                    
                      >
                      { /* 번역보기 */
                        (elem.translatorSee)?
                        <ButtonTranslator
                        disabledText={
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[14]:""
                        }
                        disabled={true}
                        />
                        :

                        <ButtonTranslator
                        text={
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[14]:""
                        }
                        onClick={()=>seeTranslatorSentenceInSentence(elem._id)}
                        />
                      }
                        

                      </div>

                      <div className="flex justify-center items-center ps-1 ">

                        <ButtonTranslator /* 책정보 */
                        text={ 
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[15]:""
                        }
                        onClick={()=>bookInfo(elem._id)}
                        />

                      </div>


                    </div>
                    <div className="flex items-center justify-end w-full font-light">{getDateContraction2(elem.learningdt)} 
                      &nbsp;{(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[12]:""}
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
            (sentenceList.length > 0)?
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

export default SavedSentenceList