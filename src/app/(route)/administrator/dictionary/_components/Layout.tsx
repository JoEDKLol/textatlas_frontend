'use client';
import userState from "@/app/store/user";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginRequestScreen from "@/app/compontents/common/loginRequestScreen/Index";
import Main from "./Main";
import AdministratorReqScreen from "@/app/compontents/common/administratorReqScreen/Index";

const Layout = () => {
  const userStateSet = userState();

  return(<>
      {
      (userStateSet.id && userStateSet.role === "manager")?  
      <Main userStateSet={userStateSet}/>:<AdministratorReqScreen/>
      }
  </>
  );
};

export default Layout