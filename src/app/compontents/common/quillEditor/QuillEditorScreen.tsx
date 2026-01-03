'use client';
import React, { useMemo, useRef } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from "react-quill-new";
import './styles.scss';
import './styles2.scss';
import loadingScreenShow from '@/app/store/loadingScreen';
import errorScreenShow from '@/app/store/errorScreen';
import QuillNoSSRWrapper from './QuillEditor';
import { MdHeight } from 'react-icons/md';
import { transactionFile } from '@/app/utils/axiosFile';



const QuillEditorScreen = (props:any) => {
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  
  const quillInstance = useRef<ReactQuill>(null);

  const imageHandler = async (imageBase64URL:any, imageBlob:any, editor:any) => {

    const imgUploadRes = await transactionFile("community/fileUploadS3", imageBlob, {}, "", false, true, screenShow, errorShow);

    if(imgUploadRes.sendObj.success === "y"){
      const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", `${imgUploadRes.sendObj.resObj.img_url}`);
    }else{
      errorShow.screenShowTrue();
        errorShow.messageSet(imgUploadRes.sendObj.resObj.errMassage);
    }

    // const range = editor.getSelection();
    // editor.insertEmbed(range.index, "image", `test`);

  }


  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ["link", "image"],
          ['clean'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],

        ],
        handlers: {
          image: imageHandler // 이미지 tool 사용에 대한 핸들러 설정
        },
       
      },

      // 이미지 크기 조절
      ImageResize : {
        modules: ["Resize", "DisplaySize"],
      },

      imageCompress: {
        quality: 1,
        maxWidth: 1000, 
        maxHeight: 1000, 
        debug: false, // default
        suppressErrorLogging: false, 
        // insertIntoEditor : undefined
        insertIntoEditor: (imageBase64URL:any, imageBlob:any, editor:any) => {
          imageHandler(imageBase64URL, imageBlob, editor)
        }
      },
      
    }),
    [],
  );

  const modules2 = useMemo(
    () => (
      {
      toolbar: null,
      
    }),
    [],
  );

  const styles = 
    {
      backgroundColor:props.bgColor,
      // width: ""
      // height :"200px",
      // borderRadius:""
      // border-left: 1px solid red;
      // border-right: 1px solid red;
      // border-bottom: 1px solid red;
    };
    
  const limit = 1000;

  


  return(
    <>  
      <div className='quill'>
      <QuillNoSSRWrapper
        className={props.styleType}
        ref={quillInstance}
        theme="snow"
        style={styles}
        value={props.content}
        onChange={props.onChange}
        readOnly={props.readOnly}
        modules={
          (props.styleType==="style")?modules:modules2
        }
        
      />
    </div>
    </>
  );
};

export default QuillEditorScreen