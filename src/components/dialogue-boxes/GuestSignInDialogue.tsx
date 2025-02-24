import { useSelector } from 'react-redux';
import Signin from '../../pages/Signin';
import PopUp from '../ui/PopUp';
import CredentialLogin from '../../pages/Signin/components/CredentialLogin';

type GuestSignUpDialogueProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
};

export default function GuestSignInDialogue({ handleClose, modalVisible, title, image }: GuestSignUpDialogueProps) {
  const credentialLogin = useSelector((state: any) => state.extras.credentialLogin);

  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      customStyle=""
      customClasses=""
      closeIcon=""
      isBackground=""
      remove=""
      autoSize=""
    >
      {credentialLogin ? <CredentialLogin /> : <Signin />}
    </PopUp>
  );
}
