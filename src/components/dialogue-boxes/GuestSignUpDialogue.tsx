import { useSelector } from 'react-redux';
import Signup from '../../pages/Signup';
import PopUp from '../ui/PopUp';
import CredentialRegister from '../../pages/Signup/components/CredentialRegister';

type GuestSignUpDialogueProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
};

export default function GuestSignUpDialogue({ handleClose, modalVisible, title, image }: GuestSignUpDialogueProps) {
  const credentialRegister = useSelector((state: any) => state.extras.credentialRegister);

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
      {credentialRegister ? <CredentialRegister /> : <Signup allowSignUp={true} />}
    </PopUp>
  );
}
