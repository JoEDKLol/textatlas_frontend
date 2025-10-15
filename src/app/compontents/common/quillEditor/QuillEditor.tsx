'use client';
import dynamic from 'next/dynamic';


const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: QuillComponent } = await import('react-quill-new');
    const _quill = ({ ref, ...props } : any) => (
      <QuillComponent ref={ref} {...props} />
    )
    return _quill
  },
  {
    ssr: false
  }
  
);

export default QuillNoSSRWrapper
