

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

const SignIn = (props:any) => {
  const languageStateSet = languageState();  
  
  const [block, setBlock] = useState<string>("block")

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [validationMsg, setValidationMsg] = useState<string>("");
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  const userStateSet = userState();

  const focusEmail = useRef<HTMLInputElement>(null);
  const focusPassword = useRef<HTMLInputElement>(null);


  useEffect(() => {
    setValidationMsg("");
    if(props.show){
      setBlock("visible transform translate-y-8 ease-out duration-700 ");
    }else{
      setBlock("invisible  ");
    }

  }, [props.show]);

  function close(){
    props.signInHandleModal(false);
  }

  function movePasswordPage(){
    props.signInHandleModal(false);
    props.passwordChangeHandleModal(true);
  }

  function moveSignUpPage(){
    props.signInHandleModal(false);
    props.signUpHandleModal(true);
  }

  function emailOnchangeHandler(e:any){
    setEmail(e.target.value);
  }

  function passwordOnchangeHandler(e:any){
    setPassword(e.target.value);
  }

  async function signInOnClickHandler(){
    setValidationMsg("");

    const checkObj = {
      email:email,
    }

    const retObj = checkEmail(checkObj, languageStateSet.current_language);
    
    if(!retObj.yn){
      focusEmail.current?.focus();
      setValidationMsg(retObj.str);
      return;
    }

    if(!password){
      focusPassword.current?.focus();
      let retStr;
      if(languageStateSet.current_language === "us"){
        retStr = "Please confirm your password.";            
      }else if(languageStateSet.current_language === "kr"){
        retStr = "비밀번호 확인을 확인해주세요.";
      }else if(languageStateSet.current_language === "mx"){
        retStr = "Por favor revise su contraseña.";
      }else{
        retStr = "Please confirm your password.";
      }

      setValidationMsg(retStr);
      return;
    }



    screenShow.screenShowTrue();
    const result:any = await signIn('credentials', {
      email,
      password,
      redirect:false,
      callbackUrl:"/"
      // 필요한 경우 다른 필드도 추가할 수 있습니다.
    });
    screenShow.screenShowFalse();

    if (!result.error) {
      // console.log('user/getAccessToken 호출시작');
      const retObj = await transaction("get", "user/getAccessToken", {}, "", false, true, screenShow, errorShow);

      if(retObj.sendObj.code === "2000"){
        //유저정보는 zustand
        //access토큰 정보는 session storege클래스에 담아준다. 
        userStateSet.userSet(retObj.sendObj.resObj);
        storeAccessToken(retObj.accessToken);
        props.signInHandleModal(false);
      }else{
        errorShow.screenShowTrue();
        errorShow.messageSet("Internal Server Error");
      }
    }else{
      if(languageStateSet.current_language === "us"){
        setValidationMsg("login failed");
      }else if(languageStateSet.current_language === "kr"){
        setValidationMsg("로그인 실패");
      }else if(languageStateSet.current_language === "mx"){
        setValidationMsg("error de inicio de sesion");
      }else{
        setValidationMsg("login failed");
      }
      
      
    }
  }

  async function socialLogin() {
    signIn('google');
  }

  function enterClick(e:any){

    if(e.key === "Enter") {
      signInOnClickHandler();
    }
  }

  return (
    <Portal
      selector="portal"
      show={props.show}>
      <div className="static ">
        <div className='  fixed top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center pb-20 backdrop-blur-xs backdrop-brightness-80 '>
          <div className={block +  "  w-[280px] h-[400px] border-1 rounded-md border-[#4A6D88] shadow-sm shadow-blue-900/50 bg-white "}>
            <div className="flex justify-end h-[24px] bg-[#4A6D88] ">
              <p className="mr-1 text-lg mt-0.5 text-white  cursor-pointer "
              onClick={()=>close()} 
              >
                <FaRegWindowClose />
              </p>
            </div>
            <div className=" flex justify-center mt-4 ">
              <p className="text-[20px] font-bold  text-[#4A6D88]">
                {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[0]:""}
              </p> 
            </div>
            <div className="mt-4 px-5 text-[#4A6D88] text-sm">
              <input 
              onChange={(e)=>emailOnchangeHandler(e)}
              onKeyDown={(e)=>enterClick(e)}
              placeholder={(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[1]:""}
              type="text" className="text-[11px] w-[100%] h-[10px] border border-[#4A6D88] outline-none py-4 px-3 rounded"
              value={email}
              ref={focusEmail}
              ></input>
            </div>

            <div className="px-5 mt-4 text-[#4A6D88] text-sm">
              <input 
              onChange={(e)=>passwordOnchangeHandler(e)}
              placeholder={(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[2]:""}
              type="password" className="text-[11px] w-[100%] h-[10px] border border-[#4A6D88] outline-none py-4 px-3 rounded"
              ref={focusPassword}
              onKeyDown={(e)=>enterClick(e)}
              ></input>
            </div>

            <div className="pr-5 mt-1 flex justify-end">
              <p className=" text-[10px] cursor-pointer font-bold text-[#4A6D88] 
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform inline-block
              "
              onClick={()=>movePasswordPage()}
              >
              {/* {languageStateSet.main_language_set[1].text[3]} */}
              {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[3]:""}
              </p>
            </div>

            <div className="h-[20px] px-5 my-2">
              <p className="flex justify-center text-red-500 text-xs ">{validationMsg}</p>
            </div>


            <div className="mt-5 px-5 flex justify-center w-[100%]">
              <p className=" w-[100%]">
                <button className="border border-[#4A6D88] w-[100%] text-[14px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold py-1 px-4 rounded
                transition-all duration-200 ease-in-out cursor-pointer
                "
                onClick={()=>signInOnClickHandler()}
                >
                  {/* {languageStateSet.main_language_set[1].text[0]} */}
                  {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[0]:""}
                </button>
              </p>
            </div>

            <div className=" flex justify-end w-[100%] pr-5 mt-1">
              <p className="  leading-relaxed mr-1 text-[#4A6D88] text-[10px]">
                {/* {languageStateSet.main_language_set[1].text[4]} */}
                {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[4]:""}
              </p>
              <p className="  leading-relaxed text-[#4A6D88] font-bold cursor-pointer text-[10px] 
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform inline-block
              "
              onClick={()=>moveSignUpPage()}
              >
                {/* {languageStateSet.main_language_set[1].text[5]} */}
                {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[5]:""}
              </p>
            </div>

            <div className=" py-3 mt-2 px-5 inline-flex items-center justify-center w-full mb-3 ">
              <hr className="w-full mx-2 h-px border-1 border-[#4A6D88]  "/>
              <span className="text-[12px] absolute px-3 font-medium text-[#4A6D88] -translate-x-1/2 bg-white left-1/2">
              {/* {languageStateSet.main_language_set[1].text[6]} */}
              {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[6]:""}
              </span>
            </div>

            <div className="px-5 flex justify-center w-[100%] ">
              <p className=" w-[100%]">
                <button 
                onClick={()=>socialLogin()}
                className="flex justify-center border border-[#4A6D88] w-[100%] bg-white text-[#4A6D88] hover:bg-[#4A6D88]
                 hover:text-white font-bold py-1 px-4 rounded text-[14px] 
                 transition-all duration-200 ease-in-out cursor-pointer
                 ">
                <span className="mr-1 p-1"><FcGoogle/></span> 
                {/* {languageStateSet.main_language_set[1].text[7]} */}
                {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[1].text[7]:""}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>  
       
    </Portal>
  );
}

export default SignIn;



