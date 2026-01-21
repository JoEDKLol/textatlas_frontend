'use client';

import Image from "next/legacy/image";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import QuillEditorScreen from "@/app/compontents/common/quillEditor/QuillEditorScreen";
import { useEffect, useRef, useState } from "react";
import languageState from "@/app/store/language";
import { ButtonBase, ButtonBaseAddTags } from "@/app/compontents/design/buttons/Buttons";
import alertPopupShow from "@/app/store/alertPopup";
import { transactionAuth } from "@/app/utils/axiosAuth";
import loadingScreenShow from "@/app/store/loadingScreen";
import errorScreenShow from "@/app/store/errorScreen";
import { useRouter } from "next/navigation";
import communityState from "@/app/store/communities";


const Main = (props:any) => { 
  const router = useRouter();
  const communityStateSet = communityState();
  const userStateSet = props.userStateSet;
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  const languageStateSet = languageState();
  const alertPopup = alertPopupShow();
  const [title, setTitle] = useState("");
  const [value, setValue] = useState('');
  const [textLenght, setTextLength] = useState(0);
  
  const focusTitle = useRef<HTMLInputElement>(null);
  const focusHashTag = useRef<HTMLInputElement>(null);

  const [hashTagsArr, setHashTagsArr] = useState(new Array());
  const [hashTagText, sethashTagText] = useState("");

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < title.length; i++) {
      const currentByte = title.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 200){
        setTitle(title.substring(0, i));
        break;
      }
    }
  },[title]);

  useEffect(()=>{
    let totalByte = 0;
    for(let i =0; i < hashTagText.length; i++) {
      const currentByte = hashTagText.charCodeAt(i);
      if(currentByte > 128){
        totalByte += 2;
      }else {
        totalByte++;
      }

      if(totalByte > 30){
        sethashTagText(hashTagText.substring(0, i));
        break;
      }
    }
  },[hashTagText]);


  
  function titleTextChange(e:any){
    setTitle(e.target.value);
  }
  
  function quillOnChangeHandler(content:any, delta:any, source:any, editor:any){
    
    setTextLength(editor.getLength());
    setValue(content);
  }

  async function saveWriting(){

    const getTitle = title.trim();

    if(!getTitle){
      focusTitle.current?.focus();
      return;
    }

    if(textLenght > 4001){
      alertPopup.screenShowTrue();
      // alertPopup.messageSet("Check!", "The number of characters is more than 4000.");
      alertPopup.messageSet((languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[6]:"", (languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[7]:"");
      return;
    }

    const obj = {
      userseq:userStateSet.userseq,
      userinfo:userStateSet.id,
      title:getTitle,
      contents:value,
      hashtags:hashTagsArr,
      email: userStateSet.email,

    }

    const retObj = await transactionAuth("post", "community/savecommunitywriting", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){ 
      //저장성공 팝업 이후 커뮤니티 화면으로 이동한다.
      // const communityIndex = communityStateSet.communityList.findIndex((elem) => elem.community_seq === parseInt(retObj.sendObj.resObj.community_seq));
      communityStateSet.communityListAddPre(retObj.sendObj.resObj);
      alertPopup.screenShowTrue();
      alertPopup.messageSet((languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[4]:"", (languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[5]:"");
      router.push('/community');
    }

  }

  function hashTagTextChange(e:any){
    sethashTagText(e.target.value);
  }

  function addHashTag(){
    const getHashTagText = hashTagText.trim();

    if(!getHashTagText){
      sethashTagText("");  
      return;
    }

    if(hashTagsArr.length > 9){
      
      return;
    }

    //이미 있는 hashtag 인경우 리턴
    if(hashTagsArr.indexOf(getHashTagText) > -1){
      focusHashTag.current?.focus();
      return;
    }

    
    hashTagsArr.push(hashTagText);
    setHashTagsArr([...hashTagsArr]);
    sethashTagText("");

  }

  function deleteTag(index:number){
    hashTagsArr.splice(index, 1);
    setHashTagsArr([...hashTagsArr]);
  }


  

  return( 
    <>
    <div className="">
      <div className="h-[55px] w-full"></div> {/* 상단 헤더 만큼 아래로 */}
      <div className="w-full ">
        <div className="flex justify-center ">
          <div className="flex flex-col max-w-[700px] w-[95%] justify-center items-center ">
            {/* 글쓰기 */}
            <div className="mt-5 text-base font-bold text-start w-full">
              {(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[0]:""} 
            </div>
            <div className="w-full mt-5 ">
              {/* <p className="py-1 ps-1 font-bold "></p> */}
              <input 
              ref={focusTitle}
              className="ps-3 py-2 font-bold w-full border  bg-white text-sm rounded-[10px] placeholder:font-light "
              placeholder={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[1]:""} 
              value={title}
              onChange={(e)=>titleTextChange(e)}
              />
              
            </div>
            <div className="w-full flex justify-between mt-5   ">
              <div className="w-full relative ">
                
                {/* asdf asdf sad sadf sadf sadfsa asdf sadf asdf sd */}
                {/* <span className="inline-block">abasdfasdfsadf</span> */}
                <input className="h-full px-2 font-bold w-full   bg-gray-100 text-xs rounded-[10px] placeholder:font-light "
                // placeholder={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[1]:""} 
                ref={focusHashTag}
                value={hashTagText}
                onChange={(e)=>hashTagTextChange(e)}
                />
                <span className="absolute right-3 top-[6px] text-xs text-red-500">{`${hashTagsArr.length} / 10`}</span>

              </div>

              <div className=" ms-1  ">
                <ButtonBaseAddTags text={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[3]:""}
                onClick={()=>addHashTag()}
                />
              </div>
            </div>
            <div className="w-full leading-5 my-2">
              {
                hashTagsArr.map((elem, index)=>{
                  return (
                    <div key={index + "span"} className="inline-block relative h-[20px] bg-[#5f89aa] text-white rounded-[8px] border text-[10px]   ps-2 pe-5 me-1">
                      {elem}
                      <button className="absolute -top-[1px] right-[6px] font-bold text-[12px] cursor-pointer ms-3 
                      transition-transform duration-300 ease-in-out hover:scale-120 transform "
                      onClick={()=>deleteTag(index)}
                      >x</button>
                    </div>
                  )
                })
              }
              
              
              

            </div>
            <div className="w-full relative ">
              <QuillEditorScreen bgColor={"#ffffff"} 
              content={value} 
              // setContent={setContent}
              onChange={quillOnChangeHandler} 
              readOnly={false} styleType="style"  />
              {/* <div className="absolute top-[10px]">test</div> */}
            </div>
            <div className="w-full flex justify-end mt-1 text-xs text-red-500 pe-1" >{(textLenght-1<0)?0:textLenght-1} / 4000</div>
            <div className=" text-center w-full flex justify-end  mt-3 ">
              {/* <ButtonBaseAddTags text={"Add tag"}
              // onClick={()=>saveWriting()}
              /> */}
              <div>
              <ButtonBase text={(languageStateSet.main_language_set[12])?languageStateSet.main_language_set[12].text[2]:""}
              onClick={()=>saveWriting()}
              />
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