'use client';

import { useState } from "react";
import ReadBookList from "./ReadBookList";
import SavedWordList from "./SavedWordList";
import SavedSentenceList from "./SavedSentenceList";
import Learn from "./Learn";
import languageState from "@/app/store/language";

const Main = (props:any) => {

  const languageStateSet = languageState();  
  const userStateSet = props.userStateSet;

  const [selectedTab, setSelectedTab] = useState({
    tab1Style:" border-b-3 border-b-[#4A6D88] font-bold ",
    tab2Style:"",
    tab3Style:"",
    tab4Style:"",
  });

  const [currentTab, setCurrentTab] = useState(1);

  function tabClick(tabId:number){
    
    if(currentTab === tabId){
      return;
    }

    const styleStr = "border-b-3 border-b-[#4A6D88] font-bold";
    setSelectedTab({tab1Style:"",tab2Style:"",tab3Style:"",tab4Style:"",});
    
    if(tabId===1){
      setSelectedTab({tab1Style:styleStr,tab2Style:"",tab3Style:"",tab4Style:"",});
    }else if(tabId===2){
      setSelectedTab({tab1Style:"",tab2Style:styleStr,tab3Style:"",tab4Style:"",});
    }else if(tabId===3){
      setSelectedTab({tab1Style:"",tab2Style:"",tab3Style:styleStr,tab4Style:"",});
    }else if(tabId===4){
      setSelectedTab({tab1Style:"",tab2Style:"",tab3Style:"",tab4Style:styleStr,});
    }

    setCurrentTab(tabId);

  }

  return(
    <>
      <div className="">
        <div className="h-[55px] w-full"></div> {/* 상단 헤더 만큼 아래로 */}
        <div className="h-full flex flex-col items-center mt-5    ">
        {/* 탭 책리스트 : 읽은 책 리스트, 저장한 단어 리스트, 저장한 문장 리스트, 학습하기 */}

          <div className=" flex justify-center  mt-5  text-[#4A6D88] h-[50px]
          w-full 2xl:w-[1050px]  xl:w-[1050px]  lg:w-[790px]  md:w-[530px]  sm:w-[530px]
          text-xs 2xl:text-base  xl:text-base  lg:text-base  md:text-sm  sm:text-sm
          ">
            <button className={selectedTab.tab1Style +` px-3 text-center cursor-pointer 
            w-[25%] 2xl:w-[200px]  xl:w-[200px]  lg:w-[200px]  md:w-[200px]  sm:w-[160px]
            `}
            onClick={()=>tabClick(1)}
            >
            {/* 책 리스트 */}
            {(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[9].text[0]:""}
            </button>
            
            <button className={selectedTab.tab2Style +` px-3 text-center cursor-pointer 
            w-[25%] 2xl:w-[200px]  xl:w-[200px]  lg:w-[200px]  md:w-[160px]  sm:w-[160px]
            `}
            onClick={()=>tabClick(2)}
            >
            {/* 단어 리스트 */}
            {(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[9].text[1]:""}
            </button>

            <button className={selectedTab.tab3Style +` px-3 text-center cursor-pointer 
            w-[25%] 2xl:w-[200px]  xl:w-[200px]  lg:w-[200px]  md:w-[160px]  sm:w-[160px]
            `}
            onClick={()=>tabClick(3)}
            >
            {/* 문장 리스트 */}
            {(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[9].text[2]:""}
            </button>

            <button className={selectedTab.tab4Style +` px-3 text-center cursor-pointer 
            w-[25%] 2xl:w-[200px]  xl:w-[200px]  lg:w-[200px]  md:w-[160px]  sm:w-[160px]
            `}
            onClick={()=>tabClick(4)}
            >
            {/* 학습하기 */}
            {(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[9].text[3]:""}
            </button>

          </div>
          <div className=" flex justify-center pb-20
          w-full 2xl:w-[1050px]  xl:w-[1050px]  lg:w-[790px]  md:w-[530px]  sm:w-[530px]
          ">
            <div style={{
              display: (currentTab === 1)?"block":"none"    
            }}><ReadBookList userStateSet={userStateSet}/></div>
            <div style={{
              display: (currentTab === 2)?"block":"none"    
            }}><SavedWordList userStateSet={userStateSet}/></div>
            <div style={{
              display: (currentTab === 3)?"block":"none"    
            }}><SavedSentenceList userStateSet={userStateSet}/></div>
            <div style={{
              display: (currentTab === 4)?"block":"none"    
            }}><Learn userStateSet={userStateSet}/></div>

          {/* {
            (currentTab === 1)?
            <div style={{
              display: {

              }
            }}><ReadBookList userStateSet={userStateSet}/></div>
            
            :(currentTab === 2)?<SavedWordList/>
            :(currentTab === 3)?<SavedSentenceList/>
            :(currentTab === 4)?<Learn/>
            :""

          } */}

          
          
          
          
          
          
          </div>
        </div>
      </div>
    </>
  );
};

export default Main