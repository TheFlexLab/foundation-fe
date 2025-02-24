import { useSelector } from 'react-redux';
import PopUp from '../ui/PopUp';
import { setFDXCall } from '../../services/api/homepageApis';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import showToast from '../ui/Toast';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

function SetFDXPopup({ isPopup, title, logo, handleClose }) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [fdx, setFDX] = useState(0); // Initial default value for FDX
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFDX(persistedUserInfo?.messageByDomainFDX ?? 0);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const params = {
      uuid: persistedUserInfo?.uuid,
      messageByDomainFDX: fdx, // Pass the updated FDX value
    };
    try {
      await setFDXCall(params); // API call to set FDX
      queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
    } catch (error) {
    } finally {
      setLoading(false);
      handleClose(); // Close popup after submission
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    // Allow only digits (0–9)
    if (/^\d*$/.test(value)) {
      // Proceed with valid input
      setFDX(value);
    } else {
      // Ignore invalid input
      return;
    }
  };

  return (
    <>
      <PopUp logo={logo} title={title} open={isPopup} handleClose={handleClose}>
        <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
          <h1 className="text-[10px] font-medium leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
            Let's increase your FDX by getting messages
          </h1>
          {/* Input field for FDX */}
          <div className="mt-[10px]">
            <label htmlFor="fdxInput" className="text-gray-700 dark:text-gray-300 tablet:text-[16px]">
              Enter your FDX value:
            </label>
            <input
              id="fdxInput"
              type="text" // Set to "text" to allow validation logic
              value={fdx} // Bind input value to `fdx`
              onChange={handleInputChange} // Validate and sanitize input on change
              className="verification_badge_input"
            />
          </div>
          {/* Buttons */}
          <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
            <Button
              variant={'submit'}
              onClick={handleSubmit}
              disabled={loading || !fdx} // Disable button if loading or fdx is empty
            >
              {loading ? (
                <FaSpinner className="animate-spin text-[#EAEAEA]" />
              ) : persistedUserInfo?.messageByDomainFDX === 0 ? (
                'Submit'
              ) : (
                'Update'
              )}
            </Button>
            <Button variant={'cancel'} onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </PopUp>
    </>
  );
}

export default SetFDXPopup;
