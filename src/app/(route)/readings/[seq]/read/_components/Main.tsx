'use client';

import {ButtonTranslator, ReadingNext, ReadingPrev } from "@/app/compontents/design/buttons/Buttons";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transaction } from "@/app/utils/axios";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { GrCheckbox, GrCheckboxSelected, GrFormPreviousLink } from "react-icons/gr";
import { GrFormNextLink } from "react-icons/gr";
import { IoIosClose, IoIosRadioButtonOn, IoMdRadioButtonOff } from "react-icons/io"; 

interface imagesItf {
  medium_cover:string
  cover:string
}

interface pageItf {
  page:string
  contentarr:[]
  tranlatorYn:boolean
  contentToken:any
}

interface translatorItf {
  page:string
  contentarr:[]
  contentToken:any
}


interface bookItf {
  _id:string
  book_seq:number
  source:string
  book_id:number
  title:string
  book_title:string
  author:{
    gutenberg_author_id:number
    name:string
  },
  subjects:[]
  copyright_status:string
  language:string
  release_date:string
  reading_level:string
  loc_class:string
  download_url:string
  downloads_30_days:string
  images:[imagesItf]
  pages:[pageItf]
  total_pages:number
  translator_kr:[translatorItf]
  translator_sp:[translatorItf]

}


