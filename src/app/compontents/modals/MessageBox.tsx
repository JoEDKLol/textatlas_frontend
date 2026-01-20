

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

interface tabStyle {
  selectedYn:boolean
  selectStyle:string
}

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

          <div className=" w-[95%] h-[430px] shadow-sm border border-gray-100 shadow-[#4A6D88] rounded-md px-5 pt-5 flex flex-col
          bg-white 
          "
          // onClick={()=>bookDetailPage(elem.book_seq)}
          >
            <div className="flex flex-col h-[330px] ">
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
              <div className="flex flex-col w-full h-[300px]  py-3">
                {/* All */}
                {
                  (selectedTab===0)?
                  <>
                    <div className="flex w-full justify-between text-xs font-bold border-b border-b-gray-200 bg-gray-100">
                      <div className="flex w-[25px]  justify-center items-center h-[25px] cursor-pointer ">
                        <div className="w-[10px] h-[10px] border bg-white rounded-[2px]"></div>
                      </div>
                      <div className="flex w-[30px]  justify-center items-center h-[25px] ">No</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px] ">형태</div>
                      <div className="flex-1 justify-items-center  h-[25px]" >
                        <div className="w-full  flex justify-center items-center h-[25px]">제목</div>
                      </div>
                      <div className="flex w-[60px]  justify-center items-center h-[25px]">사용자</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]">상태</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]">시간</div>
                    </div>
                    <div className="flex w-full justify-between text-xs">
                      <div className="flex w-[25px]  justify-center items-center h-[25px] cursor-pointer ">
                        <div className="w-[10px] h-[10px] border bg-white rounded-[2px]"></div>
                      </div>
                      <div className="flex w-[30px]  justify-center items-center h-[25px] "></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px] "></div>
                      <div className="flex-1 justify-items-center  h-[25px]" >
                        <div className="w-full  flex justify-center items-center h-[25px]"></div>
                      </div>
                      <div className="flex w-[60px]  justify-center items-center h-[25px]"></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]"></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]"></div>
                    </div>
                  </>:
                  (selectedTab===1)?
                  <>
                    <div className="flex w-full justify-between text-xs font-bold border-b border-b-gray-200 bg-gray-100">
                      <div className="flex w-[25px]  justify-center items-center h-[25px] cursor-pointer ">
                        <div className="w-[10px] h-[10px] border bg-white rounded-[2px]"></div>
                      </div>
                      <div className="flex w-[30px]  justify-center items-center h-[25px] ">No</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px] ">형태</div>
                      <div className="flex-1 justify-items-center  h-[25px]" >
                        <div className="w-full  flex justify-center items-center h-[25px]">제목</div>
                      </div>
                      <div className="flex w-[60px]  justify-center items-center h-[25px]">사용자</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]">상태</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]">시간</div>
                    </div>
                    <div className="flex w-full justify-between text-xs">
                      <div className="flex w-[25px]  justify-center items-center h-[25px] cursor-pointer ">
                        <div className="w-[10px] h-[10px] border bg-white rounded-[2px]"></div>
                      </div>
                      <div className="flex w-[30px]  justify-center items-center h-[25px] "></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px] "></div>
                      <div className="flex-1 justify-items-center  h-[25px]" >
                        <div className="w-full  flex justify-center items-center h-[25px]"></div>
                      </div>
                      <div className="flex w-[60px]  justify-center items-center h-[25px]"></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]"></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]"></div>
                    </div>
                  </>
                  :
                  (selectedTab===2)?
                  <>
                    <div className="flex w-full justify-between text-xs font-bold border-b border-b-gray-200 bg-gray-100">
                      <div className="flex w-[25px]  justify-center items-center h-[25px] cursor-pointer ">
                        <div className="w-[10px] h-[10px] border bg-white rounded-[2px]"></div>
                      </div>
                      <div className="flex w-[30px]  justify-center items-center h-[25px] ">No</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px] ">형태</div>
                      <div className="flex-1 justify-items-center  h-[25px]" >
                        <div className="w-full  flex justify-center items-center h-[25px]">제목</div>
                      </div>
                      <div className="flex w-[60px]  justify-center items-center h-[25px]">사용자</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]">상태</div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]">시간</div>
                    </div>
                    <div className="flex w-full justify-between text-xs">
                      <div className="flex w-[25px]  justify-center items-center h-[25px] cursor-pointer ">
                        <div className="w-[10px] h-[10px] border bg-white rounded-[2px]"></div>
                      </div>
                      <div className="flex w-[30px]  justify-center items-center h-[25px] "></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px] "></div>
                      <div className="flex-1 justify-items-center  h-[25px]" >
                        <div className="w-full  flex justify-center items-center h-[25px]"></div>
                      </div>
                      <div className="flex w-[60px]  justify-center items-center h-[25px]"></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]"></div>
                      <div className="flex w-[50px]  justify-center items-center h-[25px]"></div>
                    </div> 
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



