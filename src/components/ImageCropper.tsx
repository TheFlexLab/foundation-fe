import { useEffect, useRef } from 'react';
import { CircleStencil, Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

interface ICoordinates {
  width: number;
  height: number;
  left: number;
  top: number;
}

interface ImageCropperProps {
  type: '16:9' | 'rounded';
  onCropComplete: (blob: Blob | null, coordinates: ICoordinates | null) => void;
  image: string;
  coordinates?: ICoordinates | null;
}

const ImageCropper = (props: ImageCropperProps) => {
  const { type, onCropComplete, image, coordinates } = props;
  const cropperRef = useRef<CropperRef>(null);

  const handleCrop = async () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg'));
        onCropComplete(blob, cropperRef.current?.getCoordinates());
      } else {
        onCropComplete(null, null);
      }
    }
  };

  useEffect(() => {
    // Clean up the image URL when the component unmounts
    return () => {
      if (image && typeof image === 'string' && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="w-full space-y-1 tablet:space-y-3">
      {type === '16:9' && (
        <Cropper
          ref={cropperRef}
          src={image}
          className="h-[220px] w-full tablet:h-[380px]"
          stencilProps={{
            aspectRatio: 16 / 9,
          }}
          onReady={() => {
            if (coordinates && cropperRef.current) {
              cropperRef.current.setCoordinates(coordinates);
            }
          }}
          onInteractionEnd={() => handleCrop()}
        />
      )}
      {type === 'rounded' && (
        <Cropper
          ref={cropperRef}
          src={image}
          className="h-[220px] w-full tablet:h-[380px]"
          stencilComponent={CircleStencil}
          onReady={() => {
            if (coordinates && cropperRef.current) {
              cropperRef.current.setCoordinates(coordinates);
            }
          }}
          onInteractionEnd={() => handleCrop()}
        />
      )}
    </div>
  );
};

export default ImageCropper;