const Main = (props:any) => {

  const router = useRouter();
  const languageStateSet = languageState();  
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  const path = usePathname();
  const book_seq = path.split("/")[2];
  const userStateSet = props.userStateSet;
  // const translatorLang = (props.preferred_trans_lang)?props.preferred_trans_lang:"kr";

  const focusSpanListRef = useRef<null[] | HTMLSpanElement[]>([]); //단어별로 Ref 처리
  const options = ['/flags/kr.png', '/flags/mx.png'];

  //단어 클릭시 나오는 번역 창
  const [translatorBoxStyle, setTranslatorBoxStyle] = useState<any>(
    {top:0, display:"none", 
      height:" h-[180px] 2xl:h-[250px]  xl:h-[250px]  lg:h-[250px]  md:h-[250px] sm:h-[250px] ",
      tarnslateYn:false  
    });

  const [bookDetail, setBookDetail] = useState<bookItf | undefined>();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pageTranslateYn, setPageTranslateYn] = useState<boolean>(false); //페이지 전체 번역 여부
  
  useEffect(() => {
    // console.log(path.split("/")[2]);
    // console.log(userStateSet);
    bookDetailSearch(true, 1); //최초조회여부
  }, []);

  const readpageDiv = useRef<any>(null); 

  async function bookDetailSearch(searchFirst:boolean, page:number){

    
    //사용자의 읽기 히스토리를 조회한 뒤 없으면 현재 페이지를 1 있는 경우 마지막 페이지를 보여준다.
    //backend에서는 페이지별로 deepl로 번역데이터를 저장한다. 한국어, 스페인어
    let obj = {}
    if(searchFirst){ //최초조회인경우 화면 시작시 조회
      obj = {
        book_seq:book_seq, 
        userseq:userStateSet.userseq,
        email:userStateSet.email,
        searchFirst:searchFirst,
        currnetPage:page,
      }
    }else{
      obj = {
        book_seq:book_seq, 
        userseq:userStateSet.userseq,
        email:userStateSet.email,
        searchFirst:searchFirst,
        currnetPage:page
      }
    }
 
    // console.log(obj);

    const retObj = await transactionAuth("post", "reading/readingbypage", obj, "", false, true, screenShow, errorShow);  
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){ 

      setPageTranslateYn(false);
      
      let arr1 = new Array();
      let arrKr = new Array();
      let arrSp = new Array();
      let _contentarr = retObj.sendObj.resObj.bookData.pages[0].contentarr;
      let _contentarrKr = retObj.sendObj.resObj.bookData.translator_kr[0].contentarr;
      let _contentarrSp = retObj.sendObj.resObj.bookData.translator_sp[0].contentarr;
 
      if(_contentarr.length > 0){
        for(let i=0; i<_contentarr.length; i++){
          arr1.push( tokenizeStringWithAllParts(_contentarr[i]));   
        }  
      }
      retObj.sendObj.resObj.bookData.pages[0].contentToken = arr1;

      //번역내용 배열로 정리 
      if(_contentarrKr.length > 0){
        let arr = [];
        for(let i=0; i<_contentarrKr.length; i++){
          arrKr.push( tokenizeStringWithAllParts(_contentarrKr[i].text));   
        }
      }
      retObj.sendObj.resObj.bookData.translator_kr[0].contentToken = arrKr;

      if(_contentarrSp.length > 0){
        let arr = [];
        for(let i=0; i<_contentarrSp.length; i++){
          arrSp.push( tokenizeStringWithAllParts(_contentarrSp[i].text));    
        }
      }
      retObj.sendObj.resObj.bookData.translator_sp[0].contentToken = arrSp;
      
 
      
      setBookDetail(retObj.sendObj.resObj.bookData);
      setCurrentPage(retObj.sendObj.resObj.currentPage);

      readpageDiv.current.scrollTop = 0; //스크롤 상단으로 이동
    }   
  }



  function tokenizeStringWithAllParts(str:string) {
    // 정규 표현식 설명:
    // 1. ([^\p{L}\s]+) : 하나 이상의 연속된 '글자'(\p{L}) 또는 '공백'(\s)이 아닌 문자 (=> 특수 문자 그룹)
    // 2. (\p{L}+)      : 하나 이상의 연속된 '글자' (=> 단어 그룹)
    // 3. (\s+)         : 하나 이상의 연속된 '공백' (=> 공백 그룹)
    //
    // 'g' 플래그는 문자열 전체에서 일치하는 모든 항목을 찾습니다.
    // 'u' 플래그는 유니코드(Unicode) 모드를 활성화하여 \p{L}과 같은 유니코드 속성을 사용할 수 있게 합니다.
    //   \p{L}은 모든 종류의 유니코드 글자(알파벳, 한글, 일본어 등)를 의미합니다.
    //   현재 예시가 영어이므로 [a-zA-Z]+ 를 사용해도 되지만, 좀 더 범용적으로 \p{L}을 사용했습니다.
    //   영문만 처리하고 싶다면, '[^a-zA-Z\\s]+|[a-zA-Z]+|\\s+' 로 바꾸시면 됩니다.

    // match() 메서드는 이 정규 표현식에 일치하는 모든 부분을 배열로 반환합니다.
    const tokens = str.match(/[^\p{L}\s]+|\p{L}+|\s+/gu);
    
    // match()가 일치하는 항목을 찾지 못하면 null을 반환할 수 있으므로, 빈 배열로 처리하도록 안전하게 처리합니다.
    return tokens || [];
  }

  function nextPage(){
    closeTransBox();
    bookDetailSearch(false, currentPage+1);
  }

  function prevPage(){
    if(currentPage-1 < 1){
      return;
    }
    closeTransBox();
    bookDetailSearch(false, currentPage-1);
  }

  //현재 선택한 단어 ref index
  const [selectedWordRefIndex, setSelectedWordRefIndex] = useState<number>(0);
  const [selectedWord, setSelectedWord] = useState<string>("");
  
  //현재 선택한 단어 및 문장에 대한 정보들
  const [selectedWordInfo, setSelectedWordInfo] = useState({
    word:"",
    page:0,
    index:0,
    wordMearningKR:"",
    wordMearningES:"",
    reworkynKR:false, //관리자가 등록한 단어 여부 true 인경우 관리자가 등록한 단어 뜻을 보여줘야 된다.
    reworkynES:false, //관리자가 등록한 단어 여부 true 인경우 관리자가 등록한 단어 뜻을 보여줘야 된다.
    reworkmeaningKR:"", //관리자가 등록한 단어 뜻
    reworkmeaningES:"", //관리자가 등록한 단어 뜻
    wordSaveYn:false, //사용자가 단어 저장 여부
    sentenceSaveYn:false, //사용자가 문장 저장 여부
    wordid:"",
    sentence:"", //선택한 단어를 포함하고 있는 문장
    tanslatedSentenceKr : "", //번역된 문장
    tanslatedSentenceSp : "", 
  });
  
  //단어 클릭
  async function wordClick(data:string, index:number, wordRefIndex:number){
    //문장안에 단어가 포함이 안되어있으면 return 시킨다.
    let englishRegex = /[a-zA-Z]/; // 대소문자 영어 알파벳
    if (!englishRegex.test(data)) {
        return;
    }
    setSelectedWord("");
    setSelectedWord(data);

    // console.log(data);
    // console.log(index);
    // console.log(wordRefIndex);

    //초기화
    focusSpanListRef.current[selectedWordRefIndex]?.style.setProperty('background-color', '');
    setTranslatorBoxStyle({top:0, display:"none", height:" h-[180px] 2xl:h-[250px]  xl:h-[250px]  lg:h-[250px]  md:h-[250px] sm:h-[250px] ", tarnslateYn:false });

    //번역 시작
    const obj = {
      book_seq:book_seq, 
      userseq:userStateSet.userseq,
      data:data, //단어
      email:userStateSet.email,
      page : currentPage, //현재 페이지
      index : index, //문장 인덱스 
    }

    const retObj = await transactionAuth("post", "reading/translationword", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj);
      let top;
      top = focusSpanListRef.current[wordRefIndex]?.offsetTop as number;
      focusSpanListRef.current[wordRefIndex]?.style.setProperty('background-color', '#35BA82');
      setTranslatorBoxStyle({top:top + 25, display:"block", height:" h-[180px] 2xl:h-[250px]  xl:h-[250px]  lg:h-[250px]  md:h-[250px] sm:h-[250px] ", tarnslateYn:false});
      setSelectedWordRefIndex(wordRefIndex);

      const wordInfo = {
        word:data,
        page:currentPage,
        index:index,
        wordMearningKR:retObj.sendObj.resObj.textKR,
        wordMearningES:retObj.sendObj.resObj.textES,
        reworkynKR:retObj.sendObj.resObj.reworkynKR, //관리자가 등록한 단어 여부 true 인경우 관리자가 등록한 단어 뜻을 보여줘야 된다.
        reworkynES:retObj.sendObj.resObj.reworkynES, //관리자가 등록한 단어 여부 true 인경우 관리자가 등록한 단어 뜻을 보여줘야 된다.
        reworkmeaningKR:retObj.sendObj.resObj.reworkmeaningKR, //관리자가 등록한 단어 뜻
        reworkmeaningES:retObj.sendObj.resObj.reworkmeaningES, //관리자가 등록한 단어 뜻
        wordSaveYn:retObj.sendObj.resObj.saveyn, //사용자가 단어 저장 여부
        sentenceSaveYn:retObj.sendObj.resObj.sentenceSaveYn, //사용자가 단어 저장 여부
        wordid:retObj.sendObj.resObj.wordid,
        sentence:bookDetail?.pages[0].contentToken[index].join(''), //선택한 단어를 포함하고 있는 문장
        tanslatedSentenceKr : bookDetail?.translator_kr[0].contentToken[index].join(''), //번역된 문장
        tanslatedSentenceSp : bookDetail?.translator_sp[0].contentToken[index].join(''), //번역된 문장
      }

      setSelectedWordInfo(wordInfo);

    }

    
    
  }

  function closeTransBox(){
    setTranslatorBoxStyle({top:0, display:"none", height:" h-[180px] 2xl:h-[250px]  xl:h-[250px]  lg:h-[250px]  md:h-[250px] sm:h-[250px] ", tarnslateYn:false});
    focusSpanListRef.current[selectedWordRefIndex]?.style.setProperty('background-color', '');
  }

  async function changeTranslatorLang(lang:string){

    const obj = {
      userseq:userStateSet.userseq,
      email:userStateSet.email,
      preferred_trans_lang:lang

    }
    const retObj = await transactionAuth("post", "user/usertranslatorupdate", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      console.log(retObj);
      userStateSet.preferredTransLangSet(lang);

      

    }
    
    
  }


  //단어 저장하기
  async function wordSave(){

    const obj = {
      userseq:userStateSet.userseq, 
      book_seq:book_seq,
      page:currentPage, //현재 책 페이지
      sentenceindex:selectedWordInfo.index, //선택한 단어가 포함된 문장 인덱스 
      word:selectedWordInfo.word, //단어
      sentence:selectedWordInfo.sentence, //단어가 포함된 문장 전체
      wordid:selectedWordInfo.wordid, //단어에 대한 ID
      email : userStateSet.email,
      book_title : bookDetail?.book_title,
      images : bookDetail?.images,


    }

    const retObj = await transactionAuth("post", "reading/saveword", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // setWordSaveBtnDisabled(true);
      setSelectedWordInfo({...selectedWordInfo, wordSaveYn:true});
    }
  }

  function sentenceTranslate(){
    setTranslatorBoxStyle({...translatorBoxStyle, height:" h-[250px] 2xl:h-[350px]  xl:h-[350px]  lg:h-[350px]  md:h-[350px] sm:h-[350px] ", tarnslateYn:true});
  }

  async function sentenceSave(){

    const obj = {
      userseq:userStateSet.userseq, 
      book_seq:book_seq,
      page:currentPage, //현재 책 페이지
      sentenceindex:selectedWordInfo.index, //선택한 단어가 포함된 문장 인덱스 
      sentence:selectedWordInfo.sentence, //단어가 포함된 문장 전체
      translatedsentenceKR:selectedWordInfo.tanslatedSentenceKr,
      translatedsentenceES:selectedWordInfo.tanslatedSentenceSp,
      email : userStateSet.email,
      book_title : bookDetail?.book_title,
      images : bookDetail?.images,
    }

    const retObj = await transactionAuth("post", "reading/savesentence", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // setWordSaveBtnDisabled(true);
      setSelectedWordInfo({...selectedWordInfo, sentenceSaveYn:true});
    }

  }

  function pageTranslate(){
    if(pageTranslateYn){
      setPageTranslateYn(false);
    }else{
      setPageTranslateYn(true);
    }
  }


  return(
    <>
      <div className="h-[55px] w-full "></div> {/* 상단 헤더 만큼 아래로 */}
      
      <div className="flex flex-col justify-center items-center  ">
        
        <div className=" mt-5 flex flex-row
        w-[350px] 2xl:w-[750px]  xl:w-[750px]  lg:w-[750px]  md:w-[750px] sm:w-[500px]
        ">
          <div className=" flex flex-row items-center text-xs font-bold  ">
            {/* Translation Language */}
            <div className=" ">{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[0]:""}</div>
            <div className=" ms-3 flex flex-row ">
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

              <div className="flex flex-1 ms-7 items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>pageTranslate()}
              >
                <div className=" text-[15px] ">
                { 
                  (pageTranslateYn)?<GrCheckboxSelected />:<GrCheckbox />
                }
                </div>
                <div className=" ps-1 ">{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[8]:""}</div> {/* Page Translate */}
              </div>
              
            </div>
            

          </div>

          {/* <div className="flex flex-1 w-full justify-end me-5 ">여기</div> */}
          
          {/* <hr className=" mt-2 h-[2px] bg-blue-300 rounded-2xl "></hr> */}
        </div>
        
        <div className="mx-10 text-center  flex justify-center mt-10 ">
          <p className="font-bold  pb-2
          text-sm 2xl:text-lg  xl:text-lg  lg:text-lg  md:text-lg sm:text-sm ">
            <span className="">{bookDetail?.title}</span>
          </p>
          
          
        </div>
        {/* 책내용 상세 보기 */}
        <div ref={readpageDiv} className=" flex flex-wrap justify-center mt-5 overflow-y-auto relative
        h-[350px] 2xl:h-[500px]  xl:h-[500px]  lg:h-[500px]  md:h-[500px] sm:h-[400px]
        w-[380px] 2xl:w-[750px]  xl:w-[750px]  lg:w-[750px]  md:w-[750px] sm:w-[500px]
        ">
          
          {/* 단어클릭시 보여지는 번역 화면 */}
          <div className={`
          absolute flex justify-center border
          bg-white rounded-md overflow-hidden
          w-[300px] 2xl:w-[400px]  xl:w-[400px]  lg:w-[400px]  md:w-[400px] sm:w-[300px]
          shadow-2xs shadow-orange-50
          ` + translatorBoxStyle.height}
          style={{
            top:translatorBoxStyle.top + "px",
            display: translatorBoxStyle.display
            // display: "block"
          }}
          >

            <div className="flex  justify-end items-center w-full  pe-2 pt-1 ">
              <span className=" cursor-pointer
              transition-transform duration-300 ease-in-out text-[20px]
              hover:scale-110 transform 
              "
              onClick={()=>closeTransBox()}
              ><IoIosClose/></span>
            </div>
            
            {/* 선택한 단어 */}
            <div className=" flex flex-col w-full ">
              <div className="flex justify-between px-5">
                <p className=" font-bold
                text-[10px] 2xl:text-xs  xl:text-xs  lg:text-xs  md:text-xs sm:text-xs
                ">
                  {selectedWord}
                </p>
                <p className="
                text-[10px] 2xl:text-xs  xl:text-xs  lg:text-xs  md:text-xs sm:text-xs
                ">
                  <ButtonTranslator 
                  text={(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[4]:""}
                  disabledText={(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[5]:""}
                  onClick={()=>wordSave()}
                  disabled={(selectedWordInfo.wordSaveYn)?true:false}
                  />
                </p>
              </div>
              <div className="pt-1">
                <div className="px-5  overflow-y-auto 
                h-[40px] 2xl:h-[80px]  xl:h-[80px]  lg:h-[80px]  md:h-[80px] sm:h-[80px]
                text-[10px] 2xl:text-xs  xl:text-xs  lg:text-xs  md:text-xs sm:text-xs
                ">
                  {
                    (userStateSet.preferred_trans_lang === "kr")?
                    <div>
                      {/* {selectedWordInfo.wordMearningKR} */}
                      {
                        (selectedWordInfo.reworkynKR)?
                        <div dangerouslySetInnerHTML={{ __html: selectedWordInfo.reworkmeaningKR }}></div>
                        :selectedWordInfo.wordMearningKR
                      }
                    </div>
                    :
                    <div>
                      {/* {selectedWordInfo.wordMearningES} */}
                      {
                        (selectedWordInfo.reworkynES)?
                        <div dangerouslySetInnerHTML={{ __html: selectedWordInfo.reworkmeaningES }}></div>
                        :selectedWordInfo.wordMearningES
                      }
                    </div>
                  }
                </div>
              </div>
              <div className="flex justify-between pt-5 px-5 "> {/* 단어를 포함하고 있는 문장 */}
                <div className="text-xs font-bold 
                text-[10px] 2xl:text-xs  xl:text-xs  lg:text-xs  md:text-xs sm:text-xs
                ">
                  {(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[3]:""}
                </div>
                <div className="text-[10px] 2xl:text-xs  xl:text-xs  lg:text-xs  md:text-xs sm:text-xs flex justify-center "
                >
                  <p className="me-1">
                  <ButtonTranslator 
                  text={(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[6]:""}
                  disabledText={(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[7]:""}
                  onClick={()=>sentenceTranslate()}
                  disabled={translatorBoxStyle.tarnslateYn}
                  />
                  </p>
                  <p>
                  <ButtonTranslator 
                  text={(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[4]:""}
                  disabledText={(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[5]:""}
                  onClick={()=>sentenceSave()}
                  disabled={(selectedWordInfo.sentenceSaveYn)?true:false}
                  />
                  </p>
                </div>
              </div>
              <div className="pt-1 ">
                <p className=" px-5 overflow-y-auto 
                h-[50px] 2xl:h-[80px]  xl:h-[80px]  lg:h-[80px]  md:h-[80px] sm:h-[80px]
                text-[10px] 2xl:text-xs  xl:text-xs  lg:text-xs  md:text-xs sm:text-xs
                ">
                  {selectedWordInfo.sentence}
                </p>
              </div>

              <div className="mt-2 ">
                <p className=" px-5 overflow-y-auto 
                h-[50px] 2xl:h-[80px]  xl:h-[80px]  lg:h-[80px]  md:h-[80px] sm:h-[80px]
                text-[10px] 2xl:text-xs  xl:text-xs  lg:text-xs  md:text-xs sm:text-xs
                ">
                  {
                    (userStateSet.preferred_trans_lang === "kr")?
                    <>
                    {selectedWordInfo.tanslatedSentenceKr}
                    </>
                    :
                    <>
                    {selectedWordInfo.tanslatedSentenceSp}
                    </>
                  }
                  
                </p>
              </div>

            </div>

          </div>
          {/* 단어클릭시 보여지는 번역 화면 끝 */}

          <pre className=" whitespace-pre-wrap ps-1
          text-[9px] 2xl:text-base  xl:text-base  lg:text-base  md:text-base sm:text-sm
          ">
          

          {
            (!pageTranslateYn)? //원본 영문
            bookDetail?.pages.map((content)=>content.contentToken.map((_content : any, index : any)=>{
              return (
                <span key={index} className=" hover:text-blue-700 cursor-pointer ">
                {
                  _content.map((con:any, index1:any)=>{
                    return(
                      
                      <span key={index1} className=" rounded-sm
                      hover:bg-blue-800
                      hover:text-white
                      transition-all duration-200 ease-in-out 
                      cursor-pointer
                      "
                      onClick={()=>wordClick(con, index, index*1000 + index1)} /* 단어, 문장index, 단어 참조 ref */
                      ref={(element) => {focusSpanListRef.current[index*1000 + index1] = element;}}
                      >{`${con}`}</span>
                      
                    )
                  })
                
                }
                
                </span> 
              )
            }))
            :

            (userStateSet.preferred_trans_lang === "kr")?



            bookDetail?.translator_kr.map((content)=>content.contentToken.map((_content : any, index : any)=>{
              return (
                <span key={index} className=" hover:text-blue-700 cursor-pointer ">
                {
                  _content.map((con:any, index1:any)=>{
                    return(
                      
                      <span key={index1} className=" rounded-sm
                      hover:bg-blue-800
                      hover:text-white
                      transition-all duration-200 ease-in-out 
                      cursor-pointer
                      "
                      onClick={()=>wordClick(con, index, index*1000 + index1)} /* 단어, 문장index, 단어 참조 ref */
                      ref={(element) => {focusSpanListRef.current[index*1000 + index1] = element;}}
                      >{`${con}`}</span>
                      
                    )
                  })
                
                }
                
                </span>
              )
            }))
            :

            bookDetail?.translator_sp.map((content)=>content.contentToken.map((_content : any, index : any)=>{
              return (
                <span key={index} className=" hover:text-blue-700 cursor-pointer ">
                {
                  _content.map((con:any, index1:any)=>{
                    return(
                      
                      <span key={index1} className=" rounded-sm
                      hover:bg-blue-800
                      hover:text-white
                      transition-all duration-200 ease-in-out 
                      cursor-pointer
                      "
                      onClick={()=>wordClick(con, index, index*1000 + index1)} /* 단어, 문장index, 단어 참조 ref */
                      ref={(element) => {focusSpanListRef.current[index*1000 + index1] = element;}}
                      >{`${con}`}</span>
                      
                    )
                  })
                
                }
                
                </span>
              )
            }))


          }

          
            
          </pre>
        </div>
        
      </div>
      <div className="flex justify-center items-center 
      text-xs 2xl:text-base  xl:text-base  lg:text-sm  md:text-sm sm:text-xs
      mt-5 mb-7
      " >
        <div className="flex items-center">
          <ReadingPrev onClick={()=>prevPage()} 
          disabled={(currentPage === 1)?true:false}
           />
        </div>
        
        <div className="mx-10">
          {
            (bookDetail?.total_pages)?`${currentPage} / ${bookDetail?.total_pages}`:""
          }
          
        </div>

        <div className="flex items-center">
          
          {/* <button className="border border-[#4A6D88] w-[36px] text-lg bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold  rounded
          transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[2px]
          "
          onClick={()=>nextPage()}
          >
            <GrFormNextLink/>
          </button> */}
          <ReadingNext onClick={()=>nextPage()} 
          disabled={(currentPage === bookDetail?.total_pages)?true:false}
          />
        </div>
      </div>
      <div></div>

    </>
  );
};

export default Main