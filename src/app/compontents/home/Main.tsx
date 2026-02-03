import languageState from "@/app/store/language";
import { useRouter } from "next/navigation";
import HeaderLanding from "./HeaderLanding";
import Footer from "./Footer";

const Main = () => {
  const router = useRouter();
  const languageStateSet = languageState();

  function go_home(){
    router.push('/home');
  }
  return(

    <div className="flex flex-col">
      <HeaderLanding/>
      {/* 본문 */}
      <div className="flex flex-col items-center justify-center mt-[55px] h-[500px] bg-[#2f4d64] opacity-95">
        <div className="text-center text-white text-[30px] font-bold
        2xl:text-[45px] xl:text-[45px] lg:text-[45px] md:text-[35px] sm:text-[30px]
        ">
          <p>
            고전에서 얻는 영감,
          </p>
          <p className="">
            언어의 장벽을 넘다
          </p>
          
        </div>

        <div className="text-center text-white text-[15px] pt-5 
        2xl:text-[20px] xl:text-[20px] lg:text-[20px] md:text-[20px] sm:text-[15px]
        ">
          <p>
            수천 권의 명작 속 위대한 사유를 직접 경험하세요.
          </p>
          <p className="">
            문장이 주는 영감에만 온전히 몰입할 수 있도록 돕습니다.
          </p>
          
        </div>

        <div className="pt-10">
          <button
            onClick={()=>go_home()}
            className="
            px-4 py-2       
            bg-[#FFD700]
            text-[#4A6D88]      
            rounded-md              
            font-semibold           
            hover:bg-[#FFC400]
            transition-all duration-200 ease-in-out 
            cursor-pointer inline-block
            text-[15px]
            2xl:text-[20px] xl:text-[20px] lg:text-[20px] md:text-[20px] sm:text-[15px]
            " 
            >시작하기
            </button>
          
        </div>

      </div>
      
      <div id="features" className="flex flex-col items-center justify-center   bg-white mb-[75px] pt-[75px]
      ">
        <div className="text-[30px] 2xl:text-[45px] xl:text-[45px] lg:text-[45px] md:text-[35px] sm:text-[30px] font-bold text-[#4A6D88]"
        
        >TextAtlas 특별한 기능</div>
        
        <div className=" justify-center w-full px-10 
        grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]

        ">
          <div className=" flex flex-col justify-start items-center  mx-2 mt-7
          rounded-[8px] border-t-[#4A6D88] border-t-5 bg-[#f0f4f8]
          transition-all duration-300 ease-in-out
          hover:-translate-y-1 hover:shadow-sm 
          ">
            <div className="text-[#4A6D88] font-bold pt-5 text-[20px]
            2xl:text-[20px] xl:text-[20px] lg:text-[20px] md:text-[20px] sm:text-[15px]
            ">풍부한 콘텐츠 라이브러리</div>
            <div className="p-5 text-center  text-[14px] text-[#555]">
              Project Gutenberg의 방대한 오픈 소스 라이브러리를 통해 수만 권의 고전 명작을 언제든 읽을 수 있습니다. 이제 원하는 모든 책을 손안에서 만나보세요.
            </div>
          </div>
          <div className=" flex flex-col justify-start items-center  mx-2 mt-7
          rounded-[8px] border-t-[#4A6D88] border-t-5 bg-[#f0f4f8]
          transition-all duration-300 ease-in-out
          hover:-translate-y-1 hover:shadow-sm 
          ">
            <div className="text-[#4A6D88] font-bold pt-5 text-[20px]
            2xl:text-[20px] xl:text-[20px] lg:text-[20px] md:text-[20px] sm:text-[15px]
            ">실시간 AI 번역</div>
            <div className="p-5 text-center  text-[14px] text-[#555]">
              세계 최고 수준의 DeepL API를 활용하여 복잡한 문장도 한 번의 클릭으로 한국어 및 스페인어 번역을 제공합니다. 번역 엔진이 당신의 독서를 방해하지 않습니다.
            </div>
          </div>
          <div className=" flex flex-col justify-start items-center  mx-2 mt-7
          rounded-[8px] border-t-[#4A6D88] border-t-5 bg-[#f0f4f8]
          transition-all duration-300 ease-in-out
          hover:-translate-y-1 hover:shadow-sm 
          ">
            <div className="text-[#4A6D88] font-bold pt-5 text-[20px]
            2xl:text-[20px] xl:text-[20px] lg:text-[15px] md:text-[15px] sm:text-[15px]
            ">개인 맞춤형 학습 (Coming Soon)</div>
            <div className="p-5 text-center text-[14px] text-[#555]">
              독서 중 저장한 단어와 문장을 기반으로 개인화된 퀴즈를 생성하고 학습 진도를 관리합니다. 내가 모르는 부분을 집중적으로 학습하여 효율을 극대화하세요.
            </div>
          </div>
        </div>

      </div>

      <div id="aboutus" className="flex flex-col items-center justify-center  bg-[#f8faff] py-[75px] 
      ">
        <div className="text-[30px] 2xl:text-[45px] xl:text-[45px] lg:text-[45px] md:text-[35px] sm:text-[30px] font-bold text-[#4A6D88]"
        >About TextAtlas</div>

        <div className="px-10 text-[#555] text-center">
          TextAtlas는 고전 문학의 가치와 최신 AI 기술을 결합한 언어 학습 플랫폼입니다. 단순한 읽기를 넘어, 실시간 번역과 문맥 기반의 단어 학습을 통해 외국어 원서를 가장 효과적으로 읽는 경험을 제공합니다.
        </div>

        <div className=" justify-center w-full px-10 
        grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]

        ">
          <div className=" flex flex-col justify-start items-center  mx-2 mt-7
          rounded-[8px] border-t-[#4A6D88] border-t-5 bg-white
          transition-all duration-300 ease-in-out
          hover:-translate-y-1 hover:shadow-sm 
          ">
            <div className="text-[#4A6D88] font-bold pt-5 text-[20px]
            2xl:text-[20px] xl:text-[20px] lg:text-[20px] md:text-[20px] sm:text-[15px]
            ">Rich Content</div>
            <div className="p-5 text-center  text-[14px] text-[#555]">
              Project Gutenberg의 방대한 오픈 소스 라이브러리를 통해 수만 권의 명작을 제공합니다.
            </div>
          </div>
          <div className=" flex flex-col justify-start items-center  mx-2 mt-7
          rounded-[8px] border-t-[#4A6D88] border-t-5 bg-white
          transition-all duration-300 ease-in-out
          hover:-translate-y-1 hover:shadow-sm 
          ">
            <div className="text-[#4A6D88] font-bold pt-5 text-[20px]
            2xl:text-[20px] xl:text-[20px] lg:text-[20px] md:text-[20px] sm:text-[15px]
            ">AI Translation</div>
            <div className="p-5 text-center  text-[14px] text-[#555]">
              세계 최고 수준의 DeepL API를 활용하여 정교한 한국어 및 스페인어 번역을 지원합니다.
            </div>
          </div>
          <div className=" flex flex-col justify-start items-center  mx-2 mt-7
          rounded-[8px] border-t-[#4A6D88] border-t-5 bg-white
          transition-all duration-300 ease-in-out
          hover:-translate-y-1 hover:shadow-sm 
          ">
            <div className="text-[#4A6D88] font-bold pt-5 text-[20px]
            2xl:text-[20px] xl:text-[20px] lg:text-[15px] md:text-[15px] sm:text-[15px]
            ">AI Dictionary</div>
            <div className="p-5 text-center text-[14px] text-[#555]">
              Google Gemini AI를 통해 단순한 사전 의미를 넘어, 문학적 문맥에 가장 적합한 단어 풀이와 깊이 있는 사전 데이터를 구축합니다.
            </div>
          </div>
          <div className=" flex flex-col justify-start items-center  mx-2 mt-7
          rounded-[8px] border-t-[#4A6D88] border-t-5 bg-white
          transition-all duration-300 ease-in-out
          hover:-translate-y-1 hover:shadow-sm 
          ">
            <div className="text-[#4A6D88] font-bold pt-5 text-[20px]
            2xl:text-[20px] xl:text-[20px] lg:text-[15px] md:text-[15px] sm:text-[15px]
            ">Smart Learning</div>
            <div className="p-5 text-center text-[14px] text-[#555]">
              사용자가 읽은 페이지와 저장한 단어를 분석하여 개인 맞춤형 학습 데이터를 구축하며, 향후 독서 데이터를 기반으로 한 지능형 퀴즈 시스템이 구현될 예정입니다.
            </div>
          </div>
        </div>
        

      </div>
      <Footer/>  
    
    
    </div>








    // <div className=" bg-[#f7f7f7] w-full h-[100vh] flex justify-center items-start pt-10 " style={{
    //   "lineHeight": 1.6
    // }}>

    //   <div className=" flex flex-col bg-white max-w-[1100px] rounded-[8px] shadow-md text-center
    //     py-10 px-10
    //   ">
    //     <header>
    //       <h1 className="font-bold " style={{
    //         "color": "#4A6D88", 
    //         "fontSize": "2.2em",
    //         "marginBottom": "20px",
    //         "letterSpacing": "-0.5px",
    //       }}>{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[0]:""} </h1>
    //       <p style={{
    //         "color": "#555", 
    //         "fontSize": "1.0em",
    //         "marginBottom": "40px",
    //       }}>{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[1]:""} 
    //       <br/>{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[2]:""} </p>
    //     </header>
    //     <div>
    //       <p className="font-bold" style={
    //         {
    //           "color": "#4A6D88", 
    //           "fontSize": "1.6em",
    //           "marginBottom": "30px",
    //         }
    //       }>
    //         {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[3]:""}
    //       </p>
    //     </div>
    //     <div className="px-[10%] text-[15px]">
    //       <div className="w-full flex justify-center items-center rounded-md border-l-[5px] border-l-[#4A6D88] h-[100px] 
    //        bg-[#fafafa] ">
    //         <div className="flex-1  justify-items-center ">
    //           <div className="  w-full text-start px-5">
    //             <span className="font-bold">
    //               {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[4]:""}
    //               </span> {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[5]:""}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="px-[10%] mt-3 text-[15px]">
    //       <div className="w-full flex justify-center items-center rounded-md border-l-[5px] border-l-[#4A6D88] h-[100px] 
    //        bg-[#fafafa] ">
    //         <div className="flex-1  justify-items-center ">
    //           <div className="  w-full text-start px-5">
    //             <span className="font-bold">
    //               {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[6]:""}
    //               </span> {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[7]:""}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="px-[10%] mt-3 text-[15px]">
    //       <div className="w-full flex justify-center items-center rounded-md border-l-[5px] border-l-[#4A6D88] h-[100px] 
    //        bg-[#fafafa] ">
    //         <div className="flex-1  justify-items-center ">
    //           <div className=" w-full  text-start px-5">
    //             <span className="font-bold">{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[8]:""}
    //               </span> {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[9]:""}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="w-full text-center mt-8">
    //       <button className="h-[50px] w-[170px] rounded-full text-[16px] font-bold text-white bg-[#4A6D88] 
    //      hover:bg-[#3c5568] hover:text-gray-100  
    //       transition-all duration-200 ease-in-out cursor-pointer px-1 py-0.5
    //       "
    //       onClick={()=>homePage()}
    //       >{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[10]:""}</button>
    //     </div>
      
    //   </div>
    
    // </div>
  );
};

export default Main