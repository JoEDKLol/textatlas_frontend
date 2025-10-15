'use client';
import { readExcel } from "@/app/compontents/common/execl";
import QuillEditorScreen from "@/app/compontents/common/quillEditor/QuillEditorScreen";
import errorScreenShow from "@/app/store/errorScreen";
import loadingScreenShow from "@/app/store/loadingScreen";
import { transactionAuth } from "@/app/utils/axiosAuth";
import { useRef, useState } from "react";


interface wordItf {
  _id:string
  word:string
  meaningES:string
  reworkmeaningES:string
  reworkynES:boolean
  selected:boolean
  style:string
}

interface wordListItf extends Array<wordItf>{}

const Main = (props:any) => {
  
  const userStateSet = props.userStateSet;
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  const focusWord = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [content, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchWord, setSarchWord] = useState<string>("");
  const [wordList, setWordList] = useState<wordListItf>([]);
  const [reworkyn, setReworkyn] = useState<string>("");

  const [newWordYn, setNewWordYn] = useState<boolean>(false);

  const [selectedWord, setSelectedWord] = useState<wordItf>({
    _id:"",
    word:"",
    meaningES:"",
    reworkmeaningES:"",
    reworkynES:false,
    selected:false,
    style:""
  });

  const [saveResMsg, setSaveResMsg] = useState<string>("");
  const [wordListSveResMsg, setWordListSveResMsg] = useState<string>("");


  

  async function searchWordList() {
    setWordList([]);
    setCurrentPage(1);

    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:1,
      word:searchWord,
      reworkyn:reworkyn
    }

    const retObj = await transactionAuth("get", "administrator/searchwordlistes", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){ 
      setCurrentPage(2);
      const list = retObj.sendObj.resObj;

      for(let i=0; i<list.length; i++){
        list[i].selected = false;
        list[i].style = "";
      }

      setWordList(list);
    }
  }

  async function searchWordListNext() {

    
    const obj = {
      userseq:userStateSet.userseq, 
      currentPage:currentPage,
      word:searchWord,
      reworkyn:reworkyn
    }

    const retObj = await transactionAuth("get", "administrator/searchwordlistes", obj, "", false, true, screenShow, errorShow);

    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj);
      setCurrentPage(currentPage + 1);
      const list = retObj.sendObj.resObj;

      for(let i=0; i<list.length; i++){
        list[i].selected = false;
        list[i].style = "";
      }
      setWordList([...wordList, ...list]);
    }
  }

  function searchWordOnChange(e:any){
    setSarchWord(e.target.value);
  }

  function wordListOnclick(index:number, word:string){
    setContent("");
    setNewWordYn(false);
    setSaveResMsg("");
    for(let i=0; i<wordList.length; i++){
      wordList[i].selected = false;
      wordList[i].style = " ";
    }
    setWordList([...wordList]);
    
    wordList[index].selected = true;
    wordList[index].style = "border-2 border-red-400 ";
    setSelectedWord(wordList[index]);
    setWordList([...wordList]);
    
    if(wordList[index].reworkynES){
      setContent(wordList[index].reworkmeaningES);
    }else{
      setContent(wordList[index].meaningES);
    }
  }

  function seletedWordOnChange(e:any){
    
    setSelectedWord({...selectedWord, word : e.target.value});
  }

  function newWordReg(){
    setSelectedWord({
      _id:"",
      word:"",
      meaningES:"",
      reworkmeaningES:"",
      reworkynES:false,
      selected:false,
      style:""
    });
    setNewWordYn(true);
    setContent("");
    setSaveResMsg("");
  }

  async function wordSave(){
    // console.log(selectedWord);
    setSaveResMsg("");
    if(!selectedWord.word){
      focusWord.current?.focus();
      setSaveResMsg("저장할 단어를 입력해주세요");
      return;
    }

    
    const obj = {
      _id:selectedWord._id,
      word:selectedWord.word,
      email:userStateSet.email,
      reworkmeaningES:content,
      newWordYn:newWordYn,
    }
    const retObj = await transactionAuth("post", "administrator/administratorwordupdatees", obj, "", false, true, screenShow, errorShow);
// console.log(retObj);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj);
      searchWordList();
    }else{
      if(retObj.sendObj.code === "9043"){
        setSaveResMsg(retObj.sendObj.message);
      }
    }
  }

  function handleKeyDown(e:any){
    if (e.key === 'Enter') {
      searchWordList();
    }
  }

  function managementYnonChange(e:any){
    setReworkyn(e.target.value);
  }

  const [excelData, setExcelData] = useState<any>([]);

  const handleFileUpload = async (e:any) => {
    setExcelData([]);
    setWordListSveResMsg("");
    const file = e.target.files[0];
    if (file) {
      try {
        let excelData = new Array;
        excelData = await readExcel(file) as any;
        
        let wordListArr = new Array;

        for(let i=0; i<excelData.length; i++){

          const meaningArr = excelData[i][1].split("\n");
          let mearning = ""; 
          for(let j=0; j<meaningArr.length; j++){
            mearning = mearning + "<p>"+meaningArr[j] + "</p>";
          }

          const wordObj = {
            word:excelData[i][0],
            reworkmeaningES : mearning,
            reworkynES : true,
          }

          if(i !== 0){
            wordListArr.push(wordObj);
          }

          if(i > 99){
            break;
          }
        }

        
        
        setExcelData(wordListArr);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    }
  };

  async function wordListSave(){

    setWordListSveResMsg("");

    if(excelData.length === 0) return;

    const obj = {
      wordlist:excelData,
      email:userStateSet.email,
    }


    const retObj = await transactionAuth("post", "administrator/administratorwordlistsavees", obj, "", false, true, screenShow, errorShow);
// console.log(retObj);
    if(retObj.sendObj.success === "y"){ 
      // console.log(retObj);
      // searchWordList();
      setWordListSveResMsg("저장 완료");
    }else{
      if(retObj.sendObj.code === "9043"){
        setSaveResMsg(retObj.sendObj.message);
      }
    }

  }

  return(<>
    <div className=" mt-[60px] h-[90vh] w-full">
      <div className="flex  justify-center items-center mt-[60px] w-full   ">
        <div className=" text-lg font-bold ">
          사전관리 영 에스파뇨
        </div>
      </div>
      <div className="w-full px-2 mt-3">
        <div className="grid grid-cols-1
        2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1
        ">
          <div className="flex justify-center px-1 me-5 ">
          {/* 단어 조회결과 */}
            <div className="w-full flex flex-col ">
              <div className="w-full flex justify-between">
                <div className="w-1/2">
                  <input value={searchWord} 
                  onChange={(e)=>searchWordOnChange(e)}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  className="w-full border p-1 bg-white text-xs rounded-sm"></input>
                </div>
                <div className="flex justify-center items-center text-sm ">
                  <div className="me-1">관리자등록</div>
                  <div>
                    <select className="border rounded-md text-xs bg-white p-1"
                    onChange={(e)=>managementYnonChange(e)}
                    >
                      <option value="">전체</option>
                      <option value="1">Yes</option>
                      <option value="2">No</option>
                    </select>
                  </div>
                  
                </div>
                <div className="flex justify-end pe-1">
                  <button className="text-xs rounded-lg bg-gray-200  px-2 py-0.5 font-bold
                  transition delay-50 duration-100 ease-in-out hover:scale-105 cursor-pointer
                  "
                  onClick={()=>searchWordList()}
                  >조회</button>
                </div>
              </div>
              {/* 조회된 단어 영역 */}
              <div className="w-full flex flex-col overflow-y-auto h-[400px] mt-2 p-2 bg-white ">


                {
                  wordList.map((elem, index)=>{
                    return(
                      <div  key={index+elem.word} className= {elem.style + " w-full p-1 rounded-md hover:border-2 border-red-200  "}
                      onClick={()=>wordListOnclick(index, elem.word)}
                      >
                        <div className=" flex justify-between text-xs py-1 ">
                          <div>{index+1 + ". " +  elem.word}</div>
                          <div className="text-green-500">
                            {
                              (elem.reworkynES)?"관리자 등록완료":""
                            }  
                          </div>
                        </div>
                        <div className="mt-1   px-2 py-1 text-xs rounded-md ">
                          {
                            (elem.reworkynES)?
                            // <div className=""  contentEditable={true}>{elem.reworkmeaning}</div>
                            <div dangerouslySetInnerHTML={{ __html: elem.reworkmeaningES }} className="text-[10px]" />
                            :elem.meaningES
                          }
                        </div>
                        <hr className="my-2"></hr>
                      </div>
                    )
                  })
                }
                
                
                
              </div>
              <div className="flex justify-end pe-1 mt-2">
                  <button className="text-xs rounded-lg bg-gray-200  px-2 py-0.5 font-bold
                  transition delay-50 duration-100 ease-in-out hover:scale-105 cursor-pointer
                  "
                  onClick={()=>searchWordListNext()}
                  >다음조회</button>
                </div>
            </div>

          </div>
          <div className="flex flex-col justify-start pt-2">
            <div className="flex justify-between">
              <div className="text-sm font-bold p-1">
                <input value={selectedWord.word}
                  ref={focusWord}
                  onChange={(e)=>seletedWordOnChange(e)}
                  disabled={!newWordYn}
                  className="w-full border p-1 bg-white text-xs rounded-sm"></input>
              </div>
              <div className="flex justify-center p-1">
                <button className="text-xs rounded-lg bg-gray-200  px-2 py-0.5 font-bold me-1
                  transition delay-50 duration-100 ease-in-out hover:scale-105 cursor-pointer
                  "
                  onClick={()=>newWordReg()}
                  >신규</button>
                <button className="text-xs rounded-lg bg-gray-200  px-2 py-0.5 font-bold 
                  transition delay-50 duration-100 ease-in-out hover:scale-105 cursor-pointer
                  "
                  onClick={()=>wordSave()}
                  >저장</button>
              </div>
            </div>
            <div className="text-red-500 text-xs">{saveResMsg}</div>
            {/* 단어 선택시 상세보기 */}
            <QuillEditorScreen bgColor={"#ffffff"} content={content} setContent={setContent} readOnly={false} styleType="style"  />
          </div>
          




        </div>

        {/* 엑셀 */}
        <div className="p-2 mt-5 border-t flex justify-end">
          <span className="text-xs me-3 text-red-600 flex justify-center items-center ">최대 100건</span>
          <span className="text-xs me-3 text-red-600 flex justify-center items-center ">{wordListSveResMsg}</span>
          <button className="
          w-[100px] text-xs border rounded-2xl bg-white cursor-pointer me-2
          "
          onClick={()=>imageInputRef.current?.click()}
          >엑셀 파일찾기</button>

          <button className="
          w-[100px] text-xs border rounded-2xl bg-white cursor-pointer
          "
          onClick={()=>wordListSave()}
          >저장하기</button>

          <input className="hidden"
          ref={imageInputRef}  type="file" accept=".xlsx, .xls" onChange={handleFileUpload}  />
        </div>
        <div className=" p-3 ">
          {/* <div className="w-full border-t border-r border-l"> */}
          <table className="border w-full text-xs">
            <thead className="  ">
              <tr>
                <th className=" border w-[40px] py-1 " >구분</th>
                <th className=" border w-[150px] ">word</th>
                <th className=" border ">mearning_es</th>
              </tr>
            </thead>
            <tbody>
            {
              excelData.map((elem:any, index:any)=>{
                return(
                  <tr key={index} className="">
                    <td className=" border text-center "> {index+1}</td>
                    <td className=" border px-1 ">{elem.word}</td>
                    <td className=" border p-1 ">{elem.reworkmeaningES}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </>
  );
};

export default Main