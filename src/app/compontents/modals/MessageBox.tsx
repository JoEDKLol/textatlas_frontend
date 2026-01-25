

import { useEffect, useRef, useState } from "react";
import Portal from "./Portal";
import { FaArrowCircleDown, FaArrowCircleUp, FaRegWindowClose } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn, } from "next-auth/react";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transaction } from "@/app/utils/axios";
import errorScreenShow from "@/app/store/errorScreen";
import { getChangedMongoDBTimestpamp, getDateContraction3, storeAccessToken } from "@/app/utils/common";
import userState from "@/app/store/user";
import languageState from "@/app/store/language";
import { checkEmail } from "@/app/utils/checkUserValidation";
import Image from "next/legacy/image";
import { ButtonHisBookList, ButtonHisBookListNext, ButtonMessage, ButtonMessageNext, ButtonMessageSee } from "../design/buttons/Buttons";
import { useRouter } from "next/navigation";
import { transactionAuth } from "@/app/utils/axiosAuth";
import loadingScreenEmptyShow from "@/app/store/loadingScreen_empty";
import { CiImageOn } from "react-icons/ci";
import unreadMessageCnt from "@/app/store/unreadMessageCnt";


interface userInfoItf {
  _id:string
  userseq:number
  email:string
  username:string
  userimg:string
  userthumbImg:string
}

interface tabStyle {
  selectedYn:boolean
  selectStyle:string
}

interface messageItf {
  message_seq:number
  send_user_seq:number
  receive_user_seq:number
  send_time:string
  receive_time:string
  msg_checkyn:boolean
  title:string
  message:string
  send_msg_deleteyn:boolean
  receive_msg_deleteyn:boolean
  send_userinfo:userInfoItf
  receive_userinfo:userInfoItf
  style:string
  messageCheckYn:boolean
}

interface messageListItf extends Array<messageItf>{}

