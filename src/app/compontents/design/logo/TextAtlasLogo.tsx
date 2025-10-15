// components/TextAtlasLogo.tsx
import React from 'react';
import styles from './TextAtlasLogo.module.scss'; // SCSS 모듈 임포트

interface TextAtlasLogoProps {
  variant?: 'light' | 'dark'; // 'light'는 밝은 배경, 'dark'는 어두운 배경 (헤더 등)
}

const TextAtlasLogo: React.FC<TextAtlasLogoProps> = ({ variant = 'light' }) => {
  const logoClass = `${styles.textAtlasWordmark} ${variant === 'dark' ? styles.onDarkBackground : ''}`;
  
  return (
    <div className={logoClass}>
      <span className={styles.textPart}>Text</span>
      <span className={styles.atlasPart}>Atlas</span>
    </div>
  );
};

export default TextAtlasLogo;