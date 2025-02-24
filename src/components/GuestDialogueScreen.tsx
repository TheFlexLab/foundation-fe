import { useDispatch, useSelector } from 'react-redux';
import { setGuestSignUpDialogue, setGuestSignInDialogue } from '../features/extras/extrasSlice';
import GuestSignUpDialogue from './dialogue-boxes/GuestSignUpDialogue';
import GuestSignInDialogue from './dialogue-boxes/GuestSignInDialogue';

export default function GuestDialogueScreen() {
  const dispatch = useDispatch();
  const guestSignUpDialogue = useSelector((state: any) => state.extras.guestSignUpDialogue);
  const guestSignInDialogue = useSelector((state: any) => state.extras.guestSignInDialogue);

  const handleClose = () => {
    dispatch(setGuestSignUpDialogue(false));
  };

  const handleSignInClose = () => {
    dispatch(setGuestSignInDialogue(false));
  };

  return (
    <>
      {guestSignUpDialogue && (
        <GuestSignUpDialogue
          handleClose={handleClose}
          modalVisible={guestSignUpDialogue}
          title={'Create an Account'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/signup-icon.svg`}
        />
      )}
      {guestSignInDialogue && (
        <GuestSignInDialogue
          handleClose={handleSignInClose}
          modalVisible={guestSignInDialogue}
          title={'Sign in'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/signup-icon.svg`}
        />
      )}
    </>
  );
}
