import languageState from "@/app/store/language";
import { useRouter } from "next/navigation";

const Main = () => {
  const router = useRouter();
  const languageStateSet = languageState();

  //페이지 이동
  function homePage(){
    router.push('/home');
  }
  
  return(
    <div className=" bg-[#f7f7f7] w-full h-[100vh] flex justify-center items-start pt-10 " style={{
      "lineHeight": 1.6
    }}>

      <div className=" flex flex-col bg-white max-w-[1100px] rounded-[8px] shadow-md text-center
        py-10 px-10
      ">
        <header>
          <h1 className="font-bold " style={{
            "color": "#4A6D88", /* 지정된 메인 색상 */
            "fontSize": "2.2em",
            "marginBottom": "20px",
            "letterSpacing": "-0.5px",
          }}>{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[0]:""} </h1>
          <p style={{
            "color": "#555", /* 지정된 메인 색상 */
            "fontSize": "1.0em",
            "marginBottom": "40px",
          }}>{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[1]:""} 
          <br/>{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[2]:""} </p>
        </header>
        <div>
          <p className="font-bold" style={
            {
              "color": "#4A6D88", /* 지정된 메인 색상 */
              "fontSize": "1.6em",
              "marginBottom": "30px",
            }
          }>
            {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[3]:""}
          </p>
        </div>
        <div className="px-[10%] text-[15px]">
          <div className="w-full flex justify-center items-center rounded-md border-l-[5px] border-l-[#4A6D88] h-[100px] 
           bg-[#fafafa] ">
            <div className="flex-1  justify-items-center ">
              <div className="  w-full text-start px-5">
                <span className="font-bold">
                  {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[4]:""}
                  </span> {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[5]:""}
              </div>
            </div>
          </div>
        </div>

        <div className="px-[10%] mt-3 text-[15px]">
          <div className="w-full flex justify-center items-center rounded-md border-l-[5px] border-l-[#4A6D88] h-[100px] 
           bg-[#fafafa] ">
            <div className="flex-1  justify-items-center ">
              <div className="  w-full text-start px-5">
                <span className="font-bold">
                  {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[6]:""}
                  </span> {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[7]:""}
              </div>
            </div>
          </div>
        </div>

        <div className="px-[10%] mt-3 text-[15px]">
          <div className="w-full flex justify-center items-center rounded-md border-l-[5px] border-l-[#4A6D88] h-[100px] 
           bg-[#fafafa] ">
            <div className="flex-1  justify-items-center ">
              <div className=" w-full  text-start px-5">
                <span className="font-bold">{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[8]:""}
                  </span> {(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[9]:""}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full text-center mt-8">
          <button className="h-[50px] w-[170px] rounded-full text-[16px] font-bold text-white bg-[#4A6D88] 
         hover:bg-[#3c5568] hover:text-gray-100  
          transition-all duration-200 ease-in-out cursor-pointer px-1 py-0.5
          "
          onClick={()=>homePage()}
          >{(languageStateSet.main_language_set[17])?languageStateSet.main_language_set[17].text[10]:""}</button>
        </div>
      
      </div>
    
    </div>
  );
};

export default Main