const MessageBox = (props:any) => {
  const router = useRouter();
  const languageStateSet = languageState();
  const screenShow = loadingScreenShow();
  const screenShowEmpty = loadingScreenEmptyShow(); //중앙에 로딩 없는 창
  const errorShow = errorScreenShow();
  const unreadMessageCntSet = unreadMessageCnt();
  const userStateSet = props.userStateSet;
  

  const [selectedAll, setSelectedAll] = useState<tabStyle>({selectedYn:true, selectStyle:"border-b-3"});
  const [selectedRec, setSelectedRec] = useState<tabStyle>({selectedYn:false, selectStyle:"border-b"});
  const [selectedSend, setSelectedSend] = useState<tabStyle>({selectedYn:false, selectStyle:"border-b"});
  const [selectedTab, setSelectedTab] = useState(0);

  const [currentPageNumber,setCurrentPageNumber] = useState(0);

  const [allMessageList, setAllMessageList] = useState<messageListItf>([]);
  const [sendMessageList, setSendMessageList] = useState<messageListItf>([]);
  const [receiveMessageList, setReceiveMessageList] = useState<messageListItf>([]);
  
  const [allMessageListLastSeq, setAllMessageListLastSeq]  = useState(0);
  const [sendMessageListLastSeq, setSendMessageListLastSeq]  = useState(0);
  const [recMessageListLastSeq, setRecMessageListLastSeq]  = useState(0);

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
      messageSearch();
    }
  },[props.show])

  function close(){
    setIsOpen(false); 
    props.messageBoxModal(false);
  }

  function clickTabs(tabIndex:number){
    setSelectedAll({selectedYn:false, selectStyle:"border-b"});
    setSelectedRec({selectedYn:false, selectStyle:"border-b"});
    setSelectedSend({selectedYn:false, selectStyle:"border-b"});

    if(tabIndex === 0){
      setSelectedAll({selectedYn:true, selectStyle:"border-b-3"});
    }else if(tabIndex === 1){
      setSelectedRec({selectedYn:true, selectStyle:"border-b-3"});
    }else if(tabIndex === 2){
      setSelectedSend({selectedYn:true, selectStyle:"border-b-3"});
    }

    setSelectedTab(tabIndex);
  }

  async function messageSearch(){
    setAllMessageList([]);
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:0,
    }

    const retObj = await transactionAuth("get", "message/messagelistsearch", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        if(retObj.sendObj.resObj.length > 0){

          for(let i=0; i<retObj.sendObj.resObj.length; i++){
            retObj.sendObj.resObj.style = " h-[82px] "
            retObj.sendObj.resObj.messageCheckYn = false; 
          }
          const lastArr = retObj.sendObj.resObj.length-1;
          setAllMessageListLastSeq(retObj.sendObj.resObj[lastArr].message_seq);
          setAllMessageList(retObj.sendObj.resObj);
        }
      }
  }

  async function nextMessageSearch(){
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:allMessageListLastSeq,
    }

    const retObj = await transactionAuth("get", "message/messagelistsearch", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        // console.log(retObj.sendObj.resObj);
        if(retObj.sendObj.resObj.length > 0){

          for(let i=0; i<retObj.sendObj.resObj.length; i++){
            retObj.sendObj.resObj.style = " h-[82px] "
            retObj.sendObj.resObj.messageCheckYn = false; 
          }

          const lastArr = retObj.sendObj.resObj.length-1;
          setAllMessageListLastSeq(retObj.sendObj.resObj[lastArr].message_seq);
          setAllMessageList([...allMessageList, ...retObj.sendObj.resObj]);
        }


        
      }
  }

  async function allReceiveMessageCheck(index:number){
    const obj = {
      userseq:userStateSet.userseq,
      message_seq:allMessageList[index].message_seq,
      email:userStateSet.email,
    }

    // console.log(obj);
    const retObj = await transactionAuth("post", "message/receivemessagecheck", obj, "", false, false, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      const obj = retObj.sendObj.resObj.updateMessages;
      allMessageList[index] = {...allMessageList[index], msg_checkyn:obj.msg_checkyn, receive_time:obj.receive_time}
      setAllMessageList([...allMessageList]);
      unreadMessageCntSet.unreadMessageCntSet(retObj.sendObj.resObj.cnt)
    }

  }

  async function onclickCheckAllContent(index:number){
    //받은 메시지, 보낸 메시지 구분
    let sendMessageYn = false; //false:받은메시지, true:보낸메시지
    if(userStateSet.userseq === allMessageList[index].send_user_seq){
      sendMessageYn = true;
    }

    //보낸 메시지
    if(sendMessageYn){ 

      if(allMessageList[index].messageCheckYn){
        allMessageList[index].messageCheckYn = false;
        allMessageList[index].style = " h-[82px] "
      }else{
        allMessageList[index].messageCheckYn = true;
        allMessageList[index].style = " h-[155px] "
      }

      setAllMessageList([...allMessageList]);
      
    }else{ //받은 메시지인경우 미확인이면 msg_checkyn, receive_time 업데이트 처리한다.
      if(allMessageList[index].messageCheckYn){
        allMessageList[index].messageCheckYn = false;
        allMessageList[index].style = " h-[82px] "
        setAllMessageList([...allMessageList]);
      }else{
        allMessageList[index].messageCheckYn = true;
        allMessageList[index].style = " h-[155px] "

        if(!allMessageList[index].msg_checkyn){
          allReceiveMessageCheck(index);
        }else{
          setAllMessageList([...allMessageList]);
        }
      }
    }
  }

  //메시지 삭제
  async function onclickDeleteMessage(index:number){

    let sendMessageYn = false; //false:받은메시지, true:보낸메시지
    if(userStateSet.userseq === allMessageList[index].send_user_seq){
      sendMessageYn = true;
    }

    const obj = {
      userseq:userStateSet.userseq,
      sendMessageYn:sendMessageYn,
      message_seq:allMessageList[index].message_seq,
      email:userStateSet.email,
    }

    const retObj = await transactionAuth("post", "message/deletemessage", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      allMessageList.splice(index, 1);
      setAllMessageList([...allMessageList]);
      unreadMessageCntSet.unreadMessageCntSet(retObj.sendObj.resObj.cnt)
    }
  }

  useEffect(()=>{
    if(selectedTab===0){
      messageSearch();
    }else if(selectedTab===1){
      recMessageearch();
    }else if(selectedTab===2){
      sendMessageearch();
    }

  },[selectedTab])
  
  //받은 메시지 조회
  async function recMessageearch(){
    setReceiveMessageList([]);
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:0,
    }

    const retObj = await transactionAuth("get", "message/resmessagelistallsearch", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        if(retObj.sendObj.resObj.length > 0){

          for(let i=0; i<retObj.sendObj.resObj.length; i++){
            retObj.sendObj.resObj.style = " h-[82px] "
            retObj.sendObj.resObj.messageCheckYn = false; 
          }
          const lastArr = retObj.sendObj.resObj.length-1;
          setRecMessageListLastSeq(retObj.sendObj.resObj[lastArr].message_seq);
          setReceiveMessageList(retObj.sendObj.resObj);
        }
      }
  }
  //받은 메시지 다음 조회
  async function nextRecMessageearch(){
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:recMessageListLastSeq,
    }

    const retObj = await transactionAuth("get", "message/resmessagelistallsearch", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        // console.log(retObj.sendObj.resObj);
        if(retObj.sendObj.resObj.length > 0){

          for(let i=0; i<retObj.sendObj.resObj.length; i++){
            retObj.sendObj.resObj.style = " h-[82px] "
            retObj.sendObj.resObj.messageCheckYn = false; 
          }

          const lastArr = retObj.sendObj.resObj.length-1;
          setRecMessageListLastSeq(retObj.sendObj.resObj[lastArr].message_seq);
          setReceiveMessageList([...receiveMessageList, ...retObj.sendObj.resObj]);
        }


        
      }
  }

  //보낸 메시지 조회
  async function sendMessageearch(){
    setSendMessageList([]);
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:0,
    }

    const retObj = await transactionAuth("get", "message/sendmessagelistallsearch", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        if(retObj.sendObj.resObj.length > 0){

          for(let i=0; i<retObj.sendObj.resObj.length; i++){
            retObj.sendObj.resObj.style = " h-[82px] "
            retObj.sendObj.resObj.messageCheckYn = false; 
          }
          const lastArr = retObj.sendObj.resObj.length-1;
          setSendMessageListLastSeq(retObj.sendObj.resObj[lastArr].message_seq);
          setSendMessageList(retObj.sendObj.resObj);
        }
      }
  }
  //보낸 메시지 다음 조회
  async function nextSendMessageearch(){
    const obj = {
      userseq:userStateSet.userseq,
      lastSeq:sendMessageListLastSeq,
    }

    const retObj = await transactionAuth("get", "message/sendmessagelistallsearch", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        // console.log(retObj.sendObj.resObj);
        if(retObj.sendObj.resObj.length > 0){

          for(let i=0; i<retObj.sendObj.resObj.length; i++){
            retObj.sendObj.resObj.style = " h-[82px] "
            retObj.sendObj.resObj.messageCheckYn = false; 
          }

          const lastArr = retObj.sendObj.resObj.length-1;
          setSendMessageListLastSeq(retObj.sendObj.resObj[lastArr].message_seq);
          setSendMessageList([...sendMessageList, ...retObj.sendObj.resObj]);
        }


        
      }
  }

  //받은메시지 내용 조회
  async function onclickCheckRecContent(index:number){

    if(receiveMessageList[index].messageCheckYn){
      receiveMessageList[index].messageCheckYn = false;
      receiveMessageList[index].style = " h-[82px] "
      setReceiveMessageList([...receiveMessageList]);
    }else{
      receiveMessageList[index].messageCheckYn = true;
      receiveMessageList[index].style = " h-[155px] "

      if(!receiveMessageList[index].msg_checkyn){
        resReceiveMessageCheck(index);
      }else{
        setReceiveMessageList([...receiveMessageList]);
      }
    }
  }


  //첫번째 내용 확인시 확인 업데이트
  async function resReceiveMessageCheck(index:number){
    const obj = {
      userseq:userStateSet.userseq,
      message_seq:receiveMessageList[index].message_seq,
      email:userStateSet.email,
    }

    const retObj = await transactionAuth("post", "message/receivemessagecheck", obj, "", false, false, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      const obj = retObj.sendObj.resObj.updateMessages;
      receiveMessageList[index] = {...receiveMessageList[index], msg_checkyn:obj.msg_checkyn, receive_time:obj.receive_time}
      setReceiveMessageList([...receiveMessageList]);
      unreadMessageCntSet.unreadMessageCntSet(retObj.sendObj.resObj.cnt)
    }

  }

  //받은메시지 삭제
  async function onclickDeleteRedMessage(index:number){
    let sendMessageYn = false; //false:받은메시지, true:보낸메시지
    const obj = {
      userseq:userStateSet.userseq,
      sendMessageYn:sendMessageYn,
      message_seq:receiveMessageList[index].message_seq,
      email:userStateSet.email,
    }

    const retObj = await transactionAuth("post", "message/deletemessage", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      receiveMessageList.splice(index, 1);
      setReceiveMessageList([...receiveMessageList]);
      unreadMessageCntSet.unreadMessageCntSet(retObj.sendObj.resObj.cnt)
    }
  }

  //보낸메시지 내용 조회
  async function onclickCheckSendContent(index:number){
    if(sendMessageList[index].messageCheckYn){
        sendMessageList[index].messageCheckYn = false;
        sendMessageList[index].style = " h-[82px] "
      }else{
        sendMessageList[index].messageCheckYn = true;
        sendMessageList[index].style = " h-[155px] "
      }

      setSendMessageList([...sendMessageList]);
  }

  //보낸메시지 삭제
  async function onclickDeleteSendMessage(index:number){
    let sendMessageYn = true; //false:받은메시지, true:보낸메시지

    const obj = {
      userseq:userStateSet.userseq,
      sendMessageYn:sendMessageYn,
      message_seq:sendMessageList[index].message_seq,
      email:userStateSet.email,
    }

    const retObj = await transactionAuth("post", "message/deletemessage", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      sendMessageList.splice(index, 1);
      setSendMessageList([...sendMessageList]);
      unreadMessageCntSet.unreadMessageCntSet(retObj.sendObj.resObj.cnt)
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

          <div className=" w-[500px]  h-[490px] shadow-md border border-gray-500 rounded-md px-5 pt-5 flex flex-col
          bg-white 
          "
          // onClick={()=>bookDetailPage(elem.book_seq)}
          >
            <div className="flex flex-col h-[415px]   ">
              <div className="flex justify-start text-[12px] font-bold text-[#4A6D88] h-[30px] ">
                <div className={ selectedAll.selectStyle + `  border-b-[#4A6D88]  px-2 cursor-pointer
                   `}
                  onClick={()=>clickTabs(0)}
                  >{(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[1]:""}</div>
                <div className={ selectedRec.selectStyle + `  border-b-[#4A6D88]  px-2 cursor-pointer
                   `}
                  onClick={()=>clickTabs(1)}
                  >{(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[2]:""}</div>
                <div className={ selectedSend.selectStyle + `  border-b-[#4A6D88]  px-2 cursor-pointer
                   `}
                  onClick={()=>clickTabs(2)}
                  >{(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[3]:""}</div>
                  <div className="flex-1 ">
                    <div className="mt-1 w-full flex justify-end  ">
                      <div className=""> 
                        <ButtonMessage text={
                          (languageStateSet.main_language_set[14])?languageStateSet.main_language_set[14].text[0]:""
                        }
                        onClick={()=>close()}
                        /> 
                      </div>
                    </div>
                  </div>
              </div>
              <div className="flex justify-center items-start w-full h-[370px] overflow-y-auto mt-2  ">
                {/* All */}
                {
                  (selectedTab===0)?
                  <div className="flex flex-col w-full">

                    {
                      allMessageList.map((elem, index)=>{
                        return (
                          <div key={index+"allMessage"} className={elem.style + ` border border-gray-400 bg-white w-full  flex justify-start  rounded-sm shadow-md my-1 overflow-hidden`}>
                            
                            <div className=" flex w-full flex-col text-xs p-2 text-[#4A6D88]  ">
                              <div className="w-full flex justify-end ">

                              </div>
                              <div className="flex ">
                                
                                {/* 보낸 메시지 */}
                                {(userStateSet.userseq === elem.send_user_seq)?
                                <div className="w-full flex justify-between text-[10px] font-normal">
                                  {/* 받은사람 */}
                                  <div className="w-full line-clamp-1 break-all  ">{(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[5]:""
                                  + elem.receive_userinfo.username}  
                                  </div>
                                  <div className=" text-[10px] font-normal w-[230px] flex justify-end">
                                  {/* 보낸 메시지 확인이 안된경우 미확인 표시 */}
                                  {
                                    (elem.msg_checkyn)?
                                    <div>
                                      {/* 확인일자 */}
                                      {(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[7]+ " : " +getDateContraction3(elem.receive_time)
                                      :""
                                        }
                                    </div>
                                    :<div className="font-bold ">
                                      {/* 미확인 */}
                                    {(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[6]:""}
                                    </div>
                                  } 
                                  </div>
                                </div>
                                :
                                <div className="w-full flex justify-between text-[10px] font-normal">
                                  {/* 보낸사람 */}
                                  <div className="w-full line-clamp-1 break-all  ">{(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[4]:""
                                   + elem.send_userinfo.username}  
                                    {/* <p className="w-full line-clamp-1 break-all">{  elem.send_userinfo.username  }</p> */}
                                  </div>
                                  <div className=" text-[10px] font-normal w-[240px] flex justify-end ">
                                  {
                                    (elem.msg_checkyn)?
                                    <div className="">
                                      {(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[7] + " : " + getDateContraction3(elem.receive_time)
                                      :""   }
                                    </div>
                                    :<div className="font-bold relative  ">
                                      <span className="absolute inline-flex h-[12px] w-[12px] animate-ping rounded-full bg-blue-400 opacity-75 left-[50%]"></span>
                                      {(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[6]:""}
                                    </div>
                                  } 
                                  </div>
                                </div>
                                }
                              </div>
                              <div className="w-full flex justify-between font-bold text-[12px] mt-1">
                                <div className="w-full flex ">
                                  <p className="w-full  line-clamp-1 break-all">{  elem.title }</p>
                                </div>
                              </div>
                              <div className="flex justify-between border-t border-t-gray-200 pt-1 mt-1 ">
                                <div className="w-1/3 flex justify-between items-center ">
                                  
                                </div>
                                <div className="w-1/3 flex">
                                  <div className="w-full flex justify-center items-center"
                                  // onClick={()=>onclickCheckAllContent(index)}
                                  >
                                    <div className="pt-1 px-1 ">
                                      {/* 내용보기 */}
                                      <ButtonMessageSee text={(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[8]:""}
                                      onClick={()=>onclickCheckAllContent(index)}
                                      />
                                    </div>

                                    <div className="pt-1 px-1">
                                      {/* 삭제 */}
                                      <ButtonMessageSee text={(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[9]:""}
                                      onClick={()=>onclickDeleteMessage(index)}
                                      />
                                    </div>

                                  </div> 
                                </div>
                                <div className="w-1/3 flex justify-end items-center ">
                                {
                                  (userStateSet.userseq === elem.send_user_seq)?
                                  <div className=" text-[15px] h-[15px] text-red-400 "><FaArrowCircleUp /></div>
                                  :<div className=" text-[15px]  h-[15px] text-blue-400 "><FaArrowCircleDown /></div>
                                }
                                </div>
                              </div>
                              
                              
                              {
                                (elem.messageCheckYn)?
                                <div className="w-full flex h-[65px] overflow-y-auto bg-gray-50 rounded-sm mt-1 p-1 border border-[#CFD8DC] ">
                                  {elem.message}
                                </div>:<></>
                              }
                            </div>
                            
                            
                          </div>
                        )
                      })
                    }
                    
                  </div>
                  :
                  (selectedTab===1)?
                  <div className="flex flex-col w-full">

                    {
                      receiveMessageList.map((elem, index)=>{
                        return (
                          <div key={index+"allMessage"} className={elem.style + ` border border-gray-400 w-full bg-white flex justify-start  rounded-sm shadow-md my-1 overflow-hidden`}>
                            
                            <div className=" flex w-full flex-col text-xs p-2 text-[#4A6D88]  ">
                              <div className="w-full flex justify-end ">

                              </div>
                              <div className="flex ">
                                
                                
                                <div className="w-full flex justify-between text-[10px] font-normal">
                                  <div className="w-full line-clamp-1 break-all  ">{`보낸사람 : ` + elem.send_userinfo.username}  
                                  </div>
                                  <div className=" text-[10px] font-normal w-[240px] flex justify-end ">
                                  {
                                    (elem.msg_checkyn)?
                                    <div>
                                      {(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[7] + " : " + getDateContraction3(elem.receive_time)
                                      :""
                                         }
                                    </div>
                                    :<div className="font-bold relative ">
                                      <span className="absolute inline-flex h-[12px] w-[12px] animate-ping rounded-full bg-blue-400 opacity-75 left-[50%]"></span>
                                      {(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[6]:""}
                                    </div>
                                  } 
                                  </div>
                                </div>
                                
                              </div>
                              <div className="w-full flex justify-between font-bold text-[12px] mt-1">
                                <div className="w-full flex ">
                                  <p className="w-full  line-clamp-1 break-all">{  elem.title }</p>
                                </div>
                              </div>

                              <div className="flex justify-between border-t border-t-gray-200 pt-1 mt-1 ">
                                <div className="w-1/3 flex justify-between items-center ">
                                  
                                </div>
                                <div className="w-1/3 flex">
                                  <div className="w-full flex justify-center items-center"
                                  >
                                    <div className="pt-1 px-1">
                                      <ButtonMessageSee text={(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[8]:""}
                                      onClick={()=>onclickCheckRecContent(index)}
                                      />
                                    </div>

                                    <div className=" pt-1 px-1">
                                      <ButtonMessageSee text={(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[9]:""}
                                      onClick={()=>onclickDeleteRedMessage(index)}
                                      />
                                    </div>

                                  </div> 
                                </div>
                                <div className="w-1/3 flex justify-end items-center ">
                                
                                  <div className=" text-[15px]  h-[15px] text-blue-400 "><FaArrowCircleDown /></div>
                                
                                </div>
                              </div>
                              {
                                (elem.messageCheckYn)?
                                <div className="w-full flex h-[65px] overflow-y-auto bg-gray-50 rounded-sm mt-1 p-1 border border-[#CFD8DC] ">
                                  {elem.message}
                                </div>:<></>
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  :
                  (selectedTab===2)?
                  <div className="flex flex-col w-full">

                    {
                      sendMessageList.map((elem, index)=>{
                        return (
                          <div key={index+"allMessage"} className={elem.style + ` border border-gray-400 w-full bg-white flex justify-start  rounded-sm shadow-md my-1 overflow-hidden`}>
                            
                            <div className=" flex w-full flex-col text-xs p-2 text-[#4A6D88]  ">
                              <div className="w-full flex justify-end ">

                              </div>
                              <div className="flex ">
                                
                                {/* 보낸 메시지 */}
                                
                                <div className="w-full flex justify-between text-[10px] font-normal">
                                  <div className="w-full line-clamp-1 break-all  ">{(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[5]:""
                                  + elem.receive_userinfo.username}  
                                  </div>
                                  <div className=" text-[10px] font-normal w-[230px] flex justify-end">
                                  {/* 보낸 메시지 확인이 안된경우 미확인 표시 */}
                                  {
                                    (elem.msg_checkyn)?
                                    <div>
                                      {(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[7] + " : " + getDateContraction3(elem.receive_time)
                                      :""
                                       + getDateContraction3(elem.receive_time)  }
                                    </div>
                                    :<div className="font-bold ">
                                    {(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[6]:""}
                                    </div>
                                  } 
                                  </div>
                                </div>
                                
                              </div>
                              <div className="w-full flex justify-between font-bold text-[12px] mt-1">
                                <div className="w-full flex ">
                                  <p className="w-full  line-clamp-1 break-all">{  elem.title }</p>
                                </div>
                              </div>

                              <div className="flex justify-between border-t border-t-gray-200 pt-1 mt-1 ">
                                <div className="w-1/3 flex justify-between items-center ">
                                  
                                </div>
                                <div className="w-1/3 flex">
                                  <div className="w-full flex justify-center items-center"
                                  >
                                    <div className="pt-1 px-1">
                                      <ButtonMessageSee text={(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[8]:""}
                                      onClick={()=>onclickCheckSendContent(index)}
                                      />
                                    </div>

                                    <div className=" pt-1 px-1">
                                      <ButtonMessageSee text={(languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[9]:""}
                                      onClick={()=>onclickDeleteSendMessage(index)}
                                      />
                                    </div>

                                  </div> 
                                </div>
                                <div className="w-1/3 flex justify-end items-center ">

                                  <div className=" text-[15px] h-[15px] text-red-400 "><FaArrowCircleUp /></div>

                                </div>
                              </div>
                              
                              
                              {
                                (elem.messageCheckYn)?
                                <div className="w-full flex h-[65px] overflow-y-auto bg-gray-50 rounded-sm mt-1 p-1 border border-[#CFD8DC] ">
                                  {elem.message}
                                </div>:<></>
                              }
                            </div>
                            
                            
                          </div>
                        )
                      })
                    }   
                  </div>
                  :""
                }
              </div>
            </div>
            <div className="h-[30px] w-full flex justify-end pe-1  ">
              <div>
                <ButtonMessageNext text={
                  (languageStateSet.main_language_set[16])?languageStateSet.main_language_set[16].text[0]:""
                }
                onClick={
                  (selectedTab===0)?()=>nextMessageSearch()
                  :(selectedTab===1)?()=>nextRecMessageearch()
                  :(selectedTab===2)?()=>nextSendMessageearch()
                  :''
                }
                />
              </div>
            </div>
            {/* 닫기  */}
            {/* <div className="mt-1 w-full flex justify-center  ">
              <div className=""> 
                <ButtonMessage text={
                  (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[14].text[0]:""
                }
                onClick={()=>close()}
                /> 
              </div>
            </div> */}
            
            
          </div>

        </div>
        
      </div>  
       
    </Portal>
  );
}

export default MessageBox;



