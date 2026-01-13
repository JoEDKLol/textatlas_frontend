'use client';

import loadingScreenShow from '@/app/store/loadingScreen';
import styles from './LoadingScreenlayout.module.scss';

const LoadingScreen2 = () => {

  const screenShow = loadingScreenShow();

  return(
    <>
    {
      (screenShow.screenShow)?(
      <div className= {` flex flex-col overflow-y-auto overflow-x-hidden 
      fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
        
      </div>
      ):""
    }
      
    </>
  )


    
}

export default LoadingScreen2;