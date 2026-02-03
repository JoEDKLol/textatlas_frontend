'use client';

import { useRouter } from "next/navigation";
import TermsOfService from "../modals/TermsOfService";
import { useState } from "react";
import PrivacyPolicy from "../modals/PrivacyPolicy";
import ContactUs from "../modals/ContactUs";

const Footer = () => {
  const router = useRouter();

  //termsOfService 팝업
  const [termsOfServicePotal, setTermsOfServicePotal] = useState(false);

  //PrivacyPolicy 팝업
  const [privacyPolicyPotal, setPrivacyPolicyPotal] = useState(false);

  //ContactUs 팝업
  const [contactUsPotal, setContactUsPotal] = useState(false);

  function setShowTermsOfService(yn:boolean){
    setTermsOfServicePotal(yn);
  }

  function setShowPrivacyPolicy(yn:boolean){
    setPrivacyPolicyPotal(yn);
  }

  function setShowContactUsPotal(yn:boolean){
    setContactUsPotal(yn);
  }

  return(
    <div className="flex flex-col bg-[#4A6D88] text-white">
      <div className=" w-full flex flex-col justify-center items-center text-white
      2xl:flex-row  xl:flex-row lg:flex-row md:flex-row sm:flex-col
      ">
        <div className="flex flex-col w-full 
        2xl:w-[50%]  xl:w-[50%] lg:w-[50%] md:w-[50%] sm:w-full
        items-center
        2xl:items-start  xl:items-start lg:items-start md:items-start sm:items-center
        pt-12 2xl:pt-1  xl:pt-1 lg:pt-1 md:pt-1 sm:pt-12
        
        ">
          <div className="text-[23px] font-bold px-8">TextAtlas</div>
          <div className="px-8 opacity-80 text-[14px] pt-4">언어의 장벽을 넘어 명작의 깊이를 느끼는 시간.</div>
          <div className="px-8 opacity-80 text-[14px]">AI 기술로 더 스마트해진 고전 읽기 경험을 제공합니다.</div>
        </div>
        <div className=" flex flex-col w-full 
        2xl:w-[25%] xl:w-[25%] lg:w-[25%] md:w-[25%] sm:w-full pt-12 px-5
        items-center
        2xl:items-start  xl:items-start lg:items-start md:items-start sm:items-center
        ">
          <div className="pb-2 font-bold text-[16px] ">Legal</div>
          <div className="w-full border-b  "
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          ></div>
          <div className="pt-4 pb-2 font-bold text-[12px] opacity-60
          transition-all duration-300 ease-in-out
          hover:opacity-100 cursor-pointer
          "
          onClick={()=>setShowTermsOfService(true)}
          >Terms of Service</div>
          <div className="py-2 font-bold text-[12px] opacity-60
           transition-all duration-300 ease-in-out
          hover:opacity-100 cursor-pointer
          "
          onClick={()=>setShowPrivacyPolicy(true)}
          >Privacy Policy</div>
          <div className="py-2 font-bold text-[12px] opacity-60
           transition-all duration-300 ease-in-out
          hover:opacity-100 cursor-pointer
          "
          onClick={()=>setShowContactUsPotal(true)}
          >Contact Us</div>

        </div>
        <div className=" flex flex-col w-full 
        2xl:w-[25%] xl:w-[25%] lg:w-[25%] md:w-[25%] sm:w-full pt-12 px-5
        items-center
        2xl:items-start  xl:items-start lg:items-start md:items-start sm:items-center
        ">
          <div className="pb-2 font-bold text-[16px] 
          transition-all duration-300 ease-in-out
          hover:opacity-100
          ">Credits</div>
          <div className="w-full border-b  "
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          ></div>
          <a className="pt-4 pb-2 font-bold text-[12px] opacity-60
          transition-all duration-300 ease-in-out
          hover:opacity-100 cursor-pointer
          "
          href="https://www.gutenberg.org" 
          target="_blank" 
          rel="noopener noreferrer"
          >Project Gutenberg</a>
          <a className="py-2 font-bold text-[12px] opacity-60
          transition-all duration-300 ease-in-out
          hover:opacity-100 cursor-pointer
          "
          href="https://www.deepl.com" 
          target="_blank" 
          rel="noopener noreferrer"
          >DeepL Translator</a>
          <div className="py-2 font-bold h-[34px] 
          "></div>

        </div>
      </div>
      <div className="w-full h-[55px] flex justify-center items-center opacity-60 text-[12px] border-t mt-[7px]  "
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      >© 2026 TextAtlas. All rights reserved.</div>
      <TermsOfService show={termsOfServicePotal} setShowTermsOfService={setShowTermsOfService} />
      <PrivacyPolicy show={privacyPolicyPotal} setShowPrivacyPolicy={setShowPrivacyPolicy}/>
      <ContactUs show={contactUsPotal} setShowContactUsPotal={setShowContactUsPotal}/>

    </div>
  );
};

export default Footer