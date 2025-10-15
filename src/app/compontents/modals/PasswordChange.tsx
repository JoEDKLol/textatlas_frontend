import { useRef, useEffect, useState } from "react";
import Portal from "./Portal";
import { FaRegWindowClose } from "react-icons/fa";
import { transaction } from "@/app/utils/axios";
import loadingScreenShow from "@/app/store/loadingScreen";
import errorScreenShow from "@/app/store/errorScreen";
import { checkEmail, checkPassword } from "@/app/utils/checkUserValidation";
import languageState from "@/app/store/language";

const PasswordChange = (props:any) => {

  const languageStateSet = languageState();
  
  const [block, setBlock] = useState<string>("block")
  const [verifyEmail, setVerifyEmail] = useState<string>("")
  const [verifyNumber, setVerifyNumber] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [rePassword, setRePassword] = useState<string>("")

  const [emailObjDisable, setEmailObjDisable] = useState<any>({objDisable:false, classHover:" hover:bg-[#4A6D88] hover:text-white bg-white "});
  const [numberObjDisable, setNumberObjDisable] = useState<any>({objDisable:true, classHover:" bg-gray-100 "});
  const [passwordDisable, setPasswordDisable] = useState<boolean>(true);
  const [rePasswordDisable, setRePasswordDisable] = useState<boolean>(true);
  const [signUpObjDisable, setSignUpObjDisable] = useState<any>({objDisable:true, classHover:" bg-gray-100 "});
  
  const [signUpSeccess, setSignUpSeccess] = useState<boolean>(false);

  const [validationMsg, setValidationMsg] = useState<string>("");

  //timer
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timer, setTimer] = useState<string>();

  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  const focusEmail = useRef<HTMLInputElement>(null);
  const focusNumber = useRef<HTMLInputElement>(null);
  const focusPassword = useRef<HTMLInputElement>(null);
  const focusRepassword = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initF();
    if(props.show){  
      setBlock("visible transform translate-y-8 ease-out duration-700 ");
    }else{
      setBlock("invisible  ");
    }

  }, [props.show]);

  useEffect(()=>{
    let interval:any;
    if(isRunning === true){
      
      let startTime = 180;
      interval = setInterval(() => {
        setTimer(timerMS(startTime)); 
        startTime = startTime-1;
        if(startTime < 0){
            clearInterval(interval);
            setTimer(""); 
            initF();

        }
      }, 1000); 

    }else{
      clearInterval(interval);
      setTimer("");
    }

    return () => {
      clearInterval(interval);
    };

  },[isRunning]);

  useEffect(() => {
    if(numberObjDisable.objDisable === false){
      focusNumber.current?.focus();
    }
  }, [numberObjDisable.objDisable]);

  useEffect(() => {
    if(passwordDisable === false){
      focusPassword.current?.focus();
    }
  }, [passwordDisable]);

  
  useEffect(()=>{
    let totalByte = 0;
    if(verifyNumber !== undefined){
      let inputValue = "";
      for(let i =0; i < verifyNumber.length; i++) {
        const currentByte = verifyNumber.charCodeAt(i);
        //48~57 0~9
        if(currentByte >= 48 && currentByte <= 57){
          inputValue += verifyNumber.charAt(i);
        }
        totalByte++;
        if(totalByte > 5){
          break;
        }
      }
      setVerifyNumber(inputValue);
    }
    
  },[verifyNumber]);
  

  function initF(){ 
    setIsRunning(false);
    setVerifyNumber(""); 
    setEmailObjDisable({objDisable:false, classHover:" hover:bg-[#4A6D88] hover:text-white bg-white "});
    setNumberObjDisable({objDisable:true, classHover:" bg-gray-100 "});
    setPasswordDisable(true);
    setRePasswordDisable(true);

    setSignUpObjDisable({objDisable:true, classHover:" bg-gray-100 "})
    setSignUpSeccess(false);
    
  } 

  function timerMS(seconds:number){
    const mins = Math.floor((seconds)/60);
    const secs = seconds - mins*60;
    return addZero(mins) + ':' + addZero(secs);

    function addZero(num:number) {
        return ((num < 10) ? '0' : '') + num
    } 
  }
  
  
  function close(){
    props.passwordChangeHandleModal(false);
  }

  function moveSignInPage(){
    props.passwordChangeHandleModal(false);
    props.signInHandleModal(true);
  }
  
  function emailOnChangeHandler(e:any){
    setVerifyEmail(e.target.value);
  }

  async function sendEmail(){
    setValidationMsg("");

    const checkObj = {
      email:verifyEmail,
    }

    const retObj = checkEmail(checkObj, languageStateSet.current_language);
    



    if(!retObj.yn){
      focusEmail.current?.focus();
      setValidationMsg(retObj.str);
      return;
    }
    
    const obj = {
      email : verifyEmail,
      language : languageStateSet.current_language,
    }

        console.log(obj);



    const resObj = await transaction("post", "user/sendemailforpassword", obj, "", false, true, screenShow, errorShow);
    
    console.log(resObj);
    
    if(resObj.sendObj.success==="y"){
      setIsRunning(true);
      setEmailObjDisable({objDisable:true, classHover:" bg-gray-100 "})
      setNumberObjDisable({objDisable:false, classHover:" hover:bg-[#4A6D88] hover:text-white bg-white "});
      
    }else{
      let reMessage = "";
      if(resObj.sendObj.code === "1031"){
        if(languageStateSet.current_language === "us"){
          reMessage = "There is already an email registered.";
        }else if(languageStateSet.current_language === "kr"){
          reMessage = "이미 가입된 이메일이 있습니다.";
        }else if(languageStateSet.current_language === "mx"){
          reMessage = "Ya hay un correo electrónico registrado.";
        }else{
          reMessage = "There is already an email registered.";
        }

        setValidationMsg(reMessage);
      }

      if(resObj.sendObj.code === "1034"){
        if(languageStateSet.current_language === "us"){
          reMessage = "Email verification code failed to be sent (re-sent within 3 minutes)";
        }else if(languageStateSet.current_language === "kr"){
          reMessage = "이메일 인증번호 발송 실패 (3분 이내 재발송)";
        }else if(languageStateSet.current_language === "mx"){
          reMessage = "No se pudo enviar el código de verificación de correo electrónico (se volvió a enviar en 3 minutos)";
        }else{
          reMessage = "Email verification code failed to be sent (re-sent within 3 minutes)";
        }

        setValidationMsg(reMessage);
      }

      setIsRunning(false);
    }
  }

  function verifyNumberOnChangeHandler(e:any){
    setVerifyNumber(e.target.value);    
  }

  async function verifyNumberCheck(){
    setValidationMsg("");
    const obj = {
      email : verifyEmail,
      verifynumber : verifyNumber
    }
    const resObj = await transaction("get", "user/checkverifynumber", obj, "", false, true, screenShow, errorShow);
    
    if(resObj.sendObj.success==="y"){
      setNumberObjDisable({objDisable:true, classHover:"bg-gray-100"});
      setIsRunning(false);
      setPasswordDisable(false);
      setRePasswordDisable(false);
      setSignUpObjDisable({objDisable:false, classHover:" hover:bg-[#4A6D88] hover:text-white bg-white "});
    }else{
      // setValidationMsg(resObj.sendObj.message);
      let reMessage = "";
      if(languageStateSet.current_language === "us"){
        reMessage = "Authentication number authentication failed";
      }else if(languageStateSet.current_language === "kr"){
        reMessage = "인증번호 인증 실패";
      }else if(languageStateSet.current_language === "mx"){
        reMessage = "Falló la autenticación del número de autenticación";
      }else{
        reMessage = "Authentication number authentication failed";
      }

      setValidationMsg(reMessage);
    }

   
  }

  function passwordOnChangeHandler(e:any){
    setPassword(e.target.value);
  }

  function rePasswordOnChangeHandler(e:any){
    setRePassword(e.target.value)
  }

  async function passwordChange(){
    setValidationMsg("");
    const checkObj = {
      password:password,
      rePassword:rePassword
    }

    const retObj = checkPassword(checkObj, languageStateSet.current_language);
    
    if(!retObj.yn){
      // focusEmail.current?.focus();
      if(retObj.field === "rePassword"){
        focusRepassword.current?.focus();
      }else{
        focusPassword.current?.focus();
      }
      
      setValidationMsg(retObj.str);
      return;
    }else{
      const obj = {
        email : verifyEmail,
        password : password
      }
      const resObj = await transaction("post", "user/changepassword", obj, "", false, true, screenShow, errorShow);

      if(resObj.sendObj.success==="y"){
        setSignUpSeccess(true);

      }else{
        let reMessage = "";
        if(languageStateSet.current_language === "us"){
          reMessage = "Password change failed";
        }else if(languageStateSet.current_language === "kr"){
          reMessage = "비밀번호 변경 실패";
        }else if(languageStateSet.current_language === "mx"){
          reMessage = "Error al cambiar la contraseña";
        }else{
          reMessage = "Password change failed";
        }

        setValidationMsg(reMessage);
      }


    }




  }

  return (
    <Portal
      selector="portal"
      show={props.show}>
      <div className="static">
        <div className=' absolute top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center pb-20 backdrop-blur-xs backdrop-brightness-80 '>
          <div className={block +  "  w-[280px] h-[400px] border-2 rounded-md border-[#4A6D88] shadow-lg shadow-blue-900/50  bg-white"}>
            {(!signUpSeccess)?<>
              <div className="flex justify-end h-[24px] bg-[#4A6D88] ">
                <p className="mr-1 text-lg mt-0.5 text-white  cursor-pointer "
                onClick={()=>close()}
                >
                  <FaRegWindowClose />
                </p>
              </div>
              <div className=" flex justify-center mt-4 ">
                <p className="text-[20px] font-bold text-[#4A6D88]">
                {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[0]:""}    
                </p> 
              </div>

              <div className="mt-4 px-5 text-[#4A6D88]"> 
                <p className="flex justify-between">
                  <input 
                  placeholder={(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[1]:""}   
                  type="text" className="w-[100%] text-[11px] h-[10px] border border-[#4A6D88] outline-none py-4 px-3 rounded"
                  ref={focusEmail}
                  onChange={(e)=>emailOnChangeHandler(e)}
                  disabled={emailObjDisable.objDisable}
                  ></input>
                  <button className={emailObjDisable.classHover + ` ms-1 border text-[11px] border-[#4A6D88] w-[70px] text-[#4A6D88] font-bold py-1 rounded 
                  transition-all duration-200 ease-in-out cursor-pointer
                  `}
                  disabled={emailObjDisable.objDisable}
                  onClick={()=>sendEmail()} 
                  >
                    {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[2]:""}
                  </button>
                </p>
                
                
              </div>

              <div className="relative px-5 text-[#4A6D88] mt-2 ">
                <p className="flex justify-between">
                  <input 
                  placeholder={(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[3]:""} 
                  type="text" className=" relative w-[100%] text-[11px] h-[10px] border border-[#4A6D88] outline-none py-4 px-3 rounded" 
                  ref={focusNumber}
                  disabled={numberObjDisable.objDisable}
                  value={verifyNumber}
                  onChange={(e)=>verifyNumberOnChangeHandler(e)}
                  ></input>
                  <button 
                  disabled={numberObjDisable.objDisable}
                  className={numberObjDisable.classHover + ` ms-1 border border-[#4A6D88] text-[11px] w-[70px] text-[#4A6D88] font-bold py-1 rounded
                  transition-all duration-200 ease-in-out cursor-pointer
                  `}
                  onClick={()=>verifyNumberCheck()}
                  >
                  {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[4]:""}
                  </button>
                </p>
                <p className="absolute top-[10px] left-[150px] text-xs text-red-500">{timer}</p>
              </div>

              <div className="px-5 mt-2 text-[#4A6D88]">
                <p className="flex justify-between">
                  <input 
                  placeholder={(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[5]:""}  
                  type="password" className="text-[11px] w-[100%] h-[10px] border border-[#4A6D88] outline-none py-4 px-3 rounded"
                  onChange={(e)=>passwordOnChangeHandler(e)}
                  disabled={passwordDisable}
                  ref={focusPassword}
                  ></input>
                </p>
              </div>

              <div className="px-5 mt-2 text-[#4A6D88]">
                <p className="flex justify-between">
                  <input 
                  placeholder={(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[6]:""}  
                  type="password" className=" text-[11px] w-[100%] h-[10px] border border-[#4A6D88] outline-none py-4 px-3 rounded"
                  onChange={(e)=>rePasswordOnChangeHandler(e)}
                  disabled={rePasswordDisable} 
                  ref={focusRepassword}
                  ></input>
                </p>
              </div>
              <div className="h-[20px] px-5 mt-1">
                <p className="flex justify-center text-red-500 text-xs">{validationMsg}</p>
              </div>
              <div className="mt-8 px-5  flex justify-center w-[100%]">
                <p className=" w-[100%]">
                  <button className={signUpObjDisable.classHover + ` text-[14px]  border border-[#4A6D88] w-[100%]  text-[#4A6D88] font-bold py-1 px-4 rounded
                  transition-all duration-200 ease-in-out cursor-pointer
                  `}
                  disabled={signUpObjDisable.objDisable}
                  onClick={()=>passwordChange()}
                  >
                  {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[0]:""}
                  </button>
                </p>
              </div>

              <div className=" flex justify-center w-[100%] mt-1">
                <p className=" text-[10px] leading-relaxed text-[#4A6D88] mr-1">
                  {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[7]:""}
                {/* <button onClick={()=>{clickSignUpModal()}} className="font-bold text-grey-700">Create an Account</button> */}
                </p>
                <p className=" text-[10px] leading-relaxed text-[#4A6D88] font-bold cursor-pointer 
                transition-transform duration-300 ease-in-out
                hover:scale-110 transform 
                "
                onClick={()=>moveSignInPage()}
                >
                  {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[8]:""}
                {/* <button onClick={()=>{clickSignUpModal()}} className="font-bold text-grey-700"></button> */}
                </p>
              </div>
            </>
            :<>
              <div className="flex justify-end h-[24px] bg-[#4A6D88] ">
                <p className="mr-1 text-lg mt-0.5 text-white  cursor-pointer "
                onClick={()=>close()}
                >
                  <FaRegWindowClose />
                </p>
              </div>
              <div className=" ">
                <p className=" text-center text-[20px] font-bold mt-4 text-[#4A6D88]">
                  {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[9]:""}
                </p> 
                <p className=" text-center text-[20px] font-bold  text-[#4A6D88]">
                  {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[10]:""}
                </p> 
              </div>

              <div className=" flex justify-center mt-48">
                <button 
                  className={` hover:bg-[#4A6D88]  hover:text-white ms-1 border border-[#4A6D88] w-[60%] bg-white text-[#4A6D88] font-bold py-1 rounded
                    transition-all duration-200 ease-in-out cursor-pointer
                    `}
                  onClick={()=>moveSignInPage()}
                  >
                  {(languageStateSet.main_language_set[1])?languageStateSet.main_language_set[3].text[11]:""}
                </button>

              </div>
            </>}

            

            

          </div>
          
        </div>
      </div>  
       
    </Portal>
  );
}

export default PasswordChange;



