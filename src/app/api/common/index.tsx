"use client";

import Hearder from "@/app/compontents/home/Header";
import { languageSet } from "@/app/jsons/languageSet";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import loadingScreenEmptyShow from "@/app/store/loadingScreen_empty";
import userState from "@/app/store/user";
import { transaction } from "@/app/utils/axios";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { getAccessToken, storeAccessToken } from "@/app/utils/common";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
// import { accesstokenState } from "@/app/store/token";
// import { getAccessToken, storeAccessToken } from "@/app/utils/common";
// import { transaction } from "@/app/utils/axios";
// import loadingScreenShow from "@/app/store/loadingScreen";
// import errorScreenShow from "@/app/store/errorScreen";
// import userState from "@/app/store/user";
// import { transactionAuth } from "@/app/utils/axiosAuth";

/*
    모든페이지에서 호출되는 공통 페이지
*/
const CommonTransaction = ({ children }: any) => {

  const languageStateSet = languageState();
  const screenShow = loadingScreenShow();
  const screenShow2 = loadingScreenEmptyShow();
  const errorShow = errorScreenShow();

  const path = usePathname();
  const userStateSet = userState();

  

  //로컬스토어에 기존에 저장된 언어가 있는 경우 전역에 저장
  useEffect(()=>{

    if(!localStorage.getItem("textAtlasLanguage")){
      languageStateSet.setCurrentLang("us");
      localStorage.setItem('textAtlasLanguage', "us");
    }else{
      languageStateSet.setCurrentLang(localStorage.getItem("textAtlasLanguage"));
    }
      
    //페이지 최초 실행시 언어셋 가져온다.
    // getLanguageSet();  //추후에 DB에서 가져오는 걸로 처리 현재는 파일에서 가져옴

    // console.log(languageSet);

    languageStateSet.setLanguage(languageSet);

    const textAtlasLanguage = localStorage.getItem("textAtlasLanguage")
    if(textAtlasLanguage === "us"){
      // console.log("us");
      languageStateSet.setMainLanguageSet(languageSet.text_by_language_us);
    }else if(textAtlasLanguage === "kr"){
      // console.log("kr");
      languageStateSet.setMainLanguageSet(languageSet.text_by_language_kr);
    }else if(textAtlasLanguage === "mx"){
      // console.log("mx");
      languageStateSet.setMainLanguageSet(languageSet.text_by_language_mx);
    }else{
      // console.log("us");
      languageStateSet.setMainLanguageSet(languageSet.text_by_language_us);
    }



  },[]);



  //언어셋 가져오는 함수
  async function getLanguageSet(){
    const retObj = await transaction("get", "getlanguageset", {}, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      const reObj = retObj.sendObj.resObj
      const obj = {
        text_by_language_us:reObj.text_by_language_us,
        text_by_language_kr:reObj.text_by_language_kr,
        text_by_language_mx:reObj.text_by_language_mx
      }
      
      languageStateSet.setLanguage(obj);

      const textAtlasLanguage = localStorage.getItem("textAtlasLanguage")
      if(textAtlasLanguage === "us"){
        // console.log("us");
        languageStateSet.setMainLanguageSet(reObj.text_by_language_us);
      }else if(textAtlasLanguage === "kr"){
        // console.log("kr");
        languageStateSet.setMainLanguageSet(reObj.text_by_language_kr);
      }else if(textAtlasLanguage === "mx"){
        // console.log("mx");
        languageStateSet.setMainLanguageSet(reObj.text_by_language_mx);
      }else{
        // console.log("us");
        languageStateSet.setMainLanguageSet(reObj.text_by_language_us);
      }
      
    }
  }

  //페이지이동시 토큰 검증
  useEffect(() => {
    if(getAccessToken()){
      getAccessTokenApi(); 
    }else{
      getAccessTokenCheck();
    }
  }, [path]);
    
  async function getAccessTokenApi(){
      const retObj = await transaction("get", "user/getAccessToken", {}, "", false, false, screenShow2, errorShow);
      if(retObj.sendObj.code === "2000"){
        //유저정보는 zustand
        //access토큰 정보는 session storege클래스에 담아준다.
        userStateSet.userSet(retObj.sendObj.resObj);
        storeAccessToken(retObj.accessToken);
      }else{
        //access token get 실패
        userStateSet.userSet({ id:"", email:"", userseq:0, likesArr:[]});
      }
  }

  async function getAccessTokenCheck(){  
    const retObj = await transactionAuth("post", "user/checkaccessToken", {}, "", false, false, screenShow2, errorShow);
    // console.log("토큰검증"); 
    if(retObj.sendObj.success === 'y'){
      userStateSet.userSet(retObj.sendObj.resObj);
    }else{
        getAccessTokenApi();
    }
  }

  return <>{children}</>;
};

export default CommonTransaction;