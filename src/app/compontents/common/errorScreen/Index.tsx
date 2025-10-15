
'use client';

import errorScreenShow from "@/app/store/errorScreen";
import { FaRegWindowClose } from "react-icons/fa";

const ErrorScreen = () => {
  
  const screenShow = errorScreenShow();

  function close(){
    screenShow.screenShowFalse();
  }
  
  return (

    (screenShow.screenShow)?(
      <div className="">
        <div className=' fixed top-0 right-0 left-0 z-50 w-[100%] h-[100%] border flex justify-center items-center'>
          <div className={ "  w-[300px] h-[170px] border rounded-md border-[#4A6D88] shadow-lg shadow-blue-900/50 bg-white  "}>
            <div className="flex justify-end h-[16%] bg-[#4A6D88] ">
              <p className="mr-2 text-lg mt-1 text-white  cursor-pointer "
              onClick={()=>close()}
              >
                <FaRegWindowClose />
              </p>
            </div>
            <div className=" mx-2 my-2 h-[45%] ">
              <p className="break-words w-[100%] text-black text-sm font-bold">
              오류
              </p>
              <p className="break-words w-[100%]  text-black text-sm ">
              {screenShow.message} 
              </p>
            </div>
            <div className="flex justify-end mr-5  h-[20%]  ">
              <p className="">
                <button className={` hover:bg-[#4A6D88] hover:text-white bg-white ms-1 border text-[11px] border-[#4A6D88] w-[70px] text-[#4A6D88] font-bold py-1 rounded 
                  transition-all duration-200 ease-in-out cursor-pointer
                  `}
                  onClick={()=>close()} 
                  >
                    닫기
                </button>
              </p>
            </div>
          </div>
          
        </div>
      </div>  
    ):""
  );
}

export default ErrorScreen;



