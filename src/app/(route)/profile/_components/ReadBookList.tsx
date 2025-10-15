'use client';

import { ButtonHisBookList } from "@/app/compontents/design/buttons/Buttons";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { getDateContraction2 } from "@/app/utils/common";
import Image from 'next/legacy/image'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
}

interface bookListItf extends Array<bookItf>{}
// interface wordListItf extends Array<wordItf>{}
// interface sentenceListItf extends Array<sentenceItf>{}

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
  // const [wordList, setWordList] = useState<wordListItf>();
  // const [sentenceListList, setSentenceListList] = useState<sentenceListItf>();
  
  //단어보기 문장보기 해당 책의 전체책리스트:0 단어보기:1, 문장보기:2, 읽기(페이지이동)
  const [currentPage, setCurrentPage] = useState<number>(0);
  //선택한 책
  const [selectedBook, setSelectedBook] = useState<bookItf>();

  //토탈 책 정보 
  const [userByTotal, setUserByTotal] = useState<userByTotalItf>()
  //토탈 책 정보 조회유무
  const [userByTotalSearchYn, setUserByTotalSearchYn] = useState<boolean>(false);
  


  useEffect(() => {
    if(userStateSet.userseq > 0){
      userBookListSearch();
    }
    // console.log(userStateSet);

  }, []); // 빈 배열은 마운트/언마운트 시에만 실행

  //최초조회
  async function userBookListSearch(){ 
    // console.log(userStateSet);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1,
      // keyword:searchTextStor.text,
      userByTotalSearchYn:userByTotalSearchYn
    }

    // console.log(obj);

    const retObj = await transactionAuth("get", "history/booklistsearch", obj, "", false, true, screenShow, errorShow);
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      setBookList(retObj.sendObj.resObj.books);
      setUserByTotal(retObj.sendObj.resObj.userByTotal[0]);
      // console.log(retObj.sendObj.resObj.userByTotal);
      setUserByTotalSearchYn(true);
      // setWordList(retObj.sendObj.savedWords);
      // setSentenceListList(retObj.sendObj.savedSentences);

      // if(retObj.sendObj.resObj.books.length > 0){

      // }

      // const books = retObj.sendObj.resObj.books as any;
    }   
  }

  //해당 책의 저장한 단어리스트 보기
  function bookSavedWordClick(book_seq:any){
    // console.log(book_seq);
    // 
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

  //저장한 단어 리스트 조회
  async function bookSavedWordListSearch(book_seq:any){

    const obj = {
      userseq:userStateSet.userseq,
      book_seq: book_seq,
      currentPage:1,
    }

    // console.log(obj);

    const retObj = await transactionAuth("get", "history/booksavedwordsearch", obj, "", false, true, screenShow, errorShow);
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){
      console.log(retObj.sendObj);
    }   

  }
  
  //저장한 문장 리스트 조회
  async function bookSavedSentenceListSearch(book_seq:any){

    const obj = {
      userseq:userStateSet.userseq,
      book_seq: selectedBook?.book_seq,
      currentPage:1,
    }

    // console.log(obj);

    const retObj = await transactionAuth("get", "history/booksavedsentencesearch", obj, "", false, true, screenShow, errorShow);
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){
      console.log(retObj.sendObj);
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

  
  
  
  
  return(
      <div className="w-full">
      {
        (currentPage===0)?
          <div className="flex flex-col w-full items-center ">
            {/* 조회하기 영역 */}
            <div className="flex  justify-center items-center mt-5 w-full  px-5  flex-col  "> 
              <div className="flex flex-1 justify-start items-center h-[30px] mt-3 ">
                <div className="h-full flex justify-center  ">
                  <div className="relative pl-1  text-[#4A6D88] ">
                    <input type="search" name="serch" placeholder={(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[0]:""} className="
                    w-[300px] 2xl:w-[300px] xl:w-[300px] lg:w-[300px] md:w-[300px] sm:w-[300px]
                    border border-[#4A6D88] bg-white h-[30px] px-3 pr-6 rounded text-sm focus:outline-none"
                    // onChange={(e)=>searchTextOnChangeHandler(e)}
                    // onKeyDown={(e)=>searchTextOnKeyDownHandler(e)}
                    // value={searchTextStor.text}
                    />
                    <button className="absolute right-0 top-0 mt-[7px] mr-2 text-[#4A6D88] cursor-pointer
                    transition-transform duration-300 ease-in-out
                    hover:scale-110 transform inline-block
                    "
                    // onClick={(e)=>search()}
                    >
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                        <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                      </svg>
                    </button>
                  </div>
                  
                </div>
              </div>
            </div>
            {/* <div className="mt-5 w-full justify-start ps-2"> */}
            <div className="mt-5 flex justify-start items-center px-3 h-[30px]  border-[#4A6D88] text-xs font-bold py-1 rounded text-[#4A6D88]
              w-full
              ">
              <div className="">전체&nbsp;:&nbsp;&nbsp;&nbsp;{`${(userByTotal?.totalBooks)?userByTotal?.totalBooks:0} 권`}</div>
              <div className="ps-3 ">읽는중&nbsp;:&nbsp;&nbsp;&nbsp;{`${(userByTotal?.inProgressBooks)?userByTotal?.inProgressBooks:0} 권`}</div>
              <div className="ps-3">읽기완료&nbsp;:&nbsp;&nbsp;&nbsp;{`${(userByTotal?.completedBooks)?userByTotal?.completedBooks:0} 권`}</div>
            </div>
            {/* </div> */}
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
                              읽기 시작일자 : {getDateContraction2(elem.readingdt)}
                            </div>
                            <div>
                              저장한 단어 수 : {elem.saved_word_cnt}
                            </div>
                            <div>
                              저장한 문장 수 : {elem.saved_sentence_cnt}
                            </div>
                            
                            <div className="h-[25px] flex justify-start items-center  text-xs mt-4  ">
                            
                              <p className="">
                                <ButtonHisBookList text={"단어보기"}
                                onClick={()=>bookSavedWordClick(elem.book_seq)}
                                />
                              </p>
                              <p className="ms-2">
                                <ButtonHisBookList text={"문장보기"}
                                onClick={()=>bookSavedSentenceClick(elem.book_seq)}
                                />
                              </p>
                              <p className="ms-2">
                                <ButtonHisBookList text={"읽기"}
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
          
          
          
          </div>


        :(currentPage===1)? //단어
        <div className="w-full 2xl:w-[800px]  xl:w-[800px]  lg:w-[800px]  md:w-[600px]  sm:w-[400px]  ">
          {/* <div className="flex  justify-center items-center mt-5 w-full  px-5  ">  */}
            {/* {
              selectedBook?.book_title
            } */}
            <div  className="flex shadow-2xl mt-3 w-full h-[150px] 
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
                        읽기 시작일자 : {
                        (selectedBook?.readingdt)?
                        getDateContraction2(selectedBook?.readingdt)
                        :""
                        }
                      </div>
                      <div>
                        저장한 단어 수 : {selectedBook?.saved_word_cnt}
                      </div>
                      <div>
                        저장한 문장 수 : {selectedBook?.saved_sentence_cnt}
                      </div>
                      
                      <div className="h-[25px] flex justify-start items-center  text-xs mt-4  ">
                      
                        <p className="">
                          <ButtonHisBookList text={"단어보기"} disabled={true} disabledText={"단어보기"}
                          />
                        </p>
                        <p className="ms-2">
                          <ButtonHisBookList text={"문장보기"}
                          onClick={()=>bookSavedSentenceClick(selectedBook?.book_seq)}
                          />
                        </p>
                        <p className="ms-2">
                          <ButtonHisBookList text={"읽기"}
                          onClick={()=>readPage(selectedBook?.book_seq)}
                          />
                        </p>
                        <p className="ms-2">
                          <ButtonHisBookList text={"뒤로가기"}
                          onClick={()=>bookListMove()}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
          {/* </div> */}
        
        
        </div>
        :(currentPage===2)? //문장
        <div className="w-full 2xl:w-[800px]  xl:w-[800px]  lg:w-[800px]  md:w-[600px]  sm:w-[400px]  ">
          {/* <div className="flex  justify-center items-center mt-5 w-full  px-5  ">  */}
            {/* {
              selectedBook?.book_title
            } */}
            <div  className="flex shadow-2xl mt-3 w-full h-[150px] 
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
                        읽기 시작일자 : {
                        (selectedBook?.readingdt)?
                        getDateContraction2(selectedBook?.readingdt)
                        :""
                        }
                      </div>
                      <div>
                        저장한 단어 수 : {selectedBook?.saved_word_cnt}
                      </div>
                      <div>
                        저장한 문장 수 : {selectedBook?.saved_sentence_cnt}
                      </div>
                      
                      <div className="h-[25px] flex justify-start items-center  text-xs mt-4  ">
                      
                        <p className="">
                          <ButtonHisBookList text={"단어보기"}
                          onClick={()=>bookSavedWordClick(selectedBook?.book_seq)}
                          />
                        </p>
                        <p className="ms-2">
                          <ButtonHisBookList text={"문장보기"} disabled={true} disabledText={"문장보기"}
                          />
                        </p>
                        <p className="ms-2">
                          <ButtonHisBookList text={"읽기"}
                          onClick={()=>readPage(selectedBook?.book_seq)}
                          />
                        </p>
                        <p className="ms-2">
                          <ButtonHisBookList text={"뒤로가기"}
                          onClick={()=>bookListMove()}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
          {/* </div> */}
        
        
        </div>
        :""

        
      }
      
        
    </div>
  );
};

export default ReadBookList