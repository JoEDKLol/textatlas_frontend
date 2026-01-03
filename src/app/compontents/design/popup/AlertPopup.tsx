
'use client';

// import alertPopupShow from "@/app/store/alertPopup";
import { FaRegCheckCircle } from "react-icons/fa";
// import { ButtonJoin } from "../buttonComponents/Button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import alertPopupShow from "@/app/store/alertPopup";

const AlertPopup = () => {
  const router = useRouter();
  const screenShow = alertPopupShow();
  const focusInput = useRef<HTMLInputElement>(null); 
  // const path = usePathname();
  
  useEffect(()=>{
    focusInput.current?.focus();

  },[screenShow])

  function close(){
    screenShow.messageSet("", "");
    screenShow.screenShowFalse();
  }

  // function moveCategoryPage(){
  //   router.push('/level');
  // }

  
  function handleKeyDown(e:any){
    if (e.key === 'Enter') {
      close();
    }
  }

  //포커스를 가제한다.
  function focusEventForce(){
    focusInput.current?.focus();
  }

  return (

    (screenShow.screenShow)?(
      // <div className="">
        <div className=' backdrop-brightness-80 fixed top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center
        border-[#4A6D88] shadow-lg shadow-blue-900/50
        '
        onClick={()=>focusEventForce()}
        >
          <div className="  py-3 px-5 rounded-lg bg-white text-center w-[300px] h-[170px] shadow-lg border border-[#4A6D88] flex flex-col  "
          >
            <div className="w-full text-start text-[#4A6D88] font-bold text-lg "> 
              {screenShow.title}
            </div>
            <div className="text-start  text-sm h-[67px] overflow-hidden py-1  "> 
              {screenShow.content} 
            </div>
            <div className="flex justify-end pt-3"
            >
              {/* <button className="border rounded-md bg-[#33DD95] text-white px-2 py-1 text-sm
              transition delay-50 duration-300 ease-in-out hover:scale-115 cursor-pointer
              "
              onClick={()=>close()}
              >확인</button> */}

              <button className={` hover:bg-[#4A6D88] hover:text-white bg-white ms-1 border text-[11px] border-[#4A6D88] w-[70px] text-[#4A6D88] font-bold py-1 rounded 
                transition-all duration-200 ease-in-out cursor-pointer
                `}
                onClick={()=>close()} 
                >
                  닫기
              </button>

            </div>
            {/* 포커스를 강제로 주기 위함 */}
            <input ref={focusInput} className="w-0 h-0"
            onKeyDown={(e)=>handleKeyDown(e)}
            /> 
          </div>
        </div>
      // </div>  
    ):""
  );
}

export default AlertPopup;



