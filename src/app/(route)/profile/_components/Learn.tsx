'use client';

import { ButtonHisBookListNext, ButtonLearning, ButtonTranslator } from "@/app/compontents/design/buttons/Buttons";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import userState from "@/app/store/user";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { useEffect, useRef, useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { IoIosRadioButtonOn, IoMdRadioButtonOff } from "react-icons/io";

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
  learningyn:boolean
  wordsee:boolean
}

interface wordListItf extends Array<wordItf>{}

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
  learningyn:boolean
}

interface sentenceListItf extends Array<sentenceItf>{}


const Learn = (props:any) => {

  const userStateSet = props.userStateSet;
  const currentTab = props.currentTab;

  const languageStateSet = languageState();  

  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  const focusWordInputListRef = useRef<null[] | HTMLInputElement[]>([]);

  //단어, 문장 학습 탭
  const [tab, setTab] = useState<number>(0); //0:단어, 1:문장

  //tabStyle1
  const [tabStyle1, setTabStyle1] = useState<string>(""); 
  //tabStyle2
  const [tabStyle2, setTabStyle2] = useState<string>(""); 

  //조회된 단어 리스트
  const [wordList, setWordList] = useState<wordListItf>([]);

  //조회된 문장 리스트
  const [sentenceList, setSentenceList] = useState<sentenceListItf>([]);

  //저장된 단어 리스트 페이지
  const [selectedBookWordPage, setSelectedBookWordPage] = useState<number>(0);

  //단어 다음조회
  const [wordNextButtonYn, setWordNextButtonYn] = useState<boolean>(false); 

  //order type , 1~5 까지의 점수(별) order 순서 0:적용안함, 1:내림차순 2:오름차순
  const [wordOrderType, setWordOrderType] = useState<number>(0); 

  //조회된 결과 order type
  const [wordResultOrderType, setWordResultOrderType] = useState<number>(0);

  //학습완료단어보기
  const [learnedWordYn, setLearnedWordYn] = useState<boolean>(false);

  //학습완료된 단어 리스트
  const [learnedWordList, setLearnedWordList] = useState<wordListItf>([]);

  //저장된 학습완료된 단어 리스트 페이지
  const [selectedLearnWordPage, setSelectedLearnWordPage] = useState<number>(0);

  //학습완료 단어 다음조회
  const [learnedWordNextButtonYn, setLearnedWordNextButtonYn] = useState<boolean>(false); 

  //학습완료 단어 조회 결과 order type
  const [learnedWordResultOrderType, setLearnedWordResultOrderType] = useState<number>(0);

  //학습완료단어 버튼 스타일
  const [learnedWordBtn, setLearnedWordBtn] = useState<string>(" text-[#4A6D88] font-bold ");

  //단어 조회시 마지막  seq 
  const [wordSearchSeq, setWordSearchSeq] = useState<number>(0);

  //학습완료 단어 조회시 마지막 seq 
  const [learnedWordSearchSeq, setLearnedWordSearchSeq] = useState<number>(0);
  

  

  useEffect(()=>{
    if(tab===0){
      setTabStyle1("border-b-2 border-b-[#4A6D88] font-bold ");
      setTabStyle2("border-b");
    }else{
      setTabStyle1("border-b");
      setTabStyle2("border-b-2 border-b-[#4A6D88] font-bold ");
    }
  },[tab]);

  useEffect(()=>{

    if(currentTab === 4){
      // console.log("학습");
      searchWord();
    }
    

  },[currentTab]);

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

  function tabClick(tabId:number){
    setTab(tabId);
  }

  //최초조회
  async function searchWord(){ 
    // console.log(userStateSet);
    setSelectedBookWordPage(0);
    setWordList([]);
    setWordNextButtonYn(false);
    setWordSearchSeq(0);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1, 
      orderType:wordOrderType,
      learningyn:false,
      lastSeq:0
    }



    const retObj = await transactionAuth("get", "history/learnWordsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setWordResultOrderType(wordOrderType);
      setWordList(retObj.sendObj.resObj);
      const lastArr = retObj.sendObj.resObj.length-1;
      setWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);
      setSelectedBookWordPage(1);
    }
  }

  //단어보기버튼클릭
  function onclickWordSee(id:string, wordseeYn:boolean){
    const wordIndex = wordList.findIndex((elem) => elem._id === id);
    
    if(wordseeYn){
      wordList[wordIndex].wordsee = false;
    }else{
      wordList[wordIndex].wordsee = true;
    }
    
    setWordList([...wordList]);
  }

  //저장한 단어 리스트 다음 조회
  async function nextSelectedBookWord() {

    const obj = {
      userseq:userStateSet.userseq,
      currentPage:selectedBookWordPage+1,
      orderType:wordOrderType,
      learningyn:false,
      lastSeq:wordSearchSeq,
    }

    const retObj = await transactionAuth("get", "history/learnWordsearch", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        setWordResultOrderType(wordOrderType);
        setWordList([...wordList ,...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        setWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);
        setSelectedBookWordPage(selectedBookWordPage+1);
      }
    }   
  }

  //학습완료단어조회
  async function searchLearnedWord(){ 
    // console.log(userStateSet);
    setSelectedLearnWordPage(0);
    setLearnedWordList([]);
    setLearnedWordSearchSeq(0);
    // setLearnedWordNextButtonYn(false);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1, 
      orderType:wordOrderType,
      learningyn:true,
      lastSeq:0
    }

    

    const retObj = await transactionAuth("get", "history/learnWordsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setLearnedWordResultOrderType(wordOrderType);
      setLearnedWordList(retObj.sendObj.resObj);
      const lastArr = retObj.sendObj.resObj.length-1;
      setLearnedWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);
      setSelectedLearnWordPage(1);
    }
  }

  //학습완료단어 다음조회
  async function nextSearchLearnedWord(){ 
    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:selectedLearnWordPage+1, 
      orderType:wordOrderType,
      learningyn:true,
      lastSeq:learnedWordSearchSeq,
    }

    

    const retObj = await transactionAuth("get", "history/learnWordsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      if(retObj.sendObj.resObj.length > 0){
        setLearnedWordResultOrderType(wordOrderType);
        setLearnedWordList([...learnedWordList, ...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        setLearnedWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);
        setSelectedLearnWordPage(selectedLearnWordPage+1);
      }
      
    }
  }

  async function onclickWordLearned(id:string) {
    const obj = {
      _id:id,
      email:userStateSet.email,
    }

     const retObj = await transactionAuth("post", "history/wordlearningfinish", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      const wordIndex = wordList.findIndex((elem) => elem._id === id);
      wordList[wordIndex].learningyn = true;
      wordList.splice(wordIndex,1);
      setWordList([...wordList]);
    }   
  }

  async function learnedWordSee(){

    if(!learnedWordYn){
      // console.log("학습완료단어조회");
      // if(learnedWordList.length === 0){
        searchLearnedWord();
      // }
    }

    setLearnedWordYn(!learnedWordYn);
  }

  useEffect(()=>{

    if(learnedWordYn){
      setLearnedWordBtn(" text-gray-500 ");
    }else{
      setLearnedWordBtn(" text-[#4A6D88] font-bold  ");
    }
    

  },[learnedWordYn]);
  
  

  return(
    <div className="w-full">
      <div className="flex flex-col w-full items-center ">
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
          <div className=" w-full mt-4 "> {/* 학습 */}
            <div className="flex justify-start items-center "> {/** 단어, 문장 */}
              <div className={tabStyle1+`  py-1 px-5 cursor-pointer text-sm
              transition delay-50 duration-100 ease-in-out hover:scale-105
              ` }
              onClick={()=>tabClick(0)}
              >단어</div>
              <div className={tabStyle2+`  py-1 px-5 cursor-pointer text-sm
              transition delay-50 duration-100 ease-in-out hover:scale-105 
              ` }
              onClick={()=>tabClick(1)}
              >문장</div>
            </div>
            <div className="w-full px-2 mt-4"> {/* 탭 내용 */}
              {
                (tab===0)?
                <div className="flex flex-col  ">
                  <div className="flex justify-end text-xs mb-4 pe-2 
                  
                  ">
                    <div className={learnedWordBtn + ` flex justify-center cursor-pointer
                    transition delay-50 duration-100 ease-in-out hover:scale-105
                    `}
                    onClick={()=>learnedWordSee()}
                    >
                      <span className="text-sm pt-[1px] pe-[2px]"><CiCircleCheck /></span>
                      학습완료단어
                    </div>
                    
                  </div>
                  {
                    (learnedWordYn)?
                    <div className="overflow-y-scroll h-[400px] pe-2">
                    { //학습완료한 단어리스트
                      learnedWordList.map((elem, index)=>{
                        return(
                          <div key={index+200000} className="text-xs mb-4   ">
                            <div className="flex col-row">
                              <div className="flex col-row">
                                <span className="me-2">{index+1 + "."}</span>
                                {elem.word}
                              </div>
                              

                            
                            </div>
                            <div className="mt-4 max-h-[100px] overflow-y-auto">
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
                          </div>
                        )
                      })
                    }
                    </div>
                    :
                    <div className="overflow-y-scroll h-[400px] pe-2">
                    {
                      wordList.map((elem, index)=>{
                        return(
                          <div key={index+100000} className="text-xs mb-4   ">
                            <div className="flex col-row">
                              <div className="flex col-row">
                                <span className="me-2">{index+1 + "."}</span>
                                <input className={` 
                                border-b h-[18px] border-b-[#A0A0A0] outline-none focus:border-[#4A6D88] focus:border-b-2
                                `}
                                maxLength={elem.word.length}
                                ref={(element) => {focusWordInputListRef.current[index] = element;}}
                                style={{
                                    width:elem.word.length * 10 + "px",
                                    fontFamily:"Consolas",
                                    letterSpacing:"0.2em",
                                    // color:(elem.answertype === "a")?"green":
                                    //   (elem.answertype === "b")?"blue":
                                    //   (elem.answertype === "c")?"red":"" ,
                                    imeMode: 'inactive'
                                }}
                                ></input>
                              </div>
                              <div className="flex ps-4">
                                {
                                  (elem.wordsee)?
                                  <p className=" text-red-700 font-bold border-b text-center "
                                  style={{
                                    width:elem.word.length * 10 + "px",
                                    fontFamily:"Consolas",
                                    letterSpacing:"0.2em",
                                    // color:(elem.answertype === "a")?"green":
                                    //   (elem.answertype === "b")?"blue":
                                    //   (elem.answertype === "c")?"red":"" ,
                                    imeMode: 'inactive'
                                  }}
                                  >{elem.word}</p>:""
                                }
                              </div>
                              <div className="flex col-row w-full justify-end ">
                                <div className="me-1">
                                  <ButtonLearning text={"단어보기"} disabled={elem.wordsee} disabledText={"단어보기"} 
                                  onClick={()=>onclickWordSee(elem._id, elem.wordsee)} />
                                </div>
                                <div>
                                  <ButtonTranslator text={"학습완료"} disabled={elem.learningyn} disabledText={"학습완료"}
                                  onClick={()=>onclickWordLearned(elem._id)} />
                                </div>
                              </div>
                            
                            </div>
                            <div className="mt-4 max-h-[100px] overflow-y-auto">
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
                          </div>
                        )
                      })
                    }
                    </div >

                  }
                  
                  



                </div>
                :
                <div className="overflow-y-scroll">
                  




                </div>
              }
            </div> 

            {
              (tab===0)? //단어
                (learnedWordYn)?
                  (learnedWordList.length > 0)?
                  <div className="flex justify-end text-xs mt-5 pe-2">
                    <p>
                      <ButtonHisBookListNext 
                        text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                        disabled={wordNextButtonYn}
                        disabledText={
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                      onClick={()=>nextSearchLearnedWord()}  
                      />
                    </p>
                  </div>
                  :""
                :(wordList.length > 0)?
                  <div className="flex justify-end text-xs mt-5 pe-2 ">
                    <p>
                      <ButtonHisBookListNext 
                        text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                        disabled={wordNextButtonYn}
                        disabledText={
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                      onClick={()=>nextSelectedBookWord()}  
                      />
                    </p>
                  </div>
                  :""
              
              :""

            }

            {/* {
              (wordList.length > 0)?
              <div className="flex justify-end text-xs mt-5">
                <p>
                  <ButtonHisBookListNext 
                    text={
                    (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                    }
                    disabled={wordNextButtonYn}
                    disabledText={
                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                    }
                  onClick={()=>nextSelectedBookWord()}  
                  />
                </p>
              </div>
              :""
            } */}

          </div>


        </div>
      </div>
    </div>
  );
};

export default Learn