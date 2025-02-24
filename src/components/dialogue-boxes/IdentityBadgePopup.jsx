import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner, FaCamera } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import showToast from '../ui/Toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../../services/api/Axios';
import { useState, useRef, useEffect } from 'react';
import { useVerifyIdentity } from '../../services/api/profile';
import BadgeRemovePopup from './badgeRemovePopup';
import MultiStepCounter from '../ui/MultiStepCounter';

/**************************** Section Identiy Badge ****************************/
// Descriptions for each step
const stepDescriptions = [
  'Upload the front image of your identity card.',
  'Upload the back image of your identity card.',
  'Upload a face video or record it live.',
  'Review and submit your identity for verification. (Please confirm the following details before submitting)',
];

// Helper component for file upload button
const FileUploadButton = ({ label, onChange }) => (
  <div>
    <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
      Image
    </p>
    <div className="flex w-full items-center justify-center">
      <label htmlFor="dropzone-file" className={`verification_badge_input relative resize-none py-5`}>
        <div className="flex flex-col items-center justify-center">
          <p>{label}</p>
        </div>
        <input id="dropzone-file" type="file" className="absolute left-0 top-0 hidden w-full" onChange={onChange} />
      </label>
    </div>
  </div>
);
/*******************************************************************************/

const IdentityBadgePopup = ({
  isPopup,
  setIsPopup,
  type,
  title,
  logo,
  placeholder,
  edit,
  fetchUser,
  setIsPersonalPopup,
  handleSkip,
  onboarding,
  progress,
}) => {
  /**************************** Section Identiy Badge ****************************/
  // Redux states
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const identityBadge = edit && persistedUserInfo?.badges.find((badge) => badge.personal?.identity)?.personal?.identity;

  const queryClient = useQueryClient();

  // Local states for managing the process
  const [currentStep, setCurrentStep] = useState(1);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [addIdentity, setAddIdentity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [RemoveLoading, setRemoveLoading] = useState(false);

  // Close popup handler
  const handleClose = () => setIsPopup(false);

  // Reset state when popup is closed
  useEffect(() => {
    if (!isPopup) resetState();
  }, [isPopup]);

  // Reset form state
  const resetState = () => {
    setCurrentStep(1);
    setFrontImage(null);
    setBackImage(null);
    setVideo(null);
    setRecording(false);
    recordedChunks.current = [];
  };

  // Step navigation handlers
  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPreviousStep = () => setCurrentStep((prev) => prev - 1);

  // Handle video recording start
  const handleStartRecording = async () => {
    resetVideo(); // Clear previous video if any
    setRecording(true);
    setCountdown(5); // Reset countdown to 5 seconds

    // Request video/audio streams
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);

    // Handle video data available
    mediaRecorderRef.current.ondataavailable = (e) => recordedChunks.current.push(e.data);

    // When recording stops, save the video as a file
    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(recordedChunks.current, { type: 'video/mp4' });
      const videoFile = new File([videoBlob], 'video.mp4', { type: 'video/mp4' });
      setVideo(videoFile); // Store the video file
      setRecording(false);
    };

    mediaRecorderRef.current.start();

    // Countdown timer logic
    startCountdown();
  };

  // Handle video recording stop
  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // Start countdown logic
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleStopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Function to check if the image is blurry
  const checkIfBlurry = (imageData) => {
    const width = imageData.width;
    const height = imageData.height;
    let sumLaplacian = 0;
    let count = 0;

    // Loop through the image data to apply Laplacian filter
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4; // RGBA index

        // Pixel values: Current, Right, Bottom, Diagonal (Bottom-Right)
        const currentPixel = imageData.data[idx];
        const rightPixel = imageData.data[idx + 4];
        const bottomPixel = imageData.data[idx + width * 4];
        const bottomRightPixel = imageData.data[idx + (width + 1) * 4];

        // Compute the Laplacian (sum of absolute differences in all directions)
        const laplacian =
          Math.abs(currentPixel - rightPixel) +
          Math.abs(currentPixel - bottomPixel) +
          Math.abs(currentPixel - bottomRightPixel);

        sumLaplacian += laplacian;
        count++;
      }
    }

    // Calculate the average Laplacian value (variance proxy)
    const averageLaplacian = sumLaplacian / count;

    // Adjust threshold based on experiments
    const threshold = 11; // Inc for more sensitive than before
    return averageLaplacian < threshold;
  };

  const handleImageUpload = async (e, setImage, type) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();

      reader.onload = async () => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (checkIfBlurry(imageData)) {
            showToast('error', 'blurryImage');
            setLoading(false);
            return;
          }

          // Now use the file in FormData
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', type);

          try {
            const response = await api.post('/app/detectDocument', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (response.status === 200) {
              setImage(file);
              showToast('success', 'verifiedIdentity');
              goToNextStep();
            } else if (response.status === 403) {
              showToast('error', 'unVerifiedIdentity');
            }
          } catch (error) {
            console.error('Error detecting labels:', error);
            showToast('error', 'documentDetectionError');
          } finally {
            setLoading(false);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Use the custom hook for identity verification
  const {
    mutateAsync: verifyIdentity,
    isLoading,
    isError,
    isSuccess,
  } = useVerifyIdentity({
    frontImage,
    backImage,
    video,
    persistedUserInfo,
    handleClose,
  });

  // Handle identity verification submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await verifyIdentity();
      setIsVerified(true);
      setAddIdentity(response);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Verification failed:', error);
      showToast('error', 'verificationFailed');
      setIsSubmitting(false);
    }
  };

  // Handle adding badge after verification
  const handleAddBadge = async () => {
    setIsAdding(true); // Start loading for adding the badge
    try {
      let addIdentityResponse;

      if (persistedUserInfo?.isPasswordEncryption) {
        if (!localStorage.getItem('legacyHash')) throw new Error('Now legacyHash found in localStorage!');
        // Call addIdentity API with the data from verifyIdentity
        addIdentityResponse = await api.post('/addIdentityBadge', {
          ...addIdentity,
          uuid: persistedUserInfo?.uuid,
          infoc: localStorage.getItem('legacyHash'),
        });
      } else {
        // Call addIdentity API with the data from verifyIdentity
        addIdentityResponse = await api.post('/addIdentityBadge', {
          ...addIdentity,
          uuid: persistedUserInfo?.uuid,
        });
      }

      if (addIdentityResponse.status === 200) {
        // On success, show success message and close the popup
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo?.uuid] });
        handleClose(); // Close the modal or perform any other action
      } else {
        // Handle error from the addIdentity API
        showToast('error', 'errorAddingBadge');
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Failed to add badge:', error);
      showToast('error', 'errorAddingBadge');
      setIsAdding(false);
    } finally {
      setIsAdding(false); // End loading for adding the badge
    }
  };

  // Render step navigation buttons
  const renderNavigationButtons = () => (
    <div className={`flex w-full ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
      {currentStep > 1 && (
        <Button variant="submit" onClick={goToPreviousStep}>
          Previous Step
        </Button>
      )}
      {currentStep < 4 ? (
        loading ? (
          <Button variant="submit">
            <FaSpinner className="animate-spin" />
          </Button>
        ) : (
          <Button variant="submit" onClick={goToNextStep} disabled={isNextStepDisabled()}>
            Next Step
          </Button>
        )
      ) : isVerified ? (
        isAdding ? (
          <Button variant="submit">
            <FaSpinner className="animate-spin" />
          </Button>
        ) : (
          <Button variant="submit" onClick={addIdentity && handleAddBadge} disabled={isAdding}>
            Add Badge
          </Button>
        )
      ) : isSubmitting ? (
        <Button variant="submit">
          <FaSpinner className="animate-spin" />
        </Button>
      ) : (
        <Button variant="submit" onClick={handleSubmit} disabled={isSubmitting}>
          Verify
        </Button>
      )}
    </div>
  );

  // Check if the Next Step button should be disabled based on current step
  const isNextStepDisabled = () => {
    return (currentStep === 1 && !frontImage) || (currentStep === 2 && !backImage) || (currentStep === 3 && !video);
  };

  // Reset video data when starting a new recording
  const resetVideo = () => {
    if (video) setVideo(null); // Clear previous video
    recordedChunks.current = []; // Reset video chunks
  };
  /*******************************************************************************/

  return (
    <>
      {modalVisible && (
        <BadgeRemovePopup
          handleClose={() => {
            setModalVisible(false);
            handleClose();
          }}
          modalVisible={modalVisible}
          title={title}
          image={logo}
          type={type}
          badgeType={type}
          fetchUser={fetchUser}
          setIsPersonalPopup={setIsPersonalPopup}
          setIsLoading={setRemoveLoading}
          loading={RemoveLoading}
        />
      )}
      {type === 'identity' && (
        <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
          <div className="relative flex flex-col items-center justify-center overflow-y-auto">
            {!edit && (
              <div
                className={`transform transition-transform duration-500 -translate-x-${(currentStep - 1) * 100}% flex w-full`}
              >
                {/* Step Content */}
                <div className="flex min-w-full flex-col space-y-4 p-3 tablet:px-10 tablet:py-5">
                  <h1 className="text-[12px] font-medium leading-[13.56px] text-gray-1 dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
                    Strengthen your verification by showcasing your professional certifications and demonstrating your
                    expertise.
                  </h1>
                  <div>
                    <MultiStepCounter steps={['1', '2', '3', '4']} currentStep={currentStep - 1} isLabel={false} />
                    <p className="summary-text text-center">{stepDescriptions[currentStep - 1]}</p>
                  </div>

                  {/* Step 1: Front Image Upload */}
                  {currentStep === 1 && (
                    <>
                      <FileUploadButton
                        label="Upload the Front Side of Your Identity Card"
                        onChange={(e) => handleImageUpload(e, setFrontImage, 'front')}
                      />
                      {frontImage && (
                        <img
                          src={URL.createObjectURL(frontImage)}
                          alt="Front of ID"
                          className="mt-4 aspect-video max-h-40 w-full object-contain tablet:max-h-80"
                        />
                      )}
                    </>
                  )}

                  {/* Step 2: Back Image Upload */}
                  {currentStep === 2 && (
                    <>
                      <FileUploadButton
                        label="Upload the Back Side of Your Identity Card"
                        onChange={(e) => handleImageUpload(e, setBackImage, 'back')}
                      />
                      {backImage && (
                        <img
                          src={URL.createObjectURL(backImage)}
                          alt="Back of ID"
                          className="mt-4 max-h-40 max-w-full object-contain tablet:max-h-80"
                        />
                      )}
                    </>
                  )}

                  {/* Step 3: Video Recording */}
                  {currentStep === 3 && (
                    <>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="submit"
                          onClick={handleStartRecording}
                          className="bg-green-500 hover:bg-green-600 w-fit min-w-fit rounded-lg px-4 py-2 text-white transition duration-200"
                          disabled={recording}
                        >
                          <FaCamera className="mr-2" />
                          {countdown > 0 ? `Record Video (${countdown}s)` : 'Record Video'}
                        </Button>
                      </div>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="mt-4 max-h-40 max-w-full tablet:max-h-80"
                        hidden={!recording}
                      />
                      {video && (
                        <video
                          src={URL.createObjectURL(video)}
                          controls
                          className="mt-4 max-h-40 max-w-full tablet:max-h-80"
                        />
                      )}
                    </>
                  )}

                  {/* Step 4: Confirmation */}
                  {currentStep === 4 && (
                    <>
                      <div>
                        <p className="summary-text">{stepDescriptions[0]}</p>
                        {frontImage && (
                          <img
                            src={URL.createObjectURL(frontImage)}
                            alt="Front of ID"
                            className="mt-4 aspect-video max-h-40 w-full object-contain tablet:max-h-80"
                          />
                        )}
                      </div>
                      <div>
                        <p className="summary-text">{stepDescriptions[1]}</p>
                        {backImage && (
                          <img
                            src={URL.createObjectURL(backImage)}
                            alt="Back of ID"
                            className="mt-4 max-h-40 w-full max-w-full object-contain tablet:max-h-80"
                          />
                        )}
                      </div>
                      <div>
                        <p className="summary-text">{stepDescriptions[2]}</p>
                        {video && (
                          <video
                            src={URL.createObjectURL(video)}
                            controls
                            className="mt-4 max-h-40 w-full max-w-full tablet:max-h-80"
                          />
                        )}
                      </div>
                    </>
                  )}

                  {/* Render Navigation Buttons */}
                  {renderNavigationButtons()}
                </div>
              </div>
            )}
            {/* Edit */}
            {edit && (
              <div className="flex min-w-full flex-col space-y-4 p-3 tablet:px-10 tablet:py-5">
                <p className="summary-text">Your identity information</p>
                {identityBadge &&
                  Object.entries(identityBadge).map(
                    ([key, value]) =>
                      value &&
                      value !== '' &&
                      key !== 'isExpired' && (
                        <div key={key} className="flex justify-between">
                          <span className="text-xs font-bold capitalize tablet:text-base">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="text-xs tablet:text-base">{value}</span>
                        </div>
                      )
                  )}
                <div className="flex justify-end">
                  <Button variant="badge-remove" onClick={() => setModalVisible(true)}>
                    {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove Badge'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopUp>
      )}
    </>
  );
};

export default IdentityBadgePopup;
