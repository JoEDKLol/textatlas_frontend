

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



const TermsOfService = (props:any) => {
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
    props.setShowTermsOfService(false);
  }

  

  return (
    <Portal
      selector="portal"
      show={props.show}>
      <div className="static ">
        <div className='  fixed top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center backdrop-blur-xs backdrop-brightness-80 '>

          <div className="w-[90%] max-w-[650px] max-h-[450px]  rounded-[12px]
          bg-white px-8 pt-8 pb-10 flex flex-col justify-start items-center 
          ">
            <div className="w-full flex justify-between  text-[#4A6D88] font-bold text-[20px] ">
                <div className=" flex items-end">Terms of Service (이용약관)</div>
                <div className=" flex items-center text-[25px] cursor-pointer
                transition-transform duration-300 ease-in-out hover:scale-110 transform 
                "
                onClick={()=>close()}
                ><MdClose /></div>
            </div>
            <div className="border-t border-[#4A6D88] w-full border-b-[1.6px] rounded-full mt-2"></div>
            <div className="flex flex-col overflow-y-auto">
              <div className="w-full  mt-5 mb-5 text-[17px] font-bold">
                1. 서비스 이용 규칙
              </div>
              <div className="w-full text-[#666] text-[13px]">
                TextArea는 고전 문학 읽기 및 학습 서비스를 제공합니다. 사용자는 타인에게 불쾌감을 주는 게시물 작성이나 시스템 악용을 해서는 안 됩니다.
              </div>

              <div className="w-full  mt-5 mb-5 text-[17px] font-bold">
                2. 커뮤니티 및 쪽지
              </div>
              <div className="w-full text-[#666] text-[13px]">
                <div className="ps-[20px]">
                  <li>욕설, 비방, 광고 게시물은 예고 없이 삭제될 수 있습니다.</li>
                  <li>쪽지 기능을 통한 스팸 전송 시 서비스 이용이 제한됩니다.</li>
                </div>
              </div>

              <div className="w-full  mt-5 mb-5 text-[17px] font-bold">
                3. 책임의 한계
              </div>
              <div className="w-full text-[#666] text-[13px]">
                사용자 간의 분쟁에 대해 서비스는 개입하지 않으며, AI 번역의 정확성에 대해 법적 보장을 하지 않습니다.
              </div>
            </div>
            

          </div>

        </div>
        
      </div>  
       
    </Portal>
  );
}

export default TermsOfService;



