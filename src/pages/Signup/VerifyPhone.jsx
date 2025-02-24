import { useState } from 'react';
import AddCellPhonePopup from '../../components/dialogue-boxes/AddCellPhonePopup';

const VerifyPhone = () => {
  const [isPopup, setIsPopup] = useState(true);

  const handleClose = () => setIsPopup(false);

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white px-4 py-12">
      <AddCellPhonePopup
        isPopup={isPopup}
        setIsPopup={setIsPopup}
        title="Phone Number"
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`}
        selectedBadge={'cell-phone'}
        handleClose={handleClose}
        type={'cell-phone'}
        verification={true}
      />
    </div>
  );
};

export default VerifyPhone;
