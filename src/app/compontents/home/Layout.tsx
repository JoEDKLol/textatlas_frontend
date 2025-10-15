
'use client';
import { usePathname, useRouter } from "next/navigation";
import Hearder from "./Header"
import Main from "./Main";


const Layout = ({ children }: { children: React.ReactNode }) => {

  const path = usePathname();
  
  return(
    <>
      <Hearder/>
      {
        (path === "/")?
        <Main/>:
        <>
        {children}
        </> 
      }
    </>
  );
};

export default Layout