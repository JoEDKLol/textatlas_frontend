
'use client';
import { usePathname, useRouter } from "next/navigation";
import Hearder from "./Header"
import Main from "./Main";


const Layout = ({ children }: { children: React.ReactNode }) => {

  const path = usePathname();
  
  return(
    <>
      
      {
        (path === "/")?
        // 랜딩페이지 작성
        <Main/> 
        :
        <>
        <Hearder/>
        {children}
        </> 
      }
    </>
  );
};

export default Layout