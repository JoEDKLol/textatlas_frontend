/**
 * 
 * @param subcode 찾으려는 코드 
 * @param type a:일반적인상세코드조회, b:a 배열로 조회, c:특정 코드를 참고하는 코드를 조회, d:c 배열로 조회
 */

import { transactionAuth } from "./axiosAuth";
// import loadingScreenShow from "@/app/store/loadingScreen";
// import errorScreenShow from "@/app/store/errorScreen";

async function getSubCodeStr(subcode:any , type:string, screenShow:any, errorShow:any){

  let codeArr = [] as any;

  const obj = {
    subcode : (type==="a")?subcode:(type==="b")?subcode.join(","):subcode, 
    type:type
  }


  const resObj = await transactionAuth("get", "administrator/codesearch", obj, "", false, false, screenShow, errorShow);
  
  if(resObj.sendObj.success==="y"){
    codeArr = resObj.sendObj.resObj
  }

  return codeArr;

}

export {getSubCodeStr}; 