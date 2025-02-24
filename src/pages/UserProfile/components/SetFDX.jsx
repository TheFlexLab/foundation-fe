import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import SetFDXPopup from '../../../components/dialogue-boxes/SetFDXPopup';

function SetFDX() {
  const [isPopup, setPopup] = useState(false);

  const handleClose = () => {
    setPopup(false);
  };

  return (
    <>
      <Button variant="submit" onClick={() => setPopup(true)}>
        Manage Messaging
      </Button>
      {isPopup && (
        <SetFDXPopup
          isPopup={isPopup}
          title={'Manage Messaging'}
          logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`}
          handleClose={handleClose}
        />
      )}
    </>
  );
}

export default SetFDX;
