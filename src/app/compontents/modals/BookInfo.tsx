

import { useEffect, useRef, useState } from "react";
import Portal from "./Portal";
import { FaRegWindowClose } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn, } from "next-auth/react";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transaction } from "@/app/utils/axios";
import errorScreenShow from "@/app/store/errorScreen";
import { storeAccessToken } from "@/app/utils/common";
import userState from "@/app/store/user";
import languageState from "@/app/store/language";
import { checkEmail } from "@/app/utils/checkUserValidation";
import Image from "next/legacy/image";
import { ButtonHisBookList } from "../design/buttons/Buttons";
import { useRouter } from "next/navigation";


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

const BookInfo = (props:any) => {
   const router = useRouter();
  const languageStateSet = languageState();
  
  //책정보
  // const [bookInfoInPortal, setBookInfoInPortal] = useState<wordItf>(props.bookInfoInPortal);

  const bookInfo = props.bookInfoInPortal;

  function close(){
    props.setShowBookInfo(false);
  }

  //해당 책 읽기
  function readPage(seq:any){
    router.push('/readings/'+ seq);
  }
  

  return (
    <Portal
      selector="portal"
      show={props.show}>
      <div className="static ">
        <div className='  fixed top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center   '>

          {/* <div className="border h-[350px] w-[250px]">
            <div onClick={()=>close()}>닫기</div>
          </div> */}

          <div className=" w-[250px] h-[360px] shadow-md shadow-[#4A6D88] rounded-b-md cursor-pointer m-5
          bg-white border
          "
          // onClick={()=>bookDetailPage(elem.book_seq)}
          >
            {/* <div className="flex justify-end">
              <div onClick={()=>close()}>
                <FaRegWindowClose />
              </div>
            </div> */}
            <div className="">
              <div className="relative left-0 w-[100%] ">
                <div className='absolute w-full h-[280px]  '>  
                  <Image
                    src={
                      (bookInfo)?
                      (bookInfo.images[0].cover)?bookInfo.images[0].cover:bookInfo.images[0].medium_cover
                      :""
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
            <div className="mt-[280px] p-1  flex justify-center items-center
            ">
              <p className=" line-clamp-2 text-center font-bold text-[12px] h-[38px]">
                {
                  (bookInfo)?bookInfo.book_title+bookInfo.book_title+bookInfo.book_title:""
                }
              </p>
            </div> 
            <div className="flex justify-center">
              <p className="ms-2"> {/* 읽기  */}
                <ButtonHisBookList text={
                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[9]:""
                }
                onClick={()=>readPage(bookInfo.book_seq)}
                /> 
              </p>
              <p className="ms-2"> {/* 닫기  */}
                <ButtonHisBookList text={
                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[16]:""
                }
                onClick={()=>close()}
                /> 
              </p>
            </div>
            
          </div>

        </div>
        
      </div>  
       
    </Portal>
  );
}

export default BookInfo;



