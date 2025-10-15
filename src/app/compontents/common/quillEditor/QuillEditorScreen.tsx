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



const QuillEditorScreen = (props:any) => {
  const screenShow = loadingScreenShow();
  const errorShow = errorScreenShow();
  
  const quillInstance = useRef<ReactQuill>(null);



  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],

        ],
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
      // height :"200px"
    };
    



  return(
    <>  
      <div className='quill'>
      <QuillNoSSRWrapper
        className={props.styleType}
        ref={quillInstance}
        theme="snow"
        style={styles}
        value={props.content}
        onChange={props.setContent}
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