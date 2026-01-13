'use client';

import userState from "@/app/store/user";
import Main from "./Main";
import LoginRequestScreen from "@/app/compontents/common/loginRequestScreen/Index";

const Layout = () => {
  const userStateSet = userState();


  return(<>
    {/* {
      (userStateSet.id)?  
      <Main userStateSet={userStateSet}/>:<LoginRequestScreen/>
    } */}
    <Main userStateSet={userStateSet}/>
  </>
  );
};

export default Layout