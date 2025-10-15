'use client';
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transaction } from "@/app/utils/axios";
import Image from 'next/legacy/image'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuDot } from "react-icons/lu";

interface imagesItf {
  medium_cover:string
  cover:string
}

interface pageItf {
  page:string
  contentarr:[]
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
}

const Main = (props:any) => {
  const router = useRouter();
  const languageStateSet = languageState();  
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  const path = usePathname();
  const book_seq = path.split("/")[2];

  const [bookDetail, setBookDetail] = useState<bookItf | undefined>();
  
  useEffect(() => {
    // console.log(path.split("/")[2]);
    bookDetailSearch();
  }, []);

  async function bookDetailSearch(){
    const obj = {
      book_seq:book_seq
    }

    const retObj = await transaction("get", "book/bookdetail", obj, "", false, true, screenShow, errorShow); 
    // console.log(retObj);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      setBookDetail(retObj.sendObj.resObj);
    }   
  }




  // function bookDetailPage(seq:number){
  //   router.push('/readings/'+ seq);
  // }

  function readPage(seq:any){
    router.push('/readings/'+ seq + "/read");
  }

  return(
    <>
      <div className="h-[55px] w-full "></div> {/* 상단 헤더 만큼 아래로 */}
      <div className="h-full flex flex-col justify-center mt-10   ">

        <div className="mx-10 text-center  flex justify-center ">
          <p className="font-bold text-lg border-b-2 pb-2 ">
            <span className="">{bookDetail?.title}</span>
            
          </p>
          
          
        </div>
        <div className="mt-5 mx-10 flex flex-col justify-center items-center 
        2xl:flex-row  xl:flex-row lg:flex-row  md:flex-col  sm:flex-col
        ">
          

          <div className="  shadow-md shadow-[#4A6D88] rounded-b-md m-5
            w-[280px] 
            "
            // onClick={()=>bookDetailPage(elem.book_seq)}
          >
            <div className="">
              <div className="relative left-0 -z-20 w-[100%] ">
                <div className='absolute w-full h-[360px]  '>  
                  {
                    (bookDetail?.images[0].cover)?
                    // bookDetail?.images[0].cover
                    <Image
                    src={
                      bookDetail?.images[0].cover
                    }
                    alt=""
                    quality={50} 
                    layout="fill" 
                    sizes="100vw"
                    priority
                    />
                    :(bookDetail?.images[0].medium_cover)?
                    <Image
                    src={
                      bookDetail?.images[0].medium_cover
                    }
                    alt=""
                    quality={50} 
                    layout="fill" 
                    sizes="100vw"
                    priority
                    />
                    :<p className="bg-gray-50 h-full flex justify-center items-center text-gray-400 font-bold text-lg">
                      Image not found
                    </p>
                  }
                </div>
              </div>
            </div>
            <div className="mt-[310px] p-1 h-[50px] flex justify-center items-center
            ">
            </div> 
          </div>
          <div className="w-[280px] 
          2xl:w-[350px]  xl:w-[350px] lg:w-[320px]  md:w-[280px]  sm:w-[280px]
          
          my-5 flex flex-col   ">
            <div className="font-bold">{bookDetail?.book_title}</div>
            <div className="mt-5">{bookDetail?.author.name}</div>

            <div className="mt-5">
              <p className="mb-2">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[6].text[0]:""}</p> 
              {
                bookDetail?.subjects.map((elem,index)=>{
                  return(
                    <p key={index} className="text-xs ms-2 flex items-center"><LuDot/>{elem}</p>
                  )
                })
              }
              
              
            </div>

            <div className="mt-5">
              <p className="mb-2">{(languageStateSet.main_language_set[4])?languageStateSet.main_language_set[6].text[1]:""}</p>
              <p className="text-xs 
              hover:text-blue-500
              text-gray-400
              transition-all duration-200 ease-in-out 
              cursor-pointer inline-block
              ">
                 <Link href={(bookDetail?.source)?bookDetail?.source:""} target="_blank" rel="noopener noreferrer">
                    <span className="">{(bookDetail?.source)?bookDetail?.source:""}</span>
                </Link>
              
              </p>
            </div>



          </div>


        </div>
        
        <div className="m-7 text-center  flex justify-center ">
          <button className="border border-[#4A6D88] w-[80px] text-[14px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold py-1 px-4 rounded
          transition-all duration-200 ease-in-out cursor-pointer
          "
          onClick={()=>readPage(bookDetail?.book_seq)}
          >
            {/* {languageStateSet.main_language_set[1].text[0]} */}
            {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[6].text[2]:""}
          </button>
        </div>
        
        
        
        {/* 책내용 상세 보기 */}
        {/* <div className=" flex flex-wrap justify-start 
        w-[280px] 2xl:w-[800px]  xl:w-[800px]  lg:w-[800px]  md:w-[500px]  sm:w-[500px]
        "> 
          
          <pre className=" whitespace-pre-wrap ">
          
          {
            // (bookDetail.)?"":""
            // bookDetail?.pages
            // bookDetail?.pages.map((content)=>content.contentarr.map((content)=>content))
            bookDetail?.pages.map((content)=>content.contentarr.map((content)=>{
              return (
                <span className=" hover:bg-amber-100 ">{content}</span>
              )
            }))


          }
            
          </pre>
        </div> */}
        
      </div>
    </>
  );
};

export default Main