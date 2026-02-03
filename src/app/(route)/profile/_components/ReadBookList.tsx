'use client';

import { ButtonHisBookList, ButtonHisBookListNext, ButtonTranslator } from "@/app/compontents/design/buttons/Buttons";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { getDateContraction2 } from "@/app/utils/common";
import Image from 'next/legacy/image'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoIosRadioButtonOn, IoMdRadioButtonOff } from "react-icons/io";

interface imagesItf {
  medium_cover:string
  cover:string
}

interface bookItf {
  _id:string
  book_seq:number
  book_title:string
  images:[imagesItf]
  pages:number
  readingdt:string
  readcompletedt:string
  saved_word_cnt:number
  saved_sentence_cnt:number
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

interface bookListItf extends Array<bookItf>{}
interface wordListItf extends Array<wordItf>{}
interface sentenceListItf extends Array<sentenceItf>{}

interface userByTotalItf {
  totalBooks:string
  inProgressBooks:number
  completedBooks:string
}

const ReadBookList = (props:any) => {

  const router = useRouter();
  const userStateSet = props.userStateSet;

  const languageStateSet = languageState();  
  
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  const [bookList, setBookList] = useState<bookListItf>([]);
  const [wordList, setWordList] = useState<wordListItf>([]);
  const [sentenceListList, setSentenceListList] = useState<sentenceListItf>([]);
  
  //단어보기 문장보기 해당 책의 전체책리스트:0 단어보기:1, 문장보기:2, 읽기(페이지이동)
  const [currentPage, setCurrentPage] = useState<number>(0);
  //선택한 책
  const [selectedBook, setSelectedBook] = useState<bookItf>();

  //토탈 책 정보 
  const [userByTotal, setUserByTotal] = useState<userByTotalItf>()
  //토탈 책 정보 조회유무
  const [userByTotalSearchYn, setUserByTotalSearchYn] = useState<boolean>(false);
  
  //조회된 책 리스트 페이지
  const [listPage, setListPage] = useState<number>(0);

  //검색text
  const [searchText, setSearchText] = useState<string>("");

  //선택한 책의 저장된 단어 리스트 페이지
  const [selectedBookWord, setSelectedBookWord] = useState<number>(0);

  //선택한 책의 저장된 문장 리스트 페이지
  const [selectedBookSentence, setSelectedBookSentence] = useState<number>(0);

  
  

  useEffect(() => {
    if(userStateSet.userseq > 0){
      userBookListSearch();
    }

  }, []); // 빈 배열은 마운트/언마운트 시에만 실행

  //최초조회
  async function userBookListSearch(){ 

    const obj = {
      userseq:userStateSet.userseq, 
      listPage:1,
      userByTotalSearchYn:userByTotalSearchYn
    }

    const retObj = await transactionAuth("get", "history/booklistsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setBookList(retObj.sendObj.resObj.books);
      setUserByTotal(retObj.sendObj.resObj.userByTotal[0]);
      setUserByTotalSearchYn(true);
      setListPage(1);
    }   
  }

  //다음조회
  async function nextUserBookListSearch(){ 
    // console.log(userStateSet);

    const obj = {
      userseq:userStateSet.userseq, 
      listPage:listPage+1,
      keyword:searchText,
      userByTotalSearchYn:userByTotalSearchYn
    }

    const retObj = await transactionAuth("get", "history/booklistsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){

      if(retObj.sendObj.resObj.books.length > 0){
        setBookList([...bookList , ...retObj.sendObj.resObj.books]);
        setListPage(listPage+1);
      }
    }   
  }

  //해당 책의 저장한 단어리스트 보기
  function bookSavedWordClick(book_seq:any){

    setCurrentPage(1);
    
    const selectedBookIndex = bookList?.findIndex((elem) => elem.book_seq === book_seq);
    if(selectedBookIndex > -1){
      setSelectedBook(bookList[selectedBookIndex]);
    }

    bookSavedWordListSearch(book_seq);
  }

  //해당 책의 저장한 문장리스트 보기
  function bookSavedSentenceClick(book_seq:any){
    setCurrentPage(2);
    const selectedBookIndex = bookList?.findIndex((elem) => elem.book_seq === book_seq);
    if(selectedBookIndex > -1){
      setSelectedBook(bookList[selectedBookIndex]);
    }

    bookSavedSentenceListSearch(book_seq);
  }

  //저장한 단어 리스트 조회 최초
  async function bookSavedWordListSearch(book_seq:any){
    setWordList([]);
    setSelectedBookWord(0);
    const obj = {
      userseq:userStateSet.userseq,
      book_seq: book_seq,
      currentPage:1,
    }

    const retObj = await transactionAuth("get", "history/booksavedwordsearch", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      setWordList(retObj.sendObj.resObj);
      setSelectedBookWord(1);
    }   

  }

  //저장한 단어 리스트 다음 조회
  async function nextSelectedBookWord(book_seq:any) {

    const obj = {
      userseq:userStateSet.userseq,
      book_seq: book_seq,
      currentPage:selectedBookWord+1,
    }

    const retObj = await transactionAuth("get", "history/booksavedwordsearch", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        setWordList([...wordList ,...retObj.sendObj.resObj]);
        setSelectedBookWord(selectedBookWord+1);
      }
      
      
    }   
    
  }
  
