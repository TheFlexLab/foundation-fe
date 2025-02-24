import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner, FaCamera } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import showToast from '../ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../services/api/Axios';
import { useState, useRef, useEffect } from 'react';

/**************************** Section Identiy Badge ****************************/
// Descriptions for each step
const stepDescriptions = [
  'Step 1: Upload the front image of your identity card.',
  'Step 2: Upload the back image of your identity card.',
  'Step 3: Upload a face video or record it live.',
  'Step 4: Review and submit your identity for verification. (Please confirm the following details before submitting)',
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

const SubscriptionBadgesPopup = ({
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
  const queryClient = useQueryClient();

  // Local states for managing the process
  const [currentStep, setCurrentStep] = useState(1);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

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
    setLoading(false);
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

  // Handle file upload (front, back images)
  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // Handle the form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (frontImage) formData.append('frontImage', frontImage);
      if (backImage) formData.append('backImage', backImage);
      if (video) formData.append('video', video);
      formData.append('uuid', persistedUserInfo.uuid);

      const response = await api.post(`/verifyIdentity`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        showToast('success', 'Badge added successfully');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Submission failed');
    }
    setLoading(false);
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
        <Button variant="submit" onClick={goToNextStep} disabled={isNextStepDisabled()}>
          Next Step
        </Button>
      ) : (
        <Button variant="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? <FaSpinner className="animate-spin" /> : 'Submit'}
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
      {type === 'identity' && (
        <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
          <div className="relative flex items-center justify-center overflow-hidden">
            <div
              className={`transform transition-transform duration-500 -translate-x-${(currentStep - 1) * 100}% flex w-full`}
            >
              {/* Step Content */}
              <div className="flex min-w-full flex-col space-y-4 p-3 tablet:px-10 tablet:py-5">
                <p className="summary-text">{stepDescriptions[currentStep - 1]}</p>

                {/* Step 1: Front Image Upload */}
                {currentStep === 1 && (
                  <>
                    <FileUploadButton
                      label="Upload the Front Side of Your Identity Card"
                      onChange={(e) => handleImageUpload(e, setFrontImage)}
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
                      onChange={(e) => handleImageUpload(e, setBackImage)}
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
          </div>
        </PopUp>
      )}
    </>
  );
};

export default SubscriptionBadgesPopup;
