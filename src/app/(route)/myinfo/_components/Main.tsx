import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { transactionFile } from "@/app/utils/axiosFile";
import imageCompression from "browser-image-compression";
import Image from "next/legacy/image";
import { useEffect, useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { LuSquarePen } from "react-icons/lu";

const Main = (props:any) => {

  const userStateSet = props.userStateSet;
  const languageStateSet = languageState();  

  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  const [userimg, setUserimg] = useState<string>(userStateSet.userimg);
  const [userthumbImg, setUserthumbImg] = useState<string>(userStateSet.userthumbImg);

  const [usernameYn, setUsernameYn] = useState<boolean>(false);
  const [userIntroYn, setUserIntroYn] = useState<boolean>(false);

  const [usernameStyle, setUsernameStyle] = useState<string>(" bg-gray-50 ");
  const [userIntroStyle, setUserIntroStyle] = useState<string>(" bg-gray-50 ");

  const [username, setUsername] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");

  const focusUserName = useRef<HTMLInputElement>(null);
  const focusUserIntro = useRef<HTMLTextAreaElement>(null);
  

  useEffect(()=>{
    // console.log(userStateSet);
    // 
    if(userStateSet.username){
      setUsername(userStateSet.username);
    }

    if(userStateSet.introduction){
      setIntroduction(userStateSet.introduction);
    }
  },[userStateSet]);

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < username.length; i++) {
      const currentByte = username.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 40){
        setUsername(username.substring(0, i));
        break;
      }
    }
  },[username]);

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < introduction.length; i++) {
      const currentByte = introduction.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 400){
        setIntroduction(introduction.substring(0, i));
        break;
      }
    }
  },[introduction]);


  async function userFileUploadHandler(e:any){
    try {
      const file = e.target.files[0]; 
      if(!file) return;

      if(userimg){
        userDeleteImg();
      }

      const options = {
        maxSizeMB: 0.2, // 이미지 최대 용량
        // maxWidthOrHeight: 1920, // 최대 넓이(혹은 높이)
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const imgUploadRes = await transactionFile("community/fileUploadS3", compressedFile, {}, "", false, true, screenShow, errorShow);
      
 
      if(imgUploadRes.sendObj.success === 'y'){
        e.target.value = '';
        setUserimg(imgUploadRes.sendObj.resObj.img_url);
        setUserthumbImg(imgUploadRes.sendObj.resObj.thumbImg_url);
      }else{
        errorShow.screenShowTrue();
        errorShow.messageSet(imgUploadRes.sendObj.resObj.errMassage);
      }
    } catch (error) {
      //console.log(error)
    }
  }

  async function save(){
    const obj = {
      userseq:userStateSet.userseq,
      email:userStateSet.email,
      userimg:userimg,
      userthumbImg:userthumbImg,
      username:username,
      introduction:introduction,
    }
    
    const retObj = await transactionAuth("post", "user/userupdate", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === 'y'){

      userStateSet.usernameSet(username);
      userStateSet.userimgSet(userimg);
      userStateSet.userthumbImgSet(userthumbImg);
      userStateSet.introductionSet(introduction);
      setUsernameYn(false);
      setUserIntroYn(false);
    }
  }

  async function userDeleteImg(){
    // console.log(userimg);
    // console.log("uploads"+userimg.split("uploads")[1]);
    const obj = {
      // userseq:userStateSet.userseq,
      // email:userStateSet.email,
      file_key:"uploads"+userimg.split("uploads")[1],
    }
    
    const retObj = await transactionAuth("post", "community/fileDeleteS3", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === 'y'){
      setUserimg("");
      setUserthumbImg("");
    }
  }

  // async function deleteImgDB(){ //사용자 테이블에서 삭제
  //   // console.log(userimg);
  //   // console.log("uploads"+userimg.split("uploads")[1]);
  //   const obj = {
  //     userseq:userStateSet.userseq,
  //     email:userStateSet.email,
  //     file_key:"uploads"+userimg.split("uploads")[1],
  //   }
    
  //   const retObj = await transactionAuth("post", "community/fileDeleteS3withuser", obj, "", false, true, screenShow, errorShow);
  //   if(retObj.sendObj.success === 'y'){
  //     setUserimg("");
  //   }
  // }

  useEffect(()=>{
    if(usernameYn){
      focusUserName.current?.focus();
      setUsernameStyle("  ")
    }else{
      setUsernameStyle(" bg-gray-50 ");
    }
  },[usernameYn]);

  useEffect(()=>{
    if(userIntroYn){
      focusUserIntro.current?.focus();
      setUserIntroStyle(" ");
    }else{ 
      setUserIntroStyle(" bg-gray-50 ");
    }
  },[userIntroYn]);

  function onClickName(){
    setUsernameYn(!usernameYn);
  }

  function onClickIntroduce(){
    setUserIntroYn(!userIntroYn);
  }

  function onchangeHandlerUsername(e:any){
    setUsername(e.target.value);
  }

  function onchangeHandlerUserIntro(e:any){
    setIntroduction(e.target.value);
  }

  return(
    <>
    <div className="">
      <div className="h-[55px] w-full "></div> {/* 상단 헤더 만큼 아래로 */}
      <div className="w-full  ">
        <div className="flex justify-center ">


          {/* 상단영역 이름, 소개, 이미지 */}
          <div className="flex flex-col mt-10 w-[95%] max-w-[800px] p-5 rounded-lg shadow-lg border border-gray-300 ">
            
            <div className="w-full flex justify-start items-center ">
              <div className="flex flex-col h-[200px]
              2xl:h-[220px]  xl:h-[220px]  lg:h-[220px]  md:h-[220px]  sm:h-[200px]
              ">
                <div className="w-[160px] h-[160px] flex justify-center items-center 
                2xl:w-[180px]  xl:w-[180px]  lg:w-[180px]  md:w-[180px]  sm:w-[160px] 
                2xl:h-[180px]  xl:h-[180px]  lg:h-[180px]  md:h-[180px]  sm:h-[160px]
                ">
                  <div className="relative w-full h-full rounded-lg ">
                    <div className='absolute  w-[160px] h-[160px] rounded-lg -z-0 border border-gray-300 
                    2xl:w-[180px]  xl:w-[180px]  lg:w-[180px]  md:w-[180px]  sm:w-[160px] 
                    2xl:h-[180px]  xl:h-[180px]  lg:h-[180px]  md:h-[180px]  sm:h-[160px]
                    '>

                      {
                        (userimg)?
                        <Image
                        src={
                          userimg
                        }
                        alt=""
                        layout="fill" 
                        style={{  borderRadius:"7px",}}
                        priority
                        />
                        :
                        <div className="flex justify-center items-center w-full h-full text-[25px] text-gray-500  "><CiImageOn /></div>
                      }
                    </div>
                  </div>
                </div>
                <div className="w-[160px] 
                2xl:w-[180px]  xl:w-[180px]  lg:w-[180px]  md:w-[180px]  sm:w-[160px] 
                flex justify-center items-center ">
                  <div className="flex justify-end items-center w-full text-center mt-2">
                    <label className="
                    text-xs border px-2  rounded-2xl w-[70px]
                  bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold 
                    transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[1px]" 
                    htmlFor="file_input">
                      {(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[15].text[2]:""} 
                    </label>
                    <input className=" text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
                    hidden
                    " id="file_input" type="file"
                    accept="image/*" 
                    onChange={(e)=>userFileUploadHandler(e)}
                    />
                  </div>
                  <div className="flex justify-start items-center w-full text-center mt-2 ps-2">
                    <button className="text-xs border px-2  rounded-2xl w-[70px]
                    bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold 
                    transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[1px]
                    "
                    onClick={()=>userDeleteImg()}
                    >{(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[15].text[3]:""}</button>
                  </div>
                </div>
              </div>



              <div className=" ps-3 flex flex-col flex-1 text-xs
              2xl:text-sm  xl:text-sm  lg:text-sm  md:text-sm  sm:text-xs px-1 
              
              ">
                <div className="mb-1 text-[#4A6D88] font-bold flex justify-between items-end">
                  
                  <div>{(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[15].text[0]:""}</div>
                  <div className="text-[15px] cursor-pointer 
                  transition-transform duration-300 ease-in-out hover:scale-110
                  "
                  onClick={()=>onClickName()}
                  ><LuSquarePen /></div>
                  
                </div>
                <div className="">
                  <input className={usernameStyle + ` w-full border px-2 py-1 rounded-lg border-[#4A6D88] text-[#4A6D88] focus:outline-none` }
                  disabled={!usernameYn}
                  ref={focusUserName}
                  value={username}
                  onChange={(e)=>onchangeHandlerUsername(e)}
                  ></input>
                </div>
                <div className="pt-2 mb-1 text-[#4A6D88] font-bold flex justify-between items-end">
                  <div>{(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[15].text[1]:""}</div>
                  <div className="text-[15px] cursor-pointer 
                  transition-transform duration-300 ease-in-out hover:scale-110
                  "
                  onClick={()=>onClickIntroduce()}
                  ><LuSquarePen /></div>
                </div>
                <div className=" ">
                  <textarea className={ userIntroStyle + ` h-[80px] w-full border px-2 py-2 rounded-lg border-[#4A6D88] text-[#4A6D88] 
                  focus:outline-none resize-none p-3 overflow-y-auto
                  2xl:h-[100px]  xl:h-[100px]  lg:h-[100px]  md:h-[100px]  sm:h-[80px]
                   
                  `}
                  ref={focusUserIntro}
                  disabled={!userIntroYn}
                  value={introduction}
                  onChange={(e)=>onchangeHandlerUserIntro(e)}
                  ></textarea>
                </div>
                <div className="w-full flex justify-end">
                  <button className="text-xs border px-2  rounded-2xl w-[80px]
                  bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold 
                  transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[1px]
                  "
                  onClick={()=>save()}
                  >{(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[15].text[4]:""}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
    </>
  );
};

export default Main