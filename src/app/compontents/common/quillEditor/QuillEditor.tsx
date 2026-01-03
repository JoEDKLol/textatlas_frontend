'use client';
import dynamic from 'next/dynamic';


const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: QuillComponent } = await import('react-quill-new');
    const { ImageResize } = await import('quill-image-resize-module-ts'); //2025-01-02 add
    const { default: ImageCompress } = await import('quill-image-compress');
    QuillComponent.Quill.register('modules/imageCompress', ImageCompress);
    QuillComponent.Quill.register("modules/ImageResize", ImageResize);
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