  //저장한 문장 리스트 조회 최초
  async function bookSavedSentenceListSearch(book_seq:any){

    setSentenceListList([]);
    setSelectedBookSentence(0);
    const obj = {
      userseq:userStateSet.userseq,
      book_seq: book_seq,
      currentPage:1,
    }
    const retObj = await transactionAuth("get", "history/booksavedsentencesearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setSentenceListList(retObj.sendObj.resObj);
      setSelectedBookSentence(1);
    }   
  }

  //저장한 문장 리스트 다음 조회 
  async function nextBookSavedSentenceListSearch(book_seq:any){

    const obj = {
      userseq:userStateSet.userseq,
      book_seq: book_seq,
      currentPage:selectedBookSentence+1,
    }
    const retObj = await transactionAuth("get", "history/booksavedsentencesearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      
      if(retObj.sendObj.resObj.length > 0){
        setSentenceListList([...sentenceListList, ...retObj.sendObj.resObj]);
        setSelectedBookSentence(selectedBookSentence+1);
      }
    }   
  }



  //해당 책 읽기
  function readPage(seq:any){
    router.push('/readings/'+ seq);
  }

  //뒤로가기
  function bookListMove(){
    setCurrentPage(0);
  }

  //검색창
  function searchTextOnKeyDownHandler(e:any){
    if(e.key === 'Enter') {
      // readingsFromSearch();
      searchForm();
    }
  }

  function searchTextOnChangeHandler(e:any){
    setSearchText(e.target.value);
  }

  //검색창 조회
  async function searchForm(){ 
    // console.log(userStateSet);
    setListPage(1);
    setBookList([]);

    const obj = {
      userseq:userStateSet.userseq, 
      listPage:1,
      keyword:searchText,
      userByTotalSearchYn:userByTotalSearchYn
    }

    const retObj = await transactionAuth("get", "history/booklistsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setBookList(retObj.sendObj.resObj.books);
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
      // console.log(retObj.sendObj);
      wordList[wordIndex].importance = importance;
      setWordList([...wordList]);

      setIdleYn(false);
    }
  }

  //문장
  const [idleYnS, setIdleYnS] = useState<boolean>(false);

