'use client';

import languageState from "@/app/store/language";

const AdministratorReqScreen = () => {

  const languageStateSet = languageState();  

  return(
    <>
      <div className="h-[55px] w-full"></div>{/* 상단 헤더 만큼 아래로 */}
      <div className=" w-full h-[80vh] flex justify-center items-center">
        <p className="p-5 text-lg rounded-2xl ">
          
          {
            (languageStateSet.main_language_set[7])?languageStateSet.main_language_set[7].text[0]:""
          }
        </p>
      </div>
    </>
    
  )


    
}

export default AdministratorReqScreen;