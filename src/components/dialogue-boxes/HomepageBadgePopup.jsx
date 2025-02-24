import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import PopUp from '../ui/PopUp';
import BadgeRemovePopup from './badgeRemovePopup';
import useAddDomainBadge from '../../services/mutations/verification-adges';
import { moderationRating } from '../../services/api/questsApi';
import { toast } from 'sonner';
import ProgressBar from '../ProgressBar';
import ImageCropper from '../ImageCropper';
import { compressImageFileService } from '../../services/imageProcessing';

const HomepageBadgePopup = ({
  isPopup,
  setIsPopup,
  title,
  logo,
  edit,
  setIsPersonalPopup,
  handleSkip,
  onboarding,
  progress,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [domainBadge, setDomainBadge] = useState({
    title: '',
    domain: '',
    description: '',
    image: [],
    coordinates: [],
  });
  const [prevState, setPrevState] = useState({
    title: '',
    domain: '',
    description: '',
    image: [],
    coordinates: [],
  });
  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [changeCrop, setChangeCrop] = useState(false);

  const handleClose = () => setIsPopup(false);
  const handleBadgesClose = () => setModalVisible(false);

  const { mutateAsync: addDomainBadge } = useAddDomainBadge(
    domainBadge,
    edit,
    setLoading,
    handleClose,
    onboarding,
    handleSkip,
    prevState
  );

  const checkDomainBadge = () => {
    return persistedUserInfo?.badges?.some((badge) => !!badge?.domain) || false;
  };

  useEffect(() => {
    if (checkDomainBadge()) {
      const domainBadge = persistedUserInfo?.badges.find((badge) => badge?.domain);

      const image = [
        domainBadge?.domain?.s3Urls[0], // 1:1 image
        domainBadge?.domain?.s3Urls[1], // 16:9 image
        domainBadge?.domain?.s3Urls[2], // original image again
      ];

      setDomainBadge({
        title: domainBadge?.domain?.title,
        domain: domainBadge?.domain?.name,
        description: domainBadge?.domain?.description,
        image: image,
        coordinates: domainBadge?.domain?.coordinates,
      });
      setPrevState({
        title: domainBadge?.domain?.title,
        domain: domainBadge?.domain?.name,
        description: domainBadge?.domain?.description,
        image: image,
        coordinates: domainBadge?.domain?.coordinates,
      });
    }
  }, [persistedUserInfo]);

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const validateDomainInput = (input) => {
    const isValidPattern = /^[a-z0-9-]*$/.test(input);
    const isWithinLimit = input.length <= 63;

    return isValidPattern && isWithinLimit;
  };

  const handleDomainChange = (e) => {
    const caret = e.target.selectionStart;
    const element = e.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    const input = e.target.value;

    if (validateDomainInput(input)) {
      setDomainBadge({ ...domainBadge, domain: input });
    }
  };

  const handleDomainInputBlur = async () => {
    if (!domainBadge.domain.trim()) {
      return;
    }

    // Clean and validate domain
    const cleanedDomain = domainBadge.domain.trim().replace(/^-+|-+$/g, '');
    if (!/^[a-zA-Z0-9.-]+$/.test(cleanedDomain)) {
      setDomainBadge({ ...domainBadge, domain: '' });
      return;
    }

    setDomainBadge({ ...domainBadge, domain: cleanedDomain });

    try {
      const moderationRatingResult = await moderationRating({
        validatedQuestion: cleanedDomain,
      });

      if (moderationRatingResult.moderationRatingCount !== 0) {
        toast.warning('Domain not allowed');
        setDomainBadge((prevBadge) => ({
          ...prevBadge,
          domain: '',
        }));
        return;
      }
    } catch (error) {
      console.error('Error checking moderation rating:', error);
    }
  };

  const checkHollow = () => {
    if (edit) {
      if (JSON.stringify(prevState) === JSON.stringify(domainBadge)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        domainBadge.title === '' ||
        domainBadge.domain === '' ||
        domainBadge.description === '' ||
        domainBadge.image?.length == 0 ||
        (domainBadge.image[0] &&
          typeof domainBadge.image[0] === 'string' &&
          domainBadge.image[0].startsWith('blob:')) ||
        (domainBadge.image[1] && typeof domainBadge.image[1] === 'string' && domainBadge.image[1].startsWith('blob:'))
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  useEffect(() => {
    checkHollow();
  }, [domainBadge.title, domainBadge.domain, domainBadge.description, domainBadge.image]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Check if the file size exceeds 5MB
    if (file.size > 8 * 1024 * 1024) {
      toast.warning('File size is too large. Please upload a file less than 5MB.');
      return;
    }

    // Create an Image element to read the dimensions
    const img = new Image();
    const imageURL = URL.createObjectURL(file);

    img.src = imageURL;

    // Wait for the image to load and get its dimensions
    img.onload = () => {
      // Once the image is loaded, get its width and height
      const width = img.width;
      const height = img.height;
      setImageLoading(true);

      // Call the compression service
      compressImageFileService(file, width, height)
        .then(({ compressedFile, compressedImageURL }) => {
          // Set compressed images
          setDomainBadge({
            ...domainBadge,
            image: [compressedImageURL, compressedImageURL, compressedImageURL],
            coordinates: [0, 0, 0, 0],
          });

          setPrevState({
            ...domainBadge,
            image: [compressedImageURL, compressedImageURL, compressedImageURL],
            coordinates: [0, 0, 0, 0],
          });

          setImageLoading(false);

          // Optionally, upload compressed file directly here
          // uploadToS3(compressedFile);
        })
        .catch((error) => {
          console.error('Image compression failed:', error);
          toast.error('Image compression failed. Please try again.');
        });
    };

    img.onerror = () => {
      console.error('Error loading the image');
      toast.error('Failed to load the image.');
    };
  };

  const handleCropComplete = async (blob, coordinates) => {
    if (blob) {
      setDomainBadge((prev) => {
        const updatedImages = [...prev.image];
        updatedImages[0] = blob;

        const updatedCoordinates = Array.isArray(prev.coordinates) ? [...prev.coordinates] : [];
        updatedCoordinates[0] = coordinates;

        return {
          ...prev,
          image: updatedImages,
          coordinates: updatedCoordinates,
        };
      });
    } else {
      console.error('Crop failed or returned null Blob');
    }
  };

  const handleCropComplete2 = async (blob, coordinates) => {
    if (blob) {
      setDomainBadge((prev) => {
        const updatedImages = [...prev.image];
        updatedImages[1] = blob;

        const updatedCoordinates = Array.isArray(prev.coordinates) ? [...prev.coordinates] : [];
        updatedCoordinates[1] = coordinates;

        return {
          ...prev,
          image: updatedImages,
          coordinates: updatedCoordinates,
        };
      });
    } else {
      console.error('Crop failed or returned null Blob');
    }
  };

  const checkFinishHollow = () => {
    const isZeroCoordinates = (coordinates) => coordinates.length === 4 && coordinates.every((value) => value === 0);

    // 1. If both are [0, 0, 0, 0], return true
    if (isZeroCoordinates(prevState.coordinates) && isZeroCoordinates(domainBadge.coordinates)) {
      return true;
    }

    // 2. Ensure domainBadge.coordinates[0] or domainBadge.coordinates[1] are not [0, 0]
    if (domainBadge.coordinates[0] === 0 || domainBadge.coordinates[1] === 0) {
      return true;
    }

    // 3. Check if prevState.coordinates and domainBadge.coordinates are identical, return true if identical
    const arraysAreEqual = (arr1, arr2) =>
      arr1.length === arr2.length && arr1.every((val, index) => JSON.stringify(val) === JSON.stringify(arr2[index]));

    if (arraysAreEqual(prevState.coordinates, domainBadge.coordinates)) {
      return true; // Identical arrays, return true
    }

    // Default return if no condition is met
    return false;
  };

  useEffect(() => {
    if (changeCrop) {
      const timeoutId = setTimeout(() => {
        const selectedButton = document.getElementById('finish-button');
        if (selectedButton) {
          selectedButton.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Delay in milliseconds (e.g., 500ms)

      // Cleanup timeout when component unmounts or `changeCrop` changes
      return () => clearTimeout(timeoutId);
    }
  }, [changeCrop]);

  return (
    <>
      {modalVisible && (
        <BadgeRemovePopup
          handleClose={handleBadgesClose}
          modalVisible={modalVisible}
          title={deleteModalState?.title}
          image={deleteModalState?.image}
          type={deleteModalState?.type}
          badgeType={deleteModalState?.badgeType}
          setIsPersonalPopup={setIsPersonalPopup}
          setIsLoading={setRemoveLoading}
          loading={RemoveLoading}
        />
      )}
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo} customClasses={'overflow-y-auto'}>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="summary-text">
            Your Home Page is the hub for connecting with your audience. Share posts, collections and news easily with
            your audience.
          </h1>
          <div>
            <p className="text-gray-1 mb-1 text-[9.28px] font-medium leading-[11.23px] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Domain
            </p>
            <div className="relative inline-block w-full">
              <input
                type="text"
                value={domainBadge.domain}
                onChange={handleDomainChange}
                onBlur={handleDomainInputBlur}
                className={`verification_badge_input ${edit ? (domainBadge.domain ? '' : 'caret-hidden') : ''}`}
                placeholder="Enter domain"
              />
              {/* Display the suffix next to the input */}
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[9.28px] text-gray-500 dark:text-[#f1f1f1] tablet:text-[20px]">
                .on.foundation
              </span>
            </div>
            <p className="text-[9.28px] tablet:text-[20px]">Characters Remaining: {63 - domainBadge.domain.length}</p>
          </div>
          <div>
            <p className="text-gray-1 mb-1 text-[9.28px] font-medium leading-[11.23px] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Name / Organization
            </p>
            <input
              type="text"
              value={domainBadge.title}
              onChange={(e) => {
                setDomainBadge({ ...domainBadge, title: e.target.value });
              }}
              placeholder="Title"
              className={`verification_badge_input ${edit ? (domainBadge.title ? '' : 'caret-hidden') : ''}`}
            />
          </div>
          <div>
            <p className="text-gray-1 mb-1 text-[9.28px] font-medium leading-[11.23px] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Description
            </p>
            <TextareaAutosize
              id="input-2"
              aria-label="multiple choice question"
              placeholder="Enter description here"
              value={domainBadge.description}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setDomainBadge({ ...domainBadge, description: e.target.value });
                }
              }}
              tabIndex={2}
              minRows={4}
              // onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value)}
              // onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(2, 'Enter'))}
              className={`verification_badge_input resize-none ${edit ? (domainBadge.description ? '' : 'caret-hidden') : ''}`}
            />
            <p className="text-[9.28px] tablet:text-[20px]">
              Characters Remaining: {300 - domainBadge.description.length}
            </p>
            <p className="text-[9.28px] tablet:text-[20px]">For best SEO results, use 100+ characters</p>
          </div>
          <div>
            <p className="text-gray-1 mb-1 text-[9.28px] font-medium leading-[11.23px] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Image
            </p>
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className={`verification_badge_input relative resize-none py-5 ${edit ? (domainBadge.image ? '' : 'caret-hidden') : ''} `}
              >
                <div className="flex flex-col items-center justify-center">
                  {imageLoading === true ? (
                    <FaSpinner className="animate-spin text-[#EAEAEA]" />
                  ) : (
                    <>
                      <p>Upload Your Image</p>
                      <p className="max-w-lg text-center text-[10px] font-normal tablet:text-[16px]">
                        Foundation wants your SEO to look its best. For best results upload an image that is 1280x720
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="absolute left-0 top-0 hidden w-full"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
          {/* Image Cropper */}
          {domainBadge.image.length > 0 &&
            (!changeCrop && !prevState.image[0]?.startsWith('blob:') ? (
              <div className="space-y-6">
                <div className="space-y-1 tablet:space-y-3">
                  <p className="text-gray-1 text-[9.28px] font-medium leading-[11.23px] tablet:text-[20px] tablet:leading-[20px]">
                    SEO Image:
                  </p>
                  <img
                    src={
                      domainBadge.image[0] instanceof Blob
                        ? URL.createObjectURL(domainBadge.image[0])
                        : prevState.image[1]
                    }
                    alt="1st"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <div className="space-y-1 tablet:space-y-3">
                  <p className="text-gray-1 text-[9.28px] font-medium leading-[11.23px] tablet:text-[20px] tablet:leading-[20px]">
                    Profile Image:
                  </p>
                  <div className="flex justify-center">
                    <img
                      src={
                        domainBadge.image[1] instanceof Blob
                          ? URL.createObjectURL(domainBadge.image[1])
                          : prevState.image[0]
                      }
                      alt="1st"
                      className="size-[150px] rounded-full tablet:size-[320px]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              domainBadge.image?.length > 0 && (
                <div className="space-y-6">
                  <div className="space-y-1 tablet:space-y-3">
                    <p className="text-gray-1 text-[9.28px] font-medium leading-[11.23px] tablet:text-[20px] tablet:leading-[20px]">
                      SEO Image:
                    </p>
                    <ImageCropper
                      type="16:9"
                      onCropComplete={handleCropComplete}
                      image={domainBadge.image[2]}
                      coordinates={domainBadge.coordinates[0]}
                    />
                  </div>
                  <div className="space-y-1 tablet:space-y-3">
                    <p className="text-gray-1 text-[9.28px] font-medium leading-[11.23px] tablet:text-[20px] tablet:leading-[20px]">
                      Profile Image:
                    </p>
                    <ImageCropper
                      type="rounded"
                      onCropComplete={handleCropComplete2}
                      image={domainBadge.image[2]}
                      coordinates={domainBadge.coordinates[1]}
                    />
                  </div>
                </div>
              )
            ))}
          {changeCrop ? (
            <div className="flex items-center justify-end gap-[15px] tablet:gap-[35px]">
              <Button
                variant="cancel"
                onClick={() => {
                  setDomainBadge(prevState);
                  setChangeCrop(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={checkFinishHollow() ? 'submit-hollow' : 'submit'}
                disabled={checkFinishHollow()}
                onClick={() => {
                  setChangeCrop(false);
                }}
              >
                Finish
              </Button>
            </div>
          ) : (
            <>
              <div>
                {!prevState.image[0]?.startsWith('blob:') && domainBadge.image.length > 0 ? (
                  <Button
                    variant="submit"
                    onClick={() => {
                      setChangeCrop(true);
                    }}
                  >
                    Change Crop
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="flex justify-end gap-[15px] tablet:gap-[35px]">
                {edit && (
                  <Button
                    variant="badge-remove"
                    onClick={() => {
                      handleRemoveBadgePopup({
                        title: 'Domain',
                        type: 'domainBadge',
                        badgeType: 'homepage',
                        image: logo,
                      });
                    }}
                  >
                    {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove Badge'}
                  </Button>
                )}
                <Button
                  variant={checkHollow() ? 'submit-hollow' : 'submit'}
                  onClick={() => {
                    addDomainBadge();
                  }}
                  disabled={checkHollow()}
                >
                  {loading === true ? (
                    <FaSpinner className="animate-spin text-[#EAEAEA]" />
                  ) : edit ? (
                    'Update Badge'
                  ) : (
                    'Add Badge'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
        <div id="finish-button"></div>
        {onboarding && <ProgressBar handleSkip={handleSkip} />}
      </PopUp>
    </>
  );
};

export default HomepageBadgePopup;
