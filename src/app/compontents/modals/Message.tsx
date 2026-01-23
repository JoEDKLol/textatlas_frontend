

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
import { ButtonHisBookList, ButtonMessage } from "../design/buttons/Buttons";
import { useRouter } from "next/navigation";
import { transactionAuth } from "@/app/utils/axiosAuth";
import loadingScreenEmptyShow from "@/app/store/loadingScreen_empty";


interface userInfoItf {
  _id:string
  userseq:number
  email:string
  username:string
  userimg:string
  userthumbImg:string
}

const Message = (props:any) => {
  const router = useRouter();
  const languageStateSet = languageState();
  const screenShow = loadingScreenShow();
  const screenShowEmpty = loadingScreenEmptyShow(); //중앙에 로딩 없는 창
  const errorShow = errorScreenShow();
  const userStateSet = props.userStateSet;

  const focusTitle = useRef<HTMLInputElement>(null);
  const focusMessage = useRef<HTMLTextAreaElement | null>(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [validationTitleMsg, setValidationTitleMsg] = useState("");
  const [validationMessageMsg, setValidationMessageMsg] = useState("");

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

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < title.length; i++) {
      const currentByte = title.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 40){
        setTitle(title.substring(0, i));
        break;
      }
    }
  },[title]);

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < message.length; i++) {
      const currentByte = message.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 1000){
        setMessage(message.substring(0, i));
        break;
      }
    }
  },[message]);
  // const bookInfo = props.bookInfoInPortal;
  useEffect(()=>{
    focusTitle.current?.focus();
  },[props.setShowMessage])

  const messageUserInfo = props.messageUserInfo;

  function close(){
    setTitle("");
    setMessage("");
    setIsOpen(false);
    props.setShowMessage(false);
  }


  function titleOnChangeHandler(e:any){
    setTitle(e.target.value);
  }
  
  function messageOnChangeHandler(e:any){
    setMessage(e.target.value);
  }

  //댓글저장
  async function sendMessage(){

    setValidationTitleMsg("");
    setValidationMessageMsg("");

    if(!title){
      focusTitle.current?.focus();
      let retStr;
      if(languageStateSet.current_language === "us"){
        retStr = "Please confirm title.";            
      }else if(languageStateSet.current_language === "kr"){
        retStr = "제목을 확인해주세요.";
      }else if(languageStateSet.current_language === "mx"){
        retStr = "Por favor, confirme el título.";
      }else{
        retStr = "Please confirm title.";
      }

      setValidationTitleMsg(retStr);
      return;
    }

    if(!message){
      focusMessage.current?.focus();
      let retStr;
      if(languageStateSet.current_language === "us"){
        retStr = "Please confirm message.";            
      }else if(languageStateSet.current_language === "kr"){
        retStr = "내용을 확인해주세요.";
      }else if(languageStateSet.current_language === "mx"){
        retStr = "Por favor, confirme el mensaje.";
      }else{
        retStr = "Please confirm message.";
      }
      setValidationMessageMsg(retStr)
      return;
    }

    const obj = {
      send_user_seq:userStateSet.userseq,
      receive_user_seq:messageUserInfo?.userseq,
      title:title,
      message:message,
      send_userinfo:userStateSet.id,
      receive_userinfo:messageUserInfo._id,
      email:userStateSet.email
    }

    

    const retObj = await transactionAuth("post", "message/messagesend", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setTitle("");
      setMessage("");
      close();
    }
  }



  return (
    <Portal
      selector="portal"
      show={props.show}>
      <div className="static ">
        <div className='  fixed top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center    '>

          {/* <div className="border h-[350px] w-[250px]">
            <div onClick={()=>close()}>닫기</div>
          </div> */}

          <div className=" w-[250px] h-[360px] shadow-md border border-gray-300 rounded-md m-5
          bg-[#F5F7FA]
          "
          // onClick={()=>bookDetailPage(elem.book_seq)}
          >
            
            <div className=" flex flex-col justify-start items-center h-[310px] p-3 text-xs text-[#5f89aa] 
            ">
              <div className=" flex flex-col w-full">
                <div className="flex">
                  <div>{(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[14].text[2]:""} : </div>
                  <div className="ps-1 font-bold">
                    {messageUserInfo?.username} 
                  </div>
                </div>
                

                <div className="mt-3">{(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[14].text[3]:""}
                  <span className="ps-3 text-red-300">{validationTitleMsg}</span>
                </div>
                <div className="pt-1">
                  <input className="h-full px-2 py-1 w-full text-xs rounded-sm placeholder:font-light border focus:outline-none bg-white "
                     
                    ref={focusTitle}
                    value={title}
                    onChange={(e)=>titleOnChangeHandler(e)}
                    />
                </div>

                <div className="mt-3">{(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[14].text[4]:""}
                  <span className="ps-3 text-red-300">{validationMessageMsg}</span>
                </div>
                <div>
                  <textarea className={` my-1 h-[190px] text-xs overflow-y-auto rounded-sm  w-full border px-2 py-2 bg-white
                  focus:outline-none resize-none  ` 
                  }
                  value={message}
                  ref={focusMessage}
                  onChange={(e)=>messageOnChangeHandler(e)}
                  />
                </div>

              </div>
            </div> 
            <div className="flex justify-center h-[50px]  items-center">

              <div className=" px-1 flex items-center"> {/* 닫기  */}
                {
                  (userStateSet.id)?
                  <ButtonMessage text={
                    (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[14].text[1]:""
                  }
                  onClick={()=>sendMessage()}
                  />:""
                }  
                 
              
              </div>

              <div className=" px-1 flex items-center"> {/* 닫기  */}
                <ButtonMessage text={
                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[14].text[0]:""
                }
                onClick={()=>close()}
                /> 
              </div>
            </div>
            
          </div>

        </div>
        
      </div>  
       
    </Portal>
  );
}

export default Message;