  async function clickStarSentence(id:string, importance:number){
    if(idleYnS){
      return;
    }

    const sentenceIndex = sentenceListList.findIndex((elem) => elem._id === id);

    if(importance === 1 && sentenceListList[sentenceIndex].importance === 1){
      importance = 0;
    }else{
      if(sentenceListList[sentenceIndex].importance === importance){
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

    const retObj = await transactionAuth("post", "history/sentenceimportance", obj, "", false, false, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj);
      sentenceListList[sentenceIndex].importance = importance;
      setSentenceListList([...sentenceListList]);

      setIdleYnS(false);
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
      // console.log(retObj);
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

  async function seeTranslatorSentenceInSentence(id:string){

    const sentenceIndex = sentenceListList.findIndex((elem) => elem._id === id);

    if(sentenceIndex > -1){

      sentenceListList[sentenceIndex].translatorSee = true;
      setSentenceListList([...sentenceListList])
    }



  }

  
  
  
  
  return(
      <div className="w-full flex justify-center">
      {
        (currentPage===0)?
          <div className="flex flex-col w-full items-center ">
            {/* 조회하기 영역 */}
            <div className="flex  justify-center items-center mt-5 w-full  px-5  flex-col   "> 
              <div className="flex flex-1 justify-start items-center h-[30px] mt-3 ">
                <div className="h-full flex justify-center  ">
                  <div className="relative pl-1  text-[#4A6D88] ">
                    <input type="search" name="serch" placeholder={(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[0]:""} className="
                    w-[300px] 2xl:w-[300px] xl:w-[300px] lg:w-[300px] md:w-[300px] sm:w-[300px]
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
                  
                </div>
              </div>
            </div>
           
            <div className="mt-5 flex justify-start items-center px-3 h-[30px]  border-[#4A6D88] text-xs font-bold py-1 rounded text-[#4A6D88]
              w-[330px] 2xl:w-[1050px]  xl:w-[1050px]  lg:w-[790px]  md:w-[330px]  sm:w-[330px] 
              
              ">
              <div className="">
                {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[1]:""} {/* 전체 */}
                &nbsp;:&nbsp;&nbsp;&nbsp;{`${(userByTotal?.totalBooks)?userByTotal?.totalBooks:0} `}
                {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[0]:""} {/* 권 */}
                </div>
              <div className="ps-3 ">
                {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[2]:""} {/* 읽는중 */}
                &nbsp;:&nbsp;&nbsp;&nbsp;{`${(userByTotal?.inProgressBooks)?userByTotal?.inProgressBooks:0} `}
                {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[0]:""} {/* 권 */}
                </div>
              <div className="ps-3">
                {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[3]:""} {/* 읽는완료 */}
                &nbsp;:&nbsp;&nbsp;&nbsp;{`${(userByTotal?.completedBooks)?userByTotal?.completedBooks:0} `}
                {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[0]:""} {/* 권 */}
              </div>
            </div>
            
            <div className=" flex flex-wrap   
            w-full 2xl:w-[1050px]  xl:w-[1050px]  lg:w-[790px]  md:w-[530px]  sm:w-[530px]
            justify-center 2xl:justify-start  xl:justify-start  lg:justify-start  md:justify-center  sm:justify-center
            ">
              {
                bookList?.map((elem, index)=>{
                  return(
                    <div key={index} className="flex shadow-2xl mt-3
                    w-[330px] mx-2 h-[150px] 
                    ">
                      <div className="flex w-[100px] h-[150px] "> {/* 책이미지 */}
                        <div className="relative left-0 -z-20 w-[100%] ">
                          <div className='absolute w-full h-[150px]  '>  
                            <Image
                              src={
                                (elem.images[0].cover)?elem.images[0].cover:elem.images[0].medium_cover
                              }
                              alt=""
                              quality={50} 
                              layout="fill" 
                              priority
                              />
                          </div>
                          <div className="absolute text-[10px] bottom-1 left-1">
                            {
                              (!elem.readcompletedt)?
                              <p className=" rounded-lg px-1 py-0.5 
                              text-white
                              bg-[#3f9c90]
                              ">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[1]:""}</p>
                              :
                              <p className=" rounded-lg px-1 py-0.5 
                              text-white
                              bg-[#4A6D88]
                              ">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[2]:""}</p> 
                              
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-1 ">
                        <div className="w-full px-3 pt-1 overflow-x-hidden">
                          <div className="font-bold text-xs w-full h-[50px] overflow-x-hidden">{elem.book_title}</div>
                          <div className="pt-1 text-xs border-t border-t-[#4A6D88]">
                            {/* 정보-읽기완료 여부, 읽기시작일자, 저장한 단어수, 저장한 문장 수, 책읽기 이동 */}
                            <div>
                              {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[4]:""} {/* 읽기 시작일자 */}
                              
                               : 
                               <span className="font-bold ps-1">
                                {getDateContraction2(elem.readingdt)}
                               </span>
                               
                            </div>
                            <div>
                              {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[5]:""} {/* 저장한 단어수 */}
                               : 
                               <span className="font-bold ps-1">{elem.saved_word_cnt}</span>
                               
                            </div>
                            <div>
                              {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[6]:""} {/* 저장한 문장 수  */}
                              : <span className="font-bold ps-1">{elem.saved_sentence_cnt}</span>
                            </div>
                            
                            <div className="h-[25px] flex justify-start items-center  text-xs mt-4  ">
                            
                              <p className="">  {/* 단어보기  */}
                                <ButtonHisBookList text={
                                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[7]:""
                                }
                                onClick={()=>bookSavedWordClick(elem.book_seq)}
                                />
                              </p>
                              <p className="ms-2"> {/* 문장보기  */}
                                <ButtonHisBookList text={
                                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[8]:""
                                }
                                onClick={()=>bookSavedSentenceClick(elem.book_seq)}
                                />
                              </p>
                              <p className="ms-2"> {/* 읽기  */}
                                <ButtonHisBookList text={
                                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[9]:""
                                }
                                onClick={()=>readPage(elem.book_seq)}
                                /> 
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              
            </div>
          
            <div className="flex flex-wrap justify-end mt-5
            w-[330px] 2xl:w-[1050px]  xl:w-[1050px]  lg:w-[600px]  md:w-[330px]  sm:w-[330px]
            ">
              <p> {/* 다음  */}
                <ButtonHisBookListNext text={
                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                }
                onClick={()=>nextUserBookListSearch()}  
                />
              </p>
            </div>
          </div>


        :(currentPage===1)? //단어
        <div className=" w-full 2xl:w-[800px]  xl:w-[800px]  lg:w-[800px]  md:w-[600px]  sm:w-full px-1 ">
          <div  className="flex shadow-md mt-3 w-full h-[150px] 
            ">
            <div className="flex w-[100px] h-[150px] "> {/* 책이미지 */}
              <div className="relative left-0 -z-20 w-[100%] ">
                <div className='absolute w-full h-[150px]  '>  
                  <Image
                    src={
                      (selectedBook?.images[0].cover)?selectedBook.images[0].cover:
                      (selectedBook?.images[0].medium_cover)?selectedBook?.images[0].medium_cover:""
                    }
                    alt=""
                    quality={50} 
                    layout="fill" 
                    priority
                    />
                </div>
                <div className="absolute text-[10px] bottom-1 left-1">
                  {
                    (!selectedBook?.readcompletedt)?
                    <p className=" rounded-lg px-1 py-0.5 
                    text-white
                    bg-[#3f9c90]
                    ">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[1]:""}</p>
                    :
                    <p className=" rounded-lg px-1 py-0.5 
                    text-white
                    bg-[#4A6D88]
                    ">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[2]:""}</p> 
                    
                  }
                </div>
              </div>
            </div>
            
            <div className="flex flex-1 ">
              <div className="w-full px-3 pt-1 overflow-x-hidden">
                <div className="font-bold text-xs w-full h-[50px] overflow-x-hidden">{selectedBook?.book_title}</div>
                <div className="pt-1 text-xs border-t border-t-[#4A6D88]">
                  {/* 정보-읽기완료 여부, 읽기시작일자, 저장한 단어수, 저장한 문장 수, 책읽기 이동 */}
                  <div>
                    {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[4]:""} {/* 읽기 시작일자 */}
                     : {(selectedBook?.readingdt)?
                    <span className="font-bold ps-1">
                      {getDateContraction2(selectedBook?.readingdt)}
                    </span>
                    :""
                    }
                  </div>
                  <div>
                    {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[5]:""} {/* 저장한 단어 수*/}
                     : <span className="font-bold ps-1">{selectedBook?.saved_word_cnt}</span>
                     
                  </div>
                  <div>
                    {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[6]:""} {/* 저장한 문장 수 */}
                     : <span className="font-bold ps-1">{selectedBook?.saved_sentence_cnt}</span>
                  </div>
                  
                  <div className="h-[25px] flex justify-start items-center  text-xs mt-4  ">
                  
                    <p className=""> {/* 단어보기  */}
                      <ButtonHisBookList text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[7]:""
                      } disabled={true} disabledText={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[7]:""
                      }
                      />
                    </p>
                    <p className="ms-2"> {/* 문장보기  */}
                      <ButtonHisBookList text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[8]:""
                      }
                      onClick={()=>bookSavedSentenceClick(selectedBook?.book_seq)}
                      />
                    </p>
                    <p className="ms-2"> {/* 읽기  */}
                      <ButtonHisBookList text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[9]:""
                      }
                      onClick={()=>readPage(selectedBook?.book_seq)}
                      />
                    </p>
                    <p className="ms-2"> {/* 뒤로가기  */}
                      <ButtonHisBookList text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[11]:""
                      }
                      onClick={()=>bookListMove()}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <div className="flex flex-row text-xs mt-8">
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

          <div className=" pt-8"> {/* 저장한 단어 리스트 */}
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
                      <div className="flex items-center justify-end w-full font-light">{getDateContraction2(elem.learningdt)}
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
          <div className="flex justify-end text-xs mt-5">
            <p>
              <ButtonHisBookListNext /* 다음 */
                text={
                (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
              }
              onClick={()=>nextSelectedBookWord(selectedBook?.book_seq)}  
              />
            </p>
          </div>
        </div>
        :(currentPage===2)? //문장
        <div className=" w-full 2xl:w-[800px]  xl:w-[800px]  lg:w-[800px]  md:w-[600px]  sm:w-full px-1 ">
          <div  className="flex shadow-md mt-3 w-full h-[150px] ">
            <div className="flex w-[100px] h-[150px] "> {/* 책이미지 */}
              <div className="relative left-0 -z-20 w-[100%] ">
                <div className='absolute w-full h-[150px]  '>  
                  <Image
                    src={
                      (selectedBook?.images[0].cover)?selectedBook.images[0].cover:
                      (selectedBook?.images[0].medium_cover)?selectedBook?.images[0].medium_cover:""
                    }
                    alt=""
                    quality={50} 
                    layout="fill" 
                    priority
                    />
                </div>
                <div className="absolute text-[10px] bottom-1 left-1">
                  {
                    (!selectedBook?.readcompletedt)?
                    <p className=" rounded-lg px-1 py-0.5 
                    text-white
                    bg-[#3f9c90]
                    ">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[1]:""}</p>
                    :
                    <p className=" rounded-lg px-1 py-0.5 
                    text-white
                    bg-[#4A6D88]
                    ">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[2]:""}</p> 
                    
                  }
                </div>
              </div>
            </div>
            
            <div className="flex flex-1 ">
              <div className="w-full px-3 pt-1 overflow-x-hidden">
                <div className="font-bold text-xs w-full h-[50px] overflow-x-hidden">{selectedBook?.book_title}</div>
                <div className="pt-1 text-xs border-t border-t-[#4A6D88]">
                  {/* 정보-읽기완료 여부, 읽기시작일자, 저장한 단어수, 저장한 문장 수, 책읽기 이동 */}
                  <div>
                    {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[4]:""} {/* 읽기 시작일자 */}
                     : {
                    (selectedBook?.readingdt)?
                    <span className="font-bold">{getDateContraction2(selectedBook?.readingdt)}</span>
                    :""
                    }
                  </div>
                  <div>
                    {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[5]:""} {/* 저장한 단어 수 */}
                     : <span className="font-bold ps-1">{selectedBook?.saved_word_cnt}</span>
                  </div>
                  <div>
                    {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[6]:""} {/* 저장한 문장 수 */}
                     : <span className="font-bold ps-1">{selectedBook?.saved_sentence_cnt}</span>
                  </div>
                  
                  <div className="h-[25px] flex justify-start items-center  text-xs mt-4  ">
                  
                    <p className=""> {/* 단어보기 */}
                      <ButtonHisBookList text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[7]:""
                      }
                      onClick={()=>bookSavedWordClick(selectedBook?.book_seq)}
                      />
                    </p>
                    <p className="ms-2"> {/* 문장보기 */}
                      <ButtonHisBookList text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[8]:""
                      } disabled={true} disabledText={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[8]:""
                      }
                      />
                    </p>
                    <p className="ms-2"> {/* 읽기 */}
                      <ButtonHisBookList text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[9]:""
                      }
                      onClick={()=>readPage(selectedBook?.book_seq)}
                      />
                    </p>
                    <p className="ms-2"> {/* 뒤로가기 */}
                      <ButtonHisBookList text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[11]:""
                      }
                      onClick={()=>bookListMove()}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-row text-xs mt-8">
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
            sentenceListList.map((elem, index)=>{
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

                      <div className=""
                    
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
        <div className="flex justify-end text-xs mt-10  ">
          <p>
            <ButtonHisBookListNext text={
              (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
            }
            onClick={()=>nextBookSavedSentenceListSearch(selectedBook?.book_seq)}  
            />
          </p>
        </div>
        
        
        </div>
        :""

        
      }
      
      
    </div>
  );
};

export default ReadBookList