'use client';

import { ButtonHisBookListNext, ButtonLearning, ButtonTranslator } from "@/app/compontents/design/buttons/Buttons";
import errorScreenShow from "@/app/store/errorScreen";
import languageState from "@/app/store/language";
import loadingScreenShow from "@/app/store/loadingScreen";
import userState from "@/app/store/user";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { useEffect, useRef, useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoIosRadioButtonOn, IoMdRadioButtonOff } from "react-icons/io";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

interface imagesItf {
  medium_cover:string
  cover:string
}

interface wordinfoItf {
  meaningKR:string
  reworkmeaningKR:string
  reworkynKR:boolean
  meaningES:string
  reworkmeaningES:string 
  reworkynES:string
}

interface wordItf {
  _id:string
  book_seq:number
  book_title:string
  images:[imagesItf]
  importance:number
  learningdt:string
  page:number
  sentence:string
  sentenceindex:number
  word:string
  wordinfo:wordinfoItf
  translatedsentenceES:string
  translatedsentenceKR:string
  translatorSee:boolean
  learningyn:boolean
  wordsee:boolean
}

interface sentenceWordItf {
  senctenceIndex:number
  word:string
  length:number
  answer:string
  style:string
}

interface wordListItf extends Array<wordItf>{}

interface sentenceItf {
  _id:string
  book_seq:number
  book_title:string
  images:[imagesItf]
  importance:number
  learningdt:string
  page:number
  sentence:string
  sentenceindex:number
  translatedsentenceES:string
  translatedsentenceKR:string
  translatorSee:boolean
  learningyn:boolean
  sentenceSee:boolean
  wordArr:[sentenceWordItf]
  currentState:string //현재 상태 정답확인 : "A", 문장보기 : "B", 다시하기 : C, 학습완료 : D
}

interface sentenceListItf extends Array<sentenceItf>{}

interface wordCntItf {
  userbywordtotalcnt:number
  userbywordcnt:number
  userbywordlearnedcnt:number
}

interface sentenceCntItf {
  userbysentencetotalcnt:number
  userbysentencecnt:number
  userbysentencelearnedcnt:number
}


