import { GrFormPreviousLink } from "react-icons/gr";
import { GrFormNextLink } from "react-icons/gr";

const HomeHeaderMenuButton = (props:any) => {
  return (
  <>
  {
    (!props.disabled)?
    <button
    onClick={props.onClick}
    className="w-full bg-[#4A6D88]
    text-white 
    py-1 px-2 font-bold cursor-pointer 
    text-[12px]
    transition-transform duration-300 ease-in-out
    hover:scale-110 transform inline-block
    " 
    >{props.text}
    
    </button>
    :<button
    disabled={props.disabled}
    className="w-full  text-[12px] 
    bg-white text-[#4A6D88]
    py-1 px-2 rounded-lg font-bold cursor-pointer 
    " 
    >{props.text}</button>
  }
    
  </>
    
  );
}

const HomeHeaderMenuButtonL = (props:any) => {
  return (
  <>
  {
    (!props.disabled)?
    <button
    onClick={props.onClick}
    className="w-full bg-[#4A6D88]
    text-white 
    py-1 px-2 font-bold cursor-pointer 
    text-[15px]
    transition-transform duration-300 ease-in-out
    hover:scale-110 transform inline-block
    " 
    >{props.text}
    
    </button>
    :<button
    disabled={props.disabled}
    className="w-full  text-[15px] 
    bg-white text-[#4A6D88]
    py-1 px-2 rounded-lg font-bold cursor-pointer 
    " 
    >{props.text}</button>
  }
    
  </>
    
  );
}

const HomeHeaderSignInButton = (props:any) => {
  return (
    <button
    onClick={props.onClick}
    className="
    px-2 py-1              
    border-2 border-white   
    text-white             
    rounded-md              
    font-semibold           
    hover:bg-white          
    hover:text-[#4A6D88]    
    transition-all duration-200 ease-in-out 
    cursor-pointer inline-block
    text-[12px]
    " 
    >{props.text}
    </button>
  );
}

const HomeHeaderSignInButtonL = (props:any) => {
  return (
    <button
    onClick={props.onClick}
    className="
    px-2 py-1              
    border-2 border-white   
    text-white             
    rounded-md              
    font-semibold           
    hover:bg-white          
    hover:text-[#4A6D88]    
    transition-all duration-200 ease-in-out 
    cursor-pointer inline-block
    text-[15px]
    " 
    >{props.text}
    </button>
  );
}

const ReadingPrev = (props:any) => {
  return (
  <>
  {
    (!props.disabled)?
    <button className="border border-[#4A6D88] w-[36px] text-lg bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold  rounded
    transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[2px]
    "
    onClick={props.onClick}
    >
    <GrFormPreviousLink/>
    </button>
    :<button
    disabled={props.disabled}
    className="border border-[#4A6D88] w-[36px] text-lg bg-gray-200 text-gray-400 font-bold  rounded
     ps-2 py-[2px]
    "
    ><GrFormPreviousLink/></button>
  }
    
  </>
    
  );


}

const ReadingNext = (props:any) => {
  return (
  <>
  {
    (!props.disabled)?
    <button className="border border-[#4A6D88] w-[36px] text-lg bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold  rounded
    transition-all duration-200 ease-in-out cursor-pointer ps-2 py-[2px]
    "
    onClick={props.onClick}
    >
    <GrFormNextLink/>
    </button>
    :<button
    disabled={props.disabled}
    className="border border-[#4A6D88] w-[36px] text-lg bg-gray-200 text-gray-400 font-bold  rounded
     ps-2 py-[2px]
    "
    ><GrFormNextLink/></button>
  }
    
  </>
    
  );


}

const ButtonTranslator = (props:any) => {
  return (
  <>
    {
      (!props.disabled)?
      <button
      onClick={props.onClick}
      // disabled={props.disabled}
      className={ ` w-full border text-[10px] 
          bg-gray-400 text-white 
          transition delay-50 duration-100 ease-in-out hover:scale-105
          py-0.5 px-1 rounded-md cursor-pointer`} 
      >{props.text}</button>
      :
      <button
      disabled={props.disabled}
      className={` w-full border text-[10px] 
      py-0.5 px-1 rounded-md border-gray-400 bg-gray-50`} 
      >{props.disabledText}</button>
    }
  </>
  ); 
}

const ButtonHisBookList = (props:any) => {
  return (
  <>
    {
      (!props.disabled)?
      <button
      onClick={props.onClick}
      // disabled={props.disabled}
      className={ ` border border-[#4A6D88] w-full text-[10px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white   rounded
      transition-all duration-200 ease-in-out cursor-pointer px-1 py-0.5
     `} 
      >{props.text}</button>
      :
      <button
      disabled={props.disabled}
      className={ ` w-full text-[10px] bg-[#4A6D88] text-white font-bold  rounded
      transition-all duration-200 ease-in-out px-1 py-0.5
      `}
      >{props.disabledText}</button>
    }
  </>
  ); 
}

const ButtonHisBookListNext = (props:any) => {
  return (
  <>
    {
      (!props.disabled)?
      <button
      onClick={props.onClick}
      // disabled={props.disabled}
      className={ ` border border-[#4A6D88] w-full text-sm bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white   rounded
      transition-all duration-200 ease-in-out cursor-pointer px-1 py-0.5
     `} 
      >{props.text}</button>
      :
      <button
      disabled={props.disabled}
      className={ ` w-full text-sm bg-[#d9dcde] text-white font-bold  rounded
      transition-all duration-200 ease-in-out px-1 py-0.5
      `}
      >{props.disabledText}</button>
    }
  </>
  ); 
}

const ButtonLearning = (props:any) => {
  return (
  <>
    {
      (!props.disabled)?
      <button
      onClick={props.onClick}
      // disabled={props.disabled}
      className={ ` w-full border text-[10px] 
          bg-gray-400 text-white 
          transition delay-50 duration-100 ease-in-out hover:scale-105
          py-0.5 px-1 rounded-md cursor-pointer`} 
      >{props.text}</button>
      :
      <button
      onClick={props.onClick}
      className={` w-full border text-[10px] 
      py-0.5 px-1 rounded-md border-gray-400 bg-gray-50
      transition delay-50 duration-100 ease-in-out hover:scale-105
      cursor-pointer
      `} 
      >{props.disabledText}</button>
    }
  </>
  ); 
}

const ButtonBase = (props:any) => {
  return (
  <button 
  className={`border border-[#4A6D88] w-full text-[14px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold py-1 px-3 rounded
  transition-all duration-200 ease-in-out cursor-pointer`}
  onClick={props.onClick}
  >{props.text}</button>
  ); 
}

const ButtonBaseAddTags = (props:any) => {
  return (
  <button 
  className={`border border-[#4A6D88] text-[12px] w-[100px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold py-1 px-4 rounded-2xl
  transition-all duration-200 ease-in-out cursor-pointer`}
  onClick={props.onClick}
  >{props.text}</button>
  ); 
}

const ButtonCommentSave = (props:any) => {
  return (
  <>
    {
      (!props.disabled)?
      <button
      onClick={props.onClick}
      // disabled={props.disabled}
      className={ ` border border-[#4A6D88] w-full text-xs bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white   rounded
      transition-all duration-200 ease-in-out cursor-pointer px-1 py-0.5
     `} 
      >{props.text}</button>
      :
      <button
      disabled={props.disabled}
      className={ ` w-full text-xs bg-[#d9dcde] text-white font-bold  rounded
      transition-all duration-200 ease-in-out px-1 py-0.5
      `}
      >{props.disabledText}</button>
    }
  </>
  ); 
}

const ButtonSubComment = (props:any) => {
  return (
  <button 
  className={`border border-[#4A6D88] text-[9px] w-[100px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold py-1 px-3 rounded-2xl
  transition-all duration-200 ease-in-out cursor-pointer`}
  onClick={props.onClick}
  >{props.text}</button>
  ); 
}


const ButtonCommentNext = (props:any) => {
  return (
  <button 
  className={`border border-[#4A6D88] text-[12px] w-[120px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white font-bold py-1 px-3 rounded-2xl
  transition-all duration-200 ease-in-out cursor-pointer`}
  onClick={props.onClick}
  >{props.text}</button>
  ); 
}

const ButtonMessage = (props:any) => {
  return (
  <>
    {
      (!props.disabled)?
      <button
      onClick={props.onClick}
      // disabled={props.disabled}
      className={ ` border border-[#4A6D88] w-full text-[12px] bg-white text-[#4A6D88] hover:bg-[#4A6D88] hover:text-white   rounded
      transition-all duration-200 ease-in-out cursor-pointer px-1 py-0.5
     `} 
      >{props.text}</button>
      :
      <button
      disabled={props.disabled}
      className={ ` w-full text-[12px] bg-[#4A6D88] text-white font-bold  rounded
      transition-all duration-200 ease-in-out px-1 py-0.5
      `}
      >{props.disabledText}</button>
    }
  </>
  ); 
}

export {
  HomeHeaderMenuButton, HomeHeaderSignInButton, HomeHeaderMenuButtonL, HomeHeaderSignInButtonL, ReadingPrev, ReadingNext,
  ButtonTranslator, ButtonHisBookList, ButtonHisBookListNext, ButtonLearning, ButtonBase, ButtonBaseAddTags, ButtonCommentSave,
  ButtonSubComment, ButtonCommentNext, ButtonMessage
};