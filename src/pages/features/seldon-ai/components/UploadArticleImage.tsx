import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { toast } from 'sonner';
import api from '../../../../services/api/Axios';
import { getSeldonDataStates } from '../../../../features/seldon-ai/seldonDataSlice';
import { useSelector } from 'react-redux';

export default function UploadArticleImage({
  setSelectedFile,
}: {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to store the image URL
  const getSeldonDataState = useSelector(getSeldonDataStates);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result;
        if (!result) {
          return;
        }
        const maxSize = 1 * 1024 * 1024; // 1 MB in bytes

        if (file.size > maxSize) {
          toast.warning('File size must be below 1 MB.');
          e.target.value = '';
          return;
        }

        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;

          console.log(width, height, width / height);

          if (width / height >= 1.7 && width / height <= 2) {
            setSelectedFile(file);
            setImagePreview(result as string); // Set the image preview URL
          } else {
            toast.error('Please upload an image with a 16:9 aspect ratio.');
            setSelectedFile(null);
            setImagePreview(null);
          }
        };

        img.src = result as string; // Set image source to the data URL
      };

      reader.readAsDataURL(file);
    }
  };

  // const handleUpload = async () => {
  //   if (!selectedFile) return;
  //   setUploading(true);

  //   const formData = new FormData();
  //   formData.append('file', selectedFile);
  //   formData.append('articleId', articleId);

  //   try {
  //     await api.post('/article/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     setSelectedFile(null);
  //     toast.success('Article image uploaded successfully');
  //   } catch (err) {
  //     console.error('Error uploading image:', err);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <label
            className="text-gray-1 mb-2 block text-sm font-medium dark:text-white tablet:text-lg"
            htmlFor="file_input"
          >
            Upload Article Image (16:9 aspect ratio)
          </label>
          <input
            className="dark:placeholder-#9ca3af[#9ca3af block w-full cursor-pointer rounded-lg border border-[#d1d5db] bg-[#f9fafb] text-sm text-[#111827] focus:outline-none dark:border-[#4b5563] dark:bg-[#374151] dark:text-[#9ca3af] tablet:text-lg"
            id="file_input"
            type="file"
            accept=".jpg, .jpeg, .png, .webp"
            onChange={handleFileChange}
          />
          <p className="text-gray-1 mb-2 block text-sm font-medium dark:text-white tablet:text-lg">
            PNG, JPG, JPEG or Webp.
          </p>
        </div>

        {/* Display the image preview if available */}
        {imagePreview ? (
          <div>
            <img src={imagePreview} alt="Selected article image" className="max-w-xs rounded-lg shadow-md" />
          </div>
        ) : (
          getSeldonDataState?.seoImage && (
            <div>
              <img
                src={getSeldonDataState?.seoImage}
                alt="Selected article image"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )
        )}
      </div>
    </>
  );
}
