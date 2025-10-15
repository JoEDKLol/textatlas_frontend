'use client';

import userState from "@/app/store/user";
import Main from "./Main";

const Layout = () => {
  const userStateSet = userState();
  return(
    <>
      <Main userStateSet={userStateSet}/>
    </>
  );
};

export default Layout