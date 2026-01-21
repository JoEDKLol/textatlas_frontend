

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
import { ButtonHisBookList, ButtonMessage, ButtonMessageSee } from "../design/buttons/Buttons";
import { useRouter } from "next/navigation";
import { transactionAuth } from "@/app/utils/axiosAuth";
import loadingScreenEmptyShow from "@/app/store/loadingScreen_empty";
import { CiImageOn } from "react-icons/ci";


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
  const userStateSet = props.userStateSet;

  const [selectedAll, setSelectedAll] = useState<tabStyle>({selectedYn:true, selectStyle:"border-b-3"});
  const [selectedRec, setSelectedRec] = useState<tabStyle>({selectedYn:false, selectStyle:"border-b"});
  const [selectedSend, setSelectedSend] = useState<tabStyle>({selectedYn:false, selectStyle:"border-b"});
  const [selectedTab, setSelectedTab] = useState(0);

  const [currentPageNumber,setCurrentPageNumber] = useState(0);

  const [allMessageList, setAllMessageList] = useState<messageListItf>([]);
  const [sendMessageList, setSendMessageList] = useState<messageListItf>([]);
  const [receiveMessageList, setReceiveMessageList] = useState<messageListItf>([]);
  

  useEffect(()=>{
    if(props.show){ //화면 시작 
      messageSearch();
    }
  },[props.show])

  function close(){
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
    const obj = {
      userseq:userStateSet.userseq,
      page:currentPageNumber,
    }

    const retObj = await transactionAuth("get", "message/messagelistsearch", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        console.log(retObj.sendObj.resObj);
        if(retObj.sendObj.resObj.length > 0){

          for(let i=0; i<retObj.sendObj.resObj.length; i++){
            retObj.sendObj.resObj.style = " h-[70px] "
            retObj.sendObj.resObj.messageCheckYn = false; 
          }

          setAllMessageList(retObj.sendObj.resObj);
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
    const retObj = await transactionAuth("post", "message/receivemessagecheck", obj, "", false, true, screenShow, errorShow);
      if(retObj.sendObj.success === "y"){
        console.log(retObj.sendObj.resObj);
        const obj = retObj.sendObj.resObj

        // if(retObj.sendObj.resObj.length > 0){

        //   for(let i=0; i<retObj.sendObj.resObj.length; i++){
        //     retObj.sendObj.resObj.style = " h-[70px] "
        //     retObj.sendObj.resObj.messageCheckYn = false; 
        //   }

        //   setAllMessageList(retObj.sendObj.resObj);
        // }
        allMessageList[index] = {...allMessageList[index], msg_checkyn:obj.msg_checkyn, receive_time:obj.receive_time}
        setAllMessageList([...allMessageList]);
      }
  }

  async function onclickCheckAllContent(index:number){
    //받은 메시지, 보낸 메시지 구분
    let sendMessageYn = false; //0:받은메시지, 1:보낸메시지
    if(userStateSet.userseq === allMessageList[index].send_user_seq){
      sendMessageYn = true;
    }

    //보낸 메시지
    if(sendMessageYn){ 

      if(allMessageList[index].messageCheckYn){
        allMessageList[index].messageCheckYn = false;
        allMessageList[index].style = " h-[85px] "
      }else{
        allMessageList[index].messageCheckYn = true;
        allMessageList[index].style = " h-[155px] "
      }

      setAllMessageList([...allMessageList]);
      
    }else{ //받은 메시지인경우 미확인이면 msg_checkyn, receive_time 업데이트 처리한다.
      if(allMessageList[index].messageCheckYn){
        allMessageList[index].messageCheckYn = false;
        allMessageList[index].style = " h-[85px] "
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

  return (
    <Portal
      selector="portal"
      show={props.show}>
      <div className="static ">
        <div className='  fixed top-0 right-0 left-0 z-40 w-[100%] h-[100%] border flex justify-center items-center    '>

          {/* <div className="border h-[350px] w-[250px]">
            <div onClick={()=>close()}>닫기</div>
          </div> */}

          <div className=" w-[500px]  h-[500px] shadow-sm border border-gray-100 shadow-[#4A6D88] rounded-md px-5 pt-5 flex flex-col
          bg-white 
          "
          // onClick={()=>bookDetailPage(elem.book_seq)}
          >
            <div className="flex flex-col h-[415px]   ">
              <div className="flex justify-start text-sm font-bold text-[#4A6D88] h-[30px] ">
                <div className={ selectedAll.selectStyle + `  border-b-[#4A6D88]  px-2 cursor-pointer
                   `}
                  onClick={()=>clickTabs(0)}
                  >전체</div>
                <div className={ selectedRec.selectStyle + `  border-b-[#4A6D88]  px-2 cursor-pointer
                   `}
                  onClick={()=>clickTabs(1)}
                  >받은메시지</div>
                <div className={ selectedSend.selectStyle + `  border-b-[#4A6D88]  px-2 cursor-pointer
                   `}
                  onClick={()=>clickTabs(2)}
                  >보낸메시지</div>
              </div>
              <div className="flex justify-center items-start w-full h-[370px] overflow-y-auto mt-2  ">
                {/* All */}
                {
                  (selectedTab===0)?
                  <div className="flex flex-col w-full">

                    {
                      allMessageList.map((elem, index)=>{
                        return (
                          <div key={index+"allMessage"} className={elem.style + ` border border-gray-100 w-full  flex justify-start  rounded-md shadow-md my-1 overflow-hidden`}>
                            {/* <div className="flex relative h-[110px] w-[110px] rounded-l-md -z-0 border-r border-r-gray-200 ">
                              <div className="flex absolute h-[110px] w-[110px] rounded-l-md -z-0 border-r border-r-gray-200 ">
                              { 
                                (userStateSet.userseq === elem.send_user_seq)? 
                                // 보낸 편지 - 받는 사람의 정보가 표시
                                ((elem.receive_userinfo.userthumbImg)?
                                  <Image
                                  src={
                                    elem.receive_userinfo.userthumbImg
                                  }
                                  alt=""
                                  layout="fill" 
                                  style={{  borderRadius:"5px",}}
                                  priority
                                  />
                                  :<div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                                )
                                // 받은 편지 - 보낸 사람의 정보가 표시
                                :((elem.send_userinfo.userthumbImg)?
                                  <Image
                                  src={
                                    elem.send_userinfo.userthumbImg
                                  }
                                  alt=""
                                  layout="fill" 
                                  style={{  borderRadius:"5px",}}
                                  priority
                                  />
                                  :<div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                                )

                              }
                              </div>
                            </div> */}
                            {/* <div className="border w-[30px]">

                            </div> */}
                            <div className=" flex w-full flex-col text-xs p-2 text-[#4A6D88]  ">
                              <div className="w-full flex justify-end ">
                              {/* {(userStateSet.userseq === elem.send_user_seq)?
                              <div className="text-[10px] font-normal">
                                
                                {
                                  (elem.msg_checkyn)?
                                  <div>
                                    {` 확인일자 : ` + getDateContraction3(elem.receive_time)  }
                                  </div>
                                  :<div>
                                  미확인
                                  </div>
                                } 
                              </div>
                              :
                              <div className="text-[10px] font-normal">
                                {
                                  (elem.msg_checkyn)?
                                  <div>
                                    {` 확인일자 : ` + getDateContraction3(elem.receive_time)  }
                                  </div>
                                  :<div>
                                    미확인
                                  </div>
                                } 
                              </div>
                              } */}
                              </div>
                              <div className="flex ">
                                
                                {/* 보낸 메시지 */}
                                {(userStateSet.userseq === elem.send_user_seq)?
                                <div className="w-full flex justify-between text-[10px] font-normal">
                                  <div className="w-full line-clamp-1 break-all  ">{`받은사람 : ` + elem.receive_userinfo.username}  
                                    {/* <p className="w-full line-clamp-1 break-all">{  elem.send_userinfo.username  }</p> */}
                                  </div>
                                  <div className=" text-[10px] font-normal w-[230px] flex justify-end">
                                  {/* 보낸 메시지 확인이 안된경우 미확인 표시 */}
                                  {
                                    (elem.msg_checkyn)?
                                    <div>
                                      {` 확인일자 : ` + getDateContraction3(elem.receive_time)  }
                                    </div>
                                    :<div>
                                    미확인
                                    </div>
                                  } 
                                  </div>
                                </div>
                                :
                                <div className="w-full flex justify-between text-[10px] font-normal">
                                  <div className="w-full line-clamp-1 break-all  ">{`보낸사람 : ` + elem.send_userinfo.username}  
                                    {/* <p className="w-full line-clamp-1 break-all">{  elem.send_userinfo.username  }</p> */}
                                  </div>
                                  <div className=" text-[10px] font-normal w-[230px] flex justify-end ">
                                  {
                                    (elem.msg_checkyn)?
                                    <div>
                                      {` 확인일자 : ` + getDateContraction3(elem.receive_time)  }
                                    </div>
                                    :<div>
                                      미확인
                                    </div>
                                  } 
                                  </div>
                                </div>
                                }
                              </div>
                              <div className="w-full flex justify-between font-bold text-sm mt-1">
                                <div className="w-full flex ">
                                  <p className="w-full  line-clamp-1 break-all">{  elem.title }</p>
                                </div>
                              </div>
                              {/* <div className="line-clamp-1 font-bold break-all">
                                { `제목 : ` + elem.title}
                              </div> */}
                              {/* <div className=" flex flex-col ">
                                <div className="flex h-[65px] overflow-y-auto bg-gray-50 rounded-sm ">
                                  {elem.message}
                                </div>
                              </div> */}
                              <div className="flex justify-between border-t border-t-gray-200 pt-1 mt-1 ">
                                <div className="w-1/3 flex justify-between items-center ">
                                  
                                </div>
                                <div className="w-1/3 flex">
                                  <div className="w-full flex justify-center items-center"
                                  // onClick={()=>onclickCheckAllContent(index)}
                                  >
                                    <div className="w-[60px] pt-1">
                                      <ButtonMessageSee text={"내용보기"}
                                      onClick={()=>onclickCheckAllContent(index)}
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
                                <div className="w-full flex h-[65px] overflow-y-auto bg-gray-100 rounded-sm mt-1 p-1 ">
                                  {elem.message}
                                </div>:<></>
                              /* <div className=""
                              >
                                
                              </div> */}
                            </div>
                            
                            
                          </div>
                        )
                      })
                    }

                    

                    

                    

                    
                  </div>:
                  (selectedTab===1)?
                  <>
                    
                  </>
                  :
                  (selectedTab===2)?
                  <>
                    
                  </>
                  :""
                }
                

              </div>
            </div>

           
            
            
            
            
            <div className="h-[30px] w-full ">페이징</div>
            <div className="mt-2 w-full flex justify-center  ">
              <div className=""> {/* 닫기  */}
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

export default MessageBox;



