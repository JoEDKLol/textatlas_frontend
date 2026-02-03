// import TextAtlasLogo from "../design/logo/TextAtlasLogo";

import { useEffect, useRef, useState } from "react";
import { HomeHeaderMenuButton, HomeHeaderMenuButtonL, HomeHeaderSignInButton, HomeHeaderSignInButtonL } from "../design/buttons/Buttons";
import { RxTextAlignJustify } from "react-icons/rx";
import Link from "next/link";
import languageState from "@/app/store/language";
import SignIn from "../modals/SignIn";
import SignUp from "../modals/SignUp";
import PasswordChange from "../modals/PasswordChange";
import userState from "@/app/store/user";
import { transaction } from "@/app/utils/axios";
import loadingScreenShow from "@/app/store/loadingScreen";
import errorScreenShow from "@/app/store/errorScreen";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdMessage } from "react-icons/md";
import MessageBox from "../modals/MessageBox";
import { transactionAuth } from "@/app/utils/axiosAuth";
import unreadMessageCnt from "@/app/store/unreadMessageCnt";


const HeaderLanding = () => {
  const router = useRouter();
  const path = usePathname();

  const userStateSet = userState();
  const unreadMessageCntSet = unreadMessageCnt();
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  const languageStateSet = languageState();
  const [showSigninPortal, setShowSigninPortal] = useState(false);
  const [showPasswordChangePortal, setShowPasswordChangePortal] = useState(false);
  const [showSignUpPortal, setShowSignUpPortal] = useState(false);
  const [signinYn, setSigninYn] = useState(false);

  //상단메뉴 클릭 여부
  const [homeYn, setHomeYn] = useState(false);
  const [readingsYn, setReadingsYn] = useState(false);
  const [communityYn, setCommunityYn] = useState(false);
  const [profileYn, setProfileYn] = useState(false);
  const [myInfoYn, setMyInfoYn] = useState(false);
 



  


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [block, setBlock] = useState<string>("  translate duration-300 h-[80px] ")
  // 햄버거 버튼 클릭 핸들러
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };




  useEffect(() => {

    if(isMobileMenuOpen){
      setBlock("  translate duration-200 h-[300px] ");
    }else{
      setBlock("  translate duration-200 h-[80px] ");
    }

  }, [isMobileMenuOpen]);

  const getBrowserLanguage = () => {
  if (typeof window === "undefined") return "en"; // 서버 사이드 렌더링(SSR) 대비

  // 1. 전체 문자열 가져와서 소문자화 (예: 'ko-KR' -> 'ko-kr')
  const fullLang = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  const mainLang = fullLang.toLowerCase();

  // 2. 포함 여부로 체크 (가장 안전한 방법)
  if (mainLang.includes("ko")) return "ko";
  if (mainLang.includes("es")) return "es";
  
  return "en"; // 기본값은 영어
};

  const [isOpen, setIsOpen] = useState(false) // 드롭다운이 열려 있는지 상태 관리
  const [selectedOption, setSelectedOption] = useState('') // 기본 선택 옵션

  useEffect(() => {
    let flagSt = "/flags/us.png";
    if(languageStateSet.current_language === "us"){
      flagSt = "/flags/us.png";
      languageStateSet.setMainLanguageSet(languageStateSet.text_by_language_us);
    }else if(languageStateSet.current_language=== "kr"){
      flagSt = "/flags/kr.png";
      languageStateSet.setMainLanguageSet(languageStateSet.text_by_language_kr);
    }else if(languageStateSet.current_language=== "mx"){
      flagSt = "/flags/mx.png";
      languageStateSet.setMainLanguageSet(languageStateSet.text_by_language_mx);
    }else{
      flagSt = "/flags/us.png";
      languageStateSet.setMainLanguageSet(languageStateSet.text_by_language_mx);
    } 
    setSelectedOption(flagSt);
    
  },[languageStateSet.current_language])

  const dropdownRef = useRef<HTMLDivElement>(null) // 드롭다운 외부 클릭 감지를 위한 ref

  const options = ['/flags/us.png', '/flags/kr.png', '/flags/mx.png'];

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev) // 드롭다운 열기/닫기
  }

  const selectOption = (option: string) => {
    setSelectedOption(option) // 옵션 선택
    setIsOpen(false) // 드롭다운 닫기
    
    //메인 언어셋 셋팅 - 
    let languageStr = "" 
    if(option === "/flags/us.png"){
      languageStr = "us";
    }else if(option === "/flags/kr.png"){
      languageStr = "kr";
    }else{
      languageStr = "mx";
    }
    languageStateSet.setCurrentLang(languageStr);
    localStorage.setItem('textAtlasLanguage', languageStr);
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, []);

  //바디 스크롤 없애기
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 언마운트 시 스크롤 복구 (클린업 함수)
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);



  function go_home(){
    router.push('/home');
  }

  
  return(
    <header className={block + ` fixed top-0 left-0 w-full z-30 bg-[#4A6D88] items-start 
    2xl:h-[80px]   xl:h-[80px]   lg:h-[80px] shadow-xs
    overflow-hidden
    `}
    

    >
      
      <div className="flex justify-center items-center w-full h-[80px]    ">
        {/* textArea logo */}
        <div className="flex px-10 w-full justify-between items-center">
          <div className=" flex flex-col justify-center items-center w-[140px] cursor-pointer "
          onClick={()=>go_home()}
          >
            <div className=" relative text-white w-full  justify-items-center pt-[8px] " >
              <p className="absolute -z-10 w-[32px] h-[32px] rounded-full bg-blue-400"></p>
              <p className="">
                <span className="text-[25px]">Text</span>
                <span className="font-bold text-[30px]">Atlas</span>
              </p>
            </div>
          </div>
        
          {/* 메뉴 */}
          <div className=" hidden 2xl:flex   xl:flex   lg:flex   md:hidden sm:hidden mt-[5px] w-full
             justify-center  items-center ms-3 me-3 font-bold  text-white  ">
            <div className="px-10 cursor-pointer ">
              <a href="#features" >Features</a>
              </div>
            <div className="px-10 cursor-pointer">
              <a href="#aboutus" >About Us</a>
            </div>
            <div className="px-10 cursor-pointer">
              Contact Us
            </div>
          </div>
        
        
        
        </div>
    

        <div className="flex-1 w-full  ">
          <div className=" 2xl:w-[60px] xl:w-[60px] lg:w-[60px] md:w-full sm:w-full w-full 
           pt-[2px] 
          ">
            <div
              ref={dropdownRef}
              className="relative flex cursor-pointer rounded-lg w-full   "
            >
              <div
                onClick={toggleDropdown}
                className="flex w-full cursor-pointer items-center justify-end   "
              >
                <p className="flex justify-center  w-[35px] h-[25px]">
                  {
                    (selectedOption)?<img src={selectedOption} className=""/>:""
                  }
                  
                </p>
              </div>

              {isOpen && (
                <div className="absolute flex justify-center items-center -top-[2px] right-10 rounded-lg w-[140px] bg-white py-1 shadow-md ">
                  {options.map((option, index) => (
                    <div 
                      key={index}
                      onClick={() => selectOption(option)}
                      className="cursor-pointer rounded-sm flex justify-center
                      hover:scale-120 w-full 
                      "
                    >
                      <img src={option} className="w-[70%] h-[70%]"/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className=" hidden 2xl:flex   xl:flex   lg:flex   md:hidden sm:hidden w-[120px] justify-end pe-5
        
        ">
            <button
            onClick={()=>go_home()}
            className="
            px-2 py-1              
            bg-[#FFD700]
            text-[#4A6D88]             
            rounded-md              
            font-semibold           
            hover:bg-[#FFC400]
            transition-all duration-200 ease-in-out 
            cursor-pointer inline-block
            text-[15px]
            " 
            >시작하기
            </button>
          
        </div>


        {/* CSS로 만든 세 개의 선 */}
        <div className=" flex 2xl:hidden   xl:hidden   lg:hidden   md:flex sm:flex mt-[3px] ms-2 me-5
        flex-1 justify-end  items-center 
        ">
         

          <div>
            <button
              onClick={toggleMobileMenu}
              className={`
                hamburger-button                 
                hamburger-button-appear          
                ${isMobileMenuOpen ? 'is-open' : ''} 
                text-white focus:outline-none    
              `}
              aria-label="Toggle mobile menu"
            >
              
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </button>

          </div>
        </div>

      </div>
      <div className="w-full px-10 flex-col 
      flex 2xl:hidden   xl:hidden   lg:hidden   md:flex sm:flex
      ">
        <div className="w-full flex justify-center text-white mt-1">
          <p className="px-10 h-[35px]">
              Features
          </p>
        </div>
        <div className="w-full flex justify-center text-white mt-1">
          <p className="px-10 h-[35px]">
              About Us
          </p>
        </div>
        <div className="w-full flex justify-center text-white mt-1">
          <p className="px-10 h-[35px]">
              Contact Us
          </p>
        </div>
        
        
        <div className="w-full flex justify-center text-white mt-7">
          <p className="">
            <button
            onClick={()=>go_home()}
            className="
            px-2 py-1              
            border-2 bg-[#FFD700]
            text-[#4A6D88]             
            rounded-md              
            font-semibold           
            hover:bg-[#FFC400]
            transition-all duration-200 ease-in-out 
            cursor-pointer inline-block
            text-[15px]
            " 
            >시작하기
            </button>
          </p>
        </div>
      </div>
      {/* <SignIn show={showSigninPortal} signInHandleModal={signInHandleModal} passwordChangeHandleModal={passwordChangeHandleModal} signUpHandleModal={signUpHandleModal} />
      <PasswordChange show={showPasswordChangePortal} signInHandleModal={signInHandleModal} passwordChangeHandleModal={passwordChangeHandleModal} signUpHandleModal={signUpHandleModal}/>
      <SignUp show={showSignUpPortal} signInHandleModal={signInHandleModal} passwordChangeHandleModal={passwordChangeHandleModal} signUpHandleModal={signUpHandleModal}/>
      <MessageBox show={showMessageBoxPortal} messageBoxModal={messageBoxModal} userStateSet={userStateSet} /> */}
      
    </header>
  );
};

export default HeaderLanding