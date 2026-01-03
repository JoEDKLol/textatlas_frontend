'use client';
import bookState from "@/app/store/books";
import errorScreenShow from "@/app/store/errorScreen";
import loadingScreenShow from "@/app/store/loadingScreen";
import scrollPositon from "@/app/store/scrollPosition";
import { transaction } from "@/app/utils/axios";
// import Image from "next/image";
import Image from 'next/legacy/image'
import { useEffect, useRef, useState } from "react";
import { useInView } from 'react-intersection-observer';

import { IoIosSearch } from "react-icons/io"; //돋보기
import languageState from "@/app/store/language";
import searchTextState from "@/app/store/searchText";
import { usePathname, useRouter } from "next/navigation";
import userState from "@/app/store/user";
import { transactionAuth } from "@/app/utils/axiosAuth";

// interface imagesItf {
//   medium_cover:string
//   cover:string
// }

// interface bookItf {
//   _id:string
//   book_seq:number
//   book_id:number
//   title:string
//   book_title:string
//   images:[imagesItf]

// }

// interface bookListItf extends Array<bookItf>{}

let searchFrom = false;

const Main = (props:any) => {
 
  const router = useRouter();
  const userStateSet = props.userStateSet;

  const languageStateSet = languageState();  
  const searchTextStor = searchTextState();

  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  //책조회리스트를 전역에 저장
  const bookStateSet = bookState();

  //스크롤위치를 전역에 저장
  const scrollPositonStateSet = scrollPositon();

  //검색어 변경 여부저장
  const [changedSearchText, setChangedSearchText] = useState<boolean>(false);

  //스크롤 하단으로 이동시 조회 처리
  const [ref, inView] = useInView({
    triggerOnce: false, // 한 번만 트리거
  });

  //화면 실행 여부
  const [firstSearch, setFirstSearch] = useState<boolean>(false);

  useEffect(() => {
    if (inView) {
      if(firstSearch){ //최초에 실행 안됨
        if(!searchFrom){
          readingsTotalSearch();
        } 
      }
    }
  }, [inView]);


  useEffect(() => {

    firstReadingsTotalSearch();

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

    
  }, []); // 빈 배열은 마운트/언마운트 시에만 실행

  //책리스트가 변경되면 사용자별 책 히스토리를 조회한다. 읽는중, 읽기완료 를 표시하기 위해서임
  //책리스트가 변경된 만큼만 조회할수 있도록 처리 해야됨. 기존에 10에서 20개로 변경되면 변경된 10개분만 조회 되도록 처리 필요
  let userbyreadhistorySearchYn =false;
  useEffect(() => { //로그인을 하는 경우 처리
    
    if(bookStateSet.bookList.length > 0){
      if(userStateSet.userseq > 0){
        userbyreadhistorySearch();
      }
    }
  }, [userStateSet.userseq]);

  useEffect(() => {
      
    if(bookStateSet.bookList.length > 0){
      if(userStateSet.userseq > 0){
        userbyreadhistorySearch();
      }
    }
  }, [bookStateSet.bookList]);

  async function userbyreadhistorySearch(){

    if(userbyreadhistorySearchYn){ //사용자 로그인 후 조회와 책리스트 변경시 조회 중복을 피하기 위해 처리
      return;
    }else{
      userbyreadhistorySearchYn = true;
    }

    let bookSeqList = [];
    for(let i=0; i<bookStateSet.bookList.length; i++){
      bookSeqList.push(bookStateSet.bookList[i].book_seq);
    }

    const obj = {
      book_seq_list:bookSeqList,
      userseq:userStateSet.userseq,
    }

    
    const retObj = await transactionAuth("post", "reading/readhissearch", obj, "", false, false, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj);
      if(retObj.sendObj.resObj.length > 0){
        const hisArr = retObj.sendObj.resObj; 
        for(let i=0; i<hisArr.length; i++){
          

          const indexBook = bookStateSet.bookList.findIndex((val) => val.book_seq === hisArr[i].book_seq);
          // console.log(bookStateSet.bookList[indexBook]);
          if(hisArr[i].readcompletedt){ //읽기 완료
            bookStateSet.bookList[indexBook].readYn = "F"; //읽기 완료
          }else{
            bookStateSet.bookList[indexBook].readYn = "I"; //읽는 중
          }
          
          bookStateSet.bookListSet(bookStateSet.bookList);
        }

      }

    }

    userbyreadhistorySearchYn = false;
  }



  //최초조회
  async function firstReadingsTotalSearch(){
    
    if(searchTextStor.firstSearchYn){
      setFirstSearch(true);
      return;
    }

    const obj = {
      currentPage:searchTextStor.currentPage+1,
      keyword:searchTextStor.text,
    }

    if(changedSearchText){
      bookStateSet.bookListSet([]);
      obj.currentPage = 1;
    }

    const retObj = await transaction("get", "book/booksearch", obj, "", false, true, screenShow, errorShow);
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      
      if(retObj.sendObj.resObj.books.length > 0){
        if(changedSearchText){
          // setCurrentPage(1);
          searchTextStor.currentPagePageSet(1);
        }else{
          // setCurrentPage(currentPage+1);
          searchTextStor.currentPagePageSet(searchTextStor.currentPage+1);
        }
        
        bookStateSet.bookListAdd(retObj.sendObj.resObj.books);
      }
      
      setChangedSearchText(false);
      setFirstSearch(true);
      searchTextStor.firstSearchYnSet(true);
    }   
  }

  async function readingsTotalSearch(){
    const obj = {
      // currentPage:currentPage+1,
      currentPage:searchTextStor.currentPage+1,
      keyword:searchTextStor.text,
    }

    if(changedSearchText){
      bookStateSet.bookListSet([]);
      obj.currentPage = 1;
    }

    const retObj = await transaction("get", "book/booksearch", obj, "", false, true, screenShow, errorShow); 
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.books.length > 0){
        if(changedSearchText){
          // setCurrentPage(1);
          searchTextStor.currentPagePageSet(1);
        }else{
          // setCurrentPage(currentPage+1);
          searchTextStor.currentPagePageSet(searchTextStor.currentPage+1);
        }
        
        bookStateSet.bookListAdd(retObj.sendObj.resObj.books);
      }
      
      setChangedSearchText(false);
      setFirstSearch(true);
    }   
  }

  async function readingsFromSearch(){

    bookStateSet.bookListSet([]);
    searchFrom = true; //검색창에서 조회

    const obj = {
      currentPage:1,
      keyword:searchTextStor.text,
      
    }

    const retObj = await transaction("get", "book/booksearch", obj, "", false, true, screenShow, errorShow);
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){

      if(retObj.sendObj.resObj.books.length > 0){
        // setCurrentPage(1);
        searchTextStor.currentPagePageSet(1);
        bookStateSet.bookListAdd(retObj.sendObj.resObj.books);
      }
      
      searchFrom = false;
      // console.log("searchFrom::" + searchFrom);
      setChangedSearchText(false);
      
    }
    
  }

  //검색

  function searchTextOnKeyDownHandler(e:any){
    if(e.key === 'Enter') {
      readingsFromSearch();
    }
  }

  function search(){
    readingsFromSearch();
  }

  function searchTextOnChangeHandler(e:any){
    // setSearchText(e.target.value);
    setChangedSearchText(true);
    searchTextStor.textSet(e.target.value);
  }

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < searchTextStor.text.length; i++) {
      const currentByte = searchTextStor.text.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 40){
        searchTextStor.textSet(searchTextStor.text.substring(0, i));
        break;
      }
    }
  },[searchTextStor.text]);

  //책 상세 페이지 이동
  function bookDetailPage(seq:number){
    router.push('/readings/'+ seq);
  }

  return(
    <>
    <div className="">
      <div className="h-[55px] w-full"></div> {/* 상단 헤더 만큼 아래로 */}
      <div className="h-full flex justify-center mt-10  ">
        <div className="relative pl-1  text-[#4A6D88] ">
          <input type="search" name="serch" placeholder={(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[4].text[0]:""} className="w-[300px] 
          2xl:w-[300px] xl:w-[300px] lg:w-[300px] md:w-[300px] sm:w-[300px]
          border border-[#4A6D88] bg-white h-10 px-3 pr-6 rounded text-sm focus:outline-none"
          onChange={(e)=>searchTextOnChangeHandler(e)}
          onKeyDown={(e)=>searchTextOnKeyDownHandler(e)}
          value={searchTextStor.text}
          />
          <button className="absolute right-0 top-0 mt-3 mr-2 text-[#4A6D88] cursor-pointer
          transition-transform duration-300 ease-in-out
          hover:scale-110 transform inline-block
          "
          onClick={(e)=>search()}
          >
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
            </svg>
          </button>
        </div>
        
      </div>
      <div className="h-full flex justify-center mt-5   ">
        
        <div className=" flex flex-wrap justify-start 
        w-[240px] 2xl:w-[1310px]  xl:w-[1050px]  lg:w-[790px]  md:w-[530px]  sm:w-[530px]
        "> 

          {
            bookStateSet.bookList.map((elem, index)=>{
              return (
                <div key={index + elem._id} className=" w-[220px] h-[390px] shadow-md shadow-[#4A6D88] rounded-b-md cursor-pointer m-5
                transition-transform duration-300 ease-in-out
                hover:scale-105 transform
                "
                onClick={()=>bookDetailPage(elem.book_seq)}
                >
                  <div className="">
                    <div className="relative left-0 -z-20 w-[100%] ">
                      <div className='absolute w-full h-[310px]  '>  
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
                  <div className="mt-[310px] p-1 h-[50px] flex justify-center items-center
                  ">
                    <p className=" line-clamp-2 text-center font-bold text-[12px]">
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
      </div>
    </div>
    <div ref={ref}></div>
    </>
  );
};

export default Main