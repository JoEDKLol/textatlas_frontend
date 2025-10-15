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


const Hearder = () => {
  const router = useRouter();
  const path = usePathname();

  const userStateSet = userState();
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
  

  useEffect(()=>{
    if(userStateSet.id){
      setSigninYn(true);
    }else{
      setSigninYn(false);
    }
  },[userStateSet]);

  //페이지이동시 토큰 검증
  useEffect(() => {

    setIsMobileMenuOpen(false);

    setHomeYn(false);
    setReadingsYn(false);
    setCommunityYn(false);
    setProfileYn(false);
    
    if(path === "/home"){
      setHomeYn(true);
    }else if(path === "/readings"){
      setReadingsYn(true);
    }else if(path === "/community"){
      setCommunityYn(true);
    }else if(path === "/profile"){
      setProfileYn(true);
    }

    

  }, [path]);

  //로그인 문구
  const [signinStr, setSigninStr] = useState("Login");
  const [logoutStr, setLogoutStr] = useState("Logout");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [block, setBlock] = useState<string>("  translate duration-300 h-[55px] ")
  // 햄버거 버튼 클릭 핸들러
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    let flagSt = "/flags/us.png";
    if(languageStateSet.current_language === "us"){
      flagSt = "/flags/us.png";
      languageStateSet.setMainLanguageSet(languageStateSet.text_by_language_us);
      setSigninStr("Login");
      setLogoutStr("Logout");
    }else if(languageStateSet.current_language=== "kr"){
      flagSt = "/flags/kr.png";
      languageStateSet.setMainLanguageSet(languageStateSet.text_by_language_kr);
      setSigninStr("로그인");
      setLogoutStr("로그아웃");
    }else if(languageStateSet.current_language=== "mx"){
      flagSt = "/flags/mx.png";
      setSigninStr("Login");
      setLogoutStr("Logout");
      languageStateSet.setMainLanguageSet(languageStateSet.text_by_language_mx);
    }else{
      flagSt = "/flags/us.png";
      setSigninStr("Login");
      setLogoutStr("Logout");
      languageStateSet.setMainLanguageSet(languageStateSet.text_by_language_mx);
    } 
    setSelectedOption(flagSt);
    
  },[languageStateSet.current_language])

  useEffect(() => {

    if(isMobileMenuOpen){
      setBlock("  translate duration-200 h-[310px] ");
    }else{
      setBlock("  translate duration-200 h-[55px] ");
    }

  }, [isMobileMenuOpen]);

  const [isOpen, setIsOpen] = useState(false) // 드롭다운이 열려 있는지 상태 관리
  const [selectedOption, setSelectedOption] = useState('/flags/us.png') // 기본 선택 옵션

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


  //login modals
  const signInHandleModal = (showYn:boolean) => {
    setShowSigninPortal(showYn);
  };

  const passwordChangeHandleModal = (showYn:boolean) => {
    setShowPasswordChangePortal(showYn);
  };

  const signUpHandleModal = (showYn:boolean) => {
    setShowSignUpPortal(showYn);
  };

  async function logoutOnclickHandler(){
    signOut();
    sessionStorage.removeItem("accesstoken");
    await transaction("get", "user/logout", {}, "", false, true, screenShow, errorShow);
  }

  //페이지 이동
  function homePage(){
    router.push('/home');
  }

  function readingsPage(){
    router.push('/readings');
  }

  function communityPage(){
    router.push('/community');
  }

  function profilePage(){
    router.push('/profile');
  }
  
  return(
    <header className={block + ` fixed top-0 left-0 w-full z-30 bg-[#4A6D88] items-start 
    2xl:h-[55px]   xl:h-[55px]   lg:h-[55px] 
    overflow-hidden

    `}>
      
      <div className="flex justify-between items-start w-full h-[55px] px-10 mt-[10px]  ">
        
        
        <div className=" flex flex-col justify-center items-center w-[100px] cursor-pointer ">
          <div className=" relative text-white w-full  justify-items-center " >
            <p className="absolute -z-10 w-[25px] h-[25px] rounded-full bg-blue-400"></p>
            <p className="">
              <span className="text-[20px]">Text</span>
              <span className="font-bold text-[24px]">Atlas</span>
            </p>
          </div>
        </div>



      
        <div className=" hidden 2xl:flex   xl:flex   lg:flex   md:hidden sm:hidden mt-[5px] 
        flex-1 justify-start  items-center ms-3 me-3 font-bold  ">
          
          <p className="text-start ms-15 ">
            <HomeHeaderMenuButton text={
                languageStateSet.main_language_set[0].text[0]
              } disabled={homeYn}
              onClick={()=>homePage()}
              />
          </p>
          <p className="text-start ms-10 ">
            <HomeHeaderMenuButton text={
              languageStateSet.main_language_set[0].text[1]
            } disabled={readingsYn}
            onClick={()=>readingsPage()}
            />
          </p>

          <p className="text-start ms-10 ">
            <HomeHeaderMenuButton text={
              languageStateSet.main_language_set[0].text[3]
            } disabled={communityYn}
            onClick={()=>communityPage()}
            />
          </p>


          <p className=" text-start ms-10 ">
            {
              (signinYn)?
              <HomeHeaderMenuButton text={languageStateSet.main_language_set[0].text[2]} disabled={profileYn}
              onClick={()=>profilePage()}
              />
              :""
            }
            
          </p> {/* 로그인 이후에 보임 */}
        </div>
        <div className=" 2xl:w-[60px] xl:w-[60px] lg:w-[60px] md:w-full sm:w-full w-full 
        flex justify-end items-center pt-[2px] 
        ">
          <div
            ref={dropdownRef}
            className="relative flex cursor-pointer rounded-lg w-[50px] me-3  "
          >
            <div
              onClick={toggleDropdown}
              className="flex w-full cursor-pointer items-center justify-end pt-[3px]  "
            >
              <p className="flex justify-center  w-[35px] h-[25px]">
                <img src={selectedOption} className=""/>
              </p>
            </div>

            {isOpen && (
              <div className="absolute flex justify-center items-center top-[1px] right-10 rounded-lg w-[140px] bg-white py-1 shadow-md ">
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
        <div className="hidden 2xl:flex   xl:flex   lg:flex   md:hidden sm:hidden  mt-[3px]  ">
          <p>{/* 로그인버튼 */}
            {
              (!signinYn)?
              <HomeHeaderSignInButton text={signinStr} onClick={()=>signInHandleModal(true)}/> 
              :<HomeHeaderSignInButton text={logoutStr} onClick={()=>logoutOnclickHandler()}/>
            }
            
          </p>
        </div>


        <div className=" flex 2xl:hidden   xl:hidden   lg:hidden   md:flex sm:flex mt-[5px] 
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
              {/* SVG 대신 CSS로 만든 세 개의 선 */}
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
          <p className="px-10 h-[35px]"><HomeHeaderMenuButtonL text={languageStateSet.main_language_set[0].text[0]} disabled={homeYn} onClick={()=>homePage()}/></p>
        </div>
        <div className="w-full flex justify-center text-white mt-1">
          <p className="px-10 h-[35px]"><HomeHeaderMenuButtonL text={languageStateSet.main_language_set[0].text[1]} disabled={readingsYn} onClick={()=>readingsPage()}/></p>
        </div>
        <div className="w-full flex justify-center text-white mt-1">
          <p className="px-10 h-[35px]"><HomeHeaderMenuButtonL text={languageStateSet.main_language_set[0].text[3]} disabled={communityYn} onClick={()=>communityPage()}/></p>
        </div>
        <div className="w-full flex justify-center text-white mt-1">
          <p className="px-10 h-[35px]">
            {
              (signinYn)?<HomeHeaderMenuButtonL text={languageStateSet.main_language_set[0].text[2]} disabled={profileYn} onClick={()=>profilePage()}/>:""
            }
            
          </p>
        </div>
        <div className="w-full flex justify-center text-white mt-7">
          <p className="">
            {
              (!signinYn)?<HomeHeaderSignInButtonL text={signinStr} onClick={()=>signInHandleModal(true)}/>
              :<HomeHeaderSignInButtonL text={logoutStr} onClick={()=>logoutOnclickHandler()}/>
            }
          </p>
        </div>
      </div>
      <SignIn show={showSigninPortal} signInHandleModal={signInHandleModal} passwordChangeHandleModal={passwordChangeHandleModal} signUpHandleModal={signUpHandleModal} />
      <PasswordChange show={showPasswordChangePortal} signInHandleModal={signInHandleModal} passwordChangeHandleModal={passwordChangeHandleModal} signUpHandleModal={signUpHandleModal}/>
      <SignUp show={showSignUpPortal} signInHandleModal={signInHandleModal} passwordChangeHandleModal={passwordChangeHandleModal} signUpHandleModal={signUpHandleModal}/>
    </header>
  );
};

export default Hearder