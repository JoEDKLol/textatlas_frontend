

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
// import { headers } from 'next/headers';


const ContactUs = (props:any) => {
  const router = useRouter();
  const languageStateSet = languageState();
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  const userStateSet = userState();
  
  const focusEmail = useRef<HTMLInputElement>(null);
  const focusContent = useRef<HTMLTextAreaElement>(null);
  

  //문의사항
  const [inquiry, setInquiry] = useState("general");

  //email 주소
  const [receiveEmail, setReceiveEmail] = useState("");

  //문의내용상세
  const [content, setContent] = useState("");
  
  //이름 - 허니팟
  const [nameField, setNameField] = useState("");

  //content msg
  const [contentMsg, setContentMsg] = useState("");

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
    for(let i =0; i < receiveEmail.length; i++) {
      const currentByte = receiveEmail.charCodeAt(i);
      // if(currentByte > 128){
      //   totalByte += 2;
      // }else {
      //   totalByte++;
      // }

      totalByte++;

      if(totalByte > 254){
        setReceiveEmail(receiveEmail.substring(0, i));
        break;
      }
    }
  },[receiveEmail]);

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < content.length; i++) {
      const currentByte = content.charCodeAt(i);
      // if(currentByte > 128){
      //   totalByte += 2;
      // }else {
      //   totalByte++;
      // }

      totalByte++;
      if(totalByte > 1000){
        setContent(content.substring(0, i));
        break;
      }
    }
  },[content]);

  // 

  function textareaOnchange(e:any){
    setContent(e.target.value);
  }

  function emailOnchange(e:any){
    setReceiveEmail(e.target.value);
  }

  function close(){
    setIsOpen(false);
    props.setShowContactUsPotal(false);
    setInquiry("general");
    setReceiveEmail("");
    setContent("");
  }

  // general, bug, book, community
  function selectOption(e:any){
    setInquiry(e.target.value);
  }

  
  function nameFieldOnchange(e:any){
    setNameField(e.target.value);
  }
  
  async function send() {

    // const headerList = headers();
    // const clientIp = headerList?.get('x-forwarded-for') || 'unknown' as any;

    if(nameField || nameField.length > 0){
      return;
    }

    setContentMsg("");

    const obj = {
      email:receiveEmail,
      inquiry:inquiry,
      content:content,
      userinfo:userStateSet.id,
      nameField:nameField,
      useremail:userStateSet.email,
      language:languageStateSet.current_language
    }


    const resEmailCheck = checkEmail(obj, languageStateSet.current_language);
    if(!resEmailCheck.yn){
      focusEmail.current?.focus();
      return;
    }
    

    if(content.length < 20){
      setContentMsg("문의 내용을 20자 이상 입력해주에요.");
      focusContent.current?.focus();
      return;
    }
    
  

    const retObj = await transaction("post", "administrator/contactussend", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){

    }
  }


  

  return (
    <Portal
      selector="portal"
      show={props.show}>
      <div className="static ">
        <div className='  fixed top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center backdrop-blur-xs backdrop-brightness-80  '>

          <div className="w-[90%] max-w-[650px] max-h-[550px]  rounded-[12px] 
          bg-white px-8 pt-8 pb-10 flex flex-col justify-start items-center 
          ">
            <div className="w-full flex justify-between  text-[#4A6D88] font-bold text-[20px] ">
                <div className=" flex items-end">Contact Us</div>
                <div className=" flex items-center text-[25px] cursor-pointer
                transition-transform duration-300 ease-in-out hover:scale-110 transform 
                "
                onClick={()=>close()}
                ><MdClose /></div>
            </div>
            <div className="border-t border-[#4A6D88] w-full border-b-[1.6px] rounded-full mt-2"></div>
            <div className="flex flex-col w-full">
              
              <div className="w-full text-[#666] mt-5 text-[13px]">
                서비스 이용 중 불편한 점이나 제안하고 싶은 내용을 보내주세요.
              </div>

              <div className="w-full  mt-5  text-[13px] ] ">
                <select className="w-full border-[1px] rounded-[5px] p-[7px] border-[#ddd]  "
                value={inquiry}
                onChange={(e)=>selectOption(e)}
                >
                  <option className="" value="01">일반 문의</option>
                  <option value="02">버그 신고</option>
                  <option value="03">도서 추가 요청</option>
                  <option value="04">커뮤니티/쪽지 관련 문의</option>
                </select>
              </div>
              <div className="w-full text-[#666] text-[13px] mt-3">
                <input placeholder="답변받을 이메일 주소" className="w-full  p-[7px] border-[1px] border-[#ddd] rounded-[5px] "
                value={receiveEmail}
                onChange={(e)=>emailOnchange(e)}
                ref={focusEmail}
                />
              </div>

              <div className="w-full text-[#666] text-[13px] mt-3">
                <textarea placeholder="문의 내용을 상세히 적어주세요." className="w-full  p-[7px] border-[1px] border-[#ddd] rounded-[5px] resize-none "
                rows={5}
                value={content}
                onChange={(e)=>textareaOnchange(e)}
                ref={focusContent}
                />
              </div>
              <div className="w-full flex justify-between text-xs text-red-400">
                <div>
                  {contentMsg}
                </div>
                <div>
                  {content.length + "/" + 1000}
                </div>
              </div>

              <div className="w-full flex justify-center items-center mt-3">
                <button 
                className=" w-full
                px-2 py-2
                border-1 border-[#4A6D88]   
                text-[#4A6D88]
                rounded-md              
                font-semibold           
                hover:bg-[#4A6D88]
                hover:text-white

                transition-all duration-400 ease-in-out 
                cursor-pointer inline-block
                text-[13px]
                "
                onClick={()=>send()}
                >
                문의 보내기
                </button>
              </div>
              
              <div className="flex justify-center items-center mt-5 text-[12px] text-[#999] ">
                또는 직접 메일 보내기&nbsp;:&nbsp; <a href="mailto:daeheekim0707@gmail.com" className="text-[#4A6D88]">daeheekim0707@gmail.com</a>

              </div>

              <div className="w-full text-[#666] text-[13px] mt-3" 
                style={{
                  opacity: 0, 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  height: 0, 
                  width: 0, 
                  zIndex: -1
                }}
                aria-hidden="true"
                >
                <label htmlFor="confirm_email">이 필드는 비워두세요</label>
                <input 
                id="name_field"
                name="name_field"
                className="w-full "
                value={nameField}
                onChange={(e)=>nameFieldOnchange(e)}
                autoComplete="off"
                tabIndex={-1}
                />
              </div>

            </div>
            

          </div>

        </div>
        
      </div>  
       
    </Portal>
  );
}

export default ContactUs;



