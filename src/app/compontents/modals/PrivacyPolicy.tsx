

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
import { MdClose } from "react-icons/md";
import { LuDot } from "react-icons/lu";



const PrivacyPolicy = (props:any) => {
  const router = useRouter();
  const languageStateSet = languageState();
  
  //바디 스크롤 없애기
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 언마운트 시 스크롤 복구 (클린업 함수)
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(()=>{
    if(props.show){ //화면 시작
      setIsOpen(true); 
    }
  },[props.show])


  // const bookInfo = props.bookInfoInPortal;

  function close(){
    setIsOpen(false);
    props.setShowPrivacyPolicy(false);
  }

  

  return (
    <Portal
      selector="portal"
      show={props.show}>
      <div className="static ">
        <div className='  fixed top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center backdrop-blur-xs backdrop-brightness-80  '>

          <div className="w-[90%] max-w-[650px] max-h-[450px]  rounded-[12px]
          bg-white px-8 pt-8 pb-10 flex flex-col justify-start items-center 
          ">
            <div className="w-full flex justify-between  text-[#4A6D88] font-bold text-[20px] ">
                <div className=" flex items-end">Privacy Policy (개인정보 처리방침)</div>
                <div className=" flex items-center text-[25px] cursor-pointer
                transition-transform duration-300 ease-in-out hover:scale-110 transform 
                "
                onClick={()=>close()}
                ><MdClose /></div>
            </div>
            <div className="border-t border-[#4A6D88] w-full border-b-[1.6px] rounded-full mt-2"></div>
            <div className="flex flex-col overflow-y-auto">
              <div className="w-full  mt-5 mb-5 text-[17px] font-bold">
                1. 수집하는 항목
              </div>
              <div className="w-full text-[#666] text-[13px]">
                이메일, 학습 진도, 저장한 단어/문장, 커뮤니티 게시글 및 쪽지 송수신 기록을 수집합니다.
              </div>

              <div className="w-full  mt-5 mb-5 text-[17px] font-bold">
                2. 수집 목적
              </div>
              <div className="w-full text-[#666] text-[13px]">
                개인 맞춤형 학습 관리, 퀴즈 제공 및 커뮤니티 서비스 운영을 위해 사용됩니다.
              </div>

              <div className="w-full  mt-5 mb-5 text-[17px] font-bold">
                3. 데이터 보관 및 삭제
              </div>
              <div className="w-full text-[#666] text-[13px]">
                데이터는 Firebase 및 MongoDB에 안전하게 보관되며, 탈퇴 시 개인정보는 즉시 삭제됩니다. (단, 커뮤니티 게시물은 직접 삭제 후 탈퇴를 권장합니다.)
              </div>
            </div>
            

          </div>

        </div>
        
      </div>  
       
    </Portal>
  );
}

export default PrivacyPolicy;