const Learn = (props:any) => {

  const userStateSet = props.userStateSet;
  const currentTab = props.currentTab;

  const languageStateSet = languageState();  

  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();

  const focusWordInputListRef = useRef<null[] | HTMLInputElement[]>([]);
  const focusSentenceWordInputListRef = useRef<null[] | HTMLInputElement[]>([]);

  //학습 단어 건수
  const [wordCnt, setWordCnt] = useState<wordCntItf>(
    {
      userbywordtotalcnt:0, 
      userbywordcnt:0, 
      userbywordlearnedcnt:0, 
    }
  );

  //학습 문장 건수
  const [sentenceCnt, setSentenceCnt] = useState<sentenceCntItf>(
    {
      userbysentencetotalcnt:0, 
      userbysentencecnt:0, 
      userbysentencelearnedcnt:0, 
    }
  );

  //단어, 문장 학습 탭
  const [tab, setTab] = useState<number>(0); //0:단어, 1:문장

  //tabStyle1
  const [tabStyle1, setTabStyle1] = useState<string>(""); 
  //tabStyle2
  const [tabStyle2, setTabStyle2] = useState<string>(""); 

  //조회된 단어 리스트
  const [wordList, setWordList] = useState<wordListItf>([]);

  //조회된 문장 리스트
  const [sentenceList, setSentenceList] = useState<sentenceListItf>([]);

  //저장된 단어 리스트 페이지
  const [selectedBookWordPage, setSelectedBookWordPage] = useState<number>(0);

  //단어 다음조회
  const [wordNextButtonYn, setWordNextButtonYn] = useState<boolean>(false); 

  //order type , 1~5 까지의 점수(별) order 순서 0:적용안함, 1:내림차순 2:오름차순
  const [wordOrderType, setWordOrderType] = useState<number>(0); 

  //조회된 결과 order type
  const [wordResultOrderType, setWordResultOrderType] = useState<number>(0);

  //학습완료단어보기
  const [learnedWordYn, setLearnedWordYn] = useState<boolean>(false);

  //학습완료된 단어 리스트
  const [learnedWordList, setLearnedWordList] = useState<wordListItf>([]);

  //저장된 학습완료된 단어 리스트 페이지
  const [selectedLearnWordPage, setSelectedLearnWordPage] = useState<number>(0);

  //학습완료 단어 다음조회
  const [learnedWordNextButtonYn, setLearnedWordNextButtonYn] = useState<boolean>(false); 

  //학습완료 단어 조회 결과 order type
  const [learnedWordResultOrderType, setLearnedWordResultOrderType] = useState<number>(0);

  //학습완료단어 버튼 스타일
  const [learnedWordBtn, setLearnedWordBtn] = useState<string>(" text-[#4A6D88] font-bold ");

  //단어 조회시 마지막  seq 
  const [wordSearchSeq, setWordSearchSeq] = useState<number>(0);

  //학습완료 단어 조회시 마지막 seq 
  const [learnedWordSearchSeq, setLearnedWordSearchSeq] = useState<number>(0);


  //조회된 문장 결과 order type
  const [sentenceResultOrderType, setSentenceResultOrderType] = useState<number>(0);

  //학습완료문장보기
  const [learnedSentenceYn, setLearnedSentenceYn] = useState<boolean>(false);

  //학습완료된 문장 리스트
  const [learnedSentenceList, setLearnedSentenceList] = useState<sentenceListItf>([]);

  //저장된 학습완료된 문장 리스트 페이지
  const [selectedLearnSentencePage, setSelectedLearnSentencePage] = useState<number>(0);

  //학습완료 문장 다음조회
  const [learnedSentenceNextButtonYn, setLearnedSentenceNextButtonYn] = useState<boolean>(false); 

  //학습완료 문장 조회 결과 order type
  const [learnedSentenceResultOrderType, setLearnedSentenceResultOrderType] = useState<number>(0);

  //학습완료문장 버튼 스타일
  const [learnedSentenceBtn, setLearnedSentenceBtn] = useState<string>(" text-[#4A6D88] font-bold ");

  //문장 조회시 마지막  seq 
  const [sentenceSearchSeq, setSentenceSearchSeq] = useState<number>(0);

  //학습완료 단어 조회시 마지막 seq 
  const [learnedSentenceSearchSeq, setLearnedSentenceSearchSeq] = useState<number>(0);
  
  //문장최초조회
  const [firstSearchSentenceYn, setFirstSearchSentenceYn] = useState<boolean>(false);
  

  useEffect(()=>{
    if(tab===0){
      setTabStyle1("border-b-2 border-b-[#4A6D88] font-bold ");
      setTabStyle2("border-b");
    }else{
      setTabStyle1("border-b");
      setTabStyle2("border-b-2 border-b-[#4A6D88] font-bold ");
    }
  },[tab]);

  useEffect(()=>{

    if(currentTab === 4){
      // console.log("학습");
      searchWord();
      learnWordcntsearch();
      searchLearnedWord();
      learnSentencecntsearch();
      setTab(0);

    }
    

  },[currentTab]);

  //단어 합계 조회 총 , 학습중, 완료
  async function learnWordcntsearch() {

    setWordCnt({
      userbywordtotalcnt:0, 
      userbywordcnt:0, 
      userbywordlearnedcnt:0, 
    });

    setSentenceCnt({
      userbysentencetotalcnt:0, 
      userbysentencecnt:0, 
      userbysentencelearnedcnt:0, 
    })

    setLearnedWordList([]);
    setLearnedWordYn(false);
    
    const obj = {
      userseq:userStateSet.userseq,
    }
    const retObj = await transactionAuth("get", "history/learnwordcntsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      setWordCnt({
        userbywordtotalcnt:retObj.sendObj.resObj.userbywordtotalcnt, 
        userbywordcnt:retObj.sendObj.resObj.userbywordcnt, 
        userbywordlearnedcnt:retObj.sendObj.resObj.userbywordlearnedcnt, 
      })
    }
  }

  async function changeTranslatorLang(lang:string){

    const obj = {
      userseq:userStateSet.userseq,
      email:userStateSet.email,
      preferred_trans_lang:lang

    }
    const retObj = await transactionAuth("post", "user/usertranslatorupdate", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      userStateSet.preferredTransLangSet(lang);
    }
  }

  function tabClick(tabId:number){
    setTab(tabId);
  }

  //최초조회
  async function searchWord(){ 
    
    setWordList([]);
    setWordSearchSeq(0);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1, 
      orderType:wordOrderType,
      learningyn:false,
      lastSeq:0
    }



    const retObj = await transactionAuth("get", "history/learnwordsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setWordResultOrderType(wordOrderType);
      setWordList(retObj.sendObj.resObj);
      const lastArr = retObj.sendObj.resObj.length-1;
      setWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);
      setSelectedBookWordPage(1);
    }
  }

  //단어보기버튼클릭
  function onclickWordSee(id:string, wordseeYn:boolean){
    const wordIndex = wordList.findIndex((elem) => elem._id === id);
    
    if(wordseeYn){
      wordList[wordIndex].wordsee = false;
    }else{
      wordList[wordIndex].wordsee = true;
    }
    
    setWordList([...wordList]);
  }

  //저장한 단어 리스트 다음 조회
  async function nextSelectedBookWord() {

    const obj = {
      userseq:userStateSet.userseq,
      orderType:wordOrderType,
      learningyn:false,
      lastSeq:wordSearchSeq,
    }

    const retObj = await transactionAuth("get", "history/learnwordsearch", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        setWordResultOrderType(wordOrderType);
        setWordList([...wordList ,...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        setWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);
        // setSelectedBookWordPage(selectedBookWordPage+1);
      }
    }   
  }

  //학습완료단어조회
  async function searchLearnedWord(){ 
    
    setSelectedLearnWordPage(0);
    setLearnedWordList([]);
    setLearnedWordSearchSeq(0);

    const obj = {
      userseq:userStateSet.userseq, 
      // currentPage:1, 
      orderType:wordOrderType,
      learningyn:true,
      lastSeq:0
    }

    const retObj = await transactionAuth("get", "history/learnwordsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      setLearnedWordResultOrderType(wordOrderType);
      setLearnedWordList(retObj.sendObj.resObj);
      const lastArr = retObj.sendObj.resObj.length-1;
      setLearnedWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);
      // setSelectedLearnWordPage(1);
    }
  }

  //학습완료단어 다음조회
  async function nextSearchLearnedWord(){ 
    const obj = {
      userseq:userStateSet.userseq, 
      // currentPage:selectedLearnWordPage+1, 
      orderType:wordOrderType,
      learningyn:true,
      lastSeq:learnedWordSearchSeq,
    }

    const retObj = await transactionAuth("get", "history/learnwordsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      if(retObj.sendObj.resObj.length > 0){
        setLearnedWordResultOrderType(wordOrderType);
        setLearnedWordList([...learnedWordList, ...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        setLearnedWordSearchSeq(retObj.sendObj.resObj[lastArr].seq);
        // setSelectedLearnWordPage(selectedLearnWordPage+1);
      }
    }
  }

  //단어학습완료
  async function onclickWordLearned(id:string) {
    const obj = {
      _id:id,
      email:userStateSet.email,
    }

     const retObj = await transactionAuth("post", "history/wordlearningfinish", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      const wordIndex = wordList.findIndex((elem) => elem._id === id);
      wordList[wordIndex].learningyn = true;
      wordList.splice(wordIndex,1);
      setWordList([...wordList]);
      learnWordcntsearch();
    }   
  }

  async function learnedWordSee(){
    setLearnedWordYn(!learnedWordYn);
  }

  useEffect(()=>{
    if(learnedWordYn){
      searchLearnedWord();
      setLearnedWordBtn(" text-gray-500 ");
    }else{
      setLearnedWordBtn(" text-[#4A6D88] font-bold  ");
    }
  },[learnedWordYn]);
  

  //문장 학습완료 버튼 클릭
  function learnedSentenceSee(){ 
    setLearnedSentenceYn(!learnedSentenceYn);
  }

  useEffect(()=>{
    if(learnedSentenceYn){
      searchLearnedSentence();
      setLearnedSentenceBtn(" text-gray-500 ");
    }else{
      setLearnedSentenceBtn(" text-[#4A6D88] font-bold  ");
    }
  },[learnedSentenceYn]);


  //문장탭으로 이동시 최초 조회 한다. 
  useEffect(()=>{
    if(tab === 1 && !firstSearchSentenceYn){
      setFirstSearchSentenceYn(true);
      searchSentence();
    }
  },[tab]);

  //최초 문장조회
  async function searchSentence(){ 
    // console.log(userStateSet);
    // setSelectedBookWordPage(0);
    setSentenceList([]);
    // setWordNextButtonYn(false);
    setSentenceSearchSeq(0);

    const obj = {
      userseq:userStateSet.userseq, 
      // currentPage:1, 
      orderType:wordOrderType,
      learningyn:false,
      lastSeq:0
    }



    const retObj = await transactionAuth("get", "history/learnsentencesearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj);
      // setSentenceResultOrderType(wordOrderType); 
      //문장을arr 단어로 분리
      

      for(let i=0; i<retObj.sendObj.resObj.length; i++){ 
        const senctenceText = retObj.sendObj.resObj[i].sentence.replace(/\n/g, " ").trim();
        const wordArr = senctenceText.split(" ");
        // console.log(wordArr);
        // retObj.sendObj.resObj[i].wordArr = wordArr;
        let wordSetArr = [];

        for(let j=0; j<wordArr.length; j++){
          const wordSet = {
            senctenceIndex:i,
            word:wordArr[j],
            length:wordArr[j].length,
            answer:""
          }

          wordSetArr.push(wordSet)
        }

        retObj.sendObj.resObj[i].wordArr = wordSetArr;

      }
      
      // console.log(retObj.sendObj.resObj);
      setSentenceList(retObj.sendObj.resObj);
      const lastArr = retObj.sendObj.resObj.length-1;
      setSentenceSearchSeq(retObj.sendObj.resObj[lastArr].seq);

      

    }
  } 
  
  //저장한 문장 리스트 다음 조회
  async function nextSentenceWord() {

    const obj = {
      userseq:userStateSet.userseq,
      orderType:wordOrderType,
      learningyn:false,
      lastSeq:sentenceSearchSeq,
    }

    const retObj = await transactionAuth("get", "history/learnsentencesearch", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      if(retObj.sendObj.resObj.length > 0){
        // setWordResultOrderType(wordOrderType);

        for(let i=0; i<retObj.sendObj.resObj.length; i++){ 
          const senctenceText = retObj.sendObj.resObj[i].sentence.replace(/\n/g, " ").trim();;
          const wordArr = senctenceText.split(" ");
          // console.log(wordArr);
          // retObj.sendObj.resObj[i].wordArr = wordArr;
          let wordSetArr = [];

          for(let j=0; j<wordArr.length; j++){
            const wordSet = {
              senctenceIndex:i,
              word:wordArr[j],
              length:wordArr[j].length,
              answer:""
            }

            wordSetArr.push(wordSet)
          }

          retObj.sendObj.resObj[i].wordArr = wordSetArr;

        }


        setSentenceList([...sentenceList ,...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        setSentenceSearchSeq(retObj.sendObj.resObj[lastArr].seq);
        // setSelectedBookWordPage(selectedBookWordPage+1);
      }
    }   
  }

  //학습완료 문장 리스트 조회
  async function searchLearnedSentence(){ 
    // console.log(userStateSet);
    // setSelectedBookWordPage(0); 
    setLearnedSentenceList([]);
    // setWordNextButtonYn(false);
    setSentenceSearchSeq(0);

    const obj = {
      userseq:userStateSet.userseq, 
      orderType:wordOrderType,
      learningyn:true,
      lastSeq:0
    }



    const retObj = await transactionAuth("get", "history/learnsentencesearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){

      if(retObj.sendObj.resObj.length > 0){

        setLearnedSentenceList(retObj.sendObj.resObj);
        const lastArr = retObj.sendObj.resObj.length-1;
        setLearnedSentenceSearchSeq(retObj.sendObj.resObj[lastArr].seq);

      }

      

    }
  }


  //학습완료 문장 리스트 다음 조회
  async function nextSearchLearnedSentence(){ 


    const obj = {
      userseq:userStateSet.userseq, 
      orderType:wordOrderType,
      learningyn:true,
      lastSeq:learnedSentenceSearchSeq,
    }



    const retObj = await transactionAuth("get", "history/learnsentencesearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){

      if(retObj.sendObj.resObj.length > 0){

        setLearnedSentenceList([...learnedSentenceList ,...retObj.sendObj.resObj]);
        const lastArr = retObj.sendObj.resObj.length-1;
        setLearnedSentenceSearchSeq(retObj.sendObj.resObj[lastArr].seq);

      }
      

    }
  } 

  //문장 합계 조회 총 , 학습중, 완료
  async function learnSentencecntsearch() {

    setSentenceCnt({
      userbysentencetotalcnt:0, 
      userbysentencecnt:0, 
      userbysentencelearnedcnt:0, 
    })

    // setLearnedWordList([]);
    // setLearnedWordYn(false);
    
    const obj = {
      userseq:userStateSet.userseq,
    }
    const retObj = await transactionAuth("get", "history/learnsentencecntsearch", obj, "", false, true, screenShow, errorShow);
    if(retObj.sendObj.success === "y"){
      // console.log(retObj.sendObj.resObj);
      setSentenceCnt({
        userbysentencetotalcnt:retObj.sendObj.resObj.userbysentencetotalcnt, 
        userbysentencecnt:retObj.sendObj.resObj.userbysentencecnt, 
        userbysentencelearnedcnt:retObj.sendObj.resObj.userbysentencelearnedcnt, 
      })
    }
  }

  function wordInputOnchange(e:any, index:any, index2:number){    
    // console.log(sentenceList[index].wordArr[index2]);
    sentenceList[index].wordArr[index2].answer = e.target.value;
    setSentenceList([...sentenceList]);

    if(sentenceList[index].wordArr[index2].word.length === e.target.value.length){
      focusSentenceWordInputListRef.current[index*10000 + index2 + 1]?.focus();
    }

    

  }

  //정답확인
  function checkSentenceAnswer(index:number){
    
    if(sentenceList[index].currentState === "A" || sentenceList[index].currentState === "B"){
      return;
    }
    
    let wordArr = sentenceList[index].wordArr;
    sentenceList[index].currentState = "A"; 

    for(let i=0; i<wordArr.length; i++){

      // console.log(wordArr[i].answer);
      if(wordArr[i].answer){ //빈값이 아닌 경우
        // wordArr[i].style = ""

        let wordAStr = wordArr[i].answer; //사용자가 입력한 단어
        let wordCaStr = wordArr[i].word; //정답 

        //알파벳만 추출 후 소문자로 변환 뒤에 비교
        wordAStr = wordAStr.replace(/[^a-zA-Z0-9\s]/g, "").trim();
        wordAStr = wordAStr.toLowerCase();

        wordCaStr = wordCaStr.replace(/[^a-zA-Z0-9\s]/g, "").trim();
        wordCaStr = wordCaStr.toLowerCase();

        if(wordAStr === wordCaStr){
          wordArr[i].style = "a"; //정답
        }else{
          wordArr[i].style = "c"; //오답
        }

      }else{
        // wordArr[i].answer = wordArr[i].word;
        wordArr[i].style = "c"; //오답
      }

    }

    setSentenceList([...sentenceList]);

  }


  function seeSentence(index:number){ //문장보기

    if(sentenceList[index].currentState === "B"){
      return;
    }
    
    let wordArr = sentenceList[index].wordArr;
    sentenceList[index].currentState = "B"; 

    for(let i=0; i<wordArr.length; i++){

      wordArr[i].answer = wordArr[i].word;
      wordArr[i].style = "b"; //오답


    }

    setSentenceList([...sentenceList]);

  }

  function initSentence(index:number){

    if(sentenceList[index].currentState === "C"){
      return;
    }
    
    let wordArr = sentenceList[index].wordArr;
    sentenceList[index].currentState = "C"; 

    for(let i=0; i<wordArr.length; i++){

      wordArr[i].answer = "";
      wordArr[i].style = ""; //오답


    }

    setSentenceList([...sentenceList]);

  }

  //문장학습완료
  async function onclickSentenceLearned(id:string) {
    const obj = {
      _id:id,
      email:userStateSet.email,
    }

    const retObj = await transactionAuth("post", "history/sentencelearningfinish", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){
      const sentenceIndex = sentenceList.findIndex((elem) => elem._id === id);
      sentenceList[sentenceIndex].learningyn = true;
      sentenceList.splice(sentenceIndex,1);
      setSentenceList([...sentenceList]);
      learnSentencecntsearch();
    }   
  }
  
  


  return(
    <div className="w-full ">
      <div className="flex flex-col w-full items-center ">
        <div className="w-full 2xl:w-[800px]  xl:w-[800px]  lg:w-[800px]  md:w-[600px]  sm:w-full px-1 mt-8 ">
          <div className="flex flex-row text-xs ">
          {
            (userStateSet.preferred_trans_lang === "kr")?
            <>
              <p className="flex flex-row items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>changeTranslatorLang("kr")}
              ><IoIosRadioButtonOn />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[1]:""}</p>
              <p className="flex flex-row items-center cursor-pointer ms-3
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>changeTranslatorLang("es")}
              ><IoMdRadioButtonOff />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[2]:""}</p>
            </>
            :<>
              <p className="flex flex-row items-center cursor-pointer
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>changeTranslatorLang("kr")}
              ><IoMdRadioButtonOff />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[1]:""}</p>
              <p className="flex flex-row items-center cursor-pointer ms-3
              transition-transform duration-300 ease-in-out
              hover:scale-110 transform
              "
              onClick={()=>changeTranslatorLang("es")}
              ><IoIosRadioButtonOn />&nbsp;{(languageStateSet.main_language_set[8])?languageStateSet.main_language_set[8].text[2]:""}</p> 
            </>
          }
          </div>
          <div className=" w-full mt-4 "> {/* 학습 */}
            <div className="flex justify-start items-center "> {/** 단어, 문장 */}
              <div className={tabStyle1+`  py-1 px-5 cursor-pointer text-sm text-[#4A6D88]
              transition delay-50 duration-100 ease-in-out hover:scale-105
              ` }
              onClick={()=>tabClick(0)}
              > 
              {/* 단어 */}
              {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[0]:""}
              </div>
              <div className={tabStyle2+`  py-1 px-5 cursor-pointer text-sm text-[#4A6D88]
              transition delay-50 duration-100 ease-in-out hover:scale-105 
              ` }
              onClick={()=>tabClick(1)}
              >
              {/* 문장 */}
              {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[1]:""}
              </div>
            </div>
            <div className="w-full px-2 mt-2"> {/* 탭 내용 */}
              {
                (tab===0)?
                <div className="flex flex-col  ">
                  <div className="flex flex-col justify-end text-xs pt-2 pb-4  pe-2 ">
                    <div className="font-bold flex flex-1 flex-row mb-4">
                      <div>
                        {/* 전체 */}
                        {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[2]:""}
                         : {wordCnt.userbywordtotalcnt}</div>
                      <div className="ps-4">
                        {/* 학습중 */}
                        {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[3]:""}
                         : {` ${wordCnt.userbywordcnt}`}</div>
                      <div className="ps-4">
                        {/* 완료 */}
                        {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[4]:""}
                         : {`  ${wordCnt.userbywordlearnedcnt}`}</div>

                      {/* <div className="ps-2 text-green-700 flex items-center  ">
                        <span className="text-[17px]"><PiMicrosoftExcelLogoFill /></span>
                        <span className="text-[12px]">Excel</span>
                      </div> */}
                    </div>
                    <div className="flex justify-end text-xs pe-2 w-full ">
                      <div className={learnedWordBtn + ` flex justify-center cursor-pointer
                      transition delay-50 duration-100 ease-in-out hover:scale-105
                      `}
                      onClick={()=>learnedWordSee()}
                      >
                        <span className="text-sm pt-[1px] pe-[2px]"><CiCircleCheck /></span>
                        {/* 학습완료 */}
                        {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[5]:""}
                      </div>
                    </div>
                    
                  </div>
                  {
                    (learnedWordYn)?
                    <div className="overflow-y-scroll h-[400px] pe-2">
                    { //학습완료한 단어리스트
                      learnedWordList.map((elem, index)=>{
                        return(
                          <div key={index+200000} className="text-xs mb-4   ">
                            <div className="flex col-row">
                              <div className="flex col-row">
                                <span className="me-2">{index+1 + "."}</span>
                                {elem.word}
                              </div>
                              

                            
                            </div>
                            <div className="mt-4 max-h-[100px] overflow-y-auto">
                            {
                              (userStateSet.preferred_trans_lang === "kr")?
                              <>
                                {
                                  (elem.wordinfo.reworkynKR)?
                                  <div dangerouslySetInnerHTML={{ __html: elem.wordinfo.reworkmeaningKR }}></div>
                                  :elem.wordinfo.meaningKR
                                }
                              </>
                              :
                              <>
                                {
                                  (elem.wordinfo.reworkynES)?
                                  <div dangerouslySetInnerHTML={{ __html: elem.wordinfo.reworkmeaningES }}></div>
                                  :elem.wordinfo.meaningES
                                }
                              </>
                            }
                            </div>
                          </div>
                        )
                      })
                    }
                    </div>
                    :
                    <div className="overflow-y-scroll h-[400px] pe-2"> {/* 저장한 단어 */}
                    {
                      wordList.map((elem, index)=>{
                        return(
                          <div key={index+100000} className="text-xs mb-4   ">
                            <div className="flex col-row">
                              <div className="flex col-row">
                                <span className="me-2">{index+1 + "."}</span>
                                <input className={` 
                                border-b h-[18px] border-b-[#A0A0A0] outline-none focus:border-[#4A6D88] focus:border-b-2
                                `}
                                maxLength={elem.word.length}
                                ref={(element) => {focusWordInputListRef.current[index] = element;}}
                                style={{
                                    width:elem.word.length * 10 + "px",
                                    fontFamily:"Consolas",
                                    letterSpacing:"0.2em",
                                    imeMode: 'inactive'
                                }}
                                
                                ></input>
                              </div>
                              
                              <div className="flex col-row w-full justify-end ">
                                <div className="me-1">
                                  <ButtonLearning text={ //단어보기
                                    (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[6]:""
                                  } disabled={elem.wordsee} disabledText={
                                    (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[6]:""
                                  } 
                                  onClick={()=>onclickWordSee(elem._id, elem.wordsee)} />
                                </div>
                                <div>
                                  <ButtonTranslator text={ //학습완료
                                    (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[7]:""
                                  } disabled={elem.learningyn} disabledText={
                                    (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[7]:""
                                  }
                                  onClick={()=>onclickWordLearned(elem._id)} />
                                </div>
                              </div>
                              
                            </div>
                            <div className="flex ps-4 pt-2">
                              {
                                (elem.wordsee)?
                                <p className=" text-red-700 font-bold border-b text-center "
                                style={{
                                  width:elem.word.length * 10 + "px",
                                  fontFamily:"Consolas",
                                  letterSpacing:"0.2em",
                                  imeMode: 'inactive'
                                }}
                                >{elem.word}</p>:""
                              }
                            </div>
                            <div className="mt-4 max-h-[100px] overflow-y-auto">
                            {
                              (userStateSet.preferred_trans_lang === "kr")?
                              <>
                                {
                                  (elem.wordinfo.reworkynKR)?
                                  <div dangerouslySetInnerHTML={{ __html: elem.wordinfo.reworkmeaningKR }}></div>
                                  :elem.wordinfo.meaningKR
                                }
                              </>
                              :
                              <>
                                {
                                  (elem.wordinfo.reworkynES)?
                                  <div dangerouslySetInnerHTML={{ __html: elem.wordinfo.reworkmeaningES }}></div>
                                  :elem.wordinfo.meaningES
                                }
                              </>
                            }
                            </div>
                          </div>
                        )
                      })
                    }
                    </div >

                  }
                  
                  



                </div>
                :
                // 문장학습
                <div className="flex flex-col  "> 
                  

                  <div className="flex flex-col justify-end text-xs pt-2 pb-4  pe-2 ">
                    <div className="font-bold flex flex-1 flex-row mb-4">
                      <div>
                        {/* 전체 */}
                        {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[2]:""}
                          : {sentenceCnt.userbysentencetotalcnt}</div>
                      <div className="ps-4">
                        {/* 학습중 */}
                        {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[3]:""}
                          : {` ${sentenceCnt.userbysentencecnt}`}</div>
                      <div className="ps-4">
                        {/* 완료 */}
                        {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[4]:""}
                          : {` ${sentenceCnt.userbysentencelearnedcnt}`}</div>

                      {/* <div className="ps-2 text-green-700 flex items-center  ">
                        <span className="text-[17px]"><PiMicrosoftExcelLogoFill /></span>
                        <span className="text-[12px]">Excel</span>
                      </div> */}
                    </div>
                    <div className="flex justify-end text-xs pe-2 w-full ">
                      <div className={learnedSentenceBtn + ` flex justify-center cursor-pointer
                      transition delay-50 duration-100 ease-in-out hover:scale-105
                      `}
                      onClick={()=>learnedSentenceSee()}
                      >
                        <span className="text-sm pt-[1px] pe-[2px]"><CiCircleCheck /></span>
                        {/* 학습완료 */}
                        {(languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[5]:""}
                      </div>
                    </div>
                    
                  </div>
                  {
                    (learnedSentenceYn)?
                    <div className="overflow-y-scroll h-[400px] pe-2 mb-3">
                    { //학습완료한 문장리스트
                      learnedSentenceList.map((elem, index)=>{
                        return(
                          <div key={index+400000} className="text-xs mb-4 ">
                            <div className="flex flex-col">
                              <div className="flex ">
                                <span className="me-2">{index+1 + "."}</span>
                              </div>
                              <div className="mt-2">
                                {elem.sentence}
                              </div>
                              

                            
                            </div>
                            <div className="flex flex-col p-2 mt-3 max-h-[100px] overflow-y-auto bg-gray-200 rounded-md ">
                              {
                                (userStateSet.preferred_trans_lang === "kr")?
                                <>
                                  {
                                    elem.translatedsentenceKR
                                  }
                                </>
                                :
                                <>
                                  {
                                    elem.translatedsentenceES
                                  }
                                </>
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                    </div>
                    :
                    <div className="overflow-y-scroll h-[400px] pe-2"> {/* 저장한 문장 - 학습중 */}
                    {
                      sentenceList.map((elem, index)=>{
                        return(
                          <div key={index+300000} className="text-xs mb-4   ">
                            
                            <div className="  ">
                              <div className="flex  w-full ">
                                <div className=" ps-2  ">
                                  <span className="me-2">{index+1 + "."}</span>
                                </div>
                                <div className="flex flex-1 justify-end">
                                  <div className="me-1">
                                    <ButtonLearning text={ //정답확인
                                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[10]:""
                                    } disabled={elem.sentenceSee} disabledText={
                                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[10]:""
                                    } 
                                    onClick={()=>checkSentenceAnswer(index)}
                                    />
                                  </div>
                                  <div className="me-1">
                                    <ButtonLearning text={ //문장보기
                                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[8]:""
                                    } disabled={elem.sentenceSee} disabledText={
                                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[8]:""
                                    } 
                                    onClick={()=>seeSentence(index)}
                                    />
                                  </div>
                                  <div className="me-1">
                                    <ButtonLearning text={ //다시하기
                                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[9]:""
                                    } disabled={elem.sentenceSee} disabledText={
                                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[9]:""
                                    } 
                                    onClick={()=>initSentence(index)}
                                    />
                                  </div>
                                  <div>
                                    <ButtonTranslator text={ //학습완료
                                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[7]:""
                                    } disabled={elem.learningyn} disabledText={
                                      (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[11].text[7]:""
                                    }
                                    onClick={()=>onclickSentenceLearned(elem._id)}
                                    />
                                  </div>
                                    
                                </div>
                              </div>
                              


                              <div className=" relative p-2  ">
                                {
                                  elem.wordArr.map((elem2, index2) => {
                                    return (
                                      // <div key={index2 + 40000} >{elem2.length}</div>
                                      <div key={index2 + 40000} className="inline-block">
                                        {
                                          (elem2.style === "a" || elem2.style === "c")?
                                          <span className="absolute text-[8px]"
                                          style={{
                                            color:(elem2.style=== "a")?"green":
                                              (elem2.style === "c")?"red":"" ,
                                          }}
                                          ><FaRegCheckCircle/></span>
                                          :""
                                        }
                                        
                                        <input  className={` me-2 my-1
                                        border-b h-[24px] border-b-[#A0A0A0] outline-none focus:border-[#4A6D88] focus:border-b-2
                                        `}
                                        maxLength={elem2.length}
                                        ref={(element) => {focusSentenceWordInputListRef.current[index*10000 + index2] = element;}}
                                        style={{
                                            width:elem2.length * 10 + "px", 
                                            fontFamily:"Consolas",
                                            letterSpacing:"0.2em",
                                            imeMode: 'inactive',
                                            color:(elem2.style=== "a")?"green":
                                            (elem2.style === "b")?"blue":
                                            (elem2.style === "c")?"red":"" ,
                                        }}
                                        value={elem2.answer}
                                        onChange={(e)=>wordInputOnchange(e, index , index2)}
                                        ></input>
                                      </div>

                                    )
                                  })
                                }
                              </div>

                              <div className="flex flex-col p-2 mt-3 max-h-[100px] overflow-y-auto bg-gray-200 rounded-md ">
                                {
                                  (userStateSet.preferred_trans_lang === "kr")?
                                  <>
                                    {
                                      elem.translatedsentenceKR
                                    }
                                  </>
                                  :
                                  <>
                                    {
                                      elem.translatedsentenceES
                                    }
                                  </>
                                }
                              </div>
                              
                              
                              
                            </div>
                            
                          </div>
                        )
                      })
                    }
                    </div >

                  }


                </div>
              }
            </div> 

            {
              (tab===0)? //단어
                (learnedWordYn)?
                  // (learnedWordList.length > 0)?
                  <div className="flex justify-end text-xs mt-5 pe-2">
                    <p>
                      <ButtonHisBookListNext 
                        text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                        disabled={wordNextButtonYn}
                        disabledText={
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                      onClick={()=>nextSearchLearnedWord()}  
                      />
                    </p>
                  </div>
                  // :""
                :
                // (wordList.length > 0)?
                  <div className="flex justify-end text-xs mt-5 pe-2 ">
                    <p>
                      <ButtonHisBookListNext 
                        text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                        disabled={wordNextButtonYn}
                        disabledText={
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                      onClick={()=>nextSelectedBookWord()}  
                      />
                    </p>
                  </div>
                  // :""
              
              : //문장
              (learnedSentenceYn)?
                  // (learnedWordList.length > 0)?
                  <div className="flex justify-end text-xs mt-5 pe-2">
                    <p>
                      <ButtonHisBookListNext 
                        text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                        disabled={wordNextButtonYn}
                        disabledText={
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                      onClick={()=>nextSearchLearnedSentence()}  
                      />
                    </p>
                  </div>
                  // :""
                :
                // (wordList.length > 0)?
                  <div className="flex justify-end text-xs mt-5 pe-2 ">
                    <p>
                      <ButtonHisBookListNext 
                        text={
                        (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                        disabled={wordNextButtonYn}
                        disabledText={
                          (languageStateSet.main_language_set[10])?languageStateSet.main_language_set[10].text[10]:""
                        }
                      onClick={()=>nextSentenceWord()}  
                      />
                    </p>
                  </div>
                  // :""

            }

            

          </div>


        </div>
      </div>
    </div>
  );
};

export default Learn